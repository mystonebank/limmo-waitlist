-- Fix waitlist RLS policies for public access
-- Drop existing policies
drop policy if exists "Anyone can join waitlist" on public.waitlist;
drop policy if exists "Users can update their challenge" on public.waitlist;
drop policy if exists "Anyone can update waitlist" on public.waitlist;
drop policy if exists "Anyone can upsert waitlist" on public.waitlist;

-- Create new policies that allow public access
create policy "Public waitlist insert"
  on public.waitlist for insert
  with check (true);

create policy "Public waitlist update"
  on public.waitlist for update
  with check (true);

create policy "Public waitlist select"
  on public.waitlist for select
  using (true);
