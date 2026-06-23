from __future__ import annotations

from proforma_data.schemas import PredictionResponse
from services.api.app.schemas import EstimateRequest
from services.api.app.supabase_client import get_supabase_client


class SupabaseEstimateStore:
    def save(self, *, request: EstimateRequest, prediction: PredictionResponse) -> None:
        client = get_supabase_client()
        client.table("estimates").upsert(
            {
                "estimate_id": prediction.estimate_id,
                "tenant_id": prediction.tenant_id,
                "request_json": request.model_dump(mode="json"),
                "prediction_json": prediction.model_dump(mode="json"),
                "model_version": prediction.model_version,
                "dataset_lineage": prediction.dataset_lineage,
                "synthetic_mode": True,
            },
            on_conflict="estimate_id",
        ).execute()

    def get_prediction(self, estimate_id: str) -> PredictionResponse | None:
        client = get_supabase_client()
        result = (
            client.table("estimates")
            .select("prediction_json")
            .eq("estimate_id", estimate_id)
            .maybe_single()
            .execute()
        )
        if not result.data:
            return None
        return PredictionResponse(**result.data["prediction_json"])
