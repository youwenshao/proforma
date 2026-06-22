from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from proforma_data.schemas import (
    BillingModel,
    FirmTier,
    Jurisdiction,
    MatterInput,
    MatterType,
    PredictionRequest,
    PredictionResponse,
    SCHEMA_VERSION,
    StageEstimate,
)


class ApiContractModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class TaxonomyResponse(ApiContractModel):
    schema_version: Literal["proforma.matter.v1"] = SCHEMA_VERSION
    source: str
    matter_types: list[MatterType]
    subtypes_by_matter_type: dict[str, list[str]]
    jurisdictions: list[Jurisdiction]
    firm_tiers: list[FirmTier]
    billing_models: list[BillingModel]
    stage_templates: dict[str, list[str]]


RiskToleranceSetting = Literal["conservative", "balanced", "aggressive"]
ModelStrategy = Literal["firm_specific", "pooled_research", "synthetic_baseline"]


class EstimateRequest(ApiContractModel):
    tenant_id: str = Field(min_length=1)
    matter_input: MatterInput
    risk_tolerance: RiskToleranceSetting
    model_strategy: ModelStrategy


class ScopeUpdateRequest(ApiContractModel):
    stage_name: str = Field(min_length=1)
    actual_partner_hours: float = Field(ge=0)
    actual_associate_hours: float = Field(ge=0)
    actual_cost_hkd: float = Field(ge=0)
    update_note: str | None = None


class ScopeUpdateResponse(ApiContractModel):
    estimate_id: str
    stage_name: str
    predicted_hours: float
    actual_hours: float
    predicted_cost_hkd: float
    actual_cost_hkd: float
    variance_pct: float
    scope_creep_flag: bool
    reforecast_final_cost_hkd: float
    reforecast_final_hours: float
    overrun_probability: float
    recommended_review_action: str


__all__ = [
    "EstimateRequest",
    "PredictionRequest",
    "PredictionResponse",
    "ScopeUpdateRequest",
    "ScopeUpdateResponse",
    "StageEstimate",
    "TaxonomyResponse",
]
