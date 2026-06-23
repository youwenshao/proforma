from __future__ import annotations

import os
from pathlib import Path
from typing import Literal

from pydantic import BaseModel


class ApiSettings(BaseModel):
    service_name: str = "proforma-api"
    api_version: str = "v1"
    artifacts_dir: Path = Path("artifacts")
    audit_log_path: Path = Path("artifacts/audit/prediction_requests.jsonl")
    estimate_store_dir: Path = Path("artifacts/estimates")
    quote_benchmarks_path: Path = Path("artifacts/reports/quote_benchmarks.json")
    quote_pack_storage_dir: Path = Path("artifacts/quote_packs")
    allow_scope_update_notes: bool = False
    model_serving_mode: Literal["auto", "fixture", "live"] = "auto"


def get_settings() -> ApiSettings:
    audit_log_path = os.environ.get("PROFORMA_AUDIT_LOG_PATH")
    artifacts_dir = os.environ.get("PROFORMA_ARTIFACTS_DIR")
    estimate_store_dir = os.environ.get("PROFORMA_ESTIMATE_STORE_DIR")
    quote_benchmarks_path = os.environ.get("PROFORMA_QUOTE_BENCHMARKS_PATH")
    quote_pack_storage_dir = os.environ.get("PROFORMA_QUOTE_PACK_STORAGE_DIR")
    model_serving_mode = os.environ.get("PROFORMA_MODEL_SERVING_MODE", "auto")
    return ApiSettings(
        artifacts_dir=Path(artifacts_dir) if artifacts_dir else Path("artifacts"),
        audit_log_path=Path(audit_log_path) if audit_log_path else Path("artifacts/audit/prediction_requests.jsonl"),
        estimate_store_dir=Path(estimate_store_dir) if estimate_store_dir else Path("artifacts/estimates"),
        quote_benchmarks_path=Path(quote_benchmarks_path)
        if quote_benchmarks_path
        else Path("artifacts/reports/quote_benchmarks.json"),
        quote_pack_storage_dir=Path(quote_pack_storage_dir)
        if quote_pack_storage_dir
        else Path("artifacts/quote_packs"),
        model_serving_mode=model_serving_mode,
    )
