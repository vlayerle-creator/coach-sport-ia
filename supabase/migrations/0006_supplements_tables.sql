create table public.supplements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  type supplement_type not null,
  dosage numeric(7,2),
  unit text,
  timing text,
  frequency text,
  goal text,
  brand text,
  stock_remaining int,
  start_date date,
  end_date date,
  notes text,
  perceived_effects text,
  adverse_effects text,
  requires_medical_validation boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index supplements_user_idx on public.supplements(user_id);

create table public.supplement_logs (
  id uuid primary key default gen_random_uuid(),
  supplement_id uuid not null references public.supplements(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  taken_at timestamptz not null default now(),
  dosage_taken numeric(7,2),
  notes text,
  created_at timestamptz not null default now()
);
create index supplement_logs_user_idx on public.supplement_logs(user_id, taken_at desc);
