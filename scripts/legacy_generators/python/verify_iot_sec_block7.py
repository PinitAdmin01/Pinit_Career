# scripts/verify_iot_sec_block7.py
import json
import subprocess
import sys

def verify_block7():
    days = [31, 32, 33, 34, 35]
    all_lessons = []

    print("=== STARTING COURSE 19 (iot_sec) MONTH 2 BLOCK 7 (DAYS 31-35) VERIFICATION ===")
    
    total_words_block = 0

    for d in days:
        json_path = f"scripts/iot_sec_day{d}.json"
        with open(json_path, "r", encoding="utf-8") as f:
            lesson = json.load(f)

        # Invariant 1: Basic metadata
        assert lesson.get("coursePrefix") == "iot_sec", f"Day {d}: coursePrefix must be 'iot_sec'"
        assert lesson.get("day") == d, f"Day {d}: day number mismatch"
        assert lesson.get("minutes") == 38, f"Day {d}: minutes must be strictly 38"
        assert len(lesson.get("parts", [])) == 5, f"Day {d}: must have exactly 5 parts"
        assert len(lesson.get("summary", [])) >= 4, f"Day {d}: summary must have >= 4 items"

        project_step = lesson.get("projectStep", {})
        assert "title" in project_step, f"Day {d}: projectStep must have a title"
        assert len(project_step.get("steps", [])) >= 4, f"Day {d}: projectStep must have >= 4 steps"
        assert "desc" not in project_step, f"Day {d}: projectStep must NOT have 'desc'"

        parts = lesson["parts"]
        day_words = 0
        wcs = []

        for p_idx, part in enumerate(parts):
            p_num = p_idx + 1
            ctx = f"Day {d} Part {p_num}"

            # Word count invariant
            say = part.get("say", [])
            if isinstance(say, list):
                wc = len(" ".join(say).split())
            else:
                wc = len(str(say).split())
            
            assert wc >= 580, f"{ctx}: word count ({wc}) is strictly < 580"
            day_words += wc
            wcs.append(wc)

            # Check question invariant
            chk = part.get("check", {})
            assert chk.get("question"), f"{ctx}: check must have a question"
            opts = chk.get("options", [])
            assert len(opts) == 4, f"{ctx}: check must have exactly 4 options, found {len(opts)}"
            assert chk.get("answer") == 0, f"{ctx}: check answer must be 0"
            assert chk.get("why"), f"{ctx}: check must have 'why'"

            # Code & output execution check
            code = part.get("code", "")
            expected_out = part.get("output", "").replace("\r\n", "\n").strip()
            assert code, f"{ctx}: code must not be empty"
            assert expected_out, f"{ctx}: output must not be empty"

            proc = subprocess.run(["python", "-c", code], capture_output=True, text=True)
            actual_out = proc.stdout.replace("\r\n", "\n").strip()

            if actual_out != expected_out:
                print(f"FAILED output match for {ctx}!")
                print("EXPECTED:")
                print(expected_out)
                print("ACTUAL:")
                print(actual_out)
                sys.exit(1)

        assert day_words >= 2900, f"Day {d}: total words ({day_words}) must be >= 2900"
        total_words_block += day_words
        print(f"  [PASS] Day {d} Verified: {wcs} (Total: {day_words} words, code outputs 100% match)")
        all_lessons.append(lesson)

    print(f"\nALL 5 DAYS (31-35) VERIFIED!")
    print(f"Total Block 7 Words: {total_words_block} words (Average {total_words_block / 5:.0f} words/day)")

    out_file = "scripts/block7_iot_sec_all_days.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(all_lessons, f, indent=2)

    print(f"Saved combined Block 7 payload to {out_file}")

if __name__ == "__main__":
    verify_block7()
