/**
 * Read full content of specific days for fixing.
 * Usage: node scripts/read-day.js <courseFile> <day1> [day2] ...
 */
const fs = require('fs');
const path = require('path');
const BASE = path.join(__dirname, '..', 'src', 'lib', 'data');

const [,, courseFile, ...dayArgs] = process.argv;
const targetDays = dayArgs.map(Number);
const filePath = path.join(BASE, courseFile);
const text = fs.readFileSync(filePath, 'utf8');

function extractDays(text) {
  // Try "day": N
  const dr = /"day":\s*(\d+)/g;
  const starts = [];
  let m;
  while ((m = dr.exec(text)) !== null) starts.push({ day: parseInt(m[1]), pos: m.index });
  if (starts.length >= 10) {
    return starts.map((s, i) => ({
      day: s.day,
      chunk: text.substring(s.pos, i + 1 < starts.length ? starts[i + 1].pos : text.length)
    }));
  }
  // Try object position (Python/React/Java)
  const arrMatch = text.match(/DayConfig(?:\[\])?\s*=\s*\[([\s\S]*)\];/);
  if (arrMatch) {
    const body = arrMatch[1];
    const objRe = /^\s{2}\{/gm;
    const starts2 = [];
    let m2;
    while ((m2 = objRe.exec(body)) !== null) starts2.push(m2.index);
    return starts2.map((s, i) => ({
      day: i + 1,
      chunk: body.substring(s, i + 1 < starts2.length ? starts2[i + 1] : body.length)
    }));
  }
  return [];
}

function getField(chunk, field) {
  const qRe = new RegExp('"' + field + '":\\s*"((?:[^"\\\\]|\\\\.)*)"', 's');
  let m = chunk.match(qRe);
  if (m) return m[1];
  const uRe = new RegExp('(?:^|\\s)' + field + ':\\s*"((?:[^"\\\\]|\\\\.)*)"', 'sm');
  m = chunk.match(uRe);
  return m ? m[1] : '';
}

const dec = s => s.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\"/g, '"');

const days = extractDays(text);
for (const d of days) {
  if (!targetDays.includes(d.day)) continue;
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Day ${d.day}`);
  console.log('='.repeat(60));
  const fields = ['title','desc','syllabus','eTitle','eDesc','eStarter','eHint','eTest','aTitle','aDesc','aStarter','aHint','aTest'];
  for (const f of fields) {
    const raw = getField(d.chunk, f);
    if (!raw) continue;
    const decoded = dec(raw);
    console.log(`\n[${f}] (${raw.length} chars):`);
    console.log(decoded);
  }
}
