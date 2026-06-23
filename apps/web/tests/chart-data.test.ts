import {
  buildEstimateIntervalData,
  buildModelPerformanceData,
  buildStageCostShareData,
  buildStageEffortData,
  buildVarianceData,
  buildVarianceDistributionData,
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

  it("maps variance distribution spec data to bucket/sharePct pairs", () => {
    const raw = [
      { bucket: "<=0%", share_pct: 30.6 },
      { bucket: "0-25%", share_pct: 44.0 },
      { bucket: "25-50%", share_pct: 16.0 },
      { bucket: ">50%", share_pct: 9.4 },
    ];
    const result = buildVarianceDistributionData(raw);

    expect(result).toHaveLength(4);
    expect(result[0]).toEqual({ bucket: "<=0%", sharePct: 30.6 });
    expect(result[2]).toEqual({ bucket: "25-50%", sharePct: 16.0 });
  });

  it("maps stage cost share spec data to stage/avgSharePct pairs", () => {
    const raw = [
      { stage_name: "Asset Review", avg_share_pct: 30.7 },
      { stage_name: "Drafting/Application", avg_share_pct: 29.4 },
    ];
    const result = buildStageCostShareData(raw);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ stage: "Asset Review", avgSharePct: 30.7 });
    expect(result[1]).toEqual({ stage: "Drafting/Application", avgSharePct: 29.4 });
  });
});
