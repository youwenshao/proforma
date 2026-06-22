from conftest import api_request
from ml.config import MODEL_VERSION
from proforma_data.lineage import DATASET_ID, FEATURE_VERSION, SOURCE_MARKER


def test_current_model_endpoint_includes_version_lineage_and_synthetic_flag() -> None:
    response = api_request("get", "/v1/models/current")

    assert response.status_code == 200
    payload = response.json()
    assert payload["model_version"] == MODEL_VERSION
    assert payload["feature_version"] == FEATURE_VERSION
    assert payload["dataset_lineage"]["dataset_id"] == DATASET_ID
    assert payload["dataset_lineage"]["source_marker"] == SOURCE_MARKER
    assert payload["synthetic_data"] is True


def test_model_evaluation_surfaces_metrics_by_matter_type() -> None:
    response = api_request("get", "/v1/models/evaluation")

    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "available"
    assert "Litigation" in payload["metrics_by_matter_type"]
    assert "mae" in payload["metrics_by_matter_type"]["Litigation"]


def test_strategy_comparison_includes_gated_pooled_and_firm_tracks() -> None:
    response = api_request("get", "/v1/models/strategy-comparison")

    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "available"
    assert "firm_specific" in payload["tracks"]
    assert "pooled_research" in payload["tracks"]
    assert payload["tracks"]["pooled_research"]["legal_gate_status"] == "legally_gated"


def test_model_evaluation_returns_not_available_when_reports_are_missing(monkeypatch, tmp_path) -> None:
    monkeypatch.setenv("PROFORMA_ARTIFACTS_DIR", str(tmp_path))

    response = api_request("get", "/v1/models/evaluation")

    assert response.status_code == 200
    assert response.json()["status"] == "not_available"
