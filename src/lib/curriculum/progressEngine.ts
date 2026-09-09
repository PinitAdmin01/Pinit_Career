// src/lib/curriculum/progressEngine.ts
// Programmatic Progress Model & Metric Engine for PinIT Curriculum Architecture
// Derives all curriculum day counts, milestones, and completion percentages dynamically from the canonical curriculum spine.

import { PYTHON_FULLSTACK_COURSE, PYTHON_FULLSTACK_PHASES, PYTHON_FULLSTACK_MONTHS } from './pythonFullStack/curriculumSpine';
import { BatchContentManifest } from './contentTypes';
import { CANONICAL_DAY_INVENTORY } from './dayInventory';

export const DAYS_PER_WEEK = 5;
export const WEEKS_PER_MONTH = 4;
export const LEARNING_DAYS_PER_MONTH = DAYS_PER_WEEK * WEEKS_PER_MONTH; // 20 days per month

export interface CurriculumProgressReport {
  publishedBatchesCount: number;
  publishedLearningDaysCount: number;
  
  // Milestone 1: 6-Month Foundation Exit (Phases 1–2: Months 1–6)
  semester1PlannedDays: number;
  semester1ProgressPercent: number;

  // Milestone 2: 12-Month Professional Certificate Exit (Phases 1–4: Months 1–12)
  year1PlannedDays: number;
  year1ProgressPercent: number;

  // Milestone 3: 24-Month Professional Advanced Exit (Phases 1–8: Months 1–24)
  totalPlannedDays: number;
  totalProgramProgressPercent: number;

  status: 'IN_PROGRESS' | 'YEAR_1_CERTIFIED' | 'PROGRAM_COMPLETED';
}

export class ProgressEngine {
  /**
   * Calculates the canonical planned learning days for a given number of months.
   */
  public static getPlannedDaysForMonths(monthsCount: number): number {
    return monthsCount * LEARNING_DAYS_PER_MONTH;
  }

  /**
   * Returns the canonical planned learning days for Year 1 (Months 1–12).
   */
  public static getPlannedYear1LearningDays(): number {
    const year1Months = PYTHON_FULLSTACK_MONTHS.filter(m => m.monthNumber <= 12).length;
    return year1Months * LEARNING_DAYS_PER_MONTH; // 12 * 20 = 240
  }

  /**
   * Returns the canonical planned learning days for Semester 1 / Foundations (Months 1–6).
   */
  public static getPlannedSemester1LearningDays(): number {
    const sem1Months = PYTHON_FULLSTACK_MONTHS.filter(m => m.monthNumber <= 6).length;
    return sem1Months * LEARNING_DAYS_PER_MONTH; // 6 * 20 = 120
  }

  /**
   * Returns the canonical total planned learning days for the 24-Month program.
   */
  public static getTotalPlannedProgramLearningDays(): number {
    return PYTHON_FULLSTACK_MONTHS.length * LEARNING_DAYS_PER_MONTH; // 24 * 20 = 480
  }

  /**
   * Computes a full dynamic progress report based on active published batch manifests.
   */
  public static computeProgress(publishedBatches: Array<BatchContentManifest | import('./contentTypes').ConsolidationBlockManifest>): CurriculumProgressReport {
    const publishedBatchesCount = publishedBatches.length;
    const publishedLearningDaysCount = publishedBatches.reduce((total, batch) => total + batch.days.length, 0);

    const sem1Planned = this.getPlannedSemester1LearningDays();
    const year1Planned = this.getPlannedYear1LearningDays();
    const totalPlanned = this.getTotalPlannedProgramLearningDays();

    const sem1Percent = sem1Planned > 0 ? Math.min(100, Math.round((publishedLearningDaysCount / sem1Planned) * 10000) / 100) : 0;
    const year1Percent = year1Planned > 0 ? Math.min(100, Math.round((publishedLearningDaysCount / year1Planned) * 10000) / 100) : 0;
    const totalPercent = totalPlanned > 0 ? Math.min(100, Math.round((publishedLearningDaysCount / totalPlanned) * 10000) / 100) : 0;

    let status: 'IN_PROGRESS' | 'YEAR_1_CERTIFIED' | 'PROGRAM_COMPLETED' = 'IN_PROGRESS';
    if (publishedLearningDaysCount >= totalPlanned) {
      status = 'PROGRAM_COMPLETED';
    } else if (publishedLearningDaysCount >= year1Planned) {
      status = 'YEAR_1_CERTIFIED';
    }

    return {
      publishedBatchesCount,
      publishedLearningDaysCount,
      semester1PlannedDays: sem1Planned,
      semester1ProgressPercent: sem1Percent,
      year1PlannedDays: year1Planned,
      year1ProgressPercent: year1Percent,
      totalPlannedDays: totalPlanned,
      totalProgramProgressPercent: totalPercent,
      status,
    };
  }

  /**
   * Computes curriculum progress against the canonical day inventory (Days 1..125).
   */
  public static computeCanonicalInventoryReport(): {
    totalPublishedDays: number;
    semester1PublishedDays: number;
    semester1CoreInstructionalDays: number;
    semester1CorePercent: number;
    consolidationDays: number;
    semester2PublishedDays: number;
    programProgressPercent: number;
  } {
    const totalPublishedDays = CANONICAL_DAY_INVENTORY.length;
    const sem1Entries = CANONICAL_DAY_INVENTORY.filter(e => e.semester === 1);
    const sem1CoreEntries = sem1Entries.filter(e => e.dayType === 'CORE_INSTRUCTION' || e.dayType === 'GATE_ASSESSMENT');
    const consolidationEntries = sem1Entries.filter(e => e.dayType === 'CONSOLIDATION');
    const sem2Entries = CANONICAL_DAY_INVENTORY.filter(e => e.semester === 2);
    const totalPlanned = this.getTotalPlannedProgramLearningDays();

    return {
      totalPublishedDays,
      semester1PublishedDays: sem1Entries.length,
      semester1CoreInstructionalDays: sem1CoreEntries.length,
      semester1CorePercent: Math.round((sem1CoreEntries.length / 120) * 10000) / 100,
      consolidationDays: consolidationEntries.length,
      semester2PublishedDays: sem2Entries.length,
      programProgressPercent: Math.round((totalPublishedDays / totalPlanned) * 10000) / 100,
    };
  }
}
