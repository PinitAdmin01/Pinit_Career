# scripts/check_word_counts.py
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/make_day28_verified.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Collect p1_say, p2_say, p3_say, p4_say, p5_say
content = "".join(lines[:442])
local_vars = {}
exec(content, {}, local_vars)

for i in range(1, 6):
    say = local_vars[f"p{i}_say"]
    wc = sum(len(p.split()) for p in say)
    print(f"Part {i}: {wc} words")
