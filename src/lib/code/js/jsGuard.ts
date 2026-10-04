/**
 * Forbidden JS/TS APIs guard (CHK-5).
 * Refuses dangerous browser/Node APIs in student code and test suites.
 * Used by the browser runner, server grader (CHK-6), and validation pipelines.
 */

function stripCommentsAndStrings(source: string): string {
  // Single-pass tokenizer to prevent quote interleaving.
  // Strips /* block comments */, // line comments, "double strings", 'single strings',
  // and `template literals without expressions`.
  return source.replace(
    /\/\*[\s\S]*?\*\/|\/\/[^\r\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\[\s\S]|[^`\\$]|\$(?!\{))*`/g,
    '""'
  );
}

export interface ForbiddenJsRule {
  readonly name: string;
  readonly pattern: RegExp;
}

export const FORBIDDEN_JS_RULES: readonly ForbiddenJsRule[] = [
  // 1. fetch
  {
    name: 'fetch',
    pattern: /\bwindow\s*\.\s*fetch\b|(?<!async\s+)(?<![.\w$])fetch\s*\(/,
  },
  // 2. XMLHttpRequest
  {
    name: 'XMLHttpRequest',
    pattern: /\bXMLHttpRequest\b/,
  },
  // 3. WebSocket
  {
    name: 'WebSocket',
    pattern: /\bWebSocket\b/,
  },
  // 4. importScripts
  {
    name: 'importScripts',
    pattern: /\bimportScripts\b/,
  },
  // 5. eval
  {
    name: 'eval',
    pattern: /\bwindow\s*\.\s*eval\b|(?<![.\w$])eval\s*\(/,
  },
  // 6. new Function
  {
    name: 'new Function',
    pattern: /\bnew\s+Function\b/,
  },
  // 7. Function(
  {
    name: 'Function(',
    pattern: /(?<![.\w$])Function\s*\(/,
  },
  // 8. dynamic import(
  {
    name: 'import(',
    pattern: /(?<![.\w$])import\s*\(/,
  },
  // 9. require(
  {
    name: 'require(',
    pattern: /(?<![.\w$])require\s*\(/,
  },
  // 10. process.
  {
    name: 'process.',
    pattern: /(?<![.\w$])process\s*(?:\.|\[)/,
  },
  // 11. globalThis
  {
    name: 'globalThis',
    pattern: /\bglobalThis\b/,
  },
  // 12. constructor.constructor
  {
    name: 'constructor.constructor',
    pattern: /constructor\s*\.\s*constructor/,
  },
  // 13. __proto__
  {
    name: '__proto__',
    pattern: /__proto__/,
  },
  // 14. document.cookie
  {
    name: 'document.cookie',
    pattern: /document\s*\.\s*cookie/,
  },
  // 15. localStorage
  {
    name: 'localStorage',
    pattern: /\blocalStorage\b/,
  },
  // 16. indexedDB
  {
    name: 'indexedDB',
    pattern: /\bindexedDB\b/,
  },
];

export const FORBIDDEN_JS_PATTERNS: readonly RegExp[] = FORBIDDEN_JS_RULES.map((r) => r.pattern);

/**
 * Returns the name of the forbidden API if detected, or null if the source is safe.
 * Strings and comments are stripped before evaluation so messages like
 * `throw new Error("Function error")` or comments do not trigger false positives.
 */
export function findForbiddenJs(source: string): string | null {
  const stripped = stripCommentsAndStrings(source);
  for (const rule of FORBIDDEN_JS_RULES) {
    if (rule.pattern.test(stripped)) {
      return rule.name;
    }
  }
  return null;
}
