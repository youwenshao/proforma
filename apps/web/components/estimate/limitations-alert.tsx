"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTranslations } from "@/lib/i18n/locale-context";

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
  const t = useTranslations();

  return (
    <div className="space-y-3">
      <Alert>
        <AlertTitle>{t("notice.decisionSupportTitle")}</AlertTitle>
        <AlertDescription>
          {decisionSupportDisclaimer} {t("notice.decisionSupportPartner")}
        </AlertDescription>
      </Alert>
      <Alert>
        <AlertTitle>{t("notice.syntheticDataTitle")}</AlertTitle>
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
          <AlertTitle>{t("notice.legalGateTitle")}</AlertTitle>
          <AlertDescription>{t("notice.legalGateBody")}</AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
