/**
 * Batch 4 starter fix — BCom Marketing, Cloud Native, DevOps.
 *
 * BCom Marketing: regex trivial aStarters + targeted eStarters (Days 7, 25)
 * Cloud Native + DevOps: stub ALL pre-solved eStarters and aStarters.
 */

const fs = require('fs');
const path = require('path');
const BASE = path.join(__dirname, '..', 'src', 'lib', 'data');

// ── Stub engine (same as fix-dsa-starters.js) ───────────────────────────────

function findMatchingBrace(code, openPos) {
  let depth = 1;
  let i = openPos + 1;
  while (i < code.length && depth > 0) {
    if (code[i] === '{') depth++;
    else if (code[i] === '}') depth--;
    i++;
  }
  return i - 1;
}

function stubClassMethods(code, hint) {
  const classOpenIdx = code.indexOf('{');
  if (classOpenIdx === -1) return code;
  const classClose = findMatchingBrace(code, classOpenIdx);
  const classBody = code.substring(classOpenIdx + 1, classClose);

  const methodRe = /(\s*(?:async\s+)?(?:\w+)\s*\([^)]*\)\s*)\{/g;
  const parts = [];
  let lastEnd = 0;
  let m;
  while ((m = methodRe.exec(classBody)) !== null) {
    const methodOpenInBody = m.index + m[0].length - 1;
    const methodClose = findMatchingBrace(classBody, methodOpenInBody);
    parts.push(classBody.substring(lastEnd, m.index));
    parts.push(m[1] + `{\n    // ${hint}\n    \n  }`);
    lastEnd = methodClose + 1;
    methodRe.lastIndex = lastEnd;
  }
  parts.push(classBody.substring(lastEnd));
  return code.substring(0, classOpenIdx + 1) + parts.join('') + '\n}';
}

function stubAdditional(code, hint) {
  const code_t = code.trim();
  const isClass = /^class\s+/.test(code_t);
  const openBraceIdx = code_t.indexOf('{');
  if (openBraceIdx === -1) return code_t;
  const sig = code_t.substring(0, openBraceIdx);
  const closeBraceIdx = findMatchingBrace(code_t, openBraceIdx);
  const after = code_t.substring(closeBraceIdx + 1).trim();
  let stubbed = isClass
    ? stubClassMethods(code_t.substring(0, closeBraceIdx + 1), hint)
    : sig + `{\n  // ${hint}\n  \n}`;
  if (after) stubbed += '\n' + stubAdditional(after, hint);
  return stubbed;
}

function stubCode(encoded, hint) {
  if (!encoded || encoded.length < 5) return encoded;
  const decoded = encoded
    .replace(/\\n/g, '\n').replace(/\\t/g, '\t')
    .replace(/\\"/g, '"').replace(/\\\\/g, '\\');

  const isClass = /^class\s+/.test(decoded.trim());
  const openBraceIdx = decoded.indexOf('{');
  if (openBraceIdx === -1) return encoded;

  const sig = decoded.substring(0, openBraceIdx);
  const closeBraceIdx = findMatchingBrace(decoded, openBraceIdx);
  const afterTopLevel = decoded.substring(closeBraceIdx + 1).trim();

  let stubbed = isClass
    ? stubClassMethods(decoded.substring(0, closeBraceIdx + 1), hint)
    : sig + `{\n  // ${hint}\n  \n}`;

  if (afterTopLevel) stubbed += '\n' + stubAdditional(afterTopLevel, hint);

  return stubbed
    .replace(/\\/g, '\\\\').replace(/"/g, '\\"')
    .replace(/\n/g, '\\n').replace(/\t/g, '\\t');
}

function hasImplementation(encoded) {
  const decoded = encoded
    .replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\"/g, '"');
  const lines = decoded.split('\n').filter(l => l.trim() && !l.trim().startsWith('//'));
  const body = lines.filter(l =>
    !/(^function\s|^async\s+function\s|^class\s)/.test(l.trim()) &&
    l.trim() !== '{' && l.trim() !== '}'
  );
  return body.length > 0;
}

// ── Generic course stubber ───────────────────────────────────────────────────

function stubCourse(filePath, courseName) {
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

  let result = text;
  let fixedE = 0, fixedA = 0, skipped = 0;

  for (let i = 0; i < starts.length; i++) {
    const d = starts[i];
    const end = i + 1 < starts.length ? starts[i + 1].pos : text.length;
    const chunk = text.substring(d.pos, end);

    const eStarter = getField(chunk, 'eStarter');
    const eHint = getField(chunk, 'eHint');
    const aStarter = getField(chunk, 'aStarter');
    const aHint = getField(chunk, 'aHint');

    if (eStarter && hasImplementation(eStarter)) {
      const hint = eHint.replace(/\\n/g, ' ').replace(/\\"/g, '"').substring(0, 150);
      const stubbed = stubCode(eStarter, hint);
      const find = `"eStarter": "${eStarter}"`;
      const replace = `"eStarter": "${stubbed}"`;
      if (result.includes(find)) { result = result.replace(find, replace); fixedE++; }
      else { console.log(`  ⚠️  Day ${d.day} eStarter not found`); skipped++; }
    }

    if (aStarter && hasImplementation(aStarter)) {
      const hint = aHint.replace(/\\n/g, ' ').replace(/\\"/g, '"').substring(0, 150);
      const stubbed = stubCode(aStarter, hint);
      const find = `"aStarter": "${aStarter}"`;
      const replace = `"aStarter": "${stubbed}"`;
      if (result.includes(find)) { result = result.replace(find, replace); fixedA++; }
      else { console.log(`  ⚠️  Day ${d.day} aStarter not found`); skipped++; }
    }
  }

  if (result !== text) {
    fs.writeFileSync(filePath, result, 'utf8');
    console.log(`  ✅ ${courseName}: ${fixedE} eStarters + ${fixedA} aStarters stubbed. ${skipped} skipped. Saved.`);
  } else {
    console.log(`  ⚠️  ${courseName}: No changes made.`);
  }
}

// ── BCom Marketing ───────────────────────────────────────────────────────────

function fixBcomMarketing() {
  const filePath = path.join(BASE, 'bcomMarketing30DayData.ts');
  let text = fs.readFileSync(filePath, 'utf8');

  // 1. Trivial no-param aStarters returning constants (same as CF/BCom Acc/Fin)
  const trivialRe = /"aStarter": "(function (\w+)\(\) \{ return [^"]+; \})"/g;
  let trivialCount = 0;
  text = text.replace(trivialRe, (match, body, fname) => {
    trivialCount++;
    return `"aStarter": "function ${fname}() {\\n  // Write your answer here\\n}"`;
  });
  console.log(`  Trivial aStarters stubbed: ${trivialCount}`);

  // 2. Stub eStarters for Days 7 and 25 that have if-logic
  //    Re-use generic stubber via a mini extraction approach
  const starts = [];
  const dr = /"day":\s*(\d+)/g;
  let dm;
  while ((dm = dr.exec(text)) !== null) starts.push({ day: parseInt(dm[1]), pos: dm.index });

  function getField(chunk, field) {
    const re = new RegExp('"' + field + '":\\s*"((?:[^"\\\\]|\\\\.)*)"', 's');
    const m = chunk.match(re);
    return m ? m[1] : '';
  }

  let extraFixed = 0;
  for (let i = 0; i < starts.length; i++) {
    const d = starts[i];
    if (![7, 25].includes(d.day)) continue;
    const end = i + 1 < starts.length ? starts[i + 1].pos : text.length;
    const chunk = text.substring(d.pos, end);
    const eStarter = getField(chunk, 'eStarter');
    const eHint = getField(chunk, 'eHint');
    if (eStarter && hasImplementation(eStarter)) {
      const hint = eHint.replace(/\\n/g, ' ').replace(/\\"/g, '"').substring(0, 150);
      const stubbed = stubCode(eStarter, hint);
      const find = `"eStarter": "${eStarter}"`;
      const replace = `"eStarter": "${stubbed}"`;
      if (text.includes(find)) { text = text.replace(find, replace); extraFixed++; }
    }
  }
  console.log(`  Marketing eStarters (Days 7, 25) stubbed: ${extraFixed}`);

  fs.writeFileSync(filePath, text, 'utf8');
  console.log('  ✅ BCom Marketing saved.');
}

// ── Main ─────────────────────────────────────────────────────────────────────

console.log('\n=== Batch 4 Fix ===\n');

console.log('BCom Marketing...');
fixBcomMarketing();

console.log('\nCloud Native...');
stubCourse(path.join(BASE, 'cloud30DayData.ts'), 'Cloud Native');

console.log('\nDevOps...');
stubCourse(path.join(BASE, 'devops30DayData.ts'), 'DevOps');

console.log('\nDone.\n');
