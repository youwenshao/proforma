# Validation Report

## Headline Results

- Records generated: 4,000
- Overall validation status: PASS
- Global material scope creep rate: 51.45%
- Global any-overrun rate: 70.48%
- Complexity vs log(total_cost) Pearson r: 0.575
- Complexity vs log(total_cost) Spearman rho: 0.565
- Document volume vs total hours Pearson r: 0.842
- Firm tier ordinal vs partner rate Pearson r: 0.909
- Minimum partner rate: HKD 1,925.46
- Minimum associate rate: HKD 834.40
- PRC Elite Firm in HK share: 10.32%
- Mainland Enterprise share in GBA matters: 63.35%

## Iteration Log

- External validation command

## Residual Anomalies

- None.

### Scope Creep Rates

| matter_type | material_creep_rate | any_overrun_rate | non_ongoing_count |
|---|---:|---:|---:|
| M&A | 57.78% | 76.67% | 450 |
| Litigation | 66.04% | 79.48% | 424 |
| Commercial Property | 50.33% | 72.83% | 449 |
| Employment | 46.37% | 66.76% | 358 |
| IP/Technology | 50.78% | 68.65% | 319 |
| Corporate Restructuring | 54.86% | 76.74% | 288 |
| Banking & Finance | 50.79% | 72.58% | 445 |
| Wills & Probate | 14.42% | 34.62% | 312 |
| Regulatory/Compliance | 53.26% | 72.16% | 291 |
| Arbitration | 66.67% | 79.37% | 252 |

| billing_model | material_creep_rate | any_overrun_rate | non_ongoing_count |
|---|---:|---:|---:|
| Hourly | 53.10% | 72.27% | 2373 |
| Fixed Fee | 44.95% | 65.14% | 852 |
| Capped Fee | 50.89% | 68.75% | 224 |
| Retainer | 57.75% | 69.01% | 71 |
| Outcome Related | 70.59% | 82.35% | 68 |

### Pearson Correlation Matrix

| field | complexity | log_total_cost | total_hours | duration_days | document_volume |
|---|---:|---:|---:|---:|---:|
| complexity | 1.000 | 0.575 | 0.458 | 0.521 | 0.508 |
| log_total_cost | 0.575 | 1.000 | 0.725 | 0.626 | 0.706 |
| total_hours | 0.458 | 0.725 | 1.000 | 0.621 | 0.842 |
| duration_days | 0.521 | 0.626 | 0.621 | 1.000 | 0.668 |
| document_volume | 0.508 | 0.706 | 0.842 | 0.668 | 1.000 |

### Validation Checks

| suite | check | status | detail |
|---|---|---:|---|
| A | Global material scope creep rate | PASS | 51.45% target 50%-60% |
| A | Global any-overrun rate | PASS | 70.48% target 65%-75% |
| A | Material creep rate: M&A | PASS | 57.78% target 45%-60% |
| A | Material creep rate: Litigation | PASS | 66.04% target 55%-70% |
| A | Material creep rate: Commercial Property | PASS | 50.33% target 35%-55% |
| A | Material creep rate: Employment | PASS | 46.37% target 35%-50% |
| A | Material creep rate: IP/Technology | PASS | 50.78% target 40%-55% |
| A | Material creep rate: Corporate Restructuring | PASS | 54.86% target 45%-60% |
| A | Material creep rate: Banking & Finance | PASS | 50.79% target 45%-60% |
| A | Material creep rate: Wills & Probate | PASS | 14.42% target 10%-25% |
| A | Material creep rate: Regulatory/Compliance | PASS | 53.26% target 40%-55% |
| A | Material creep rate: Arbitration | PASS | 66.67% target 55%-70% |
| A | Partner rate floor | PASS | min=1925.46 |
| A | Associate rate floor | PASS | min=834.40 |
| A | Partner/associate rate ratio | PASS | bad_records=0 |
| A | Stage costs sum to total_cost | PASS | bad_records=0 |
| A | Stage-level cost formula | PASS | bad_stage_entries=0 |
| A | Total cost formula | PASS | bad_records=0 |
| A | PRC cost estimate ratio | PASS | outliers=0 |
| A | Correlation complexity vs log(total_cost) | PASS | r=0.575 |
| A | Correlation document_volume vs total_hours | PASS | r=0.842 |
| A | Correlation firm_tier ordinal vs partner_rate | PASS | r=0.909 |
| A | Raw cost right-skew: M&A | PASS | raw_skew=2.116; log_skew=-0.007; log_excess_kurtosis=-0.204 |
| A | Raw cost right-skew: Litigation | PASS | raw_skew=1.988; log_skew=-0.129; log_excess_kurtosis=-0.321 |
| A | Raw cost right-skew: Commercial Property | PASS | raw_skew=2.125; log_skew=0.208; log_excess_kurtosis=-0.229 |
| A | Raw cost right-skew: Employment | PASS | raw_skew=1.890; log_skew=0.143; log_excess_kurtosis=-0.200 |
| A | Raw cost right-skew: IP/Technology | PASS | raw_skew=2.194; log_skew=-0.037; log_excess_kurtosis=-0.045 |
| A | Raw cost right-skew: Corporate Restructuring | PASS | raw_skew=3.706; log_skew=-0.120; log_excess_kurtosis=0.162 |
| A | Raw cost right-skew: Banking & Finance | PASS | raw_skew=1.843; log_skew=-0.246; log_excess_kurtosis=0.157 |
| A | Raw cost right-skew: Wills & Probate | PASS | raw_skew=3.303; log_skew=0.458; log_excess_kurtosis=0.290 |
| A | Raw cost right-skew: Regulatory/Compliance | PASS | raw_skew=1.902; log_skew=-0.249; log_excess_kurtosis=0.366 |
| A | Raw cost right-skew: Arbitration | PASS | raw_skew=1.364; log_skew=-0.330; log_excess_kurtosis=-0.163 |
| B | Suspicious uniform numeric fields | PASS | fields=[] |
| B | Exact duplicate cost/hours/rate triples | PASS | duplicates=0 |
| B | No partner-rate perfect linearity | PASS | bad_records=0 |
| B | No matter_type/firm_tier cell >25% | PASS | largest_cell=5.00% |
| B | Extreme overrun share <1% | PASS | share=0.12% |
| C | GBA cross-border PRC estimate rule | PASS | gba_records=1165 |
| C | HK-only PRC estimate NULL rule | PASS |  |
| C | Multi-jurisdictional cross-border rule | PASS |  |
| C | Mainland Enterprise share among GBA matters | PASS | share=63.35% |
| C | PRC Elite Firm in HK dataset share | PASS | share=10.32% |
| C | Outcome Related arbitration-only and <3% | PASS | share=2.08%; gated=True |

### Numeric Descriptive Statistics by `matter_type`

| group | field | mean | median | std | min | max | count |
|---|---:|---:|---:|---:|---:|---:|---:|
| Arbitration | document_volume | 2,972.92 | 2,628.50 | 1,751.35 | 312 | 11,129.00 | 320 |
| Arbitration | complexity_score | 3.7 | 4 | 0.9781 | 1 | 5 | 320 |
| Arbitration | party_count | 5.8094 | 5.5 | 1.9743 | 2 | 10 | 320 |
| Arbitration | partner_rate_hkd | 6,158.20 | 4,836.76 | 3,157.07 | 1,972.64 | 12,494.81 | 320 |
| Arbitration | associate_rate_hkd | 3,066.15 | 2,468.89 | 1,630.73 | 991.83 | 7,224.46 | 320 |
| Arbitration | partner_hours | 193.5638 | 167.2115 | 123.0538 | 24.407 | 628.33 | 320 |
| Arbitration | associate_hours | 340.2544 | 308.3346 | 195.5385 | 49.7129 | 1,112.05 | 320 |
| Arbitration | total_hours | 533.8181 | 478.0487 | 312.7074 | 76.7748 | 1,692.77 | 320 |
| Arbitration | stage_count | 6 | 6 | 0 | 6 | 6 | 320 |
| Arbitration | total_cost_hkd | 2,052,513.48 | 1,634,014.16 | 1,404,335.66 | 178,996.52 | 8,116,686.72 | 320 |
| Arbitration | predicted_cost_hkd | 1,868,848.92 | 1,494,695.98 | 1,336,725.80 | 171,284.54 | 8,706,384.92 | 320 |
| Arbitration | billed_amount_hkd | 1,863,065.08 | 1,526,993.15 | 1,380,973.48 | 124,103.25 | 7,381,989.43 | 320 |
| Arbitration | realization_rate | 0.893 | 0.9136 | 0.2223 | 0.1722 | 2.1897 | 320 |
| Arbitration | cost_variance_pct | 0.1832 | 0.1155 | 0.4179 | -0.3767 | 3.134 | 320 |
| Arbitration | scope_creep_pct | 0.3863 | 0.2746 | 0.4263 | 0.0625 | 3.134 | 168 |
| Arbitration | duration_days | 685.5063 | 602.5 | 357.6771 | 133 | 2,547.00 | 320 |
| Arbitration | prc_cost_estimate_cny | 818,229.83 | 702,991.29 | 464,787.43 | 76,972.85 | 2,061,046.10 | 73 |
| Banking & Finance | deal_value_hkd | 451,123,328.68 | 258,721,109.25 | 571,561,995.84 | 15,055,549.38 | 4,268,708,126.93 | 480 |
| Banking & Finance | document_volume | 1,778.18 | 1,496.50 | 1,083.56 | 235 | 7,437.00 | 480 |
| Banking & Finance | complexity_score | 3.4625 | 3 | 1.0087 | 1 | 5 | 480 |
| Banking & Finance | party_count | 5.6375 | 5 | 1.9848 | 2 | 10 | 480 |
| Banking & Finance | partner_rate_hkd | 6,505.34 | 5,806.82 | 2,944.72 | 2,109.11 | 12,893.04 | 480 |
| Banking & Finance | associate_rate_hkd | 3,261.47 | 2,900.38 | 1,527.85 | 902.13 | 7,365.87 | 480 |
| Banking & Finance | partner_hours | 149.7222 | 119.5418 | 101.3705 | 13.0397 | 732.5011 | 480 |
| Banking & Finance | associate_hours | 298.3831 | 262.3032 | 169.2753 | 39.9189 | 1,082.21 | 480 |
| Banking & Finance | total_hours | 448.1053 | 383.9052 | 265.4011 | 65.4719 | 1,814.71 | 480 |
| Banking & Finance | stage_count | 5 | 5 | 0 | 5 | 5 | 480 |
| Banking & Finance | total_cost_hkd | 1,836,596.08 | 1,553,634.38 | 1,290,243.26 | 136,944.51 | 9,502,176.65 | 480 |
| Banking & Finance | predicted_cost_hkd | 1,746,644.63 | 1,357,329.15 | 1,360,077.70 | 114,808.74 | 11,217,276.23 | 480 |
| Banking & Finance | billed_amount_hkd | 1,721,712.32 | 1,397,091.77 | 1,231,486.98 | 100,903.64 | 8,667,218.61 | 480 |
| Banking & Finance | realization_rate | 0.9347 | 0.9522 | 0.1449 | 0.3873 | 1.5564 | 480 |
| Banking & Finance | cost_variance_pct | 0.1373 | 0.0466 | 0.3824 | -0.3693 | 3.1953 | 480 |
| Banking & Finance | scope_creep_pct | 0.3735 | 0.2649 | 0.42 | 0.0506 | 3.1953 | 226 |
| Banking & Finance | duration_days | 185.5146 | 166 | 93.5228 | 38 | 574 | 480 |
| Banking & Finance | prc_cost_estimate_cny | 952,825.32 | 768,294.91 | 710,129.23 | 109,365.98 | 5,649,850.24 | 179 |
| Commercial Property | deal_value_hkd | 46,447,315.91 | 25,509,299.54 | 59,340,123.11 | 1,725,191.97 | 500,396,930.46 | 480 |
| Commercial Property | document_volume | 111.8937 | 86 | 87.9035 | 11 | 602 | 480 |
| Commercial Property | complexity_score | 2.5708 | 2 | 1.1207 | 1 | 5 | 480 |
| Commercial Property | party_count | 3.8 | 4 | 1.683 | 1 | 10 | 480 |
| Commercial Property | partner_rate_hkd | 3,895.41 | 3,300.39 | 1,888.73 | 1,975.03 | 12,454.83 | 480 |
| Commercial Property | associate_rate_hkd | 1,952.58 | 1,657.92 | 981.9093 | 843.15 | 6,630.06 | 480 |
| Commercial Property | partner_hours | 11.3856 | 8.136 | 10.3757 | 0.8583 | 82.7677 | 480 |
| Commercial Property | associate_hours | 34.0495 | 28.7668 | 22.1329 | 2.801 | 171.358 | 480 |
| Commercial Property | total_hours | 45.4352 | 36.5048 | 31.8578 | 3.6593 | 254.1257 | 480 |
| Commercial Property | stage_count | 5 | 5 | 0 | 5 | 5 | 480 |
| Commercial Property | total_cost_hkd | 104,037.94 | 79,774.00 | 78,541.46 | 15,170.47 | 526,742.88 | 480 |
| Commercial Property | predicted_cost_hkd | 97,345.75 | 76,936.01 | 74,507.04 | 7,333.80 | 552,254.28 | 480 |
| Commercial Property | billed_amount_hkd | 97,008.55 | 75,516.55 | 75,340.91 | 11,011.20 | 503,566.51 | 480 |
| Commercial Property | realization_rate | 0.9298 | 0.9489 | 0.1492 | 0.2451 | 1.5824 | 480 |
| Commercial Property | cost_variance_pct | 0.137 | 0.0489 | 0.3641 | -0.3749 | 3.0792 | 480 |
| Commercial Property | scope_creep_pct | 0.3735 | 0.2604 | 0.3871 | 0.0517 | 3.0792 | 226 |
| Commercial Property | duration_days | 33.2792 | 28 | 20.1373 | 5 | 128 | 480 |
| Commercial Property | prc_cost_estimate_cny | 57,193.71 | 47,266.79 | 38,529.74 | 7,472.44 | 209,620.47 | 120 |
| Corporate Restructuring | deal_value_hkd | 263,471,558.87 | 111,533,182.80 | 450,926,478.19 | 2,204,417.91 | 3,599,807,658.31 | 320 |
| Corporate Restructuring | document_volume | 1,980.33 | 1,688.50 | 1,329.82 | 217 | 8,399.00 | 320 |
| Corporate Restructuring | complexity_score | 3.5656 | 4 | 1.0364 | 1 | 5 | 320 |
| Corporate Restructuring | party_count | 6.4 | 6 | 2.0116 | 2 | 10 | 320 |
| Corporate Restructuring | partner_rate_hkd | 5,332.20 | 4,479.55 | 2,722.94 | 1,925.46 | 12,656.68 | 320 |
| Corporate Restructuring | associate_rate_hkd | 2,669.39 | 2,174.90 | 1,400.12 | 956.58 | 7,196.15 | 320 |
| Corporate Restructuring | partner_hours | 148.7314 | 122.7275 | 106.6264 | 21.4765 | 749.771 | 320 |
| Corporate Restructuring | associate_hours | 268.7924 | 231.7949 | 166.7527 | 42.8999 | 1,164.05 | 320 |
| Corporate Restructuring | total_hours | 417.5237 | 364.1742 | 269.4313 | 70.5491 | 1,869.09 | 320 |
| Corporate Restructuring | stage_count | 5 | 5 | 0 | 5 | 5 | 320 |
| Corporate Restructuring | total_cost_hkd | 1,411,070.20 | 1,142,117.01 | 1,134,122.30 | 150,670.86 | 12,174,128.46 | 320 |
| Corporate Restructuring | predicted_cost_hkd | 1,338,615.71 | 1,018,313.35 | 1,250,312.43 | 123,183.02 | 13,571,126.79 | 320 |
| Corporate Restructuring | billed_amount_hkd | 1,315,349.20 | 1,022,865.89 | 1,163,687.17 | 103,901.09 | 12,080,142.35 | 320 |
| Corporate Restructuring | realization_rate | 0.9154 | 0.9329 | 0.1553 | 0.3786 | 1.5373 | 320 |
| Corporate Restructuring | cost_variance_pct | 0.1321 | 0.0776 | 0.2904 | -0.3783 | 1.3833 | 320 |
| Corporate Restructuring | scope_creep_pct | 0.3105 | 0.2346 | 0.2513 | 0.0502 | 1.3833 | 158 |
| Corporate Restructuring | duration_days | 271.0625 | 245 | 143.0908 | 43 | 819 | 320 |
| Corporate Restructuring | prc_cost_estimate_cny | 751,516.69 | 628,115.76 | 607,573.16 | 96,584.93 | 3,710,187.60 | 115 |
| Employment | document_volume | 86.43 | 71 | 57.8917 | 8 | 337 | 400 |
| Employment | complexity_score | 2.5575 | 2 | 1.0838 | 1 | 5 | 400 |
| Employment | party_count | 3.77 | 3 | 1.5838 | 1 | 10 | 400 |
| Employment | partner_rate_hkd | 3,933.66 | 3,255.55 | 2,078.61 | 2,028.86 | 12,360.50 | 400 |
| Employment | associate_rate_hkd | 1,988.99 | 1,672.52 | 1,121.93 | 848.93 | 7,037.31 | 400 |
| Employment | partner_hours | 12.7632 | 9.9876 | 9.4458 | 1.6405 | 57.8106 | 400 |
| Employment | associate_hours | 39.3304 | 35.3255 | 20.0392 | 4.4776 | 130.1293 | 400 |
| Employment | total_hours | 52.0937 | 44.9991 | 28.7101 | 6.5924 | 172.238 | 400 |
| Employment | stage_count | 4 | 4 | 0 | 4 | 4 | 400 |
| Employment | total_cost_hkd | 124,368.44 | 97,932.76 | 91,266.69 | 18,365.04 | 553,751.22 | 400 |
| Employment | predicted_cost_hkd | 121,072.21 | 91,745.70 | 95,024.86 | 6,556.44 | 609,831.28 | 400 |
| Employment | billed_amount_hkd | 116,888.91 | 89,206.57 | 89,956.35 | 4,571.18 | 556,218.74 | 400 |
| Employment | realization_rate | 0.9267 | 0.9476 | 0.1667 | 0.2442 | 1.5653 | 400 |
| Employment | cost_variance_pct | 0.0946 | 0.0361 | 0.3097 | -0.3807 | 1.8551 | 400 |
| Employment | scope_creep_pct | 0.3395 | 0.2542 | 0.2856 | 0.0506 | 1.8551 | 166 |
| Employment | duration_days | 54.1475 | 47.5 | 30.7528 | 13 | 201 | 400 |
| Employment | prc_cost_estimate_cny | 78,527.41 | 65,162.70 | 55,879.77 | 7,310.47 | 291,342.64 | 97 |
| IP/Technology | document_volume | 223.0222 | 173.5 | 168.5882 | 17 | 1,304.00 | 360 |
| IP/Technology | complexity_score | 3.0306 | 3 | 1.0978 | 1 | 5 | 360 |
| IP/Technology | party_count | 4.6694 | 4 | 1.9872 | 2 | 10 | 360 |
| IP/Technology | partner_rate_hkd | 5,137.13 | 4,172.26 | 2,698.22 | 2,002.26 | 12,653.20 | 360 |
| IP/Technology | associate_rate_hkd | 2,581.69 | 2,029.72 | 1,413.29 | 930.71 | 7,492.77 | 360 |
| IP/Technology | partner_hours | 27.0266 | 22.7702 | 19.1683 | 1.3858 | 101.2655 | 360 |
| IP/Technology | associate_hours | 60.086 | 53.8726 | 32.2924 | 5.5831 | 189.4329 | 360 |
| IP/Technology | total_hours | 87.1126 | 74.0738 | 50.4484 | 6.9689 | 289.7336 | 360 |
| IP/Technology | stage_count | 5 | 5 | 0 | 5 | 5 | 360 |
| IP/Technology | total_cost_hkd | 271,191.91 | 220,899.11 | 198,715.67 | 36,683.99 | 1,325,944.31 | 360 |
| IP/Technology | predicted_cost_hkd | 263,214.52 | 203,904.91 | 207,501.57 | 29,808.79 | 1,473,809.05 | 360 |
| IP/Technology | billed_amount_hkd | 253,790.62 | 203,872.03 | 189,350.87 | 25,264.07 | 1,179,462.58 | 360 |
| IP/Technology | realization_rate | 0.9358 | 0.9442 | 0.148 | 0.5528 | 1.5967 | 360 |
| IP/Technology | cost_variance_pct | 0.0893 | 0.0446 | 0.2908 | -0.3878 | 2.0637 | 360 |
| IP/Technology | scope_creep_pct | 0.3047 | 0.2384 | 0.265 | 0.0516 | 2.0637 | 162 |
| IP/Technology | duration_days | 65.6194 | 55.5 | 38.6796 | 6 | 243 | 360 |
| IP/Technology | prc_cost_estimate_cny | 135,927.27 | 123,521.92 | 74,754.64 | 33,982.20 | 375,198.04 | 82 |
| Litigation | document_volume | 1,771.95 | 1,465.50 | 1,264.58 | 148 | 9,008.00 | 520 |
| Litigation | complexity_score | 3.4615 | 4 | 1.0958 | 1 | 5 | 520 |
| Litigation | party_count | 5.5904 | 5 | 2.039 | 2 | 10 | 520 |
| Litigation | partner_rate_hkd | 4,946.71 | 3,876.21 | 2,737.56 | 2,007.18 | 12,845.79 | 520 |
| Litigation | associate_rate_hkd | 2,488.35 | 1,896.91 | 1,453.78 | 834.4 | 7,146.92 | 520 |
| Litigation | partner_hours | 99.9746 | 79.8775 | 73.7753 | 7.4752 | 447.8858 | 520 |
| Litigation | associate_hours | 205.3007 | 179.4635 | 121.1831 | 29.6181 | 706.6238 | 520 |
| Litigation | total_hours | 305.2753 | 255.953 | 191.5206 | 39.2745 | 1,140.49 | 520 |
| Litigation | stage_count | 5 | 5 | 0 | 5 | 5 | 520 |
| Litigation | total_cost_hkd | 950,334.00 | 713,844.32 | 752,383.58 | 68,195.68 | 6,233,473.49 | 520 |
| Litigation | predicted_cost_hkd | 862,003.69 | 638,974.93 | 741,312.26 | 43,549.68 | 6,194,937.64 | 520 |
| Litigation | billed_amount_hkd | 845,539.34 | 622,739.73 | 706,206.04 | 52,970.35 | 4,658,525.29 | 520 |
| Litigation | realization_rate | 0.8692 | 0.9081 | 0.15 | 0.3622 | 1.5796 | 520 |
| Litigation | cost_variance_pct | 0.1826 | 0.1277 | 0.361 | -0.3754 | 3.0071 | 520 |
| Litigation | scope_creep_pct | 0.3408 | 0.2454 | 0.3313 | 0.0506 | 3.0071 | 280 |
| Litigation | duration_days | 345.1712 | 310.5 | 187.9332 | 56 | 1,184.00 | 520 |
| Litigation | prc_cost_estimate_cny | 528,681.46 | 398,044.09 | 411,615.85 | 31,012.97 | 2,422,976.83 | 133 |
| M&A | deal_value_hkd | 320,819,909.59 | 155,593,195.70 | 457,741,477.52 | 1,853,933.75 | 4,442,461,053.10 | 480 |
| M&A | document_volume | 3,534.11 | 2,805.00 | 2,403.31 | 245 | 15,398.00 | 480 |
| M&A | complexity_score | 3.4167 | 3 | 1.0644 | 1 | 5 | 480 |
| M&A | party_count | 5.5312 | 5 | 2.037 | 2 | 10 | 480 |
| M&A | partner_rate_hkd | 6,074.77 | 5,236.06 | 2,936.14 | 2,023.95 | 12,451.92 | 480 |
| M&A | associate_rate_hkd | 3,050.03 | 2,596.63 | 1,538.33 | 852.87 | 7,385.02 | 480 |
| M&A | partner_hours | 290.5434 | 224.8412 | 230.782 | 24.6437 | 1,956.94 | 480 |
| M&A | associate_hours | 520.7052 | 422.5489 | 335.1486 | 47.8261 | 2,334.07 | 480 |
| M&A | total_hours | 811.2486 | 650.5791 | 557.2013 | 72.4698 | 4,291.01 | 480 |
| M&A | stage_count | 5 | 5 | 0 | 5 | 5 | 480 |
| M&A | total_cost_hkd | 3,106,910.40 | 2,386,202.04 | 2,485,704.34 | 322,011.75 | 15,138,960.82 | 480 |
| M&A | predicted_cost_hkd | 2,879,488.77 | 2,080,427.74 | 2,494,998.94 | 204,677.08 | 17,528,109.52 | 480 |
| M&A | billed_amount_hkd | 2,861,632.99 | 2,145,607.47 | 2,364,549.45 | 226,994.44 | 14,561,036.83 | 480 |
| M&A | realization_rate | 0.9148 | 0.9405 | 0.136 | 0.3882 | 1.5806 | 480 |
| M&A | cost_variance_pct | 0.1454 | 0.0931 | 0.312 | -0.3788 | 2.2768 | 480 |
| M&A | scope_creep_pct | 0.3336 | 0.2502 | 0.287 | 0.05 | 2.2768 | 260 |
| M&A | duration_days | 258.4958 | 223 | 149.2579 | 36 | 998 | 480 |
| M&A | prc_cost_estimate_cny | 1,444,943.16 | 1,136,371.27 | 1,099,263.07 | 141,725.53 | 6,948,506.87 | 178 |
| Regulatory/Compliance | document_volume | 347.8531 | 279 | 255.1826 | 59 | 1,652.00 | 320 |
| Regulatory/Compliance | complexity_score | 3.1906 | 3 | 1.0284 | 1 | 5 | 320 |
| Regulatory/Compliance | party_count | 4.7562 | 4 | 1.8134 | 2 | 10 | 320 |
| Regulatory/Compliance | partner_rate_hkd | 5,649.33 | 4,819.75 | 2,719.41 | 2,119.11 | 12,507.45 | 320 |
| Regulatory/Compliance | associate_rate_hkd | 2,828.37 | 2,350.65 | 1,436.66 | 1,008.06 | 6,903.63 | 320 |
| Regulatory/Compliance | partner_hours | 33.4916 | 25.8892 | 25.4064 | 2.5595 | 234.5858 | 320 |
| Regulatory/Compliance | associate_hours | 71.7893 | 61.963 | 41.3314 | 7.2653 | 373.0807 | 320 |
| Regulatory/Compliance | total_hours | 105.281 | 90.0309 | 65.4059 | 9.8248 | 607.6665 | 320 |
| Regulatory/Compliance | stage_count | 5 | 5 | 0 | 5 | 5 | 320 |
| Regulatory/Compliance | total_cost_hkd | 367,049.66 | 308,975.27 | 257,393.41 | 22,283.33 | 1,690,390.87 | 320 |
| Regulatory/Compliance | predicted_cost_hkd | 340,799.28 | 278,766.76 | 247,743.07 | 23,984.88 | 1,696,645.87 | 320 |
| Regulatory/Compliance | billed_amount_hkd | 335,007.73 | 279,885.18 | 235,193.64 | 16,610.85 | 1,594,486.80 | 320 |
| Regulatory/Compliance | realization_rate | 0.915 | 0.9456 | 0.1451 | 0.3046 | 1.562 | 320 |
| Regulatory/Compliance | cost_variance_pct | 0.1461 | 0.0665 | 0.3955 | -0.3888 | 2.867 | 320 |
| Regulatory/Compliance | scope_creep_pct | 0.3893 | 0.2784 | 0.3999 | 0.0507 | 2.867 | 155 |
| Regulatory/Compliance | duration_days | 95.5469 | 85 | 51.0047 | 16 | 342 | 320 |
| Regulatory/Compliance | prc_cost_estimate_cny | 179,606.75 | 158,294.40 | 129,052.91 | 23,739.22 | 937,373.54 | 126 |
| Wills & Probate | document_volume | 14.3094 | 10.5 | 9.6517 | 8 | 72 | 320 |
| Wills & Probate | complexity_score | 2.1406 | 2 | 1.0212 | 1 | 5 | 320 |
| Wills & Probate | party_count | 2.8813 | 3 | 1.2663 | 1 | 10 | 320 |
| Wills & Probate | partner_rate_hkd | 3,219.47 | 2,877.46 | 1,206.16 | 1,968.65 | 12,183.45 | 320 |
| Wills & Probate | associate_rate_hkd | 1,625.60 | 1,479.74 | 620.9222 | 877.71 | 5,537.23 | 320 |
| Wills & Probate | partner_hours | 2.441 | 1.8276 | 2.0379 | 0.3144 | 17.9112 | 320 |
| Wills & Probate | associate_hours | 8.4034 | 7.4527 | 4.3894 | 1.4192 | 30.6043 | 320 |
| Wills & Probate | total_hours | 10.8443 | 9.2284 | 6.2656 | 1.7815 | 48.5155 | 320 |
| Wills & Probate | stage_count | 4 | 4 | 0 | 4 | 4 | 320 |
| Wills & Probate | total_cost_hkd | 21,238.58 | 16,346.11 | 16,188.95 | 4,999.92 | 153,508.16 | 320 |
| Wills & Probate | predicted_cost_hkd | 24,126.82 | 18,552.90 | 20,246.50 | 5,000.00 | 171,840.85 | 320 |
| Wills & Probate | billed_amount_hkd | 21,578.52 | 16,641.97 | 17,426.73 | 3,011.27 | 155,426.58 | 320 |
| Wills & Probate | realization_rate | 1.0046 | 0.9776 | 0.149 | 0.5996 | 1.5937 | 320 |
| Wills & Probate | cost_variance_pct | -0.0831 | -0.0891 | 0.191 | -0.3798 | 0.6677 | 320 |
| Wills & Probate | scope_creep_pct | 0.2463 | 0.1847 | 0.1723 | 0.051 | 0.6677 | 45 |
| Wills & Probate | duration_days | 18.8844 | 16 | 11.8148 | 4 | 89 | 320 |
| Wills & Probate | prc_cost_estimate_cny | 11,660.02 | 10,513.88 | 6,243.11 | 2,905.43 | 31,262.46 | 62 |

### Numeric Descriptive Statistics by `firm_tier`

| group | field | mean | median | std | min | max | count |
|---|---:|---:|---:|---:|---:|---:|---:|
| Large Local (11+ partners) | deal_value_hkd | 279,865,960.57 | 115,685,653.35 | 479,911,133.38 | 1,725,191.97 | 4,268,708,126.93 | 396 |
| Large Local (11+ partners) | document_volume | 1,529.98 | 914 | 1,795.00 | 8 | 12,514.00 | 861 |
| Large Local (11+ partners) | complexity_score | 3.2195 | 3 | 1.1338 | 1 | 5 | 861 |
| Large Local (11+ partners) | party_count | 5.0581 | 5 | 2.0985 | 1 | 10 | 861 |
| Large Local (11+ partners) | partner_rate_hkd | 4,475.53 | 4,479.93 | 612.8502 | 3,046.47 | 5,967.74 | 861 |
| Large Local (11+ partners) | associate_rate_hkd | 2,231.34 | 2,220.26 | 394.9075 | 1,243.83 | 3,444.95 | 861 |
| Large Local (11+ partners) | partner_hours | 115.0834 | 62.4347 | 139.6745 | 0.3144 | 1,151.50 | 861 |
| Large Local (11+ partners) | associate_hours | 238.4704 | 151.1001 | 255.8011 | 1.4671 | 1,891.93 | 861 |
| Large Local (11+ partners) | total_hours | 353.5537 | 212.5029 | 392.2175 | 1.7815 | 3,043.44 | 861 |
| Large Local (11+ partners) | stage_count | 4.9535 | 5 | 0.4474 | 4 | 6 | 861 |
| Large Local (11+ partners) | total_cost_hkd | 1,024,142.19 | 638,266.76 | 1,128,037.75 | 5,075.73 | 7,439,587.52 | 861 |
| Large Local (11+ partners) | predicted_cost_hkd | 957,305.57 | 577,682.81 | 1,099,691.57 | 5,000.00 | 8,991,113.46 | 861 |
| Large Local (11+ partners) | billed_amount_hkd | 943,842.23 | 564,672.15 | 1,084,343.13 | 4,816.74 | 8,991,113.46 | 861 |
| Large Local (11+ partners) | realization_rate | 0.9155 | 0.9365 | 0.1522 | 0.3189 | 1.7597 | 861 |
| Large Local (11+ partners) | cost_variance_pct | 0.1301 | 0.0673 | 0.3417 | -0.3888 | 2.8625 | 861 |
| Large Local (11+ partners) | scope_creep_pct | 0.3396 | 0.2453 | 0.3198 | 0.0506 | 2.3059 | 420 |
| Large Local (11+ partners) | duration_days | 224.8235 | 145 | 252.5265 | 4 | 2,547.00 | 861 |
| Large Local (11+ partners) | prc_cost_estimate_cny | 549,327.03 | 338,229.50 | 548,953.52 | 2,982.54 | 2,303,288.65 | 260 |
| Magic Circle / International | deal_value_hkd | 370,499,182.49 | 164,819,921.00 | 544,853,395.79 | 2,186,471.24 | 3,961,376,840.59 | 434 |
| Magic Circle / International | document_volume | 1,672.44 | 1,306.00 | 1,676.40 | 8 | 11,785.00 | 863 |
| Magic Circle / International | complexity_score | 3.387 | 3 | 1.0956 | 1 | 5 | 863 |
| Magic Circle / International | party_count | 5.4994 | 5 | 2.0851 | 1 | 10 | 863 |
| Magic Circle / International | partner_rate_hkd | 9,800.71 | 9,896.16 | 1,440.95 | 6,214.90 | 12,893.04 | 863 |
| Magic Circle / International | associate_rate_hkd | 4,934.82 | 4,904.84 | 948.6931 | 2,587.03 | 7,492.77 | 863 |
| Magic Circle / International | partner_hours | 120.1716 | 83.5487 | 130.1892 | 0.6266 | 987.8303 | 863 |
| Magic Circle / International | associate_hours | 205.2498 | 156.4039 | 192.0144 | 2.2137 | 1,471.49 | 863 |
| Magic Circle / International | total_hours | 325.4214 | 242.0652 | 319.3511 | 2.8403 | 2,459.32 | 863 |
| Magic Circle / International | stage_count | 5.0973 | 5 | 0.4197 | 4 | 6 | 863 |
| Magic Circle / International | total_cost_hkd | 2,149,749.54 | 1,588,295.77 | 2,138,870.94 | 16,668.78 | 15,034,655.89 | 863 |
| Magic Circle / International | predicted_cost_hkd | 2,015,929.73 | 1,430,695.73 | 2,119,628.37 | 19,251.98 | 17,528,109.52 | 863 |
| Magic Circle / International | billed_amount_hkd | 1,982,519.97 | 1,446,159.92 | 2,027,195.57 | 19,251.98 | 14,557,964.92 | 863 |
| Magic Circle / International | realization_rate | 0.9149 | 0.9361 | 0.1687 | 0.1722 | 2.1897 | 863 |
| Magic Circle / International | cost_variance_pct | 0.13 | 0.0861 | 0.3109 | -0.3878 | 2.2768 | 863 |
| Magic Circle / International | scope_creep_pct | 0.3269 | 0.2508 | 0.2752 | 0.05 | 2.2768 | 434 |
| Magic Circle / International | duration_days | 253.175 | 179 | 254.0784 | 5 | 1,667.00 | 863 |
| Magic Circle / International | prc_cost_estimate_cny | 910,445.67 | 634,210.40 | 971,246.31 | 26,403.09 | 5,649,850.24 | 221 |
| Mid-tier (6-10 partners) | deal_value_hkd | 190,171,586.27 | 75,587,296.80 | 281,628,650.34 | 1,986,670.97 | 2,344,340,298.51 | 381 |
| Mid-tier (6-10 partners) | document_volume | 1,192.58 | 328 | 1,663.92 | 8 | 10,619.00 | 948 |
| Mid-tier (6-10 partners) | complexity_score | 3.0116 | 3 | 1.1881 | 1 | 5 | 948 |
| Mid-tier (6-10 partners) | party_count | 4.6909 | 4 | 2.0383 | 1 | 10 | 948 |
| Mid-tier (6-10 partners) | partner_rate_hkd | 3,286.79 | 3,267.22 | 463.5161 | 2,231.55 | 4,444.08 | 948 |
| Mid-tier (6-10 partners) | associate_rate_hkd | 1,649.86 | 1,632.66 | 300.7017 | 1,003.23 | 2,561.73 | 948 |
| Mid-tier (6-10 partners) | partner_hours | 91.6152 | 35.2791 | 129.204 | 0.3475 | 1,039.49 | 948 |
| Mid-tier (6-10 partners) | associate_hours | 187.5038 | 89.8959 | 225.5105 | 1.4192 | 1,609.25 | 948 |
| Mid-tier (6-10 partners) | total_hours | 279.1189 | 126.5953 | 352.1054 | 1.8009 | 2,648.74 | 948 |
| Mid-tier (6-10 partners) | stage_count | 4.8502 | 5 | 0.5287 | 4 | 6 | 948 |
| Mid-tier (6-10 partners) | total_cost_hkd | 595,380.34 | 256,325.92 | 757,696.61 | 4,999.92 | 4,999,755.88 | 948 |
| Mid-tier (6-10 partners) | predicted_cost_hkd | 553,333.41 | 238,944.15 | 732,129.14 | 5,060.00 | 5,441,377.23 | 948 |
| Mid-tier (6-10 partners) | billed_amount_hkd | 551,797.80 | 224,946.93 | 731,637.90 | 3,011.27 | 5,441,377.23 | 948 |
| Mid-tier (6-10 partners) | realization_rate | 0.9248 | 0.9463 | 0.1544 | 0.3786 | 1.6811 | 948 |
| Mid-tier (6-10 partners) | cost_variance_pct | 0.1051 | 0.0491 | 0.3354 | -0.3859 | 3.1953 | 948 |
| Mid-tier (6-10 partners) | scope_creep_pct | 0.3334 | 0.2439 | 0.3348 | 0.0527 | 3.1953 | 429 |
| Mid-tier (6-10 partners) | duration_days | 183.0802 | 90.5 | 226.648 | 5 | 1,658.00 | 948 |
| Mid-tier (6-10 partners) | prc_cost_estimate_cny | 309,989.21 | 148,330.61 | 396,490.65 | 4,161.82 | 2,279,615.34 | 265 |
| PRC Elite Firm in HK | deal_value_hkd | 336,625,815.79 | 142,375,773.47 | 508,332,109.28 | 1,817,890.31 | 3,518,720,832.54 | 248 |
| PRC Elite Firm in HK | document_volume | 1,943.00 | 1,426.00 | 2,146.84 | 13 | 15,398.00 | 413 |
| PRC Elite Firm in HK | complexity_score | 3.3898 | 3 | 1.0886 | 1 | 5 | 413 |
| PRC Elite Firm in HK | party_count | 5.8402 | 6 | 2.146 | 2 | 10 | 413 |
| PRC Elite Firm in HK | partner_rate_hkd | 6,079.51 | 6,092.95 | 816.6499 | 4,139.28 | 7,772.12 | 413 |
| PRC Elite Firm in HK | associate_rate_hkd | 3,047.20 | 3,010.08 | 542.2842 | 1,874.74 | 4,387.96 | 413 |
| PRC Elite Firm in HK | partner_hours | 165.0316 | 113.1449 | 201.5338 | 1.6068 | 1,956.94 | 413 |
| PRC Elite Firm in HK | associate_hours | 277.687 | 217.5022 | 279.6775 | 5.4571 | 2,334.07 | 413 |
| PRC Elite Firm in HK | total_hours | 442.7186 | 333.5842 | 477.5535 | 7.0639 | 4,291.01 | 413 |
| PRC Elite Firm in HK | stage_count | 5.0291 | 5 | 0.3102 | 4 | 6 | 413 |
| PRC Elite Firm in HK | total_cost_hkd | 1,798,611.43 | 1,309,593.17 | 1,917,111.38 | 29,863.50 | 15,138,960.82 | 413 |
| PRC Elite Firm in HK | predicted_cost_hkd | 1,649,665.04 | 1,158,946.68 | 1,907,600.21 | 42,576.82 | 14,286,405.11 | 413 |
| PRC Elite Firm in HK | billed_amount_hkd | 1,631,164.28 | 1,147,779.07 | 1,810,246.58 | 42,576.82 | 14,561,036.83 | 413 |
| PRC Elite Firm in HK | realization_rate | 0.9015 | 0.9361 | 0.1507 | 0.2799 | 1.4691 | 413 |
| PRC Elite Firm in HK | cost_variance_pct | 0.1814 | 0.0973 | 0.3769 | -0.3636 | 2.867 | 413 |
| PRC Elite Firm in HK | scope_creep_pct | 0.3974 | 0.2822 | 0.3762 | 0.0522 | 2.867 | 207 |
| PRC Elite Firm in HK | duration_days | 246.5496 | 192 | 219.8423 | 11 | 1,601.00 | 413 |
| PRC Elite Firm in HK | prc_cost_estimate_cny | 861,988.93 | 630,539.91 | 922,059.76 | 12,965.00 | 6,948,506.87 | 285 |
| Small/Boutique (1-5 partners) | deal_value_hkd | 164,705,058.38 | 53,275,436.08 | 363,381,907.40 | 2,278,495.95 | 4,442,461,053.10 | 301 |
| Small/Boutique (1-5 partners) | document_volume | 707.2732 | 120 | 1,291.00 | 8 | 13,307.00 | 915 |
| Small/Boutique (1-5 partners) | complexity_score | 2.7661 | 3 | 1.1439 | 1 | 5 | 915 |
| Small/Boutique (1-5 partners) | party_count | 4.0131 | 4 | 1.8664 | 1 | 10 | 915 |
| Small/Boutique (1-5 partners) | partner_rate_hkd | 2,710.54 | 2,689.86 | 353.9662 | 1,925.46 | 3,595.40 | 915 |
| Small/Boutique (1-5 partners) | associate_rate_hkd | 1,359.39 | 1,343.58 | 246.8434 | 834.4 | 2,064.04 | 915 |
| Small/Boutique (1-5 partners) | partner_hours | 51.1946 | 12.6704 | 99.4431 | 0.3433 | 1,032.89 | 915 |
| Small/Boutique (1-5 partners) | associate_hours | 108.5141 | 38.5302 | 171.6766 | 2.1085 | 1,616.85 | 915 |
| Small/Boutique (1-5 partners) | total_hours | 159.7086 | 51.9164 | 269.3769 | 2.4518 | 2,649.74 | 915 |
| Small/Boutique (1-5 partners) | stage_count | 4.6568 | 5 | 0.5458 | 4 | 6 | 915 |
| Small/Boutique (1-5 partners) | total_cost_hkd | 276,178.28 | 86,368.69 | 457,667.23 | 5,000.11 | 4,109,935.34 | 915 |
| Small/Boutique (1-5 partners) | predicted_cost_hkd | 253,556.14 | 81,718.57 | 429,510.85 | 5,339.46 | 3,628,997.04 | 915 |
| Small/Boutique (1-5 partners) | billed_amount_hkd | 257,084.81 | 76,860.97 | 445,824.19 | 3,539.08 | 4,030,835.42 | 915 |
| Small/Boutique (1-5 partners) | realization_rate | 0.9395 | 0.9549 | 0.1643 | 0.2442 | 1.5817 | 915 |
| Small/Boutique (1-5 partners) | cost_variance_pct | 0.0969 | 0.0303 | 0.3733 | -0.3798 | 3.0792 | 915 |
| Small/Boutique (1-5 partners) | scope_creep_pct | 0.3716 | 0.2494 | 0.426 | 0.0506 | 3.0792 | 356 |
| Small/Boutique (1-5 partners) | duration_days | 119.2809 | 46 | 166.8906 | 4 | 1,465.00 | 915 |
| Small/Boutique (1-5 partners) | prc_cost_estimate_cny | 159,386.21 | 54,457.61 | 238,564.49 | 2,905.43 | 1,641,879.13 | 134 |
