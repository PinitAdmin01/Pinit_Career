import sys
sys.stdout.reconfigure(encoding='utf-8')
from pathlib import Path
import re

files_to_check = [
    ("pythonLongLessons.ts", "Day 1 & Day 35"),
    ("reactLongLessons.ts", "Day 1 & Day 40"),
    ("javaBasicsLongLessons.ts", "Day 1 & Day 35"),
    ("bcomAccountingLongLessons.ts", "Day 1 & Day 45"),
    ("nlpPythonLongLessons.ts", "Day 1 & Day 55")
]

for fname, label in files_to_check:
    p = Path("src/lib/data") / fname
    if not p.exists():
        continue
    text = p.read_text(encoding="utf-8", errors="ignore")
    print(f"==================================================")
    print(f"FILE: {fname} ({label})")
    print(f"==================================================")
    
    # Extract first day say
    say_match = re.search(r'say:\s*\[(.*?)\]\s*,', text, re.DOTALL)
    if not say_match:
        say_match = re.search(r'\"say\":\s*\[(.*?)\]\s*,', text, re.DOTALL)
        
    if say_match:
        bubbles = [b.strip() for b in say_match.group(1).split('\n') if b.strip().startswith('"') or b.strip().startswith("'")]
        print(f"Day 1 Part 1 Avatar Speaks ({len(bubbles)} bubbles):")
        for idx, b in enumerate(bubbles[:4], 1):
            print(f"  [{idx}] {b[:140]}...")
            
    # Check vocabulary complexity: look for jargon words
    jargon_words = ["invariant", "deterministic", "heterogeneous", "concurrency", "monolithic", "suboptimal", "idempotent", "ast", "amortized", "paxos", "raft"]
    found_jargon = [w for w in jargon_words if w in text.lower()]
    print(f"Heavy Academic Jargon Words Present: {found_jargon}")
    
    # Check if there is any 60-second timer or rapid-fire battle
    has_battle = "battle" in text.lower() or "rapid" in text.lower() or "60" in text.lower() and "timer" in text.lower()
    print(f"Mentions Rapid-Fire Battle / 60s Timer: {has_battle}")
    print()
