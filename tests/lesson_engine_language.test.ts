import test from 'node:test';
import assert from 'node:assert/strict';

import { adaptCodeForSandbox } from '../src/app/quests/lesson/hooks/useLessonEngine';
import { getLongLessonLanguage, LongLessonLanguage } from '../src/lib/data/longLessons';
import { compileTs } from '../src/lib/code/ts/compileTs';

test('W-07: LongLessonLanguage includes typescript and returns it for web course prefixes', () => {
  const tsLangs: LongLessonLanguage[] = ['javascript', 'python', 'sql', 'typescript'];
  assert.ok(tsLangs.includes('typescript'));

  assert.equal(getLongLessonLanguage('node-web'), 'typescript');
  assert.equal(getLongLessonLanguage('sre-web'), 'typescript');
  assert.equal(getLongLessonLanguage('stream-web'), 'typescript');
  assert.equal(getLongLessonLanguage('aideploy-web'), 'typescript');
  assert.equal(getLongLessonLanguage('react-basics'), 'javascript');
  assert.equal(getLongLessonLanguage('python'), 'python');
  assert.equal(getLongLessonLanguage('sql-mastery'), 'sql');
});

test('W-07: adaptCodeForSandbox does not rewrite code for quests with an id containing "javascript" when language is set', () => {
  const jsCode = `function calculateTotal(items: number[]) {
  const tax = 0.08;
  return items.reduce((a, b) => a + b, 0) * (1 + tax);
}
console.log(calculateTotal([10, 20, 30]));`;

  // 1. Explicit language string as 3rd parameter
  const res1 = adaptCodeForSandbox(jsCode, 'course-javascript-fundamentals-d1', 'javascript');
  assert.equal(res1, jsCode, 'Code must not be rewritten when language is set to javascript');

  // 2. Quest object as 2nd parameter
  const res2 = adaptCodeForSandbox(jsCode, { id: 'javascript-practice-01', language: 'javascript' });
  assert.equal(res2, jsCode, 'Code must not be rewritten for quest object with language: javascript');

  // 3. Quest object as 3rd parameter
  const res3 = adaptCodeForSandbox(jsCode, 'course-javascript-advanced', { language: 'javascript' });
  assert.equal(res3, jsCode, 'Code must not be rewritten for options object with language: javascript');

  // Verify none of Java-wrapping artifacts were injected
  assert.ok(!res1.includes('(() => {'), 'Must not contain Java IIFE wrapper');
  assert.ok(!res1.includes('})?.();'), 'Must not append Java IIFE closer');
});

test('W-07: adaptCodeForSandbox does not rewrite code for quests with an id containing "sql" when language is set', () => {
  const tsCode = `const sqlQuery = "SELECT id, name FROM users WHERE active = true";
console.log("Constructed query:", sqlQuery);`;

  // Explicit language 'typescript'
  const res1 = adaptCodeForSandbox(tsCode, 'node-sql-query-builder', 'typescript');
  assert.equal(res1, tsCode, 'TypeScript query-builder task with "sql" in id must not be rewritten as SQL mock');

  // Explicit language 'javascript'
  const res2 = adaptCodeForSandbox(tsCode, 'web-sql-orm-exercise', 'javascript');
  assert.equal(res2, tsCode, 'JavaScript ORM task with "sql" in id must not be rewritten as SQL mock');

  // Verify SQL mock template was not injected
  assert.ok(!res1.includes('sqlite>'), 'Must not contain sqlite> mock prompt');
  assert.ok(!res1.includes('Query executed successfully'), 'Must not contain sqlite mock success');
});

test('W-07: adaptCodeForSandbox preserves code unchanged across all set web languages', () => {
  const code = `const view = <Component prop="test" />;\nSELECT * FROM fake_table;`;

  for (const lang of ['typescript', 'ts', 'tsx', 'html', 'css', 'javascript', 'js']) {
    const res = adaptCodeForSandbox(code, `test-${lang}-quest`, lang);
    assert.equal(res, code, `Language "${lang}" must preserve code unchanged`);
  }
});

test('W-07: adaptCodeForSandbox does not treat quest id containing "javascript" as Java even without language parameter', () => {
  const jsCode = `function testFn() {\n  return 42;\n}\nconsole.log(testFn());`;
  const res = adaptCodeForSandbox(jsCode, 'intro-to-javascript-d1');
  assert.equal(res, jsCode, 'javascript in questId must never match Java check');
});

test('W-07: compileTs compiles TypeScript and TSX lesson examples for the lesson engine', async () => {
  const tsCode = `interface User { id: number; name: string; }
const greet = (u: User): string => "Hello " + u.name;
console.log(greet({ id: 1, name: "Alice" }));`;

  const compiled = await compileTs(tsCode, { jsx: false });
  assert.ok(compiled.ok, 'TypeScript compilation must succeed');
  if (compiled.ok) {
    assert.ok(!compiled.js.includes('interface User'), 'Compiled JS must strip interfaces');
    assert.ok(compiled.js.includes('Alice'), 'Compiled JS must contain code body');
  }

  const tsxCode = `const Header = ({ title }: { title: string }) => <h1>{title}</h1>;
console.log(Header({ title: "PinIT" }));`;

  const compiledTsx = await compileTs(tsxCode, { jsx: true });
  assert.ok(compiledTsx.ok, 'TSX compilation must succeed');
  if (compiledTsx.ok) {
    assert.ok(!compiledTsx.js.includes('{ title: string }'), 'Compiled TSX must strip types');
  }
});
