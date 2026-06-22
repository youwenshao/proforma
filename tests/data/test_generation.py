import random

from generate_dataset import RANDOM_SEED, generate_dataset, regenerate_types


def test_seeded_generation_produces_stable_matter_ids() -> None:
    first = generate_dataset(random.Random(RANDOM_SEED))
    second = generate_dataset(random.Random(RANDOM_SEED))

    assert [record["matter_id"] for record in first] == [record["matter_id"] for record in second]


def test_targeted_regeneration_preserves_unique_matter_ids() -> None:
    records = generate_dataset(random.Random(RANDOM_SEED))
    regenerated = regenerate_types(records, {"Arbitration"}, random.Random(RANDOM_SEED + 1))
    matter_ids = [record["matter_id"] for record in regenerated]

    assert len(matter_ids) == len(set(matter_ids))
