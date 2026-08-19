import logging
import hashlib
import os
import tempfile

from fastapi import APIRouter, File, Form, UploadFile
from fastapi.responses import JSONResponse
from starlette.concurrency import run_in_threadpool

from ..core import config
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


def _error(status: int, kind: str, message: str, detail: dict | None = None) -> JSONResponse:
    body = {"error_kind": kind, "message": message}
    if detail:
        body["detail"] = detail
    return JSONResponse(status_code=status, content=body)


@router.get("/health")
def health():
    return {"status": "ok", "resources": config.resource_status()}


async def _spool_upload(upload: UploadFile, suffix: str) -> tuple[str, int, str]:
    """Streams an upload to a temp file, returning (path, bytes, sha256_prefix)."""
    fd, tmp_path = tempfile.mkstemp(suffix=suffix, prefix="oncotrace-upload-")
    total = 0
    digest = hashlib.sha256()
    with os.fdopen(fd, "wb") as out:
        while chunk := await upload.read(_CHUNK):
            total += len(chunk)
            if total > config.MAX_UPLOAD_BYTES:
                out.close()
                raise ValueError(
                    f"File exceeds the {config.MAX_UPLOAD_BYTES // (1024 * 1024)} MB upload limit."
                )
            digest.update(chunk)
            out.write(chunk)
    return tmp_path, total, digest.hexdigest()[:16]


@router.post("/vcf/analyze", response_model=AnalysisResponse)
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
    except (NormalizationError, SnpEffError, ClinVarError) as exc:
        logger.exception("annotation stage failed")
        return _error(500, "annotation_failure", str(exc)[:500])
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
