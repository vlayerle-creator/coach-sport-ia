create table public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  event_type calendar_event_type not null,
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  is_recurring boolean not null default false,
  recurrence_rule text,
  related_workout_session_id uuid references public.workout_sessions(id) on delete set null,
  related_tennis_session_id uuid references public.tennis_sessions(id) on delete set null,
  related_meal_id uuid references public.meals(id) on delete set null,
  completed_at timestamptz,
  is_overdue boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index calendar_events_user_starts_idx on public.calendar_events(user_id, starts_at);

create table public.reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  category text not null check (category in (
    'training', 'tennis', 'weigh_in', 'measurement', 'progress_photo', 'meal',
    'water', 'supplement', 'bedtime', 'daily_checkin', 'meal_prep', 'shopping_list'
  )),
  label text not null,
  reminder_time time not null,
  days_of_week smallint[] not null default '{1,2,3,4,5,6,7}',
  is_enabled boolean not null default true,
  snoozed_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index reminders_user_idx on public.reminders(user_id);
