import test from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';
import {
  INTERNSHIP_TIER_AVAILABLE,
  INTERNSHIP_AVAILABLE,
} from '../src/lib/data/crashPlansData';
import { enrollmentToClient } from '../src/lib/internships/toClient';
import { POST } from '../src/app/api/internship/start/route';
import { setSupabaseAdminForTests } from '../src/lib/server/supabaseAdmin';

test('F-12 (1): INTERNSHIP_TIER_AVAILABLE is keyed per track [track][tier] with all values false', () => {
  // Must have separate track keys
  const anySwitches = INTERNSHIP_TIER_AVAILABLE as any;
  assert.ok(anySwitches.python_ai, 'Must have python_ai track switch group');
  assert.ok(anySwitches.web_fullstack, 'Must have web_fullstack track switch group');

  assert.strictEqual(anySwitches.python_ai.t1_job_sim, false);
  assert.strictEqual(anySwitches.python_ai.t2_virtual_team, false);
  assert.strictEqual(anySwitches.python_ai.t3_project, false);
  assert.strictEqual(anySwitches.python_ai.t4_industry, false);
  assert.strictEqual(anySwitches.python_ai.t5_fellowship, false);

  assert.strictEqual(anySwitches.web_fullstack.t1_job_sim, false);
  assert.strictEqual(anySwitches.web_fullstack.t2_virtual_team, false);
  assert.strictEqual(anySwitches.web_fullstack.t3_project, false);
  assert.strictEqual(anySwitches.web_fullstack.t4_industry, false);
  assert.strictEqual(anySwitches.web_fullstack.t5_fellowship, false);

  assert.strictEqual(INTERNSHIP_AVAILABLE, false);
});

test('F-12 (2): start route handles active-internship query error', async () => {
  process.env.ALLOW_DEV_AUTH_BYPASS = 'true';
  process.env.NODE_ENV = 'test';

  const mockAdmin: any = {
    from(table: string) {
      if (table === 'internship_enrollments') {
        return {
          select() {
            return this;
          },
          eq() {
            return this;
          },
          in() {
            return this;
          },
          maybeSingle: async () => ({
            data: null,
            error: new Error('Database connection reset during active check'),
          }),
        };
      }
      if (table === 'users') {
        return {
          select() {
            return this;
          },
          eq() {
            return this;
          },
          maybeSingle: async () => ({
            data: { id: 'test_user_001', completed_quests: [], display_name: 'Student' },
            error: null,
          }),
        };
      }
      return {
        select() {
          return this;
        },
        eq() {
          return this;
        },
        order() {
          return this;
        },
        limit() {
          return this;
        },
        maybeSingle: async () => ({
          data: {
            enrollment_id: 'enr-crash-1',
            plan_id: 'plan-1m-sprint',
            tier: '1m',
            track: 'python_ai',
            status: 'active',
          },
          error: null,
        }),
        single: async () => ({
          data: {
            enrollment_id: 'enr-crash-1',
            plan_id: 'plan-1m-sprint',
            tier: '1m',
            track: 'python_ai',
            status: 'active',
          },
          error: null,
        }),
      };
    },
  };

  setSupabaseAdminForTests(mockAdmin);
  try {
    const req = new NextRequest('http://localhost:3000/api/internship/start', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer test-token-student-1',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ enrollmentId: 'enr-crash-1' }),
    });

    const res = await POST(req);
    const json = await res.json();
    assert.strictEqual(res.status, 500);
    assert.strictEqual(json.error, 'LOOKUP_FAILED');
  } finally {
    setSupabaseAdminForTests(null);
  }
});

test('F-12 (3): toClient.ts does not guess track from plan_id.includes("web")', () => {
  const row = {
    id: 'enr-101',
    student_id: 'student-101',
    crash_enrollment_id: 'crash-101',
    tier: 't1_job_sim',
    plan_id: 'plan-web-dev', // Contrived plan_id with "web", but track is missing
    status: 'active',
  };

  const client = enrollmentToClient(row as any);
  assert.strictEqual(
    client.track,
    'python_ai',
    'Must not guess web_fullstack from plan_id.includes("web")'
  );
});
