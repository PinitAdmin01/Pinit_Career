import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Task 2: Friends Tab CSS, Margin & Padding Overhaul Verification', async (t) => {
  const css = fs.readFileSync(path.join(__dirname, '../src/styles/friends.css'), 'utf8');
  const page = fs.readFileSync(path.join(__dirname, '../src/app/friends/page.tsx'), 'utf8');

  await t.test('1. Master container has ergonomic padding and max-width', () => {
    assert.ok(css.includes('max-width: 1440px;'), 'Container max-width should be 1440px');
    assert.ok(css.includes('padding: 16px 20px 60px;'), 'Container padding should be 16px 20px 60px');
  });

  await t.test('2. Hero banner has compact, breathable padding and modern typography', () => {
    assert.ok(css.includes('padding: 18px 24px;'), 'Hero padding should be 18px 24px');
    assert.ok(css.includes('font-size: 26px;'), 'Hero title font size should be 26px');
    assert.strictEqual(css.includes('padding: 30px 36px 32px;'), false, 'Old bloated hero padding must be removed');
  });

  await t.test('3. Two-column layout and right sidebar spacing are balanced', () => {
    assert.ok(css.includes('grid-template-columns: 1fr 300px;'), 'Layout should have 300px right sidebar');
    assert.ok(css.includes('gap: 20px;'), 'Layout gap should be 20px');
  });

  await t.test('4. Suggested cards grid uses responsive auto-fill and clean card dimensions', () => {
    assert.ok(css.includes('grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));'), 'Cards grid should auto-fill');
    assert.ok(css.includes('border-radius: 12px;'), 'Card border-radius should be 12px');
    assert.ok(css.includes('width: 44px;'), 'Avatar size should be 44px');
  });

  await t.test('5. Light mode search input has explicit white background and dark text', () => {
    assert.ok(css.includes(":root.light .friends-live-search-input"), 'Light mode search input selector exists');
    assert.ok(css.includes("background: #ffffff !important;"), 'Search input has white background in light mode');
    assert.ok(css.includes("color: #0f172a !important;"), 'Search input has dark text in light mode');
  });

  await t.test('6. Inline button style overrides are cleaned up in page.tsx', () => {
    assert.strictEqual(page.includes("style={{ padding: '7px 12px', fontSize: 13 }}"), false, 'Inline button styles must be removed');
    assert.strictEqual(page.includes('style={{ marginTop: 14 }}'), false, 'Inline marginTop on cards grid must be removed');
  });
});
