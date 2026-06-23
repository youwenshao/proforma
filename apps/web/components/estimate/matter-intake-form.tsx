"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { createEstimate } from "@/lib/api/estimates";
import type { Taxonomy } from "@/lib/api/types";
import { getDemoSession } from "@/lib/demo-auth";
import {
  DISSOLVE_DURATION_MS,
  getRandomProcessingDelayMs,
  markEstimateForReveal,
  sleep,
} from "@/lib/estimate-processing";
import { saveEstimateForUser, summarizeMatterInput } from "@/lib/estimate-history";
import {
  type MatterFormValues,
  validateMatterInput,
} from "@/lib/validation/matter-input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  RiskToleranceSelector,
  toApiRiskTolerance,
} from "./risk-tolerance-selector";

const defaultValues: MatterFormValues = {
  matter_type: "",
  matter_subtype: "",
  jurisdiction: "",
  firm_tier: "",
  client_type: "",
  deal_value_hkd: "",
  document_volume: "",
  complexity_score: "3",
  party_count: "",
  cross_border_flag: false,
  billing_model: "",
  risk_tolerance: "Medium",
};

type MatterIntakeFormProps = {
  onDissolveComplete?: () => void;
  onProcessingEnd?: () => void;
  onProcessingStart?: () => void;
  taxonomy: Taxonomy;
};

export function MatterIntakeForm({
  onDissolveComplete,
  onProcessingEnd,
  onProcessingStart,
  taxonomy,
}: MatterIntakeFormProps) {
  const router = useRouter();
  const [values, setValues] = useState(defaultValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtypeOptions = useMemo(() => {
    if (!values.matter_type) {
      return [];
    }

    return taxonomy.subtypes_by_matter_type[
      values.matter_type as keyof Taxonomy["subtypes_by_matter_type"]
    ] ?? [];
  }, [taxonomy.subtypes_by_matter_type, values.matter_type]);

  function updateField(
    field: keyof MatterFormValues,
    value: MatterFormValues[keyof MatterFormValues],
  ) {
    setValues((current) => {
      const next: MatterFormValues = {
        ...current,
        [field]: value,
        ...(field === "matter_type" ? { matter_subtype: "" } : {}),
      };

      if (field === "jurisdiction" && typeof value === "string") {
        next.cross_border_flag = value !== "HK Only" && value !== "";
      }

      return next;
    });
    setErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, type, value } = event.target;
    updateField(
      name as keyof MatterFormValues,
      type === "checkbox" ? (event.target as HTMLInputElement).checked : value,
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    const result = validateMatterInput(values, taxonomy);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }

    setIsSubmitting(true);
    onProcessingStart?.();

    try {
      await sleep(DISSOLVE_DURATION_MS);
      onDissolveComplete?.();

      const [estimate] = await Promise.all([
        createEstimate({
          matter_input: result.value,
          model_strategy: "synthetic_baseline",
          risk_tolerance: toApiRiskTolerance(values.risk_tolerance),
          tenant_id: "synthetic-demo-tenant",
        }),
        sleep(getRandomProcessingDelayMs()),
      ]);

      const session = getDemoSession();
      if (session) {
        saveEstimateForUser(session.email, {
          createdAt: new Date().toISOString(),
          estimate,
          matterSummary: summarizeMatterInput(result.value),
          modelStrategy: "synthetic_baseline",
        });
      }

      markEstimateForReveal(estimate.estimate_id);
      router.push(`/estimate/${estimate.estimate_id}`);
    } catch {
      onProcessingEnd?.();
      setSubmitError("Unable to create estimate. Confirm the API is available or use mocked mode.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {submitError ? (
        <Alert variant="destructive">
          <AlertTitle>Estimate request failed</AlertTitle>
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <SelectField
          error={errors.matter_type}
          label="Matter type"
          name="matter_type"
          onChange={handleInputChange}
          options={taxonomy.matter_types}
          value={values.matter_type}
        />
        <SelectField
          error={errors.matter_subtype}
          label="Matter subtype"
          name="matter_subtype"
          onChange={handleInputChange}
          options={subtypeOptions}
          value={values.matter_subtype}
        />
        <SelectField
          error={errors.jurisdiction}
          label="Jurisdiction"
          name="jurisdiction"
          onChange={handleInputChange}
          options={taxonomy.jurisdictions}
          value={values.jurisdiction}
        />
        <SelectField
          error={errors.firm_tier}
          label="Firm tier"
          name="firm_tier"
          onChange={handleInputChange}
          options={taxonomy.firm_tiers}
          value={values.firm_tier}
        />
        <SelectField
          error={errors.client_type}
          label="Client type"
          name="client_type"
          onChange={handleInputChange}
          options={taxonomy.client_types}
          value={values.client_type}
        />
        <SelectField
          error={errors.billing_model}
          label="Billing model"
          name="billing_model"
          onChange={handleInputChange}
          options={taxonomy.billing_models}
          value={values.billing_model}
        />
        <NumberField
          label="Deal value HKD (optional)"
          name="deal_value_hkd"
          onChange={handleInputChange}
          value={values.deal_value_hkd}
        />
        <NumberField
          error={errors.document_volume}
          label="Document volume"
          name="document_volume"
          onChange={handleInputChange}
          value={values.document_volume}
        />
        <NumberField
          error={errors.complexity_score}
          label="Complexity score"
          max={5}
          min={1}
          name="complexity_score"
          onChange={handleInputChange}
          value={values.complexity_score}
        />
        <NumberField
          error={errors.party_count}
          label="Party count"
          name="party_count"
          onChange={handleInputChange}
          value={values.party_count}
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            checked={values.cross_border_flag}
            name="cross_border_flag"
            onChange={handleInputChange}
            type="checkbox"
          />
          Cross-border matter
        </label>
        {errors.cross_border_flag ? (
          <p className="text-sm text-destructive">{errors.cross_border_flag}</p>
        ) : null}
      </div>

      <RiskToleranceSelector
        onChange={(riskTolerance) => updateField("risk_tolerance", riskTolerance)}
        value={values.risk_tolerance}
      />

      <Button disabled={isSubmitting} size="lg" type="submit">
        {isSubmitting ? "Processing…" : "Create estimate"}
      </Button>
    </form>
  );
}

type SelectFieldProps = {
  error?: string;
  label: string;
  name: keyof MatterFormValues;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  options: readonly string[];
  value: string;
};

function SelectField({ error, label, name, onChange, options, value }: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <div className="relative">
        <select
          className="h-10 w-full appearance-none rounded-lg border border-input bg-background px-3 text-sm"
          id={name}
          name={name}
          onChange={onChange}
          value={value}
        >
          <option value="">Select {label.toLowerCase()}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
        />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}

type NumberFieldProps = {
  error?: string;
  label: string;
  max?: number;
  min?: number;
  name: keyof MatterFormValues;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  value: string;
};

function NumberField({ error, label, max, min = 0, name, onChange, value }: NumberFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        max={max}
        min={min}
        name={name}
        onChange={onChange}
        type="number"
        value={value}
      />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
