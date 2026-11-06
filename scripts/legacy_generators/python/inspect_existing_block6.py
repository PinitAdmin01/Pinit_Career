import re, subprocess, sys

with open('src/lib/data/iotSecLongLessons.ts', 'r', encoding='utf-8') as f:
    txt = f.read()

# Let's extract each day using regex or find_days offsets
day_offsets = list(re.finditer(r'[\'"]?day[\'"]?\s*:\s*(\d+)', txt))

for i in range(25, len(day_offsets)):
    d_num = int(day_offsets[i].group(1))
    start = day_offsets[i].start()
    end = day_offsets[i+1].start() if i+1 < len(day_offsets) else len(txt)
    day_txt = txt[start:end]

    # word count in say lines
    say_matches = re.findall(r'"say":\s*\[(.*?)\]', day_txt, re.DOTALL)
    print(f"Day {d_num}: found {len(say_matches)} say blocks")
    for idx, s in enumerate(say_matches, 1):
        words = len(s.split())
        print(f"  Part {idx} word count: {words}")
