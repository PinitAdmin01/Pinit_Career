import json

with open('scripts/iot_edge_day22.json', 'r', encoding='utf-8') as f:
    d22 = json.load(f)

d22['parts'][3]['say'].append(
    "This hardware-software co-design paradigm transforms low-power microcontrollers into high-throughput DSP engines capable of continuous real-time audio and vision processing."
)

d22['parts'][4]['say'].append(
    "By verifying bit-exact numerical equality and strict memory bounds, our validation gate provides the rigorous foundation needed for enterprise TinyML deployment."
)

with open('scripts/iot_edge_day22.json', 'w', encoding='utf-8') as f:
    json.dump(d22, f, indent=2, ensure_ascii=False)

print("Nudged Day 22 successfully.")
