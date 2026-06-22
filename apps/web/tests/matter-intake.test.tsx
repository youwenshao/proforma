import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MatterIntakeForm } from "@/components/estimate/matter-intake-form";
import { syntheticTaxonomy } from "@/lib/api/fixtures";

const push = vi.fn();

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

    await fillValidMatter();
    await userEvent.selectOptions(screen.getByLabelText(/jurisdiction/i), "HK Only");
    await userEvent.click(screen.getByRole("button", { name: /create estimate/i }));

    expect(
      await screen.findByText(/cross-border matters must use a cross-border jurisdiction/i),
    ).toBeInTheDocument();
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
      },
    });
    expect(push).toHaveBeenCalledWith("/estimate/estimate-from-api");
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
  await userEvent.click(screen.getByLabelText(/cross-border matter/i));
  await userEvent.selectOptions(screen.getByLabelText(/billing model/i), "Fixed Fee");
  await userEvent.click(screen.getByRole("radio", { name: /balanced/i }));
}
