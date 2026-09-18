begin;

create schema if not exists private;

create table if not exists public.catalog_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.catalog (
  id text primary key check (id = 'main'),
  data jsonb not null,
  version bigint not null default 1 check (version > 0),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

alter table public.catalog_admins enable row level security;
alter table public.catalog enable row level security;

revoke all on public.catalog_admins from anon, authenticated;
revoke all on public.catalog from anon, authenticated;
grant select on public.catalog to anon, authenticated;
grant insert, update on public.catalog to authenticated;
grant all on public.catalog_admins, public.catalog to service_role;

create or replace function private.is_catalog_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.catalog_admins
    where user_id = (select auth.uid())
  );
$$;

revoke all on function private.is_catalog_admin() from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.is_catalog_admin() to authenticated;

drop policy if exists "catalog_public_read" on public.catalog;
create policy "catalog_public_read"
on public.catalog
for select
to anon, authenticated
using (true);

drop policy if exists "catalog_admin_insert" on public.catalog;
create policy "catalog_admin_insert"
on public.catalog
for insert
to authenticated
with check ((select private.is_catalog_admin()));

drop policy if exists "catalog_admin_update" on public.catalog;
create policy "catalog_admin_update"
on public.catalog
for update
to authenticated
using ((select private.is_catalog_admin()))
with check ((select private.is_catalog_admin()));

create or replace function public.save_catalog(payload jsonb, expected_version bigint)
returns public.catalog
language plpgsql
security invoker
set search_path = ''
as $$
declare
  saved public.catalog;
begin
  update public.catalog
  set
    data = payload,
    version = version + 1,
    updated_at = now(),
    updated_by = (select auth.uid())
  where id = 'main' and version = expected_version
  returning * into saved;

  if saved.id is null then
    raise exception 'catalog_conflict';
  end if;

  return saved;
end;
$$;

revoke all on function public.save_catalog(jsonb, bigint) from public, anon;
grant execute on function public.save_catalog(jsonb, bigint) to authenticated, service_role;

alter table public.catalog replica identity full;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'catalog'
  ) then
    alter publication supabase_realtime add table public.catalog;
  end if;
end
$$;

commit;
