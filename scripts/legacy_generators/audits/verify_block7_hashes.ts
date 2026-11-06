import crypto from 'node:crypto';
import fs from 'node:fs';
import { IOT_SEC_LONG_LESSONS } from '../src/lib/data/iotSecLongLessons';

let allMatch = true;
for (let day = 31; day <= 35; day++) {
  const lesson = IOT_SEC_LONG_LESSONS.find(l => l.day === day)!;
  const visualFile = JSON.parse(fs.readFileSync(`src/lib/data/lessonVisuals/iot_sec/day-${day}.json`, 'utf-8'));
  
  for (let pIdx = 0; pIdx < 5; pIdx++) {
    const part = lesson.parts[pIdx];
    const entry = visualFile.entries[pIdx];
    const expectedHash = crypto.createHash('sha256').update(part.code || '').digest('hex');
    const actualHash = entry.codeHash;
    if (expectedHash !== actualHash) {
      console.log(`MISMATCH Day ${day} Part ${pIdx + 1}: expected ${expectedHash}, actual ${actualHash}`);
      allMatch = false;
    } else {
      console.log(`MATCH Day ${day} Part ${pIdx + 1}`);
    }
  }
}

if (allMatch) {
  console.log('ALL 25 CODE HASHES MATCH 100%!');
}
