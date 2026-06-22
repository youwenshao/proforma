#!/usr/bin/env python3
"""Validate a ProForma dataset CSV and write a Markdown report."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

import generate_dataset
from proforma_data.lineage import validate_lineage_metadata
from proforma_data.validation import (
    DatasetValidationResult,
    ValidationIssue,
    load_dataset,
    validate_dataframe,
    write_basic_validation_report,
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", required=True, type=Path, help="Input dataset CSV")
    parser.add_argument("--report", required=True, type=Path, help="Markdown report output path")
    parser.add_argument("--lineage", type=Path, help="Dataset lineage JSON path; defaults beside input CSV")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    df, records = load_dataset(args.input)
    structural_result = validate_dataframe(df)
    args.report.parent.mkdir(parents=True, exist_ok=True)

    if not structural_result.passed:
        write_basic_validation_report(args.report, structural_result, len(df))
        return 1

    lineage_path = args.lineage or args.input.parent / "dataset_lineage.json"
    lineage_result = validate_lineage_metadata(
        lineage_path=lineage_path,
        dataset_path=args.input,
        validation_report_path=args.report,
    )
    if not lineage_result.passed:
        write_basic_validation_report(
            args.report,
            DatasetValidationResult(
                passed=False,
                issues=[*structural_result.issues, *lineage_result.issues],
            ),
            len(df),
        )
        return 1

    try:
        result = generate_dataset.validate(records)
    except Exception as exc:  # pragma: no cover - defensive CLI boundary
        write_basic_validation_report(
            args.report,
            DatasetValidationResult(
                passed=False,
                issues=[*structural_result.issues, ValidationIssue("Validation execution", str(exc))],
            ),
            len(df),
        )
        return 1

    generate_dataset.RECORD_COUNT = len(records)
    generate_dataset.VALIDATION_REPORT_PATH = args.report
    generate_dataset.write_validation_report(records, result, ["External validation command"])
    return 0 if result.passed else 1


if __name__ == "__main__":
    raise SystemExit(main())
