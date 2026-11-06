import fs from 'fs';
import path from 'path';
import { getLongLesson } from '../src/lib/data/longLessons';

// Check all prefixes registered in LONG_LESSON_SOURCES
const checkedPrefixes = [
  'course-java-core', 'java-basics',
  'course-react-web', 'react-basics',
  'course-cloud-native', 'cloud-py', 'cloud',
  'course-devops-cicd', 'devops',
  'course-design-systems', 'design',
  'course-dsa-optim', 'dsa-py', 'dsa-optim',
  'course-mobile-dev', 'mobile',
  'course-cybersecurity', 'cyber-py', 'cyber',
  'course-database-eng', 'sql-mastery',
  'course-distributed-systems', 'dist-py', 'dist',
  'course-ai-eng', 'ai-py', 'ai',
  'course-fullstack-dev', 'fullstack-js',
  'course-iot-embedded', 'iot_emb',
  'course-3d-graphics', 'g3d',
  'course-blockchain-web3', 'blockchain',
  'course-iot-wireless', 'iot_net',
  'course-edge-ai', 'iot_edge',
  'course-industrial-iot-sec', 'iot_sec',
  'course-python-fastapi', 'python',
  'course-quant-trading', 'quant-py', 'quant-systems',
  'course-bcom-accounting', 'bcom_acc', 'bcom-accounting',
  'course-bcom-finance', 'bcom_fin', 'bcom-finance',
  'course-bcom-analytics', 'bcom_ana',
  'course-bcom-marketing', 'bcom_mkt', 'bcom-marketing',
  'course-bcom-digital-mktg', 'bcom_dmkt',
  'course-bcom-ecommerce', 'bcom_ecom',
  'course-bcom-entrepreneurship', 'bcom_ent',
  'course-bcom-sales-crm', 'bcom_scrm',
  'course-bcom-operations', 'bcom_ops',
  'course-bcom-ai-transformation', 'bcom_ait',
  'course-computer-fundamentals', 'comp_fund',
  'course-ai-prompt-literacy', 'prompt-py', 'ai_prompt',
  'course-excel-data-viz', 'excel_viz',
  'course-git-version-control', 'git_vcs',
  'course-soft-skills', 'soft_skills', 'soft-skills',
  'course-nlp-computational', 'nlp-py', 'nlp'
];

const uniquePrefixes = [...new Set(checkedPrefixes)];

const results: { prefix: string; count: number; visualsCount: number }[] = [];

for (const p of uniquePrefixes) {
  let count = 0;
  for (let d = 1; d <= 60; d++) {
    if (getLongLesson(p, d)) count++;
  }

  let visualsCount = 0;
  const visualDir = path.resolve(process.cwd(), `src/lib/data/lessonVisuals/${p}`);
  if (fs.existsSync(visualDir)) {
    const files = fs.readdirSync(visualDir).filter(f => f.startsWith('day-') && f.endsWith('.json'));
    visualsCount = files.length;
  }

  if (count > 0 || visualsCount > 0) {
    results.push({ prefix: p, count, visualsCount });
  }
}

console.log('PREFIX'.padEnd(25) + 'LESSONS'.padStart(10) + 'VISUALS'.padStart(10));
console.log('-'.repeat(45));
for (const r of results) {
  console.log(r.prefix.padEnd(25) + String(r.count).padStart(10) + String(r.visualsCount).padStart(10));
}
