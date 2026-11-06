import sys, re

sys.stdout.reconfigure(encoding='utf-8')
f = open('src/lib/data/nodeWeb30DayData.ts', encoding='utf-8').read()
titles = re.findall(r'title:\s*["\']([^"\']+)["\']', f)
print(f"Total titles in nodeWeb30DayData: {len(titles)}")
for i, t in enumerate(titles[:30]):
    print(f"Day {i+1}: {t}")
