import json
import sys
sys.path.append('scripts')
from soft_skills_days51_55_snippets import SNIPPETS

runner_lines = [
    '// scripts/run_all_snippets_batch5.ts',
    'import * as fs from "fs";',
    'const outputs: Record<string, Record<string, string>> = {};',
    '',
    'function capture(day: number, part: number, fn: () => void) {',
    '  if (!outputs[String(day)]) outputs[String(day)] = {};',
    '  const originalLog = console.log;',
    '  const logs: string[] = [];',
    '  console.log = (...args: any[]) => {',
    '    logs.push(args.map(a => typeof a === "object" ? JSON.stringify(a) : String(a)).join(" "));',
    '  };',
    '  try {',
    '    fn();',
    '  } catch (err: any) {',
    '    logs.push("ERROR: " + err.message);',
    '  } finally {',
    '    console.log = originalLog;',
    '  }',
    '  outputs[String(day)][String(part)] = logs.join("\\n");',
    '}',
    ''
]

for day, parts in SNIPPETS.items():
    for part, code in parts.items():
        runner_lines.append(f'// --- Day {day} Part {part} ---')
        runner_lines.append(f'capture({day}, {part}, () => {{')
        for line in code.strip().split("\n"):
            runner_lines.append(f'  {line}')
        runner_lines.append('});')
        runner_lines.append('')

runner_lines.append('fs.writeFileSync("scripts/soft_skills_days51_55_outputs.json", JSON.stringify(outputs, null, 2));')
runner_lines.append('console.log("Successfully ran all 25 snippets and wrote scripts/soft_skills_days51_55_outputs.json");')

with open('scripts/run_all_snippets_batch5.ts', 'w', encoding='utf-8') as f:
    f.write("\n".join(runner_lines))

print("Created scripts/run_all_snippets_batch5.ts")
