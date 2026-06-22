import subprocess
import sys


def test_cli_saved_model_artifacts_reload_in_fresh_process(tmp_path) -> None:
    model_dir = tmp_path / "models"
    subprocess.run(
        [
            sys.executable,
            "-m",
            "ml.train",
            "--dataset",
            "output/proforma_hk_synthetic_mvp.csv",
            "--all-targets",
            "--output-dir",
            str(model_dir),
            "--sample",
            "200",
        ],
        check=True,
        capture_output=True,
        text=True,
    )

    subprocess.run(
        [
            sys.executable,
            "-c",
            (
                "import joblib; "
                f"bundle = joblib.load({str(model_dir / 'total_cost_hkd_ridge.joblib')!r}); "
                "assert bundle.target == 'total_cost_hkd'"
            ),
        ],
        check=True,
        capture_output=True,
        text=True,
    )
