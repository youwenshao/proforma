"use client";

import { LocalizedLink } from "@/components/localized-link";
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
import { signOutAppSession, useAppSession } from "@/lib/auth/session";
import { useTranslations } from "@/lib/i18n/locale-context";
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

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const session = useAppSession();
  const t = useTranslations();

  const navItems = useMemo(
    () => [
      { href: "/estimate/new", icon: FilePlus2, label: t("nav.newEstimate") },
      { href: "/results", icon: History, label: t("nav.results") },
      { href: "/models", icon: Brain, label: t("nav.modelEvidence") },
    ],
    [t],
  );

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
          <LocalizedLink aria-label={t("nav.proformaHome")} className="flex items-center gap-3" href="/">
            <span className="flex h-9 w-9 items-center justify-center">
              <Image
                alt="ProForma"
                className="h-7 w-7 object-contain dark:invert"
                height={24}
                src="/proforma-logo-light.png"
                width={24}
              />
            </span>
          </LocalizedLink>

          <nav aria-label={t("nav.primary")} className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <Button
                  asChild
                  className={cn(pathname === item.href && "bg-accent text-accent-foreground")}
                  key={item.href}
                  variant="ghost"
                >
                  <LocalizedLink href={item.href}>
                    <Icon aria-hidden="true" />
                    {item.label}
                  </LocalizedLink>
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
                  {t("nav.signOut")}
                </Button>
              </>
            ) : (
              <Button asChild variant="outline">
                <LocalizedLink href="/login">
                  <LogIn aria-hidden="true" />
                  {t("nav.signIn")}
                </LocalizedLink>
              </Button>
            )}
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button aria-label={t("nav.openNavigation")} className="md:hidden" size="icon" variant="outline">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <PanelTopClose className="h-4 w-4" />
                  {t("nav.navigation")}
                </SheetTitle>
                <SheetDescription>{t("nav.navigationDescription")}</SheetDescription>
              </SheetHeader>
              <nav aria-label={t("nav.mobilePrimary")} className="grid gap-2 px-4">
                {navItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <SheetClose asChild key={item.href}>
                      <Button asChild className="justify-start" variant="ghost">
                        <LocalizedLink href={item.href}>
                          <Icon aria-hidden="true" />
                          {item.label}
                        </LocalizedLink>
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
                      {t("nav.signOut")}
                    </Button>
                  ) : (
                    <Button asChild className="justify-start" variant="outline">
                      <LocalizedLink href="/login">
                        <LogIn aria-hidden="true" />
                        {t("nav.signIn")}
                      </LocalizedLink>
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
