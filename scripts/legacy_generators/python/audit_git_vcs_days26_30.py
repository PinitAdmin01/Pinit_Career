import os
import sys
import json
import hashlib

sys.path.insert(0, os.path.dirname(__file__))

def audit():
    visual_dir = "src/lib/data/lessonVisuals/git_vcs"
    target_ts = "src/lib/data/gitVcsLongLessons.ts"
    
    with open(target_ts, "r", encoding="utf-8") as f:
        content = f.read()
        
    start_idx = content.find("export const GIT_VCS_LONG_LESSONS: LongLesson[] = [")
    if start_idx == -1:
        raise ValueError("Could not find GIT_VCS_LONG_LESSONS array in ts file")
    
    from make_git_vcs_day26 import get_day_26
    from make_git_vcs_day27 import get_day_27
    from make_git_vcs_day28 import get_day_28
    from make_git_vcs_day29 import get_day_29
    from make_git_vcs_day30 import get_day_30
    
    days = [get_day_26(), get_day_27(), get_day_28(), get_day_29(), get_day_30()]
    
    print("=== BACKTRACKING AUDIT: git_vcs DAYS 26-30 (FINAL CAPSTONE BATCH) ===")
    all_passed = True
    
    for d in days:
        day_num = d["day"]
        title = d["title"]
        parts = d["parts"]
        summary = d["summary"]
        project_step = d["projectStep"]
        
        # Word counts
        part_counts = [len(" ".join(p["say"]).split()) for p in parts]
        total_words = sum(part_counts)
        spoken_min = total_words / 150.0
        
        safe_title = title[:40].encode('ascii', errors='replace').decode('ascii')
        print(f"\n--- Day {day_num}: {safe_title}... ---")
        print(f"Total Words: {total_words} (~{spoken_min:.1f} mins), Parts: {part_counts}")
        
        if total_words < 3100:
            print(f"FAILED: Day {day_num} total words {total_words} < 3100")
            all_passed = False
            
        if spoken_min < 20.0:
            print(f"FAILED: Day {day_num} spoken minutes {spoken_min:.1f} < 20.0")
            all_passed = False
            
        for idx, p in enumerate(parts):
            count = part_counts[idx]
            if count < 580:
                print(f"FAILED: Day {day_num} Part {idx+1} word count {count} < 580")
                all_passed = False
                
            check = p["check"]
            if len(check["options"]) != 4:
                print(f"FAILED: Day {day_num} Part {idx+1} options count != 4 ({len(check['options'])})")
                all_passed = False
            if check["answer"] < 0 or check["answer"] >= 4:
                print(f"FAILED: Day {day_num} Part {idx+1} answer index out of bounds: {check['answer']}")
                all_passed = False
            if len(check["why"]) < 10:
                print(f"FAILED: Day {day_num} Part {idx+1} 'why' explanation too short (< 10 chars)")
                all_passed = False
            if len(p["example"]) < 20:
                print(f"FAILED: Day {day_num} Part {idx+1} example too short (< 20 chars)")
                all_passed = False
                
        if len(summary) != 5:
            print(f"FAILED: Day {day_num} summary count != 5 ({len(summary)})")
            all_passed = False
            
        if len(project_step["steps"]) != 5:
            print(f"FAILED: Day {day_num} projectStep steps count != 5 ({len(project_step['steps'])})")
            all_passed = False
            
        # Visual file audit
        v_path = os.path.join(visual_dir, f"day-{day_num:02d}.json")
        if not os.path.exists(v_path):
            print(f"FAILED: Visual file missing: {v_path}")
            all_passed = False
        else:
            with open(v_path, "r", encoding="utf-8") as vf:
                v_data = json.load(vf)
            if len(v_data["entries"]) != 5:
                print(f"FAILED: Visual file {v_path} entries != 5 ({len(v_data['entries'])})")
                all_passed = False
            for idx, entry in enumerate(v_data["entries"]):
                expected_hash = hashlib.sha256(parts[idx]["code"].encode("utf-8")).hexdigest()
                if entry["codeHash"] != expected_hash:
                    print(f"FAILED: Day {day_num} Part {idx+1} codeHash mismatch! Expected {expected_hash}, got {entry['codeHash']}")
                    all_passed = False
                    
    if all_passed:
        print("\n>>> AUDIT RESULT: ALL INVARIANTS PASSED 100% CLEAN! <<<")
    else:
        print("\n>>> AUDIT RESULT: SOME INVARIANTS FAILED! <<<")
        sys.exit(1)

if __name__ == "__main__":
    audit()
