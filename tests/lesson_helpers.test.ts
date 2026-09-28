import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash, createHmac } from 'node:crypto';

import { LESSON_HELPERS, withLessonHelpers } from '../src/lib/code/sandbox/lessonHelpers';

type Helpers = {
  sha1Base64: (t: string) => string;
  sha1Hex: (t: string) => string;
  sha256Hex: (t: string) => string;
  sha256Base64Url: (t: string) => string;
  hmacSha256Hex: (k: string, m: string) => string;
  randomHex: (n: number) => string;
  toyAead: { seal: (k: string, p: string, aad?: string) => { iv: string; ciphertext: string; tag: string }; open: (k: string, box: object, aad?: string) => string };
};

// eslint-disable-next-line no-new-func
const h = new Function('crypto', `${LESSON_HELPERS}\nreturn { sha1Base64, sha1Hex, sha256Hex, sha256Base64Url, hmacSha256Hex, randomHex, toyAead };`)(globalThis.crypto) as Helpers;

test('lesson hash helpers match Node crypto', () => {
  for (const text of ['', 'abc', 'héllo 🚀', 'x'.repeat(300), 'dGhlIHNhbXBsZSBub25jZQ==258EAFA5-E914-47DA-95CA-C5AB0DC85B11']) {
    assert.equal(h.sha1Base64(text), createHash('sha1').update(text).digest('base64'));
    assert.equal(h.sha1Hex(text), createHash('sha1').update(text).digest('hex'));
    assert.equal(h.sha256Hex(text), createHash('sha256').update(text).digest('hex'));
    assert.equal(h.sha256Base64Url(text), createHash('sha256').update(text).digest('base64url'));
    for (const key of ['k', 'k'.repeat(100)]) assert.equal(h.hmacSha256Hex(key, text), createHmac('sha256', key).update(text).digest('hex'));
  }
  // Published sample values (RFC 6455 and RFC 7636).
  assert.equal(h.sha1Base64('dGhlIHNhbXBsZSBub25jZQ==258EAFA5-E914-47DA-95CA-C5AB0DC85B11'), 's3pPLMBiTxaQ9kYGzzhZRbK+xOo=');
  assert.equal(h.sha256Base64Url('dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk'), 'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM');
  assert.match(h.randomHex(16), /^[0-9a-f]{32}$/);
});

test('toyAead decrypts with the right key and context, and refuses anything else', () => {
  const key = h.randomHex(32);
  const box = h.toyAead.seal(key, 'Confidential Bonus', 'tenant_alpha');
  assert.ok(!box.ciphertext.includes('Confidential'));
  assert.equal(h.toyAead.open(key, box, 'tenant_alpha'), 'Confidential Bonus');
  assert.throws(() => h.toyAead.open(key, box, 'tenant_beta'), /authenticate data/);
  assert.throws(() => h.toyAead.open(h.randomHex(32), box, 'tenant_alpha'), /authenticate data/);
});

test('helpers are only added to examples that use them', () => {
  assert.equal(withLessonHelpers("console.log('hi')"), "console.log('hi')");
  assert.ok(withLessonHelpers("console.log(sha1Hex('x'))").startsWith(LESSON_HELPERS));
});
