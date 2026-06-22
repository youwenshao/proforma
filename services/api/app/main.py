from __future__ import annotations

import argparse
import json
from pathlib import Path

from fastapi import FastAPI

from services.api.app.routes import estimates, health, models, scope_monitoring, taxonomy
from services.api.app.settings import get_settings


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title="ProForma API", version=settings.api_version)
    app.include_router(health.router)
    app.include_router(taxonomy.router)
    app.include_router(estimates.router)
    app.include_router(scope_monitoring.router)
    app.include_router(models.router)
    return app


app = create_app()


def export_openapi(output: Path) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(create_app().openapi(), indent=2, sort_keys=True) + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description="ProForma API utilities")
    subparsers = parser.add_subparsers(dest="command")
    export_parser = subparsers.add_parser("export-openapi")
    export_parser.add_argument("--output", required=True)
    args = parser.parse_args()

    if args.command == "export-openapi":
        export_openapi(Path(args.output))
        return 0

    parser.print_help()
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
