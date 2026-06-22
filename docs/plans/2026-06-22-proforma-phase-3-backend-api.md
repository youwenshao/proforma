# ProForma Phase 3 Backend And API Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a typed FastAPI service that exposes taxonomy, prediction, fee recommendation, scope monitoring, model metadata, and evaluation report endpoints for the ProForma feasibility platform.

**Architecture:** The API orchestrates Phase 1 schemas and Phase 2 inference artifacts. It validates requests with Pydantic, keeps tenant and model metadata on every prediction, returns explainable decision-support responses, and writes append-only audit events suitable for feasibility evidence.

**Tech Stack:** Python, FastAPI, Pydantic, Uvicorn, pytest, httpx, ruff or black, JSON fixtures, OpenAPI.

---

## Source Context

- Phase 1 data contracts: `proforma_data/schemas.py`
- Phase 2 inference: `ml/inference.py`
- API fixture: `artifacts/fixtures/sample_prediction_response.json`
- Proposal workflow: `docs/proforma-proposal-prelim.html`

## Phase Deliverables

- FastAPI application skeleton.
- Versioned API contracts.
- Prediction orchestration layer.
- Taxonomy endpoint.
- Fee recommendation endpoint or response section.
- Scope monitoring endpoint.
- Model metadata and evaluation report endpoints.
- Audit log writer.
- API contract tests and OpenAPI schema.

## Task 1: Create FastAPI Service Skeleton

**Files:**
- Create: `services/api/app/__init__.py`
- Create: `services/api/app/main.py`
- Create: `services/api/app/settings.py`
- Create: `services/api/app/routes/__init__.py`
- Create: `services/api/app/routes/health.py`
- Create: `services/api/tests/test_health.py`
- Create: `services/api/README.md`
- Modify: `requirements.txt`

**Step 1: Add API dependencies**

Add:

```text
fastapi
uvicorn
httpx
```

**Step 2: Write failing health test**

Create a test that calls:

```http
GET /health
```

Expected JSON:

```json
{
  "status": "ok",
  "service": "proforma-api"
}
```

Run: `pytest services/api/tests/test_health.py -q`

Expected before implementation: failure for missing app.

**Step 3: Implement app**

Create `create_app()` in `services/api/app/main.py` and register `/health`.

**Step 4: Verify**

Run:

```bash
pytest services/api/tests/test_health.py -q
uvicorn services.api.app.main:create_app --factory --port 8000
```

Expected:

- Test passes.
- Local server starts.

**Step 5: Commit checkpoint**

Commit message: `feat: add ProForma FastAPI service skeleton`

## Task 2: Add Taxonomy Endpoint

**Files:**
- Create: `services/api/app/routes/taxonomy.py`
- Create: `services/api/app/schemas.py`
- Create: `services/api/tests/test_taxonomy.py`
- Reference: `proforma_data/domain.py`

**Step 1: Write failing taxonomy test**

Call:

```http
GET /v1/taxonomy
```

Assert the response includes:

- Matter types.
- Subtypes by matter type.
- Jurisdictions.
- Firm tiers.
- Billing models.
- Stage templates.

**Step 2: Implement route**

Return domain constants from Phase 1. Include `schema_version` and `source`.

**Step 3: Verify**

Run: `pytest services/api/tests/test_taxonomy.py -q`

Expected: taxonomy test passes.

**Step 4: Commit checkpoint**

Commit message: `feat: expose ProForma taxonomy endpoint`

## Task 3: Add Prediction Endpoint

**Files:**
- Create: `services/api/app/routes/estimates.py`
- Create: `services/api/app/model_registry.py`
- Create: `services/api/app/audit.py`
- Create: `services/api/tests/test_estimates.py`
- Reference: `ml/inference.py`
- Reference: `proforma_data/schemas.py`

**Step 1: Define endpoint contract**

Endpoint:

```http
POST /v1/estimates
```

Request body:

- `tenant_id`
- `matter_input`
- `risk_tolerance`
- `model_strategy`, allowed values: `firm_specific`, `pooled_research`, `synthetic_baseline`

Response body:

- `estimate_id`
- `tenant_id`
- `model_version`
- `dataset_lineage`
- `cost_estimate`
- `duration_estimate`
- `scope_creep_probability`
- `stage_estimates`
- `fee_recommendation`
- `decision_support_disclaimer`
- `limitations`

**Step 2: Write failing tests**

Assert:

- Valid matter input returns 200.
- Invalid `complexity_score` returns 422.
- Pooled research strategy returns a legal-gate limitation.
- Response includes model version and disclaimer.
- Audit event is written after successful prediction.

**Step 3: Implement model registry**

For feasibility, the registry should support:

- Loading local Phase 2 artifacts when present.
- Falling back to a deterministic fixture predictor only in explicitly labeled `synthetic_baseline` mode.
- Returning clear 503 errors when requested production-like artifacts are missing.

**Step 4: Implement audit writer**

Write JSONL events to:

```text
artifacts/audit/prediction_requests.jsonl
```

Each event should include:

- `event_id`
- `timestamp`
- `tenant_id`
- `estimate_id`
- `model_version`
- `model_strategy`
- `input_summary_hash`
- `synthetic_mode`

Do not log free text, client names, or raw confidential fields.

**Step 5: Verify**

Run: `pytest services/api/tests/test_estimates.py -q`

Expected: estimate contract tests pass.

**Step 6: Commit checkpoint**

Commit message: `feat: add typed estimate prediction endpoint`

## Task 4: Add Fee Recommendation Rules

**Files:**
- Create: `services/api/app/fee_rules.py`
- Create: `services/api/tests/test_fee_rules.py`
- Modify: `services/api/app/routes/estimates.py`

**Step 1: Define risk tolerance settings**

Use:

- `conservative`
- `balanced`
- `aggressive`

**Step 2: Write tests**

Assert:

- Conservative recommendation is greater than or equal to balanced for fixed-fee proposals.
- Capped-fee recommendation includes cap amount and expected downside.
- Recommendation always includes partner-final-decision disclaimer.
- Recommendation never describes itself as legal advice.

**Step 3: Implement deterministic rules**

Use model intervals:

- Conservative: anchor near p90 plus contingency.
- Balanced: anchor near p50 to p75 depending on variance.
- Aggressive: anchor near p50 with explicit risk warning.

**Step 4: Verify**

Run: `pytest services/api/tests/test_fee_rules.py -q`

Expected: fee rule tests pass.

**Step 5: Commit checkpoint**

Commit message: `feat: add explainable fee recommendation rules`

## Task 5: Add Scope Monitoring Endpoint

**Files:**
- Create: `services/api/app/routes/scope_monitoring.py`
- Create: `services/api/app/scope_monitoring.py`
- Create: `services/api/tests/test_scope_monitoring.py`

**Step 1: Define endpoint contract**

Endpoint:

```http
POST /v1/estimates/{estimate_id}/scope-updates
```

Request body:

- `stage_name`
- `actual_partner_hours`
- `actual_associate_hours`
- `actual_cost_hkd`
- `update_note`, optional but disabled for confidential free text in feasibility mode.

Response body:

- `estimate_id`
- `stage_name`
- `predicted_hours`
- `actual_hours`
- `variance_pct`
- `scope_creep_flag`
- `recommended_review_action`

**Step 2: Write tests**

Assert:

- Variance above threshold flags scope creep.
- Missing stage returns 404 or 422.
- Free-text update notes are rejected in feasibility mode unless explicitly enabled.
- Response uses stage-level predictions from the estimate fixture.

**Step 3: Implement monitoring logic**

Use thresholds:

- Warning: > 5 percent above predicted stage hours or cost.
- Critical: > 15 percent above predicted stage hours or cost.

**Step 4: Verify**

Run: `pytest services/api/tests/test_scope_monitoring.py -q`

Expected: scope monitoring tests pass.

**Step 5: Commit checkpoint**

Commit message: `feat: add stage-level scope monitoring API`

## Task 6: Add Model Metadata And Evaluation Endpoints

**Files:**
- Create: `services/api/app/routes/models.py`
- Create: `services/api/tests/test_models.py`

**Step 1: Define endpoints**

Add:

```http
GET /v1/models/current
GET /v1/models/evaluation
GET /v1/models/strategy-comparison
```

**Step 2: Write tests**

Assert:

- Current model endpoint includes model version, feature version, dataset lineage, and synthetic-data flag.
- Evaluation endpoint surfaces metrics by matter type.
- Strategy comparison endpoint includes firm-specific and pooled research tracks.
- Pooled track response includes legal-gate status.

**Step 3: Implement report readers**

Read from Phase 2 reports in `artifacts/reports/`. If missing, return a structured `not_available` response instead of crashing.

**Step 4: Verify**

Run: `pytest services/api/tests/test_models.py -q`

Expected: model metadata tests pass.

**Step 5: Commit checkpoint**

Commit message: `feat: expose model metadata and evaluation endpoints`

## Task 7: Generate And Review OpenAPI Contract

**Files:**
- Create: `services/api/openapi.json`
- Create: `services/api/tests/test_openapi_contract.py`
- Modify: `services/api/README.md`

**Step 1: Add OpenAPI generation command**

Create command:

```bash
python -m services.api.app.main export-openapi --output services/api/openapi.json
```

**Step 2: Write contract tests**

Assert:

- `/v1/taxonomy` appears.
- `/v1/estimates` appears.
- `/v1/estimates/{estimate_id}/scope-updates` appears.
- `/v1/models/current` appears.
- `MatterInput` schema appears.

**Step 3: Document local API workflow**

In `services/api/README.md`, include:

- Install.
- Test.
- Run server.
- Export OpenAPI.
- Synthetic-mode limitation.

**Step 4: Verify**

Run:

```bash
pytest services/api/tests -q
python -m services.api.app.main export-openapi --output services/api/openapi.json
rg "/v1/estimates|MatterInput|decision_support_disclaimer" services/api/openapi.json
```

Expected:

- API tests pass.
- OpenAPI file is generated.
- Contract includes estimate and disclaimer fields.

**Step 5: Commit checkpoint**

Commit message: `docs: add ProForma API contract`

## Phase 3 Final Verification

Run:

```bash
pytest services/api/tests -q
python -m services.api.app.main export-openapi --output services/api/openapi.json
rg "/v1/taxonomy|/v1/estimates|/v1/models/current|decision_support_disclaimer|legal-gate" services/api
```

Expected:

- API tests pass.
- OpenAPI contract is current.
- Prediction responses include model version, lineage, disclaimer, and limitations.
- Scope monitoring flags stage-level variance.
- Pooled research remains visibly legally gated.

