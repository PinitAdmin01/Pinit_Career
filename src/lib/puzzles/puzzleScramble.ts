/**
 * Puzzle helpers that stop a lesson puzzle from giving away its own answer.
 *
 * Before this module the pool was sorted by a character-code hash of the block ids, which put the
 * decoy first and the steps in exact reverse order on every day (D54321), and the labels carried
 * their correct position number ("3. ..."). Both leaked the answer.
 */
import type { PuzzleBlock } from './lessonPuzzleEngine';

/** A block label without its leading position number ("3. Foo" and "# 3. Foo" become "Foo"). */
export function displayPuzzleLabel(label: string): string {
  return String(label ?? '').replace(/^\s*#?\s*\d+\.\s*/, '');
}

function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** True when the steps appear in the correct order or in exactly the reverse order. */
function isTrivialOrder(arr: ReadonlyArray<PuzzleBlock>, correctOrder: ReadonlyArray<string>): boolean {
  const wanted = new Set(correctOrder);
  const steps = arr.map((b) => b.id).filter((id) => wanted.has(id));
  const forward = steps.every((id, i) => id === correctOrder[i]);
  const backward = steps.every((id, i) => id === correctOrder[correctOrder.length - 1 - i]);
  return forward || backward;
}

/**
 * Deterministic (same puzzle, same pool) shuffle seeded by the puzzle id. The result is never the
 * correct order or its reverse when a different order exists (puzzles with fewer than three steps
 * have only those two orders).
 */
export function seededScramble(
  blocks: ReadonlyArray<PuzzleBlock>,
  seed: string,
  correctOrder: ReadonlyArray<string>
): PuzzleBlock[] {
  for (let attempt = 0; attempt < 40; attempt++) {
    const rand = mulberry32(hashSeed(`${seed}:${attempt}`));
    const out = [...blocks];
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    if (!isTrivialOrder(out, correctOrder)) return out;
  }
  return [...blocks];
}
