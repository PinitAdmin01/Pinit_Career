import { getLongLesson } from '../src/lib/data/longLessons';

const keys = [
  'react-basics',
  'python',
  'sql-mastery',
  'dsa-py',
  'ai-py',
  'dist-py',
  'cloud-py',
  'nlp-py',
  'quant-py',
  'prompt-py',
  'cyber-py',
  'train-py',
  'vec-py',
  'safe-py',
  'node-web',
  'devops',
  'cloud',
  'design',
  'dsa-optim',
  'dist',
  'cyber',
  'ai',
  'sre-web',
  'stream-web',
  'aideploy-web',
  'comp_fund',
  'git_vcs',
  'iot_emb',
  'quant-systems',
  'excel_viz',
  'ai_prompt',
  'blockchain',
  'mobile',
  'java-basics',
  'soft-skills',
  'g3d',
  'fullstack-js',
  'iot_edge',
  'iot_sec',
  'iot_net',
  'bcom_ana',
  'bcom_ops',
  'bcom_ait',
  'bcom_fin',
  'bcom_acc',
  'bcom_scrm',
  'bcom_ent',
  'bcom_ecom',
  'bcom_dmkt',
  'bcom_mkt',
  'bcom_ban',
  'bcom_law',
  'bcom_tax',
  'bcom_aud',
];

console.log('='.repeat(80));
console.log('   PINIT CAREER OS: AUDIT OF AVAILABLE LONGLESSONS PER PREFIX   ');
console.log('='.repeat(80));

for (const k of keys) {
  let count = 0;
  const days: number[] = [];
  for (let d = 1; d <= 60; d++) {
    const l = getLongLesson(k, d);
    if (l) {
      count++;
      days.push(l.day);
    }
  }
  const minD = days.length > 0 ? Math.min(...days) : 0;
  const maxD = days.length > 0 ? Math.max(...days) : 0;
  const status = count === 60 ? '60/60 (100.0%)' : `${count}/60`;
  console.log(`${k.padEnd(16)} | Count: ${String(count).padEnd(4)} | Range: ${minD}..${maxD} | Status: ${status}`);
}
