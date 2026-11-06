import sys
import os
from pypdf import PdfReader

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = os.path.abspath('docs/visuals/PINIT_ALL_IN_ONE_MASTER_SRS_AND_VISUALS_BIBLE.pdf')
reader = PdfReader(pdf_path)
total_pages = len(reader.pages)
print(f"Total Pages: {total_pages}")

# Find all occurrences of B.Com, Commerce, IoT, Part titles
sections = []
for idx in range(total_pages):
    text = reader.pages[idx].extract_text()
    for line in text.splitlines():
        line_clean = line.strip()
        if line_clean.startswith("PART ") or line_clean.startswith("Part ") or "MASTERCLASS" in line_clean.upper() or "COURSE:" in line_clean.upper() or "TRACK:" in line_clean.upper():
            if len(line_clean) < 120:
                sections.append((idx + 1, line_clean))

print(f"Found {len(sections)} structural markers.")
for page_num, sec in sections[:60]:
    print(f"Page {page_num:03d}: {sec}")
