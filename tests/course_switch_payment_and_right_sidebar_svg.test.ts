import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import ReactDOMServer from 'react-dom/server';
import {
  fulfilCardCoursePurchase,
  pauseActiveCourseEnrollments,
} from '../src/lib/server/courseEnrollments';
import { RIGHT_NAV, RIGHT_NAV_SVG_ICONS } from '../src/components/ui/AppSidebar';

/**
 * In-memory Supabase admin mock that strictly enforces PostgreSQL's partial unique index:
 *   uniq_active_crash_enrollment_per_plan ON user_crash_enrollments(user_id, plan_id) WHERE status = 'active'
 */
function createStrictEnrollmentSupabaseMock(initialRows: any[] = []) {
  const rows = initialRows.map((r) => ({ ...r }));
  const creditedRpcCalls: any[] = [];

  const admin: any = {
    _rows: rows,
    _creditedRpcCalls: creditedRpcCalls,
    from(table: string) {
      if (table === 'users') {
        return {
          select() {
            return {
              eq() {
                return {
                  async maybeSingle() {
                    return { data: { pin_history: [] }, error: null };
                  },
                };
              },
            };
          },
          update() {
            return {
              async eq() {
                return { error: null };
              },
            };
          },
        };
      }

      if (table !== 'user_crash_enrollments') {
        throw new Error(`Unexpected table: ${table}`);
      }

      return {
        select() {
          const filters: Array<[string, any]> = [];
          const chain: any = {
            eq(col: string, val: any) {
              filters.push([col, val]);
              return chain;
            },
            order() {
              return chain;
            },
            limit() {
              return chain;
            },
            async maybeSingle() {
              const found = rows.find((r) => filters.every(([c, v]) => r[c] === v)) || null;
              return { data: found ? { ...found } : null, error: null };
            },
          };
          return chain;
        },
        update(patch: Record<string, any>) {
          const filters: Array<[string, any]> = [];
          const chain: any = {
            eq(col: string, val: any) {
              filters.push([col, val]);
              return chain;
            },
            then(resolve: any, reject: any) {
              try {
                for (const r of rows) {
                  if (filters.every(([c, v]) => r[c] === v)) {
                    Object.assign(r, patch);
                  }
                }
                resolve({ error: null });
              } catch (e) {
                reject(e);
              }
            },
          };
          return chain;
        },
        insert(row: Record<string, any>) {
          return {
            select() {
              return {
                async single() {
                  // Enforce uniq_active_crash_enrollment_per_plan
                  if (row.status === 'active') {
                    const conflict = rows.find(
                      (r) =>
                        r.user_id === row.user_id &&
                        r.plan_id === row.plan_id &&
                        r.status === 'active'
                    );
                    if (conflict) {
                      return {
                        data: null,
                        error: {
                          code: '23505',
                          message:
                            'duplicate key value violates unique constraint "uniq_active_crash_enrollment_per_plan"',
                        },
                      };
                    }
                  }
                  const stored = { ...row };
                  rows.push(stored);
                  return { data: { ...stored }, error: null };
                },
              };
            },
          };
        },
      };
    },
    async rpc(fnName: string, args: any) {
      if (fnName === 'credit_pins') {
        creditedRpcCalls.push(args);
        return { data: { ok: true, new_balance: 300 }, error: null };
      }
      return { data: null, error: { message: 'unknown rpc' } };
    },
  };

  return admin;
}

describe('TASK 1: Course Switch & Razorpay Payment Verification Fix (No 500 on Track Switch)', () => {
  const root = path.resolve(__dirname, '..');

  it('1.1: Switching from active web_fullstack to python_ai on the same plan-1m-sprint succeeds without 23505 error', async () => {
    const admin = createStrictEnrollmentSupabaseMock([
      {
        enrollment_id: 'enr-old-web',
        user_id: 'user-vinay',
        plan_id: 'plan-1m-sprint',
        track: 'web_fullstack',
        amount_paid: 4999,
        payment_id: 'pay_old_web_123',
        order_id: 'order_old_web_123',
        payment_method: 'razorpay',
        status: 'active',
        enrolled_at: '2026-11-18T10:00:00.000Z',
        current_sprint: 1,
        daily_learning_hours_target: 1,
        reward_pins_credited: 150,
        pins_deducted: 0,
        milestone_progress: { sprint1Approved: false, sprint2Approved: false },
        certificates_issued: {},
      },
    ]);

    const result = await fulfilCardCoursePurchase(admin, {
      userId: 'user-vinay',
      planId: 'plan-1m-sprint',
      track: 'python_ai',
      paymentId: 'pay_new_python_456',
      orderId: 'order_new_python_456',
      amountPaid: 4999,
    });

    assert.equal(result.error, null, 'Must not fail with duplicate key 500 error');
    assert.ok(result.enrollment, 'Must return the newly created python_ai enrollment');
    assert.equal(result.enrollment.track, 'python_ai');
    assert.equal(result.enrollment.status, 'active');
    assert.equal(result.rewardPinsCredited, 150);

    // Old web_fullstack row must now be paused (preserved in DB history)
    const oldRow = admin._rows.find((r: any) => r.enrollment_id === 'enr-old-web');
    assert.equal(oldRow.status, 'paused', 'Previous active enrollment must be paused');

    // Retry with same paymentId must remain strictly idempotent (no double pins, no re-insert)
    const retry = await fulfilCardCoursePurchase(admin, {
      userId: 'user-vinay',
      planId: 'plan-1m-sprint',
      track: 'python_ai',
      paymentId: 'pay_new_python_456',
      orderId: 'order_new_python_456',
      amountPaid: 4999,
    });
    assert.equal(retry.error, null);
    assert.equal(retry.enrollment?.enrollmentId, result.enrollment.enrollmentId);
    assert.equal(retry.rewardPinsCredited, 0, 'Retry must not double-credit reward pins');
    assert.equal(admin._creditedRpcCalls.length, 1);
  });

  it('1.2: pauseActiveCourseEnrollments transitions active rows to paused', async () => {
    const admin = createStrictEnrollmentSupabaseMock([
      {
        enrollment_id: 'enr-1',
        user_id: 'user-1',
        plan_id: 'plan-1m-sprint',
        track: 'web_fullstack',
        status: 'active',
      },
    ]);
    const res = await pauseActiveCourseEnrollments(admin, 'user-1');
    assert.equal(res.error, null);
    assert.equal(admin._rows[0].status, 'paused');
  });

  it('1.3: DELETE /api/quests/enrollment and client pauseActiveEnrollment are wired to Change Course', () => {
    const routeSrc = fs.readFileSync(path.join(root, 'src/app/api/quests/enrollment/route.ts'), 'utf8');
    const svcSrc = fs.readFileSync(path.join(root, 'src/lib/services/crashCourseEnrollmentService.ts'), 'utf8');
    const drawerSrc = fs.readFileSync(path.join(root, 'src/app/quests/components/TrackSelectorDrawer.tsx'), 'utf8');

    assert.ok(routeSrc.includes('export async function DELETE('), 'API must expose DELETE handler to pause active course');
    assert.ok(svcSrc.includes('async pauseActiveEnrollment('), 'Client service must expose pauseActiveEnrollment()');
    assert.ok(svcSrc.includes("api.delete('/api/quests/enrollment')"), 'pauseActiveEnrollment must call DELETE /api/quests/enrollment');
    assert.ok(
      drawerSrc.includes('crashCourseEnrollmentService.pauseActiveEnrollment()'),
      'TrackSelectorDrawer Change Course action must call pauseActiveEnrollment() on server'
    );
  });
});

describe('TASK 2: RightSidebar Tab Representation Matches LeftSidebar (Vector SVGs, Zero Raw Emojis)', () => {
  const root = path.resolve(__dirname, '..');

  it('2.1: Every single RIGHT_NAV item has a dedicated 17x17 monochrome vector SVG in RIGHT_NAV_SVG_ICONS', () => {
    assert.ok(RIGHT_NAV.length >= 17, 'RIGHT_NAV must have all campus academic tabs');
    for (const item of RIGHT_NAV) {
      const iconNode = RIGHT_NAV_SVG_ICONS[item.id];
      assert.ok(iconNode, `Missing vector SVG icon for RIGHT_NAV tab "${item.id}" (${item.label})`);
      const markup = ReactDOMServer.renderToStaticMarkup(iconNode as any);
      assert.ok(markup.startsWith('<svg '), `Icon for "${item.id}" must be an <svg> element`);
      assert.ok(markup.includes('stroke="currentColor"'), `Icon for "${item.id}" must use stroke="currentColor" like LeftSidebar`);
      assert.ok(markup.includes('width="17"'), `Icon for "${item.id}" must match LeftSidebar 17x17 dimensions`);
    }
  });

  it('2.2: AppShell RightSidebar uses LeftSidebar .nav-item, .nav-icon, RIGHT_NAV_SVG_ICONS, and initial avatar (no raw 👤 emoji)', () => {
    const shellSrc = fs.readFileSync(path.join(root, 'src/components/ui/AppShell.tsx'), 'utf8');
    assert.ok(shellSrc.includes('RIGHT_NAV_SVG_ICONS'), 'AppShell must import and use RIGHT_NAV_SVG_ICONS');
    assert.ok(
      shellSrc.includes('className={`nav-item${active ? \' active\' : \'\'}${isTourSpotlight ? \' pinit-tour-spotlight\' : \'\'}`}'),
      'RightSidebar tabs must use the unified .nav-item class from LeftSidebar'
    );
    assert.ok(shellSrc.includes('className="nav-icon"'), 'RightSidebar tabs must wrap SVG icons in .nav-icon');
    assert.ok(!shellSrc.includes('👤'), 'RightSidebar avatar must not render raw 👤 emoji');
    assert.ok(shellSrc.includes('flexShrink: 0') && shellSrc.includes('minHeight: 38'), 'RightSidebar nav buttons must not flex-shrink vertically');
    assert.ok(shellSrc.includes("padding: '9px 12px'"), 'RightSidebar nav buttons must preserve comfortable 9px 12px padding');
  });
});
