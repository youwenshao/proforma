# Model Strategy Comparison

## Summary

This research scaffold compares simulated firm-specific, matter-type-specific, leave-one-tier-out, and pooled strategies.

- Legal gate: pooled anonymized training remains legally gated.
- Pooled sample size: 4000
- Minimum estimated records per firm for useful models: 300
- Segments where pooled data improves accuracy: firm-tier-specific: Large Local (11+ partners), firm-tier-specific: Magic Circle / International, firm-tier-specific: Mid-tier (6-10 partners), firm-tier-specific: PRC Elite Firm in HK, firm-tier-specific: Small/Boutique (1-5 partners), matter-type-specific: Arbitration, matter-type-specific: Banking & Finance, matter-type-specific: Commercial Property, matter-type-specific: Corporate Restructuring, matter-type-specific: Employment, matter-type-specific: Litigation, matter-type-specific: M&A, matter-type-specific: Wills & Probate, leave-one-tier-out: Large Local (11+ partners), leave-one-tier-out: Magic Circle / International, leave-one-tier-out: Mid-tier (6-10 partners), leave-one-tier-out: PRC Elite Firm in HK, leave-one-tier-out: Small/Boutique (1-5 partners)

## Feature Contract

- `matter_type`
- `matter_subtype`
- `jurisdiction`
- `firm_tier`
- `client_type`
- `deal_value_hkd`
- `document_volume`
- `complexity_score`
- `party_count`
- `cross_border_flag`
- `partner_rate_hkd`
- `associate_rate_hkd`
- `billing_model`
- `stage_count`

## Strategy Results

### pooled

- sample_size=4000
- mae=306089.29
- empirical_coverage=0.79

### firm-tier-specific

- Large Local (11+ partners): sample_size=861, baseline_mae=799338.24, pooled_mae=306089.29, pooled_improves_accuracy=True, calibration_note=segment residual calibration required before production use
- Magic Circle / International: sample_size=863, baseline_mae=1763450.23, pooled_mae=306089.29, pooled_improves_accuracy=True, calibration_note=segment residual calibration required before production use
- Mid-tier (6-10 partners): sample_size=948, baseline_mae=521905.58, pooled_mae=306089.29, pooled_improves_accuracy=True, calibration_note=segment residual calibration required before production use
- PRC Elite Firm in HK: sample_size=413, baseline_mae=1444563.38, pooled_mae=306089.29, pooled_improves_accuracy=True, calibration_note=segment residual calibration required before production use
- Small/Boutique (1-5 partners): sample_size=915, baseline_mae=403607.24, pooled_mae=306089.29, pooled_improves_accuracy=True, calibration_note=segment residual calibration required before production use

### matter-type-specific

- Arbitration: sample_size=320, baseline_mae=1593168.42, pooled_mae=306089.29, pooled_improves_accuracy=True, calibration_note=segment residual calibration required before production use
- Banking & Finance: sample_size=480, baseline_mae=1379717.63, pooled_mae=306089.29, pooled_improves_accuracy=True, calibration_note=segment residual calibration required before production use
- Commercial Property: sample_size=480, baseline_mae=367865.28, pooled_mae=306089.29, pooled_improves_accuracy=True, calibration_note=segment residual calibration required before production use
- Corporate Restructuring: sample_size=320, baseline_mae=969830.31, pooled_mae=306089.29, pooled_improves_accuracy=True, calibration_note=segment residual calibration required before production use
- Employment: sample_size=400, baseline_mae=347581.59, pooled_mae=306089.29, pooled_improves_accuracy=True, calibration_note=segment residual calibration required before production use
- IP/Technology: sample_size=360, baseline_mae=251897.89, pooled_mae=306089.29, pooled_improves_accuracy=False, calibration_note=segment residual calibration required before production use
- Litigation: sample_size=520, baseline_mae=577092.01, pooled_mae=306089.29, pooled_improves_accuracy=True, calibration_note=segment residual calibration required before production use
- M&A: sample_size=480, baseline_mae=2637726.12, pooled_mae=306089.29, pooled_improves_accuracy=True, calibration_note=segment residual calibration required before production use
- Regulatory/Compliance: sample_size=320, baseline_mae=224480.04, pooled_mae=306089.29, pooled_improves_accuracy=False, calibration_note=segment residual calibration required before production use
- Wills & Probate: sample_size=320, baseline_mae=450044.69, pooled_mae=306089.29, pooled_improves_accuracy=True, calibration_note=segment residual calibration required before production use

### leave-one-tier-out

- Large Local (11+ partners): sample_size=861, held_out_mae=805698.03, pooled_mae=306089.29, pooled_improves_accuracy=True
- Magic Circle / International: sample_size=863, held_out_mae=1869817.66, pooled_mae=306089.29, pooled_improves_accuracy=True
- Mid-tier (6-10 partners): sample_size=948, held_out_mae=551138.01, pooled_mae=306089.29, pooled_improves_accuracy=True
- PRC Elite Firm in HK: sample_size=413, held_out_mae=1478505.71, pooled_mae=306089.29, pooled_improves_accuracy=True
- Small/Boutique (1-5 partners): sample_size=915, held_out_mae=617495.64, pooled_mae=306089.29, pooled_improves_accuracy=True

## Privacy And Solicitor Confidentiality Caveats

Pooled anonymized training is legally gated and requires documented approvals before any real-firm data is used.
Firm-specific evaluation here is simulated from synthetic firm tiers, not actual firm identifiers.
