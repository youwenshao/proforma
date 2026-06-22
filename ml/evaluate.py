"""Evaluation and interval calibration helpers for baseline models."""

from __future__ import annotations

import math
from typing import Any

import numpy as np
import pandas as pd
from sklearn.metrics import (
    average_precision_score,
    mean_absolute_error,
    mean_squared_error,
    precision_score,
    recall_score,
    roc_auc_score,
)


def regression_metrics(y_true: np.ndarray, y_pred: np.ndarray) -> dict[str, float]:
    y_true = np.asarray(y_true, dtype=float)
    y_pred = np.asarray(y_pred, dtype=float)
    denominator = np.maximum((np.abs(y_true) + np.abs(y_pred)) / 2.0, 1e-9)
    smape = np.mean(np.abs(y_true - y_pred) / denominator)
    return {
        "mae": float(mean_absolute_error(y_true, y_pred)),
        "rmse": float(math.sqrt(mean_squared_error(y_true, y_pred))),
        "smape": float(smape),
    }


def classification_metrics(y_true: np.ndarray, probabilities: np.ndarray) -> dict[str, float]:
    y_true = np.asarray(y_true, dtype=int)
    probabilities = np.asarray(probabilities, dtype=float)
    predicted = probabilities >= 0.5
    has_both_classes = len(set(y_true.tolist())) > 1
    return {
        "roc_auc": float(roc_auc_score(y_true, probabilities)) if has_both_classes else 0.5,
        "pr_auc": float(average_precision_score(y_true, probabilities)) if has_both_classes else float(np.mean(y_true)),
        "precision": float(precision_score(y_true, predicted, zero_division=0)),
        "recall": float(recall_score(y_true, predicted, zero_division=0)),
        "calibration_error": calibration_error(y_true, probabilities),
    }


def calibration_error(y_true: np.ndarray, probabilities: np.ndarray, bins: int = 10) -> float:
    frame = pd.DataFrame({"actual": y_true, "probability": probabilities})
    frame["bin"] = pd.cut(frame["probability"], bins=np.linspace(0, 1, bins + 1), include_lowest=True)
    weighted_error = 0.0
    for _, group in frame.groupby("bin", observed=False):
        if group.empty:
            continue
        weighted_error += len(group) / len(frame) * abs(group["actual"].mean() - group["probability"].mean())
    return float(weighted_error)


def stratified_regression_metrics(
    frame: pd.DataFrame,
    y_true: np.ndarray,
    y_pred: np.ndarray,
    *,
    group_field: str = "matter_type",
) -> dict[str, dict[str, float]]:
    results: dict[str, dict[str, float]] = {}
    for group, indices in frame.groupby(group_field).groups.items():
        idx = list(indices)
        results[str(group)] = regression_metrics(y_true[idx], y_pred[idx])
        results[str(group)]["sample_size"] = float(len(idx))
    return results


def stratified_classification_metrics(
    frame: pd.DataFrame,
    y_true: np.ndarray,
    probabilities: np.ndarray,
    *,
    group_field: str = "matter_type",
) -> dict[str, dict[str, float]]:
    results: dict[str, dict[str, float]] = {}
    for group, indices in frame.groupby(group_field).groups.items():
        idx = list(indices)
        results[str(group)] = classification_metrics(y_true[idx], probabilities[idx])
        results[str(group)]["sample_size"] = float(len(idx))
    return results


def residual_quantiles(y_true: np.ndarray, y_pred: np.ndarray) -> dict[str, float]:
    residuals = np.asarray(y_true, dtype=float) - np.asarray(y_pred, dtype=float)
    return {
        "p10": float(np.quantile(residuals, 0.10)),
        "p50": float(np.quantile(residuals, 0.50)),
        "p90": float(np.quantile(residuals, 0.90)),
        "absolute_p90": float(np.quantile(np.abs(residuals), 0.90)),
    }


def segment_residual_uncertainty(
    frame: pd.DataFrame,
    y_true: np.ndarray,
    y_pred: np.ndarray,
    *,
    group_field: str = "matter_type",
) -> dict[str, float]:
    residuals = np.abs(np.asarray(y_true, dtype=float) - np.asarray(y_pred, dtype=float))
    results: dict[str, float] = {}
    for group, indices in frame.groupby(group_field).groups.items():
        idx = list(indices)
        results[str(group)] = float(np.quantile(residuals[idx], 0.90))
    return results


def segment_residual_quantiles(
    frame: pd.DataFrame,
    y_true: np.ndarray,
    y_pred: np.ndarray,
    *,
    group_field: str = "matter_type",
    min_sample_size: int = 30,
) -> dict[str, dict[str, float]]:
    residuals = np.asarray(y_true, dtype=float) - np.asarray(y_pred, dtype=float)
    results: dict[str, dict[str, float]] = {}
    for group, indices in frame.groupby(group_field).groups.items():
        idx = list(indices)
        if len(idx) < min_sample_size:
            continue
        group_residuals = residuals[idx]
        results[str(group)] = {
            "p10": float(np.quantile(group_residuals, 0.10)),
            "p50": float(np.quantile(group_residuals, 0.50)),
            "p90": float(np.quantile(group_residuals, 0.90)),
            "absolute_p90": float(np.quantile(np.abs(group_residuals), 0.90)),
            "sample_size": float(len(idx)),
        }
    return results


def prediction_interval(point: float, quantiles: dict[str, float]) -> dict[str, Any]:
    low = max(0.0, point + quantiles["p10"])
    median = max(0.0, point + quantiles["p50"])
    high = max(low, point + quantiles["p90"])
    return {
        "p10": float(min(low, median)),
        "p50": float(max(min(median, high), low)),
        "p90": float(max(high, median)),
        "confidence_level": 0.80,
        "calibration_method": "residual_quantiles",
    }


def empirical_coverage(y_true: np.ndarray, intervals: list[dict[str, Any]]) -> float:
    covered = [
        interval["p10"] <= float(actual) <= interval["p90"]
        for actual, interval in zip(y_true, intervals)
    ]
    return float(np.mean(covered)) if covered else 0.0

