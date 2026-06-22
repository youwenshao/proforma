# ADR 0005: Data Residency And Deployment Gate

Status: Accepted

## Context

The proposal identifies data residency and consent as product concerns, but Phase 0 has not selected a production deployment model or completed legal review. The current dataset is synthetic and safe for feasibility demonstrations. Real firm data would introduce PDPO, solicitor confidentiality, client confidentiality, retention, deletion, backup, access-control, and residency obligations.

Deployment architecture also affects model artifacts. Firm-specific models, audit events, evidence reports, and import staging may all contain sensitive derived information even when raw client documents are excluded.

## Decision

Treat deployment and data residency as a formal gate before real firm data enters hosted systems.

Phase 0 and synthetic demos may run locally or in non-production environments using synthetic data. Any pilot involving real firm data requires an approved deployment and data-residency decision, documented data-processing terms, access controls, retention/deletion policy, and model artifact handling rules.

## Consequences

- Technical feasibility can proceed without implying production hosting approval.
- Later phases must keep real firm data out of git and out of unapproved hosted systems.
- API, ML, and governance plans need controls for tenant isolation, artifact deletion, audit retention, and rollback.
- Marketing or proposal language must distinguish data-residency controls from broad PDPO compliance claims.

## Open questions

- Which hosting regions and vendors are acceptable for Hong Kong pilot firms?
- What evidence is required before declaring data residency controls pilot-ready?
- How should backups, logs, model artifacts, and evaluation reports be deleted for a tenant?
