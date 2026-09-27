/**
 * Inspect eStarters for specified course and days.
 * Usage: node scripts/inspect-starters.js <courseFile> <day1> [day2] ...
 */

const fs = require('fs');
const path = require('path');

const [,, courseFile, ...dayArgs] = process.argv;
const targetDays = dayArgs.map(Number);

const filePath = path.join(__dirname, '..', 'src', 'lib', 'data', courseFile);
const text = fs.readFileSync(filePath, 'utf8');

const starts = [];
const dr = /"day":\s*(\d+)/g;
let dm;
while ((dm = dr.exec(text)) !== null) starts.push({ day: parseInt(dm[1]), pos: dm.index });

for (let i = 0; i < starts.length; i++) {
  const d = starts[i];
  if (targetDays.length > 0 && !targetDays.includes(d.day)) continue;
  const end = i + 1 < starts.length ? starts[i + 1].pos : text.length;
  const chunk = text.substring(d.pos, end);

  const getField = (field) => {
    const re = new RegExp('"' + field + '":\\s*"((?:[^"\\\\]|\\\\.)*)"', 's');
    const m = chunk.match(re);
    return m ? m[1] : '';
  };

  const eStarter = getField('eStarter');
  const aStarter = getField('aStarter');
  const eHint = getField('eHint');

  if (eStarter || aStarter) {
    console.log('\n=== Day ' + d.day + ' ===');
    if (eStarter) {
      console.log('eStarter:');
      console.log(eStarter.replace(/\\n/g, '\n').replace(/\\t/g, '\t').substring(0, 600));
    }
    if (aStarter) {
      console.log('aStarter:');
      console.log(aStarter.replace(/\\n/g, '\n').replace(/\\t/g, '\t').substring(0, 300));
    }
    console.log('---');
  }
}
