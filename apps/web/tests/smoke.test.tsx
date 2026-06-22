import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("ProForma dashboard smoke test", () => {
  it("renders the core feasibility dashboard entry points", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { name: /ProForma HK/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/synthetic data/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /start estimate/i }),
    ).toHaveAttribute("href", "/estimate/new");
    expect(
      screen.getByRole("link", { name: /model evidence/i }),
    ).toHaveAttribute("href", "/models");
  });
});
