from services.api.app.fee_rules import recommend_fee


INTERVAL = {"p10": 80_000.0, "p50": 100_000.0, "p90": 150_000.0, "confidence_level": 0.8, "calibration_method": "test"}


def test_conservative_fixed_fee_recommendation_is_at_least_balanced() -> None:
    conservative = recommend_fee(billing_model="Fixed Fee", risk_tolerance="conservative", cost_estimate=INTERVAL)
    balanced = recommend_fee(billing_model="Fixed Fee", risk_tolerance="balanced", cost_estimate=INTERVAL)

    assert conservative["recommended_fee_hkd"] >= balanced["recommended_fee_hkd"]


def test_capped_fee_recommendation_includes_cap_and_downside() -> None:
    recommendation = recommend_fee(billing_model="Capped Fee", risk_tolerance="balanced", cost_estimate=INTERVAL)

    assert recommendation["cap_amount_hkd"] > recommendation["recommended_fee_hkd"]
    assert recommendation["expected_downside_hkd"] > 0


def test_fee_recommendation_requires_partner_final_decision_and_is_not_legal_advice() -> None:
    recommendation = recommend_fee(billing_model="Fixed Fee", risk_tolerance="aggressive", cost_estimate=INTERVAL)

    disclaimer = recommendation["partner_decision_support_disclaimer"].lower()
    assert "partner final decision" in disclaimer
    assert "legal advice" not in disclaimer


def test_fee_recommendation_includes_margin_downside_and_guardrails() -> None:
    recommendation = recommend_fee(billing_model="Fixed Fee", risk_tolerance="balanced", cost_estimate=INTERVAL)

    assert recommendation["expected_margin_hkd"] == recommendation["recommended_fee_hkd"] - INTERVAL["p50"]
    assert recommendation["downside_risk_hkd"] == max(INTERVAL["p90"] - recommendation["recommended_fee_hkd"], 0)
    assert recommendation["margin_pct"] > 0
    assert recommendation["pricing_guardrails"]
    assert any("partner" in guardrail.lower() for guardrail in recommendation["pricing_guardrails"])
