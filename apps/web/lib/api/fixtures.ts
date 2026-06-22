import type {
  EstimateResponse,
  ModelCurrent,
  ModelEvaluation,
  ScopeUpdateResponse,
  StrategyComparison,
  Taxonomy,
} from "./types";

export const syntheticTaxonomy: Taxonomy = {
  schema_version: "proforma.matter.v1",
  source: "proforma_data.domain",
  matter_types: [
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
  ],
  subtypes_by_matter_type: {
    "M&A": [
      "Share Acquisition - Private",
      "Asset Acquisition",
      "Minority Investment",
      "Joint Venture Formation",
      "Due Diligence Only",
    ],
    Litigation: [
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
    Employment: [
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
    Arbitration: [
      "HKIAC Commercial Arbitration",
      "Construction Arbitration",
      "Shareholder Arbitration",
      "Enforcement of Award",
      "ORFSA Fee Assessment",
    ],
  },
  jurisdictions: ["HK Only", "GBA Cross-Border (HK-PRC)", "Multi-Jurisdictional (APAC)"],
  firm_tiers: [
    "Magic Circle / International",
    "PRC Elite Firm in HK",
    "Large Local (11+ partners)",
    "Mid-tier (6-10 partners)",
    "Small/Boutique (1-5 partners)",
  ],
  client_types: [
    "Mainland Enterprise",
    "HK Listed Co.",
    "SME/Local Business",
    "Individual",
    "Financial Institution",
    "SOE",
  ],
  billing_models: ["Hourly", "Fixed Fee", "Capped Fee", "Retainer", "Outcome Related"],
  stage_templates: {
    "M&A": ["Scoping", "Due Diligence", "Drafting", "Negotiation", "Closing"],
    Litigation: [
      "Case Assessment",
      "Pleadings",
      "Discovery",
      "Interlocutory Applications",
      "Settlement/Trial",
    ],
    "Commercial Property": ["Instructions", "Title Review", "Drafting", "Negotiation", "Completion"],
    Employment: ["Initial Advice", "Document Review", "Negotiation", "Settlement/Tribunal"],
    "IP/Technology": ["Scoping", "IP/Tech Review", "Drafting", "Negotiation", "Completion"],
    "Corporate Restructuring": [
      "Scoping",
      "Due Diligence",
      "Scheme Design",
      "Creditor/Stakeholder Negotiation",
      "Implementation",
    ],
    "Banking & Finance": [
      "Term Sheet Review",
      "Due Diligence",
      "Facility Drafting",
      "Security Documentation",
      "Closing",
    ],
    "Wills & Probate": ["Client Intake", "Asset Review", "Drafting/Application", "Execution/Filing"],
    "Regulatory/Compliance": [
      "Scoping",
      "Document Review",
      "Regulatory Analysis",
      "Remediation Advice",
      "Submission/Follow-up",
    ],
    Arbitration: [
      "Case Assessment",
      "Pleadings",
      "Evidence",
      "Hearing Preparation",
      "Hearing/Settlement",
      "Award/Enforcement",
    ],
  },
};

export const sampleEstimate: EstimateResponse = {
  cost_estimate: {
    calibration_method: "residual_quantiles",
    confidence_level: 0.8,
    p10: 197021.33584432135,
    p50: 566875.5481284132,
    p90: 1080741.5828392874,
  },
  dataset_lineage: {
    dataset_id: "proforma-hk-synthetic-mvp-v1",
    schema_version: "proforma.matter.v1",
    source_marker: "SYNTHETIC_MVP_V1",
  },
  decision_support_disclaimer:
    "This recommendation is decision-support only; a responsible partner must review matter context, professional obligations, and client instructions before use.",
  duration_estimate: {
    calibration_method: "residual_quantiles",
    confidence_level: 0.8,
    p10: 163.63461216695265,
    p50: 363.5747361003132,
    p90: 563.5148600336738,
  },
  estimate_id: "sample-estimate-v1",
  fee_recommendation: {
    billing_model: "Fixed Fee",
    confidence_interval_high_hkd: 802695.776149833,
    confidence_interval_low_hkd: 568576.1747727983,
    partner_decision_support_disclaimer:
      "This recommendation is decision-support only; a responsible partner must review matter context, professional obligations, and client instructions before use.",
    recommended_fee_hkd: 668913.1467915275,
    schema_version: "proforma.matter.v1",
  },
  limitations: ["Synthetic-data feasibility estimate only.", "Partner review required before client use."],
  model_version: "proforma-baseline-v1",
  scope_creep_probability: 0.6540640046165398,
  stage_estimates: [
    "Case Assessment",
    "Pleadings",
    "Discovery",
    "Interlocutory Applications",
    "Settlement/Trial",
  ].map((stage_name) => ({
    associate_hours: 54.732389561165874,
    cost_hkd: 113375.10962568263,
    partner_hours: 27.43897319877781,
    stage_name,
  })),
  tenant_id: "synthetic-demo-tenant",
};

export const sampleScopeUpdate: ScopeUpdateResponse = {
  estimate_id: sampleEstimate.estimate_id,
  stage_name: "Case Assessment",
  predicted_hours: 82.17136275994368,
  actual_hours: 95,
  variance_pct: 15.61,
  scope_creep_flag: true,
  recommended_review_action:
    "Critical variance: partner review required before further fixed-fee work proceeds.",
};

export const modelCurrentFixture: ModelCurrent = {
  status: "available",
  model_version: "proforma-baseline-v1",
  feature_version: "proforma-features-v1",
  dataset_lineage: {
    dataset_id: "proforma-hk-synthetic-mvp-v1",
    source_marker: "SYNTHETIC_MVP_V1",
  },
  synthetic_data: true,
};

export const modelEvaluationFixture: ModelEvaluation = {
  status: "available",
  model_version: "proforma-baseline-v1",
  dataset_id: "proforma-hk-synthetic-mvp-v1",
  metrics: {
    mae: 306089.2942781317,
    rmse: 642075.0450747818,
    smape: 0.28429439090641284,
    empirical_coverage: 0.787,
  },
  metrics_by_matter_type: {
    Litigation: { mae: 277476.7744840992, rmse: 400069.56606423645 },
    "M&A": { mae: 894877.980511144, rmse: 1424020.3051579234 },
    "Banking & Finance": { mae: 490601.29961292667, rmse: 721076.9625094032 },
  },
};

export const strategyComparisonFixture: StrategyComparison = {
  status: "available",
  tracks: {
    firm_specific: {
      description: "Simulated firm-tier-specific evaluation from synthetic data.",
      minimum_records_per_firm: 300,
    },
    pooled_research: {
      description: "Pooled anonymized research scaffold.",
      legal_gate_status: "legally_gated",
    },
  },
};
