"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  estimatePasswordStrength,
  signInDemo,
  signInWithPassword,
  signUpWithPassword,
  validateDemoEmail,
  type PasswordStrength,
} from "@/lib/auth/session";
import { isSupabaseAuthEnabled } from "@/lib/supabase/config";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const strengthPillClassNames: Record<PasswordStrength["label"], string> = {
  Weak: "bg-destructive/10 text-destructive",
  Fair: "bg-amber-500/15 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300",
  Good: "bg-primary/10 text-primary",
  Strong: "bg-emerald-600/12 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300",
};

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  const strength = useMemo(() => estimatePasswordStrength(password), [password]);

  const [submitting, setSubmitting] = useState(false);
  const supabaseAuthEnabled = isSupabaseAuthEnabled();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuggestion(null);

    const validation = validateDemoEmail(email);
    if (!validation.ok) {
      setError(validation.message);
      setSuggestion(validation.suggestion ?? null);
      return;
    }

    if (supabaseAuthEnabled) {
      if (password.length < 8) {
        setError("Use at least 8 characters for your password.");
        return;
      }

      setSubmitting(true);
      try {
        await signInWithPassword(email, password);
      } catch {
        try {
          await signUpWithPassword(email, password);
        } catch (signUpError) {
          setError(
            signUpError instanceof Error
              ? signUpError.message
              : "Unable to sign in with Supabase.",
          );
          setSubmitting(false);
          return;
        }
      } finally {
        setSubmitting(false);
      }

      router.push("/");
      router.refresh();
      return;
    }

    signInDemo(email);
    router.push("/");
  }

  return (
    <Card className="w-full max-w-md border-white/20 bg-white/50 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-card/50">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold tracking-tight">
          <h2>Sign in to the demo</h2>
        </CardTitle>
        <CardDescription>
          {supabaseAuthEnabled
            ? "Sign in with your Supabase account. New users are registered on first sign-in."
            : "Any email works. Your session stays in this browser only."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          {error ? (
            <Alert variant="destructive">
              <AlertTitle>Check your email</AlertTitle>
              <AlertDescription className="space-y-2">
                <p>{error}</p>
                {suggestion ? (
                  <Button
                    onClick={() => {
                      setEmail(suggestion);
                      setError(null);
                      setSuggestion(null);
                    }}
                    type="button"
                    variant="outline"
                  >
                    Use {suggestion}
                  </Button>
                ) : null}
              </AlertDescription>
            </Alert>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              autoComplete="email"
              id="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="partner@example.com"
              type="email"
              value={email}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              autoComplete="current-password"
              id="password"
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              value={password}
            />
            <div aria-live="polite" className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-muted-foreground">Password strength</span>
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium leading-none",
                  strengthPillClassNames[strength.label],
                )}
              >
                {strength.label}
              </span>
            </div>
          </div>

          <Alert className="border-foreground/8 bg-white/40 backdrop-blur-sm dark:bg-card/40">
            <AlertTitle>{supabaseAuthEnabled ? "Hosted auth" : "Demo login only"}</AlertTitle>
            <AlertDescription>
              {supabaseAuthEnabled
                ? "Credentials are verified by Supabase Auth. Passwords are never stored in the browser."
                : "Passwords are checked for strength but never stored or sent to the API."}
            </AlertDescription>
          </Alert>

          <Button className="w-full" disabled={submitting} size="lg" type="submit">
            {submitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
