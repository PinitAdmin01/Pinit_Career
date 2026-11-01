import { NextRequest, NextResponse } from 'next/server';
import { generateTier1Tasks } from '@/lib/internships/tier1Tickets';
import { getSeedWebTier1Tasks } from '@/lib/internships/seedWebTier1Tasks';

/**
 * GET /api/internship/demo-data
 * Returns isolated demo internship manifests (Python or Web track)
 * for testing without requiring Supabase database records or auth.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const track = searchParams.get('track') === 'web_fullstack' ? 'web_fullstack' : 'python_ai';

    const companyProfile =
      track === 'web_fullstack'
        ? {
            name: 'PulseSync Systems',
            industry: 'Cloud Infrastructure & Frontend Monitoring',
            readme:
              'PulseSync provides real-time distributed telemetry, metrics aggregation, and frontend observability dashboards for microservices.',
          }
        : {
            name: 'NexaCommerce Core Systems',
            industry: 'Enterprise E-Commerce & Retail Backend',
            readme:
              'NexaCommerce is a high-volume omnichannel retail core system handling checkout, pricing calculations, promotion applications, and catalog indexing.',
          };

    let tasksRaw: Array<{
      seq: number;
      kind: string;
      task: any;
    }> = [];

    if (track === 'web_fullstack') {
      const webTasks = getSeedWebTier1Tasks(companyProfile);
      tasksRaw = webTasks.map((task, idx) => ({
        seq: idx + 1,
        kind: ['component', 'component_bug_fix', 'form_validation', 'refactor', 'small_feature'][idx],
        task,
      }));
    } else {
      const taskResult = await generateTier1Tasks({
        companyProfile,
        seed: `demo-seed-${track}`,
        track,
      });

      if (!taskResult.ok) {
        return NextResponse.json(
          { ok: false, error: 'GENERATION_FAILED', message: 'Failed to generate demo tasks.' },
          { status: 500 }
        );
      }
      tasksRaw = taskResult.tickets;
    }

    const tasks = tasksRaw.map((ticket, index) => ({
      id: `demo-${track}-${ticket.seq}`,
      internshipEnrollmentId: 'demo-enrollment-id',
      seq: ticket.seq,
      week: 1,
      kind: ticket.kind,
      language: ((ticket.task as Record<string, unknown>).language as string) || (track === 'web_fullstack' ? 'tsx' : 'python'),
      title: ticket.task.title,
      brief: ticket.task.brief,
      starterCode: ticket.task.starter_code,
      visibleTests: ticket.task.visible_tests,
      referenceSolution: ticket.task.reference_solution,
      sqlSetup: ticket.task.sql_setup || null,
      skills: ticket.task.skills || [],
      status: index === 0 ? 'open' : 'locked',
      attempts: 0,
      passedAt: null,
      createdAt: new Date().toISOString(),
    }));

    const enrollment = {
      id: 'demo-enrollment-id',
      studentId: 'demo-student-001',
      crashEnrollmentId: 'demo-crash-001',
      tier: 't1_job_sim',
      track,
      status: 'active',
      startedAt: new Date().toISOString(),
      dueAt: new Date(Date.now() + 14 * 86400000).toISOString(),
      extended: false,
      finalReport: null,
      certificateId: null,
      createdAt: new Date().toISOString(),
      companyProfile: {
        ...companyProfile,
        isFictional: true,
      },
    };

    return NextResponse.json({
      ok: true,
      track,
      companyProfile,
      enrollment,
      tasks,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: 'SERVER_ERROR', message: String(err) },
      { status: 500 }
    );
  }
}
