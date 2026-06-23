from __future__ import annotations

import json
from datetime import UTC, datetime

from conftest import api_request
from test_estimates import valid_estimate_payload


def test_quote_substantiation_uses_precomputed_matching_benchmark(monkeypatch, tmp_path) -> None:
    benchmark_path = tmp_path / "quote_benchmarks.json"
    benchmark_path.write_text(
        json.dumps(
            {
                "schema_version": "proforma.quote_benchmarks.v1",
                "dataset_id": "SYNTHETIC_MVP_V1",
                "generated_at": datetime.now(UTC).isoformat(),
                "segments": [
                    {
                        "dimensions": ["matter_type", "jurisdiction", "billing_model"],
                        "filters": {
                            "matter_type": "Litigation",
                            "jurisdiction": "HK Only",
                            "billing_model": "Fixed Fee",
                        },
                        "segment_label": "Litigation / HK Only / Fixed Fee",
                        "sample_size": 77,
                        "metrics": {
                            "material_creep_rate": 0.64,
                            "any_overrun_rate": 0.78,
                            "median_variance_pct": 0.123,
                            "p75_variance_pct": 0.268,
                            "p90_variance_pct": 0.505,
                            "median_cost_hkd": 572646.0,
                            "median_duration_days": 257.0,
                            "median_realization_rate": 0.94,
                        },
                        "stage_cost_shares": [
                            {"stage_name": "Discovery", "avg_share_pct": 26.0},
                            {"stage_name": "Pleadings", "avg_share_pct": 22.6},
                        ],
                        "variance_distribution": [
                            {"bucket": "<=0%", "share_pct": 22.0},
                            {"bucket": "0-25%", "share_pct": 38.0},
                            {"bucket": "25-50%", "share_pct": 24.0},
                            {"bucket": ">50%", "share_pct": 16.0},
                        ],
                    }
                ],
            },
            sort_keys=True,
        ),
        encoding="utf-8",
    )
    monkeypatch.setenv("PROFORMA_QUOTE_BENCHMARKS_PATH", str(benchmark_path))
    monkeypatch.setenv("PROFORMA_AUDIT_LOG_PATH", str(tmp_path / "prediction_requests.jsonl"))
    monkeypatch.setenv("PROFORMA_ESTIMATE_STORE_DIR", str(tmp_path / "estimates"))

    create_response = api_request("post", "/v1/estimates", json=valid_estimate_payload())
    estimate_id = create_response.json()["estimate_id"]

    response = api_request("get", f"/v1/estimates/{estimate_id}/quote-substantiation")

    assert response.status_code == 200
    payload = response.json()
    assert payload["estimate_id"] == estimate_id
    assert payload["benchmark_segment"]["segment_label"] == "Litigation / HK Only / Fixed Fee"
    assert payload["benchmark_segment"]["sample_size"] == 77
    assert any(metric["label"] == "Material scope-creep rate" and metric["display_value"] == "64.0%" for metric in payload["metrics"])
    assert any(chart["chart_type"] == "variance_distribution" for chart in payload["chart_specs"])
    assert any(chart["chart_type"] == "stage_cost_share" for chart in payload["chart_specs"])
    assert any("partner final decision" in guardrail.lower() for guardrail in payload["assumptions_and_guardrails"])


def test_quote_substantiation_pdf_is_rendered_server_side(monkeypatch, tmp_path) -> None:
    benchmark_path = tmp_path / "quote_benchmarks.json"
    benchmark_path.write_text(
        json.dumps(
            {
                "schema_version": "proforma.quote_benchmarks.v1",
                "dataset_id": "SYNTHETIC_MVP_V1",
                "generated_at": datetime.now(UTC).isoformat(),
                "segments": [
                    {
                        "dimensions": ["matter_type", "jurisdiction", "billing_model"],
                        "filters": {
                            "matter_type": "Litigation",
                            "jurisdiction": "HK Only",
                            "billing_model": "Fixed Fee",
                        },
                        "segment_label": "Litigation / HK Only / Fixed Fee",
                        "sample_size": 4000,
                        "metrics": {
                            "material_creep_rate": 0.514,
                            "any_overrun_rate": 0.705,
                            "median_variance_pct": 0.062,
                            "p75_variance_pct": 0.261,
                            "p90_variance_pct": 0.491,
                            "median_cost_hkd": 500000.0,
                            "median_duration_days": 120.0,
                            "median_realization_rate": 0.94,
                        },
                        "stage_cost_shares": [],
                        "variance_distribution": [],
                    }
                ],
            },
            sort_keys=True,
        ),
        encoding="utf-8",
    )
    monkeypatch.setenv("PROFORMA_QUOTE_BENCHMARKS_PATH", str(benchmark_path))
    monkeypatch.setenv("PROFORMA_AUDIT_LOG_PATH", str(tmp_path / "prediction_requests.jsonl"))
    monkeypatch.setenv("PROFORMA_ESTIMATE_STORE_DIR", str(tmp_path / "estimates"))

    create_response = api_request("post", "/v1/estimates", json=valid_estimate_payload())
    estimate_id = create_response.json()["estimate_id"]

    response = api_request("get", f"/v1/estimates/{estimate_id}/quote-substantiation.pdf")

    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"
    assert f"quote-substantiation-{estimate_id}.pdf" in response.headers["content-disposition"]
    assert response.content.startswith(b"%PDF-")
    assert b"Quote Substantiation Pack" in response.content
    assert estimate_id.encode("ascii") in response.content
    assert b"Decision-support evidence for partner review" not in response.content
    assert b"Matter Type" in response.content
    assert b"Litigation" in response.content
    assert b"Jurisdiction" in response.content
    assert b"HK Only" in response.content
    assert b"Billing Model" in response.content
    assert b"Fixed Fee" in response.content
    assert b"Matter Type + Jurisdiction + Billing Model" in response.content
    assert b"/Count 2" in response.content
    assert b"Comparable Matter Benchmarks" in response.content
    assert b"Material scope-creep rate" in response.content
    assert b"/F2" in response.content
    assert b"Benchmark Snapshot" in response.content
    assert b"Risk Indicators" in response.content
    assert b"re S" in response.content


def test_quote_pack_render_stores_pdf_metadata_and_binary(monkeypatch, tmp_path) -> None:
    benchmark_path = tmp_path / "quote_benchmarks.json"
    benchmark_path.write_text(
        json.dumps(
            {
                "schema_version": "proforma.quote_benchmarks.v1",
                "dataset_id": "SYNTHETIC_MVP_V1",
                "generated_at": datetime.now(UTC).isoformat(),
                "segments": [
                    {
                        "dimensions": [],
                        "filters": {},
                        "segment_label": "All matters",
                        "sample_size": 4000,
                        "metrics": {
                            "material_creep_rate": 0.514,
                            "any_overrun_rate": 0.705,
                            "median_variance_pct": 0.062,
                            "p75_variance_pct": 0.261,
                            "p90_variance_pct": 0.491,
                            "median_cost_hkd": 500000.0,
                            "median_duration_days": 120.0,
                            "median_realization_rate": 0.94,
                        },
                        "stage_cost_shares": [],
                        "variance_distribution": [],
                    }
                ],
            },
            sort_keys=True,
        ),
        encoding="utf-8",
    )
    storage_dir = tmp_path / "quote-pack-storage"
    monkeypatch.setenv("PROFORMA_QUOTE_BENCHMARKS_PATH", str(benchmark_path))
    monkeypatch.setenv("PROFORMA_QUOTE_PACK_STORAGE_DIR", str(storage_dir))
    monkeypatch.setenv("PROFORMA_AUDIT_LOG_PATH", str(tmp_path / "prediction_requests.jsonl"))
    monkeypatch.setenv("PROFORMA_ESTIMATE_STORE_DIR", str(tmp_path / "estimates"))

    create_response = api_request("post", "/v1/estimates", json=valid_estimate_payload())
    estimate_id = create_response.json()["estimate_id"]

    response = api_request("post", f"/v1/estimates/{estimate_id}/quote-packs/render")

    assert response.status_code == 200
    payload = response.json()
    assert payload["estimate_id"] == estimate_id
    assert payload["status"] == "rendered"
    assert payload["storage_backend"] == "local"
    assert payload["storage_path"].endswith(".pdf")
    assert payload["checksum_sha256"]
    assert payload["file_size_bytes"] > 0
    stored_pdf = storage_dir / payload["storage_path"]
    assert stored_pdf.exists()
    assert stored_pdf.read_bytes().startswith(b"%PDF-")


def test_quote_substantiation_returns_404_for_unknown_estimate(monkeypatch, tmp_path) -> None:
    monkeypatch.setenv("PROFORMA_ESTIMATE_STORE_DIR", str(tmp_path / "estimates"))
    monkeypatch.setenv("PROFORMA_QUOTE_BENCHMARKS_PATH", str(tmp_path / "quote_benchmarks.json"))

    response = api_request("get", "/v1/estimates/missing-estimate/quote-substantiation")

    assert response.status_code == 404
    assert "estimate" in response.json()["detail"].lower()
