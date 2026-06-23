from __future__ import annotations

from pathlib import Path
from typing import Protocol

from proforma_data.schemas import PredictionResponse, QuotePackRenderResponse, QuoteSubstantiationResponse

from services.api.app.estimate_store import EstimateStore
from services.api.app.quote_pack_storage import LocalQuotePackStorage
from services.api.app.schemas import EstimateRequest
from services.api.app.settings import ApiSettings


class EstimateStoreProtocol(Protocol):
    def save(self, *, request: EstimateRequest, prediction: PredictionResponse) -> None: ...

    def get_prediction(self, estimate_id: str) -> PredictionResponse | None: ...


class QuotePackStorageProtocol(Protocol):
    storage_backend: str

    def store_rendered_pdf(
        self,
        *,
        snapshot: QuoteSubstantiationResponse,
        pdf: bytes,
    ) -> QuotePackRenderResponse: ...


def get_estimate_store(settings: ApiSettings) -> EstimateStoreProtocol:
    if settings.supabase_enabled:
        from services.api.app.supabase_estimate_store import SupabaseEstimateStore

        return SupabaseEstimateStore()
    return EstimateStore(settings.estimate_store_dir)


def get_quote_pack_storage(settings: ApiSettings) -> QuotePackStorageProtocol:
    if settings.supabase_enabled:
        from services.api.app.supabase_quote_pack_storage import SupabaseQuotePackStorage

        return SupabaseQuotePackStorage()
    return LocalQuotePackStorage(settings.quote_pack_storage_dir)
