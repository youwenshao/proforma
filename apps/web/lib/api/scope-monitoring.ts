import { apiPost } from "./client";
import type { ScopeUpdateResponse, StageEstimate } from "./types";

export type ScopeUpdateRequest = {
  stage_name: string;
  actual_partner_hours: number;
  actual_associate_hours: number;
  actual_cost_hkd: number;
};

export async function postScopeUpdate(
  estimateId: string,
  update: ScopeUpdateRequest,
): Promise<ScopeUpdateResponse> {
  try {
    return await apiPost<ScopeUpdateResponse, ScopeUpdateRequest>(
      `/v1/estimates/${estimateId}/scope-updates`,
      update,
    );
  } catch {
    throw new Error("Scope update request failed");
  }
}

export function totalPredictedHours(stage: StageEstimate) {
  return stage.partner_hours + stage.associate_hours;
}

export function variancePct(predicted: number, actual: number) {
  if (predicted === 0) {
    return 0;
  }

  return ((actual - predicted) / predicted) * 100;
}
