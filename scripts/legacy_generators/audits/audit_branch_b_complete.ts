import fs from 'fs';
import path from 'path';
import {
  getLongLesson,
  estimateSpokenMinutes,
  estimateActivityMinutes,
  estimateLessonMinutes,
} from '../src/lib/data/longLessons';

// Import all commerce and IoT courses directly to check their array length
import { BCOM_ACCOUNTING_LONG_LESSONS } from '../src/lib/data/bcomAccountingLongLessons';
import { BCOM_FINANCE_LONG_LESSONS } from '../src/lib/data/bcomFinanceLongLessons';
import { BCOM_LAW_LONG_LESSONS } from '../src/lib/data/bcomLawLongLessons';
import { BCOM_ENT_LONG_LESSONS } from '../src/lib/data/bcomEntLongLessons';
import { BCOM_SCRM_LONG_LESSONS } from '../src/lib/data/bcomScrmLongLessons';
import { BCOM_ECOM_LONG_LESSONS } from '../src/lib/data/bcomEcomLongLessons';
import { BCOM_DMKT_LONG_LESSONS } from '../src/lib/data/bcomDmktLongLessons';
import { BCOM_MKT_LONG_LESSONS } from '../src/lib/data/bcomMktLongLessons';
import { BCOM_BAN_LONG_LESSONS } from '../src/lib/data/bcomBanLongLessons';
import { BCOM_OPS_LONG_LESSONS } from '../src/lib/data/bcomOpsLongLessons';
import { BCOM_AIT_LONG_LESSONS } from '../src/lib/data/bcomAitLongLessons';
import { BCOM_TAX_LONG_LESSONS } from '../src/lib/data/bcomTaxLongLessons';
import { BCOM_AUD_LONG_LESSONS } from '../src/lib/data/bcomAudLongLessons';
import { BCOM_ANA_LONG_LESSONS } from '../src/lib/data/bcomAnaLongLessons';
import { IOT_EMB_LONG_LESSONS } from '../src/lib/data/iotEmbLongLessons';
import { IOT_EDGE_LONG_LESSONS } from '../src/lib/data/iotEdgeLongLessons';
import { IOT_NET_LONG_LESSONS } from '../src/lib/data/iotNetLongLessons';
import { IOT_SEC_LONG_LESSONS } from '../src/lib/data/iotSecLongLessons';

interface CourseTarget {
  name: string;
  prefix: string;
  visualDir: string;
  lessons: ReadonlyArray<any>;
}

const COURSES: CourseTarget[] = [
  { name: 'Financial Accounting (Course 22)', prefix: 'bcom-accounting', visualDir: 'bcom-accounting', lessons: BCOM_ACCOUNTING_LONG_LESSONS },
  { name: 'Corporate Finance (Course 23)', prefix: 'bcom-finance', visualDir: 'bcom-finance', lessons: BCOM_FINANCE_LONG_LESSONS },
  { name: 'Business & Corporate Law (Course 24)', prefix: 'bcom_law', visualDir: 'bcom_law', lessons: BCOM_LAW_LONG_LESSONS },
  { name: 'Entrepreneurship & Business Planning (Course 25)', prefix: 'bcom_ent', visualDir: 'bcom_ent', lessons: BCOM_ENT_LONG_LESSONS },
  { name: 'Supply Chain & Logistics Management (Course 26)', prefix: 'bcom_scrm', visualDir: 'bcom_scrm', lessons: BCOM_SCRM_LONG_LESSONS },
  { name: 'E-Commerce & Retail Management (Course 27)', prefix: 'bcom_ecom', visualDir: 'bcom_ecom', lessons: BCOM_ECOM_LONG_LESSONS },
  { name: 'Digital Marketing & Analytics (Course 28 - DMKT)', prefix: 'bcom_dmkt', visualDir: 'bcom_dmkt', lessons: BCOM_DMKT_LONG_LESSONS },
  { name: 'Marketing Strategy & Brand Equity (Course 28 - MKT)', prefix: 'bcom-marketing', visualDir: 'bcom-marketing', lessons: BCOM_MKT_LONG_LESSONS },
  { name: 'Banking & Financial Services (Course 29)', prefix: 'bcom_ban', visualDir: 'bcom_ban', lessons: BCOM_BAN_LONG_LESSONS },
  { name: 'Operations Management & TQM (Course 30)', prefix: 'bcom_ops', visualDir: 'bcom_ops', lessons: BCOM_OPS_LONG_LESSONS },
  { name: 'AI, ERP & Tech in Business (Course 31)', prefix: 'bcom_ait', visualDir: 'bcom_ait', lessons: BCOM_AIT_LONG_LESSONS },
  { name: 'Taxation & GST', prefix: 'bcom_tax', visualDir: 'bcom_tax', lessons: BCOM_TAX_LONG_LESSONS },
  { name: 'Auditing & Assurance', prefix: 'bcom_aud', visualDir: 'bcom_aud', lessons: BCOM_AUD_LONG_LESSONS },
  { name: 'Business Analytics & Forecasting', prefix: 'bcom_ana', visualDir: 'bcom_ana', lessons: BCOM_ANA_LONG_LESSONS },
  { name: 'IoT Embedded Systems & MCU', prefix: 'iot_emb', visualDir: 'iot_emb', lessons: IOT_EMB_LONG_LESSONS },
  { name: 'IoT Edge Computing & TinyML', prefix: 'iot_edge', visualDir: 'iot_edge', lessons: IOT_EDGE_LONG_LESSONS },
  { name: 'IoT Networking & Wireless Protocols', prefix: 'iot_net', visualDir: 'iot_net', lessons: IOT_NET_LONG_LESSONS },
  { name: 'IoT Security & Hardware Integrity', prefix: 'iot_sec', visualDir: 'iot_sec', lessons: IOT_SEC_LONG_LESSONS },
];

function countWords(str: string): number {
  return str.split(/\s+/).filter(Boolean).length;
}

function runAudit() {
  console.log('='.repeat(80));
  console.log('INDEPENDENT 3RD-PERSON OBJECTIVE AUDIT: BRANCH B CURRICULUM');
  console.log('='.repeat(80));

  const visualBasePath = path.resolve(__dirname, '../src/lib/data/lessonVisuals');

  const summaryRows: any[] = [];

  for (const c of COURSES) {
    const totalDays = c.lessons.length;
    const dayNumbers = c.lessons.map((l) => l.day).sort((a, b) => a - b);
    
    // Check visuals
    const courseVisualDir = path.join(visualBasePath, c.visualDir);
    let visualCount = 0;
    const missingVisualDays: number[] = [];
    if (fs.existsSync(courseVisualDir)) {
      const files = fs.readdirSync(courseVisualDir).filter(f => f.endsWith('.json'));
      visualCount = files.length;
      for (let d = 1; d <= 30; d++) {
        const padded = `day-${String(d).padStart(2, '0')}.json`;
        const unpadded = `day-${d}.json`;
        if (!fs.existsSync(path.join(courseVisualDir, padded)) && !fs.existsSync(path.join(courseVisualDir, unpadded))) {
          missingVisualDays.push(d);
        }
      }
    } else {
      missingVisualDays.push(...Array.from({ length: 30 }, (_, i) => i + 1));
    }

    // Inspect lessons
    let daysWithPartCountMismatch: { day: number; count: number }[] = [];
    let daysWithMinutesMismatch: { day: number; minutes: number }[] = [];
    let daysWithLowSpokenTime: { day: number; spokenMin: number; sayWords: number }[] = [];
    let daysWithLowTotalEst: { day: number; totalEst: number }[] = [];
    let totalSayWords = 0;
    let minSpokenMin = 999;
    let maxSpokenMin = 0;
    let minLessonEst = 999;
    let maxLessonEst = 0;

    for (const l of c.lessons) {
      if (!l.parts || l.parts.length !== 5) {
        daysWithPartCountMismatch.push({ day: l.day, count: l.parts?.length ?? 0 });
      }

      // Check stated minutes field
      if (l.minutes < 35 || l.minutes > 40) {
        daysWithMinutesMismatch.push({ day: l.day, minutes: l.minutes });
      }

      // Avatar speech words (say array only)
      const sayWords = (l.parts || []).reduce((acc: number, p: any) => {
        const pSay = Array.isArray(p.say) ? p.say.join(' ') : (p.say || '');
        return acc + countWords(pSay);
      }, 0);

      // System estimation (longLessons.ts estimateSpokenMinutes)
      const sysSpokenMin = estimateSpokenMinutes(l);
      const sysTotalEst = estimateLessonMinutes(l);

      // Avatar speak min at 130 wpm
      const avatarSpeakMin = Math.round((sayWords / 130) * 10) / 10;

      if (sysSpokenMin < 20 && avatarSpeakMin < 20) {
        daysWithLowSpokenTime.push({ day: l.day, spokenMin: sysSpokenMin, sayWords });
      }

      if (sysTotalEst < 35 || sysTotalEst > 45) {
        daysWithLowTotalEst.push({ day: l.day, totalEst: sysTotalEst });
      }

      totalSayWords += sayWords;
      if (sysSpokenMin < minSpokenMin) minSpokenMin = sysSpokenMin;
      if (sysSpokenMin > maxSpokenMin) maxSpokenMin = sysSpokenMin;
      if (sysTotalEst < minLessonEst) minLessonEst = sysTotalEst;
      if (sysTotalEst > maxLessonEst) maxLessonEst = sysTotalEst;
    }

    const avgSayWordsPerDay = totalDays > 0 ? Math.round(totalSayWords / totalDays) : 0;
    const avgSpokenMinAt130Wpm = Math.round((avgSayWordsPerDay / 130) * 10) / 10;

    const is30Days = totalDays === 30;
    const is30Visuals = visualCount >= 30;
    const hasPartDefects = daysWithPartCountMismatch.length > 0;
    const hasLowSpoken = daysWithLowSpokenTime.length > 0;
    const hasMinutesFieldMismatch = daysWithMinutesMismatch.length > 0;

    summaryRows.push({
      name: c.name,
      prefix: c.prefix,
      totalDays,
      visualCount,
      is30Days,
      is30Visuals,
      avgSayWordsPerDay,
      avgSpokenMinAt130Wpm,
      minSpokenMin: totalDays > 0 ? minSpokenMin : 0,
      maxSpokenMin: totalDays > 0 ? maxSpokenMin : 0,
      minLessonEst: totalDays > 0 ? minLessonEst : 0,
      maxLessonEst: totalDays > 0 ? maxLessonEst : 0,
      partCountDefects: daysWithPartCountMismatch,
      minutesFieldDefects: daysWithMinutesMismatch,
      lowSpokenDays: daysWithLowSpokenTime,
      missingVisualDaysCount: missingVisualDays.length,
    });
  }

  // Print summary table
  console.log('\n--- COURSE SUMMARY TABLE ---');
  console.log(
    'Course'.padEnd(42) +
    'Days'.padEnd(8) +
    'Visuals'.padEnd(10) +
    'Avg Say Words'.padEnd(16) +
    'Avg Spoken Min'.padEnd(16) +
    'Spoken Range'.padEnd(16) +
    'Status'
  );
  console.log('-'.repeat(120));

  let fullyCompleteCount = 0;
  let incompleteCount = 0;

  for (const row of summaryRows) {
    const status = (row.is30Days && row.visualCount >= 30 && row.partCountDefects.length === 0)
      ? '30/30 COMPLETE'
      : `INCOMPLETE (${row.totalDays}/30)`;
    
    if (status === '30/30 COMPLETE') fullyCompleteCount++;
    else incompleteCount++;

    console.log(
      row.name.padEnd(42) +
      `${row.totalDays}/30`.padEnd(8) +
      `${row.visualCount}/30`.padEnd(10) +
      `${row.avgSayWordsPerDay}`.padEnd(16) +
      `~${row.avgSpokenMinAt130Wpm} min`.padEnd(16) +
      `${row.minSpokenMin}-${row.maxSpokenMin} min`.padEnd(16) +
      status
    );
  }

  console.log('\n' + '='.repeat(80));
  console.log(`TOTAL COURSES AUDITED: ${summaryRows.length}`);
  console.log(`COURSES WITH 30/30 DAYS & VISUALS: ${fullyCompleteCount}`);
  console.log(`COURSES WITH DEFICIENT DAYS (<30): ${incompleteCount}`);
  console.log('='.repeat(80));

  // Print detailed defects per course
  console.log('\n--- DETAILED DEFECT BREAKDOWN ---');
  for (const row of summaryRows) {
    console.log(`\n▶ [${row.name}] (${row.prefix}):`);
    console.log(`  - Days Authored: ${row.totalDays} / 30 ${row.is30Days ? '✅' : '❌ DEFICIENT (-' + (30 - row.totalDays) + ' days)'}`);
    console.log(`  - Visual Files: ${row.visualCount} / 30 ${row.visualCount >= 30 ? '✅' : '❌ DEFICIENT (-' + (30 - row.visualCount) + ' files)'}`);
    console.log(`  - Average Spoken Words: ${row.avgSayWordsPerDay} words (~${row.avgSpokenMinAt130Wpm} min at 130 wpm)`);
    console.log(`  - System Spoken Minutes Range: ${row.minSpokenMin} to ${row.maxSpokenMin} min`);
    
    if (row.partCountDefects.length > 0) {
      console.log(`  - ⚠️ Part Count Mismatches (!=5 parts): ${JSON.stringify(row.partCountDefects)}`);
    } else {
      console.log(`  - Part Count: All ${row.totalDays} days have exactly 5 parts ✅`);
    }

    if (row.minutesFieldDefects.length > 0) {
      console.log(`  - ⚠️ Declared 'minutes' outside [35, 40]: ${row.minutesFieldDefects.length} days (e.g. ${JSON.stringify(row.minutesFieldDefects.slice(0, 5))})`);
    } else {
      console.log(`  - Declared 'minutes': All within [35, 40] min ✅`);
    }

    if (row.lowSpokenDays.length > 0) {
      console.log(`  - ⚠️ Days where spoken < 20 min: ${row.lowSpokenDays.length} days (${JSON.stringify(row.lowSpokenDays.slice(0, 5))})`);
    } else {
      console.log(`  - Spoken Duration: All days meet >= 20 min threshold ✅`);
    }
  }
  // Save JSON and Markdown directly
  fs.writeFileSync(path.resolve(__dirname, 'audit_summary.json'), JSON.stringify(summaryRows, null, 2), 'utf-8');
  console.log('Saved audit_summary.json successfully.');
}

runAudit();
