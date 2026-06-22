"""Model card generation for ProForma baseline artifacts."""

from __future__ import annotations

from pathlib import Path
from typing import Any


def write_model_card(model_bundle: Any, output_path: Path | str, metrics: dict[str, Any] | None = None) -> str:
    output = Path(output_path)
    output.parent.mkdir(parents=True, exist_ok=True)
    effective_metrics = metrics or model_bundle.metrics
    text = render_model_card(model_bundle, effective_metrics)
    output.write_text(text, encoding="utf-8")
    return text


def render_model_card(model_bundle: Any, metrics: dict[str, Any]) -> str:
    feature_list = "\n".join(f"- `{feature}`" for feature in model_bundle.feature_contract.input_features)
    metric_lines = "\n".join(f"- `{key}`: {value}" for key, value in metrics.items())
    return f"""# Model Card: {model_bundle.target}

## Intended Use

Decision-support estimates for synthetic ProForma feasibility research, including
matter scoping, budget range exploration, and scope-creep risk triage.

## Excluded uses

- Do not use as legal advice.
- Do not use as a binding client quote without partner review.
- Do not train on or infer from confidential real-firm data until governance gates are satisfied.

## Training Data

Synthetic Hong Kong legal matter data generated for the ProForma MVP feasibility
study. The dataset is marked `SYNTHETIC_MVP_V1`.

## Synthetic-Data Limitation

Synthetic data can test workflow feasibility and interface contracts, but it does
not prove production accuracy for any firm or client segment.

## Feature List

{feature_list}

## Target Definition

`{model_bundle.target}` trained as a {model_bundle.task_type} baseline using the
`{model_bundle.model_name}` model family.

## Evaluation Metrics

{metric_lines}

## Known Limitations

- Baselines are transparent research models, not final production estimators.
- Prediction intervals use residual quantiles and should be recalibrated on approved real data.
- Matter-type and firm-tier segment sizes influence reliability.

## Legal And Governance Gates

Real-firm training remains legally gated pending data sharing agreements, PDPO
basis documentation, solicitor confidentiality review, anonymization approval,
and data residency approval.

## Versioning

- Model version: `{model_bundle.model_version}`
- Dataset lineage: `output/dataset_lineage.json`
"""

