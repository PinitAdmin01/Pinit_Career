/**
 * DSA starter stubber — strips all pre-solved implementations to empty stubs.
 * Handles both single functions and classes with multiple methods.
 */

const fs = require('fs');
const path = require('path');
const dsaPath = path.join(__dirname, '..', 'src', 'lib', 'data', 'dsa30DayData.ts');

// ── Stub generator ───────────────────────────────────────────────────────────

function findMatchingBrace(code, openPos) {
  let depth = 1;
  let i = openPos + 1;
  while (i < code.length && depth > 0) {
    if (code[i] === '{') depth++;
    else if (code[i] === '}') depth--;
    i++;
  }
  return i - 1; // position of matching }
}

// Replace the body of a single function { body } with { // Hint\n  \n}
function stubSingleFunction(sig, hint) {
  return sig + `{\n  // ${hint}\n  \n}`;
}

// For a class, stub each method body but keep the class structure + constructor
function stubClassMethods(code, hint) {
  // Find class opening brace
  const classOpenIdx = code.indexOf('{');
  if (classOpenIdx === -1) return code;

  const classClose = findMatchingBrace(code, classOpenIdx);
  const classBody = code.substring(classOpenIdx + 1, classClose);

  // Find all method definitions in the class body
  // Pattern: (optional_modifiers identifier(params)) followed by {
  const methodRe = /(\s*(?:async\s+)?(?:\w+)\s*\([^)]*\)\s*)\{/g;
  let m;
  let result = classBody;
  let offset = 0;

  // Process each method
  const parts = [];
  let lastEnd = 0;

  while ((m = methodRe.exec(classBody)) !== null) {
    const methodOpenInBody = m.index + m[0].length - 1; // position of {
    const methodClose = findMatchingBrace(classBody, methodOpenInBody);

    // Add everything before this method body
    parts.push(classBody.substring(lastEnd, m.index));
    // Add stubbed method
    parts.push(m[1] + `{\n    // ${hint}\n    \n  }`);

    lastEnd = methodClose + 1;
    methodRe.lastIndex = lastEnd; // skip past this method
  }
  parts.push(classBody.substring(lastEnd));

  const stubbedBody = parts.join('');
  return code.substring(0, classOpenIdx + 1) + stubbedBody + '\n}';
}

function stubCode(encoded, hint) {
  if (!encoded || encoded.length < 5) return encoded;

  // Decode TS string escapes to actual code
  const decoded = encoded
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\');

  // Find the first top-level construct
  const isClass = /^class\s+/.test(decoded.trim());
  const openBraceIdx = decoded.indexOf('{');
  if (openBraceIdx === -1) return encoded;

  const sig = decoded.substring(0, openBraceIdx);
  const closeBraceIdx = findMatchingBrace(decoded, openBraceIdx);
  const afterTopLevel = decoded.substring(closeBraceIdx + 1).trim();

  let stubbed;
  if (isClass) {
    // Stub all methods inside the class
    const classCode = decoded.substring(0, closeBraceIdx + 1);
    stubbed = stubClassMethods(classCode, hint);
  } else {
    // Single function — stub the body
    stubbed = sig + `{\n  // ${hint}\n  \n}`;
  }

  // If there's more code after (e.g. additional functions or class wrapper), add it
  if (afterTopLevel) {
    // Stub the additional sections too
    stubbed += '\n' + stubAdditional(afterTopLevel, hint);
  }

  // Re-encode back to TS string
  return stubbed
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\t/g, '\\t');
}

function stubAdditional(code, hint) {
  const code_t = code.trim();
  const isClass = /^class\s+/.test(code_t);
  const openBraceIdx = code_t.indexOf('{');
  if (openBraceIdx === -1) return code_t;
  const sig = code_t.substring(0, openBraceIdx);
  const closeBraceIdx = findMatchingBrace(code_t, openBraceIdx);
  const after = code_t.substring(closeBraceIdx + 1).trim();
  let stubbed;
  if (isClass) {
    stubbed = stubClassMethods(code_t.substring(0, closeBraceIdx + 1), hint);
  } else {
    stubbed = sig + `{\n  // ${hint}\n  \n}`;
  }
  if (after) stubbed += '\n' + stubAdditional(after, hint);
  return stubbed;
}

// ── Apply to DSA file ────────────────────────────────────────────────────────

const text = fs.readFileSync(dsaPath, 'utf8');

// Extract all eStarter/aStarter values and their hints
// Pattern: "eStarter": "CODE", (and same for eHint, aStarter, aHint)
function extractFields(text) {
  const days = [];

  // Split by "day": N pattern
  const dayStartRe = /\{\s*[\r\n]+\s*"day":\s*(\d+),/g;
  let m;
  const starts = [];
  while ((m = dayStartRe.exec(text)) !== null) {
    starts.push({ day: parseInt(m[1]), pos: m.index });
  }

  for (let i = 0; i < starts.length; i++) {
    const start = starts[i].pos;
    const end = i + 1 < starts.length ? starts[i + 1].pos : text.length;
    const chunk = text.substring(start, end);

    const get = (field) => {
      const re = new RegExp(`"${field}":\\s*"((?:[^"\\\\]|\\\\.)*)"`, 's');
      const match = chunk.match(re);
      return match ? match[1] : '';
    };

    days.push({
      day: starts[i].day,
      pos: start,
      end,
      eStarter: get('eStarter'),
      eHint: get('eHint'),
      aStarter: get('aStarter'),
      aHint: get('aHint'),
      chunk,
    });
  }

  return days;
}

const days = extractFields(text);
console.log(`Found ${days.length} DSA days.`);

let result = text;
let fixedE = 0, fixedA = 0, skipped = 0;

for (const d of days) {
  // Check if eStarter has implementation (logic + return)
  const eDecoded = d.eStarter.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\"/g, '"');
  const aDecoded = d.aStarter.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\"/g, '"');

  const hasImplementation = (code) => {
    // Is there actual implementation? (not just comments and empty braces)
    const lines = code.split('\n').filter(l => l.trim() && !l.trim().startsWith('//'));
    const bodyLines = lines.filter(l => !/(function|class|constructor)/.test(l) && l.trim() !== '{' && l.trim() !== '}');
    return bodyLines.length > 0;
  };

  // Stub eStarter
  if (d.eStarter && hasImplementation(eDecoded)) {
    const hint = d.eHint.replace(/\\n/g, ' ').replace(/\\"/g, '"').substring(0, 120);
    const stubbed = stubCode(d.eStarter, hint);

    const find = `"eStarter": "${d.eStarter}"`;
    const replace = `"eStarter": "${stubbed}"`;

    if (result.includes(find)) {
      result = result.replace(find, replace);
      fixedE++;
    } else {
      console.log(`  Day ${d.day} eStarter not found for replacement (first 60 chars: ${d.eStarter.substring(0,60)})`);
      skipped++;
    }
  }

  // Stub aStarter
  if (d.aStarter && hasImplementation(aDecoded)) {
    const hint = d.aHint.replace(/\\n/g, ' ').replace(/\\"/g, '"').substring(0, 120);
    const stubbed = stubCode(d.aStarter, hint);

    const find = `"aStarter": "${d.aStarter}"`;
    const replace = `"aStarter": "${stubbed}"`;

    if (result.includes(find)) {
      result = result.replace(find, replace);
      fixedA++;
    } else {
      console.log(`  Day ${d.day} aStarter not found for replacement`);
      skipped++;
    }
  }
}

if (result !== text) {
  fs.writeFileSync(dsaPath, result, 'utf8');
  console.log(`\n✅ DSA: ${fixedE} eStarters + ${fixedA} aStarters stubbed. ${skipped} skipped. Saved.`);
} else {
  console.log('\n⚠️  No changes made to DSA file.');
}
