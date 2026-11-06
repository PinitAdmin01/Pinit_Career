import json

with open("src/lib/data/lessonVisuals/dsa-optim/day-30.json", "r", encoding="utf-8") as f:
    d = json.load(f)

print(f"day-30.json entries count: {len(d['entries'])}")
for idx, e in enumerate(d["entries"]):
    print(f"Entry {idx}: template = {e.get('spec', {}).get('template')}, partTitle = {e.get('partTitle')}")
