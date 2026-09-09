// src/lib/curriculum/registry.ts
// Authoritative Registry and Lookup Service for PinIT Curriculum & Competencies

import {
  Course,
  Phase,
  Month,
  Week,
  ThreeDayPacketMeta,
  Day,
  Competency,
} from './types';
import { CurriculumValidator, CurriculumValidationError } from './validator';
import {
  PYTHON_FULLSTACK_COURSE,
  PYTHON_FULLSTACK_PHASES,
  PYTHON_FULLSTACK_MONTHS,
} from './pythonFullStack/curriculumSpine';

class CurriculumRegistry {
  private courses = new Map<string, Course>();
  private phases = new Map<string, Phase>();
  private months = new Map<string, Month>();
  private weeks = new Map<string, Week>();
  private packets = new Map<string, ThreeDayPacketMeta>();
  private packetsByCode = new Map<string, ThreeDayPacketMeta>();
  private days = new Map<string, Day[]>(); // packetId -> Day[]
  private competencies = new Map<string, Competency>();

  constructor() {
    // Register the Flagship 36-Month Python Full-Stack Curriculum Spine
    this.registerCourse(PYTHON_FULLSTACK_COURSE);
    this.registerPhases(PYTHON_FULLSTACK_COURSE.id, PYTHON_FULLSTACK_PHASES);
    this.registerMonths(PYTHON_FULLSTACK_MONTHS);
  }

  public registerCourse(course: Course): void {
    if (this.courses.has(course.id)) {
      throw new CurriculumValidationError(`Course '${course.id}' is already registered`, 'COURSE_ALREADY_REGISTERED');
    }
    this.courses.set(course.id, course);
  }

  public getCourse(id: string): Course | undefined {
    return this.courses.get(id);
  }

  public getAllCourses(): Course[] {
    return Array.from(this.courses.values());
  }

  public registerPhases(courseId: string, phases: Phase[]): void {
    const course = this.courses.get(courseId);
    if (!course) {
      throw new CurriculumValidationError(`Cannot register phases: Course '${courseId}' not found`, 'COURSE_NOT_FOUND');
    }
    CurriculumValidator.validatePhases(course, phases);
    for (const phase of phases) {
      this.phases.set(phase.id, phase);
    }
  }

  public getPhasesForCourse(courseId: string): Phase[] {
    return Array.from(this.phases.values())
      .filter(p => p.courseId === courseId)
      .sort((a, b) => a.order - b.order);
  }

  public getPhase(phaseId: string): Phase | undefined {
    return this.phases.get(phaseId);
  }

  public registerMonths(months: Month[]): void {
    const phases = Array.from(this.phases.values());
    CurriculumValidator.validateMonths(phases, months);
    for (const month of months) {
      this.months.set(month.id, month);
    }
  }

  public getMonthsForPhase(phaseId: string): Month[] {
    return Array.from(this.months.values())
      .filter(m => m.phaseId === phaseId)
      .sort((a, b) => a.order - b.order);
  }

  public getMonth(monthId: string): Month | undefined {
    return this.months.get(monthId);
  }

  public registerWeek(week: Week): void {
    if (this.weeks.has(week.id)) {
      throw new CurriculumValidationError(`Week '${week.id}' already exists`, 'DUPLICATE_WEEK_ID');
    }
    const month = this.months.get(week.monthId);
    if (!month) {
      throw new CurriculumValidationError(`Week ${week.id} references unknown monthId '${week.monthId}'`, 'MONTH_NOT_FOUND');
    }
    this.weeks.set(week.id, week);
  }

  public getWeeksForMonth(monthId: string): Week[] {
    return Array.from(this.weeks.values())
      .filter(w => w.monthId === monthId)
      .sort((a, b) => a.order - b.order);
  }

  public registerPacket(packet: ThreeDayPacketMeta, days: Day[]): void {
    const parentWeek = this.weeks.get(packet.weekId);
    let hierarchyContext: { phaseNumber: number; monthNumber: number; weekNumber: number } | undefined = undefined;

    if (parentWeek) {
      const parentMonth = this.months.get(parentWeek.monthId);
      if (parentMonth) {
        const parentPhase = this.phases.get(parentMonth.phaseId);
        if (parentPhase) {
          hierarchyContext = {
            phaseNumber: parentPhase.phaseNumber,
            monthNumber: parentMonth.monthNumber,
            weekNumber: parentWeek.weekNumber,
          };
        }
      }
    }

    const existingPackets = Array.from(this.packets.values());
    CurriculumValidator.validatePacket(packet, hierarchyContext, existingPackets);
    CurriculumValidator.validateDays(packet, days);

    if (!this.competencies.has(packet.primaryCompetencyId)) {
      console.warn(`[CurriculumRegistry] Warning: Packet '${packet.packetCode}' references un-registered competency '${packet.primaryCompetencyId}'.`);
    }

    this.packets.set(packet.id, packet);
    this.packetsByCode.set(packet.packetCode.toUpperCase(), packet);
    this.days.set(packet.id, days);
  }

  public getPacket(id: string): ThreeDayPacketMeta | undefined {
    return this.packets.get(id);
  }

  public getPacketByCode(packetCode: string): ThreeDayPacketMeta | undefined {
    return this.packetsByCode.get(packetCode.toUpperCase());
  }

  public getDaysForPacket(packetId: string): Day[] {
    return this.days.get(packetId) || [];
  }

  public registerCompetency(competency: Competency): void {
    CurriculumValidator.validateCompetency(competency);
    if (this.competencies.has(competency.id)) {
      throw new CurriculumValidationError(`Competency '${competency.id}' already exists`, 'DUPLICATE_COMPETENCY_ID');
    }

    // Temporary list including candidate to test for circular dependency
    const allCandidateCompetencies = [...Array.from(this.competencies.values()), competency];
    CurriculumValidator.detectCircularCompetencyPrerequisites(allCandidateCompetencies);

    this.competencies.set(competency.id, competency);
  }

  public getCompetency(id: string): Competency | undefined {
    return this.competencies.get(id);
  }

  public getAllCompetencies(): Competency[] {
    return Array.from(this.competencies.values());
  }

  // Clear helper for testing isolation
  public _reset(): void {
    this.courses.clear();
    this.phases.clear();
    this.months.clear();
    this.weeks.clear();
    this.packets.clear();
    this.packetsByCode.clear();
    this.days.clear();
    this.competencies.clear();
  }
}

export const curriculumRegistry = new CurriculumRegistry();
