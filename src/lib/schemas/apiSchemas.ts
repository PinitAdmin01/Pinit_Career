import { z } from 'zod';

export const XpAddSchema = z.object({
  amount: z.number().int().min(1).max(500),
  reason: z.string().min(1).max(200),
  actionType: z.enum([
    'quest',
    'mission',
    'interview',
    'gd',
    'group_discussion',
    'attention_game',
    'project',
    'study_session',
    'exam',
    'milestone',
    'general',
    'quiz',
    'lesson',
    'challenge',
  ]),
});

export const MissionSubmitSchema = z.object({
  missionId: z.string().min(1),
  response: z.string().max(5000).optional(),
  textSubmission: z.string().max(5000).optional(),
  proofType: z.string().optional(),
  proofText: z.string().optional(),
}).passthrough();

export const GrievanceSubmitSchema = z.object({
  category: z.string().min(1).max(100),
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(2000),
  anonymous: z.boolean().optional().default(false),
});

export const PinSpendSchema = z.object({
  amount: z.number().int().min(1).max(10000),
  reason: z.string().min(1).max(200),
  itemId: z.string().optional(),
});

export const FinancePaySchema = z.object({
  installmentId: z.string().min(1),
});

export type XpAddInput = z.infer<typeof XpAddSchema>;
export type MissionSubmitInput = z.infer<typeof MissionSubmitSchema>;
export type GrievanceSubmitInput = z.infer<typeof GrievanceSubmitSchema>;
export type PinSpendInput = z.infer<typeof PinSpendSchema>;
export type FinancePayInput = z.infer<typeof FinancePaySchema>;
