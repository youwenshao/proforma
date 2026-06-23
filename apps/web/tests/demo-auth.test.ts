import {
  estimatePasswordStrength,
  normalizeEmail,
  suggestEmailCorrection,
  validateDemoEmail,
} from "@/lib/demo-auth";

describe("demo auth helpers", () => {
  it("normalizes and validates plain email input", () => {
    expect(normalizeEmail("  Partner@Example.COM ")).toBe("partner@example.com");
    expect(validateDemoEmail("partner@example.com")).toEqual({ ok: true });
    expect(validateDemoEmail("partner.example.com")).toEqual({
      ok: false,
      message: "Enter an email address with an @ sign and a domain.",
    });
  });

  it("suggests corrections for common email domain typos", () => {
    expect(suggestEmailCorrection("alex@gmai.com")).toBe("alex@gmail.com");
    expect(suggestEmailCorrection("alex@hotnail.com")).toBe("alex@hotmail.com");
    expect(suggestEmailCorrection("alex@outlok.com")).toBe("alex@outlook.com");
    expect(suggestEmailCorrection("alex@example.com")).toBeNull();
  });

  it("estimates password strength with digestible feedback", () => {
    expect(estimatePasswordStrength("abc").label).toBe("Weak");
    expect(estimatePasswordStrength("correct horse staple").label).toBe("Fair");
    expect(estimatePasswordStrength("CorrectHorseStaple42!").label).toBe("Strong");
    expect(estimatePasswordStrength("CorrectHorseStaple42!").feedback).toContain(
      "Good demo password strength.",
    );
  });
});
