import sys
import os
from pypdf import PdfReader

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = os.path.abspath('docs/visuals/PINIT_ALL_IN_ONE_MASTER_SRS_AND_VISUALS_BIBLE.pdf')
reader = PdfReader(pdf_path)

def dump_pages(start, end, label):
    print(f"\n==================== {label} (Pages {start}-{end}) ====================")
    for p in range(start - 1, end):
        print(f"\n--- PAGE {p + 1} ---")
        text = reader.pages[p].extract_text()
        print(text[:1500]) # First 1500 chars

# Read pedagogical standard (Pages 4-6)
dump_pages(4, 6, "PEDAGOGICAL STANDARD & COGNITIVE LOOP")

# Read marketing course (Pages 375-378)
dump_pages(375, 378, "MARKETING COURSE BLUEPRINT")
