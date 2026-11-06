import * as fs from 'fs';
import * as path from 'path';
import { COURSES_CATALOG } from '@/lib/data/coursesCatalog';
import { COURSES_REGISTRY } from '@/lib/data/coursesData';

const outPath = path.resolve(process.cwd(), 'scripts/course-curriculum-summary.json');

const summary = COURSES_CATALOG.map((cat, idx) => {
  const reg = COURSES_REGISTRY.find(c => c.id === cat.id);
  const quests = reg?.quests || [];

  // Group quests by week/block (Days 1-5, 6-10, 11-15, 16-20, 21-25, 26-30)
  const blocks: { blockNum: number; title: string; days: { day: number; title: string; desc: string }[] }[] = [];
  
  for (let b = 0; b < 6; b++) {
    const startDay = b * 5 + 1;
    const endDay = (b + 1) * 5;
    const blockQuests = quests.filter(q => {
      // Find quest matching day or slice
      return true;
    }).slice(b * 5, (b + 1) * 5);

    blocks.push({
      blockNum: b + 1,
      title: `Block ${b + 1} (Days ${startDay}–${endDay})`,
      days: blockQuests.map((q, dIdx) => ({
        day: startDay + dIdx,
        title: q.title || `Day ${startDay + dIdx}`,
        desc: q.desc?.slice(0, 150) || ''
      }))
    });
  }

  return {
    num: idx + 1,
    id: cat.id,
    title: cat.title,
    desc: cat.desc,
    difficulty: cat.difficulty,
    durationWeeks: cat.durationWeeks,
    totalQuests: quests.length,
    blocks
  };
});

fs.writeFileSync(outPath, JSON.stringify(summary, null, 2), 'utf-8');
console.log(`Saved comprehensive summary of all ${summary.length} courses to ${outPath}`);
