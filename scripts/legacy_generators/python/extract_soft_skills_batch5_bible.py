import re
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('docs/visuals/PINIT_MASTER_DEBUG.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Soft skills Day 51 is after Day 50 (which was around 22338267)
# Let's search for Day 51 within Course 22
matches = [m.start() for m in re.finditer(r'>Day 51<', text)]
print(f"Matches for >Day 51<: {len(matches)}")

soft_skills_match = None
for m in matches:
    if m > 22000000 and m < 22500000:
        soft_skills_match = m
        print(f"Found soft skills Day 51 at {m}!")
        break

if not soft_skills_match:
    for m in matches:
        snippet = text[max(0, m-200):min(len(text), m+200)]
        if "Stage 4" in snippet or "Block 11" in snippet or "CFP" in snippet or "Public Speaking" in snippet:
            soft_skills_match = m
            print(f"Found soft skills Day 51 at {m} via keyword!")
            break

if soft_skills_match:
    start_pos = soft_skills_match - 500
    # Search for Day 56 to get Days 51-55
    end_pos = text.find('>Day 56<', start_pos)
    if end_pos == -1:
        end_pos = start_pos + 150000
    print(f"Extracting Batch 5 from {start_pos} to {end_pos}")
    batch5_html = text[start_pos:end_pos]
    with open('scripts/soft_skills_month2_batch5_bible.txt', 'w', encoding='utf-8') as f:
        f.write(batch5_html)
    print("Saved scripts/soft_skills_month2_batch5_bible.txt successfully!")
else:
    print("Could not find soft skills Day 51!")
