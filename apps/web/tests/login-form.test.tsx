import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "@/components/auth/login-form";

describe("demo login form", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("catches common email domain typos before sign in", async () => {
    render(<LoginForm />);

    await userEvent.type(screen.getByLabelText(/email/i), "alex@gmai.com");
    await userEvent.type(screen.getByLabelText(/password/i), "CorrectHorseStaple42!");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText(/domain looks mistyped/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /use alex@gmail.com/i })).toBeInTheDocument();
  });

  it("stores only the demo email session after successful sign in", async () => {
    render(<LoginForm />);

    await userEvent.type(screen.getByLabelText(/email/i), "Partner@Example.COM");
    await userEvent.type(screen.getByLabelText(/password/i), "CorrectHorseStaple42!");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      const session = JSON.parse(String(localStorage.getItem("proforma.demo.session")));
      expect(session.email).toBe("partner@example.com");
      expect(JSON.stringify(session)).not.toContain("CorrectHorseStaple42!");
    });
  });
});
