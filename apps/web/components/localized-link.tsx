"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useLocalizedHref } from "@/lib/i18n/locale-context";

type LocalizedLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

export function LocalizedLink({ href, ...props }: LocalizedLinkProps) {
  const localizedHref = useLocalizedHref(href);

  return <Link href={localizedHref} {...props} />;
}
