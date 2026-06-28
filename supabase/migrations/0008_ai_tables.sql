create table public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index ai_conversations_user_idx on public.ai_conversations(user_id, updated_at desc);

create table public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.ai_conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  context_snapshot jsonb,
  token_count int,
  created_at timestamptz not null default now()
);
create index ai_messages_conversation_idx on public.ai_messages(conversation_id, created_at);

create table public.ai_recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  domain text not null check (domain in ('training', 'tennis', 'nutrition', 'recovery', 'progress', 'planning')),
  summary text not null,
  rationale text,
  data_used jsonb,
  is_dismissed boolean not null default false,
  created_at timestamptz not null default now()
);
create index ai_recommendations_user_idx on public.ai_recommendations(user_id, created_at desc);

create table public.ai_actions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  conversation_id uuid references public.ai_conversations(id) on delete set null,
  action_type ai_action_type not null,
  status ai_action_status not null default 'proposed',
  payload jsonb not null,
  rationale text,
  applied_at timestamptz,
  reverted_at timestamptz,
  created_at timestamptz not null default now()
);
create index ai_actions_user_idx on public.ai_actions(user_id, created_at desc);
