# ProForma Phase 6 Pilot And Evidence Package Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Package the feasibility work into technical, regulatory, and pilot-readiness artifacts suitable for Law Society engagement, firm introductions, and a future controlled pilot.

**Architecture:** This phase does not add core product capability. It consolidates outputs from data, ML, API, frontend, and governance tracks into evidence documents, reproducible demo scripts, pilot protocol materials, and go/no-go criteria.

**Tech Stack:** Markdown, generated reports, Python report assembly scripts, Playwright demo scripts, JSON evidence manifests, pytest document checks.

---

## Source Context

- Proposal call to action: `docs/proforma-proposal-prelim.html`
- Phase 0 requirements: `docs/requirements/product-requirements.md`
- Phase 0 architecture: `docs/architecture/technical-feasibility-architecture.md`
- Phase 0 acceptance checklist: `docs/governance/phase-0-acceptance-checklist.md`
- Phase 0 gates: `docs/governance/risk-register.md`
- Dataset validation: `output/validation_report.md`
- Dataset lineage: `output/dataset_lineage.json`
- Model comparison: `artifacts/reports/model_strategy_comparison.md`
- Model cards: `artifacts/reports/model_card_*.md`
- API contract: `services/api/openapi.json`
- Frontend workflow: `apps/web`
- Governance docs: `docs/governance`

## Phase Deliverables

- Technical feasibility report.
- Evidence manifest.
- Synthetic-data demo script.
- Pilot protocol for 3-5 firms.
- Data partner onboarding draft.
- Law Society engagement packet outline.
- Pilot evaluation metrics.
- Go/no-go decision framework.
- Roadmap update separating technically ready, legally gated, pilot-gated, and out-of-scope items.

## Task 1: Create Evidence Manifest

**Files:**
- Create: `docs/evidence/evidence-manifest.md`
- Create: `docs/evidence/evidence-manifest.json`
- Create: `tests/evidence/test_evidence_manifest.py`

**Step 1: Define evidence categories**

Include:

- Proposal and requirements.
- Data generation and validation.
- Dataset lineage.
- Model training and evaluation.
- Firm-specific versus pooled comparison.
- API contract.
- Frontend workflow.
- Compliance and governance.
- Security and privacy controls.
- Known limitations.

**Step 2: Create JSON manifest**

Each entry should include:

- `artifact_id`
- `path`
- `category`
- `source_phase`
- `status`
- `owner`
- `review_required`
- `last_generated`

**Step 3: Write tests**

Assert:

- Every phase has at least one evidence artifact.
- Synthetic dataset evidence is marked synthetic.
- Pooled model evidence is marked legal-review required.
- Missing files fail the manifest test.

**Step 4: Verify**

Run: `pytest tests/evidence/test_evidence_manifest.py -q`

Expected: manifest tests pass.

**Step 5: Commit checkpoint**

Commit message: `docs: add ProForma evidence manifest`

## Task 2: Assemble Technical Feasibility Report

**Files:**
- Create: `docs/evidence/technical-feasibility-report.md`
- Create: `scripts/build_feasibility_report.py`
- Create: `tests/evidence/test_feasibility_report.py`

**Step 1: Define report sections**

Include:

- Executive summary.
- Product workflow.
- Dataset summary.
- Validation results.
- Feature and schema contract.
- Model benchmark summary.
- Firm-specific versus pooled comparison.
- API architecture.
- Frontend workflow.
- Governance posture.
- Legal and regulatory gates.
- Pilot readiness status.
- Remaining limitations.

**Step 2: Build report script**

Create:

```bash
python scripts/build_feasibility_report.py --output docs/evidence/technical-feasibility-report.md
```

The script should read available evidence artifacts and clearly mark missing artifacts as `not yet generated`.

**Step 3: Write tests**

Assert report includes:

- `Synthetic MVP`
- `4,000`
- `firm-specific`
- `pooled`
- `PDPO`
- `decision-support`
- `not legal advice`
- `Law Society`

**Step 4: Verify**

Run:

```bash
python scripts/build_feasibility_report.py --output docs/evidence/technical-feasibility-report.md
pytest tests/evidence/test_feasibility_report.py -q
```

Expected: report builds and tests pass.

**Step 5: Commit checkpoint**

Commit message: `docs: assemble technical feasibility report`

## Task 3: Create Synthetic Demo Script

**Files:**
- Create: `docs/evidence/demo-script-synthetic.md`
- Create: `apps/web/e2e/demo-script.spec.ts`
- Create: `tests/evidence/test_demo_script.py`

**Step 1: Define demo narrative**

Demo flow:

1. Open dashboard.
2. Show synthetic-data notice.
3. Create new estimate for a GBA cross-border matter.
4. Review cost and duration intervals.
5. Review stage-level breakdown.
6. Compare fixed-fee and capped-fee recommendations.
7. Trigger scope monitoring variance.
8. Open model evidence view.
9. Show firm-specific versus pooled comparison.
10. State limitations and legal gates.

**Step 2: Write demo script document**

Include:

- Speaker notes.
- Expected UI state.
- API endpoint involved.
- Evidence artifact to reference.
- Caveat to state aloud.

**Step 3: Write Playwright demo test**

Use mocked API responses so the demo is deterministic. The test should fail if the synthetic-data notice or legal-gate notice disappears.

**Step 4: Verify**

Run:

```bash
pytest tests/evidence/test_demo_script.py -q
pnpm --dir apps/web exec playwright test apps/web/e2e/demo-script.spec.ts
```

Expected: document checks and demo E2E pass.

**Step 5: Commit checkpoint**

Commit message: `docs: add synthetic ProForma demo script`

## Task 4: Define Pilot Protocol

**Files:**
- Create: `docs/pilot/pilot-protocol.md`
- Create: `docs/pilot/pilot-evaluation-metrics.md`
- Create: `docs/pilot/pilot-firm-selection.md`
- Create: `tests/pilot/test_pilot_protocol.py`

**Step 1: Define pilot shape**

Target:

- 3-5 Hong Kong firms.
- Mix of boutique, mid-tier, local full-service, international, and PRC elite HK practices when feasible.
- Minimum 1,000 total anonymized historical matters across participants.
- Structured fields only for first pilot.
- No confidential free-text matter narratives.

**Step 2: Define pilot phases**

Use:

- Data readiness review.
- Anonymized data import dry run.
- Retrospective model evaluation.
- Shadow pricing workflow.
- Partner UX feedback.
- Scope monitoring simulation.
- Pilot report.

**Step 3: Define evaluation metrics**

Include:

- Cost MAE, RMSE, and sMAPE.
- Duration MAE.
- Prediction interval coverage.
- Scope-creep classification precision and recall.
- Calibration by matter type.
- Partner usefulness score.
- Time-to-estimate.
- Bilingual comprehension feedback.
- Data quality failure rate.

**Step 4: Write tests**

Assert:

- Pilot protocol mentions 3-5 firms.
- Protocol requires legal and data-sharing approval before real data.
- Protocol excludes free-text narratives.
- Metrics include accuracy, calibration, UX, and data quality.

**Step 5: Verify**

Run: `pytest tests/pilot/test_pilot_protocol.py -q`

Expected: pilot protocol tests pass.

**Step 6: Commit checkpoint**

Commit message: `docs: define ProForma pilot protocol`

## Task 5: Create Data Partner Onboarding Draft

**Files:**
- Create: `docs/pilot/data-partner-onboarding.md`
- Create: `docs/pilot/data-submission-template.csv`
- Create: `docs/pilot/anonymization-checklist.md`
- Create: `tests/pilot/test_data_partner_onboarding.py`

**Step 1: Define onboarding steps**

Include:

- Introductory call.
- Data inventory.
- Legal and confidentiality review.
- Data sharing agreement.
- Field mapping.
- Anonymization dry run.
- Validation report review.
- Model evaluation run.
- Pilot feedback session.

**Step 2: Create submission template**

Template columns should align to Phase 1 structured fields:

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
- `stage_names`
- `total_cost_hkd`
- `duration_days`
- `scope_creep_flag`

Do not include client names, matter descriptions, emails, or narrative facts.

**Step 3: Write anonymization checklist**

Checklist must cover:

- Direct identifiers.
- Indirect identifiers.
- Small-cell risk.
- Date generalization.
- Matter value bucketing if required.
- Free-text removal.
- Approval record.

**Step 4: Write tests**

Assert:

- Template excludes direct identifier columns.
- Checklist includes free-text removal.
- Onboarding doc requires legal review before transfer.

**Step 5: Verify**

Run: `pytest tests/pilot/test_data_partner_onboarding.py -q`

Expected: onboarding tests pass.

**Step 6: Commit checkpoint**

Commit message: `docs: add data partner onboarding materials`

## Task 6: Prepare Law Society Engagement Packet Outline

**Files:**
- Create: `docs/evidence/law-society-engagement-packet.md`
- Create: `tests/evidence/test_law_society_packet.py`

**Step 1: Define packet sections**

Include:

- Problem statement.
- Decision-support positioning.
- Product workflow.
- Synthetic-data status.
- Technical feasibility architecture.
- Model strategy comparison.
- Data protection controls.
- Questions requiring guidance.
- Pilot support request.
- Introductions request.

**Step 2: Define guidance questions**

Ask for guidance on:

- Whether pricing decision-support outputs require approval or disclaimers.
- Appropriate costs-disclosure framing.
- Conditions for anonymized multi-firm model training.
- Solicitor confidentiality constraints.
- Data residency expectations.
- Recommended bilingual disclaimers.

**Step 3: Write tests**

Assert:

- Packet includes `decision-support`.
- Packet does not claim approval.
- Packet includes anonymized multi-firm training question.
- Packet includes pilot support request.

**Step 4: Verify**

Run: `pytest tests/evidence/test_law_society_packet.py -q`

Expected: packet tests pass.

**Step 5: Commit checkpoint**

Commit message: `docs: outline Law Society engagement packet`

## Task 7: Define Go/No-Go Framework

**Files:**
- Create: `docs/evidence/go-no-go-framework.md`
- Create: `docs/evidence/roadmap-status-update.md`
- Create: `tests/evidence/test_go_no_go.py`

**Step 1: Define decision categories**

Use:

- Technically ready.
- Requires more model evidence.
- Requires legal review.
- Requires pilot evidence.
- Requires production hardening.
- Out of scope.

**Step 2: Define go criteria**

Move from feasibility to pilot only if:

- Dataset validation pipeline is reproducible.
- Model benchmarks beat naive baselines by meaningful margins.
- Prediction intervals are calibrated enough for decision support.
- API and frontend workflow pass end-to-end smoke tests.
- Compliance controls before real data are documented.
- Legal review confirms pilot data handling path.
- Pilot firms agree to structured anonymized data format.

**Step 3: Define no-go criteria**

Stop or redesign if:

- Models cannot beat baselines on key matter types.
- Prediction intervals are misleading or poorly calibrated.
- Real firm data cannot be anonymized to approved standards.
- Law Society guidance blocks pooled training or requires different disclaimers.
- Partners find recommendations confusing or overconfident.

**Step 4: Update roadmap status**

Classify each roadmap item:

- Data foundation.
- ML scaffold.
- Backend API.
- Frontend workflow.
- Compliance controls.
- Pilot onboarding.
- ORFSA module.
- SOC 2.
- Pricing strategy validation.

**Step 5: Verify**

Run: `pytest tests/evidence/test_go_no_go.py -q`

Expected: go/no-go tests pass.

**Step 6: Commit checkpoint**

Commit message: `docs: add ProForma go no-go framework`

## Phase 6 Final Verification

Run:

```bash
pytest tests/evidence -q
pytest tests/pilot -q
python scripts/build_feasibility_report.py --output docs/evidence/technical-feasibility-report.md
rg "Synthetic|decision-support|firm-specific|pooled|PDPO|Law Society|3-5 firms|go/no-go" docs/evidence docs/pilot
```

Expected:

- Evidence and pilot tests pass.
- Feasibility report builds.
- Demo and pilot materials clearly label synthetic data.
- Pooled training remains legal-review gated.
- Pilot protocol is ready for external review but does not claim regulatory approval.

