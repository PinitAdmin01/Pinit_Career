# scripts/fix_block11_objective.py
from pathlib import Path
import json

lessons_file = Path("src/lib/data/bcomScrmLongLessons.ts")
with open(lessons_file, "r", encoding="utf-8") as f:
    text = f.read()

# Find where day 51 starts
target_str = ',\n  {\n    "coursePrefix": "bcom_scrm",\n    "day": 51,'
idx = text.find(target_str)
if idx != -1:
    print(f"Found day 51 block at index {idx}. Trimming back to day 50...")
    clean_text = text[:idx] + "\n];\n"
    with open(lessons_file, "w", encoding="utf-8") as f:
        f.write(clean_text)
    print("Reset bcomScrmLongLessons.ts to Day 50.")
else:
    print("Could not find day 51 start pattern exactly. Searching for 'day': 51...")
    alt_idx = text.find('"day": 51')
    if alt_idx != -1:
        # Find opening brace before alt_idx
        brace_idx = text.rfind('  {\n    "coursePrefix": "bcom_scrm",\n    "day": 51', 0, alt_idx + 20)
        comma_idx = text.rfind(',\n', 0, brace_idx + 10)
        clean_text = text[:comma_idx] + "\n];\n"
        with open(lessons_file, "w", encoding="utf-8") as f:
            f.write(clean_text)
        print("Reset bcomScrmLongLessons.ts to Day 50.")
