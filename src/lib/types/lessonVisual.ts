export type VisualAt = 'say1' | 'say2' | 'say3' | 'say4' | 'example' | 'tryIt';
export type VisualTone = 'data' | 'ok' | 'error' | 'idle';

export interface StepBase {
  at: VisualAt; // which spoken piece starts this step
  caption: string; // one sentence, at most 80 characters
  checks?: string[]; // values that must appear in the real output (see C6, rule 6)
  whatIf?: string; // optional changed code; checks are then run against this code instead
  mustNotShow?: string[]; // values that must NOT appear in that output
  lastLine?: string; // the last output line must equal this
}

export interface Node {
  id: string;
  label: string;
  tappable?: boolean; // tappable defaults to true
}

export interface FlowStep extends StepBase {
  values: Record<string, string>; // node id -> text shown in the box
  tones: Record<string, VisualTone>; // node id -> colour
  arrows: [string, string][]; // lit arrows, as [fromId, toId]
}

export interface BoxesStep extends StepBase {
  values: Record<string, string>; // box id -> value ('' = empty)
  tones: Record<string, VisualTone>;
  types?: Record<string, string>; // optional small type tag: 'str', 'int', 'float', 'bool'
}

export interface TableStep extends StepBase {
  rows: { cells: [string, string]; tone: VisualTone }[];
}

export interface LettersStep extends StepBase {
  pointer?: number; // index; negative counts from the end; out of range = drawn after the last cell in red
  range?: [number, number]; // [start, stop): stop not included
  result: string; // shown under the cells
  tone: VisualTone;
}

export interface ComparePanel {
  code: string;
  result: string;
  tone: VisualTone;
  checks: string[];
  whatIf?: string;
}

export interface CompareStep extends Omit<StepBase, 'checks' | 'whatIf'> {
  left: ComparePanel; // each panel is checked on its own: its checks run against its whatIf code if given, otherwise against the part's code
  right: ComparePanel;
}

export type LessonVisual =
  | { template: 'flow'; title: string; nodes: Node[]; steps: FlowStep[] }
  | { template: 'boxes'; title: string; boxes: Node[]; steps: BoxesStep[] }
  | { template: 'table'; title: string; columns: [string, string]; steps: TableStep[] }
  | { template: 'letters'; title: string; text: string; steps: LettersStep[] }
  | { template: 'compare'; title: string; leftLabel: string; rightLabel: string; steps: CompareStep[] };
