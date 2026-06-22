from __future__ import annotations

import math
from typing import Any

from proforma_data.domain import STAGE_TEMPLATES


TRANSACTIONAL_MATTER_TYPES = {"M&A", "Banking & Finance", "Corporate Restructuring"}


def allocate_stage_estimates(
    *,
    matter_type: str,
    partner_hours: float,
    associate_hours: float,
    cost_estimate: float,
    partner_rate_hkd: float,
    associate_rate_hkd: float,
) -> list[dict[str, Any]]:
    stage_names = STAGE_TEMPLATES.get(matter_type) or ["Matter Work"]
    stage_count = len(stage_names)
    positions = [idx / max(stage_count - 1, 1) for idx in range(stage_count)]
    center = 0.35 if matter_type in TRANSACTIONAL_MATTER_TYPES else 0.45
    total_weights = [0.85 + 0.75 * math.exp(-((pos - center) ** 2) / 0.12) for pos in positions]
    partner_weights = [weight * (1.34 - 0.55 * pos) for weight, pos in zip(total_weights, positions, strict=True)]
    associate_weights = [weight * (0.78 + 0.56 * pos) for weight, pos in zip(total_weights, positions, strict=True)]

    stage_partner_hours = _allocate_total(partner_hours, partner_weights)
    stage_associate_hours = _allocate_total(associate_hours, associate_weights)
    raw_stage_costs = [
        (partner * partner_rate_hkd) + (associate * associate_rate_hkd)
        for partner, associate in zip(stage_partner_hours, stage_associate_hours, strict=True)
    ]
    stage_costs = _allocate_total(cost_estimate, raw_stage_costs)

    return [
        {
            "stage_name": stage_name,
            "partner_hours": partner,
            "associate_hours": associate,
            "cost_hkd": cost,
        }
        for stage_name, partner, associate, cost in zip(
            stage_names,
            stage_partner_hours,
            stage_associate_hours,
            stage_costs,
            strict=True,
        )
    ]


def _allocate_total(total: float, weights: list[float]) -> list[float]:
    if not weights:
        return []
    weight_sum = sum(weights)
    if weight_sum <= 0:
        values = [float(total) / len(weights) for _ in weights]
    else:
        values = [float(total) * (weight / weight_sum) for weight in weights]
    values[-1] = float(total) - sum(values[:-1])
    return values
