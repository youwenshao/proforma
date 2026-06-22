from __future__ import annotations

import os
from pathlib import Path

from pydantic import BaseModel


class ApiSettings(BaseModel):
    service_name: str = "proforma-api"
    api_version: str = "v1"
    artifacts_dir: Path = Path("artifacts")
    audit_log_path: Path = Path("artifacts/audit/prediction_requests.jsonl")
    allow_scope_update_notes: bool = False


def get_settings() -> ApiSettings:
    audit_log_path = os.environ.get("PROFORMA_AUDIT_LOG_PATH")
    artifacts_dir = os.environ.get("PROFORMA_ARTIFACTS_DIR")
    return ApiSettings(
        artifacts_dir=Path(artifacts_dir) if artifacts_dir else Path("artifacts"),
        audit_log_path=Path(audit_log_path) if audit_log_path else Path("artifacts/audit/prediction_requests.jsonl"),
    )
