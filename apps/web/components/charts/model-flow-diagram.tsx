const steps = [
  {
    label: "Structured facts",
    text: "Matter type, jurisdiction, complexity, parties, documents, and billing model.",
  },
  {
    label: "Model version",
    text: "The current feasibility model applies synthetic-data patterns and calibration.",
  },
  {
    label: "Estimate range",
    text: "Users see low, typical, and high outcomes instead of a single false-precision number.",
  },
  {
    label: "Partner decision",
    text: "A responsible partner reviews the evidence before any client-facing price.",
  },
];

export function ModelFlowDiagram() {
  return (
    <ol className="grid gap-3 md:grid-cols-4">
      {steps.map((step, index) => (
        <li
          className="relative rounded-xl border border-border bg-muted/40 p-4 text-sm"
          key={step.label}
        >
          <span className="mb-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            {index + 1}
          </span>
          <p className="font-medium">{step.label}</p>
          <p className="mt-2 text-muted-foreground">{step.text}</p>
        </li>
      ))}
    </ol>
  );
}
