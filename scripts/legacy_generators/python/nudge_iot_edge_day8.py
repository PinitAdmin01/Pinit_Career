import json

with open('scripts/iot_edge_day8.json', 'r', encoding='utf-8') as f:
    d8 = json.load(f)

# Part 2 is 564 words -> needs +30 words
d8['parts'][2]['say'].append(
    "In multi-core microcontroller systems, such as dual-core Cortex-M7 and Cortex-M4 architectures, static pointer binding ensures that both cores can reference shared inference data structures in shared SRAM without requiring dynamic inter-processor mutex locking or runtime memory mapping handshakes."
)

# Part 3 is 546 words -> needs +50 words
d8['parts'][3]['say'].append(
    "Furthermore, because the memory planning is completely deterministic and executed during system startup, the exact offset mapping is guaranteed to be bit-identical across every reboot, eliminating non-deterministic memory layout variations that could complicate automated regression testing and certification audits."
)

# Part 4 is 542 words -> needs +50 words
d8['parts'][4]['say'].append(
    "Ultimately, marrying mathematical memory sizing with active hardware boundary defense transforms TinyML from an experimental prototype into an industrial-grade, mission-critical computing engine capable of continuous, uninterrupted operation in harsh automotive, aerospace, and medical environments."
)

with open('scripts/iot_edge_day8.json', 'w', encoding='utf-8') as f:
    json.dump(d8, f, indent=2)

print("Day 8 finalized.")
