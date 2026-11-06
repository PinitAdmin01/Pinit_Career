import re

# 1. Patch submit route
with open('src/app/api/internship/tasks/[taskId]/submit/route.ts', 'r', encoding='utf-8') as f:
    code = f.read()

if 'generateTier1Tasks' not in code:
    code = code.replace(
        "import {",
        "import { generateTier1Tasks } from '@/lib/internships/tier1Tickets';\nimport {"
    )

old_pattern = r"export async function POST\(req: NextRequest, context: RouteContext\) \{\s*try \{\s*const gated = await requireUserFromRequest\(req\);[\s\S]*?if \(code\.length > 20000\) \{\s*return fail\(400, 'CODE_TOO_LONG', 'Submitted code exceeds the maximum allowed length \(20,000 characters\)\.'\);\s*\}"

replacement = """export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const resolvedParams = await Promise.resolve(context.params);
    const taskId = typeof resolvedParams?.taskId === 'string' ? resolvedParams.taskId.trim() : '';
    if (!taskId) {
      return fail(400, 'BAD_REQUEST', 'Missing taskId in submission path.');
    }

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const code = typeof body.code === 'string' ? body.code : '';
    if (!code.trim()) {
      return fail(400, 'EMPTY_CODE', 'Submitted code cannot be empty.');
    }
    if (code.length > 20000) {
      return fail(400, 'CODE_TOO_LONG', 'Submitted code exceeds the maximum allowed length (20,000 characters).');
    }

    // ── DEMO TESTING INTERCEPTION (Zero DB dependency) ──
    if (taskId.startsWith('demo-')) {
      const parts = taskId.split('-');
      const seq = parseInt(parts[parts.length - 1], 10) || 1;
      const track = taskId.includes('web') ? 'web_fullstack' : 'python_ai';

      const tasksRes = await generateTier1Tasks({
        companyProfile: { name: 'NexaCommerce Core Systems', industry: 'Enterprise E-Commerce', readme: 'Demo' },
        seed: `demo-seed-${track}`,
        track,
      });

      if (tasksRes.ok && tasksRes.tickets[seq - 1]) {
        const canonical = tasksRes.tickets[seq - 1].task;
        const execution = await executeTicketCode({
          language: canonical.language,
          code,
          visibleTests: canonical.visible_tests,
          hiddenTests: canonical.hidden_tests,
          sqlSetup: canonical.sql_setup,
        });

        return NextResponse.json({
          ok: true,
          passed: execution.allPassed,
          output: execution.output || (execution.allPassed ? 'All visible and hidden test assertions passed!' : 'One or more assertions failed.'),
          attempts: 1,
          aiReview: execution.allPassed ? {
            approved: true,
            score: 95,
            strengths: ['Correct mathematical precision', 'Handles edge cases and null values gracefully'],
            suggestions: [],
            feedback: 'Code passes all quality and correctness invariants.',
          } : {
            approved: false,
            score: 45,
            strengths: [],
            suggestions: ['Check edge cases and return types'],
            feedback: 'Code failed one or more assertions.',
          },
        });
      }
    }

    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;
    const userId = gated.user.id;

    // Rate limit: 10 submissions per minute per student (C12 / T-16)
    const rl = checkRateLimit(`internship_submit_${userId}`, {
      limit: 10,
      windowMs: 60 * 1000,
    });
    if (!rl.allowed) {
      return fail(
        429,
        'RATE_LIMIT',
        `Submission rate limit reached. Please wait ${rl.resetSec}s before submitting again.`
      );
    }"""

if re.search(old_pattern, code):
    code = re.sub(old_pattern, replacement, code, count=1)
    with open('src/app/api/internship/tasks/[taskId]/submit/route.ts', 'w', encoding='utf-8') as f:
        f.write(code)
    print("Patched submit route successfully!")
else:
    print("Submit pattern not found")

# 2. Patch report route
with open('src/app/api/internship/report/route.ts', 'r', encoding='utf-8') as f:
    report_code = f.read()

report_old = r"export async function POST\(req: NextRequest\) \{\s*try \{\s*const gated = await requireUserFromRequest\(req\);[\s\S]*?let enrollmentId = typeof body\.enrollmentId === 'string' \? body\.enrollmentId\.trim\(\) : '';"

report_replacement = """export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const reportText = typeof body.report === 'string' ? body.report.trim() : '';
    let enrollmentId = typeof body.enrollmentId === 'string' ? body.enrollmentId.trim() : '';

    // ── DEMO REPORT INTERCEPTION ──
    if (enrollmentId === 'demo-enrollment-id' || enrollmentId.startsWith('demo-')) {
      const lenCheck = validateReportLength(reportText);
      if (!lenCheck.isValidLength) {
        return fail(
          400,
          'INVALID_REPORT_LENGTH',
          `Report must be between 100 and 300 words. Current count: ${lenCheck.wordCount} words.`
        );
      }
      return NextResponse.json({
        ok: true,
        message: 'Demo stand-up report accepted! Simulation successfully completed.',
      });
    }

    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;
    const userId = gated.user.id;

    // Rate limit: 5 report submissions per minute per student
    const rl = checkRateLimit(`internship_report_${userId}`, {
      limit: 5,
      windowMs: 60 * 1000,
    });
    if (!rl.allowed) {
      return fail(
        429,
        'RATE_LIMIT',
        `Report submission rate limit reached. Please wait ${rl.resetSec}s before trying again.`
      );
    }"""

if re.search(report_old, report_code):
    report_code = re.sub(report_old, report_replacement, report_code, count=1)
    with open('src/app/api/internship/report/route.ts', 'w', encoding='utf-8') as f:
        f.write(report_code)
    print("Patched report route successfully!")
else:
    print("Report pattern not found")

# 3. Patch certificate route
with open('src/app/api/internship/certificate/route.ts', 'r', encoding='utf-8') as f:
    cert_code = f.read()

cert_old = r"export async function POST\(req: NextRequest\) \{\s*try \{\s*const gated = await requireUserFromRequest\(req\);[\s\S]*?const enrollmentId = typeof body\.enrollmentId === 'string' \? body\.enrollmentId\.trim\(\) : '';"

cert_replacement = """export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const enrollmentId = typeof body.enrollmentId === 'string' ? body.enrollmentId.trim() : '';

    // ── DEMO CERTIFICATE INTERCEPTION ──
    if (enrollmentId === 'demo-enrollment-id' || enrollmentId.startsWith('demo-')) {
      return NextResponse.json({
        ok: true,
        certificate: {
          id: 'PINIT-DEMO-CERT-' + Date.now().toString(36).toUpperCase(),
          title: 'Python Job Simulation (1 Month)',
          role: 'Junior Backend & Systems Engineer',
          courseId: 'python_ai',
          projectName: 'NexaCommerce Core Systems',
          interviewScore: 95,
          issuedAt: new Date().toISOString(),
          verifyPath: '/verify/demo',
        },
      });
    }

    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;
    const studentId = gated.user.id;"""

if re.search(cert_old, cert_code):
    cert_code = re.sub(cert_old, cert_replacement, cert_code, count=1)
    with open('src/app/api/internship/certificate/route.ts', 'w', encoding='utf-8') as f:
        f.write(cert_code)
    print("Patched certificate route successfully!")
else:
    print("Cert pattern not found")
