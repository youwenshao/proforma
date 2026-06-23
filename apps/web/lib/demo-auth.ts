export type DemoSession = {
  email: string;
  signedInAt: string;
};

export type EmailValidationResult =
  | { ok: true }
  | { ok: false; message: string; suggestion?: string };

export type PasswordStrength = {
  feedback: string;
  label: "Weak" | "Fair" | "Good" | "Strong";
  score: number;
};

const sessionKey = "proforma.demo.session";

const domainCorrections: Record<string, string> = {
  "gmai.com": "gmail.com",
  "gmial.com": "gmail.com",
  "hotnail.com": "hotmail.com",
  "outlok.com": "outlook.com",
  "outllok.com": "outlook.com",
};

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function suggestEmailCorrection(email: string) {
  const normalized = normalizeEmail(email);
  const [local, domain] = normalized.split("@");

  if (!local || !domain || !domainCorrections[domain]) {
    return null;
  }

  return `${local}@${domainCorrections[domain]}`;
}

export function validateDemoEmail(email: string): EmailValidationResult {
  const normalized = normalizeEmail(email);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    return {
      ok: false,
      message: "Enter an email address with an @ sign and a domain.",
    };
  }

  const suggestion = suggestEmailCorrection(normalized);
  if (suggestion) {
    return {
      ok: false,
      message: "That email domain looks mistyped.",
      suggestion,
    };
  }

  return { ok: true };
}

export function estimatePasswordStrength(password: string): PasswordStrength {
  let score = 0;

  if (password.length >= 8) {
    score += 1;
  }
  if (password.length >= 14) {
    score += 1;
  }
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    score += 1;
  }
  if (/\d/.test(password)) {
    score += 1;
  }
  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  }

  if (score >= 5) {
    return {
      feedback: "Good demo password strength. We do not store this password.",
      label: "Strong",
      score,
    };
  }
  if (score >= 4) {
    return {
      feedback: "This is usable for the demo. Add a symbol to make it stronger.",
      label: "Good",
      score,
    };
  }
  if (score >= 2) {
    return {
      feedback: "Use at least 14 characters, with mixed case and a number.",
      label: "Fair",
      score,
    };
  }

  return {
    feedback: "Too easy to guess. Use a longer phrase with mixed characters.",
    label: "Weak",
    score,
  };
}

export function getDemoSession(): DemoSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(sessionKey);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as DemoSession;
    return parsed.email ? parsed : null;
  } catch {
    return null;
  }
}

export function saveDemoSession(email: string) {
  const session: DemoSession = {
    email: normalizeEmail(email),
    signedInAt: new Date().toISOString(),
  };

  window.localStorage.setItem(sessionKey, JSON.stringify(session));
  window.dispatchEvent(new Event("proforma-demo-session"));
  return session;
}

export function clearDemoSession() {
  window.localStorage.removeItem(sessionKey);
  window.dispatchEvent(new Event("proforma-demo-session"));
}
