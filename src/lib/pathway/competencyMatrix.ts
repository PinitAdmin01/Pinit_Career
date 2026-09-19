// apps/web/src/lib/pathway/competencyMatrix.ts
// Matrix mapping existing 35 courses and quests to granular competencies

import { EvidenceClass, EvidenceDifficulty } from './competencySchema';

export interface CourseCompetencyMapping {
  courseId: string;
  courseTitle: string;
  primaryCompetencies: string[];
  secondaryCompetencies?: string[];
  dayRangeToCompetency: {
    startDay: number;
    endDay: number;
    competencyId: string;
    evidenceClass: EvidenceClass;
    difficulty: EvidenceDifficulty;
    familyPrefix: string;
  }[];
}

export const COURSE_ID_ALIASES: Record<string, string> = {
  'course-java': 'course-java-logic',
  'course-python': 'course-python-backend',
  'course-dsa': 'course-dsa-optim',
  'course-database': 'course-database-eng',
  'course-fullstack': 'course-fullstack-js',
  'course-distributed': 'course-distributed-sys',
  'course-devops': 'course-devops-cicd',
  'course-ai': 'course-ai-eng',
  'course-soft-skills': 'course-softskills-communication',
  'course-fullstack-dev': 'course-fullstack-js',
  'course-cloud-devops': 'course-cloud-native',
  'course-data-science': 'course-database-eng',
};

export function normalizeCourseId(courseId: string): string {
  if (!courseId) return courseId;
  return COURSE_ID_ALIASES[courseId] || courseId;
}

export const COURSE_COMPETENCY_MATRIX: CourseCompetencyMapping[] = [
  {
    courseId: 'course-computer-fundamentals',
    courseTitle: 'Computer Fundamentals',
    primaryCompetencies: ['comp_comp_fundamentals_l0'],
    dayRangeToCompetency: [
      { startDay: 1, endDay: 30, competencyId: 'comp_comp_fundamentals_l0', evidenceClass: 'knowledge', difficulty: 'basic', familyPrefix: 'comp_arch' },
    ],
  },
  {
    courseId: 'course-git-version-control',
    courseTitle: 'Git Version Control & Workflow',
    primaryCompetencies: ['comp_git_version_control_l1'],
    dayRangeToCompetency: [
      { startDay: 1, endDay: 10, competencyId: 'comp_git_version_control_l1', evidenceClass: 'knowledge', difficulty: 'basic', familyPrefix: 'git_syntax' },
      { startDay: 11, endDay: 30, competencyId: 'comp_git_version_control_l1', evidenceClass: 'application', difficulty: 'basic', familyPrefix: 'git_branching' },
    ],
  },
  {
    courseId: 'course-java-logic',
    courseTitle: 'Java Fundamentals & Core Logic',
    primaryCompetencies: ['comp_java_syntax_oop_l1', 'comp_concurrency_threads_l2'],
    dayRangeToCompetency: [
      { startDay: 1, endDay: 15, competencyId: 'comp_java_syntax_oop_l1', evidenceClass: 'knowledge', difficulty: 'basic', familyPrefix: 'java_basics' },
      { startDay: 16, endDay: 22, competencyId: 'comp_java_syntax_oop_l1', evidenceClass: 'application', difficulty: 'basic', familyPrefix: 'java_oop' },
      { startDay: 23, endDay: 30, competencyId: 'comp_concurrency_threads_l2', evidenceClass: 'application', difficulty: 'intermediate', familyPrefix: 'java_threads' },
    ],
  },
  {
    courseId: 'course-python-backend',
    courseTitle: 'Python Programming & Backend Systems',
    primaryCompetencies: ['comp_python_syntax_data_l1'],
    dayRangeToCompetency: [
      { startDay: 1, endDay: 15, competencyId: 'comp_python_syntax_data_l1', evidenceClass: 'knowledge', difficulty: 'basic', familyPrefix: 'py_syntax' },
      { startDay: 16, endDay: 30, competencyId: 'comp_python_syntax_data_l1', evidenceClass: 'application', difficulty: 'basic', familyPrefix: 'py_collections' },
    ],
  },
  {
    courseId: 'course-dsa-optim',
    courseTitle: 'Data Structures & Algorithmic Optimizations',
    primaryCompetencies: ['comp_dsa_linear_trees_l2'],
    dayRangeToCompetency: [
      { startDay: 1, endDay: 10, competencyId: 'comp_dsa_linear_trees_l2', evidenceClass: 'knowledge', difficulty: 'intermediate', familyPrefix: 'dsa_complexity' },
      { startDay: 11, endDay: 25, competencyId: 'comp_dsa_linear_trees_l2', evidenceClass: 'application', difficulty: 'intermediate', familyPrefix: 'dsa_trees' },
      { startDay: 26, endDay: 30, competencyId: 'comp_dsa_linear_trees_l2', evidenceClass: 'debugging', difficulty: 'intermediate', familyPrefix: 'dsa_optim' },
    ],
  },
  {
    courseId: 'course-database-eng',
    courseTitle: 'Database Engineering & Query Performance',
    primaryCompetencies: ['comp_database_sql_internals_l3', 'comp_data_sql_analytics_l2'],
    dayRangeToCompetency: [
      { startDay: 1, endDay: 15, competencyId: 'comp_data_sql_analytics_l2', evidenceClass: 'application', difficulty: 'intermediate', familyPrefix: 'sql_queries' },
      { startDay: 16, endDay: 30, competencyId: 'comp_database_sql_internals_l3', evidenceClass: 'debugging', difficulty: 'advanced', familyPrefix: 'db_internals' },
    ],
  },
  {
    courseId: 'course-fullstack-js',
    courseTitle: 'Full-Stack JavaScript Engineering',
    primaryCompetencies: ['comp_backend_apis_frameworks_l3'],
    dayRangeToCompetency: [
      { startDay: 1, endDay: 15, competencyId: 'comp_backend_apis_frameworks_l3', evidenceClass: 'application', difficulty: 'advanced', familyPrefix: 'api_routes' },
      { startDay: 16, endDay: 30, competencyId: 'comp_backend_apis_frameworks_l3', evidenceClass: 'production', difficulty: 'advanced', familyPrefix: 'fullstack_saas' },
    ],
  },
  {
    courseId: 'course-react-web',
    courseTitle: 'Full-Stack React Web Development',
    primaryCompetencies: ['comp_backend_apis_frameworks_l3'],
    dayRangeToCompetency: [
      { startDay: 1, endDay: 15, competencyId: 'comp_backend_apis_frameworks_l3', evidenceClass: 'application', difficulty: 'intermediate', familyPrefix: 'react_state' },
      { startDay: 16, endDay: 30, competencyId: 'comp_backend_apis_frameworks_l3', evidenceClass: 'production', difficulty: 'advanced', familyPrefix: 'react_saas' },
    ],
  },
  {
    courseId: 'course-distributed-sys',
    courseTitle: 'High-Scale Distributed System Design',
    primaryCompetencies: ['comp_distributed_systems_caching_l4'],
    dayRangeToCompetency: [
      { startDay: 1, endDay: 15, competencyId: 'comp_distributed_systems_caching_l4', evidenceClass: 'architecture', difficulty: 'advanced', familyPrefix: 'dist_cache' },
      { startDay: 16, endDay: 30, competencyId: 'comp_distributed_systems_caching_l4', evidenceClass: 'defense', difficulty: 'advanced', familyPrefix: 'dist_defense' },
    ],
  },
  {
    courseId: 'course-devops-cicd',
    courseTitle: 'DevOps & CI/CD Pipeline Automation',
    primaryCompetencies: ['comp_cicd_cloud_devops_l4'],
    dayRangeToCompetency: [
      { startDay: 1, endDay: 15, competencyId: 'comp_cicd_cloud_devops_l4', evidenceClass: 'application', difficulty: 'advanced', familyPrefix: 'docker_builds' },
      { startDay: 16, endDay: 30, competencyId: 'comp_cicd_cloud_devops_l4', evidenceClass: 'production', difficulty: 'advanced', familyPrefix: 'github_actions' },
    ],
  },
  {
    courseId: 'course-cloud-native',
    courseTitle: 'Cloud Native Architectures (AWS)',
    primaryCompetencies: ['comp_cicd_cloud_devops_l4'],
    dayRangeToCompetency: [
      { startDay: 1, endDay: 15, competencyId: 'comp_cicd_cloud_devops_l4', evidenceClass: 'application', difficulty: 'advanced', familyPrefix: 'aws_cloud' },
      { startDay: 16, endDay: 30, competencyId: 'comp_cicd_cloud_devops_l4', evidenceClass: 'production', difficulty: 'advanced', familyPrefix: 'aws_deploy' },
    ],
  },
  {
    courseId: 'course-excel-data-viz',
    courseTitle: 'Excel & Data Visualization',
    primaryCompetencies: ['comp_data_spreadsheets_quant_l1'],
    dayRangeToCompetency: [
      { startDay: 1, endDay: 30, competencyId: 'comp_data_spreadsheets_quant_l1', evidenceClass: 'application', difficulty: 'basic', familyPrefix: 'excel_modeling' },
    ],
  },
  {
    courseId: 'course-ai-prompt-literacy',
    courseTitle: 'AI Prompt Engineering & Literacy',
    primaryCompetencies: ['comp_ai_literacy_prompting_l1'],
    dayRangeToCompetency: [
      { startDay: 1, endDay: 30, competencyId: 'comp_ai_literacy_prompting_l1', evidenceClass: 'application', difficulty: 'basic', familyPrefix: 'ai_prompts' },
    ],
  },
  {
    courseId: 'course-ai-eng',
    courseTitle: 'AI Engineering & LLM Integration',
    primaryCompetencies: ['comp_ai_rag_vector_search_l3'],
    dayRangeToCompetency: [
      { startDay: 1, endDay: 15, competencyId: 'comp_ai_rag_vector_search_l3', evidenceClass: 'application', difficulty: 'advanced', familyPrefix: 'vector_indexing' },
      { startDay: 16, endDay: 30, competencyId: 'comp_ai_rag_vector_search_l3', evidenceClass: 'production', difficulty: 'advanced', familyPrefix: 'rag_pipeline' },
    ],
  },
  {
    courseId: 'course-softskills-communication',
    courseTitle: 'Executive Communication & Soft Skills',
    primaryCompetencies: ['comp_comm_star_interview_l2'],
    dayRangeToCompetency: [
      { startDay: 1, endDay: 30, competencyId: 'comp_comm_star_interview_l2', evidenceClass: 'defense', difficulty: 'intermediate', familyPrefix: 'star_behavioral' },
    ],
  },
  {
    courseId: 'course-business-analytics',
    courseTitle: 'Business Analytics & Decision Intelligence',
    primaryCompetencies: ['comp_data_sql_analytics_l2', 'comp_data_bi_dashboards_l3'],
    dayRangeToCompetency: [
      { startDay: 1, endDay: 15, competencyId: 'comp_data_sql_analytics_l2', evidenceClass: 'application', difficulty: 'intermediate', familyPrefix: 'biz_sql' },
      { startDay: 16, endDay: 30, competencyId: 'comp_data_bi_dashboards_l3', evidenceClass: 'production', difficulty: 'advanced', familyPrefix: 'biz_bi' },
    ],
  },
];

/**
 * Resolves all competency IDs associated with a given course ID.
 */
export function getCompetenciesForCourse(courseId: string): string[] {
  const normalizedId = normalizeCourseId(courseId);
  const mapping = COURSE_COMPETENCY_MATRIX.find(m => m.courseId === normalizedId || m.courseId === courseId);
  if (!mapping) return [];
  const comps = new Set<string>([...mapping.primaryCompetencies, ...(mapping.secondaryCompetencies || [])]);
  return Array.from(comps);
}

/**
 * Resolves all course IDs that contribute evidence towards a given competency ID.
 */
export function getCoursesForCompetency(competencyId: string): string[] {
  return COURSE_COMPETENCY_MATRIX
    .filter(m => m.primaryCompetencies.includes(competencyId) || m.secondaryCompetencies?.includes(competencyId))
    .map(m => m.courseId);
}

/**
 * Maps a specific course day and quest to its corresponding competency evidence mapping.
 */
export function mapQuestToCompetencyEvidence(courseId: string, dayNumber: number, questId: string): {
  competencyId: string;
  evidenceClass: EvidenceClass;
  difficulty: EvidenceDifficulty;
  evidenceFamilyId: string;
} | null {
  const normalizedId = normalizeCourseId(courseId);
  const mapping = COURSE_COMPETENCY_MATRIX.find(m => m.courseId === normalizedId || m.courseId === courseId);
  if (!mapping) return null;

  const range = mapping.dayRangeToCompetency.find(r => dayNumber >= r.startDay && dayNumber <= r.endDay);
  if (!range) {
    return {
      competencyId: mapping.primaryCompetencies[0],
      evidenceClass: 'application',
      difficulty: 'basic',
      evidenceFamilyId: `${mapping.courseId}_day_${dayNumber}`,
    };
  }

  return {
    competencyId: range.competencyId,
    evidenceClass: range.evidenceClass,
    difficulty: range.difficulty,
    evidenceFamilyId: `${range.familyPrefix}_d${dayNumber}`,
  };
}
