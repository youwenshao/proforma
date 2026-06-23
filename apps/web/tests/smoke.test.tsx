import { screen } from "@testing-library/react";
import Home from "@/app/page";
import { renderWithLocale } from "./render-with-locale";

describe("ProForma dashboard smoke test", () => {
  it("renders the core feasibility dashboard entry points", () => {
    renderWithLocale(<Home />);

    expect(
      screen.getByRole("heading", { name: /Price legal work with evidence, not guesswork/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Pre-quote pricing intelligence/i)).toBeInTheDocument();
    expect(screen.getByText(/reviewable cost ranges/i)).toBeInTheDocument();
    expect(screen.getByText(/Generated report preview/i)).toBeInTheDocument();
    expect(screen.getByText(/synthetic data/i)).toBeInTheDocument();
    expect(
      screen
        .getAllByRole("link", { name: /start estimate/i })
        .some((link) => link.getAttribute("href") === "/estimate/new"),
    ).toBe(true);
    expect(
      screen
        .getAllByRole("link", { name: /view saved results/i })
        .some((link) => link.getAttribute("href") === "/results"),
    ).toBe(true);
    expect(
      screen
        .getAllByRole("link", { name: /model evidence/i })
        .some((link) => link.getAttribute("href") === "/models"),
    ).toBe(true);
  });
});
