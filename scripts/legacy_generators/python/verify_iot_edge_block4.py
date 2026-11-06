import json
import sys

days = [16, 17, 18, 19, 20]
all_ok = True

for day in days:
    filepath = f"scripts/iot_edge_day{day}.json"
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading {filepath}: {e}")
        all_ok = False
        continue

    print(f"\n--- Checking Day {day}: {data.get('title', 'NO TITLE')} ---")
    
    # Check minutes
    mins = data.get('minutes', 0)
    if not (35 <= mins <= 40):
        print(f"FAILED: minutes = {mins} (expected 35-40)")
        all_ok = False
    else:
        print(f"OK: minutes = {mins}")

    # Check parts count
    parts = data.get('parts', [])
    if len(parts) != 5:
        print(f"FAILED: parts count = {len(parts)} (expected 5)")
        all_ok = False
    else:
        print(f"OK: parts count = 5")

    total_words = 0
    for idx, part in enumerate(parts):
        say = part.get('say', [])
        if isinstance(say, list):
            say_text = ' '.join(say)
        else:
            say_text = str(say)
        words = len(say_text.split())
        total_words += words
        if words < 580:
            print(f"FAILED: Part {idx+1} word count = {words} (< 580)")
            all_ok = False
        else:
            print(f"OK: Part {idx+1} word count = {words}")

        # Check options
        check = part.get('check', {})
        options = check.get('options', [])
        if len(options) != 4:
            print(f"FAILED: Part {idx+1} check options count = {len(options)} (expected 4)")
            all_ok = False
        answer = check.get('answer', -1)
        if answer != 0:
            print(f"FAILED: Part {idx+1} check answer = {answer} (expected 0)")
            all_ok = False
        why = check.get('why', '')
        if not why or len(why.split()) < 10:
            print(f"FAILED: Part {idx+1} check why is missing or too short")
            all_ok = False

        # Check codeNotes
        notes = part.get('codeNotes', [])
        if len(notes) < 3:
            print(f"FAILED: Part {idx+1} codeNotes count = {len(notes)} (expected >= 3)")
            all_ok = False

        # Check tryIt is string
        try_it = part.get('tryIt', '')
        if not isinstance(try_it, str) or len(try_it.strip()) < 10:
            print(f"FAILED: Part {idx+1} tryIt must be non-empty string, got: {type(try_it)}")
            all_ok = False

    print(f"Total Words for Day {day}: {total_words}")
    if total_words < 2900:
        print(f"FAILED: Total words {total_words} < 2900")
        all_ok = False

    # Check summary
    summary = data.get('summary', [])
    if len(summary) < 4:
        print(f"FAILED: summary count = {len(summary)} (expected >= 4)")
        all_ok = False
    else:
        print(f"OK: summary count = {len(summary)}")

    # Check projectStep
    pstep = data.get('projectStep', {})
    if isinstance(pstep, dict):
        steps = pstep.get('steps', [])
    elif isinstance(pstep, list):
        steps = pstep
    else:
        steps = []

    if len(steps) < 4:
        print(f"FAILED: projectStep steps count = {len(steps)} (expected >= 4)")
        all_ok = False
    else:
        print(f"OK: projectStep steps count = {len(steps)} ({pstep.get('title', 'Untitled')})")

if all_ok:
    print("\n==========================================")
    print("ALL BLOCK 4 INVARIANTS PERFECTLY VERIFIED!")
    print("==========================================")
else:
    print("\nVERIFICATION FAILED! SEE ERRORS ABOVE.")
    sys.exit(1)
