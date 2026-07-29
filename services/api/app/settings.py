from __future__ import annotations

import os
from pathlib import Path
from typing import Literal

from pydantic import BaseModel


class ApiSettings(BaseModel):
    service_name: str = "proforma-api"
    api_version: str = "v1"
    artifacts_dir: Path = Path("artifacts")
    dataset_dir: Path = Path("output")
    project_root: Path = Path(".")
    audit_log_path: Path = Path("artifacts/audit/prediction_requests.jsonl")
    estimate_store_dir: Path = Path("artifacts/estimates")
    quote_benchmarks_path: Path = Path("artifacts/reports/quote_benchmarks.json")
    quote_pack_storage_dir: Path = Path("artifacts/quote_packs")
    allow_scope_update_notes: bool = False
    model_serving_mode: Literal["auto", "fixture", "live"] = "auto"
    supabase_url: str | None = None
    supabase_service_role_key: str | None = None

    @property
    def supabase_enabled(self) -> bool:
        return bool(self.supabase_url and self.supabase_service_role_key)


def _default_project_root() -> Path:
    """Resolve the monorepo root from this module when cwd is not the root."""
    here = Path(__file__).resolve()
    # services/api/app/settings.py -> repository root
    candidate = here.parents[3]
    if (candidate / "generate_dataset.py").is_file() or (candidate / "artifacts").is_dir():
        return candidate
    return Path.cwd()


def get_settings() -> ApiSettings:
    audit_log_path = os.environ.get("PROFORMA_AUDIT_LOG_PATH")
    artifacts_dir = os.environ.get("PROFORMA_ARTIFACTS_DIR")
    dataset_dir = os.environ.get("PROFORMA_DATASET_DIR")
    project_root_env = os.environ.get("PROFORMA_PROJECT_ROOT")
    estimate_store_dir = os.environ.get("PROFORMA_ESTIMATE_STORE_DIR")
    quote_benchmarks_path = os.environ.get("PROFORMA_QUOTE_BENCHMARKS_PATH")
    quote_pack_storage_dir = os.environ.get("PROFORMA_QUOTE_PACK_STORAGE_DIR")
    model_serving_mode = os.environ.get("PROFORMA_MODEL_SERVING_MODE", "auto")
    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_service_role_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    project_root = Path(project_root_env) if project_root_env else _default_project_root()
    return ApiSettings(
        artifacts_dir=Path(artifacts_dir) if artifacts_dir else project_root / "artifacts",
        dataset_dir=Path(dataset_dir) if dataset_dir else project_root / "output",
        project_root=project_root,
        audit_log_path=Path(audit_log_path) if audit_log_path else project_root / "artifacts/audit/prediction_requests.jsonl",
        estimate_store_dir=Path(estimate_store_dir) if estimate_store_dir else project_root / "artifacts/estimates",
        quote_benchmarks_path=Path(quote_benchmarks_path)
        if quote_benchmarks_path
        else project_root / "artifacts/reports/quote_benchmarks.json",
        quote_pack_storage_dir=Path(quote_pack_storage_dir)
        if quote_pack_storage_dir
        else project_root / "artifacts/quote_packs",
        model_serving_mode=model_serving_mode,
        supabase_url=supabase_url,
        supabase_service_role_key=supabase_service_role_key,
    )
