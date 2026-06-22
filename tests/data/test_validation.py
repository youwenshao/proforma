import pandas as pd

from proforma_data.validation import validate_dataframe


def valid_row(**overrides: object) -> dict[str, object]:
    row: dict[str, object] = {
        "matter_id": "matter-1",
        "matter_type": "Arbitration",
        "matter_subtype": "HKIAC Commercial Arbitration",
        "jurisdiction": "GBA Cross-Border (HK-PRC)",
        "firm_tier": "Magic Circle / International",
        "client_type": "Mainland Enterprise",
        "deal_value_hkd": None,
        "document_volume": 1000,
        "complexity_score": 4,
        "party_count": 4,
        "cross_border_flag": True,
        "partner_rate_hkd": 6000.0,
        "associate_rate_hkd": 2500.0,
        "partner_hours": 10.0,
        "associate_hours": 20.0,
        "total_hours": 30.0,
        "stage_count": 2,
        "stage_names": ["Case Assessment", "Pleadings"],
        "stage_partner_hours": [4.0, 6.0],
        "stage_associate_hours": [10.0, 10.0],
        "stage_costs": [49_000.0, 61_000.0],
        "total_cost_hkd": 110_000.0,
        "predicted_cost_hkd": 100_000.0,
        "billed_amount_hkd": 95_000.0,
        "realization_rate": 0.8636,
        "cost_variance_pct": 0.10,
        "scope_creep_flag": True,
        "scope_creep_pct": 0.10,
        "duration_days": 180,
        "outcome": "Settled/Completed",
        "billing_model": "Outcome Related",
        "prc_cost_estimate_cny": 50_000.0,
        "data_source": "SYNTHETIC_MVP_V1",
    }
    row.update(overrides)
    return row


def issue_names(df: pd.DataFrame) -> set[str]:
    return {issue.name for issue in validate_dataframe(df).issues}


def test_validation_detects_stage_cost_sum_failure() -> None:
    df = pd.DataFrame([valid_row(stage_costs=[49_000.0, 50_000.0])])

    assert "Stage costs sum to total_cost" in issue_names(df)


def test_validation_detects_partner_associate_ratio_failure() -> None:
    df = pd.DataFrame([valid_row(associate_rate_hkd=5000.0)])

    assert "Partner/associate rate ratio" in issue_names(df)


def test_validation_detects_gba_prc_estimate_rule_failure() -> None:
    df = pd.DataFrame([valid_row(prc_cost_estimate_cny=None)])

    assert "GBA cross-border PRC estimate rule" in issue_names(df)


def test_validation_detects_missing_required_field() -> None:
    df = pd.DataFrame([valid_row()]).drop(columns=["matter_type"])

    assert "Required fields present" in issue_names(df)
