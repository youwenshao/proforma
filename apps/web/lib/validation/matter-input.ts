import type { MatterInput, Taxonomy } from "@/lib/api/types";

export type MatterFormValues = {
  matter_type: string;
  matter_subtype: string;
  jurisdiction: string;
  firm_tier: string;
  client_type: string;
  deal_value_hkd: string;
  document_volume: string;
  complexity_score: string;
  party_count: string;
  cross_border_flag: boolean;
  billing_model: string;
  risk_tolerance: "Low" | "Medium" | "High";
};

export type MatterValidationResult =
  | { ok: true; value: MatterInput }
  | { ok: false; errors: Record<string, string> };

export function validateMatterInput(
  values: MatterFormValues,
  taxonomy: Taxonomy,
): MatterValidationResult {
  const errors: Record<string, string> = {};

  if (!values.matter_type) {
    errors.matter_type = "Matter type is required.";
  }

  if (!values.matter_subtype) {
    errors.matter_subtype = "Matter subtype is required.";
  }

  if (!values.jurisdiction) {
    errors.jurisdiction = "Jurisdiction is required.";
  }

  if (!values.firm_tier) {
    errors.firm_tier = "Firm tier is required.";
  }

  if (!values.client_type) {
    errors.client_type = "Client type is required.";
  }

  if (!values.billing_model) {
    errors.billing_model = "Billing model is required.";
  }

  const documentVolume = Number(values.document_volume);
  if (!Number.isFinite(documentVolume) || documentVolume <= 0) {
    errors.document_volume = "Document volume must be positive.";
  }

  const partyCount = Number(values.party_count);
  if (!Number.isFinite(partyCount) || partyCount <= 0) {
    errors.party_count = "Party count must be positive.";
  }

  const complexityScore = Number(values.complexity_score);
  if (!Number.isInteger(complexityScore) || complexityScore < 1 || complexityScore > 5) {
    errors.complexity_score = "Complexity score must be between 1 and 5.";
  }

  if (values.cross_border_flag && values.jurisdiction === "HK Only") {
    errors.cross_border_flag =
      "Cross-border matters must use a cross-border jurisdiction.";
  }

  const allowedSubtypes =
    taxonomy.subtypes_by_matter_type[values.matter_type as keyof Taxonomy["subtypes_by_matter_type"]] ?? [];
  if (values.matter_subtype && !allowedSubtypes.includes(values.matter_subtype)) {
    errors.matter_subtype = "Matter subtype must belong to the selected matter type.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      billing_model: values.billing_model,
      client_type: values.client_type,
      complexity_score: complexityScore,
      cross_border_flag: values.cross_border_flag,
      deal_value_hkd: values.deal_value_hkd ? Number(values.deal_value_hkd) : null,
      document_volume: documentVolume,
      firm_tier: values.firm_tier,
      jurisdiction: values.jurisdiction,
      matter_subtype: values.matter_subtype,
      matter_type: values.matter_type as MatterInput["matter_type"],
      party_count: partyCount,
      risk_tolerance: values.risk_tolerance,
    },
  };
}
