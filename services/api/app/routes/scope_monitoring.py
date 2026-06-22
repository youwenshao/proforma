from __future__ import annotations

from fastapi import APIRouter, HTTPException, status

from services.api.app.model_registry import ModelRegistry
from services.api.app.schemas import ScopeUpdateRequest, ScopeUpdateResponse
from services.api.app.scope_monitoring import StageNotFoundError, evaluate_scope_update
from services.api.app.settings import get_settings

router = APIRouter(prefix="/v1", tags=["scope-monitoring"])


@router.post("/estimates/{estimate_id}/scope-updates", response_model=ScopeUpdateResponse)
def create_scope_update(estimate_id: str, update: ScopeUpdateRequest) -> ScopeUpdateResponse:
    settings = get_settings()
    if update.update_note and not settings.allow_scope_update_notes:
        raise HTTPException(
            status_code=422,
            detail="Free text update notes are disabled in feasibility mode.",
        )

    fixture_prediction = ModelRegistry(settings.artifacts_dir)._fixture_prediction()
    try:
        return evaluate_scope_update(
            estimate_id=estimate_id,
            stage_estimates=fixture_prediction["stage_estimates"],
            update=update,
        )
    except StageNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
