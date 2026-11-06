# scripts/scan_pdf_courses.py
import pypdf
import re

reader = pypdf.PdfReader(r"docs/visuals/PINIT_36_COURSES_MASTERCLASS_SRS_500P.pdf")
print(f"Total pages: {len(reader.pages)}")

# Let's inspect where different courses appear
course_pages = {}
for i, page in enumerate(reader.pages):
    text = page.extract_text()
    matches = re.findall(r'Course\s+\d+:\s*\[([^\]]+)\]', text)
    if matches:
        for m in matches:
            if m not in course_pages:
                course_pages[m] = i + 1

    # Also search for Month 2 or Day 41..60
    if "devops" in text.lower():
        if "devops" not in course_pages:
            course_pages["devops_mention"] = i + 1

print("\n--- Courses Found in PDF ---")
for c, p in course_pages.items():
    print(f"Course [{c}] found on page {p}")
