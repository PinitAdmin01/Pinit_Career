import sys
import os
import io
import contextlib

sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, os.path.abspath("."))

import scripts.make_month2_days41_42 as m1
import scripts.make_month2_days43_44_45 as m2

def clean_code(code: str) -> str:
    lines = code.splitlines()
    new_lines = []
    in_main = False
    for line in lines:
        stripped = line.strip()
        if stripped in ('if __name__ == "__main__":', "if __name__ == '__main__':"):
            in_main = True
            continue
        if in_main:
            if line.startswith('    '):
                new_lines.append(line[4:])
            else:
                new_lines.append(line)
        else:
            new_lines.append(line)
    return '\n'.join(new_lines).strip() + '\n'

days = [m1.day41_lesson, m1.day42_lesson, m2.day43_lesson, m2.day44_lesson, m2.day45_lesson]

all_valid = True
for d in days:
    num = d["day"]
    for idx, p in enumerate(d["parts"]):
        c = clean_code(p["code"])
        lines_count = len(c.splitlines())
        notes = p.get("codeNotes", [])
        for note in notes:
            line_no = note["line"]
            if line_no > lines_count:
                print(f"INVALID: Day {num} Part {idx+1}: note line {line_no} > total lines {lines_count}")
                all_valid = False

print("All code notes valid:", all_valid)
