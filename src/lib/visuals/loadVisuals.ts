import type { LessonVisual } from '@/lib/types/lessonVisual';
import { isCourseVisualsEnabled } from '@/lib/visuals/enabledCourses';

export interface DayFileEntry {
  partTitle: string;
  codeHash: string;
  spec: {
    template: string;
    [key: string]: unknown;
  };
  filled: Record<string, unknown>;
}

export interface LessonVisualDayFile {
  schemaVersion: number;
  prefix: string;
  day: number;
  promptSha: string;
  model: string;
  entries: DayFileEntry[];
}

// In-memory cache for loaded day files
const dayFileCache = new Map<string, LessonVisualDayFile | null>();

/**
 * Register a day file in the in-memory cache (useful for testing or pre-bundling).
 */
export function registerDayFile(dayFile: LessonVisualDayFile): void {
  const cacheKey = `${dayFile.prefix}:${dayFile.day}`;
  dayFileCache.set(cacheKey, dayFile);
}

/**
 * Clear the day file in-memory cache (useful for test isolation).
 */
export function clearDayFileCache(): void {
  dayFileCache.clear();
}

/**
 * Synchronously load a day file from disk (in Node / SSR / test environments)
 * or from cache. Returns null if not found or corrupted.
 */
export function loadDayFile(prefix: string, day: number): LessonVisualDayFile | null {
  const cacheKey = `${prefix}:${day}`;
  if (dayFileCache.has(cacheKey)) {
    return dayFileCache.get(cacheKey) ?? null;
  }

  // If running in an environment with Node.js fs (tests, build, server)
  if (typeof window === 'undefined') {
    try {
      // [FIX-STAGE: Wave 1A] Removed forbidden @typescript-eslint disable comment (file is ignored by .eslintrc.json);
      // dynamic require prevents Next.js client bundler from trying to polyfill Node fs/path.
      const req = typeof require !== 'undefined' ? require : eval('require');
      const fs = req('fs');
      const path = req('path');
      const dayPadded = String(day).padStart(2, '0');
      const filePath = path.resolve(
        process.cwd(),
        `src/lib/data/lessonVisuals/${prefix}/day-${dayPadded}.json`
      );

      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        dayFileCache.set(cacheKey, parsed);
        return parsed;
      }
    } catch (err) {
      console.error(`[PinIT][Fix:LoadVisuals] Failed loading day file for ${prefix} day ${day}:`, err);
    }
    dayFileCache.set(cacheKey, null);
    return null;
  }

  // In browser, return from cache if present; otherwise return null without locking cache
  return dayFileCache.get(cacheKey) ?? null;
}

/**
 * Asynchronously fetch and cache a day file in browser/client environments,
 * or load synchronously in Node environments.
 */
export async function fetchAndCacheDayFile(
  prefix: string,
  day: number
): Promise<LessonVisualDayFile | null> {
  const cacheKey = `${prefix}:${day}`;
  if (dayFileCache.has(cacheKey) && dayFileCache.get(cacheKey) !== null) {
    return dayFileCache.get(cacheKey)!;
  }

  if (!isCourseVisualsEnabled(prefix)) {
    return null;
  }

  // Node environment
  if (typeof window === 'undefined') {
    return loadDayFile(prefix, day);
  }

  // Browser environment: fetch from API endpoint
  try {
    const res = await fetch(`/api/visuals?prefix=${encodeURIComponent(prefix)}&day=${day}`);
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.entries)) {
        registerDayFile(data);
        return data;
      }
    }
  } catch {
    // Non-fatal network error
  }

  return null;
}

/**
 * Retrieve the visual for a specific lesson part.
 *
 * Rules (Plan E-15, E-21):
 * 1. Load day file only for prefixes listed in enabledCourses.ts.
 * 2. Disabled courses get no visuals (returns null).
 * 3. Missing files return null without crashing.
 */
export function getVisual(
  prefix: string,
  day: number,
  partIndex: number
): LessonVisual | null {
  // 1. Release switch: course must be enabled
  if (!isCourseVisualsEnabled(prefix)) {
    return null;
  }

  // 2. Load from day file
  const dayFile: any = loadDayFile(prefix, day);
  if (!dayFile) {
    return null;
  }

  const entriesList: any[] = Array.isArray(dayFile.entries)
    ? dayFile.entries
    : Array.isArray(dayFile.visuals)
    ? dayFile.visuals
    : Array.isArray(dayFile)
    ? dayFile
    : [];

  const entry: any = entriesList[partIndex];
  if (!entry) {
    return null;
  }

  const specObj: any = entry.spec && typeof entry.spec === 'object' ? entry.spec : entry;
  if (specObj.template === 'none') {
    return null;
  }

  let visual: LessonVisual | null = null;
  if (entry.filled && typeof entry.filled === 'object') {
    if ('template' in entry.filled && typeof entry.filled.template === 'string' && entry.filled.template !== 'none' && Array.isArray((entry.filled as any).steps)) {
      visual = entry.filled as unknown as LessonVisual;
    } else if ('visual' in entry.filled && entry.filled.visual && typeof (entry.filled.visual as any).template === 'string') {
      visual = entry.filled.visual as LessonVisual;
    }
  }
  if (!visual && specObj && typeof specObj === 'object') {
    if (typeof specObj.template === 'string' && specObj.template !== 'none' && Array.isArray(specObj.steps)) {
      visual = specObj as unknown as LessonVisual;
    } else if (typeof specObj.template === 'string' && specObj.data && Array.isArray(specObj.data.steps)) {
      visual = {
        template: specObj.template,
        title: specObj.title || specObj.data.title || `${prefix} Day ${day} Part ${partIndex + 1}`,
        ...specObj.data,
        steps: specObj.data.steps,
      } as unknown as LessonVisual;
    } else if (specObj.ledger && Array.isArray(specObj.steps)) {
      visual = {
        template: 'ledger-sheet',
        title: specObj.title || `${prefix} Day ${day} Part ${partIndex + 1}`,
        ...specObj,
      } as unknown as LessonVisual;
    }
  }

  if (!visual || !visual.template || !Array.isArray(visual.steps) || visual.steps.length === 0) {
    return null;
  }

  // Normalization for robust student rendering:
  // 1. Compare template: ensure leftLabel and rightLabel are defined
  if (visual.template === 'compare') {
    const cv = visual as any;
    if (!cv.leftLabel) {
      cv.leftLabel = cv.left?.title || cv.left?.label || 'Left';
    }
    if (!cv.rightLabel) {
      cv.rightLabel = cv.right?.title || cv.right?.label || 'Right';
    }
  }

  // 2. Bars template: ensure step.bars is populated if visual.bars or visual.items exists
  if (visual.template === 'bars') {
    const rawBars = Array.isArray((visual as any).bars)
      ? (visual as any).bars
      : Array.isArray((visual as any).items)
      ? (visual as any).items
      : [];
    if (rawBars.length > 0 && Array.isArray(visual.steps)) {
      for (const step of visual.steps) {
        const s = step as any;
        if (!Array.isArray(s.bars) || s.bars.length === 0) {
          const activeIdx = s.activeBarIndex ?? -1;
          const badge = s.statusBadge;
          s.bars = rawBars.map((b: any, bIdx: number) => ({
            label: b.label || `Item ${bIdx + 1}`,
            value: b.value ?? 0,
            tone: b.tone || (bIdx === activeIdx ? (badge === 'completed' ? 'ok' : 'data') : 'idle'),
          }));
        }
      }
    }
  }

  return visual;
}

/**
 * Deterministic 4-step domain-calibrated visual synthesizer for standalone and B.Com
 * LongLesson parts when a static day-XX.json file is not present on disk.
 */
export function synthesizeLongLessonVisual(
  prefix: string,
  day: number,
  partIndex: number,
  part: { title: string; say?: string[]; example?: string; tryIt?: string; code?: string }
): LessonVisual | null {
  if (!isCourseVisualsEnabled(prefix)) {
    return null;
  }

  const normPrefix = prefix.toLowerCase().replace(/-/g, '_');
  const rawTitle = (part?.title || `Day ${day} Part ${partIndex + 1}`).trim();
  const titleLow = rawTitle.toLowerCase();
  const shortTitle = rawTitle.length > 48 ? `${rawTitle.slice(0, 45)}...` : rawTitle;
  const clipCaption = (text: string): string => {
    const clean = text.replace(/\s+/g, ' ').trim();
    return clean.length > 78 ? `${clean.slice(0, 75)}...` : clean;
  };

  // 1. Hardware, Embedded, IoT & Edge Security -> 4-step RegisterBitsVisual
  if (
    normPrefix.startsWith('iot_') ||
    /\b(register|mmio|bitmask|gpio|uart|spi|i2c|isr|interrupt|firmware|can\s+bus)\b/.test(titleLow)
  ) {
    const regName = `${normPrefix.toUpperCase().slice(0, 8)}_CR${(partIndex % 4) + 1}`;
    return {
      template: 'register-bits',
      title: `${shortTitle} — Register Bit Architecture`,
      steps: [
        {
          at: 'intro',
          caption: clipCaption(`Step 1: Initialize ${regName} with EN bit asserted (0x80).`),
          registerName: regName,
          bitWidth: 8,
          hexValue: '0x80',
          decimalValue: 128,
          maskApplied: '1 << 7',
          bits: [
            { index: 7, name: 'EN', value: 1, tone: 'ok', highlighted: true },
            { index: 6, name: 'RDY', value: 0, tone: 'idle' },
            { index: 5, name: 'IRQ', value: 0, tone: 'idle' },
            { index: 4, name: 'DMA', value: 0, tone: 'idle' },
            { index: 3, name: 'CRC', value: 0, tone: 'idle' },
            { index: 2, name: 'TX', value: 0, tone: 'idle' },
            { index: 1, name: 'RX', value: 0, tone: 'idle' },
            { index: 0, name: 'ERR', value: 0, tone: 'idle' }
          ]
        },
        {
          at: 'say1',
          caption: clipCaption(`Step 2: Peripheral asserts RDY & IRQ flags (0xE0) on ${regName}.`),
          registerName: regName,
          bitWidth: 8,
          hexValue: '0xE0',
          decimalValue: 224,
          maskApplied: '(1 << 6) | (1 << 5)',
          bits: [
            { index: 7, name: 'EN', value: 1, tone: 'ok' },
            { index: 6, name: 'RDY', value: 1, tone: 'data', highlighted: true },
            { index: 5, name: 'IRQ', value: 1, tone: 'data', highlighted: true },
            { index: 4, name: 'DMA', value: 0, tone: 'idle' },
            { index: 3, name: 'CRC', value: 0, tone: 'idle' },
            { index: 2, name: 'TX', value: 0, tone: 'idle' },
            { index: 1, name: 'RX', value: 0, tone: 'idle' },
            { index: 0, name: 'ERR', value: 0, tone: 'idle' }
          ]
        },
        {
          at: 'example',
          caption: clipCaption(`Step 3: Enable DMA burst & CRC verification bits (0xF8).`),
          registerName: regName,
          bitWidth: 8,
          hexValue: '0xF8',
          decimalValue: 248,
          maskApplied: '(1 << 4) | (1 << 3)',
          bits: [
            { index: 7, name: 'EN', value: 1, tone: 'ok' },
            { index: 6, name: 'RDY', value: 1, tone: 'ok' },
            { index: 5, name: 'IRQ', value: 1, tone: 'ok' },
            { index: 4, name: 'DMA', value: 1, tone: 'data', highlighted: true },
            { index: 3, name: 'CRC', value: 1, tone: 'data', highlighted: true },
            { index: 2, name: 'TX', value: 0, tone: 'idle' },
            { index: 1, name: 'RX', value: 0, tone: 'idle' },
            { index: 0, name: 'ERR', value: 0, tone: 'idle' }
          ]
        },
        {
          at: 'tryIt',
          caption: clipCaption(`Step 4: Full TX/RX frame committed with ERR=0 verified (0xFE).`),
          registerName: regName,
          bitWidth: 8,
          hexValue: '0xFE',
          decimalValue: 254,
          maskApplied: '~0x01',
          bits: [
            { index: 7, name: 'EN', value: 1, tone: 'ok' },
            { index: 6, name: 'RDY', value: 1, tone: 'ok' },
            { index: 5, name: 'IRQ', value: 1, tone: 'ok' },
            { index: 4, name: 'DMA', value: 1, tone: 'ok' },
            { index: 3, name: 'CRC', value: 1, tone: 'ok' },
            { index: 2, name: 'TX', value: 1, tone: 'ok', highlighted: true },
            { index: 1, name: 'RX', value: 1, tone: 'ok', highlighted: true },
            { index: 0, name: 'ERR', value: 0, tone: 'ok' }
          ]
        }
      ]
    };
  }

  // 2. Sales, CRM, Marketing, E-Commerce & Entrepreneurship -> 4-step FunnelVisual
  if (
    normPrefix === 'bcom_scrm' ||
    normPrefix === 'bcom_dmkt' ||
    normPrefix === 'bcom_marketing' ||
    normPrefix === 'bcom_ecom' ||
    normPrefix === 'bcom_ent' ||
    (!normPrefix.startsWith('bcom_') && !normPrefix.startsWith('bcom-') && /\b(funnel|conversion\s+rate|cac|roas)\b/.test(titleLow))
  ) {
    const baseVol = 10000 + (day * 250);
    const s2 = Math.round(baseVol * 0.45);
    const s3 = Math.round(baseVol * 0.18);
    const s4 = Math.round(baseVol * 0.072);
    const buildStages = (activeId: string) => [
      { id: 'top', label: 'Acquisition Reach', value: baseVol, percentage: 100, tone: (activeId === 'top' ? 'data' : 'ok') as any },
      { id: 'qual', label: 'Qualified Intent', value: s2, percentage: 45, dropoffRate: 55, tone: (activeId === 'qual' ? 'data' : 'ok') as any },
      { id: 'target', label: 'Active Evaluation', value: s3, percentage: 18, dropoffRate: 60, tone: (activeId === 'target' ? 'data' : 'ok') as any },
      { id: 'final', label: 'Retained Conversion', value: s4, percentage: 7.2, dropoffRate: 60, tone: (activeId === 'final' ? 'ok' : 'idle') as any }
    ];
    return {
      template: 'funnel',
      title: `${shortTitle} — Conversion Pipeline`,
      steps: [
        {
          at: 'intro',
          caption: clipCaption(`Top-of-funnel acquisition baseline (${baseVol.toLocaleString()} prospects).`),
          activeStageId: 'top',
          stages: buildStages('top')
        },
        {
          at: 'say1',
          caption: clipCaption(`Qualification filter retains 45% high-intent cohort (${s2.toLocaleString()}).`),
          activeStageId: 'qual',
          stages: buildStages('qual')
        },
        {
          at: 'example',
          caption: clipCaption(`Active pipeline evaluation stage (${s3.toLocaleString()} engaged accounts).`),
          activeStageId: 'target',
          stages: buildStages('target')
        },
        {
          at: 'tryIt',
          caption: clipCaption(`Closed-won & retained customer cohort verified (${s4.toLocaleString()}).`),
          activeStageId: 'final',
          stages: buildStages('final')
        }
      ]
    };
  }

  // 3. Operations, Git VCS & Executive Soft Skills -> 4-step WorkflowVisual
  if (
    normPrefix === 'bcom_ops' ||
    normPrefix === 'git_vcs' ||
    normPrefix === 'soft_skills'
  ) {
    const stages = normPrefix === 'git_vcs'
      ? [
          { id: 's1', name: 'Working Tree', subtext: 'git add', tone: 'data' as const },
          { id: 's2', name: 'Staging Index', subtext: 'git commit', tone: 'ok' as const },
          { id: 's3', name: 'Feature Branch', subtext: 'git rebase', tone: 'data' as const },
          { id: 's4', name: 'Mainline CI', subtext: 'Verified Merge', tone: 'ok' as const }
        ]
      : normPrefix === 'bcom_ops'
      ? [
          { id: 's1', name: 'Demand Forecast', subtext: 'EOQ / Safety Stock', tone: 'data' as const },
          { id: 's2', name: 'Procurement & WIP', subtext: 'Kanban Pull', tone: 'data' as const },
          { id: 's3', name: 'Six Sigma QA', subtext: 'Control Limits', tone: 'ok' as const },
          { id: 's4', name: 'Fulfillment SLA', subtext: 'OTIF 99.4%', tone: 'ok' as const }
        ]
      : [
          { id: 's1', name: 'Context Framing', subtext: 'Stakeholder Goal', tone: 'data' as const },
          { id: 's2', name: 'Structured Thesis', subtext: 'BLUF / Pyramid', tone: 'data' as const },
          { id: 's3', name: 'Objection Defense', subtext: 'Data-Backed', tone: 'ok' as const },
          { id: 's4', name: 'Executive Alignment', subtext: 'Action Plan', tone: 'ok' as const }
        ];

    return {
      template: 'workflow',
      title: `${shortTitle} — Operational Workflow`,
      stages,
      steps: [
        {
          at: 'intro',
          caption: clipCaption(`Stage 1 (${stages[0].name}): Initialize ${shortTitle}.`),
          activeStageId: 's1',
          statusBadge: 'INGRESS',
          throughput: '100% Ready',
          tone: 'data',
          stages
        },
        {
          at: 'say1',
          caption: clipCaption(`Stage 2 (${stages[1].name}): Process core workflow stage.`),
          activeStageId: 's2',
          statusBadge: 'IN_PROGRESS',
          throughput: 'Active',
          tone: 'data',
          stages
        },
        {
          at: 'example',
          caption: clipCaption(`Stage 3 (${stages[2].name}): Verify quality and invariants.`),
          activeStageId: 's3',
          statusBadge: 'VALIDATED',
          throughput: 'Zero Defects',
          tone: 'ok',
          stages
        },
        {
          at: 'tryIt',
          caption: clipCaption(`Stage 4 (${stages[3].name}): Commit end-to-end delivery.`),
          activeStageId: 's4',
          statusBadge: 'COMPLETED',
          throughput: 'SLA Met ✓',
          tone: 'ok',
          stages
        }
      ]
    };
  }

  // 4A. Business Analytics & Excel Visualization -> 4-step BarsVisual
  if (normPrefix === 'bcom_ana' || normPrefix === 'excel_viz') {
    const baseVal = 60 + ((day * 3 + partIndex * 5) % 25);
    return {
      template: 'bars',
      title: `${shortTitle} — Quantitative KPI Distribution`,
      steps: [
        {
          at: 'intro',
          caption: clipCaption(`Step 1: Baseline KPI cohort metrics for ${shortTitle}.`),
          max: 100,
          bars: [
            { label: 'Revenue Run-Rate', value: baseVal, tone: 'data' },
            { label: 'Contribution Margin', value: Math.round(baseVal * 0.65), tone: 'idle' },
            { label: 'Operating Cash Flow', value: Math.round(baseVal * 0.48), tone: 'idle' },
            { label: 'Net EBITDA', value: Math.round(baseVal * 0.32), tone: 'idle' }
          ]
        },
        {
          at: 'say1',
          caption: clipCaption(`Step 2: Isolate Contribution Margin & Operating Cash Flow drivers.`),
          max: 100,
          bars: [
            { label: 'Revenue Run-Rate', value: baseVal + 8, tone: 'ok' },
            { label: 'Contribution Margin', value: Math.round((baseVal + 8) * 0.72), tone: 'data' },
            { label: 'Operating Cash Flow', value: Math.round((baseVal + 8) * 0.56), tone: 'data' },
            { label: 'Net EBITDA', value: Math.round((baseVal + 8) * 0.38), tone: 'idle' }
          ]
        },
        {
          at: 'example',
          caption: clipCaption(`Step 3: Apply sensitivity model and benchmark variance thresholds.`),
          max: 100,
          bars: [
            { label: 'Revenue Run-Rate', value: baseVal + 12, tone: 'ok' },
            { label: 'Contribution Margin', value: Math.round((baseVal + 12) * 0.76), tone: 'ok' },
            { label: 'Operating Cash Flow', value: Math.round((baseVal + 12) * 0.62), tone: 'ok' },
            { label: 'Net EBITDA', value: Math.round((baseVal + 12) * 0.45), tone: 'data' }
          ]
        },
        {
          at: 'tryIt',
          caption: clipCaption(`Step 4: Commit audited analytical dashboard for ${shortTitle}.`),
          max: 100,
          bars: [
            { label: 'Revenue Run-Rate', value: baseVal + 15, tone: 'ok' },
            { label: 'Contribution Margin', value: Math.round((baseVal + 15) * 0.78), tone: 'ok' },
            { label: 'Operating Cash Flow', value: Math.round((baseVal + 15) * 0.65), tone: 'ok' },
            { label: 'Net EBITDA', value: Math.round((baseVal + 15) * 0.48), tone: 'ok' }
          ]
        }
      ]
    };
  }

  // 4B. AI Business Transformation -> 4-step TreeGraphVisual
  if (normPrefix === 'bcom_ait') {
    const nodes = [
      { id: 'n1', label: 'Context Query', tone: 'data' as const },
      { id: 'n2', label: 'Vector Retriever', tone: 'data' as const },
      { id: 'n3', label: 'Policy Guardrail', tone: 'ok' as const },
      { id: 'n4', label: 'Synthesized Action', tone: 'ok' as const }
    ];
    const edges: [string, string][] = [
      ['n1', 'n2'],
      ['n1', 'n3'],
      ['n2', 'n4'],
      ['n3', 'n4']
    ];
    return {
      template: 'tree-graph',
      title: `${shortTitle} — Enterprise AI Decision Graph`,
      nodes,
      edges,
      steps: [
        {
          at: 'intro',
          caption: clipCaption(`Step 1: Ingest enterprise Context Query for ${shortTitle}.`),
          activeNodeId: 'n1',
          visitedNodeIds: ['n1'],
          tones: { n1: 'data', n2: 'idle', n3: 'idle', n4: 'idle' }
        },
        {
          at: 'say1',
          caption: clipCaption(`Step 2: Traverse Vector Retriever for grounded domain knowledge.`),
          activeNodeId: 'n2',
          visitedNodeIds: ['n1', 'n2'],
          activeEdge: ['n1', 'n2'],
          tones: { n1: 'ok', n2: 'data', n3: 'idle', n4: 'idle' }
        },
        {
          at: 'example',
          caption: clipCaption(`Step 3: Validate compliance & hallucination bounds in Policy Guardrail.`),
          activeNodeId: 'n3',
          visitedNodeIds: ['n1', 'n2', 'n3'],
          activeEdge: ['n1', 'n3'],
          tones: { n1: 'ok', n2: 'ok', n3: 'data', n4: 'idle' }
        },
        {
          at: 'tryIt',
          caption: clipCaption(`Step 4: Emit verified Synthesized Action with audit provenance.`),
          activeNodeId: 'n4',
          visitedNodeIds: ['n1', 'n2', 'n3', 'n4'],
          activeEdge: ['n3', 'n4'],
          tones: { n1: 'ok', n2: 'ok', n3: 'ok', n4: 'ok' }
        }
      ]
    };
  }

  // 4C. Accounting, Finance, Tax, Audit, Banking & Corporate Law -> 4-step LedgerSheetVisual
  if (
    normPrefix.startsWith('bcom_') ||
    normPrefix.startsWith('bcom-')
  ) {
    const baseAmt = 2500 + (day * 150) + (partIndex * 200);
    const adjAmt = Math.round(baseAmt * 0.2);
    const totalAmt = baseAmt + adjAmt;
    return {
      template: 'ledger-sheet',
      title: `${shortTitle} — General Ledger Verification`,
      steps: [
        {
          at: 'intro',
          caption: clipCaption(`Step 1: Open primary debit entry (${baseAmt}) for ${shortTitle}.`),
          title: `Day ${day} Journal — Initial Posting`,
          isBalanced: true,
          totalDebit: baseAmt,
          totalCredit: baseAmt,
          entries: [
            { id: `JNL-${day}01`, account: 'Primary Operating Asset', debit: baseAmt, balance: baseAmt, tone: 'data', memo: 'Initial recognition' },
            { id: `JNL-${day}02`, account: 'Clearing & Settlement Control', credit: baseAmt, balance: 0, tone: 'ok', memo: 'Offset control' }
          ]
        },
        {
          at: 'say1',
          caption: clipCaption(`Step 2: Record secondary accrual adjustment (${adjAmt}).`),
          title: `Day ${day} Journal — Accrual Adjustment`,
          isBalanced: true,
          totalDebit: totalAmt,
          totalCredit: totalAmt,
          entries: [
            { id: `JNL-${day}01`, account: 'Primary Operating Asset', debit: baseAmt, balance: baseAmt, tone: 'ok' },
            { id: `JNL-${day}02`, account: 'Accrued Provision / Tax Control', debit: adjAmt, balance: totalAmt, tone: 'data' },
            { id: `JNL-${day}03`, account: 'Clearing & Settlement Control', credit: totalAmt, balance: 0, tone: 'ok' }
          ]
        },
        {
          at: 'example',
          caption: clipCaption(`Step 3: Reconcile sub-ledger balances against control total (${totalAmt}).`),
          title: `Day ${day} Journal — Reconciliation Check`,
          isBalanced: true,
          totalDebit: totalAmt,
          totalCredit: totalAmt,
          entries: [
            { id: `JNL-${day}01`, account: 'Verified Asset Sub-Ledger', debit: baseAmt, balance: baseAmt, tone: 'ok' },
            { id: `JNL-${day}02`, account: 'Verified Compliance Reserve', debit: adjAmt, balance: totalAmt, tone: 'ok' },
            { id: `JNL-${day}03`, account: 'General Ledger Control Account', credit: totalAmt, balance: 0, tone: 'data' }
          ]
        },
        {
          at: 'tryIt',
          caption: clipCaption(`Step 4: Double-entry invariant verified (Total DR ${totalAmt} = CR ${totalAmt}).`),
          title: `Day ${day} Journal — Audited Trial Balance`,
          isBalanced: true,
          totalDebit: totalAmt,
          totalCredit: totalAmt,
          entries: [
            { id: `JNL-${day}01`, account: 'Audited Operating Asset', debit: baseAmt, balance: baseAmt, tone: 'ok' },
            { id: `JNL-${day}02`, account: 'Audited Compliance Reserve', debit: adjAmt, balance: totalAmt, tone: 'ok' },
            { id: `JNL-${day}03`, account: 'Audited Treasury Settlement', credit: totalAmt, balance: 0, tone: 'ok' }
          ]
        }
      ]
    };
  }

  // 5. UI/UX Design Systems -> 4-step WireframeVisual
  if (normPrefix === 'design' || normPrefix === 'design_web') {
    const boxes = [
      { id: 'nav', label: 'Navigation Bar', flex: '1', tone: 'data' as const },
      { id: 'hero', label: 'Primary Hero Viewport', flex: '2', tone: 'ok' as const },
      { id: 'cta', label: 'Interactive CTA Card', flex: '1', tone: 'data' as const }
    ];
    return {
      template: 'wireframe',
      title: `${shortTitle} — Layout & Hierarchy Wireframe`,
      boxes,
      steps: [
        {
          at: 'intro',
          caption: clipCaption(`Step 1: Establish horizontal flex-row container for ${shortTitle}.`),
          layoutMode: 'flex-row',
          justifyContent: 'space-between',
          alignItems: 'center',
          activeBoxId: 'nav',
          tone: 'data',
          boxes
        },
        {
          at: 'say1',
          caption: clipCaption(`Step 2: Structure responsive grid hierarchy around Primary Hero Viewport.`),
          layoutMode: 'grid',
          justifyContent: 'center',
          alignItems: 'stretch',
          activeBoxId: 'hero',
          tone: 'ok',
          boxes
        },
        {
          at: 'example',
          caption: clipCaption(`Step 3: Inspect CSS box-model padding, border, and margin tokens.`),
          layoutMode: 'box-model',
          activeBoxId: 'cta',
          tone: 'data',
          boxes
        },
        {
          at: 'tryIt',
          caption: clipCaption(`Step 4: Verify mobile-first flex-col stacking & WCAG contrast.`),
          layoutMode: 'flex-col',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          activeBoxId: 'cta',
          tone: 'ok',
          boxes
        }
      ]
    };
  }

  // 6. Mobile App Development -> 4-step ComponentTreeVisual
  if (normPrefix === 'mobile') {
    const nodes = [
      { id: 'AppShell', name: '<MobileAppShell />', props: { theme: 'dark' }, state: { online: 'true' }, tone: 'ok' as const },
      { id: 'NavStack', name: '<NavigationStack />', props: { route: `Day${day}` }, tone: 'data' as const },
      { id: 'ScreenView', name: '<ScreenViewport />', state: { loading: 'false' }, tone: 'data' as const },
      { id: 'NativeBridge', name: '<NativeSensorBridge />', props: { fps: '60' }, tone: 'ok' as const }
    ];
    return {
      template: 'component-tree',
      title: `${shortTitle} — Mobile Component Hierarchy`,
      nodes,
      steps: [
        {
          at: 'intro',
          caption: clipCaption(`Step 1: Mount root <MobileAppShell /> for ${shortTitle}.`),
          activeId: 'AppShell',
          tone: 'data',
          nodes
        },
        {
          at: 'say1',
          caption: clipCaption(`Step 2: Pass route params down to <NavigationStack />.`),
          activeId: 'NavStack',
          reRenderingIds: ['NavStack', 'ScreenView'],
          propsPassed: { from: 'AppShell', to: 'NavStack', propName: 'route', value: `Day${day}` },
          tone: 'data',
          nodes
        },
        {
          at: 'example',
          caption: clipCaption(`Step 3: Render <ScreenViewport /> with reactive state bindings.`),
          activeId: 'ScreenView',
          reRenderingIds: ['ScreenView'],
          propsPassed: { from: 'NavStack', to: 'ScreenView', propName: 'payload', value: 'hydrated' },
          tone: 'ok',
          nodes
        },
        {
          at: 'tryIt',
          caption: clipCaption(`Step 4: Dispatch gesture event from <NativeSensorBridge /> to shell.`),
          activeId: 'NativeBridge',
          eventFired: { from: 'NativeBridge', to: 'AppShell', eventName: 'onNativeCommit' },
          tone: 'ok',
          nodes
        }
      ]
    };
  }

  // 7. Blockchain & Web3 -> 4-step SequenceVisual
  if (normPrefix === 'blockchain') {
    const actors = ['Wallet Signer', 'Mempool Node', 'EVM Contract', 'Block Ledger'];
    return {
      template: 'sequence',
      title: `${shortTitle} — On-Chain Transaction Sequence`,
      actors,
      steps: [
        {
          at: 'intro',
          caption: clipCaption(`Step 1: Wallet Signer signs payload for ${shortTitle}.`),
          activeActor: 'Wallet Signer',
          messages: [
            { from: 'Wallet Signer', to: 'Mempool Node', label: 'eth_sendRawTransaction(sig)', tone: 'data' }
          ]
        },
        {
          at: 'say1',
          caption: clipCaption(`Step 2: Mempool Node validates nonce & gas limit, forwards to EVM.`),
          activeActor: 'Mempool Node',
          messages: [
            { from: 'Wallet Signer', to: 'Mempool Node', label: 'eth_sendRawTransaction(sig)', tone: 'ok' },
            { from: 'Mempool Node', to: 'EVM Contract', label: 'CALLDATA + Gas Check', tone: 'data' }
          ]
        },
        {
          at: 'example',
          caption: clipCaption(`Step 3: EVM Contract verifies invariants and mutates state root.`),
          activeActor: 'EVM Contract',
          messages: [
            { from: 'Wallet Signer', to: 'Mempool Node', label: 'eth_sendRawTransaction(sig)', tone: 'ok' },
            { from: 'Mempool Node', to: 'EVM Contract', label: 'CALLDATA + Gas Check', tone: 'ok' },
            { from: 'EVM Contract', to: 'Block Ledger', label: 'SSTORE + Emit Event', tone: 'data' }
          ]
        },
        {
          at: 'tryIt',
          caption: clipCaption(`Step 4: Block Ledger seals Merkle root and returns receipt.`),
          activeActor: 'Block Ledger',
          messages: [
            { from: 'Wallet Signer', to: 'Mempool Node', label: 'eth_sendRawTransaction(sig)', tone: 'ok' },
            { from: 'Mempool Node', to: 'EVM Contract', label: 'CALLDATA + Gas Check', tone: 'ok' },
            { from: 'EVM Contract', to: 'Block Ledger', label: 'SSTORE + Emit Event', tone: 'ok' },
            { from: 'Block Ledger', to: 'Wallet Signer', label: 'TxReceipt (Finalized ✓)', tone: 'ok' }
          ]
        }
      ]
    };
  }

  // 8. 3D Graphics & Low-Latency Quant Systems -> 4-step StatesVisual
  if (normPrefix === 'g3d' || normPrefix === 'quant_systems') {
    const states = normPrefix === 'g3d'
      ? [
          { id: 'st1', label: 'Scene Graph' },
          { id: 'st2', label: 'Vertex Transform' },
          { id: 'st3', label: 'Fragment Shader' },
          { id: 'st4', label: 'Frame Buffer' }
        ]
      : [
          { id: 'st1', label: 'Market Feed' },
          { id: 'st2', label: 'Risk Gate' },
          { id: 'st3', label: 'Limit Order Book' },
          { id: 'st4', label: 'Execution Fill' }
        ];
    return {
      template: 'states',
      title: `${shortTitle} — Deterministic State Machine`,
      states,
      steps: [
        {
          at: 'intro',
          caption: clipCaption(`State 1 (${states[0].label}): Initialize state for ${shortTitle}.`),
          currentState: 'st1',
          tone: 'data'
        },
        {
          at: 'say1',
          caption: clipCaption(`Transition to ${states[1].label} with zero-allocation buffer.`),
          currentState: 'st2',
          transition: { from: 'st1', to: 'st2', label: 'transform()' },
          tone: 'data'
        },
        {
          at: 'example',
          caption: clipCaption(`Transition to ${states[2].label} and evaluate hot-path invariants.`),
          currentState: 'st3',
          transition: { from: 'st2', to: 'st3', label: 'evaluate()' },
          tone: 'ok'
        },
        {
          at: 'tryIt',
          caption: clipCaption(`Commit deterministic output in ${states[3].label}.`),
          currentState: 'st4',
          transition: { from: 'st3', to: 'st4', label: 'commit() ✓' },
          tone: 'ok'
        }
      ]
    };
  }

  // 9. Java Systems & Object-Oriented Engineering -> 4-step StackQueueVisual
  if (normPrefix === 'java_basics') {
    return {
      template: 'stack-queue',
      title: `${shortTitle} — JVM Call Stack & Frame Lifecycle`,
      mode: 'stack',
      steps: [
        {
          at: 'intro',
          caption: clipCaption(`Step 1: Push root frames onto JVM execution stack for ${shortTitle}.`),
          mode: 'stack',
          items: ['main() Frame', 'Service.invoke()', 'Repository.query()'],
          action: 'push',
          actionItem: 'Repository.query()',
          tones: ['ok', 'data', 'data']
        },
        {
          at: 'say1',
          caption: clipCaption(`Step 2: Push DomainValidator.verify() onto active stack frame.`),
          mode: 'stack',
          items: ['main() Frame', 'Service.invoke()', 'Repository.query()', 'DomainValidator.verify()'],
          action: 'push',
          actionItem: 'DomainValidator.verify()',
          tones: ['ok', 'ok', 'data', 'data']
        },
        {
          at: 'example',
          caption: clipCaption(`Step 3: Pop completed validator frame after invariant verification.`),
          mode: 'stack',
          items: ['main() Frame', 'Service.invoke()', 'Repository.query()'],
          action: 'pop',
          actionItem: 'DomainValidator.verify() -> true',
          tones: ['ok', 'ok', 'ok']
        },
        {
          at: 'tryIt',
          caption: clipCaption(`Step 4: Unwind stack and return verified result to main() Frame.`),
          mode: 'stack',
          items: ['main() Frame', 'Verified Return Value ✓'],
          action: 'pop',
          actionItem: 'Service.invoke() -> 200 OK',
          tones: ['ok', 'ok']
        }
      ]
    };
  }

  // 10. Computer Fundamentals & Memory Architecture -> 4-step CellsVisual
  if (normPrefix === 'comp_fund') {
    const items = ['0x00: OPCODE', '0x04: REG_A', '0x08: REG_B', '0x0C: ACCUM'];
    return {
      template: 'cells',
      title: `${shortTitle} — Memory Address & Pointer Cells`,
      steps: [
        {
          at: 'intro',
          caption: clipCaption(`Step 1: Fetch instruction cell at 0x00: OPCODE for ${shortTitle}.`),
          items,
          pointers: [{ name: 'PC', index: 0, tone: 'data' }],
          highlightRange: [0, 1],
          tones: { 0: 'data', 1: 'idle', 2: 'idle', 3: 'idle' }
        },
        {
          at: 'say1',
          caption: clipCaption(`Step 2: Decode operands in 0x04: REG_A and 0x08: REG_B.`),
          items,
          pointers: [
            { name: 'PC', index: 1, tone: 'ok' },
            { name: 'ALU', index: 2, tone: 'data' }
          ],
          highlightRange: [1, 3],
          tones: { 0: 'ok', 1: 'data', 2: 'data', 3: 'idle' }
        },
        {
          at: 'example',
          caption: clipCaption(`Step 3: Execute ALU operation and stage output toward 0x0C: ACCUM.`),
          items,
          pointers: [{ name: 'ALU', index: 3, tone: 'data' }],
          highlightRange: [2, 4],
          tones: { 0: 'ok', 1: 'ok', 2: 'ok', 3: 'data' }
        },
        {
          at: 'tryIt',
          caption: clipCaption(`Step 4: Commit verified word into 0x0C: ACCUM memory cell.`),
          items,
          pointers: [{ name: 'COMMIT', index: 3, tone: 'ok' }],
          highlightRange: [0, 4],
          tones: { 0: 'ok', 1: 'ok', 2: 'ok', 3: 'ok' }
        }
      ]
    };
  }

  // 11. Full-Stack JS & General Engineering -> 4-step FlowVisual
  const stageLabel = shortTitle.length > 22 ? `${shortTitle.slice(0, 19)}...` : shortTitle;
  return {
    template: 'flow',
    title: `${shortTitle} — Execution Pipeline`,
    nodes: [
      { id: 'in', label: '1. Input & State', tappable: true },
      { id: 'proc', label: `2. ${stageLabel}`, tappable: true },
      { id: 'out', label: '3. Verified Output', tappable: true }
    ],
    steps: [
      {
        at: 'intro',
        caption: clipCaption(`Step 1: Initialize input state for ${shortTitle}.`),
        values: { in: `Day ${day} Input`, proc: 'Standby', out: 'Pending' },
        tones: { in: 'data', proc: 'idle', out: 'idle' },
        arrows: [['in', 'proc']]
      },
      {
        at: 'say1',
        caption: clipCaption(`Step 2: Execute core transformation in ${stageLabel}.`),
        values: { in: 'Validated', proc: 'Processing...', out: 'Pending' },
        tones: { in: 'ok', proc: 'data', out: 'idle' },
        arrows: [['in', 'proc'], ['proc', 'out']]
      },
      {
        at: 'example',
        caption: clipCaption(`Step 3: Inspect concrete example output and invariants.`),
        values: { in: 'Validated', proc: 'Invariant OK', out: 'Emitting' },
        tones: { in: 'ok', proc: 'ok', out: 'data' },
        arrows: [['proc', 'out']]
      },
      {
        at: 'tryIt',
        caption: clipCaption(`Step 4: End-to-end execution verified for ${shortTitle}.`),
        values: { in: 'Committed', proc: 'Verified', out: 'Complete ✓' },
        tones: { in: 'ok', proc: 'ok', out: 'ok' },
        arrows: [['in', 'proc'], ['proc', 'out']]
      }
    ]
  };
}

