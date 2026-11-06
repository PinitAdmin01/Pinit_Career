# scripts/search_bible_structure.py
import pypdf
import re

reader = pypdf.PdfReader(r"docs/visuals/PINIT_36_COURSES_MASTERCLASS_SRS_500P.pdf")
print(f"Total pages: {len(reader.pages)}")

# Let's search for "Course " and see what courses exist and where their Day 1..60 are defined.
courses_found = []
for p in range(len(reader.pages)):
    txt = reader.pages[p].extract_text()
    # Look for headers like "Course X:" or "Course 02:" or titles
    m = re.findall(r'(?:Course\s+\d+|### Course\s+\d+).*', txt)
    if m:
        for item in m:
            courses_found.append((p + 1, item.strip()[:80]))

print(f"Total Course mentions found: {len(courses_found)}")
for page_num, line in courses_found[:40]:
    print(f"Page {page_num}: {line}")
