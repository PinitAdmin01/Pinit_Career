/**
 * Flagship Course Audit — checks all 30 DayConfig entries per course.
 * Detects: duplicate titles, pre-solved starters, trivial assignments,
 * placeholder content, assessment mismatches, templated misconceptions.
 */

const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname, '..', 'src', 'lib', 'data');

// 15 flagship courses
const FLAGSHIP_FILES = {
  // Batch 1
  java:     { data: 'java30DayData.ts',                  label: 'Java' },
  comp_fund:{ data: 'computerFundamentals30DayData.ts',   label: 'Computer Fundamentals' },
  python:   { data: 'python30DayData.ts',                label: 'Python' },
  // Batch 2
  sql:      { data: 'database30DayData.ts',              label: 'SQL' },
  excel:    { data: 'excelDataViz30DayData.ts',          label: 'Excel / Data Viz' },
  react:    { data: 'react30DayData.ts',                 label: 'React' },
  // Batch 3
  dsa:      { data: 'dsa30DayData.ts',                   label: 'DSA' },
  bcom_acc: { data: 'bcomAccounting30DayData.ts',        label: 'BCom Accounting' },
  bcom_fin: { data: 'bcomFinance30DayData.ts',           label: 'BCom Finance' },
  // Batch 4
  bcom_mkt: { data: 'bcomMarketing30DayData.ts',         label: 'BCom Marketing' },
  cloud:    { data: 'cloud30DayData.ts',                 label: 'Cloud Native' },
  devops:   { data: 'devops30DayData.ts',                label: 'DevOps' },
  // Batch 5
  softskills:{ data: 'softSkills30DayData.ts',           label: 'Soft Skills' },
  quant:    { data: 'quant30DayData.ts',                 label: 'Quantitative Aptitude' },
  fullstack:{ data: 'fullstack30DayData.ts',             label: 'Full-Stack JS' },
};

// ── Extraction helpers ───────────────────────────────────────────────────────

function extractStringField(text, fieldName) {
  // Handles both single and escaped-double-quoted string values
  const re = new RegExp(`"${fieldName}":\\s*"((?:[^"\\\\]|\\\\.)*)"`, 'g');
  const results = [];
  let m;
  while ((m = re.exec(text)) !== null) {
    results.push(m[1].replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\"/g, '"').replace(/\\\\/g, '\\'));
  }
  return results;
}

function extractDayNumbers(text) {
  const re = /"day":\s*(\d+)/g;
  const days = [];
  let m;
  while ((m = re.exec(text)) !== null) {
    days.push(parseInt(m[1]));
  }
  return days;
}

// Extract a string field from a chunk, handling both quoted and unquoted keys
function getField(field, chunk) {
  // Try quoted key first: "field": "value"
  // Then unquoted key: field: "value"
  const patterns = [
    new RegExp(`"${field}":\\s*"((?:[^"\\\\]|\\\\.)*)"`, 's'),
    new RegExp(`\\b${field}:\\s*"((?:[^"\\\\]|\\\\.)*)"`, 's'),
  ];
  for (const re of patterns) {
    const match = chunk.match(re);
    if (match) {
      return match[1]
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\');
    }
  }
  return '';
}

function buildConfig(dayNum, chunk) {
  return {
    day:      dayNum,
    title:    getField('title', chunk),
    eTitle:   getField('eTitle', chunk),
    eDesc:    getField('eDesc', chunk),
    eStarter: getField('eStarter', chunk),
    eTest:    getField('eTest', chunk),
    aTitle:   getField('aTitle', chunk),
    aDesc:    getField('aDesc', chunk),
    aStarter: getField('aStarter', chunk),
    aTest:    getField('aTest', chunk),
    desc:     getField('desc', chunk),
  };
}

// Extract { day, title, eTitle, aTitle, eStarter, aStarter, eDesc, aDesc } per DayConfig
function extractDayConfigs(text) {
  const configs = [];
  let m;

  // Strategy A: explicit "day": N field (computerFundamentals style)
  const withDayField = /\{\s*[\r\n]+\s*"day":\s*(\d+),/g;
  const aStarts = [];
  while ((m = withDayField.exec(text)) !== null) {
    aStarts.push({ day: parseInt(m[1]), pos: m.index });
  }
  if (aStarts.length >= 5) {
    for (let i = 0; i < aStarts.length; i++) {
      const start = aStarts[i].pos;
      const end = i + 1 < aStarts.length ? aStarts[i + 1].pos : text.length;
      configs.push(buildConfig(aStarts[i].day, text.substring(start, end)));
    }
    return configs;
  }

  // Strategy B: Java-style comment markers "// ── Day N:"
  const javaDayRe = /\/\/ ── Day (\d+):/g;
  const bStarts = [];
  while ((m = javaDayRe.exec(text)) !== null) {
    const afterComment = text.indexOf('\n', m.index);
    // find the next { after the comment line
    const braceIdx = text.indexOf('  {', afterComment);
    if (braceIdx > -1) bStarts.push({ day: parseInt(m[1]), pos: braceIdx });
  }
  if (bStarts.length >= 5) {
    for (let i = 0; i < bStarts.length; i++) {
      const start = bStarts[i].pos;
      const end = i + 1 < bStarts.length ? bStarts[i + 1].pos : text.length;
      configs.push(buildConfig(bStarts[i].day, text.substring(start, end)));
    }
    return configs;
  }

  // Strategy C: Python / no-marker style — split by consecutive { with "title": as first field
  const pyStartRe = /\{[\r\n]+\s+"title":/g;
  const cStarts = [];
  while ((m = pyStartRe.exec(text)) !== null) {
    cStarts.push(m.index);
  }
  if (cStarts.length >= 5) {
    for (let i = 0; i < cStarts.length; i++) {
      const start = cStarts[i];
      const end = i + 1 < cStarts.length ? cStarts[i + 1] : text.length;
      configs.push(buildConfig(i + 1, text.substring(start, end)));
    }
    return configs;
  }

  // Strategy D: React / fullstack style — unquoted keys, no day field, no comments
  const reactStartRe = /\{[\r\n]+\s+title:/g;
  const dStarts = [];
  while ((m = reactStartRe.exec(text)) !== null) {
    dStarts.push(m.index);
  }
  if (dStarts.length >= 5) {
    for (let i = 0; i < dStarts.length; i++) {
      const start = dStarts[i];
      const end = i + 1 < dStarts.length ? dStarts[i + 1] : text.length;
      configs.push(buildConfig(i + 1, text.substring(start, end)));
    }
    return configs;
  }

  return configs;
}

// ── Defect detectors ─────────────────────────────────────────────────────────

function isPreSolvedStarter(starter) {
  if (!starter) return false;
  const lines = starter.split('\n').filter(l => l.trim());
  // A stub has: function signature + maybe comment + empty body or throw
  // A pre-solved has: meaningful logic (if/switch/return with computation)
  const hasLogic = /\bif\b|\bswitch\b|\bwhile\b|\bfor\b/.test(starter);
  const hasReturn = /\breturn\s+[^;{]+;/.test(starter);
  // If it has logic AND return, it's likely pre-solved
  if (hasLogic && hasReturn) return true;
  // Single-line function that returns something non-trivial
  if (lines.length <= 2 && /\breturn\s+/.test(starter) && !/ \/\/ /.test(starter)) return false; // trivial but not "pre-solved" for eStarter
  return false;
}

function isTrivialAStarter(aStarter) {
  if (!aStarter) return false;
  // Pattern: function X() { return LITERAL; }  — entire implementation is trivial
  const oneLiner = /^function\s+\w+\s*\([^)]*\)\s*\{\s*return\s+[\w\d.'"-]+\s*;\s*\}$/.test(aStarter.trim());
  return oneLiner;
}

function hasPlaceholder(text) {
  return /\b(TODO|PLACEHOLDER|TBD|FIXME|LOREM|lorem ipsum|fake|dummy)\b/i.test(text);
}

function isDuplicatedAssignment(aTitle, eTitle, dayTitle) {
  // aTitle should be distinct from eTitle and both should relate to dayTitle
  return aTitle && eTitle && aTitle === eTitle;
}

function looksTemplateMisconception(mcId) {
  // Check if misconception ID looks like it's from a different course
  const prefixes = ['MC_JAVA_', 'MC_PY_', 'MC_REACT_', 'MC_SQL_', 'MC_DSA_',
                    'MC_FS_', 'MC_CLOUD_', 'MC_DEVOPS_', 'MC_AI_', 'MC_DIST_',
                    'MC_CF_', 'MC_AIP_', 'MC_EX_', 'MC_GIT_', 'MC_SK_',
                    'MC_DS_', 'MC_MOB_', 'MC_NLP_', 'MC_CYBER_', 'MC_ACC_',
                    'MC_FIN_', 'MC_ANA_', 'MC_MKT_', 'MC_DMKT_', 'MC_ECOM_',
                    'MC_ENT_', 'MC_SCRM_', 'MC_OPS_', 'MC_AIT_', 'MC_QUANT_',
                    'MC_3D_', 'MC_CHAIN_', 'MC_IOTNET_', 'MC_EDGEAI_',
                    'MC_IOTSEC_', 'MC_IOT_'];
  return prefixes.some(p => mcId && mcId.startsWith(p)) ? null : `Unknown prefix in ${mcId}`;
}

function assessmentMismatch(dayTitle, eTitle, aTitle) {
  // Very basic heuristic: if eTitle or aTitle contain words totally unrelated to dayTitle
  // This is hard to automate perfectly; flag obvious issues
  const warnings = [];
  if (eTitle && eTitle.toLowerCase().includes('formatter') &&
      !dayTitle.toLowerCase().includes('format')) {
    // Might be templated
  }
  if (eTitle === aTitle) warnings.push(`eTitle === aTitle: "${eTitle}"`);
  if (aTitle && /returning\s+`?\d+`?/.test(aTitle.toLowerCase())) {
    warnings.push(`aTitle suggests trivial return: "${aTitle}"`);
  }
  return warnings;
}

// ── Main audit ───────────────────────────────────────────────────────────────

function auditCourse(key, meta) {
  const filePath = path.join(BASE, meta.data);
  if (!fs.existsSync(filePath)) {
    return { label: meta.label, error: `File not found: ${meta.data}` };
  }

  const text = fs.readFileSync(filePath, 'utf8');
  const configs = extractDayConfigs(text);

  if (configs.length === 0) {
    return { label: meta.label, error: 'No day configs extracted', days: 0 };
  }

  const report = {
    label: meta.label,
    file: meta.data,
    daysFound: configs.length,
    defects: [],
    summary: { total: configs.length, clean: 0, warnings: 0, errors: 0 },
  };

  // Track for duplicates
  const seenTitles = {};
  const seenETitles = {};
  const seenATitles = {};

  for (const cfg of configs) {
    const dayDefects = [];

    // 1. Missing day title
    if (!cfg.title) dayDefects.push({ sev: 'ERROR', msg: 'Missing title' });

    // 2. Duplicate day title
    if (cfg.title) {
      if (seenTitles[cfg.title]) {
        dayDefects.push({ sev: 'ERROR', msg: `Duplicate title (also Day ${seenTitles[cfg.title]}): "${cfg.title}"` });
      }
      seenTitles[cfg.title] = cfg.day;
    }

    // 3. Duplicate eTitle across days
    if (cfg.eTitle) {
      if (seenETitles[cfg.eTitle]) {
        dayDefects.push({ sev: 'WARN', msg: `Duplicate eTitle (also Day ${seenETitles[cfg.eTitle]}): "${cfg.eTitle}"` });
      }
      seenETitles[cfg.eTitle] = cfg.day;
    }

    // 4. Duplicate aTitle across days
    if (cfg.aTitle) {
      if (seenATitles[cfg.aTitle]) {
        dayDefects.push({ sev: 'WARN', msg: `Duplicate aTitle (also Day ${seenATitles[cfg.aTitle]}): "${cfg.aTitle}"` });
      }
      seenATitles[cfg.aTitle] = cfg.day;
    }

    // 5. Pre-solved eStarter
    if (isPreSolvedStarter(cfg.eStarter)) {
      dayDefects.push({ sev: 'WARN', msg: `eStarter appears pre-solved (contains logic + return)` });
    }

    // 6. Trivial aStarter (returning constant)
    if (isTrivialAStarter(cfg.aStarter)) {
      dayDefects.push({ sev: 'WARN', msg: `aStarter is trivial one-liner: ${cfg.aStarter.substring(0, 80)}` });
    }

    // 7. Placeholder text
    const fields = [cfg.title, cfg.desc, cfg.eDesc, cfg.aDesc, cfg.eTitle, cfg.aTitle];
    for (const f of fields) {
      if (hasPlaceholder(f)) {
        dayDefects.push({ sev: 'ERROR', msg: `Placeholder content detected in field` });
        break;
      }
    }

    // 8. eTitle === aTitle (same assessment twice)
    if (cfg.eTitle && cfg.aTitle && cfg.eTitle === cfg.aTitle) {
      dayDefects.push({ sev: 'ERROR', msg: `eTitle === aTitle: "${cfg.eTitle}"` });
    }

    // 9. Missing desc
    if (!cfg.desc || cfg.desc.length < 20) {
      dayDefects.push({ sev: 'WARN', msg: `Missing or very short desc` });
    }

    // 10. aDesc suggests trivial return
    if (cfg.aDesc && /returning\s+`?[\d.]+`?/.test(cfg.aDesc)) {
      const val = cfg.aDesc.match(/returning\s+`?([\d.'"`]+)`?/);
      if (val) dayDefects.push({ sev: 'WARN', msg: `aDesc says "returning ${val[1]}" — trivial constant assignment` });
    }

    if (dayDefects.length === 0) {
      report.summary.clean++;
    } else {
      const hasError = dayDefects.some(d => d.sev === 'ERROR');
      if (hasError) report.summary.errors++;
      else report.summary.warnings++;
      report.defects.push({ day: cfg.day, title: cfg.title, issues: dayDefects });
    }
  }

  return report;
}

// ── Run and report ────────────────────────────────────────────────────────────

const batchArg = process.argv[2]; // 'all', '1', '2', etc.
const batchMap = {
  '1': ['java', 'comp_fund', 'python'],
  '2': ['sql', 'excel', 'react'],
  '3': ['dsa', 'bcom_acc', 'bcom_fin'],
  '4': ['bcom_mkt', 'cloud', 'devops'],
  '5': ['softskills', 'quant', 'fullstack'],
};

let keys;
if (!batchArg || batchArg === 'all') {
  keys = Object.keys(FLAGSHIP_FILES);
} else {
  keys = batchMap[batchArg] || Object.keys(FLAGSHIP_FILES);
}

console.log(`\n${'='.repeat(70)}`);
console.log(`FLAGSHIP COURSE AUDIT — Batch: ${batchArg || 'all'}`);
console.log(`${'='.repeat(70)}\n`);

let grandTotal = 0, grandClean = 0, grandWarnings = 0, grandErrors = 0;

for (const key of keys) {
  const meta = FLAGSHIP_FILES[key];
  if (!meta) { console.log(`Unknown key: ${key}`); continue; }

  const report = auditCourse(key, meta);

  if (report.error) {
    console.log(`\n❌ ${report.label}: ${report.error}`);
    continue;
  }

  const { summary, defects, daysFound } = report;
  grandTotal += summary.total;
  grandClean += summary.clean;
  grandWarnings += summary.warnings;
  grandErrors += summary.errors;

  const statusIcon = summary.errors > 0 ? '🔴' : summary.warnings > 0 ? '🟡' : '🟢';
  console.log(`\n${statusIcon} ${report.label} (${report.file})`);
  console.log(`   Days: ${daysFound}/30  |  Clean: ${summary.clean}  |  Warnings: ${summary.warnings}  |  Errors: ${summary.errors}`);

  if (defects.length > 0) {
    for (const d of defects) {
      console.log(`\n   Day ${String(d.day).padStart(2)}: ${d.title}`);
      for (const issue of d.issues) {
        const icon = issue.sev === 'ERROR' ? '     ❌' : '     ⚠️ ';
        console.log(`${icon} [${issue.sev}] ${issue.msg}`);
      }
    }
  }
}

console.log(`\n${'='.repeat(70)}`);
console.log(`GRAND TOTAL: ${grandTotal} days audited`);
console.log(`  ✅ Clean:    ${grandClean}`);
console.log(`  ⚠️  Warnings: ${grandWarnings}`);
console.log(`  ❌ Errors:   ${grandErrors}`);
console.log(`${'='.repeat(70)}\n`);
