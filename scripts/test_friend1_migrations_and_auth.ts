import assert from 'assert';
import fs from 'fs';
import path from 'path';

async function run() {
  console.log('========================================================================');
  console.log('🛡️ TESTING FRIEND 1 (AUTH & MIGRATIONS)');
  console.log('========================================================================\n');

  // Test 1: Consolidated Migration Syntax
  console.log('── TEST 1: Consolidated Migration PL/pgSQL Termination ──');
  const migrationSql = fs.readFileSync(path.resolve('supabase/migrations/PRODUCTION_CONSOLIDATED_MIGRATIONS.sql'), 'utf-8').replace(/\r\n/g, '\n');
  assert.ok(
    migrationSql.includes("ON CONFLICT (id) DO NOTHING;\n    END IF;\nEND $$;\n\n-- ── 10. User profile array columns"),
    'PRODUCTION_CONSOLIDATED_MIGRATIONS.sql must terminate the DO $$ block with END $$; before ALTER TABLE'
  );
  console.log('  ✅ [PASS] DO $$ block properly terminated with END $$; before ALTER TABLE\n');

  // Test 2: AuthContext Login & Logout Audit Routes
  console.log('── TEST 2: AuthContext Audit Log Isolation ──');
  const authContextCode = fs.readFileSync(path.resolve('src/lib/context/AuthContext.tsx'), 'utf-8').replace(/\r\n/g, '\n');
  assert.ok(
    !authContextCode.includes('/api/admin/audit-log'),
    'AuthContext must NOT contain references to /api/admin/audit-log'
  );
  assert.ok(
    authContextCode.includes("api.post('/api/student/activity', {\n        action: 'login',"),
    'AuthContext must dispatch login audit to /api/student/activity'
  );
  assert.ok(
    authContextCode.includes("api.post('/api/student/activity', {\n          action: 'logout',"),
    'AuthContext must dispatch logout audit to /api/student/activity'
  );
  console.log('  ✅ [PASS] AuthContext dispatches login & logout audits to /api/student/activity\n');

  console.log('========================================================================');
  console.log('🏁 FRIEND 1 AUDIT & MIGRATION VERIFICATION: ALL PASSED');
  console.log('========================================================================');
}

run().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
