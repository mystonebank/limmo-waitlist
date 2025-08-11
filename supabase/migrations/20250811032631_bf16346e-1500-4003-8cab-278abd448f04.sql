-- Create wins table for Limmo app
create table if not exists public.wins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  content text not null,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.wins enable row level security;

-- Drop existing policies if they exist, then recreate
drop policy if exists "Users can view their own wins" on public.wins;
drop policy if exists "Users can insert their own wins" on public.wins;
drop policy if exists "Users can update their own wins" on public.wins;
drop policy if exists "Users can delete their own wins" on public.wins;

create policy "Users can view their own wins"
  on public.wins for select
  using (auth.uid() = user_id);

create policy "Users can insert their own wins"
  on public.wins for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own wins"
  on public.wins for update
  using (auth.uid() = user_id);

create policy "Users can delete their own wins"
  on public.wins for delete
  using (auth.uid() = user_id);

-- Update updated_at trigger function (idempotent)
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger on wins
create or replace trigger update_wins_updated_at
before update on public.wins
for each row
execute function public.update_updated_at_column();

-- Helpful indexes
create index if not exists idx_wins_user_id on public.wins(user_id);
create index if not exists idx_wins_created_at on public.wins(created_at desc);
create index if not exists idx_wins_tags on public.wins using gin(tags);
