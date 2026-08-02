export const pitchContent = {
  title: {
    eyebrow:
      "Young Solicitors' Group Think Tank 2026 · Hong Kong Law Society",
    headline: "ProForma: price legal work with evidence, not guesswork.",
    productOneLiner:
      "ProForma is software that helps Hong Kong law firms quote fixed and capped fees using structured matter inputs and comparable-matter analysis — not hourly guesswork.",
    description:
      "Presented by Team ProForma",
    cue: "Scroll to begin",
  },

  problem: {
    eyebrow: "Act I · The problem",
    framing:
      "Hourly billing still dominates legal markets worldwide. Fixed and capped fees — alternative fee arrangements — remain rare. Hong Kong firms face the same pricing gap, plus cross-border price pressure from the Greater Bay Area.",
    stats: [
      {
        value: 90,
        decimals: 0,
        prefix: "~",
        suffix: "%",
        heading:
          "of US legal spend still flows through hourly-rate arrangements — a global baseline Hong Kong firms share.",
        source: "Thomson Reuters, State of the US Legal Market 2025",
      },
      {
        value: 81.8,
        decimals: 1,
        prefix: "",
        suffix: "%",
        heading:
          "of surveyed mainland China enterprises cite high fees as a reason not to engage Hong Kong lawyers — price sensitivity at the GBA border.",
        source:
          "Hong Kong Legislative Council GBA survey, paper CB(2)1184/24-25(01)",
      },
      {
        value: 20,
        decimals: 0,
        prefix: "~",
        suffix: "%",
        heading:
          "is roughly where alternative fee arrangements (fixed fees, capped fees, and similar non-hourly models) have stalled globally — about one matter in five.",
        source: "Thomson Reuters, Legal Department Operations Index 2024",
      },
    ],
  },

  statement: {
    eyebrow: "Act II · The core problem",
    lead: "Hong Kong lawyers are not unwilling to offer fixed fees. They lack anonymized billing history and matter benchmarks they can query without exposing client confidences. Clients want price certainty. Firms want to provide it. Neither side can price fixed fees without guessing — or taking on underpricing risk.",
    accent:
      "That is a market failure — and the problem this Think Tank proposal sets out to solve.",
  },

  quotePack: {
    eyebrow: "Act III · The solution",
    heading:
      "A partner-ready quote pack built from structured inputs and comparables.",
    subheading:
      "A quote pack is a single-screen report: estimated fee ranges, a recommended fee, a list of supporting evidence, and flags for partner review. ProForma assembles it from structured matter facts — watch a sample build below.",
    card: {
      reportLabel: "Sample output (illustrative)",
      title: "Quote substantiation pack",
      badge: "Partner draft — not client-ready",
      matterLabel: "Matter summary",
      matterValue: "Commercial litigation, Hong Kong seated",
      comparables: "82 comparable matters (same type & jurisdiction)",
      rangesHeading: "Estimated total fee",
      ranges: [
        { label: "Low", value: 410, display: "HK$410k", fill: 0.46 },
        { label: "Typical", value: 566, display: "HK$566k", fill: 0.64 },
        { label: "High", value: 890, display: "HK$890k", fill: 1 },
      ],
      feeLabel: "Recommended fee",
      feeValue: 620,
      feeDescription:
        "Sits above the typical estimate to leave headroom for scope growth under a capped-fee arrangement. Includes variance notes for partner review.",
      evidence: [
        "82 comparable matters (simulated benchmark pool)",
        "Built from 4,000 simulated HK matters — not live firm billing data",
        "Scope-risk signal: medium — moderate chance the matter grows beyond agreed scope",
      ],
      gaugeLabel: "Scope-risk signal",
      gaugeValue: "Medium",
      footerNote:
        "Partner review required before client sharing. Synthetic sample data only; model version and limitations noted in the full report.",
    },
  },

  workflow: {
    eyebrow: "Act IV · The workflow",
    heading: "Four steps, one decision-maker: the partner.",
    steps: [
      {
        index: "01",
        title: "Matter parameters",
        description:
          "Structured fields instead of confidential free text — to protect client confidences and keep inputs consistent for modeling. Matter type, jurisdiction, complexity, parties, document volume, billing model.",
        chips: [
          "English & Traditional Chinese",
          "Structured intake",
          "No free text — privacy",
        ],
      },
      {
        index: "02",
        title: "Predictive analysis",
        description:
          "Estimated cost and duration ranges by work phase (e.g. pleadings, discovery, trial), with uncertainty made explicit — every figure traceable to a dataset, model input, and model version.",
        chips: ["Low / typical / high", "Phase breakdown", "Full audit trail"],
      },
      {
        index: "03",
        title: "Fee recommendation",
        description:
          "Fixed-fee and capped-fee suggestions calibrated to firm risk settings the partner can adjust. The partner always makes the final pricing decision.",
        chips: ["Fixed or capped", "Adjustable risk settings", "Partner decides"],
      },
      {
        index: "04",
        title: "Scope monitoring",
        description:
          "During the matter, actual phase effort is compared with predictions. Scope creep — unplanned work beyond the agreed scope — triggers variance alerts before it erodes margin. Reforecasting updates estimates as the matter evolves.",
        chips: [
          "Predicted vs actual",
          "Scope-creep alerts",
          "Updated forecasts",
        ],
      },
    ],
  },

  evidence: {
    eyebrow: "Act V · The evidence",
    heading: "We stress-tested the idea before pitching it.",
    subheading:
      "Because real billing data is unavailable in this MVP, we built a reproducible generator of computer-generated Hong Kong matters — synthetic data calibrated to realistic patterns.",
    leadDefinition:
      "Synthetic data means simulated matters, not live firm records. Any-stage overrun means predicted effort was exceeded at least once during a matter. Material scope creep is stricter: effort exceeded prediction by a meaningful margin or scope changed materially.",
    stats: [
      {
        value: 4000,
        decimals: 0,
        suffix: "",
        label: "synthetic HK legal matters",
        detail:
          "4,000 simulated matters · validation rules applied · reproducible test run",
      },
      {
        value: 51.45,
        decimals: 2,
        suffix: "%",
        label: "material scope-creep rate",
        detail:
          "Matters where effort exceeded prediction by a meaningful margin or scope changed materially",
      },
      {
        value: 70.48,
        decimals: 2,
        suffix: "%",
        label: "any-overrun rate",
        detail: "Matters where predicted effort was exceeded at least once",
      },
    ],
    chart: {
      title: "Synthetic cost-outcome distribution (illustrative)",
      caption:
        "The curve shows shape only — the percentages on the markers come from the stats above, not from reading this curve.",
      relationship:
        "Material scope creep is a stricter subset of any-stage overrun, so it has the lower rate and sits further right on the severity axis.",
      axes: {
        y: "Relative frequency",
        x: "Cost outcome severity",
        xLeft: "On plan",
        xRight: "Severe overrun",
      },
      markers: {
        anyOverrun: {
          label: "Any-stage overrun",
          detail: "of synthetic matters exceeded predicted effort",
        },
        materialCreep: {
          label: "Material scope creep",
          detail: "of synthetic matters hit the stricter threshold",
        },
      },
      legend: {
        curve: "Illustrative distribution shape",
        tailBroad: "Share beyond any-overrun threshold",
        tailStrict: "Share beyond material-creep threshold",
      },
      badge: "Illustrative shape only",
    },
    empiricalChart: {
      badge: "Real data — computed from the dataset",
      title: "Actual distribution: cost vs. quoted fee",
      caption:
        "Every bar below is a real count from the 3,588 non-ongoing synthetic matters, grouped into 5-point-percentage bins of actual cost versus quoted fee. Nothing here is hand-drawn.",
      insight:
        "Matters bunch up sharply just above the quote line rather than spreading smoothly — evidence that the synthetic quoting model calibrates close to actual cost instead of padding estimates, which is what makes the overrun alerts meaningful to test against.",
      axes: {
        y: "Share of matters",
        x: "Actual cost vs. quoted fee",
      },
      thresholds: {
        anyOverrun: "0% · any overrun begins",
        materialCreep: "5% · material creep begins",
      },
      legend: {
        onPlan: "At or under quote",
        anyOverrun: "Any overrun (0–5%)",
        materialCreep: "Material scope creep (>5%)",
      },
      sourceNote:
        "output/proforma_hk_synthetic_mvp.csv · SYNTHETIC_MVP_V1 · seed 20260622 · n = 3,588 non-ongoing matters",
    },
    disclaimerTitle: "Synthetic data, not production pricing",
    disclaimer:
      "This demonstrates that alerting and guardrails work on simulated matters — not that ProForma is accurate on real firm data. Production use requires anonymized real matter data, legal review, and partner-firm pilots.",
  },

  ask: {
    guardrailsEyebrow: "Act VI · The guardrails",
    guardrailsHeading: "What ProForma is not.",
    guardrails: [
      {
        title: "Not legal advice",
        description:
          "It provides data analysis for professional review — never advice to clients or lawyers.",
      },
      {
        title: "Not an autonomous fee-setter",
        description:
          "The partner always sets the fee. Every recommendation is decision support, nothing more.",
      },
      {
        title: "Not a document generator",
        description:
          "No auto-generated retainer letters. Any template is a drafting aid a solicitor must review and approve.",
      },
      {
        title: "Not for contentious fees or arbitration ORFSA",
        description:
          "Outcome Related Fee Structures for Arbitration (ORFSA) and fees for litigation costs assessment and related disputes are out of scope pending separate regulatory consultation.",
      },
    ],
    askEyebrow: "Act VII · The ask",
    askHeading:
      "What Sentimento Technologies seeks from the Hong Kong Law Society.",
    askIntro:
      "This proposal was prepared for the Young Solicitors' Group Think Tank 2026. We are asking the Law Society to help move ProForma from synthetic feasibility to real-world validation.",
    asks: [
      {
        index: "01",
        title: "Data partnership",
        description:
          "Access to anonymized billing benchmarks, or facilitated data-sharing with willing firms, to move beyond synthetic data.",
      },
      {
        index: "02",
        title: "Regulatory guidance",
        description:
          "Written confirmation of the framework applicable to AI-assisted pricing tools, disclaimers, and solicitor oversight requirements.",
      },
      {
        index: "03",
        title: "Pilot program",
        description:
          "A facilitated pilot with a small group of Hong Kong firms to validate estimates against real matters.",
      },
    ],
    ctaHeading: "See the interactive demo.",
    ctaDescription:
      "The feasibility build is a working demo on synthetic sample data: structured intake, predictive ranges, fee guardrails, and model evidence — not production pricing.",
    ctaPrimary: "Start an estimate",
    ctaSecondary: "Model evidence",
    closing:
      "ProForma HK · Think Tank proposal — not a Law Society endorsement",
  },
} as const;
