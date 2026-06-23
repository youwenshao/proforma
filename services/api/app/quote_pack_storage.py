from __future__ import annotations

import hashlib
import json
import uuid
from pathlib import Path

from proforma_data.schemas import QuotePackRenderResponse, QuoteSubstantiationResponse


class LocalQuotePackStorage:
    """Local development backend that mirrors Supabase Storage metadata."""

    storage_backend = "local"

    def __init__(self, storage_dir: Path) -> None:
        self.storage_dir = storage_dir

    def store_rendered_pdf(self, *, snapshot: QuoteSubstantiationResponse, pdf: bytes) -> QuotePackRenderResponse:
        quote_pack_id = str(uuid.uuid4())
        relative_path = f"{snapshot.tenant_id}/{snapshot.estimate_id}/{quote_pack_id}.pdf"
        pdf_path = self.storage_dir / relative_path
        pdf_path.parent.mkdir(parents=True, exist_ok=True)
        pdf_path.write_bytes(pdf)

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
        metadata_path = pdf_path.with_suffix(".json")
        metadata_path.write_text(json.dumps(response.model_dump(mode="json"), indent=2, sort_keys=True) + "\n", encoding="utf-8")
        return response
