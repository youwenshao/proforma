# ProForma Phase 4 Web Frontend Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a bilingual Next.js App Router frontend that demonstrates ProForma's matter intake, predictive estimate, fee recommendation, model evidence, and scope-monitoring workflow.

**Architecture:** The frontend is an App Router application under `apps/web`. Server Components fetch stable read-only data such as taxonomy and model metadata, while Client Components handle interactive forms, locale switching, estimate review, and stage updates. The app consumes the FastAPI OpenAPI contract instead of duplicating backend logic.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, shadcn/ui, Playwright, Vitest or Jest, Testing Library, generated OpenAPI client.

---

## Source Context

- API contract from Phase 3: `services/api/openapi.json`
- API service: `services/api/app`
- Domain schemas: `proforma_data/schemas.py`
- Product workflow: `docs/proforma-proposal-prelim.html`
- Proposal requirement: bilingual English and Traditional Chinese interface.

## Phase Deliverables

- Next.js app skeleton.
- shadcn/ui baseline component system.
- Bilingual translation catalog.
- Matter intake workflow.
- Prediction result and stage breakdown views.
- Fee recommendation review view.
- Scope monitoring dashboard.
- Model evidence summary view.
- Synthetic-data and legal-gate notices.
- Frontend smoke, unit, accessibility, and workflow tests.

## Task 1: Create Next.js App Skeleton

**Files:**
- Create: `apps/web/package.json`
- Create: `apps/web/next.config.ts`
- Create: `apps/web/tsconfig.json`
- Create: `apps/web/app/layout.tsx`
- Create: `apps/web/app/page.tsx`
- Create: `apps/web/app/globals.css`
- Create: `apps/web/lib/api/client.ts`
- Create: `apps/web/tests/smoke.test.ts`
- Modify: root `package.json` if a workspace root is introduced.

**Step 1: Scaffold app**

Use a non-interactive setup command when implementation begins:

```bash
npx create-next-app@latest apps/web --ts --app --tailwind --eslint --src-dir false
```

If a root workspace is introduced, configure `pnpm-workspace.yaml` or npm workspaces before adding app dependencies.

**Step 2: Follow App Router conventions**

Use:

- `app/layout.tsx` for global shell.
- `app/page.tsx` for dashboard landing.
- `app/(workflow)/estimate/new/page.tsx` for matter intake.
- `app/(workflow)/estimate/[estimateId]/page.tsx` for estimate review.
- `app/(workflow)/monitoring/[estimateId]/page.tsx` for scope monitoring.
- `app/(evidence)/models/page.tsx` for model evidence.

Do not use Pages Router APIs such as `getServerSideProps`, `getStaticProps`, `next/router`, or `next/head`.

**Step 3: Write failing smoke test**

Assert the home page renders:

- Product name.
- Synthetic-data notice.
- Start estimate link.
- Model evidence link.

Run: `pnpm --dir apps/web test`

Expected before implementation: failure for missing app or tests.

**Step 4: Implement minimal shell**

Add root layout, dashboard page, and API client placeholder.

**Step 5: Verify**

Run:

```bash
pnpm --dir apps/web lint
pnpm --dir apps/web test
pnpm --dir apps/web build
```

Expected: lint, tests, and build pass.

**Step 6: Commit checkpoint**

Commit message: `feat: scaffold ProForma web app`

## Task 2: Initialize shadcn/ui And Design System

**Files:**
- Create: `apps/web/components.json`
- Create: `apps/web/components/ui/*`
- Create: `apps/web/lib/utils.ts`
- Modify: `apps/web/app/globals.css`
- Modify: `apps/web/app/layout.tsx`

**Step 1: Initialize shadcn non-interactively**

Run:

```bash
cd apps/web && npx shadcn@latest init -d --base radix
```

Use Radix as the base. Do not use `-y` alone because it can still prompt.

**Step 2: Add first components**

Run:

```bash
cd apps/web && npx shadcn@latest add button card form input label select table tabs badge alert separator sheet skeleton tooltip
```

**Step 3: Apply product UI direction**

Use:

- `new-york` style if prompted by config.
- Neutral, zinc, or slate base palette.
- Geist fonts through `next/font`.
- Theme tokens instead of ad-hoc colors.
- Cards, tables, tabs, alerts, and badges for dense legal-pricing surfaces.

**Step 4: Add design system smoke test**

Assert:

- `components.json` exists.
- `Button`, `Card`, `Table`, `Alert`, and `Tabs` components import successfully.
- No raw placeholder UI is used for main workflow states.

**Step 5: Verify**

Run:

```bash
pnpm --dir apps/web lint
pnpm --dir apps/web test
```

Expected: UI imports and lint pass.

**Step 6: Commit checkpoint**

Commit message: `feat: add ProForma frontend design system`

## Task 3: Add Bilingual Translation Catalog

**Files:**
- Create: `apps/web/lib/i18n/locales.ts`
- Create: `apps/web/lib/i18n/en.ts`
- Create: `apps/web/lib/i18n/zh-Hant.ts`
- Create: `apps/web/lib/i18n/translator.ts`
- Create: `apps/web/components/language-switcher.tsx`
- Create: `apps/web/tests/i18n.test.ts`

**Step 1: Define locale strategy**

Support:

- `en`
- `zh-Hant`

Use a simple dictionary first. Avoid adding a complex i18n framework until route localization requirements are proven.

**Step 2: Include legal proofreading gate**

Mark `zh-Hant` strings with metadata:

- `status: draft`
- `requiresLegalProofreading: true`

until reviewed by a native Chinese-speaking legal proofreader.

**Step 3: Write translation tests**

Assert:

- Every English key exists in Traditional Chinese.
- No UI key falls back silently in production build.
- Decision-support disclaimer exists in both locales.
- Synthetic-data limitation exists in both locales.

**Step 4: Implement switcher**

Use a Client Component for language switching. Keep the locale preference in URL search params or local storage for feasibility mode.

**Step 5: Verify**

Run: `pnpm --dir apps/web test -- i18n`

Expected: translation coverage tests pass.

**Step 6: Commit checkpoint**

Commit message: `feat: add bilingual translation catalog`

## Task 4: Build Matter Intake Workflow

**Files:**
- Create: `apps/web/app/(workflow)/estimate/new/page.tsx`
- Create: `apps/web/components/estimate/matter-intake-form.tsx`
- Create: `apps/web/components/estimate/risk-tolerance-selector.tsx`
- Create: `apps/web/lib/api/taxonomy.ts`
- Create: `apps/web/lib/validation/matter-input.ts`
- Create: `apps/web/tests/matter-intake.test.tsx`
- Create: `apps/web/e2e/matter-intake.spec.ts`

**Step 1: Fetch taxonomy on the server**

Use a Server Component page to fetch `/v1/taxonomy` from FastAPI. Pass serializable taxonomy data into a Client Component form.

**Step 2: Build form fields**

Include:

- Matter type.
- Matter subtype.
- Jurisdiction.
- Firm tier.
- Client type.
- Deal value, optional.
- Document volume.
- Complexity score.
- Party count.
- Cross-border flag.
- Billing model.
- Risk tolerance.

**Step 3: Validate input**

Mirror `MatterInput` constraints:

- Complexity 1 through 5.
- Positive document volume.
- Positive party count.
- Cross-border flag agrees with jurisdiction.
- Matter subtype belongs to selected matter type.

**Step 4: Write tests**

Assert:

- Required field errors are shown.
- Matter subtype options change after matter type selection.
- Invalid cross-border combination is rejected.
- Valid form submits to `/v1/estimates`.

**Step 5: Verify**

Run:

```bash
pnpm --dir apps/web test -- matter-intake
pnpm --dir apps/web exec playwright test apps/web/e2e/matter-intake.spec.ts
```

Expected: unit and E2E intake tests pass.

**Step 6: Commit checkpoint**

Commit message: `feat: build bilingual matter intake workflow`

## Task 5: Build Estimate Results And Fee Recommendation Views

**Files:**
- Create: `apps/web/app/(workflow)/estimate/[estimateId]/page.tsx`
- Create: `apps/web/components/estimate/estimate-summary.tsx`
- Create: `apps/web/components/estimate/stage-breakdown-table.tsx`
- Create: `apps/web/components/estimate/fee-recommendation-panel.tsx`
- Create: `apps/web/components/estimate/limitations-alert.tsx`
- Create: `apps/web/lib/api/estimates.ts`
- Create: `apps/web/tests/estimate-results.test.tsx`

**Step 1: Render uncertainty, not just point estimates**

Show:

- Cost p10, p50, p90.
- Duration p10, p50, p90.
- Scope-creep probability.
- Stage-level hours and cost.
- Confidence and calibration notes.

**Step 2: Make partner control explicit**

Every result page must include:

- Decision-support disclaimer.
- Partner final decision notice.
- Synthetic-data limitation in synthetic mode.
- Legal-gate notice for pooled research mode.

**Step 3: Build fee recommendation panel**

Display:

- Fixed-fee suggestion.
- Capped-fee suggestion.
- Risk tolerance used.
- Downside warning.
- Explanation of rule and model interval used.

**Step 4: Write tests**

Assert:

- p10/p50/p90 values render in order.
- Stage table is accessible by column headers.
- Disclaimer appears.
- Pooled research response shows legal-gate alert.
- Missing estimate renders `not-found.tsx` or a designed error state.

**Step 5: Verify**

Run:

```bash
pnpm --dir apps/web test -- estimate-results
pnpm --dir apps/web build
```

Expected: tests and build pass.

**Step 6: Commit checkpoint**

Commit message: `feat: add estimate results and fee recommendation UI`

## Task 6: Build Scope Monitoring Dashboard

**Files:**
- Create: `apps/web/app/(workflow)/monitoring/[estimateId]/page.tsx`
- Create: `apps/web/components/monitoring/scope-monitoring-dashboard.tsx`
- Create: `apps/web/components/monitoring/stage-update-form.tsx`
- Create: `apps/web/components/monitoring/variance-badge.tsx`
- Create: `apps/web/lib/api/scope-monitoring.ts`
- Create: `apps/web/tests/scope-monitoring.test.tsx`

**Step 1: Display stage variance**

Show:

- Predicted hours and cost by stage.
- Actual hours and cost by stage.
- Variance percentage.
- Warning or critical status.
- Recommended review action.

**Step 2: Add update form**

Allow structured updates:

- Stage name.
- Actual partner hours.
- Actual associate hours.
- Actual cost.

Keep confidential free-text notes disabled in feasibility mode.

**Step 3: Write tests**

Assert:

- Warning appears above 5 percent variance.
- Critical appears above 15 percent variance.
- Free-text notes are not present by default.
- Update form posts to `/v1/estimates/{estimateId}/scope-updates`.

**Step 4: Verify**

Run: `pnpm --dir apps/web test -- scope-monitoring`

Expected: monitoring tests pass.

**Step 5: Commit checkpoint**

Commit message: `feat: add scope monitoring dashboard`

## Task 7: Build Model Evidence View

**Files:**
- Create: `apps/web/app/(evidence)/models/page.tsx`
- Create: `apps/web/components/models/model-current-card.tsx`
- Create: `apps/web/components/models/evaluation-summary.tsx`
- Create: `apps/web/components/models/strategy-comparison.tsx`
- Create: `apps/web/lib/api/models.ts`
- Create: `apps/web/tests/model-evidence.test.tsx`

**Step 1: Surface feasibility evidence**

Show:

- Current model version.
- Dataset lineage.
- Synthetic-data flag.
- Metrics by matter type.
- Firm-specific versus pooled comparison summary.
- Pooled model legal-gate status.

**Step 2: Write tests**

Assert:

- Model version appears.
- Dataset lineage appears.
- Synthetic flag appears.
- Firm-specific and pooled tracks appear.
- Legal-gate status appears for pooled research.

**Step 3: Verify**

Run: `pnpm --dir apps/web test -- model-evidence`

Expected: model evidence tests pass.

**Step 4: Commit checkpoint**

Commit message: `feat: add model evidence frontend`

## Task 8: Add Frontend E2E Workflow

**Files:**
- Create: `apps/web/e2e/proforma-workflow.spec.ts`
- Create: `apps/web/playwright.config.ts`
- Modify: `apps/web/package.json`

**Step 1: Define E2E journey**

Test:

1. User opens dashboard.
2. User starts estimate.
3. User fills matter intake.
4. User reviews prediction and fee recommendation.
5. User opens scope monitoring.
6. User posts stage update.
7. User opens model evidence.

**Step 2: Use mocked API first**

Mock FastAPI responses from Phase 3 fixtures so the frontend can be tested deterministically.

**Step 3: Add accessibility assertions**

Include checks for:

- Labels on form fields.
- Table headers.
- Alert roles.
- Keyboard-accessible language switcher.

**Step 4: Verify**

Run:

```bash
pnpm --dir apps/web exec playwright test
pnpm --dir apps/web build
```

Expected: E2E tests and production build pass.

**Step 5: Commit checkpoint**

Commit message: `test: add ProForma frontend workflow coverage`

## Phase 4 Final Verification

Run:

```bash
pnpm --dir apps/web lint
pnpm --dir apps/web test
pnpm --dir apps/web exec playwright test
pnpm --dir apps/web build
rg "decision-support|Synthetic|pooled|legal-gate|zh-Hant" apps/web
```

Expected:

- Frontend lint passes.
- Unit and E2E tests pass.
- Next.js production build passes.
- Bilingual labels exist.
- Synthetic-data and legal-gate notices are visible.
- The UI never presents estimates as autonomous legal advice.

