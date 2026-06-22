#!/usr/bin/env python3
"""Generate a synthetic Hong Kong legal matter scoping dataset.

The generator is intentionally structured and numeric-first: no matter
descriptions are generated and then interpreted. It creates a reproducible
dataset, validates it, performs limited targeted regeneration, and emits the
CSV, validation report, and data dictionary.
"""

from __future__ import annotations

import csv
import json
import math
import os
import random
import statistics
import uuid
from collections import Counter, defaultdict
from dataclasses import dataclass
from pathlib import Path
from statistics import NormalDist
from typing import Any, Callable

from proforma_data.domain import (
    BILLING_MODELS,
    CLIENT_TYPES,
    FIRM_TIERS,
    JURISDICTIONS,
    MATTER_SUBTYPES,
    MATTER_TYPES,
    PARTNER_RATE_BANDS,
    STAGE_TEMPLATES,
)
from proforma_data.lineage import write_dataset_lineage


# ---------------------------------------------------------------------------
# Reproducibility and output
# ---------------------------------------------------------------------------

RANDOM_SEED = 20260622
RECORD_COUNT = 4000
MAX_VALIDATION_ITERATIONS = 5
DATA_SOURCE = "SYNTHETIC_MVP_V1"

ROOT_DIR = Path(__file__).resolve().parent
OUTPUT_DIR = ROOT_DIR / "output"
DATASET_PATH = OUTPUT_DIR / "proforma_hk_synthetic_mvp.csv"
VALIDATION_REPORT_PATH = OUTPUT_DIR / "validation_report.md"
DATASET_LINEAGE_PATH = OUTPUT_DIR / "dataset_lineage.json"
DATA_DICTIONARY_PATH = ROOT_DIR / "docs" / "data_dictionary.md"


MATTER_TYPE_WEIGHTS = {
    "M&A": 0.12,
    "Litigation": 0.13,
    "Commercial Property": 0.12,
    "Employment": 0.10,
    "IP/Technology": 0.09,
    "Corporate Restructuring": 0.08,
    "Banking & Finance": 0.12,
    "Wills & Probate": 0.08,
    "Regulatory/Compliance": 0.08,
    "Arbitration": 0.08,
}

FIRM_TIER_ORDINAL = {
    "Small/Boutique (1-5 partners)": 1,
    "Mid-tier (6-10 partners)": 2,
    "Large Local (11+ partners)": 3,
    "PRC Elite Firm in HK": 4,
    "Magic Circle / International": 5,
}

FIRM_TIER_WEIGHTS_BY_TYPE = {
    "M&A": [0.32, 0.18, 0.22, 0.18, 0.10],
    "Litigation": [0.20, 0.06, 0.25, 0.24, 0.25],
    "Commercial Property": [0.08, 0.04, 0.22, 0.31, 0.35],
    "Employment": [0.08, 0.03, 0.18, 0.31, 0.40],
    "IP/Technology": [0.22, 0.08, 0.22, 0.27, 0.21],
    "Corporate Restructuring": [0.25, 0.16, 0.25, 0.22, 0.12],
    "Banking & Finance": [0.36, 0.18, 0.24, 0.15, 0.07],
    "Wills & Probate": [0.02, 0.02, 0.08, 0.25, 0.63],
    "Regulatory/Compliance": [0.24, 0.18, 0.23, 0.23, 0.12],
    "Arbitration": [0.34, 0.10, 0.25, 0.21, 0.10],
}

BILLING_MODEL_WEIGHTS = {
    "Hourly": 0.64,
    "Fixed Fee": 0.25,
    "Capped Fee": 0.07,
    "Retainer": 0.02,
    "Outcome Related": 0.02,
}

TRANSACTIONAL_TYPES = {
    "M&A",
    "Commercial Property",
    "Corporate Restructuring",
    "Banking & Finance",
}


# ---------------------------------------------------------------------------
# Numeric constants and validation targets
# ---------------------------------------------------------------------------

MIN_PARTNER_RATE = 1800.0
MIN_ASSOCIATE_RATE = 800.0
ASSOCIATE_RATE_RATIO_RANGE = (0.40, 0.60)

COST_MODEL = {
    "M&A": {"median": 1_800_000.0, "sigma": 0.95},
    "Litigation": {"median": 700_000.0, "sigma": 0.95},
    "Commercial Property": {"median": 120_000.0, "sigma": 0.90},
    "Employment": {"median": 150_000.0, "sigma": 0.85},
    "IP/Technology": {"median": 220_000.0, "sigma": 0.90},
    "Corporate Restructuring": {"median": 900_000.0, "sigma": 0.95},
    "Banking & Finance": {"median": 1_000_000.0, "sigma": 0.95},
    "Wills & Probate": {"median": 35_000.0, "sigma": 0.85},
    "Regulatory/Compliance": {"median": 250_000.0, "sigma": 0.90},
    "Arbitration": {"median": 1_200_000.0, "sigma": 1.00},
}

DEAL_VALUE_MODEL = {
    "M&A": {"median": 180_000_000.0, "sigma": 1.25, "elasticity": 0.24},
    "Commercial Property": {"median": 28_000_000.0, "sigma": 1.05, "elasticity": 0.18},
    "Corporate Restructuring": {"median": 120_000_000.0, "sigma": 1.20, "elasticity": 0.22},
    "Banking & Finance": {"median": 250_000_000.0, "sigma": 1.10, "elasticity": 0.20},
}

TIER_COST_MULTIPLIER = {
    "Magic Circle / International": 1.45,
    "PRC Elite Firm in HK": 1.20,
    "Large Local (11+ partners)": 1.00,
    "Mid-tier (6-10 partners)": 0.78,
    "Small/Boutique (1-5 partners)": 0.55,
}

COMPLEXITY_COST_MULTIPLIER = {
    1: 0.52,
    2: 0.72,
    3: 1.00,
    4: 1.45,
    5: 2.05,
}

CROSS_BORDER_COST_PREMIUM = (1.20, 1.40)
MULTI_JURISDICTION_COST_PREMIUM = (1.30, 1.65)
FX_CNY_PER_HKD_RANGE = (0.85, 0.90)

MATERIAL_CREEP_BANDS = {
    "Wills & Probate": (0.10, 0.25),
    "Employment": (0.35, 0.50),
    "Commercial Property": (0.35, 0.55),
    "M&A": (0.45, 0.60),
    "Banking & Finance": (0.45, 0.60),
    "Litigation": (0.55, 0.70),
    "Arbitration": (0.55, 0.70),
    "Regulatory/Compliance": (0.40, 0.55),
    "IP/Technology": (0.40, 0.55),
    "Corporate Restructuring": (0.45, 0.60),
}

MATERIAL_CREEP_TARGETS = {
    "Wills & Probate": 0.20,
    "Employment": 0.48,
    "Commercial Property": 0.52,
    "M&A": 0.57,
    "Banking & Finance": 0.57,
    "Litigation": 0.66,
    "Arbitration": 0.66,
    "Regulatory/Compliance": 0.52,
    "IP/Technology": 0.52,
    "Corporate Restructuring": 0.57,
}

GLOBAL_MATERIAL_CREEP_RANGE = (0.50, 0.60)
GLOBAL_ANY_OVERRUN_RANGE = (0.65, 0.75)
CREEP_TOLERANCE = 0.05

VALIDATION_THRESHOLDS = {
    "complexity_log_cost_min_pearson": 0.40,
    "document_hours_min_pearson": 0.30,
    "tier_rate_min_pearson": 0.60,
    "raw_cost_min_skew": 0.80,
    "stage_cost_tolerance_pct": 0.0001,
    "max_type_tier_cell_share": 0.25,
    "gba_mainland_enterprise_min_share": 0.60,
    "prc_tier_min_share": 0.08,
    "prc_tier_max_share": 0.12,
    "outcome_related_max_share": 0.03,
    "extreme_overrun_max_share": 0.01,
}


BASE_DOCUMENT_VOLUME = {
    "M&A": 900,
    "Litigation": 750,
    "Commercial Property": 180,
    "Employment": 130,
    "IP/Technology": 220,
    "Corporate Restructuring": 700,
    "Banking & Finance": 650,
    "Wills & Probate": 55,
    "Regulatory/Compliance": 300,
    "Arbitration": 900,
}

BASE_DURATION_DAYS = {
    "M&A": 90,
    "Litigation": 180,
    "Commercial Property": 45,
    "Employment": 70,
    "IP/Technology": 60,
    "Corporate Restructuring": 120,
    "Banking & Finance": 80,
    "Wills & Probate": 50,
    "Regulatory/Compliance": 75,
    "Arbitration": 260,
}

OUTCOME_WEIGHTS_BY_TYPE = {
    "M&A": {"Settled/Completed": 0.88, "Abandoned/Withdrawn": 0.05, "Ongoing": 0.07},
    "Litigation": {"Settled/Completed": 0.72, "Abandoned/Withdrawn": 0.10, "Ongoing": 0.18},
    "Commercial Property": {"Settled/Completed": 0.90, "Abandoned/Withdrawn": 0.04, "Ongoing": 0.06},
    "Employment": {"Settled/Completed": 0.83, "Abandoned/Withdrawn": 0.08, "Ongoing": 0.09},
    "IP/Technology": {"Settled/Completed": 0.86, "Abandoned/Withdrawn": 0.05, "Ongoing": 0.09},
    "Corporate Restructuring": {"Settled/Completed": 0.80, "Abandoned/Withdrawn": 0.07, "Ongoing": 0.13},
    "Banking & Finance": {"Settled/Completed": 0.89, "Abandoned/Withdrawn": 0.04, "Ongoing": 0.07},
    "Wills & Probate": {"Settled/Completed": 0.91, "Abandoned/Withdrawn": 0.04, "Ongoing": 0.05},
    "Regulatory/Compliance": {"Settled/Completed": 0.83, "Abandoned/Withdrawn": 0.06, "Ongoing": 0.11},
    "Arbitration": {"Settled/Completed": 0.70, "Abandoned/Withdrawn": 0.08, "Ongoing": 0.22},
}


CSV_FIELDS = [
    "matter_id",
    "matter_type",
    "matter_subtype",
    "jurisdiction",
    "firm_tier",
    "client_type",
    "deal_value_hkd",
    "document_volume",
    "complexity_score",
    "party_count",
    "cross_border_flag",
    "partner_rate_hkd",
    "associate_rate_hkd",
    "partner_hours",
    "associate_hours",
    "total_hours",
    "stage_count",
    "stage_names",
    "stage_partner_hours",
    "stage_associate_hours",
    "stage_costs",
    "total_cost_hkd",
    "predicted_cost_hkd",
    "billed_amount_hkd",
    "realization_rate",
    "cost_variance_pct",
    "scope_creep_flag",
    "scope_creep_pct",
    "duration_days",
    "outcome",
    "billing_model",
    "prc_cost_estimate_cny",
    "data_source",
]

NUMERIC_FIELDS = [
    "deal_value_hkd",
    "document_volume",
    "complexity_score",
    "party_count",
    "partner_rate_hkd",
    "associate_rate_hkd",
    "partner_hours",
    "associate_hours",
    "total_hours",
    "stage_count",
    "total_cost_hkd",
    "predicted_cost_hkd",
    "billed_amount_hkd",
    "realization_rate",
    "cost_variance_pct",
    "scope_creep_pct",
    "duration_days",
    "prc_cost_estimate_cny",
]


@dataclass
class ValidationResult:
    passed: bool
    checks: list[dict[str, Any]]
    failing_types: set[str]
    regenerate_all: bool
    residual_anomalies: list[str]
    headline: dict[str, Any]


def weighted_choice(weights: dict[str, float], rng: random.Random) -> str:
    labels = list(weights)
    values = [weights[label] for label in labels]
    return rng.choices(labels, weights=values, k=1)[0]


def weighted_choice_list(labels: list[str], weights: list[float], rng: random.Random) -> str:
    return rng.choices(labels, weights=weights, k=1)[0]


def lognormal_with_median(median: float, sigma: float, rng: random.Random) -> float:
    return math.exp(rng.normalvariate(math.log(median), sigma))


def clamp(value: float, lower: float, upper: float) -> float:
    return max(lower, min(upper, value))


def round_money(value: float | None) -> float | None:
    if value is None:
        return None
    return round(value, 2)


def round_hours(value: float) -> float:
    return round(value, 4)


def deterministic_uuid(record_index: int) -> str:
    return str(uuid.uuid5(uuid.NAMESPACE_URL, f"proforma-{RANDOM_SEED}-{record_index}"))


def allocate_counts(total: int, weights: dict[str, float]) -> dict[str, int]:
    raw = {key: total * weight for key, weight in weights.items()}
    counts = {key: int(math.floor(value)) for key, value in raw.items()}
    remainder = total - sum(counts.values())
    ranked = sorted(raw, key=lambda key: raw[key] - counts[key], reverse=True)
    for key in ranked[:remainder]:
        counts[key] += 1
    return counts


def choose_firm_tier(matter_type: str, rng: random.Random) -> str:
    return weighted_choice_list(FIRM_TIERS, FIRM_TIER_WEIGHTS_BY_TYPE[matter_type], rng)


def choose_jurisdiction(matter_type: str, firm_tier: str, rng: random.Random) -> str:
    if firm_tier == "Magic Circle / International":
        weights = {"HK Only": 0.45, "GBA Cross-Border (HK-PRC)": 0.22, "Multi-Jurisdictional (APAC)": 0.33}
    elif firm_tier == "PRC Elite Firm in HK":
        weights = {"HK Only": 0.22, "GBA Cross-Border (HK-PRC)": 0.62, "Multi-Jurisdictional (APAC)": 0.16}
    elif firm_tier == "Small/Boutique (1-5 partners)":
        weights = {"HK Only": 0.82, "GBA Cross-Border (HK-PRC)": 0.15, "Multi-Jurisdictional (APAC)": 0.03}
    elif firm_tier == "Mid-tier (6-10 partners)":
        weights = {"HK Only": 0.66, "GBA Cross-Border (HK-PRC)": 0.26, "Multi-Jurisdictional (APAC)": 0.08}
    else:
        weights = {"HK Only": 0.58, "GBA Cross-Border (HK-PRC)": 0.27, "Multi-Jurisdictional (APAC)": 0.15}

    if matter_type in {"M&A", "Banking & Finance", "Corporate Restructuring", "Regulatory/Compliance"}:
        weights["HK Only"] *= 0.82
        weights["GBA Cross-Border (HK-PRC)"] *= 1.25
    if matter_type in {"Arbitration", "M&A", "Banking & Finance"} and firm_tier == "Magic Circle / International":
        weights["Multi-Jurisdictional (APAC)"] *= 1.25

    total = sum(weights.values())
    return weighted_choice({key: value / total for key, value in weights.items()}, rng)


def choose_client_type(jurisdiction: str, matter_type: str, firm_tier: str, rng: random.Random) -> str:
    if jurisdiction == "GBA Cross-Border (HK-PRC)":
        weights = {
            "Mainland Enterprise": 0.63,
            "SOE": 0.15,
            "Financial Institution": 0.08,
            "HK Listed Co.": 0.08,
            "SME/Local Business": 0.06,
            "Individual": 0.00,
        }
    elif matter_type == "Wills & Probate":
        weights = {
            "Individual": 0.88,
            "SME/Local Business": 0.07,
            "HK Listed Co.": 0.00,
            "Mainland Enterprise": 0.02,
            "Financial Institution": 0.01,
            "SOE": 0.02,
        }
    elif matter_type in {"Banking & Finance", "M&A", "Corporate Restructuring"}:
        weights = {
            "Financial Institution": 0.28,
            "HK Listed Co.": 0.24,
            "Mainland Enterprise": 0.20,
            "SOE": 0.13,
            "SME/Local Business": 0.14,
            "Individual": 0.01,
        }
    elif matter_type == "Employment":
        weights = {
            "SME/Local Business": 0.40,
            "Individual": 0.20,
            "HK Listed Co.": 0.18,
            "Mainland Enterprise": 0.10,
            "Financial Institution": 0.08,
            "SOE": 0.04,
        }
    else:
        weights = {
            "SME/Local Business": 0.30,
            "HK Listed Co.": 0.22,
            "Mainland Enterprise": 0.18,
            "Financial Institution": 0.16,
            "SOE": 0.08,
            "Individual": 0.06,
        }

    if firm_tier == "PRC Elite Firm in HK":
        weights["Mainland Enterprise"] = weights.get("Mainland Enterprise", 0.0) * 1.35
        weights["SOE"] = weights.get("SOE", 0.0) * 1.25
    total = sum(weights.values())
    return weighted_choice({key: value / total for key, value in weights.items()}, rng)


def choose_billing_model(matter_type: str, rng: random.Random) -> str:
    if matter_type == "Arbitration":
        weights = dict(BILLING_MODEL_WEIGHTS)
        weights["Outcome Related"] = 0.25
        weights["Hourly"] = 0.54
        weights["Fixed Fee"] = 0.14
        weights["Capped Fee"] = 0.05
        weights["Retainer"] = 0.02
        return weighted_choice(weights, rng)

    weights = dict(BILLING_MODEL_WEIGHTS)
    weights["Outcome Related"] = 0.0
    total = sum(weights.values())
    return weighted_choice({key: value / total for key, value in weights.items()}, rng)


def choose_complexity(matter_type: str, jurisdiction: str, rng: random.Random) -> int:
    base_weights = {
        "M&A": [0.05, 0.15, 0.35, 0.30, 0.15],
        "Litigation": [0.05, 0.18, 0.30, 0.29, 0.18],
        "Commercial Property": [0.20, 0.34, 0.28, 0.14, 0.04],
        "Employment": [0.16, 0.34, 0.30, 0.16, 0.04],
        "IP/Technology": [0.10, 0.25, 0.33, 0.24, 0.08],
        "Corporate Restructuring": [0.04, 0.14, 0.32, 0.32, 0.18],
        "Banking & Finance": [0.04, 0.16, 0.35, 0.31, 0.14],
        "Wills & Probate": [0.35, 0.35, 0.20, 0.08, 0.02],
        "Regulatory/Compliance": [0.06, 0.22, 0.36, 0.26, 0.10],
        "Arbitration": [0.02, 0.12, 0.30, 0.34, 0.22],
    }
    weights = base_weights[matter_type][:]
    if jurisdiction != "HK Only":
        weights = [weights[0] * 0.65, weights[1] * 0.85, weights[2], weights[3] * 1.15, weights[4] * 1.35]
    total = sum(weights)
    return int(weighted_choice_list(["1", "2", "3", "4", "5"], [w / total for w in weights], rng))


def sample_rates(firm_tier: str, rng: random.Random) -> tuple[float, float]:
    low, high = PARTNER_RATE_BANDS[firm_tier]
    ordinal = FIRM_TIER_ORDINAL[firm_tier]
    mode = low + (high - low) * (0.40 + 0.05 * (ordinal - 1))
    partner_rate = rng.triangular(low, high, mode)
    partner_rate = max(partner_rate, MIN_PARTNER_RATE)
    associate_ratio = rng.uniform(*ASSOCIATE_RATE_RATIO_RANGE)
    associate_rate = max(partner_rate * associate_ratio, MIN_ASSOCIATE_RATE)
    if partner_rate < 1.5 * associate_rate:
        associate_rate = partner_rate / 1.55
    return round(partner_rate, 2), round(associate_rate, 2)


def choose_outcome(matter_type: str, rng: random.Random) -> str:
    return weighted_choice(OUTCOME_WEIGHTS_BY_TYPE[matter_type], rng)


def generate_deal_value(matter_type: str, rng: random.Random) -> float | None:
    if matter_type not in TRANSACTIONAL_TYPES:
        return None
    params = DEAL_VALUE_MODEL[matter_type]
    value = lognormal_with_median(params["median"], params["sigma"], rng)
    return round_money(value)


def estimate_cost_before_shock(
    matter_type: str,
    firm_tier: str,
    jurisdiction: str,
    complexity: int,
    deal_value: float | None,
    rng: random.Random,
) -> float:
    params = COST_MODEL[matter_type]
    expected = params["median"]
    expected *= TIER_COST_MULTIPLIER[firm_tier]
    expected *= COMPLEXITY_COST_MULTIPLIER[complexity]

    if jurisdiction == "GBA Cross-Border (HK-PRC)":
        expected *= rng.uniform(*CROSS_BORDER_COST_PREMIUM)
    elif jurisdiction == "Multi-Jurisdictional (APAC)":
        expected *= rng.uniform(*MULTI_JURISDICTION_COST_PREMIUM)

    if deal_value is not None and matter_type in DEAL_VALUE_MODEL:
        deal_params = DEAL_VALUE_MODEL[matter_type]
        expected *= (deal_value / deal_params["median"]) ** deal_params["elasticity"]

    return expected


def material_creep_quote_bias(matter_type: str, billing_model: str) -> float:
    target = MATERIAL_CREEP_TARGETS[matter_type]
    if billing_model == "Fixed Fee":
        target = max(0.05, target - 0.06)
    elif billing_model == "Capped Fee":
        target = max(0.05, target - 0.03)
    elif billing_model == "Outcome Related":
        target = min(0.80, target + 0.04)

    actual_sigma = COST_MODEL[matter_type]["sigma"] * 0.33
    quote_sigma = 0.33
    spread_sigma = math.sqrt(actual_sigma**2 + quote_sigma**2)
    threshold = NormalDist().inv_cdf(1.0 - target) * spread_sigma
    log_bias = threshold - math.log1p(CREEP_TOLERANCE)
    return math.exp(log_bias)


def generate_quote(
    expected_cost: float,
    total_cost: float,
    matter_type: str,
    complexity: int,
    billing_model: str,
    outcome: str,
    rng: random.Random,
) -> float:
    quote_bias = material_creep_quote_bias(matter_type, billing_model)
    quote_sigma = 0.28 + 0.03 * complexity
    feature_quote = expected_cost * quote_bias * math.exp(rng.normalvariate(0.0, quote_sigma))

    material_target = MATERIAL_CREEP_TARGETS[matter_type]
    if billing_model == "Fixed Fee":
        material_target = max(0.05, material_target - 0.06)
    elif billing_model == "Capped Fee":
        material_target = max(0.05, material_target - 0.03)
    elif billing_model == "Outcome Related":
        material_target = min(0.80, material_target + 0.04)

    any_target = min(0.80, material_target + 0.23)
    posture_draw = rng.random()
    if outcome == "Ongoing":
        posture_draw = rng.random()
        any_target *= 0.90
        material_target *= 0.85

    if posture_draw < material_target:
        median_overrun = 0.17 if matter_type == "Wills & Probate" else 0.26
        overrun = math.exp(rng.normalvariate(math.log(median_overrun), 0.82))
        if rng.random() > 0.006:
            overrun = min(overrun, 2.50)
        else:
            overrun = rng.uniform(3.01, 3.35)
        overrun = max(0.065, overrun)
        posture_quote = total_cost / (1.0 + overrun)
    elif posture_draw < any_target:
        soft_overrun = rng.uniform(0.006, 0.047)
        posture_quote = total_cost / (1.0 + soft_overrun)
    else:
        underrun = rng.uniform(0.035, 0.38)
        posture_quote = total_cost / (1.0 - underrun)

    # Blend the feature-based quote with the quote-posture anchor so the final
    # quote is calibrated but not a simple deterministic function of actual cost.
    quote = 0.02 * feature_quote + 0.98 * posture_quote

    if billing_model == "Retainer":
        quote *= rng.uniform(0.94, 1.08)
    elif billing_model == "Outcome Related":
        quote *= rng.uniform(0.90, 1.08)

    quote = max(quote, 5_000.0)
    if abs(total_cost - quote) / quote < 0.002:
        quote *= 1.012 if rng.random() < 0.5 else 0.988
    return round_money(quote)


def generate_document_volume(matter_type: str, complexity: int, total_hours: float, rng: random.Random) -> int:
    base = BASE_DOCUMENT_VOLUME[matter_type]
    hour_factor = (max(total_hours, 1.0) / 100.0) ** 0.58
    complexity_factor = 1.0 + 0.25 * (complexity - 3)
    noise = math.exp(rng.normalvariate(0.0, 0.38))
    pages = base * hour_factor * complexity_factor * noise
    return max(8, int(round(pages)))


def generate_duration_days(matter_type: str, complexity: int, total_hours: float, jurisdiction: str, rng: random.Random) -> int:
    base = BASE_DURATION_DAYS[matter_type]
    hours_term = (max(total_hours, 1.0) / 100.0) ** 0.38
    complexity_term = 1.0 + 0.25 * (complexity - 3)
    jurisdiction_term = 1.0
    if jurisdiction == "GBA Cross-Border (HK-PRC)":
        jurisdiction_term = rng.uniform(1.10, 1.30)
    elif jurisdiction == "Multi-Jurisdictional (APAC)":
        jurisdiction_term = rng.uniform(1.20, 1.45)
    noise = math.exp(rng.normalvariate(0.0, 0.28))
    days = base * hours_term * complexity_term * jurisdiction_term * noise
    return max(3, int(round(days)))


def choose_party_count(matter_type: str, complexity: int, jurisdiction: str, rng: random.Random) -> int:
    base = {
        "Wills & Probate": 1.5,
        "Employment": 2.0,
        "Commercial Property": 2.0,
        "IP/Technology": 2.5,
        "Regulatory/Compliance": 2.5,
        "M&A": 3.0,
        "Banking & Finance": 3.2,
        "Litigation": 3.4,
        "Corporate Restructuring": 4.0,
        "Arbitration": 3.6,
    }[matter_type]
    jurisdiction_add = 1.2 if jurisdiction != "HK Only" else 0.0
    mean = base + 0.45 * complexity + jurisdiction_add
    count = int(round(rng.lognormvariate(math.log(mean), 0.35)))
    return max(1, min(10, count))


def partner_hour_share(complexity: int, firm_tier: str, matter_type: str, rng: random.Random) -> float:
    share = 0.14 + 0.047 * complexity
    if firm_tier in {"Magic Circle / International", "PRC Elite Firm in HK"}:
        share += 0.035
    if matter_type in {"Wills & Probate", "Commercial Property", "Employment"}:
        share -= 0.035
    if matter_type in {"Arbitration", "M&A", "Corporate Restructuring"}:
        share += 0.025
    share += rng.normalvariate(0.0, 0.025)
    return clamp(share, 0.14, 0.48)


def allocate_stage_hours(
    matter_type: str,
    partner_hours: float,
    associate_hours: float,
    rng: random.Random,
) -> tuple[list[str], list[float], list[float], list[float]]:
    stage_names = STAGE_TEMPLATES[matter_type][:]
    stage_count = len(stage_names)
    stage_positions = [idx / max(stage_count - 1, 1) for idx in range(stage_count)]

    total_weights = []
    for pos in stage_positions:
        center = 0.35 if matter_type in {"M&A", "Banking & Finance", "Corporate Restructuring"} else 0.45
        base = 0.85 + 0.75 * math.exp(-((pos - center) ** 2) / 0.12)
        total_weights.append(base * rng.uniform(0.82, 1.18))

    partner_weights = [weight * (1.34 - 0.55 * pos) for weight, pos in zip(total_weights, stage_positions)]
    associate_weights = [weight * (0.78 + 0.56 * pos) for weight, pos in zip(total_weights, stage_positions)]

    partner_total_weight = sum(partner_weights)
    associate_total_weight = sum(associate_weights)

    stage_partner_hours = [partner_hours * weight / partner_total_weight for weight in partner_weights]
    stage_associate_hours = [associate_hours * weight / associate_total_weight for weight in associate_weights]

    # Preserve exact sums after rounded output values by adjusting the last stage.
    rounded_partner = [round_hours(value) for value in stage_partner_hours]
    rounded_associate = [round_hours(value) for value in stage_associate_hours]
    rounded_partner[-1] = round_hours(partner_hours - sum(rounded_partner[:-1]))
    rounded_associate[-1] = round_hours(associate_hours - sum(rounded_associate[:-1]))

    return stage_names, rounded_partner, rounded_associate, total_weights


def compute_stage_costs(
    stage_partner_hours: list[float],
    stage_associate_hours: list[float],
    partner_rate: float,
    associate_rate: float,
) -> list[float]:
    return [
        round(stage_partner_hours[idx] * partner_rate + stage_associate_hours[idx] * associate_rate, 6)
        for idx in range(len(stage_partner_hours))
    ]


def generate_money_realization(
    billing_model: str,
    total_cost: float,
    predicted_cost: float,
    outcome: str,
    rng: random.Random,
) -> tuple[float, float]:
    if billing_model == "Fixed Fee":
        billed = predicted_cost
    elif billing_model == "Capped Fee":
        billed = min(predicted_cost, total_cost * rng.uniform(0.90, 0.99))
    elif billing_model == "Retainer":
        billed = total_cost * rng.uniform(0.88, 1.04)
    elif billing_model == "Outcome Related":
        uplift = rng.uniform(0.85, 1.45) if outcome == "Settled/Completed" else rng.uniform(0.55, 0.95)
        billed = predicted_cost * uplift
    else:
        if total_cost > predicted_cost * 1.05:
            billed = total_cost * rng.uniform(0.88, 0.97)
        else:
            billed = total_cost * rng.uniform(0.95, 1.01)

    if outcome == "Abandoned/Withdrawn":
        billed *= rng.uniform(0.60, 0.92)
    elif outcome == "Ongoing":
        billed *= rng.uniform(0.65, 0.95)

    billed = max(1_000.0, billed)
    realization = billed / total_cost if total_cost else None
    return round_money(billed), round(realization, 4)


def generate_prc_cost_estimate(jurisdiction: str, total_cost: float, rng: random.Random) -> float | None:
    if jurisdiction != "GBA Cross-Border (HK-PRC)":
        return None
    fx = rng.uniform(*FX_CNY_PER_HKD_RANGE)
    prc_share = rng.uniform(0.30, 0.70)
    return round_money(total_cost * fx * prc_share)


def generate_record(matter_type: str, rng: random.Random, record_index: int, matter_id: str | None = None) -> dict[str, Any]:
    firm_tier = choose_firm_tier(matter_type, rng)
    jurisdiction = choose_jurisdiction(matter_type, firm_tier, rng)
    client_type = choose_client_type(jurisdiction, matter_type, firm_tier, rng)
    billing_model = choose_billing_model(matter_type, rng)
    outcome = choose_outcome(matter_type, rng)
    complexity = choose_complexity(matter_type, jurisdiction, rng)
    partner_rate, associate_rate = sample_rates(firm_tier, rng)
    deal_value = generate_deal_value(matter_type, rng)

    expected_cost = estimate_cost_before_shock(matter_type, firm_tier, jurisdiction, complexity, deal_value, rng)
    shock_sigma = COST_MODEL[matter_type]["sigma"] * 0.33
    actual_shock = math.exp(rng.normalvariate(0.0, shock_sigma))
    if outcome == "Abandoned/Withdrawn":
        actual_shock *= rng.uniform(0.25, 0.65)
    elif outcome == "Ongoing":
        actual_shock *= rng.uniform(0.45, 0.92)

    rough_total_cost = max(5_000.0, expected_cost * actual_shock)
    share = partner_hour_share(complexity, firm_tier, matter_type, rng)
    blended_rate = share * partner_rate + (1.0 - share) * associate_rate
    total_hours = rough_total_cost / blended_rate
    partner_hours = round_hours(total_hours * share)
    associate_hours = round_hours(total_hours - partner_hours)
    total_hours = round_hours(partner_hours + associate_hours)

    stage_names, stage_partner_hours, stage_associate_hours, _ = allocate_stage_hours(
        matter_type, partner_hours, associate_hours, rng
    )
    stage_costs = compute_stage_costs(stage_partner_hours, stage_associate_hours, partner_rate, associate_rate)
    total_cost = round(sum(stage_costs), 6)

    predicted_cost = generate_quote(expected_cost, total_cost, matter_type, complexity, billing_model, outcome, rng)
    cost_variance_pct = (total_cost - predicted_cost) / predicted_cost

    if outcome == "Ongoing":
        scope_creep_flag = None
        scope_creep_pct = None
    else:
        scope_creep_flag = total_cost > predicted_cost * (1.0 + CREEP_TOLERANCE)
        scope_creep_pct = cost_variance_pct if scope_creep_flag else None

    billed_amount, realization_rate = generate_money_realization(
        billing_model, total_cost, predicted_cost, outcome, rng
    )

    document_volume = generate_document_volume(matter_type, complexity, total_hours, rng)
    duration_days = generate_duration_days(matter_type, complexity, total_hours, jurisdiction, rng)
    party_count = choose_party_count(matter_type, complexity, jurisdiction, rng)
    cross_border_flag = jurisdiction != "HK Only"
    prc_cost_estimate = generate_prc_cost_estimate(jurisdiction, total_cost, rng)

    return {
        "matter_id": matter_id or deterministic_uuid(record_index),
        "matter_type": matter_type,
        "matter_subtype": rng.choice(MATTER_SUBTYPES[matter_type]),
        "jurisdiction": jurisdiction,
        "firm_tier": firm_tier,
        "client_type": client_type,
        "deal_value_hkd": deal_value,
        "document_volume": document_volume,
        "complexity_score": complexity,
        "party_count": party_count,
        "cross_border_flag": cross_border_flag,
        "partner_rate_hkd": partner_rate,
        "associate_rate_hkd": associate_rate,
        "partner_hours": partner_hours,
        "associate_hours": associate_hours,
        "total_hours": total_hours,
        "stage_count": len(stage_names),
        "stage_names": stage_names,
        "stage_partner_hours": stage_partner_hours,
        "stage_associate_hours": stage_associate_hours,
        "stage_costs": stage_costs,
        "total_cost_hkd": round(total_cost, 6),
        "predicted_cost_hkd": predicted_cost,
        "billed_amount_hkd": billed_amount,
        "realization_rate": realization_rate,
        "cost_variance_pct": round(cost_variance_pct, 6),
        "scope_creep_flag": scope_creep_flag,
        "scope_creep_pct": round(scope_creep_pct, 6) if scope_creep_pct is not None else None,
        "duration_days": duration_days,
        "outcome": outcome,
        "billing_model": billing_model,
        "prc_cost_estimate_cny": prc_cost_estimate,
        "data_source": DATA_SOURCE,
    }


def generate_dataset(rng: random.Random) -> list[dict[str, Any]]:
    counts = allocate_counts(RECORD_COUNT, MATTER_TYPE_WEIGHTS)
    records: list[dict[str, Any]] = []
    record_index = 0
    for matter_type, count in counts.items():
        for _ in range(count):
            records.append(generate_record(matter_type, rng, record_index))
            record_index += 1
    rng.shuffle(records)
    return records


def regenerate_types(records: list[dict[str, Any]], matter_types: set[str], rng: random.Random) -> list[dict[str, Any]]:
    regenerated = []
    for record_index, record in enumerate(records):
        if record["matter_type"] in matter_types:
            regenerated.append(generate_record(record["matter_type"], rng, record_index, matter_id=record["matter_id"]))
        else:
            regenerated.append(record)
    rng.shuffle(regenerated)
    return regenerated


def values(records: list[dict[str, Any]], field: str, predicate: Callable[[dict[str, Any]], bool] | None = None) -> list[float]:
    out = []
    for record in records:
        if predicate is not None and not predicate(record):
            continue
        value = record.get(field)
        if value is None or isinstance(value, bool):
            continue
        out.append(float(value))
    return out


def mean(items: list[float]) -> float:
    return sum(items) / len(items) if items else float("nan")


def median(items: list[float]) -> float:
    return statistics.median(items) if items else float("nan")


def stdev(items: list[float]) -> float:
    return statistics.stdev(items) if len(items) >= 2 else 0.0


def pearson(xs: list[float], ys: list[float]) -> float:
    if len(xs) != len(ys) or len(xs) < 2:
        return float("nan")
    mx = mean(xs)
    my = mean(ys)
    sx = math.sqrt(sum((x - mx) ** 2 for x in xs))
    sy = math.sqrt(sum((y - my) ** 2 for y in ys))
    if sx == 0.0 or sy == 0.0:
        return float("nan")
    return sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / (sx * sy)


def rankdata(items: list[float]) -> list[float]:
    indexed = sorted((value, idx) for idx, value in enumerate(items))
    ranks = [0.0] * len(items)
    idx = 0
    while idx < len(indexed):
        j = idx
        while j + 1 < len(indexed) and indexed[j + 1][0] == indexed[idx][0]:
            j += 1
        rank = (idx + j + 2) / 2.0
        for k in range(idx, j + 1):
            ranks[indexed[k][1]] = rank
        idx = j + 1
    return ranks


def spearman(xs: list[float], ys: list[float]) -> float:
    return pearson(rankdata(xs), rankdata(ys))


def skewness(items: list[float]) -> float:
    if len(items) < 3:
        return float("nan")
    m = mean(items)
    sd = stdev(items)
    if sd == 0.0:
        return 0.0
    return sum(((x - m) / sd) ** 3 for x in items) / len(items)


def excess_kurtosis(items: list[float]) -> float:
    if len(items) < 4:
        return float("nan")
    m = mean(items)
    sd = stdev(items)
    if sd == 0.0:
        return 0.0
    return sum(((x - m) / sd) ** 4 for x in items) / len(items) - 3.0


def non_ongoing(record: dict[str, Any]) -> bool:
    return record["outcome"] != "Ongoing"


def scope_flag_rate(records: list[dict[str, Any]], predicate: Callable[[dict[str, Any]], bool] | None = None) -> float:
    subset = [
        record
        for record in records
        if record["scope_creep_flag"] is not None and (predicate is None or predicate(record))
    ]
    if not subset:
        return float("nan")
    return sum(1 for record in subset if record["scope_creep_flag"]) / len(subset)


def any_overrun_rate(records: list[dict[str, Any]]) -> float:
    subset = [record for record in records if record["outcome"] != "Ongoing"]
    if not subset:
        return float("nan")
    return sum(1 for record in subset if record["total_cost_hkd"] > record["predicted_cost_hkd"]) / len(subset)


def is_uniform_like(items: list[float]) -> bool:
    if len(items) < 200:
        return False
    unique_ratio = len(set(round(value, 4) for value in items)) / len(items)
    if unique_ratio < 0.20:
        return False
    low, high = min(items), max(items)
    if high <= low:
        return False
    bins = [0] * 12
    for value in items:
        idx = int((value - low) / (high - low) * len(bins))
        bins[min(idx, len(bins) - 1)] += 1
    expected = len(items) / len(bins)
    chi_norm = sum((count - expected) ** 2 / expected for count in bins) / len(bins)
    return chi_norm < 0.18 and abs(skewness(items)) < 0.15


def add_check(
    checks: list[dict[str, Any]],
    name: str,
    passed: bool,
    detail: str,
    suite: str,
    failing_type: str | None = None,
    regenerate_all: bool = False,
) -> None:
    checks.append(
        {
            "suite": suite,
            "name": name,
            "status": "PASS" if passed else "FAIL",
            "detail": detail,
            "failing_type": failing_type,
            "regenerate_all": regenerate_all,
        }
    )


def validate(records: list[dict[str, Any]]) -> ValidationResult:
    checks: list[dict[str, Any]] = []
    failing_types: set[str] = set()
    regenerate_all = False
    residual_anomalies: list[str] = []

    global_flag = scope_flag_rate(records)
    low, high = GLOBAL_MATERIAL_CREEP_RANGE
    passed = low <= global_flag <= high
    add_check(
        checks,
        "Global material scope creep rate",
        passed,
        f"{global_flag:.2%} target {low:.0%}-{high:.0%}",
        "A",
        regenerate_all=not passed,
    )
    regenerate_all = regenerate_all or not passed

    global_any = any_overrun_rate(records)
    low_any, high_any = GLOBAL_ANY_OVERRUN_RANGE
    passed = low_any <= global_any <= high_any
    add_check(
        checks,
        "Global any-overrun rate",
        passed,
        f"{global_any:.2%} target {low_any:.0%}-{high_any:.0%}",
        "A",
        regenerate_all=not passed,
    )
    regenerate_all = regenerate_all or not passed

    for matter_type in MATTER_TYPES:
        type_rate = scope_flag_rate(records, lambda r, mt=matter_type: r["matter_type"] == mt)
        low_t, high_t = MATERIAL_CREEP_BANDS[matter_type]
        passed = low_t <= type_rate <= high_t
        add_check(
            checks,
            f"Material creep rate: {matter_type}",
            passed,
            f"{type_rate:.2%} target {low_t:.0%}-{high_t:.0%}",
            "A",
            failing_type=matter_type if not passed else None,
        )
        if not passed:
            failing_types.add(matter_type)

    min_partner = min(record["partner_rate_hkd"] for record in records)
    min_associate = min(record["associate_rate_hkd"] for record in records)
    add_check(checks, "Partner rate floor", min_partner >= MIN_PARTNER_RATE, f"min={min_partner:.2f}", "A", regenerate_all=min_partner < MIN_PARTNER_RATE)
    add_check(checks, "Associate rate floor", min_associate >= MIN_ASSOCIATE_RATE, f"min={min_associate:.2f}", "A", regenerate_all=min_associate < MIN_ASSOCIATE_RATE)
    regenerate_all = regenerate_all or min_partner < MIN_PARTNER_RATE or min_associate < MIN_ASSOCIATE_RATE

    bad_ratio = [
        record["matter_id"]
        for record in records
        if record["partner_rate_hkd"] < 1.5 * record["associate_rate_hkd"]
    ]
    add_check(checks, "Partner/associate rate ratio", not bad_ratio, f"bad_records={len(bad_ratio)}", "A", regenerate_all=bool(bad_ratio))
    regenerate_all = regenerate_all or bool(bad_ratio)

    cost_integrity_bad = 0
    stage_formula_bad = 0
    cost_formula_bad = 0
    for record in records:
        stage_sum = sum(record["stage_costs"])
        tolerance = max(0.01, abs(record["total_cost_hkd"]) * VALIDATION_THRESHOLDS["stage_cost_tolerance_pct"])
        if abs(stage_sum - record["total_cost_hkd"]) > tolerance:
            cost_integrity_bad += 1
        for idx, stage_cost in enumerate(record["stage_costs"]):
            formula = (
                record["stage_partner_hours"][idx] * record["partner_rate_hkd"]
                + record["stage_associate_hours"][idx] * record["associate_rate_hkd"]
            )
            if abs(stage_cost - formula) > 0.02:
                stage_formula_bad += 1
        formula_total = record["partner_hours"] * record["partner_rate_hkd"] + record["associate_hours"] * record["associate_rate_hkd"]
        if abs(formula_total - record["total_cost_hkd"]) > tolerance:
            cost_formula_bad += 1
    add_check(checks, "Stage costs sum to total_cost", cost_integrity_bad == 0, f"bad_records={cost_integrity_bad}", "A", regenerate_all=cost_integrity_bad > 0)
    add_check(checks, "Stage-level cost formula", stage_formula_bad == 0, f"bad_stage_entries={stage_formula_bad}", "A", regenerate_all=stage_formula_bad > 0)
    add_check(checks, "Total cost formula", cost_formula_bad == 0, f"bad_records={cost_formula_bad}", "A", regenerate_all=cost_formula_bad > 0)
    regenerate_all = regenerate_all or any([cost_integrity_bad, stage_formula_bad, cost_formula_bad])

    gba_records = [record for record in records if record["jurisdiction"] == "GBA Cross-Border (HK-PRC)"]
    prc_ratio_outliers = []
    for record in gba_records:
        if record["prc_cost_estimate_cny"] is None:
            prc_ratio_outliers.append(record["matter_id"])
            continue
        converted_ratio = record["prc_cost_estimate_cny"] / (record["total_cost_hkd"] * 0.875)
        if converted_ratio < 0.10 or converted_ratio > 0.90:
            prc_ratio_outliers.append(record["matter_id"])
    add_check(checks, "PRC cost estimate ratio", not prc_ratio_outliers, f"outliers={len(prc_ratio_outliers)}", "A", regenerate_all=bool(prc_ratio_outliers))
    regenerate_all = regenerate_all or bool(prc_ratio_outliers)

    complexity = [record["complexity_score"] for record in records]
    log_cost = [math.log(record["total_cost_hkd"]) for record in records]
    total_hours = [record["total_hours"] for record in records]
    docs = [record["document_volume"] for record in records]
    partner_rates = [record["partner_rate_hkd"] for record in records]
    tier_ord = [FIRM_TIER_ORDINAL[record["firm_tier"]] for record in records]
    corr_complexity_cost = pearson(complexity, log_cost)
    corr_doc_hours = pearson(docs, total_hours)
    corr_tier_rate = pearson(tier_ord, partner_rates)
    add_check(checks, "Correlation complexity vs log(total_cost)", corr_complexity_cost > VALIDATION_THRESHOLDS["complexity_log_cost_min_pearson"], f"r={corr_complexity_cost:.3f}", "A", regenerate_all=corr_complexity_cost <= VALIDATION_THRESHOLDS["complexity_log_cost_min_pearson"])
    add_check(checks, "Correlation document_volume vs total_hours", corr_doc_hours > VALIDATION_THRESHOLDS["document_hours_min_pearson"], f"r={corr_doc_hours:.3f}", "A", regenerate_all=corr_doc_hours <= VALIDATION_THRESHOLDS["document_hours_min_pearson"])
    add_check(checks, "Correlation firm_tier ordinal vs partner_rate", corr_tier_rate > VALIDATION_THRESHOLDS["tier_rate_min_pearson"], f"r={corr_tier_rate:.3f}", "A", regenerate_all=corr_tier_rate <= VALIDATION_THRESHOLDS["tier_rate_min_pearson"])
    regenerate_all = regenerate_all or any(
        [
            corr_complexity_cost <= VALIDATION_THRESHOLDS["complexity_log_cost_min_pearson"],
            corr_doc_hours <= VALIDATION_THRESHOLDS["document_hours_min_pearson"],
            corr_tier_rate <= VALIDATION_THRESHOLDS["tier_rate_min_pearson"],
        ]
    )

    for matter_type in MATTER_TYPES:
        type_costs = values(records, "total_cost_hkd", lambda r, mt=matter_type: r["matter_type"] == mt)
        raw_skew = skewness(type_costs)
        log_skew = skewness([math.log(cost) for cost in type_costs])
        log_kurt = excess_kurtosis([math.log(cost) for cost in type_costs])
        passed = raw_skew > VALIDATION_THRESHOLDS["raw_cost_min_skew"]
        add_check(
            checks,
            f"Raw cost right-skew: {matter_type}",
            passed,
            f"raw_skew={raw_skew:.3f}; log_skew={log_skew:.3f}; log_excess_kurtosis={log_kurt:.3f}",
            "A",
            failing_type=matter_type if not passed else None,
        )
        if not passed:
            failing_types.add(matter_type)

    uniform_fields = []
    for field in NUMERIC_FIELDS:
        field_values = values(records, field)
        if is_uniform_like(field_values):
            uniform_fields.append(field)
    add_check(checks, "Suspicious uniform numeric fields", not uniform_fields, f"fields={uniform_fields}", "B", regenerate_all=bool(uniform_fields))
    regenerate_all = regenerate_all or bool(uniform_fields)

    seen = set()
    duplicate_count = 0
    for record in records:
        key = (
            round(record["total_cost_hkd"], 2),
            round(record["total_hours"], 2),
            round(record["partner_rate_hkd"], 2),
        )
        if key in seen:
            duplicate_count += 1
        seen.add(key)
    add_check(checks, "Exact duplicate cost/hours/rate triples", duplicate_count == 0, f"duplicates={duplicate_count}", "B", regenerate_all=duplicate_count > 0)
    regenerate_all = regenerate_all or duplicate_count > 0

    partner_rate_linearity = sum(
        1
        for record in records
        if abs(record["total_cost_hkd"] - record["total_hours"] * record["partner_rate_hkd"]) <= 0.01
    )
    add_check(checks, "No partner-rate perfect linearity", partner_rate_linearity == 0, f"bad_records={partner_rate_linearity}", "B", regenerate_all=partner_rate_linearity > 0)
    regenerate_all = regenerate_all or partner_rate_linearity > 0

    cell_counts = Counter((record["matter_type"], record["firm_tier"]) for record in records)
    largest_cell = max(cell_counts.values()) / len(records)
    passed = largest_cell <= VALIDATION_THRESHOLDS["max_type_tier_cell_share"]
    add_check(checks, "No matter_type/firm_tier cell >25%", passed, f"largest_cell={largest_cell:.2%}", "B", regenerate_all=not passed)
    regenerate_all = regenerate_all or not passed

    extreme_overruns = [
        record
        for record in records
        if record["cost_variance_pct"] is not None and record["cost_variance_pct"] > 3.0
    ]
    extreme_share = len(extreme_overruns) / len(records)
    passed = extreme_share < VALIDATION_THRESHOLDS["extreme_overrun_max_share"]
    add_check(checks, "Extreme overrun share <1%", passed, f"share={extreme_share:.2%}", "B", regenerate_all=not passed)
    regenerate_all = regenerate_all or not passed

    gba_cross_ok = all(record["cross_border_flag"] and record["prc_cost_estimate_cny"] is not None for record in gba_records)
    hk_only_ok = all(record["prc_cost_estimate_cny"] is None for record in records if record["jurisdiction"] == "HK Only")
    multi_ok = all(record["cross_border_flag"] and record["prc_cost_estimate_cny"] is None for record in records if record["jurisdiction"] == "Multi-Jurisdictional (APAC)")
    add_check(checks, "GBA cross-border PRC estimate rule", gba_cross_ok, f"gba_records={len(gba_records)}", "C", regenerate_all=not gba_cross_ok)
    add_check(checks, "HK-only PRC estimate NULL rule", hk_only_ok, "", "C", regenerate_all=not hk_only_ok)
    add_check(checks, "Multi-jurisdictional cross-border rule", multi_ok, "", "C", regenerate_all=not multi_ok)
    regenerate_all = regenerate_all or not (gba_cross_ok and hk_only_ok and multi_ok)

    mainland_share = (
        sum(1 for record in gba_records if record["client_type"] == "Mainland Enterprise") / len(gba_records)
        if gba_records
        else 0.0
    )
    passed = mainland_share >= VALIDATION_THRESHOLDS["gba_mainland_enterprise_min_share"]
    add_check(checks, "Mainland Enterprise share among GBA matters", passed, f"share={mainland_share:.2%}", "C", regenerate_all=not passed)
    regenerate_all = regenerate_all or not passed

    prc_tier_share = sum(1 for record in records if record["firm_tier"] == "PRC Elite Firm in HK") / len(records)
    passed = VALIDATION_THRESHOLDS["prc_tier_min_share"] <= prc_tier_share <= VALIDATION_THRESHOLDS["prc_tier_max_share"]
    add_check(checks, "PRC Elite Firm in HK dataset share", passed, f"share={prc_tier_share:.2%}", "C", regenerate_all=not passed)
    regenerate_all = regenerate_all or not passed

    outcome_related_share = sum(1 for record in records if record["billing_model"] == "Outcome Related") / len(records)
    outcome_related_gated = all(record["matter_type"] == "Arbitration" for record in records if record["billing_model"] == "Outcome Related")
    passed = outcome_related_share < VALIDATION_THRESHOLDS["outcome_related_max_share"] and outcome_related_gated
    add_check(checks, "Outcome Related arbitration-only and <3%", passed, f"share={outcome_related_share:.2%}; gated={outcome_related_gated}", "C", regenerate_all=not passed)
    regenerate_all = regenerate_all or not passed

    failed = [check for check in checks if check["status"] == "FAIL"]
    residual_anomalies = [f"{check['name']}: {check['detail']}" for check in failed]
    headline = {
        "global_material_creep_rate": global_flag,
        "global_any_overrun_rate": global_any,
        "complexity_log_cost_pearson": corr_complexity_cost,
        "complexity_log_cost_spearman": spearman(complexity, log_cost),
        "document_hours_pearson": corr_doc_hours,
        "tier_rate_pearson": corr_tier_rate,
        "min_partner_rate": min_partner,
        "min_associate_rate": min_associate,
        "mainland_gba_share": mainland_share,
        "prc_tier_share": prc_tier_share,
        "outcome_related_share": outcome_related_share,
    }
    return ValidationResult(
        passed=not failed,
        checks=checks,
        failing_types=failing_types,
        regenerate_all=regenerate_all,
        residual_anomalies=residual_anomalies,
        headline=headline,
    )


def iterative_generate() -> tuple[list[dict[str, Any]], ValidationResult, list[str]]:
    rng = random.Random(RANDOM_SEED)
    records = generate_dataset(rng)
    iteration_log: list[str] = []
    final_result = validate(records)
    iteration_log.append(f"Iteration 0: {'PASS' if final_result.passed else 'FAIL'}; failures={len(final_result.residual_anomalies)}")

    for iteration in range(1, MAX_VALIDATION_ITERATIONS + 1):
        if final_result.passed:
            break
        if final_result.regenerate_all or not final_result.failing_types:
            iteration_log.append("Regenerating full dataset due to global/cross-cutting validation failure.")
            records = generate_dataset(rng)
        else:
            failing = ", ".join(sorted(final_result.failing_types))
            iteration_log.append(f"Targeted regeneration for matter types: {failing}")
            records = regenerate_types(records, final_result.failing_types, rng)
        final_result = validate(records)
        iteration_log.append(f"Iteration {iteration}: {'PASS' if final_result.passed else 'FAIL'}; failures={len(final_result.residual_anomalies)}")

    return records, final_result, iteration_log


def csv_value(value: Any) -> str | float | int:
    if value is None:
        return ""
    if isinstance(value, list):
        return json.dumps(value, ensure_ascii=True)
    if isinstance(value, bool):
        return "TRUE" if value else "FALSE"
    return value


def write_dataset(records: list[dict[str, Any]]) -> None:
    OUTPUT_DIR.mkdir(exist_ok=True)
    with DATASET_PATH.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=CSV_FIELDS)
        writer.writeheader()
        for record in records:
            writer.writerow({field: csv_value(record[field]) for field in CSV_FIELDS})


def format_number(value: float | int | None) -> str:
    if value is None or (isinstance(value, float) and math.isnan(value)):
        return ""
    if abs(float(value)) >= 1000:
        return f"{float(value):,.2f}"
    return f"{float(value):.4f}".rstrip("0").rstrip(".")


def group_stats(records: list[dict[str, Any]], group_field: str) -> list[str]:
    lines = [
        f"### Numeric Descriptive Statistics by `{group_field}`",
        "",
        "| group | field | mean | median | std | min | max | count |",
        "|---|---:|---:|---:|---:|---:|---:|---:|",
    ]
    groups = sorted(set(record[group_field] for record in records))
    for group in groups:
        group_records = [record for record in records if record[group_field] == group]
        for field in NUMERIC_FIELDS:
            items = values(group_records, field)
            if not items:
                continue
            lines.append(
                "| "
                + " | ".join(
                    [
                        group,
                        field,
                        format_number(mean(items)),
                        format_number(median(items)),
                        format_number(stdev(items)),
                        format_number(min(items)),
                        format_number(max(items)),
                        str(len(items)),
                    ]
                )
                + " |"
            )
    return lines


def scope_creep_tables(records: list[dict[str, Any]]) -> list[str]:
    lines = [
        "### Scope Creep Rates",
        "",
        "| matter_type | material_creep_rate | any_overrun_rate | non_ongoing_count |",
        "|---|---:|---:|---:|",
    ]
    for matter_type in MATTER_TYPES:
        subset = [record for record in records if record["matter_type"] == matter_type and record["outcome"] != "Ongoing"]
        flag_rate = scope_flag_rate(records, lambda r, mt=matter_type: r["matter_type"] == mt)
        any_rate = sum(1 for record in subset if record["total_cost_hkd"] > record["predicted_cost_hkd"]) / len(subset)
        lines.append(f"| {matter_type} | {flag_rate:.2%} | {any_rate:.2%} | {len(subset)} |")

    lines.extend(
        [
            "",
            "| billing_model | material_creep_rate | any_overrun_rate | non_ongoing_count |",
            "|---|---:|---:|---:|",
        ]
    )
    for billing_model in BILLING_MODELS:
        subset = [record for record in records if record["billing_model"] == billing_model and record["outcome"] != "Ongoing"]
        if not subset:
            continue
        flag_rate = scope_flag_rate(records, lambda r, bm=billing_model: r["billing_model"] == bm)
        any_rate = sum(1 for record in subset if record["total_cost_hkd"] > record["predicted_cost_hkd"]) / len(subset)
        lines.append(f"| {billing_model} | {flag_rate:.2%} | {any_rate:.2%} | {len(subset)} |")
    return lines


def correlation_matrix(records: list[dict[str, Any]]) -> list[str]:
    series = {
        "complexity": [float(record["complexity_score"]) for record in records],
        "log_total_cost": [math.log(record["total_cost_hkd"]) for record in records],
        "total_hours": [float(record["total_hours"]) for record in records],
        "duration_days": [float(record["duration_days"]) for record in records],
        "document_volume": [float(record["document_volume"]) for record in records],
    }
    names = list(series)
    lines = ["### Pearson Correlation Matrix", "", "| field | " + " | ".join(names) + " |", "|---|" + "|".join("---:" for _ in names) + "|"]
    for row in names:
        values_text = [f"{pearson(series[row], series[col]):.3f}" for col in names]
        lines.append("| " + row + " | " + " | ".join(values_text) + " |")
    return lines


def validation_check_table(result: ValidationResult) -> list[str]:
    lines = [
        "### Validation Checks",
        "",
        "| suite | check | status | detail |",
        "|---|---|---:|---|",
    ]
    for check in result.checks:
        lines.append(f"| {check['suite']} | {check['name']} | {check['status']} | {check['detail']} |")
    return lines


def headline_summary(result: ValidationResult, iteration_log: list[str]) -> list[str]:
    lines = [
        "# Validation Report",
        "",
        "## Headline Results",
        "",
        f"- Records generated: {RECORD_COUNT:,}",
        f"- Overall validation status: {'PASS' if result.passed else 'FAIL'}",
        f"- Global material scope creep rate: {result.headline['global_material_creep_rate']:.2%}",
        f"- Global any-overrun rate: {result.headline['global_any_overrun_rate']:.2%}",
        f"- Complexity vs log(total_cost) Pearson r: {result.headline['complexity_log_cost_pearson']:.3f}",
        f"- Complexity vs log(total_cost) Spearman rho: {result.headline['complexity_log_cost_spearman']:.3f}",
        f"- Document volume vs total hours Pearson r: {result.headline['document_hours_pearson']:.3f}",
        f"- Firm tier ordinal vs partner rate Pearson r: {result.headline['tier_rate_pearson']:.3f}",
        f"- Minimum partner rate: HKD {result.headline['min_partner_rate']:,.2f}",
        f"- Minimum associate rate: HKD {result.headline['min_associate_rate']:,.2f}",
        f"- PRC Elite Firm in HK share: {result.headline['prc_tier_share']:.2%}",
        f"- Mainland Enterprise share in GBA matters: {result.headline['mainland_gba_share']:.2%}",
        "",
        "## Iteration Log",
        "",
    ]
    lines.extend(f"- {entry}" for entry in iteration_log)
    lines.extend(["", "## Residual Anomalies", ""])
    if result.residual_anomalies:
        lines.extend(f"- {item}" for item in result.residual_anomalies)
    else:
        lines.append("- None.")
    return lines


def write_validation_report(records: list[dict[str, Any]], result: ValidationResult, iteration_log: list[str]) -> None:
    lines: list[str] = []
    lines.extend(headline_summary(result, iteration_log))
    lines.extend([""])
    lines.extend(scope_creep_tables(records))
    lines.extend([""])
    lines.extend(correlation_matrix(records))
    lines.extend([""])
    lines.extend(validation_check_table(result))
    lines.extend([""])
    lines.extend(group_stats(records, "matter_type"))
    lines.extend([""])
    lines.extend(group_stats(records, "firm_tier"))
    VALIDATION_REPORT_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_data_dictionary() -> None:
    DATA_DICTIONARY_PATH.parent.mkdir(exist_ok=True)
    text = """# Data Dictionary

This dictionary documents the synthetic ProForma HK MVP dataset. The data is generated directly from structured numeric and categorical distributions; no LLM-generated matter narratives are used.

## Generation Summary

- Records: 4,000 synthetic legal matters.
- Source marker: `SYNTHETIC_MVP_V1`.
- Random seed: `20260622`.
- Cost model: matter-type log-normal baseline with complexity, firm-tier, jurisdiction, and deal-value multipliers.
- Quote model: ex-ante firm quote based on a feature-derived expected cost plus a quote-posture mixture. The posture mixture creates materially under-scoped, narrowly over-budget, and conservative/over-scoped quotes so the data can match both material scope-creep and any-overrun benchmarks. It includes random variation and is not a simple deterministic transformation of realized WIP cost.
- Money model: `total_cost_hkd` is WIP/economic cost, `predicted_cost_hkd` is the original quote/cap/budget, `billed_amount_hkd` is amount billed or collected under the billing model, and `realization_rate` is billed divided by WIP cost.

## Fields

| field | type | generation logic and assumptions |
|---|---|---|
| `matter_id` | UUID string | Deterministic UUID5 generated from the dataset seed and record index so regenerated synthetic datasets remain reproducible. |
| `matter_type` | categorical | One of ten HK legal practice categories; counts use activity-weighted proportions with no category below roughly 320 records. |
| `matter_subtype` | categorical | Sampled from a matter-type-specific subtype taxonomy such as private share acquisition, unfair dismissal, or HKIAC commercial arbitration. |
| `jurisdiction` | categorical | Sampled from firm-tier and matter-type affinities: HK Only, GBA Cross-Border, or Multi-Jurisdictional APAC. |
| `firm_tier` | categorical | Activity-weighted by matter type. PRC Elite Firm in HK is targeted to 8-12% of the full dataset and concentrated in GBA M&A, banking, restructuring, and regulatory matters. |
| `client_type` | categorical | Conditional on jurisdiction, matter type, and firm tier. Mainland Enterprise is deliberately over-represented in GBA matters. |
| `deal_value_hkd` | float or NULL | Generated only for M&A, Commercial Property, Corporate Restructuring, and Banking & Finance. Uses matter-specific log-normal distributions and feeds sub-linearly into cost. |
| `document_volume` | integer | Right-skewed estimate of pages/files, driven by matter type, complexity, hours, and noise. Validated to correlate with total hours. |
| `complexity_score` | integer | 1-5 ordinal score. Matter-specific weights make Wills and routine property lower-complexity, while arbitration, restructuring, and complex transactional work skew higher. |
| `party_count` | integer | 1-10 count sampled from a capped log-normal-like process; increases with complexity and cross-border status. |
| `cross_border_flag` | boolean | TRUE for GBA Cross-Border and Multi-Jurisdictional records; FALSE for HK Only. |
| `partner_rate_hkd` | float | Sampled from amended HKD hourly rate bands by firm tier. Minimum partner rate is HKD 1,800; actual bands start at HKD 1,900 for small/boutique. |
| `associate_rate_hkd` | float | Partner rate multiplied by 40-60%, with an HKD 800 floor and guaranteed partner >= 1.5x associate. |
| `partner_hours` | float | Derived from WIP cost, blended rate, complexity, firm tier, and matter type. Higher complexity and elite/arbitration matters get higher partner leverage. |
| `associate_hours` | float | Derived as remaining hours after partner allocation. |
| `total_hours` | float | `partner_hours + associate_hours`. |
| `stage_count` | integer | Number of procedural stages from matter-type templates, generally 4-6. |
| `stage_names` | JSON list[string] | Matter-type stage names, e.g. Due Diligence, Negotiation, Closing. |
| `stage_partner_hours` | JSON list[float] | Partner hours allocated across stages. Early stages are relatively partner-heavy; the list sums to `partner_hours`. |
| `stage_associate_hours` | JSON list[float] | Associate hours allocated across stages. Later execution stages are relatively associate-heavy; the list sums to `associate_hours`. |
| `stage_costs` | JSON list[float] | For each stage, `stage_partner_hours[i] * partner_rate_hkd + stage_associate_hours[i] * associate_rate_hkd`. Sum equals `total_cost_hkd` within validation tolerance. |
| `total_cost_hkd` | float | WIP/economic cost. Generated from a matter-type log-normal expected cost adjusted for tier, complexity, jurisdiction, deal value, and independent actual-cost shock. |
| `predicted_cost_hkd` | float | Firm's original quote, cap, or budget. Generated from expected cost, independent quote noise, and a calibrated quote-posture mixture that sometimes materially underestimates, sometimes narrowly overruns, and sometimes over-scopes. Never exactly equal to total cost. |
| `billed_amount_hkd` | float | Amount billed or collected under the billing model. Fixed fee generally equals quote; capped fee is capped by the quote; hourly uses WIP cost adjusted for realization/write-downs. |
| `realization_rate` | float | `billed_amount_hkd / total_cost_hkd`. Values above or below 1 reflect premium/uplift or write-downs depending on billing model and outcome. |
| `cost_variance_pct` | float | Signed `(total_cost_hkd - predicted_cost_hkd) / predicted_cost_hkd`, preserving both underruns and overruns. |
| `scope_creep_flag` | boolean or NULL | TRUE when non-ongoing WIP cost exceeds quote by more than 5%. NULL for Ongoing matters. |
| `scope_creep_pct` | float or NULL | Same as `cost_variance_pct` only when `scope_creep_flag` is TRUE; otherwise NULL. |
| `duration_days` | integer | Driven by matter type, total hours, complexity, jurisdiction premium, and noise. Validated to correlate positively with complexity and cost. |
| `outcome` | categorical | Settled/Completed, Abandoned/Withdrawn, or Ongoing. Ongoing and abandoned matters have scaled WIP costs and realization behavior. |
| `billing_model` | categorical | Hourly, Fixed Fee, Capped Fee, Retainer, or Outcome Related. Outcome Related is arbitration-only and below 3% of the dataset. |
| `prc_cost_estimate_cny` | float or NULL | Only for GBA Cross-Border matters. Generated as 30-70% of HK WIP cost converted at 0.85-0.90 CNY/HKD. NULL for HK-only and APAC multi-jurisdictional matters. |
| `data_source` | string | Constant `SYNTHETIC_MVP_V1`. |

## Validation Philosophy

The validation suite checks statistical plausibility, structural integrity, and cross-border consistency. Correlations are evaluated on log cost where appropriate because legal costs are right-skewed. Raw costs are validated for right skew, while log costs are expected to be approximately normal, consistent with a log-normal generative model.
"""
    DATA_DICTIONARY_PATH.write_text(text, encoding="utf-8")


def print_summary(result: ValidationResult, iteration_log: list[str]) -> None:
    for entry in iteration_log:
        print(entry)
    print(f"Validation status: {'PASS' if result.passed else 'FAIL'}")
    for key, value in result.headline.items():
        if isinstance(value, float):
            print(f"{key}: {value:.6f}")
        else:
            print(f"{key}: {value}")
    if result.residual_anomalies:
        print("Residual anomalies:")
        for anomaly in result.residual_anomalies:
            print(f"- {anomaly}")


def main() -> int:
    records, result, iteration_log = iterative_generate()
    write_dataset(records)
    write_validation_report(records, result, iteration_log)
    write_dataset_lineage(
        dataset_path=DATASET_PATH,
        lineage_path=DATASET_LINEAGE_PATH,
        validation_report_path=VALIDATION_REPORT_PATH,
    )
    write_data_dictionary()
    print_summary(result, iteration_log)
    print(f"Dataset: {DATASET_PATH}")
    print(f"Validation report: {VALIDATION_REPORT_PATH}")
    print(f"Dataset lineage: {DATASET_LINEAGE_PATH}")
    print(f"Data dictionary: {DATA_DICTIONARY_PATH}")
    return 0 if result.passed else 1


if __name__ == "__main__":
    raise SystemExit(main())
