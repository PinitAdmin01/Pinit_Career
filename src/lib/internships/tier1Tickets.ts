import { generateValidatedTask, type GeneratedTask } from './generateTask';
import type { CompanyProfile } from './companyProfile';

export const TIER1_MONTH1_PYTHON_SKILLS = [
  'Python Functions',
  'String Manipulation',
  'Lists and Indexing',
  'Dictionaries and Lookups',
  'Loops and Iteration',
  'Error Handling and Exceptions',
  'Object-Oriented Classes',
] as const;

export const TIER1_TICKET_KINDS = [
  'bug_fix',
  'new_function',
  'data_cleaning',
  'refactor',
  'small_feature',
] as const;

export interface GeneratedTicketResult {
  seq: number;
  kind: string;
  task: GeneratedTask;
  model: string;
}

export type GenerateTier1TasksResult =
  | {
      ok: true;
      tickets: GeneratedTicketResult[];
    }
  | {
      ok: false;
      failedAtSeq: number;
      reasons: string[];
    };

/**
 * Generates all 5 tickets for a Tier 1 Python Job Simulation (C4 / FR-T1-3).
 * Each ticket exercises Month 1 Python skills in sequential order.
 */
export async function generateTier1Tasks(opts: {
  companyProfile: CompanyProfile;
  seed: string;
  model?: string;
}): Promise<GenerateTier1TasksResult> {
  const tickets: GeneratedTicketResult[] = [];

  for (let i = 0; i < TIER1_TICKET_KINDS.length; i++) {
    const seq = i + 1;
    const kind = TIER1_TICKET_KINDS[i];
    const ticketSeed = `${opts.seed}-ticket-${seq}-${kind}`;

    const genRes = await generateValidatedTask({
      tier: 't1_job_sim',
      kind,
      skills: TIER1_MONTH1_PYTHON_SKILLS,
      companyProfile: {
        name: opts.companyProfile.name,
        business: opts.companyProfile.industry,
        description: opts.companyProfile.readme,
      },
      seed: ticketSeed,
      language: 'python',
      model: opts.model,
    });

    if (!genRes.ok) {
      return {
        ok: false,
        failedAtSeq: seq,
        reasons: genRes.reasons,
      };
    }

    tickets.push({
      seq,
      kind,
      task: genRes.task,
      model: genRes.model,
    });
  }

  return {
    ok: true,
    tickets,
  };
}
