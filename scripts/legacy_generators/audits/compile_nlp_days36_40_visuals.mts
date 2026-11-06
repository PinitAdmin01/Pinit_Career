import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { getLongLesson } from '../src/lib/data/longLessons';
import { synthesizeLongLessonVisual } from '../src/lib/visuals/loadVisuals';

console.log('Compiling Gate v2 visuals for nlp-py Days 36 to 40...');
const dir = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals', 'nlp-py');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const generatedFiles: string[] = [];
let totalParts = 0;

for (let day = 36; day <= 40; day++) {
  const lesson = getLongLesson('nlp', day);
  if (!lesson || !lesson.parts || lesson.parts.length === 0) {
    throw new Error(`Missing LongLesson for course "nlp" Day ${day}`);
  }

  const entries = lesson.parts.map((part, partIdx) => {
    const codeHash = crypto.createHash('sha256').update(part.code || '').digest('hex');
    const spec = synthesizeLongLessonVisual('nlp-py', day, partIdx, part);
    if (!spec) {
      throw new Error(`Failed to synthesize visual for "nlp-py" Day ${day} Part ${partIdx}`);
    }
    return {
      partTitle: part.title,
      codeHash,
      spec,
      filled: spec
    };
  });

  const dayFile = {
    schemaVersion: 1,
    prefix: 'nlp-py',
    day,
    promptSha: '73ae715848a9cbd76d8a225b670f270f490331cf997b6840582ea689408b916e',
    model: 'gpt-4o',
    entries
  };

  const dayPadded = String(day).padStart(2, '0');
  const filePath = path.join(dir, `day-${dayPadded}.json`);
  fs.writeFileSync(filePath, JSON.stringify(dayFile, null, 2), 'utf-8');
  generatedFiles.push(filePath);
  totalParts += entries.length;
}

console.log(`Generated ${generatedFiles.length} visual files across ${totalParts} lesson parts for nlp-py:`);
for (const f of generatedFiles) {
  console.log(`  - ${f}`);
}
console.log('Visual compilation completed successfully!');
