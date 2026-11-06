import sys
import os
import re

sys.stdout.reconfigure(encoding="utf-8")

with open("docs/visuals/PINIT_MASTER_DEBUG.html", "r", encoding="utf-8", errors="ignore") as f:
    text = f.read()

pos = text.find("Part XXXVIII: Excel &amp; Data Analysis Fundamentals &mdash; Month 2")
part38 = text[pos:pos+350000]

# Extract cards for Days 51, 52, 53, 54, 55
days_51_55 = {}
for d in range(51, 56):
    pattern = rf'(<span[^>]*>Day\s*{d}</span>[\s\S]*?)(?=<span[^>]*>Day\s*{d+1}</span>|<!-- Stage|\Z)'
    match = re.search(pattern, part38)
    if match:
        days_51_55[d] = match.group(1).strip()
        print(f"Extracted Day {d} (length: {len(days_51_55[d])} chars)")
    else:
        print(f"FAILED to extract Day {d} with standard regex, trying fallback")
        p_d = part38.find(f"Day {d}</span>")
        if p_d != -1:
            p_next = part38.find(f"Day {d+1}</span>", p_d)
            if p_next == -1:
                p_next = p_d + 15000
            days_51_55[d] = part38[p_d-50:p_next].strip()
            print(f"Extracted Day {d} via fallback (length: {len(days_51_55[d])} chars)")

with open("scripts/excel_month2_batch5_bible.txt", "w", encoding="utf-8") as f:
    for d, content in days_51_55.items():
        f.write(f"\n{'='*80}\nDAY {d} BIBLE CARD\n{'='*80}\n")
        f.write(content + "\n")

print("Saved all 5 cards to scripts/excel_month2_batch5_bible.txt successfully!")
