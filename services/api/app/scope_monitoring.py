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
    hours_variance_pct = _variance_pct(actual_hours, predicted_hours)
    cost_variance_pct = _variance_pct(update.actual_cost_hkd, float(stage["cost_hkd"]))
    variance_pct = max(hours_variance_pct, cost_variance_pct)

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
        variance_pct=variance_pct,
        scope_creep_flag=variance_pct > WARNING_THRESHOLD_PCT,
        recommended_review_action=action,
    )


def _variance_pct(actual: float, predicted: float) -> float:
    if predicted == 0:
        return 0.0
    return ((actual - predicted) / predicted) * 100.0
