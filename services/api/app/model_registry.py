from __future__ import annotations

import copy
import json
import uuid
from pathlib import Path
from typing import Any

import joblib
from ml.config import MODEL_VERSION
from ml.config import CLASSIFICATION_TARGET, REGRESSION_TARGETS
from ml.inference import predict as predict_with_bundles
from ml.stage_allocation import allocate_stage_estimates
from proforma_data.domain import PARTNER_RATE_BANDS
from proforma_data.schemas import DEFAULT_DISCLAIMER
from services.api.app.fee_rules import recommend_fee
from services.api.app.schemas import EstimateRequest


class ModelUnavailableError(RuntimeError):
    """Raised when requested model artifacts are not available for serving."""


class ModelRegistry:
    def __init__(self, artifacts_dir: Path, *, serving_mode: str = "auto") -> None:
        self.artifacts_dir = artifacts_dir
        self.serving_mode = serving_mode

    def predict(self, request: EstimateRequest) -> tuple[dict[str, Any], bool]:
        if request.model_strategy == "firm_specific":
            raise ModelUnavailableError("Firm-specific model artifacts are not available in artifacts/models.")

        bundles = None if self.serving_mode == "fixture" else self._load_model_bundles()
        if bundles is not None:
            response = predict_with_bundles(bundles, _inference_payload(request))
            response["fee_recommendation"] = recommend_fee(
                billing_model=request.matter_input.billing_model,
                risk_tolerance=request.risk_tolerance,
                cost_estimate=response["cost_estimate"],
            )
            return response, True

        if self.serving_mode == "live":
            raise ModelUnavailableError("Live model serving requested, but no model artifacts are available.")

        response = self._fixture_prediction()
        response["estimate_id"] = str(uuid.uuid4())
        response["tenant_id"] = request.tenant_id
        response["model_version"] = MODEL_VERSION
        response["decision_support_disclaimer"] = DEFAULT_DISCLAIMER
        response["input_summary"] = _input_summary(request)
        response["stage_estimates"] = _request_stage_estimates(request, response)
        response["fee_recommendation"] = recommend_fee(
            billing_model=request.matter_input.billing_model,
            risk_tolerance=request.risk_tolerance,
            cost_estimate=response["cost_estimate"],
        )

        limitations = list(response.get("limitations", []))
        if request.model_strategy == "pooled_research":
            limitations.append("Pooled research strategy is legally gated pending governance approval.")
        response["limitations"] = limitations
        return response, True

    def _fixture_prediction(self) -> dict[str, Any]:
        fixture_path = self.artifacts_dir / "fixtures" / "sample_prediction_response.json"
        with fixture_path.open(encoding="utf-8") as handle:
            return copy.deepcopy(json.load(handle))

    def _load_model_bundles(self) -> dict[str, Any] | None:
        model_dir = self.artifacts_dir / "models"
        artifact_paths = sorted(model_dir.glob("*.joblib")) if model_dir.exists() else []
        if not artifact_paths:
            return None

        required_targets = [*REGRESSION_TARGETS, CLASSIFICATION_TARGET]
        bundles: dict[str, Any] = {}
        missing: list[str] = []
        for target in required_targets:
            matches = sorted(model_dir.glob(f"{target}_*.joblib"))
            if not matches:
                missing.append(target)
                continue
            bundle = joblib.load(matches[0])
            if getattr(bundle, "model_version", None) != MODEL_VERSION:
                raise ModelUnavailableError(
                    f"Model artifact {matches[0].name} is incompatible with {MODEL_VERSION}.",
                )
            if getattr(bundle, "target", None) != target:
                raise ModelUnavailableError(
                    f"Model artifact {matches[0].name} target does not match {target}.",
                )
            bundles[target] = bundle

        if missing:
            raise ModelUnavailableError(f"Missing required model artifacts: {', '.join(missing)}")

        return bundles


def _input_summary(request: EstimateRequest) -> dict[str, str | int | float | bool | None]:
    matter_input = request.matter_input
    return {
        "matter_type": matter_input.matter_type,
        "matter_subtype": matter_input.matter_subtype,
        "jurisdiction": matter_input.jurisdiction,
        "firm_tier": matter_input.firm_tier,
        "client_type": matter_input.client_type,
        "deal_value_hkd": matter_input.deal_value_hkd,
        "complexity_score": matter_input.complexity_score,
        "billing_model": matter_input.billing_model,
    }


def _request_stage_estimates(request: EstimateRequest, response: dict[str, Any]) -> list[dict[str, Any]]:
    fixture_stages = response.get("stage_estimates", [])
    partner_hours = sum(float(stage["partner_hours"]) for stage in fixture_stages)
    associate_hours = sum(float(stage["associate_hours"]) for stage in fixture_stages)
    low, high = PARTNER_RATE_BANDS[request.matter_input.firm_tier]
    partner_rate = (low + high) / 2.0
    associate_rate = partner_rate * 0.5

    return allocate_stage_estimates(
        matter_type=request.matter_input.matter_type,
        partner_hours=partner_hours,
        associate_hours=associate_hours,
        cost_estimate=float(response["cost_estimate"]["p50"]),
        partner_rate_hkd=partner_rate,
        associate_rate_hkd=associate_rate,
    )


def _inference_payload(request: EstimateRequest) -> dict[str, Any]:
    return {
        **request.matter_input.model_dump(mode="json"),
        "model_strategy": request.model_strategy,
        "tenant_id": request.tenant_id,
    }
