"use client";

import { LocalizedLink } from "@/components/localized-link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type BackActionProps = {
  href: string;
  label: string;
};

export function BackAction({ href, label }: BackActionProps) {
  return (
    <Button asChild variant="ghost">
      <LocalizedLink href={href}>
        <ArrowLeft aria-hidden="true" />
        {label}
      </LocalizedLink>
    </Button>
  );
}
