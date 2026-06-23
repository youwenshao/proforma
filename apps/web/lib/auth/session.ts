"use client";

import { useEffect, useState } from "react";

import {
  clearDemoSession,
  getDemoSession,
  saveDemoSession,
  validateDemoEmail,
  estimatePasswordStrength,
  type DemoSession,
  type PasswordStrength,
} from "@/lib/demo-auth";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseAuthEnabled } from "@/lib/supabase/config";

export type AppSession = {
  email: string;
  signedInAt: string;
  provider: "demo" | "supabase";
};

export function getAppSession(): AppSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (isSupabaseAuthEnabled()) {
    return null;
  }

  const demoSession = getDemoSession();
  if (!demoSession) {
    return null;
  }

  return {
    ...demoSession,
    provider: "demo",
  };
}

export function useAppSession() {
  const [session, setSession] = useState<AppSession | null>(null);

  useEffect(() => {
    let active = true;

    async function syncSession() {
      if (isSupabaseAuthEnabled()) {
        const supabase = createClient();
        const { data } = await supabase.auth.getSession();
        if (!active) {
          return;
        }

        if (data.session?.user.email) {
          setSession({
            email: data.session.user.email,
            signedInAt: data.session.user.last_sign_in_at ?? new Date().toISOString(),
            provider: "supabase",
          });
          return;
        }

        setSession(null);
        return;
      }

      const demoSession = getDemoSession();
      if (!active) {
        return;
      }

      setSession(
        demoSession
          ? {
              ...demoSession,
              provider: "demo",
            }
          : null,
      );
    }

    syncSession();

    if (isSupabaseAuthEnabled()) {
      const supabase = createClient();
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(() => {
        void syncSession();
      });

      return () => {
        active = false;
        subscription.unsubscribe();
      };
    }

    window.addEventListener("storage", syncSession);
    window.addEventListener("proforma-demo-session", syncSession);

    return () => {
      active = false;
      window.removeEventListener("storage", syncSession);
      window.removeEventListener("proforma-demo-session", syncSession);
    };
  }, []);

  return session;
}

export async function signInWithPassword(email: string, password: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }
}

export async function signUpWithPassword(email: string, password: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw error;
  }
}

export async function signOutAppSession() {
  if (isSupabaseAuthEnabled()) {
    const supabase = createClient();
    await supabase.auth.signOut();
    return;
  }

  clearDemoSession();
}

export function signInDemo(email: string) {
  saveDemoSession(email);
}

export { estimatePasswordStrength, validateDemoEmail };
export type { PasswordStrength };
