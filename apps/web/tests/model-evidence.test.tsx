import { screen } from "@testing-library/react";
import { ModelEvidenceView } from "@/components/models/model-evidence-view";
import {
  modelCurrentFixture,
  modelEvaluationFixture,
  similarMatterEvidenceFixture,
  strategyComparisonFixture,
} from "@/lib/api/fixtures";
import { renderWithLocale } from "./render-with-locale";

function renderModelEvidenceView() {
  renderWithLocale(
    <ModelEvidenceView
      current={modelCurrentFixture}
      evaluation={modelEvaluationFixture}
      similarMatterEvidence={similarMatterEvidenceFixture}
      strategyComparison={strategyComparisonFixture}
    />,
  );
}

describe("model evidence view", () => {
  it("surfaces feasibility model evidence and governance gates", () => {
    renderModelEvidenceView();

    expect(screen.getByText(/proforma-baseline-v1/i)).toBeInTheDocument();
    expect(screen.getAllByText(/proforma-hk-synthetic-mvp-v1/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/SYNTHETIC_MVP_V1/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/synthetic data/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/firm-specific/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/pooled/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/legally_gated/i)).toBeInTheDocument();
    expect(screen.getByRole("table", { name: /metrics by matter type/i })).toBeInTheDocument();
    expect(screen.getAllByText(/calibration method/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/segment residual quantiles/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/similar matter evidence/i)).toBeInTheDocument();
    expect(screen.getByText(/data_residency_approval_required/i)).toBeInTheDocument();
  });

  it("explains the synthetic validation dataset and key metrics in plain language", () => {
    renderModelEvidenceView();

    expect(
      screen.getByRole("heading", {
        name: /how the synthetic validation dataset was built/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/4,000 synthetic Hong Kong matters/i)).toBeInTheDocument();
    expect(screen.getByText(/seed 20260622/i)).toBeInTheDocument();
    expect(screen.getByText(/not LLM-written narratives/i)).toBeInTheDocument();
    expect(screen.getByText(/pre-real-data validation/i)).toBeInTheDocument();
    expect(screen.getByText(/not production market proof/i)).toBeInTheDocument();
    expect(screen.getByText(/MAE tells us/i)).toBeInTheDocument();
    expect(screen.getAllByText(/RMSE/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/sMAPE/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Range coverage/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/ROC-AUC/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Scope-creep and overrun rates/i)).toBeInTheDocument();
    expect(screen.getAllByText(/correlations/i).length).toBeGreaterThan(0);
  });
});
