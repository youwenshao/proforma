import { screen } from "@testing-library/react";
import LoginPage from "@/app/login/page";
import { renderWithLocale } from "./render-with-locale";

describe("login page layout", () => {
  it("uses a desktop two-column login layout with the sign-in panel on the right", () => {
    renderWithLocale(<LoginPage />);

    const layout = screen.getByTestId("login-page-layout");
    expect(layout).toHaveClass("md:grid-cols-[minmax(0,1fr)_minmax(360px,440px)]");
    expect(screen.getByTestId("login-marketing-panel")).toHaveTextContent(
      /Pick up where you left off/i,
    );
    expect(screen.getByTestId("login-marketing-panel")).toHaveTextContent(
      /reopen them and export copies/i,
    );
    expect(screen.getByTestId("login-form-panel")).toContainElement(
      screen.getByRole("heading", { name: /sign in to the demo/i }),
    );
  });

  it("uses the fixed login aurora background", () => {
    renderWithLocale(<LoginPage />);

    expect(screen.getByTestId("login-aurora-background")).toHaveStyle({
      "--aurora-image": 'url("/auroras/background-4.jpg")',
    });
  });
});
