"""Serializable model bundle contracts shared across training and inference."""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
from typing import Any

from sklearn.pipeline import Pipeline

from ml.config import MODEL_VERSION
from ml.features import FeatureContract
from proforma_data.lineage import DATASET_ID


@dataclass
class ModelBundle:
    target: str
    model_name: str
    task_type: str
    estimator: Pipeline
    feature_contract: FeatureContract
    feature_names: list[str]
    metrics: dict[str, Any]
    stratified_metrics: dict[str, dict[str, float]]
    model_version: str = MODEL_VERSION
    target_transform: str | None = None
    residual_quantiles: dict[str, float] = field(default_factory=dict)
    segment_uncertainty: dict[str, float] = field(default_factory=dict)
    segment_residual_quantiles: dict[str, dict[str, float]] = field(default_factory=dict)
    dataset_id: str = DATASET_ID

    def public_metadata(self) -> dict[str, Any]:
        payload = asdict(self)
        payload.pop("estimator")
        return payload
