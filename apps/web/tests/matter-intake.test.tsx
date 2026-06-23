import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MatterIntakeForm } from "@/components/estimate/matter-intake-form";
import { syntheticTaxonomy } from "@/lib/api/fixtures";
import {
  REVEAL_ESTIMATE_SESSION_KEY,
  getRandomProcessingDelayMs,
} from "@/lib/estimate-processing";

const push = vi.fn();

vi.mock("@/lib/estimate-processing", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/estimate-processing")>();

  return {
    ...actual,
    getRandomProcessingDelayMs: vi.fn(() => 100),
  };
});

vi.mock("next/navigation", async () => {
  const actual =
    await vi.importActual<typeof import("next/navigation")>("next/navigation");

  return {
    ...actual,
    useRouter: () => ({ push, replace: vi.fn() }),
    useSearchParams: () => new URLSearchParams(),
  };
});

describe("matter intake workflow", () => {
  beforeEach(() => {
    push.mockReset();
    sessionStorage.clear();
    vi.mocked(getRandomProcessingDelayMs).mockReturnValue(100);
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json({
          estimate_id: "estimate-from-api",
        }),
      ),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("shows required field errors", async () => {
    render(<MatterIntakeForm taxonomy={syntheticTaxonomy} />);

    await userEvent.click(screen.getByRole("button", { name: /create estimate/i }));

    expect(await screen.findByText(/matter type is required/i)).toBeInTheDocument();
    expect(screen.getByText(/document volume must be positive/i)).toBeInTheDocument();
    expect(screen.getByText(/party count must be positive/i)).toBeInTheDocument();
  });

  it("updates matter subtype options after matter type selection", async () => {
    render(<MatterIntakeForm taxonomy={syntheticTaxonomy} />);

    await userEvent.selectOptions(screen.getByLabelText(/matter type/i), "Litigation");

    expect(screen.getByRole("option", { name: "Debt Recovery" })).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: "Share Purchase" }),
    ).not.toBeInTheDocument();
  });

  it("rejects an HK-only matter marked as cross-border", async () => {
    render(<MatterIntakeForm taxonomy={syntheticTaxonomy} />);

    await userEvent.selectOptions(screen.getByLabelText(/matter type/i), "Litigation");
    await userEvent.selectOptions(screen.getByLabelText(/matter subtype/i), "Debt Recovery");
    await userEvent.selectOptions(screen.getByLabelText(/jurisdiction/i), "HK Only");
    await userEvent.selectOptions(screen.getByLabelText(/firm tier/i), "Mid-tier (6-10 partners)");
    await userEvent.selectOptions(screen.getByLabelText(/client type/i), "Financial Institution");
    await userEvent.clear(screen.getByLabelText(/document volume/i));
    await userEvent.type(screen.getByLabelText(/document volume/i), "120");
    await userEvent.clear(screen.getByLabelText(/complexity score/i));
    await userEvent.type(screen.getByLabelText(/complexity score/i), "3");
    await userEvent.clear(screen.getByLabelText(/party count/i));
    await userEvent.type(screen.getByLabelText(/party count/i), "3");
    await userEvent.selectOptions(screen.getByLabelText(/billing model/i), "Fixed Fee");
    await userEvent.click(screen.getByLabelText(/cross-border matter/i));
    await userEvent.click(screen.getByRole("button", { name: /create estimate/i }));

    expect(
      await screen.findByText(/cross-border matters must use a cross-border jurisdiction/i),
    ).toBeInTheDocument();
  });

  it("auto-marks cross-border matters when a cross-border jurisdiction is selected", async () => {
    render(<MatterIntakeForm taxonomy={syntheticTaxonomy} />);

    await userEvent.selectOptions(screen.getByLabelText(/matter type/i), "Litigation");
    await userEvent.selectOptions(screen.getByLabelText(/matter subtype/i), "Debt Recovery");
    await userEvent.selectOptions(
      screen.getByLabelText(/jurisdiction/i),
      "GBA Cross-Border (HK-PRC)",
    );

    expect(screen.getByLabelText(/cross-border matter/i)).toBeChecked();
  });

  it("posts a valid matter to the estimates API", async () => {
    render(<MatterIntakeForm taxonomy={syntheticTaxonomy} />);

    await fillValidMatter();
    await userEvent.click(screen.getByRole("button", { name: /create estimate/i }));

    await waitFor(() => expect(fetch).toHaveBeenCalledWith("/v1/estimates", expect.any(Object)));
    const [, init] = vi.mocked(fetch).mock.calls[0];
    expect(JSON.parse(String(init?.body))).toMatchObject({
      tenant_id: "synthetic-demo-tenant",
      model_strategy: "synthetic_baseline",
      risk_tolerance: "balanced",
      matter_input: {
        matter_type: "Litigation",
        matter_subtype: "Debt Recovery",
        jurisdiction: "GBA Cross-Border (HK-PRC)",
        document_volume: 120,
        party_count: 3,
        cross_border_flag: true,
        schema_version: "proforma.matter.v1",
      },
    });
    expect(JSON.parse(String(init?.body)).matter_input).not.toHaveProperty("deal_value_hkd");
    await waitFor(() =>
      expect(push).toHaveBeenCalledWith("/estimate/estimate-from-api"),
    );
    expect(sessionStorage.getItem(REVEAL_ESTIMATE_SESSION_KEY)).toBe("estimate-from-api");
  });

  it("waits for dissolve and processing before navigating", async () => {
    render(<MatterIntakeForm taxonomy={syntheticTaxonomy} />);

    await fillValidMatter();

    vi.useFakeTimers();
    vi.mocked(getRandomProcessingDelayMs).mockReturnValue(3000);

    fireEvent.click(screen.getByRole("button", { name: /create estimate/i }));

    await vi.advanceTimersByTimeAsync(499);
    expect(push).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(3600);

    expect(push).toHaveBeenCalledWith("/estimate/estimate-from-api");
    expect(sessionStorage.getItem(REVEAL_ESTIMATE_SESSION_KEY)).toBe("estimate-from-api");
  });

  it("invokes processing callbacks during submit", async () => {
    const onProcessingStart = vi.fn();
    const onDissolveComplete = vi.fn();

    render(
      <MatterIntakeForm
        onDissolveComplete={onDissolveComplete}
        onProcessingStart={onProcessingStart}
        taxonomy={syntheticTaxonomy}
      />,
    );

    await fillValidMatter();
    await userEvent.click(screen.getByRole("button", { name: /create estimate/i }));

    expect(onProcessingStart).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(onDissolveComplete).toHaveBeenCalledTimes(1));
  });

  it("saves created estimates to the signed-in user's local history", async () => {
    localStorage.setItem(
      "proforma.demo.session",
      JSON.stringify({
        email: "partner@example.com",
        signedInAt: "2026-06-22T08:00:00.000Z",
      }),
    );
    render(<MatterIntakeForm taxonomy={syntheticTaxonomy} />);

    await fillValidMatter();
    await userEvent.click(screen.getByRole("button", { name: /create estimate/i }));

    await waitFor(() => {
      const saved = JSON.parse(
        String(localStorage.getItem("proforma.estimate-history.partner@example.com")),
      );
      expect(saved[0].estimate.estimate_id).toBe("estimate-from-api");
      expect(saved[0].matterSummary).toMatchObject({
        billingModel: "Fixed Fee",
        matterType: "Litigation",
      });
    });
  });

  it("sends deal value for transactional matter types", async () => {
    render(<MatterIntakeForm taxonomy={syntheticTaxonomy} />);

    await userEvent.selectOptions(screen.getByLabelText(/matter type/i), "M&A");
    await userEvent.selectOptions(screen.getByLabelText(/matter subtype/i), "Share Acquisition - Private");
    await userEvent.selectOptions(screen.getByLabelText(/jurisdiction/i), "HK Only");
    await userEvent.selectOptions(screen.getByLabelText(/firm tier/i), "Mid-tier (6-10 partners)");
    await userEvent.selectOptions(screen.getByLabelText(/client type/i), "Financial Institution");
    await userEvent.type(screen.getByLabelText(/deal value hkd/i), "50000000");
    await userEvent.clear(screen.getByLabelText(/document volume/i));
    await userEvent.type(screen.getByLabelText(/document volume/i), "120");
    await userEvent.clear(screen.getByLabelText(/complexity score/i));
    await userEvent.type(screen.getByLabelText(/complexity score/i), "3");
    await userEvent.clear(screen.getByLabelText(/party count/i));
    await userEvent.type(screen.getByLabelText(/party count/i), "3");
    await userEvent.selectOptions(screen.getByLabelText(/billing model/i), "Fixed Fee");

    await userEvent.click(screen.getByRole("button", { name: /create estimate/i }));

    await waitFor(() => expect(fetch).toHaveBeenCalledWith("/v1/estimates", expect.any(Object)));
    await waitFor(() => {
      const [, init] = vi.mocked(fetch).mock.calls.at(-1) ?? [];
      expect(JSON.parse(String(init?.body)).matter_input.deal_value_hkd).toBe(50_000_000);
    });
  });
});

async function fillValidMatter() {
  await userEvent.selectOptions(screen.getByLabelText(/matter type/i), "Litigation");
  await userEvent.selectOptions(screen.getByLabelText(/matter subtype/i), "Debt Recovery");
  await userEvent.selectOptions(
    screen.getByLabelText(/jurisdiction/i),
    "GBA Cross-Border (HK-PRC)",
  );
  await userEvent.selectOptions(screen.getByLabelText(/firm tier/i), "Mid-tier (6-10 partners)");
  await userEvent.selectOptions(screen.getByLabelText(/client type/i), "Financial Institution");
  await userEvent.clear(screen.getByLabelText(/document volume/i));
  await userEvent.type(screen.getByLabelText(/document volume/i), "120");
  await userEvent.clear(screen.getByLabelText(/complexity score/i));
  await userEvent.type(screen.getByLabelText(/complexity score/i), "3");
  await userEvent.clear(screen.getByLabelText(/party count/i));
  await userEvent.type(screen.getByLabelText(/party count/i), "3");
  await userEvent.selectOptions(screen.getByLabelText(/billing model/i), "Fixed Fee");
  await userEvent.click(screen.getByRole("radio", { name: /balanced/i }));
}
