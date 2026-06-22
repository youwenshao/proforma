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

## Model Artifacts

Generate trained synthetic baseline bundles before serving live model output:

```bash
python -m ml.train --dataset output/proforma_hk_synthetic_mvp.csv --all-targets --output-dir artifacts/models
```

At request time the API uses `PROFORMA_MODEL_SERVING_MODE`:

- `auto` (default): use a complete, version-compatible artifact set when present; otherwise use the fixture.
- `fixture`: force the local fixture for development and contract tests.
- `live`: require model artifacts and return `503` if they are unavailable.

The artifact set in `artifacts/models` must include:

- `total_cost_hkd_*`
- `duration_days_*`
- `partner_hours_*`
- `associate_hours_*`
- `scope_creep_flag_*`

If no model artifacts are present, the API falls back to `artifacts/fixtures/sample_prediction_response.json` for local feasibility demos. If only some artifacts are present, or if their model version is incompatible, estimate requests return `503` instead of silently mixing model and fixture output.

## Export OpenAPI

```bash
python -m services.api.app.main export-openapi --output services/api/openapi.json
```

## Synthetic-Mode Limitation

The Phase 3 service is a feasibility API. `synthetic_baseline` and `pooled_research` responses are decision-support estimates from synthetic Phase 2 artifacts. Pooled research remains legally gated, and firm-specific production serving returns `503` until firm-approved model artifacts are available.
