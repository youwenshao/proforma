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


def test_artifact_index_publishes_dataset_and_report_downloads() -> None:
    response = api_request("get", "/v1/models/artifacts")

    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "available"
    assert payload["dataset_id"] == DATASET_ID
    assert payload["synthetic_data"] is True

    artifacts = {artifact["artifact_id"]: artifact for artifact in payload["artifacts"]}
    dataset = artifacts["synthetic-dataset"]
    assert dataset["category"] == "dataset"
    assert dataset["available"] is True
    assert dataset["size_bytes"] > 0
    assert dataset["download_path"].endswith("disposition=attachment")
    assert artifacts["model-card-cost"]["category"] == "report"
    assert artifacts["model-bundle-total-cost"]["category"] == "model"


def test_artifact_content_downloads_the_synthetic_dataset() -> None:
    response = api_request("get", "/v1/models/artifacts/dataset-lineage/content")

    assert response.status_code == 200
    assert "attachment" in response.headers["content-disposition"]
    assert "dataset_lineage.json" in response.headers["content-disposition"]
    assert response.json()["source_marker"] == SOURCE_MARKER


def test_artifact_content_serves_inline_view_as_plain_text() -> None:
    response = api_request(
        "get", "/v1/models/artifacts/model-card-cost/content", params={"disposition": "inline"}
    )

    assert response.status_code == 200
    assert response.headers["content-type"].startswith("text/plain")
    assert "inline" in response.headers["content-disposition"]


def test_unknown_artifact_identifier_is_rejected() -> None:
    response = api_request("get", "/v1/models/artifacts/../../etc/passwd/content")

    assert response.status_code == 404


def test_missing_artifact_reports_the_rebuild_command(monkeypatch, tmp_path) -> None:
    monkeypatch.setenv("PROFORMA_ARTIFACTS_DIR", str(tmp_path))

    response = api_request("get", "/v1/models/artifacts/model-card-cost/content")

    assert response.status_code == 404
    assert "python -m ml.train" in response.json()["detail"]


def test_similar_matter_evidence_is_gated_before_data_residency_approval() -> None:
    response = api_request("get", "/v1/models/similar-matter-evidence")

    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "gated"
    assert payload["legal_gate_status"] == "data_residency_approval_required"
    assert payload["retrieval_enabled"] is False
