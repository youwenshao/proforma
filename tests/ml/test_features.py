import pandas as pd

from ml.features import build_feature_matrix


def test_feature_builder_returns_2d_matrix_and_target_vector() -> None:
    records = pd.read_csv("output/proforma_hk_synthetic_mvp.csv").head(25).to_dict(orient="records")

    matrix, target, contract = build_feature_matrix(records, target="total_cost_hkd")

    assert matrix.shape[0] == 25
    assert len(matrix.shape) == 2
    assert target.shape == (25,)
    assert "matter_type" in contract.input_features
