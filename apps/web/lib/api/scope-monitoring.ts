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
  const response = await fetch(`/v1/estimates/${estimateId}/scope-updates`, {
    body: JSON.stringify(update),
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Scope update request failed");
  }

  return response.json() as Promise<ScopeUpdateResponse>;
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
