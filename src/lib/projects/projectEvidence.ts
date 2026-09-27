import type { Project } from '@/lib/data/projectData';

/**
 * Which career program and competency a verified project counts toward.
 *
 * Every id here exists in src/lib/pathway/programEngine.ts (programs) and
 * src/lib/pathway/competencyCatalog.ts (competencies). The Projects page used to record every
 * project under prog_swe_accelerated_9m with competency ids that are not in the catalog
 * (comp_db_sql_postgres, …), so project evidence never counted for anyone, and non-tech students
 * got software evidence. Tracks the catalog does not cover get no evidence (null) rather than
 * wrong evidence.
 */
export interface ProjectEvidenceTarget {
  programId: string;
  competencyId: string;
}

type Level = Project['level'];

const SOFTWARE: Record<Level, string> = {
  Beginner: 'comp_git_version_control_l1',
  Intermediate: 'comp_database_sql_internals_l3',
  Advanced: 'comp_backend_apis_frameworks_l3',
  Enterprise: 'comp_cicd_cloud_devops_l4',
  'Future-Tech': 'comp_distributed_systems_caching_l4',
};
const DATA: Record<Level, string> = {
  Beginner: 'comp_data_spreadsheets_quant_l1',
  Intermediate: 'comp_data_sql_analytics_l2',
  Advanced: 'comp_data_bi_dashboards_l3',
  Enterprise: 'comp_data_bi_dashboards_l3',
  'Future-Tech': 'comp_data_bi_dashboards_l3',
};
const AI: Record<Level, string> = {
  Beginner: 'comp_ai_literacy_prompting_l1',
  Intermediate: 'comp_ai_literacy_prompting_l1',
  Advanced: 'comp_ai_rag_vector_search_l3',
  Enterprise: 'comp_ai_rag_vector_search_l3',
  'Future-Tech': 'comp_ai_rag_vector_search_l3',
};

const AI_RE = /\b(ai|ml|machine learning|deep learning|llm|genai|generative|nlp|computer vision|data scientist)\b/i;
const DATA_RE = /\b(data|analytics?|analyst|business intelligence|bi|dashboard|tableau|power ?bi)\b/i;
const SOFTWARE_RE = /\b(software|developer|engineer(ing)?|sde|full[ -]?stack|front[ -]?end|back[ -]?end|web|mobile|devops|cloud|sre|cyber ?security|security|platform|embedded|game)\b/i;

export function getProjectEvidenceTarget(role: string | null | undefined, level: Level): ProjectEvidenceTarget | null {
  const r = String(role || '');
  if (AI_RE.test(r)) return { programId: 'prog_software_engineering', competencyId: AI[level] ?? AI.Beginner };
  if (DATA_RE.test(r)) return { programId: 'prog_data_analytics', competencyId: DATA[level] ?? DATA.Beginner };
  if (SOFTWARE_RE.test(r)) return { programId: 'prog_swe_accelerated_9m', competencyId: SOFTWARE[level] ?? SOFTWARE.Beginner };
  return null;
}

/** Every program and competency id this module can return (for tests against the catalogs). */
export const PROJECT_EVIDENCE_IDS = {
  programs: ['prog_software_engineering', 'prog_data_analytics', 'prog_swe_accelerated_9m'],
  competencies: Array.from(new Set([...Object.values(SOFTWARE), ...Object.values(DATA), ...Object.values(AI)])),
};
