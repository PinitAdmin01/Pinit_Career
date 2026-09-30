import { z } from 'zod';

/**
 * T-37 — Simulated-client fallback for Tier 3.
 * AI-played client chat with changing requirements.
 * Certificate output indicates "(simulated client)".
 */

export const SimulatedClientMessageSchema = z.object({
  role: z.enum(['client', 'student']),
  content: z.string().min(1).max(2000),
  timestamp: z.string(),
  requirementChange: z.boolean().default(false),
  newRequirement: z.string().optional(),
});

export type SimulatedClientMessage = z.infer<typeof SimulatedClientMessageSchema>;

export interface SimulatedClientState {
  internshipEnrollmentId: string;
  clientName: string;
  clientRole: string;
  projectGoal: string;
  history: SimulatedClientMessage[];
  currentPhase: number;
}

/**
 * Returns the honesty label tag for Tier 3 project certificates.
 */
export function getSimulatedClientHonestyLabel(isSimulated: boolean): string {
  return isSimulated ? '(simulated client)' : '(real client)';
}

/**
 * System prompt generator for AI simulated client persona.
 */
export function buildSimulatedClientPrompt(
  projectName: string,
  projectGoal: string,
  phase: number
): string {
  return [
    `You are acting as a real-world client for a student project titled "${projectName}".`,
    `Project Goal: ${projectGoal}`,
    `Current Phase: ${phase} of 4.`,
    'Guidelines:',
    '- Provide realistic, clear but slightly evolving software requirements.',
    '- Ask probing questions about API design, data handling, and progress.',
    '- Be professional, encouraging, but demand high quality.',
    '- Keep responses concise (under 150 words).',
  ].join('\n');
}
