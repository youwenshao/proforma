# ProForma Phase 1 Data Foundation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Turn the synthetic ProForma HK dataset and generator assumptions into stable data contracts, validation checks, lineage metadata, and future ingestion boundaries.

**Architecture:** The current `generate_dataset.py` remains the source for synthetic data generation, while reusable domain definitions move into importable modules. Validation becomes a repeatable command that checks schema, invariants, lineage, and future real-data import readiness without allowing confidential data into git.

**Tech Stack:** Python 3.12+, pandas, scipy, pydantic, pytest, pandera or custom validation functions, JSON Schema, Markdown reports.

---

## Source Context

- Generator: `generate_dataset.py`
- Dictionary: `docs/data_dictionary.md`
- Dataset: `output/proforma_hk_synthetic_mvp.csv`
- Validation: `output/validation_report.md`

## Phase Deliverables

- Versioned domain constants and schema definitions.
- Reproducible data build and validation commands.
- Data quality report generation.
- Lineage metadata convention.
- Real firm data import adapter plan, disabled behind governance gates.
- Schema and invariant tests.

## Task 1: Create Data Package Skeleton

**Files:**
- Create: `proforma_data/__init__.py`
- Create: `proforma_data/domain.py`
- Create: `proforma_data/schemas.py`
- Create: `proforma_data/validation.py`
- Create: `proforma_data/lineage.py`
- Create: `tests/data/test_domain.py`
- Create: `tests/data/test_schemas.py`
- Modify: `requirements.txt`

**Step 1: Add dependencies**

Add planned dependencies:

```text
pydantic
pytest
```

Keep `numpy`, `pandas`, and `scipy`.

**Step 2: Move domain constants**

Extract constants from `generate_dataset.py` into `proforma_data/domain.py`:

- `MATTER_TYPES`
- `MATTER_SUBTYPES`
- `FIRM_TIERS`
- `JURISDICTIONS`
- `CLIENT_TYPES`
- `BILLING_MODELS`
- `STAGE_TEMPLATES`
- `PARTNER_RATE_BANDS`

Leave compatibility imports in `generate_dataset.py` until Phase 1 is fully verified.

**Step 3: Write failing domain tests**

Create tests that assert:

- Every matter type has a stage template.
- Every matter type has at least one subtype.
- `Outcome Related` is allowed only for arbitration in generated records.
- Partner rate bands have lower bound less than upper bound.

Run: `pytest tests/data/test_domain.py -q`

Expected before implementation: failures for missing package or constants.

**Step 4: Implement constants and compatibility imports**

Update `generate_dataset.py` to import from `proforma_data.domain`.

**Step 5: Verify**

Run: `pytest tests/data/test_domain.py -q`

Expected after implementation: all tests pass.

**Step 6: Commit checkpoint**

Commit message: `refactor: extract ProForma data domain constants`

## Task 2: Define Versioned Schemas

**Files:**
- Modify: `proforma_data/schemas.py`
- Create: `schemas/matter-input.schema.json`
- Create: `schemas/matter-estimate.schema.json`
- Create: `schemas/model-evaluation.schema.json`
- Modify: `tests/data/test_schemas.py`

**Step 1: Define schema version**

Add:

```python
SCHEMA_VERSION = "proforma.matter.v1"
```

**Step 2: Add Pydantic models**

Define:

- `MatterInput`
- `StageEstimate`
- `MatterEstimate`
- `FeeRecommendation`
- `ScopeVariance`
- `ModelEvaluation`
- `DataLineage`

**Step 3: Preserve proposal semantics**

Require these fields in `MatterInput`:

- `matter_type`
- `matter_subtype`
- `jurisdiction`
- `firm_tier`
- `client_type`
- `document_volume`
- `complexity_score`
- `party_count`
- `cross_border_flag`
- `billing_model`
- `risk_tolerance`

**Step 4: Write schema tests**

Tests should validate:

- `complexity_score` accepts 1 through 5 only.
- `document_volume` must be positive.
- `cross_border_flag` must agree with jurisdiction for known synthetic records.
- `MatterEstimate` includes confidence interval fields, not a single point estimate only.
- `FeeRecommendation` includes the partner decision-support disclaimer.

Run: `pytest tests/data/test_schemas.py -q`

Expected before implementation: failures for missing models.

**Step 5: Export JSON Schemas**

Add a CLI command:

```bash
python -m proforma_data.schemas export-json-schema
```

Expected outputs:

- `schemas/matter-input.schema.json`
- `schemas/matter-estimate.schema.json`
- `schemas/model-evaluation.schema.json`

**Step 6: Verify**

Run:

```bash
pytest tests/data/test_schemas.py -q
python -m proforma_data.schemas export-json-schema
```

Expected: tests pass and schema files are written.

**Step 7: Commit checkpoint**

Commit message: `feat: add versioned ProForma data schemas`

## Task 3: Rebuild Dataset Validation As A Command

**Files:**
- Modify: `proforma_data/validation.py`
- Create: `scripts/validate_dataset.py`
- Create: `tests/data/test_validation.py`
- Modify: `generate_dataset.py`

**Step 1: Extract validation invariants**

Move or wrap validation logic from `generate_dataset.py` for:

- Global material scope creep rate target.
- Global any-overrun rate target.
- Partner and associate rate floors.
- Partner rate greater than associate rate.
- Stage costs sum to total cost.
- PRC cost estimates only for GBA cross-border matters.
- Outcome Related arbitration-only rule.
- Correlation checks for complexity, log cost, document volume, and hours.

**Step 2: Write failing tests**

Create tests using a small fixture dataframe that intentionally violates:

- Stage cost sum.
- Partner/associate ratio.
- GBA PRC estimate rule.
- Missing required field.

Run: `pytest tests/data/test_validation.py -q`

Expected before implementation: failures for missing validation command.

**Step 3: Implement validation command**

Create:

```bash
python scripts/validate_dataset.py --input output/proforma_hk_synthetic_mvp.csv --report output/validation_report.md
```

The command should exit non-zero when critical checks fail.

**Step 4: Preserve existing report shape**

Keep headline metrics compatible with the current `output/validation_report.md` so proposal reviewers can compare runs.

**Step 5: Verify**

Run:

```bash
pytest tests/data/test_validation.py -q
python scripts/validate_dataset.py --input output/proforma_hk_synthetic_mvp.csv --report output/validation_report.md
```

Expected:

- Tests pass.
- Report status remains PASS for the synthetic dataset.

**Step 6: Commit checkpoint**

Commit message: `feat: add reusable dataset validation command`

## Task 4: Add Data Lineage Metadata

**Files:**
- Modify: `proforma_data/lineage.py`
- Modify: `generate_dataset.py`
- Create: `output/dataset_lineage.json`
- Create: `tests/data/test_lineage.py`

**Step 1: Define lineage fields**

Use:

- `dataset_id`
- `schema_version`
- `source_marker`
- `random_seed`
- `record_count`
- `generated_at`
- `generator_version`
- `feature_version`
- `validation_report_path`

**Step 2: Write failing tests**

Assert:

- `source_marker` equals `SYNTHETIC_MVP_V1`.
- `record_count` equals the number of CSV rows.
- `random_seed` equals `20260622`.
- `schema_version` is present.

**Step 3: Implement lineage writer**

Update generation so `python generate_dataset.py` writes:

- `output/proforma_hk_synthetic_mvp.csv`
- `output/validation_report.md`
- `output/dataset_lineage.json`
- `docs/data_dictionary.md`

**Step 4: Verify**

Run:

```bash
python generate_dataset.py
pytest tests/data/test_lineage.py -q
```

Expected:

- Dataset regenerates.
- Lineage JSON exists.
- Lineage tests pass.

**Step 5: Commit checkpoint**

Commit message: `feat: add synthetic dataset lineage metadata`

## Task 5: Design Future Real Firm Data Import Boundary

**Files:**
- Create: `docs/data/real-firm-data-import-boundary.md`
- Create: `proforma_data/importers/__init__.py`
- Create: `proforma_data/importers/firm_csv.py`
- Create: `tests/data/test_firm_csv_importer.py`

**Step 1: Document inactive import boundary**

State that real firm import remains disabled until:

- Data sharing agreement exists.
- PDPO basis is documented.
- Solicitor confidentiality review is complete.
- Anonymization standards are approved.
- Data residency decision is recorded.

**Step 2: Define importer behavior**

The importer should validate columns and produce normalized records, but it should not persist data by default.

**Step 3: Write failing importer tests**

Tests should cover:

- Missing required columns.
- Unexpected direct identifiers.
- Valid normalized fixture.
- Rejection of client names, matter descriptions, email addresses, and free-text narratives in feasibility mode.

**Step 4: Implement minimal importer**

Accept only structured fields matching `MatterInput` and historical outcome labels. Reject direct identifiers.

**Step 5: Verify**

Run: `pytest tests/data/test_firm_csv_importer.py -q`

Expected: importer tests pass.

**Step 6: Commit checkpoint**

Commit message: `feat: add gated firm data import boundary`

## Phase 1 Final Verification

Run:

```bash
python generate_dataset.py
pytest tests/data -q
python scripts/validate_dataset.py --input output/proforma_hk_synthetic_mvp.csv --report output/validation_report.md
python -m proforma_data.schemas export-json-schema
```

Expected:

- Synthetic dataset regenerates reproducibly.
- Data tests pass.
- Validation report remains PASS.
- JSON schemas are generated.
- Real-firm import is documented as gated and rejects direct identifiers.

