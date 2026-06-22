from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from fastapi import APIRouter

from ml.config import MODEL_VERSION
from proforma_data.lineage import DATASET_ID, FEATURE_VERSION, SOURCE_MARKER
from services.api.app.settings import get_settings

router = APIRouter(prefix="/v1/models", tags=["models"])


@router.get("/current")
def current_model() -> dict[str, Any]:
    settings = get_settings()
    report = _read_json_report(settings.artifacts_dir / "reports" / "training_report_total_cost_hkd.json")
    model_version = report.get("model_version", MODEL_VERSION) if report else MODEL_VERSION
    return {
        "status": "available" if report else "not_available",
        "model_version": model_version,
        "feature_version": FEATURE_VERSION,
        "dataset_lineage": {
            "dataset_id": report.get("dataset_id", DATASET_ID) if report else DATASET_ID,
            "source_marker": SOURCE_MARKER,
        },
        "synthetic_data": True,
    }


@router.get("/evaluation")
def model_evaluation() -> dict[str, Any]:
    settings = get_settings()
    report_path = settings.artifacts_dir / "reports" / "training_report_total_cost_hkd.json"
    report = _read_json_report(report_path)
    if report is None:
        return {"status": "not_available", "report_path": report_path.as_posix(), "metrics_by_matter_type": {}}

    return {
        "status": "available",
        "model_version": report.get("model_version", MODEL_VERSION),
        "dataset_id": report.get("dataset_id", DATASET_ID),
        "metrics": report.get("metrics", {}),
        "metrics_by_matter_type": report.get("stratified_metrics", {}),
    }


@router.get("/strategy-comparison")
def strategy_comparison() -> dict[str, Any]:
    settings = get_settings()
    report_path = settings.artifacts_dir / "reports" / "model_strategy_comparison.md"
    if not report_path.exists():
        return {"status": "not_available", "report_path": report_path.as_posix(), "tracks": {}}

    return {
        "status": "available",
        "report_path": report_path.as_posix(),
        "tracks": {
            "firm_specific": {
                "description": "Simulated firm-tier-specific evaluation from synthetic data.",
                "minimum_records_per_firm": 300,
            },
            "pooled_research": {
                "description": "Pooled anonymized research scaffold.",
                "legal_gate_status": "legally_gated",
            },
        },
    }


def _read_json_report(path: Path) -> dict[str, Any] | None:
    if not path.exists():
        return None
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)
