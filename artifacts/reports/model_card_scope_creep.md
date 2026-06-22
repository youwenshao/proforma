# Model Card: scope_creep_flag

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

- `matter_type`
- `matter_subtype`
- `jurisdiction`
- `firm_tier`
- `client_type`
- `deal_value_hkd`
- `document_volume`
- `complexity_score`
- `party_count`
- `cross_border_flag`
- `partner_rate_hkd`
- `associate_rate_hkd`
- `billing_model`
- `stage_count`

## Target Definition

`scope_creep_flag` trained as a classification baseline using the
`logistic` model family.

## Evaluation Metrics

- `roc_auc`: 0.5930138826690551
- `pr_auc`: 0.563992089071113
- `precision`: 0.5758157389635317
- `recall`: 0.6493506493506493
- `calibration_error`: 0.060548366943279475

## Known Limitations

- Baselines are transparent research models, not final production estimators.
- Prediction intervals use residual quantiles and should be recalibrated on approved real data.
- Matter-type and firm-tier segment sizes influence reliability.

## Legal And Governance Gates

Real-firm training remains legally gated pending data sharing agreements, PDPO
basis documentation, solicitor confidentiality review, anonymization approval,
and data residency approval.

## Versioning

- Model version: `proforma-baseline-v1`
- Dataset lineage: `output/dataset_lineage.json`
