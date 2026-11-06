with open("scripts/branch_c/build_dsa_day32.py", "r", encoding="utf-8") as f:
    text = f.read()

import re
for p_num in range(1, 6):
    pattern = rf"p{p_num}_say = \[(.*?)\]\n\np{p_num}_example"
    match = re.search(pattern, text, re.DOTALL)
    if match:
        strings = re.findall(r'"(.*?)"', match.group(1), re.DOTALL)
        total_words = sum(len(s.split()) for s in strings)
        print(f"Part {p_num} words: {total_words}")
