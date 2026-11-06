with open("scripts/branch_c/build_dsa_day31.py", "r", encoding="utf-8") as f:
    text = f.read()

import re
m4 = re.search(r"p4_say = \[(.*?)\]\n\np4_example", text, re.DOTALL)
m5 = re.search(r"p5_say = \[(.*?)\]\n\np5_example", text, re.DOTALL)

w4 = sum(len(s.split()) for s in re.findall(r'"(.*?)"', m4.group(1), re.DOTALL))
w5 = sum(len(s.split()) for s in re.findall(r'"(.*?)"', m5.group(1), re.DOTALL))
print(f"p4 words: {w4}, p5 words: {w5}")
