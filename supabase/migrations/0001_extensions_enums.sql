-- Extensions
create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";

-- Enums
create type sex_type as enum ('male', 'female');
create type sport_level as enum ('beginner', 'intermediate', 'advanced', 'elite');
create type primary_goal as enum ('bulk', 'cut', 'recomp', 'maintain');
create type secondary_goal as enum (
  'strength', 'hypertrophy', 'endurance', 'mobility', 'conditioning',
  'tennis_performance', 'injury_prevention', 'recovery', 'sleep'
);
create type training_location as enum ('home', 'gym', 'both');
create type muscle_group as enum (
  'chest', 'back', 'shoulders', 'biceps', 'triceps', 'quadriceps',
  'hamstrings', 'glutes', 'calves', 'abs', 'core', 'mobility', 'cardio', 'warmup'
);
create type movement_type as enum ('compound', 'isolation', 'bodyweight', 'cardio', 'mobility');
create type set_type as enum ('warmup', 'working', 'superset', 'dropset', 'circuit', 'amrap');
create type program_split as enum (
  'full_body', 'upper_lower', 'push_pull_legs', 'body_part_split', 'custom'
);
create type session_status as enum ('planned', 'in_progress', 'completed', 'skipped', 'cancelled');
create type pain_side as enum ('left', 'right', 'center', 'both');
create type meal_type as enum (
  'breakfast', 'morning_snack', 'lunch', 'afternoon_snack',
  'pre_workout', 'post_workout', 'dinner', 'evening_snack'
);
create type diet_type as enum ('omnivore', 'vegetarian', 'vegan', 'pescatarian', 'other');
create type supplement_type as enum (
  'protein', 'creatine', 'vitamin_d', 'magnesium', 'omega3', 'electrolytes',
  'caffeine', 'multivitamin', 'collagen', 'zinc', 'iron', 'vitamin_b12', 'other'
);
create type calendar_event_type as enum (
  'strength_session', 'tennis_session', 'mobility', 'cardio', 'recovery', 'rest',
  'meal', 'meal_prep', 'supplement', 'weigh_in', 'measurement', 'progress_photo',
  'appointment', 'custom'
);
create type ai_action_type as enum (
  'propose_session', 'move_session', 'replace_exercise', 'adjust_calorie_target',
  'generate_menu', 'generate_shopping_list', 'adjust_progression', 'create_deload_week'
);
create type ai_action_status as enum ('proposed', 'approved', 'rejected', 'applied', 'reverted');
create type report_period as enum ('weekly', 'monthly', 'cycle');
