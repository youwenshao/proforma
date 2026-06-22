# Phase 0 Acceptance Checklist

## Purpose

Phase 0 is complete when ProForma HK has enough architecture, requirements, and governance structure to begin implementation phases without confusing technical feasibility for regulatory approval or production readiness.

## Deliverables

| Item | Status | Evidence |
|---|---|---|
| Requirements brief exists | Technically ready | `docs/requirements/product-requirements.md` |
| Architecture brief exists | Technically ready | `docs/architecture/technical-feasibility-architecture.md` |
| Repository structure decision exists | Technically ready | `docs/architecture/repository-structure.md` |
| ADRs exist | Technically ready | `docs/adr/0001-research-first-modular-monorepo.md` through `docs/adr/0005-data-residency-and-deployment-gate.md` |
| Risk register exists | Technically ready | `docs/governance/risk-register.md` |
| Acceptance checklist exists | Technically ready | `docs/governance/phase-0-acceptance-checklist.md` |
| Later phase plans reference Phase 0 decisions | Technically ready | `docs/plans/2026-06-22-proforma-phase-1-data-foundation.md` through `docs/plans/2026-06-22-proforma-phase-6-pilot-evidence-package.md` |

## Decision Coverage

| Decision area | Gate state | Evidence |
|---|---|---|
| Research-first modular monorepo | Technically ready | ADR 0001 and repository structure brief |
| Firm-specific first model strategy | Technically ready | ADR 0002; pooled production remains Requires legal review |
| Tenant-aware contracts before production tenancy | Technically ready | ADR 0003 |
| Bilingual UI through reviewed translation catalog | Requires legal review | ADR 0004; pilot copy needs sign-off |
| Data residency and deployment gate | Requires legal review | ADR 0005; real firm data cannot enter hosted systems before approval |
| Synthetic-data feasibility mode | Technically ready | Product requirements, architecture brief, and risk register |
| Model accuracy and calibration | Requires pilot evidence | Validation report is synthetic-only; pilot evaluation is still required |

## Phase 0 Acceptance Criteria

- Product requirements brief exists and captures Matter Parameters, Predictive Analysis, Fee Structure Recommendation, and Scope Monitoring.
- Technical architecture brief exists and defines `apps/web`, `services/api`, `packages/domain`, `ml`, `data`, and `docs` boundaries.
- ADRs exist for repository structure, model strategy, tenancy, bilingual UX, and deployment/data residency.
- Risk register exists and covers Synthetic-data overclaiming, PDPO compliance, solicitor confidentiality, pooled model legal basis, data residency, model accuracy and calibration, bilingual legal terminology, and scope-creep monitoring misuse.
- Acceptance checklist exists and distinguishes Technically ready, Requires legal review, Requires pilot evidence, and Out of scope for feasibility.
- All later phase plans reference Phase 0 decisions before implementation tasks begin.
- No Phase 0 document describes ProForma as autonomous legal advice.
- No Phase 0 document presents pooled production modeling as approved.
- Every future estimate surface must preserve decision-support, uncertainty, synthetic-data, tenant, and model lineage requirements.

## Not Accepted For Production

- PDPO compliance claims remain Requires legal review.
- Solicitor confidentiality controls remain Requires legal review.
- Pooled production models remain Requires legal review.
- Real firm data pilots remain Requires pilot evidence and approved data residency controls.
- Retainer-letter generation, ORFSA module design, autonomous legal advice, and autonomous fee setting are Out of scope for feasibility.
