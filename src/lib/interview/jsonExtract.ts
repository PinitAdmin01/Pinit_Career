/**
 * Pure JSON extraction and HTML escaping utilities for AI Interview APIs and reports.
 */

/**
 * Safely extracts and parses the first balanced JSON object from an LLM response string.
 * Handles markdown code fences, conversational preambles, and braces inside JSON strings.
 */
export function extractJsonObject<T = Record<string, unknown>>(raw: string): T | null {
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // Strip optional markdown code fences first
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const candidate = (fenceMatch ? fenceMatch[1] : trimmed).trim();

  // Fast path: valid JSON object directly
  if (candidate.startsWith('{')) {
    try {
      const parsed = JSON.parse(candidate);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed as T;
      }
    } catch {
      // Fall through to balanced-brace scanner
    }
  }

  // Locate outermost balanced `{ ... }` substring respecting strings and escapes
  let startIdx = -1;
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = 0; i < candidate.length; i++) {
    const ch = candidate[i];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }

    if (ch === '"') {
      inString = true;
      continue;
    }

    if (ch === '{') {
      if (depth === 0) startIdx = i;
      depth++;
    } else if (ch === '}') {
      if (depth > 0) {
        depth--;
        if (depth === 0 && startIdx !== -1) {
          const slice = candidate.slice(startIdx, i + 1);
          try {
            const parsed = JSON.parse(slice);
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
              return parsed as T;
            }
          } catch {
            // Continue scanning in case an earlier brace pair was invalid prose
            startIdx = -1;
          }
        }
      }
    }
  }

  return null;
}

/**
 * Escapes untrusted dynamic text before interpolating into HTML scorecard templates.
 */
export function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
