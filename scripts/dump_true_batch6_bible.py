with open(r'docs\visuals\PINIT_MASTER_DEBUG.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re

m = 22379783
chunk = text[m-500:m+60000]

with open('scripts/soft_skills_batch6_true_bible.txt', 'w', encoding='utf-8') as out:
    out.write(chunk)

print(f"Wrote {len(chunk)} characters to scripts/soft_skills_batch6_true_bible.txt")

# Let's also extract and clean text for Days 56-60
with open('scripts/soft_skills_batch6_clean.txt', 'w', encoding='utf-8') as out:
    clean = re.sub(r'<[^>]+>', ' ', chunk)
    clean = re.sub(r'\s+', ' ', clean).strip()
    out.write(clean)

print("Wrote clean text to scripts/soft_skills_batch6_clean.txt")
