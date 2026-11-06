import re
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('docs/visuals/PINIT_MASTER_DEBUG.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Soft skills Day 46 is at index 22295943
start_pos = 22295943 - 500
# find where Day 51 or end of course 22 starts
end_pos = text.find('>Day 51<', start_pos)
if end_pos == -1:
    end_pos = start_pos + 150000

print(f"Extracting Course 22 Batch 4 (Days 46-50) from {start_pos} to {end_pos}")
batch4_html = text[start_pos:end_pos]

with open('scripts/soft_skills_month2_batch4_bible.txt', 'w', encoding='utf-8') as f:
    f.write(batch4_html)

print("Saved scripts/soft_skills_month2_batch4_bible.txt successfully!")
