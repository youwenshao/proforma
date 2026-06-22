import { Badge } from "@/components/ui/badge";

type VarianceBadgeProps = {
  variancePct: number;
};

export function varianceStatus(variancePct: number) {
  const absoluteVariance = Math.abs(variancePct);
  if (absoluteVariance > 15) {
    return "Critical";
  }
  if (absoluteVariance > 5) {
    return "Warning";
  }
  return "On track";
}

export function VarianceBadge({ variancePct }: VarianceBadgeProps) {
  const status = varianceStatus(variancePct);
  const variant = status === "Critical" ? "destructive" : "outline";

  return <Badge variant={variant}>{status}</Badge>;
}
