# scripts/scan_month2_pdf.py
import pypdf
import re

reader = pypdf.PdfReader(r"docs/visuals/PINIT_36_COURSES_MASTERCLASS_SRS_500P.pdf")

out = []
for p in range(565, len(reader.pages)):
    txt = reader.pages[p].extract_text()
    first_line = txt.strip().split('\n')[0] if txt.strip() else "EMPTY"
    day_match = re.search(r'Day\s+(\d+)\s+([^\n]+)', txt)
    day_info = f"Day {day_match.group(1)}: {day_match.group(2)[:50]}" if day_match else ""
    out.append(f"Page {p+1}: {first_line[:50]} | {day_info}\n")

with open("scripts/month2_pages_list.txt", "w", encoding="utf-8") as f:
    f.writelines(out)

print("Saved scan to scripts/month2_pages_list.txt")
