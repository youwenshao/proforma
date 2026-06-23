"use client";

import type { ChangeEvent } from "react";
import { useTranslations } from "@/lib/i18n/locale-context";
import type { TranslationKey } from "@/lib/i18n/en";

const optionKeys = [
  {
    apiValue: "conservative",
    formValue: "Low",
    labelKey: "riskTolerance.conservative" as TranslationKey,
    descriptionKey: "riskTolerance.conservativeDesc" as TranslationKey,
  },
  {
    apiValue: "balanced",
    formValue: "Medium",
    labelKey: "riskTolerance.balanced" as TranslationKey,
    descriptionKey: "riskTolerance.balancedDesc" as TranslationKey,
  },
  {
    apiValue: "aggressive",
    formValue: "High",
    labelKey: "riskTolerance.aggressive" as TranslationKey,
    descriptionKey: "riskTolerance.aggressiveDesc" as TranslationKey,
  },
] as const;

export type FormRiskTolerance = (typeof optionKeys)[number]["formValue"];
export type ApiRiskTolerance = (typeof optionKeys)[number]["apiValue"];

type RiskToleranceSelectorProps = {
  value: FormRiskTolerance;
  onChange: (formValue: FormRiskTolerance) => void;
};

export function toApiRiskTolerance(value: FormRiskTolerance): ApiRiskTolerance {
  return optionKeys.find((option) => option.formValue === value)?.apiValue ?? "balanced";
}

export function RiskToleranceSelector({ value, onChange }: RiskToleranceSelectorProps) {
  const t = useTranslations();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.value as FormRiskTolerance);
  }

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium">{t("riskTolerance.label")}</legend>
      <div className="grid gap-3 md:grid-cols-3">
        {optionKeys.map((option) => (
          <label
            className="rounded-lg border border-border p-3 text-sm has-[:checked]:border-primary has-[:checked]:bg-muted"
            key={option.apiValue}
          >
            <input
              checked={value === option.formValue}
              className="mr-2"
              name="risk_tolerance"
              onChange={handleChange}
              type="radio"
              value={option.formValue}
            />
            <span className="font-medium">{t(option.labelKey)}</span>
            <span className="mt-1 block text-muted-foreground">{t(option.descriptionKey)}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
