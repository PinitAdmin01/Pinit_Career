// apps/web/src/lib/api/pathwayApi.ts
// Client Data Access Layer & Supabase Service for Competency Mastery & Program Progression

import { supabase } from '../supabaseClient';
import { COMPETENCY_CATALOG_V1 } from '../pathway/competencyCatalog';
import {
  CompetencyEvidenceRecord,
  CompetencyMasteryStatus,
  DailyMissionSlot,
  DynamicRoleReadiness,
  InternshipRecord,
  StudentSkillProfile,
  WorkloadBand,
} from '../pathway/competencySchema';
import {
  generateEvidenceIntegrityHash,
  verifyEvidenceIntegrity,
} from '../pathway/evidenceEngine';
import {
  evaluateCompetencyMastery,
  MASTERY_POLICY_VERSION,
} from '../pathway/masteryEngine';
import {
  calculateDynamicRoleReadiness,
  CAREER_PROGRAMS_CATALOG,
  evaluateProgramGraduation,
  evaluateStageProgression,
  GraduationEvaluationResult,
  StageProgressionResult,
} from '../pathway/programEngine';

const LOCAL_MASTERY_KEY_PREFIX = 'pinit_mastery_';
const LOCAL_EVIDENCE_KEY_PREFIX = 'pinit_evidence_';

export class PathwayApiService {
  /**
   * Records a qualified learning activity into the Evidence Ledger and recalculates mastery.
   */
  static async recordEvidence(rawEvidence: Omit<CompetencyEvidenceRecord, 'integrityHash'>): Promise<{
    success: boolean;
    evidenceRecord: CompetencyEvidenceRecord;
    updatedMastery: CompetencyMasteryStatus;
  }> {
    // 1. Generate canonical SHA-256 integrity hash
    const integrityHash = generateEvidenceIntegrityHash(rawEvidence);
    const evidenceRecord: CompetencyEvidenceRecord = {
      ...rawEvidence,
      integrityHash,
    };

    // 2. Verify hash validity
    if (!verifyEvidenceIntegrity(evidenceRecord)) {
      throw new Error('Integrity verification failed for evidence record');
    }

    // 3. Save to local storage cache / Supabase
    const studentId = evidenceRecord.studentId;
    const competencyId = evidenceRecord.competencyId;

    const existingEvidence = this.getLocalEvidenceRecords(studentId, competencyId);
    existingEvidence.push(evidenceRecord);
    this.saveLocalEvidenceRecords(studentId, competencyId, existingEvidence);

    // 4. Resolve competency definition and prerequisite states
    const compDef = COMPETENCY_CATALOG_V1.find(c => c.id === competencyId);
    if (!compDef) {
      throw new Error(`Competency definition not found: ${competencyId}`);
    }

    const currentMasteryMap = await this.getStudentMasteryMap(studentId);
    const prereqStates: Record<string, any> = {};
    for (const prereqId of compDef.prerequisites) {
      prereqStates[prereqId] = currentMasteryMap.get(prereqId)?.state || 'locked';
    }

    // 5. Evaluate Mastery State Machine
    const updatedMastery = evaluateCompetencyMastery({
      competency: compDef,
      rawEvidenceRecords: existingEvidence,
      prerequisiteMasteryStates: prereqStates,
    });

    // 6. Update cached mastery status
    currentMasteryMap.set(competencyId, updatedMastery);
    this.saveLocalMasteryMap(studentId, currentMasteryMap);

    // 7. Fire-and-forget sync to Supabase if connected
    if (supabase) {
      try {
        await supabase.from('competency_evidence_records').upsert({
          id: evidenceRecord.id,
          student_id: studentId,
          competency_id: competencyId,
          competency_version: evidenceRecord.competencyVersion,
          program_id: evidenceRecord.programId,
          evidence_class: evidenceRecord.evidenceClass,
          difficulty: evidenceRecord.difficulty,
          evidence_family_id: evidenceRecord.evidenceFamilyId,
          source_type: evidenceRecord.sourceType,
          source_id: evidenceRecord.sourceId,
          attempt_id: evidenceRecord.attemptId,
          score: evidenceRecord.score,
          evaluator_type: evidenceRecord.evaluatorType,
          evaluator_version: evidenceRecord.evaluatorVersion,
          rubric_version: evidenceRecord.rubricVersion,
          timestamp: evidenceRecord.timestamp,
          integrity_hash: evidenceRecord.integrityHash,
          artifacts: evidenceRecord.artifacts || {},
          critical_failures_detected: evidenceRecord.criticalFailuresDetected || [],
        });

        await supabase.from('student_competency_mastery').upsert({
          student_id: studentId,
          competency_id: competencyId,
          competency_version: updatedMastery.competencyVersion,
          mastery_policy_version: updatedMastery.masteryPolicyVersion,
          state: updatedMastery.state,
          composite_score: updatedMastery.compositeScore,
          evidence_coverage_pct: updatedMastery.evidenceCoveragePct,
          independent_evidence_count: updatedMastery.independentEvidenceCount,
          distinct_family_count: updatedMastery.distinctFamilyCount,
          latest_qualified_evidence_at: updatedMastery.latestQualifiedEvidenceAt,
          next_review_at: updatedMastery.nextReviewAt,
          class_breakdown: updatedMastery.classBreakdown,
          all_gates_passed: updatedMastery.allGatesPassed,
          has_critical_failures: updatedMastery.hasCriticalFailures,
          blocked_by: updatedMastery.blockedBy || [],
          last_updated: updatedMastery.lastUpdated,
        });
      } catch (err) {
        console.warn('Supabase sync background notice:', err);
      }
    }

    return {
      success: true,
      evidenceRecord,
      updatedMastery,
    };
  }

  /**
   * Retrieves the full student mastery map.
   */
  static async getStudentMasteryMap(studentId: string): Promise<Map<string, CompetencyMasteryStatus>> {
    const local = this.getLocalMasteryMap(studentId);
    if (local.size > 0) return local;

    // Default: initialize empty mastery status map for catalog
    const freshMap = new Map<string, CompetencyMasteryStatus>();
    for (const comp of COMPETENCY_CATALOG_V1) {
      freshMap.set(comp.id, {
        competencyId: comp.id,
        competencyVersion: comp.version,
        masteryPolicyVersion: MASTERY_POLICY_VERSION,
        state: comp.prerequisites.length === 0 ? 'learning' : 'locked',
        compositeScore: 0,
        evidenceCoveragePct: 0,
        independentEvidenceCount: 0,
        distinctFamilyCount: 0,
        latestQualifiedEvidenceAt: 0,
        classBreakdown: {
          knowledge: { averageScore: 0, evidenceCount: 0, highestDifficulty: 'basic', gateSatisfied: false },
          application: { averageScore: 0, evidenceCount: 0, highestDifficulty: 'basic', gateSatisfied: false },
          debugging: { averageScore: 0, evidenceCount: 0, highestDifficulty: 'basic', gateSatisfied: false },
          architecture: { averageScore: 0, evidenceCount: 0, highestDifficulty: 'basic', gateSatisfied: false },
          production: { averageScore: 0, evidenceCount: 0, highestDifficulty: 'basic', gateSatisfied: false },
          defense: { averageScore: 0, evidenceCount: 0, highestDifficulty: 'basic', gateSatisfied: false },
        },
        allGatesPassed: false,
        hasCriticalFailures: false,
        lastUpdated: Date.now(),
      });
    }

    this.saveLocalMasteryMap(studentId, freshMap);
    return freshMap;
  }

  /**
   * Evaluates stage progression for a student's active semester.
   */
  static async evaluateStage(
    studentId: string,
    programId: string,
    stageIndex: number
  ): Promise<StageProgressionResult> {
    const program = CAREER_PROGRAMS_CATALOG.find(p => p.id === programId) || CAREER_PROGRAMS_CATALOG[0];
    const currentStage = program.stages[stageIndex] || program.stages[0];
    const nextStage = program.stages[stageIndex + 1];
    const masteryMap = await this.getStudentMasteryMap(studentId);

    return evaluateStageProgression(currentStage, nextStage, masteryMap);
  }

  /**
   * Evaluates program graduation status.
   */
  static async evaluateGraduation(
    studentId: string,
    programId: string,
    capstonePassed: boolean = false,
    residencyCompleted: boolean = false
  ): Promise<GraduationEvaluationResult> {
    const program = CAREER_PROGRAMS_CATALOG.find(p => p.id === programId) || CAREER_PROGRAMS_CATALOG[0];
    const masteryMap = await this.getStudentMasteryMap(studentId);

    return evaluateProgramGraduation(program, masteryMap, capstonePassed, residencyCompleted);
  }

  /**
   * Retrieves all evidence records across all competencies for a given student.
   */
  static async getAllStudentEvidence(studentId: string): Promise<CompetencyEvidenceRecord[]> {
    const allEvidence: CompetencyEvidenceRecord[] = [];
    for (const comp of COMPETENCY_CATALOG_V1) {
      const records = this.getLocalEvidenceRecords(studentId, comp.id);
      allEvidence.push(...records);
    }
    return allEvidence;
  }

  /**
   * Computes live, defensible role readiness strictly from real student mastery and evidence.
   * ZERO hardcoded/mock data.
   */
  static async getRoleReadiness(
    studentId: string,
    programId = 'prog_swe_accelerated_9m'
  ): Promise<DynamicRoleReadiness> {
    const program = CAREER_PROGRAMS_CATALOG.find(p => p.id === programId) || CAREER_PROGRAMS_CATALOG[0];
    const masteryMap = await this.getStudentMasteryMap(studentId);
    const evidenceRecords = await this.getAllStudentEvidence(studentId);

    return calculateDynamicRoleReadiness(program, masteryMap, evidenceRecords);
  }

  /**
   * Returns a transparent 3-tier skill profile for a student:
   * 1. Claimed (self-reported / catalog)
   * 2. Demonstrated (evidence recorded, awaiting final verification gate)
   * 3. Verified (all multi-class evidence and defense gates passed)
   */
  static async getStudentSkillProfile(studentId: string): Promise<StudentSkillProfile> {
    const masteryMap = await this.getStudentMasteryMap(studentId);
    const profile: StudentSkillProfile = {
      claimed: [],
      demonstrated: [],
      verified: [],
    };

    for (const comp of COMPETENCY_CATALOG_V1) {
      const status = masteryMap.get(comp.id);
      const state = status?.state || 'locked';
      const score = status?.compositeScore || 0;

      if (state === 'verified' || state === 'verified_needs_review') {
        profile.verified.push({
          id: comp.id,
          name: comp.title,
          score,
          level: comp.level,
          verifiedAt: status?.latestQualifiedEvidenceAt || Date.now(),
          credentialId: `cred_${comp.id}_${studentId}`,
        });
      } else if (state === 'demonstrated' || state === 'provisional' || state === 'practice') {
        profile.demonstrated.push({
          id: comp.id,
          name: comp.title,
          score,
          level: comp.level,
        });
      } else {
        profile.claimed.push({
          id: comp.id,
          name: comp.title,
          category: comp.domain,
        });
      }
    }

    return profile;
  }

  /**
   * Generates dynamic daily mission workload slots for the student.
   * 3 Core Slots (driven by active competency gaps) + 0–2 Optional Slots (Career, Communication).
   * In exam_pause mode, generates 1 maintenance task.
   */
  static async getDynamicDailyMissions(
    studentId: string,
    workloadBand: WorkloadBand = 'standard'
  ): Promise<{
    coreMissions: DailyMissionSlot[];
    optionalMissions: DailyMissionSlot[];
    totalTargetHours: number;
  }> {
    const masteryMap = await this.getStudentMasteryMap(studentId);
    
    // Find highest priority active competency needing work
    const activeComp = COMPETENCY_CATALOG_V1.find(c => {
      const state = masteryMap.get(c.id)?.state;
      return state === 'learning' || state === 'practice' || state === 'provisional';
    }) || COMPETENCY_CATALOG_V1[0];

    const coreMissions: DailyMissionSlot[] = [];
    const optionalMissions: DailyMissionSlot[] = [];

    if (workloadBand === 'exam_pause') {
      coreMissions.push({
        id: `mission_exam_maint_${activeComp.id}`,
        slotType: 'core',
        category: 'practice',
        title: `Exam Maintenance: ${activeComp.title.split(':')[0]}`,
        desc: '1 quick 10-minute concept review to preserve your FSRS recall and streak during exams.',
        estDurationMinutes: 15,
        competencyId: activeComp.id,
        xpReward: 25,
        isCompleted: false,
      });
      return { coreMissions, optionalMissions, totalTargetHours: 0.25 };
    }

    // Core Slot 1: Learn / Curriculum Deep Dive
    coreMissions.push({
      id: `mission_core_learn_${activeComp.id}`,
      slotType: 'core',
      category: 'learn',
      title: `Curriculum Deep Dive: ${activeComp.title}`,
      desc: activeComp.description,
      estDurationMinutes: 45,
      competencyId: activeComp.id,
      xpReward: 50,
      isCompleted: false,
    });

    // Core Slot 2: Practice / Coding Exercise
    coreMissions.push({
      id: `mission_core_practice_${activeComp.id}`,
      slotType: 'core',
      category: 'practice',
      title: `Interactive Code Mastery: 5 Practice Challenges`,
      desc: 'Solve 5 targeted exercises to satisfy the application gate for this competency.',
      estDurationMinutes: 45,
      competencyId: activeComp.id,
      xpReward: 50,
      isCompleted: false,
    });

    // Core Slot 3: Build / Micro Implementation
    coreMissions.push({
      id: `mission_core_build_${activeComp.id}`,
      slotType: 'core',
      category: 'build',
      title: `Production Implementation & PR Check`,
      desc: 'Implement starter module or fix bug lab to generate cryptographic evidence.',
      estDurationMinutes: 60,
      competencyId: activeComp.id,
      xpReward: 75,
      isCompleted: false,
    });

    if (workloadBand === 'standard' || workloadBand === 'catch_up') {
      // Optional Slot 1: Career Polish
      optionalMissions.push({
        id: `mission_opt_career_${studentId}`,
        slotType: 'optional',
        category: 'career',
        title: `AI Resume Polish & ATS Check`,
        desc: 'Match your verified skills against target software engineering job descriptions.',
        estDurationMinutes: 20,
        xpReward: 30,
        isCompleted: false,
      });

      // Optional Slot 2: Communication Pitch
      optionalMissions.push({
        id: `mission_opt_comm_${studentId}`,
        slotType: 'optional',
        category: 'communication',
        title: `2-Minute STAR Technical Explanation`,
        desc: 'Record a 2-minute architectural pitch to earn STAR communication defense points.',
        estDurationMinutes: 15,
        competencyId: 'comp_comm_star_interview_l2',
        xpReward: 30,
        isCompleted: false,
      });
    }

    const totalTargetHours = workloadBand === 'light' ? 2.5 : 3.5;
    return { coreMissions, optionalMissions, totalTargetHours };
  }

  /**
   * Logs a verified external internship record for a student.
   */
  static async logInternshipRecord(
    record: Omit<InternshipRecord, 'id' | 'createdAt'>
  ): Promise<InternshipRecord> {
    const fullRecord: InternshipRecord = {
      ...record,
      id: `intern_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      createdAt: Date.now(),
    };

    const studentId = record.studentId;
    const existing = this.getLocalInternshipRecords(studentId);
    existing.push(fullRecord);
    this.saveLocalInternshipRecords(studentId, existing);

    return fullRecord;
  }

  /**
   * Retrieves all logged external internship records for a student.
   */
  static async getInternshipRecords(studentId: string): Promise<InternshipRecord[]> {
    return this.getLocalInternshipRecords(studentId);
  }

  // ── Storage Cache Helper Methods ──────────────────────────────────────────
  private static inMemoryMastery = new Map<string, Map<string, CompetencyMasteryStatus>>();
  private static inMemoryEvidence = new Map<string, CompetencyEvidenceRecord[]>();
  private static inMemoryInternships = new Map<string, InternshipRecord[]>();

  private static getLocalEvidenceRecords(studentId: string, competencyId: string): CompetencyEvidenceRecord[] {
    const memKey = `${studentId}_${competencyId}`;
    if (this.inMemoryEvidence.has(memKey)) {
      return this.inMemoryEvidence.get(memKey)!;
    }

    if (typeof window !== 'undefined') {
      try {
        const data = localStorage.getItem(`${LOCAL_EVIDENCE_KEY_PREFIX}${memKey}`);
        const parsed = data ? JSON.parse(data) : [];
        this.inMemoryEvidence.set(memKey, parsed);
        return parsed;
      } catch {
        return [];
      }
    }
    return [];
  }

  private static saveLocalEvidenceRecords(studentId: string, competencyId: string, records: CompetencyEvidenceRecord[]) {
    const memKey = `${studentId}_${competencyId}`;
    this.inMemoryEvidence.set(memKey, records);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`${LOCAL_EVIDENCE_KEY_PREFIX}${memKey}`, JSON.stringify(records));
      } catch (err) {
        console.warn('Local evidence save warning:', err);
      }
    }
  }

  private static getLocalMasteryMap(studentId: string): Map<string, CompetencyMasteryStatus> {
    if (this.inMemoryMastery.has(studentId)) {
      return this.inMemoryMastery.get(studentId)!;
    }

    if (typeof window !== 'undefined') {
      try {
        const data = localStorage.getItem(`${LOCAL_MASTERY_KEY_PREFIX}${studentId}`);
        if (data) {
          const obj = JSON.parse(data);
          const map = new Map(Object.entries(obj)) as Map<string, CompetencyMasteryStatus>;
          this.inMemoryMastery.set(studentId, map);
          return map;
        }
      } catch {
        return new Map();
      }
    }
    return new Map();
  }

  private static saveLocalMasteryMap(studentId: string, map: Map<string, CompetencyMasteryStatus>) {
    this.inMemoryMastery.set(studentId, map);

    if (typeof window !== 'undefined') {
      try {
        const obj = Object.fromEntries(map.entries());
        localStorage.setItem(`${LOCAL_MASTERY_KEY_PREFIX}${studentId}`, JSON.stringify(obj));
      } catch (err) {
        console.warn('Local mastery save warning:', err);
      }
    }
  }

  private static getLocalInternshipRecords(studentId: string): InternshipRecord[] {
    if (this.inMemoryInternships.has(studentId)) {
      return this.inMemoryInternships.get(studentId)!;
    }

    if (typeof window !== 'undefined') {
      try {
        const data = localStorage.getItem(`pinit_internships_${studentId}`);
        const parsed = data ? JSON.parse(data) : [];
        this.inMemoryInternships.set(studentId, parsed);
        return parsed;
      } catch {
        return [];
      }
    }
    return [];
  }

  private static saveLocalInternshipRecords(studentId: string, records: InternshipRecord[]) {
    this.inMemoryInternships.set(studentId, records);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`pinit_internships_${studentId}`, JSON.stringify(records));
      } catch (err) {
        console.warn('Local internship save warning:', err);
      }
    }
  }
}
