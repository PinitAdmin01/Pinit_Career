/**
 * How console.log values are shown to students by the sandboxed code runner.
 *
 * String(value) printed arrays as "a,b,c" and objects as "[object Object]", which hides exactly
 * what a beginner is trying to see. This formats them the way Node.js does on one line:
 * [ 'HTML', 'CSS' ] and { title: 'Dev', 'job title': 'x' } (names that are not plain words are quoted).
 * Top-level strings print as-is.
 *
 * It is kept as source text because the runner builds its worker script from a string. The source
 * must not contain backticks, backslashes or "${", since it is placed inside a template literal.
 */
export const LOG_FORMAT_SOURCE = `
function __pinitFormatLog(value, depth) {
  if (typeof value === 'string') {
    if (depth === 0) return value;
    // Like Node: a string that contains ' is shown in double quotes.
    return value.indexOf("'") >= 0 && value.indexOf('"') < 0 ? '"' + value + '"' : "'" + value + "'";
  }
  if (value === null || value === undefined) return String(value);
  if (typeof value === 'function') return '[Function: ' + (value.name || 'anonymous') + ']';
  if (typeof value !== 'object') return String(value);
  if (value instanceof Error) return String(value);
  if (depth > 4) return Array.isArray(value) ? '[Array]' : '[Object]';
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    return '[ ' + value.map(function (v) { return __pinitFormatLog(v, depth + 1); }).join(', ') + ' ]';
  }
  var keys = Object.keys(value);
  if (keys.length === 0) return '{}';
  return '{ ' + keys.map(function (k) {
    var name = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k) ? k : "'" + k + "'";
    return name + ': ' + __pinitFormatLog(value[k], depth + 1);
  }).join(', ') + ' }';
}
`;

/** Formats console.log arguments exactly as the sandbox does (used by tests). */
export function formatLogArgs(args: unknown[]): string {
  // eslint-disable-next-line no-new-func
  const fmt = new Function(`${LOG_FORMAT_SOURCE}; return __pinitFormatLog;`)() as (v: unknown, d: number) => string;
  return args.map((a) => fmt(a, 0)).join(' ');
}
