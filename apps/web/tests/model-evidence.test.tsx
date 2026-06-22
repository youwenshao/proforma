import { render, screen } from "@testing-library/react";
import { ModelEvidenceView } from "@/components/models/model-evidence-view";
import {
  modelCurrentFixture,
  modelEvaluationFixture,
  similarMatterEvidenceFixture,
  strategyComparisonFixture,
} from "@/lib/api/fixtures";

describe("model evidence view", () => {
  it("surfaces feasibility model evidence and governance gates", () => {
    render(
      <ModelEvidenceView
        current={modelCurrentFixture}
        evaluation={modelEvaluationFixture}
        similarMatterEvidence={similarMatterEvidenceFixture}
        strategyComparison={strategyComparisonFixture}
      />,
    );

    expect(screen.getByText(/proforma-baseline-v1/i)).toBeInTheDocument();
    expect(screen.getByText(/proforma-hk-synthetic-mvp-v1/i)).toBeInTheDocument();
    expect(screen.getAllByText(/SYNTHETIC_MVP_V1/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/synthetic data/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/firm-specific/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/pooled/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/legally_gated/i)).toBeInTheDocument();
    expect(screen.getByRole("table", { name: /metrics by matter type/i })).toBeInTheDocument();
    expect(screen.getByText(/calibration method/i)).toBeInTheDocument();
    expect(screen.getAllByText(/segment residual quantiles/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/similar matter evidence/i)).toBeInTheDocument();
    expect(screen.getByText(/data_residency_approval_required/i)).toBeInTheDocument();
  });
});
