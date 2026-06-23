from __future__ import annotations

import json
from pathlib import Path

import pandas as pd

from proforma_data.quote_benchmarks import build_quote_benchmark_artifact


def test_build_quote_benchmarks_emits_segment_metrics_and_stage_shares(tmp_path: Path) -> None:
    dataset = tmp_path / "matters.csv"
    pd.DataFrame(
        [
            {
                "matter_type": "Litigation",
                "matter_subtype": "Debt Recovery",
                "jurisdiction": "HK Only",
                "billing_model": "Fixed Fee",
                "client_type": "Financial Institution",
                "firm_tier": "Mid-tier (6-10 partners)",
                "complexity_score": 3,
                "document_volume": 120,
                "cost_variance_pct": 0.10,
                "scope_creep_flag": True,
                "total_cost_hkd": 110_000,
                "duration_days": 90,
                "realization_rate": 0.94,
                "stage_names": json.dumps(["Pleadings", "Discovery"]),
                "stage_costs": json.dumps([44_000, 66_000]),
            },
            {
                "matter_type": "Litigation",
                "matter_subtype": "Debt Recovery",
                "jurisdiction": "HK Only",
                "billing_model": "Fixed Fee",
                "client_type": "Financial Institution",
                "firm_tier": "Mid-tier (6-10 partners)",
                "complexity_score": 3,
                "document_volume": 180,
                "cost_variance_pct": 0.30,
                "scope_creep_flag": True,
                "total_cost_hkd": 130_000,
                "duration_days": 120,
                "realization_rate": 0.90,
                "stage_names": json.dumps(["Pleadings", "Discovery"]),
                "stage_costs": json.dumps([52_000, 78_000]),
            },
            {
                "matter_type": "Employment",
                "matter_subtype": "Unfair Dismissal",
                "jurisdiction": "HK Only",
                "billing_model": "Hourly",
                "client_type": "SME/Local Business",
                "firm_tier": "Small/Boutique (1-5 partners)",
                "complexity_score": 2,
                "document_volume": 80,
                "cost_variance_pct": -0.05,
                "scope_creep_flag": False,
                "total_cost_hkd": 40_000,
                "duration_days": 45,
                "realization_rate": 0.98,
                "stage_names": json.dumps(["Document Review", "Negotiation"]),
                "stage_costs": json.dumps([20_000, 20_000]),
            },
        ]
    ).to_csv(dataset, index=False)

    artifact = build_quote_benchmark_artifact(dataset, dataset_id="SYNTHETIC_MVP_V1", min_sample_size=1)

    segment = next(
        item
        for item in artifact["segments"]
        if item["filters"]
        == {
            "matter_type": "Litigation",
            "jurisdiction": "HK Only",
            "billing_model": "Fixed Fee",
        }
    )
    assert segment["segment_label"] == "Litigation / HK Only / Fixed Fee"
    assert segment["sample_size"] == 2
    assert segment["metrics"]["material_creep_rate"] == 1.0
    assert segment["metrics"]["any_overrun_rate"] == 1.0
    assert segment["metrics"]["median_cost_hkd"] == 120_000
    assert {"stage_name": "Discovery", "avg_share_pct": 60.0} in segment["stage_cost_shares"]
    assert len(segment["variance_distribution"]) == 4

    global_segment = next(item for item in artifact["segments"] if item["segment_label"] == "All matters")
    assert global_segment["sample_size"] == 3
