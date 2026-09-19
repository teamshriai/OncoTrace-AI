import asyncio
import logging
import hashlib
import os
import tempfile
import uuid

from fastapi import APIRouter, Depends, File, Form, UploadFile
from fastapi.responses import JSONResponse
from starlette.concurrency import run_in_threadpool

from ..core import config
from ..core.security import require_demo_auth
from ..pipeline.build_detection import BuildUnresolvedError, SUPPORTED_BUILDS
from ..pipeline.callers.base import UnsupportedCallerError
from ..pipeline.normalize import NormalizationError
from ..pipeline.annotate_snpeff import SnpEffError
from ..pipeline.annotate_clinvar import ClinVarError
from ..pipeline.readers import UnsupportedFormatError
from ..pipeline.validate import StructuralValidationError
from ..services.analysis_service import analyze_vcf, EmptyVariantSetError
from ..schema import AnalysisResponse

router = APIRouter()
logger = logging.getLogger("oncotrace.api")

_CHUNK = 1024 * 1024

# Caps concurrent analyses per worker process. Each one runs `java -Xmx4g`, so
# this is really a memory budget: keep (workers x this x 4GB) below host RAM.
_analysis_slots = asyncio.Semaphore(config.MAX_CONCURRENT_ANALYSES)


def _error(status: int, kind: str, message: str, detail: dict | None = None) -> JSONResponse:
    body = {"error_kind": kind, "message": message}
    if detail:
        body["detail"] = detail
    return JSONResponse(status_code=status, content=body)


@router.get("/health")
def health():
    return {"status": "ok", "resources": config.resource_status()}


async def _spool_upload(upload: UploadFile, suffix: str) -> tuple[str, int, str]:
    """Streams an upload to a temp file, returning (path, bytes, sha256_prefix).

    Cleans up its own temp file on failure: the caller only learns the path from
    the return value, so a partially-written file would otherwise be stranded on
    disk forever -- an oversize upload could leave MAX_UPLOAD_BYTES behind every
    time, which is a trivial way to fill the disk.
    """
    fd, tmp_path = tempfile.mkstemp(suffix=suffix, prefix="oncotrace-upload-")
    total = 0
    digest = hashlib.sha256()
    try:
        with os.fdopen(fd, "wb") as out:
            while chunk := await upload.read(_CHUNK):
                total += len(chunk)
                if total > config.MAX_UPLOAD_BYTES:
                    raise ValueError(
                        f"File exceeds the {config.MAX_UPLOAD_BYTES // (1024 * 1024)} MB upload limit."
                    )
                digest.update(chunk)
                out.write(chunk)
    except BaseException:
        try:
            os.unlink(tmp_path)
        except OSError:
            pass
        raise
    return tmp_path, total, digest.hexdigest()[:16]


# Guarded at the route rather than the router so /health stays reachable
# unauthenticated for nginx and uptime monitoring.
@router.post(
    "/vcf/analyze",
    response_model=AnalysisResponse,
    dependencies=[Depends(require_demo_auth)],
)
async def analyze(
    vcf_file: UploadFile = File(...),
    reference_build_hint: str | None = Form(None),
    sample_name: str | None = Form(None),
    panel_bed: UploadFile | None = File(None),
):
    if reference_build_hint and reference_build_hint not in SUPPORTED_BUILDS:
        return _error(
            400, "malformed_vcf",
            f"Unsupported reference_build_hint {reference_build_hint!r}. Expected one of {list(SUPPORTED_BUILDS)}.",
        )

    # Format is determined from file contents, not the extension -- a file named
    # .vcf is frequently gzip-compressed in practice, and MAF/TSV exports arrive
    # under many extensions.
    tmp_path = bed_path = None
    try:
        try:
            tmp_path, total, digest = await _spool_upload(vcf_file, ".upload")
        except ValueError as exc:
            return _error(413, "malformed_vcf", str(exc))

        if total == 0:
            return _error(400, "malformed_vcf", "Uploaded file is empty.")

        if panel_bed is not None and panel_bed.filename:
            try:
                bed_path, _, _ = await _spool_upload(panel_bed, ".bed")
            except ValueError as exc:
                return _error(413, "malformed_vcf", str(exc))

        # Log aggregate metadata and a content hash only -- never file contents,
        # since real patient data will eventually flow through this endpoint.
        logger.info("analyze request: bytes=%d sha256=%s", total, digest)

        # analyze_vcf is a long, blocking call (subprocess bcftools/SnpEff runs).
        # Off the event loop, so one slow analysis doesn't freeze every other
        # request this server is handling -- including /health.
        #
        # Gated by a semaphore because each analysis spawns `java -Xmx4g`: the
        # default threadpool would allow 40 concurrent runs per worker, i.e.
        # enough JVMs to OOM the host from a handful of simultaneous uploads.
        # Shedding load with a 503 is far better than the kernel picking a
        # victim process.
        if _analysis_slots.locked():
            logger.warning("analysis capacity reached; shedding request")
            return _error(
                503, "annotation_failure",
                "The analysis service is at capacity right now. Please try again in a few minutes.",
            )

        async with _analysis_slots:
            return await run_in_threadpool(
                analyze_vcf,
                tmp_path,
                vcf_file.filename or "uploaded.vcf",
                reference_build_hint,
                sample_name=sample_name,
                panel_bed_path=bed_path,
            )

    except UnsupportedFormatError as exc:
        return _error(400, "malformed_vcf", str(exc), exc.detail or None)
    except StructuralValidationError as exc:
        # Fail fast with a specific message rather than partially processing a
        # structurally invalid file.
        return _error(400, "malformed_vcf", str(exc), exc.detail or None)
    except UnsupportedCallerError as exc:
        return _error(
            400, "malformed_vcf",
            "This file's variant caller isn't recognized and generic reading is disabled on this server.",
            {"source_hint": exc.source_hint},
        )
    except EmptyVariantSetError:
        return _error(422, "malformed_vcf", "The file parsed correctly but contained no variant records.")
    except BuildUnresolvedError as exc:
        return _error(
            422, "reference_build_unresolved",
            "The reference genome build isn't stated in this file's header, and probing its coordinates against "
            "the local ClinVar databases didn't give a clear enough answer. Please resubmit specifying the build.",
            {"evidence": exc.heuristic_result, "supported_builds": list(SUPPORTED_BUILDS)},
        )
    except (NormalizationError, SnpEffError, ClinVarError):
        # The exception text embeds absolute server paths and raw bcftools/SnpEff
        # stderr, so it stays server-side. The client gets a correlation id it
        # can quote to support instead.
        incident = uuid.uuid4().hex[:12]
        logger.exception("annotation stage failed [incident=%s]", incident)
        return _error(
            500, "annotation_failure",
            "The file parsed correctly, but an annotation stage failed on our side. "
            "This isn't a problem with your file.",
            {"incident_id": incident},
        )
    except ValueError as exc:
        return _error(400, "malformed_vcf", str(exc)[:500])
    except Exception:
        logger.exception("unexpected analysis failure")
        return _error(500, "annotation_failure", "An unexpected error occurred while analyzing this file.")
    finally:
        for path in (tmp_path, bed_path):
            if path:
                try:
                    os.unlink(path)
                except OSError:
                    pass
