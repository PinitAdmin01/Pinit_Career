/**
 * Debug: count test cases for each course's Day 1 eTest + aTest
 */
const fs = require('fs');
const path = require('path');
const BASE = path.join(__dirname, '..', 'src', 'lib', 'data');

function decode(s) {
  return s.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
}

function countTestCases(testStr) {
  if (!testStr) return 0;
  const raw = decode(testStr);
  const throwCount  = (raw.match(/throw new Error\(/g) || []).length;
  const assertCount = (raw.match(/\bassert\s+/g) || []).length;
  const toBeCount   = (raw.match(/\.toBe\(/g) || []).length;

  // SQL: count non-blank lines that are SQL statements
  const sqlLines = raw.split('\n').filter(l => l.trim() && /^(SELECT|INSERT|UPDATE|DELETE|PRAGMA|CREATE|DROP|ALTER)\b/i.test(l.trim())).length;

  return Math.max(throwCount, assertCount, toBeCount, sqlLines > 0 ? sqlLines : 0);
}

// Test with actual CF file
const cfText = fs.readFileSync(path.join(BASE, 'computerFundamentals30DayData.ts'), 'utf8');

// Extract days
const dr = /"day":\s*(\d+)/g;
const starts = [];
let m;
while ((m = dr.exec(cfText)) !== null) starts.push({ day: parseInt(m[1]), pos: m.index });

function getField(chunk, field) {
  const qRe = new RegExp('"' + field + '":\\s*"((?:[^"\\\\]|\\\\.)*)"', 's');
  const m2 = chunk.match(qRe);
  return m2 ? m2[1] : '';
}

console.log('CF eTest case counts:');
for (let i = 0; i < Math.min(5, starts.length); i++) {
  const end = i + 1 < starts.length ? starts[i + 1].pos : cfText.length;
  const chunk = cfText.substring(starts[i].pos, end);
  const eTest = getField(chunk, 'eTest');
  const aTest = getField(chunk, 'aTest');
  const dec = decode(eTest);
  const throwCount = (dec.match(/throw new Error\(/g) || []).length;
  console.log(`  Day ${starts[i].day}: eTest=${eTest.length}chars throwCount=${throwCount} eTestPreview=${dec.substring(0,80).replace(/\n/g,'↵')}`);
  console.log(`           aTest=${aTest.length}chars`);
}

// Check SQL
console.log('\nSQL eTest case counts:');
const sqlText = fs.readFileSync(path.join(BASE, 'database30DayData.ts'), 'utf8');
const sqlStarts = [];
let sm;
const sqlDr = /"day":\s*(\d+)/g;
while ((sm = sqlDr.exec(sqlText)) !== null) sqlStarts.push({ day: parseInt(sm[1]), pos: sm.index });
for (let i = 0; i < Math.min(5, sqlStarts.length); i++) {
  const end = i + 1 < sqlStarts.length ? sqlStarts[i + 1].pos : sqlText.length;
  const chunk = sqlText.substring(sqlStarts[i].pos, end);
  const eTest = getField(chunk, 'eTest');
  const dec = decode(eTest);
  const throwCount = (dec.match(/throw new Error\(/g) || []).length;
  const sqlLines = dec.split('\n').filter(l => l.trim() && /^(SELECT|INSERT|UPDATE|DELETE|PRAGMA|CREATE|DROP|ALTER)\b/i.test(l.trim())).length;
  console.log(`  Day ${sqlStarts[i].day}: eTest=${eTest.length}chars throws=${throwCount} sqlLines=${sqlLines}`);
  console.log('    Preview: ' + dec.substring(0,100).replace(/\n/g,'↵'));
}

// Check BCom Acc Day 1
console.log('\nBCom Acc eTest counts:');
const bAccText = fs.readFileSync(path.join(BASE, 'bcomAccounting30DayData.ts'), 'utf8');
const bAccStarts = [];
const badr = /"day":\s*(\d+)/g;
while ((m = badr.exec(bAccText)) !== null) bAccStarts.push({ day: parseInt(m[1]), pos: m.index });
for (let i = 0; i < Math.min(3, bAccStarts.length); i++) {
  const end = i + 1 < bAccStarts.length ? bAccStarts[i + 1].pos : bAccText.length;
  const chunk = bAccText.substring(bAccStarts[i].pos, end);
  const eTest = getField(chunk, 'eTest');
  const dec = decode(eTest);
  const throwCount = (dec.match(/throw new Error\(/g) || []).length;
  console.log(`  Day ${bAccStarts[i].day}: eTest=${eTest.length}chars throws=${throwCount}`);
  console.log('    ' + dec.substring(0,150).replace(/\n/g,'↵'));
}
