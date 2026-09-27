/**
 * Sample fields from all 15 courses to understand formats + eTest structure.
 */
const fs = require('fs');
const path = require('path');
const BASE = path.join(__dirname, '..', 'src', 'lib', 'data');

const COURSES = [
  { file: 'java30DayData.ts', name: 'Java', format: 'unquoted' },
  { file: 'computerFundamentals30DayData.ts', name: 'CF', format: 'quoted' },
  { file: 'python30DayData.ts', name: 'Python', format: 'unquoted' },
  { file: 'database30DayData.ts', name: 'SQL', format: 'quoted' },
  { file: 'excelDataViz30DayData.ts', name: 'Excel', format: 'quoted' },
  { file: 'react30DayData.ts', name: 'React', format: 'unquoted' },
  { file: 'dsa30DayData.ts', name: 'DSA', format: 'quoted' },
  { file: 'bcomAccounting30DayData.ts', name: 'BCom Acc', format: 'quoted' },
  { file: 'bcomFinance30DayData.ts', name: 'BCom Fin', format: 'quoted' },
  { file: 'bcomMarketing30DayData.ts', name: 'BCom Mkt', format: 'quoted' },
  { file: 'cloud30DayData.ts', name: 'Cloud', format: 'quoted' },
  { file: 'devops30DayData.ts', name: 'DevOps', format: 'quoted' },
  { file: 'softSkills30DayData.ts', name: 'Soft Skills', format: 'quoted' },
  { file: 'quant30DayData.ts', name: 'Quant', format: 'quoted' },
  { file: 'fullstack30DayData.ts', name: 'Fullstack', format: 'quoted' },
];

function getField(chunk, field) {
  // Try quoted: "field": "value"
  const qRe = new RegExp('"' + field + '":\\s*"((?:[^"\\\\]|\\\\.)*)"', 's');
  let m = chunk.match(qRe);
  if (m) return m[1];
  // Try unquoted: field: "value"
  const uRe = new RegExp('\\b' + field + ':\\s*"((?:[^"\\\\]|\\\\.)*)"', 's');
  m = chunk.match(uRe);
  if (m) return m[1];
  return '';
}

function extractDayChunks(text) {
  const chunks = [];
  // Strategy A: "day": N
  let dr = /"day":\s*(\d+)/g;
  let starts = [];
  let m;
  while ((m = dr.exec(text)) !== null) starts.push({ day: parseInt(m[1]), pos: m.index });
  if (starts.length >= 10) {
    for (let i = 0; i < starts.length; i++) {
      const end = i + 1 < starts.length ? starts[i + 1].pos : text.length;
      chunks.push({ day: starts[i].day, chunk: text.substring(starts[i].pos, end) });
    }
    return chunks;
  }
  // Strategy B: day: N, (unquoted)
  dr = /\bday:\s*(\d+),/g;
  starts = [];
  while ((m = dr.exec(text)) !== null) starts.push({ day: parseInt(m[1]), pos: m.index });
  if (starts.length >= 10) {
    for (let i = 0; i < starts.length; i++) {
      const end = i + 1 < starts.length ? starts[i + 1].pos : text.length;
      chunks.push({ day: starts[i].day, chunk: text.substring(starts[i].pos, end) });
    }
    return chunks;
  }
  return chunks;
}

for (const course of COURSES) {
  const text = fs.readFileSync(path.join(BASE, course.file), 'utf8');
  const dayChunks = extractDayChunks(text);
  console.log('\n=== ' + course.name + ' (' + dayChunks.length + ' days extracted) ===');
  if (dayChunks.length === 0) {
    console.log('  !! Could not extract days');
    // Show first 300 chars to understand format
    console.log(text.substring(0, 300));
    continue;
  }
  const d1 = dayChunks[0];
  const fields = ['title', 'desc', 'eTitle', 'eDesc', 'eTest', 'aTitle', 'aDesc', 'aTest', 'eHint', 'aHint'];
  for (const f of fields) {
    const val = getField(d1.chunk, f);
    const decoded = val.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
    const preview = decoded.substring(0, 120).replace(/\n/g, '↵');
    console.log('  ' + f + ' (' + val.length + ' chars): ' + preview);
  }
}
