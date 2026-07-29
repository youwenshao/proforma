from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Literal

from fastapi import APIRouter, HTTPException, Query, status
from fastapi.responses import FileResponse

from ml.config import MODEL_VERSION
from proforma_data.lineage import DATASET_ID, FEATURE_VERSION, SOURCE_MARKER
from services.api.app.model_artifacts import (
    INLINE_MEDIA_TYPE,
    artifact_payload,
    build_artifact_catalog,
    find_artifact,
)
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


@router.get("/artifacts")
def model_artifacts() -> dict[str, Any]:
    settings = get_settings()
    catalog = build_artifact_catalog(settings)
    return {
        "status": "available" if any(artifact.available for artifact in catalog) else "not_available",
        "model_version": MODEL_VERSION,
        "dataset_id": DATASET_ID,
        "source_marker": SOURCE_MARKER,
        "synthetic_data": True,
        "artifacts": [artifact_payload(artifact) for artifact in catalog],
    }


@router.get("/artifacts/{artifact_id}/content", response_class=FileResponse)
def model_artifact_content(
    artifact_id: str,
    disposition: Literal["attachment", "inline"] = Query(default="attachment"),
) -> FileResponse:
    artifact = find_artifact(get_settings(), artifact_id)
    if artifact is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Unknown artifact")
    if artifact.path is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Artifact is not built in this environment. Rebuild with: {artifact.rebuild_command}",
        )

    inline = disposition == "inline" and artifact.viewable
    return FileResponse(
        artifact.path,
        media_type=INLINE_MEDIA_TYPE if inline else artifact.media_type,
        headers={
            "content-disposition": f'{"inline" if inline else "attachment"}; filename="{artifact.filename}"'
        },
    )


@router.get("/similar-matter-evidence")
def similar_matter_evidence() -> dict[str, Any]:
    return {
        "status": "gated",
        "legal_gate_status": "data_residency_approval_required",
        "retrieval_enabled": False,
        "description": "Anonymized similar-matter retrieval requires approved real-firm data handling, residency, retention, and deletion controls before activation.",
        "allowed_inputs": ["structured matter taxonomy", "approved anonymized matter records"],
        "excluded_inputs": ["free-text matter narratives", "confidential client documents", "unapproved firm exports"],
    }


def _read_json_report(path: Path) -> dict[str, Any] | None:
    if not path.exists():
        return None
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)
