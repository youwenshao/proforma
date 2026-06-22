# Real Firm Data Import Boundary

Real firm data import is inactive for the feasibility phase. The code in
`proforma_data.importers` defines a validation boundary only; it must not be
used to persist or train on confidential firm records until the gates below are
complete.

## Required Gates

- A written data sharing agreement exists.
- The PDPO basis for processing is documented.
- Solicitor confidentiality review is complete.
- Anonymization standards are approved.
- Data residency decision is recorded.

## Feasibility Mode

The CSV importer accepts only structured fields matching `MatterInput` plus
historical outcome labels. It rejects direct identifiers, email addresses,
client names, matter descriptions, free-text narratives, and unsupported
columns. Normalized rows are returned in memory and are not persisted by
default.

Approved future ingestion should keep this boundary as the first validation
step, then add explicit storage and audit handling only after the governance
gates are satisfied.
