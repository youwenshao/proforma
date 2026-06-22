"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import type { ScopeUpdateResponse, StageEstimate } from "@/lib/api/types";
import { postScopeUpdate } from "@/lib/api/scope-monitoring";
import { formatNumber } from "@/lib/format";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type StageUpdateFormProps = {
  estimateId: string;
  stages: StageEstimate[];
};

const initialValues = {
  actual_associate_hours: "",
  actual_cost_hkd: "",
  actual_partner_hours: "",
  stage_name: "",
};

export function StageUpdateForm({ estimateId, stages }: StageUpdateFormProps) {
  const [values, setValues] = useState(initialValues);
  const [result, setResult] = useState<ScopeUpdateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setValues((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setResult(null);
    setIsSubmitting(true);

    try {
      const update = await postScopeUpdate(estimateId, {
        actual_associate_hours: Number(values.actual_associate_hours),
        actual_cost_hkd: Number(values.actual_cost_hkd),
        actual_partner_hours: Number(values.actual_partner_hours),
        stage_name: values.stage_name,
      });
      setResult(update);
    } catch {
      setError("Unable to post stage update.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="stage_name">Stage name</Label>
          <select
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
            id="stage_name"
            name="stage_name"
            onChange={handleChange}
            value={values.stage_name}
          >
            <option value="">Select stage</option>
            {stages.map((stage) => (
              <option key={stage.stage_name} value={stage.stage_name}>
                {stage.stage_name}
              </option>
            ))}
          </select>
        </div>
        <NumberField
          label="Actual partner hours"
          name="actual_partner_hours"
          onChange={handleChange}
          value={values.actual_partner_hours}
        />
        <NumberField
          label="Actual associate hours"
          name="actual_associate_hours"
          onChange={handleChange}
          value={values.actual_associate_hours}
        />
        <NumberField
          label="Actual cost"
          name="actual_cost_hkd"
          onChange={handleChange}
          value={values.actual_cost_hkd}
        />
      </div>

      <p className="text-sm text-muted-foreground">
        Confidential free-text notes are disabled in feasibility mode.
      </p>

      <Button disabled={isSubmitting} type="submit">
        {isSubmitting ? "Posting update..." : "Post stage update"}
      </Button>

      {result ? (
        <Alert role="status">
          <AlertTitle>Stage update posted</AlertTitle>
          <AlertDescription>
            {result.stage_name}: {formatNumber(result.variance_pct, 1)}% variance.{" "}
            {result.recommended_review_action}
          </AlertDescription>
        </Alert>
      ) : null}

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Scope update failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
    </form>
  );
}

type NumberFieldProps = {
  label: string;
  name: keyof typeof initialValues;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  value: string;
};

function NumberField({ label, name, onChange, value }: NumberFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} min={0} name={name} onChange={onChange} type="number" value={value} />
    </div>
  );
}
