import json

with open("scripts/branch_c/day45_lesson.json", "r", encoding="utf-8") as f:
    d = json.load(f)

print("Day:", d.get("day"))
print("Title:", d.get("title"))
print("CoursePrefix:", d.get("coursePrefix"))
print("Minutes:", d.get("minutes"))
print("ProjectStep:", bool(d.get("projectStep")))
print("Summary count:", len(d.get("summary", [])))
tot = 0
for i, p in enumerate(d["parts"]):
    wc = sum(len(s.split()) for s in p["say"])
    tot += wc
    print(f"Part {i+1} say count: {len(p['say'])}, words: {wc}")
    print(f"Part {i+1} options: {len(p['check']['options'])}, answerIndex: {p['check']['answerIndex']}")
print("Total words:", tot)
