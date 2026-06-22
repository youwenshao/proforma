from conftest import api_request


def scope_payload(**overrides: object) -> dict[str, object]:
    payload: dict[str, object] = {
        "stage_name": "Case Assessment",
        "actual_partner_hours": 45.0,
        "actual_associate_hours": 90.0,
        "actual_cost_hkd": 225_000.0,
    }
    payload.update(overrides)
    return payload


def test_scope_update_flags_variance_above_threshold() -> None:
    response = api_request("post", "/v1/estimates/sample-estimate-v1/scope-updates", json=scope_payload())

    assert response.status_code == 200
    payload = response.json()
    assert payload["estimate_id"] == "sample-estimate-v1"
    assert payload["stage_name"] == "Case Assessment"
    assert payload["scope_creep_flag"] is True
    assert payload["variance_pct"] > 15
    assert payload["recommended_review_action"] == "critical_partner_review"


def test_scope_update_rejects_missing_stage() -> None:
    response = api_request(
        "post",
        "/v1/estimates/sample-estimate-v1/scope-updates",
        json=scope_payload(stage_name="Missing Stage"),
    )

    assert response.status_code == 404


def test_scope_update_rejects_free_text_notes_in_feasibility_mode() -> None:
    response = api_request(
        "post",
        "/v1/estimates/sample-estimate-v1/scope-updates",
        json=scope_payload(update_note="Client changed instructions"),
    )

    assert response.status_code == 422
    assert "free text" in response.json()["detail"].lower()


def test_scope_update_uses_stage_prediction_from_fixture() -> None:
    partner_hours = 27.43897319877781
    associate_hours = 54.732389561165874
    cost_hkd = 113375.10962568263

    response = api_request(
        "post",
        "/v1/estimates/sample-estimate-v1/scope-updates",
        json=scope_payload(
            actual_partner_hours=partner_hours,
            actual_associate_hours=associate_hours,
            actual_cost_hkd=cost_hkd,
        ),
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["predicted_hours"] == partner_hours + associate_hours
    assert payload["scope_creep_flag"] is False
    assert payload["recommended_review_action"] == "monitor"
