from conftest import api_request


def test_health_endpoint_returns_service_status() -> None:
    response = api_request("get", "/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "proforma-api"}
