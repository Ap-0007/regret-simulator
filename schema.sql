-- Regret Simulator — Supabase schema
-- Run this in the Supabase SQL editor

create table simulations (
  id uuid primary key default gen_random_uuid(),
  share_token text unique default substr(md5(random()::text), 1, 10),
  input jsonb not null,
  result jsonb,
  created_at timestamptz default now(),
  completed_at timestamptz
);

create index on simulations(share_token);

-- Optional: enable RLS (read-only public access by share_token)
alter table simulations enable row level security;

create policy "Public can read by share_token"
  on simulations for select
  using (true);

create policy "Service role can write"
  on simulations for all
  using (auth.role() = 'service_role');
