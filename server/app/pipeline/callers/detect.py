from .base import UnsupportedCallerError
from .vardict import VarDictAdapter
from .mutect2 import Mutect2Adapter
from .strelka2 import Strelka2Adapter
from .dragen import DragenAdapter
from .generic import (
    ConvertedTableAdapter,
    FreeBayesAdapter,
    GenericAdapter,
    HaplotypeCallerAdapter,
    LoFreqAdapter,
    TorrentVariantCallerAdapter,
    VarScan2Adapter,
)

# Order matters: specific callers first, then the catch-all GenericAdapter.
# Adapters earlier in this list read caller-specific fields with known semantics;
# GenericAdapter falls back to VCF-spec-standard fields only.
SPECIFIC_ADAPTERS = [
    VarDictAdapter,
    Mutect2Adapter,
    Strelka2Adapter,
    DragenAdapter,
    FreeBayesAdapter,
    VarScan2Adapter,
    LoFreqAdapter,
    TorrentVariantCallerAdapter,
    HaplotypeCallerAdapter,
    ConvertedTableAdapter,
]

ADAPTERS = SPECIFIC_ADAPTERS + [GenericAdapter]

# Adapters whose field mapping has been checked against a real file from that
# caller. Everything else is reported to the client as unvalidated.
#
# ConvertedTableAdapter is included because it reads VCFs this service generated
# itself from MAF/tabular input -- that conversion is covered by tests
# (tests/test_readers.py) and its column mapping is reported in every response
# under meta.input_conversion.column_mapping, so it is verifiable rather than
# assumed. The Mutect2/Strelka2/DRAGEN adapters, by contrast, were written from
# published documentation with no real file to check against.
VALIDATED_ADAPTERS = {VarDictAdapter.name, ConvertedTableAdapter.name}


def detect_adapter(vcf, allow_generic: bool = True):
    """Picks an adapter from the ##source header / INFO-field fingerprinting.

    With allow_generic=False, an unrecognized caller raises instead of falling
    back -- useful for callers who would rather reject than accept a
    generically-interpreted file.
    """
    candidates = ADAPTERS if allow_generic else SPECIFIC_ADAPTERS
    for adapter in candidates:
        if adapter.matches(vcf):
            return adapter
    source_lines = [l for l in vcf.raw_header.splitlines() if l.startswith("##source")]
    hint = source_lines[0] if source_lines else "(no ##source header line found)"
    raise UnsupportedCallerError(hint)
