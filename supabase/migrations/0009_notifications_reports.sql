create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  category text not null,
  title text not null,
  body text,
  is_read boolean not null default false,
  link_path text,
  created_at timestamptz not null default now()
);
create index notifications_user_idx on public.notifications(user_id, created_at desc);

create table public.weekly_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  period report_period not null default 'weekly',
  period_start date not null,
  period_end date not null,
  summary text,
  metrics jsonb,
  recommendations text,
  created_at timestamptz not null default now(),
  unique (user_id, period_start, period_end)
);
create index weekly_reports_user_idx on public.weekly_reports(user_id, period_start desc);

create table public.monthly_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  period report_period not null default 'monthly',
  period_start date not null,
  period_end date not null,
  summary text,
  metrics jsonb,
  recommendations text,
  created_at timestamptz not null default now(),
  unique (user_id, period_start, period_end)
);
create index monthly_reports_user_idx on public.monthly_reports(user_id, period_start desc);
