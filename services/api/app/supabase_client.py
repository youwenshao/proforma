from __future__ import annotations

import os

from supabase import Client, create_client

_client: Client | None = None


def get_supabase_client() -> Client:
    global _client
    if _client is not None:
        return _client

    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        raise RuntimeError("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for Supabase storage")

    _client = create_client(url, key)
    return _client
