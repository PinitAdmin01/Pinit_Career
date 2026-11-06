import json

with open("scripts/iot_edge_day6.json", "r", encoding="utf-8") as f:
    d6 = json.load(f)

for idx, p in enumerate(d6["parts"]):
    # Deduplicate paragraphs in say while preserving order
    seen = set()
    deduped_say = []
    for s in p["say"]:
        trimmed = s.strip()
        if trimmed not in seen:
            seen.add(trimmed)
            deduped_say.append(s)
    p["say"] = deduped_say
    words = sum(len(s.split()) for s in p["say"])
    print(f"Day 6 Part {idx} clean words: {words}")

with open("scripts/iot_edge_day6.json", "w", encoding="utf-8") as f:
    json.dump(d6, f, indent=2)

print("Saved clean scripts/iot_edge_day6.json")
