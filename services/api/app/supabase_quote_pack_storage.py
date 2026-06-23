from __future__ import annotations

import hashlib
import uuid

from proforma_data.schemas import QuotePackRenderResponse, QuoteSubstantiationResponse

from services.api.app.supabase_client import get_supabase_client

_QUOTE_PACK_BUCKET = "quote-packs"


class SupabaseQuotePackStorage:
    storage_backend = "supabase"

    def store_rendered_pdf(self, *, snapshot: QuoteSubstantiationResponse, pdf: bytes) -> QuotePackRenderResponse:
        client = get_supabase_client()
        quote_pack_id = str(uuid.uuid4())
        relative_path = f"{snapshot.tenant_id}/{snapshot.estimate_id}/{quote_pack_id}.pdf"

        snapshot_row = (
            client.table("quote_pack_snapshots")
            .insert(
                {
                    "estimate_id": snapshot.estimate_id,
                    "tenant_id": snapshot.tenant_id,
                    "snapshot_json": snapshot.model_dump(mode="json"),
                    "snapshot_checksum": snapshot.snapshot_checksum or "",
                    "status": "rendered",
                }
            )
            .execute()
        )
        snapshot_id = snapshot_row.data[0]["snapshot_id"]

        client.storage.from_(_QUOTE_PACK_BUCKET).upload(
            relative_path,
            pdf,
            file_options={"content-type": "application/pdf", "upsert": "false"},
        )

        checksum = hashlib.sha256(pdf).hexdigest()
        response = QuotePackRenderResponse(
            quote_pack_id=quote_pack_id,
            estimate_id=snapshot.estimate_id,
            tenant_id=snapshot.tenant_id,
            status="rendered",
            storage_backend=self.storage_backend,
            storage_path=relative_path,
            checksum_sha256=checksum,
            file_size_bytes=len(pdf),
            snapshot_checksum=snapshot.snapshot_checksum or "",
        )

        client.table("quote_packs").insert(
            {
                "quote_pack_id": quote_pack_id,
                "estimate_id": snapshot.estimate_id,
                "tenant_id": snapshot.tenant_id,
                "snapshot_id": snapshot_id,
                "storage_bucket": _QUOTE_PACK_BUCKET,
                "storage_path": relative_path,
                "checksum_sha256": checksum,
                "file_size_bytes": len(pdf),
                "status": "rendered",
                "approved_shareable": False,
                "rendered_at": response.rendered_at.isoformat(),
            }
        ).execute()

        client.table("quote_pack_events").insert(
            {
                "quote_pack_id": quote_pack_id,
                "estimate_id": snapshot.estimate_id,
                "tenant_id": snapshot.tenant_id,
                "event_type": "generated",
                "event_metadata": {"storage_backend": self.storage_backend},
            }
        ).execute()

        return response
