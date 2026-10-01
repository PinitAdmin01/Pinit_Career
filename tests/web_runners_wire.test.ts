import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { runTestSuite } from '../src/lib/code/codeRunner';

describe('Wire web task runners into runTestSuite (CHK-1, CHK-2, CHK-3, CHK-4 / W-06)', () => {
  describe('TypeScript runner', () => {
    const testSuite = `
      if (calculateDiscount(100, 0.2) !== 80) {
        throw new Error('calculateDiscount(100, 0.2) must return 80');
      }
      if (calculateDiscount(50, 0.1) !== 45) {
        throw new Error('calculateDiscount(50, 0.1) must return 45');
      }
    `;

    it('passes for a correct TypeScript implementation', async () => {
      const code = `
        export function calculateDiscount(price: number, discountRate: number): number {
          return price * (1 - discountRate);
        }
      `;

      const result = await runTestSuite(code, 'typescript', { testSuite });
      assert.strictEqual(result.allPassed, true, `Expected pass, got error: ${result.error}`);
      assert.strictEqual(result.status, 'SUCCESS');
    });

    it('fails for an incorrect TypeScript implementation', async () => {
      const code = `
        export function calculateDiscount(price: number, discountRate: number): number {
          return price; // Ignores discount
        }
      `;

      const result = await runTestSuite(code, 'typescript', { testSuite });
      assert.strictEqual(result.allPassed, false);
      assert.strictEqual(result.status, 'RUNTIME_ERROR');
      assert.ok(result.error?.includes('calculateDiscount(100, 0.2) must return 80'));
    });
  });

  describe('TSX runner', () => {
    const testSuite = `
      const h1 = render(Badge, { label: 'Verified', variant: 'success' });
      if (!h1.includes('Verified')) {
        throw new Error('Badge must render label');
      }
      if (!h1.includes('badge-success')) {
        throw new Error('Badge must include variant class');
      }
    `;

    it('passes for a correct TSX component', async () => {
      const code = `
        interface BadgeProps {
          label: string;
          variant: 'success' | 'warning';
        }
        export function Badge({ label, variant }: BadgeProps) {
          return <span className={'badge-' + variant}>{label}</span>;
        }
      `;

      const result = await runTestSuite(code, 'tsx', { testSuite });
      assert.strictEqual(result.allPassed, true, `Expected pass, got error: ${result.error}`);
      assert.strictEqual(result.status, 'SUCCESS');
    });

    it('fails for an incorrect TSX component', async () => {
      const code = `
        export function Badge({ label }: any) {
          return <span>{label}</span>; // Missing variant class
        }
      `;

      const result = await runTestSuite(code, 'tsx', { testSuite });
      assert.strictEqual(result.allPassed, false);
      assert.strictEqual(result.status, 'RUNTIME_ERROR');
      assert.ok(result.error?.includes('Badge must include variant class'));
    });
  });

  describe('HTML runner', () => {
    const testSuite = `
      assertImagesHaveAlt(html);
      assertInputsHaveLabels(html);
      assertHeadingsInOrder(html);
      const buttons = queryAll(html, 'button.submit-btn');
      if (buttons.length !== 1) {
        throw new Error('Must contain exactly 1 submit button with class submit-btn');
      }
    `;

    it('passes for valid and accessible HTML', async () => {
      const code = `
        <main>
          <h1>Registration</h1>
          <img src="/logo.png" alt="Company logo" />
          <form>
            <label for="username">Username</label>
            <input id="username" type="text" />
            <button type="submit" class="submit-btn">Submit</button>
          </form>
        </main>
      `;

      const result = await runTestSuite(code, 'html', { testSuite });
      assert.strictEqual(result.allPassed, true, `Expected pass, got error: ${result.error}`);
      assert.strictEqual(result.status, 'SUCCESS');
    });

    it('fails for invalid HTML (missing alt on img)', async () => {
      const code = `
        <main>
          <h1>Registration</h1>
          <img src="/logo.png" />
          <form>
            <label for="username">Username</label>
            <input id="username" type="text" />
            <button type="submit" class="submit-btn">Submit</button>
          </form>
        </main>
      `;

      const result = await runTestSuite(code, 'html', { testSuite });
      assert.strictEqual(result.allPassed, false);
      assert.strictEqual(result.status, 'RUNTIME_ERROR');
      assert.ok(result.error?.includes('alt attribute'));
    });
  });

  describe('CSS runner', () => {
    const testSuite = `
      const display = cssValue(css, '.flex-container', 'display');
      if (display !== 'flex') {
        throw new Error('.flex-container must have display: flex');
      }
      const justify = cssValue(css, '.flex-container', 'justify-content');
      if (justify !== 'space-between') {
        throw new Error('.flex-container must have justify-content: space-between');
      }
    `;

    it('passes for correct CSS styling', async () => {
      const code = `
        .flex-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      `;

      const result = await runTestSuite(code, 'css', { testSuite });
      assert.strictEqual(result.allPassed, true, `Expected pass, got error: ${result.error}`);
      assert.strictEqual(result.status, 'SUCCESS');
    });

    it('fails for incorrect CSS styling', async () => {
      const code = `
        .flex-container {
          display: block;
          justify-content: center;
        }
      `;

      const result = await runTestSuite(code, 'css', { testSuite });
      assert.strictEqual(result.allPassed, false);
      assert.strictEqual(result.status, 'RUNTIME_ERROR');
      assert.ok(result.error?.includes('display: flex'));
    });
  });
});
