# ProForma Phase 2 AI Training Scaffold Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a reproducible ML research scaffold that benchmarks cost, duration, stage allocation, and scope-creep predictions while comparing firm-specific and pooled anonymized strategies.

**Architecture:** Training code lives under `ml/` and consumes Phase 1 schemas and validation outputs. The scaffold produces versioned model artifacts, evaluation reports, model cards, and local inference fixtures that the FastAPI service can later load without knowing the training internals.

**Tech Stack:** Python, pandas, numpy, scipy, scikit-learn, joblib, pydantic, pytest, Markdown/JSON evaluation reports.

---

## Source Context

- Dataset: `output/proforma_hk_synthetic_mvp.csv`
- Data dictionary: `docs/data_dictionary.md`
- Validation report: `output/validation_report.md`
- Data schemas from Phase 1: `proforma_data/schemas.py`
- Lineage from Phase 1: `output/dataset_lineage.json`

## Phase Deliverables

- Reproducible training CLI.
- Feature engineering module.
- Baseline regression and classification models.
- Firm-specific simulation track.
- Pooled anonymized research track.
- Prediction interval calibration.
- Matter-type-stratified evaluation.
- Model cards and comparison report.
- Saved local artifacts for API integration.

## Task 1: Create ML Package Skeleton

**Files:**
- Create: `ml/__init__.py`
- Create: `ml/features.py`
- Create: `ml/train.py`
- Create: `ml/evaluate.py`
- Create: `ml/inference.py`
- Create: `ml/model_card.py`
- Create: `ml/config.py`
- Create: `tests/ml/test_features.py`
- Create: `tests/ml/test_training_smoke.py`
- Modify: `requirements.txt`

**Step 1: Add ML dependencies**

Add:

```text
scikit-learn
joblib
```

Keep the stack deliberately conservative before considering neural networks.

**Step 2: Define artifact folders**

Use:

```text
artifacts/models/
artifacts/reports/
artifacts/fixtures/
```

Add `artifacts/models/*.joblib` to `.gitignore` if model binaries are large or frequently regenerated. Commit small JSON/Markdown reports only when useful for feasibility evidence.

**Step 3: Write failing smoke tests**

Create tests that assert:

- Feature builder returns a 2D matrix and target vector.
- Training CLI can run on a 100-row sample.
- Inference returns cost estimate, duration estimate, and scope-creep probability.

Run: `pytest tests/ml -q`

Expected before implementation: failures for missing modules.

**Step 4: Implement package skeleton**

Implement minimal functions:

- `build_feature_matrix(records, target)`
- `train_regression_model(dataset_path, target)`
- `train_scope_creep_classifier(dataset_path)`
- `predict(model_bundle, matter_input)`
- `write_model_card(model_bundle, metrics)`

**Step 5: Verify**

Run: `pytest tests/ml -q`

Expected: smoke tests pass.

**Step 6: Commit checkpoint**

Commit message: `feat: add ML training scaffold skeleton`

## Task 2: Implement Feature Engineering

**Files:**
- Modify: `ml/features.py`
- Create: `tests/ml/test_feature_contract.py`
- Reference: `docs/data_dictionary.md`

**Step 1: Define allowed input features**

Use only ex-ante features available before the matter begins:

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

Do not use leakage fields as input features:

- `total_cost_hkd`
- `billed_amount_hkd`
- `realization_rate`
- `cost_variance_pct`
- `scope_creep_flag`
- `scope_creep_pct`
- `duration_days`
- `partner_hours`
- `associate_hours`
- `stage_partner_hours`
- `stage_associate_hours`
- `stage_costs`
- `outcome`

**Step 2: Write leakage tests**

Assert that leakage fields cannot appear in the feature list.

Run: `pytest tests/ml/test_feature_contract.py -q`

Expected before implementation: failures if feature contract is not enforced.

**Step 3: Implement preprocessing**

Implement:

- One-hot encoding for categorical fields.
- Missing value handling for `deal_value_hkd`.
- Boolean conversion for `cross_border_flag`.
- Numeric scaling only inside sklearn pipelines.
- Feature name export for model cards and API explanations.

**Step 4: Verify**

Run: `pytest tests/ml/test_feature_contract.py -q`

Expected: tests pass and leakage fields are rejected.

**Step 5: Commit checkpoint**

Commit message: `feat: add leakage-safe feature engineering`

## Task 3: Train Transparent Baselines

**Files:**
- Modify: `ml/train.py`
- Modify: `ml/evaluate.py`
- Create: `tests/ml/test_baselines.py`

**Step 1: Add regression targets**

Train separate regressors for:

- `log_total_cost_hkd`, derived from `total_cost_hkd`.
- `duration_days`.
- `partner_hours`.
- `associate_hours`.

**Step 2: Add classification target**

Train a classifier for:

- `scope_creep_flag`, excluding ongoing matters where the label is null.

**Step 3: Use conservative model families**

Start with:

- `DummyRegressor` and `DummyClassifier` baselines.
- `Ridge` or `ElasticNet` for interpretable regression.
- `RandomForestRegressor` and `RandomForestClassifier`.
- `HistGradientBoostingRegressor` and `HistGradientBoostingClassifier`.

**Step 4: Write tests**

Assert:

- Every configured target has a baseline result.
- Metrics include MAE, RMSE, MAPE or sMAPE for cost/duration.
- Classifier metrics include ROC AUC, PR AUC, precision, recall, and calibration error.
- Metrics are stratified by matter type.

**Step 5: Verify**

Run:

```bash
pytest tests/ml/test_baselines.py -q
python -m ml.train --dataset output/proforma_hk_synthetic_mvp.csv --target total_cost_hkd --model ridge --sample 400
```

Expected: tests pass and a sample training run writes a report.

**Step 6: Commit checkpoint**

Commit message: `feat: train transparent ProForma baseline models`

## Task 4: Add Prediction Interval Calibration

**Files:**
- Modify: `ml/evaluate.py`
- Modify: `ml/inference.py`
- Create: `tests/ml/test_intervals.py`

**Step 1: Define interval outputs**

For cost and duration predictions, output:

- `p10`
- `p50`
- `p90`
- `confidence_level`
- `calibration_method`

**Step 2: Implement first calibration method**

Use residual quantiles from cross-validation as the first method. Keep conformal prediction as a later enhancement if needed.

**Step 3: Write interval tests**

Assert:

- `p10 <= p50 <= p90`.
- Intervals widen for higher residual uncertainty segments.
- Model reports include empirical coverage.

**Step 4: Verify**

Run: `pytest tests/ml/test_intervals.py -q`

Expected: interval tests pass.

**Step 5: Commit checkpoint**

Commit message: `feat: add calibrated prediction intervals`

## Task 5: Compare Firm-Specific And Pooled Tracks

**Files:**
- Create: `ml/experiments/model_strategy_comparison.py`
- Create: `tests/ml/test_model_strategy_comparison.py`
- Create: `docs/research/model-strategy-comparison-template.md`

**Step 1: Define simulated firm groupings**

Because the synthetic dataset has no actual firm ID, simulate comparison tracks with:

- Firm-tier-specific models.
- Matter-type-specific models.
- Pooled global model.
- Leave-one-tier-out evaluation.

**Step 2: Write comparison tests**

Assert:

- Firm-specific simulated models and pooled models use the same feature contract.
- Reports include sample size per segment.
- Reports mark pooled anonymized training as legally gated.

**Step 3: Implement comparison runner**

Run:

```bash
python -m ml.experiments.model_strategy_comparison --dataset output/proforma_hk_synthetic_mvp.csv --output artifacts/reports/model_strategy_comparison.md
```

**Step 4: Include decision outputs**

Report:

- Accuracy by strategy.
- Calibration by strategy.
- Minimum estimated records per firm for useful models.
- Segments where pooled data improves accuracy.
- Privacy and solicitor confidentiality caveats.

**Step 5: Verify**

Run:

```bash
pytest tests/ml/test_model_strategy_comparison.py -q
python -m ml.experiments.model_strategy_comparison --dataset output/proforma_hk_synthetic_mvp.csv --output artifacts/reports/model_strategy_comparison.md
rg "legally gated|firm-specific|pooled" artifacts/reports/model_strategy_comparison.md
```

Expected: tests pass and report contains both strategy tracks plus legal gate language.

**Step 6: Commit checkpoint**

Commit message: `feat: compare ProForma model strategy tracks`

## Task 6: Generate Model Cards And API Fixtures

**Files:**
- Modify: `ml/model_card.py`
- Modify: `ml/inference.py`
- Create: `artifacts/reports/model_card_total_cost.md`
- Create: `artifacts/reports/model_card_scope_creep.md`
- Create: `artifacts/fixtures/sample_prediction_response.json`
- Create: `tests/ml/test_model_cards.py`

**Step 1: Define model card sections**

Include:

- Intended use.
- Excluded uses.
- Training data.
- Synthetic-data limitation.
- Feature list.
- Target definition.
- Evaluation metrics.
- Known limitations.
- Legal and governance gates.
- Model version and dataset lineage.

**Step 2: Create API fixture**

`sample_prediction_response.json` should contain:

- `estimate_id`
- `tenant_id`
- `model_version`
- `dataset_lineage`
- `input_summary`
- `cost_estimate`
- `duration_estimate`
- `scope_creep_probability`
- `stage_estimates`
- `fee_recommendation`
- `decision_support_disclaimer`

**Step 3: Write tests**

Assert:

- Model cards include synthetic-data limitations.
- API fixture includes model version and disclaimer.
- Inference does not return raw training rows.

**Step 4: Verify**

Run:

```bash
pytest tests/ml/test_model_cards.py -q
rg "Synthetic|Excluded uses|decision_support_disclaimer" artifacts/reports artifacts/fixtures
```

Expected: tests pass and reports include required governance language.

**Step 5: Commit checkpoint**

Commit message: `docs: add ProForma model cards and inference fixtures`

## Phase 2 Final Verification

Run:

```bash
pytest tests/ml -q
python -m ml.train --dataset output/proforma_hk_synthetic_mvp.csv --all-targets --output-dir artifacts/models
python -m ml.experiments.model_strategy_comparison --dataset output/proforma_hk_synthetic_mvp.csv --output artifacts/reports/model_strategy_comparison.md
rg "Synthetic|legally gated|firm-specific|pooled|Excluded uses" artifacts/reports
```

Expected:

- ML tests pass.
- All baseline targets train.
- Model strategy comparison report is produced.
- Model cards make limitations and excluded uses explicit.
- Local inference fixture is ready for FastAPI integration.

