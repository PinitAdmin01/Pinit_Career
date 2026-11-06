# scripts/make_clean_builder_days46_47.py
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, os.path.abspath("."))

# Read code blocks from generate_rich_days46_47.py
with open("scripts/generate_rich_days46_47.py", "r", encoding="utf-8") as f:
    gen_text = f.read()

start_marker = "file_content = '''"
end_marker = "'''\n\nprint(\"Building complete make_month2_days46_47.py...\")"

code_section = gen_text[gen_text.find(start_marker) + len(start_marker) : gen_text.rfind(end_marker)]

# Also read the text definitions from build_full_days46_47.py
with open("scripts/build_full_days46_47.py", "r", encoding="utf-8") as f:
    b_text = f.read()

text_start = b_text.find("p1_say_46 = [")
text_end = b_text.find("day46_lesson = {")

text_definitions = b_text[text_start:text_end]

# Read lessons definitions
lessons_start = b_text.find("day46_lesson = {")
lessons_end = b_text.find("print(\"Exported day46_lesson")

lessons_section = b_text[lessons_start:lessons_end]

final_builder = f"""# scripts/build_full_days46_47.py
import sys
import os
import json
import io
import contextlib

sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, os.path.abspath("."))

{code_section}

{text_definitions}

{lessons_section}

# Export day46_lesson and day47_lesson into scripts/make_month2_days46_47.py
export_file = os.path.join("scripts", "make_month2_days46_47.py")
with open(export_file, "w", encoding="utf-8") as f:
    f.write("# scripts/make_month2_days46_47.py\\n")
    f.write('\"\"\"Generated Month 2 Days 46 & 47\"\"\"\\n\\n')
    f.write("import json\\n\\n")
    f.write("day46_lesson = " + json.dumps(day46_lesson, indent=2, ensure_ascii=False) + "\\n\\n")
    f.write("day47_lesson = " + json.dumps(day47_lesson, indent=2, ensure_ascii=False) + "\\n")

print(f"Exported day46_lesson and day47_lesson to {{export_file}} successfully!")
"""

with open("scripts/build_full_days46_47.py", "w", encoding="utf-8") as f:
    f.write(final_builder)

print("scripts/build_full_days46_47.py cleanly generated!")
