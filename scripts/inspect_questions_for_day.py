import sys
sys.stdout.reconfigure(encoding='utf-8')
from pathlib import Path
import re

text = Path("src/lib/data/courseTests.ts").read_text(encoding="utf-8", errors="ignore")
m = re.search(r'function questionsForDay\([^)]+\):[^{]+{(.*?)\n}', text, re.DOTALL)
if m:
    print("questionsForDay implementation:")
    print(m.group(0)[:1500])
