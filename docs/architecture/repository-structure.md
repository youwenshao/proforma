# ProForma HK Repository Structure

## Decision

ProForma will use a modular monorepo organized around product surfaces, service boundaries, shared domain contracts, ML research, data staging, governance, and tests. Phase 0 records the intended structure before product code is introduced, so later phases can add folders deliberately without mixing UI, API, model, and compliance responsibilities.

## Target Structure

```text
apps/web/
services/api/
packages/domain/
ml/
data/
docs/requirements/
docs/architecture/
docs/adr/
docs/governance/
docs/plans/
tests/
```

## Ownership

| Folder | Primary concerns | Phase 0 constraints |
|---|---|---|
| `apps/web` | UI, i18n, accessibility, workflow smoke tests | Bilingual English and Traditional Chinese flows, uncertainty labels, decision-support disclaimers, synthetic-data notices |
| `services/api` | Request validation, prediction orchestration, taxonomy endpoints, evaluation endpoints, audit logging | Typed estimates only, tenant-aware request context, model metadata on every response |
| `packages/domain` | Shared schemas, generated clients, stable enums, contract tests | Source of truth for matter inputs, estimate responses, tenancy, model strategy, gate states |
| `ml` | Feature engineering, model training, evaluation, model cards, artifacts | Reproducible synthetic baseline, firm-specific and pooled research comparison, legal-gate wording in reports |
| `data` | Fixtures and staging only | No confidential firm data in git; real firm imports require approval gates and anonymization workflow |
| `docs/requirements` | Product and feasibility requirements | Separates technical feasibility from legal/regulatory approval |
| `docs/architecture` | Architecture briefs and repository decisions | Records service boundaries before implementation |
| `docs/adr` | Architecture Decision Records | Captures model strategy, tenancy, bilingual UX, deployment, and data residency decisions |
| `docs/governance` | Compliance checklist, threat model, model governance, risk register, acceptance gates | Tracks PDPO, solicitor confidentiality, Law Society guidance, and synthetic-data limitations |
| `docs/plans` | Phase implementation plans | Later plans must reference Phase 0 decisions and gates |
| `tests` | Cross-package and end-to-end tests | Contract, API, ML, frontend, governance, and workflow verification |

## Boundary Rules

- UI code in `apps/web` consumes generated clients or shared schemas; it must not import ML internals or parse raw CSV data.
- API code in `services/api` owns orchestration and audit events; it may call model artifacts but should not train models at request time.
- ML code in `ml` owns training and evaluation; it emits artifacts and reports rather than HTTP behavior.
- Shared contracts in `packages/domain` define stable data shapes and enums for model strategy, gate state, tenancy, and synthetic-data labels.
- `data` is a local development and staging area only. Confidential firm data must remain outside git and enter only through a documented import boundary.
- Governance documents are first-class architecture inputs. A feature that violates a gate should be blocked in contracts, API behavior, UI copy, or model reports.

## Initial Implementation Order

1. Preserve existing `docs/plans`, `docs/data_dictionary.md`, validation report, generator, and synthetic CSV as Phase 0 source context.
2. Add Phase 0 requirements, architecture, ADR, and governance documents.
3. In Phase 1, introduce `packages/domain`, `data` staging conventions, and schema tests.
4. In Phase 2, introduce `ml` experiments, artifacts, and model cards.
5. In Phase 3, introduce `services/api` using domain schemas and model artifacts.
6. In Phase 4, introduce `apps/web` using generated or shared contracts.
7. Add `tests` suites as each implementation surface appears.

## Repository Hygiene

- Generated artifacts should be reviewed before commit and should not obscure source documents.
- Real firm matter data, credentials, exported client documents, and confidential work product must not be committed.
- Synthetic data and reports must retain explicit `SYNTHETIC_MVP_V1` lineage until replaced by an approved dataset version.
- Commit history should keep documentation gates and product code changes reviewable in small checkpoints.
