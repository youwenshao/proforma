from __future__ import annotations

from ml.decision_impact import decision_impact_for_bundle
from ml.features import records_to_frame
from ml.inference import public_input_to_model_features, predict
from ml.train import train_regression_model, train_scope_creep_classifier
from proforma_data.schemas import MatterInput


def _matter(**overrides):
    payload = {
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
    }
    payload.update(overrides)
    return payload


def test_decision_impact_returns_percentage_factors_for_ridge() -> None:
    cost_bundle = train_regression_model(
        "output/proforma_hk_synthetic_mvp.csv",
        target="total_cost_hkd",
        sample=400,
    )
    matter = MatterInput(**_matter())
    features = public_input_to_model_features(matter)
    impact = decision_impact_for_bundle(cost_bundle, records_to_frame([features]))

    assert impact is not None
    assert impact["method"] == "ridge_linear_contribution"
    assert impact["factors"]
    assert abs(sum(factor["weight_pct"] for factor in impact["factors"]) - 100.0) < 15.0
    assert all(0 < factor["weight_pct"] <= 100 for factor in impact["factors"])


def test_predict_includes_decision_impact() -> None:
    bundles = {
        "total_cost_hkd": train_regression_model(
            "output/proforma_hk_synthetic_mvp.csv",
            target="total_cost_hkd",
            sample=300,
        ),
        "duration_days": train_regression_model(
            "output/proforma_hk_synthetic_mvp.csv",
            target="duration_days",
            sample=300,
        ),
        "partner_hours": train_regression_model(
            "output/proforma_hk_synthetic_mvp.csv",
            target="partner_hours",
            sample=300,
        ),
        "associate_hours": train_regression_model(
            "output/proforma_hk_synthetic_mvp.csv",
            target="associate_hours",
            sample=300,
        ),
        "scope_creep_flag": train_scope_creep_classifier(
            "output/proforma_hk_synthetic_mvp.csv",
            sample=300,
        ),
    }

    response = predict(bundles, MatterInput(**_matter()).model_dump())

    assert response["decision_impact"] is not None
    assert response["decision_impact"]["factors"]
