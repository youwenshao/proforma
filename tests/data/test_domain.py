import random

import pytest

from generate_dataset import choose_billing_model
from proforma_data.domain import (
    MATTER_SUBTYPES,
    MATTER_TYPES,
    PARTNER_RATE_BANDS,
    STAGE_TEMPLATES,
)


def test_every_matter_type_has_stage_template() -> None:
    assert set(STAGE_TEMPLATES) == set(MATTER_TYPES)
    assert all(STAGE_TEMPLATES[matter_type] for matter_type in MATTER_TYPES)


def test_every_matter_type_has_at_least_one_subtype() -> None:
    assert set(MATTER_SUBTYPES) == set(MATTER_TYPES)
    assert all(MATTER_SUBTYPES[matter_type] for matter_type in MATTER_TYPES)


def test_outcome_related_billing_is_arbitration_only() -> None:
    for matter_type in MATTER_TYPES:
        observed = {choose_billing_model(matter_type, random.Random(seed)) for seed in range(500)}
        if matter_type == "Arbitration":
            assert "Outcome Related" in observed
        else:
            assert "Outcome Related" not in observed


@pytest.mark.parametrize("firm_tier", sorted(PARTNER_RATE_BANDS))
def test_partner_rate_bands_have_ordered_bounds(firm_tier: str) -> None:
    lower, upper = PARTNER_RATE_BANDS[firm_tier]

    assert lower < upper
