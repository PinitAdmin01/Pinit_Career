import test from 'node:test';
import assert from 'node:assert/strict';
import { executeTicketCode } from '../src/lib/internships/submission';

test('W-130 TypeScript grader: (a) a correct function passes', async () => {
  const code = `
    export function add(a: number, b: number): number {
      return a + b;
    }
  `;
  const visibleTests = `
    assert(add(1, 2) === 3);
  `;
  const hiddenTests = `
    assert(add(2, 3) === 5);
    assert(add(-1, -1) === -2);
  `;

  const res = await executeTicketCode({
    language: 'typescript',
    code,
    visibleTests,
    hiddenTests,
  });

  assert.equal(res.passed, true);
  assert.ok(res.output.includes('All tests passed'));
});

test('W-130 TypeScript grader: (b) a wrong function fails with "Hidden check N failed"', async () => {
  const code = `
    export function add(a: number, b: number): number {
      return a === 1 ? a + b : 999;
    }
  `;
  const visibleTests = `
    assert(add(1, 2) === 3);
  `;
  const hiddenTests = `
    assert(add(1, 4) === 5);
    assert(add(2, 3) === 5);
  `;

  const res = await executeTicketCode({
    language: 'typescript',
    code,
    visibleTests,
    hiddenTests,
  });

  assert.equal(res.passed, false);
  assert.equal(res.failedStage, 'hidden');
  assert.equal(res.output, 'Hidden check 2 failed');
});

test('W-130 TypeScript grader: (c) cheating by console.log sentinel fails', async () => {
  const code = `
    export function add(a: number, b: number): number {
      console.log("__PINIT_JS_TESTS_PASSED__");
      return 0;
    }
  `;
  const visibleTests = `
    assert(add(0, 0) === 0);
  `;
  const hiddenTests = `
    assert(add(1, 2) === 3);
  `;

  const res = await executeTicketCode({
    language: 'typescript',
    code,
    visibleTests,
    hiddenTests,
  });

  assert.equal(res.passed, false);
  assert.equal(res.failedStage, 'hidden');
  assert.equal(res.output, 'Hidden check 1 failed');
});

test('W-130 TypeScript grader: (d) output never contains any hidden test line', async () => {
  const code = `
    export function add(a: number, b: number): number {
      return 0;
    }
  `;
  const visibleTests = `
    assert(add(0, 0) === 0);
  `;
  const hiddenTests = `
    assert(add(9999, 1111) === 11110);
  `;

  const res = await executeTicketCode({
    language: 'typescript',
    code,
    visibleTests,
    hiddenTests,
  });

  assert.equal(res.passed, false);
  assert.equal(res.failedStage, 'hidden');
  assert.ok(!res.output.includes('9999'));
  assert.ok(!res.output.includes('assert'));
  assert.equal(res.output, 'Hidden check 1 failed');
});

test('W-130 TSX grader: (e) a correct TSX component passes', async () => {
  const code = `
    export function Badge({ text }: { text: string }) {
      return <span className="pinit-badge">{text}</span>;
    }
  `;
  const visibleTests = `
    const html1 = render(Badge, { text: "Online" });
    assert(html1.includes("Online"));
  `;
  const hiddenTests = `
    const html2 = render(Badge, { text: "Offline" });
    assert(html2.includes("Offline"));
    assert(html2.includes("pinit-badge"));
  `;

  const res = await executeTicketCode({
    language: 'tsx',
    code,
    visibleTests,
    hiddenTests,
  });

  assert.equal(res.passed, true);
  assert.ok(res.output.includes('All tests passed'));
});
