import type { ReactNode } from "react";

/**
 * The evidence page is read top-to-bottom by reviewers and assistive
 * technology, so each card is titled with a real heading rather than the
 * default `CardTitle` div.
 */
export function EvidenceCardTitle({ children }: { children: ReactNode }) {
  return <h2 className="font-heading text-base leading-snug font-medium">{children}</h2>;
}
