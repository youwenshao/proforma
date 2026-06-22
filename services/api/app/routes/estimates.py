from __future__ import annotations

from fastapi import APIRouter, HTTPException, status

from proforma_data.schemas import PredictionResponse
from services.api.app.audit import write_prediction_audit_event
from services.api.app.model_registry import ModelRegistry, ModelUnavailableError
from services.api.app.schemas import EstimateRequest
from services.api.app.settings import get_settings

router = APIRouter(prefix="/v1", tags=["estimates"])


@router.post("/estimates", response_model=PredictionResponse)
def create_estimate(request: EstimateRequest) -> PredictionResponse:
    settings = get_settings()
    registry = ModelRegistry(settings.artifacts_dir, serving_mode=settings.model_serving_mode)

    try:
        prediction, synthetic_mode = registry.predict(request)
    except ModelUnavailableError as exc:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc)) from exc

    write_prediction_audit_event(
        audit_log_path=settings.audit_log_path,
        request=request,
        prediction=prediction,
        synthetic_mode=synthetic_mode,
    )
    return PredictionResponse(**prediction)
