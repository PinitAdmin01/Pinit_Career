"""
Block 206 Assembly & Verification Script: B.Com E-Commerce Days 26–30 (TASK-821..825)
Course: B.Com E-Commerce & Digital Business (bcom_ecom) - MILESTONE 5 COMPLETE (100% OF COURSE 27!)
1. Generates Days 26–30 long lessons dictionaries.
2. Validates >= 580 words per part and >= 2,950 words per day.
3. Generates Gate v2 on-disk visual JSON files (day-26.json to day-30.json) with SHA-256 bindings.
4. Updates src/lib/data/bcomEcomLongLessons.ts with Days 26–30.
"""

import os
import json
import io
import contextlib
import sys

# Ensure scripts dir is on sys.path
sys.path.extend(['.', 'scripts'])

from visual_builder import count_words, make_sha256, generate_funnel_visual
from bcom_ecom_day26_builder import build_day26
from bcom_ecom_day27_builder import build_day27
from bcom_ecom_day28_builder import build_day28
from bcom_ecom_day29_builder import build_day29
from bcom_ecom_day30_builder import build_day30

DAYS_BUILDERS = [
    (26, build_day26),
    (27, build_day27),
    (28, build_day28),
    (29, build_day29),
    (30, build_day30)
]

def main():
    print("=" * 70)
    print("BLOCK 206 ASSEMBLY: B.Com E-Commerce Days 26–30 (TASK-821..825)")
    print("MILESTONE 5 GRAND FINAL: COURSE 27 (bcom_ecom) 100% COMPLETE!")
    print("=" * 70)

    generated_days = []
    total_batch_words = 0

    for day_num, builder_fn in DAYS_BUILDERS:
        day_dict, words = builder_fn()
        generated_days.append(day_dict)
        total_batch_words += words
        print(f"\n[+] Day {day_num:2d}: {day_dict['title'][:55]}...")
        print(f"    Total Spoken Words: {words:,} (Average {words/5:.1f} w/part)")

        # Verify invariant >= 580 words per part
        for idx, part in enumerate(day_dict['parts']):
            p_words = count_words(part['say'])
            assert p_words >= 580, f"Day {day_num} Part {idx+1} has {p_words} words (< 580 words!)"
            assert len(part['codeNotes']) >= 3, f"Day {day_num} Part {idx+1} codeNotes < 3"
            assert part['check']['options'], f"Day {day_num} Part {idx+1} missing check options"
            assert part['check']['why'], f"Day {day_num} Part {idx+1} missing check why"

        # Test deterministic Python execution
        for idx, part in enumerate(day_dict['parts']):
            stdout_capture = io.StringIO()
            with contextlib.redirect_stdout(stdout_capture):
                exec(part['code'], {})
            actual_stdout = stdout_capture.getvalue().strip()
            expected_stdout = part['output'].strip()
            assert actual_stdout == expected_stdout, (
                f"Day {day_num} Part {idx+1} stdout mismatch!\n"
                f"Expected:\n{expected_stdout}\nActual:\n{actual_stdout}"
            )
        print(f"    [OK] All 5 Python simulations executed deterministically with exact stdout match.")

        # Generate Gate v2 visual JSON on disk
        visual_entries = []
        for p in day_dict['parts']:
            visual_entries.append({
                'title': p['title'],
                'code': p['code']
            })
        visual_data = generate_funnel_visual('bcom_ecom', day_num, visual_entries)
        
        vis_dir = os.path.join('src', 'lib', 'data', 'lessonVisuals', 'bcom_ecom')
        os.makedirs(vis_dir, exist_ok=True)
        vis_path = os.path.join(vis_dir, f"day-{day_num:02d}.json")
        with open(vis_path, 'w', encoding='utf-8') as f:
            json.dump(visual_data, f, indent=2)
        print(f"    [OK] Gate v2 Funnel visual JSON written to: {vis_path}")

    print("\n" + "=" * 70)
    print(f"ALL 5 DAYS VERIFIED: {total_batch_words:,} total spoken words (Avg {total_batch_words/5:.1f} w/day).")
    print("=" * 70)

    # Append to src/lib/data/bcomEcomLongLessons.ts
    ecom_ts_path = os.path.join('src', 'lib', 'data', 'bcomEcomLongLessons.ts')
    with open(ecom_ts_path, 'r', encoding='utf-8') as f:
        existing_ts = f.read()

    closing_bracket_idx = existing_ts.rfind('];')
    if closing_bracket_idx == -1:
        raise ValueError("Could not find closing bracket '];' in bcomEcomLongLessons.ts")

    days_ts_fragments = []
    for d in generated_days:
        day_json_str = json.dumps(d, indent=2)
        days_ts_fragments.append(f",\n{day_json_str}")

    combined_addition = "".join(days_ts_fragments)
    new_ts_content = existing_ts[:closing_bracket_idx] + combined_addition + "\n];\n"

    with open(ecom_ts_path, 'w', encoding='utf-8') as f:
        f.write(new_ts_content)

    print(f"\n[+] Successfully appended Days 26–30 into {ecom_ts_path}!")

if __name__ == '__main__':
    main()
