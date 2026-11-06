import re

with open('docs/visuals/PINIT_MASTER_DEBUG.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

part_v_pos = text.find('PART V: DEEP MASTERCLASS BLUEPRINT')
part_v_text = text[part_v_pos:part_v_pos+1000000]

d41_start = part_v_text.find('Day 41')
d46_start = part_v_text.find('Day 46', d41_start)

block9_text = part_v_text[d41_start:d46_start]
with open('scripts/java_block9_raw.html', 'w', encoding='utf-8') as out:
    out.write(block9_text)

print(f"Extracted Block 9 raw HTML! Length: {len(block9_text)} chars")
