import re
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/soft_skills_month2_batch3_bible.txt', 'r', encoding='utf-8') as f:
    text = f.read()

cards = text.split('class="daily-card"')
with open('scripts/soft_skills_batch3_cleaned_bible.txt', 'w', encoding='utf-8') as out:
    for idx in range(1, 6):
        day_num = 40 + idx
        c = cards[idx]
        out.write(f"\n{'='*30} DAY {day_num} FULL CONTENT {'='*30}\n")
        clean = re.sub(r'<[^>]+>', '\n', c)
        lines = [l.strip() for l in clean.split('\n') if l.strip()]
        out.write('\n'.join(lines) + '\n\n')

print("Wrote scripts/soft_skills_batch3_cleaned_bible.txt successfully!")
