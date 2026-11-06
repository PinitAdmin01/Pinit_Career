import sys
sys.stdout.reconfigure(encoding='utf-8')
from pathlib import Path
import re

text = Path("src/lib/data/courseTests.ts").read_text(encoding="utf-8", errors="ignore")
print(f"Total lines in courseTests.ts: {len(text.splitlines())}")

# Let's inspect getTestQuestions
m = re.search(r'export function getTestQuestions\([^)]+\):[^{]+{(.*?)\n}', text, re.DOTALL)
if m:
    print("getTestQuestions implementation:")
    print(m.group(0)[:1200])
