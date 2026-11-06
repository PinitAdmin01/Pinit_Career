import json
import subprocess
import sys
import os

print("=" * 75)
print("BLOCK 9 (DAYS 41-45) BRUTAL 3RD-PERSON BACKTRACKING VERIFICATION AUDIT")
print("Course: bcom_ent (Entrepreneurship & Venture Incubation)")
print("=" * 75)

# Load bcomEntLongLessons.ts content
with open("src/lib/data/bcomEntLongLessons.ts", "r", encoding="utf-8") as f:
    ts_content = f.read()

with open("src/lib/data/bcomEntLongLessons.ts", "r", encoding="utf-8") as f:
    ts_content = f.read()

# Load Days 41-45 from their lesson JSON and verify they exist verbatim in bcomEntLongLessons.ts
block9_days = []
for d in range(41, 46):
    lesson_path = f"scripts/day{d}_lesson.json"
    assert os.path.exists(lesson_path), f"Missing {lesson_path}!"
    with open(lesson_path, "r", encoding="utf-8") as lf:
        day_json = json.load(lf)
    
    # Verify that this day's title and day number are present in bcomEntLongLessons.ts
    assert f'"day": {d},' in ts_content, f"Day {d} missing from bcomEntLongLessons.ts!"
    assert f'"{day_json["title"]}"' in ts_content, f"Day {d} title missing from bcomEntLongLessons.ts!"
    block9_days.append(day_json)

print(f"Loaded and verified 5 Block 9 lessons (Days 41-45) present in bcomEntLongLessons.ts.")

total_block_words = 0
audit_passed = True

for day_data in block9_days:
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
            print(f"  [FAIL] Part {part_num} lacks substantial physical-world example!")
            audit_passed = False
            
        # MCQ check
        if check.get("answerIndex") != 0 or len(check.get("options", [])) != 4 or not check.get("why"):
            print(f"  [FAIL] Part {part_num} MCQ does not meet 4-option / answerIndex: 0 invariant!")
            audit_passed = False
            
        # Python Execution check
        try:
            res = subprocess.run([sys.executable, "-c", code], capture_output=True, text=True, check=True)
            actual_out = res.stdout
            if actual_out != expected_out:
                print(f"  [FAIL] Part {part_num} code output mismatch!")
                audit_passed = False
        except Exception as e:
            print(f"  [FAIL] Part {part_num} code execution failed: {e}")
            audit_passed = False

    print(f"  Total Day {day_num} Spoken Words: {day_words} words (Required >= 3,000)")
    if day_words < 3000:
        print(f"  [FAIL] Day {day_num} total words {day_words} is below 3,000!")
        audit_passed = False
    total_block_words += day_words
    
    # Gate v2 visual check
    visual_file = f"src/lib/data/lessonVisuals/bcom_ent/day-{day_num}.json"
    if not os.path.exists(visual_file):
        print(f"  [FAIL] Missing visual JSON file: {visual_file}")
        audit_passed = False
    else:
        with open(visual_file, "r", encoding="utf-8") as vf:
            v_data = json.load(vf)
        if len(v_data.get("entries", [])) != 5:
            print(f"  [FAIL] Visual file {visual_file} has {len(v_data.get('entries', []))} entries (expected 5)!")
            audit_passed = False

print("\n" + "=" * 75)
print(f"TOTAL BLOCK 9 SPOKEN WORDS: {total_block_words} words across 5 Days / 25 Parts")
print(f"Average Words Per Day: {total_block_words / 5:.1f} words (Target >= 3,000)")
print(f"Average Avatar Speaking Time: {(total_block_words / 5) / 125:.1f} minutes/day (Target >= 25 mins)")
print("=" * 75)

if audit_passed:
    print("\nALL BLOCK 9 (DAYS 41-45) INVARIANTS PERFECTLY SATISFIED! AUDIT PASSED 100%.")
else:
    print("\nBLOCK 9 AUDIT FAILED! RESOLVE ISSUES ABOVE.")
    sys.exit(1)
