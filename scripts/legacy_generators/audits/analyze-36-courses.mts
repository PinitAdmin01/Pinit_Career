import * as fs from 'fs';
import * as path from 'path';
import { COURSES_CATALOG } from '@/lib/data/coursesCatalog';
import { COURSES_REGISTRY } from '@/lib/data/coursesData';
import { COURSE_ALLOWED_TEMPLATES } from '@/lib/visuals/gate';

const visualsDir = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals');
const existingVisualCourses = fs.readdirSync(visualsDir).filter(f => fs.statSync(path.join(visualsDir, f)).isDirectory());

console.log('=== 37 CATALOG COURSES DEEP ANALYSIS ===\n');

interface CourseAnalysis {
  num: number;
  id: string;
  title: string;
  durationWeeks: number;
  difficulty: string;
  hasVisualsDir: boolean;
  prefix: string;
  totalQuests: number;
  sampleQuestTitles: string[];
  category: string;
}

const analyses: CourseAnalysis[] = [];

COURSES_CATALOG.forEach((cat, idx) => {
  const reg = COURSES_REGISTRY.find(c => c.id === cat.id);
  const prefix = cat.id.replace('course-', '');
  const hasVisuals = existingVisualCourses.includes(prefix) || 
    (cat.id === 'course-react-web' && existingVisualCourses.includes('react-basics')) ||
    (cat.id === 'course-python-backend' && existingVisualCourses.includes('python')) ||
    (cat.id === 'course-quant-systems' && existingVisualCourses.includes('quant-py')) ||
    (cat.id === 'course-cybersecurity' && existingVisualCourses.includes('cyber')) ||
    (cat.id === 'course-cloud-native' && existingVisualCourses.includes('cloud')) ||
    (cat.id === 'course-distributed-sys' && existingVisualCourses.includes('dist')) ||
    (cat.id === 'course-ai-eng' && existingVisualCourses.includes('ai')) ||
    (cat.id === 'course-devops-cicd' && existingVisualCourses.includes('devops')) ||
    (cat.id === 'course-dsa-optim' && existingVisualCourses.includes('dsa-optim')) ||
    (cat.id === 'course-node-web' && existingVisualCourses.includes('node-web')) ||
    (cat.id === 'course-nlp' && existingVisualCourses.includes('nlp-py'));

  let category = 'Engineering / CS';
  if (cat.id.includes('bcom') || cat.id.includes('accounting') || cat.id.includes('finance') || 
      cat.id.includes('marketing') || cat.id.includes('ecommerce') || cat.id.includes('entrepreneurship') ||
      cat.id.includes('sales') || cat.id.includes('operations') || cat.id.includes('transformation') ||
      cat.id.includes('business-analytics')) {
    category = 'Commerce & Business (B.Com / BBA / MBA)';
  } else if (cat.id.includes('iot') || cat.id.includes('embedded') || cat.id.includes('edge-ai')) {
    category = 'IoT & Embedded Hardware';
  } else if (cat.id.includes('computer-fundamentals') || cat.id.includes('softskills') || 
             cat.id.includes('git') || cat.id.includes('excel') || cat.id.includes('prompt-literacy')) {
    category = 'Universal Foundational';
  } else if (cat.id.includes('3d') || cat.id.includes('blockchain') || cat.id.includes('mobile')) {
    category = 'Specialized Technology';
  }

  const quests = reg?.quests || [];
  const sampleTitles = quests.slice(0, 5).map(q => q.title);

  analyses.push({
    num: idx + 1,
    id: cat.id,
    title: cat.title,
    durationWeeks: cat.durationWeeks,
    difficulty: cat.difficulty,
    hasVisualsDir: hasVisuals,
    prefix,
    totalQuests: quests.length,
    sampleQuestTitles: sampleTitles,
    category
  });
});

console.log('SUMMARY TABLE:');
analyses.forEach(a => {
  const visTag = a.hasVisualsDir ? '✅ Existing Track Visuals' : '⏳ Needs Visual Architecture';
  console.log(`${a.num.toString().padStart(2, '0')}. [${a.id}] "${a.title}" | ${a.category} | ${a.totalQuests} quests | ${visTag}`);
});

console.log('\nBREAKDOWN BY CATEGORY:');
const cats: Record<string, number> = {};
analyses.forEach(a => {
  cats[a.category] = (cats[a.category] || 0) + 1;
});
console.table(cats);

console.log('\nBREAKDOWN BY VISUAL STATUS:');
const existingCount = analyses.filter(a => a.hasVisualsDir).length;
const needsCount = analyses.filter(a => !a.hasVisualsDir).length;
console.log(`Already has visual system from Phase 1 & 2 tracks: ${existingCount} courses`);
console.log(`Requires new visual specifications & templates:     ${needsCount} courses`);
