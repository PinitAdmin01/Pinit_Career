import re
from data_devops_day31 import DAY_31
from data_devops_day32 import DAY_32
from data_devops_day33 import DAY_33
from data_devops_day34 import DAY_34
from data_devops_day35 import DAY_35

ALL_DAYS = [DAY_31, DAY_32, DAY_33, DAY_34, DAY_35]

print("--- AUDITING ALL 25 PARTS ---")
below_600 = []

for day_data in ALL_DAYS:
    day = day_data["day"]
    day_words = 0
    for p in day_data["parts"]:
        part_num = p["part"]
        word_count = sum(len(para.split()) for para in p["say"])
        day_words += word_count
        status = "OK" if word_count >= 600 else f"LOW ({word_count})"
        print(f"Day {day} Part {part_num}: {word_count} words - {status}")
        if word_count < 600:
            below_600.append((day, part_num, word_count))
    print(f"Day {day} Total: {day_words} words\n")

print(f"Total parts below 600 words: {len(below_600)}")
if below_600:
    for d, p, w in below_600:
        print(f"  Day {d} Part {p}: {w} words (needs +{600 - w} words)")
