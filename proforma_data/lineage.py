"""Dataset lineage metadata helpers."""

from __future__ import annotations

import csv
import json
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

from proforma_data.schemas import SCHEMA_VERSION, DataLineage
from proforma_data.validation import DatasetValidationResult, ValidationIssue

DATASET_ID = "proforma-hk-synthetic-mvp-v1"
SOURCE_MARKER = "SYNTHETIC_MVP_V1"
RANDOM_SEED = 20260622
GENERATOR_VERSION = "synthetic-generator-v1"
FEATURE_VERSION = "proforma.features.v1"


def count_csv_records(dataset_path: Path) -> int:
    with dataset_path.open(newline="", encoding="utf-8") as handle:
        return sum(1 for _ in csv.DictReader(handle))


def build_lineage_metadata(
    *,
    record_count: int,
    validation_report_path: Path | str,
    generated_at: datetime | None = None,
) -> DataLineage:
    return DataLineage(
        dataset_id=DATASET_ID,
        schema_version=SCHEMA_VERSION,
        source_marker=SOURCE_MARKER,
        random_seed=RANDOM_SEED,
        record_count=record_count,
        generated_at=generated_at or datetime.now(UTC),
        generator_version=GENERATOR_VERSION,
        feature_version=FEATURE_VERSION,
        validation_report_path=str(validation_report_path),
    )


def portable_path(path: Path | str, *, fallback_base: Path | str | None = None) -> str:
    candidate = Path(path)
    if not candidate.is_absolute():
        return candidate.as_posix()

    bases = [Path.cwd()]
    if fallback_base is not None:
        bases.append(Path(fallback_base))

    for base in bases:
        try:
            return candidate.resolve().relative_to(base.resolve()).as_posix()
        except ValueError:
            continue
    return candidate.name


def write_dataset_lineage(
    *,
    dataset_path: Path | str,
    lineage_path: Path | str,
    validation_report_path: Path | str,
) -> dict[str, Any]:
    dataset = Path(dataset_path)
    lineage = build_lineage_metadata(
        record_count=count_csv_records(dataset),
        validation_report_path=portable_path(validation_report_path, fallback_base=dataset.parent),
    )
    payload = lineage.model_dump(mode="json")
    output_path = Path(lineage_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    return payload


def validate_lineage_metadata(
    *,
    lineage_path: Path | str,
    dataset_path: Path | str,
    validation_report_path: Path | str,
) -> DatasetValidationResult:
    issues: list[ValidationIssue] = []
    path = Path(lineage_path)
    if not path.exists():
        return DatasetValidationResult(
            passed=False,
            issues=[ValidationIssue("Lineage metadata present", f"missing={path}")],
        )

    payload = json.loads(path.read_text(encoding="utf-8"))
    expected_values = {
        "schema_version": SCHEMA_VERSION,
        "source_marker": SOURCE_MARKER,
        "random_seed": RANDOM_SEED,
    }
    for field, expected in expected_values.items():
        if payload.get(field) != expected:
            issues.append(ValidationIssue(f"Lineage {field} matches contract", f"expected={expected}; actual={payload.get(field)}"))

    expected_count = count_csv_records(Path(dataset_path))
    if payload.get("record_count") != expected_count:
        issues.append(
            ValidationIssue(
                "Lineage record_count matches dataset",
                f"expected={expected_count}; actual={payload.get('record_count')}",
            )
        )

    expected_report_path = portable_path(validation_report_path, fallback_base=Path(dataset_path).parent)
    if payload.get("validation_report_path") != expected_report_path:
        issues.append(
            ValidationIssue(
                "Lineage validation_report_path matches report",
                f"expected={expected_report_path}; actual={payload.get('validation_report_path')}",
            )
        )

    return DatasetValidationResult(passed=not issues, issues=issues)

