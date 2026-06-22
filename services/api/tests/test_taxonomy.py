from conftest import api_request
from proforma_data.domain import BILLING_MODELS, FIRM_TIERS, JURISDICTIONS, MATTER_SUBTYPES, MATTER_TYPES, STAGE_TEMPLATES
from proforma_data.schemas import SCHEMA_VERSION


def test_taxonomy_endpoint_exposes_phase_one_domain_constants() -> None:
    response = api_request("get", "/v1/taxonomy")

    assert response.status_code == 200
    payload = response.json()
    assert payload["schema_version"] == SCHEMA_VERSION
    assert payload["source"] == "proforma_data.domain"
    assert payload["matter_types"] == MATTER_TYPES
    assert payload["subtypes_by_matter_type"] == MATTER_SUBTYPES
    assert payload["jurisdictions"] == JURISDICTIONS
    assert payload["firm_tiers"] == FIRM_TIERS
    assert payload["billing_models"] == BILLING_MODELS
    assert payload["stage_templates"] == STAGE_TEMPLATES
