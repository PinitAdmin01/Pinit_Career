import re
import subprocess

with open('src/lib/data/longLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Find all prefixes in LONG_LESSON_SOURCES
lines = text.splitlines()
in_sources = False
prefixes = []
for line in lines:
    if 'const LONG_LESSON_SOURCES' in line:
        in_sources = True
        continue
    if in_sources:
        if line.strip().startswith('};'):
            break
        if ':' in line:
            prefix = line.split(':')[0].strip().strip("'").strip('"')
            if prefix and prefix not in prefixes:
                prefixes.append(prefix)

print(f"Total prefixes: {len(prefixes)}")

# Write test script to count days for each prefix
ts_check = "import { getLongLesson } from './src/lib/data/longLessons';\n"
ts_check += "const prefixes = " + str(prefixes) + ";\n"
ts_check += """
for (const p of prefixes) {
  let count = 0;
  for (let d = 1; d <= 60; d++) {
    if (getLongLesson(p, d)) count++;
  }
  console.log(`${p.padEnd(20)}: ${count}/60 days`);
}
"""

with open('scripts/check_all_courses.mts', 'w', encoding='utf-8') as f:
    f.write(ts_check)

print("Created scripts/check_all_courses.mts")
