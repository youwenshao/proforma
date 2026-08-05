"""Linear decision-impact attribution for Ridge/logistic pipelines."""

from __future__ import annotations

from collections import defaultdict
from typing import Any

import numpy as np
import pandas as pd

from ml.features import ALLOWED_INPUT_FEATURES, feature_names

FEATURE_LABELS = {
    "matter_type": "Matter type",
    "matter_subtype": "Matter subtype",
    "jurisdiction": "Jurisdiction",
    "firm_tier": "Firm tier",
    "client_type": "Client type",
    "deal_value_hkd": "Deal value",
    "document_volume": "Document volume",
    "complexity_score": "Complexity",
    "party_count": "Party count",
    "cross_border_flag": "Cross-border",
    "partner_rate_hkd": "Partner rate (from firm tier)",
    "associate_rate_hkd": "Associate rate (from firm tier)",
    "billing_model": "Billing model",
    "stage_count": "Stage count",
}


def decision_impact_for_bundle(
    bundle: Any,
    input_frame: pd.DataFrame,
    *,
    top_n: int = 8,
) -> dict[str, Any] | None:
    """Return absolute-contribution shares for a linear model pipeline.

    Contributions are computed in model space (log1p for total cost) as
    coefficient × transformed feature value, then aggregated back to the
    original input feature names and normalized to percentages.
    """
    estimator = getattr(bundle, "estimator", None)
    if estimator is None or not hasattr(estimator, "named_steps"):
        return None

    model = estimator.named_steps.get("model")
    preprocessor = estimator.named_steps.get("preprocessor")
    if model is None or preprocessor is None or not hasattr(model, "coef_"):
        return None

    transformed = np.asarray(preprocessor.transform(input_frame), dtype=float)[0]
    names = feature_names(preprocessor)
    coefs = np.asarray(model.coef_, dtype=float)
    if coefs.ndim > 1:
        coefs = coefs[0] if coefs.shape[0] == 1 else coefs[-1]
    if len(names) != len(coefs) or len(transformed) != len(coefs):
        return None

    aggregated: dict[str, float] = defaultdict(float)
    for name, coef, value in zip(names, coefs, transformed, strict=True):
        aggregated[_parent_feature(str(name))] += float(coef * value)

    total_abs = float(sum(abs(value) for value in aggregated.values()))
    if total_abs <= 0:
        return {
            "method": "ridge_linear_contribution",
            "target": str(getattr(bundle, "target", "unknown")),
            "factors": [],
            "unavailable_reason": None,
        }

    ranked = sorted(aggregated.items(), key=lambda item: abs(item[1]), reverse=True)
    factors = [
        {
            "feature": feature,
            "display_label": FEATURE_LABELS.get(feature, feature.replace("_", " ").title()),
            "weight_pct": round(100.0 * abs(contribution) / total_abs, 1),
            "direction": "increases" if contribution >= 0 else "decreases",
        }
        for feature, contribution in ranked[:top_n]
        if abs(contribution) / total_abs >= 0.005
    ]

    return {
        "method": "ridge_linear_contribution",
        "target": str(getattr(bundle, "target", "unknown")),
        "factors": factors,
        "unavailable_reason": None,
    }


def unavailable_decision_impact(*, reason: str, target: str = "total_cost_hkd") -> dict[str, Any]:
    return {
        "method": "unavailable",
        "target": target,
        "factors": [],
        "unavailable_reason": reason,
    }


def _parent_feature(encoded_name: str) -> str:
    name = encoded_name
    for prefix in ("numeric__", "categorical__", "remainder__"):
        if name.startswith(prefix):
            name = name[len(prefix) :]
            break

    for feature in sorted(ALLOWED_INPUT_FEATURES, key=len, reverse=True):
        if name == feature or name.startswith(f"{feature}_"):
            return feature
    return name
