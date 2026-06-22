import pandas as pd
import pytest

from proforma_data.importers.firm_csv import FirmCsvImportError, normalize_firm_csv


def valid_firm_row(**overrides: object) -> dict[str, object]:
    row: dict[str, object] = {
        "matter_type": "Arbitration",
        "matter_subtype": "HKIAC Commercial Arbitration",
        "jurisdiction": "GBA Cross-Border (HK-PRC)",
        "firm_tier": "Magic Circle / International",
        "client_type": "Mainland Enterprise",
        "document_volume": 900,
        "complexity_score": 4,
        "party_count": 5,
        "cross_border_flag": True,
        "billing_model": "Outcome Related",
        "risk_tolerance": "Medium",
        "historical_total_cost_hkd": 1_000_000.0,
        "historical_duration_days": 220,
        "historical_scope_creep_flag": True,
        "historical_outcome": "Settled/Completed",
    }
    row.update(overrides)
    return row


def test_rejects_missing_required_columns() -> None:
    df = pd.DataFrame([valid_firm_row()]).drop(columns=["matter_type"])

    with pytest.raises(FirmCsvImportError, match="missing required columns"):
        normalize_firm_csv(df)


def test_rejects_unexpected_direct_identifier_columns() -> None:
    df = pd.DataFrame([valid_firm_row(client_name="Acme Holdings Limited")])

    with pytest.raises(FirmCsvImportError, match="direct identifier"):
        normalize_firm_csv(df)


def test_normalizes_valid_structured_fixture_without_persisting() -> None:
    records = normalize_firm_csv(pd.DataFrame([valid_firm_row()]))

    assert len(records) == 1
    assert records[0].matter_input.matter_type == "Arbitration"
    assert records[0].historical_labels["historical_total_cost_hkd"] == 1_000_000.0


@pytest.mark.parametrize(
    ("column", "value"),
    [
        ("matter_description", "Urgent dispute with detailed client facts."),
        ("contact_email", "client@example.com"),
        ("free_text_narrative", "The client wants us to include sensitive facts."),
    ],
)
def test_rejects_free_text_and_email_fields_in_feasibility_mode(column: str, value: str) -> None:
    df = pd.DataFrame([valid_firm_row(**{column: value})])

    with pytest.raises(FirmCsvImportError):
        normalize_firm_csv(df, feasibility_mode=True)


def test_rejects_narrative_text_inside_allowed_historical_label() -> None:
    df = pd.DataFrame([valid_firm_row(historical_outcome="Client narrative with sensitive facts")])

    with pytest.raises(FirmCsvImportError, match="historical label"):
        normalize_firm_csv(df, feasibility_mode=True)
