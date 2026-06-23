from __future__ import annotations

from pathlib import Path


def test_quote_pack_migration_enables_rls_and_private_storage() -> None:
    migration = Path("supabase/migrations/202606230001_quote_packs.sql").read_text(encoding="utf-8").lower()

    for table in [
        "public.tenant_memberships",
        "public.estimates",
        "public.quote_pack_snapshots",
        "public.quote_packs",
        "public.quote_pack_events",
    ]:
        assert f"alter table {table} enable row level security" in migration

    assert "insert into storage.buckets" in migration
    assert "values ('quote-packs', 'quote-packs', false)" in migration
    assert "on storage.objects" in migration
    assert "storage.foldername(name)" in migration
    assert "raw_user_meta_data" not in migration
    assert "user_metadata" not in migration
