# scripts/inspect_bible_pdf.py
import pypdf
import os

pdf_path = r"docs/visuals/PINIT_36_COURSES_MASTERCLASS_SRS_500P.pdf"
reader = pypdf.PdfReader(pdf_path)
total_pages = len(reader.pages)
print(f"Total pages: {total_pages}")

out_txt = []
for p in range(670, total_pages):
    text = reader.pages[p].extract_text()
    out_txt.append(f"\n==================== PAGE {p+1} ====================\n")
    out_txt.append(text)

with open("scripts/pages_671_to_end.txt", "w", encoding="utf-8") as f:
    f.writelines(out_txt)

print("Saved pages 671 to end to scripts/pages_671_to_end.txt")
