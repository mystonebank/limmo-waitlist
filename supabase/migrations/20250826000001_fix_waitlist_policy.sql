-- Update RLS policy to allow updates without authentication for waitlist
drop policy if exists "Users can update their challenge" on public.waitlist;

-- Allow anyone to update waitlist entries (for challenge responses)
create policy "Anyone can update waitlist"
  on public.waitlist for update
  with check (true);

-- Also allow upsert operations (which include insert)
create policy "Anyone can upsert waitlist"
  on public.waitlist for insert
  with check (true);
