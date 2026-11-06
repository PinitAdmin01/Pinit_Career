import * as fs from 'fs';
import * as path from 'path';
import { COURSES_CATALOG } from '../src/lib/data/coursesCatalog';
import { getLongLesson, estimateLessonMinutes, estimateSpokenMinutes, estimateActivityMinutes } from '../src/lib/data/longLessons';
import { resolvePilotDay } from '../src/lib/data/curriculumEnricher';

console.log('=== OFFICIAL LESSON DURATION & TRACK OVERLAP AUDIT ===\n');

const visualsDir = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals');

interface DetailedCourseAudit {
  id: string;
  num: number;
  title: string;
  prefix: string;
  curriculumType: 'LongLesson (6 parts)' | 'PilotDay (short 3-4 blocks)';
  hasVisuals: boolean;
  visualPrefix: string;
  visualCount: number;
  avgSpokenMin: number;
  avgActivityMin: number;
  avgTotalMin: number;
  inSweetSpot: boolean; // 18 - 25 minutes
  status: string;
}

const PREFIX_MAPPINGS: Record<string, { pilotPrefix: string; certPrefixes: string[] }> = {
  'course-java-logic': { pilotPrefix: 'java-basics', certPrefixes: [] },
  'course-react-web': { pilotPrefix: 'react-basics', certPrefixes: ['react-basics'] },
  'course-node-web': { pilotPrefix: 'node-web', certPrefixes: ['node-web'] },
  'course-cloud-native': { pilotPrefix: 'cloud', certPrefixes: ['cloud', 'cloud-py'] },
  'course-devops-cicd': { pilotPrefix: 'devops', certPrefixes: ['devops'] },
  'course-design-systems': { pilotPrefix: 'design', certPrefixes: [] },
  'course-dsa-optim': { pilotPrefix: 'dsa-optim', certPrefixes: ['dsa-optim', 'dsa-py'] },
  'course-mobile-dev': { pilotPrefix: 'mobile', certPrefixes: [] },
  'course-cybersecurity': { pilotPrefix: 'cyber', certPrefixes: ['cyber', 'cyber-py'] },
  'course-database-eng': { pilotPrefix: 'sql-mastery', certPrefixes: ['sql-mastery'] },
  'course-distributed-sys': { pilotPrefix: 'dist', certPrefixes: ['dist', 'dist-py'] },
  'course-ai-eng': { pilotPrefix: 'ai', certPrefixes: ['ai', 'ai-py'] },
  'course-fullstack-js': { pilotPrefix: 'fullstack-js', certPrefixes: [] },
  'course-iot-embedded': { pilotPrefix: 'iot_emb', certPrefixes: [] },
  'course-3d-graphics': { pilotPrefix: 'g3d', certPrefixes: [] },
  'course-blockchain-web3': { pilotPrefix: 'blockchain', certPrefixes: [] },
  'course-iot-network': { pilotPrefix: 'iot_net', certPrefixes: [] },
  'course-iot-edge-ai': { pilotPrefix: 'iot_edge', certPrefixes: [] },
  'course-iot-security': { pilotPrefix: 'iot_sec', certPrefixes: [] },
  'course-python-backend': { pilotPrefix: 'python', certPrefixes: ['python'] },
  'course-quant-systems': { pilotPrefix: 'quant-systems', certPrefixes: ['quant-py'] },
  'course-digital-accounting': { pilotPrefix: 'bcom-accounting', certPrefixes: [] },
  'course-finance-investment': { pilotPrefix: 'bcom-finance', certPrefixes: [] },
  'course-business-analytics': { pilotPrefix: 'bcom_ana', certPrefixes: [] },
  'course-marketing-branding': { pilotPrefix: 'bcom-marketing', certPrefixes: [] },
  'course-digital-marketing': { pilotPrefix: 'bcom_dmkt', certPrefixes: [] },
  'course-ecommerce-digital-biz': { pilotPrefix: 'bcom_ecom', certPrefixes: [] },
  'course-entrepreneurship-biz-mgmt': { pilotPrefix: 'bcom_ent', certPrefixes: [] },
  'course-sales-crm-success': { pilotPrefix: 'bcom_scrm', certPrefixes: [] },
  'course-operations-supplychain-compliance': { pilotPrefix: 'bcom_ops', certPrefixes: [] },
  'course-ai-digital-transformation': { pilotPrefix: 'bcom_ait', certPrefixes: [] },
  'course-computer-fundamentals': { pilotPrefix: 'comp_fund', certPrefixes: [] },
  'course-ai-prompt-literacy': { pilotPrefix: 'ai_prompt', certPrefixes: ['prompt-py'] },
  'course-excel-data-viz': { pilotPrefix: 'excel_viz', certPrefixes: [] },
  'course-git-version-control': { pilotPrefix: 'git_vcs', certPrefixes: [] },
  'course-softskills-communication': { pilotPrefix: 'soft-skills', certPrefixes: [] },
  'course-nlp': { pilotPrefix: 'nlp', certPrefixes: ['nlp-py'] },
};

const audits: DetailedCourseAudit[] = [];

COURSES_CATALOG.forEach((cat, idx) => {
  const map = PREFIX_MAPPINGS[cat.id] || { pilotPrefix: cat.id.replace('course-', ''), certPrefixes: [] };
  
  // 1. Check Visuals
  let hasVisuals = false;
  let visualPrefix = map.pilotPrefix;
  let visualCount = 0;

  const testPrefixes = [...map.certPrefixes, map.pilotPrefix];
  for (const p of testPrefixes) {
    const dir = path.join(visualsDir, p);
    if (fs.existsSync(dir)) {
      const dayFiles = fs.readdirSync(dir).filter(f => f.startsWith('day-') && f.endsWith('.json'));
      if (dayFiles.length > visualCount) {
        visualCount = dayFiles.length;
        visualPrefix = p;
        hasVisuals = dayFiles.length >= 30;
      }
    }
  }

  // 2. Check Curriculum Format & Duration
  // Check if LongLessons exist for this course under pilotPrefix or certPrefixes
  let totalSpokenMin = 0;
  let totalActivityMin = 0;
  let totalMin = 0;
  let daysSampled = 0;
  let isLongLesson = false;

  for (const p of testPrefixes) {
    const l1 = getLongLesson(p, 1);
    if (l1) {
      isLongLesson = true;
      for (let d = 1; d <= 30; d++) {
        const l = getLongLesson(p, d);
        if (l) {
          daysSampled++;
          totalSpokenMin += estimateSpokenMinutes(l);
          totalActivityMin += estimateActivityMinutes(l);
          totalMin += estimateLessonMinutes(l);
        }
      }
      break;
    }
  }

  if (!isLongLesson) {
    // Measured via PilotDay
    for (let d = 1; d <= 30; d++) {
      const pDay = resolvePilotDay(map.pilotPrefix, d);
      if (pDay) {
        daysSampled++;
        // Count words in pilot day
        let words = 0;
        if (pDay.overviewMetaphor) words += pDay.overviewMetaphor.split(/\s+/).length;
        pDay.blocks?.forEach((b: any) => {
          if (b.content) words += b.content.split(/\s+/).length;
          b.media?.forEach((m: any) => {
            if (m.simpleExplanation) words += m.simpleExplanation.split(/\s+/).length;
          });
          if (b.diagnosticCheck?.question) words += b.diagnosticCheck.question.split(/\s+/).length;
        });
        const spoken = Math.round(words / 120);
        const activity = Math.round((pDay.blocks?.length || 3) * 1.5);
        totalSpokenMin += spoken;
        totalActivityMin += activity;
        totalMin += (spoken + activity);
      }
    }
  }

  const avgSpoken = daysSampled > 0 ? Math.round((totalSpokenMin / daysSampled) * 10) / 10 : 0;
  const avgActivity = daysSampled > 0 ? Math.round((totalActivityMin / daysSampled) * 10) / 10 : 0;
  const avgTotal = daysSampled > 0 ? Math.round((totalMin / daysSampled) * 10) / 10 : 0;
  const inSweetSpot = avgTotal >= 18 && avgTotal <= 25;

  let statusDesc = '';
  if (hasVisuals && inSweetSpot) {
    statusDesc = 'COMPLETE: Visuals Built & Duration Perfect (18-25m)';
  } else if (hasVisuals && !inSweetSpot) {
    statusDesc = 'Visuals Built, but Duration expansion needed';
  } else if (!hasVisuals && inSweetSpot) {
    statusDesc = 'Duration Perfect (18-25m), Visuals need to be built';
  } else {
    statusDesc = 'Needs Visuals + Needs LongLesson Expansion to 18-25m';
  }

  audits.push({
    num: idx + 1,
    id: cat.id,
    title: cat.title,
    prefix: map.pilotPrefix,
    curriculumType: isLongLesson ? 'LongLesson (6 parts)' : 'PilotDay (short 3-4 blocks)',
    hasVisuals,
    visualPrefix,
    visualCount,
    avgSpokenMin: avgSpoken,
    avgActivityMin: avgActivity,
    avgTotalMin: avgTotal,
    inSweetSpot,
    status: statusDesc
  });
});

console.log('AUDIT RESULTS BY COURSE:');
audits.forEach(a => {
  const vTag = a.hasVisuals ? `✅ [Visuals 30/30 (${a.visualPrefix})]` : `⏳ [Visuals NEEDED (${a.visualCount}/30)]`;
  const dTag = a.inSweetSpot ? `🎯 [${a.avgTotalMin} min (18-25m PERFECT)]` : `⚠️ [${a.avgTotalMin} min (${a.avgTotalMin < 18 ? 'Too Short' : 'Too Long'})]`;
  console.log(`${a.num.toString().padStart(2, '0')}. [${a.id}] "${a.title}"`);
  console.log(`    Format: ${a.curriculumType}`);
  console.log(`    Duration: Spoken: ${a.avgSpokenMin}m + Interactive: ${a.avgActivityMin}m = Total: ${a.avgTotalMin}m -> ${dTag}`);
  console.log(`    Visuals:  ${vTag}`);
  console.log(`    Status:   ${a.status}`);
  console.log('');
});

// Group Summary
console.log('=== FOUR REALITY CATEGORIES ===\n');

const group1 = audits.filter(a => a.hasVisuals && a.inSweetSpot);
console.log(`Category A: READY TO SHIP (Visuals Built 30/30 & Duration 18-25 min): ${group1.length} courses`);
group1.forEach(c => console.log(`  - #${c.num} [${c.id}] ${c.title} (${c.avgTotalMin} min, visuals: ${c.visualPrefix})`));

const group2 = audits.filter(a => a.hasVisuals && !a.inSweetSpot);
console.log(`\nCategory B: VISUALS BUILT (from Python Track), BUT SHORT PILOT LESSONS (needs long lesson sync): ${group2.length} courses`);
group2.forEach(c => console.log(`  - #${c.num} [${c.id}] ${c.title} (${c.avgTotalMin} min, visuals: ${c.visualPrefix})`));

const group3 = audits.filter(a => !a.hasVisuals && a.inSweetSpot);
console.log(`\nCategory C: DURATION PERFECT (LongLesson 18-25 min), BUT VISUALS NEED TO BE GENERATED: ${group3.length} courses`);
group3.forEach(c => console.log(`  - #${c.num} [${c.id}] ${c.title} (${c.avgTotalMin} min)`));

const group4 = audits.filter(a => !a.hasVisuals && !a.inSweetSpot);
console.log(`\nCategory D: NEW STANDALONE COURSES (Currently Short Pilot Days, Needs Visuals & LongLessons): ${group4.length} courses`);
group4.forEach(c => console.log(`  - #${c.num} [${c.id}] ${c.title} (${c.avgTotalMin} min)`));

fs.writeFileSync(
  path.resolve(process.cwd(), 'docs/visuals/PINIT_36_COURSES_CATEGORIZED_AUDIT.json'),
  JSON.stringify({ group1, group2, group3, group4, all: audits }, null, 2),
  'utf8'
);
