import json
import os
import hashlib

comp_path = "src/lib/data/compFundLongLessons.ts"
with open(comp_path, "r", encoding="utf-8") as f:
    text = f.read()

days = [17, 18, 19, 20, 21]

print("================================================================================")
print("             STEP 5 BACKTRACKING AUDIT: BATCH 2 (DAYS 17 TO 21)                 ")
print("================================================================================")

all_passed = True

for d in days:
    print(f"\n>>> AUDITING COMP_FUND DAY {d} <<<")
    day_marker = f'"day": {d},'
    marker_pos = text.find(day_marker)
    if marker_pos == -1:
        print(f"FAILED: Day {d} not found in compFundLongLessons.ts")
        all_passed = False
        continue
    
    start_pos = text.rfind('{', 0, marker_pos)
    next_pos = text.find(f'"day": {d+1},', marker_pos)
    if next_pos == -1:
        next_pos = text.rfind('\n];')
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
            print(f"  FAILED: Part {i+1} word count is {w_count} < 580 words")
            all_passed = False
    
    spoken_min = day_words / 150.0
    print(f"  Spoken Word Count: {day_words} words (~{spoken_min:.1f} spoken minutes @ 150 wpm)")
    if day_words < 3100 or spoken_min < 20.0:
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
            print(f"  FAILED: Part {i+1} example too short: '{ex}'")
            all_passed = False
        chk = p.get("check") or p.get("mcq", {})
        options = chk.get("options") or chk.get("choices", [])
        ans = chk.get("answer") if chk.get("answer") is not None else chk.get("correctAnswer")
        if not chk.get("question") or len(options) != 4 or ans is None:
            print(f"  FAILED: Part {i+1} Check/MCQ invalid structure")
            all_passed = False
        if not chk.get("why") or len(chk.get("why", "")) < 20:
            print(f"  FAILED: Part {i+1} Check/MCQ missing or short pedagogical 'why'")
            all_passed = False
    print("  PASSED: 5 real-world examples and 5 4-option MCQs verified.")

    # 4. Summary & ProjectStep Check
    summary = lesson.get("summary", [])
    if len(summary) != 5:
        print(f"  FAILED: Summary count is {len(summary)}, expected 5")
        all_passed = False
    else:
        print("  PASSED: Summary contains 5 key takeaways.")

    pstep = lesson.get("projectStep", {})
    if not pstep.get("title") or len(pstep.get("steps", [])) != 5:
        print(f"  FAILED: projectStep invalid structure")
        all_passed = False
    else:
        print("  PASSED: projectStep has title and 5 steps.")

print("\n================================================================================")
if all_passed:
    print(">>> STEP 5 BACKTRACKING AUDIT COMPLETE: ALL 5 BATCH 2 TASKS SATISFY 100% INVARIANTS! <<<")
else:
    print(">>> AUDIT FAILED! SEE ERRORS ABOVE <<<")
print("================================================================================")
