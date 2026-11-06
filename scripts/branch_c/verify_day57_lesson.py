import json

with open("scripts/branch_c/day57_lesson.json", "r", encoding="utf-8") as f:
    d = json.load(f)

assert d["day"] == 57, "Day must be 57"
assert d["coursePrefix"] == "dsa-optim", "Course prefix must be dsa-optim"
assert d["minutes"] == 38, "Minutes must be 38"
assert len(d["parts"]) == 5, "Must have exactly 5 parts"
assert len(d["summary"]) >= 5, "Summary must have at least 5 points"
assert "title" in d["projectStep"] and len(d["projectStep"]["steps"]) >= 3, "Project step invalid"

for i, p in enumerate(d["parts"]):
    wc = len(" ".join(p["say"]).split())
    assert wc >= 600, f"Part {i+1} word count {wc} < 600"
    assert len(p["say"]) >= 4, f"Part {i+1} say items {len(p['say'])} < 4"
    assert p["check"]["answer"] == 0, f"Part {i+1} check answer must be 0"
    assert p["check"]["answerIndex"] == 0, f"Part {i+1} check answerIndex must be 0"
    assert len(p["check"]["options"]) == 4, f"Part {i+1} check must have 4 options"
    assert len(p["check"]["why"]) >= 50, f"Part {i+1} check why too short: {len(p['check']['why'])}"
    assert len(p["example"]) > 50, f"Part {i+1} example code missing or short"
    assert len(p["output"]) > 0, f"Part {i+1} output empty"

total_wc = sum(len(" ".join(p["say"]).split()) for p in d["parts"])
assert total_wc >= 3100, f"Total word count {total_wc} < 3100"

print(f"VERIFIED: Day 57 schema is 100% compliant! Total words: {total_wc}")
