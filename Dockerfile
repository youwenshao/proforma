FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PROFORMA_MODEL_SERVING_MODE=fixture

WORKDIR /app

COPY requirements.txt pyproject.toml ./
RUN python -m pip install --no-cache-dir --upgrade pip \
    && python -m pip install --no-cache-dir -r requirements.txt

COPY api ./api
COPY services ./services
COPY proforma_data ./proforma_data
COPY ml ./ml
COPY artifacts/fixtures ./artifacts/fixtures
COPY artifacts/reports ./artifacts/reports

EXPOSE 8080

CMD ["sh", "-c", "python -m uvicorn services.api.app.main:create_app --factory --host 0.0.0.0 --port ${PORT:-8080}"]
