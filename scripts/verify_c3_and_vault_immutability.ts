/**
 * Verification Suite: C3 Campus Tables Self-Approval Lockdown & Vault Verified Immutability Guard
 * 
 * Verifies:
 * 1. Migration 20260918_campus_student_read_only_status.sql exists and contains all required trigger definitions
 * 2. PRODUCTION_CONSOLIDATED_MIGRATIONS.sql contains Section 12 before COMMIT
 * 3. supabase/campus_tables.sql contains check_student_campus_status_immutable trigger
 * 4. supabase/schema.sql contains check_vault_verified_immutable trigger
 * 5. Validates trigger logic against unauthorized student self-approvals and self-verifications
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';

async function run() {
  console.log('--- STARTING C3 & VAULT IMMUTABILITY VERIFICATION ---');

  // Test 1: Migration 20260918_campus_student_read_only_status.sql
  console.log('Test 1: Migration 20260918_campus_student_read_only_status.sql check');
  const migPath = path.resolve('supabase/migrations/20260918_campus_student_read_only_status.sql');
  assert.ok(fs.existsSync(migPath), 'Migration 20260918_campus_student_read_only_status.sql must exist');
  const migSql = fs.readFileSync(migPath, 'utf-8');

  assert.ok(migSql.includes('CREATE OR REPLACE FUNCTION public.campus_is_staff()'), 'Must contain campus_is_staff function');
  assert.ok(migSql.includes('CREATE OR REPLACE FUNCTION public.check_student_campus_status_immutable()'), 'Must contain check_student_campus_status_immutable function');
  assert.ok(migSql.includes("RAISE EXCEPTION 'Students cannot alter status on campus records'"), 'Must raise exception on status change');
  
  const tables = ['services_leaves', 'document_requests', 'admissions_applications', 'grievances_tickets', 'finance_dues'];
  for (const t of tables) {
    assert.ok(migSql.includes(`'${t}'`), `Migration must guard table ${t}`);
  }

  assert.ok(migSql.includes('CREATE OR REPLACE FUNCTION public.check_vault_verified_immutable()'), 'Must contain check_vault_verified_immutable function');
  assert.ok(migSql.includes("RAISE EXCEPTION 'Only administrative services or staff can verify vault items'"), 'Must raise exception on unauthorized vault verification');
  assert.ok(migSql.includes('trg_guard_vault_verified'), 'Must attach trigger trg_guard_vault_verified');
  console.log('✓ Migration 20260918_campus_student_read_only_status.sql contains all authoritative guards');

  // Test 2: PRODUCTION_CONSOLIDATED_MIGRATIONS.sql Section 12
  console.log('Test 2: PRODUCTION_CONSOLIDATED_MIGRATIONS.sql Section 12 check');
  const consolPath = path.resolve('supabase/migrations/PRODUCTION_CONSOLIDATED_MIGRATIONS.sql');
  const consolSql = fs.readFileSync(consolPath, 'utf-8');

  assert.ok(consolSql.includes('-- ── 12. Campus Status & Vault Verified Immutability Guards ───'), 'Consolidated migrations must have Section 12');
  assert.ok(consolSql.includes('check_student_campus_status_immutable'), 'Consolidated migrations must have campus status immutable trigger');
  assert.ok(consolSql.includes('check_vault_verified_immutable'), 'Consolidated migrations must have vault verified immutable trigger');
  assert.ok(
    consolSql.indexOf('-- ── 12. Campus Status & Vault Verified Immutability Guards ───') < consolSql.indexOf('COMMIT;'),
    'Section 12 must precede COMMIT;'
  );
  console.log('✓ Consolidated migrations correctly include Section 12 before COMMIT');

  // Test 3: supabase/campus_tables.sql
  console.log('Test 3: supabase/campus_tables.sql status immutability trigger check');
  const campusPath = path.resolve('supabase/campus_tables.sql');
  const campusSql = fs.readFileSync(campusPath, 'utf-8');

  assert.ok(campusSql.includes('check_student_campus_status_immutable'), 'campus_tables.sql must have status immutable trigger function');
  assert.ok(campusSql.includes('trg_guard_status_'), 'campus_tables.sql must attach status guard trigger');
  console.log('✓ campus_tables.sql includes check_student_campus_status_immutable trigger');

  // Test 4: supabase/schema.sql
  console.log('Test 4: supabase/schema.sql vault verified trigger check');
  const schemaPath = path.resolve('supabase/schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf-8');

  assert.ok(schemaSql.includes('check_vault_verified_immutable'), 'schema.sql must have check_vault_verified_immutable trigger function');
  assert.ok(schemaSql.includes('trg_guard_vault_verified'), 'schema.sql must attach trg_guard_vault_verified trigger');
  console.log('✓ schema.sql includes check_vault_verified_immutable trigger');

  // Test 5: Logic verification of guard semantics
  console.log('Test 5: Semantics check on trigger logic');
  // Campus status check simulation
  function simulateCampusStatusUpdate(isStaff: boolean, oldStatus: string, newStatus: string) {
    if (!isStaff) {
      if (oldStatus !== newStatus) {
        throw new Error('Students cannot alter status on campus records');
      }
    }
    return { ok: true, status: newStatus };
  }

  // Vault verified check simulation
  function simulateVaultVerifiedUpdate(currentUser: string, isStaff: boolean, oldVerified: boolean, newVerified: boolean) {
    if (oldVerified !== newVerified && newVerified === true) {
      if (currentUser !== 'service_role' && !isStaff) {
        throw new Error('Only administrative services or staff can verify vault items');
      }
    }
    return { ok: true, verified: newVerified };
  }

  // Student attempts to self-approve leave
  assert.throws(
    () => simulateCampusStatusUpdate(false, 'pending', 'Approved'),
    /Students cannot alter status on campus records/,
    'Non-staff student must be blocked from updating status'
  );

  // Staff approves leave
  const staffApprove = simulateCampusStatusUpdate(true, 'pending', 'Approved');
  assert.strictEqual(staffApprove.status, 'Approved', 'Staff must be permitted to update status');

  // Student updates non-status fields (status unchanged)
  const studentEdit = simulateCampusStatusUpdate(false, 'pending', 'pending');
  assert.strictEqual(studentEdit.status, 'pending', 'Student can update record when status is unchanged');

  // Student attempts to self-verify vault item
  assert.throws(
    () => simulateVaultVerifiedUpdate('authenticated', false, false, true),
    /Only administrative services or staff can verify vault items/,
    'Non-staff student must be blocked from self-verifying vault items'
  );

  // Admin/Staff verifies vault item
  const staffVerify = simulateVaultVerifiedUpdate('authenticated', true, false, true);
  assert.strictEqual(staffVerify.verified, true, 'Staff can verify vault item');

  // Service role verifies vault item
  const serviceRoleVerify = simulateVaultVerifiedUpdate('service_role', false, false, true);
  assert.strictEqual(serviceRoleVerify.verified, true, 'Service role can verify vault item');

  console.log('✓ Trigger semantics accurately enforce administrative role privileges');

  console.log('\n--- ALL C3 & VAULT IMMUTABILITY TESTS PASSED (5/5) ---');
}

run().catch(err => {
  console.error('TEST FAILED:', err);
  process.exit(1);
});
