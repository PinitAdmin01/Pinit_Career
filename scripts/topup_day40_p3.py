import json

with open('scripts/iot_emb_day40.json', 'r', encoding='utf-8') as f:
    d40 = json.load(f)

d40['parts'][2]['say'].append(
    "Furthermore, the binary compression engine implements defensive field validation: if a sensor channel is disconnected or reports an out-of-range ADC value, NanoPB utilizes optional field presence flags to omit the missing channel from the wire frame rather than transmitting corrupted NaN values. This dynamic field omission reduces packet size even further during sensor maintenance intervals."
)

with open('scripts/iot_emb_day40.json', 'w', encoding='utf-8') as f:
    json.dump(d40, f, indent=2, ensure_ascii=False)

total_w = sum(sum(len(s.split()) for s in p['say']) for p in d40['parts'])
part_words = [sum(len(s.split()) for s in p['say']) for p in d40['parts']]
print(f"Day 40: declared minutes={d40['minutes']}, total say words={total_w} ({total_w/120:.1f} mins spoken), parts={part_words}")
