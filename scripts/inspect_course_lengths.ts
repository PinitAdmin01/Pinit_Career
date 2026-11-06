import { getLongLesson } from '../src/lib/data/longLessons';

const prefixes = [
  'react-basics', 'python', 'sql-mastery', 'dsa-py', 'ai-py', 'dist-py', 'cloud-py',
  'nlp-py', 'quant-py', 'prompt-py', 'cyber-py', 'train-py', 'vec-py', 'safe-py',
  'node-web', 'devops', 'cloud', 'design', 'dsa-optim', 'dist', 'cyber', 'ai',
  'sre-web', 'stream-web', 'aideploy-web', 'comp_fund', 'git_vcs', 'iot_emb',
  'quant-systems', 'excel_viz', 'ai_prompt', 'nlp', 'blockchain', 'mobile',
  'java-basics', 'soft-skills', 'g3d', 'fullstack-js', 'iot_edge', 'iot_sec',
  'iot_net', 'bcom_ana', 'bcom_ops', 'bcom_ait', 'bcom_fin', 'bcom_acc',
  'bcom_scrm', 'bcom_ent', 'bcom_ecom', 'bcom_dmkt', 'bcom_mkt', 'bcom_ban',
  'bcom_law', 'bcom_tax', 'bcom_aud'
];

const counts: Record<string, number> = {};
for (const p of prefixes) {
  let count = 0;
  for (let day = 1; day <= 60; day++) {
    if (getLongLesson(p, day)) {
      count++;
    } else {
      break;
    }
  }
  counts[p] = count;
}

console.log(JSON.stringify(counts, null, 2));
