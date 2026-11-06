import json

with open("src/lib/data/lessonVisuals/dsa-optim/day-30.json", "r", encoding="utf-8") as f:
    d = json.load(f)

print("Number of entries:", len(d["entries"]))
for idx, entry in enumerate(d["entries"]):
    print(f"Entry {idx}: part={entry.get('partId')}, type={entry.get('visual', {}).get('type')}, steps={len(entry.get('visual', {}).get('steps', []))}")
print("\nFull Entry 0:")
print(json.dumps(d["entries"][0], indent=2))
