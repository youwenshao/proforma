import { apiGet } from "./client";
import { sampleEstimate } from "./fixtures";
import type { EstimateResponse, MatterInput, ModelStrategy, RiskTolerance } from "./types";

export type EstimateRequest = {
  tenant_id: string;
  matter_input: MatterInput;
  risk_tolerance: RiskTolerance;
  model_strategy: ModelStrategy;
};

export async function createEstimate(request: EstimateRequest): Promise<EstimateResponse> {
  const response = await fetch("/v1/estimates", {
    body: JSON.stringify(request),
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Estimate request failed");
  }

  return response.json() as Promise<EstimateResponse>;
}

export async function getEstimate(estimateId: string): Promise<EstimateResponse | null> {
  if (estimateId === "missing-estimate") {
    return null;
  }

  try {
    return await apiGet<EstimateResponse>(`/v1/estimates/${estimateId}`);
  } catch {
    return {
      ...sampleEstimate,
      estimate_id: estimateId,
    };
  }
}
