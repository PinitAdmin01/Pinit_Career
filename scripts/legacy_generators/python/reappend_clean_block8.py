import json

def reappend():
    with open("src/lib/data/iotSecLongLessons.ts", "r", encoding="utf-8") as f:
        content = f.read()

    # Find the start of day 36
    day36_marker = '"day": 36'
    day36_pos = content.find(day36_marker)

    if day36_pos != -1:
        # Find the opening brace before "day": 36
        brace_pos = content.rfind("{", 0, day36_pos)
        # Find the comma before this brace
        comma_pos = content.rfind(",", 0, brace_pos)
        content_prefix = content[:comma_pos + 1]
    else:
        # If day 36 was not found, find the closing ];
        last_bracket_idx = content.rfind("];")
        content_prefix = content[:last_bracket_idx].rstrip()
        if not content_prefix.endswith(","):
            content_prefix += ","

    with open("scripts/block8_iot_sec_all_days.json", "r", encoding="utf-8") as f:
        days = json.load(f)

    formatted_days = []
    for d in days:
        ts_day = json.dumps(d, indent=2, ensure_ascii=False)
        formatted_days.append(ts_day)

    new_content = content_prefix + "\n  " + ",\n  ".join(formatted_days) + "\n];\n"

    with open("src/lib/data/iotSecLongLessons.ts", "w", encoding="utf-8") as f:
        f.write(new_content)

    print("Successfully reappended clean, self-contained Days 36-40 to src/lib/data/iotSecLongLessons.ts!")

if __name__ == '__main__':
    reappend()
