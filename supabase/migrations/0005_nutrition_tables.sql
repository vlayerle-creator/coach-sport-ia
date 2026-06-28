create table public.nutrition_targets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  effective_from date not null default current_date,
  calories_kcal int not null,
  protein_g int not null,
  carbs_g int not null,
  fat_g int not null,
  fiber_g int,
  water_ml int,
  is_manual_override boolean not null default false,
  created_at timestamptz not null default now()
);
create index nutrition_targets_user_idx on public.nutrition_targets(user_id, effective_from desc);

-- Food items: global catalog (system rows have user_id null) + user-created custom foods
create table public.food_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  brand text,
  barcode text,
  serving_size_g numeric(7,2),
  calories_kcal_per_100g numeric(7,2) not null,
  protein_g_per_100g numeric(6,2) not null,
  carbs_g_per_100g numeric(6,2) not null,
  fat_g_per_100g numeric(6,2) not null,
  fiber_g_per_100g numeric(6,2),
  is_favorite boolean not null default false,
  created_at timestamptz not null default now()
);
create index food_items_user_idx on public.food_items(user_id);
create index food_items_name_trgm_idx on public.food_items using gin (name gin_trgm_ops);

create table public.meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  meal_date date not null default current_date,
  meal_type meal_type not null,
  planned_at time,
  logged_at timestamptz,
  source text not null default 'manual' check (source in ('manual', 'recipe', 'natural_language', 'menu_plan')),
  notes text,
  created_at timestamptz not null default now()
);
create index meals_user_date_idx on public.meals(user_id, meal_date desc);

create table public.meal_items (
  id uuid primary key default gen_random_uuid(),
  meal_id uuid not null references public.meals(id) on delete cascade,
  food_item_id uuid references public.food_items(id) on delete set null,
  recipe_id uuid,
  quantity_g numeric(7,2) not null,
  created_at timestamptz not null default now()
);
create index meal_items_meal_idx on public.meal_items(meal_id);

create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  image_storage_path text,
  prep_minutes int,
  cook_minutes int,
  difficulty text check (difficulty in ('easy', 'medium', 'hard')),
  estimated_cost_eur numeric(6,2),
  servings int not null default 1,
  calories_kcal numeric(7,2),
  protein_g numeric(6,2),
  carbs_g numeric(6,2),
  fat_g numeric(6,2),
  fiber_g numeric(6,2),
  storage_instructions text,
  batch_cooking_friendly boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index recipes_user_idx on public.recipes(user_id);

create table public.recipe_ingredients (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  food_item_id uuid references public.food_items(id) on delete set null,
  custom_name text,
  quantity_g numeric(7,2) not null,
  shopping_category text,
  created_at timestamptz not null default now()
);
create index recipe_ingredients_recipe_idx on public.recipe_ingredients(recipe_id);

alter table public.meal_items
  add constraint meal_items_recipe_id_fkey foreign key (recipe_id) references public.recipes(id) on delete set null;

create table public.meal_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  start_date date not null,
  end_date date not null,
  created_at timestamptz not null default now()
);
create index meal_plans_user_idx on public.meal_plans(user_id);

create table public.meal_plan_days (
  id uuid primary key default gen_random_uuid(),
  meal_plan_id uuid not null references public.meal_plans(id) on delete cascade,
  plan_date date not null,
  meal_type meal_type not null,
  recipe_id uuid references public.recipes(id) on delete set null,
  food_item_id uuid references public.food_items(id) on delete set null,
  quantity_g numeric(7,2),
  created_at timestamptz not null default now()
);
create index meal_plan_days_plan_idx on public.meal_plan_days(meal_plan_id, plan_date);

create table public.shopping_lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  meal_plan_id uuid references public.meal_plans(id) on delete set null,
  name text not null default 'Liste de courses',
  created_at timestamptz not null default now()
);
create index shopping_lists_user_idx on public.shopping_lists(user_id);

create table public.shopping_list_items (
  id uuid primary key default gen_random_uuid(),
  shopping_list_id uuid not null references public.shopping_lists(id) on delete cascade,
  label text not null,
  category text,
  quantity_g numeric(7,2),
  is_checked boolean not null default false,
  created_at timestamptz not null default now()
);
create index shopping_list_items_list_idx on public.shopping_list_items(shopping_list_id);
