import type { TranslationKey } from "./en";

export const zhHantMetadata = {
  status: "draft",
  requiresLegalProofreading: true,
} as const;

export const zhHantMessages = {
  "app.name": "ProForma HK",
  "dashboard.eyebrow": "可行性階段決策支援",
  "dashboard.summary":
    "為香港律師事務所提供雙語事項範圍界定、預測估算審閱、費用建議及範圍監察流程。",
  "dashboard.startEstimate": "開始估算",
  "dashboard.modelEvidence": "模型證據",
  "notice.syntheticData":
    "此介面使用 SYNTHETIC_MVP_V1 可行性合成數據，並不構成法律、監管或生產定價批准。",
  "notice.decisionSupport":
    "ProForma 僅提供決策支援；每項最終費用決定均由合夥人或獲授權律師作出。",
  "notice.legalGate":
    "匯集模型證據在法律審閱批准 PDPO、律師保密責任、匿名化及資料共享控制前，僅屬研究用途。",
  "language.label": "介面語言",
  "language.en": "英文",
  "language.zhHant": "繁體中文",
} as const satisfies Record<TranslationKey, string>;
