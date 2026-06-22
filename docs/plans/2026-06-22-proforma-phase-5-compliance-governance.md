# ProForma Phase 5 Compliance, Security, And Governance Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Define and implement the compliance, security, and model governance controls needed for a credible technical feasibility package without claiming regulatory approval.

**Architecture:** Governance artifacts live under `docs/governance/` and are enforced through API, data, ML, and frontend checks. The system treats real firm data, pooled anonymized training, and production tenancy as gated capabilities that require legal review and explicit enablement.

**Tech Stack:** Markdown governance docs, Python validation tests, FastAPI audit logs, frontend notices, JSON policy files, pytest, Playwright.

---

## Source Context

- Compliance rows: `docs/proforma-proposal-prelim.html`
- Phase 0 risk register: `docs/governance/risk-register.md`
- Phase 1 data importer boundary: `docs/data/real-firm-data-import-boundary.md`
- Phase 2 model cards: `artifacts/reports/`
- Phase 3 audit logs: `artifacts/audit/prediction_requests.jsonl`
- Phase 4 frontend notices: `apps/web`

## Phase Deliverables

- PDPO control checklist.
- Solicitor confidentiality checklist.
- Tenant isolation policy.
- Data retention and deletion policy.
- Pooled model approval gate.
- Threat model.
- Model governance policy.
- Security test plan.
- Controls backlog for pilot readiness.

## Task 1: Create Compliance Control Matrix

**Files:**
- Create: `docs/governance/compliance-control-matrix.md`
- Create: `docs/governance/pdpo-checklist.md`
- Create: `docs/governance/solicitor-confidentiality-checklist.md`
- Create: `tests/governance/test_compliance_docs.py`

**Step 1: Map proposal requirements**

Cover:

- PDPO compliance.
- Data residency.
- SOC 2 Type II roadmap.
- Law Society engagement.
- Anti-money laundering relevance.
- Solicitor confidentiality.

**Step 2: Define control states**

Use:

- `implemented_for_feasibility`
- `requires_legal_review`
- `requires_pilot_evidence`
- `requires_production_hardening`
- `out_of_scope_for_feasibility`

**Step 3: Write document tests**

Assert:

- Every proposal compliance row appears in the control matrix.
- Pooled anonymized training is marked `requires_legal_review`.
- SOC 2 Type II is marked roadmap or production-hardening, not feasibility-complete.
- The docs do not claim Law Society approval.

**Step 4: Verify**

Run: `pytest tests/governance/test_compliance_docs.py -q`

Expected: compliance document tests pass.

**Step 5: Commit checkpoint**

Commit message: `docs: add ProForma compliance control matrix`

## Task 2: Define Tenant Isolation And Data Handling Policy

**Files:**
- Create: `docs/governance/tenant-isolation-policy.md`
- Create: `docs/governance/data-retention-and-deletion-policy.md`
- Create: `docs/governance/data-classification.md`
- Create: `tests/governance/test_data_governance.py`

**Step 1: Classify data**

Use these classes:

- Public proposal material.
- Synthetic dataset.
- Derived model metrics.
- Firm structured matter data.
- Confidential client/matter identifiers.
- Model artifacts.
- Audit events.

**Step 2: Define feasibility handling rules**

State:

- No confidential client names or matter narratives in git.
- Real firm data import is disabled by default.
- Free-text matter descriptions are out of scope for feasibility.
- Audit logs store summaries and hashes, not raw confidential inputs.
- Tenant ID is required in contracts before production tenancy exists.

**Step 3: Define deletion and retention**

Document:

- Synthetic data can be retained indefinitely as generated test data.
- Real firm staging data must have retention limits set per agreement.
- Audit event retention must be configurable before pilot.
- Model artifacts trained on firm data must be deletable by tenant.

**Step 4: Write tests**

Assert docs include:

- `no confidential client names`
- `free-text matter descriptions are out of scope`
- `tenant_id`
- `delete model artifacts`

**Step 5: Verify**

Run: `pytest tests/governance/test_data_governance.py -q`

Expected: data governance tests pass.

**Step 6: Commit checkpoint**

Commit message: `docs: define ProForma data governance policy`

## Task 3: Add Pooled Model Legal Gate

**Files:**
- Create: `docs/governance/pooled-model-approval-gate.md`
- Create: `policy/model_strategy_gates.json`
- Create: `tests/governance/test_model_strategy_gates.py`
- Modify: `ml/experiments/model_strategy_comparison.py`
- Modify: `services/api/app/routes/estimates.py`
- Modify: `apps/web/components/estimate/limitations-alert.tsx`

**Step 1: Define gate states**

Use:

```json
{
  "firm_specific": "allowed_for_feasibility",
  "synthetic_baseline": "allowed_for_feasibility",
  "pooled_research": "research_only_requires_legal_review",
  "pooled_production": "blocked_until_approved"
}
```

**Step 2: Write tests**

Assert:

- API cannot treat pooled research as production-ready.
- Frontend displays legal-gate notice for pooled research.
- Model comparison report includes legal-gate wording.
- `pooled_production` requests are rejected until approval config changes.

**Step 3: Implement gate checks**

Make the gate file the single source of truth for strategy status.

**Step 4: Verify**

Run:

```bash
pytest tests/governance/test_model_strategy_gates.py -q
pytest services/api/tests/test_estimates.py -q
pnpm --dir apps/web test -- estimate-results
```

Expected: pooled strategy is consistently gated across ML, API, and UI.

**Step 5: Commit checkpoint**

Commit message: `feat: enforce pooled model legal gate`

## Task 4: Write Threat Model

**Files:**
- Create: `docs/governance/threat-model.md`
- Create: `tests/governance/test_threat_model.py`

**Step 1: Cover system surfaces**

Include:

- Dataset generation and import.
- Model artifacts.
- FastAPI endpoints.
- Prediction audit logs.
- Web frontend.
- Translation catalog.
- Future real-firm data ingestion.

**Step 2: Use STRIDE-style categories**

Cover:

- Spoofing.
- Tampering.
- Repudiation.
- Information disclosure.
- Denial of service.
- Elevation of privilege.

**Step 3: Add mitigations**

Include:

- Structured input only.
- No free-text confidential fields in feasibility mode.
- Tenant ID and model version on every event.
- Request validation.
- Audit logging.
- Artifact versioning.
- Pooled model gating.
- Secrets management before deployment.

**Step 4: Write tests**

Assert every STRIDE category appears and every system surface is covered.

**Step 5: Verify**

Run: `pytest tests/governance/test_threat_model.py -q`

Expected: threat model tests pass.

**Step 6: Commit checkpoint**

Commit message: `docs: add ProForma threat model`

## Task 5: Define Model Governance Policy

**Files:**
- Create: `docs/governance/model-governance-policy.md`
- Create: `docs/governance/retraining-policy.md`
- Create: `docs/governance/model-rollback-policy.md`
- Create: `tests/governance/test_model_governance.py`

**Step 1: Define required model metadata**

Every model must have:

- `model_version`
- `feature_version`
- `schema_version`
- `dataset_lineage`
- `training_run_id`
- `evaluation_report_path`
- `model_card_path`
- `allowed_use`
- `excluded_use`

**Step 2: Define release gates**

Model promotion requires:

- Evaluation report.
- Model card.
- Calibration summary.
- Segment metrics by matter type.
- Synthetic/real data status.
- Legal gate status for model strategy.
- Rollback path.

**Step 3: Define retraining triggers**

Include:

- New firm dataset.
- Significant error drift.
- New matter type.
- Regulatory requirement change.
- Feature schema change.

**Step 4: Write tests**

Assert docs mention:

- Model card.
- Calibration.
- Rollback.
- Excluded use.
- Legal gate status.

**Step 5: Verify**

Run: `pytest tests/governance/test_model_governance.py -q`

Expected: model governance tests pass.

**Step 6: Commit checkpoint**

Commit message: `docs: add ProForma model governance policy`

## Task 6: Add Security Test Plan

**Files:**
- Create: `docs/governance/security-test-plan.md`
- Create: `tests/security/test_no_confidential_fields.py`
- Create: `tests/security/test_api_validation.py`
- Create: `tests/security/test_audit_log_redaction.py`

**Step 1: Define security checks**

Add tests for:

- Rejection of direct identifiers in firm import.
- Rejection of free-text narratives in feasibility mode.
- API validation rejects invalid schemas.
- Audit logs omit client names, emails, matter narratives, and raw input payloads.
- Frontend displays synthetic-data and legal-gate notices.

**Step 2: Write failing tests**

Make tests reference existing Phase 1, Phase 3, and Phase 4 behavior.

**Step 3: Implement only missing enforcement**

Do not add broad auth infrastructure in feasibility mode unless required. Record production auth as pilot-readiness backlog.

**Step 4: Verify**

Run:

```bash
pytest tests/security -q
pytest tests/governance -q
```

Expected: security and governance tests pass.

**Step 5: Commit checkpoint**

Commit message: `test: add ProForma security governance checks`

## Task 7: Create Pilot Controls Backlog

**Files:**
- Create: `docs/governance/pilot-controls-backlog.md`

**Step 1: Define backlog categories**

Include:

- Authentication and authorization.
- Tenant isolation in persistent storage.
- Data processing agreement templates.
- Data residency deployment decision.
- Secrets management.
- Backup and deletion workflows.
- Admin audit review.
- Monitoring and incident response.
- SOC 2 readiness.
- Legal review signoffs.

**Step 2: Prioritize controls**

Use:

- Required before real firm data.
- Required before multi-firm pilot.
- Required before production launch.
- Later hardening.

**Step 3: Verify**

Run: `rg "Required before real firm data|SOC 2|Legal review|tenant isolation" docs/governance/pilot-controls-backlog.md`

Expected: backlog includes key pilot gates.

**Step 4: Commit checkpoint**

Commit message: `docs: add ProForma pilot controls backlog`

## Phase 5 Final Verification

Run:

```bash
pytest tests/governance -q
pytest tests/security -q
rg "requires_legal_review|PDPO|solicitor confidentiality|tenant_id|rollback|SOC 2|Law Society" docs/governance policy
```

Expected:

- Governance and security tests pass.
- Pooled model use is blocked from production claims.
- Docs do not claim Law Society approval.
- Controls needed before real firm data are explicit.
- Model governance and rollback requirements are documented.

