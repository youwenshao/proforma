import json
from pathlib import Path

import pytest
from pydantic import ValidationError

from proforma_data.schemas import (
    FeeRecommendation,
    MatterEstimate,
    MatterInput,
    ModelEvaluation,
    StageEstimate,
)


def valid_matter_input(**overrides: object) -> dict[str, object]:
    payload: dict[str, object] = {
        "matter_type": "Arbitration",
        "matter_subtype": "HKIAC Commercial Arbitration",
        "jurisdiction": "GBA Cross-Border (HK-PRC)",
        "firm_tier": "Magic Circle / International",
        "client_type": "Mainland Enterprise",
        "document_volume": 1200,
        "complexity_score": 4,
        "party_count": 4,
        "cross_border_flag": True,
        "billing_model": "Outcome Related",
        "risk_tolerance": "Medium",
    }
    payload.update(overrides)
    return payload


def test_complexity_score_accepts_only_one_through_five() -> None:
    MatterInput(**valid_matter_input(complexity_score=1))
    MatterInput(**valid_matter_input(complexity_score=5))

    with pytest.raises(ValidationError):
        MatterInput(**valid_matter_input(complexity_score=0))

    with pytest.raises(ValidationError):
        MatterInput(**valid_matter_input(complexity_score=6))


def test_document_volume_must_be_positive() -> None:
    with pytest.raises(ValidationError):
        MatterInput(**valid_matter_input(document_volume=0))


@pytest.mark.parametrize(
    ("jurisdiction", "cross_border_flag"),
    [
        ("HK Only", False),
        ("GBA Cross-Border (HK-PRC)", True),
        ("Multi-Jurisdictional (APAC)", True),
    ],
)
def test_cross_border_flag_agrees_with_jurisdiction(jurisdiction: str, cross_border_flag: bool) -> None:
    MatterInput(**valid_matter_input(jurisdiction=jurisdiction, cross_border_flag=cross_border_flag))

    with pytest.raises(ValidationError):
        MatterInput(**valid_matter_input(jurisdiction=jurisdiction, cross_border_flag=not cross_border_flag))


def test_matter_estimate_exposes_confidence_interval_fields() -> None:
    estimate = MatterEstimate(
        matter_input=MatterInput(**valid_matter_input()),
        predicted_cost_hkd=900_000,
        confidence_interval_low_hkd=750_000,
        confidence_interval_high_hkd=1_100_000,
        duration_days=180,
        stage_estimates=[
            StageEstimate(stage_name="Case Assessment", partner_hours=10, associate_hours=15, cost_hkd=120_000)
        ],
    )

    assert estimate.confidence_interval_low_hkd < estimate.predicted_cost_hkd
    assert estimate.predicted_cost_hkd < estimate.confidence_interval_high_hkd


def test_fee_recommendation_includes_partner_decision_support_disclaimer() -> None:
    recommendation = FeeRecommendation(
        billing_model="Fixed Fee",
        recommended_fee_hkd=950_000,
        confidence_interval_low_hkd=800_000,
        confidence_interval_high_hkd=1_100_000,
    )

    disclaimer = recommendation.partner_decision_support_disclaimer.lower()
    assert "decision-support" in disclaimer
    assert "partner" in disclaimer


def test_exported_json_schemas_include_schema_version(tmp_path: Path) -> None:
    MatterInput.write_json_schemas(tmp_path)

    exported = json.loads((tmp_path / "matter-input.schema.json").read_text(encoding="utf-8"))
    properties = exported["properties"]
    assert properties["schema_version"]["const"] == "proforma.matter.v1"
    assert "Arbitration" in properties["matter_type"]["enum"]
    assert "GBA Cross-Border (HK-PRC)" in properties["jurisdiction"]["enum"]
    assert "Outcome Related" in properties["billing_model"]["enum"]
    assert properties["risk_tolerance"]["enum"] == ["Low", "Medium", "High"]
    assert (tmp_path / "matter-estimate.schema.json").exists()
    assert (tmp_path / "model-evaluation.schema.json").exists()

    ModelEvaluation(
        dataset_id="synthetic-mvp-v1",
        model_version="baseline-v1",
        metrics={"mae": 1000.0},
        limitations=["Synthetic feasibility data only."],
    )
