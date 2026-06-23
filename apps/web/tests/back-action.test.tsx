import { screen } from "@testing-library/react";
import { BackAction } from "@/components/back-action";
import { renderWithLocale } from "./render-with-locale";

describe("back action", () => {
  it("renders compact arrow-led home navigation", () => {
    renderWithLocale(<BackAction href="/" label="Home" />);

    expect(screen.getByRole("link", { name: /home/i })).toHaveTextContent("Home");
    expect(screen.getByRole("link", { name: /home/i })).toHaveAttribute("href", "/");
  });
});
