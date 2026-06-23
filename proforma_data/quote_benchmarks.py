from __future__ import annotations

import json
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

import pandas as pd

SEGMENT_DIMENSION_SETS: tuple[tuple[str, ...], ...] = (
    (),
    ("matter_type",),
    ("matter_type", "jurisdiction"),
    ("matter_type", "jurisdiction", "billing_model"),
    ("matter_type", "matter_subtype"),
    ("matter_type", "billing_model"),
    ("matter_type", "client_type"),
    ("matter_type", "firm_tier"),
    ("matter_type", "complexity_band"),
    ("matter_type", "document_volume_band"),
)


def build_quote_benchmark_artifact(
    dataset_path: Path | str,
    *,
    dataset_id: str,
    min_sample_size: int = 40,
) -> dict[str, Any]:
    df = pd.read_csv(dataset_path)
    working = df.copy()
    working["scope_creep_flag"] = _coerce_bool(working["scope_creep_flag"])
    working["complexity_band"] = working["complexity_score"].map(lambda value: f"Complexity {int(value)}")
    working["document_volume_band"] = pd.cut(
        working["document_volume"],
        bins=[0, 100, 300, 1000, 3000, float("inf")],
        labels=["<=100 documents", "101-300 documents", "301-1000 documents", "1001-3000 documents", "3000+ documents"],
        include_lowest=True,
    ).astype(str)

    segments: list[dict[str, Any]] = []
    for dimensions in SEGMENT_DIMENSION_SETS:
        if not dimensions:
            segments.append(_build_segment(working, dimensions, min_sample_size=1))
            continue
        grouped = working.groupby(list(dimensions), dropna=False, observed=True)
        for key, group in grouped:
            if len(group) >= min_sample_size:
                filters = _filters_from_group_key(dimensions, key)
                segments.append(_build_segment(group, dimensions, filters=filters, min_sample_size=min_sample_size))

    return {
        "schema_version": "proforma.quote_benchmarks.v1",
        "dataset_id": dataset_id,
        "generated_at": datetime.now(UTC).isoformat(),
        "min_sample_size": min_sample_size,
        "segments": segments,
    }


def write_quote_benchmark_artifact(
    dataset_path: Path | str,
    output_path: Path | str,
    *,
    dataset_id: str,
    min_sample_size: int = 40,
) -> dict[str, Any]:
    artifact = build_quote_benchmark_artifact(dataset_path, dataset_id=dataset_id, min_sample_size=min_sample_size)
    target = Path(output_path)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(artifact, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    return artifact


def _build_segment(
    group: pd.DataFrame,
    dimensions: tuple[str, ...],
    *,
    filters: dict[str, str] | None = None,
    min_sample_size: int,
) -> dict[str, Any]:
    filters = filters or {}
    variance = group["cost_variance_pct"].astype(float)
    scope = group["scope_creep_flag"].dropna()
    metrics = {
        "material_creep_rate": round(float(scope.mean()) if len(scope) else 0.0, 6),
        "any_overrun_rate": round(float((variance > 0).mean()), 6),
        "median_variance_pct": round(float(variance.median()), 6),
        "p75_variance_pct": round(float(variance.quantile(0.75)), 6),
        "p90_variance_pct": round(float(variance.quantile(0.90)), 6),
        "p95_variance_pct": round(float(variance.quantile(0.95)), 6),
        "median_cost_hkd": round(float(group["total_cost_hkd"].median()), 2),
        "median_duration_days": round(float(group["duration_days"].median()), 2),
        "median_realization_rate": round(float(group["realization_rate"].median()), 6),
    }
    return {
        "dimensions": list(dimensions),
        "filters": filters,
        "segment_label": _segment_label(filters),
        "sample_size": int(len(group)),
        "min_sample_size": min_sample_size,
        "metrics": metrics,
        "stage_cost_shares": _stage_cost_shares(group),
        "variance_distribution": _variance_distribution(variance),
    }


def _coerce_bool(series: pd.Series) -> pd.Series:
    if series.dtype == bool:
        return series
    return series.map(lambda value: None if pd.isna(value) else str(value).lower() == "true")


def _filters_from_group_key(dimensions: tuple[str, ...], key: Any) -> dict[str, str]:
    values = key if isinstance(key, tuple) else (key,)
    return {dimension: str(value) for dimension, value in zip(dimensions, values, strict=True)}


def _segment_label(filters: dict[str, str]) -> str:
    if not filters:
        return "All matters"
    return " / ".join(filters.values())


def _variance_distribution(variance: pd.Series) -> list[dict[str, float | str]]:
    total = len(variance)
    if total == 0:
        return []
    buckets = [
        ("<=0%", variance <= 0),
        ("0-25%", (variance > 0) & (variance <= 0.25)),
        ("25-50%", (variance > 0.25) & (variance <= 0.50)),
        (">50%", variance > 0.50),
    ]
    return [{"bucket": label, "share_pct": round(float(mask.sum() / total * 100), 1)} for label, mask in buckets]


def _stage_cost_shares(group: pd.DataFrame) -> list[dict[str, float | str]]:
    rows: list[dict[str, float | str]] = []
    for _, row in group.iterrows():
        stage_names = json.loads(row["stage_names"])
        stage_costs = json.loads(row["stage_costs"])
        total = sum(float(cost) for cost in stage_costs)
        if total <= 0:
            continue
        for stage_name, stage_cost in zip(stage_names, stage_costs, strict=True):
            rows.append({"stage_name": str(stage_name), "share": float(stage_cost) / total})
    if not rows:
        return []
    stage_df = pd.DataFrame(rows)
    summary = (
        stage_df.groupby("stage_name", observed=True)["share"]
        .mean()
        .sort_values(ascending=False)
        .head(6)
        .reset_index()
    )
    return [
        {"stage_name": str(row["stage_name"]), "avg_share_pct": round(float(row["share"]) * 100, 1)}
        for _, row in summary.iterrows()
    ]
