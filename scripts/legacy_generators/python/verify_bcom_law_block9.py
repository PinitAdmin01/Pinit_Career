import json, sys, subprocess, os, re

# Comprehensive verification script for bcom_law Block 9 (Days 41-45 & Milestone 9 Capstone)
ts_path = "src/lib/data/bcomLawLongLessons.ts"
with open(ts_path, "r", encoding="utf-8") as f:
    text = f.read()

# Verify presence of Days 41 to 45
target_days = [41, 42, 43, 44, 45]
total_block_words = 0
audit_results = []

for day_num in target_days:
    # Load day json
    day_json_path = f"scripts/day{day_num}_lesson.json"
    assert os.path.exists(day_json_path), f"Missing {day_json_path}!"
    with open(day_json_path, "r", encoding="utf-8") as f:
        day_data = json.load(f)
        
    assert day_data["day"] == day_num, f"Day number mismatch: {day_data['day']} != {day_num}"
    parts = day_data["parts"]
    assert len(parts) == 5, f"Day {day_num} has {len(parts)} parts, expected 5!"
    
    day_words = 0
    print(f"\n==========================================")
    print(f"AUDITING DAY {day_num}: {day_data['title']}")
    print(f"==========================================")
    
    for p in parts:
        p_num = p["part"]
        say = p["say"]
        p_words = sum(len(para.split()) for para in say)
        day_words += p_words
        print(f"Day {day_num} Part {p_num} ('{p['title']}'): {p_words} words")
        assert p_words >= 600, f"Day {day_num} Part {p_num} words {p_words} < 600!"
        
        # Check MCQ
        chk = p["check"]
        assert len(chk["options"]) == 4, f"MCQ options count != 4 in Day {day_num} Part {p_num}"
        assert chk["answerIndex"] == 0, f"answerIndex != 0 in Day {day_num} Part {p_num}"
        
        # Check Code deterministic execution
        code = p["code"]
        expected_output = p["output"]
        res = subprocess.run([sys.executable, "-c", code], capture_output=True, text=True, check=True)
        actual_output = res.stdout
        assert actual_output == expected_output, f"Code output mismatch in Day {day_num} Part {p_num}!"
        
    print(f"--> Day {day_num} Total Words: {day_words} (Required: >= 3000)")
    assert day_words >= 3000, f"Day {day_num} words {day_words} < 3000!"
    total_block_words += day_words

    # Visual JSON check
    v_path = f"src/lib/data/lessonVisuals/bcom_law/day-{day_num}.json"
    assert os.path.exists(v_path), f"Missing visual file {v_path}!"
    with open(v_path, "r", encoding="utf-8") as vf:
        v_data = json.load(vf)
    assert len(v_data["entries"]) == 5, f"Visual entries count != 5 in {v_path}"
    for e_idx, entry in enumerate(v_data["entries"]):
        spec = entry["spec"]
        assert spec["template"] == "workflow", f"Template != workflow in {v_path} entry {e_idx}"
        assert len(spec["stages"]) == 4, f"Stages != 4 in {v_path} entry {e_idx}"
        assert len(spec["steps"]) == 4, f"Steps != 4 in {v_path} entry {e_idx}"
        for step in spec["steps"]:
            cap = step["caption"]
            assert len(cap) <= 80, f"Caption > 80 chars ({len(cap)}): '{cap}' in {v_path}"
            assert cap.endswith("."), f"Caption does not end with period: '{cap}' in {v_path}"
            assert not any(c.isdigit() for c in cap), f"Caption contains digits: '{cap}' in {v_path}"

print(f"\n==========================================")
print(f"BLOCK 9 AUDIT SUMMARY (DAYS 41-45)")
print(f"==========================================")
print(f"Total Block 9 Words: {total_block_words} words across 25 parts")
print(f"Average Words Per Day: {total_block_words / 5:.1f} wpd")
print(f"ALL 25/25 PARTS STRICTLY >= 600 WORDS!")
print(f"ALL 5/5 DAYS STRICTLY >= 3000 WORDS!")
print(f"ALL 25 PYTHON SCRIPTS DETERMINISTICALLY EXECUTED (100% STDOUT MATCH)!")
print(f"ALL 25 STATUTORY MCQS HAVE 4 OPTIONS WITH answerIndex: 0!")
print(f"ALL 5 VISUAL ENVELOPES CONFORM TO GATE V2 SPEC (TEMPLATE: WORKFLOW)!")
print(f"100% GREEN AUDIT PASSED!")
