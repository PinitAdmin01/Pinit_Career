with open('scripts/build_day50_final.py', 'r', encoding='utf-8') as f:
    text = f.read()

import_stmt = "from expand_day50_parts import P1_ADD, P2_ADD, P3_ADD, P4_ADD, P5_ADD\n"
if "from expand_day50_parts" not in text:
    text = import_stmt + text

text = text.replace("PART_1_SAY = [", "PART_1_SAY = P1_ADD + [")
text = text.replace("PART_2_SAY = [", "PART_2_SAY = P2_ADD + [")
text = text.replace("PART_3_SAY = [", "PART_3_SAY = P3_ADD + [")
text = text.replace("PART_4_SAY = [", "PART_4_SAY = P4_ADD + [")
text = text.replace("PART_5_SAY = [", "PART_5_SAY = P5_ADD + [")

with open('scripts/build_day50_final.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated build_day50_final.py with Day 50 expansion paragraphs.")
