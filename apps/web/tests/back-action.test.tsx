import { render, screen } from "@testing-library/react";
import { BackAction } from "@/components/back-action";

describe("back action", () => {
  it("renders compact arrow-led home navigation", () => {
    render(<BackAction href="/" label="Home" />);

    expect(screen.getByRole("link", { name: /home/i })).toHaveTextContent("Home");
    expect(screen.getByRole("link", { name: /home/i })).toHaveAttribute("href", "/");
  });
});
