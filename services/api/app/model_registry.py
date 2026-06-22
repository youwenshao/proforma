from __future__ import annotations

import copy
import json
import uuid
from pathlib import Path
from typing import Any

from ml.config import MODEL_VERSION
from proforma_data.schemas import DEFAULT_DISCLAIMER
from services.api.app.fee_rules import recommend_fee
from services.api.app.schemas import EstimateRequest


class ModelUnavailableError(RuntimeError):
    """Raised when requested model artifacts are not available for serving."""


class ModelRegistry:
    def __init__(self, artifacts_dir: Path) -> None:
        self.artifacts_dir = artifacts_dir

    def predict(self, request: EstimateRequest) -> tuple[dict[str, Any], bool]:
        if request.model_strategy == "firm_specific":
            raise ModelUnavailableError("Firm-specific model artifacts are not available in artifacts/models.")

        response = self._fixture_prediction()
        response["estimate_id"] = str(uuid.uuid4())
        response["tenant_id"] = request.tenant_id
        response["model_version"] = MODEL_VERSION
        response["decision_support_disclaimer"] = DEFAULT_DISCLAIMER
        response["input_summary"] = _input_summary(request)
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


def _input_summary(request: EstimateRequest) -> dict[str, str | int | float | bool | None]:
    matter_input = request.matter_input
    return {
        "matter_type": matter_input.matter_type,
        "matter_subtype": matter_input.matter_subtype,
        "jurisdiction": matter_input.jurisdiction,
        "firm_tier": matter_input.firm_tier,
        "client_type": matter_input.client_type,
        "complexity_score": matter_input.complexity_score,
        "billing_model": matter_input.billing_model,
    }
