import { z } from 'zod';

export const FORBIDDEN_WORDS_LIST = [
  'os',
  'sys',
  'subprocess',
  'eval',
  'exec',
  'compile',
  'open',
  'pathlib',
  'Path',
  'io',
  'shutil',
  'socket',
  'urllib',
  'requests',
  'http',
  'httpx',
  'aiohttp',
  'ctypes',
  'exit',
  'quit',
  'SystemExit',
  '__import__',
  'importlib',
  '__subclasses__',
  '__builtins__',
];

/**
 * Zod schema for an AI-generated internship task (C12).
 */
export const GeneratedTaskSchema = z.object({
  title: z.string().min(3).max(100),
  brief: z.string().min(20).max(2000),
  starter_code: z.string().min(5).max(6000),
  visible_tests: z.string().min(5).max(6000),
  hidden_tests: z.string().min(5).max(6000),
  reference_solution: z.string().min(5).max(6000),
  skills: z.array(z.string()).min(1),
  sql_setup: z.string().max(6000).nullable().optional(),
});

export type GeneratedTask = z.infer<typeof GeneratedTaskSchema>;

export interface CompanyProfileInfo {
  name: string;
  business: string;
  description?: string;
}

export interface BuildTaskPromptOptions {
  tier: string;
  kind: string;
  skills: readonly string[] | string[];
  companyProfile: CompanyProfileInfo;
  seed: string;
  language?: 'python' | 'sql' | 'typescript' | 'tsx';
}

/**
 * Builds the strict system and user prompt for generating an internship task ticket (C12).
 */
export function buildTaskPrompt(opts: BuildTaskPromptOptions): { system: string; user: string } {
  const language = opts.language || 'python';
  const forbiddenListJoined = FORBIDDEN_WORDS_LIST.join(', ');
  const skillsJoined = opts.skills.join(', ');

  const system = `You are a Senior Engineering Lead crafting a realistic software engineering ticket for a student intern at a simulated company.

CRITICAL RULES:
1. OUTPUT FORMAT: Respond ONLY with a valid, parseable JSON object matching these exact keys:
   - "title": Short descriptive ticket title (3-100 characters).
   - "brief": Plain-English requirements and user story explaining the ticket, expectations, and inputs/outputs (20-2000 characters). Do NOT leak the solution code here!
   - "starter_code": Initial code template (function signature, docstring, placeholder) that is syntactically valid Python/SQL. It must execute without syntax errors, but FAIL the tests.
   - "visible_tests": Plain assert statements shown to the student intern (at least 2 assert lines).
   - "hidden_tests": Thorough plain assert statements for edge cases and strict validation, kept secret on server (at least 3 assert lines).
   - "reference_solution": The complete, clean reference implementation that passes BOTH visible and hidden tests.
   - "skills": Array of 1-4 specific skills exercised from the allowed skills list.
   ${language === 'sql' ? '- "sql_setup": Schema setup DDL and seed INSERT statements (tables, dummy data).' : ''}

2. ALLOWED SKILLS ONLY: You MUST only use the following allowed skills:
   ${skillsJoined}
   Do not introduce advanced libraries, frameworks, or concepts outside this list.

3. SANDBOX & SECURITY RESTRICTIONS:
   - No filesystem access, file reads/writes, or directory operations.
   - No network calls, HTTP requests, or socket connections.
   - No user interaction via input() or interactive prompts.
   - No randomness, nondeterminism, or time-dependent calculations. Tests must be 100% deterministic.
   - NEVER use or import any of the following forbidden modules, functions, or patterns:
     ${forbiddenListJoined}

4. DETERMINISTIC TESTING:
   - Tests MUST be written as standalone "assert <expression> == <expected>" statements.
   - Do NOT use unittest, pytest, or custom test runners; write direct assert lines.
   - In "visible_tests" and "hidden_tests", assume the symbols defined in starter_code / reference_solution are available in the scope.`;

  const user = `Please generate an engineering ticket with the following parameters:
- Company Name: ${opts.companyProfile.name} (Simulated Company)
- Company Business: ${opts.companyProfile.business}
${opts.companyProfile.description ? `- Company Context: ${opts.companyProfile.description}\n` : ''}- Internship Tier: ${opts.tier}
- Ticket Kind: ${opts.kind}
- Language: ${language}
- Allowed Skills: ${skillsJoined}
- Random Variation Seed: ${opts.seed}

Generate the JSON ticket now.`;

  return { system, user };
}

export interface GenerateValidatedTaskOptions extends BuildTaskPromptOptions {
  maxAttempts?: number;
  model?: string;
}

export type GenerateValidatedTaskResult =
  | {
      ok: true;
      task: GeneratedTask;
      model: string;
      attempts: number;
    }
  | {
      ok: false;
      reasons: string[];
    };

/**
 * Loops up to maxAttempts (default 3) calling askForJson and running validateGeneratedTask.
 * Returns the first task that passes all validation steps V1-V7.
 */
export async function generateValidatedTask(
  opts: GenerateValidatedTaskOptions
): Promise<GenerateValidatedTaskResult> {
  // Dynamically import askForJson and validateGeneratedTask to avoid eager module cycles
  const { askForJson } = await import('@/lib/server/llmJson');
  const { validateGeneratedTask } = await import('./validateTask');

  const maxAttempts = opts.maxAttempts || 3;
  const reasons: string[] = [];

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const seed = `${opts.seed}-attempt-${attempt}`;
    const { system, user } = buildTaskPrompt({ ...opts, seed });

    const askRes = await askForJson({
      system,
      user,
      schema: GeneratedTaskSchema,
      maxTokens: 4000,
      model: opts.model,
    });

    if (!askRes.ok) {
      reasons.push(`Attempt ${attempt} generation failed: ${askRes.reason}`);
      continue;
    }

    const validationRes = await validateGeneratedTask(
      askRes.data,
      opts.language || 'python'
    );

    if (!validationRes.ok) {
      reasons.push(
        `Attempt ${attempt} validation failed at ${validationRes.step}: ${validationRes.reason}`
      );
      continue;
    }

    return {
      ok: true,
      task: askRes.data,
      model: askRes.model,
      attempts: attempt,
    };
  }

  return {
    ok: false,
    reasons,
  };
}
