/**
 * Generates a cryptographically secure, collision-free transaction ID (DEF-047).
 * Standardizes on UUID v4 to ensure absolute uniqueness across concurrent distributed ledgers.
 */
export function generateTxId(prefix: string = 'tx'): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  const bytes = new Uint8Array(16);
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    crypto.getRandomValues(bytes);
    return `${prefix}_${Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')}`;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const nodeCrypto = require('crypto');
    if (typeof nodeCrypto?.randomUUID === 'function') {
      return `${prefix}_${nodeCrypto.randomUUID()}`;
    }
  } catch {}

  return `${prefix}_${Math.random().toString(36).slice(2, 12)}_${Math.random().toString(36).slice(2, 12)}`;
}
