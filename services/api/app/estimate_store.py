from __future__ import annotations

import json
import re
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

from proforma_data.schemas import PredictionResponse
from services.api.app.schemas import EstimateRequest

_SAFE_ESTIMATE_ID = re.compile(r"^[A-Za-z0-9_-]+$")


class EstimateStore:
    def __init__(self, store_dir: Path) -> None:
        self.store_dir = store_dir

    def save(self, *, request: EstimateRequest, prediction: PredictionResponse) -> None:
        self.store_dir.mkdir(parents=True, exist_ok=True)
        payload = {
            "estimate_id": prediction.estimate_id,
            "tenant_id": prediction.tenant_id,
            "created_at": datetime.now(UTC).isoformat(),
            "request": request.model_dump(mode="json"),
            "prediction": prediction.model_dump(mode="json"),
        }
        target = self._path_for(prediction.estimate_id)
        temp = target.with_suffix(".tmp")
        temp.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n", encoding="utf-8")
        temp.replace(target)

    def get_prediction(self, estimate_id: str) -> PredictionResponse | None:
        path = self._path_for(estimate_id)
        if not path.exists():
            return None
        payload: dict[str, Any] = json.loads(path.read_text(encoding="utf-8"))
        return PredictionResponse(**payload["prediction"])

    def _path_for(self, estimate_id: str) -> Path:
        if not _SAFE_ESTIMATE_ID.fullmatch(estimate_id):
            return self.store_dir / "__invalid__.json"
        return self.store_dir / f"{estimate_id}.json"
