import pytest

from ml.inference import predict
from ml.train import train_regression_model, train_scope_creep_classifier
from proforma_data.schemas import MatterInput, PredictionResponse


def public_matter_input(**overrides):
    payload = {
        "matter_type": "Arbitration",
        "matter_subtype": "HKIAC Commercial Arbitration",
        "jurisdiction": "GBA Cross-Border (HK-PRC)",
        "firm_tier": "Magic Circle / International",
        "client_type": "Mainland Enterprise",
        "document_volume": 1200,
        "complexity_score": 4,
        "party_count": 4,
        "cross_border_flag": True,
        "billing_model": "Outcome Related",
        "risk_tolerance": "Medium",
    }
    payload.update(overrides)
    return payload


def trained_bundles(sample: int = 300):
    return {
        "total_cost_hkd": train_regression_model("output/proforma_hk_synthetic_mvp.csv", target="total_cost_hkd", sample=sample),
        "duration_days": train_regression_model("output/proforma_hk_synthetic_mvp.csv", target="duration_days", sample=sample),
        "partner_hours": train_regression_model("output/proforma_hk_synthetic_mvp.csv", target="partner_hours", sample=sample),
        "associate_hours": train_regression_model("output/proforma_hk_synthetic_mvp.csv", target="associate_hours", sample=sample),
        "scope_creep_flag": train_scope_creep_classifier("output/proforma_hk_synthetic_mvp.csv", sample=sample),
    }


def test_predict_accepts_strict_matter_input_contract() -> None:
    matter_input = MatterInput(**public_matter_input()).model_dump()

    response = predict(trained_bundles(), matter_input)

    PredictionResponse(**response)
    assert response["cost_estimate"]["p50"] > 0
    assert response["duration_estimate"]["p50"] > 0


def test_predict_accepts_phase3_request_envelope_and_propagates_tenant() -> None:
    request = {
        "tenant_id": "tenant-demo",
        "matter_input": public_matter_input(),
        "risk_tolerance": "High",
        "model_strategy": "pooled_research",
    }

    response = predict(trained_bundles(), request)

    PredictionResponse(**response)
    assert response["tenant_id"] == "tenant-demo"
    assert any("legally gated" in limitation for limitation in response["limitations"])


def test_predict_rejects_leakage_fields_at_inference_boundary() -> None:
    matter_input = public_matter_input(total_cost_hkd=1000)

    with pytest.raises(ValueError, match="leakage"):
        predict(trained_bundles(), matter_input)


def test_predict_requires_core_model_bundles() -> None:
    matter_input = MatterInput(**public_matter_input()).model_dump()
    bundles = trained_bundles()
    bundles.pop("partner_hours")

    with pytest.raises(ValueError, match="Missing required model bundles"):
        predict(bundles, matter_input)
