from ml.config import CLASSIFICATION_TARGET, REGRESSION_TARGETS
from ml.train import train_regression_model, train_scope_creep_classifier


def test_every_configured_regression_target_has_baseline_metrics() -> None:
    for target in REGRESSION_TARGETS:
        bundle = train_regression_model("output/proforma_hk_synthetic_mvp.csv", target=target, sample=300)

        assert bundle.target == target
        assert {"mae", "rmse", "smape"}.issubset(bundle.metrics)
        assert bundle.stratified_metrics
        assert all("sample_size" in metrics for metrics in bundle.stratified_metrics.values())


def test_scope_creep_classifier_has_required_metrics_and_strata() -> None:
    bundle = train_scope_creep_classifier("output/proforma_hk_synthetic_mvp.csv", sample=400)

    assert bundle.target == CLASSIFICATION_TARGET
    assert {"roc_auc", "pr_auc", "precision", "recall", "calibration_error"}.issubset(bundle.metrics)
    assert bundle.stratified_metrics
    assert all("sample_size" in metrics for metrics in bundle.stratified_metrics.values())
