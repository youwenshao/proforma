import Link from "next/link";
import { MatterIntakeForm } from "@/components/estimate/matter-intake-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTaxonomy } from "@/lib/api/taxonomy";

export default async function NewEstimatePage() {
  const taxonomy = await getTaxonomy();

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto max-w-5xl space-y-8">
        <Link className="text-sm text-muted-foreground underline-offset-4 hover:underline" href="/">
          Back to dashboard
        </Link>
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Matter intake
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Create pricing estimate</h1>
          <p className="max-w-3xl text-muted-foreground">
            Enter the matter parameters a pricing support user would package for
            partner review. No confidential free text is collected in feasibility mode.
          </p>
        </div>
        <Alert>
          <AlertTitle>Decision-support only</AlertTitle>
          <AlertDescription>
            This workflow uses synthetic feasibility data. Partner review remains
            required before any client-facing fee decision.
          </AlertDescription>
        </Alert>
        <Card>
          <CardHeader>
            <CardTitle>Structured matter facts</CardTitle>
          </CardHeader>
          <CardContent>
            <MatterIntakeForm taxonomy={taxonomy} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
