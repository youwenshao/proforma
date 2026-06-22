# ADR 0002: Compare Firm-Specific And Pooled Models

Status: Accepted

## Context

The proposal requires better matter scoping and fixed-fee confidence for Hong Kong law firms. Model strategy is therefore both a technical question and a professional-obligations question. Firm-specific models may have less data, but they reduce cross-firm confidentiality concerns. Pooled anonymized models may improve sample size and segment coverage, but they raise PDPO, solicitor confidentiality, anonymization, data-sharing, and Law Society guidance questions.

The current feasibility dataset is synthetic-only. It can prove that training and comparison workflows are technically plausible, but it cannot prove production readiness or legal approval for pooled training.

## Decision

Firm-specific modeling is the first product-safe path. Pooled anonymized modeling is a research track gated by legal review.

The ML workspace should compare firm-specific, pooled research, and synthetic baseline strategies from a single evaluation command. Reports must show performance, sample size, limitations, and legal-gate status separately for each strategy. API and UI surfaces must not present pooled research output as production-ready.

## Consequences

- Later phases can quantify whether pooled data improves accuracy without prematurely treating pooled modeling as approved.
- Product-facing estimates can default to a firm-specific strategy once real pilot data is approved.
- Pooled research requires explicit gate language in reports, API responses, and frontend evidence views.
- Legal review must cover PDPO basis, solicitor confidentiality, anonymization standards, data sharing terms, and any relevant Law Society guidance before pooled production use.

## Open questions

- What minimum per-firm record count is needed before firm-specific estimates are useful by matter type?
- What anonymization standard would satisfy professional confidentiality obligations for pooled research?
- Can pooled research be conducted with synthetic or differentially private aggregates before real cross-firm data sharing is approved?
