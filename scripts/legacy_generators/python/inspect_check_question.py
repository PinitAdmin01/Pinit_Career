import sys
sys.stdout.reconfigure(encoding='utf-8')
from pathlib import Path

lines = Path("src/lib/data/courseTests.ts").read_text(encoding="utf-8", errors="ignore").splitlines()
for i, l in enumerate(lines[120:200], 120):
    print(f"{i}: {l}")
