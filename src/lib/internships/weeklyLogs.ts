import { z } from 'zod';
import type { InternshipWeeklyLogRow, ClientInternshipWeeklyLog } from './types';

/**
 * §4 minimums for weekly logging:
 * - Tiers 3–4 (8 weeks × 30h): 240 total hours
 * - Tier 5 fellowship (16 weeks × 15h): 240 total hours (or 180 days / ~26 weeks)
 *
 * Weekly minimum varies by tier.
 */
export const WEEKLY_LOG_REQUIREMENTS: Record<string, { minWeeklyHours: number; totalWeeks: number; totalHours: number }> = {
  t3_project: { minWeeklyHours: 30, totalWeeks: 8, totalHours: 240 },
  t4_industry: { minWeeklyHours: 30, totalWeeks: 8, totalHours: 240 },
  t5_fellowship: { minWeeklyHours: 15, totalWeeks: 16, totalHours: 240 },
};

export const WeeklyLogSchema = z.object({
  week: z.number().int().min(1, 'Week must be at least 1').max(26, 'Week cannot exceed 26'),
  hours: z.number().min(0, 'Hours cannot be negative').max(80, 'Hours cannot exceed 80 per week'),
  summary: z.string().min(10, 'Summary must be at least 10 characters').max(2000, 'Summary too long'),
  links: z.array(z.string().url('Each link must be a valid URL')).default([]),
});

export type WeeklyLogInput = z.infer<typeof WeeklyLogSchema>;

/**
 * Converts a weekly log DB row to a client-safe object.
 */
export function weeklyLogToClient(
  row: InternshipWeeklyLogRow | Record<string, unknown>
): ClientInternshipWeeklyLog {
  const r = row as Record<string, unknown>;
  return {
    id: String(r.id || ''),
    internshipEnrollmentId: String(r.internship_enrollment_id || r.internshipEnrollmentId || ''),
    week: Number(r.week ?? 0),
    hours: Number(r.hours ?? 0),
    summary: String(r.summary || ''),
    links: Array.isArray(r.links) ? r.links.map(String) : [],
    createdAt: String(r.created_at || r.createdAt || ''),
  };
}

/**
 * Calculates weekly log progress against §4 requirements.
 */
export function calculateLogProgress(
  tier: string,
  logs: Array<{ week: number; hours: number }>
): {
  totalHours: number;
  totalWeeks: number;
  requiredHours: number;
  requiredWeeks: number;
  percentComplete: number;
  onTrack: boolean;
} {
  const reqs = WEEKLY_LOG_REQUIREMENTS[tier];
  if (!reqs) {
    return {
      totalHours: 0,
      totalWeeks: 0,
      requiredHours: 0,
      requiredWeeks: 0,
      percentComplete: 0,
      onTrack: false,
    };
  }

  const uniqueWeeks = new Set(logs.map((l) => l.week));
  const totalHours = logs.reduce((sum, l) => sum + l.hours, 0);
  const percentComplete = Math.min(100, Math.round((totalHours / reqs.totalHours) * 100));

  return {
    totalHours,
    totalWeeks: uniqueWeeks.size,
    requiredHours: reqs.totalHours,
    requiredWeeks: reqs.totalWeeks,
    percentComplete,
    onTrack: totalHours >= (uniqueWeeks.size * reqs.minWeeklyHours * 0.8),
  };
}
