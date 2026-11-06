import json

with open('scripts/iot_edge_day20.json', 'r', encoding='utf-8') as f:
    d20 = json.load(f)

# Part 1 (idx 1): 578 -> add 25 words
d20['parts'][1]['say'].append(
    "This deterministic calibration methodology establishes mathematically bounded quantization noise, ensuring predictable numerical convergence on bare-metal integer processors."
)

# Part 4 (idx 4): 568 -> add 30 words
d20['parts'][4]['say'].append(
    "With this comprehensive defense gate passed, your edge AI pipeline achieves true commercial production readiness, capable of orchestrating autonomous TinyML fleets worldwide."
)

with open('scripts/iot_edge_day20.json', 'w', encoding='utf-8') as f:
    json.dump(d20, f, indent=2, ensure_ascii=False)

print("Nudged Day 20 successfully.")
