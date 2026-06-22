from __future__ import annotations

from types import SimpleNamespace

import joblib
import numpy as np
import pytest

from ml.config import CLASSIFICATION_TARGET, MODEL_VERSION, REGRESSION_TARGETS
from services.api.app.model_registry import ModelRegistry, ModelUnavailableError
from services.api.app.schemas import EstimateRequest


def valid_estimate_payload() -> dict[str, object]:
    return {
        "tenant_id": "tenant-hk-001",
        "risk_tolerance": "balanced",
        "model_strategy": "synthetic_baseline",
        "matter_input": {
            "matter_type": "Litigation",
            "matter_subtype": "Debt Recovery",
            "jurisdiction": "HK Only",
            "firm_tier": "Mid-tier (6-10 partners)",
            "client_type": "Financial Institution",
            "document_volume": 120,
            "complexity_score": 3,
            "party_count": 2,
            "cross_border_flag": False,
            "billing_model": "Fixed Fee",
            "risk_tolerance": "Medium",
        },
    }


class ConstantEstimator:
    def __init__(self, value: float) -> None:
        self.value = value
        self.named_steps = {"model": self}

    def predict(self, frame: object) -> np.ndarray:
        return np.array([self.value])

    def predict_proba(self, frame: object) -> np.ndarray:
        return np.array([[1.0 - self.value, self.value]])


def bundle(target: str, value: float, *, model_version: str = MODEL_VERSION) -> SimpleNamespace:
    return SimpleNamespace(
        dataset_id="test-dataset",
        estimator=ConstantEstimator(value),
        model_name="logistic" if target == CLASSIFICATION_TARGET else "ridge",
        model_version=model_version,
        residual_quantiles={"p10": -10.0, "p50": 0.0, "p90": 25.0},
        segment_uncertainty={},
        target=target,
        target_transform=None,
    )


def write_bundle(artifacts_dir, target: str, value: float, *, model_version: str = MODEL_VERSION) -> None:
    model_dir = artifacts_dir / "models"
    model_dir.mkdir(parents=True, exist_ok=True)
    suffix = "logistic" if target == CLASSIFICATION_TARGET else "ridge"
    joblib.dump(bundle(target, value, model_version=model_version), model_dir / f"{target}_{suffix}.joblib")


def write_all_bundles(artifacts_dir, *, model_version: str = MODEL_VERSION) -> None:
    values = {
        "total_cost_hkd": 100_000.0,
        "duration_days": 20.0,
        "partner_hours": 10.0,
        "associate_hours": 30.0,
        CLASSIFICATION_TARGET: 0.7,
    }
    for target, value in values.items():
        write_bundle(artifacts_dir, target, value, model_version=model_version)


def test_registry_uses_trained_synthetic_bundles_when_available(tmp_path) -> None:
    write_all_bundles(tmp_path)

    prediction, synthetic_mode = ModelRegistry(tmp_path).predict(
        EstimateRequest.model_validate(valid_estimate_payload()),
    )

    assert synthetic_mode is True
    assert prediction["cost_estimate"]["p50"] == 100_000.0
    assert prediction["duration_estimate"]["p50"] == 20.0
    assert prediction["scope_creep_probability"] == 0.7
    assert round(sum(stage["partner_hours"] for stage in prediction["stage_estimates"]), 6) == 10.0
    assert round(sum(stage["associate_hours"] for stage in prediction["stage_estimates"]), 6) == 30.0


def test_registry_rejects_partial_model_artifact_directory(tmp_path) -> None:
    write_bundle(tmp_path, REGRESSION_TARGETS[0], 100_000.0)

    with pytest.raises(ModelUnavailableError, match="Missing required model artifacts"):
        ModelRegistry(tmp_path).predict(EstimateRequest.model_validate(valid_estimate_payload()))


def test_registry_rejects_incompatible_model_version(tmp_path) -> None:
    write_all_bundles(tmp_path, model_version="old-model-version")

    with pytest.raises(ModelUnavailableError, match="incompatible"):
        ModelRegistry(tmp_path).predict(EstimateRequest.model_validate(valid_estimate_payload()))
