# ADR 0003: Tenant-Aware Contracts Before Real Tenancy

Status: Accepted

## Context

ProForma HK is not ready for production multi-tenancy in Phase 0. The feasibility build starts with synthetic data and documentation artifacts. However, later phases will need firm-specific data, firm settings, risk tolerance, model versions, and audit evidence. Adding tenancy only after API, model, and UI contracts exist would create avoidable migration risk.

Tenant context is also part of the governance story. Firm-specific modeling, pooled research gates, data residency, model deletion, and audit events all depend on knowing which firm context a request belongs to.

## Decision

Tenant IDs and model version IDs appear in contracts from the start, even before multi-tenant production infrastructure exists.

The first domain and API contracts should include `tenant_id`, model strategy, dataset version, feature version, model version, and legal-gate status. Synthetic-only flows may use a clearly labeled feasibility tenant, but they must still exercise the same contract shape expected for later firm-specific pilots.

## Consequences

- API, frontend, and ML artifacts can evolve without later retrofitting tenant and model metadata.
- Feasibility audit events can demonstrate the intended evidence trail before a full compliance system is built.
- Tests can assert that estimates are traceable to tenant, dataset, feature, and model metadata.
- The design must avoid implying that tenant-aware contracts are equivalent to production tenant isolation.

## Open questions

- What tenant identifier format should be used for pilot firms?
- Which fields belong in every request versus only in authenticated server context?
- How will tenant-specific model artifacts be retained, deleted, and excluded from pooled research when required?
