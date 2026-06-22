import csv
import json
from pathlib import Path

import pandas as pd

from proforma_data.lineage import validate_lineage_metadata, write_dataset_lineage
from proforma_data.schemas import SCHEMA_VERSION


def test_lineage_metadata_matches_dataset_contract(tmp_path: Path) -> None:
    dataset_path = tmp_path / "dataset.csv"
    with dataset_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=["matter_id", "data_source"])
        writer.writeheader()
        writer.writerow({"matter_id": "matter-1", "data_source": "SYNTHETIC_MVP_V1"})
        writer.writerow({"matter_id": "matter-2", "data_source": "SYNTHETIC_MVP_V1"})

    lineage_path = tmp_path / "dataset_lineage.json"
    write_dataset_lineage(
        dataset_path=dataset_path,
        lineage_path=lineage_path,
        validation_report_path=tmp_path / "validation_report.md",
    )

    lineage = json.loads(lineage_path.read_text(encoding="utf-8"))
    assert lineage["source_marker"] == "SYNTHETIC_MVP_V1"
    assert lineage["record_count"] == 2
    assert lineage["random_seed"] == 20260622
    assert lineage["schema_version"] == SCHEMA_VERSION
    assert not Path(lineage["validation_report_path"]).is_absolute()


def test_lineage_validation_detects_mismatched_record_count(tmp_path: Path) -> None:
    dataset_path = tmp_path / "dataset.csv"
    pd.DataFrame([{"matter_id": "matter-1"}, {"matter_id": "matter-2"}]).to_csv(dataset_path, index=False)
    lineage_path = tmp_path / "dataset_lineage.json"
    lineage_path.write_text(
        json.dumps(
            {
                "dataset_id": "proforma-hk-synthetic-mvp-v1",
                "schema_version": SCHEMA_VERSION,
                "source_marker": "SYNTHETIC_MVP_V1",
                "random_seed": 20260622,
                "record_count": 1,
                "generated_at": "2026-06-22T00:00:00Z",
                "generator_version": "synthetic-generator-v1",
                "feature_version": "proforma.features.v1",
                "validation_report_path": "validation_report.md",
            }
        ),
        encoding="utf-8",
    )

    result = validate_lineage_metadata(
        lineage_path=lineage_path,
        dataset_path=dataset_path,
        validation_report_path=tmp_path / "validation_report.md",
    )

    assert "Lineage record_count matches dataset" in {issue.name for issue in result.issues}
