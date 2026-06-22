# Data Dictionary

This dictionary documents the synthetic ProForma HK MVP dataset. The data is generated directly from structured numeric and categorical distributions; no LLM-generated matter narratives are used.

## Generation Summary

- Records: 4,000 synthetic legal matters.
- Source marker: `SYNTHETIC_MVP_V1`.
- Random seed: `20260622`.
- Cost model: matter-type log-normal baseline with complexity, firm-tier, jurisdiction, and deal-value multipliers.
- Quote model: ex-ante firm quote based on a feature-derived expected cost plus a quote-posture mixture. The posture mixture creates materially under-scoped, narrowly over-budget, and conservative/over-scoped quotes so the data can match both material scope-creep and any-overrun benchmarks. It includes random variation and is not a simple deterministic transformation of realized WIP cost.
- Money model: `total_cost_hkd` is WIP/economic cost, `predicted_cost_hkd` is the original quote/cap/budget, `billed_amount_hkd` is amount billed or collected under the billing model, and `realization_rate` is billed divided by WIP cost.

## Fields

| field | type | generation logic and assumptions |
|---|---|---|
| `matter_id` | UUID string | Deterministic UUID5 generated from the dataset seed and record index so regenerated synthetic datasets remain reproducible. |
| `matter_type` | categorical | One of ten HK legal practice categories; counts use activity-weighted proportions with no category below roughly 320 records. |
| `matter_subtype` | categorical | Sampled from a matter-type-specific subtype taxonomy such as private share acquisition, unfair dismissal, or HKIAC commercial arbitration. |
| `jurisdiction` | categorical | Sampled from firm-tier and matter-type affinities: HK Only, GBA Cross-Border, or Multi-Jurisdictional APAC. |
| `firm_tier` | categorical | Activity-weighted by matter type. PRC Elite Firm in HK is targeted to 8-12% of the full dataset and concentrated in GBA M&A, banking, restructuring, and regulatory matters. |
| `client_type` | categorical | Conditional on jurisdiction, matter type, and firm tier. Mainland Enterprise is deliberately over-represented in GBA matters. |
| `deal_value_hkd` | float or NULL | Generated only for M&A, Commercial Property, Corporate Restructuring, and Banking & Finance. Uses matter-specific log-normal distributions and feeds sub-linearly into cost. |
| `document_volume` | integer | Right-skewed estimate of pages/files, driven by matter type, complexity, hours, and noise. Validated to correlate with total hours. |
| `complexity_score` | integer | 1-5 ordinal score. Matter-specific weights make Wills and routine property lower-complexity, while arbitration, restructuring, and complex transactional work skew higher. |
| `party_count` | integer | 1-10 count sampled from a capped log-normal-like process; increases with complexity and cross-border status. |
| `cross_border_flag` | boolean | TRUE for GBA Cross-Border and Multi-Jurisdictional records; FALSE for HK Only. |
| `partner_rate_hkd` | float | Sampled from amended HKD hourly rate bands by firm tier. Minimum partner rate is HKD 1,800; actual bands start at HKD 1,900 for small/boutique. |
| `associate_rate_hkd` | float | Partner rate multiplied by 40-60%, with an HKD 800 floor and guaranteed partner >= 1.5x associate. |
| `partner_hours` | float | Derived from WIP cost, blended rate, complexity, firm tier, and matter type. Higher complexity and elite/arbitration matters get higher partner leverage. |
| `associate_hours` | float | Derived as remaining hours after partner allocation. |
| `total_hours` | float | `partner_hours + associate_hours`. |
| `stage_count` | integer | Number of procedural stages from matter-type templates, generally 4-6. |
| `stage_names` | JSON list[string] | Matter-type stage names, e.g. Due Diligence, Negotiation, Closing. |
| `stage_partner_hours` | JSON list[float] | Partner hours allocated across stages. Early stages are relatively partner-heavy; the list sums to `partner_hours`. |
| `stage_associate_hours` | JSON list[float] | Associate hours allocated across stages. Later execution stages are relatively associate-heavy; the list sums to `associate_hours`. |
| `stage_costs` | JSON list[float] | For each stage, `stage_partner_hours[i] * partner_rate_hkd + stage_associate_hours[i] * associate_rate_hkd`. Sum equals `total_cost_hkd` within validation tolerance. |
| `total_cost_hkd` | float | WIP/economic cost. Generated from a matter-type log-normal expected cost adjusted for tier, complexity, jurisdiction, deal value, and independent actual-cost shock. |
| `predicted_cost_hkd` | float | Firm's original quote, cap, or budget. Generated from expected cost, independent quote noise, and a calibrated quote-posture mixture that sometimes materially underestimates, sometimes narrowly overruns, and sometimes over-scopes. Never exactly equal to total cost. |
| `billed_amount_hkd` | float | Amount billed or collected under the billing model. Fixed fee generally equals quote; capped fee is capped by the quote; hourly uses WIP cost adjusted for realization/write-downs. |
| `realization_rate` | float | `billed_amount_hkd / total_cost_hkd`. Values above or below 1 reflect premium/uplift or write-downs depending on billing model and outcome. |
| `cost_variance_pct` | float | Signed `(total_cost_hkd - predicted_cost_hkd) / predicted_cost_hkd`, preserving both underruns and overruns. |
| `scope_creep_flag` | boolean or NULL | TRUE when non-ongoing WIP cost exceeds quote by more than 5%. NULL for Ongoing matters. |
| `scope_creep_pct` | float or NULL | Same as `cost_variance_pct` only when `scope_creep_flag` is TRUE; otherwise NULL. |
| `duration_days` | integer | Driven by matter type, total hours, complexity, jurisdiction premium, and noise. Validated to correlate positively with complexity and cost. |
| `outcome` | categorical | Settled/Completed, Abandoned/Withdrawn, or Ongoing. Ongoing and abandoned matters have scaled WIP costs and realization behavior. |
| `billing_model` | categorical | Hourly, Fixed Fee, Capped Fee, Retainer, or Outcome Related. Outcome Related is arbitration-only and below 3% of the dataset. |
| `prc_cost_estimate_cny` | float or NULL | Only for GBA Cross-Border matters. Generated as 30-70% of HK WIP cost converted at 0.85-0.90 CNY/HKD. NULL for HK-only and APAC multi-jurisdictional matters. |
| `data_source` | string | Constant `SYNTHETIC_MVP_V1`. |

## Validation Philosophy

The validation suite checks statistical plausibility, structural integrity, and cross-border consistency. Correlations are evaluated on log cost where appropriate because legal costs are right-skewed. Raw costs are validated for right skew, while log costs are expected to be approximately normal, consistent with a log-normal generative model.
