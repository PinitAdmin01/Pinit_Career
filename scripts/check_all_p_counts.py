import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/build_cloud_day31.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's inspect word counts of p3_say, p4_say, p5_say
def wc(lst):
    return len([w for w in re.split(r'\s+', ' '.join(lst)) if w.strip()])

g = {}
exec(text[:text.find('parts = [')], g)

print("Part 1:", wc(g['p1_say']))
print("Part 2:", wc(g['p2_say']))
print("Part 3:", wc(g['p3_say']))
print("Part 4:", wc(g['p4_say']))
print("Part 5:", wc(g['p5_say']))
