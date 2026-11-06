import sys
sys.stdout.reconfigure(encoding='utf-8')
from pathlib import Path

lines = Path("src/app/quests/lesson/page.tsx").read_text(encoding="utf-8").splitlines()
for i, l in enumerate(lines[740:770], 740):
    print(f"{i}: {l}")
