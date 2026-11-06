import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { getLongLesson, type LongLesson, type LongLessonPart } from '@/lib/data/longLessons';
import { getTappableLabelsForVisual } from '@/lib/visuals/visualRules';

export interface GateResult {
  passed: boolean;
  errors: string[];
}

export interface GateCheckOptions {
  manifest?: any;
  manifestPath?: string;
  unstableVars?: string[];
}

export const COURSE_ALLOWED_TEMPLATES: Record<string, string[]> = {
  python: ['flow', 'boxes', 'table', 'letters', 'compare', 'cells'],
  'dsa-py': ['cells', 'stack-queue', 'tree-graph', 'table', 'boxes', 'bars', 'compare'],
  'sql-mastery': ['table', 'flow', 'compare', 'bars'],
  'ai-py': ['flow', 'table', 'bars', 'sequence', 'compare', 'boxes'],
  'dist-py': ['sequence', 'flow', 'states', 'table', 'cells', 'compare'],
  'cloud-py': ['flow', 'sequence', 'states', 'table', 'bars', 'compare'],
  'nlp-py': ['table', 'cells', 'bars', 'flow', 'compare'],
  'quant-py': ['table', 'bars', 'flow', 'sequence', 'compare', 'cells'],
  'prompt-py': ['flow', 'table', 'compare', 'bars', 'sequence'],
  'train-py': ['bars', 'table', 'flow', 'cells', 'sequence', 'compare'],
  'vec-py': ['table', 'bars', 'tree-graph', 'cells', 'flow', 'compare'],
  'safe-py': ['flow', 'table', 'bars', 'compare', 'states'],
  'cyber-py': ['flow', 'sequence', 'table', 'compare', 'states', 'boxes'],
  // Web Full-Stack Certification Course Tracks (Months 1–12)
  'react-basics': ['component-tree', 'wireframe', 'flow', 'boxes', 'compare', 'states'],
  'node-web': ['sequence', 'stack-queue', 'flow', 'boxes', 'table', 'states'],
  'dsa-optim': ['cells', 'stack-queue', 'tree-graph', 'table', 'bars', 'compare'],
  devops: ['flow', 'workflow', 'states', 'sequence', 'compare'],
  cloud: ['workflow', 'sequence', 'states', 'table', 'bars', 'compare'],
  dist: ['sequence', 'workflow', 'states', 'table', 'cells', 'compare'],
  cyber: ['flow', 'sequence', 'table', 'compare', 'states'],
  ai: ['flow', 'table', 'bars', 'sequence', 'compare', 'boxes'],
  'sre-web': ['bars', 'states', 'sequence', 'table', 'workflow', 'compare'],
  'stream-web': ['cells', 'flow', 'sequence', 'bars', 'table', 'states'],
  'aideploy-web': ['workflow', 'flow', 'bars', 'table', 'states', 'compare'],
  // IoT & Hardware Systems Masterclasses
  iot_emb: ['register-bits', 'flow', 'states', 'boxes'],
  iot_net: ['register-bits', 'flow', 'sequence', 'states'],
  iot_edge: ['register-bits', 'flow', 'bars', 'states'],
  iot_sec: ['register-bits', 'flow', 'states', 'sequence'],
  // Launchpad & Core Engineering
  comp_fund: ['cells', 'boxes', 'flow', 'table'],
  git_vcs: ['workflow', 'flow', 'tree-graph', 'states'],
  excel_viz: ['bars', 'table', 'flow', 'cells'],
  'soft-skills': ['workflow', 'funnel', 'flow', 'compare'],
  // Advanced Systems & Graphics
  'java-basics': ['stack-queue', 'flow', 'boxes', 'cells'],
  mobile: ['component-tree', 'wireframe', 'flow', 'states'],
  'fullstack-js': ['flow', 'sequence', 'boxes', 'table'],
  design: ['wireframe', 'component-tree', 'compare', 'flow'],
  blockchain: ['sequence', 'flow', 'states', 'table'],
  g3d: ['states', 'flow', 'boxes', 'bars'],
  'quant-systems': ['states', 'bars', 'flow', 'table'],
  // Flagship Commerce & B.Com Specializations
  'bcom-accounting': ['ledger-sheet', 'table', 'bars', 'flow'],
  bcom_acc: ['ledger-sheet', 'table', 'bars', 'flow'],
  'bcom-finance': ['ledger-sheet', 'bars', 'table', 'funnel'],
  bcom_tax: ['ledger-sheet', 'table', 'bars', 'flow'],
  bcom_aud: ['ledger-sheet', 'workflow', 'table', 'bars', 'funnel'],
  bcom_ban: ['ledger-sheet', 'flow', 'table', 'bars', 'funnel'],
  bcom_law: ['ledger-sheet', 'workflow', 'table', 'flow'],
  bcom_ops: ['workflow', 'bars', 'flow', 'funnel'],
  bcom_ait: ['tree-graph', 'flow', 'workflow', 'bars'],
  bcom_ana: ['bars', 'table', 'flow', 'funnel'],
  'bcom-marketing': ['funnel', 'bars', 'flow', 'compare'],
  bcom_marketing: ['funnel', 'bars', 'flow', 'compare'],
  bcom_scrm: ['funnel', 'workflow', 'bars', 'table'],
  bcom_ent: ['funnel', 'bars', 'workflow', 'table'],
  bcom_ecom: ['funnel', 'bars', 'workflow', 'flow'],
  bcom_dmkt: ['funnel', 'bars', 'flow', 'table'],
};

const STOP_WORDS = new Set([
  'this', 'that', 'with', 'from', 'have', 'were', 'what', 'when', 'your', 'will',
  'then', 'them', 'they', 'some', 'each', 'also', 'just', 'into', 'only', 'more',
  'here', 'make', 'like', 'than', 'been', 'there', 'their', 'which', 'about', 'would',
  'could', 'should', 'other', 'these', 'those', 'after', 'first', 'where', 'while',
  'being', 'does', 'doing', 'look', 'same', 'over', 'such', 'most'
]);

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getImportantWords(text: string): Set<string> {
  const words = text.toLowerCase().match(/[a-z0-9]+/g) || [];
  const important = new Set<string>();
  for (const w of words) {
    if (w.length >= 4 && !STOP_WORDS.has(w)) {
      important.add(w);
    }
  }
  return important;
}

function isBinding(val: unknown): boolean {
  if (val == null || typeof val !== 'object') return false;
  const obj = val as Record<string, unknown>;
  if ('var' in obj && typeof obj.var === 'string') return true;
  if ('out' in obj && typeof obj.out === 'number') return true;
  if ('table' in obj && typeof obj.table === 'number') return true;
  if ('error' in obj && obj.error === true) return true;
  if ('text' in obj && typeof obj.text === 'string') return true;
  return false;
}

function extractBindings(spec: any): any[] {
  const bindings: any[] = [];
  if (!spec || typeof spec !== 'object') return bindings;

  function traverse(obj: any) {
    if (obj == null) return;
    if (typeof obj === 'object') {
      if (isBinding(obj)) {
        bindings.push(obj);
      }
      for (const val of Object.values(obj)) {
        if (typeof val === 'object' && val !== null) {
          traverse(val);
        }
      }
    }
  }

  if (Array.isArray(spec.steps)) {
    for (const step of spec.steps) {
      if (step.values) {
        for (const v of Object.values(step.values)) {
          if (isBinding(v)) bindings.push(v);
        }
      }
      if (step.messages) {
        for (const msg of step.messages) {
          if (isBinding(msg.label)) bindings.push(msg.label);
        }
      }
      if (step.transition?.label && isBinding(step.transition.label)) {
        bindings.push(step.transition.label);
      }
    }
  }

  return bindings;
}

export function checkDayFile(fileInput: string | any, options?: GateCheckOptions): GateResult {
  const errors: string[] = [];

  let file: any;
  if (typeof fileInput === 'string') {
    try {
      const raw = fs.readFileSync(fileInput, 'utf-8');
      file = JSON.parse(raw);
    } catch (err: any) {
      return {
        passed: false,
        errors: [`R1: Failed to read or parse day file at "${fileInput}": ${err?.message ?? err}`],
      };
    }
  } else {
    file = fileInput;
  }

  if (!file || typeof file !== 'object') {
    return {
      passed: false,
      errors: ['R1: Day file is not an object'],
    };
  }

  // --- R1: Exactly matching entries, partTitle matches real part title ---
  const entries = file.entries;
  const lesson: LongLesson | null = getLongLesson(file.prefix, file.day);
  const expectedCount = lesson?.parts?.length ?? 5;
  if (!Array.isArray(entries) || entries.length !== expectedCount) {
    errors.push(`R1: Day file must have exactly ${expectedCount} entries, found ${entries?.length ?? 0}`);
  }

  if (!lesson) {
    errors.push(`R1: Lesson not found for course "${file.prefix}" day ${file.day}`);
  } else if (Array.isArray(entries)) {
    for (let i = 0; i < Math.min(entries.length, lesson.parts.length); i++) {
      const entry = entries[i];
      const realTitle = lesson.parts[i]?.title;
      if (entry?.partTitle !== realTitle) {
        errors.push(`R1: Entry [${i}] partTitle "${entry?.partTitle}" does not match real part title "${realTitle}"`);
      }
    }
  }

  // --- R2: Template is none or on course allowed list ---
  const allowedTemplates = COURSE_ALLOWED_TEMPLATES[file.prefix] ?? [];
  if (Array.isArray(entries)) {
    for (let i = 0; i < entries.length; i++) {
      const template = entries[i]?.spec?.template;
      if (!template) {
        errors.push(`R2: Entry [${i}] is missing template`);
      } else if (template !== 'none' && !allowedTemplates.includes(template)) {
        errors.push(
          `R2: Entry [${i}] template "${template}" is not allowed for course "${file.prefix}". Allowed: ${allowedTemplates.join(', ')}`
        );
      }
    }
  }

  // --- R3: 2-5 steps, at most 6 shapes (table 2-5 cols, max 6 rows) ---
  if (Array.isArray(entries)) {
    for (let i = 0; i < entries.length; i++) {
      const spec = entries[i]?.spec;
      if (!spec || spec.template === 'none') continue;

      const steps = spec.steps;
      if (!Array.isArray(steps) || steps.length < 2 || steps.length > 5) {
        errors.push(`R3: Entry [${i}] template "${spec.template}" has ${steps?.length ?? 0} steps, expected 2-5`);
      }

      switch (spec.template) {
        case 'flow':
          if (spec.nodes && spec.nodes.length > 6) {
            errors.push(`R3: Entry [${i}] flow has ${spec.nodes.length} nodes, max 6`);
          }
          break;
        case 'boxes':
          if (spec.boxes && spec.boxes.length > 6) {
            errors.push(`R3: Entry [${i}] boxes has ${spec.boxes.length} boxes, max 6`);
          }
          break;
        case 'table':
          if (!Array.isArray(spec.columns) || spec.columns.length < 2 || spec.columns.length > 5) {
            errors.push(`R3: Entry [${i}] table has ${spec.columns?.length ?? 0} columns, expected 2-5`);
          }
          if (Array.isArray(steps)) {
            for (let s = 0; s < steps.length; s++) {
              if (!Array.isArray(steps[s].rows) || steps[s].rows.length < 1 || steps[s].rows.length > 6) {
                errors.push(`R3: Entry [${i}] step [${s}] table has ${steps[s].rows?.length ?? 0} rows, expected 1-6`);
              }
            }
          }
          break;
        case 'letters':
          if (spec.word && spec.word.length > 6) {
            errors.push(`R3: Entry [${i}] letters word length is ${spec.word.length}, max 6`);
          }
          break;
        case 'compare':
          break;
        case 'cells':
          if (spec.cells && spec.cells.length > 6) {
            errors.push(`R3: Entry [${i}] cells has ${spec.cells.length} cells, max 6`);
          }
          break;
        case 'stack-queue':
          if (spec.items && spec.items.length > 6) {
            errors.push(`R3: Entry [${i}] stack-queue has ${spec.items.length} items, max 6`);
          }
          if (Array.isArray(steps)) {
            for (let s = 0; s < steps.length; s++) {
              if (steps[s].items && steps[s].items.length > 6) {
                errors.push(`R3: Entry [${i}] step [${s}] stack-queue has ${steps[s].items.length} items, max 6`);
              }
            }
          }
          break;
        case 'tree-graph':
          if (spec.nodes && spec.nodes.length > 6) {
            errors.push(`R3: Entry [${i}] tree-graph has ${spec.nodes.length} nodes, max 6`);
          }
          break;
        case 'bars':
          if (spec.bars && spec.bars.length > 6) {
            errors.push(`R3: Entry [${i}] bars has ${spec.bars.length} bars, max 6`);
          }
          break;
        case 'sequence':
          if (spec.actors && (spec.actors.length < 2 || spec.actors.length > 4)) {
            errors.push(`R3: Entry [${i}] sequence has ${spec.actors.length} actors, expected 2-4`);
          }
          break;
        case 'states':
          if (spec.states && (spec.states.length < 2 || spec.states.length > 5)) {
            errors.push(`R3: Entry [${i}] states has ${spec.states.length} states, expected 2-5`);
          }
          break;
      }
    }
  }

  // --- Helper to get part text ---
  function getPartAllText(part?: LongLessonPart): string {
    if (!part) return '';
    return [part.title, ...(part.say || []), part.example ?? '', part.code ?? '', part.tryIt ?? ''].join(' ');
  }

  // --- R4: at values valid and strictly increasing ---
  if (lesson && Array.isArray(entries)) {
    for (let i = 0; i < entries.length; i++) {
      const spec = entries[i]?.spec;
      if (!spec || spec.template === 'none' || !Array.isArray(spec.steps)) continue;
      const part = lesson.parts[i];
      if (!part) continue;

      let prevRank = -1;
      let prevAt = '';
      for (let s = 0; s < spec.steps.length; s++) {
        const at = spec.steps[s]?.at;
        let rank = -1;
        if (typeof at !== 'string') {
          errors.push(`R4: Entry [${i}] step [${s}] at is missing or invalid`);
          continue;
        }

        if (at.startsWith('say')) {
          const n = parseInt(at.slice(3), 10);
          if (isNaN(n) || n < 1) {
            errors.push(`R4: Entry [${i}] step [${s}] at "${at}" has invalid say number`);
          } else if (!part.say || n > part.say.length) {
            errors.push(
              `R4: Entry [${i}] step [${s}] at "${at}" is invalid; part has only ${part.say?.length ?? 0} say lines`
            );
          } else {
            rank = n;
          }
        } else if (at === 'example') {
          if (!part.example) {
            errors.push(`R4: Entry [${i}] step [${s}] at "example" is invalid; part has no example`);
          } else {
            rank = 1000;
          }
        } else if (at === 'tryIt') {
          if (!part.tryIt) {
            errors.push(`R4: Entry [${i}] step [${s}] at "tryIt" is invalid; part has no tryIt`);
          } else {
            rank = 2000;
          }
        } else if (at === 'intro') {
          rank = 0;
        } else {
          errors.push(`R4: Entry [${i}] step [${s}] unknown at value "${at}"`);
        }

        if (rank !== -1) {
          if (s > 0 && rank <= prevRank) {
            errors.push(
              `R4: Entry [${i}] step [${s}] at "${at}" is not strictly increasing after "${prevAt}"`
            );
          }
          prevRank = rank;
          prevAt = at;
        }
      }
    }
  }

  // --- R5: Caption is 1 sentence, <= 80 chars, ends in '.', no emoji ---
  if (Array.isArray(entries)) {
    for (let i = 0; i < entries.length; i++) {
      const spec = entries[i]?.spec;
      if (!spec || spec.template === 'none' || !Array.isArray(spec.steps)) continue;

      for (let s = 0; s < spec.steps.length; s++) {
        const caption = spec.steps[s]?.caption;
        if (typeof caption !== 'string') {
          errors.push(`R5: Entry [${i}] step [${s}] caption is missing`);
          continue;
        }
        if (caption.length > 80) {
          errors.push(`R5: Entry [${i}] step [${s}] caption exceeds 80 characters (${caption.length})`);
        }
        if (!caption.endsWith('.')) {
          errors.push(`R5: Entry [${i}] step [${s}] caption does not end with '.'`);
        }
        if (caption.slice(0, -1).includes('. ') || caption.includes('?') || caption.includes('!')) {
          errors.push(`R5: Entry [${i}] step [${s}] caption must be a single sentence`);
        }
        if (/(\p{Extended_Pictographic}|\p{Emoji_Presentation})/u.test(caption)) {
          errors.push(`R5: Entry [${i}] step [${s}] caption contains emoji`);
        }
      }
    }
  }

  // --- R6: Values are bindings, text/edit verbatim in part, filled valid ---
  if (lesson && Array.isArray(entries)) {
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const spec = entry?.spec;
      if (!spec || spec.template === 'none') continue;
      const part = lesson.parts[i];
      const partAllText = getPartAllText(part);

      // Check filled object exists
      if (!entry.filled || typeof entry.filled !== 'object') {
        errors.push(`R6: Entry [${i}] filled data is missing or not an object`);
      }

      // Check step values are bindings
      if (Array.isArray(spec.steps)) {
        for (let s = 0; s < spec.steps.length; s++) {
          const step = spec.steps[s];
          if (step.values && typeof step.values === 'object') {
            for (const [k, val] of Object.entries(step.values)) {
              if (!isBinding(val)) {
                errors.push(`R6: Entry [${i}] step [${s}] value for "${k}" is not a binding`);
              }
            }
          }

          // Check text binding verbatim presence
          const bindings = extractBindings(spec);
          for (const b of bindings) {
            if (b.text && !partAllText.includes(b.text)) {
              errors.push(`R6: Entry [${i}] text binding "${b.text}" does not appear verbatim in the part`);
            }
          }

          // Check edit lines verbatim presence
          if (step.edit) {
            if (step.edit.replaceLine?.text) {
              const editLine = step.edit.replaceLine.text;
              if (!partAllText.includes(editLine)) {
                errors.push(`R6: Entry [${i}] step [${s}] edit line "${editLine}" does not appear verbatim in the part`);
              }
            }
            if (Array.isArray(step.edit.appendLines)) {
              for (const line of step.edit.appendLines) {
                if (!partAllText.includes(line)) {
                  errors.push(`R6: Entry [${i}] step [${s}] edit line "${line}" does not appear verbatim in the part`);
                }
              }
            }
          }
        }
      }
    }
  }

  // --- R7: Caption numbers in code or bound values ---
  if (lesson && Array.isArray(entries)) {
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const spec = entry?.spec;
      if (!spec || spec.template === 'none' || !Array.isArray(spec.steps)) continue;
      const part = lesson.parts[i];
      const partCode = part?.code ?? '';

      for (let s = 0; s < spec.steps.length; s++) {
        const step = spec.steps[s];
        const caption = step?.caption ?? '';
        const numbers = caption.match(/\b\d+(\.\d+)?\b/g) || [];

        // Collect bound values for this step or filled values
        const boundValues = new Set<string>();
        if (step.values) {
          for (const v of Object.values(step.values)) {
            if (isBinding(v)) {
              const b: any = v;
              if (b.var) boundValues.add(b.var);
              if (b.out != null) boundValues.add(String(b.out));
              if (b.line != null) boundValues.add(String(b.line));
            }
          }
        }
        if (entry.filled) {
          function collectStrings(obj: any) {
            if (obj == null) return;
            if (typeof obj === 'number' || typeof obj === 'string') {
              boundValues.add(String(obj));
            } else if (typeof obj === 'object') {
              for (const v of Object.values(obj)) collectStrings(v);
            }
          }
          collectStrings(entry.filled);
        }

        for (const num of numbers) {
          const inCode = new RegExp(`\\b${escapeRegExp(num)}\\b`).test(partCode);
          const inBound = boundValues.has(num);
          if (!inCode && !inBound) {
            errors.push(
              `R7: Entry [${i}] step [${s}] caption number "${num}" is neither in code nor bound in this step`
            );
          }
        }
      }
    }
  }

  // --- R8: Tappable labels appear as a whole word in part text or code ---
  if (lesson && Array.isArray(entries)) {
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const spec = entry?.spec;
      if (!spec || spec.template === 'none') continue;
      // Spec v1.1 Rule: Only flow and boxes have tappable nodes/boxes for text underline linking
      if (spec.template !== 'flow' && spec.template !== 'boxes') continue;
      const part = lesson.parts[i];
      const partAllText = getPartAllText(part);

      // Call getTappableLabelsForVisual from visualRules.ts
      const labels = getTappableLabelsForVisual(spec as any);
      for (const label of labels) {
        const strLabel = typeof label === 'string' ? label.trim() : String(label || '').trim();
        if (!strLabel) continue;
        const regex = new RegExp(`\\b${escapeRegExp(strLabel)}\\b`, 'i');
        if (!regex.test(partAllText)) {
          errors.push(
            `R8: Entry [${i}] tappable label "${strLabel}" does not appear as a whole word in part text or code`
          );
        }
      }
    }
  }

  // --- R9: Tones are only data, ok, error, idle ---
  const VALID_TONES = new Set(['data', 'ok', 'error', 'idle']);
  if (Array.isArray(entries)) {
    for (let i = 0; i < entries.length; i++) {
      const spec = entries[i]?.spec;
      if (!spec || spec.template === 'none' || !Array.isArray(spec.steps)) continue;

      for (let s = 0; s < spec.steps.length; s++) {
        const step = spec.steps[s];
        if (step.tones && typeof step.tones === 'object') {
          for (const [key, tone] of Object.entries(step.tones)) {
            if (typeof tone === 'string' && !VALID_TONES.has(tone)) {
              errors.push(`R9: Entry [${i}] step [${s}] invalid tone "${tone}" for "${key}"`);
            }
          }
        }
        if (step.tone && !VALID_TONES.has(step.tone)) {
          errors.push(`R9: Entry [${i}] step [${s}] invalid tone "${step.tone}"`);
        }
        if (Array.isArray(step.messages)) {
          for (let m = 0; m < step.messages.length; m++) {
            const tone = step.messages[m]?.tone;
            if (tone && !VALID_TONES.has(tone)) {
              errors.push(`R9: Entry [${i}] step [${s}] message [${m}] invalid tone "${tone}"`);
            }
          }
        }
        if (Array.isArray(step.bars)) {
          for (let b = 0; b < step.bars.length; b++) {
            const tone = step.bars[b]?.tone;
            if (tone && !VALID_TONES.has(tone)) {
              errors.push(`R9: Entry [${i}] step [${s}] bar [${b}] invalid tone "${tone}"`);
            }
          }
        }
        if (Array.isArray(step.rows)) {
          for (let r = 0; r < step.rows.length; r++) {
            const tone = step.rows[r]?.tone;
            if (tone && !VALID_TONES.has(tone)) {
              errors.push(`R9: Entry [${i}] step [${s}] row [${r}] invalid tone "${tone}"`);
            }
          }
        }
      }
    }
  }

  // --- R10: At least 3 parts have a picture, otherwise marked needs-review ---
  if (Array.isArray(entries)) {
    let pictureCount = 0;
    for (const entry of entries) {
      if (entry?.spec?.template && entry.spec.template !== 'none') {
        pictureCount++;
      }
    }
    const minPictures = Math.min(3, Math.ceil((lesson?.parts?.length ?? 5) / 2));
    if (pictureCount < minPictures && file.status !== 'needs-review') {
      errors.push(
        `R10: Day has fewer than ${minPictures} pictures (${pictureCount}/${entries.length}) but is not marked needs-review`
      );
    }
  }

  // --- R11: Manifest status matches the file ---
  let manifest = options?.manifest;
  if (!manifest) {
    const manifestPath = options?.manifestPath || path.resolve(process.cwd(), 'docs/visuals/py_cert_manifest.json');
    if (fs.existsSync(manifestPath)) {
      try {
        manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
      } catch {
        // ignore if not readable
      }
    }
  }

  if (manifest && manifest.keys && Array.isArray(entries)) {
    for (let i = 0; i < entries.length; i++) {
      const key = `${file.prefix}:${file.day}:${i}`;
      const item = manifest.keys[key];
      if (item) {
        const status = item.status;
        const validStatuses = ['passed', 'none', 'needs-review', 'pilot'];
        if (!validStatuses.includes(status)) {
          errors.push(
            `R11: Manifest key "${key}" status "${status}" is invalid for a day file entry`
          );
        }
      }
    }
  }

  // --- R12: On-concept check (caption shares 4+ letter word with attached text) ---
  if (lesson && Array.isArray(entries)) {
    for (let i = 0; i < entries.length; i++) {
      const spec = entries[i]?.spec;
      if (!spec || spec.template === 'none' || !Array.isArray(spec.steps)) continue;
      const part = lesson.parts[i];
      if (!part) continue;

      for (let s = 0; s < spec.steps.length; s++) {
        const step = spec.steps[s];
        const at = step?.at;
        const caption = step?.caption ?? '';

        let attachedText = '';
        if (typeof at === 'string') {
          if (at.startsWith('say')) {
            const idx = parseInt(at.slice(3), 10) - 1;
            attachedText = part.say?.[idx] ?? '';
          } else if (at === 'example') {
            attachedText = part.example ?? '';
          } else if (at === 'tryIt') {
            attachedText = part.tryIt ?? '';
          } else if (at === 'intro') {
            attachedText = part.say?.[0] ?? part.title;
          }
        }

        const captionWords = getImportantWords(caption);
        const attachedWords = getImportantWords(attachedText);

        let sharedWord = false;
        for (const w of captionWords) {
          if (attachedWords.has(w)) {
            sharedWord = true;
            break;
          }
        }

        if (!sharedWord) {
          errors.push(
            `R12: Entry [${i}] step [${s}] caption shares no important words (4+ letters) with attached text at "${at}"`
          );
        }
      }
    }
  }

  // --- R13: Fresh check (codeHash equals SHA-256 of part's current code) ---
  if (lesson && Array.isArray(entries)) {
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const part = lesson.parts[i];
      const code = part?.code ?? '';
      const expectedHash = crypto.createHash('sha256').update(code).digest('hex');
      if (entry?.codeHash !== expectedHash) {
        errors.push(
          `R13: Entry [${i}] codeHash "${entry?.codeHash}" does not match SHA-256 of current code "${expectedHash}"`
        );
      }
    }
  }

  // --- R14: Stable values (no binding points to an unstable variable) ---
  const unstableSet = new Set<string>([
    ...(options?.unstableVars || []),
    ...(Array.isArray(file.unstableVars) ? file.unstableVars : []),
  ]);

  if (Array.isArray(entries)) {
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const spec = entry?.spec;
      if (!spec || spec.template === 'none') continue;

      const bindings = extractBindings(spec);
      for (const b of bindings) {
        if (b.var && unstableSet.has(b.var)) {
          errors.push(`R14: Entry [${i}] binding points to unstable variable "${b.var}"`);
        }
      }
    }
  }

  return {
    passed: errors.length === 0,
    errors,
  };
}
