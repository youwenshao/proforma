import json
from pathlib import Path

from ml.inference import predict
from ml.model_card import write_model_card
from ml.train import train_regression_model, train_scope_creep_classifier


def test_model_cards_include_synthetic_limitations_and_excluded_uses(tmp_path: Path) -> None:
    bundle = train_regression_model("output/proforma_hk_synthetic_mvp.csv", target="total_cost_hkd", sample=300)
    output = tmp_path / "model_card.md"

    text = write_model_card(bundle, output)

    assert "Synthetic" in text
    assert "Excluded uses" in text
    assert "Legal And Governance Gates" in text


def test_api_fixture_includes_model_version_and_disclaimer(tmp_path: Path) -> None:
    cost_bundle = train_regression_model("output/proforma_hk_synthetic_mvp.csv", target="total_cost_hkd", sample=300)
    duration_bundle = train_regression_model("output/proforma_hk_synthetic_mvp.csv", target="duration_days", sample=300)
    scope_bundle = train_scope_creep_classifier("output/proforma_hk_synthetic_mvp.csv", sample=300)

    response = predict(
        {
            "total_cost_hkd": cost_bundle,
            "duration_days": duration_bundle,
            "partner_hours": train_regression_model("output/proforma_hk_synthetic_mvp.csv", target="partner_hours", sample=300),
            "associate_hours": train_regression_model("output/proforma_hk_synthetic_mvp.csv", target="associate_hours", sample=300),
            "scope_creep_flag": scope_bundle,
        },
        public_matter_input(),
    )
    fixture_path = tmp_path / "sample_prediction_response.json"
    fixture_path.write_text(json.dumps(response, indent=2), encoding="utf-8")

    assert response["model_version"]
    assert "decision_support_disclaimer" in response
    assert response["fee_recommendation"]["partner_decision_support_disclaimer"]


def test_inference_does_not_return_raw_training_rows() -> None:
    bundles = {
        "total_cost_hkd": train_regression_model("output/proforma_hk_synthetic_mvp.csv", target="total_cost_hkd", sample=300),
        "duration_days": train_regression_model("output/proforma_hk_synthetic_mvp.csv", target="duration_days", sample=300),
        "partner_hours": train_regression_model("output/proforma_hk_synthetic_mvp.csv", target="partner_hours", sample=300),
        "associate_hours": train_regression_model("output/proforma_hk_synthetic_mvp.csv", target="associate_hours", sample=300),
        "scope_creep_flag": train_scope_creep_classifier("output/proforma_hk_synthetic_mvp.csv", sample=300),
    }

    response = predict(bundles, public_matter_input())
    serialized = json.dumps(response)

    assert "training_rows" not in response
    assert "matter_id" not in serialized


def public_matter_input():
    return {
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
