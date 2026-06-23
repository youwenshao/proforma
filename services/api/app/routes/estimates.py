from __future__ import annotations

from fastapi import APIRouter, HTTPException, Response, status

from proforma_data.schemas import PredictionResponse, QuotePackRenderResponse, QuoteSubstantiationResponse
from services.api.app.audit import write_prediction_audit_event
from services.api.app.model_registry import ModelRegistry, ModelUnavailableError
from services.api.app.storage_factory import get_estimate_store, get_quote_pack_storage
from services.api.app.quote_benchmarks import QuoteBenchmarkService, QuoteBenchmarkUnavailableError
from services.api.app.quote_pdf import render_quote_pack_pdf
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

    response = PredictionResponse(**prediction)
    get_estimate_store(settings).save(request=request, prediction=response)
    write_prediction_audit_event(
        audit_log_path=settings.audit_log_path,
        request=request,
        prediction=prediction,
        synthetic_mode=synthetic_mode,
    )
    return response


@router.get("/estimates/{estimate_id}", response_model=PredictionResponse)
def get_estimate(estimate_id: str) -> PredictionResponse:
    settings = get_settings()
    prediction = get_estimate_store(settings).get_prediction(estimate_id)
    if prediction is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Estimate not found")
    return prediction


@router.get("/estimates/{estimate_id}/quote-substantiation", response_model=QuoteSubstantiationResponse)
def get_quote_substantiation(estimate_id: str) -> QuoteSubstantiationResponse:
    return _build_quote_substantiation(estimate_id)


@router.get("/estimates/{estimate_id}/quote-substantiation.pdf", response_class=Response)
def get_quote_substantiation_pdf(estimate_id: str) -> Response:
    snapshot = _build_quote_substantiation(estimate_id)
    pdf = render_quote_pack_pdf(snapshot)
    return Response(
        content=pdf,
        media_type="application/pdf",
        headers={"content-disposition": f'attachment; filename="quote-substantiation-{estimate_id}.pdf"'},
    )


@router.post("/estimates/{estimate_id}/quote-packs/render", response_model=QuotePackRenderResponse)
def render_quote_pack(estimate_id: str) -> QuotePackRenderResponse:
    settings = get_settings()
    snapshot = _build_quote_substantiation(estimate_id)
    pdf = render_quote_pack_pdf(snapshot)
    return get_quote_pack_storage(settings).store_rendered_pdf(snapshot=snapshot, pdf=pdf)


def _build_quote_substantiation(estimate_id: str) -> QuoteSubstantiationResponse:
    settings = get_settings()
    prediction = get_estimate_store(settings).get_prediction(estimate_id)
    if prediction is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Estimate not found")
    try:
        return QuoteBenchmarkService(settings.quote_benchmarks_path).build_substantiation(prediction)
    except QuoteBenchmarkUnavailableError as exc:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc)) from exc
