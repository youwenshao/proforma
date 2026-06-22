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
    response: dict[str, Any] = {
        "billing_model": billing_model,
        "recommended_fee_hkd": recommended,
        "confidence_interval_low_hkd": float(cost_estimate["p10"]),
        "confidence_interval_high_hkd": max(p90, recommended),
        "partner_decision_support_disclaimer": PARTNER_FINAL_DECISION_DISCLAIMER,
    }

    if billing_model == "Capped Fee":
        cap_amount = max(p90 * 1.10, recommended)
        response["cap_amount_hkd"] = cap_amount
        response["expected_downside_hkd"] = max(cap_amount - recommended, 0.0)

    return response
