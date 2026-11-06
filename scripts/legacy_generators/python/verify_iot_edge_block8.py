import json
import sys

days = [36, 37, 38, 39, 40]
all_pass = True

for day in days:
    path = f"scripts/iot_edge_day{day}.json"
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        print(f"FAIL: Could not load {path}: {e}")
        all_pass = False
        continue

    # Invariants checks
    if data.get("coursePrefix") != "iot_edge":
        print(f"Day {day} FAIL: coursePrefix is {data.get('coursePrefix')}")
        all_pass = False

    if data.get("day") != day:
        print(f"Day {day} FAIL: day field is {data.get('day')} != {day}")
        all_pass = False

    mins = data.get("minutes", 0)
    if not (35 <= mins <= 40):
        print(f"Day {day} FAIL: minutes {mins} not in [35, 40]")
        all_pass = False

    summary = data.get("summary", [])
    if len(summary) < 4:
        print(f"Day {day} FAIL: summary items {len(summary)} < 4")
        all_pass = False

    pstep = data.get("projectStep", {})
    psteps_list = pstep.get("steps", []) if isinstance(pstep, dict) else pstep
    if len(psteps_list) < 4:
        print(f"Day {day} FAIL: projectStep items {len(psteps_list)} < 4")
        all_pass = False

    parts = data.get("parts", [])
    if len(parts) != 5:
        print(f"Day {day} FAIL: parts count {len(parts)} != 5")
        all_pass = False

    word_counts = []
    for idx, part in enumerate(parts):
        say = part.get("say", [])
        w_count = sum(len(s.split()) for s in say)
        word_counts.append(w_count)
        if w_count < 580:
            print(f"Day {day} Part {idx+1} FAIL: word count {w_count} < 580")
            all_pass = False

        try_it = part.get("tryIt")
        if not isinstance(try_it, str):
            print(f"Day {day} Part {idx+1} FAIL: tryIt is not a string ({type(try_it)})")
            all_pass = False

        notes = part.get("codeNotes", [])
        if len(notes) < 3:
            print(f"Day {day} Part {idx+1} FAIL: codeNotes count {len(notes)} < 3")
            all_pass = False

        check = part.get("check", {})
        opts = check.get("options", [])
        if len(opts) != 4:
            print(f"Day {day} Part {idx+1} FAIL: options count {len(opts)} != 4")
            all_pass = False

        if check.get("answer") != 0:
            print(f"Day {day} Part {idx+1} FAIL: answer {check.get('answer')} != 0")
            all_pass = False

        if not check.get("why") or len(check.get("why", "")) < 10:
            print(f"Day {day} Part {idx+1} FAIL: check.why missing or too short")
            all_pass = False

    print(f"Day {day} PASS! Word counts: {word_counts} | Total: {sum(word_counts)} words | Mins: {mins}")

if all_pass:
    print("\n=======================================================")
    print("ALL BLOCK 8 DAYS (36-40) FULLY VERIFIED AND PASS ALL INVARIANTS!")
    print("=======================================================")
    sys.exit(0)
else:
    print("\nVERIFICATION FAILED ON INVARIANTS!")
    sys.exit(1)
