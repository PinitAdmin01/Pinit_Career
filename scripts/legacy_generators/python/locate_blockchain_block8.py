import re

with open("docs/visuals/PINIT_MASTER_DEBUG.html", "r", encoding="utf-8") as f:
    html = f.read()

# Search for Course 7 Block 8 (Days 36 to 40)
pattern = r"(Day 3[6-9].*?)(?=Day 41|Day 40 Milestone|\Z)"
# Let's inspect where Day 36 to 40 are located in Section 20.3 or around Section 20
pos = html.find("Day 36")
print("First Day 36 pos:", pos)

# Find all occurrences of Day 36
all_d36 = [m.start() for m in re.finditer(r"Day 36", html)]
print("Day 36 positions:", all_d36)

for p in all_d36:
    snippet = html[p:p+300]
    print(f"\n--- At {p} ---")
    print(snippet[:150].replace('\n', ' '))
