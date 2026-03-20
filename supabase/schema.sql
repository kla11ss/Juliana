create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'lead_type') then
    create type lead_type as enum ('mentoring', 'consultation');
  end if;

  if not exists (select 1 from pg_type where typname = 'lead_status') then
    create type lead_status as enum ('new', 'in_review', 'contacted', 'qualified', 'closed');
  end if;
end $$;

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  lead_type lead_type not null,
  status lead_status not null default 'new',
  name text not null,
  contact text not null,
  city_timezone text,
  age_range text,
  goal text,
  training_background text,
  blockers text,
  expectations text,
  readiness text,
  question_for_ulyana text,
  question_description text,
  extra_notes text,
  internal_note text,
  contacted_at timestamptz,
  consent_privacy boolean not null default false,
  consent_pd boolean not null default false,
  source text not null default 'website'
);

create table if not exists public.lead_meta (
  lead_id uuid primary key references public.leads(id) on delete cascade,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  referer text,
  locale text,
  device text,
  started_at text,
  submitted_step_count integer
);

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
before update on public.leads
for each row
execute function set_updated_at();

alter table public.leads enable row level security;
alter table public.lead_meta enable row level security;

drop policy if exists "authenticated can read leads" on public.leads;
create policy "authenticated can read leads"
on public.leads
for select
to authenticated
using (true);

drop policy if exists "authenticated can update leads" on public.leads;
create policy "authenticated can update leads"
on public.leads
for update
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated can read lead meta" on public.lead_meta;
create policy "authenticated can read lead meta"
on public.lead_meta
for select
to authenticated
using (true);

comment on table public.leads is 'Заявки с лендинга Ульяны Гойхман';
comment on table public.lead_meta is 'Маркетинговые и технические метаданные по заявке';
