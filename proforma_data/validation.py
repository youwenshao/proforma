"""Reusable dataset validation helpers."""

from __future__ import annotations

import json
import math
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import pandas as pd

REQUIRED_FIELDS = [
    "matter_id",
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
    "partner_hours",
    "associate_hours",
    "total_hours",
    "stage_count",
    "stage_names",
    "stage_partner_hours",
    "stage_associate_hours",
    "stage_costs",
    "total_cost_hkd",
    "predicted_cost_hkd",
    "billed_amount_hkd",
    "realization_rate",
    "cost_variance_pct",
    "scope_creep_flag",
    "scope_creep_pct",
    "duration_days",
    "outcome",
    "billing_model",
    "prc_cost_estimate_cny",
    "data_source",
]

LIST_FIELDS = {"stage_names", "stage_partner_hours", "stage_associate_hours", "stage_costs"}
BOOL_FIELDS = {"cross_border_flag", "scope_creep_flag"}


@dataclass(frozen=True)
class ValidationIssue:
    name: str
    detail: str
    severity: str = "critical"


@dataclass(frozen=True)
class DatasetValidationResult:
    passed: bool
    issues: list[ValidationIssue]


def is_missing(value: Any) -> bool:
    if value is None:
        return True
    if isinstance(value, float) and math.isnan(value):
        return True
    if value == "":
        return True
    return False


def parse_list_value(value: Any) -> list[Any]:
    if isinstance(value, list):
        return value
    if is_missing(value):
        return []
    if isinstance(value, str):
        parsed = json.loads(value)
        if not isinstance(parsed, list):
            raise ValueError("expected JSON list")
        return parsed
    raise ValueError(f"expected list-like value, got {type(value).__name__}")


def parse_bool_value(value: Any) -> bool | None:
    if is_missing(value):
        return None
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        normalized = value.strip().lower()
        if normalized in {"true", "1", "yes"}:
            return True
        if normalized in {"false", "0", "no"}:
            return False
    return bool(value)


def normalize_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    normalized = df.copy()
    for field in LIST_FIELDS.intersection(normalized.columns):
        normalized[field] = normalized[field].map(parse_list_value)
    for field in BOOL_FIELDS.intersection(normalized.columns):
        normalized[field] = normalized[field].map(parse_bool_value)
    return normalized


def validate_dataframe(df: pd.DataFrame) -> DatasetValidationResult:
    issues: list[ValidationIssue] = []
    missing_fields = [field for field in REQUIRED_FIELDS if field not in df.columns]
    if missing_fields:
        issues.append(ValidationIssue("Required fields present", f"missing={missing_fields}"))
        return DatasetValidationResult(passed=False, issues=issues)

    normalized = normalize_dataframe(df)

    stage_sum_bad = 0
    stage_formula_bad = 0
    ratio_bad = 0
    gba_prc_bad = 0
    hk_prc_bad = 0
    multi_prc_bad = 0
    outcome_related_bad = 0
    required_value_bad = 0

    for _, row in normalized.iterrows():
        for field in REQUIRED_FIELDS:
            if field in {"deal_value_hkd", "scope_creep_flag", "scope_creep_pct", "prc_cost_estimate_cny"}:
                continue
            if is_missing(row[field]):
                required_value_bad += 1
                break

        stage_costs = parse_list_value(row["stage_costs"])
        stage_partner_hours = parse_list_value(row["stage_partner_hours"])
        stage_associate_hours = parse_list_value(row["stage_associate_hours"])
        total_cost = float(row["total_cost_hkd"])
        tolerance = max(0.01, abs(total_cost) * 0.0001)

        if abs(sum(float(value) for value in stage_costs) - total_cost) > tolerance:
            stage_sum_bad += 1

        for idx, stage_cost in enumerate(stage_costs):
            formula = (
                float(stage_partner_hours[idx]) * float(row["partner_rate_hkd"])
                + float(stage_associate_hours[idx]) * float(row["associate_rate_hkd"])
            )
            if abs(float(stage_cost) - formula) > 0.02:
                stage_formula_bad += 1

        if float(row["partner_rate_hkd"]) < 1.5 * float(row["associate_rate_hkd"]):
            ratio_bad += 1

        prc_estimate_missing = is_missing(row["prc_cost_estimate_cny"])
        if row["jurisdiction"] == "GBA Cross-Border (HK-PRC)" and prc_estimate_missing:
            gba_prc_bad += 1
        if row["jurisdiction"] == "HK Only" and not prc_estimate_missing:
            hk_prc_bad += 1
        if row["jurisdiction"] == "Multi-Jurisdictional (APAC)" and not prc_estimate_missing:
            multi_prc_bad += 1
        if row["billing_model"] == "Outcome Related" and row["matter_type"] != "Arbitration":
            outcome_related_bad += 1

    if required_value_bad:
        issues.append(ValidationIssue("Required values present", f"bad_records={required_value_bad}"))
    if stage_sum_bad:
        issues.append(ValidationIssue("Stage costs sum to total_cost", f"bad_records={stage_sum_bad}"))
    if stage_formula_bad:
        issues.append(ValidationIssue("Stage-level cost formula", f"bad_stage_entries={stage_formula_bad}"))
    if ratio_bad:
        issues.append(ValidationIssue("Partner/associate rate ratio", f"bad_records={ratio_bad}"))
    if gba_prc_bad:
        issues.append(ValidationIssue("GBA cross-border PRC estimate rule", f"bad_records={gba_prc_bad}"))
    if hk_prc_bad:
        issues.append(ValidationIssue("HK-only PRC estimate NULL rule", f"bad_records={hk_prc_bad}"))
    if multi_prc_bad:
        issues.append(ValidationIssue("Multi-jurisdictional PRC estimate NULL rule", f"bad_records={multi_prc_bad}"))
    if outcome_related_bad:
        issues.append(ValidationIssue("Outcome Related arbitration-only rule", f"bad_records={outcome_related_bad}"))

    return DatasetValidationResult(passed=not issues, issues=issues)


def dataframe_to_records(df: pd.DataFrame) -> list[dict[str, Any]]:
    normalized = normalize_dataframe(df)
    records: list[dict[str, Any]] = []
    for record in normalized.to_dict(orient="records"):
        records.append({key: None if is_missing(value) else value for key, value in record.items()})
    return records


def load_dataset(path: Path | str) -> tuple[pd.DataFrame, list[dict[str, Any]]]:
    df = pd.read_csv(path)
    return df, dataframe_to_records(df)


def write_basic_validation_report(path: Path | str, result: DatasetValidationResult, record_count: int) -> None:
    status = "PASS" if result.passed else "FAIL"
    lines = [
        "# Validation Report",
        "",
        "## Headline Results",
        "",
        f"- Records evaluated: {record_count:,}",
        f"- Overall validation status: {status}",
        "",
        "## Residual Anomalies",
        "",
    ]
    if result.issues:
        lines.extend(f"- {issue.name}: {issue.detail}" for issue in result.issues)
    else:
        lines.append("- None.")
    Path(path).write_text("\n".join(lines) + "\n", encoding="utf-8")

