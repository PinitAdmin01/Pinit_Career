/**
 * Forbidden JS/TS APIs guard (CHK-5 / F-06).
 * Refuses dangerous browser/Node APIs in student code and test suites.
 * Uses an AST (acorn after esbuild transform) to reject forbidden identifiers and members.
 */

import * as acorn from 'acorn';

declare const __non_webpack_require__: ((id: string) => any) | undefined;

function getEsbuildTransform(): ((code: string, opts: any) => { code: string }) | null {
  if (typeof window !== 'undefined') return null;
  try {
    if (typeof __non_webpack_require__ !== 'undefined') {
      return __non_webpack_require__('esbuild').transformSync;
    }
    const nodeReq = typeof module !== 'undefined' && module.require ? module.require.bind(module) : undefined;
    if (nodeReq) {
      return nodeReq('esbuild').transformSync;
    }
    return null;
  } catch {
    return null;
  }
}

export interface ForbiddenJsRule {
  readonly name: string;
  readonly pattern: RegExp;
}

export const FORBIDDEN_JS_RULES: readonly ForbiddenJsRule[] = [
  { name: 'fetch', pattern: /\bwindow\s*\.\s*fetch\b|(?<!async\s+)(?<![.\w$])fetch\s*\(/ },
  { name: 'XMLHttpRequest', pattern: /\bXMLHttpRequest\b/ },
  { name: 'WebSocket', pattern: /\bWebSocket\b/ },
  { name: 'importScripts', pattern: /\bimportScripts\b/ },
  { name: 'eval', pattern: /\bwindow\s*\.\s*eval\b|(?<![.\w$])eval\s*\(/ },
  { name: 'new Function', pattern: /\bnew\s+Function\b/ },
  { name: 'Function(', pattern: /(?<![.\w$])Function\s*\(/ },
  { name: 'import(', pattern: /(?<![.\w$])import\s*\(/ },
  { name: 'require(', pattern: /(?<![.\w$])require\s*\(/ },
  { name: 'process.', pattern: /(?<![.\w$])process\s*(?:\.|\[)/ },
  { name: 'globalThis', pattern: /\bglobalThis\b/ },
  { name: 'constructor.constructor', pattern: /constructor\s*\.\s*constructor/ },
  { name: '__proto__', pattern: /__proto__/ },
  { name: 'document.cookie', pattern: /document\s*\.\s*cookie/ },
  { name: 'localStorage', pattern: /\blocalStorage\b/ },
  { name: 'indexedDB', pattern: /\bindexedDB\b/ },
];

export const FORBIDDEN_JS_PATTERNS: readonly RegExp[] = FORBIDDEN_JS_RULES.map((r) => r.pattern);

const BANNED_GLOBALS = new Set([
  'fetch',
  'XMLHttpRequest',
  'WebSocket',
  'importScripts',
  'eval',
  'Function',
  'process',
  'require',
  'globalThis',
  'self',
  'window',
  'Reflect',
  'Proxy',
  'localStorage',
  'indexedDB',
]);

const BANNED_PROPERTIES = new Set([
  '__proto__',
  'constructor',
]);

/**
 * Returns the name of the forbidden API if detected, or null if the source is safe.
 * Parses the code with acorn after an esbuild transform to inspect the AST.
 */
export function findForbiddenJs(source: string): string | null {
  if (!source || !source.trim()) return null;

  let jsCode = source;
  const transformSync = getEsbuildTransform();
  if (transformSync) {
    try {
      jsCode = transformSync(source, {
        loader: 'tsx',
        target: 'es2022',
        format: 'esm',
      }).code;
    } catch {
      jsCode = source;
    }
  }

  let ast: any;
  try {
    ast = acorn.parse(jsCode, {
      ecmaVersion: 'latest',
      sourceType: 'module',
      allowReturnOutsideFunction: true,
      allowAwaitOutsideFunction: true,
      allowImportExportEverywhere: true,
    });
  } catch {
    try {
      ast = acorn.parse(jsCode, {
        ecmaVersion: 'latest',
        sourceType: 'script',
        allowReturnOutsideFunction: true,
        allowAwaitOutsideFunction: true,
      });
    } catch {
      for (const rule of FORBIDDEN_JS_RULES) {
        if (rule.pattern.test(source)) {
          return rule.name;
        }
      }
      return null;
    }
  }

  let violation: string | null = null;

  function walk(node: any, parent: any) {
    if (!node || violation) return;

    // 1. Dynamic import: import('...')
    if (node.type === 'ImportExpression') {
      violation = 'import(';
      return;
    }

    // 2. MemberExpression checks
    if (node.type === 'MemberExpression') {
      // Prioritize banned API on global (e.g. window.fetch -> 'fetch', window.eval -> 'eval')
      if (node.object && node.object.type === 'Identifier' &&
          ['window', 'globalThis', 'self', 'global'].includes(node.object.name)) {
        if (!node.computed && node.property && node.property.type === 'Identifier' && BANNED_GLOBALS.has(node.property.name)) {
          violation = node.property.name;
          return;
        }
      }

      // Banned property names: __proto__, constructor
      if (!node.computed && node.property && node.property.type === 'Identifier') {
        if (BANNED_PROPERTIES.has(node.property.name)) {
          violation = node.property.name === 'constructor' ? 'constructor.constructor' : node.property.name;
          return;
        }
      } else if (node.computed && node.property && node.property.type === 'Literal') {
        const val = String(node.property.value);
        if (BANNED_PROPERTIES.has(val)) {
          violation = val === 'constructor' ? 'constructor.constructor' : val;
          return;
        }
      }

      // Check document.cookie
      if (!node.computed && node.property && node.property.name === 'cookie') {
        if (node.object && node.object.type === 'Identifier' && node.object.name === 'document') {
          violation = 'document.cookie';
          return;
        }
      }

      // Computed member access with non-literal keys on globals (window, globalThis, self, global)
      if (node.computed && node.property && node.property.type !== 'Literal') {
        if (node.object && node.object.type === 'Identifier' &&
            ['window', 'globalThis', 'self', 'global'].includes(node.object.name)) {
          violation = node.object.name;
          return;
        }
      }
    }

    // 3. Identifier checks
    if (node.type === 'Identifier') {
      const name = node.name;
      if (BANNED_GLOBALS.has(name)) {
        // Exemptions:
        // - Property of a non-computed member expression (e.g. client.fetch, myConfig.process, env.window)
        //   UNLESS the object is a global like window.fetch
        // - Class method definition (e.g. class Foo { async fetch() {} })
        // - Property in object literal (e.g. { fetch: 1 })
        if (parent) {
          if (parent.type === 'MemberExpression' && parent.property === node && !parent.computed) {
            if (parent.object && parent.object.type === 'Identifier' &&
                ['window', 'globalThis', 'self', 'global'].includes(parent.object.name)) {
              violation = name;
              return;
            }
            return;
          }
          if (parent.type === 'MethodDefinition' && parent.key === node) {
            return;
          }
          if (parent.type === 'Property' && parent.key === node && !parent.computed) {
            return;
          }
        }

        if (name === 'process') {
          violation = 'process.';
        } else if (name === 'require') {
          violation = 'require(';
        } else if (name === 'Function') {
          if (parent && parent.type === 'NewExpression') {
            violation = 'new Function';
          } else {
            violation = 'Function(';
          }
        } else {
          violation = name;
        }
        return;
      }
    }

    // Recursively walk AST children
    for (const key of Object.keys(node)) {
      if (key === 'parent') continue;
      const child = node[key];
      if (Array.isArray(child)) {
        for (const c of child) {
          if (c && typeof c === 'object' && c.type) {
            walk(c, node);
          }
        }
      } else if (child && typeof child === 'object' && child.type) {
        walk(child, node);
      }
    }
  }

  walk(ast, null);
  return violation;
}
