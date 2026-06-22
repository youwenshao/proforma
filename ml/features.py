"""Leakage-safe feature engineering for ProForma baseline models."""

from __future__ import annotations

import json
from dataclasses import dataclass
from typing import Any

import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

ALLOWED_INPUT_FEATURES = [
    "matter_type",
    "matter_subtype",
    "jurisdiction",
    "firm_tier",
    "client_type",
    "deal_value_hkd",
    "document_volume",
    "complexity_score",
    "party_count",
    "cross_border_flag",
    "partner_rate_hkd",
    "associate_rate_hkd",
    "billing_model",
    "stage_count",
]

LEAKAGE_FIELDS = {
    "total_cost_hkd",
    "billed_amount_hkd",
    "realization_rate",
    "cost_variance_pct",
    "scope_creep_flag",
    "scope_creep_pct",
    "duration_days",
    "partner_hours",
    "associate_hours",
    "stage_partner_hours",
    "stage_associate_hours",
    "stage_costs",
    "outcome",
}

CATEGORICAL_FEATURES = [
    "matter_type",
    "matter_subtype",
    "jurisdiction",
    "firm_tier",
    "client_type",
    "billing_model",
]

NUMERIC_FEATURES = [
    "deal_value_hkd",
    "document_volume",
    "complexity_score",
    "party_count",
    "cross_border_flag",
    "partner_rate_hkd",
    "associate_rate_hkd",
    "stage_count",
]


@dataclass(frozen=True)
class FeatureContract:
    input_features: list[str]
    categorical_features: list[str]
    numeric_features: list[str]
    leakage_fields: list[str]


def feature_contract() -> FeatureContract:
    return FeatureContract(
        input_features=list(ALLOWED_INPUT_FEATURES),
        categorical_features=list(CATEGORICAL_FEATURES),
        numeric_features=list(NUMERIC_FEATURES),
        leakage_fields=sorted(LEAKAGE_FIELDS),
    )


def assert_no_leakage(features: list[str]) -> None:
    leaking = sorted(set(features).intersection(LEAKAGE_FIELDS))
    if leaking:
        raise ValueError(f"Feature contract includes leakage fields: {leaking}")


def records_to_frame(records: list[dict[str, Any]] | pd.DataFrame) -> pd.DataFrame:
    frame = records.copy() if isinstance(records, pd.DataFrame) else pd.DataFrame(records)
    missing = [feature for feature in ALLOWED_INPUT_FEATURES if feature not in frame.columns]
    if missing:
        raise ValueError(f"Missing required model input features: {missing}")
    return normalize_feature_frame(frame)


def normalize_feature_frame(frame: pd.DataFrame) -> pd.DataFrame:
    normalized = frame.copy()
    for feature in ALLOWED_INPUT_FEATURES:
        if feature not in normalized.columns:
            normalized[feature] = np.nan
    normalized["cross_border_flag"] = normalized["cross_border_flag"].map(parse_bool).astype(float)
    normalized["deal_value_hkd"] = pd.to_numeric(normalized["deal_value_hkd"], errors="coerce")
    for feature in NUMERIC_FEATURES:
        normalized[feature] = pd.to_numeric(normalized[feature], errors="coerce")
    for feature in CATEGORICAL_FEATURES:
        normalized[feature] = normalized[feature].fillna("Unknown").astype(str)
    return normalized[ALLOWED_INPUT_FEATURES]


def parse_bool(value: Any) -> bool:
    if isinstance(value, bool):
        return value
    if value is None or (isinstance(value, float) and np.isnan(value)):
        return False
    if isinstance(value, str):
        return value.strip().lower() in {"true", "1", "yes"}
    return bool(value)


def parse_json_list(value: Any) -> list[Any]:
    if isinstance(value, list):
        return value
    if value is None or (isinstance(value, float) and np.isnan(value)) or value == "":
        return []
    if isinstance(value, str):
        parsed = json.loads(value)
        if isinstance(parsed, list):
            return parsed
    raise ValueError("expected JSON list")


def make_preprocessor() -> ColumnTransformer:
    numeric_pipeline = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
        ]
    )
    categorical_pipeline = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=False)),
        ]
    )
    return ColumnTransformer(
        transformers=[
            ("numeric", numeric_pipeline, NUMERIC_FEATURES),
            ("categorical", categorical_pipeline, CATEGORICAL_FEATURES),
        ]
    )


def target_vector(records: list[dict[str, Any]] | pd.DataFrame, target: str) -> np.ndarray:
    frame = records.copy() if isinstance(records, pd.DataFrame) else pd.DataFrame(records)
    if target not in frame.columns:
        raise ValueError(f"Missing target column: {target}")
    return pd.to_numeric(frame[target], errors="coerce").to_numpy()


def build_feature_matrix(
    records: list[dict[str, Any]] | pd.DataFrame,
    target: str,
) -> tuple[np.ndarray, np.ndarray, FeatureContract]:
    contract = feature_contract()
    assert_no_leakage(contract.input_features)
    frame = records_to_frame(records)
    matrix = make_preprocessor().fit_transform(frame)
    return matrix, target_vector(records, target), contract


def feature_names(preprocessor: ColumnTransformer) -> list[str]:
    try:
        return [str(name) for name in preprocessor.get_feature_names_out()]
    except Exception:
        return list(ALLOWED_INPUT_FEATURES)

