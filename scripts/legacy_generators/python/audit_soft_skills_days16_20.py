import os
import sys
import json
import hashlib

def audit_days():
    target_ts = "src/lib/data/softSkillsLongLessons.ts"
    with open(target_ts, "r", encoding="utf-8") as f:
        content = f.read()
        
    start_idx = content.find("[")
    end_idx = content.rfind("]")
    if start_idx == -1 or end_idx == -1:
        print("FAILED: Cannot locate array brackets in softSkillsLongLessons.ts")
        sys.exit(1)
        
    raw_json = content[start_idx:end_idx+1]
    lessons = json.loads(raw_json)
    
    day_map = {d["day"]: d for d in lessons}
    errors = []
    
    for day_num in range(16, 21):
        if day_num not in day_map:
            errors.append(f"Day {day_num} missing from softSkillsLongLessons.ts")
            continue
            
        d = day_map[day_num]
        print(f"\n--- AUDITING DAY {day_num}: {d.get('title')} ---")
        
        # 1. Title & Goal
        if not d.get("title") or len(d["title"]) < 10:
            errors.append(f"Day {day_num}: Invalid or short title")
        if not d.get("goal") or len(d["goal"]) < 30:
            errors.append(f"Day {day_num}: Invalid or short goal")
            
        # 2. Summary
        summary = d.get("summary")
        if not isinstance(summary, list) or len(summary) < 4:
            errors.append(f"Day {day_num}: Summary must be a list of at least 4 items (got {len(summary) if isinstance(summary, list) else 'not a list'})")
            
        # 3. ProjectStep
        ps = d.get("projectStep")
        if not isinstance(ps, dict) or not ps.get("title") or not isinstance(ps.get("steps"), list) or len(ps["steps"]) < 4:
            errors.append(f"Day {day_num}: projectStep must have a title and at least 4 steps")
            
        # 4. Parts check (5 parts)
        parts = d.get("parts", [])
        if len(parts) != 5:
            errors.append(f"Day {day_num}: Expected 5 parts, got {len(parts)}")
            
        day_total_words = 0
        part_hashes = []
        
        for p_idx, part in enumerate(parts):
            p_num = p_idx + 1
            p_title = part.get("title", "")
            say = part.get("say", [])
            words = len(" ".join(say).split())
            day_total_words += words
            
            if words < 580:
                errors.append(f"Day {day_num} Part {p_num} spoken word count {words} < 580 threshold!")
            else:
                print(f"  Part {p_num}: {words} words ({words/150:.1f} min audio) [PASS]")
                
            example = part.get("example", "")
            if len(example) < 20:
                errors.append(f"Day {day_num} Part {p_num}: Example too brief ({len(example)} chars)")
                
            code = part.get("code", "")
            if not code or len(code.strip()) < 50:
                errors.append(f"Day {day_num} Part {p_num}: Code snippet missing or trivial")
                
            c_hash = hashlib.sha256(code.encode("utf-8")).hexdigest()
            part_hashes.append((p_title, c_hash))
            
            output = part.get("output", "")
            if not output or len(output.strip()) == 0:
                errors.append(f"Day {day_num} Part {p_num}: Expected output missing")
                
            line_notes = part.get("lineNotes", [])
            if len(line_notes) < 3:
                errors.append(f"Day {day_num} Part {p_num}: lineNotes count {len(line_notes)} < 3")
                
            check = part.get("check")
            if not isinstance(check, dict):
                errors.append(f"Day {day_num} Part {p_num}: Socratic check missing")
            else:
                options = check.get("options", [])
                ans = check.get("answer")
                why = check.get("why", "")
                if len(options) != 4:
                    errors.append(f"Day {day_num} Part {p_num}: Check options count != 4")
                if ans not in [0, 1, 2, 3]:
                    errors.append(f"Day {day_num} Part {p_num}: Check answer index {ans} not in 0..3")
                if len(why) < 15:
                    errors.append(f"Day {day_num} Part {p_num}: Check why rationale too short ({len(why)} chars)")
                    
        total_duration = day_total_words / 150.0
        print(f"  DAY {day_num} TOTAL WORDS: {day_total_words} ({total_duration:.1f} spoken minutes)")
        if total_duration < 20.0:
            errors.append(f"Day {day_num}: Spoken audio duration {total_duration:.1f}m < 20.0m threshold!")
            
        # 5. Visual JSON check
        visual_path = f"src/lib/data/lessonVisuals/soft-skills/day-{day_num:02d}.json"
        if not os.path.exists(visual_path):
            errors.append(f"Day {day_num}: Visual JSON missing at {visual_path}")
        else:
            with open(visual_path, "r", encoding="utf-8") as vf:
                v_data = json.load(vf)
            if v_data.get("prefix") != "soft-skills":
                errors.append(f"Day {day_num}: Visual JSON prefix is '{v_data.get('prefix')}', expected 'soft-skills'")
            if v_data.get("day") != day_num:
                errors.append(f"Day {day_num}: Visual JSON day is {v_data.get('day')}, expected {day_num}")
            entries = v_data.get("entries", [])
            if len(entries) != 5:
                errors.append(f"Day {day_num}: Visual JSON entries count {len(entries)} != 5")
            else:
                for idx, (p_title, c_hash) in enumerate(part_hashes):
                    v_entry = entries[idx]
                    if v_entry.get("codeHash") != c_hash:
                        errors.append(f"Day {day_num} Part {idx+1}: Visual JSON codeHash mismatch!")
                    if not v_entry.get("spec") or not v_entry.get("filled"):
                        errors.append(f"Day {day_num} Part {idx+1}: Visual JSON missing spec or filled workflow")
                        
    print("\n==================================================")
    if errors:
        print(f"AUDIT FAILED WITH {len(errors)} ERRORS:")
        for e in errors:
            print("  ❌ " + e)
        sys.exit(1)
    else:
        print("✅ ALL DAYS 16-20 INVARIANTS PASSED PERFECTLY!")
        print("  - 5/5 Days Present & Fully Structured")
        print("  - 25/25 Parts Exceed 580 Words")
        print("  - All 5 Days Exceed 20.0 Spoken Audio Minutes")
        print("  - All 5 Visual JSONs Validated with SHA-256 Hashes")
        print("  - Socratic Checks, Line Notes, Summaries, and ProjectSteps 100% Compliant")

if __name__ == "__main__":
    audit_days()
