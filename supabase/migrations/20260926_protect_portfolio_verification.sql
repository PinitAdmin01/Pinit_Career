-- ─────────────────────────────────────────────────────────────────────────────
-- FIX 4 — Students cannot mark their own portfolio items verified
-- Supabase Dashboard → SQL Editor → PRODUCTION project. Paste the WHOLE file, Run once. Safe to re-run.
--
-- portfolio_items is written from the browser (the portfolio tab), so a student could store
-- "verified": true (or a passed assessment score) on any project, certificate, research paper or
-- timeline entry. src/lib/portfolio/endorsements.ts documents that the real gate must be in the
-- database. This trigger is that gate:
--   • writes from the browser (anon / authenticated) keep the verification fields already stored
--     for each item (matched by item id); new items start unverified;
--   • the server (service_role: verify-exam, future faculty tools) can still record real verifications.
-- Protected fields: verified, isVerified, verifiedBy, verifiedAt, verificationStatus, auditStatus,
-- assessmentPassed, assessmentScore, assessedAt.
-- ─────────────────────────────────────────────────────────────────────────────

begin;

create or replace function public.protect_portfolio_verification()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  v_items jsonb;
  v_old_items jsonb := '[]'::jsonb;
  v_item jsonb;
  v_old jsonb;
  v_out jsonb := '[]'::jsonb;
begin
  if coalesce(current_setting('role', true), '') not in ('anon', 'authenticated') then
    return new;
  end if;

  v_items := new.item_data -> 'items';
  if v_items is null or jsonb_typeof(v_items) <> 'array' then
    return new;
  end if;
  if tg_op = 'UPDATE' and jsonb_typeof(old.item_data -> 'items') = 'array' then
    v_old_items := old.item_data -> 'items';
  end if;

  for v_item in select value from jsonb_array_elements(v_items) loop
    if jsonb_typeof(v_item) = 'object' then
      v_old := null;
      select value into v_old
      from jsonb_array_elements(v_old_items)
      where jsonb_typeof(value) = 'object' and value ->> 'id' = v_item ->> 'id'
      limit 1;

      v_item := v_item - 'verified' - 'isVerified' - 'verifiedBy' - 'verifiedAt' - 'verificationStatus'
                       - 'auditStatus' - 'assessmentPassed' - 'assessmentScore' - 'assessedAt';
      if v_old is not null then
        v_item := v_item || jsonb_strip_nulls(jsonb_build_object(
          'verified', v_old -> 'verified',
          'isVerified', v_old -> 'isVerified',
          'verifiedBy', v_old -> 'verifiedBy',
          'verifiedAt', v_old -> 'verifiedAt',
          'verificationStatus', v_old -> 'verificationStatus',
          'auditStatus', v_old -> 'auditStatus',
          'assessmentPassed', v_old -> 'assessmentPassed',
          'assessmentScore', v_old -> 'assessmentScore',
          'assessedAt', v_old -> 'assessedAt'
        ));
      end if;
      if not (v_item ? 'verified') then
        v_item := v_item || '{"verified": false}'::jsonb;
      end if;
    end if;
    v_out := v_out || jsonb_build_array(v_item);
  end loop;

  new.item_data := jsonb_set(new.item_data, '{items}', v_out);
  return new;
end;
$$;

drop trigger if exists trg_protect_portfolio_verification on public.portfolio_items;
create trigger trg_protect_portfolio_verification
  before insert or update on public.portfolio_items
  for each row execute function public.protect_portfolio_verification();

commit;
