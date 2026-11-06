# scripts/check_and_topup_day54.py
import re

content = open("scripts/create_dist_day54_data.py", "r", encoding="utf-8").read()

# Remove the assert loop temporarily to read the parts
temp_content = content.replace("assert wc >= 600", "# assert wc >= 600").replace("assert total_words >= 3000", "# assert total_words >= 3000")
loc = {}
exec(compile(temp_content, "temp", "exec"), loc)

p1 = loc["say_p1"]
p2 = loc["say_p2"]
p3 = loc["say_p3"]
p4 = loc["say_p4"]
p5 = loc["say_p5"]

for i, p in enumerate([p1, p2, p3, p4, p5], 1):
    wc = sum(len(x.split()) for x in p)
    print(f"say_p{i}: {wc} words")
