# scripts/apply_boost_days46_47.py
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, os.path.abspath("."))

with open("scripts/build_full_days46_47.py", "r", encoding="utf-8") as f:
    content = f.read()

# Add import json at the top if missing
if "import json" not in content:
    content = "import json\n" + content

from scripts.boost_days46_47 import (
    p3_extra, p4_extra, p5_extra,
    p1_47_extra, p2_47_extra, p3_47_extra, p4_47_extra, p5_47_extra
)

# Insert extra paragraphs into the say arrays:
# Day 46 Part 3:
content = content.replace(
    'p3_say_46 = [',
    f'p3_say_46 = [\n    """{p3_extra}""",\n'
)

# Day 46 Part 4:
content = content.replace(
    'p4_say_46 = [',
    f'p4_say_46 = [\n    """{p4_extra}""",\n'
)

# Day 46 Part 5:
content = content.replace(
    'p5_say_46 = [',
    f'p5_say_46 = [\n    """{p5_extra}""",\n'
)

# Day 47 Part 1:
content = content.replace(
    'p1_say_47 = [',
    f'p1_say_47 = [\n    """{p1_47_extra}""",\n'
)

# Day 47 Part 2:
content = content.replace(
    'p2_say_47 = [',
    f'p2_say_47 = [\n    """{p2_47_extra}""",\n'
)

# Day 47 Part 3:
content = content.replace(
    'p3_say_47 = [',
    f'p3_say_47 = [\n    """{p3_47_extra}""",\n'
)

# Day 47 Part 4:
content = content.replace(
    'p4_say_47 = [',
    f'p4_say_47 = [\n    """{p4_47_extra}""",\n'
)

# Day 47 Part 5:
content = content.replace(
    'p5_say_47 = [',
    f'p5_say_47 = [\n    """{p5_47_extra}""",\n'
)

# Re-enable the assert total >= 580
content = content.replace(
    'print(f"  Part {idx+1}: {total} words (say={say_w}, ex={ex_w}) [{status}]")',
    'print(f"  Part {idx+1}: {total} words (say={say_w}, ex={ex_w}) [{status}]")\n        assert total >= 580, f"Day {num} Part {idx+1} has only {total} words (< 580)!"'
)

with open("scripts/build_full_days46_47.py", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated scripts/build_full_days46_47.py with rich boost paragraphs.")
