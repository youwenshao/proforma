export type MatterType =
  | "M&A"
  | "Litigation"
  | "Commercial Property"
  | "Employment"
  | "IP/Technology"
  | "Corporate Restructuring"
  | "Banking & Finance"
  | "Wills & Probate"
  | "Regulatory/Compliance"
  | "Arbitration";

export type RiskTolerance = "conservative" | "balanced" | "aggressive";
export type ModelStrategy = "firm_specific" | "pooled_research" | "synthetic_baseline";

export type MatterInput = {
  schema_version?: "proforma.matter.v1";
  matter_type: MatterType;
  matter_subtype: string;
  jurisdiction: string;
  firm_tier: string;
  client_type: string;
  deal_value_hkd?: number | null;
  document_volume: number;
  complexity_score: number;
  party_count: number;
  cross_border_flag: boolean;
  billing_model: string;
  risk_tolerance: "Low" | "Medium" | "High";
};

export type Taxonomy = {
  schema_version: string;
  source: string;
  matter_types: MatterType[];
  subtypes_by_matter_type: Record<MatterType, string[]>;
  jurisdictions: string[];
  firm_tiers: string[];
  client_types: string[];
  billing_models: string[];
  stage_templates: Record<string, string[]>;
};

export type EstimateInterval = {
  p10: number;
  p50: number;
  p90: number;
  confidence_level: number;
  calibration_method: string;
};

export type StageEstimate = {
  stage_name: string;
  partner_hours: number;
  associate_hours: number;
  cost_hkd: number;
};

export type FeeRecommendation = {
  billing_model: string;
  recommended_fee_hkd: number;
  confidence_interval_low_hkd: number;
  confidence_interval_high_hkd: number;
  cap_amount_hkd?: number | null;
  expected_downside_hkd?: number | null;
  downside_risk_hkd?: number | null;
  expected_margin_hkd?: number | null;
  margin_pct?: number | null;
  pricing_guardrails?: string[];
  partner_decision_support_disclaimer: string;
  schema_version: string;
};

export type EstimateResponse = {
  estimate_id: string;
  tenant_id: string;
  model_version: string;
  dataset_lineage: {
    dataset_id: string;
    schema_version?: string;
    source_marker: string;
  };
  cost_estimate: EstimateInterval;
  duration_estimate: EstimateInterval;
  scope_creep_probability: number;
  stage_estimates: StageEstimate[];
  fee_recommendation: FeeRecommendation;
  decision_support_disclaimer: string;
  limitations: string[];
};

export type ScopeUpdateResponse = {
  estimate_id: string;
  stage_name: string;
  predicted_hours: number;
  actual_hours: number;
  predicted_cost_hkd: number;
  actual_cost_hkd: number;
  variance_pct: number;
  scope_creep_flag: boolean;
  reforecast_final_cost_hkd: number;
  reforecast_final_hours: number;
  overrun_probability: number;
  recommended_review_action: string;
};

export type ModelCurrent = {
  status: string;
  model_version: string;
  feature_version: string;
  dataset_lineage: {
    dataset_id: string;
    source_marker: string;
  };
  synthetic_data: boolean;
};

export type ModelEvaluation = {
  status: string;
  model_version: string;
  dataset_id: string;
  metrics: Record<string, number | string>;
  metrics_by_matter_type: Record<string, Record<string, number>>;
};

export type StrategyComparison = {
  status: string;
  tracks: {
    firm_specific?: {
      description: string;
      minimum_records_per_firm?: number;
    };
    pooled_research?: {
      description: string;
      legal_gate_status: string;
    };
  };
};

export type SimilarMatterEvidence = {
  status: string;
  legal_gate_status: string;
  retrieval_enabled: boolean;
  description: string;
  allowed_inputs: string[];
  excluded_inputs: string[];
};
