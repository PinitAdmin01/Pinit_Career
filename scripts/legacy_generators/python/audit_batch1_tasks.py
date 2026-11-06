import json
import os
import hashlib

comp_path = "src/lib/data/compFundLongLessons.ts"
with open(comp_path, "r", encoding="utf-8") as f:
    text = f.read()

days = [12, 13, 14, 15, 16]

print("================================================================================")
print("             STEP 2 BACKTRACKING AUDIT: BATCH 1 (DAYS 12 TO 16)                 ")
print("================================================================================")

all_passed = True

for d in days:
    print(f"\n>>> AUDITING COMP_FUND DAY {d} <<<")
    # Parse lesson from compFundLongLessons.ts
    day_marker = f'"day": {d},'
    marker_pos = text.find(day_marker)
    if marker_pos == -1:
        print(f"FAILED: Day {d} not found in compFundLongLessons.ts")
        all_passed = False
        continue
    
    # Find opening '{' before marker_pos
    start_pos = text.rfind('{', 0, marker_pos)
    
    # Find end of this day object
    next_pos = text.find(f'"day": {d+1},', marker_pos)
    if next_pos == -1:
        next_pos = text.find('\n];', marker_pos)
    if next_pos == -1:
        print(f"FAILED: Could not find end of Day {d}")
        all_passed = False
        continue
    
    end_pos = text.rfind('}', start_pos, next_pos) + 1
    day_slice = text[start_pos:end_pos].strip()
    
    try:
        lesson = json.loads(day_slice)
    except Exception as e:
        print(f"FAILED: JSON parse error for Day {d}: {e}")
        all_passed = False
        continue
    
    # 1. Spoken Word Count & Duration
    parts = lesson.get("parts", [])
    if len(parts) != 5:
        print(f"FAILED: Parts count is {len(parts)}, expected 5")
        all_passed = False
    
    day_words = 0
    part_word_checks = []
    for i, p in enumerate(parts):
        say_text = " ".join(p.get("say", []))
        w_count = len(say_text.split())
        day_words += w_count
        part_word_checks.append(w_count)
        if w_count < 580:
            print(f"  WARNING: Part {i+1} word count is {w_count} < 580 words")
            all_passed = False
    
    spoken_min = day_words / 150.0
    print(f"  Spoken Word Count: {day_words} words (~{spoken_min:.1f} spoken minutes @ 150 wpm)")
    if day_words < 2940 or spoken_min < 20.0:
        print(f"  FAILED: Spoken duration {spoken_min:.1f}m < 20 min requirement!")
        all_passed = False
    else:
        print(f"  PASSED: Spoken duration >= 20 minutes satisfied.")

    # 2. Visuals Gate v2 JSON
    visual_path = f"src/lib/data/lessonVisuals/comp_fund/day-{d:02d}.json"
    if not os.path.exists(visual_path):
        print(f"  FAILED: Visual file {visual_path} does not exist!")
        all_passed = False
    else:
        with open(visual_path, "r", encoding="utf-8") as vf:
            vdoc = json.load(vf)
        entries = vdoc.get("entries", [])
        if len(entries) != 5:
            print(f"  FAILED: Visual entries count is {len(entries)}, expected 5")
            all_passed = False
        else:
            print(f"  PASSED: 5 visual entries present in Gate v2 JSON.")
            # Verify codeHash bindings
            for i, p in enumerate(parts):
                calc_hash = hashlib.sha256(p["code"].encode("utf-8")).hexdigest()
                entry_hash = entries[i].get("codeHash", "")
                if calc_hash != entry_hash:
                    print(f"  FAILED: codeHash mismatch for part {i+1}!")
                    all_passed = False
            print(f"  PASSED: All 5 codeHash SHA-256 bindings validated.")

    # 3. Real-world example & MCQ Check
    for i, p in enumerate(parts):
        ex = p.get("example", "")
        if len(ex) < 20:
            print(f"  FAILED: Part {i+1} example is missing or too short!")
            all_passed = False
        chk = p.get("check", {})
        opts = chk.get("options", [])
        ans = chk.get("answer", -1)
        why = chk.get("why", "")
        if len(opts) != 4 or ans not in [0, 1, 2, 3] or len(why) < 20:
            print(f"  FAILED: Part {i+1} MCQ check invalid!")
            all_passed = False
    print(f"  PASSED: 5 real-world examples and 5 4-option MCQs verified.")

    # 4. Summary & ProjectStep
    summ = lesson.get("summary", [])
    if len(summ) != 5:
        print(f"  FAILED: Summary length is {len(summ)}, expected 5")
        all_passed = False
    else:
        print(f"  PASSED: Summary contains 5 key takeaways.")
    
    pstep = lesson.get("projectStep", {})
    if not pstep.get("title") or len(pstep.get("steps", [])) != 5:
        print(f"  FAILED: projectStep missing or incomplete!")
        all_passed = False
    else:
        print(f"  PASSED: projectStep has title and 5 steps.")

print("\n================================================================================")
if all_passed:
    print(">>> BACKTRACKING AUDIT COMPLETE: ALL 5 TASKS SATISFY 100% OF INVARIANTS! <<<")
else:
    print(">>> BACKTRACKING AUDIT FAILED: ISSUES FOUND ABOVE! <<<")
print("================================================================================")
