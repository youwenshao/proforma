import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ScopeMonitoringDashboard } from "@/components/monitoring/scope-monitoring-dashboard";
import { StageUpdateForm } from "@/components/monitoring/stage-update-form";
import { sampleEstimate } from "@/lib/api/fixtures";
import { renderWithLocale } from "./render-with-locale";

describe("scope monitoring dashboard", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json({
          actual_hours: 95,
          estimate_id: sampleEstimate.estimate_id,
          predicted_hours: 82,
          recommended_review_action: "Partner review required.",
          scope_creep_flag: true,
          stage_name: "Case Assessment",
          variance_pct: 15.9,
        }),
      ),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows warning and critical variance states", () => {
    renderWithLocale(<ScopeMonitoringDashboard estimate={sampleEstimate} />);

    expect(screen.getAllByText(/warning/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/critical/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/recommended review action/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/reforecast final cost/i)).toBeInTheDocument();
    expect(screen.getByText(/overrun probability/i)).toBeInTheDocument();
  });

  it("does not render confidential free-text notes by default", () => {
    renderWithLocale(<StageUpdateForm estimateId={sampleEstimate.estimate_id} stages={sampleEstimate.stage_estimates} />);

    expect(screen.queryByLabelText(/notes/i)).not.toBeInTheDocument();
  });

  it("posts structured updates to the scope monitoring endpoint", async () => {
    renderWithLocale(<StageUpdateForm estimateId={sampleEstimate.estimate_id} stages={sampleEstimate.stage_estimates} />);

    await userEvent.selectOptions(screen.getByLabelText(/stage name/i), "Case Assessment");
    await userEvent.clear(screen.getByLabelText(/actual partner hours/i));
    await userEvent.type(screen.getByLabelText(/actual partner hours/i), "35");
    await userEvent.clear(screen.getByLabelText(/actual associate hours/i));
    await userEvent.type(screen.getByLabelText(/actual associate hours/i), "60");
    await userEvent.clear(screen.getByLabelText(/actual cost/i));
    await userEvent.type(screen.getByLabelText(/actual cost/i), "130000");
    await userEvent.click(screen.getByRole("button", { name: /post stage update/i }));

    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(
        `/v1/estimates/${sampleEstimate.estimate_id}/scope-updates`,
        expect.any(Object),
      ),
    );
    const [, init] = vi.mocked(fetch).mock.calls[0];
    expect(JSON.parse(String(init?.body))).toMatchObject({
      actual_associate_hours: 60,
      actual_cost_hkd: 130000,
      actual_partner_hours: 35,
      stage_name: "Case Assessment",
    });
    expect(within(await screen.findByRole("status")).getByText(/15.9%/)).toBeInTheDocument();
  });
});
