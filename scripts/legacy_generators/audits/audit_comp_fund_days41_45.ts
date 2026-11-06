import { COMP_FUND_LONG_LESSONS } from '../src/lib/data/compFundLongLessons';
import { executeBashSuite } from '../src/lib/code/runners/bashRunner';
import * as fs from 'fs';
import * as crypto from 'crypto';

async function runAudit() {
  for (let d = 41; d <= 45; d++) {
    const lesson = COMP_FUND_LONG_LESSONS.find((l) => l.day === d);
    if (!lesson) throw new Error(`Missing Day ${d} in COMP_FUND_LONG_LESSONS`);
    if (lesson.parts.length !== 5) throw new Error(`Day ${d} does not have 5 parts`);

    const visPath = `src/lib/data/lessonVisuals/comp_fund/day-${d}.json`;
    const vis = JSON.parse(fs.readFileSync(visPath, 'utf-8'));

    let dayWords = 0;
    for (let i = 0; i < 5; i++) {
      const p = lesson.parts[i];
      const words = p.say.join(' ').trim().split(/\s+/).length;
      if (words < 580) throw new Error(`Day ${d} Part ${i + 1} has only ${words} words (< 580)`);
      dayWords += words;

      const res = await executeBashSuite(p.code, []);
      if (!res.allPassed) {
        throw new Error(`Day ${d} Part ${i + 1} bash failed: ${res.error}`);
      }
      if ((res.stdout || '').trim() !== p.output.trim()) {
        throw new Error(`Day ${d} Part ${i + 1} output mismatch!\nExpected:\n${p.output.trim()}\nActual:\n${(res.stdout || '').trim()}`);
      }

      const norm = p.code.trim().split(/\r?\n/).map((l) => l.trimEnd()).join('\n');
      const expectedHash = crypto.createHash('sha256').update(norm, 'utf-8').digest('hex');
      if (vis.entries[i].codeHash !== expectedHash) {
        throw new Error(`Day ${d} Part ${i + 1} visual codeHash mismatch!`);
      }
    }
    const min = (dayWords / 120).toFixed(1);
    console.log(`PASS Day ${d}: ${dayWords} words (${min} spoken min) — all 5 parts verified!`);
  }
  console.log('ALL 6 CYCLES OF 3RD-PERSON BACKTRACKING AUDIT PASSED 100%!');
}

runAudit().catch((e) => {
  console.error(e);
  process.exit(1);
});
