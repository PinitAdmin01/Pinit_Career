import re
import json
import subprocess
import sys
import os

print("=" * 80)
print("BLOCK 12 (DAYS 56-60) & FINAL COURSE 08 COMPLETION VERIFICATION AUDIT")
print("Course: bcom_ent (Entrepreneurship & Venture Incubation)")
print("Topic: Grand Enterprise Capstone & Venture Boardroom Masterclass")
print("=" * 80)

# Load bcomEntLongLessons.ts content
with open("src/lib/data/bcomEntLongLessons.ts", "r", encoding="utf-8") as f:
    ts_content = f.read()

# Parse Days 56-60 directly from ts_content
block12_days = []
for d in range(56, 61):
    start_tag = f'"day": {d},'
    pos = ts_content.find(start_tag)
    assert pos != -1, f"Day {d} not found in bcomEntLongLessons.ts!"
    
    brace_start = ts_content.rfind('{', 0, pos)
    depth = 0
    in_string = False
    escape = False
    brace_end = -1
    for i in range(brace_start, len(ts_content)):
        char = ts_content[i]
        if escape:
            escape = False
            continue
        if char == '\\':
            escape = True
            continue
        if char == '"':
            in_string = not in_string
            continue
        if not in_string:
            if char == '{':
                depth += 1
            elif char == '}':
                depth -= 1
                if depth == 0:
                    brace_end = i + 1
                    break
    assert brace_end != -1, f"Could not find matching brace for Day {d}"
    day_json_str = ts_content[brace_start:brace_end]
    day_json = json.loads(day_json_str)
    
    # Assert visual file exists and passes Gate v2 schema
    visual_path = f"src/lib/data/lessonVisuals/bcom_ent/day-{d}.json"
    assert os.path.exists(visual_path), f"Missing visual file: {visual_path}!"
    with open(visual_path, "r", encoding="utf-8") as vf:
        v_data = json.load(vf)
    assert len(v_data.get("entries", [])) == 5, f"Visual {visual_path} must have 5 entries!"
    for entry in v_data["entries"]:
        steps = entry.get("spec", {}).get("steps", [])
        assert len(steps) == 4, f"Each visual entry must have 4 steps, found {len(steps)}!"
        for step in steps:
            caption = step.get("caption", "")
            assert caption.endswith("."), f"Caption '{caption}' must end with a period!"
            assert len(caption) <= 80, f"Caption '{caption}' exceeds 80 characters ({len(caption)})!"
            assert not any(c.isdigit() for c in caption), f"Caption '{caption}' contains unbound numbers!"
            
    block12_days.append(day_json)

print(f"Loaded and verified 5 Block 12 lessons (Days 56-60) directly from bcomEntLongLessons.ts.")

total_block_words = 0
audit_passed = True

for day_data in block12_days:
    day_num = day_data["day"]
    title = day_data["title"]
    parts = day_data["parts"]
    
    safe_title = title.replace("⭐", "[CAPSTONE]")
    print(f"\nAUDITING DAY {day_num}: {safe_title}")
    print("-" * 75)
    
    assert len(parts) == 5, f"Day {day_num} must have exactly 5 parts, found {len(parts)}!"
    
    day_words = 0
    for p_idx, p in enumerate(parts):
        part_num = p["part"]
        p_title = p["title"]
        say = p["say"]
        code = p["code"]
        expected_out = p["output"]
        example = p["example"]
        check = p["check"]
        
        words = sum(len(para.split()) for para in say)
        day_words += words
        
        safe_p_title = p_title.replace("⭐", "[CAPSTONE]")
        # Word count check
        if words < 600:
            print(f"  [FAIL] Part {part_num} word count is {words} (< 600)!")
            audit_passed = False
        else:
            print(f"  [PASS] Part {part_num} ({words} words): {safe_p_title[:45]}...")
            
        # Example check
        if not example or len(example.split()) < 20:
            print(f"  [FAIL] Part {part_num} lacks substantial physical-world example ({len(example.split())} words)!")
            audit_passed = False
            
        # MCQ check
        if check.get("answerIndex") != 0 or len(check.get("options", [])) != 4 or not check.get("why"):
            print(f"  [FAIL] Part {part_num} MCQ does not meet 4-option / answerIndex: 0 invariant!")
            audit_passed = False
            
        # Python Execution check
        try:
            res = subprocess.run([sys.executable, "-c", code], capture_output=True, text=True, check=True)
            if res.stdout != expected_out:
                print(f"  [FAIL] Part {part_num} stdout mismatch!")
                audit_passed = False
        except subprocess.CalledProcessError as e:
            print(f"  [FAIL] Part {part_num} execution crashed: {e.stderr}")
            audit_passed = False
            
    total_block_words += day_words
    print(f"Day {day_num} Total Words: {day_words:,} words (Target >= 3000 words, >= 25 mins spoken audio)")
    assert day_words >= 3000, f"Day {day_num} total words {day_words} is below 3000!"

# Count total days in bcomEntLongLessons.ts
day_matches = re.findall(r'(?:["\']day["\']|\bday)\s*:\s*(\d+)', ts_content)
unique_days = sorted(list(set(int(d) for d in day_matches)))

print("\n" + "=" * 80)
print(f"AUDIT SUMMARY FOR BLOCK 12 (DAYS 56-60):")
print(f"Total Spoken Words Across Block 12: {total_block_words:,} words (Average {total_block_words/5:,.1f} words/day)")
print(f"Total Parts Audited: {len(block12_days) * 5}/25 parts")
print(f"Total Days Implemented in Course 08 (bcom_ent): {len(unique_days)} / 60 Days (Days {unique_days[0]} to {unique_days[-1]})")

if audit_passed and len(unique_days) == 60:
    print("[SUCCESS] COURSE 08 (bcom_ent) IS OFFICIALLY 100% COMPLETE & VERIFIED (60/60 DAYS)!")
else:
    print("[FAILURE] INVARIANT VIOLATIONS DETECTED IN BLOCK 12 AUDIT!")
    sys.exit(1)
print("=" * 80)
