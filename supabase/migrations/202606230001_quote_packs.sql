create extension if not exists pgcrypto;

create table if not exists public.tenant_memberships (
  tenant_id text not null,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (role in ('admin', 'partner', 'pricing_support', 'viewer')),
  created_at timestamptz not null default now(),
  primary key (tenant_id, user_id)
);

create table if not exists public.estimates (
  estimate_id text primary key,
  tenant_id text not null,
  request_json jsonb not null,
  prediction_json jsonb not null,
  model_version text not null,
  dataset_lineage jsonb not null default '{}'::jsonb,
  synthetic_mode boolean not null default true,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now()
);

create table if not exists public.quote_pack_snapshots (
  snapshot_id uuid primary key default gen_random_uuid(),
  estimate_id text not null references public.estimates (estimate_id) on delete cascade,
  tenant_id text not null,
  snapshot_json jsonb not null,
  snapshot_checksum text not null,
  status text not null default 'draft' check (status in ('draft', 'approved', 'rendering', 'rendered', 'shared', 'revoked', 'failed')),
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now()
);

create table if not exists public.quote_packs (
  quote_pack_id uuid primary key default gen_random_uuid(),
  estimate_id text not null references public.estimates (estimate_id) on delete cascade,
  tenant_id text not null,
  snapshot_id uuid not null references public.quote_pack_snapshots (snapshot_id) on delete restrict,
  storage_bucket text not null default 'quote-packs',
  storage_path text not null,
  checksum_sha256 text not null,
  file_size_bytes bigint not null check (file_size_bytes > 0),
  status text not null default 'rendered' check (status in ('rendered', 'shared', 'revoked', 'failed')),
  approved_shareable boolean not null default false,
  expires_at timestamptz,
  rendered_at timestamptz not null default now(),
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  unique (storage_bucket, storage_path)
);

create table if not exists public.quote_pack_events (
  event_id uuid primary key default gen_random_uuid(),
  quote_pack_id uuid references public.quote_packs (quote_pack_id) on delete cascade,
  estimate_id text not null references public.estimates (estimate_id) on delete cascade,
  tenant_id text not null,
  event_type text not null check (event_type in ('generated', 'previewed', 'approved', 'downloaded', 'shared', 'revoked', 'failed')),
  actor_user_id uuid references auth.users (id),
  event_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists estimates_tenant_created_at_idx on public.estimates (tenant_id, created_at desc);
create index if not exists quote_pack_snapshots_tenant_estimate_idx on public.quote_pack_snapshots (tenant_id, estimate_id, created_at desc);
create index if not exists quote_packs_tenant_estimate_idx on public.quote_packs (tenant_id, estimate_id, created_at desc);
create index if not exists quote_pack_events_tenant_quote_pack_idx on public.quote_pack_events (tenant_id, quote_pack_id, created_at desc);

alter table public.tenant_memberships enable row level security;
alter table public.estimates enable row level security;
alter table public.quote_pack_snapshots enable row level security;
alter table public.quote_packs enable row level security;
alter table public.quote_pack_events enable row level security;

create policy "tenant members can read memberships"
on public.tenant_memberships
for select
to authenticated
using (user_id = auth.uid());

create policy "tenant members can read estimates"
on public.estimates
for select
to authenticated
using (
  exists (
    select 1 from public.tenant_memberships tm
    where tm.tenant_id = estimates.tenant_id
      and tm.user_id = auth.uid()
  )
);

create policy "tenant members can insert estimates"
on public.estimates
for insert
to authenticated
with check (
  exists (
    select 1 from public.tenant_memberships tm
    where tm.tenant_id = estimates.tenant_id
      and tm.user_id = auth.uid()
      and tm.role in ('admin', 'partner', 'pricing_support')
  )
);

create policy "tenant members can read quote snapshots"
on public.quote_pack_snapshots
for select
to authenticated
using (
  exists (
    select 1 from public.tenant_memberships tm
    where tm.tenant_id = quote_pack_snapshots.tenant_id
      and tm.user_id = auth.uid()
  )
);

create policy "tenant writers can insert quote snapshots"
on public.quote_pack_snapshots
for insert
to authenticated
with check (
  exists (
    select 1 from public.tenant_memberships tm
    where tm.tenant_id = quote_pack_snapshots.tenant_id
      and tm.user_id = auth.uid()
      and tm.role in ('admin', 'partner', 'pricing_support')
  )
);

create policy "tenant members can read quote packs"
on public.quote_packs
for select
to authenticated
using (
  exists (
    select 1 from public.tenant_memberships tm
    where tm.tenant_id = quote_packs.tenant_id
      and tm.user_id = auth.uid()
  )
);

create policy "tenant writers can insert quote packs"
on public.quote_packs
for insert
to authenticated
with check (
  exists (
    select 1 from public.tenant_memberships tm
    where tm.tenant_id = quote_packs.tenant_id
      and tm.user_id = auth.uid()
      and tm.role in ('admin', 'partner', 'pricing_support')
  )
);

create policy "tenant members can read quote pack events"
on public.quote_pack_events
for select
to authenticated
using (
  exists (
    select 1 from public.tenant_memberships tm
    where tm.tenant_id = quote_pack_events.tenant_id
      and tm.user_id = auth.uid()
  )
);

create policy "tenant members can insert quote pack events"
on public.quote_pack_events
for insert
to authenticated
with check (
  exists (
    select 1 from public.tenant_memberships tm
    where tm.tenant_id = quote_pack_events.tenant_id
      and tm.user_id = auth.uid()
  )
);

insert into storage.buckets (id, name, public)
values ('quote-packs', 'quote-packs', false)
on conflict (id) do update set public = false;

create policy "tenant members can read quote pack objects"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'quote-packs'
  and exists (
    select 1 from public.tenant_memberships tm
    where tm.tenant_id = (storage.foldername(name))[1]
      and tm.user_id = auth.uid()
  )
);

create policy "tenant writers can upload quote pack objects"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'quote-packs'
  and exists (
    select 1 from public.tenant_memberships tm
    where tm.tenant_id = (storage.foldername(name))[1]
      and tm.user_id = auth.uid()
      and tm.role in ('admin', 'partner', 'pricing_support')
  )
);

create policy "tenant writers can replace quote pack objects"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'quote-packs'
  and exists (
    select 1 from public.tenant_memberships tm
    where tm.tenant_id = (storage.foldername(name))[1]
      and tm.user_id = auth.uid()
      and tm.role in ('admin', 'partner', 'pricing_support')
  )
)
with check (
  bucket_id = 'quote-packs'
  and exists (
    select 1 from public.tenant_memberships tm
    where tm.tenant_id = (storage.foldername(name))[1]
      and tm.user_id = auth.uid()
      and tm.role in ('admin', 'partner', 'pricing_support')
  )
);
