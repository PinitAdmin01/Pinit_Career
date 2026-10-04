/**
 * HTML and CSS check helpers (CHK-4 / W-05).
 * Uses parse5 for HTML parsing and postcss for CSS parsing.
 * Provides DOM-less element querying, attribute/text inspection,
 * CSS rule/value extraction, and accessibility validation helpers.
 */

import * as parse5 from 'parse5';
import postcss from 'postcss';

export interface CssRuleItem {
  selector: string;
  declarations: Record<string, string>;
}

export interface A11yCheckResult {
  ok: boolean;
  violations: string[];
  message?: string;
  missingCount?: number;
  unlabelledCount?: number;
}

/**
 * Returns the value of an attribute on an element, or null if absent.
 */
export function attr(el: any, name: string): string | null {
  if (!el || !Array.isArray(el.attrs)) return null;
  const target = name.toLowerCase();
  const found = el.attrs.find((a: any) => a.name.toLowerCase() === target);
  return found ? found.value : null;
}

/**
 * Returns all concatenated text content inside a node and its descendants.
 */
export function text(node: any): string {
  if (!node) return '';
  if (node.nodeName === '#text' && typeof node.value === 'string') {
    return node.value;
  }
  let result = '';
  if (Array.isArray(node.childNodes)) {
    for (const child of node.childNodes) {
      result += text(child);
    }
  }
  return result;
}

/**
 * Recursively traverses all nodes in an AST.
 */
function traverseNodes(node: any, visit: (n: any, parent: any) => void, parent: any = null): void {
  if (!node) return;
  visit(node, parent);
  if (Array.isArray(node.childNodes)) {
    for (const child of node.childNodes) {
      traverseNodes(child, visit, node);
    }
  }
}

/**
 * Tests if an individual element node matches a simple selector (tag, class, id, attribute).
 */
function matchSimpleSelector(el: any, selector: string): boolean {
  if (!el || !el.tagName) return false;
  const sel = selector.trim();
  if (!sel) return false;

  // Attribute selector: [attr] or [attr="val"]
  if (sel.startsWith('[') && sel.endsWith(']')) {
    const inner = sel.slice(1, -1);
    const eqIdx = inner.indexOf('=');
    if (eqIdx === -1) {
      return attr(el, inner) !== null;
    }
    const attrName = inner.slice(0, eqIdx).trim();
    const attrVal = inner.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
    return attr(el, attrName) === attrVal;
  }

  // ID selector: #id
  if (sel.startsWith('#')) {
    return attr(el, 'id') === sel.slice(1);
  }

  // Class selector: .class
  if (sel.startsWith('.')) {
    const targetClass = sel.slice(1);
    const classVal = attr(el, 'class') || '';
    const classes = classVal.split(/\s+/).filter(Boolean);
    return classes.includes(targetClass);
  }

  // Compound tag + class or tag + id (e.g. div.card or input#email)
  const classIdx = sel.indexOf('.');
  const idIdx = sel.indexOf('#');
  if (classIdx > 0 && (idIdx === -1 || classIdx < idIdx)) {
    const tag = sel.slice(0, classIdx).toLowerCase();
    const rest = sel.slice(classIdx);
    return el.tagName.toLowerCase() === tag && matchSimpleSelector(el, rest);
  }
  if (idIdx > 0 && (classIdx === -1 || idIdx < classIdx)) {
    const tag = sel.slice(0, idIdx).toLowerCase();
    const rest = sel.slice(idIdx);
    return el.tagName.toLowerCase() === tag && matchSimpleSelector(el, rest);
  }

  // Tag + attribute (e.g. img[alt])
  const bracketIdx = sel.indexOf('[');
  if (bracketIdx > 0 && sel.endsWith(']')) {
    const tag = sel.slice(0, bracketIdx).toLowerCase();
    const rest = sel.slice(bracketIdx);
    return el.tagName.toLowerCase() === tag && matchSimpleSelector(el, rest);
  }

  // Pure tag name
  return el.tagName.toLowerCase() === sel.toLowerCase();
}

/**
 * Evaluates whether an element matches a complex selector branch (e.g. 'div p' or 'ul > li').
 */
function matchesSelectorBranch(el: any, parentMap: Map<any, any>, branch: string): boolean {
  // Normalize combinators: 'ul > li' -> ['ul', '>', 'li']
  const tokens = branch.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 1) {
    return matchSimpleSelector(el, tokens[0]);
  }

  // Check last token against current element
  let currentEl = el;
  let tokenIdx = tokens.length - 1;

  if (!matchSimpleSelector(currentEl, tokens[tokenIdx])) {
    return false;
  }

  tokenIdx--;
  while (tokenIdx >= 0 && currentEl) {
    if (tokens[tokenIdx] === '>') {
      tokenIdx--;
      const expectedParent = tokens[tokenIdx];
      currentEl = parentMap.get(currentEl);
      if (!currentEl || !matchSimpleSelector(currentEl, expectedParent)) {
        return false;
      }
      tokenIdx--;
    } else {
      // Descendant combinator
      const expectedAncestor = tokens[tokenIdx];
      let matched = false;
      let ancestor = parentMap.get(currentEl);
      while (ancestor) {
        if (matchSimpleSelector(ancestor, expectedAncestor)) {
          matched = true;
          currentEl = ancestor;
          break;
        }
        ancestor = parentMap.get(ancestor);
      }
      if (!matched) return false;
      tokenIdx--;
    }
  }

  return true;
}

/**
 * Queries all elements in an HTML string or parse5 AST matching a CSS selector (CHK-4).
 * Supports tag, class, id, attribute, descendant, direct child, and comma lists.
 */
export function queryAll(htmlOrNode: string | any, selector: string): any[] {
  if (!htmlOrNode || !selector) return [];

  const root = typeof htmlOrNode === 'string'
    ? parse5.parseFragment(htmlOrNode)
    : htmlOrNode;

  const parentMap = new Map<any, any>();
  const allElements: any[] = [];

  traverseNodes(root, (node, parent) => {
    if (parent) parentMap.set(node, parent);
    if (node.tagName) {
      allElements.push(node);
    }
  });

  const branches = selector.split(',').map((b) => b.trim()).filter(Boolean);
  const matched = new Set<any>();

  for (const el of allElements) {
    for (const branch of branches) {
      if (matchesSelectorBranch(el, parentMap, branch)) {
        matched.add(el);
        break;
      }
    }
  }

  return Array.from(matched);
}

/**
 * Parses CSS source and returns all rules with their declaration maps (CHK-4).
 */
export function cssRules(css: string): CssRuleItem[] {
  if (!css || !css.trim()) return [];
  const root = postcss.parse(css);
  const result: CssRuleItem[] = [];

  root.walkRules((rule) => {
    const declarations: Record<string, string> = {};
    rule.walkDecls((decl) => {
      declarations[decl.prop.toLowerCase().trim()] = decl.value.trim();
    });
    result.push({
      selector: rule.selector.trim(),
      declarations,
    });
  });

  return result;
}

/**
 * Reads a single CSS declaration value for a selector, obeying cascade order (CHK-4).
 */
export function cssValue(css: string, selector: string, property: string): string | null {
  const rules = cssRules(css);
  const targetProp = property.toLowerCase().trim();
  const targetSel = selector.toLowerCase().trim();
  const querySelectors = targetSel.split(',').map((s) => s.toLowerCase().trim());

  // Search in reverse order so later declarations override earlier ones
  for (let i = rules.length - 1; i >= 0; i--) {
    const rule = rules[i];
    const ruleSelectors = rule.selector.split(',').map((s) => s.toLowerCase().trim());
    const matches =
      rule.selector.toLowerCase().replace(/\s+/g, '') === targetSel.replace(/\s+/g, '') ||
      querySelectors.some((qs) => ruleSelectors.includes(qs));

    if (matches) {
      if (rule.declarations[targetProp] !== undefined) {
        return rule.declarations[targetProp];
      }
    }
  }

  return null;
}

/**
 * Accessibility helper: verifies every <img> tag has an alt attribute (CHK-4).
 */
export function checkImagesHaveAlt(html: string): A11yCheckResult {
  const images = queryAll(html, 'img');
  const violations: string[] = [];

  for (const img of images) {
    const altValue = attr(img, 'alt');
    if (altValue === null) {
      const src = attr(img, 'src') || 'unknown image';
      violations.push(`Image missing alt attribute: <img src="${src}">`);
    }
  }

  return {
    ok: violations.length === 0,
    missingCount: violations.length,
    violations,
    message: violations.length > 0 ? violations.join('; ') : undefined,
  };
}

export function assertImagesHaveAlt(html: string): void {
  const check = checkImagesHaveAlt(html);
  if (!check.ok) {
    throw new Error(check.message || 'Every <img> must have an alt attribute.');
  }
}

/**
 * Accessibility helper: verifies every form input has an associated label (CHK-4).
 * Checks <label for="id">, wrapping <label>, or aria-label / aria-labelledby.
 */
export function checkInputsHaveLabels(html: string): A11yCheckResult {
  const root = parse5.parseFragment(html);
  const parentMap = new Map<any, any>();
  const inputs: any[] = [];
  const labels: any[] = [];

  traverseNodes(root, (node, parent) => {
    if (parent) parentMap.set(node, parent);
    if (node.tagName?.toLowerCase() === 'input') {
      inputs.push(node);
    } else if (node.tagName?.toLowerCase() === 'label') {
      labels.push(node);
    }
  });

  const labelForIds = new Set<string>();
  for (const l of labels) {
    const forAttr = attr(l, 'for');
    if (forAttr) labelForIds.add(forAttr.trim());
  }

  const ignoredTypes = new Set(['hidden', 'submit', 'button', 'reset', 'image']);
  const violations: string[] = [];

  for (const input of inputs) {
    const type = (attr(input, 'type') || 'text').toLowerCase();
    if (ignoredTypes.has(type)) continue;

    const id = attr(input, 'id');
    const ariaLabel = attr(input, 'aria-label');
    const ariaLabelledBy = attr(input, 'aria-labelledby');

    const hasAria = Boolean((ariaLabel && ariaLabel.trim()) || (ariaLabelledBy && ariaLabelledBy.trim()));
    const hasForMatch = Boolean(id && labelForIds.has(id.trim()));

    // Check if input is nested inside a <label> by walking up the ancestor chain
    let isWrapped = false;
    let ancestor = parentMap.get(input);
    while (ancestor) {
      if (ancestor.tagName?.toLowerCase() === 'label') {
        isWrapped = true;
        break;
      }
      ancestor = parentMap.get(ancestor);
    }

    if (!hasAria && !hasForMatch && !isWrapped) {
      const inputId = id ? ` id="${id}"` : '';
      violations.push(`Form input<input${inputId} type="${type}"> is missing an accessible label`);
    }
  }

  return {
    ok: violations.length === 0,
    unlabelledCount: violations.length,
    violations,
    message: violations.length > 0 ? violations.join('; ') : undefined,
  };
}

export function assertInputsHaveLabels(html: string): void {
  const check = checkInputsHaveLabels(html);
  if (!check.ok) {
    throw new Error(check.message || 'Every input must have an accessible label.');
  }
}

/**
 * Accessibility helper: verifies heading levels do not skip levels downward (CHK-4).
 * (e.g. h1 followed directly by h3 is an invalid skip; h1 -> h2 -> h3 is valid).
 */
export function checkHeadingsInOrder(html: string): A11yCheckResult {
  const headings = queryAll(html, 'h1, h2, h3, h4, h5, h6');
  const violations: string[] = [];

  let previousLevel = 0;
  for (const h of headings) {
    const level = parseInt(h.tagName.slice(1), 10);
    if (previousLevel === 0) {
      if (level !== 1) {
        violations.push(`First heading on page must be <h1>, but found <h${level}>`);
      }
    } else if (level > previousLevel + 1) {
      violations.push(`Heading levels out of order: <h${previousLevel}> skipped to <h${level}>`);
    }
    previousLevel = level;
  }

  return {
    ok: violations.length === 0,
    violations,
    message: violations.length > 0 ? violations.join('; ') : undefined,
  };
}

export function assertHeadingsInOrder(html: string): void {
  const check = checkHeadingsInOrder(html);
  if (!check.ok) {
    throw new Error(check.message || 'Headings must be in hierarchical order without skipped levels.');
  }
}
