"""Versioned Pydantic schemas for ProForma data contracts."""

from __future__ import annotations

import json
import sys
from datetime import UTC, datetime
from pathlib import Path
from typing import Literal, Self

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

from proforma_data.domain import (
    BILLING_MODELS,
    CLIENT_TYPES,
    FIRM_TIERS,
    JURISDICTIONS,
    MATTER_SUBTYPES,
    MATTER_TYPES,
)

SCHEMA_VERSION = "proforma.matter.v1"
DEFAULT_DISCLAIMER = (
    "This recommendation is decision-support only; a responsible partner must "
    "review matter context, professional obligations, and client instructions before use."
)

SchemaVersion = Literal["proforma.matter.v1"]
MatterType = Literal[
    "M&A",
    "Litigation",
    "Commercial Property",
    "Employment",
    "IP/Technology",
    "Corporate Restructuring",
    "Banking & Finance",
    "Wills & Probate",
    "Regulatory/Compliance",
    "Arbitration",
]
Jurisdiction = Literal["HK Only", "GBA Cross-Border (HK-PRC)", "Multi-Jurisdictional (APAC)"]
FirmTier = Literal[
    "Magic Circle / International",
    "PRC Elite Firm in HK",
    "Large Local (11+ partners)",
    "Mid-tier (6-10 partners)",
    "Small/Boutique (1-5 partners)",
]
ClientType = Literal[
    "Mainland Enterprise",
    "HK Listed Co.",
    "SME/Local Business",
    "Individual",
    "Financial Institution",
    "SOE",
]
BillingModel = Literal["Hourly", "Fixed Fee", "Capped Fee", "Retainer", "Outcome Related"]
RiskTolerance = Literal["Low", "Medium", "High"]
ModelStrategy = Literal["firm_specific", "pooled_research", "synthetic_baseline"]
DEAL_VALUE_MATTER_TYPES = {"M&A", "Commercial Property", "Corporate Restructuring", "Banking & Finance"}


class ContractModel(BaseModel):
    """Base model for strict data contracts."""

    model_config = ConfigDict(extra="forbid", validate_assignment=True)


class MatterInput(ContractModel):
    schema_version: SchemaVersion = SCHEMA_VERSION
    matter_type: MatterType
    matter_subtype: str
    jurisdiction: Jurisdiction
    firm_tier: FirmTier
    client_type: ClientType
    deal_value_hkd: float | None = Field(default=None, gt=0)
    document_volume: int = Field(gt=0)
    complexity_score: int = Field(ge=1, le=5)
    party_count: int = Field(gt=0)
    cross_border_flag: bool
    billing_model: BillingModel
    risk_tolerance: RiskTolerance

    @field_validator("matter_type")
    @classmethod
    def validate_matter_type(cls, value: str) -> str:
        if value not in MATTER_TYPES:
            raise ValueError(f"Unknown matter_type: {value}")
        return value

    @field_validator("jurisdiction")
    @classmethod
    def validate_jurisdiction(cls, value: str) -> str:
        if value not in JURISDICTIONS:
            raise ValueError(f"Unknown jurisdiction: {value}")
        return value

    @field_validator("firm_tier")
    @classmethod
    def validate_firm_tier(cls, value: str) -> str:
        if value not in FIRM_TIERS:
            raise ValueError(f"Unknown firm_tier: {value}")
        return value

    @field_validator("client_type")
    @classmethod
    def validate_client_type(cls, value: str) -> str:
        if value not in CLIENT_TYPES:
            raise ValueError(f"Unknown client_type: {value}")
        return value

    @field_validator("billing_model")
    @classmethod
    def validate_billing_model(cls, value: str) -> str:
        if value not in BILLING_MODELS:
            raise ValueError(f"Unknown billing_model: {value}")
        return value

    @field_validator("risk_tolerance")
    @classmethod
    def validate_risk_tolerance(cls, value: str) -> str:
        if value not in {"Low", "Medium", "High"}:
            raise ValueError("risk_tolerance must be Low, Medium, or High")
        return value

    @model_validator(mode="after")
    def validate_cross_field_semantics(self) -> Self:
        if self.matter_subtype not in MATTER_SUBTYPES[self.matter_type]:
            raise ValueError("matter_subtype must belong to matter_type")
        expected_cross_border = self.jurisdiction != "HK Only"
        if self.cross_border_flag is not expected_cross_border:
            raise ValueError("cross_border_flag must agree with jurisdiction")
        if self.billing_model == "Outcome Related" and self.matter_type != "Arbitration":
            raise ValueError("Outcome Related billing is arbitration-only")
        if self.deal_value_hkd is not None and self.matter_type not in DEAL_VALUE_MATTER_TYPES:
            raise ValueError("deal_value_hkd is only allowed for transactional matter types")
        return self

    @classmethod
    def write_json_schemas(cls, output_dir: Path | str = "schemas") -> None:
        export_json_schemas(output_dir)


class StageEstimate(ContractModel):
    stage_name: str
    partner_hours: float = Field(ge=0)
    associate_hours: float = Field(ge=0)
    cost_hkd: float = Field(ge=0)


class ScopeVariance(ContractModel):
    scope_creep_flag: bool | None
    cost_variance_pct: float | None = None
    scope_creep_pct: float | None = None


class FeeRecommendation(ContractModel):
    schema_version: SchemaVersion = SCHEMA_VERSION
    billing_model: BillingModel
    recommended_fee_hkd: float = Field(gt=0)
    confidence_interval_low_hkd: float = Field(gt=0)
    confidence_interval_high_hkd: float = Field(gt=0)
    cap_amount_hkd: float | None = Field(default=None, gt=0)
    expected_downside_hkd: float | None = Field(default=None, ge=0)
    expected_margin_hkd: float | None = None
    downside_risk_hkd: float | None = Field(default=None, ge=0)
    margin_pct: float | None = None
    pricing_guardrails: list[str] = Field(default_factory=list)
    partner_decision_support_disclaimer: str = DEFAULT_DISCLAIMER

    @field_validator("billing_model")
    @classmethod
    def validate_billing_model(cls, value: str) -> str:
        if value not in BILLING_MODELS:
            raise ValueError(f"Unknown billing_model: {value}")
        return value

    @model_validator(mode="after")
    def validate_interval(self) -> Self:
        if not self.confidence_interval_low_hkd <= self.recommended_fee_hkd <= self.confidence_interval_high_hkd:
            raise ValueError("recommended_fee_hkd must fall inside confidence interval")
        return self


class MatterEstimate(ContractModel):
    schema_version: SchemaVersion = SCHEMA_VERSION
    matter_input: MatterInput
    predicted_cost_hkd: float = Field(gt=0)
    confidence_interval_low_hkd: float = Field(gt=0)
    confidence_interval_high_hkd: float = Field(gt=0)
    duration_days: int = Field(gt=0)
    stage_estimates: list[StageEstimate]
    fee_recommendation: FeeRecommendation | None = None
    scope_variance: ScopeVariance | None = None

    @model_validator(mode="after")
    def validate_interval(self) -> Self:
        if not self.confidence_interval_low_hkd <= self.predicted_cost_hkd <= self.confidence_interval_high_hkd:
            raise ValueError("predicted_cost_hkd must fall inside confidence interval")
        return self


class ModelEvaluation(ContractModel):
    schema_version: SchemaVersion = SCHEMA_VERSION
    dataset_id: str
    model_version: str
    metrics: dict[str, float]
    limitations: list[str]
    generated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))


class DataLineage(ContractModel):
    dataset_id: str
    schema_version: SchemaVersion = SCHEMA_VERSION
    source_marker: str
    random_seed: int
    record_count: int
    generated_at: datetime
    generator_version: str
    feature_version: str
    validation_report_path: str


class EstimateInterval(ContractModel):
    p10: float = Field(ge=0)
    p50: float = Field(ge=0)
    p90: float = Field(ge=0)
    confidence_level: float = Field(gt=0, le=1)
    calibration_method: str

    @model_validator(mode="after")
    def validate_order(self) -> Self:
        if not self.p10 <= self.p50 <= self.p90:
            raise ValueError("estimate interval must satisfy p10 <= p50 <= p90")
        return self


class PredictionResponse(ContractModel):
    estimate_id: str
    tenant_id: str
    model_version: str
    dataset_lineage: dict[str, str]
    input_summary: dict[str, str | int | float | bool | None]
    cost_estimate: EstimateInterval
    duration_estimate: EstimateInterval
    scope_creep_probability: float = Field(ge=0, le=1)
    stage_estimates: list[StageEstimate]
    fee_recommendation: FeeRecommendation
    decision_support_disclaimer: str
    limitations: list[str]


class PredictionRequest(ContractModel):
    tenant_id: str
    matter_input: MatterInput
    risk_tolerance: RiskTolerance
    model_strategy: ModelStrategy

    @model_validator(mode="after")
    def apply_top_level_risk_tolerance(self) -> Self:
        self.matter_input.risk_tolerance = self.risk_tolerance
        return self


SCHEMA_EXPORTS: dict[str, type[BaseModel]] = {
    "matter-input.schema.json": MatterInput,
    "matter-estimate.schema.json": MatterEstimate,
    "model-evaluation.schema.json": ModelEvaluation,
}


def export_json_schemas(output_dir: Path | str = "schemas") -> None:
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)
    for filename, model in SCHEMA_EXPORTS.items():
        schema = model.model_json_schema()
        (output_path / filename).write_text(json.dumps(schema, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def main(argv: list[str] | None = None) -> int:
    args = list(sys.argv[1:] if argv is None else argv)
    if args == ["export-json-schema"]:
        export_json_schemas()
        return 0
    print("Usage: python -m proforma_data.schemas export-json-schema", file=sys.stderr)
    return 2


if __name__ == "__main__":
    raise SystemExit(main())

