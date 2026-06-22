from types import SimpleNamespace

import numpy as np
import pandas as pd

from ml.evaluate import segment_residual_quantiles
from ml.inference import select_residual_quantiles


def test_segment_residual_quantiles_include_signed_quantiles_and_sample_size() -> None:
    frame = pd.DataFrame({"matter_type": ["Litigation", "Litigation", "M&A", "M&A"]})
    y_true = np.array([100.0, 140.0, 200.0, 280.0])
    y_pred = np.array([90.0, 120.0, 190.0, 240.0])

    quantiles = segment_residual_quantiles(frame, y_true, y_pred, min_sample_size=2)

    assert quantiles["Litigation"]["sample_size"] == 2
    assert quantiles["Litigation"]["p10"] > 0
    assert quantiles["M&A"]["p90"] > quantiles["M&A"]["p10"]


def test_select_residual_quantiles_prefers_supported_segment_and_falls_back_for_sparse_segments() -> None:
    global_quantiles = {"p10": -10.0, "p50": 0.0, "p90": 25.0, "absolute_p90": 25.0}
    segment_quantiles = {
        "Litigation": {"p10": -50.0, "p50": 5.0, "p90": 80.0, "absolute_p90": 80.0, "sample_size": 50},
        "M&A": {"p10": -5.0, "p50": 1.0, "p90": 10.0, "absolute_p90": 10.0, "sample_size": 2},
    }
    bundle = SimpleNamespace(
        residual_quantiles=global_quantiles,
        segment_residual_quantiles=segment_quantiles,
    )

    selected, method = select_residual_quantiles(bundle, {"matter_type": "Litigation"}, min_segment_size=30)
    assert selected == segment_quantiles["Litigation"]
    assert method == "segment_residual_quantiles:matter_type"

    selected, method = select_residual_quantiles(bundle, {"matter_type": "M&A"}, min_segment_size=30)
    assert selected == global_quantiles
    assert method == "residual_quantiles"
