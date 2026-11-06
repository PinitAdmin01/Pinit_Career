import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('docs/visuals/PINIT_MASTER_DEBUG.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

pos = text.find('38.2 Month 2: Advanced Financial Modeling')
pos_end = text.find('PART XXXIX: GIT', pos)
section = text[pos:pos_end]

# Find all cards/sections for Days 56 to 60
with open('scripts/excel_month2_batch6_bible.txt', 'w', encoding='utf-8') as out:
    for d in range(56, 61):
        out.write(f"\n{'='*70}\nDAY {d} BIBLE SPECIFICATION\n{'='*70}\n")
        # Match day header and content until next day header
        d_pat = rf'(Day\s+{d}\s*</span>.*?)(?=Day\s+\d+\s*</span>|\Z)'
        m = re.search(d_pat, section, re.DOTALL)
        if m:
            clean = re.sub(r'<[^>]+>', ' ', m.group(1))
            clean = re.sub(r'\s+', ' ', clean).strip()
            out.write(clean + "\n")
        else:
            out.write(f"Direct match failed for Day {d}. Searching broader pattern...\n")
            d_pat2 = rf'(Day\s+{d}[:\s–\-].*?)(?=Day\s+\d+[:\s–\-]|\Z)'
            m2 = re.search(d_pat2, section, re.DOTALL)
            if m2:
                clean2 = re.sub(r'<[^>]+>', ' ', m2.group(1))
                clean2 = re.sub(r'\s+', ' ', clean2).strip()
                out.write(clean2 + "\n")
            else:
                out.write("No match found in section!\n")

print("Saved exact Bible specs for Days 56-60 to scripts/excel_month2_batch6_bible.txt")
