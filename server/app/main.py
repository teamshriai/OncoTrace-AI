import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api import routes_vcf
from .core import config

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")

app = FastAPI(
    title="OncoTrace VCF Analysis",
    description=(
        "Parses uploaded oncology-panel VCFs and annotates them against locally-hosted "
        "open-source databases. Early-stage research pipeline, not a diagnostic device."
    ),
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.include_router(routes_vcf.router, prefix="/api/v1")
