create table public.tennis_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  session_date date not null default current_date,
  duration_minutes int,
  session_type text check (session_type in ('lesson', 'practice', 'match', 'physical')),
  partner_name text,
  coach_name text,
  surface text check (surface in ('hard', 'clay', 'grass', 'carpet')),
  intensity smallint check (intensity between 1 and 5),
  is_match boolean not null default false,
  match_score text,
  match_won boolean,
  service_rating smallint check (service_rating between 1 and 5),
  forehand_rating smallint check (forehand_rating between 1 and 5),
  backhand_rating smallint check (backhand_rating between 1 and 5),
  volley_rating smallint check (volley_rating between 1 and 5),
  movement_rating smallint check (movement_rating between 1 and 5),
  fatigue smallint check (fatigue between 1 and 5),
  pain_flag boolean not null default false,
  notes text,
  created_at timestamptz not null default now()
);
create index tennis_sessions_user_idx on public.tennis_sessions(user_id, session_date desc);

create table public.tennis_drills (
  id uuid primary key default gen_random_uuid(),
  tennis_session_id uuid not null references public.tennis_sessions(id) on delete cascade,
  name text not null,
  category text check (category in (
    'warmup', 'mobility', 'technique', 'movement', 'endurance', 'strength_specific', 'recovery'
  )),
  duration_minutes int,
  notes text,
  created_at timestamptz not null default now()
);
create index tennis_drills_session_idx on public.tennis_drills(tennis_session_id);
