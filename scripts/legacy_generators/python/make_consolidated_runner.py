import sys, os, json
sys.path.append('scripts')
from soft_skills_days31_35_snippets import SNIPPETS

ts_lines = [
    "import * as fs from 'fs';",
    "const outputs: Record<number, Record<number, string>> = {};",
    "",
    "function capture(day: number, part: number, fn: () => void) {",
    "  const logs: string[] = [];",
    "  const orig = console.log;",
    "  console.log = (...args: any[]) => { logs.push(args.join(' ')); };",
    "  try { fn(); } finally { console.log = orig; }",
    "  if (!outputs[day]) outputs[day] = {};",
    "  outputs[day][part] = logs.join('\\n');",
    "}",
    ""
]

for d in range(31, 36):
    for p in range(1, 6):
        code = SNIPPETS[d][p]
        ts_lines.append(f"capture({d}, {p}, () => {{")
        # indent code
        for l in code.splitlines():
            ts_lines.append("  " + l)
        ts_lines.append("});")
        ts_lines.append("")

ts_lines.append("fs.writeFileSync('scripts/soft_skills_days31_35_outputs.json', JSON.stringify(outputs, null, 2), 'utf-8');")
ts_lines.append("console.log('All 25 snippets captured successfully in single process!');")

with open('scripts/run_all_snippets.ts', 'w', encoding='utf-8') as f:
    f.write("\n".join(ts_lines))

print("Wrote scripts/run_all_snippets.ts successfully!")
