from __future__ import annotations

from pathlib import Path

import pandas as pd
import pytest

from proforma_data.pitch_evidence import build_pitch_evidence_chart


def _row(variance: float, *, scope_creep: bool, outcome: str = "Settled/Completed") -> dict[str, object]:
    return {
        "outcome": outcome,
        "cost_variance_pct": variance,
        "scope_creep_flag": scope_creep,
    }


def test_build_pitch_evidence_chart_bins_variance_and_matches_thresholds(tmp_path: Path) -> None:
    dataset = tmp_path / "matters.csv"
    pd.DataFrame(
        [
            _row(-0.10, scope_creep=False),
            _row(-0.02, scope_creep=False),
            _row(0.02, scope_creep=False),
            _row(0.10, scope_creep=True),
            _row(0.30, scope_creep=True),
            _row(1.50, scope_creep=True),
            _row(0.10, scope_creep=True, outcome="Ongoing"),
        ]
    ).to_csv(dataset, index=False)

    artifact = build_pitch_evidence_chart(dataset, dataset_id="SYNTHETIC_MVP_V1")

    assert artifact["datasetId"] == "SYNTHETIC_MVP_V1"
    assert artifact["nonOngoingSampleSize"] == 6
    assert artifact["sampleSize"] == 7
    assert artifact["thresholds"] == {"anyOverrun": 0.0, "materialCreep": 0.05}

    # 4 of 6 non-ongoing matters have variance > 0; 3 of 6 are flagged as material creep.
    assert artifact["metrics"]["anyOverrunRate"] == round(4 / 6, 6)
    assert artifact["metrics"]["materialCreepRate"] == round(3 / 6, 6)

    total_share = sum(row["sharePct"] for row in artifact["bins"])
    assert total_share == pytest.approx(100.0, abs=0.05)

    overflow_bin = next(row for row in artifact["bins"] if row["rangeHigh"] is None)
    assert overflow_bin["rangeLow"] == 1.0
    assert overflow_bin["count"] == 1

    threshold_bin = next(
        row for row in artifact["bins"] if row["rangeLow"] == 0.0 and row["rangeHigh"] == 0.05
    )
    assert threshold_bin["count"] == 1
