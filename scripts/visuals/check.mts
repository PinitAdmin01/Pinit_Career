import fs from 'node:fs';
import path from 'node:path';
import { checkDayFile } from '@/lib/visuals/gate';

export interface CheckResult {
  passed: boolean;
  pictureCount: number;
  noneCount: number;
  totalEntries: number;
  errors: string[];
}

export function checkDay(
  course: string,
  day: number,
  manifestPath?: string
): CheckResult {
  const dayPadded = String(day).padStart(2, '0');
  const filePath = path.resolve(
    process.cwd(),
    `src/lib/data/lessonVisuals/${course}/day-${dayPadded}.json`
  );

  if (!fs.existsSync(filePath)) {
    return {
      passed: false,
      pictureCount: 0,
      noneCount: 0,
      errors: [`Day file not found at: ${filePath}`],
    };
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch (err: any) {
    return {
      passed: false,
      pictureCount: 0,
      noneCount: 0,
      errors: [`Failed to parse day file: ${err?.message || err}`],
    };
  }

  const gateResult = checkDayFile(filePath, { manifestPath });

  let pictureCount = 0;
  let noneCount = 0;
  if (Array.isArray(parsed?.entries)) {
    for (const entry of parsed.entries) {
      if (entry?.spec?.template === 'none') {
        noneCount++;
      } else if (entry?.spec?.template) {
        pictureCount++;
      }
    }
  }

  // [FIX-STAGE: VisualCheck Entry Count] Report actual entry count rather than hardcoded /6.
  const totalEntries = Array.isArray(parsed?.entries) ? parsed.entries.length : 0;

  return {
    passed: gateResult.passed,
    pictureCount,
    noneCount,
    totalEntries,
    errors: gateResult.errors,
  };
}

export async function main() {
  const args = process.argv.slice(2);
  let course = '';
  let day = 0;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--course' && i + 1 < args.length) {
      course = args[++i];
    } else if (arg.startsWith('--course=')) {
      course = arg.slice('--course='.length);
    } else if (arg === '--day' && i + 1 < args.length) {
      day = parseInt(args[++i], 10);
    } else if (arg.startsWith('--day=')) {
      day = parseInt(arg.slice('--day='.length), 10);
    }
  }

  if (!course || !day) {
    console.error('Usage: npm run visuals:check -- --course <prefix> --day <N>');
    process.exit(1);
  }

  const result = checkDay(course, day);

  if (!result.passed) {
    console.log('FAIL');
    for (const err of result.errors) {
      console.log(err);
    }
    process.exit(1);
  }

  console.log(`PASS ${result.pictureCount}/${result.totalEntries} (none: ${result.noneCount})`);
  process.exit(0);
}

if (process.argv[1]?.replace(/\\/g, '/').endsWith('scripts/visuals/check.mts')) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
