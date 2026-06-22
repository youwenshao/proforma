import { render, screen, within } from "@testing-library/react";
import { EstimateResultsView } from "@/components/estimate/estimate-results-view";
import { sampleEstimate } from "@/lib/api/fixtures";

describe("estimate results and fee recommendation", () => {
  it("renders p10, p50, and p90 values in order for cost and duration", () => {
    render(<EstimateResultsView estimate={sampleEstimate} modelStrategy="synthetic_baseline" />);

    const cost = screen.getByRole("region", { name: /cost uncertainty/i });
    expect(within(cost).getByText(/p10/i)).toBeInTheDocument();
    expect(within(cost).getByText(/p50/i)).toBeInTheDocument();
    expect(within(cost).getByText(/p90/i)).toBeInTheDocument();
    expect(within(cost).getByText(/HK\$197,021/i)).toBeInTheDocument();
    expect(within(cost).getByText(/HK\$566,876/i)).toBeInTheDocument();
    expect(within(cost).getByText(/HK\$1,080,742/i)).toBeInTheDocument();

    const duration = screen.getByRole("region", { name: /duration uncertainty/i });
    expect(within(duration).getByText(/164 days/i)).toBeInTheDocument();
    expect(within(duration).getByText(/364 days/i)).toBeInTheDocument();
    expect(within(duration).getByText(/564 days/i)).toBeInTheDocument();
  });

  it("renders stage estimates in an accessible table", () => {
    render(<EstimateResultsView estimate={sampleEstimate} modelStrategy="synthetic_baseline" />);

    const table = screen.getByRole("table", { name: /stage-level estimate/i });
    expect(within(table).getByRole("columnheader", { name: /stage/i })).toBeInTheDocument();
    expect(within(table).getByRole("columnheader", { name: /partner hours/i })).toBeInTheDocument();
    expect(within(table).getByRole("columnheader", { name: /associate hours/i })).toBeInTheDocument();
    expect(within(table).getByRole("columnheader", { name: /cost/i })).toBeInTheDocument();
    expect(new Set(sampleEstimate.stage_estimates.map((stage) => stage.partner_hours)).size).toBeGreaterThan(1);
    expect(new Set(sampleEstimate.stage_estimates.map((stage) => stage.associate_hours)).size).toBeGreaterThan(1);
  });

  it("keeps partner decision control and limitations visible", () => {
    render(<EstimateResultsView estimate={sampleEstimate} modelStrategy="synthetic_baseline" />);

    expect(screen.getAllByText(/decision-support only/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Partner final decision required/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Synthetic-data feasibility estimate only/i)).toBeInTheDocument();
    expect(screen.getByText(/Fixed Fee/i)).toBeInTheDocument();
    expect(screen.getAllByText(/risk tolerance/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/expected margin/i)).toBeInTheDocument();
    expect(screen.getByText(/pricing guardrails/i)).toBeInTheDocument();
  });

  it("shows the pooled research legal gate", () => {
    render(<EstimateResultsView estimate={sampleEstimate} modelStrategy="pooled_research" />);

    expect(screen.getByText(/legal-gate notice/i)).toBeInTheDocument();
    expect(screen.getByText(/pooled model/i)).toBeInTheDocument();
  });

  it("renders a designed missing estimate state", () => {
    render(<EstimateResultsView estimate={null} modelStrategy="synthetic_baseline" />);

    expect(screen.getByRole("heading", { name: /estimate not found/i })).toBeInTheDocument();
  });
});
