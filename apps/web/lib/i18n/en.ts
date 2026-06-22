export const enMessages = {
  "app.name": "ProForma HK",
  "dashboard.eyebrow": "Feasibility-stage decision support",
  "dashboard.summary":
    "Bilingual matter scoping, predictive estimate review, fee recommendation, and scope-monitoring workflows for Hong Kong law firms.",
  "dashboard.startEstimate": "Start estimate",
  "dashboard.modelEvidence": "Model evidence",
  "notice.syntheticData":
    "This frontend uses synthetic data from SYNTHETIC_MVP_V1 feasibility data and does not establish legal, regulatory, or production pricing approval.",
  "notice.decisionSupport":
    "ProForma is decision-support software only; a partner or authorized solicitor makes every final fee decision.",
  "notice.legalGate":
    "Pooled model evidence is research-only until legal review approves PDPO, solicitor confidentiality, anonymization, and data-sharing controls.",
  "language.label": "Interface language",
  "language.en": "English",
  "language.zhHant": "Traditional Chinese",
} as const;

export type TranslationKey = keyof typeof enMessages;
