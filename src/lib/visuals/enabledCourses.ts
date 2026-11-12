/**
 * Release switch (Plan C7 & Task E-15)
 * Lists the course prefixes whose pictures students can see.
 * A course is added only by its release task (L-...), after all its checkpoints are approved.
 * Until then, its pictures exist in the repo but are hidden.
 */
// Released courses:
// - 'python': Python Backend (Month 1) released via [task:L-python]
// - 'dsa-py': DSA in Python (Month 2) released via [task:L-dsa-py]
// - 'sql-mastery': SQL Mastery (Month 3) released via [task:L-sql-mastery]
// - 'ai-py': AI Engineering (Month 4) released via [task:L-ai-py]
// - 'dist-py': Distributed Systems in Python (Month 5) released via [task:L-dist-py]
// - 'cloud-py': Cloud Engineering in Python (Month 6) released via [task:L-cloud-py]
// - 'nlp-py': Natural Language Processing in Python (Month 7) released via [task:L-nlp-py]
// - 'quant-py': Quantitative & Financial Engineering in Python (Month 8) released via [task:L-quant-py]
// - 'prompt-py': Prompt Engineering & LLM Applications (Month 9) released via [task:L-prompt-py]
// - 'train-py': LLM Fine-Tuning & Training (Month 10) released via [task:L-train-py]
// - 'vec-py': Vector Search & Embeddings (Month 11) released via [task:L-vec-py]
// - 'safe-py': AI Safety & Alignment (Month 12) released via [task:L-safe-py]
// - 'react-basics': React Basics (Month 1 Web Full-Stack) released via [task:L-react-basics]
// - 'node-web': Node.js Backend & API Engineering (Month 2 Web Full-Stack) released via [task:L-node-web]
// - 'dsa-optim': Data Structures, Algorithms & Optimization (Month 3 Web Full-Stack) released via [task:L-dsa-optim]
// - 'devops': DevOps, Docker & CI/CD Pipelines (Month 5 Web Full-Stack) released via [task:L-devops]
// - 'cloud': Cloud Architecture & Distributed Systems (Month 6 Web Full-Stack) released via [task:L-cloud]
// - 'dist': Distributed Systems Architecture (Month 7 Web Full-Stack) released via [task:L-dist]
// - 'cyber': Cybersecurity, Cryptography & Secure Web Development (Month 8 Web Full-Stack) released via [task:L-cyber]
// - 'ai': Full-Stack AI Engineering & Large Language Models (Month 9 Web Full-Stack) released via [task:L-ai]
// - 'sre-web': Multi-Cloud Reliability & Site Reliability Engineering (Month 10 Web Full-Stack) released via [task:L-sre-web]
// - 'stream-web': High-Throughput Streaming in TypeScript (Month 11 Web Full-Stack) released via [task:L-stream-web]
export const ENABLED_COURSES: readonly string[] = [
  // [FIX-STAGE: wave0-enable-cyber-py] Include 'cyber-py' so course-cyber-python Day 1-60 visuals render in production
  'python', 'dsa-py', 'sql-mastery', 'ai-py', 'dist-py', 'cloud-py', 'nlp-py', 'quant-py', 'prompt-py', 'cyber-py', 'train-py', 'vec-py', 'safe-py',
  'react-basics', 'node-web', 'dsa-optim', 'devops', 'cloud', 'dist', 'cyber', 'ai', 'sre-web', 'stream-web', 'aideploy-web',
  'iot_edge', 'iot-edge', 'iot_sec', 'iot-sec', 'iot_net', 'iot-net', 'iot_emb', 'iot-emb',
  'bcom_ops', 'bcom-ops', 'bcom_scrm', 'bcom-scrm', 'bcom_ent', 'bcom-ent', 'bcom_ecom', 'bcom-ecom',
  'bcom_dmkt', 'bcom-dmkt', 'bcom-marketing', 'bcom_marketing',
  'bcom_ana', 'bcom-ana', 'bcom-finance', 'bcom_finance', 'bcom-accounting', 'bcom_accounting',
  'bcom_ait', 'bcom-ait', 'bcom_tax', 'bcom-tax', 'bcom_aud', 'bcom-aud', 'bcom_ban', 'bcom-ban', 'bcom_law', 'bcom-law',
  'quant-systems', 'quant_systems', 'g3d', 'blockchain', 'mobile', 'design', 'design-web', 'design_web',
  'fullstack-js', 'fullstack_js', 'java-basics', 'java_basics', 'excel_viz', 'excel-viz',
  'git_vcs', 'git-vcs', 'soft-skills', 'soft_skills', 'comp_fund', 'comp-fund', 'ai_prompt'
];

export function isCourseVisualsEnabled(prefix: string): boolean {
  return ENABLED_COURSES.includes(prefix);
}
