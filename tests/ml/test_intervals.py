from ml.inference import predict
from ml.train import train_regression_model, train_scope_creep_classifier


def test_prediction_intervals_are_ordered() -> None:
    bundles = trained_bundles(sample=300)

    interval = predict(bundles, public_matter_input())["cost_estimate"]

    assert interval["p10"] <= interval["p50"] <= interval["p90"]
    assert interval["confidence_level"] == 0.80
    assert interval["calibration_method"] == "residual_quantiles"


def test_intervals_capture_segment_residual_uncertainty() -> None:
    bundle = train_regression_model("output/proforma_hk_synthetic_mvp.csv", target="total_cost_hkd", sample=800)

    assert bundle.segment_uncertainty
    assert max(bundle.segment_uncertainty.values()) > min(bundle.segment_uncertainty.values())


def test_model_report_metrics_include_empirical_coverage() -> None:
    bundle = train_regression_model("output/proforma_hk_synthetic_mvp.csv", target="duration_days", sample=400)

    assert 0 <= bundle.metrics["empirical_coverage"] <= 1
    assert bundle.metrics["calibration_method"] == "cross_validated_residual_quantiles"


def test_inference_uses_segment_uncertainty_to_widen_intervals() -> None:
    bundles = trained_bundles(sample=800)
    bundle = bundles["total_cost_hkd"]
    low_segment = min(bundle.segment_uncertainty, key=bundle.segment_uncertainty.get)
    high_segment = max(bundle.segment_uncertainty, key=bundle.segment_uncertainty.get)

    low_response = predict(bundles, public_matter_input(matter_type=low_segment, matter_subtype=_subtype_for(low_segment)))
    high_response = predict(bundles, public_matter_input(matter_type=high_segment, matter_subtype=_subtype_for(high_segment)))

    low_width = low_response["cost_estimate"]["p90"] - low_response["cost_estimate"]["p10"]
    high_width = high_response["cost_estimate"]["p90"] - high_response["cost_estimate"]["p10"]
    assert high_width >= low_width


def _subtype_for(matter_type: str) -> str:
    from proforma_data.domain import MATTER_SUBTYPES

    return MATTER_SUBTYPES[matter_type][0]


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
    if payload["matter_type"] != "Arbitration" and payload["billing_model"] == "Outcome Related":
        payload["billing_model"] = "Hourly"
    return payload


def trained_bundles(sample: int = 300):
    return {
        "total_cost_hkd": train_regression_model("output/proforma_hk_synthetic_mvp.csv", target="total_cost_hkd", sample=sample),
        "duration_days": train_regression_model("output/proforma_hk_synthetic_mvp.csv", target="duration_days", sample=sample),
        "partner_hours": train_regression_model("output/proforma_hk_synthetic_mvp.csv", target="partner_hours", sample=sample),
        "associate_hours": train_regression_model("output/proforma_hk_synthetic_mvp.csv", target="associate_hours", sample=sample),
        "scope_creep_flag": train_scope_creep_classifier("output/proforma_hk_synthetic_mvp.csv", sample=sample),
    }
