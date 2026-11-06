# scripts/verify_iot_sec_block2.py
import json, subprocess, sys

def verify_all():
    all_days = []
    total_words_block = 0

    for day in range(6, 11):
        filename = f"scripts/iot_sec_day{day}.json"
        with open(filename, "r", encoding="utf-8") as f:
            data = json.load(f)

        assert data["coursePrefix"] == "iot_sec", f"Day {day} invalid coursePrefix"
        assert data["day"] == day, f"Day {day} day mismatch"
        assert len(data["title"]) > 10, f"Day {day} title too short"
        assert len(data["goal"]) > 25, f"Day {day} goal too short"
        assert data["minutes"] == 38, f"Day {day} minutes must be strictly 38"
        assert len(data["recap"]) > 20, f"Day {day} recap too short"
        assert len(data["parts"]) == 5, f"Day {day} parts must be exactly 5"
        assert len(data["summary"]) >= 4, f"Day {day} summary must have >= 4 items"
        assert len(data["projectStep"]["steps"]) >= 4, f"Day {day} projectStep must have >= 4 steps"

        day_words = []
        for p_idx, part in enumerate(data["parts"], 1):
            assert len(part["title"]) > 5, f"Day {day} Part {p_idx} title too short"
            assert isinstance(part["say"], list), f"Day {day} Part {p_idx} say must be list"
            words = sum(len(pg.split()) for pg in part["say"])
            day_words.append(words)
            assert words >= 580, f"Day {day} Part {p_idx} failed word count: {words} < 580"

            assert len(part["example"]) > 10, f"Day {day} Part {p_idx} example too short"
            assert len(part["codeNotes"]) >= 3, f"Day {day} Part {p_idx} codeNotes < 3"
            assert isinstance(part["tryIt"], str) and len(part["tryIt"]) > 15, f"Day {day} Part {p_idx} tryIt invalid"

            # Check question
            check = part["check"]
            assert len(check["question"]) > 10, f"Day {day} Part {p_idx} check question too short"
            assert len(check["options"]) == 4, f"Day {day} Part {p_idx} check options != 4"
            assert check["answer"] == 0, f"Day {day} Part {p_idx} check answer != 0"
            assert len(check["why"]) > 20, f"Day {day} Part {p_idx} check why too short"

            # Execute code
            res = subprocess.run(["python", "-c", part["code"]], capture_output=True, text=True)
            assert res.returncode == 0, f"Day {day} Part {p_idx} code execution failed:\n{res.stderr}"
            assert res.stdout.strip() == part["output"].strip(), f"Day {day} Part {p_idx} output mismatch"

        total_words_day = sum(day_words)
        total_words_block += total_words_day
        print(f"Day {day} verified! Words per part: {day_words} (Total: {total_words_day}, Min: {min(day_words)})")
        all_days.append(data)

    print(f"\n==========================================")
    print(f"BLOCK 2 VERIFIED! Total words: {total_words_block} across 5 days (avg {total_words_block/5:.0f} words/day)")
    print(f"All 25 parts meet strictly >= 580 words invariant!")
    print(f"==========================================")

    with open("scripts/block2_iot_sec_all_days.json", "w", encoding="utf-8") as f:
        json.dump(all_days, f, indent=2)
    print("Saved consolidated block2_iot_sec_all_days.json successfully!")

verify_all()
