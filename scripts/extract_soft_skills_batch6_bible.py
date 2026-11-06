import re
import json

bible_path = "docs/visuals/PINIT_MASTER_DEBUG.html"
with open(bible_path, "r", encoding="utf-8") as f:
    text = f.read()

# Locate Course 22 section or Day 56 to Day 60 cards
pattern = re.compile(r'(Day\s+5[6-9]|Day\s+60)[\s\S]*?(?=(Day\s+61|Course\s+23|$))', re.IGNORECASE)
matches = pattern.findall(text)
print(f"Matches found: {len(matches)}")

# Let's search for Day 56 in the text
pos = text.find("Day 56")
if pos != -1:
    print(f"Found 'Day 56' at {pos}")
    sample = text[pos:pos+40000]
    with open("scripts/soft_skills_month2_batch6_bible.txt", "w", encoding="utf-8") as out:
        out.write(sample)
    print("Wrote sample to scripts/soft_skills_month2_batch6_bible.txt")
else:
    print("'Day 56' not found directly, scanning for therac or knight...")
    pos2 = text.find("Therac-25")
    if pos2 != -1:
        print(f"Found 'Therac-25' at {pos2}")
        sample = text[pos2-500:pos2+40000]
        with open("scripts/soft_skills_month2_batch6_bible.txt", "w", encoding="utf-8") as out:
            out.write(sample)
        print("Wrote sample to scripts/soft_skills_month2_batch6_bible.txt")
