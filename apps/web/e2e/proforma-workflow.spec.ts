import { expect, test } from "@playwright/test";

const estimateResponse = {
  cost_estimate: {
    calibration_method: "residual_quantiles",
    confidence_level: 0.8,
    p10: 197021.33584432135,
    p50: 566875.5481284132,
    p90: 1080741.5828392874,
  },
  dataset_lineage: {
    dataset_id: "proforma-hk-synthetic-mvp-v1",
    schema_version: "proforma.matter.v1",
    source_marker: "SYNTHETIC_MVP_V1",
  },
  decision_support_disclaimer:
    "This recommendation is decision-support only; a responsible partner must review matter context, professional obligations, and client instructions before use.",
  duration_estimate: {
    calibration_method: "residual_quantiles",
    confidence_level: 0.8,
    p10: 163.63461216695265,
    p50: 363.5747361003132,
    p90: 563.5148600336738,
  },
  estimate_id: "e2e-estimate",
  fee_recommendation: {
    billing_model: "Fixed Fee",
    confidence_interval_high_hkd: 802695.776149833,
    confidence_interval_low_hkd: 568576.1747727983,
    partner_decision_support_disclaimer:
      "This recommendation is decision-support only; a responsible partner must review matter context, professional obligations, and client instructions before use.",
    recommended_fee_hkd: 668913.1467915275,
    schema_version: "proforma.matter.v1",
  },
  limitations: ["Synthetic-data feasibility estimate only.", "Partner review required before client use."],
  model_version: "proforma-baseline-v1",
  scope_creep_probability: 0.6540640046165398,
  stage_estimates: [
    "Case Assessment",
    "Pleadings",
    "Discovery",
    "Interlocutory Applications",
    "Settlement/Trial",
  ].map((stage_name) => ({
    associate_hours: 54.732389561165874,
    cost_hkd: 113375.10962568263,
    partner_hours: 27.43897319877781,
    stage_name,
  })),
  tenant_id: "synthetic-demo-tenant",
};

test("completes the ProForma frontend workflow with mocked API responses", async ({
  page,
}) => {
  await page.route("**/v1/estimates", async (route) => {
    await route.fulfill({ json: estimateResponse });
  });
  await page.route("**/v1/estimates/*/scope-updates", async (route) => {
    await route.fulfill({
      json: {
        actual_hours: 95,
        estimate_id: "e2e-estimate",
        predicted_hours: 82,
        recommended_review_action: "Partner review required.",
        scope_creep_flag: true,
        stage_name: "Case Assessment",
        variance_pct: 15.9,
      },
    });
  });

  await page.goto("/");

  await expect(page.getByRole("heading", { name: "ProForma HK" })).toBeVisible();
  await expect(page.getByRole("alert").first()).toContainText("synthetic data");
  await page.getByRole("button", { name: "English" }).press("Tab");
  await expect(page.getByRole("button", { name: "繁體中文" })).toBeFocused();

  await page.getByRole("link", { name: /start estimate/i }).click();
  await expect(page.getByRole("heading", { name: /create pricing estimate/i })).toBeVisible();
  await expect(page.getByLabel("Matter type")).toBeVisible();

  await page.getByLabel("Matter type").selectOption("M&A");
  await page.getByLabel("Matter subtype").selectOption("Share Acquisition - Private");
  await page.getByLabel("Jurisdiction").selectOption("HK Only");
  await page.getByLabel("Firm tier").selectOption("Mid-tier (6-10 partners)");
  await page.getByLabel("Client type").selectOption("Financial Institution");
  await page.getByLabel("Deal value HKD").fill("50000000");
  await page.getByLabel("Document volume").fill("120");
  await page.getByLabel("Complexity score").fill("3");
  await page.getByLabel("Party count").fill("3");
  await page.getByLabel("Billing model").selectOption("Fixed Fee");
  await page.getByRole("radio", { name: /balanced/i }).check();
  await page.getByRole("button", { name: /create estimate/i }).click();

  await expect(page).toHaveURL(/\/estimate\/e2e-estimate/);
  await expect(page.getByRole("heading", { name: /prediction result/i })).toBeVisible();
  await expect(page.getByRole("table", { name: /stage-level estimate/i })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: /partner hours/i })).toBeVisible();

  await page.getByRole("link", { name: /open scope monitoring/i }).click();
  await expect(page.getByRole("heading", { name: /stage variance/i })).toBeVisible();
  await expect(page.getByRole("table", { name: /scope monitoring variance/i })).toBeVisible();
  await page.getByLabel("Stage name").selectOption("Case Assessment");
  await page.getByLabel("Actual partner hours").fill("35");
  await page.getByLabel("Actual associate hours").fill("60");
  await page.getByLabel("Actual cost").fill("130000");
  await page.getByRole("button", { name: /post stage update/i }).click();
  await expect(page.getByRole("status")).toContainText("15.9%");

  await page.goto("/models");
  await expect(page.getByRole("heading", { name: /feasibility evidence package/i })).toBeVisible();
  await expect(page.getByRole("table", { name: /metrics by matter type/i })).toBeVisible();
  await expect(page.getByText("legally_gated")).toBeVisible();
});
