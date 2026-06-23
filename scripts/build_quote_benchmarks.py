from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from proforma_data.quote_benchmarks import write_quote_benchmark_artifact


def main() -> int:
    parser = argparse.ArgumentParser(description="Build quote substantiation benchmark aggregates.")
    parser.add_argument("--dataset", default="output/proforma_hk_synthetic_mvp.csv")
    parser.add_argument("--lineage", default="output/dataset_lineage.json")
    parser.add_argument("--output", default="artifacts/reports/quote_benchmarks.json")
    parser.add_argument("--min-sample-size", type=int, default=40)
    args = parser.parse_args()

    dataset_id = "SYNTHETIC_MVP_V1"
    lineage_path = Path(args.lineage)
    if lineage_path.exists():
        lineage = json.loads(lineage_path.read_text(encoding="utf-8"))
        dataset_id = lineage.get("dataset_id", dataset_id)

    artifact = write_quote_benchmark_artifact(
        args.dataset,
        args.output,
        dataset_id=dataset_id,
        min_sample_size=args.min_sample_size,
    )
    print(
        json.dumps(
            {
                "output": args.output,
                "dataset_id": artifact["dataset_id"],
                "segments": len(artifact["segments"]),
                "min_sample_size": artifact["min_sample_size"],
            },
            sort_keys=True,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
