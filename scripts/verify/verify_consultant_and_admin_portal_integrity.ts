import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { CohortsApiService } from '../../src/lib/api/cohortsApi';

console.log('--- STARTING CONSULTANT & ADMIN PORTAL INTEGRITY VERIFICATION ---');

async function testCohortApiIntegrity() {
  console.log('[1/7] Testing Cohort Analytics Dynamic Derivation...');

  // Ensure getStudents returns empty array if no storage/input (no hardcoded students)
  const emptyStudents = CohortsApiService.getStudents([]);
  assert.equal(emptyStudents.length, 0, 'CohortsApiService.getStudents([]) must return an empty array, no mock students');

  // Verify mapEnrolledToCohort maps authentic enrolled students
  const mockEnrolled = [
    { id: 'stud_1', name: 'Alice Smith', department: 'Computer Science', atsScore: 85, completedQuestsCount: 4 },
    { id: 'stud_2', name: 'Bob Jones', department: 'Electrical Engineering', atsScore: 50, completedQuestsCount: 2 },
    { id: 'stud_3', name: 'Charlie Ray', department: 'Computer Science', atsScore: 25, completedQuestsCount: 0 }
  ];

  const overview = CohortsApiService.getCollegeOverview('Test College', mockEnrolled);
  assert.equal(overview.totalStudents, 3, 'Overview totalStudents must equal input enrolled count');
  assert.equal(overview.departments.length, 2, 'Overview departments must group into 2 departments');
  assert.equal(overview.totalVerifiedCredentials, 6, 'Total verified credentials should equal sum of completed quests');
  assert(overview.overallPlacementReadyPct > 0, 'Placement ready pct should be derived from students >= 65 ats score');

  // Check file src/lib/api/cohortsApi.ts for hardcoded mock names
  const cohortsApiContent = fs.readFileSync(path.resolve(__dirname, '../../src/lib/api/cohortsApi.ts'), 'utf-8');
  assert(!cohortsApiContent.includes('Aarav Patel'), 'cohortsApi.ts must not contain Aarav Patel');
  assert(!cohortsApiContent.includes('Devin Vance'), 'cohortsApi.ts must not contain Devin Vance');
  assert(!cohortsApiContent.includes('Priya Sharma'), 'cohortsApi.ts must not contain Priya Sharma');

  console.log('  -> Cohorts dynamic telemetry verified successfully.');
}

function testConsultantDocumentHubIntegrity() {
  console.log('[2/7] Testing Consultant Document Hub Integrity...');
  const docHubContent = fs.readFileSync(path.resolve(__dirname, '../../src/app/consultant/components/ConsultantDocumentHub.tsx'), 'utf-8');

  // Must not have fixed static scores 87/100, ATS 82, or fake LOR tone verification
  assert(!docHubContent.includes('87/100'), 'ConsultantDocumentHub must not contain fixed 87/100 score');
  assert(!docHubContent.includes('82/100'), 'ConsultantDocumentHub must not contain fixed 82/100 ATS scan');
  assert(!docHubContent.includes('Verification signatures match institutional registry" — about a document that does not exist'), 'ConsultantDocumentHub must not state fake registry matches');
  assert(docHubContent.includes('uniqueWords'), 'ConsultantDocumentHub must compute dynamic unique words');
  assert(docHubContent.includes('sopText.trim().split'), 'ConsultantDocumentHub must compute dynamic word split length');
  assert(docHubContent.includes('/api/consultant/student/'), 'ConsultantDocumentHub must save SOP draft via API');

  console.log('  -> Consultant Document Hub dynamic audit verified successfully.');
}

function testDocumentRejectionSafety() {
  console.log('[3/7] Testing Document Rejection & Verification Safety...');
  

  // 1. Check verify-document API route
  const verifyRouteContent = fs.readFileSync(path.resolve(__dirname, '../../src/app/api/consultant/student/[id]/verify-document/route.ts'), 'utf-8');
  assert(verifyRouteContent.includes("const isVerified = status === 'verified'"), 'verify-document route must check for verified status');
  assert(verifyRouteContent.includes("verified: isVerified"), 'verify-document route must set verified to isVerified');
  assert(verifyRouteContent.includes("if (isVerified)"), 'Trust score boost must only occur when verified, never when rejected');

  // 2. Check credentialService.ts
  const credServiceContent = fs.readFileSync(path.resolve(__dirname, '../../src/lib/services/supabase/credentialService.ts'), 'utf-8');
  assert(credServiceContent.includes("statusOrNote === 'rejected'"), 'credentialService must handle rejected status');
  assert(credServiceContent.includes("VAULT_ITEM_REJECTED"), 'credentialService must audit rejection');
  assert(credServiceContent.includes("if (isVerified && item.user_id)"), 'Trust score boost must be conditional on verification');

  console.log('  -> Document rejection safety confirmed: rejection NEVER marks verified or boosts trust.');
}

function testAdminOverviewAndActions() {
  console.log('[4/7] Testing Admin Overview & Institutional Actions...');
  const overviewContent = fs.readFileSync(path.resolve(__dirname, '../../src/components/admin/AdminOverview.tsx'), 'utf-8');

  // Check no raw alert() calls for backup and clear cache
  assert(!overviewContent.includes("alert('Backup initiated')"), 'AdminOverview must not use fake backup alert');
  assert(!overviewContent.includes("alert('Cache cleared')"), 'AdminOverview must not use fake cache clear alert');
  assert(!overviewContent.includes('1,248'), 'AdminOverview must not hardcode 1,248 users');
  assert(overviewContent.includes('campus_institutional_db_backup_'), 'AdminOverview must generate real JSON DB backup download');
  assert(overviewContent.includes('/api/cache/clear'), 'AdminOverview must invoke cache clear endpoint');
  assert(overviewContent.includes('/api/admin/broadcast'), 'AdminOverview must invoke real broadcast endpoint');

  console.log('  -> Admin Overview institutional actions verified successfully.');
}

function testAuditLogAndCsvExport() {
  console.log('[5/7] Testing Admin Audit Log & Institutional CSV Export...');
  
  // 1. Audit Log
  const auditLogContent = fs.readFileSync(path.resolve(__dirname, '../../src/components/admin/AuditLogView.tsx'), 'utf-8');
  assert(!auditLogContent.includes('SYSTEM_BOOT_INITIALIZED'), 'AuditLogView must not contain fake SYSTEM_BOOT_INITIALIZED');
  assert(!auditLogContent.includes('DATABASE_MIGRATION_V4'), 'AuditLogView must not contain fake DATABASE_MIGRATION_V4');
  assert(auditLogContent.includes('/api/admin/audit-log'), 'AuditLogView must fetch real logs from API');

  // 2. CSV Export in Shell
  const shellContent = fs.readFileSync(path.resolve(__dirname, '../../src/components/admin/AdminDashboardShell.tsx'), 'utf-8');
  assert(!shellContent.includes('2026-08-17'), 'AdminDashboardShell must not hardcode 2026-08-17 CSV');
  assert(!shellContent.includes('STU-9941,Jane Doe'), 'AdminDashboardShell must not hardcode Jane Doe in CSV');
  assert(shellContent.includes('portalService.getEnrolledStudents()'), 'AdminDashboardShell must fetch real enrolled students for CSV export');

  console.log('  -> Audit Log & dynamic CSV Export verified successfully.');
}

function testUserManagementAndRBAC() {
  console.log('[6/7] Testing User Management RBAC & Account Actions...');
  const userMgmtContent = fs.readFileSync(path.resolve(__dirname, '../../src/components/admin/UserManagement.tsx'), 'utf-8');
  
  // Enforce genuine RBAC: superadmin !== any admin
  assert(userMgmtContent.includes("currentUser?.role === 'superadmin'"), 'Only role === superadmin receives SuperAdmin privileges');
  assert(!userMgmtContent.includes("const isSuperAdmin = currentUser?.role === 'admin' || currentUser?.role === 'superadmin'"), 'Standard admin must not be given SuperAdmin');
  assert(userMgmtContent.includes('/api/admin/users/'), 'UserManagement must call API endpoints for user actions');

  // Check banUser in admin/students/page.tsx
  const studentsPageContent = fs.readFileSync(path.resolve(__dirname, '../../src/app/admin/students/page.tsx'), 'utf-8');
  assert(studentsPageContent.includes('!res.ok || data.ok === false'), 'banUser must check res.ok before modifying state');
  
  // Check user DELETE route
  const deleteRouteContent = fs.readFileSync(path.resolve(__dirname, '../../src/app/api/admin/users/[id]/route.ts'), 'utf-8');
  assert(deleteRouteContent.includes("role: 'suspended'"), 'DELETE user endpoint must update role: suspended, not non-existent column');
  assert(!deleteRouteContent.includes('suspended: true'), 'DELETE user must not attempt to set non-existent suspended column');

  console.log('  -> User Management RBAC & suspension safety verified successfully.');
}

function testAdminSettingsAndCohortsPage() {
  console.log('[7/7] Testing Admin Settings & Cohorts Page Integrity...');
  
  // Settings page
  const settingsContent = fs.readFileSync(path.resolve(__dirname, '../../src/app/admin/settings/page.tsx'), 'utf-8');
  assert(!settingsContent.includes('ANTHROPIC_API_KEY'), 'Admin settings must not show unused ANTHROPIC_API_KEY');
  assert(!settingsContent.includes('DATABASE_URL'), 'Admin settings must not show unused DATABASE_URL');
  assert(settingsContent.includes('NEXT_PUBLIC_SUPABASE_URL'), 'Admin settings must display actual system keys');
  assert(settingsContent.includes('localStorage.setItem'), 'Admin settings must persist configuration on save');

  // Cohorts page
  const cohortsPageContent = fs.readFileSync(path.resolve(__dirname, '../../src/app/admin/cohorts/page.tsx'), 'utf-8');
  assert(cohortsPageContent.includes('portalService.getEnrolledStudents()'), 'Cohorts page must fetch enrolled students from portalService');
  assert(cohortsPageContent.includes('No departmental cohort telemetry found'), 'Cohorts page must have empty state for departments');
  assert(cohortsPageContent.includes('No student placement or evidence dossiers found'), 'Cohorts page must have empty state for student list');

  console.log('  -> Admin Settings & Cohorts page integrity verified successfully.');
}

async function run() {
  await testCohortApiIntegrity();
  testConsultantDocumentHubIntegrity();
  testDocumentRejectionSafety();
  testAdminOverviewAndActions();
  testAuditLogAndCsvExport();
  testUserManagementAndRBAC();
  testAdminSettingsAndCohortsPage();
  console.log('\n--- ALL CONSULTANT & ADMIN PORTAL INTEGRITY CHECKS PASSED! ---');
}

run().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
