# scripts/check_remaining.py
from pathlib import Path
import re

for fn in [
    "bcomScrmLongLessons.ts", 
    "bcomAitLongLessons.ts", 
    "nlpPythonLongLessons.ts",
    "bcomAudLongLessons.ts",
    "bcomBanLongLessons.ts",
    "bcomTaxLongLessons.ts",
    "bcomLawLongLessons.ts",
    "bcomOpsLongLessons.ts",
    "bcomEntLongLessons.ts",
    "bcomAnaLongLessons.ts"
]:
    p = Path("src/lib/data") / fn
    if p.exists():
        text = p.read_text(encoding='utf-8')
        days = sorted(list(set(int(x) for x in re.findall(r'(?:\"day\"|day)\s*:\s*(\d+)', text))))
        m1 = [d for d in days if 1 <= d <= 30]
        m2 = [d for d in days if 31 <= d <= 60]
        print(f"{fn:<26}: Total={len(days):>2} | M1={len(m1):>2} | M2={len(m2):>2} (min={min(days) if days else None}, max={max(days) if days else None})")
    else:
        print(f"{fn:<26}: NOT FOUND")
