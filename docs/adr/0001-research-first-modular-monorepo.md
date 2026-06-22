# ADR 0001: Research-First Modular Monorepo

Status: Accepted

## Context

ProForma HK is starting from an amended competition proposal, a synthetic dataset, and validation evidence rather than an existing production application. The first engineering risk is not UI implementation speed; it is keeping product requirements, model research, API contracts, and governance decisions aligned while the concept is still being validated.

The target architecture includes a bilingual Next.js frontend, a FastAPI service, a Python ML workspace, shared domain contracts, local data staging, and governance documentation. These tracks need independent ownership, but they also need tight review of cross-cutting constraints such as synthetic-data labeling, tenant context, model metadata, and legal gates.

## Decision

Use a modular monorepo with separate top-level areas for `apps/web`, `services/api`, `packages/domain`, `ml`, `data`, `docs`, and `tests`.

Phase 0 remains documentation-first. Product code will be introduced only after requirements, architecture, ADRs, and governance gates exist. Shared schemas or generated clients in `packages/domain` will become the contract boundary between frontend, API, and ML outputs.

## Consequences

- Requirements, architecture, model research, API contracts, and governance can be reviewed in one repository without hiding ownership boundaries.
- Later phases can add implementation folders incrementally while keeping Phase 0 decisions visible.
- Cross-cutting constraints such as `tenant_id`, model version IDs, synthetic-data markers, and decision-support disclaimers can be enforced consistently.
- The repository needs clear hygiene rules so synthetic fixtures, generated artifacts, and future real firm data do not blur together.

## Open questions

- Which package manager and workspace tooling should own the eventual JavaScript/TypeScript monorepo layout?
- Should shared contracts be authored in Pydantic first, TypeScript first, or generated from an OpenAPI schema?
- What generated artifacts should be committed versus rebuilt in CI?
