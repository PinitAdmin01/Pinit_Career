import sys
sys.stdout.reconfigure(encoding='utf-8')
from pathlib import Path
import re

text = Path("src/lib/data/bcomAccountingLongLessons.ts").read_text(encoding="utf-8", errors="ignore")

for word in ["raft", "paxos", "ast", "compiler", "state machine"]:
    matches = [m.start() for m in re.finditer(r'\b' + word + r'\b', text, re.IGNORECASE)]
    print(f"Word '{word}' found {len(matches)} times in bcomAccountingLongLessons.ts")
    for pos in matches[:3]:
        start = max(0, pos - 80)
        end = min(len(text), pos + 80)
        print("  Context:", text[start:end].replace('\n', ' '))
