from soft_skills_days41_45_snippets import SNIPPETS
import json

runner_ts = '''import fs from 'fs';

const results: Record<string, Record<string, string>> = {};

function captureOutput(fn: () => void): string {
  const oldLog = console.log;
  const logs: string[] = [];
  console.log = (...args: any[]) => {
    logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
  };
  try {
    fn();
  } finally {
    console.log = oldLog;
  }
  return logs.join('\\n');
}
'''

for day, parts in SNIPPETS.items():
    runner_ts += f"\nresults['{day}'] = {{}};\n"
    for part_idx, code in parts.items():
        # Wrap each snippet in an IIFE
        runner_ts += f"results['{day}']['{part_idx}'] = captureOutput(() => {{\n{code}\n}});\n"

runner_ts += """
fs.writeFileSync('scripts/soft_skills_days41_45_outputs.json', JSON.stringify(results, null, 2));
console.log('All 25 snippets executed cleanly in single process! Outputs saved to scripts/soft_skills_days41_45_outputs.json');
"""

with open('scripts/run_all_snippets_batch3.ts', 'w', encoding='utf-8') as f:
    f.write(runner_ts)

print("Generated scripts/run_all_snippets_batch3.ts successfully.")
