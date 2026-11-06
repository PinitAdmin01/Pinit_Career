import json

with open('scripts/iot_edge_day10.json', 'r', encoding='utf-8') as f:
    d10 = json.load(f)

d10['parts'][3]['say'].append(
    "By eliminating all floating-point operations from the critical inference loop, you transform the neural network into a deterministic, high-throughput digital signal processing routine."
)

with open('scripts/iot_edge_day10.json', 'w', encoding='utf-8') as f:
    json.dump(d10, f, indent=2)

print("Day 10 part 3 topped up.")
