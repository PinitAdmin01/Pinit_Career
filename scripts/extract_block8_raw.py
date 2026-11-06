import re

with open('docs/visuals/PINIT_MASTER_DEBUG.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

part_v_pos = text.find('PART V: DEEP MASTERCLASS BLUEPRINT')
part_v_text = text[part_v_pos:part_v_pos+1000000]

# Find where Day 36 to Day 40 are
d36_start = part_v_text.find('Day 36')
d41_start = part_v_text.find('Day 41', d36_start)

block8_text = part_v_text[d36_start:d41_start]
with open('scripts/java_block8_raw.html', 'w', encoding='utf-8') as out:
    out.write(block8_text)

print(f"Extracted Block 8 text! Length: {len(block8_text)} chars")
