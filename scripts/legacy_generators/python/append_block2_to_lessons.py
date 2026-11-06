import json
import sys
from pathlib import Path

repo_root = Path.cwd()
sys.path.insert(0, str(repo_root))

from scripts.data_day06 import day6
from scripts.data_day07 import day7
from scripts.data_day08 import day8
from scripts.data_day09 import day9
from scripts.data_day10 import day10

days_to_append = [day6, day7, day8, day9, day10]
lessons_file = repo_root / "src" / "lib" / "data" / "bcomAnaLongLessons.ts"

with open(lessons_file, "r", encoding="utf-8") as f:
    content = f.read()

# Verify where the array ends
target = "\n];"
if not content.endswith(target) and not content.endswith("];\n"):
    raise RuntimeError("File does not end with expected array closing: \n];")

# Format days as clean JSON objects indented
formatted_days = []
for d in days_to_append:
    # Ensure answerIndex is present alongside answer
    for p in d["parts"]:
        p["check"]["answerIndex"] = p["check"]["answer"]
    d_str = json.dumps(d, indent=2)
    formatted_days.append(d_str)

new_entries = ",\n" + ",\n".join(formatted_days) + "\n];\n"

# Replace the last occurrence of ];
last_bracket_idx = content.rfind("];")
updated_content = content[:last_bracket_idx] + new_entries

with open(lessons_file, "w", encoding="utf-8") as f:
    f.write(updated_content)

print(f"Successfully appended Days 6 to 10 to {lessons_file.name}!")
