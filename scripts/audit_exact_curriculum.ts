import { getLongLesson } from '../src/lib/data/longLessons';
import fs from 'fs';

const content = fs.readFileSync('src/lib/data/longLessons.ts', 'utf8');
const match = content.match(/const LONG_LESSON_SOURCES: Record<string, ReadonlyArray<LongLesson>> = {([\s\S]*?)};/);

if (match) {
  const lines = match[1].split('\n').filter(l => l.includes(':'));
  const entries: { key: string; arrName: string }[] = [];
  for (const l of lines) {
    const parts = l.split(':');
    const key = parts[0].trim().replace(/['"]/g, '');
    const arrName = parts[1].trim().replace(/,/g, '');
    entries.push({ key, arrName });
  }

  console.log('| # | Course Prefix | Source Array | Authored Days | Target (60d) | % Complete | Status |');
  console.log('|---|---|---|---|---|---|---|');
  let totalDays = 0;
  const seenArrays = new Set<string>();
  let idx = 1;
  let fullCount = 0;
  let month1Count = 0;
  let partialCount = 0;

  for (const { key, arrName } of entries) {
    if (seenArrays.has(arrName)) {
      continue;
    }
    seenArrays.add(arrName);
    let count = 0;
    for (let d = 1; d <= 60; d++) {
      if (getLongLesson(key, d)) count++;
    }
    totalDays += count;
    const pct = ((count / 60) * 100).toFixed(1);
    let status = '';
    if (count === 60) {
      status = '🏆 100% COMPLETE';
      fullCount++;
    } else if (count >= 30) {
      status = `⚡ Month 1 Complete (${count}d)`;
      month1Count++;
    } else {
      status = `🔄 Partial (${count}d)`;
      partialCount++;
    }
    console.log(`| ${idx++} | \`${key}\` | \`${arrName}\` | ${count} | 60 | ${pct}% | ${status} |`);
  }

  const grandTotalTarget = seenArrays.size * 60;
  const grandPct = ((totalDays / grandTotalTarget) * 100).toFixed(1);

  console.log(`\n=== EXECUTIVE AUDIT SUMMARY ===`);
  console.log(`- Distinct Courses Tracked in LongLessons: ${seenArrays.size}`);
  console.log(`- Fully Complete (60/60 Days): ${fullCount}`);
  console.log(`- Month 1 Complete (>= 30 Days): ${month1Count}`);
  console.log(`- In Early Development (< 30 Days): ${partialCount}`);
  console.log(`- Total Authored Days: ${totalDays} / ${grandTotalTarget} (${grandPct}%)`);
  console.log(`- Total Remaining Days: ${grandTotalTarget - totalDays} days`);
}
