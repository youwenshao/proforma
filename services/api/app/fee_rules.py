from __future__ import annotations

from typing import Any, Literal

from proforma_data.schemas import DEFAULT_DISCLAIMER

RiskToleranceSetting = Literal["conservative", "balanced", "aggressive"]

PARTNER_FINAL_DECISION_DISCLAIMER = (
    f"{DEFAULT_DISCLAIMER} Partner final decision is required before sharing any fee proposal with a client."
)


def recommend_fee(
    *,
    billing_model: str,
    risk_tolerance: RiskToleranceSetting,
    cost_estimate: dict[str, Any],
) -> dict[str, Any]:
    p50 = float(cost_estimate["p50"])
    p90 = float(cost_estimate["p90"])
    p75 = p50 + ((p90 - p50) * 0.5)

    anchors = {
        "conservative": p90 * 1.05,
        "balanced": p75,
        "aggressive": p50,
    }
    recommended = max(anchors[risk_tolerance], 1_000.0)
    downside_risk = max(p90 - recommended, 0.0)
    expected_margin = recommended - p50
    response: dict[str, Any] = {
        "billing_model": billing_model,
        "recommended_fee_hkd": recommended,
        "confidence_interval_low_hkd": float(cost_estimate["p10"]),
        "confidence_interval_high_hkd": max(p90, recommended),
        "downside_risk_hkd": downside_risk,
        "expected_margin_hkd": expected_margin,
        "margin_pct": expected_margin / recommended if recommended else 0.0,
        "partner_decision_support_disclaimer": PARTNER_FINAL_DECISION_DISCLAIMER,
        "pricing_guardrails": _pricing_guardrails(
            billing_model=billing_model,
            downside_risk_hkd=downside_risk,
            risk_tolerance=risk_tolerance,
        ),
    }

    if billing_model == "Capped Fee":
        cap_amount = max(p90 * 1.10, recommended)
        response["cap_amount_hkd"] = cap_amount
        response["expected_downside_hkd"] = max(cap_amount - recommended, 0.0)

    return response


def _pricing_guardrails(
    *,
    billing_model: str,
    downside_risk_hkd: float,
    risk_tolerance: RiskToleranceSetting,
) -> list[str]:
    guardrails = ["Partner final decision required before client sharing."]
    if downside_risk_hkd > 0:
        guardrails.append("Confirm scope assumptions or reserve before accepting downside exposure.")
    if billing_model == "Capped Fee":
        guardrails.append("Track cap consumption by stage and trigger review before cap pressure materializes.")
    if risk_tolerance == "aggressive":
        guardrails.append("Aggressive pricing should be paired with tighter scope language and monitoring cadence.")
    return guardrails
