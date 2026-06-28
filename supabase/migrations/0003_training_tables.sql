-- Global, read-only-for-users exercise library (no user_id: owned by the platform)
create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  primary_muscle muscle_group not null,
  secondary_muscles muscle_group[] not null default '{}',
  movement_type movement_type not null,
  equipment text[] not null default '{}',
  level sport_level not null default 'beginner',
  instructions text,
  technique_tips text,
  common_mistakes text,
  recommended_rom text,
  media_url text,
  is_unilateral boolean not null default false,
  contraindications text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index exercises_primary_muscle_idx on public.exercises(primary_muscle);
create index exercises_name_trgm_idx on public.exercises using gin (name gin_trgm_ops);

create table public.exercise_variations (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  alternative_exercise_id uuid not null references public.exercises(id) on delete cascade,
  reason text,
  created_at timestamptz not null default now(),
  unique (exercise_id, alternative_exercise_id)
);

create table public.workout_programs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  split program_split not null,
  goal secondary_goal,
  level sport_level not null default 'beginner',
  weeks_count int not null default 4,
  is_active boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index workout_programs_user_idx on public.workout_programs(user_id);

create table public.workout_program_days (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.workout_programs(id) on delete cascade,
  day_index smallint not null,
  name text not null,
  notes text,
  created_at timestamptz not null default now(),
  unique (program_id, day_index)
);

create table public.workout_program_exercises (
  id uuid primary key default gen_random_uuid(),
  program_day_id uuid not null references public.workout_program_days(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete restrict,
  order_index smallint not null,
  target_sets smallint not null default 3,
  target_reps_min smallint,
  target_reps_max smallint,
  target_rpe numeric(3,1),
  target_rir smallint,
  rest_seconds int default 90,
  tempo text,
  set_type set_type not null default 'working',
  is_optional boolean not null default false,
  notes text,
  created_at timestamptz not null default now()
);
create index workout_program_exercises_day_idx on public.workout_program_exercises(program_day_id);

create table public.workout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  program_day_id uuid references public.workout_program_days(id) on delete set null,
  scheduled_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  status session_status not null default 'planned',
  perceived_fatigue smallint check (perceived_fatigue between 1 and 5),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index workout_sessions_user_idx on public.workout_sessions(user_id, scheduled_at desc);

create table public.workout_session_exercises (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.workout_sessions(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete restrict,
  order_index smallint not null,
  replaced_program_exercise_id uuid references public.workout_program_exercises(id) on delete set null,
  skipped boolean not null default false,
  pain_flag boolean not null default false,
  notes text,
  created_at timestamptz not null default now()
);
create index workout_session_exercises_session_idx on public.workout_session_exercises(session_id);

create table public.workout_sets (
  id uuid primary key default gen_random_uuid(),
  session_exercise_id uuid not null references public.workout_session_exercises(id) on delete cascade,
  set_index smallint not null,
  set_type set_type not null default 'working',
  weight_kg numeric(6,2),
  reps smallint,
  rpe numeric(3,1),
  rir smallint,
  completed_at timestamptz,
  notes text,
  created_at timestamptz not null default now()
);
create index workout_sets_session_exercise_idx on public.workout_sets(session_exercise_id);

create table public.personal_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  record_type text not null check (record_type in ('1rm_estimated', 'max_weight', 'max_reps', 'max_volume')),
  value numeric(8,2) not null,
  achieved_at date not null default current_date,
  workout_set_id uuid references public.workout_sets(id) on delete set null,
  created_at timestamptz not null default now()
);
create index personal_records_user_exercise_idx on public.personal_records(user_id, exercise_id);
