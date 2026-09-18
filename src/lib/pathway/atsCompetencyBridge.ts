// apps/web/src/lib/pathway/atsCompetencyBridge.ts
// Bridges ATS Document Grounding & Fact Validation directly into the Competency DAG & Evidence Ledger

import { ValidatedCandidateGraph } from '../ats/factCheckValidator';
import {
  CompetencyEvidenceRecord,
  CompetencyMasteryStatus,
  DynamicRoleReadiness,
  EvidenceClass,
  EvidenceDifficulty,
} from './competencySchema';
import { generateEvidenceIntegrityHash } from './evidenceEngine';
import { evaluateCompetencyMastery } from './masteryEngine';
import {
  calculateDynamicRoleReadiness,
  CAREER_PROGRAMS_CATALOG,
} from './programEngine';
import { COMPETENCY_CATALOG_V1 } from './competencyCatalog';

export interface BridgeEvaluationResult {
  studentId: string;
  programId: string;
  targetRole: string;
  readinessPercentage: number;
  demonstratedCount: number;
  evidenceRecords: CompetencyEvidenceRecord[];
  masteryMap: Record<string, CompetencyMasteryStatus>;
  readiness: DynamicRoleReadiness;
  diagnosticGaps: {
    competencyId: string;
    title: string;
    currentScore: number;
    requiredScore: number;
    status: 'satisfied' | 'weak' | 'critical';
  }[];
}

// Canonical skill ontology mapping into Competency IDs
const SKILL_TO_COMPETENCY_MAP: Record<string, { competencyId: string; defaultDifficulty: EvidenceDifficulty }> = {
  // Programming Languages & OOP
  'Java': { competencyId: 'comp_java_syntax_oop_l1', defaultDifficulty: 'basic' },
  'OOP': { competencyId: 'comp_java_syntax_oop_l1', defaultDifficulty: 'basic' },
  'Spring': { competencyId: 'comp_java_syntax_oop_l1', defaultDifficulty: 'intermediate' },
  'SpringBoot': { competencyId: 'comp_java_syntax_oop_l1', defaultDifficulty: 'intermediate' },
  
  'Python': { competencyId: 'comp_python_syntax_data_l1', defaultDifficulty: 'basic' },
  'Django': { competencyId: 'comp_python_syntax_data_l1', defaultDifficulty: 'intermediate' },
  'Flask': { competencyId: 'comp_python_syntax_data_l1', defaultDifficulty: 'intermediate' },

  // Git & Workflow
  'Git': { competencyId: 'comp_git_version_control_l1', defaultDifficulty: 'basic' },
  'GitHub': { competencyId: 'comp_git_version_control_l1', defaultDifficulty: 'basic' },
  'GitLab': { competencyId: 'comp_git_version_control_l1', defaultDifficulty: 'basic' },

  // Data Structures & Algorithms
  'Data Structures': { competencyId: 'comp_dsa_linear_trees_l2', defaultDifficulty: 'intermediate' },
  'Algorithms': { competencyId: 'comp_dsa_linear_trees_l2', defaultDifficulty: 'intermediate' },
  'DSA': { competencyId: 'comp_dsa_linear_trees_l2', defaultDifficulty: 'intermediate' },
  'LeetCode': { competencyId: 'comp_dsa_linear_trees_l2', defaultDifficulty: 'intermediate' },

  // Concurrency & Systems
  'Multithreading': { competencyId: 'comp_concurrency_threads_l2', defaultDifficulty: 'intermediate' },
  'Concurrency': { competencyId: 'comp_concurrency_threads_l2', defaultDifficulty: 'intermediate' },
  'Operating Systems': { competencyId: 'comp_fundamentals_l0', defaultDifficulty: 'basic' },
  'Computer Networks': { competencyId: 'comp_fundamentals_l0', defaultDifficulty: 'basic' },

  // Databases & Storage
  'SQL': { competencyId: 'comp_database_sql_internals_l3', defaultDifficulty: 'intermediate' },
  'PostgreSQL': { competencyId: 'comp_database_sql_internals_l3', defaultDifficulty: 'intermediate' },
  'MySQL': { competencyId: 'comp_database_sql_internals_l3', defaultDifficulty: 'intermediate' },
  'Database': { competencyId: 'comp_database_sql_internals_l3', defaultDifficulty: 'basic' },
  'MongoDB': { competencyId: 'comp_database_sql_internals_l3', defaultDifficulty: 'intermediate' },

  // Backend & Web
  'Node.js': { competencyId: 'comp_backend_apis_frameworks_l3', defaultDifficulty: 'intermediate' },
  'TypeScript': { competencyId: 'comp_backend_apis_frameworks_l3', defaultDifficulty: 'intermediate' },
  'JavaScript': { competencyId: 'comp_backend_apis_frameworks_l3', defaultDifficulty: 'basic' },
  'React': { competencyId: 'comp_backend_apis_frameworks_l3', defaultDifficulty: 'intermediate' },
  'REST API': { competencyId: 'comp_backend_apis_frameworks_l3', defaultDifficulty: 'basic' },
  'Next.js': { competencyId: 'comp_backend_apis_frameworks_l3', defaultDifficulty: 'intermediate' },

  // Distributed Systems & Cloud
  'Redis': { competencyId: 'comp_distributed_systems_caching_l4', defaultDifficulty: 'intermediate' },
  'Kafka': { competencyId: 'comp_distributed_systems_caching_l4', defaultDifficulty: 'advanced' },
  'Docker': { competencyId: 'comp_cicd_cloud_devops_l4', defaultDifficulty: 'intermediate' },
  'Kubernetes': { competencyId: 'comp_cicd_cloud_devops_l4', defaultDifficulty: 'advanced' },
  'CI/CD': { competencyId: 'comp_cicd_cloud_devops_l4', defaultDifficulty: 'intermediate' },
  'AWS': { competencyId: 'comp_cicd_cloud_devops_l4', defaultDifficulty: 'intermediate' },

  // AI & Data
  'Machine Learning': { competencyId: 'comp_ai_rag_vector_search_l3', defaultDifficulty: 'intermediate' },
  'RAG': { competencyId: 'comp_ai_rag_vector_search_l3', defaultDifficulty: 'intermediate' },
  'Vector DB': { competencyId: 'comp_ai_rag_vector_search_l3', defaultDifficulty: 'intermediate' },
  'Data Analytics': { competencyId: 'comp_data_sql_analytics_l2', defaultDifficulty: 'intermediate' },
};

/**
 * Parses academic score string (e.g. '8.45 GPA', '82%') into a normalized 0-100 number.
 */
function normalizeGpaScore(scoreOrGpa?: string): number {
  if (!scoreOrGpa) return 72; // Baseline pass score
  const clean = scoreOrGpa.replace(/[^0-9.]/g, '');
  const val = parseFloat(clean);
  if (isNaN(val)) return 72;
  if (val <= 10) return Math.min(100, Math.round(val * 10)); // Convert 10.0 scale to 100
  return Math.min(100, Math.round(val));
}

/**
 * Transforms validated ATS candidate graph evidence into verifiable Competency DAG records,
 * recalculates student role readiness, and pinpoints exact diagnostic gaps.
 */
export function bridgeAtsToCompetencyGraph(
  candidateGraph: ValidatedCandidateGraph,
  studentId: string,
  targetProgramId: string = 'prog_swe_accelerated_9m'
): BridgeEvaluationResult {
  const program = CAREER_PROGRAMS_CATALOG.find(p => p.id === targetProgramId) || CAREER_PROGRAMS_CATALOG[0];
  const now = Date.now();
  const baseAcademicScore = normalizeGpaScore(candidateGraph.scoreOrGpa);
  const evidenceRecords: CompetencyEvidenceRecord[] = [];

  const processedCompetencies = new Set<string>();

  // 1. Convert Document-Supported Skills (Verified by Marksheets / Official Credentials)
  for (const skill of candidateGraph.documentSupportedSkills) {
    const mapping = SKILL_TO_COMPETENCY_MAP[skill];
    if (!mapping) continue;

    const compDef = COMPETENCY_CATALOG_V1.find(c => c.id === mapping.competencyId);
    if (!compDef) continue;

    const recordPayload: Omit<CompetencyEvidenceRecord, 'integrityHash'> = {
      id: 'ev_doc_' + Math.random().toString(36).slice(2, 11),
      competencyId: mapping.competencyId,
      competencyVersion: compDef.version || '1.0.0',
      studentId,
      programId: program.id,
      evidenceClass: 'knowledge' as EvidenceClass,
      difficulty: mapping.defaultDifficulty,
      evidenceFamilyId: 'ats_academic_audit',
      sourceType: 'quest',
      sourceId: 'ats_marksheet_verified',
      attemptId: 'ats_att_' + now.toString(36),
      score: Math.max(65, baseAcademicScore),
      evaluatorType: 'deterministic',
      evaluatorVersion: 'ats-factcheck-v1.0',
      rubricVersion: 'academic-marksheet-rubric-v1',
      timestamp: now,
      artifacts: {
        executionLogSnippet: 'Verified academic grounding from ' + (candidateGraph.institution || 'Accredited University'),
      },
    };

    const integrityHash = generateEvidenceIntegrityHash(recordPayload);
    evidenceRecords.push({ ...recordPayload, integrityHash });
    processedCompetencies.add(mapping.competencyId);
  }

  // 2. Convert Project Tech Stacks (Demonstrated Application Evidence)
  for (let pIdx = 0; pIdx < (candidateGraph.projects || []).length; pIdx++) {
    const proj = candidateGraph.projects[pIdx];
    for (const tech of (proj.techStack || [])) {
      const mapping = SKILL_TO_COMPETENCY_MAP[tech];
      if (!mapping) continue;

      const compDef = COMPETENCY_CATALOG_V1.find(c => c.id === mapping.competencyId);
      if (!compDef) continue;

      const recordPayload: Omit<CompetencyEvidenceRecord, 'integrityHash'> = {
        id: 'ev_proj_' + Math.random().toString(36).slice(2, 11),
        competencyId: mapping.competencyId,
        competencyVersion: compDef.version || '1.0.0',
        studentId,
        programId: program.id,
        evidenceClass: 'application' as EvidenceClass,
        difficulty: mapping.defaultDifficulty,
        evidenceFamilyId: 'ats_project_evidence',
        sourceType: 'project',
        sourceId: 'proj_' + pIdx + '_' + (proj.title || 'portfolio').toLowerCase().replace(/\s+/g, '_').slice(0, 20),
        attemptId: 'proj_att_' + pIdx + '_' + now.toString(36),
        score: 75,
        evaluatorType: 'deterministic',
        evaluatorVersion: 'ats-project-extractor-v1.0',
        rubricVersion: 'project-application-rubric-v1',
        timestamp: now,
        artifacts: {
          executionLogSnippet: proj.title + ': ' + (proj.description || ''),
        },
      };

      const integrityHash = generateEvidenceIntegrityHash(recordPayload);
      evidenceRecords.push({ ...recordPayload, integrityHash });
    }
  }

  // 3. Evaluate Competency Mastery Map
  const masteryMapInstance = new Map<string, CompetencyMasteryStatus>();
  const masteryMapObj: Record<string, CompetencyMasteryStatus> = {};

  for (const compDef of COMPETENCY_CATALOG_V1) {
    const compEvidence = evidenceRecords.filter(e => e.competencyId === compDef.id);
    const status = evaluateCompetencyMastery({
      competency: compDef,
      rawEvidenceRecords: compEvidence,
    });
    masteryMapInstance.set(compDef.id, status);
    masteryMapObj[compDef.id] = status;
  }

  // 4. Calculate Live Dynamic Role Readiness %
  const readiness = calculateDynamicRoleReadiness(program, masteryMapInstance, evidenceRecords);

  let totalPoints = 0;
  let maxPossiblePoints = 0;
  let demonstratedCount = 0;

  for (const stage of program.stages) {
    for (const req of stage.requiredCompetencies) {
      const minReq = req.minScore || 75;
      maxPossiblePoints += minReq;
      const status = masteryMapObj[req.competencyId];
      if (status && (status.compositeScore || 0) > 0) {
        totalPoints += Math.min(status.compositeScore, minReq);
        if (status.compositeScore >= 40) {
          demonstratedCount++;
        }
      }
    }
  }

  // Diagnostic baseline: proportion of required competency points demonstrated from academic evidence
  const readinessPercentage = maxPossiblePoints > 0
    ? Math.min(100, Math.round((totalPoints / maxPossiblePoints) * 100))
    : 0;

  // 5. Pinpoint Critical Diagnostic Gaps for the Target Role
  const diagnosticGaps: BridgeEvaluationResult['diagnosticGaps'] = [];
  for (const stage of program.stages) {
    for (const req of stage.requiredCompetencies) {
      const compDef = COMPETENCY_CATALOG_V1.find(c => c.id === req.competencyId);
      const title = compDef?.title || req.competencyId;
      const status = masteryMapObj[req.competencyId];
      const currentScore = status?.compositeScore || 0;

      let gapStatus: 'satisfied' | 'weak' | 'critical' = 'critical';
      if (currentScore >= req.minScore) {
        gapStatus = 'satisfied';
      } else if (currentScore >= 40) {
        gapStatus = 'weak';
      }

      diagnosticGaps.push({
        competencyId: req.competencyId,
        title,
        currentScore,
        requiredScore: req.minScore,
        status: gapStatus,
      });
    }
  }

  return {
    studentId,
    programId: program.id,
    targetRole: program.targetRole,
    readinessPercentage,
    demonstratedCount,
    evidenceRecords,
    masteryMap: masteryMapObj,
    readiness,
    diagnosticGaps,
  };
}
