import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('docs/visuals/PINIT_MASTER_DEBUG.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

# Search for Day 21 in iot_edge context
idx = text.find('Day 21')
# Let's search all occurrences of Day 21
for match in re.finditer(r'Day\s*21</span>\s*<strong[^>]*>([^<]+)</strong>', text):
    start = max(0, match.start() - 200)
    print("Found match:", match.group(0), "Context:", text[start:start+100].replace('\n', ' '))

# Also let's inspect src/lib/data/iotEdgeAi30DayData.ts
print("\n--- From src/lib/data/iotEdgeAi30DayData.ts ---")
try:
    with open('src/lib/data/iotEdgeAi30DayData.ts', 'r', encoding='utf-8') as f:
        dts = f.read()
    days21_25 = re.findall(r'day:\s*(2[1-5]),\s*title:\s*[\'"]([^\'"]+)[\'"]', dts)
    for d, t in days21_25:
        print(f"Day {d}: {t}")
except Exception as e:
    print(f"Error reading iotEdgeAi30DayData.ts: {e}")
