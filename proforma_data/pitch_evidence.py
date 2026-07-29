"""Build the real (non-illustrative) cost-variance histogram used in the pitch deck.

The pitch deck's "Act V" evidence section pairs a stylized, hand-drawn curve
(purely for narrative shape) with a second chart plotted directly from the
synthetic dataset: a histogram of `cost_variance_pct` for non-ongoing
matters, with reference lines at the same two thresholds used everywhere
else in the product (0% = any overrun, 5% = material scope creep, matching
`CREEP_TOLERANCE` in `generate_dataset.py`).

Binning is fixed-width and anchored at 0.00 and 0.05 so threshold lines land
exactly on a bin edge instead of cutting through a bar.
"""

from __future__ import annotations

import itertools
import json
import math
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

import pandas as pd

BIN_WIDTH = 0.05
RANGE_LOW = -0.40
RANGE_HIGH = 1.00
ANY_OVERRUN_THRESHOLD = 0.0
MATERIAL_CREEP_THRESHOLD = 0.05


def build_pitch_evidence_chart(
    dataset_path: Path | str,
    *,
    dataset_id: str,
) -> dict[str, Any]:
    df = pd.read_csv(dataset_path)
    non_ongoing = df[df["outcome"] != "Ongoing"].copy()
    variance = non_ongoing["cost_variance_pct"].astype(float)
    scope_creep = non_ongoing["scope_creep_flag"].astype(str).str.lower() == "true"

    total = len(variance)
    if total == 0:
        raise ValueError("Dataset has no non-ongoing matters to build a histogram from.")

    bins = _build_bins(variance, total)

    return {
        "schemaVersion": "proforma.pitch_evidence_chart.v1",
        "datasetId": dataset_id,
        "generatedAt": datetime.now(UTC).isoformat(),
        "sampleSize": int(len(df)),
        "nonOngoingSampleSize": total,
        "variable": "cost_variance_pct",
        "variableLabel": "Actual cost vs. quoted fee",
        "binWidth": BIN_WIDTH,
        "thresholds": {
            "anyOverrun": ANY_OVERRUN_THRESHOLD,
            "materialCreep": MATERIAL_CREEP_THRESHOLD,
        },
        "metrics": {
            "anyOverrunRate": round(float((variance > ANY_OVERRUN_THRESHOLD).mean()), 6),
            "materialCreepRate": round(float(scope_creep.mean()), 6),
        },
        "bins": bins,
    }


def write_pitch_evidence_chart(
    dataset_path: Path | str,
    output_paths: list[Path | str],
    *,
    dataset_id: str,
) -> dict[str, Any]:
    artifact = build_pitch_evidence_chart(dataset_path, dataset_id=dataset_id)
    serialized = json.dumps(artifact, indent=2, sort_keys=True) + "\n"
    for output_path in output_paths:
        target = Path(output_path)
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(serialized, encoding="utf-8")
    return artifact


def _build_bins(variance: pd.Series, total: int) -> list[dict[str, Any]]:
    edges = [RANGE_LOW]
    while edges[-1] < RANGE_HIGH - 1e-9:
        edges.append(round(edges[-1] + BIN_WIDTH, 10))

    bins: list[dict[str, Any]] = []
    below_range = int((variance < RANGE_LOW).sum())
    if below_range:
        bins.append(_bin_row(None, RANGE_LOW, below_range, total))

    for low, high in itertools.pairwise(edges):
        is_last_finite = math.isclose(high, RANGE_HIGH)
        mask = (variance >= low) & (variance < high) if not is_last_finite else (variance >= low) & (variance <= high)
        count = int(mask.sum())
        bins.append(_bin_row(low, high, count, total))

    above_range = int((variance > RANGE_HIGH).sum())
    if above_range:
        bins.append(_bin_row(RANGE_HIGH, None, above_range, total))

    return bins


def _bin_row(low: float | None, high: float | None, count: int, total: int) -> dict[str, Any]:
    return {
        "rangeLow": low,
        "rangeHigh": high,
        "count": count,
        "sharePct": round(count / total * 100, 3),
    }
