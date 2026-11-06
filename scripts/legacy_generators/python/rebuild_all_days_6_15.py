"""
Rebuild and Validate Days 6-15 for B.Com E-Commerce (TASK-801..TASK-810)
Appends Days 6-15 with all required fields (including summary: string[]) to src/lib/data/bcomEcomLongLessons.ts.
"""

import os
import sys
import json
import io
import contextlib
import subprocess
from visual_builder import count_words, make_sha256, generate_funnel_visual
from bcom_ecom_day06_builder import build_day06
from bcom_ecom_day07_builder import build_day07
from bcom_ecom_day08_builder import build_day08
from bcom_ecom_day09_builder import build_day09
from bcom_ecom_day10_builder import build_day10
from bcom_ecom_day11_builder import build_day11
from bcom_ecom_day12_builder import build_day12
from bcom_ecom_day13_builder import build_day13
from bcom_ecom_day14_builder import build_day14
from bcom_ecom_day15_builder import build_day15

BUILDERS = [
    (6, build_day06),
    (7, build_day07),
    (8, build_day08),
    (9, build_day09),
    (10, build_day10),
    (11, build_day11),
    (12, build_day12),
    (13, build_day13),
    (14, build_day14),
    (15, build_day15),
]

def main():
    print("=" * 75)
    print("REBUILDING & VALIDATING ALL 10 TASKS: Days 6 to 15 (TASK-801..810)")
    print("=" * 75)

    built_days = []
    grand_total_words = 0

    for day_num, builder_fn in BUILDERS:
        d, words = builder_fn()
        built_days.append(d)
        grand_total_words += words
        print(f"\n[+] Day {day_num:2d}: {d['title'][:55]}...")
        print(f"    Spoken Words: {words:,} (Average {words/5:.1f} w/part)")
        
        # Verify invariants
        assert 'summary' in d and len(d['summary']) >= 3, f"Day {day_num} missing summary array"
        assert len(d['parts']) == 5, f"Day {day_num} has {len(d['parts'])} parts (expected 5)"
        assert words >= 2950, f"Day {day_num} has {words} words (< 2950)"
        
        for idx, part in enumerate(d['parts']):
            p_words = count_words(part['say'])
            assert p_words >= 580, f"Day {day_num} Part {idx+1} has {p_words} words (< 580)"
            assert len(part['codeNotes']) >= 3, f"Day {day_num} Part {idx+1} codeNotes < 3"
            assert part['check']['options'], f"Day {day_num} Part {idx+1} missing check options"
            assert part['check']['why'], f"Day {day_num} Part {idx+1} missing check why explanation"
            assert part['example'], f"Day {day_num} Part {idx+1} missing real-world example"
            assert part['tryIt'], f"Day {day_num} Part {idx+1} missing tryIt instruction"
            
            # Test deterministic Python execution
            stdout_capture = io.StringIO()
            with contextlib.redirect_stdout(stdout_capture):
                exec(part['code'], {})
            actual_stdout = stdout_capture.getvalue().strip()
            expected_stdout = part['output'].strip()
            assert actual_stdout == expected_stdout, (
                f"Day {day_num} Part {idx+1} stdout mismatch!\n"
                f"Expected:\n{expected_stdout}\nActual:\n{actual_stdout}"
            )

        # Generate on-disk visual JSON
        visual_entries = [{'title': p['title'], 'code': p['code']} for p in d['parts']]
        vis_data = generate_funnel_visual('bcom_ecom', day_num, visual_entries)
        vis_dir = os.path.join('src', 'lib', 'data', 'lessonVisuals', 'bcom_ecom')
        os.makedirs(vis_dir, exist_ok=True)
        vis_path = os.path.join(vis_dir, f"day-{day_num:02d}.json")
        with open(vis_path, 'w', encoding='utf-8') as f:
            json.dump(vis_data, f, indent=2)
        print(f"    [OK] Invariants passed. Visual JSON saved to: {vis_path}")

    print("\n" + "=" * 75)
    print(f"ALL 10 DAYS VALIDATED: {grand_total_words:,} total spoken words (Avg {grand_total_words/10:.1f} w/day)!")
    print("=" * 75)

    # First, restore bcomEcomLongLessons.ts to clean base (Days 1-5) via git checkout
    ts_file = os.path.join('src', 'lib', 'data', 'bcomEcomLongLessons.ts')
    subprocess.run(['git', 'checkout', '--', ts_file], check=True)
    
    with open(ts_file, 'r', encoding='utf-8') as f:
        base_ts = f.read()

    closing_bracket_idx = base_ts.rfind('];')
    if closing_bracket_idx == -1:
        raise ValueError("Could not find closing bracket '];' in base bcomEcomLongLessons.ts")

    fragments = []
    for d in built_days:
        day_json = json.dumps(d, indent=2)
        fragments.append(f",\n{day_json}")

    new_content = base_ts[:closing_bracket_idx] + "".join(fragments) + "\n];\n"

    with open(ts_file, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"\n[+] Successfully updated {ts_file} with Days 6–15 (all with summary fields)!")

if __name__ == '__main__':
    main()
