import { screen } from "@testing-library/react";
import { HeroSection } from "@/components/marketing/hero-section";
import { renderWithLocale } from "./render-with-locale";

describe("locale-aware UI rendering", () => {
  it("renders Traditional Chinese hero copy when locale is zh-Hant", () => {
    renderWithLocale(<HeroSection />, "zh-Hant");

    expect(screen.getByRole("link", { name: /開始估算/i })).toHaveAttribute(
      "href",
      "/estimate/new?locale=zh-Hant",
    );
    expect(screen.queryByRole("link", { name: /^Start estimate$/i })).not.toBeInTheDocument();
  });

  it("renders English hero copy by default", () => {
    renderWithLocale(<HeroSection />);

    expect(screen.getByRole("link", { name: /start estimate/i })).toBeInTheDocument();
  });
});
