/**
 * Show eStarter + eHint + aStarter + aHint for all days in a course.
 */
const fs = require('fs');
const path = require('path');

const [,, courseFile] = process.argv;
const filePath = path.join(__dirname, '..', 'src', 'lib', 'data', courseFile);
const text = fs.readFileSync(filePath, 'utf8');

const starts = [];
const dr = /"day":\s*(\d+)/g;
let dm;
while ((dm = dr.exec(text)) !== null) starts.push({ day: parseInt(dm[1]), pos: dm.index });

function getField(chunk, field) {
  const re = new RegExp('"' + field + '":\\s*"((?:[^"\\\\]|\\\\.)*)"', 's');
  const m = chunk.match(re);
  return m ? m[1] : '';
}

function hasImpl(encoded) {
  const decoded = encoded.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\"/g, '"');
  const lines = decoded.split('\n').filter(l => l.trim() && !l.trim().startsWith('//'));
  const body = lines.filter(l => !/(^function |^class )/.test(l.trim()) && l.trim() !== '{' && l.trim() !== '}');
  return body.length > 0;
}

for (let i = 0; i < starts.length; i++) {
  const d = starts[i];
  const end = i + 1 < starts.length ? starts[i + 1].pos : text.length;
  const chunk = text.substring(d.pos, end);

  const eStarter = getField(chunk, 'eStarter');
  const eHint = getField(chunk, 'eHint');
  const aStarter = getField(chunk, 'aStarter');
  const aHint = getField(chunk, 'aHint');

  const eHasImpl = eStarter && hasImpl(eStarter);
  const aHasImpl = aStarter && hasImpl(aStarter);

  if (eHasImpl || aHasImpl) {
    console.log('\n=== Day ' + d.day + ' ===');
    if (eHasImpl) {
      console.log('eStarter (PRE-SOLVED):');
      console.log(eStarter.replace(/\\n/g, '\n').substring(0, 400));
      console.log('eHint: ' + eHint.replace(/\\n/g, ' ').substring(0, 150));
    }
    if (aHasImpl) {
      console.log('aStarter (PRE-SOLVED):');
      console.log(aStarter.replace(/\\n/g, '\n').substring(0, 300));
      console.log('aHint: ' + aHint.replace(/\\n/g, ' ').substring(0, 150));
    }
    console.log('---');
  }
}
