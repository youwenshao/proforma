import {
  buildEstimateIntervalData,
  buildModelPerformanceData,
  buildStageEffortData,
  buildVarianceData,
} from "@/lib/chart-data";
import { modelEvaluationFixture, sampleEstimate } from "@/lib/api/fixtures";

describe("dashboard chart data transforms", () => {
  it("labels estimate intervals as low, typical, and high", () => {
    expect(buildEstimateIntervalData(sampleEstimate.cost_estimate, "HKD")).toEqual([
      { label: "Low", value: sampleEstimate.cost_estimate.p10, unit: "HKD" },
      { label: "Typical", value: sampleEstimate.cost_estimate.p50, unit: "HKD" },
      { label: "High", value: sampleEstimate.cost_estimate.p90, unit: "HKD" },
    ]);
  });

  it("builds stage effort rows with total hours", () => {
    const [first] = buildStageEffortData(sampleEstimate.stage_estimates);

    expect(first).toMatchObject({
      associateHours: sampleEstimate.stage_estimates[0].associate_hours,
      cost: sampleEstimate.stage_estimates[0].cost_hkd,
      partnerHours: sampleEstimate.stage_estimates[0].partner_hours,
      stage: sampleEstimate.stage_estimates[0].stage_name,
    });
    expect(first.totalHours).toBeCloseTo(
      sampleEstimate.stage_estimates[0].partner_hours +
        sampleEstimate.stage_estimates[0].associate_hours,
    );
  });

  it("builds predicted versus actual variance rows", () => {
    const [first] = buildVarianceData(sampleEstimate.stage_estimates);

    expect(first.stage).toBe(sampleEstimate.stage_estimates[0].stage_name);
    expect(first.actualHours).toBeGreaterThan(first.predictedHours);
    expect(first.status).toBe("Warning");
  });

  it("sorts model performance rows by average error", () => {
    const [first] = buildModelPerformanceData(modelEvaluationFixture.metrics_by_matter_type);

    expect(first.matterType).toBe("M&A");
    expect(first.averageError).toBe(modelEvaluationFixture.metrics_by_matter_type["M&A"].mae);
    expect(first.largeErrorSensitivity).toBe(
      modelEvaluationFixture.metrics_by_matter_type["M&A"].rmse,
    );
  });
});
