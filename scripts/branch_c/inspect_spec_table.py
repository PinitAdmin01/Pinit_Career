import json

with open("src/lib/data/lessonVisuals/dsa-optim/day-01.json", "r", encoding="utf-8") as f:
    d = json.load(f)

print(json.dumps(d["entries"][0]["spec"], indent=2)[:800])
