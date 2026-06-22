from __future__ import annotations

from typing import Any

from services.api.app.schemas import ScopeUpdateRequest, ScopeUpdateResponse

WARNING_THRESHOLD_PCT = 5.0
CRITICAL_THRESHOLD_PCT = 15.0


class StageNotFoundError(ValueError):
    """Raised when an estimate does not contain the requested stage."""


def evaluate_scope_update(
    *,
    estimate_id: str,
    stage_estimates: list[dict[str, Any]],
    update: ScopeUpdateRequest,
) -> ScopeUpdateResponse:
    stage = next((item for item in stage_estimates if item["stage_name"] == update.stage_name), None)
    if stage is None:
        raise StageNotFoundError(f"Stage not found for estimate: {update.stage_name}")

    predicted_hours = float(stage["partner_hours"]) + float(stage["associate_hours"])
    actual_hours = update.actual_partner_hours + update.actual_associate_hours
    predicted_cost = float(stage["cost_hkd"])
    hours_variance_pct = _variance_pct(actual_hours, predicted_hours)
    cost_variance_pct = _variance_pct(update.actual_cost_hkd, predicted_cost)
    variance_pct = max(hours_variance_pct, cost_variance_pct)
    predicted_total_cost = sum(float(item["cost_hkd"]) for item in stage_estimates)
    predicted_total_hours = sum(float(item["partner_hours"]) + float(item["associate_hours"]) for item in stage_estimates)
    cost_multiplier = max(update.actual_cost_hkd / predicted_cost, 1.0) if predicted_cost else 1.0
    hours_multiplier = max(actual_hours / predicted_hours, 1.0) if predicted_hours else 1.0
    reforecast_final_cost = update.actual_cost_hkd + max(predicted_total_cost - predicted_cost, 0.0) * cost_multiplier
    reforecast_final_hours = actual_hours + max(predicted_total_hours - predicted_hours, 0.0) * hours_multiplier

    if variance_pct > CRITICAL_THRESHOLD_PCT:
        action = "critical_partner_review"
    elif variance_pct > WARNING_THRESHOLD_PCT:
        action = "partner_review"
    else:
        action = "monitor"

    return ScopeUpdateResponse(
        estimate_id=estimate_id,
        stage_name=update.stage_name,
        predicted_hours=predicted_hours,
        actual_hours=actual_hours,
        predicted_cost_hkd=predicted_cost,
        actual_cost_hkd=update.actual_cost_hkd,
        variance_pct=variance_pct,
        scope_creep_flag=variance_pct > WARNING_THRESHOLD_PCT,
        reforecast_final_cost_hkd=reforecast_final_cost,
        reforecast_final_hours=reforecast_final_hours,
        overrun_probability=_overrun_probability(variance_pct),
        recommended_review_action=action,
    )


def _variance_pct(actual: float, predicted: float) -> float:
    if predicted == 0:
        return 0.0
    return ((actual - predicted) / predicted) * 100.0


def _overrun_probability(variance_pct: float) -> float:
    if variance_pct <= 0:
        return 0.10
    return min(0.95, 0.20 + (variance_pct / 100.0))
