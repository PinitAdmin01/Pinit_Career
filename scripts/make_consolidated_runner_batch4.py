import json
from soft_skills_days46_50_snippets import SNIPPETS

runner_lines = [
    '// scripts/run_all_snippets_batch4.ts',
    'import * as fs from "fs";',
    'const outputs: Record<string, string> = {};',
    '',
    'function capture(key: string, fn: () => void) {',
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
    '  outputs[key] = logs.join("\\n");',
    '}',
    ''
]

for key, code in SNIPPETS.items():
    runner_lines.append(f'// --- {key} ---')
    runner_lines.append(f'capture("{key}", () => {{')
    for line in code.strip().split("\n"):
        runner_lines.append(f'  {line}')
    runner_lines.append('});')
    runner_lines.append('')

runner_lines.append('fs.writeFileSync("scripts/soft_skills_days46_50_outputs.json", JSON.stringify(outputs, null, 2));')
runner_lines.append('console.log("Successfully ran all 25 snippets and wrote scripts/soft_skills_days46_50_outputs.json");')

with open('scripts/run_all_snippets_batch4.ts', 'w', encoding='utf-8') as f:
    f.write("\n".join(runner_lines))

print("Created scripts/run_all_snippets_batch4.ts")
