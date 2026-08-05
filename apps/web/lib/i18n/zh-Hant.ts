import type { TranslationKey } from "./en";

export const zhHantMetadata = {
  status: "draft",
  requiresLegalProofreading: true,
} as const;

export const zhHantMessages = {
  "app.name": "ProForma HK",
  "app.pageTitle": "ProForma HK",
  "app.description": "為香港律師事務所提供雙語可行性階段事項定價決策支援。",

  "nav.newEstimate": "新增估算",
  "nav.results": "結果",
  "nav.modelEvidence": "模型證據",
  "nav.signIn": "登入",
  "nav.signOut": "登出",
  "nav.home": "首頁",
  "nav.primary": "主要導覽",
  "nav.mobilePrimary": "行動版主要導覽",
  "nav.openNavigation": "開啟導覽",
  "nav.navigation": "導覽",
  "nav.navigationDescription": "在 ProForma 主要工作流程之間切換。",
  "nav.proformaHome": "ProForma 首頁",
  "nav.new": "新增",
  "nav.estimate": "估算",
  "footer.tagline": "為香港法律團隊提供可行性階段定價情報。",
  "footer.disclaimer": "此示範版本不構成法律、監管或面向客戶的費用決定批准。",

  "language.label": "介面語言",
  "language.en": "英文",
  "language.zhHant": "繁體中文",

  "common.notAvailable": "無法提供",
  "common.noData": "尚無資料",
  "common.processing": "處理中…",
  "common.days": "天",
  "common.monitoring": "範圍監察",
  "common.onTrack": "符合預期",
  "common.warning": "警告",
  "common.critical": "嚴重",
  "common.useSuggestion": "使用 {suggestion}",

  "home.hero.eyebrow": "報價前定價情報",
  "home.hero.title": "以證據定價，而非憑空估算。",
  "home.hero.description":
    "ProForma 將結構化事項資料轉化為可審閱的成本區間、費用護欄、證據摘要及範圍風險信號，供香港法律團隊使用。",
  "home.hero.startEstimate": "開始估算",
  "home.hero.modelEvidence": "模型證據",
  "home.hero.syntheticAlertTitle": "合成數據，非生產定價",
  "home.hero.syntheticAlertDescription":
    "此示範使用 SYNTHETIC_MVP_V1 可行性數據說明工作流程，不構成法律、監管或面向客戶的費用決定批准。",

  "home.matterFacts.title": "事項資料",
  "home.matterFacts.description": "僅收集定價審閱所需的結構化資料。",
  "home.matterFacts.body": "類型、司法管轄區、複雜度、當事人、文件數量及計費模式。",
  "home.matterFacts.cta": "開始估算",

  "home.predictionResults.title": "預測結果",
  "home.predictionResults.description": "一目了然地比較低、中及高預估結果。",
  "home.predictionResults.body": "示範登入後，可從結果頁面查看已儲存的預測。",
  "home.predictionResults.cta": "查看已儲存結果",

  "home.modelEvidence.title": "模型證據",
  "home.modelEvidence.description": "了解底層模型、數據集及限制。",
  "home.modelEvidence.body": "圖表說明誤差模式及法律門檻，避免過量原始指標。",
  "home.modelEvidence.cta": "模型證據",

  "dashboard.eyebrow": "可行性階段決策支援",
  "dashboard.summary":
    "為香港律師事務所提供雙語事項範圍界定、預測估算審閱、費用建議及範圍監察流程。",
  "dashboard.startEstimate": "開始估算",
  "dashboard.modelEvidence": "模型證據",
  "dashboard.savedResults": "已儲存結果",
  "dashboard.savedResultsSignedIn": "此瀏覽器的本地記錄：{email}。",
  "dashboard.savedResultsSignedOut": "登入後可在此瀏覽器保留預測清單。",
  "dashboard.savedResultsCount": "此瀏覽器可查看先前建立的預測。",
  "dashboard.viewSavedResults": "查看已儲存結果",
  "dashboard.averageGrowthRisk": "平均範圍增長風險",
  "dashboard.averageGrowthRiskDescription": "以淺白語言呈現的範圍增長信號。",
  "dashboard.averageGrowthRiskBody": "工作超出原有假設而擴大的可能性。",
  "dashboard.modelStatus": "模型狀態",
  "dashboard.modelStatusDescription": "合成可行性模型。",
  "dashboard.modelStatusReady": "就緒",
  "dashboard.modelStatusBody": "證據可供查閱，但正式使用仍需審核。",
  "dashboard.mostRecent": "最近一項預測",
  "dashboard.mostRecentDescription": "若有已儲存估算，可由此快速返回。",
  "dashboard.typicalCost": "典型成本 {amount}",
  "dashboard.openResult": "開啟結果",
  "dashboard.createPrediction": "建立預測後，最近結果將顯示於此。",

  "auth.demoAccess": "示範存取",
  "auth.pickUp": "從上次中斷處繼續。",
  "auth.pickUpDescription":
    "已儲存報告保留於此瀏覽器。登入後可重新開啟，並在準備分享或審閱時匯出副本。",
  "auth.savedEstimates": "已儲存估算",
  "auth.reportDrafts": "報告草稿",
  "auth.evidenceNotes": "證據摘要",
  "auth.signInDemo": "登入示範",
  "auth.signInDescription": "任何電郵地址均可使用，工作階段僅保留於此瀏覽器。",
  "auth.signInDescriptionSupabase":
    "使用 Supabase 帳戶登入，首次登入時將自動註冊新用戶。",
  "auth.email": "電郵",
  "auth.password": "密碼",
  "auth.passwordStrength": "密碼強度",
  "auth.passwordWeak": "弱",
  "auth.passwordFair": "一般",
  "auth.passwordGood": "良好",
  "auth.passwordStrong": "強",
  "auth.checkEmail": "請檢查電郵地址",
  "auth.hostedAuth": "託管驗證",
  "auth.demoLoginOnly": "僅限示範登入",
  "auth.hostedAuthDescription":
    "憑證由 Supabase Auth 驗證，密碼不會儲存於瀏覽器。",
  "auth.demoLoginDescription": "密碼僅作強度檢查，不會儲存或傳送至 API。",
  "auth.signingIn": "登入中…",
  "auth.signIn": "登入",
  "auth.passwordMinLength": "密碼至少需要 8 個字元。",
  "auth.supabaseSignInFailed": "無法透過 Supabase 登入。",

  "validation.matterTypeRequired": "請選擇事項類型。",
  "validation.matterSubtypeRequired": "請選擇事項子類型。",
  "validation.jurisdictionRequired": "請選擇司法管轄區。",
  "validation.firmTierRequired": "請選擇事務所級別。",
  "validation.clientTypeRequired": "請選擇客戶類型。",
  "validation.billingModelRequired": "請選擇計費模式。",
  "validation.documentVolumePositive": "文件數量必須為正數。",
  "validation.partyCountPositive": "當事人數量必須為正數。",
  "validation.complexityScoreRange": "複雜度評分必須介乎 1 至 5。",
  "validation.crossBorderJurisdiction": "跨境事項須選擇跨境司法管轄區。",
  "validation.crossBorderRequired": "此司法管轄區須將事項標記為跨境。",
  "validation.matterSubtypeMismatch": "事項子類型須與所選事項類型相符。",
  "validation.emailInvalid": "請輸入包含 @ 及網域的有效電郵地址。",
  "validation.emailDomainTypo": "電郵網域似乎輸入有誤。",

  "estimate.matterIntake": "事項資料收集",
  "estimate.describeMatter": "以結構化資料描述事項。",
  "estimate.describeMatterBody":
    "請使用下拉選單及數字欄位，而非機密自由文字。這些資料將作為成本區間、工期區間、費用護欄及範圍增長警示的基礎。",
  "estimate.structuredFacts": "結構化事項資料",
  "estimate.decisionSupportOnly": "僅供決策支援",
  "estimate.decisionSupportBody":
    "此工作流程使用合成可行性數據，任何面向客戶的費用決定仍須合夥人審閱。",
  "estimate.notFound": "找不到估算",
  "estimate.notFoundBody": "此可行性前端無法取得所請求的估算。",
  "estimate.createNew": "建立新估算",
  "estimate.review": "估算審閱",
  "estimate.predictionResult": "預測結果",
  "estimate.openScopeMonitoring": "開啟範圍監察",
  "estimate.stageBreakdown": "階段明細",
  "estimate.requestFailed": "估算請求失敗",
  "estimate.createFailed": "無法建立估算，請確認 API 可用或使用模擬模式。",
  "estimate.processingTitle": "正在產生估算",

  "processing.analyzing": "分析事項資料…",
  "processing.calibrating": "校準成本區間…",
  "processing.building": "建立階段明細…",
  "processing.preparing": "準備費用護欄…",

  "intake.matterType": "事項類型",
  "intake.matterSubtype": "事項子類型",
  "intake.jurisdiction": "司法管轄區",
  "intake.firmTier": "事務所級別",
  "intake.clientType": "客戶類型",
  "intake.billingModel": "計費模式",
  "intake.dealValue": "交易金額（港元，選填）",
  "intake.documentVolume": "文件數量",
  "intake.complexityScore": "複雜度評分",
  "intake.complexityScoreHint": "1 = 常規，3 = 典型，5 = 高度複雜。",
  "intake.partyCount": "當事人數量",
  "intake.crossBorder": "跨境事項",
  "intake.selectPlaceholder": "選擇{label}",
  "intake.createEstimate": "建立估算",

  "riskTolerance.label": "風險承受度",
  "riskTolerance.conservative": "保守",
  "riskTolerance.conservativeDesc": "偏向較寬的下行情況保障及合夥人審閱。",
  "riskTolerance.balanced": "平衡",
  "riskTolerance.balancedDesc": "以中央區間作為可行性建議基礎。",
  "riskTolerance.aggressive": "進取",
  "riskTolerance.aggressiveDesc": "為提升價格競爭力而接受較高下行情況風險。",

  "results.pageEyebrow": "已儲存預測結果",
  "results.pageTitle": "在此瀏覽器重新查看估算。",
  "results.pageDescription":
    "示範記錄於本地保留完整預測回應，無需記住估算編號即可返回先前結果。",
  "results.signInToView": "登入以查看已儲存結果",
  "results.signInDescription":
    "示範記錄儲存於此瀏覽器，並按登入電郵分組。",
  "results.noSaved": "尚無已儲存預測結果",
  "results.noSavedDescription": "登入狀態下建立估算後，將顯示於此瀏覽器設定檔。",
  "results.createEstimate": "建立估算",
  "results.typicalCost": "典型成本",
  "results.typicalDuration": "典型工期",
  "results.chanceWorkGrows": "工作擴大可能性",
  "results.openResult": "開啟結果",
  "results.estimateSuffix": "估算",

  "fee.title": "費用建議",
  "fee.riskTolerance": "風險承受度：{value}",
  "fee.fixedFeeSuggestion": "固定費用建議",
  "fee.cappedFeeSuggestion": "上限費用建議",
  "fee.downsideWarning": "下行情況警示",
  "fee.downsideWarningDefault": "面向客戶使用前請審閱 P90 風險敞口",
  "fee.expectedMargin": "預期利潤",
  "fee.downsideRisk": "下行情況風險",
  "fee.marginPercent": "利潤率",
  "fee.pricingGuardrails": "定價護欄",
  "fee.recommendationNote":
    "建議基於 {low} 至 {high} 的模型區間，並套用已設定的風險承受度。最終決定仍須由合夥人作出。",

  "summary.costUncertainty": "成本不確定性",
  "summary.durationUncertainty": "工期不確定性",
  "summary.chanceWorkGrows": "工作擴大可能性",
  "summary.modelVersion": "模型版本 {version}",
  "summary.chanceWorkGrowsBody":
    "此為工作超出原有範圍而擴大的估計可能性，屬決策支援證據，並非自動法律或定價建議。",
  "summary.low": "低",
  "summary.typical": "典型",
  "summary.high": "高",
  "summary.confidenceDescription": "於 {confidence} 信心水平下的低、典型及高預估",
  "summary.daysUnit": "天",

  "impact.title": "影響此估算的因素",
  "impact.description": "此預測中，各事項事實對成本模型線性貢獻所佔的比重。",
  "impact.increases": "推高成本",
  "impact.decreases": "拉低成本",
  "impact.methodNote":
    "百分比為總成本 Ridge 係數 × 標準化特徵貢獻的相對比重。僅供決策支援。",
  "impact.unavailable": "未能提供因素影響",
  "impact.unavailableBody": "此估算未以即時模型歸因，因此不顯示影響比重。",

  "notice.syntheticData":
    "此介面使用 SYNTHETIC_MVP_V1 可行性合成數據，並不構成法律、監管或生產定價批准。",
  "notice.decisionSupport":
    "ProForma 僅提供決策支援；每項最終費用決定均由合夥人或獲授權律師作出。",
  "notice.legalGate":
    "匯集模型證據在法律審閱批准 PDPO、律師保密責任、匿名化及資料共享控制前，僅屬研究用途。",
  "notice.syntheticDataTitle": "合成數據限制",
  "notice.decisionSupportTitle": "僅供決策支援",
  "notice.decisionSupportPartner": "面向客戶使用前須由合夥人作出最終決定。",
  "notice.legalGateTitle": "法律審閱門檻通知",
  "notice.legalGateBody":
    "匯集模型證據在法律審閱批准 PDPO、律師保密責任、匿名化及資料共享控制前，仍僅屬研究用途。",

  "monitoring.eyebrow": "範圍監察",
  "monitoring.title": "事項是否仍符合計劃？",
  "monitoring.description":
    "比較預期階段工作量與目前實際數值。偏差警示協助合夥人判斷是否需要審閱範圍假設。",
  "monitoring.estimateNotFound": "找不到估算",
  "monitoring.estimateNotFoundBody": "範圍監察需要現有估算。",
  "monitoring.postStageUpdate": "提交階段更新",
  "monitoring.dashboardTitle": "範圍監察儀表板",
  "monitoring.dashboardDescription":
    "比較合成預測階段工作量與結構化實際更新。",
  "monitoring.reforecastCost": "重新預測最終成本",
  "monitoring.reforecastHours": "重新預測總工時",
  "monitoring.overrunProbability": "超支可能性",
  "monitoring.predictedVsActual": "預測與實際階段工作量",
  "monitoring.stage": "階段",
  "monitoring.predictedHours": "預測工時",
  "monitoring.actualHours": "實際工時",
  "monitoring.predictedCost": "預測成本",
  "monitoring.actualCost": "實際成本",
  "monitoring.variance": "偏差",
  "monitoring.recommendedAction": "建議審閱行動",
  "monitoring.actionCritical":
    "嚴重偏差：在繼續進行固定費用工作前，須由合夥人審閱。",
  "monitoring.actionWarning": "建議審閱行動：定價支援團隊應審閱範圍假設。",
  "monitoring.actionOnTrack": "繼續按目前估算監察。",
  "monitoring.stageName": "階段名稱",
  "monitoring.actualPartnerHours": "實際合夥人工時",
  "monitoring.actualAssociateHours": "實際助理律師工時",
  "monitoring.actualCostLabel": "實際成本",
  "monitoring.freeTextDisabled": "可行性模式下已停用機密自由文字備註。",
  "monitoring.postingUpdate": "提交更新中…",
  "monitoring.postStageUpdateBtn": "提交階段更新",
  "monitoring.updatePosted": "階段更新已提交",
  "monitoring.updateFailed": "範圍更新失敗",
  "monitoring.updateFailedBody": "無法提交階段更新。",
  "monitoring.selectStage": "選擇階段",
  "monitoring.varianceTable": "範圍監察偏差",

  "models.eyebrow": "模型證據",
  "models.title": "可行性證據套件",
  "models.lede":
    "本頁以淺白語言說明 ProForma 的估算模型是什麼、它從哪些數據學習、估算與實際相差多少，以及目前尚未獲准的用途。閱讀本頁無需統計學背景，所有技術名詞均在首次出現時解釋。",
  "models.syntheticGovernance": "請先閱讀：本頁每個數字均來自虛構數據",
  "models.syntheticGovernanceBody":
    "本頁證據由 {marker} 產生，這是一組由電腦生成的虛構香港法律事項。全程並未使用任何真實客戶、事務所或事項檔案。這足以證明軟件能完整運作、各項保障措施有效，但並不能證明任何事務所實際收費或應該收費多少。在法律審閱完成前，仍禁止使用多間事務所匯集的數據訓練模型。",

  "models.glossary": "貫穿本頁的五個名詞",
  "models.glossaryScopeCreep": "範圍增長",
  "models.glossaryScopeCreepBody":
    "工作範圍超出報價時的假設。在本系統中，當實際完成的工作成本高於原本報價、費用上限或預算逾 5%，該事項即標示為範圍增長。低於此門檻的超支會記錄為超支，但不會標示。",
  "models.glossaryModel": "模型",
  "models.glossaryModelBody":
    "一組以過往事項擬合而成的統計公式。輸入開工前已知的事實，它便回傳估算成本、時長及工作量。它不會閱讀文件，也不會撰寫文字。",
  "models.glossaryRange": "估算區間",
  "models.glossaryRangeBody":
    "每項估算均以低至高的區間呈現，而非單一數字，因為沒有任何估算是確定的。區間較寬是誠實反映該事項較難預測，並非缺陷。",
  "models.glossaryError": "誤差",
  "models.glossaryErrorBody":
    "模型估算與事項實際成本之間的差距。誤差一律以多宗事項的平均值呈現，因此數字描述的是整體典型表現，而非任何單一事項。",
  "models.glossarySynthetic": "合成數據",
  "models.glossarySyntheticBody":
    "由程式按既定規則及刻意加入的隨機變化產生的記錄，而非取自真實檔案。合成數據可自由公開查閱，因為每一行背後都沒有真實客戶。",

  "models.datasetBuilt": "支撐這些估算的執業數據如何建立",
  "models.whatItIs": "內容是什麼",
  "models.whatItIsBody":
    "{datasetId} 是一個載有 4,000 宗虛構香港法律事項的檔案，標記為 {marker}。每一行代表一宗虛構事項，記錄其事項類型、客戶類別、事務所規模、工作複雜程度、所收取的時薪、最初的報價，以及最終實際成本。",
  "models.howSynthesized": "數字從何而來",
  "models.howSynthesizedBody":
    "沒有任何內容抄自真實檔案，也沒有任何文字由 AI 聊天機械人撰寫。我們把對香港市場的假設明確寫下來：各事項類型的典型費用水平、按事務所規模劃分的時薪區間、跨境工作的額外成本，以及事項超出報價的頻率；程式再按這些假設，配以合理的隨機變化，產生 4,000 宗事項。",
  "models.whatItProves": "它能證明與不能證明什麼",
  "models.whatItProvesBody":
    "它證明軟件能運作：資料輸入表單、估算、區間、範圍增長警示與審計紀錄能協同運作，且任何機密欄位都無法傳入模型。它無法證明真實香港事項的成本，因為虛構數據的準確度不可能高於其背後的假設。",
  "models.reproducibility": "任何人都可重建並核實我們的工作",
  "models.reproducibilityBody":
    "程式每次均由同一個固定數字（稱為種子值，20260622）開始，因此重新執行會產生完全相同的檔案，而非一組新數字。產生器原始碼、數據集、逐欄說明的數據字典及完整驗證報告，均可在下方「目前模型」一節下載。",
  "models.sanityChecks": "數據獲接納前必須通過的內建檢查",
  "models.sanityChecksBody":
    "產生器會重複執行，直至完成的數據通過以下每一項檢查。完整結果載於驗證報告。",
  "models.sanityCheck1": "越複雜的事項成本越高；文件越多的事項所需工時越長。",
  "models.sanityCheck2": "大型及國際事務所的時薪高於小型本地事務所。",
  "models.sanityCheck3":
    "合夥人及助理律師時薪維持在合理的香港區間內，並設有不得低於的下限。",
  "models.sanityCheck4": "各階段成本相加須完全等於事項總額，不會憑空多出或缺少金額。",
  "models.sanityCheck5":
    "事項超出報價的次數足以觸發警示，且比率按事項類型合理地變化：例行遺囑認證甚少，具爭議的訴訟則經常發生。",
  "models.sanityCheck6": "任何一行均不含姓名、電郵地址、事項描述或任何自由文字。",

  "models.flowTitle": "一宗事項如何變成合夥人可簽署的數字",
  "models.currentModel": "目前模型",
  "models.syntheticData": "合成數據",
  "models.whatModelIs": "這個模型實際上是什麼",
  "models.whatModelIsBody":
    "{version} 並非聊天機械人，也不會閱讀文件。它是一組標準且行之已久的統計公式，以上述虛構事項擬合而成：一條估算成本、一條估算時長、一條估算合夥人工時、一條估算助理律師工時，第五條則評分範圍增長風險。",
  "models.modelInputs": "它獲准看到什麼",
  "models.modelInputsBody":
    "僅限資料輸入表單上的結構化事實：事項類型及子類型、司法管轄區、事務所規模、客戶類別、相關交易金額、文件數量、複雜程度、當事人數目、是否跨境、時薪及計費模式。",
  "models.modelExclusions": "它永不會看到什麼",
  "models.modelExclusionsBody":
    "任何只有在事項完結後才知道的資料，例如最終成本、實際工時、是否超支或結案方式。正因為刻意不提供這些資料，準確度數字才有意義，而非循環論證。客戶姓名、敘述及自由文字則完全排除。",
  "models.modelVersion": "模型版本",
  "models.featureVersion": "輸入定義版本",
  "models.datasetLineage": "所學習的數據集",
  "models.sourceMarker": "數據來源標記",
  "models.versionsExplainer":
    "系統產生的每項估算都附有這些識別碼，因此任何向客戶展示的數字，都可追溯至產生它的確切模型與數據。",

  "models.artifacts": "查閱或下載證據檔案",
  "models.artifactsBody":
    "支撐本頁的每個檔案均開放查閱。當中沒有機密資料：數據集完全是虛構的，模型亦只以該虛構數據擬合。",
  "models.artifactsDataset": "數據集及其製作方式",
  "models.artifactsModel": "已擬合的模型檔案",
  "models.artifactsReport": "模型說明卡及評估報告",
  "models.artifactsRebuildNote":
    "已擬合的模型檔案是由數據集重建而非儲存，因此在執行訓練指令前可能不存在。由於種子值固定，重建會產生相同檔案。",
  "models.artifactsUnavailable":
    "此環境並未發佈證據檔案，相關檔案仍可在專案程式庫中取得。",
  "models.artifactView": "檢視",
  "models.artifactDownload": "下載",
  "models.artifactViewLabel": "在瀏覽器檢視{name}",
  "models.artifactDownloadLabel": "下載{name}",
  "models.artifactUnavailable": "此環境未建立",
  "models.artifactRebuild": "重建指令：{command}",

  "models.artifact.syntheticDataset": "合成事項數據集",
  "models.artifact.syntheticDatasetSummary":
    "全部 4,000 宗虛構事項的試算表檔案，每行一宗事項，可用 Excel 或 Numbers 開啟。",
  "models.artifact.datasetGenerator": "產生器程式",
  "models.artifact.datasetGeneratorSummary":
    "產生該數據集的完整原始碼，包括每一項以數字寫明、可供閱讀與質詢的市場假設。",
  "models.artifact.dataDictionary": "數據字典",
  "models.artifact.dataDictionarySummary": "逐欄說明每個欄位的意義及其產生方式。",
  "models.artifact.validationReport": "驗證報告",
  "models.artifact.validationReportSummary":
    "內建檢查的完整結果，包括按事項類型劃分的超出報價比率及相關性表格。",
  "models.artifact.datasetLineage": "數據集譜系記錄",
  "models.artifact.datasetLineageSummary":
    "來源印記：數據集識別碼、記錄數目、產生器版本，以及重現該檔案所需的種子值。",
  "models.artifact.modelCardCost": "模型說明卡：成本估算",
  "models.artifact.modelCardCostSummary":
    "成本模型的一頁摘要：預期用途、排除用途、所依賴的事實、實測準確度及已知限制。",
  "models.artifact.modelCardScopeCreep": "模型說明卡：範圍增長風險",
  "models.artifact.modelCardScopeCreepSummary":
    "評分事項超出報價風險之模型的同款一頁摘要。",
  "models.artifact.trainingReportCost": "訓練報告：成本估算",
  "models.artifact.trainingReportCostSummary":
    "本頁準確度數字背後的詳細結果，並按事項類型細分。",
  "models.artifact.strategyComparisonReport": "事務所專屬與匯集訓練比較",
  "models.artifact.strategyComparisonReportSummary":
    "研究報告，比較以單一事務所事項訓練的模型，與以跨事務所匯集事項訓練的模型。",
  "models.artifact.bundleTotalCost": "已擬合模型：總成本",
  "models.artifact.bundleTotalCostSummary":
    "已擬合的成本公式及其設定，儲存後可日後重現完全相同的估算。",
  "models.artifact.bundleDuration": "已擬合模型：時長",
  "models.artifact.bundleDurationSummary": "估算事項由接受指示至完結所需日數的公式。",
  "models.artifact.bundlePartnerHours": "已擬合模型：合夥人工時",
  "models.artifact.bundlePartnerHoursSummary": "估算合夥人投入時間的公式。",
  "models.artifact.bundleAssociateHours": "已擬合模型：助理律師工時",
  "models.artifact.bundleAssociateHoursSummary": "估算助理律師投入時間的公式。",
  "models.artifact.bundleScopeCreep": "已擬合模型：範圍增長風險",
  "models.artifact.bundleScopeCreepSummary": "評分事項超出報價可能性的公式。",

  "models.evaluationSummary": "估算與實際的接近程度",
  "models.holdoutExplainer": "測試方式",
  "models.holdoutExplainerBody":
    "模型以四分之三的虛構事項擬合，再用來估算餘下四分之一從未見過的事項。以下所有數字均為它在這些未見事項上的表現，這是現階段最接近全新委聘的替代測試。",
  "models.calibrationMethod": "區間如何計算",
  "models.calibrationDescription":
    "我們量度過往估算與實際相差多遠，並以這些偏差的分布繪出低至高的區間。若某事項類型本身有足夠事項，便使用其自身的分布；若數量太少而不可靠，則改用整體分布。（方法：{method}。）",
  "models.whatMetricsMean": "各數字的含義",
  "models.maeLabel": "平均誤差",
  "models.maeDesc":
    "在典型事項上，估算與真實成本相差多少港元。可理解為：在一般事項上我們大約差了這個金額，數值越小越好。由於這是現金金額，處理較大型事項的事項類型自然會顯示較大數值。統計學上稱為 MAE。",
  "models.rmseLabel": "對大型偏差的敏感度",
  "models.rmseDesc":
    "與平均誤差概念相同，但偶爾出現的極大偏差所佔權重高得多。若此數字明顯高於平均誤差，代表雖然多數事項估算良好，仍有少數異常事項估算欠佳。統計學上稱為 RMSE。",
  "models.smapeLabel": "百分比誤差",
  "models.smapeDesc":
    "以每宗事項本身規模的百分比表示誤差，讓簡單遺囑與大型融資能公平比較。數值 0.28 表示在典型事項上估算約有 28% 偏差。統計學上稱為 sMAPE。",
  "models.rangeCoverageLabel": "區間覆蓋率",
  "models.rangeCoverageDesc":
    "實際成本落入所公布低至高區間的頻率。若區間標示為 80% 區間，此數值應接近 0.80。數值明顯偏低，代表區間過窄，顯得比證據所支持的更有信心。",
  "models.rocAucLabel": "範圍增長風險排序分數",
  "models.rocAucDesc":
    "評估獨立的範圍增長警示。任取一宗超出報價的事項與一宗沒有超出的事項：此數值代表模型把超支者評為較高風險的頻率。0.5 等同擲毫，1.0 則為完美。統計學上稱為 ROC-AUC。",
  "models.scopeCreepRatesLabel": "範圍增長及超支比率",
  "models.scopeCreepRatesDesc":
    "虛構事項中超出報價的比例。這些比率是刻意設定在看似合理的水平，好讓監察警示有可偵測的對象，並非關於真實香港事項超支頻率的研究結論。",
  "models.correlationsLabel": "相關性",
  "models.correlationsDesc":
    "檢查數據是否按執業者預期的方向變動：文件越多工時越長，複雜度越高成本越高。數值接近 1 代表兩者緊密同步上升，接近 0 則代表兩者無關。",
  "models.errorByMatterType": "按事項類型的準確度",
  "models.errorByMatterTypeNote":
    "請在同一事項類型內比較，而非跨類型比較。處理較大型事項的類型必然顯示較大的現金誤差，這本身並不代表模型在該類型表現較差。",
  "models.matterType": "事項類型",

  "models.firmVsPooled": "兩種訓練方式及其現況",
  "models.firmSpecific": "以單一事務所自身事項訓練",
  "models.firmSpecificBody":
    "這是計劃中首個投入實務的路徑。事務所的模型只從自身歷史學習，數據不會離開事務所，估算亦反映該事務所的實際運作方式。此方式須累積足夠的過往事項才可依賴。",
  "models.pooledResearch": "以跨事務所匯集的事項訓練",
  "models.pooledResearchBody":
    "僅屬研究軌道。匯集數據可讓模型有多得多的學習樣本，但會引起客戶保密、資料保障及專業責任等問題，必須先取得書面解答，方可使用。",
  "models.technicalNote": "技術註記",
  "models.firmSpecificUnavailable": "無法提供事務所專屬證據。",
  "models.pooledUnavailable": "無法提供匯集證據。",
  "models.legalGateStatus": "待法律審閱，暫時封鎖",
  "models.minimumRecords": "須有該事務所至少 {count} 宗過往事項",
  "models.similarMatter": "展示可資比較的過往事項",
  "models.similarMatterBody":
    "這是一項計劃中的功能，將向合夥人顯示估算所依據的過往事項。目前已關閉。啟用前須先就真實事務所數據的處理方式取得批准，包括儲存地點、保存期限及刪除方式。",
  "models.allowedInputs": "獲批准後可使用",
  "models.excludedInputs": "仍然排除",
  "models.retrievalEnabled": "功能已開啟",
  "models.retrievalDisabled": "功能已關閉",
  "models.metricsByMatterType": "按事項類型的指標",
  "models.rangeMethod": "區間計算方法",

  "charts.partnerHours": "合夥人工時",
  "charts.associateHours": "助理律師工時",
  "charts.predictedHours": "預測工時",
  "charts.actualHours": "實際工時",
  "charts.shareOfMatters": "事項佔比 (%)",
  "charts.avgCostShare": "平均成本佔比 (%)",
  "charts.averageError": "平均誤差",
  "charts.largeErrorSensitivity": "對大型偏差的敏感度",
  "charts.lowBound": "下限",
  "charts.recommended": "建議值",
  "charts.highBound": "上限",
  "charts.downside": "下行情況",
  "charts.estimate": "估算",
  "charts.structuredFacts": "你輸入的事實",
  "charts.structuredFactsText":
    "事項類型、司法管轄區、複雜度、當事人、文件及計費模式，除此以外並無使用其他資料。",
  "charts.modelVersionStep": "模型進行比對",
  "charts.modelVersionText":
    "系統將這些事實與數據集中各事項所呈現的模式比對，並參考過往估算的偏差幅度。",
  "charts.estimateRange": "估算區間",
  "charts.estimateRangeText":
    "用戶可見低、典型及高結果，而非單一虛假精確數字。",
  "charts.partnerDecision": "合夥人決定",
  "charts.partnerDecisionText": "負責合夥人在任何面向客戶的定價前審閱證據。",
  "charts.stageLevelEstimate": "階段層級估算",
  "charts.cost": "成本",

  "quote.partnerPreview": "合夥人預覽",
  "quote.title": "報價佐證套件",
  "quote.comparableMatters": "{count} 宗類似事項",
  "quote.riskMetrics": "歷史風險指標",
  "quote.benchmarkMetrics": "類似事項基準",
  "quote.historicalDistribution": "歷史分佈",
  "quote.riskMetricsAria": "風險指標",
  "quote.benchmarkMetricsAria": "基準指標",
  "quote.historicalChartsAria": "歷史圖表",
  "quote.assumptionsGuardrails": "假設及護欄",
  "quote.checksum": "校驗碼：{value}",
  "quote.downloadPdf": "下載 PDF",

  "preview.generatedReport": "產生報告預覽",
  "preview.quotePack": "報價佐證套件",
  "preview.partnerDraft": "合夥人草稿",
  "preview.matterSummary": "事項摘要",
  "preview.matterExample": "商業訴訟，香港管轄",
  "preview.comparableMatters": "82 宗類似事項",
  "preview.recommendedFee": "建議費用",
  "preview.feeDescription": "包含上限費用護欄及供合夥人審閱的偏差摘要。",
  "preview.evidence1": "82 宗類似事項",
  "preview.evidence2": "合成可行性模型",
  "preview.evidence3": "範圍風險信號：中等",
  "preview.footerNote":
    "面向客戶分享前須由合夥人審閱。證據頁尾包含模型版本、數據集標記及合成數據限制。",

  "reference.label": "參考編號 {id}",
  "reference.copied": "參考編號已複製",
  "reference.copy": "複製參考編號",
} as const satisfies Record<TranslationKey, string>;
