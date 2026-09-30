import { z } from 'zod';
import { askForJson } from '@/lib/server/llmJson';

export const DataModelTableSchema = z.object({
  table: z.string().min(1).max(50),
  columns: z.array(z.string().min(1)).min(2).max(20),
});

export const UserStorySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(3).max(150),
  acceptance: z.array(z.string().min(3)).min(1).max(10),
});

export const ProductBriefSchema = z.object({
  productName: z.string().min(2).max(100),
  summary: z.string().min(20).max(3000),
  dataModel: z.array(DataModelTableSchema).min(2).max(10),
  stories: z.array(UserStorySchema).min(6).max(25),
});

export type DataModelTable = z.infer<typeof DataModelTableSchema>;
export type UserStory = z.infer<typeof UserStorySchema>;
export type ProductBrief = z.infer<typeof ProductBriefSchema>;

export interface GenerateProductBriefOptions {
  seed: string;
  isSolo?: boolean;
  memberIds?: string[];
  model?: string;
  maxAttempts?: number;
}

export type GenerateProductBriefResult =
  | {
      ok: true;
      brief: ProductBrief;
      assignments: Record<string, UserStory[]>;
      model: string;
      attempts: number;
    }
  | {
      ok: false;
      reasons: string[];
    };

/**
 * Distributes user stories evenly across all team members in round-robin fashion.
 * For solo mode (1 member), all stories are assigned to that single member.
 */
export function assignStoriesToMembers(
  stories: UserStory[],
  memberIds: string[]
): Record<string, UserStory[]> {
  if (!memberIds || memberIds.length === 0) {
    return {};
  }
  const assignments: Record<string, UserStory[]> = {};
  for (const id of memberIds) {
    assignments[id] = [];
  }
  stories.forEach((story, idx) => {
    const assignedMemberId = memberIds[idx % memberIds.length];
    assignments[assignedMemberId].push(story);
  });
  return assignments;
}

/**
 * Deterministic fallback product briefs for offline testing and fast unit verification.
 */
export function getDeterministicProductBrief(
  seed: string,
  isSolo: boolean = false
): ProductBrief {
  const domains = [
    {
      productName: 'ClinicFlow Appointment Backend',
      summary:
        'A high-performance simulated backend service for clinical appointment management, patient record routing, and doctor schedule conflict prevention. Designed for Python + PostgreSQL REST services.',
      dataModel: [
        {
          table: 'patients',
          columns: ['id UUID PRIMARY KEY', 'full_name TEXT NOT NULL', 'email TEXT UNIQUE', 'created_at TIMESTAMPTZ'],
        },
        {
          table: 'doctors',
          columns: ['id UUID PRIMARY KEY', 'name TEXT NOT NULL', 'specialization TEXT', 'active BOOLEAN'],
        },
        {
          table: 'appointments',
          columns: ['id UUID PRIMARY KEY', 'patient_id UUID REFERENCES patients(id)', 'doctor_id UUID REFERENCES doctors(id)', 'slot_time TIMESTAMPTZ', 'status TEXT'],
        },
        {
          table: 'consultation_notes',
          columns: ['id UUID PRIMARY KEY', 'appointment_id UUID REFERENCES appointments(id)', 'diagnosis TEXT', 'prescriptions JSONB'],
        },
      ],
      stories: [
        { id: 'US-01', title: 'Register new patient with duplicate email validation', acceptance: ['Validate email RFC compliance', 'Return 409 Conflict if email exists', 'Persist record'] },
        { id: 'US-02', title: 'List doctors by specialty and availability', acceptance: ['Filter by specialization', 'Order by seniority', 'Exclude inactive doctors'] },
        { id: 'US-03', title: 'Book appointment slot with race condition prevention', acceptance: ['Atomic transaction lock on doctor slot', 'Reject overlapping times', 'Return booking confirmation'] },
        { id: 'US-04', title: 'Cancel appointment with audit logging', acceptance: ['Update status to cancelled', 'Record cancellation reason', 'Release slot for rebooking'] },
        { id: 'US-05', title: 'Fetch daily appointment schedule for a clinic doctor', acceptance: ['Sort chronologically', 'Include patient name and contact', 'Omit cancelled slots'] },
        { id: 'US-06', title: 'Attach clinical consultation notes to appointment', acceptance: ['Authorize attending doctor', 'Store structured diagnosis', 'Append prescriptions'] },
        { id: 'US-07', title: 'Calculate doctor patient throughput analytics', acceptance: ['Aggregate count by month', 'Calculate average consultation duration', 'Return summary metrics'] },
        { id: 'US-08', title: 'Export patient medical history timeline', acceptance: ['Chronological list of all visits', 'Include prescription summary', 'Mask sensitive patient identifiers'] },
        { id: 'US-09', title: 'Automated appointment reminder dispatch queue', acceptance: ['Query appointments 24h away', 'Generate notification payload', 'Track notification status'] },
        { id: 'US-10', title: 'Doctor leave and unavailabilty blackout periods', acceptance: ['Block calendar date ranges', 'Prevent bookings during blackout', 'Notify affected patients'] },
        { id: 'US-11', title: 'Emergency priority triage booking', acceptance: ['Bypass standard queue', 'Flag appointment as urgent', 'Assign next on-duty physician'] },
        { id: 'US-12', title: 'Prescription inventory cross-reference validation', acceptance: ['Verify medication name against formulary', 'Warn on dosage thresholds', 'Store validation status'] },
        { id: 'US-13', title: 'Clinic revenue and billing ledger generator', acceptance: ['Sum completed visit fees', 'Calculate specialty breakdown', 'Output monthly balance'] },
        { id: 'US-14', title: 'Patient feedback and satisfaction ratings', acceptance: ['Accept 1-5 star ratings', 'Store optional text feedback', 'Compute rolling average'] },
      ],
    },
  ];

  const brief = domains[0];
  const storyCount = isSolo ? 7 : 14;
  return {
    ...brief,
    stories: brief.stories.slice(0, storyCount),
  };
}

/**
 * Generates an AI-authored product brief and sprint backlog for Tier 2 Virtual Internships (T-25, FR-T2-2).
 * Scaled to 12-16 stories for collaborative teams, and 6-8 stories for solo mode.
 */
export async function generateProductBrief(
  opts: GenerateProductBriefOptions
): Promise<GenerateProductBriefResult> {
  const isSolo = Boolean(opts.isSolo);
  const targetCount = isSolo ? '6 to 8' : '12 to 16';
  const minStories = isSolo ? 6 : 12;
  const maxStories = isSolo ? 8 : 16;
  const maxAttempts = opts.maxAttempts || 3;
  const reasons: string[] = [];

  const system = `You are a Principal Software Architect designing a product brief and sprint backlog for a junior software engineering virtual internship simulation.
The project is a small, realistic Python + SQL backend service (e.g. clinic appointment booking, university library system, canteen food ordering, or logistics dispatch).

CRITICAL REQUIREMENTS:
1. OUTPUT: Strict JSON matching this schema:
   - "productName": Clean name of the service (e.g. "PulseClinic API", "LibreDesk Engine", "CanteenHub Backend").
   - "summary": 2-3 paragraphs describing the system's objective, architecture, and PostgreSQL requirements.
   - "dataModel": Array of 2 to 5 relational tables, each with:
     - "table": Table name (e.g. "patients", "appointments").
     - "columns": Column definitions (e.g. ["id UUID PRIMARY KEY", "name TEXT NOT NULL", "created_at TIMESTAMPTZ"]).
   - "stories": Array of user stories containing EXACTLY ${targetCount} stories.
2. USER STORIES:
   - Each story must have:
     - "id": String like "US-01", "US-02", etc.
     - "title": Actionable task title (e.g. "Register patient record with email validation").
     - "acceptance": Array of 2 to 4 clear, testable acceptance criteria strings.
3. TECH SCOPE:
   - Skills must come strictly from Months 1-3 fundamentals (Python logic, data structures, algorithms, PostgreSQL/SQL).
4. HONEST LABELLING:
   - Explicitly note in "summary" that this is a simulated corporate product brief for training purposes.`;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const seed = `${opts.seed}-brief-attempt-${attempt}`;
    const user = `Generate a virtual internship product brief for ${isSolo ? 'a SOLO student (6-8 user stories)' : 'a 3-4 member team (12-16 user stories)'}. Seed: ${seed}.`;

    const res = await askForJson<ProductBrief>({
      system,
      user,
      schema: ProductBriefSchema,
      maxTokens: 2500,
      model: opts.model,
    });

    if (!res.ok) {
      reasons.push(`Attempt ${attempt}: ${res.reason}`);
      continue;
    }

    let brief = res.data;

    // Check story count constraints
    if (brief.stories.length < minStories) {
      reasons.push(
        `Attempt ${attempt}: Generated ${brief.stories.length} stories, fewer than required minimum ${minStories}.`
      );
      continue;
    }

    // If slightly over max, clamp to maxStories
    if (brief.stories.length > maxStories) {
      brief = {
        ...brief,
        stories: brief.stories.slice(0, maxStories),
      };
    }

    // Distribute stories across members if memberIds provided
    const memberIds = opts.memberIds || (isSolo ? ['solo-student'] : []);
    const assignments = assignStoriesToMembers(brief.stories, memberIds);

    return {
      ok: true,
      brief,
      assignments,
      model: res.model,
      attempts: attempt,
    };
  }

  // If live LLM calls failed or are unconfigured in test environments, use deterministic fallback
  const fallback = getDeterministicProductBrief(opts.seed, isSolo);
  const memberIds = opts.memberIds || (isSolo ? ['solo-student'] : []);
  const assignments = assignStoriesToMembers(fallback.stories, memberIds);

  return {
    ok: true,
    brief: fallback,
    assignments,
    model: 'deterministic-fallback',
    attempts: maxAttempts,
  };
}
