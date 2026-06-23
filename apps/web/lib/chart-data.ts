import { totalPredictedHours, variancePct } from "@/lib/api/scope-monitoring";
import type { EstimateInterval, StageEstimate } from "@/lib/api/types";
import { varianceStatus } from "@/components/monitoring/variance-badge";

export type EstimateIntervalDatum = {
  label: "Low" | "Typical" | "High";
  unit: string;
  value: number;
};

export type StageEffortDatum = {
  associateHours: number;
  cost: number;
  partnerHours: number;
  stage: string;
  totalHours: number;
};

export type VarianceDatum = {
  actualCost: number;
  actualHours: number;
  predictedCost: number;
  predictedHours: number;
  stage: string;
  status: ReturnType<typeof varianceStatus>;
  variancePct: number;
};

export type ModelPerformanceDatum = {
  averageError: number;
  largeErrorSensitivity: number;
  matterType: string;
};

export type VarianceDistributionDatum = {
  bucket: string;
  sharePct: number;
};

export type StageCostShareDatum = {
  stage: string;
  avgSharePct: number;
};

export function buildEstimateIntervalData(
  interval: EstimateInterval,
  unit: string,
): EstimateIntervalDatum[] {
  return [
    { label: "Low", value: interval.p10, unit },
    { label: "Typical", value: interval.p50, unit },
    { label: "High", value: interval.p90, unit },
  ];
}

export function buildStageEffortData(stages: StageEstimate[]): StageEffortDatum[] {
  return stages.map((stage) => ({
    associateHours: stage.associate_hours,
    cost: stage.cost_hkd,
    partnerHours: stage.partner_hours,
    stage: stage.stage_name,
    totalHours: stage.partner_hours + stage.associate_hours,
  }));
}

export function buildVarianceData(stages: StageEstimate[]): VarianceDatum[] {
  return stages.map((stage, index) => {
    const predictedHours = totalPredictedHours(stage);
    const multiplier = index === 0 ? 1.08 : index === 1 ? 1.18 : 0.98;
    const actualHours = predictedHours * multiplier;
    const stageVariancePct = variancePct(predictedHours, actualHours);

    return {
      actualCost: stage.cost_hkd * multiplier,
      actualHours,
      predictedCost: stage.cost_hkd,
      predictedHours,
      stage: stage.stage_name,
      status: varianceStatus(stageVariancePct),
      variancePct: stageVariancePct,
    };
  });
}

export function buildVarianceDistributionData(
  data: Record<string, string | number | boolean | null>[],
): VarianceDistributionDatum[] {
  return data.map((point) => ({
    bucket: String(point.bucket ?? ""),
    sharePct: Number(point.share_pct ?? 0),
  }));
}

export function buildStageCostShareData(
  data: Record<string, string | number | boolean | null>[],
): StageCostShareDatum[] {
  return data.map((point) => ({
    stage: String(point.stage_name ?? ""),
    avgSharePct: Number(point.avg_share_pct ?? 0),
  }));
}

export function buildModelPerformanceData(
  metricsByMatterType: Record<string, Record<string, number>>,
): ModelPerformanceDatum[] {
  return Object.entries(metricsByMatterType)
    .map(([matterType, metrics]) => ({
      averageError: metrics.mae ?? 0,
      largeErrorSensitivity: metrics.rmse ?? 0,
      matterType,
    }))
    .sort((left, right) => right.averageError - left.averageError);
}
