import pypdf
import re

pdf_path = r"docs/visuals/PINIT_36_COURSES_MASTERCLASS_SRS_500P.pdf"
reader = pypdf.PdfReader(pdf_path)
print(f"Total pages: {len(reader.pages)}")

# Scan first 20 pages for table of contents
toc_text = ""
for i in range(min(20, len(reader.pages))):
    text = reader.pages[i].extract_text()
    if "Table of Contents" in text or "Course" in text:
        toc_text += f"\n--- Page {i+1} ---\n" + text[:500]

print("TOC preview:")
print(toc_text[:2000].encode('ascii', errors='replace').decode('ascii'))
