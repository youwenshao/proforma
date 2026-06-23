import { normalizeEmail } from "@/lib/demo-auth";
import type { EstimateResponse, MatterInput, ModelStrategy } from "@/lib/api/types";

export type MatterSummary = {
  billingModel: string;
  jurisdiction: string;
  matterType: string;
  subtitle: string;
};

export type SavedEstimate = {
  createdAt: string;
  estimate: EstimateResponse;
  matterSummary: MatterSummary;
  modelStrategy: ModelStrategy;
};

function storageKey(email: string) {
  return `proforma.estimate-history.${normalizeEmail(email)}`;
}

function readRecords(email: string): SavedEstimate[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(storageKey(email));
  if (!raw) {
    return [];
  }

  try {
    const records = JSON.parse(raw) as SavedEstimate[];
    return Array.isArray(records) ? records : [];
  } catch {
    return [];
  }
}

export function summarizeMatterInput(matter: MatterInput): MatterSummary {
  return {
    billingModel: matter.billing_model,
    jurisdiction: matter.jurisdiction,
    matterType: matter.matter_type,
    subtitle: `${matter.matter_subtype} · ${matter.client_type}`,
  };
}

export function getSavedEstimates(email: string) {
  return readRecords(email).sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
}

export function getSavedEstimate(email: string, estimateId: string) {
  return getSavedEstimates(email).find((record) => record.estimate.estimate_id === estimateId) ?? null;
}

export function saveEstimateForUser(email: string, record: SavedEstimate) {
  if (typeof window === "undefined") {
    return;
  }

  const nextRecords = [
    record,
    ...readRecords(email).filter(
      (current) => current.estimate.estimate_id !== record.estimate.estimate_id,
    ),
  ].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );

  window.localStorage.setItem(storageKey(email), JSON.stringify(nextRecords));
  window.dispatchEvent(new Event("proforma-estimate-history"));
}
