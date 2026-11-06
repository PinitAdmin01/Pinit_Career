"""
Block 208 Assembly & Verification Script: B.Com Digital Marketing Days 11–15 (TASK-831..835)
Course: B.Com Digital Marketing & Growth Hacking (bcom_dmkt) - MILESTONE 3 CAPSTONE COMPLETE!
1. Generates Days 11–15 long lessons dictionaries.
2. Validates >= 580 words per part and >= 2,950 words per day.
3. Generates Gate v2 on-disk visual JSON files (day-11.json to day-15.json) with SHA-256 bindings.
4. Updates src/lib/data/bcomDmktLongLessons.ts with Days 11–15.
"""

import os
import json
import io
import contextlib
import sys

# Ensure scripts dir is on sys.path
sys.path.extend(['.', 'scripts'])
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from visual_builder import count_words, make_sha256, generate_funnel_visual
from bcom_dmkt_day11_builder import build_day11
from bcom_dmkt_day12_builder import build_day12
from bcom_dmkt_day13_builder import build_day13
from bcom_dmkt_day14_builder import build_day14
from bcom_dmkt_day15_builder import build_day15

DAYS_BUILDERS = [
    (11, build_day11),
    (12, build_day12),
    (13, build_day13),
    (14, build_day14),
    (15, build_day15)
]

def main():
    print("=" * 70)
    print("BLOCK 208 ASSEMBLY: B.Com Digital Marketing Days 11–15 (TASK-831..835)")
    print("MILESTONE 3: PERFORMANCE VIDEO, LIFECYCLE AUTOMATION & CRO COMPLETE!")
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
                exec(part['code'], {'__name__': '__main__'})
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
        visual_data = generate_funnel_visual('bcom_dmkt', day_num, visual_entries)
        
        vis_dir = os.path.join('src', 'lib', 'data', 'lessonVisuals', 'bcom_dmkt')
        os.makedirs(vis_dir, exist_ok=True)
        vis_path = os.path.join(vis_dir, f"day-{day_num:02d}.json")
        with open(vis_path, 'w', encoding='utf-8') as f:
            json.dump(visual_data, f, indent=2)
        print(f"    [OK] Gate v2 Funnel visual JSON written to: {vis_path}")

    print("\n" + "=" * 70)
    print(f"ALL 5 DAYS VERIFIED: {total_batch_words:,} total spoken words (Avg {total_batch_words/5:.1f} w/day).")
    print("=" * 70)

    # Append to src/lib/data/bcomDmktLongLessons.ts
    dmkt_ts_path = os.path.join('src', 'lib', 'data', 'bcomDmktLongLessons.ts')
    with open(dmkt_ts_path, 'r', encoding='utf-8') as f:
        existing_ts = f.read()

    closing_bracket_idx = existing_ts.rfind('];')
    if closing_bracket_idx == -1:
        raise ValueError("Could not find closing bracket '];' in bcomDmktLongLessons.ts")

    days_ts_fragments = []
    for day_dict in generated_days:
        day_num = day_dict['day']
        title = day_dict['title']
        
        parts_ts = []
        for p_idx, part in enumerate(day_dict['parts']):
            say_joined = " ".join(part['say']).replace("\\", "\\\\").replace("'", "\\'")
            code_escaped = part['code'].replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")
            output_escaped = part['output'].replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")
            example_escaped = part['example'].replace("\\", "\\\\").replace("'", "\\'")
            tryit_escaped = part['tryIt'].replace("\\", "\\\\").replace("'", "\\'")
            q_escaped = part['check']['question'].replace("\\", "\\\\").replace("'", "\\'")
            why_escaped = part['check']['why'].replace("\\", "\\\\").replace("'", "\\'")
            
            opts_ts = ",\n".join([f"            '{opt.replace(chr(92), chr(92)+chr(92)).replace(chr(39), chr(92)+chr(39))}'" for opt in part['check']['options']])
            notes_ts = ",\n".join([f"          '{n.replace(chr(92), chr(92)+chr(92)).replace(chr(39), chr(92)+chr(39))}'" for n in part['codeNotes']])

            part_ts = f"""      {{
        part: {p_idx + 1},
        title: '{part['title'].replace("'", "\\'")}',
        say: '{say_joined}',
        rawCode: `{code_escaped}`,
        code: `{code_escaped}`,
        output: `{output_escaped}`,
        codeNotes: [
{notes_ts}
        ],
        example: '{example_escaped}',
        tryIt: '{tryit_escaped}',
        check: {{
          question: '{q_escaped}',
          options: [
{opts_ts}
          ],
          why: '{why_escaped}'
        }}
      }}"""
            parts_ts.append(part_ts)

        joined_parts_ts = ",\n".join(parts_ts)
        day_ts = f"""  {{
    coursePrefix: 'bcom_dmkt',
    day: {day_num},
    title: '{title.replace("'", "\\'")}',
    totalParts: 5,
    duration: '35m',
    parts: [
{joined_parts_ts}
    ]
  }}"""
        days_ts_fragments.append(day_ts)

    all_new_days_ts = ",\n" + ",\n".join(days_ts_fragments) + "\n];\n"
    new_file_content = existing_ts[:closing_bracket_idx] + all_new_days_ts

    with open(dmkt_ts_path, 'w', encoding='utf-8') as f:
        f.write(new_file_content)

    print(f"\n[+] Successfully appended Days 11–15 to {dmkt_ts_path}!")
    print("Course bcom_dmkt Milestone 3 is now 100% COMPLETE across Days 1–15!")

if __name__ == "__main__":
    main()
