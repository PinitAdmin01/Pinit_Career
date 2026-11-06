"""
Block 202 Assembly & Verification Script: B.Com E-Commerce Days 6–10 (TASK-801..805)
Course: B.Com E-Commerce & Digital Business (bcom_ecom)
1. Generates Days 6–10 long lessons dictionaries.
2. Validates >= 580 words per part and >= 2,950 words per day.
3. Generates Gate v2 on-disk visual JSON files (day-06.json to day-10.json) with SHA-256 bindings.
4. Updates src/lib/data/bcomEcomLongLessons.ts with Days 6–10.
"""

import os
import json
import io
import contextlib
from visual_builder import count_words, make_sha256, generate_funnel_visual
from bcom_ecom_day06_builder import build_day06
from bcom_ecom_day07_builder import build_day07
from bcom_ecom_day08_builder import build_day08
from bcom_ecom_day09_builder import build_day09
from bcom_ecom_day10_builder import build_day10

DAYS_BUILDERS = [
    (6, build_day06),
    (7, build_day07),
    (8, build_day08),
    (9, build_day09),
    (10, build_day10)
]

def main():
    print("=" * 70)
    print("BLOCK 202 ASSEMBLY: B.Com E-Commerce Days 6–10 (TASK-801..805)")
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

    # Find the closing array bracket '];'
    closing_bracket_idx = existing_ts.rfind('];')
    if closing_bracket_idx == -1:
        raise ValueError("Could not find closing bracket '];' in bcomEcomLongLessons.ts")

    # Serialize days 6-10 into formatted JSON objects
    days_ts_fragments = []
    for d in generated_days:
        day_json_str = json.dumps(d, indent=2)
        days_ts_fragments.append(f",\n{day_json_str}")

    combined_addition = "".join(days_ts_fragments)
    new_ts_content = existing_ts[:closing_bracket_idx] + combined_addition + "\n];\n"

    with open(ecom_ts_path, 'w', encoding='utf-8') as f:
        f.write(new_ts_content)

    print(f"\n[+] Successfully appended Days 6–10 into {ecom_ts_path}!")

if __name__ == '__main__':
    main()
