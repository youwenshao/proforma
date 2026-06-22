import type { SimilarMatterEvidence } from "@/lib/api/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SimilarMatterEvidenceCardProps = {
  evidence: SimilarMatterEvidence;
};

export function SimilarMatterEvidenceCard({ evidence }: SimilarMatterEvidenceCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Similar matter evidence</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{evidence.status}</Badge>
          <Badge variant="outline">{evidence.legal_gate_status}</Badge>
          <Badge variant="outline">
            Retrieval {evidence.retrieval_enabled ? "enabled" : "disabled"}
          </Badge>
        </div>
        <p className="text-muted-foreground">{evidence.description}</p>
        <dl className="grid gap-3 md:grid-cols-2">
          <div>
            <dt className="font-medium">Allowed inputs after approval</dt>
            <dd className="text-muted-foreground">{evidence.allowed_inputs.join(", ")}</dd>
          </div>
          <div>
            <dt className="font-medium">Excluded inputs</dt>
            <dd className="text-muted-foreground">{evidence.excluded_inputs.join(", ")}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
