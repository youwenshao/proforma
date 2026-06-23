import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type BackActionProps = {
  href: string;
  label: string;
};

export function BackAction({ href, label }: BackActionProps) {
  return (
    <Button asChild variant="ghost">
      <Link href={href}>
        <ArrowLeft aria-hidden="true" />
        {label}
      </Link>
    </Button>
  );
}
