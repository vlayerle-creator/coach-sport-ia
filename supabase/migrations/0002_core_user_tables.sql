-- profiles: 1:1 with auth.users, created by trigger on signup
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null,
  birth_date date,
  sex sex_type,
  height_cm numeric(5,2),
  avatar_url text,
  locale text not null default 'fr',
  units_weight text not null default 'kg' check (units_weight in ('kg', 'lb')),
  units_length text not null default 'cm' check (units_length in ('cm', 'in')),
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_settings (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  dark_mode boolean not null default false,
  notifications_enabled boolean not null default true,
  ai_personalization_enabled boolean not null default true,
  ai_history_retained boolean not null default true,
  data_export_requested_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  primary_goal primary_goal not null,
  secondary_goals secondary_goal[] not null default '{}',
  target_weight_kg numeric(5,2),
  target_date date,
  sport_level sport_level,
  tennis_level text,
  weekly_sessions_target int,
  training_location training_location,
  available_equipment text[] not null default '{}',
  max_session_minutes int,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index goals_user_id_idx on public.goals(user_id);

create table public.body_measurements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  measured_at date not null default current_date,
  weight_kg numeric(5,2),
  neck_cm numeric(5,2),
  shoulders_cm numeric(5,2),
  chest_cm numeric(5,2),
  arm_left_cm numeric(5,2),
  arm_right_cm numeric(5,2),
  waist_cm numeric(5,2),
  hips_cm numeric(5,2),
  thigh_left_cm numeric(5,2),
  thigh_right_cm numeric(5,2),
  calf_left_cm numeric(5,2),
  calf_right_cm numeric(5,2),
  body_fat_pct numeric(4,2),
  muscle_mass_kg numeric(5,2),
  water_mass_pct numeric(4,2),
  notes text,
  created_at timestamptz not null default now()
);
create index body_measurements_user_date_idx on public.body_measurements(user_id, measured_at desc);

create table public.progress_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  taken_at date not null default current_date,
  angle text not null check (angle in ('front', 'side', 'back')),
  storage_path text not null,
  is_hidden boolean not null default false,
  created_at timestamptz not null default now()
);
create index progress_photos_user_date_idx on public.progress_photos(user_id, taken_at desc);

create table public.daily_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  checkin_date date not null default current_date,
  sleep_quality smallint check (sleep_quality between 1 and 5),
  sleep_hours numeric(4,2),
  energy smallint check (energy between 1 and 5),
  motivation smallint check (motivation between 1 and 5),
  stress smallint check (stress between 1 and 5),
  soreness smallint check (soreness between 1 and 5),
  hunger smallint check (hunger between 1 and 5),
  digestion smallint check (digestion between 1 and 5),
  mood smallint check (mood between 1 and 5),
  fatigue smallint check (fatigue between 1 and 5),
  training_motivation smallint check (training_motivation between 1 and 5),
  resting_heart_rate smallint,
  notes text,
  readiness_score numeric(5,2),
  created_at timestamptz not null default now(),
  unique (user_id, checkin_date)
);
create index daily_checkins_user_date_idx on public.daily_checkins(user_id, checkin_date desc);

create table public.pain_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  body_zone text not null,
  side pain_side,
  intensity smallint not null check (intensity between 1 and 10),
  pain_type text,
  started_on date not null default current_date,
  resolved_on date,
  trigger_movement text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index pain_logs_user_idx on public.pain_logs(user_id, started_on desc);

create table public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  target_frequency_per_week smallint,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create index habits_user_idx on public.habits(user_id);

create table public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  log_date date not null default current_date,
  completed boolean not null default true,
  created_at timestamptz not null default now(),
  unique (habit_id, log_date)
);
create index habit_logs_user_date_idx on public.habit_logs(user_id, log_date desc);
