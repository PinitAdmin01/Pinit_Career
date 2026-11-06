import re
from pathlib import Path

text = Path("src/lib/data/bcomScrmLongLessons.ts").read_text(encoding="utf-8")
matches = list(re.finditer(r'"day":\s*(\d+)', text))
print("Total day matches:", len(matches))
for m in matches:
    d = int(m.group(1))
    if d >= 48:
        print(f"Pos {m.start()}: Day {d}")
