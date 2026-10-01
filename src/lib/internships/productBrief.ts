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

  return {
    ok: false,
    reasons,
  };
}
