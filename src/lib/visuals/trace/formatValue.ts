/**
 * Formats a stored tracer value into display text:
 * Python repr format, cut at 40 characters with '…'.
 * Structured floats like {"__f__": "inf"} show as "inf".
 */
export function formatValue(val: unknown): string {
  const raw = formatRaw(val);
  if (raw.length > 40) {
    return raw.slice(0, 39) + '…';
  }
  return raw;
}

function formatRaw(val: unknown): string {
  if (val === null || val === undefined) {
    return 'None';
  }

  if (typeof val === 'boolean') {
    return val ? 'True' : 'False';
  }

  if (typeof val === 'number') {
    if (Number.isNaN(val)) return 'nan';
    if (val === Infinity) return 'inf';
    if (val === -Infinity) return '-inf';
    return String(val);
  }

  if (typeof val === 'string') {
    return pythonStringRepr(val);
  }

  if (Array.isArray(val)) {
    return '[' + val.map((item) => formatRaw(item)).join(', ') + ']';
  }

  if (typeof val === 'object') {
    const obj = val as Record<string, unknown>;

    // Stored float infinity/nan: {"__f__": "inf"} or {"__f__": "float('inf')"}
    if ('__f__' in obj) {
      const f = String(obj.__f__);
      if (f.includes('inf') && !f.startsWith('-')) return 'inf';
      if (f.includes('-inf')) return '-inf';
      if (f.includes('nan')) return 'nan';
      return f;
    }

    // Reference cycle protection: {"__ref__": "Node"}
    if ('__ref__' in obj) {
      return `<${String(obj.__ref__)}>`;
    }

    // Set serialization: {"__set__": [...]}
    if ('__set__' in obj && Array.isArray(obj.__set__)) {
      if (obj.__set__.length === 0) return 'set()';
      return '{' + obj.__set__.map((item) => formatRaw(item)).join(', ') + '}';
    }

    // Dict serialization: {"__dict__": [[k, v], ...]}
    if ('__dict__' in obj && Array.isArray(obj.__dict__)) {
      return (
        '{' +
        obj.__dict__
          .map(([k, v]) => `${formatRaw(k)}: ${formatRaw(v)}`)
          .join(', ') +
        '}'
      );
    }

    // Object serialization: {"__obj__": "Node", "f": {...}}
    if ('__obj__' in obj) {
      return `<${String(obj.__obj__)}>`;
    }

    // Other non-primitive object serialization: {"__other__": "slice"}
    if ('__other__' in obj) {
      return `<${String(obj.__other__)}>`;
    }

    // Standard JavaScript object treated as dict: {'a': 1}
    const entries = Object.entries(obj);
    return (
      '{' +
      entries
        .map(([k, v]) => `${pythonStringRepr(k)}: ${formatRaw(v)}`)
        .join(', ') +
      '}'
    );
  }

  return String(val);
}

function pythonStringRepr(str: string): string {
  if (!str.includes("'")) {
    return `'${str}'`;
  }
  if (!str.includes('"')) {
    return `"${str}"`;
  }
  return `'${str.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}
