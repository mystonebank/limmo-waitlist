-- Comprehensive fix for waitlist RLS policies
-- Drop ALL existing policies first
drop policy if exists "Anyone can join waitlist" on public.waitlist;
drop policy if exists "Users can update their challenge" on public.waitlist;
drop policy if exists "Anyone can update waitlist" on public.waitlist;
drop policy if exists "Anyone can upsert waitlist" on public.waitlist;
drop policy if exists "Public waitlist insert" on public.waitlist;
drop policy if exists "Public waitlist update" on public.waitlist;
drop policy if exists "Public waitlist select" on public.waitlist;

-- Disable RLS temporarily to test
alter table public.waitlist disable row level security;

-- Re-enable RLS
alter table public.waitlist enable row level security;

-- Create comprehensive policies for public access
create policy "Public waitlist insert"
  on public.waitlist for insert
  with check (true);

create policy "Public waitlist update"
  on public.waitlist for update
  using (true)
  with check (true);

create policy "Public waitlist select"
  on public.waitlist for select
  using (true);

-- Verify policies are created
select schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
from pg_policies 
where tablename = 'waitlist';
