"""Training CLI and baseline model builders."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

import joblib
import numpy as np
import pandas as pd
from sklearn.dummy import DummyClassifier, DummyRegressor
from sklearn.ensemble import (
    HistGradientBoostingClassifier,
    HistGradientBoostingRegressor,
    RandomForestClassifier,
    RandomForestRegressor,
)
from sklearn.linear_model import LogisticRegression, Ridge
from sklearn.model_selection import KFold, cross_val_predict, train_test_split
from sklearn.pipeline import Pipeline

from ml.bundle import ModelBundle
from ml.config import (
    CLASSIFICATION_TARGET,
    FIXTURE_DIR,
    MODEL_DIR,
    MODEL_VERSION,
    RANDOM_STATE,
    REGRESSION_TARGETS,
    REPORT_DIR,
    TEST_SIZE,
)
from ml.evaluate import (
    classification_metrics,
    empirical_coverage,
    prediction_interval,
    regression_metrics,
    residual_quantiles,
    segment_residual_uncertainty,
    stratified_classification_metrics,
    stratified_regression_metrics,
)
from ml.features import feature_contract, feature_names, make_preprocessor, records_to_frame
from ml.inference import predict
from ml.model_card import write_model_card
from proforma_data.schemas import MatterInput


def read_dataset(dataset_path: Path | str, sample: int | None = None) -> pd.DataFrame:
    frame = pd.read_csv(dataset_path)
    if sample is not None:
        frame = frame.head(sample)
    return frame


def regression_estimator(model_name: str):
    if model_name == "dummy":
        return DummyRegressor(strategy="median")
    if model_name == "ridge":
        return Ridge(alpha=1.0)
    if model_name == "random_forest":
        return RandomForestRegressor(n_estimators=80, random_state=RANDOM_STATE, min_samples_leaf=3)
    if model_name == "hist_gradient_boosting":
        return HistGradientBoostingRegressor(random_state=RANDOM_STATE, max_iter=120)
    raise ValueError(f"Unknown regression model: {model_name}")


def classifier_estimator(model_name: str):
    if model_name == "dummy":
        return DummyClassifier(strategy="prior")
    if model_name in {"logistic", "ridge"}:
        return LogisticRegression(max_iter=1000)
    if model_name == "random_forest":
        return RandomForestClassifier(n_estimators=80, random_state=RANDOM_STATE, min_samples_leaf=3)
    if model_name == "hist_gradient_boosting":
        return HistGradientBoostingClassifier(random_state=RANDOM_STATE, max_iter=120)
    raise ValueError(f"Unknown classifier model: {model_name}")


def train_regression_model(
    dataset_path: Path | str,
    target: str,
    *,
    model_name: str = "ridge",
    sample: int | None = None,
) -> ModelBundle:
    if target not in REGRESSION_TARGETS:
        raise ValueError(f"Unsupported regression target: {target}")
    frame = read_dataset(dataset_path, sample=sample)
    model_frame = frame.dropna(subset=[target]).reset_index(drop=True)
    x = records_to_frame(model_frame)
    y_original = pd.to_numeric(model_frame[target], errors="coerce").to_numpy(dtype=float)
    target_transform = "log1p" if target == "total_cost_hkd" else None
    y_train_values = np.log1p(y_original) if target_transform == "log1p" else y_original

    x_train, x_test, y_train, y_test, original_train, original_test, frame_train, frame_test = train_test_split(
        x,
        y_train_values,
        y_original,
        model_frame,
        test_size=TEST_SIZE,
        random_state=RANDOM_STATE,
    )
    estimator = Pipeline(
        steps=[
            ("preprocessor", make_preprocessor()),
            ("model", regression_estimator(model_name)),
        ]
    )
    estimator.fit(x_train, y_train)
    raw_pred = estimator.predict(x_test)
    y_pred = np.expm1(raw_pred) if target_transform == "log1p" else raw_pred
    y_pred = np.maximum(y_pred, 0)
    metrics = regression_metrics(original_test, y_pred)
    cv_pred = cross_validated_regression_predictions(x, y_train_values, target_transform, model_name)
    quantiles = residual_quantiles(y_original, cv_pred)
    intervals = [prediction_interval(point, quantiles) for point in y_pred]
    metrics["empirical_coverage"] = empirical_coverage(original_test, intervals)
    metrics["calibration_method"] = "cross_validated_residual_quantiles"
    bundle = ModelBundle(
        target=target,
        model_name=model_name,
        task_type="regression",
        estimator=estimator,
        feature_contract=feature_contract(),
        feature_names=feature_names(estimator.named_steps["preprocessor"]),
        metrics=metrics,
        stratified_metrics=stratified_regression_metrics(frame_test.reset_index(drop=True), original_test, y_pred),
        target_transform=target_transform,
        residual_quantiles=quantiles,
        segment_uncertainty=segment_residual_uncertainty(model_frame.reset_index(drop=True), y_original, cv_pred),
    )
    return bundle


def cross_validated_regression_predictions(
    x: pd.DataFrame,
    y_train_values: np.ndarray,
    target_transform: str | None,
    model_name: str,
) -> np.ndarray:
    estimator = Pipeline(
        steps=[
            ("preprocessor", make_preprocessor()),
            ("model", regression_estimator(model_name)),
        ]
    )
    folds = KFold(n_splits=3, shuffle=True, random_state=RANDOM_STATE)
    raw_pred = cross_val_predict(estimator, x, y_train_values, cv=folds)
    predictions = np.expm1(raw_pred) if target_transform == "log1p" else raw_pred
    return np.maximum(predictions, 0)


def train_scope_creep_classifier(
    dataset_path: Path | str,
    *,
    model_name: str = "logistic",
    sample: int | None = None,
) -> ModelBundle:
    frame = read_dataset(dataset_path, sample=sample)
    model_frame = frame[frame[CLASSIFICATION_TARGET].notna()].copy().reset_index(drop=True)
    model_frame[CLASSIFICATION_TARGET] = model_frame[CLASSIFICATION_TARGET].map(parse_label).astype(int)
    x = records_to_frame(model_frame)
    y = model_frame[CLASSIFICATION_TARGET].to_numpy(dtype=int)
    stratify = y if len(set(y.tolist())) > 1 and min(np.bincount(y)) >= 2 else None
    x_train, x_test, y_train, y_test, frame_train, frame_test = train_test_split(
        x,
        y,
        model_frame,
        test_size=TEST_SIZE,
        random_state=RANDOM_STATE,
        stratify=stratify,
    )
    estimator = Pipeline(
        steps=[
            ("preprocessor", make_preprocessor()),
            ("model", classifier_estimator(model_name)),
        ]
    )
    estimator.fit(x_train, y_train)
    probabilities = predict_probabilities(estimator, x_test)
    bundle = ModelBundle(
        target=CLASSIFICATION_TARGET,
        model_name=model_name,
        task_type="classification",
        estimator=estimator,
        feature_contract=feature_contract(),
        feature_names=feature_names(estimator.named_steps["preprocessor"]),
        metrics=classification_metrics(y_test, probabilities),
        stratified_metrics=stratified_classification_metrics(frame_test.reset_index(drop=True), y_test, probabilities),
    )
    return bundle


def parse_label(value: Any) -> bool:
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        return value.strip().lower() == "true"
    return bool(value)


def predict_probabilities(estimator: Pipeline, x: pd.DataFrame) -> np.ndarray:
    model = estimator.named_steps["model"]
    if hasattr(model, "predict_proba"):
        return estimator.predict_proba(x)[:, 1]
    decision = estimator.decision_function(x)
    return 1 / (1 + np.exp(-decision))


def train_all_targets(
    dataset_path: Path | str,
    *,
    output_dir: Path | str = MODEL_DIR,
    model_name: str = "ridge",
    sample: int | None = None,
) -> dict[str, ModelBundle]:
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)
    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    bundles: dict[str, ModelBundle] = {}
    for target in REGRESSION_TARGETS:
        bundle = train_regression_model(dataset_path, target=target, model_name=model_name, sample=sample)
        bundles[target] = bundle
        joblib.dump(bundle, output_path / f"{target}_{model_name}.joblib")
        write_training_report(bundle, REPORT_DIR / f"training_report_{target}.json")
    classifier = train_scope_creep_classifier(dataset_path, model_name="logistic", sample=sample)
    bundles[CLASSIFICATION_TARGET] = classifier
    joblib.dump(classifier, output_path / f"{CLASSIFICATION_TARGET}_logistic.joblib")
    write_training_report(classifier, REPORT_DIR / f"training_report_{CLASSIFICATION_TARGET}.json")
    write_model_card(bundles["total_cost_hkd"], REPORT_DIR / "model_card_total_cost.md")
    write_model_card(bundles[CLASSIFICATION_TARGET], REPORT_DIR / "model_card_scope_creep.md")
    write_sample_prediction_fixture(dataset_path, bundles, FIXTURE_DIR / "sample_prediction_response.json")
    return bundles


def write_training_report(bundle: ModelBundle, output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(bundle.public_metadata(), indent=2, sort_keys=True) + "\n", encoding="utf-8")


def write_sample_prediction_fixture(
    dataset_path: Path | str,
    bundles: dict[str, ModelBundle],
    output_path: Path,
) -> dict[str, Any]:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    row = pd.read_csv(dataset_path).iloc[0].to_dict()
    matter_input = {field: row[field] for field in MatterInput.model_fields if field in row}
    matter_input["risk_tolerance"] = "Medium"
    response = predict(bundles, matter_input)
    output_path.write_text(json.dumps(response, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    return response


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dataset", required=True, type=Path)
    parser.add_argument("--target", choices=REGRESSION_TARGETS)
    parser.add_argument("--model", default="ridge", choices=["dummy", "ridge", "random_forest", "hist_gradient_boosting"])
    parser.add_argument("--sample", type=int)
    parser.add_argument("--all-targets", action="store_true")
    parser.add_argument("--output-dir", type=Path, default=MODEL_DIR)
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    if args.all_targets:
        bundles = train_all_targets(args.dataset, output_dir=args.output_dir, model_name=args.model, sample=args.sample)
        print(json.dumps({target: bundle.metrics for target, bundle in bundles.items()}, indent=2, sort_keys=True))
        return 0
    if not args.target:
        raise SystemExit("--target is required unless --all-targets is used")
    bundle = train_regression_model(args.dataset, target=args.target, model_name=args.model, sample=args.sample)
    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    write_training_report(bundle, REPORT_DIR / f"training_report_{args.target}.json")
    print(json.dumps(bundle.metrics, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
