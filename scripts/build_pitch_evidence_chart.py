from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from proforma_data.pitch_evidence import write_pitch_evidence_chart

DEFAULT_OUTPUTS = [
    "artifacts/reports/pitch_evidence_chart.json",
    "apps/web/components/pitch/evidence-distribution.json",
]


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Build the real cost-variance histogram used alongside the pitch deck's illustrative curve.",
    )
    parser.add_argument("--dataset", default="output/proforma_hk_synthetic_mvp.csv")
    parser.add_argument("--lineage", default="output/dataset_lineage.json")
    parser.add_argument(
        "--output",
        action="append",
        dest="outputs",
        help="Output path; may be repeated. Defaults to the artifact report and the web app copy.",
    )
    args = parser.parse_args()

    dataset_id = "SYNTHETIC_MVP_V1"
    lineage_path = Path(args.lineage)
    if lineage_path.exists():
        lineage = json.loads(lineage_path.read_text(encoding="utf-8"))
        dataset_id = lineage.get("dataset_id", dataset_id)

    outputs = args.outputs or DEFAULT_OUTPUTS
    artifact = write_pitch_evidence_chart(args.dataset, outputs, dataset_id=dataset_id)
    print(
        json.dumps(
            {
                "outputs": outputs,
                "dataset_id": artifact["datasetId"],
                "non_ongoing_sample_size": artifact["nonOngoingSampleSize"],
                "bins": len(artifact["bins"]),
                "any_overrun_rate": artifact["metrics"]["anyOverrunRate"],
                "material_creep_rate": artifact["metrics"]["materialCreepRate"],
            },
            sort_keys=True,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
