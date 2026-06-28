-- Snapshot of onboarding answers that are not tracked day-to-day elsewhere.
-- Day-to-day equivalents live in their dedicated tables (daily_checkins,
-- pain_logs, supplements, nutrition_targets...); these columns hold the
-- declarative baseline collected once during onboarding.
alter table public.user_settings
  add column diet_type diet_type,
  add column allergies text[] not null default '{}',
  add column intolerances text[] not null default '{}',
  add column refused_foods text[] not null default '{}',
  add column preferred_meals_count smallint,
  add column cooking_budget_level text check (cooking_budget_level in ('low', 'medium', 'high')),
  add column cooking_time_minutes smallint,
  add column past_injuries text,
  add column joint_limitations text,
  add column declared_treatments text,
  add column voluntary_health_notes text,
  add column average_sleep_quality smallint check (average_sleep_quality between 1 and 5),
  add column average_stress smallint check (average_stress between 1 and 5),
  add column average_energy smallint check (average_energy between 1 and 5);
