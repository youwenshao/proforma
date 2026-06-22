from __future__ import annotations

import hashlib
import json
import uuid
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

from services.api.app.schemas import EstimateRequest


def write_prediction_audit_event(
    *,
    audit_log_path: Path,
    request: EstimateRequest,
    prediction: dict[str, Any],
    synthetic_mode: bool,
) -> dict[str, Any]:
    event = {
        "event_id": str(uuid.uuid4()),
        "timestamp": datetime.now(UTC).isoformat(),
        "tenant_id": request.tenant_id,
        "estimate_id": prediction["estimate_id"],
        "model_version": prediction["model_version"],
        "model_strategy": request.model_strategy,
        "input_summary_hash": _hash_input_summary(prediction["input_summary"]),
        "synthetic_mode": synthetic_mode,
    }
    audit_log_path.parent.mkdir(parents=True, exist_ok=True)
    with audit_log_path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(event, sort_keys=True) + "\n")
    return event


def _hash_input_summary(input_summary: dict[str, Any]) -> str:
    payload = json.dumps(input_summary, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()
