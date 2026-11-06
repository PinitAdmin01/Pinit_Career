import sys, re

sys.stdout.reconfigure(encoding='utf-8')

for path in ['src/lib/data/nodeWeb30DayData.ts', 'src/lib/data/nodeWebDays.ts', 'src/lib/data/nodeWebLongLessons.ts']:
    content = open(path, encoding='utf-8').read()
    days = re.findall(r'day:\s*(\d+)', content)
    day_titles = re.findall(r'title:\s*["\']([^"\']+)["\']', content)
    print(f"=== {path} ===")
    print(f"  Length: {len(content)}, 'day:' count: {len(days)}")
    print(f"  First 5 titles: {day_titles[:5]}")
