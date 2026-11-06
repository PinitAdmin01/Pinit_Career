import { getLongLesson } from '../src/lib/data/longLessons';
import { generateLessonPuzzle } from '../src/lib/puzzles/lessonPuzzleEngine';

const sampleKeys = [
  'python',
  'react-basics',
  'sql-mastery',
  'java-basics',
  'devops',
  'bcom-accounting',
  'bcom-finance',
  'bcom_ban',
  'bcom_aud',
  'bcom_tax',
  'bcom_law',
  'bcom_ops',
  'bcom_dmkt',
  'bcom_ecom',
  'cyber-py',
  'node-web',
  'git_vcs',
  'iot_emb',
  'blockchain',
  'mobile'
];

console.log('AUDITING SAMPLE GENERATED PUZZLES ACROSS 20 TRACKS:');
let totalVerified = 0;

for (const k of sampleKeys) {
  const l = getLongLesson(k, 1);
  if (!l) {
    console.log(`[SKIP] No lesson day 1 for ${k}`);
    continue;
  }
  const p = generateLessonPuzzle(l.id || k, k, l.day, l);
  console.log(`\n=== Course: [${k}] (Day ${l.day}) ===`);
  console.log(`Domain: ${p.domain} | Type: ${p.type}`);
  console.log(`Title: ${p.title}`);
  console.log(`Mission Prompt: ${p.missionPrompt}`);
  console.log(`Blocks (${p.blocks.length}):`);
  p.blocks.forEach((b, i) => {
    console.log(`  [${b.id}] (${b.color}) [${b.badge || 'N/A'}] ${b.label} -> ${b.subtext || ''}`);
  });
  console.log(`Correct Order: ${p.correctOrder.join(' -> ')}`);
  console.log(`Decoys: ${p.decoyBlockIds?.join(', ') || 'None'}`);
  console.log(`Hint: ${p.hint}`);

  // Validation assertion
  if (p.blocks.length < 4) throw new Error(`Puzzle for ${k} has fewer than 4 blocks!`);
  if (!p.decoyBlockIds || p.decoyBlockIds.length === 0) throw new Error(`Puzzle for ${k} is missing decoy blocks!`);
  if (p.correctOrder.length < 3) throw new Error(`Puzzle for ${k} correct order is too short!`);
  for (const tid of p.correctOrder) {
    if (!p.blocks.some(b => b.id === tid)) throw new Error(`Target ID ${tid} missing from blocks in ${k}!`);
  }
  totalVerified++;
}

console.log(`\n============================================================`);
console.log(`ALL ${totalVerified} DOMAIN PUZZLES VERIFIED WITH ZERO ERRORS!`);
console.log(`============================================================`);
