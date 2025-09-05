-- Create waitlist table for Limmo
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  biggest_challenge text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.waitlist enable row level security;

-- Allow anyone to insert (for waitlist signups)
create policy if not exists "Anyone can join waitlist"
  on public.waitlist for insert
  with check (true);

-- Allow users to update their own challenge response
create policy if not exists "Users can update their challenge"
  on public.waitlist for update
  using (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Update updated_at trigger function (idempotent)
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger on waitlist
create or replace trigger update_waitlist_updated_at
before update on public.waitlist
for each row
execute function public.update_updated_at_column();

-- Helpful indexes
create index if not exists idx_waitlist_email on public.waitlist(email);
create index if not exists idx_waitlist_created_at on public.waitlist(created_at desc);
