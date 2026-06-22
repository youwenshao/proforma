import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type LimitationsAlertProps = {
  decisionSupportDisclaimer: string;
  limitations: string[];
  showLegalGate?: boolean;
};

export function LimitationsAlert({
  decisionSupportDisclaimer,
  limitations,
  showLegalGate = false,
}: LimitationsAlertProps) {
  return (
    <div className="space-y-3">
      <Alert>
        <AlertTitle>Decision-support only</AlertTitle>
        <AlertDescription>
          {decisionSupportDisclaimer} Partner final decision required before client use.
        </AlertDescription>
      </Alert>
      <Alert>
        <AlertTitle>Synthetic-data limitation</AlertTitle>
        <AlertDescription>
          <ul className="list-disc space-y-1 pl-5">
            {limitations.map((limitation) => (
              <li key={limitation}>{limitation}</li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>
      {showLegalGate ? (
        <Alert variant="destructive">
          <AlertTitle>Legal-gate notice</AlertTitle>
          <AlertDescription>
            Pooled model evidence remains research-only until legal review
            approves PDPO, solicitor confidentiality, anonymization, and data-sharing controls.
          </AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
