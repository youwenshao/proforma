import { render, screen, within } from "@testing-library/react";
import { AppShell } from "@/components/app-shell";
import { renderWithLocale } from "./render-with-locale";

describe("app shell navigation", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("exposes every primary workflow through navigation", () => {
    renderWithLocale(
      <AppShell>
        <main>Dashboard content</main>
      </AppShell>,
    );

    const nav = screen.getByRole("navigation", { name: "Primary" });

    expect(within(nav).queryByRole("link", { name: /dashboard/i })).not.toBeInTheDocument();
    expect(within(nav).getByRole("link", { name: /new estimate/i })).toHaveAttribute(
      "href",
      "/estimate/new",
    );
    expect(within(nav).getByRole("link", { name: /results/i })).toHaveAttribute("href", "/results");
    expect(within(nav).getByRole("link", { name: /model evidence/i })).toHaveAttribute(
      "href",
      "/models",
    );
    expect(screen.getByRole("link", { name: /sign in/i })).toHaveAttribute("href", "/login");
  });

  it("renders Traditional Chinese navigation when locale is zh-Hant", () => {
    renderWithLocale(
      <AppShell>
        <main>Dashboard content</main>
      </AppShell>,
      "zh-Hant",
    );

    const nav = screen.getByRole("navigation", { name: "主要導覽" });

    expect(within(nav).getByRole("link", { name: /新增估算/i })).toHaveAttribute(
      "href",
      "/estimate/new?locale=zh-Hant",
    );
    expect(within(nav).queryByRole("link", { name: /new estimate/i })).not.toBeInTheDocument();
  });

  it("keeps the nav logo minimal without a bordered container", () => {
    renderWithLocale(
      <AppShell>
        <main>Dashboard content</main>
      </AppShell>,
    );

    const logoLink = screen.getByRole("link", { name: /proforma home/i });
    expect(logoLink).toHaveAttribute("href", "/");
    expect(logoLink.firstElementChild).not.toHaveClass("border");
  });

  it("renders the Sentimento company footer", () => {
    renderWithLocale(
      <AppShell>
        <main>Dashboard content</main>
      </AppShell>,
    );

    const footer = screen.getByRole("contentinfo");
    expect(within(footer).getByText(/Sentimento Technologies Limited/i)).toBeInTheDocument();
    expect(within(footer).getByRole("link", { name: /sentimento.dev/i })).toHaveAttribute(
      "href",
      "https://www.sentimento.dev",
    );
    expect(within(footer).getByText(/feasibility/i)).toBeInTheDocument();
  });
});
