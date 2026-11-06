import json
from soft_skills_days56_60_snippets import SNIPPETS

runner_lines = [
    "import fs from 'fs';",
    "const outputs: Record<string, string> = {};",
    "let currentKey = '';",
    "const origLog = console.log;",
    "let logs: string[] = [];",
    "console.log = (...args: any[]) => {",
    "  logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));",
    "};",
    "",
]

for d in range(56, 61):
    for p in range(5):
        key = f"{d}_{p}"
        code = SNIPPETS[d][p].strip()
        runner_lines.append(f"// --- Day {d} Part {p} ---")
        runner_lines.append("logs = [];")
        runner_lines.append("(() => {")
        runner_lines.append(code)
        runner_lines.append("})();")
        runner_lines.append(f"outputs['{key}'] = logs.join('\\n');")
        runner_lines.append("")

runner_lines.append("console.log = origLog;")
runner_lines.append("fs.writeFileSync('scripts/soft_skills_days56_60_outputs.json', JSON.stringify(outputs, null, 2));")
runner_lines.append("origLog('All 25 snippets for Batch 6 executed and saved successfully!');")

with open('scripts/run_all_snippets_batch6.ts', 'w', encoding='utf-8') as f:
    f.write("\n".join(runner_lines))

print("Created scripts/run_all_snippets_batch6.ts successfully!")
