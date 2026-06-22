import pandas as pd

from ml.inference import predict
from ml.train import train_regression_model, train_scope_creep_classifier


def sample_dataset(tmp_path):
    sample_path = tmp_path / "sample.csv"
    pd.read_csv("output/proforma_hk_synthetic_mvp.csv").head(100).to_csv(sample_path, index=False)
    return sample_path


def test_training_can_run_on_100_row_sample(tmp_path) -> None:
    dataset_path = sample_dataset(tmp_path)

    cost_bundle = train_regression_model(dataset_path, target="total_cost_hkd")
    scope_bundle = train_scope_creep_classifier(dataset_path)

    assert cost_bundle.target == "total_cost_hkd"
    assert cost_bundle.metrics["mae"] > 0
    assert scope_bundle.target == "scope_creep_flag"
    assert "roc_auc" in scope_bundle.metrics


def test_inference_returns_core_estimates(tmp_path) -> None:
    dataset_path = sample_dataset(tmp_path)
    cost_bundle = train_regression_model(dataset_path, target="total_cost_hkd")
    duration_bundle = train_regression_model(dataset_path, target="duration_days")
    scope_bundle = train_scope_creep_classifier(dataset_path)

    prediction = predict(
        {
            "total_cost_hkd": cost_bundle,
            "duration_days": duration_bundle,
            "partner_hours": train_regression_model(dataset_path, target="partner_hours"),
            "associate_hours": train_regression_model(dataset_path, target="associate_hours"),
            "scope_creep_flag": scope_bundle,
        },
        public_matter_input(),
    )

    assert prediction["cost_estimate"]["p50"] > 0
    assert prediction["duration_estimate"]["p50"] > 0
    assert 0 <= prediction["scope_creep_probability"] <= 1


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
