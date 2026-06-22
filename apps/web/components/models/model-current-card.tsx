import type { ModelCurrent } from "@/lib/api/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ModelCurrentCardProps = {
  current: ModelCurrent;
};

export function ModelCurrentCard({ current }: ModelCurrentCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current model</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex flex-wrap gap-2">
          <Badge>{current.status}</Badge>
          {current.synthetic_data ? <Badge variant="outline">Synthetic data</Badge> : null}
        </div>
        <dl className="grid gap-3 md:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Model version</dt>
            <dd className="font-medium">{current.model_version}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Feature version</dt>
            <dd className="font-medium">{current.feature_version}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Dataset lineage</dt>
            <dd className="font-medium">{current.dataset_lineage.dataset_id}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Source marker</dt>
            <dd className="font-medium">{current.dataset_lineage.source_marker}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
