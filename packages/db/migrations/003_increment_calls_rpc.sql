-- Atomic increment for agent key call counter
-- Used by the API gateway to safely bump calls_this_month
create or replace function increment_calls(key_id uuid)
returns void as $$
begin
  update agent_keys
  set calls_this_month = calls_this_month + 1
  where id = key_id;
end;
$$ language plpgsql security definer;
