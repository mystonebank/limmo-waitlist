-- Secure function search_path for update_updated_at_column
create or replace function public.update_updated_at_column()
returns trigger
security invoker
set search_path = public
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;