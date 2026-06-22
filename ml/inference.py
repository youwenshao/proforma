"""Stable local inference interface for trained ProForma model bundles."""

from __future__ import annotations

import uuid
from typing import Any

import numpy as np
import pandas as pd

from ml.config import MODEL_VERSION
from ml.evaluate import prediction_interval
from ml.features import LEAKAGE_FIELDS, parse_json_list, records_to_frame
from ml.stage_allocation import allocate_stage_estimates
from proforma_data.domain import PARTNER_RATE_BANDS, STAGE_TEMPLATES
from proforma_data.lineage import DATASET_ID, SOURCE_MARKER
from proforma_data.schemas import DEFAULT_DISCLAIMER, MatterInput, PredictionRequest, PredictionResponse

REQUIRED_BUNDLES = {"total_cost_hkd", "duration_days", "scope_creep_flag", "partner_hours", "associate_hours"}


def predict(model_bundle: dict[str, Any] | Any, matter_input: dict[str, Any]) -> dict[str, Any]:
    bundles = model_bundle if isinstance(model_bundle, dict) else {model_bundle.target: model_bundle}
    missing = sorted(REQUIRED_BUNDLES - set(bundles))
    if missing:
        raise ValueError(f"Missing required model bundles: {missing}")

    tenant_id, public_input, model_strategy = normalize_prediction_request(matter_input)
    model_features = public_input_to_model_features(public_input)
    input_frame = records_to_frame(pd.DataFrame([model_features]))

    cost_bundle = bundles.get("total_cost_hkd")
    duration_bundle = bundles.get("duration_days")
    scope_bundle = bundles.get("scope_creep_flag")
    partner_bundle = bundles.get("partner_hours")
    associate_bundle = bundles.get("associate_hours")

    cost_point = _predict_regression(cost_bundle, input_frame)
    duration_point = _predict_regression(duration_bundle, input_frame)
    partner_hours = _predict_regression(partner_bundle, input_frame)
    associate_hours = _predict_regression(associate_bundle, input_frame)
    scope_probability = _predict_probability(scope_bundle, input_frame)

    response = {
        "estimate_id": str(uuid.uuid4()),
        "tenant_id": tenant_id,
        "model_version": MODEL_VERSION,
        "dataset_lineage": {
            "dataset_id": getattr(cost_bundle, "dataset_id", DATASET_ID),
            "source_marker": SOURCE_MARKER,
            "schema_version": public_input.schema_version,
        },
        "input_summary": _input_summary(public_input.model_dump()),
        "cost_estimate": _interval(cost_bundle, cost_point, public_input.model_dump()),
        "duration_estimate": _interval(duration_bundle, duration_point, public_input.model_dump()),
        "scope_creep_probability": float(scope_probability),
        "stage_estimates": _stage_estimates(model_features, partner_hours, associate_hours, cost_point),
        "fee_recommendation": _fee_recommendation(public_input.model_dump(), cost_point),
        "decision_support_disclaimer": DEFAULT_DISCLAIMER,
        "limitations": [
            "Synthetic-data feasibility estimate only.",
            "Partner review required before client use.",
            *(
                ["Pooled research strategy is legally gated pending governance approval."]
                if model_strategy == "pooled_research"
                else []
            ),
        ],
    }
    return PredictionResponse(**response).model_dump(mode="json")


def normalize_prediction_request(payload: dict[str, Any]) -> tuple[str, MatterInput, str]:
    if "matter_input" in payload:
        request = PredictionRequest(**payload)
        return request.tenant_id, request.matter_input, request.model_strategy

    leaking = sorted(set(payload).intersection(LEAKAGE_FIELDS))
    if leaking:
        raise ValueError(f"Inference payload contains leakage fields: {leaking}")
    public_input = MatterInput(
        **{
            field: _none_if_nan(payload[field])
            for field in MatterInput.model_fields
            if field in payload
        },
    )
    return str(payload.get("tenant_id", "synthetic-demo-tenant")), public_input, str(payload.get("model_strategy", "synthetic_baseline"))


def _none_if_nan(value: Any) -> Any:
    if isinstance(value, float) and np.isnan(value):
        return None
    return value


def public_input_to_model_features(matter_input: MatterInput) -> dict[str, Any]:
    low, high = PARTNER_RATE_BANDS[matter_input.firm_tier]
    partner_rate = (low + high) / 2.0
    return {
        **matter_input.model_dump(),
        "deal_value_hkd": matter_input.deal_value_hkd,
        "partner_rate_hkd": partner_rate,
        "associate_rate_hkd": partner_rate * 0.5,
        "stage_count": len(STAGE_TEMPLATES[matter_input.matter_type]),
        "stage_names": STAGE_TEMPLATES[matter_input.matter_type],
    }


def _predict_regression(bundle: Any, input_frame: pd.DataFrame) -> float:
    if bundle is None:
        return 0.0
    raw = bundle.estimator.predict(input_frame)[0]
    value = np.expm1(raw) if bundle.target_transform == "log1p" else raw
    return float(max(value, 0.0))


def _predict_probability(bundle: Any, input_frame: pd.DataFrame) -> float:
    if bundle is None:
        return 0.0
    model = bundle.estimator.named_steps["model"]
    if hasattr(model, "predict_proba"):
        return float(bundle.estimator.predict_proba(input_frame)[0, 1])
    decision = bundle.estimator.decision_function(input_frame)[0]
    return float(1 / (1 + np.exp(-decision)))


def _interval(bundle: Any, point: float, matter_input: dict[str, Any]) -> dict[str, Any]:
    quantiles, calibration_method = select_residual_quantiles(bundle, matter_input)
    segment = str(matter_input.get("matter_type", ""))
    segment_uncertainty = getattr(bundle, "segment_uncertainty", {}).get(segment)
    if segment_uncertainty is not None and segment_uncertainty > quantiles.get("absolute_p90", 0.0):
        quantiles = {
            **quantiles,
            "p10": min(quantiles["p10"], -segment_uncertainty),
            "p90": max(quantiles["p90"], segment_uncertainty),
        }
    interval = prediction_interval(point, quantiles)
    interval["calibration_method"] = calibration_method
    interval["p50"] = float(point)
    interval["p10"] = float(min(interval["p10"], interval["p50"]))
    interval["p90"] = float(max(interval["p90"], interval["p50"]))
    return interval


def select_residual_quantiles(
    bundle: Any,
    matter_input: dict[str, Any],
    *,
    min_segment_size: int = 30,
) -> tuple[dict[str, float], str]:
    fallback = getattr(bundle, "residual_quantiles", None) or {
        "p10": -0.10 * float(matter_input.get("cost_estimate", 0.0)),
        "p50": 0.0,
        "p90": 0.10 * float(matter_input.get("cost_estimate", 0.0)),
        "absolute_p90": 0.0,
    }
    segment = str(matter_input.get("matter_type", ""))
    segment_quantiles = getattr(bundle, "segment_residual_quantiles", {}).get(segment)
    if segment_quantiles and float(segment_quantiles.get("sample_size", 0.0)) >= min_segment_size:
        return segment_quantiles, "segment_residual_quantiles:matter_type"
    return fallback, "residual_quantiles"


def _input_summary(matter_input: dict[str, Any]) -> dict[str, Any]:
    keys = [
        "matter_type",
        "matter_subtype",
        "jurisdiction",
        "firm_tier",
        "client_type",
        "deal_value_hkd",
        "complexity_score",
        "billing_model",
    ]
    return {key: matter_input.get(key) for key in keys}


def _stage_estimates(
    matter_input: dict[str, Any],
    partner_hours: float,
    associate_hours: float,
    cost_estimate: float,
) -> list[dict[str, Any]]:
    stage_names = parse_json_list(matter_input.get("stage_names"))
    matter_type = str(matter_input.get("matter_type", ""))
    if stage_names and matter_type not in STAGE_TEMPLATES:
        matter_type = "Matter Work"
    return allocate_stage_estimates(
        matter_type=matter_type,
        partner_hours=partner_hours,
        associate_hours=associate_hours,
        cost_estimate=cost_estimate,
        partner_rate_hkd=float(matter_input.get("partner_rate_hkd", 0.0)),
        associate_rate_hkd=float(matter_input.get("associate_rate_hkd", 0.0)),
    )


def _fee_recommendation(matter_input: dict[str, Any], cost_estimate: float) -> dict[str, Any]:
    risk_multiplier = {"Low": 1.10, "Medium": 1.18, "High": 1.28}.get(str(matter_input.get("risk_tolerance", "Medium")), 1.18)
    recommended = max(cost_estimate * risk_multiplier, 1_000.0)
    return {
        "billing_model": matter_input.get("billing_model", "Hourly"),
        "recommended_fee_hkd": float(recommended),
        "confidence_interval_low_hkd": float(recommended * 0.85),
        "confidence_interval_high_hkd": float(recommended * 1.20),
        "partner_decision_support_disclaimer": DEFAULT_DISCLAIMER,
    }

