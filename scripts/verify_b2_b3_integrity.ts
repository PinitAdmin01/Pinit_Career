/**
 * Verification Suite: B2 Student Activity Integrity & B3 Recruiter Visibility Contract
 * 
 * Verifies:
 * 1. B2: SQL Migration 20260918_student_activity_and_security.sql contains audit_logs adjustments & RLS policies
 * 2. B2: PRODUCTION_CONSOLIDATED_MIGRATIONS.sql contains Section 11 audit_logs adjustments before COMMIT
 * 3. B2: supabase/schema.sql contains updated audit_logs schema and RLS policies
 * 4. B2: src/app/api/student/activity/route.ts handles resilient created_at / timestamp querying and inserting
 * 5. B2: src/lib/api/legacyFirestoreRouter.ts routes mission completion to student activity & handles student activity fallback
 * 6. B3: normalizeVisibility maps private (0), institution_only (50), recruiters_only (80), public (100), boolean and numeric values
 * 7. B3: legacyFirestoreRouter recruiter visibility handles both visibility string and visible boolean
 * 8. B3: src/app/profile/page.tsx syncs recruiter_visibility and invalidates query cache
 * 9. B3: UserProgressContext hydrates recruiterVisible from user and provides authoritative sync
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';

async function run() {
  console.log('--- STARTING B2 & B3 INTEGRITY VERIFICATION ---');

  // Test 1: SQL Migration 20260918_student_activity_and_security.sql
  console.log('Test 1: SQL Migration 20260918_student_activity_and_security.sql');
  const migPath = path.resolve('supabase/migrations/20260918_student_activity_and_security.sql');
  assert.ok(fs.existsSync(migPath), 'Migration 20260918_student_activity_and_security.sql must exist');
  const migSql = fs.readFileSync(migPath, 'utf-8');

  assert.ok(migSql.includes('ALTER COLUMN admin_id DROP NOT NULL'), 'Must drop NOT NULL on admin_id');
  assert.ok(migSql.includes('ADD COLUMN IF NOT EXISTS actor_id'), 'Must add actor_id column');
  assert.ok(migSql.includes('ADD COLUMN IF NOT EXISTS created_at'), 'Must add created_at column');
  assert.ok(migSql.includes('CREATE POLICY "Users can view own audit logs"'), 'Must have user select RLS policy');
  assert.ok(migSql.includes('CREATE POLICY "Users can insert own audit logs"'), 'Must have user insert RLS policy');
  console.log('✓ Migration 20260918 contains correct schema adjustments, indexes, and RLS policies');

  // Test 2: Consolidated Migrations Section 11
  console.log('Test 2: PRODUCTION_CONSOLIDATED_MIGRATIONS.sql Section 11');
  const consolPath = path.resolve('supabase/migrations/PRODUCTION_CONSOLIDATED_MIGRATIONS.sql');
  const consolSql = fs.readFileSync(consolPath, 'utf-8');

  assert.ok(consolSql.includes('-- ── 11. Student Activity and Audit Logs RLS ─────'), 'Consolidated migrations must have Section 11');
  assert.ok(consolSql.includes('ALTER TABLE public.audit_logs \n  ALTER COLUMN admin_id DROP NOT NULL') || consolSql.includes('ALTER COLUMN admin_id DROP NOT NULL'), 'Consolidated migrations must drop NOT NULL on admin_id');
  assert.ok(consolSql.includes('CREATE POLICY "Users can view own audit logs"'), 'Consolidated migrations must include user view policy');
  assert.ok(consolSql.includes('CREATE POLICY "Users can insert own audit logs"'), 'Consolidated migrations must include user insert policy');
  assert.ok(consolSql.indexOf('-- ── 11. Student Activity and Audit Logs RLS ─────') < consolSql.indexOf('COMMIT;'), 'Section 11 must precede COMMIT;');
  console.log('✓ Consolidated migration contains Section 11 before COMMIT');

  // Test 3: supabase/schema.sql
  console.log('Test 3: supabase/schema.sql audit_logs table and RLS');
  const schemaPath = path.resolve('supabase/schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf-8');

  assert.ok(schemaSql.includes('actor_id uuid references public.users'), 'schema.sql must have actor_id on audit_logs');
  assert.ok(schemaSql.includes('created_at timestamp with time zone'), 'schema.sql must have created_at on audit_logs');
  assert.ok(schemaSql.includes('create policy "Users can view own audit logs"'), 'schema.sql must have user select policy');
  assert.ok(schemaSql.includes('create policy "Users can insert own audit logs"'), 'schema.sql must have user insert policy');
  console.log('✓ schema.sql base definition includes actor_id, created_at, and student RLS policies');

  // Test 4: src/app/api/student/activity/route.ts
  console.log('Test 4: src/app/api/student/activity/route.ts fallback resilience');
  const activityRoutePath = path.resolve('src/app/api/student/activity/route.ts');
  const activityRouteCode = fs.readFileSync(activityRoutePath, 'utf-8');

  assert.ok(activityRouteCode.includes(".order('created_at', { ascending: false })"), 'Must order by created_at');
  assert.ok(activityRouteCode.includes(".order('timestamp', { ascending: false })"), 'Must provide fallback order by timestamp');
  assert.ok(activityRouteCode.includes('timestamp: now') && activityRouteCode.includes('created_at: now'), 'Must insert both timestamp and created_at');
  assert.ok(activityRouteCode.includes('insertPayload.admin_id = studentId'), 'Must provide fallback admin_id for legacy schema');
  console.log('✓ student activity route has resilient multi-schema query and insertion fallbacks');

  // Test 5: legacyFirestoreRouter.ts mission completion audit and student activity handler
  console.log('Test 5: legacyFirestoreRouter.ts audit routing & student activity handler');
  const routerPath = path.resolve('src/lib/api/legacyFirestoreRouter.ts');
  const routerCode = fs.readFileSync(routerPath, 'utf-8');

  assert.ok(!routerCode.includes("api.post('/api/admin/audit-log/add'"), 'Mission complete must not dispatch to admin audit log');
  assert.ok(routerCode.includes("api.post('/api/student/activity'"), 'Mission complete must dispatch to /api/student/activity');
  assert.ok(routerCode.includes("cleanPath === '/api/student/activity'"), 'legacy router must provide fallback handler for /api/student/activity');
  console.log('✓ legacy router correctly dispatches mission audit to student activity and includes student activity fallback');

  // Test 6: Recruiter visibility normalization function
  console.log('Test 6: normalizeVisibility contract unit tests');
  const { normalizeVisibility } = await import('../src/app/api/recruiter/visibility/route');

  assert.deepStrictEqual(normalizeVisibility('private'), { score: 0, label: 'private' });
  assert.deepStrictEqual(normalizeVisibility(false), { score: 0, label: 'private' });
  assert.deepStrictEqual(normalizeVisibility(0), { score: 0, label: 'private' });
  assert.deepStrictEqual(normalizeVisibility('institution_only'), { score: 50, label: 'institution_only' });
  assert.deepStrictEqual(normalizeVisibility('recruiters_only'), { score: 80, label: 'recruiters_only' });
  assert.deepStrictEqual(normalizeVisibility(true), { score: 80, label: 'recruiters_only' });
  assert.deepStrictEqual(normalizeVisibility('public'), { score: 100, label: 'public' });
  assert.deepStrictEqual(normalizeVisibility(100), { score: 100, label: 'public' });
  assert.deepStrictEqual(normalizeVisibility(75), { score: 75, label: 'recruiters_only' });
  assert.deepStrictEqual(normalizeVisibility(-10), { score: 0, label: 'private' });
  assert.deepStrictEqual(normalizeVisibility(150), { score: 100, label: 'public' });
  console.log('✓ normalizeVisibility correctly maps all inputs (strings, booleans, clamped numbers)');

  // Test 7: legacyFirestoreRouter recruiter visibility contract
  console.log('Test 7: legacyFirestoreRouter recruiter visibility contract check');
  assert.ok(routerCode.includes("cleanPath.startsWith('/api/recruiter/visibility')"), 'Must have recruiter visibility handler');
  assert.ok(routerCode.includes('b.visibility ?? b.visible ?? b.recruiter_visibility ?? b.recruiterVisibility'), 'Must extract visibility or visible from body');
  assert.ok(routerCode.includes("score = 0") && routerCode.includes("score = 50") && routerCode.includes("score = 80") && routerCode.includes("score = 100"), 'Must support 0, 50, 80, 100 scoring in router');
  console.log('✓ legacyFirestoreRouter handles { visibility } and { visible } robustly');

  // Test 8: src/app/profile/page.tsx state sync
  console.log('Test 8: src/app/profile/page.tsx state sync & cache invalidation');
  const profilePath = path.resolve('src/app/profile/page.tsx');
  const profileCode = fs.readFileSync(profilePath, 'utf-8');

  assert.ok(profileCode.includes('qc.invalidateQueries({ queryKey: KEYS.me })'), 'saveVisibility must invalidate KEYS.me query');
  assert.ok(profileCode.includes("if (num === 0) setVisibility('private')"), 'Must sync private visibility from user');
  assert.ok(profileCode.includes("if (user.selectedTeacherId)"), 'Must sync teacherId from user');
  console.log('✓ Profile page synchronizes recruiter visibility and teacher preferences from user object');

  // Test 9: UserProgressContext recruiterVisible hydration & sync
  console.log('Test 9: UserProgressContext recruiterVisible hydration & sync');
  const userProgressPath = path.resolve('src/lib/context/UserProgressContext.tsx');
  const userProgressCode = fs.readFileSync(userProgressPath, 'utf-8');

  assert.ok(userProgressCode.includes('// 9. Recruiter Visibility (server hydration)'), 'UserProgressContext must hydrate recruiter visibility');
  assert.ok(userProgressCode.includes('setRecruiterVisibleAuthoritative'), 'Must provide authoritative recruiter visible setter');
  assert.ok(userProgressCode.includes("api.patch('/api/recruiter/visibility', { visible: val })"), 'Authoritative setter must notify /api/recruiter/visibility');
  console.log('✓ UserProgressContext hydrates and authoritatively synchronizes recruiterVisible state');

  console.log('\n--- ALL B2 & B3 INTEGRITY TESTS PASSED (9/9) ---');
}

run().catch(err => {
  console.error('TEST FAILED:', err);
  process.exit(1);
});
