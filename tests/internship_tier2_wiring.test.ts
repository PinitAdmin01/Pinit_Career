import test from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';
import { POST } from '../src/app/api/internship/team/route';
import { setSupabaseAdminForTests } from '../src/lib/server/supabaseAdmin';
import { setLlmJsonTransportForTests } from '../src/lib/server/llmJson';
import {
  getDeterministicProductBrief,
  getDeterministicTier2Tasks,
} from './fixtures/deterministicInternshipData';

interface MockDb {
  internship_enrollments: any[];
  internship_teams: any[];
  internship_team_members: any[];
  internship_sprints: any[];
  internship_tasks: any[];
}

function createMockSupabase(db: MockDb) {
  return {
    from(tableName: keyof MockDb) {
      const table = db[tableName] || [];
      return new QueryBuilder(table, db, tableName);
    },
  };
}

class QueryBuilder {
  private filters: Array<(row: any) => boolean> = [];
  private orderField?: string;
  private orderAscending = true;
  private limitCount?: number;

  constructor(
    private table: any[],
    private db: MockDb,
    private tableName: keyof MockDb
  ) {}

  select(_cols?: string) {
    return this;
  }

  eq(col: string, val: any) {
    this.filters.push((row) => row[col] === val);
    return this;
  }

  in(col: string, vals: any[]) {
    const set = new Set(vals);
    this.filters.push((row) => set.has(row[col]));
    return this;
  }

  order(col: string, opts?: { ascending?: boolean }) {
    this.orderField = col;
    this.orderAscending = opts?.ascending ?? true;
    return this;
  }

  limit(n: number) {
    this.limitCount = n;
    return this;
  }

  private getFiltered(): any[] {
    let res = this.table.filter((row) => this.filters.every((f) => f(row)));
    if (this.orderField) {
      const f = this.orderField;
      const asc = this.orderAscending;
      res = [...res].sort((a, b) => {
        if (a[f] < b[f]) return asc ? -1 : 1;
        if (a[f] > b[f]) return asc ? 1 : -1;
        return 0;
      });
    }
    if (typeof this.limitCount === 'number') {
      res = res.slice(0, this.limitCount);
    }
    return res;
  }

  async maybeSingle() {
    const rows = this.getFiltered();
    return { data: rows[0] || null, error: null };
  }

  async single() {
    const rows = this.getFiltered();
    return { data: rows[0] || null, error: rows[0] ? null : new Error('No rows') };
  }

  insert(rowOrRows: any | any[]) {
    const rows = Array.isArray(rowOrRows) ? rowOrRows : [rowOrRows];
    const inserted = rows.map((r) => ({
      id: r.id || `${this.tableName}-${Math.random().toString(36).slice(2, 9)}`,
      created_at: r.created_at || new Date().toISOString(),
      ...r,
    }));
    this.table.push(...inserted);
    return {
      data: Array.isArray(rowOrRows) ? inserted : inserted[0],
      error: null,
      select: (_cols?: string) => ({
        single: async () => ({ data: inserted[0], error: null }),
        maybeSingle: async () => ({ data: inserted[0], error: null }),
        then: (resolve: any, reject: any) =>
          Promise.resolve({ data: inserted, error: null }).then(resolve, reject),
      }),
      then: (resolve: any, reject: any) =>
        Promise.resolve({
          data: Array.isArray(rowOrRows) ? inserted : inserted[0],
          error: null,
        }).then(resolve, reject),
    };
  }

  private pendingUpdate?: any;

  update(fields: any) {
    this.pendingUpdate = fields;
    return this;
  }

  private applyUpdate() {
    if (this.pendingUpdate) {
      const rows = this.table.filter((row) => this.filters.every((f) => f(row)));
      for (const r of rows) {
        Object.assign(r, this.pendingUpdate);
      }
      return rows;
    }
    return null;
  }

  then(resolve: any, reject: any) {
    this.applyUpdate();
    const rows = this.getFiltered();
    return Promise.resolve({ data: rows, error: null }).then(resolve, reject);
  }
}

test.beforeEach(() => {
  process.env.ALLOW_DEV_AUTH_BYPASS = 'true';
  process.env.NODE_ENV = 'test';
});

test.afterEach(() => {
  setSupabaseAdminForTests(null);
  setLlmJsonTransportForTests(null);
});

test('F-11: POST /api/internship/team generates product brief, sprints, and tasks for matched team', async () => {
  const brief = getDeterministicProductBrief('seed-solo', true);
  const tasks = getDeterministicTier2Tasks(brief.stories);

  setLlmJsonTransportForTests(async (opts) => {
    if (opts.system.includes('product brief')) {
      return JSON.stringify(brief);
    }
    const match = opts.user.match(/t2-task-(\d+)/);
    const seq = match ? parseInt(match[1], 10) : 1;
    const t = tasks.find((item) => item.seq === seq) || tasks[0];
    return JSON.stringify(t.task);
  });

  const eightDaysAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString();
  const db: MockDb = {
    internship_enrollments: [
      {
        id: 'enr-solo-1',
        student_id: 'student-solo-1',
        tier: 't2_virtual_team',
        status: 'generating',
        track: 'python_ai',
        created_at: eightDaysAgo,
        started_at: eightDaysAgo,
      },
    ],
    internship_teams: [],
    internship_team_members: [],
    internship_sprints: [],
    internship_tasks: [],
  };

  setSupabaseAdminForTests(createMockSupabase(db));

  const req = new NextRequest('http://localhost:3000/api/internship/team', {
    method: 'POST',
    headers: { Authorization: 'Bearer test-token-student-solo-1' },
  });

  const res = await POST(req);
  const json = await res.json();

  assert.equal(res.status, 200, `Expected 200, got ${res.status}: ${JSON.stringify(json)}`);
  assert.equal(json.ok, true);
  assert.equal(json.matched, true);
  assert.equal(json.isSolo, true);

  // Assert that sprints were initialized (4 sprints)
  assert.equal(db.internship_sprints.length, 4, 'Must create exactly 4 sprints in internship_sprints');
  // Assert that 8 tasks were generated
  assert.equal(db.internship_tasks.length, 8, 'Must create exactly 8 tasks in internship_tasks');
  // Assert enrollment was set to active
  assert.equal(db.internship_enrollments[0].status, 'active');
  // Assert team has product brief
  assert.ok(db.internship_teams[0].project_brief?.productName, 'Team must have product brief stored');
  // Assert member has stories
  assert.ok(db.internship_team_members[0].stories?.length > 0, 'Member must have assigned stories');
});

test('F-11 / E-15: A newer active enrollment allows retry when an older enrollment failed', async () => {
  const brief = getDeterministicProductBrief('seed-solo-2', true);
  const tasks = getDeterministicTier2Tasks(brief.stories);

  setLlmJsonTransportForTests(async (opts) => {
    if (opts.system.includes('product brief')) {
      return JSON.stringify(brief);
    }
    const match = opts.user.match(/t2-task-(\d+)/);
    const seq = match ? parseInt(match[1], 10) : 1;
    const t = tasks.find((item) => item.seq === seq) || tasks[0];
    return JSON.stringify(t.task);
  });

  const oldDate = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString();
  const recentDate = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString();

  const db: MockDb = {
    internship_enrollments: [
      // Older failed enrollment
      {
        id: 'enr-old-failed',
        student_id: 'student-retry-1',
        tier: 't2_virtual_team',
        status: 'generation_failed',
        track: 'python_ai',
        created_at: oldDate,
        started_at: oldDate,
      },
      // Newer retry enrollment
      {
        id: 'enr-new-retry',
        student_id: 'student-retry-1',
        tier: 't2_virtual_team',
        status: 'generating',
        track: 'python_ai',
        created_at: recentDate,
        started_at: recentDate,
      },
    ],
    internship_teams: [],
    internship_team_members: [],
    internship_sprints: [],
    internship_tasks: [],
  };

  setSupabaseAdminForTests(createMockSupabase(db));

  const req = new NextRequest('http://localhost:3000/api/internship/team', {
    method: 'POST',
    headers: { Authorization: 'Bearer test-token-student-retry-1' },
  });

  const res = await POST(req);
  const json = await res.json();

  // In the unfixed code, this fails with 500 GENERATION_FAILED due to the query in team/route.ts
  assert.notEqual(
    res.status,
    500,
    'Should not be blocked with 500 GENERATION_FAILED by the old failed enrollment'
  );
  assert.equal(res.status, 200);
  assert.equal(json.ok, true);
  assert.equal(json.matched, true);
});

test('F-11: Failure during Tier 2 generation marks enrollment as generation_failed', async () => {
  // Fake AI throws or fails
  setLlmJsonTransportForTests(async () => {
    throw new Error('LLM rate limit reached');
  });

  const eightDaysAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString();
  const db: MockDb = {
    internship_enrollments: [
      {
        id: 'enr-fail-1',
        student_id: 'student-fail-1',
        tier: 't2_virtual_team',
        status: 'generating',
        track: 'python_ai',
        created_at: eightDaysAgo,
        started_at: eightDaysAgo,
      },
    ],
    internship_teams: [],
    internship_team_members: [],
    internship_sprints: [],
    internship_tasks: [],
  };

  setSupabaseAdminForTests(createMockSupabase(db));

  const req = new NextRequest('http://localhost:3000/api/internship/team', {
    method: 'POST',
    headers: { Authorization: 'Bearer test-token-student-fail-1' },
  });

  const res = await POST(req);
  assert.equal(res.status, 500);
  const json = await res.json();
  assert.equal(json.error, 'GENERATION_FAILED');
  assert.equal(db.internship_enrollments[0].status, 'generation_failed');
});
