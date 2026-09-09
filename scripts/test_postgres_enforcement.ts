// scripts/test_postgres_enforcement.ts
// Live PostgreSQL Integration Test Suite: Real Engine Privileges, Ownership Boundary & Append-Only Trigger Enforcement
// Proves Real PostgreSQL Engine Enforces Security Contracts (Option A)

import { PGlite } from '@electric-sql/pglite';

let testsPassed = 0;
let testsFailed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  ✅ [PASS] ${testName}`);
    testsPassed++;
  } else {
    console.error(`  ❌ [FAIL] ${testName}${detail ? ` - Detail: ${detail}` : ''}`);
    testsFailed++;
  }
}

async function runPostgresEnforcementSuite() {
  console.log('\n========================================================================');
  console.log('🐘 RUNNING LIVE POSTGRESQL ENGINE SECURITY & ENFORCEMENT TEST SUITE');
  console.log('   Real Database Engine: Privileges, Role Ownership & Trigger Invariants');
  console.log('========================================================================\n');

  const db = new PGlite();

  // ── GROUP 1: Role Setup, Object Ownership & Table Creation ──
  console.log('── GROUP 1: Object Ownership & Privilege Boundary Verification ──');

  await db.exec(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'ddl_admin') THEN
        CREATE ROLE ddl_admin NOLOGIN;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_runtime') THEN
        CREATE ROLE app_runtime NOLOGIN;
      END IF;
    END $$;

    -- Create table as ddl_admin
    CREATE TABLE IF NOT EXISTS public.financial_ledger (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      account_id VARCHAR(64) NOT NULL,
      entry_type VARCHAR(16) NOT NULL CHECK (entry_type IN ('DEBIT', 'CREDIT')),
      amount NUMERIC(18, 4) NOT NULL CHECK (amount > 0),
      balance_after NUMERIC(18, 4) NOT NULL,
      sha256_digest CHAR(64) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    ALTER TABLE public.financial_ledger OWNER TO ddl_admin;
  `);

  // Verify Table Owner is ddl_admin, NOT app_runtime
  const ownerResult = await db.query<{ tableowner: string }>(`
    SELECT tableowner FROM pg_tables WHERE schemaname = 'public' AND tablename = 'financial_ledger';
  `);
  assert(ownerResult.rows.length === 1, 'Table public.financial_ledger exists in catalog');
  assert(ownerResult.rows[0].tableowner === 'ddl_admin', 'Table owner is ddl_admin (PostgreSQL privilege boundary enforced)');
  assert(ownerResult.rows[0].tableowner !== 'app_runtime', 'Table owner is NOT the application runtime role');

  // ── GROUP 2: SQL Privilege Grants & Denials (GRANT / REVOKE) ──
  console.log('\n── GROUP 2: SQL Privilege Enforcement (Application Runtime Role) ──');

  await db.exec(`
    -- Grant explicit minimal privileges to app_runtime: SELECT, INSERT only
    REVOKE ALL ON public.financial_ledger FROM app_runtime;
    GRANT SELECT, INSERT ON public.financial_ledger TO app_runtime;
  `);

  // Switch session to app_runtime
  await db.exec(`SET ROLE app_runtime;`);

  // Check 1: app_runtime INSERT succeeds
  let insertSucceeded = false;
  try {
    await db.query(`
      INSERT INTO public.financial_ledger (account_id, entry_type, amount, balance_after, sha256_digest)
      VALUES ('ACC-001', 'CREDIT', 1000.0000, 1000.0000, 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
    `);
    insertSucceeded = true;
  } catch (err: any) {
    console.error('Insert error:', err);
  }
  assert(insertSucceeded, 'application role: INSERT succeeds');

  // Check 2: app_runtime SELECT succeeds
  const selectResult = await db.query(`SELECT COUNT(*) AS c FROM public.financial_ledger;`);
  assert(parseInt((selectResult.rows[0] as any).c, 10) === 1, 'application role: SELECT succeeds');

  // Check 3: app_runtime UPDATE is rejected by PostgreSQL privilege subsystem
  let updateRejectedByPrivilege = false;
  let updateErrorMessage = '';
  try {
    await db.query(`UPDATE public.financial_ledger SET amount = 2000.0000 WHERE account_id = 'ACC-001';`);
  } catch (err: any) {
    updateRejectedByPrivilege = true;
    updateErrorMessage = err.message;
  }
  assert(updateRejectedByPrivilege, 'application role: UPDATE fails (denied by PostgreSQL privilege engine)');
  assert(
    updateErrorMessage.toLowerCase().includes('permission denied') || updateErrorMessage.toLowerCase().includes('denied'),
    'PostgreSQL engine returned permission denied for UPDATE'
  );

  // Check 4: app_runtime DELETE is rejected by PostgreSQL privilege subsystem
  let deleteRejectedByPrivilege = false;
  let deleteErrorMessage = '';
  try {
    await db.query(`DELETE FROM public.financial_ledger WHERE account_id = 'ACC-001';`);
  } catch (err: any) {
    deleteRejectedByPrivilege = true;
    deleteErrorMessage = err.message;
  }
  assert(deleteRejectedByPrivilege, 'application role: DELETE fails (denied by PostgreSQL privilege engine)');
  assert(
    deleteErrorMessage.toLowerCase().includes('permission denied') || deleteErrorMessage.toLowerCase().includes('denied'),
    'PostgreSQL engine returned permission denied for DELETE'
  );

  // Check 5: app_runtime cannot re-grant privileges to itself (cannot bypass privilege boundary)
  let grantRejected = false;
  try {
    await db.query(`GRANT UPDATE ON public.financial_ledger TO app_runtime;`);
  } catch (err: any) {
    grantRejected = true;
  }
  assert(grantRejected, 'application role cannot re-grant privileges (non-owner cannot alter table ACL)');

  // ── GROUP 3: Database-Level Trigger Guard (Defense-in-Depth) ──
  console.log('\n── GROUP 3: Live PostgreSQL Trigger Guard (Immutability Defense-in-Depth) ──');

  await db.exec(`
    RESET ROLE; -- Back to superuser/admin to attach trigger

    CREATE OR REPLACE FUNCTION public.prevent_ledger_mutation()
    RETURNS TRIGGER AS $$
    BEGIN
      RAISE EXCEPTION 'CANNOT_MUTATE_APPEND_ONLY_LEDGER: UPDATE and DELETE operations are strictly forbidden on financial_ledger'
        USING ERRCODE = 'restrict_violation';
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER trg_guard_ledger_immutability
    BEFORE UPDATE OR DELETE ON public.financial_ledger
    FOR EACH ROW
    EXECUTE FUNCTION public.prevent_ledger_mutation();

    -- Even if ddl_admin or a privileged role attempts an UPDATE, the trigger blocks it
    GRANT UPDATE, DELETE ON public.financial_ledger TO ddl_admin;
  `);

  // Attempt update as ddl_admin (has SQL privilege, but trigger must reject)
  let triggerBlockedUpdate = false;
  let triggerErrorMessage = '';
  try {
    await db.query(`UPDATE public.financial_ledger SET amount = 9999.0000;`);
  } catch (err: any) {
    triggerBlockedUpdate = true;
    triggerErrorMessage = err.message;
  }
  assert(triggerBlockedUpdate, 'Live PostgreSQL trigger: UPDATE blocked by engine trigger guard');
  assert(
    triggerErrorMessage.includes('CANNOT_MUTATE_APPEND_ONLY_LEDGER'),
    'Trigger raised expected immutable ledger exception'
  );

  let triggerBlockedDelete = false;
  try {
    await db.query(`DELETE FROM public.financial_ledger;`);
  } catch (err: any) {
    triggerBlockedDelete = true;
  }
  assert(triggerBlockedDelete, 'Live PostgreSQL trigger: DELETE blocked by engine trigger guard');

  // ── GROUP 4: Foreign-Key RESTRICT vs NO ACTION Deferred Mechanics ──
  console.log('\n── GROUP 4: Foreign Key RESTRICT vs NO ACTION Live Engine Semantics ──');

  await db.exec(`
    CREATE TABLE public.parent_restrict (
      id INT PRIMARY KEY
    );
    CREATE TABLE public.child_restrict (
      id INT PRIMARY KEY,
      parent_id INT REFERENCES public.parent_restrict(id) ON DELETE RESTRICT
    );

    CREATE TABLE public.parent_deferrable (
      id INT PRIMARY KEY
    );
    CREATE TABLE public.child_deferrable (
      id INT PRIMARY KEY,
      parent_id INT REFERENCES public.parent_deferrable(id) ON DELETE NO ACTION DEFERRABLE INITIALLY DEFERRED
    );

    INSERT INTO public.parent_restrict VALUES (1);
    INSERT INTO public.child_restrict VALUES (10, 1);

    INSERT INTO public.parent_deferrable VALUES (1);
    INSERT INTO public.child_deferrable VALUES (20, 1);
  `);

  // RESTRICT: Immediate check cannot be deferred
  let restrictFailedImmediately = false;
  try {
    await db.query(`DELETE FROM public.parent_restrict WHERE id = 1;`);
  } catch (err: any) {
    restrictFailedImmediately = true;
  }
  assert(restrictFailedImmediately, 'PostgreSQL RESTRICT: Fails immediately when deleting referenced row');

  // NO ACTION DEFERRABLE: Permits temporary deletion within transaction, checks at COMMIT
  let deferredPermittedWithinTx = false;
  let deferredFailedAtCommit = false;
  try {
    await db.exec(`BEGIN;`);
    // In deferred mode, deletion of parent is allowed temporarily within the transaction
    await db.exec(`DELETE FROM public.parent_deferrable WHERE id = 1;`);
    deferredPermittedWithinTx = true;

    // But at COMMIT time, constraint check executes and triggers failure
    try {
      await db.exec(`COMMIT;`);
    } catch (commitErr) {
      deferredFailedAtCommit = true;
      await db.exec(`ROLLBACK;`);
    }
  } catch (e) {
    await db.exec(`ROLLBACK;`);
  }

  assert(deferredPermittedWithinTx, 'PostgreSQL NO ACTION (DEFERRABLE): Permits referenced row delete inside transaction');
  assert(deferredFailedAtCommit, 'PostgreSQL NO ACTION (DEFERRABLE): Rejects deletion at transaction COMMIT time');

  // ── GROUP 5: Summary ──
  console.log('\n========================================================================');
  console.log(`🏁 LIVE POSTGRESQL ENFORCEMENT SUITE: ${testsPassed} Passed, ${testsFailed} Failed`);
  console.log('========================================================================\n');

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runPostgresEnforcementSuite().catch((err) => {
  console.error('[FATAL ERROR IN POSTGRES ENFORCEMENT SUITE]', err);
  process.exit(1);
});
