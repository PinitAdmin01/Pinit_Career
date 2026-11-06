import json
import re

with open("scripts/branch_c/build_dsa_day31.py", "r", encoding="utf-8") as f:
    content = f.read()

# Let's count words in p1_say, p2_say, p3_say, p4_say, p5_say
for p_num in range(1, 6):
    pattern = rf"p{p_num}_say = \[(.*?)\]\n\np{p_num}_example"
    match = re.search(pattern, content, re.DOTALL)
    if match:
        block = match.group(1)
        strings = re.findall(r'"(.*?)"', block, re.DOTALL)
        total_words = sum(len(s.split()) for s in strings)
        print(f"Part {p_num} words: {total_words}")
