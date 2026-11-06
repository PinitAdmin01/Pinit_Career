import json

with open('scripts/iot_edge_day23.json', 'r', encoding='utf-8') as f:
    d23 = json.load(f)

d23['parts'][4]['say'].append(
    "With this complete person detector certified, our firmware establishes an impenetrable benchmark for production micro-vision."
)

with open('scripts/iot_edge_day23.json', 'w', encoding='utf-8') as f:
    json.dump(d23, f, indent=2, ensure_ascii=False)

print("Final nudge Day 23 done.")
