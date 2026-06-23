import type { MatterInput, Taxonomy } from "@/lib/api/types";
import type { TranslationKey } from "@/lib/i18n/en";

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
  | { ok: false; errors: Record<string, TranslationKey> };

const dealValueMatterTypes = new Set([
  "M&A",
  "Commercial Property",
  "Corporate Restructuring",
  "Banking & Finance",
]);

export function validateMatterInput(
  values: MatterFormValues,
  taxonomy: Taxonomy,
): MatterValidationResult {
  const errors: Record<string, TranslationKey> = {};

  if (!values.matter_type) {
    errors.matter_type = "validation.matterTypeRequired";
  }

  if (!values.matter_subtype) {
    errors.matter_subtype = "validation.matterSubtypeRequired";
  }

  if (!values.jurisdiction) {
    errors.jurisdiction = "validation.jurisdictionRequired";
  }

  if (!values.firm_tier) {
    errors.firm_tier = "validation.firmTierRequired";
  }

  if (!values.client_type) {
    errors.client_type = "validation.clientTypeRequired";
  }

  if (!values.billing_model) {
    errors.billing_model = "validation.billingModelRequired";
  }

  const documentVolume = Number(values.document_volume);
  if (!Number.isFinite(documentVolume) || documentVolume <= 0) {
    errors.document_volume = "validation.documentVolumePositive";
  }

  const partyCount = Number(values.party_count);
  if (!Number.isFinite(partyCount) || partyCount <= 0) {
    errors.party_count = "validation.partyCountPositive";
  }

  const complexityScore = Number(values.complexity_score);
  if (!Number.isInteger(complexityScore) || complexityScore < 1 || complexityScore > 5) {
    errors.complexity_score = "validation.complexityScoreRange";
  }

  if (values.jurisdiction === "HK Only" && values.cross_border_flag) {
    errors.cross_border_flag = "validation.crossBorderJurisdiction";
  }

  if (values.jurisdiction && values.jurisdiction !== "HK Only" && !values.cross_border_flag) {
    errors.cross_border_flag = "validation.crossBorderRequired";
  }

  const allowedSubtypes =
    taxonomy.subtypes_by_matter_type[values.matter_type as keyof Taxonomy["subtypes_by_matter_type"]] ?? [];
  if (values.matter_subtype && !allowedSubtypes.includes(values.matter_subtype)) {
    errors.matter_subtype = "validation.matterSubtypeMismatch";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  const matterInput: MatterInput = {
    billing_model: values.billing_model as MatterInput["billing_model"],
    client_type: values.client_type as MatterInput["client_type"],
    complexity_score: complexityScore,
    cross_border_flag: values.cross_border_flag,
    document_volume: documentVolume,
    firm_tier: values.firm_tier as MatterInput["firm_tier"],
    jurisdiction: values.jurisdiction as MatterInput["jurisdiction"],
    matter_subtype: values.matter_subtype,
    matter_type: values.matter_type as MatterInput["matter_type"],
    party_count: partyCount,
    risk_tolerance: values.risk_tolerance,
    schema_version: "proforma.matter.v1",
  };

  if (values.deal_value_hkd && dealValueMatterTypes.has(values.matter_type)) {
    matterInput.deal_value_hkd = Number(values.deal_value_hkd);
  }

  return { ok: true, value: matterInput };
}
