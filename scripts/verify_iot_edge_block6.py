import json
import glob
import sys

sys.stdout.reconfigure(encoding='utf-8')

def verify_block6():
    files = [
        ('scripts/iot_edge_day26.json', 26),
        ('scripts/iot_edge_day27.json', 27),
        ('scripts/iot_edge_day28.json', 28),
        ('scripts/iot_edge_day29.json', 29),
        ('scripts/iot_edge_day30.json', 30),
    ]
    
    all_passed = True
    print("=== Course 18 Block 6 (Days 26-30) Invariant Verification ===")
    
    for path, expected_day in files:
        with open(path, 'r', encoding='utf-8') as f:
            d = json.load(f)
            
        day_num = d.get('day')
        title = d.get('title', '')
        minutes = d.get('minutes', 0)
        parts = d.get('parts', [])
        summary = d.get('summary', [])
        project_step = d.get('projectStep', {})
        
        # 1. Day number
        if day_num != expected_day:
            print(f"❌ Day {expected_day}: Mismatched day number {day_num}")
            all_passed = False
            
        # 2. Minutes
        if not (35 <= minutes <= 40):
            print(f"❌ Day {expected_day}: Invalid minutes {minutes} (must be 35-40)")
            all_passed = False
            
        # 3. Exactly 5 parts
        if len(parts) != 5:
            print(f"❌ Day {expected_day}: Expected 5 parts, found {len(parts)}")
            all_passed = False
            
        # 4. Word count >= 580 words per part
        part_words = []
        for p_idx, p in enumerate(parts):
            say_list = p.get('say', [])
            words = sum(len(s.split()) for s in say_list)
            part_words.append(words)
            if words < 580:
                print(f"❌ Day {expected_day} Part {p_idx+1}: Word count {words} < 580")
                all_passed = False
                
            # Check question: 4 options, answer == 0, non-empty why
            check = p.get('check', {})
            options = check.get('options', [])
            answer = check.get('answer', -1)
            why = check.get('why', '')
            
            if len(options) != 4:
                print(f"❌ Day {expected_day} Part {p_idx+1}: Options count {len(options)} != 4")
                all_passed = False
            if answer != 0:
                print(f"❌ Day {expected_day} Part {p_idx+1}: Answer {answer} != 0")
                all_passed = False
            if len(why.strip()) < 10:
                print(f"❌ Day {expected_day} Part {p_idx+1}: Why is missing or too short")
                all_passed = False
                
            # Code notes >= 3
            code_notes = p.get('codeNotes', [])
            if len(code_notes) < 3:
                print(f"❌ Day {expected_day} Part {p_idx+1}: codeNotes count {len(code_notes)} < 3")
                all_passed = False
                
            # tryIt must be string
            try_it = p.get('tryIt', None)
            if not isinstance(try_it, str) or len(try_it.strip()) < 10:
                print(f"❌ Day {expected_day} Part {p_idx+1}: tryIt must be non-empty string, found {type(try_it)}")
                all_passed = False
                
        # 5. Summary >= 4 items
        if len(summary) < 4:
            print(f"❌ Day {expected_day}: Summary items {len(summary)} < 4")
            all_passed = False
            
        # 6. projectStep steps >= 4
        p_steps = project_step.get('steps', [])
        if len(p_steps) < 4:
            print(f"❌ Day {expected_day}: projectStep steps count {len(p_steps)} < 4")
            all_passed = False
            
        total_words = sum(part_words)
        print(f"✅ Day {expected_day}: '{title}' | Minutes: {minutes} | Words: {part_words} (Total: {total_words})")

    if all_passed:
        print("\n🎉 ALL BLOCK 6 INVARIANTS CERTIFIED! Zero regressions, all criteria satisfied.")
    else:
        print("\n❌ Verification FAILED. Fix errors above.")
        sys.exit(1)

if __name__ == '__main__':
    verify_block6()
