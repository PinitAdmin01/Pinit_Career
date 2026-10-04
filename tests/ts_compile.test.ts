import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { compileTs, compileTsSync } from '../src/lib/code/ts/compileTs';

describe('TypeScript/TSX compilation step (CHK-2 / W-03)', () => {
  it('compiles a typed TypeScript function and strips types', async () => {
    const tsCode = `
      interface User {
        id: string;
        age: number;
      }
      export function formatUser(user: User): string {
        return \`User \${user.id} (\${user.age})\`;
      }
    `;

    const res = await compileTs(tsCode);
    assert.strictEqual(res.ok, true);
    if (res.ok) {
      assert.ok(!res.js.includes('interface User'), 'Types should be stripped');
      assert.ok(!res.js.includes(': User'), 'Parameter type annotations should be stripped');
      assert.ok(res.js.includes('function formatUser'), 'Function implementation preserved');
    }
  });

  it('compiles TSX components with JSX transformation', async () => {
    const tsxCode = `
      interface ButtonProps {
        label: string;
        disabled?: boolean;
      }
      export const Button = ({ label, disabled }: ButtonProps) => (
        <button disabled={disabled} className="btn-primary">
          <span>{label}</span>
        </button>
      );
    `;

    const res = await compileTs(tsxCode, { jsx: true });
    assert.strictEqual(res.ok, true);
    if (res.ok) {
      assert.ok(
        res.js.includes('React.createElement') || res.js.includes('jsx'),
        'JSX should be transformed into React element calls'
      );
      assert.ok(!res.js.includes('interface ButtonProps'), 'Types should be stripped');
    }
  });

  it('reports syntax errors with the exact line number and plain words message', async () => {
    const brokenCode = [
      'const a = 1;',
      'const b = 2;',
      'function broken(x: number { return x; }',
      'const c = 3;',
    ].join('\n');

    const res = await compileTs(brokenCode);
    assert.strictEqual(res.ok, false);
    if (!res.ok) {
      assert.strictEqual(res.line, 3, 'Should report the syntax error on line 3');
      assert.ok(res.message.length > 0, 'Should include human-readable error text');
      assert.ok(
        res.message.includes('Expected') || res.message.includes('syntax'),
        `Expected plain words syntax error, got: ${res.message}`
      );
    }
  });

  it('supports synchronous compilation in Node.js environments (compileTsSync)', () => {
    const tsCode = 'export const multiply = (a: number, b: number): number => a * b;';
    const res = compileTsSync(tsCode);
    assert.strictEqual(res.ok, true);
    if (res.ok) {
      assert.ok(res.js.includes('multiply = (a, b) => a * b;'));
    }

    const brokenCode = 'const x: number = ;';
    const errRes = compileTsSync(brokenCode);
    assert.strictEqual(errRes.ok, false);
    if (!errRes.ok) {
      assert.strictEqual(typeof errRes.line, 'number');
      assert.ok(errRes.message.length > 0);
    }
  });
});
