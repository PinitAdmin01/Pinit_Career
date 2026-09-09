// src/lib/curriculum/validator.ts
// Strict Runtime Validation Engine for Curriculum Hierarchy and Competencies

import {
  Course,
  Phase,
  Month,
  Week,
  ThreeDayPacketMeta,
  Day,
  Competency,
  DayNumber,
} from './types';

export class CurriculumValidationError extends Error {
  constructor(message: string, public readonly code: string, public readonly details?: any) {
    super(`[CurriculumValidationError:${code}] ${message}`);
    this.name = 'CurriculumValidationError';
  }
}

export class CurriculumValidator {
  /**
   * Validates Phase integrity within a Course.
   */
  static validatePhases(course: Course, phases: Phase[]): void {
    if (!course.id) throw new CurriculumValidationError('Course must have a valid id', 'INVALID_COURSE_ID');
    
    const seenPhaseNumbers = new Set<number>();
    const seenPhaseIds = new Set<string>();

    for (const phase of phases) {
      if (phase.courseId !== course.id) {
        throw new CurriculumValidationError(
          `Phase ${phase.id} has invalid courseId '${phase.courseId}'. Expected '${course.id}'`,
          'PHASE_COURSE_MISMATCH'
        );
      }
      if (seenPhaseNumbers.has(phase.phaseNumber)) {
        throw new CurriculumValidationError(
          `Duplicate phaseNumber ${phase.phaseNumber} detected in course ${course.id}`,
          'DUPLICATE_PHASE_NUMBER'
        );
      }
      seenPhaseNumbers.add(phase.phaseNumber);

      if (seenPhaseIds.has(phase.id)) {
        throw new CurriculumValidationError(`Duplicate phaseId '${phase.id}'`, 'DUPLICATE_PHASE_ID');
      }
      seenPhaseIds.add(phase.id);

      if (phase.phaseNumber < 1 || phase.phaseNumber > 12) {
        throw new CurriculumValidationError(
          `Phase number must be between 1 and 12. Received ${phase.phaseNumber}`,
          'INVALID_PHASE_NUMBER'
        );
      }

      if (phase.startMonth > phase.endMonth || phase.startMonth < 1 || phase.endMonth > 36) {
        throw new CurriculumValidationError(
          `Phase ${phase.phaseNumber} has invalid month span: ${phase.startMonth}-${phase.endMonth}`,
          'INVALID_PHASE_MONTH_SPAN'
        );
      }
    }
  }

  /**
   * Validates Month relationship to Phases.
   */
  static validateMonths(phases: Phase[], months: Month[]): void {
    const phaseMap = new Map<string, Phase>(phases.map(p => [p.id, p]));
    const seenMonthNumbers = new Set<number>();

    for (const month of months) {
      const parentPhase = phaseMap.get(month.phaseId);
      if (!parentPhase) {
        throw new CurriculumValidationError(
          `Month ${month.monthNumber} references non-existent phaseId '${month.phaseId}'`,
          'ORPHAN_MONTH'
        );
      }

      if (seenMonthNumbers.has(month.monthNumber)) {
        throw new CurriculumValidationError(
          `Duplicate monthNumber ${month.monthNumber} detected`,
          'DUPLICATE_MONTH_NUMBER'
        );
      }
      seenMonthNumbers.add(month.monthNumber);

      if (month.monthNumber < parentPhase.startMonth || month.monthNumber > parentPhase.endMonth) {
        throw new CurriculumValidationError(
          `Month ${month.monthNumber} outside parent Phase ${parentPhase.phaseNumber} range (${parentPhase.startMonth}-${parentPhase.endMonth})`,
          'MONTH_PHASE_SPAN_MISMATCH'
        );
      }
    }
  }

  /**
   * Validates ThreeDayPacket integrity and enforces strict hierarchical code matching.
   * Format: P<phaseNum>-M<monthNum>-W<weekNum>-PKT<digits>
   */
  static validatePacket(
    packet: ThreeDayPacketMeta,
    context?: { phaseNumber: number; monthNumber: number; weekNumber: number },
    existingPackets: ThreeDayPacketMeta[] = []
  ): void {
    if (!packet.id) throw new CurriculumValidationError('Packet must have a valid id', 'INVALID_PACKET_ID');
    
    // 1. Format check
    const match = (packet.packetCode || '').match(/^P(\d+)-M(\d+)-W(\d+)-PKT(\d+)$/i);
    if (!match) {
      throw new CurriculumValidationError(
        `Invalid packetCode format '${packet.packetCode}'. Expected hierarchical format e.g. 'P1-M1-W1-PKT001'`,
        'INVALID_PACKET_CODE_FORMAT'
      );
    }

    // 2. Hierarchy validation against parent Phase/Month/Week context if supplied
    if (context) {
      const codePhase = parseInt(match[1], 10);
      const codeMonth = parseInt(match[2], 10);
      const codeWeek = parseInt(match[3], 10);

      if (codePhase !== context.phaseNumber) {
        throw new CurriculumValidationError(
          `Packet code '${packet.packetCode}' indicates Phase ${codePhase}, but parent week is in Phase ${context.phaseNumber}`,
          'PACKET_HIERARCHY_PHASE_MISMATCH'
        );
      }
      if (codeMonth !== context.monthNumber) {
        throw new CurriculumValidationError(
          `Packet code '${packet.packetCode}' indicates Month ${codeMonth}, but parent week is in Month ${context.monthNumber}`,
          'PACKET_HIERARCHY_MONTH_MISMATCH'
        );
      }
      if (codeWeek !== context.weekNumber) {
        throw new CurriculumValidationError(
          `Packet code '${packet.packetCode}' indicates Week ${codeWeek}, but parent week is Week ${context.weekNumber}`,
          'PACKET_HIERARCHY_WEEK_MISMATCH'
        );
      }
    }

    if (!packet.primaryCompetencyId) {
      throw new CurriculumValidationError(
        `Packet '${packet.packetCode}' must specify a primaryCompetencyId`,
        'MISSING_PRIMARY_COMPETENCY'
      );
    }

    // 3. Check for duplicate packetCode
    for (const existing of existingPackets) {
      if (existing.id !== packet.id && existing.packetCode.toUpperCase() === packet.packetCode.toUpperCase()) {
        throw new CurriculumValidationError(
          `Duplicate packetCode detected: '${packet.packetCode}' already exists in packet ${existing.id}`,
          'DUPLICATE_PACKET_CODE'
        );
      }
    }
  }

  /**
   * Validates Days inside a ThreeDayPacket.
   * STRICT CONTRACT: A standard packet must contain EXACTLY 3 days: Day 1, Day 2, Day 3.
   * < 3 -> FAIL, > 3 -> FAIL, {1,2,3} -> PASS
   */
  static validateDays(packet: ThreeDayPacketMeta, days: Day[]): void {
    if (!days || days.length === 0) {
      throw new CurriculumValidationError(
        `Packet '${packet.packetCode}' contains no days. Exactly 3 days (1, 2, 3) required.`,
        'EMPTY_PACKET_DAYS'
      );
    }

    if (days.length < 3) {
      throw new CurriculumValidationError(
        `Packet '${packet.packetCode}' contains only ${days.length} day(s). Exactly 3 days (1, 2, 3) required.`,
        'INSUFFICIENT_PACKET_DAYS'
      );
    }

    if (days.length > 3) {
      throw new CurriculumValidationError(
        `Packet '${packet.packetCode}' contains ${days.length} days. Maximum of 3 days allowed per standard packet.`,
        'EXCESS_PACKET_DAYS'
      );
    }

    const seenDayNumbers = new Set<DayNumber>();

    for (const day of days) {
      if (day.packetId !== packet.id) {
        throw new CurriculumValidationError(
          `Day ${day.id} has mismatched packetId '${day.packetId}'. Expected '${packet.id}'`,
          'DAY_PACKET_MISMATCH'
        );
      }

      if (![1, 2, 3].includes(day.dayNumber)) {
        throw new CurriculumValidationError(
          `Invalid dayNumber ${day.dayNumber} in day ${day.id}. Must be strictly 1, 2, or 3.`,
          'INVALID_DAY_NUMBER'
        );
      }

      if (seenDayNumbers.has(day.dayNumber)) {
        throw new CurriculumValidationError(
          `Duplicate dayNumber ${day.dayNumber} detected in packet '${packet.packetCode}'`,
          'DUPLICATE_DAY_NUMBER'
        );
      }
      seenDayNumbers.add(day.dayNumber);

      if (!day.title || !day.objectives || day.objectives.length === 0) {
        throw new CurriculumValidationError(
          `Day ${day.dayNumber} in packet '${packet.packetCode}' must have a title and at least one objective`,
          'INCOMPLETE_DAY_SPEC'
        );
      }
    }

    // Verify exact set equality: {1, 2, 3}
    if (!seenDayNumbers.has(1) || !seenDayNumbers.has(2) || !seenDayNumbers.has(3)) {
      throw new CurriculumValidationError(
        `Packet '${packet.packetCode}' must contain days with dayNumbers [1, 2, 3]. Found: [${Array.from(seenDayNumbers).join(', ')}]`,
        'MISSING_MANDATORY_DAYS'
      );
    }
  }

  /**
   * Validates a Competency definition and checks level descriptions.
   */
  static validateCompetency(comp: Competency): void {
    if (!comp.id) throw new CurriculumValidationError('Competency must have an id', 'INVALID_COMPETENCY_ID');
    if (!comp.code || !/^COMP-[A-Z0-9]+-\d+$/i.test(comp.code)) {
      throw new CurriculumValidationError(
        `Invalid competency code format '${comp.code}'. Expected e.g. 'COMP-P1-001'`,
        'INVALID_COMPETENCY_CODE'
      );
    }
    if (!comp.levelDefinitions) {
      throw new CurriculumValidationError(
        `Competency '${comp.code}' is missing levelDefinitions`,
        'MISSING_LEVEL_DEFINITIONS'
      );
    }
    const { developingCriteria, demonstratedCriteria, proficientCriteria, masteredCriteria } = comp.levelDefinitions;
    if (!developingCriteria || !demonstratedCriteria || !proficientCriteria || !masteredCriteria) {
      throw new CurriculumValidationError(
        `Competency '${comp.code}' must define all 4 criteria levels (developing, demonstrated, proficient, mastered)`,
        'INCOMPLETE_LEVEL_CRITERIA'
      );
    }
  }

  /**
   * Detects circular prerequisite dependencies in a graph of competencies.
   * e.g., A -> B -> C -> A will be detected and rejected.
   */
  static detectCircularCompetencyPrerequisites(competencies: Competency[]): void {
    const adjList = new Map<string, string[]>();
    for (const comp of competencies) {
      adjList.set(comp.id, comp.prerequisites || []);
    }

    const visited = new Set<string>();
    const recStack = new Set<string>();

    const dfs = (currId: string, path: string[]): void => {
      visited.add(currId);
      recStack.add(currId);

      const neighbors = adjList.get(currId) || [];
      for (const neighborId of neighbors) {
        if (!visited.has(neighborId)) {
          dfs(neighborId, [...path, neighborId]);
        } else if (recStack.has(neighborId)) {
          const cycle = [...path, neighborId].join(' -> ');
          throw new CurriculumValidationError(
            `Circular competency prerequisite dependency detected: ${cycle}`,
            'CIRCULAR_COMPETENCY_PREREQUISITE',
            { cycle }
          );
        }
      }

      recStack.delete(currId);
    };

    for (const comp of competencies) {
      if (!visited.has(comp.id)) {
        dfs(comp.id, [comp.id]);
      }
    }
  }
}
