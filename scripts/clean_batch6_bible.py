with open('scripts/soft_skills_month2_batch6_bible.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# Clean and extract cards for Days 56 to 60
import re

# Let's write a python parser using simple regex or string splits
days_data = []
for day_num in range(56, 61):
    day_str = f"Day {day_num}"
    pos = text.find(f">{day_str}</span>")
    if pos != -1:
        end_pos = text.find(f">Day {day_num+1}</span>", pos) if day_num < 60 else text.find("<!-- End", pos)
        if end_pos == -1:
            end_pos = pos + 15000
        card_chunk = text[pos-200:end_pos]
        days_data.append((day_num, card_chunk))

with open('scripts/soft_skills_batch6_cleaned_bible.txt', 'w', encoding='utf-8') as f:
    for d_num, chunk in days_data:
        f.write(f"\n{'='*70}\nDAY {d_num}\n{'='*70}\n")
        # Strip html tags loosely
        clean_text = re.sub(r'<[^>]+>', ' ', chunk)
        clean_text = re.sub(r'\s+', ' ', clean_text).strip()
        f.write(clean_text + "\n")

print("Wrote cleaned batch 6 bible text to scripts/soft_skills_batch6_cleaned_bible.txt")
