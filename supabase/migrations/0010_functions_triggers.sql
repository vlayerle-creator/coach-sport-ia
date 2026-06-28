-- Generic updated_at touch
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  t text;
begin
  for t in select unnest(array[
    'profiles', 'user_settings', 'goals', 'pain_logs', 'workout_programs',
    'workout_sessions', 'recipes', 'supplements', 'calendar_events',
    'reminders', 'ai_conversations'
  ])
  loop
    execute format(
      'create trigger %I_touch_updated_at before update on public.%I
       for each row execute function public.touch_updated_at();',
      t, t
    );
  end loop;
end;
$$;

-- Auto-create profile + settings + default nutrition target row on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, first_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'first_name', 'Athlète'));

  insert into public.user_settings (user_id)
  values (new.id);

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
