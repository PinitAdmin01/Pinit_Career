-- ─────────────────────────────────────────────────────────────────────────────
-- FIX 2 — Bonus vault claim: server-only and atomic
-- Supabase Dashboard → SQL Editor → PRODUCTION project. Paste the WHOLE file, Run once. Safe to re-run.
--
-- Before: claim_bonus_pins(p_user_id, p_amount) (20260920) was callable by every logged-in user for
-- ANY user id, and api/pins/claim-bonus did its own read-then-write, which can undo a Pins spend
-- that lands in between (the spent Pins come back).
-- After: only the server can call it; it locks the row, moves the Pins and records the claim in
-- pin_history in one step. The route (patch 07) calls it.
-- ─────────────────────────────────────────────────────────────────────────────

begin;

create or replace function public.claim_bonus_pins(
  p_user_id uuid,
  p_amount integer default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_current_pins integer;
  v_current_bonus integer;
  v_history jsonb;
  v_to_claim integer;
  v_new_pins integer;
  v_new_bonus integer;
  v_tx jsonb;
begin
  select pins, bonus_pins, coalesce(pin_history, '[]'::jsonb)
  into v_current_pins, v_current_bonus, v_history
  from public.users
  where id = p_user_id
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'USER_NOT_FOUND', 'message', 'User profile not found');
  end if;

  v_current_pins := coalesce(v_current_pins, 0);
  v_current_bonus := coalesce(v_current_bonus, 0);

  if v_current_bonus <= 0 then
    return jsonb_build_object('ok', false, 'error', 'NO_BONUS_PINS', 'message', 'You have no bonus pins available in your vault to claim.');
  end if;

  if p_amount is not null and p_amount > 0 then
    v_to_claim := least(p_amount, v_current_bonus);
  else
    v_to_claim := v_current_bonus;
  end if;

  v_new_pins := v_current_pins + v_to_claim;
  v_new_bonus := v_current_bonus - v_to_claim;
  v_tx := jsonb_build_object(
    'id', 'tx_bonus_' || floor(extract(epoch from now()) * 1000)::text || '_' || substr(md5(random()::text), 1, 6),
    'amount', v_to_claim,
    'type', 'earn',
    'source', 'bonus_claim',
    'reason', 'Claimed +' || v_to_claim || ' pins from Bonus Vault',
    'timestamp', floor(extract(epoch from now()) * 1000)
  );

  update public.users
  set pins = v_new_pins,
      bonus_pins = v_new_bonus,
      pin_history = jsonb_path_query_array(jsonb_build_array(v_tx) || v_history, '$[0 to 99]')
  where id = p_user_id;

  return jsonb_build_object(
    'ok', true,
    'claimed', v_to_claim,
    'new_pins', v_new_pins,
    'remaining_bonus', v_new_bonus
  );
end;
$$;

revoke execute on function public.claim_bonus_pins(uuid, integer) from public, anon, authenticated;
grant execute on function public.claim_bonus_pins(uuid, integer) to service_role;

commit;

notify pgrst, 'reload schema';
