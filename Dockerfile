FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PROFORMA_MODEL_SERVING_MODE=live

WORKDIR /app

COPY requirements.txt pyproject.toml ./
RUN python -m pip install --no-cache-dir --upgrade pip \
    && python -m pip install --no-cache-dir -r requirements.txt

COPY services ./services
COPY proforma_data ./proforma_data
COPY ml ./ml
COPY artifacts/fixtures ./artifacts/fixtures
COPY artifacts/reports ./artifacts/reports
COPY generate_dataset.py ./generate_dataset.py
COPY docs/data_dictionary.md ./docs/data_dictionary.md
COPY output/proforma_hk_synthetic_mvp.csv ./output/proforma_hk_synthetic_mvp.csv
COPY output/validation_report.md ./output/validation_report.md
COPY output/dataset_lineage.json ./output/dataset_lineage.json

# Train inside the image so live serving does not depend on gitignored joblibs.
RUN python -m ml.train \
      --dataset output/proforma_hk_synthetic_mvp.csv \
      --all-targets \
      --output-dir artifacts/models

ENV PROFORMA_ARTIFACTS_DIR=/app/artifacts \
    PROFORMA_DATASET_DIR=/app/output \
    PROFORMA_PROJECT_ROOT=/app

EXPOSE 8080

CMD ["sh", "-c", "python -m uvicorn services.api.app.main:create_app --factory --host 0.0.0.0 --port ${PORT:-8080}"]
