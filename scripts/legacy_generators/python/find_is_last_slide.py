import sys
sys.stdout.reconfigure(encoding='utf-8')
from pathlib import Path
import re

text = Path("src/app/quests/lesson/page.tsx").read_text(encoding="utf-8", errors="ignore")
matches = [m.start() for m in re.finditer(r'isLastSlide', text)]
print(f"Total isLastSlide in page.tsx: {len(matches)}")
for pos in matches:
    start = max(0, pos - 80)
    end = min(len(text), pos + 100)
    print("  Context:", text[start:end].replace('\n', ' '))
