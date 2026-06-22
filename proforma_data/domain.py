"""Domain constants shared by the generator, validators, and API contracts."""

MATTER_TYPES = [
    "M&A",
    "Litigation",
    "Commercial Property",
    "Employment",
    "IP/Technology",
    "Corporate Restructuring",
    "Banking & Finance",
    "Wills & Probate",
    "Regulatory/Compliance",
    "Arbitration",
]

MATTER_SUBTYPES = {
    "M&A": [
        "Share Acquisition - Private",
        "Asset Acquisition",
        "Minority Investment",
        "Joint Venture Formation",
        "Due Diligence Only",
    ],
    "Litigation": [
        "Commercial Contract Dispute",
        "Shareholder Dispute",
        "Debt Recovery",
        "Injunction Application",
        "Professional Negligence Claim",
    ],
    "Commercial Property": [
        "Tenancy Agreement - Commercial",
        "Sale and Purchase - Commercial",
        "Lease Renewal",
        "Landlord and Tenant Dispute",
        "Mortgage and Security Review",
    ],
    "Employment": [
        "Unfair Dismissal Claim",
        "Employment Contract Review",
        "Restrictive Covenant Advice",
        "Redundancy Exercise",
        "Discrimination Complaint",
    ],
    "IP/Technology": [
        "Software Licensing",
        "Trademark Filing and Opposition",
        "Data Processing Agreement",
        "Technology Services Contract",
        "IP Ownership Dispute",
    ],
    "Corporate Restructuring": [
        "Members Voluntary Liquidation",
        "Debt Restructuring",
        "Scheme of Arrangement",
        "Corporate Reorganization",
        "Distressed Asset Sale",
    ],
    "Banking & Finance": [
        "Bilateral Facility Agreement",
        "Syndicated Loan",
        "Security Package Review",
        "Trade Finance Facility",
        "Refinancing",
    ],
    "Wills & Probate": [
        "Simple Will",
        "Complex Estate Planning",
        "Probate Application",
        "Letters of Administration",
        "Contentious Probate",
    ],
    "Regulatory/Compliance": [
        "SFC Licensing Advice",
        "AML Compliance Review",
        "Data Privacy Review",
        "Listing Rules Advice",
        "Internal Investigation",
    ],
    "Arbitration": [
        "HKIAC Commercial Arbitration",
        "Construction Arbitration",
        "Shareholder Arbitration",
        "Enforcement of Award",
        "ORFSA Fee Assessment",
    ],
}

FIRM_TIERS = [
    "Magic Circle / International",
    "PRC Elite Firm in HK",
    "Large Local (11+ partners)",
    "Mid-tier (6-10 partners)",
    "Small/Boutique (1-5 partners)",
]

JURISDICTIONS = ["HK Only", "GBA Cross-Border (HK-PRC)", "Multi-Jurisdictional (APAC)"]

CLIENT_TYPES = [
    "Mainland Enterprise",
    "HK Listed Co.",
    "SME/Local Business",
    "Individual",
    "Financial Institution",
    "SOE",
]

BILLING_MODELS = ["Hourly", "Fixed Fee", "Capped Fee", "Retainer", "Outcome Related"]

PARTNER_RATE_BANDS = {
    "Magic Circle / International": (6000.0, 13000.0),
    "PRC Elite Firm in HK": (4000.0, 8000.0),
    "Large Local (11+ partners)": (3000.0, 6000.0),
    "Mid-tier (6-10 partners)": (2200.0, 4500.0),
    "Small/Boutique (1-5 partners)": (1900.0, 3600.0),
}

STAGE_TEMPLATES = {
    "M&A": ["Scoping", "Due Diligence", "Drafting", "Negotiation", "Closing"],
    "Litigation": ["Case Assessment", "Pleadings", "Discovery", "Interlocutory Applications", "Settlement/Trial"],
    "Commercial Property": ["Instructions", "Title Review", "Drafting", "Negotiation", "Completion"],
    "Employment": ["Initial Advice", "Document Review", "Negotiation", "Settlement/Tribunal"],
    "IP/Technology": ["Scoping", "IP/Tech Review", "Drafting", "Negotiation", "Completion"],
    "Corporate Restructuring": ["Scoping", "Due Diligence", "Scheme Design", "Creditor/Stakeholder Negotiation", "Implementation"],
    "Banking & Finance": ["Term Sheet Review", "Due Diligence", "Facility Drafting", "Security Documentation", "Closing"],
    "Wills & Probate": ["Client Intake", "Asset Review", "Drafting/Application", "Execution/Filing"],
    "Regulatory/Compliance": ["Scoping", "Document Review", "Regulatory Analysis", "Remediation Advice", "Submission/Follow-up"],
    "Arbitration": ["Case Assessment", "Pleadings", "Evidence", "Hearing Preparation", "Hearing/Settlement", "Award/Enforcement"],
}

