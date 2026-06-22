"""Configuration shared by training, evaluation, and inference."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

MODEL_VERSION = "proforma-baseline-v1"

ARTIFACTS_DIR = Path("artifacts")
MODEL_DIR = ARTIFACTS_DIR / "models"
REPORT_DIR = ARTIFACTS_DIR / "reports"
FIXTURE_DIR = ARTIFACTS_DIR / "fixtures"

RANDOM_STATE = 20260622
TEST_SIZE = 0.25

REGRESSION_TARGETS = [
    "total_cost_hkd",
    "duration_days",
    "partner_hours",
    "associate_hours",
]
CLASSIFICATION_TARGET = "scope_creep_flag"


@dataclass(frozen=True)
class TrainingConfig:
    model_name: str = "ridge"
    random_state: int = RANDOM_STATE
    test_size: float = TEST_SIZE

