import json

with open('scripts/iot_edge_day25.json', 'r', encoding='utf-8') as f:
    d25 = json.load(f)

d25['parts'][0]['say'].append(
    "This complete architectural mastery establishes our sovereign runtime as a true gold standard for edge intelligence."
)

with open('scripts/iot_edge_day25.json', 'w', encoding='utf-8') as f:
    json.dump(d25, f, indent=2, ensure_ascii=False)

print("Final nudge Day 25 done.")
