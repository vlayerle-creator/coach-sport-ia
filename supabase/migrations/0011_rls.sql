-- ============================================================
-- Row Level Security
-- Pattern for every user-owned table: owner can select/insert/
-- update/delete only rows where user_id = auth.uid().
-- Tables reached through a parent (e.g. workout_sets through
-- workout_session_exercises -> workout_sessions) are scoped via
-- a join back to the owning user_id.
-- ============================================================

create or replace function public.owns_program_day(p_program_day_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.workout_program_days d
    join public.workout_programs p on p.id = d.program_id
    where d.id = p_program_day_id and p.user_id = auth.uid()
  );
$$;

create or replace function public.owns_session(p_session_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.workout_sessions s
    where s.id = p_session_id and s.user_id = auth.uid()
  );
$$;

create or replace function public.owns_session_exercise(p_session_exercise_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.workout_session_exercises se
    join public.workout_sessions s on s.id = se.session_id
    where se.id = p_session_exercise_id and s.user_id = auth.uid()
  );
$$;

create or replace function public.owns_meal(p_meal_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.meals m where m.id = p_meal_id and m.user_id = auth.uid()
  );
$$;

create or replace function public.owns_recipe(p_recipe_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.recipes r where r.id = p_recipe_id and r.user_id = auth.uid()
  );
$$;

create or replace function public.owns_meal_plan(p_meal_plan_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.meal_plans mp where mp.id = p_meal_plan_id and mp.user_id = auth.uid()
  );
$$;

create or replace function public.owns_shopping_list(p_shopping_list_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.shopping_lists sl where sl.id = p_shopping_list_id and sl.user_id = auth.uid()
  );
$$;

create or replace function public.owns_supplement(p_supplement_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.supplements s where s.id = p_supplement_id and s.user_id = auth.uid()
  );
$$;

create or replace function public.owns_tennis_session(p_tennis_session_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.tennis_sessions t where t.id = p_tennis_session_id and t.user_id = auth.uid()
  );
$$;

create or replace function public.owns_habit(p_habit_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.habits h where h.id = p_habit_id and h.user_id = auth.uid()
  );
$$;

create or replace function public.owns_conversation(p_conversation_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.ai_conversations c where c.id = p_conversation_id and c.user_id = auth.uid()
  );
$$;

-- ---------- Simple "user_id = auth.uid()" tables ----------
do $$
declare
  t text;
begin
  for t in select unnest(array[
    'profiles', 'user_settings', 'goals', 'body_measurements', 'progress_photos',
    'daily_checkins', 'pain_logs', 'habits', 'workout_programs', 'workout_sessions',
    'personal_records', 'tennis_sessions', 'nutrition_targets', 'meals', 'recipes',
    'meal_plans', 'shopping_lists', 'supplements', 'supplement_logs',
    'calendar_events', 'reminders', 'ai_conversations', 'ai_recommendations',
    'ai_actions', 'notifications', 'weekly_reports', 'monthly_reports'
  ])
  loop
    execute format('alter table public.%I enable row level security;', t);

    if t = 'profiles' then
      execute format($p$
        create policy %1$I_select on public.%1$I for select using (id = auth.uid());
        create policy %1$I_update on public.%1$I for update using (id = auth.uid());
        create policy %1$I_delete on public.%1$I for delete using (id = auth.uid());
      $p$, t);
    else
      execute format($p$
        create policy %1$I_select on public.%1$I for select using (user_id = auth.uid());
        create policy %1$I_insert on public.%1$I for insert with check (user_id = auth.uid());
        create policy %1$I_update on public.%1$I for update using (user_id = auth.uid());
        create policy %1$I_delete on public.%1$I for delete using (user_id = auth.uid());
      $p$, t);
    end if;
  end loop;
end;
$$;

-- food_items: user rows (user_id not null) are owner-scoped; system rows
-- (user_id is null) are read-only reference data for everyone.
alter table public.food_items enable row level security;
create policy food_items_select on public.food_items
  for select using (user_id = auth.uid() or user_id is null);
create policy food_items_insert on public.food_items
  for insert with check (user_id = auth.uid());
create policy food_items_update on public.food_items
  for update using (user_id = auth.uid());
create policy food_items_delete on public.food_items
  for delete using (user_id = auth.uid());

-- ---------- Child tables scoped via parent ownership ----------
alter table public.workout_program_days enable row level security;
create policy workout_program_days_all on public.workout_program_days
  using (exists (select 1 from public.workout_programs p where p.id = program_id and p.user_id = auth.uid()))
  with check (exists (select 1 from public.workout_programs p where p.id = program_id and p.user_id = auth.uid()));

alter table public.workout_program_exercises enable row level security;
create policy workout_program_exercises_all on public.workout_program_exercises
  using (public.owns_program_day(program_day_id))
  with check (public.owns_program_day(program_day_id));

alter table public.workout_session_exercises enable row level security;
create policy workout_session_exercises_all on public.workout_session_exercises
  using (public.owns_session(session_id))
  with check (public.owns_session(session_id));

alter table public.workout_sets enable row level security;
create policy workout_sets_all on public.workout_sets
  using (public.owns_session_exercise(session_exercise_id))
  with check (public.owns_session_exercise(session_exercise_id));

alter table public.tennis_drills enable row level security;
create policy tennis_drills_all on public.tennis_drills
  using (public.owns_tennis_session(tennis_session_id))
  with check (public.owns_tennis_session(tennis_session_id));

alter table public.meal_items enable row level security;
create policy meal_items_all on public.meal_items
  using (public.owns_meal(meal_id))
  with check (public.owns_meal(meal_id));

alter table public.recipe_ingredients enable row level security;
create policy recipe_ingredients_all on public.recipe_ingredients
  using (public.owns_recipe(recipe_id))
  with check (public.owns_recipe(recipe_id));

alter table public.meal_plan_days enable row level security;
create policy meal_plan_days_all on public.meal_plan_days
  using (public.owns_meal_plan(meal_plan_id))
  with check (public.owns_meal_plan(meal_plan_id));

alter table public.shopping_list_items enable row level security;
create policy shopping_list_items_all on public.shopping_list_items
  using (public.owns_shopping_list(shopping_list_id))
  with check (public.owns_shopping_list(shopping_list_id));

alter table public.habit_logs enable row level security;
create policy habit_logs_all on public.habit_logs
  using (user_id = auth.uid() and public.owns_habit(habit_id))
  with check (user_id = auth.uid() and public.owns_habit(habit_id));

alter table public.ai_messages enable row level security;
create policy ai_messages_all on public.ai_messages
  using (user_id = auth.uid() and public.owns_conversation(conversation_id))
  with check (user_id = auth.uid() and public.owns_conversation(conversation_id));

-- ---------- Global reference data: read-only for standard users ----------
alter table public.exercises enable row level security;
create policy exercises_select on public.exercises for select using (true);

alter table public.exercise_variations enable row level security;
create policy exercise_variations_select on public.exercise_variations for select using (true);

-- Writes to exercises/exercise_variations are reserved for the service role
-- (admin tooling / seed scripts), which bypasses RLS entirely.
