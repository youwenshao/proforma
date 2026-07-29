import { screen, within } from "@testing-library/react";
import { ModelEvidenceView } from "@/components/models/model-evidence-view";
import {
  modelArtifactsFixture,
  modelCurrentFixture,
  modelEvaluationFixture,
  similarMatterEvidenceFixture,
  strategyComparisonFixture,
} from "@/lib/api/fixtures";
import { renderWithLocale } from "./render-with-locale";

function renderModelEvidenceView() {
  renderWithLocale(
    <ModelEvidenceView
      artifactIndex={modelArtifactsFixture}
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

    expect(screen.getAllByText(/proforma-baseline-v1/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/proforma-hk-synthetic-mvp-v1/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/SYNTHETIC_MVP_V1/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/synthetic data/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/trained on one firm's own matters/i)).toBeInTheDocument();
    expect(screen.getAllByText(/trained on matters pooled across firms/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/legally_gated/i)).toBeInTheDocument();
    expect(screen.getByRole("table", { name: /metrics by matter type/i })).toBeInTheDocument();
    expect(screen.getAllByText(/how the range is worked out/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/segment residual quantiles/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/showing comparable past matters/i)).toBeInTheDocument();
    expect(screen.getByText(/data_residency_approval_required/i)).toBeInTheDocument();
  });

  it("defines the jargon a non-technical reviewer needs before the evidence", () => {
    renderModelEvidenceView();

    expect(
      screen.getByRole("heading", { name: /five terms used throughout this page/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Scope creep")).toBeInTheDocument();
    expect(screen.getByText(/cost more than 5% above the original quote/i)).toBeInTheDocument();
    expect(screen.getByText(/it does not read documents and it does not write text/i)).toBeInTheDocument();
    expect(screen.getByText(/low-to-high band rather than a single number/i)).toBeInTheDocument();
  });

  it("explains in plain language how the synthetic dataset was built", () => {
    renderModelEvidenceView();

    expect(
      screen.getByRole("heading", {
        name: /how the practice data behind these estimates was built/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/4,000 invented Hong Kong legal matters/i)).toBeInTheDocument();
    expect(screen.getByText(/no wording was written by an AI chatbot/i)).toBeInTheDocument();
    expect(screen.getByText(/called a seed \(20260622\)/i)).toBeInTheDocument();
    expect(screen.getByText(/cannot prove what a real Hong Kong matter costs/i)).toBeInTheDocument();
    expect(
      screen.getByText(/no row contains a name, an email address, a matter description/i),
    ).toBeInTheDocument();
  });

  it("describes what the model is and what it may never see", () => {
    renderModelEvidenceView();

    expect(screen.getByText(/is not a chatbot and it does not read documents/i)).toBeInTheDocument();
    expect(screen.getByText(/only the structured facts entered on the intake form/i)).toBeInTheDocument();
    expect(screen.getByText(/anything knowable only once a matter has finished/i)).toBeInTheDocument();
  });

  it("explains each accuracy number without assuming statistics knowledge", () => {
    renderModelEvidenceView();

    expect(screen.getByText(/fitted on three quarters of the invented matters/i)).toBeInTheDocument();
    expect(screen.getByText(/on an average matter we were out by about this much/i)).toBeInTheDocument();
    expect(screen.getByText(/occasional very large misses count far more heavily/i)).toBeInTheDocument();
    expect(screen.getByText(/roughly 28% on a typical matter/i)).toBeInTheDocument();
    expect(screen.getByText(/no better than a coin toss/i)).toBeInTheDocument();
    expect(screen.getByText(/Scope-creep and overrun rates/i)).toBeInTheDocument();
  });

  it("offers the dataset, model, and report files for viewing and download", () => {
    renderModelEvidenceView();

    const datasetDownload = screen.getByRole("link", {
      name: /download the synthetic matter dataset/i,
    });
    expect(datasetDownload).toHaveAttribute(
      "href",
      "/v1/models/artifacts/synthetic-dataset/content?disposition=attachment",
    );
    expect(datasetDownload).toHaveAttribute("download", "proforma_hk_synthetic_mvp.csv");

    const generatorView = screen.getByRole("link", {
      name: /view the generator program in the browser/i,
    });
    expect(generatorView).toHaveAttribute(
      "href",
      "/v1/models/artifacts/dataset-generator/content?disposition=inline",
    );
    expect(generatorView).toHaveAttribute("target", "_blank");

    const datasetRow = screen.getByText(/the synthetic matter dataset/i).closest("li");
    expect(datasetRow?.textContent).toContain("proforma_hk_synthetic_mvp.csv");
    expect(datasetRow?.textContent).toContain("2.2 MB");
    expect(screen.getByText(/model card: cost estimate/i)).toBeInTheDocument();
  });

  it("marks model files that have not been rebuilt in this environment", () => {
    renderModelEvidenceView();

    const bundle = screen.getByText(/fitted model: total cost/i).closest("li");
    expect(bundle).not.toBeNull();
    expect(
      within(bundle as HTMLElement).getByText(/not built here/i),
    ).toBeInTheDocument();
    expect(
      within(bundle as HTMLElement).queryByRole("link", { name: /download/i }),
    ).toBeNull();
    expect(screen.getByText(/rebuilt from the dataset rather than stored/i)).toBeInTheDocument();
  });
});
