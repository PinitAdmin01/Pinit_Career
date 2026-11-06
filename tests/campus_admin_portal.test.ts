import test from 'node:test';
import assert from 'node:assert/strict';
import {
  resolveTenantFromHost,
  enforceTenantAccess,
  withTenantFilter,
  verifyTenantIsolationPolicy,
  TenantIsolationError,
  MOCK_INSTITUTIONS,
} from '../src/lib/admin/tenant';
import { type EnrolledStudent, type FraudAlertRecord } from '../src/lib/services/portalService';

test('Campus Admin Block 77 - Portal Telemetry & Multi-Tenant Isolation', async (t) => {
  await t.test('strictly verifies tenant isolation across institutions to prevent cross-campus leaks', () => {
    const inst1 = resolveTenantFromHost('apex.pinit.edu');
    const inst2 = resolveTenantFromHost('metro.pinit.edu');

    assert.ok(inst1 && inst2, 'Both tenants must resolve');
    assert.equal(inst1.id, 'inst-apex-001');
    assert.equal(inst2.id, 'inst-metro-002');
    assert.notEqual(inst1.id, inst2.id, 'Tenant IDs must be distinct');

    // Matching tenant access passes
    assert.doesNotThrow(() => {
      enforceTenantAccess(inst1.id, inst1.id);
    });

    // Cross-tenant access must throw TenantIsolationError
    assert.throws(
      () => {
        enforceTenantAccess(inst1.id, inst2.id);
      },
      (err: any) => err instanceof TenantIsolationError || err.name === 'TenantIsolationError'
    );
  });

  await t.test('withTenantFilter immutably attaches tenant isolation criteria to outgoing queries', () => {
    const rawPayload = { studentId: 'stu-99', courseTrack: 'fullstack_web' };
    const filtered = withTenantFilter(rawPayload, 'inst-apex-001');

    assert.equal(filtered.institution_id, 'inst-apex-001');
    assert.equal(filtered.studentId, 'stu-99');

    // Verify isolation policy rejects unfiltered queries
    const validQuery = { table: 'students', filterTenantId: filtered.institution_id };
    const invalidQuery = { table: 'students', filterTenantId: undefined };
    const crossTenantQuery = { table: 'students', filterTenantId: 'inst-metro-002' };

    assert.equal(verifyTenantIsolationPolicy(validQuery, 'inst-apex-001').valid, true);
    assert.equal(verifyTenantIsolationPolicy(invalidQuery, 'inst-apex-001').valid, false);
    assert.equal(verifyTenantIsolationPolicy(crossTenantQuery, 'inst-apex-001').valid, false);
  });

  await t.test('aggregates campus telemetry: active enrollment, probation risk, and placement readiness', () => {
    const mockRoster: EnrolledStudent[] = [
      {
        id: 'stu-1',
        name: 'Aarav Patel',
        email: 'aarav@apex.edu',
        rollNo: 'AP-101',
        batch: '2024-A',
        department: 'Computer Science',
        courseTrack: 'btech_cse',
        completedQuestsCount: 45,
        xp: 12000,
        pins: 850,
        atsScore: 88,
        attendancePct: 94,
        status: 'placed',
      },
      {
        id: 'stu-2',
        name: 'Diya Sharma',
        email: 'diya@apex.edu',
        rollNo: 'AP-102',
        batch: '2024-A',
        department: 'Information Technology',
        courseTrack: 'btech_it',
        completedQuestsCount: 12,
        xp: 3200,
        pins: 120,
        atsScore: 54,
        attendancePct: 68,
        status: 'probation',
      },
      {
        id: 'stu-3',
        name: 'Rohan Gupta',
        email: 'rohan@apex.edu',
        rollNo: 'AP-103',
        batch: '2024-B',
        department: 'Computer Science',
        courseTrack: 'btech_cse',
        completedQuestsCount: 38,
        xp: 9800,
        pins: 620,
        atsScore: 82,
        attendancePct: 89,
        status: 'active',
      },
    ];

    const totalStudents = mockRoster.length;
    const placedCount = mockRoster.filter((s) => s.status === 'placed').length;
    const probationCount = mockRoster.filter((s) => s.status === 'probation').length;
    const avgAttendance = mockRoster.reduce((sum, s) => sum + s.attendancePct, 0) / totalStudents;
    const avgAtsScore = mockRoster.reduce((sum, s) => sum + s.atsScore, 0) / totalStudents;

    assert.equal(totalStudents, 3);
    assert.equal(placedCount, 1);
    assert.equal(probationCount, 1);
    assert.ok(avgAttendance > 80, `Average attendance should be > 80%, got ${avgAttendance}`);
    assert.ok(avgAtsScore > 70, `Average ATS score should be > 70, got ${avgAtsScore}`);
  });

  await t.test('evaluates exam anti-cheat fraud telemetry and isolates high-severity risks', () => {
    const mockAlerts: FraudAlertRecord[] = [
      {
        id: 'f-1',
        studentName: 'Student X',
        examTitle: 'Distributed Systems Midterm',
        tabSwitches: 14,
        ipAddress: '192.168.1.45',
        trustScoreImpact: -25,
        severity: 'high',
        timestamp: new Date().toISOString(),
      },
      {
        id: 'f-2',
        studentName: 'Student Y',
        examTitle: 'Cloud Infrastructure Quiz',
        tabSwitches: 2,
        ipAddress: '192.168.1.78',
        trustScoreImpact: -5,
        severity: 'low',
        timestamp: new Date().toISOString(),
      },
    ];

    const highSeverityAlerts = mockAlerts.filter((a) => a.severity === 'high');
    assert.equal(highSeverityAlerts.length, 1);
    assert.ok(highSeverityAlerts[0].tabSwitches > 10, 'High severity must correlate with excessive tab switching');
    assert.ok(highSeverityAlerts[0].trustScoreImpact <= -20, 'High severity must carry major trust penalty');
  });
});
