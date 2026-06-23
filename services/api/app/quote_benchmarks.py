from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Any

from proforma_data.schemas import (
    PredictionResponse,
    QuoteBenchmarkSegment,
    QuotePackChartSpec,
    QuotePackMetric,
    QuoteSubstantiationResponse,
)


class QuoteBenchmarkUnavailableError(RuntimeError):
    pass


class QuoteBenchmarkService:
    def __init__(self, benchmark_path: Path) -> None:
        self.benchmark_path = benchmark_path

    def build_substantiation(self, prediction: PredictionResponse) -> QuoteSubstantiationResponse:
        artifact = self._load_artifact()
        segment = self._select_segment(artifact["segments"], prediction.input_summary)
        segment_label = str(segment["segment_label"])
        sample_size = int(segment["sample_size"])
        metrics = self._metric_cards(segment["metrics"], segment_label, sample_size)
        chart_specs = self._chart_specs(segment)
        assumptions = self._assumptions_and_guardrails(prediction, segment_label)
        footer = self._evidence_footer(prediction, artifact)
        response = QuoteSubstantiationResponse(
            estimate_id=prediction.estimate_id,
            tenant_id=prediction.tenant_id,
            benchmark_segment=QuoteBenchmarkSegment(
                segment_label=segment_label,
                dimensions=list(segment["dimensions"]),
                sample_size=sample_size,
                fallback_level=self._fallback_level(segment),
            ),
            metrics=metrics,
            chart_specs=chart_specs,
            assumptions_and_guardrails=assumptions,
            evidence_footer=footer,
            limitations=prediction.limitations,
        )
        response.snapshot_checksum = self._snapshot_checksum(response)
        return response

    def _load_artifact(self) -> dict[str, Any]:
        if not self.benchmark_path.exists():
            raise QuoteBenchmarkUnavailableError(f"Quote benchmarks not found: {self.benchmark_path}")
        artifact: dict[str, Any] = json.loads(self.benchmark_path.read_text(encoding="utf-8"))
        if not artifact.get("segments"):
            raise QuoteBenchmarkUnavailableError("Quote benchmark artifact contains no segments")
        return artifact

    def _select_segment(self, segments: list[dict[str, Any]], input_summary: dict[str, Any]) -> dict[str, Any]:
        matches = [
            segment
            for segment in segments
            if all(str(input_summary.get(key)) == str(value) for key, value in segment.get("filters", {}).items())
        ]
        if not matches:
            matches = [segment for segment in segments if not segment.get("filters")]
        if not matches:
            raise QuoteBenchmarkUnavailableError("No matching quote benchmark segment")
        return sorted(matches, key=lambda segment: (len(segment.get("dimensions", [])), segment.get("sample_size", 0)), reverse=True)[0]

    def _metric_cards(self, metrics: dict[str, float], segment_label: str, sample_size: int) -> list[QuotePackMetric]:
        return [
            self._percent_metric(
                "Material scope-creep rate",
                metrics["material_creep_rate"],
                "Comparable matters where WIP cost exceeded the original quote by more than 5%.",
                segment_label,
                sample_size,
            ),
            self._percent_metric(
                "Any-overrun rate",
                metrics["any_overrun_rate"],
                "Comparable matters where WIP cost exceeded the original quote by any amount.",
                segment_label,
                sample_size,
            ),
            self._percent_metric(
                "P75 quote variance",
                metrics["p75_variance_pct"],
                "The 75th percentile uplift from original quote to realized WIP cost.",
                segment_label,
                sample_size,
            ),
            self._percent_metric(
                "P90 quote variance",
                metrics["p90_variance_pct"],
                "The 90th percentile uplift from original quote to realized WIP cost.",
                segment_label,
                sample_size,
            ),
            self._money_metric(
                "Median comparable cost",
                metrics["median_cost_hkd"],
                "Median WIP cost for the matching comparable-matter segment.",
                segment_label,
                sample_size,
            ),
            QuotePackMetric(
                label="Median duration",
                value=float(metrics["median_duration_days"]),
                unit="days",
                display_value=f"{float(metrics['median_duration_days']):,.0f} days",
                description="Median duration for the matching comparable-matter segment.",
                segment_label=segment_label,
                sample_size=sample_size,
            ),
        ]

    def _chart_specs(self, segment: dict[str, Any]) -> list[QuotePackChartSpec]:
        charts = [
            QuotePackChartSpec(
                chart_type="variance_distribution",
                title="Historical Quote Variance",
                description="Distribution of realized WIP variance against original quotes for comparable matters.",
                data=list(segment.get("variance_distribution", [])),
            )
        ]
        if segment.get("stage_cost_shares"):
            charts.append(
                QuotePackChartSpec(
                    chart_type="stage_cost_share",
                    title="Stage Cost Share",
                    description="Average cost contribution by matter stage for comparable matters.",
                    data=list(segment["stage_cost_shares"]),
                )
            )
        return charts

    def _assumptions_and_guardrails(self, prediction: PredictionResponse, segment_label: str) -> list[str]:
        return [
            f"Comparable benchmark segment: {segment_label}.",
            prediction.fee_recommendation.partner_decision_support_disclaimer,
            *prediction.fee_recommendation.pricing_guardrails,
        ]

    def _evidence_footer(self, prediction: PredictionResponse, artifact: dict[str, Any]) -> list[str]:
        return [
            f"Model version: {prediction.model_version}",
            f"Dataset: {prediction.dataset_lineage.get('dataset_id', artifact.get('dataset_id', 'unknown'))}",
            f"Benchmark artifact: {artifact.get('schema_version', 'unknown')}",
            "This pack is decision-support only and must be reviewed by a responsible partner before client sharing.",
        ]

    def _fallback_level(self, segment: dict[str, Any]) -> str:
        dimensions = segment.get("dimensions", [])
        return "global" if not dimensions else "+".join(dimensions)

    def _percent_metric(
        self,
        label: str,
        value: float,
        description: str,
        segment_label: str,
        sample_size: int,
    ) -> QuotePackMetric:
        pct = float(value) * 100
        return QuotePackMetric(
            label=label,
            value=pct,
            unit="percent",
            display_value=f"{pct:.1f}%",
            description=description,
            segment_label=segment_label,
            sample_size=sample_size,
        )

    def _money_metric(
        self,
        label: str,
        value: float,
        description: str,
        segment_label: str,
        sample_size: int,
    ) -> QuotePackMetric:
        amount = float(value)
        return QuotePackMetric(
            label=label,
            value=amount,
            unit="HKD",
            display_value=f"HK${amount:,.0f}",
            description=description,
            segment_label=segment_label,
            sample_size=sample_size,
        )

    def _snapshot_checksum(self, response: QuoteSubstantiationResponse) -> str:
        payload = response.model_dump(mode="json", exclude={"snapshot_checksum"})
        encoded = json.dumps(payload, sort_keys=True, separators=(",", ":")).encode("utf-8")
        return hashlib.sha256(encoded).hexdigest()
