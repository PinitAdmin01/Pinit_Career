import * as fs from 'fs';
import * as path from 'path';
import { COURSES_CATALOG } from '../src/lib/data/coursesCatalog';
import { COURSES_REGISTRY } from '../src/lib/data/coursesData';
import { getLongLesson } from '../src/lib/data/longLessons';
import { resolvePilotDay } from '../src/lib/data/curriculumEnricher';

const visualsDir = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals');
const onDiskVisualDirs = fs.readdirSync(visualsDir).filter(f => fs.statSync(path.join(visualsDir, f)).isDirectory());

console.log('=== VISUALS STATUS & LESSON DURATION IN-DEPTH AUDIT ===\n');

interface CourseAudit {
  index: number;
  id: string;
  title: string;
  category: string;
  prefix: string;
  hasExistingVisuals: boolean;
  visualDaysCount: number;
  sampleDayPartsCount: number;
  avgWordsPerDay: number;
  estimatedMinutesPerDay: number;
  durationCompliant: boolean; // 18 - 25 minutes
  notes: string;
}

// Prefixes mapping from curriculumEnricher & coursesData
const CATALOG_TO_PREFIX: Record<string, string> = {
  'course-java-logic': 'java-basics',
  'course-react-web': 'react-basics',
  'course-node-web': 'node-web',
  'course-cloud-native': 'cloud',
  'course-devops-cicd': 'devops',
  'course-design-systems': 'design',
  'course-dsa-optim': 'dsa-optim',
  'course-mobile-dev': 'mobile',
  'course-cybersecurity': 'cyber',
  'course-database-eng': 'sql-mastery',
  'course-distributed-sys': 'dist',
  'course-ai-eng': 'ai',
  'course-fullstack-js': 'fullstack-js',
  'course-iot-embedded': 'iot_emb',
  'course-3d-graphics': 'g3d',
  'course-blockchain-web3': 'blockchain',
  'course-iot-network': 'iot_net',
  'course-iot-edge-ai': 'iot_edge',
  'course-iot-security': 'iot_sec',
  'course-python-backend': 'python',
  'course-quant-systems': 'quant-systems',
  'course-digital-accounting': 'bcom-accounting',
  'course-finance-investment': 'bcom-finance',
  'course-business-analytics': 'bcom_ana',
  'course-marketing-branding': 'bcom-marketing',
  'course-digital-marketing': 'bcom_dmkt',
  'course-ecommerce-digital-biz': 'bcom_ecom',
  'course-entrepreneurship-biz-mgmt': 'bcom_ent',
  'course-sales-crm-success': 'bcom_scrm',
  'course-operations-supplychain-compliance': 'bcom_ops',
  'course-ai-digital-transformation': 'bcom_ait',
  'course-computer-fundamentals': 'comp_fund',
  'course-ai-prompt-literacy': 'ai_prompt',
  'course-excel-data-viz': 'excel_viz',
  'course-git-version-control': 'git_vcs',
  'course-softskills-communication': 'soft-skills',
  'course-nlp': 'nlp'
};

const results: CourseAudit[] = [];

COURSES_CATALOG.forEach((cat, idx) => {
  const prefix = CATALOG_TO_PREFIX[cat.id] || cat.id.replace('course-', '');
  
  // Check if directory exists and has 30 day files
  let hasVisuals = false;
  let visualCount = 0;
  
  // Also check alternative prefixes (e.g. quant-py vs quant-systems, nlp-py vs nlp)
  const candidateDirs = [prefix];
  if (prefix === 'quant-systems') candidateDirs.push('quant-py');
  if (prefix === 'nlp') candidateDirs.push('nlp-py');
  if (prefix === 'ai_prompt') candidateDirs.push('prompt-py');
  if (prefix === 'cloud') candidateDirs.push('cloud-py');
  if (prefix === 'dist') candidateDirs.push('dist-py');
  if (prefix === 'dsa-optim') candidateDirs.push('dsa-py');
  if (prefix === 'ai') candidateDirs.push('ai-py');
  
  for (const cDir of candidateDirs) {
    const dirPath = path.join(visualsDir, cDir);
    if (fs.existsSync(dirPath)) {
      const dayFiles = fs.readdirSync(dirPath).filter(f => f.startsWith('day-') && f.endsWith('.json'));
      if (dayFiles.length > visualCount) {
        visualCount = dayFiles.length;
        hasVisuals = dayFiles.length >= 30;
      }
    }
  }

  // Now inspect lesson structure and word count across days 1 to 30
  let totalWordsSampled = 0;
  let daysSampled = 0;
  let samplePartsCount = 0;

  for (let d = 1; d <= 30; d++) {
    // Check long lesson first
    const longLesson = getLongLesson(prefix, d);
    if (longLesson && longLesson.parts && longLesson.parts.length > 0) {
      daysSampled++;
      samplePartsCount = longLesson.parts.length;
      let dayWords = 0;
      longLesson.parts.forEach(p => {
        if (p.say && Array.isArray(p.say)) {
          dayWords += p.say.join(' ').split(/\s+/).filter(Boolean).length;
        }
        if (p.example) dayWords += p.example.split(/\s+/).filter(Boolean).length;
        if (p.tryIt) dayWords += p.tryIt.split(/\s+/).filter(Boolean).length;
        if (p.check) {
          if (p.check.question) dayWords += p.check.question.split(/\s+/).filter(Boolean).length;
          const explanationText = p.check.why || (p.check as any).explanation;
          if (explanationText) dayWords += String(explanationText).split(/\s+/).filter(Boolean).length;
        }
      });
      totalWordsSampled += dayWords;
    } else {
      // Check pilot days
      const pilotPlan = resolvePilotDay(prefix, d);
      if (pilotPlan && pilotPlan.blocks) {
        daysSampled++;
        samplePartsCount = pilotPlan.blocks.length;
        let dayWords = 0;
        if (pilotPlan.overviewMetaphor) dayWords += pilotPlan.overviewMetaphor.split(/\s+/).filter(Boolean).length;
        pilotPlan.blocks.forEach((b: any) => {
          if (b.content) dayWords += b.content.split(/\s+/).filter(Boolean).length;
          if (b.media && Array.isArray(b.media)) {
            b.media.forEach((m: any) => {
              if (m.simpleExplanation) dayWords += m.simpleExplanation.split(/\s+/).filter(Boolean).length;
              if (m.metaphor) dayWords += m.metaphor.split(/\s+/).filter(Boolean).length;
            });
          }
          if (b.diagnosticCheck) {
            if (b.diagnosticCheck.question) dayWords += b.diagnosticCheck.question.split(/\s+/).filter(Boolean).length;
            if (b.diagnosticCheck.explanation) dayWords += b.diagnosticCheck.explanation.split(/\s+/).filter(Boolean).length;
          }
        });
        totalWordsSampled += dayWords;
      }
    }
  }

  const avgWords = daysSampled > 0 ? Math.round(totalWordsSampled / daysSampled) : 0;
  
  // Lesson duration calculation:
  // In professional pedagogy:
  // 1. Spoken audio narration speed: 130 words per minute.
  // 2. Reading + comprehension processing time: 150-180 words per minute.
  // 3. Hands-on coding & reflection (6 parts * 1.5 - 2 minutes per tryIt & diagnostic check) = 9 - 12 minutes.
  // Total Lesson Time = (Spoken lecture words / 130 wpm) + (hands-on active interaction: ~10 minutes).
  const spokenMinutes = avgWords > 0 ? avgWords / 130 : 0;
  const interactiveMinutes = samplePartsCount > 0 ? samplePartsCount * 1.8 : 10;
  const estimatedTotalMinutes = Math.round((spokenMinutes + interactiveMinutes) * 10) / 10;

  const durationCompliant = estimatedTotalMinutes >= 18 && estimatedTotalMinutes <= 25;

  let notes = '';
  if (hasVisuals) {
    notes = 'Built in Cert Track';
  } else {
    notes = 'Requires New Visuals';
  }

  results.push({
    index: idx + 1,
    id: cat.id,
    title: cat.title,
    category: cat.difficulty || 'All',
    prefix,
    hasExistingVisuals: hasVisuals,
    visualDaysCount: visualCount,
    sampleDayPartsCount: samplePartsCount,
    avgWordsPerDay: avgWords,
    estimatedMinutesPerDay: estimatedTotalMinutes,
    durationCompliant,
    notes
  });
});

console.log('COURSE-BY-COURSE DETAILED AUDIT TABLE:');
console.table(results.map(r => ({
  '#': r.index,
  'Course ID': r.id,
  'Prefix': r.prefix,
  'Visuals Status': r.hasExistingVisuals ? `✅ COMPLETE (${r.visualDaysCount}/30)` : `⏳ NEEDED (${r.visualDaysCount}/30)`,
  'Parts/Day': r.sampleDayPartsCount,
  'Words/Day': r.avgWordsPerDay,
  'Est. Duration': `${r.estimatedMinutesPerDay} min`,
  'Duration In Range (18-25m)': r.durationCompliant ? '✅ 18-25 min' : (r.estimatedMinutesPerDay < 18 ? '⚠️ <18 min' : '⚠️ >25 min'),
  'Origin': r.notes
})));

const alreadyBuiltCount = results.filter(r => r.hasExistingVisuals).length;
const needsBuildingCount = results.filter(r => !r.hasExistingVisuals).length;
const compliantDurationCount = results.filter(r => r.durationCompliant).length;

const reportData = {
  summary: {
    totalCourses: results.length,
    alreadyBuiltCount,
    needsBuildingCount,
    compliantDurationCount
  },
  courses: results
};

fs.writeFileSync(
  path.resolve(process.cwd(), 'docs/visuals/36_COURSES_DETAILED_AUDIT_REPORT.json'),
  JSON.stringify(reportData, null, 2),
  'utf8'
);

console.log('\n=== AUDIT SUMMARY ===');
console.log(`Total Courses Analyzed: ${results.length}`);
console.log(`Already Built Visuals (from Cert Tracks): ${alreadyBuiltCount} courses`);
console.log(`Need New Visuals to be Built:            ${needsBuildingCount} courses`);
console.log(`Duration in 18-25 min sweet spot:        ${compliantDurationCount}/${results.length} courses`);
console.log('Saved detailed audit report to docs/visuals/36_COURSES_DETAILED_AUDIT_REPORT.json');
