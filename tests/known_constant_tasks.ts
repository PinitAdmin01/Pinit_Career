/**
 * Tasks known to return a constant answer in existing courses (W-09 / F-14).
 * This list must shrink to empty by the end of Phase 3 / F-18 as each course is upgraded.
 */
export const KNOWN_CONSTANT_TASKS = new Set<string>([
  // course-fullstack-js (66 tasks)
  'fullstack-js-assign-day-1', 'fullstack-js-exam-day-10', 'fullstack-js-assign-day-10', 'fullstack-js-assign-day-11',
  'fullstack-js-exam-day-12', 'fullstack-js-assign-day-12', 'fullstack-js-assign-day-13', 'fullstack-js-assign-day-14',
  'fullstack-js-assign-day-15', 'fullstack-js-exam-day-16', 'fullstack-js-assign-day-17', 'fullstack-js-exam-day-18', 'fullstack-js-exam-day-19', 'fullstack-js-assign-day-20',
  'fullstack-js-exam-day-21', 'fullstack-js-assign-day-21', 'fullstack-js-assign-day-22', 'fullstack-js-exam-day-23', 'fullstack-js-assign-day-23',
  'fullstack-js-assign-day-24', 'fullstack-js-exam-day-26', 'fullstack-js-assign-day-26', 'fullstack-js-assign-day-27',
  'fullstack-js-assign-day-28', 'fullstack-js-assign-day-29', 'fullstack-js-exam-day-30', 'fullstack-js-exam-day-33', 'fullstack-js-assign-day-33', 'fullstack-js-assign-day-34',
  'fullstack-js-assign-day-35', 'fullstack-js-assign-day-41', 'fullstack-js-assign-day-42', 'fullstack-js-assign-day-43',
  'fullstack-js-assign-day-44', 'fullstack-js-assign-day-48', 'fullstack-js-assign-day-51', 'fullstack-js-assign-day-56',
  'fullstack-js-exam-day-60', 'fullstack-js-assign-day-69', 'fullstack-js-exam-day-71', 'fullstack-js-assign-day-74',
  'fullstack-js-assign-day-75', 'fullstack-js-exam-day-76', 'fullstack-js-assign-day-76', 'fullstack-js-exam-day-77', 'fullstack-js-exam-day-78', 'fullstack-js-assign-day-80',
  'fullstack-js-exam-day-81', 'fullstack-js-exam-day-85', 'fullstack-js-assign-day-85', 'fullstack-js-exam-day-87',
  'fullstack-js-assign-day-90', 'fullstack-js-assign-day-91', 'fullstack-js-exam-day-93', 'fullstack-js-exam-day-95',
  'fullstack-js-exam-day-97', 'fullstack-js-assign-day-97', 'fullstack-js-exam-day-98', 'fullstack-js-assign-day-98',
  'fullstack-js-assign-day-101', 'fullstack-js-assign-day-105', 'fullstack-js-exam-day-107', 'fullstack-js-exam-day-111',
  'fullstack-js-assign-day-115', 'fullstack-js-exam-day-117', 'fullstack-js-exam-day-120',
  // course-node-web (2 tasks - to be fixed in F-18)
  'node-web-assign-day-5', 'node-web-assign-day-11',
  // course-react-web (19 tasks)
  'react-basics-exam-day-2', 'react-basics-exam-day-4', 'react-basics-assign-day-4',
  'react-basics-exam-day-5', 'react-basics-assign-day-5', 'react-basics-exam-day-6', 'react-basics-assign-day-6',
  'react-basics-exam-day-7', 'react-basics-assign-day-7',
  'react-basics-assign-day-14', 'react-basics-exam-day-15', 'react-basics-assign-day-15', 'react-basics-assign-day-22',
  'react-basics-exam-day-23', 'react-basics-assign-day-23', 'react-basics-exam-day-25',
  'react-basics-exam-day-27', 'react-basics-assign-day-29', 'react-basics-assign-day-30',
  // course-cloud-native: 0 tasks (all 60 tasks non-constant and verified)
  // course-devops-cicd: 0 tasks (all 60 tasks non-constant and verified)
  // course-quant-systems (24 tasks)
  'quant-systems-assign-day-2', 'quant-systems-assign-day-3', 'quant-systems-assign-day-4', 'quant-systems-assign-day-5',
  'quant-systems-exam-day-9', 'quant-systems-exam-day-10', 'quant-systems-assign-day-11', 'quant-systems-assign-day-14',
  'quant-systems-assign-day-15', 'quant-systems-exam-day-16', 'quant-systems-assign-day-16', 'quant-systems-assign-day-17',
  'quant-systems-assign-day-18', 'quant-systems-exam-day-19', 'quant-systems-assign-day-20', 'quant-systems-assign-day-21',
  'quant-systems-assign-day-22', 'quant-systems-assign-day-23', 'quant-systems-assign-day-24', 'quant-systems-assign-day-25',
  'quant-systems-assign-day-26', 'quant-systems-exam-day-28', 'quant-systems-assign-day-28', 'quant-systems-assign-day-29',
  // course-dsa-optim: 0 tasks (all 60 tasks non-constant and verified)
  // course-design-systems (1 task - to be fixed in F-18)
  'design-assign-day-29',
  // course-ai-eng (23 tasks - to be fixed in F-18)
  'ai-exam-day-6', 'ai-exam-day-11', 'ai-exam-day-15', 'ai-exam-day-16', 'ai-assign-day-16', 'ai-assign-day-18', 'ai-exam-day-19',
  'ai-assign-day-19', 'ai-exam-day-20', 'ai-assign-day-20', 'ai-exam-day-21', 'ai-exam-day-22',
  'ai-assign-day-22', 'ai-exam-day-23', 'ai-assign-day-23', 'ai-exam-day-25',
  'ai-exam-day-26', 'ai-assign-day-26', 'ai-exam-day-28', 'ai-assign-day-28',
  'ai-exam-day-29', 'ai-assign-day-29', 'ai-exam-day-30',
  // course-distributed-sys (7 tasks - to be fixed in F-18)
  'dist-exam-day-10', 'dist-exam-day-17', 'dist-exam-day-21', 'dist-exam-day-22', 'dist-exam-day-24', 'dist-exam-day-25', 'dist-exam-day-30',
  // course-cybersecurity: 0 tasks (all 60 tasks non-constant and verified)
  // course-nlp (48 tasks)
  'nlp-exam-day-1', 'nlp-assign-day-1', 'nlp-assign-day-2', 'nlp-assign-day-3',
  'nlp-exam-day-4', 'nlp-assign-day-4', 'nlp-exam-day-5', 'nlp-assign-day-5',
  'nlp-assign-day-6', 'nlp-exam-day-7', 'nlp-assign-day-7', 'nlp-exam-day-8',
  'nlp-assign-day-8', 'nlp-assign-day-9', 'nlp-exam-day-10', 'nlp-assign-day-10',
  'nlp-assign-day-11', 'nlp-exam-day-12', 'nlp-assign-day-12', 'nlp-exam-day-13',
  'nlp-assign-day-13', 'nlp-exam-day-14', 'nlp-assign-day-14', 'nlp-exam-day-15',
  'nlp-assign-day-15', 'nlp-assign-day-16', 'nlp-exam-day-17', 'nlp-assign-day-17',
  'nlp-exam-day-18', 'nlp-assign-day-18', 'nlp-assign-day-19', 'nlp-assign-day-20',
  'nlp-assign-day-21', 'nlp-assign-day-21', 'nlp-exam-day-22', 'nlp-assign-day-22',
  'nlp-exam-day-23', 'nlp-assign-day-23', 'nlp-assign-day-24', 'nlp-exam-day-25',
  'nlp-assign-day-25', 'nlp-assign-day-26', 'nlp-exam-day-27', 'nlp-assign-day-27',
  'nlp-assign-day-28', 'nlp-exam-day-29', 'nlp-assign-day-29', 'nlp-assign-day-30',
  // course-ai-prompt-literacy (34 tasks)
  'ai_prompt-assign-day-1', 'ai_prompt-assign-day-2', 'ai_prompt-assign-day-3', 'ai_prompt-exam-day-4',
  'ai_prompt-assign-day-4', 'ai_prompt-exam-day-5', 'ai_prompt-assign-day-5', 'ai_prompt-assign-day-6',
  'ai_prompt-assign-day-7', 'ai_prompt-assign-day-8', 'ai_prompt-assign-day-9', 'ai_prompt-assign-day-10',
  'ai_prompt-assign-day-11', 'ai_prompt-assign-day-12', 'ai_prompt-assign-day-13', 'ai_prompt-assign-day-14',
  'ai_prompt-exam-day-15', 'ai_prompt-assign-day-15', 'ai_prompt-assign-day-16', 'ai_prompt-assign-day-17',
  'ai_prompt-assign-day-18', 'ai_prompt-assign-day-19', 'ai_prompt-assign-day-20', 'ai_prompt-exam-day-21',
  'ai_prompt-assign-day-21', 'ai_prompt-assign-day-22', 'ai_prompt-assign-day-23', 'ai_prompt-assign-day-24',
  'ai_prompt-assign-day-25', 'ai_prompt-assign-day-26', 'ai_prompt-assign-day-27', 'ai_prompt-assign-day-28',
  'ai_prompt-assign-day-29', 'ai_prompt-assign-day-30',
]);
