import {
  getSavedEstimates,
  saveEstimateForUser,
  summarizeMatterInput,
} from "@/lib/estimate-history";
import { sampleEstimate } from "@/lib/api/fixtures";
import type { MatterInput } from "@/lib/api/types";

describe("browser-local estimate history", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("summarizes matter inputs for result cards", () => {
    const matter: MatterInput = {
      billing_model: "Fixed Fee",
      client_type: "Financial Institution",
      complexity_score: 4,
      cross_border_flag: true,
      document_volume: 120,
      firm_tier: "Mid-tier (6-10 partners)",
      jurisdiction: "GBA Cross-Border (HK-PRC)",
      matter_subtype: "Debt Recovery",
      matter_type: "Litigation",
      party_count: 3,
      risk_tolerance: "Medium",
    };

    expect(summarizeMatterInput(matter)).toEqual({
      billingModel: "Fixed Fee",
      jurisdiction: "GBA Cross-Border (HK-PRC)",
      matterType: "Litigation",
      subtitle: "Debt Recovery · Financial Institution",
    });
  });

  it("stores saved estimates by normalized demo email newest-first", () => {
    saveEstimateForUser("Partner@Example.COM", {
      createdAt: "2026-06-22T08:00:00.000Z",
      estimate: sampleEstimate,
      matterSummary: {
        billingModel: "Fixed Fee",
        jurisdiction: "HK Only",
        matterType: "Litigation",
        subtitle: "Debt Recovery · Financial Institution",
      },
      modelStrategy: "synthetic_baseline",
    });
    saveEstimateForUser("partner@example.com", {
      createdAt: "2026-06-22T09:00:00.000Z",
      estimate: { ...sampleEstimate, estimate_id: "newer-estimate" },
      matterSummary: {
        billingModel: "Hourly",
        jurisdiction: "HK Only",
        matterType: "M&A",
        subtitle: "Share Acquisition - Private · Financial Institution",
      },
      modelStrategy: "synthetic_baseline",
    });

    const saved = getSavedEstimates("partner@example.com");

    expect(saved.map((record) => record.estimate.estimate_id)).toEqual([
      "newer-estimate",
      sampleEstimate.estimate_id,
    ]);
    expect(getSavedEstimates("other@example.com")).toEqual([]);
  });
});
