-- Stores AI-generated menu plans as editable JSONB
create table public.menu_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  generated_at timestamptz not null default now(),
  parameters jsonb not null default '{}',
  days jsonb not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index menu_plans_user_idx on public.menu_plans(user_id, generated_at desc);

alter table public.menu_plans enable row level security;
create policy "Users manage own menu plans" on public.menu_plans
  for all using (auth.uid() = user_id);
