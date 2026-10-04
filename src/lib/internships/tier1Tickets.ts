import { generateValidatedTask, type GeneratedTask } from './generateTask';
import type { CompanyProfile } from './companyProfile';
import {
  TIER1_WEB_TICKET_KINDS,
  TIER1_WEB_MONTH1_SKILLS,
  getSeedWebTier1Tasks,
} from './seedCompanies';
import type { InternshipTaskLanguage } from './types';

export {
  TIER1_WEB_TICKET_KINDS,
  TIER1_WEB_MONTH1_SKILLS,
  getSeedWebTier1Tasks,
};

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

export interface GenerateTier1TasksOptions {
  companyProfile: CompanyProfile;
  seed: string;
  track?: 'python_ai' | 'web_fullstack' | string;
  language?: InternshipTaskLanguage;
  model?: string;
  useSeedFallback?: boolean;
}

/**
 * Generates all 5 tickets for a Tier 1 Job Simulation (C4 / FR-T1-3).
 * Supports both Python AI (Python Month 1) and Web Full-Stack (React Month 1).
 */
export async function generateTier1Tasks(
  opts: GenerateTier1TasksOptions
): Promise<GenerateTier1TasksResult> {
  const isWeb =
    opts.track === 'web_fullstack' ||
    opts.language === 'typescript' ||
    opts.language === 'tsx';

  const ticketKinds = isWeb ? TIER1_WEB_TICKET_KINDS : TIER1_TICKET_KINDS;
  const skills = isWeb ? TIER1_WEB_MONTH1_SKILLS : TIER1_MONTH1_PYTHON_SKILLS;
  const language = isWeb ? (opts.language || 'tsx') : 'python';

  // If deterministic seed fallback requested, return seed tasks directly
  if (isWeb && opts.useSeedFallback) {
    const seedTasks = getSeedWebTier1Tasks(opts.companyProfile);
    return {
      ok: true,
      tickets: seedTasks.map((task, idx) => ({
        seq: idx + 1,
        kind: ticketKinds[idx] || 'small_feature',
        task,
        model: 'seed_seeder_v1',
      })),
    };
  }

  const tickets: GeneratedTicketResult[] = [];

  for (let i = 0; i < ticketKinds.length; i++) {
    const seq = i + 1;
    const kind = ticketKinds[i];
    const ticketSeed = `${opts.seed}-ticket-${seq}-${kind}`;

    const genRes = await generateValidatedTask({
      tier: 't1_job_sim',
      kind,
      skills,
      companyProfile: {
        name: opts.companyProfile.name,
        business: opts.companyProfile.industry,
        description: opts.companyProfile.readme,
      },
      seed: ticketSeed,
      language,
      model: opts.model,
    });

    if (!genRes.ok) {
      // In tests/production when LLM is unconfigured, fallback gracefully to pre-validated seed tasks
      if (isWeb) {
        const seedTasks = getSeedWebTier1Tasks(opts.companyProfile);
        return {
          ok: true,
          tickets: seedTasks.map((task, idx) => ({
            seq: idx + 1,
            kind: ticketKinds[idx] || 'small_feature',
            task,
            model: 'seed_seeder_v1',
          })),
        };
      }

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
