"""Compare pooled and simulated firm-specific model strategies."""

from __future__ import annotations

import argparse
from pathlib import Path
from typing import Any

import pandas as pd

from ml.features import ALLOWED_INPUT_FEATURES
from ml.train import train_regression_model

LEGAL_GATE = "pooled anonymized training remains legally gated"


def run_comparison(
    *,
    dataset_path: Path | str,
    output_path: Path | str,
    sample: int | None = None,
) -> dict[str, Any]:
    frame = pd.read_csv(dataset_path)
    if sample is not None:
        frame = frame.head(sample)
    pooled_bundle = train_regression_model(dataset_path, target="total_cost_hkd", model_name="ridge", sample=sample)
    report = {
        "feature_contract": list(ALLOWED_INPUT_FEATURES),
        "legal_gate": LEGAL_GATE,
        "strategies": {
            "pooled": {
                "sample_size": int(len(frame)),
                "mae": pooled_bundle.metrics["mae"],
                "empirical_coverage": pooled_bundle.metrics["empirical_coverage"],
            },
            "firm-tier-specific": {
                "segments": segment_summary(frame, "firm_tier", pooled_bundle.metrics["mae"]),
            },
            "matter-type-specific": {
                "segments": segment_summary(frame, "matter_type", pooled_bundle.metrics["mae"]),
            },
            "leave-one-tier-out": {
                "segments": leave_one_tier_summary(frame, pooled_bundle.metrics["mae"]),
            },
        },
        "minimum_estimated_records_per_firm": 300,
    }
    report["segments_where_pooled_improves_accuracy"] = pooled_improvement_segments(report)
    write_report(report, Path(output_path))
    return report


def segment_summary(frame: pd.DataFrame, field: str, pooled_mae: float) -> dict[str, dict[str, Any]]:
    segments: dict[str, dict[str, Any]] = {}
    global_median = float(frame["total_cost_hkd"].median())
    for segment, group in frame.groupby(field):
        absolute_error = (group["total_cost_hkd"] - global_median).abs()
        baseline_mae = float(absolute_error.mean())
        segments[str(segment)] = {
            "sample_size": int(len(group)),
            "baseline_mae": baseline_mae,
            "pooled_mae": float(pooled_mae),
            "pooled_improves_accuracy": bool(pooled_mae < baseline_mae),
            "calibration_note": "segment residual calibration required before production use",
        }
    return segments


def leave_one_tier_summary(frame: pd.DataFrame, pooled_mae: float) -> dict[str, dict[str, Any]]:
    segments: dict[str, dict[str, Any]] = {}
    for tier, held_out in frame.groupby("firm_tier"):
        train = frame[frame["firm_tier"] != tier]
        train_median = float(train["total_cost_hkd"].median())
        held_out_mae = float((held_out["total_cost_hkd"] - train_median).abs().mean())
        segments[str(tier)] = {
            "sample_size": int(len(held_out)),
            "held_out_mae": held_out_mae,
            "pooled_mae": float(pooled_mae),
            "pooled_improves_accuracy": bool(pooled_mae < held_out_mae),
        }
    return segments


def pooled_improvement_segments(report: dict[str, Any]) -> list[str]:
    improved: list[str] = []
    for strategy_name, strategy in report["strategies"].items():
        for segment, metrics in strategy.get("segments", {}).items():
            if metrics.get("pooled_improves_accuracy"):
                improved.append(f"{strategy_name}: {segment}")
    return improved


def write_report(report: dict[str, Any], output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    lines = [
        "# Model Strategy Comparison",
        "",
        "## Summary",
        "",
        "This research scaffold compares simulated firm-specific, matter-type-specific, leave-one-tier-out, and pooled strategies.",
        "",
        f"- Legal gate: {LEGAL_GATE}.",
        f"- Pooled sample size: {report['strategies']['pooled']['sample_size']}",
        f"- Minimum estimated records per firm for useful models: {report['minimum_estimated_records_per_firm']}",
        "- Segments where pooled data improves accuracy: "
        + (", ".join(report["segments_where_pooled_improves_accuracy"]) or "None in this synthetic run"),
        "",
        "## Feature Contract",
        "",
    ]
    lines.extend(f"- `{feature}`" for feature in report["feature_contract"])
    lines.extend(["", "## Strategy Results", ""])
    for strategy_name, strategy in report["strategies"].items():
        lines.extend([f"### {strategy_name}", ""])
        if "segments" in strategy:
            for segment, metrics in strategy["segments"].items():
                metric_text = ", ".join(
                    f"{key}={value:.2f}" if isinstance(value, float) else f"{key}={value}"
                    for key, value in metrics.items()
                )
                lines.append(f"- {segment}: {metric_text}")
        else:
            lines.append(f"- sample_size={strategy['sample_size']}")
            lines.append(f"- mae={strategy['mae']:.2f}")
            lines.append(f"- empirical_coverage={strategy['empirical_coverage']:.2f}")
        lines.append("")
    lines.extend(
        [
            "## Privacy And Solicitor Confidentiality Caveats",
            "",
            "Pooled anonymized training is legally gated and requires documented approvals before any real-firm data is used.",
            "Firm-specific evaluation here is simulated from synthetic firm tiers, not actual firm identifiers.",
        ]
    )
    output_path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dataset", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--sample", type=int)
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    run_comparison(dataset_path=args.dataset, output_path=args.output, sample=args.sample)
    print(f"Wrote {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
