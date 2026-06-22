from __future__ import annotations

from fastapi import APIRouter

from proforma_data.domain import BILLING_MODELS, FIRM_TIERS, JURISDICTIONS, MATTER_SUBTYPES, MATTER_TYPES, STAGE_TEMPLATES
from proforma_data.schemas import SCHEMA_VERSION
from services.api.app.schemas import TaxonomyResponse

router = APIRouter(prefix="/v1", tags=["taxonomy"])


@router.get("/taxonomy", response_model=TaxonomyResponse)
def get_taxonomy() -> TaxonomyResponse:
    return TaxonomyResponse(
        schema_version=SCHEMA_VERSION,
        source="proforma_data.domain",
        matter_types=MATTER_TYPES,
        subtypes_by_matter_type=MATTER_SUBTYPES,
        jurisdictions=JURISDICTIONS,
        firm_tiers=FIRM_TIERS,
        billing_models=BILLING_MODELS,
        stage_templates=STAGE_TEMPLATES,
    )
