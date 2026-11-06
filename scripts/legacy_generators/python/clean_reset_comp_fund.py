import sys

def reset_to_day(target_day):
    path = "src/lib/data/compFundLongLessons.ts"
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()

    # Find the day after target_day
    next_day = target_day + 1
    marker = f'"day": {next_day},'
    pos = text.find(marker)
    if pos == -1:
        print(f"Day {next_day} not found, file might already end at or before Day {target_day}")
        return

    # Find the start of next_day object: the '{' before marker
    obj_start = text.rfind('{', 0, pos)
    # The comma before obj_start
    comma_pos = text.rfind(',', 0, obj_start)
    clean_text = text[:comma_pos].rstrip() + "\n];\n"
    with open(path, "w", encoding="utf-8") as f:
        f.write(clean_text)
    print(f"Reset compFundLongLessons.ts to Day {target_day} cleanly.")

if __name__ == "__main__":
    target = int(sys.argv[1]) if len(sys.argv) > 1 else 12
    reset_to_day(target)
