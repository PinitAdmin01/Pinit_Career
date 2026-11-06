# scripts/regenerate_verified_batch1.py
import os
import sys
import json
import hashlib

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

# Reset compFundLongLessons.ts to Day 11
comp_path = "src/lib/data/compFundLongLessons.ts"
with open(comp_path, "r", encoding="utf-8") as f:
    text = f.read()

pos = text.find('"day": 12,')
if pos != -1:
    obj_start = text.rfind('{', 0, pos)
    comma_pos = text.rfind(',', 0, obj_start)
    clean_text = text[:comma_pos].rstrip() + "\n];\n"
    with open(comp_path, "w", encoding="utf-8") as f:
        f.write(clean_text)
    print("Reset compFundLongLessons.ts to Day 11.")

print("Generating verified Days 12 to 16 with POSIX runner compatibility...")
