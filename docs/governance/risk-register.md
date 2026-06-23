# ProForma HK Phase 0 Risk Register

## Purpose

This register separates technical feasibility from legal, regulatory, pilot, and production readiness. It applies to the Phase 0 architecture and must be revisited before any real firm data, pooled production model, hosted pilot, or client-facing compliance claim.

## Gate States

- Technically ready: sufficient for synthetic-data feasibility work or controlled internal demos.
- Requires legal review: blocked until legal or regulatory advice confirms the proposed path.
- Requires pilot evidence: technically plausible, but needs evidence from controlled firm pilots before production use.
- Out of scope for feasibility: intentionally excluded from the first feasibility build.

## Risks

| Risk category | Gate state | Phase 0 position | Required next control |
|---|---|---|---|
| Synthetic-data overclaiming | Technically ready | `SYNTHETIC_MVP_V1` supports architecture and workflow validation only. It must not be described as market proof, legal approval, or production model evidence. | Keep Synthetic-data labels across API, frontend, reports, and evidence packets. |
| PDPO compliance | Requires legal review | Phase 0 can identify data fields, lineage, and consent questions, but it cannot claim PDPO compliance. | Create a PDPO control checklist, privacy notice draft, data-processing basis, and retention/deletion policy before real firm data. |
| Solicitor confidentiality | Requires legal review | Matter metadata and derived model artifacts may still implicate professional confidentiality even without full documents. | Obtain solicitor confidentiality review for import, storage, model training, reporting, and deletion workflows. |
| Pooled model legal basis | Requires legal review | Firm-specific modeling is the first product-safe path; pooled anonymized modeling is research-only. | Document legal basis, anonymization standard, data sharing agreement, opt-out controls, and Law Society guidance before production use. |
| Data residency | Requires legal review | Synthetic demos can run locally or in non-production environments, but hosted real firm data needs a deployment decision. | Approve hosting regions, access controls, backup/log handling, and tenant deletion before pilot data ingestion. |
| Model accuracy and calibration | Requires pilot evidence | Synthetic validation passes, but production accuracy and calibration require real firm samples. | Run firm-specific pilot evaluation with matter-type stratification, prediction intervals, and model cards. |
| Bilingual legal terminology | Requires legal review | Bilingual UX is required, but legal terminology and disclaimers must be reviewed before pilot use. | Maintain reviewed English and Traditional Chinese translation catalog with sign-off status. |
| Scope-creep monitoring misuse | Requires pilot evidence | Variance alerts are useful for decision support, but may be misused as performance judgments or client-facing assertions. | Test partner workflow, disclaimers, alert thresholds, and audit context during controlled pilot. |
| Quote substantiation packs | Requires pilot evidence | Internal partner previews are decision-support evidence only. Client-facing PDFs require partner approval, immutable snapshots, model/data lineage, storage access controls, download audit, expiry, and revocation. | Keep preview and approved-client states separate; store PDFs in controlled object storage, not database rows; verify RLS, retention, deletion, and disclaimer copy before hosted pilots. |

## Explicit Exclusions

- Retainer-letter generation is Out of scope for feasibility.
- ORFSA modeling is Out of scope for feasibility except as a future arbitration-specific module.
- Autonomous legal advice and autonomous fee setting are Out of scope for feasibility.
- Pooled production modeling is not Technically ready and remains blocked until legal review approves it.

## Review Triggers

- A later phase introduces real firm data, hosted processing, tenant-specific model artifacts, or client-facing reports.
- A quote substantiation pack becomes shareable outside the firm or is attached to a client fee proposal.
- A model strategy changes from synthetic baseline or firm-specific pilot to pooled research or pooled production.
- A UI flow changes disclaimer wording, bilingual legal terminology, or partner review requirements.
- Pilot evidence contradicts synthetic-data assumptions about scope creep, calibration, or matter-type behavior.
