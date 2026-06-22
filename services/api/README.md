# ProForma API

FastAPI service for Phase 3 backend and API contracts.

## Install

```bash
python -m pip install -r requirements.txt
```

## Test

```bash
python -m pytest services/api/tests -q
```

## Run

```bash
uvicorn services.api.app.main:create_app --factory --port 8000
```

## Export OpenAPI

```bash
python -m services.api.app.main export-openapi --output services/api/openapi.json
```

## Synthetic-Mode Limitation

The Phase 3 service is a feasibility API. `synthetic_baseline` and `pooled_research` responses are decision-support estimates from synthetic Phase 2 artifacts. Pooled research remains legally gated, and firm-specific production serving returns `503` until firm-approved model artifacts are available.
