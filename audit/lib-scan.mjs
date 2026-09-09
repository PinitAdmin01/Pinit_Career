// Shared source scanner: brace/paren matching that respects strings,
// template literals, regex literals and comments.
//
// Needed because client.ts contains regex literals holding backticks
// (e.g. the fenced-code matcher near line 1102) which break any naive
// template-literal tracking, and single-line handler bodies that end at a
// `;` rather than a closing brace.

const BACKSLASH = String.fromCharCode(92);

const REGEX_PRECEDERS = new Set([
  '(', ',', '=', ':', '[', '!', '&', '|', '?', '{', '}', ';',
  '+', '-', '*', '%', '<', '>', '~', '^',
]);

const REGEX_KEYWORDS = [
  'return', 'typeof', 'case', 'in', 'of', 'new', 'delete', 'void', 'instanceof',
];

function prevSignificant(src, i) {
  for (let k = i - 1; k >= 0; k--) {
    if (!/\s/.test(src[k])) return { ch: src[k], idx: k };
  }
  return { ch: '', idx: -1 };
}

function regexAllowedAt(src, i) {
  const { ch, idx } = prevSignificant(src, i);
  if (idx < 0) return true;
  if (REGEX_PRECEDERS.has(ch)) return true;
  const word = src.slice(Math.max(0, idx - 12), idx + 1).match(/[A-Za-z_$]+$/);
  return !!(word && REGEX_KEYWORDS.includes(word[0]));
}

/**
 * Yield the index of every character of `src` between `from` and `to` that is
 * real code — skipping comments, string literals, template literals and regex
 * literals. Interpolations inside template literals ARE yielded, since they
 * contain code.
 */
export function* codeChars(src, from = 0, to = src.length) {
  let i = from;
  while (i < to) {
    const ch = src[i];
    const two = src.slice(i, i + 2);

    if (two === '//') {
      const nl = src.indexOf('\n', i);
      i = nl < 0 ? to : nl + 1;
      continue;
    }
    if (two === '/*') {
      const end = src.indexOf('*/', i + 2);
      i = end < 0 ? to : end + 2;
      continue;
    }

    if (ch === '"' || ch === "'") {
      i++;
      while (i < to) {
        if (src[i] === BACKSLASH) { i += 2; continue; }
        if (src[i] === ch) { i++; break; }
        if (src[i] === '\n') break; // unterminated — bail defensively
        i++;
      }
      continue;
    }

    if (ch === '`') {
      i++;
      while (i < to) {
        if (src[i] === BACKSLASH) { i += 2; continue; }
        if (src[i] === '`') { i++; break; }
        if (src.slice(i, i + 2) === '${') {
          // Walk the interpolation with this same scanner so that nested
          // braces, strings and templates inside it are handled correctly.
          i += 2;
          let depth = 1;
          let closed = false;
          for (const j of codeChars(src, i, to)) {
            if (src[j] === '{') depth++;
            else if (src[j] === '}') {
              depth--;
              if (depth === 0) { i = j + 1; closed = true; break; }
            }
          }
          if (!closed) { i = to; }
          continue;
        }
        i++;
      }
      continue;
    }

    if (ch === '/' && regexAllowedAt(src, i)) {
      let k = i + 1;
      let inClass = false;
      let terminated = false;
      while (k < to) {
        if (src[k] === BACKSLASH) { k += 2; continue; }
        if (src[k] === '[') inClass = true;
        else if (src[k] === ']') inClass = false;
        else if (src[k] === '/' && !inClass) { terminated = true; k++; break; }
        else if (src[k] === '\n') break;
        k++;
      }
      if (terminated) {
        while (k < to && /[gimsuyd]/.test(src[k])) k++;
        i = k;
        continue;
      }
    }

    yield i;
    i++;
  }
}

/** Index of the character matching the opener at `openIdx`, or -1. */
export function matchPair(src, openIdx, open, close) {
  let depth = 0;
  for (const i of codeChars(src, openIdx, src.length)) {
    if (src[i] === open) depth++;
    else if (src[i] === close) {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/**
 * Index just past the `;` that ends the single (unbraced) statement starting
 * at `from`. Stops early if the enclosing block closes first.
 */
export function statementEnd(src, from) {
  let paren = 0;
  let brace = 0;
  let brack = 0;
  for (const i of codeChars(src, from, src.length)) {
    const c = src[i];
    if (c === '(') paren++;
    else if (c === ')') paren--;
    else if (c === '{') brace++;
    else if (c === '}') {
      brace--;
      if (brace < 0) return i; // enclosing block ended
    } else if (c === '[') brack++;
    else if (c === ']') brack--;
    else if (c === ';' && paren <= 0 && brace <= 0 && brack <= 0) return i + 1;
  }
  return src.length;
}

export const lineOf = (src, idx) => src.slice(0, idx).split('\n').length;
