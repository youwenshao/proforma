from ml.stage_allocation import allocate_stage_estimates
from proforma_data.domain import STAGE_TEMPLATES


def test_weighted_stage_allocation_preserves_totals_and_varies_hours() -> None:
    stages = allocate_stage_estimates(
        matter_type="Litigation",
        partner_hours=100.0,
        associate_hours=240.0,
        cost_estimate=500_000.0,
        partner_rate_hkd=3_500.0,
        associate_rate_hkd=1_750.0,
    )

    assert [stage["stage_name"] for stage in stages] == STAGE_TEMPLATES["Litigation"]
    assert round(sum(stage["partner_hours"] for stage in stages), 6) == 100.0
    assert round(sum(stage["associate_hours"] for stage in stages), 6) == 240.0
    assert round(sum(stage["cost_hkd"] for stage in stages), 6) == 500_000.0
    assert len({stage["partner_hours"] for stage in stages}) > 1
    assert len({stage["associate_hours"] for stage in stages}) > 1


def test_weighted_stage_allocation_uses_requested_matter_template() -> None:
    stages = allocate_stage_estimates(
        matter_type="M&A",
        partner_hours=80.0,
        associate_hours=160.0,
        cost_estimate=400_000.0,
        partner_rate_hkd=6_000.0,
        associate_rate_hkd=3_000.0,
    )

    assert [stage["stage_name"] for stage in stages] == STAGE_TEMPLATES["M&A"]
    assert stages[0]["partner_hours"] > stages[-1]["partner_hours"]
    assert stages[-1]["associate_hours"] > stages[0]["associate_hours"]
