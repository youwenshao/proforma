# ProForma HK Product Requirements Brief

## Purpose

ProForma HK is a feasibility-stage decision-support product for Hong Kong law firms that need better matter scoping, pricing confidence, and scope-creep visibility. Phase 0 does not build production product code. It defines the product boundaries, evidence requirements, and technical gates that later phases must satisfy before any real firm data, production tenancy, or legal/regulatory claims are introduced.

The current feasibility evidence is based on `SYNTHETIC_MVP_V1`: 4,000 synthetic legal matters generated from structured numeric and categorical distributions. The validation report passes with a 51.45% global material scope-creep rate, a 70.48% any-overrun rate, and no residual anomalies. This evidence supports technical feasibility only; it does not establish regulatory approval, market benchmarks, or model readiness for production fee setting.

## Product Workflow

1. Matter Parameters: an associate, pricing support user, or partner enters matter characteristics such as matter type, jurisdiction, document volume, complexity indicators, party count, rates, and relevant deal-value or cross-border markers through a bilingual English and Traditional Chinese interface.
2. Predictive Analysis: the system analyzes firm historical data or synthetic feasibility data to estimate cost, duration, stage-level effort, and uncertainty. Every prediction must be traceable to dataset version, feature version, and model version.
3. Fee Structure Recommendation: the platform presents estimated ranges and decision-support recommendations for fixed-fee or capped-fee amounts based on configured risk tolerance. The partner makes the final pricing decision.
4. Scope Monitoring: during the matter, the system compares actual time and cost by stage against predicted values, flags variance that may indicate scope creep, and preserves audit evidence for later review.

## Phase 0 Roles

- Partner: reviews estimates, evaluates uncertainty, sets fees, and remains responsible for the final client-facing pricing decision.
- Associate or pricing support user: prepares matter inputs, checks source facts, and packages the estimate for partner review.
- Admin: manages firm settings, risk tolerance, user access, and data permission boundaries.
- Technical reviewer: inspects model evaluation, data lineage, feasibility reports, and governance artifacts before later phases proceed.

## Non-Goals

- No auto-generated retainer letters in the feasibility build. Any future template support must be solicitor-reviewed drafting assistance only.
- No legal advice. ProForma provides data analysis and decision support.
- No autonomous fee setting. A partner or authorized solicitor makes every fee decision.
- No ORFSA module in the first feasibility build. Outcome Related Fee Structures for Arbitration remain a separate arbitration-specific product track requiring legal review.
- No pooled production model until legal review approves the legal basis, anonymization standards, data sharing terms, and solicitor confidentiality controls.

## Success Criteria

- Every prediction response is traceable to dataset version, feature version, and model version.
- Every UI estimate displays uncertainty and decision-support disclaimers.
- Firm-specific and pooled anonymized model tracks can be compared from one evaluation command.
- Synthetic-data mode is visibly labeled across API responses, frontend views, and generated reports.
- Pooled modeling is marked as a research track that requires legal review before production use.
- The product workflow supports bilingual labels and disclaimers without relying on unreviewed machine translation for legal terminology.

## Feasibility Gates

| Capability | Phase 0 status | Required before production |
|---|---|---|
| Synthetic-data estimates | Technically ready for demos and architecture validation | Clear labels, disclaimers, and no production claims |
| Firm-specific modeling | Product-safe first path, subject to pilot data quality | Firm data import boundary, tenant isolation, model cards, and pilot evidence |
| Pooled anonymized modeling | Research-only comparison track | Written legal review covering PDPO, solicitor confidentiality, anonymization, and Law Society guidance |
| Scope monitoring | Technically ready as variance detection | Partner workflow testing, audit logging, and misuse controls |
| Bilingual UX | Required product surface | Reviewed translation catalog for English and Traditional Chinese legal terms |
| Retainer-letter generation | Out of scope | Separate solicitor-reviewed design and legal authorization |

## Later Phase Requirements

Later phases must preserve these constraints:

- API contracts expose typed estimates rather than raw dataframe rows.
- Tenant and model identifiers appear from the first contracts, even in synthetic-only mode.
- Reports distinguish technical feasibility from legal or regulatory approval.
- User-facing copy never describes ProForma as autonomous legal advice.
