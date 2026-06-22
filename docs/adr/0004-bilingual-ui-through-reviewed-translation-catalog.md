# ADR 0004: Bilingual UI Through Reviewed Translation Catalog

Status: Accepted

## Context

The amended proposal describes a bilingual English and Traditional Chinese interface for Hong Kong law firms. The product also uses legal and pricing terminology that could affect user understanding: matter type, fee structure, scope creep, uncertainty, decision support, partner review, and legal disclaimers.

Unreviewed machine translation would create avoidable risk. Incorrect legal terminology could make estimates look more authoritative than intended, obscure synthetic-data limitations, or weaken disclaimers.

## Decision

Use a reviewed translation catalog for bilingual UI copy.

The frontend should load English and Traditional Chinese labels, help text, disclaimers, and gate notices from a structured catalog. Legal terminology, decision-support disclaimers, synthetic-data notices, and pooled-model gate language require human review before pilot use. Machine translation may help draft internal candidates, but it is not an accepted source for client-facing legal terminology.

## Consequences

- Bilingual UX is treated as part of product correctness, not visual polish.
- Legal and governance notices can be tested in both locales.
- Future frontend work can block estimates from shipping without required disclaimer keys.
- The project needs a review workflow for translation updates before pilot evidence is collected.

## Open questions

- Who signs off Traditional Chinese legal terminology before a pilot?
- Should the catalog include jurisdiction-specific variants for Hong Kong, GBA cross-border, and APAC matters?
- How should translation review status be represented in tests and release artifacts?
