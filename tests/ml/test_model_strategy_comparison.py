from pathlib import Path

from ml.experiments.model_strategy_comparison import run_comparison
from ml.features import ALLOWED_INPUT_FEATURES


def test_strategy_comparison_uses_same_feature_contract_and_reports_gate(tmp_path: Path) -> None:
    output_path = tmp_path / "model_strategy_comparison.md"

    report = run_comparison(
        dataset_path="output/proforma_hk_synthetic_mvp.csv",
        output_path=output_path,
        sample=500,
    )

    assert report["feature_contract"] == ALLOWED_INPUT_FEATURES
    assert report["strategies"]["pooled"]["sample_size"] == 500
    assert report["strategies"]["firm-tier-specific"]["segments"]
    assert report["strategies"]["matter-type-specific"]["segments"]
    assert report["segments_where_pooled_improves_accuracy"]
    for strategy in ["firm-tier-specific", "matter-type-specific", "leave-one-tier-out"]:
        segment = next(iter(report["strategies"][strategy]["segments"].values()))
        assert "baseline_mae" in segment or "held_out_mae" in segment
        assert "pooled_mae" in segment
    assert report["legal_gate"] == "pooled anonymized training remains legally gated"

    text = output_path.read_text(encoding="utf-8")
    assert "firm-specific" in text
    assert "pooled" in text
    assert "legally gated" in text
