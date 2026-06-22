import type { ChangeEvent } from "react";

const options = [
  {
    apiValue: "conservative",
    formValue: "Low",
    label: "Conservative",
    description: "Favor wider downside protection and partner review.",
  },
  {
    apiValue: "balanced",
    formValue: "Medium",
    label: "Balanced",
    description: "Use the central interval for a feasibility recommendation.",
  },
  {
    apiValue: "aggressive",
    formValue: "High",
    label: "Aggressive",
    description: "Accept more downside risk for price competitiveness.",
  },
] as const;

export type FormRiskTolerance = (typeof options)[number]["formValue"];
export type ApiRiskTolerance = (typeof options)[number]["apiValue"];

type RiskToleranceSelectorProps = {
  value: FormRiskTolerance;
  onChange: (formValue: FormRiskTolerance) => void;
};

export function toApiRiskTolerance(value: FormRiskTolerance): ApiRiskTolerance {
  return options.find((option) => option.formValue === value)?.apiValue ?? "balanced";
}

export function RiskToleranceSelector({ value, onChange }: RiskToleranceSelectorProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.value as FormRiskTolerance);
  }

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium">Risk tolerance</legend>
      <div className="grid gap-3 md:grid-cols-3">
        {options.map((option) => (
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
            <span className="font-medium">{option.label}</span>
            <span className="mt-1 block text-muted-foreground">{option.description}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
