import pandas as pd
import pytest

from ml.features import (
    ALLOWED_INPUT_FEATURES,
    LEAKAGE_FIELDS,
    assert_no_leakage,
    build_feature_matrix,
    feature_names,
    make_preprocessor,
    records_to_frame,
)


def sample_records(count: int = 30):
    return pd.read_csv("output/proforma_hk_synthetic_mvp.csv").head(count)


def test_feature_contract_excludes_all_leakage_fields() -> None:
    assert not set(ALLOWED_INPUT_FEATURES).intersection(LEAKAGE_FIELDS)

    with pytest.raises(ValueError, match="leakage"):
        assert_no_leakage([*ALLOWED_INPUT_FEATURES, "total_cost_hkd"])


def test_preprocessing_handles_missing_deal_value_and_boolean_conversion() -> None:
    records = sample_records()
    records["deal_value_hkd"] = records["deal_value_hkd"].astype("object")
    records["cross_border_flag"] = records["cross_border_flag"].astype("object")
    records.loc[0, "deal_value_hkd"] = None
    records.loc[0, "cross_border_flag"] = "TRUE"

    matrix, target, _ = build_feature_matrix(records, target="duration_days")

    assert matrix.shape[0] == len(records)
    assert target.shape == (len(records),)


def test_feature_names_are_exportable_for_model_cards() -> None:
    frame = records_to_frame(sample_records())
    preprocessor = make_preprocessor()
    preprocessor.fit(frame)

    names = feature_names(preprocessor)

    assert any("matter_type" in name for name in names)
    assert any("deal_value_hkd" in name for name in names)
