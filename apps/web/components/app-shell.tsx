"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Brain,
  FilePlus2,
  History,
  LogIn,
  LogOut,
  Menu,
  PanelTopClose,
} from "lucide-react";
import { useMemo } from "react";
import { estimatePasswordStrength, validateDemoEmail } from "@/lib/demo-auth";
import { signOutAppSession, useAppSession } from "@/lib/auth/session";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
  { href: "/estimate/new", icon: FilePlus2, label: "New estimate" },
  { href: "/results", icon: History, label: "Results" },
  { href: "/models", icon: Brain, label: "Model evidence" },
];

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const session = useAppSession();

  const userLabel = useMemo(() => {
    if (!session) {
      return null;
    }

    return session.email.split("@")[0];
  }, [session]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link aria-label="ProForma home" className="flex items-center gap-3" href="/">
            <span className="flex h-9 w-9 items-center justify-center">
              <Image
                alt="ProForma"
                className="h-7 w-7 object-contain dark:invert"
                height={24}
                src="/proforma-logo-light.png"
                width={24}
              />
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <Button
                  asChild
                  className={cn(pathname === item.href && "bg-accent text-accent-foreground")}
                  key={item.href}
                  variant="ghost"
                >
                  <Link href={item.href}>
                    <Icon aria-hidden="true" />
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            {session ? (
              <>
                <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground">
                  {userLabel}
                </span>
                <Button
                  onClick={() => {
                    void signOutAppSession();
                  }}
                  variant="outline"
                >
                  <LogOut aria-hidden="true" />
                  Sign out
                </Button>
              </>
            ) : (
              <Button asChild variant="outline">
                <Link href="/login">
                  <LogIn aria-hidden="true" />
                  Sign in
                </Link>
              </Button>
            )}
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button aria-label="Open navigation" className="md:hidden" size="icon" variant="outline">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <PanelTopClose className="h-4 w-4" />
                  Navigation
                </SheetTitle>
                <SheetDescription>Move between the main ProForma workflows.</SheetDescription>
              </SheetHeader>
              <nav aria-label="Mobile primary" className="grid gap-2 px-4">
                {navItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <SheetClose asChild key={item.href}>
                      <Button asChild className="justify-start" variant="ghost">
                        <Link href={item.href}>
                          <Icon aria-hidden="true" />
                          {item.label}
                        </Link>
                      </Button>
                    </SheetClose>
                  );
                })}
                <SheetClose asChild>
                  {session ? (
                    <Button
                      className="justify-start"
                      onClick={() => {
                        void signOutAppSession();
                      }}
                      variant="outline"
                    >
                      <LogOut aria-hidden="true" />
                      Sign out
                    </Button>
                  ) : (
                    <Button asChild className="justify-start" variant="outline">
                      <Link href="/login">
                        <LogIn aria-hidden="true" />
                        Sign in
                      </Link>
                    </Button>
                  )}
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
