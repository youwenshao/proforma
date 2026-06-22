import json
from pathlib import Path


def test_exported_openapi_contract_contains_phase_three_endpoints() -> None:
    contract_path = Path("services/api/openapi.json")

    assert contract_path.exists()
    contract = json.loads(contract_path.read_text(encoding="utf-8"))
    assert "/v1/taxonomy" in contract["paths"]
    assert "/v1/estimates" in contract["paths"]
    assert "/v1/estimates/{estimate_id}/scope-updates" in contract["paths"]
    assert "/v1/models/current" in contract["paths"]
    assert "MatterInput" in contract["components"]["schemas"]
    assert "decision_support_disclaimer" in json.dumps(contract)
