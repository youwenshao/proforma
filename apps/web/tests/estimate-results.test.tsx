import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EstimateResultsView } from "@/components/estimate/estimate-results-view";
import { sampleEstimate } from "@/lib/api/fixtures";
import type { QuoteSubstantiation } from "@/lib/api/types";
import { renderWithLocale } from "./render-with-locale";

const sampleSubstantiation: QuoteSubstantiation = {
  schema_version: "proforma.quote_pack.v1",
  estimate_id: sampleEstimate.estimate_id,
  tenant_id: sampleEstimate.tenant_id,
  generated_at: "2026-06-23T00:00:00Z",
  benchmark_segment: {
    segment_label: "Litigation / HK Only / Fixed Fee",
    dimensions: ["matter_type", "jurisdiction", "billing_model"],
    sample_size: 77,
    fallback_level: "matter_type+jurisdiction+billing_model",
  },
  metrics: [
    {
      label: "Material scope-creep rate",
      value: 64,
      unit: "percent",
      display_value: "64.0%",
      description: "Comparable matters over quote by more than 5%.",
      segment_label: "Litigation / HK Only / Fixed Fee",
      sample_size: 77,
    },
    {
      label: "P90 quote variance",
      value: 50.5,
      unit: "percent",
      display_value: "50.5%",
      description: "90th percentile uplift from quote to WIP.",
      segment_label: "Litigation / HK Only / Fixed Fee",
      sample_size: 77,
    },
  ],
  chart_specs: [
    {
      chart_type: "variance_distribution",
      title: "Historical Quote Variance",
      description: "Distribution of realized WIP variance.",
      data: [{ bucket: "25-50%", share_pct: 24 }],
    },
    {
      chart_type: "stage_cost_share",
      title: "Stage Cost Share",
      description: "Average cost contribution by matter stage.",
      data: [{ stage_name: "Discovery", avg_share_pct: 26 }],
    },
  ],
  assumptions_and_guardrails: ["Partner final decision required before client sharing."],
  evidence_footer: ["Model version: proforma-baseline-v1"],
  limitations: ["Synthetic feasibility data only."],
  snapshot_checksum: "abc123",
  status: "draft",
};

describe("estimate results and fee recommendation", () => {
  it("renders a copy button for the estimate reference code", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", {
      ...navigator,
      clipboard: { writeText },
    });

    renderWithLocale(<EstimateResultsView estimate={sampleEstimate} modelStrategy="synthetic_baseline" />);

    expect(screen.getByText(`Reference ${sampleEstimate.estimate_id}`)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /copy reference code/i }));

    expect(writeText).toHaveBeenCalledWith(sampleEstimate.estimate_id);
    expect(screen.getByRole("button", { name: /reference code copied/i })).toBeInTheDocument();

    vi.unstubAllGlobals();
  });

  it("renders low, typical, and high values in order for cost and duration", () => {
    renderWithLocale(<EstimateResultsView estimate={sampleEstimate} modelStrategy="synthetic_baseline" />);

    const cost = screen.getByRole("region", { name: /cost uncertainty/i });
    expect(within(cost).getAllByText(/low/i).length).toBeGreaterThan(0);
    expect(within(cost).getAllByText(/typical/i).length).toBeGreaterThan(0);
    expect(within(cost).getAllByText(/high/i).length).toBeGreaterThan(0);
    expect(within(cost).getByText(/HK\$197,021/i)).toBeInTheDocument();
    expect(within(cost).getByText(/HK\$566,876/i)).toBeInTheDocument();
    expect(within(cost).getByText(/HK\$1,080,742/i)).toBeInTheDocument();

    const duration = screen.getByRole("region", { name: /duration uncertainty/i });
    expect(within(duration).getByText(/164 days/i)).toBeInTheDocument();
    expect(within(duration).getByText(/364 days/i)).toBeInTheDocument();
    expect(within(duration).getByText(/564 days/i)).toBeInTheDocument();
  });

  it("renders stage estimates in an accessible table", () => {
    renderWithLocale(<EstimateResultsView estimate={sampleEstimate} modelStrategy="synthetic_baseline" />);

    const table = screen.getByRole("table", { name: /stage-level estimate/i });
    expect(within(table).getByRole("columnheader", { name: /stage/i })).toBeInTheDocument();
    expect(within(table).getByRole("columnheader", { name: /partner hours/i })).toBeInTheDocument();
    expect(within(table).getByRole("columnheader", { name: /associate hours/i })).toBeInTheDocument();
    expect(within(table).getByRole("columnheader", { name: /cost/i })).toBeInTheDocument();
    expect(new Set(sampleEstimate.stage_estimates.map((stage) => stage.partner_hours)).size).toBeGreaterThan(1);
    expect(new Set(sampleEstimate.stage_estimates.map((stage) => stage.associate_hours)).size).toBeGreaterThan(1);
  });

  it("keeps partner decision control and limitations visible", () => {
    renderWithLocale(<EstimateResultsView estimate={sampleEstimate} modelStrategy="synthetic_baseline" />);

    expect(screen.getAllByText(/decision-support only/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Partner final decision required/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Synthetic-data feasibility estimate only/i)).toBeInTheDocument();
    expect(screen.getByText(/Fixed Fee/i)).toBeInTheDocument();
    expect(screen.getAllByText(/risk tolerance/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/expected margin/i)).toBeInTheDocument();
    expect(screen.getByText(/pricing guardrails/i)).toBeInTheDocument();
  });

  it("renders quote substantiation metrics and chart summaries for partner review", () => {
    renderWithLocale(
      <EstimateResultsView
        estimate={sampleEstimate}
        modelStrategy="synthetic_baseline"
        quoteSubstantiation={sampleSubstantiation}
      />,
    );

    expect(screen.getByRole("heading", { name: /quote substantiation pack/i })).toBeInTheDocument();
    expect(screen.getByText(/Litigation \/ HK Only \/ Fixed Fee/i)).toBeInTheDocument();
    expect(screen.getByText(/77 comparable matters/i)).toBeInTheDocument();
    expect(screen.getByText(/Material scope-creep rate/i)).toBeInTheDocument();
    expect(screen.getByText(/64.0%/i)).toBeInTheDocument();
    expect(screen.getByText(/Historical Quote Variance/i)).toBeInTheDocument();
    expect(screen.getByText(/Stage Cost Share/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Partner final decision required before client sharing/i).length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /download pdf/i })).toBeInTheDocument();
  });

  it("shows the pooled research legal gate", () => {
    renderWithLocale(<EstimateResultsView estimate={sampleEstimate} modelStrategy="pooled_research" />);

    expect(screen.getByText(/legal-gate notice/i)).toBeInTheDocument();
    expect(screen.getByText(/pooled model/i)).toBeInTheDocument();
  });

  it("renders a designed missing estimate state", () => {
    renderWithLocale(<EstimateResultsView estimate={null} modelStrategy="synthetic_baseline" />);

    expect(screen.getByRole("heading", { name: /estimate not found/i })).toBeInTheDocument();
  });
});
