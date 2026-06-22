import json

from conftest import api_request


def valid_estimate_payload(model_strategy: str = "synthetic_baseline") -> dict[str, object]:
    return {
        "tenant_id": "tenant-hk-001",
        "risk_tolerance": "balanced",
        "model_strategy": model_strategy,
        "matter_input": {
            "matter_type": "Litigation",
            "matter_subtype": "Debt Recovery",
            "jurisdiction": "HK Only",
            "firm_tier": "Mid-tier (6-10 partners)",
            "client_type": "Financial Institution",
            "document_volume": 120,
            "complexity_score": 3,
            "party_count": 2,
            "cross_border_flag": False,
            "billing_model": "Fixed Fee",
            "risk_tolerance": "Medium",
        },
    }


def test_estimate_endpoint_returns_decision_support_response(monkeypatch, tmp_path) -> None:
    audit_log = tmp_path / "prediction_requests.jsonl"
    monkeypatch.setenv("PROFORMA_AUDIT_LOG_PATH", str(audit_log))

    response = api_request("post", "/v1/estimates", json=valid_estimate_payload())

    assert response.status_code == 200
    payload = response.json()
    assert payload["tenant_id"] == "tenant-hk-001"
    assert payload["model_version"]
    assert payload["dataset_lineage"]["dataset_id"]
    assert payload["decision_support_disclaimer"]
    assert payload["cost_estimate"]["p50"] > 0
    assert payload["duration_estimate"]["p50"] > 0
    assert payload["stage_estimates"]
    assert payload["fee_recommendation"]["recommended_fee_hkd"] > 0
    assert "legal advice" not in payload["decision_support_disclaimer"].lower()

    audit_event = json.loads(audit_log.read_text(encoding="utf-8").strip())
    assert audit_event["tenant_id"] == "tenant-hk-001"
    assert audit_event["estimate_id"] == payload["estimate_id"]
    assert audit_event["model_strategy"] == "synthetic_baseline"
    assert audit_event["synthetic_mode"] is True
    assert "matter_input" not in audit_event


def test_estimate_endpoint_rejects_invalid_complexity_score() -> None:
    payload = valid_estimate_payload()
    payload["matter_input"]["complexity_score"] = 6  # type: ignore[index]

    response = api_request("post", "/v1/estimates", json=payload)

    assert response.status_code == 422


def test_pooled_research_estimate_includes_legal_gate_limitation(monkeypatch, tmp_path) -> None:
    monkeypatch.setenv("PROFORMA_AUDIT_LOG_PATH", str(tmp_path / "prediction_requests.jsonl"))

    response = api_request("post", "/v1/estimates", json=valid_estimate_payload("pooled_research"))

    assert response.status_code == 200
    limitations = response.json()["limitations"]
    assert any("legal-gate" in limitation.lower() or "legally gated" in limitation.lower() for limitation in limitations)


def test_firm_specific_strategy_returns_503_when_artifacts_are_missing() -> None:
    response = api_request("post", "/v1/estimates", json=valid_estimate_payload("firm_specific"))

    assert response.status_code == 503
    assert "artifacts" in response.json()["detail"].lower()
