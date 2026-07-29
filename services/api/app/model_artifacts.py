"""Reviewable evidence artifacts published for inspection and download.

Only synthetic datasets, generator source, and derived reports are exposed. The
catalog is a fixed allowlist so an artifact identifier can never resolve to an
arbitrary filesystem path.
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any, Literal

from services.api.app.settings import ApiSettings

ArtifactCategory = Literal["dataset", "model", "report"]

REBUILD_DATASET_COMMAND = "python generate_dataset.py"
REBUILD_MODEL_COMMAND = (
    "python -m ml.train --dataset output/proforma_hk_synthetic_mvp.csv "
    "--all-targets --output-dir artifacts/models"
)

# Browsers download rather than render several of these media types, so inline
# viewing re-serves text formats as plain text.
INLINE_MEDIA_TYPE = "text/plain; charset=utf-8"
BINARY_MEDIA_TYPE = "application/octet-stream"

MODEL_BUNDLE_TARGETS = {
    "total_cost_hkd": "model-bundle-total-cost",
    "duration_days": "model-bundle-duration",
    "partner_hours": "model-bundle-partner-hours",
    "associate_hours": "model-bundle-associate-hours",
    "scope_creep_flag": "model-bundle-scope-creep",
}


@dataclass(frozen=True)
class ResolvedArtifact:
    artifact_id: str
    category: ArtifactCategory
    filename: str
    media_type: str
    rebuild_command: str
    path: Path | None

    @property
    def available(self) -> bool:
        return self.path is not None

    @property
    def viewable(self) -> bool:
        return self.available and self.media_type != BINARY_MEDIA_TYPE

    @property
    def size_bytes(self) -> int | None:
        return self.path.stat().st_size if self.path is not None else None


def build_artifact_catalog(settings: ApiSettings) -> list[ResolvedArtifact]:
    reports_dir = settings.artifacts_dir / "reports"
    models_dir = settings.artifacts_dir / "models"
    dataset_dir = settings.dataset_dir
    docs_dir = settings.project_root / "docs"

    catalog = [
        _fixed_artifact(
            "synthetic-dataset",
            "dataset",
            dataset_dir / "proforma_hk_synthetic_mvp.csv",
            "text/csv",
            REBUILD_DATASET_COMMAND,
        ),
        _fixed_artifact(
            "dataset-generator",
            "dataset",
            settings.project_root / "generate_dataset.py",
            "text/x-python",
            REBUILD_DATASET_COMMAND,
        ),
        _fixed_artifact(
            "data-dictionary",
            "dataset",
            docs_dir / "data_dictionary.md",
            "text/markdown",
            REBUILD_DATASET_COMMAND,
        ),
        _fixed_artifact(
            "validation-report",
            "dataset",
            dataset_dir / "validation_report.md",
            "text/markdown",
            REBUILD_DATASET_COMMAND,
        ),
        _fixed_artifact(
            "dataset-lineage",
            "dataset",
            dataset_dir / "dataset_lineage.json",
            "application/json",
            REBUILD_DATASET_COMMAND,
        ),
        _fixed_artifact(
            "model-card-cost",
            "report",
            reports_dir / "model_card_total_cost.md",
            "text/markdown",
            REBUILD_MODEL_COMMAND,
        ),
        _fixed_artifact(
            "model-card-scope-creep",
            "report",
            reports_dir / "model_card_scope_creep.md",
            "text/markdown",
            REBUILD_MODEL_COMMAND,
        ),
        _fixed_artifact(
            "training-report-cost",
            "report",
            reports_dir / "training_report_total_cost_hkd.json",
            "application/json",
            REBUILD_MODEL_COMMAND,
        ),
        _fixed_artifact(
            "strategy-comparison-report",
            "report",
            reports_dir / "model_strategy_comparison.md",
            "text/markdown",
            REBUILD_MODEL_COMMAND,
        ),
    ]

    catalog.extend(
        _bundle_artifact(artifact_id, models_dir, target)
        for target, artifact_id in MODEL_BUNDLE_TARGETS.items()
    )
    return catalog


def find_artifact(settings: ApiSettings, artifact_id: str) -> ResolvedArtifact | None:
    for artifact in build_artifact_catalog(settings):
        if artifact.artifact_id == artifact_id:
            return artifact
    return None


def artifact_payload(artifact: ResolvedArtifact) -> dict[str, Any]:
    content_path = f"/v1/models/artifacts/{artifact.artifact_id}/content"
    return {
        "artifact_id": artifact.artifact_id,
        "category": artifact.category,
        "filename": artifact.filename,
        "media_type": artifact.media_type,
        "available": artifact.available,
        "viewable": artifact.viewable,
        "size_bytes": artifact.size_bytes,
        "rebuild_command": artifact.rebuild_command,
        "download_path": f"{content_path}?disposition=attachment",
        "view_path": f"{content_path}?disposition=inline" if artifact.viewable else None,
    }


def _fixed_artifact(
    artifact_id: str,
    category: ArtifactCategory,
    path: Path,
    media_type: str,
    rebuild_command: str,
) -> ResolvedArtifact:
    return ResolvedArtifact(
        artifact_id=artifact_id,
        category=category,
        filename=path.name,
        media_type=media_type,
        rebuild_command=rebuild_command,
        path=path if path.is_file() else None,
    )


def _bundle_artifact(artifact_id: str, models_dir: Path, target: str) -> ResolvedArtifact:
    matches = sorted(models_dir.glob(f"{target}_*.joblib")) if models_dir.is_dir() else []
    resolved = matches[0] if matches else None
    return ResolvedArtifact(
        artifact_id=artifact_id,
        category="model",
        filename=resolved.name if resolved else f"{target}_<model>.joblib",
        media_type=BINARY_MEDIA_TYPE,
        rebuild_command=REBUILD_MODEL_COMMAND,
        path=resolved,
    )
