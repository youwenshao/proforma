import { screen, within } from "@testing-library/react";
import { SavedResultsView } from "@/components/results/saved-results-view";
import { sampleEstimate } from "@/lib/api/fixtures";
import { renderWithLocale } from "./render-with-locale";

describe("saved results view", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("asks users to sign in before showing browser-local history", () => {
    renderWithLocale(<SavedResultsView />);

    expect(screen.getByRole("heading", { name: /sign in to view saved results/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sign in/i })).toHaveAttribute("href", "/login");
  });

  it("lists saved estimates for the active demo email", () => {
    localStorage.setItem(
      "proforma.demo.session",
      JSON.stringify({ email: "partner@example.com", signedInAt: "2026-06-22T08:00:00.000Z" }),
    );
    localStorage.setItem(
      "proforma.estimate-history.partner@example.com",
      JSON.stringify([
        {
          createdAt: "2026-06-22T09:00:00.000Z",
          estimate: sampleEstimate,
          matterSummary: {
            billingModel: "Fixed Fee",
            jurisdiction: "HK Only",
            matterType: "Litigation",
            subtitle: "Debt Recovery · Financial Institution",
          },
          modelStrategy: "synthetic_baseline",
        },
      ]),
    );

    renderWithLocale(<SavedResultsView />);

    const card = screen.getByRole("article", { name: /litigation estimate/i });
    expect(within(card).getByText(/debt recovery/i)).toBeInTheDocument();
    expect(within(card).getByText(/chance work grows/i)).toBeInTheDocument();
    expect(within(card).getByRole("link", { name: /open result/i })).toHaveAttribute(
      "href",
      `/estimate/${sampleEstimate.estimate_id}`,
    );
    expect(within(card).getByRole("link", { name: /monitoring/i })).toHaveAttribute(
      "href",
      `/monitoring/${sampleEstimate.estimate_id}`,
    );
  });
});
