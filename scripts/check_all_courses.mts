import { getLongLesson } from './src/lib/data/longLessons';
const prefixes = ['react-basics', 'python', 'sql-mastery', 'dsa-py', 'ai-py', 'dist-py', 'cloud-py', 'nlp-py', 'quant-py', 'prompt-py', 'cyber-py', 'train-py', 'vec-py', 'safe-py', 'node-web', 'devops', 'cloud', 'design', 'dsa-optim', 'dist', 'cyber', 'ai', 'sre-web', 'stream-web', 'aideploy-web', 'comp_fund', 'git_vcs', 'iot_emb', 'quant-systems', 'excel_viz', 'ai_prompt', 'nlp', 'blockchain', 'mobile', 'java-basics', 'soft-skills', 'soft_skills', 'g3d', 'fullstack-js', 'iot_edge', 'iot_sec', 'iot_net', 'bcom_ana', 'bcom_ops', 'bcom_ait', 'bcom-finance', 'bcom_fin', 'bcom-accounting', 'bcom_acc', 'bcom_scrm', 'bcom_ent', 'bcom_ecom', 'bcom_dmkt', 'bcom-marketing', 'bcom_mkt', 'bcom_ban', 'bcom_law', 'bcom_tax', 'bcom_aud'];

for (const p of prefixes) {
  let count = 0;
  for (let d = 1; d <= 60; d++) {
    if (getLongLesson(p, d)) count++;
  }
  console.log(`${p.padEnd(20)}: ${count}/60 days`);
}
