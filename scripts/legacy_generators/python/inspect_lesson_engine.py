import sys
sys.stdout.reconfigure(encoding='utf-8')
from pathlib import Path

text = Path('src/app/quests/lesson/hooks/useLessonEngine.ts').read_text(encoding='utf-8', errors='ignore')
print(f"Total lines in useLessonEngine.ts: {len(text.splitlines())}")
for l in text.splitlines()[:100]:
    print(l)
