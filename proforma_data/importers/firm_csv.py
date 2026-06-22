"""Inactive real-firm CSV import boundary for structured feasibility data."""

from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Any, Literal

import pandas as pd
from pydantic import BaseModel, ConfigDict, Field, ValidationError

from proforma_data.schemas import MatterInput
from proforma_data.validation import is_missing

MATTER_INPUT_COLUMNS = {
    "matter_type",
    "matter_subtype",
    "jurisdiction",
    "firm_tier",
    "client_type",
    "document_volume",
    "complexity_score",
    "party_count",
    "cross_border_flag",
    "billing_model",
    "risk_tolerance",
}

HISTORICAL_LABEL_COLUMNS = {
    "historical_total_cost_hkd",
    "historical_duration_days",
    "historical_scope_creep_flag",
    "historical_outcome",
}

DIRECT_IDENTIFIER_COLUMNS = {
    "client_name",
    "client_names",
    "client_id",
    "contact_name",
    "contact_email",
    "counterparty_name",
    "email",
    "free_text_narrative",
    "matter_description",
    "matter_narrative",
    "matter_reference",
    "solicitor_email",
}

ALLOWED_COLUMNS = MATTER_INPUT_COLUMNS | HISTORICAL_LABEL_COLUMNS
EMAIL_PATTERN = re.compile(r"[\w.+-]+@[\w-]+(?:\.[\w-]+)+")
HistoricalOutcome = Literal["Settled/Completed", "Abandoned/Withdrawn", "Ongoing"]


class FirmCsvImportError(ValueError):
    """Raised when a real-firm CSV violates the inactive import boundary."""


@dataclass(frozen=True)
class FirmCsvRecord:
    matter_input: MatterInput
    historical_labels: dict[str, Any]


class HistoricalLabels(BaseModel):
    model_config = ConfigDict(extra="forbid")

    historical_total_cost_hkd: float = Field(gt=0)
    historical_duration_days: int = Field(gt=0)
    historical_scope_creep_flag: bool
    historical_outcome: HistoricalOutcome


def normalize_firm_csv(df: pd.DataFrame, *, feasibility_mode: bool = True) -> list[FirmCsvRecord]:
    missing_columns = sorted(ALLOWED_COLUMNS - set(df.columns))
    if missing_columns:
        raise FirmCsvImportError(f"missing required columns: {missing_columns}")

    unexpected_columns = sorted(set(df.columns) - ALLOWED_COLUMNS)
    direct_identifier_columns = [column for column in unexpected_columns if column in DIRECT_IDENTIFIER_COLUMNS]
    if direct_identifier_columns:
        raise FirmCsvImportError(f"direct identifier columns are not allowed: {direct_identifier_columns}")
    if unexpected_columns:
        raise FirmCsvImportError(f"unsupported columns: {unexpected_columns}")

    if feasibility_mode:
        _reject_emails(df)

    records: list[FirmCsvRecord] = []
    for index, row in df.iterrows():
        input_payload = {
            column: None if is_missing(row[column]) else row[column]
            for column in MATTER_INPUT_COLUMNS
        }
        historical_labels = {
            column: None if is_missing(row[column]) else row[column]
            for column in HISTORICAL_LABEL_COLUMNS
        }
        try:
            matter_input = MatterInput(**input_payload)
            labels = HistoricalLabels(**historical_labels)
        except ValidationError as exc:
            raise FirmCsvImportError(f"row {index} violates structured historical label or MatterInput contract: {exc}") from exc
        records.append(FirmCsvRecord(matter_input=matter_input, historical_labels=labels.model_dump()))
    return records


def _reject_emails(df: pd.DataFrame) -> None:
    for column in df.columns:
        for value in df[column].dropna():
            if isinstance(value, str) and EMAIL_PATTERN.search(value):
                raise FirmCsvImportError(f"email addresses are not allowed in feasibility mode: {column}")
