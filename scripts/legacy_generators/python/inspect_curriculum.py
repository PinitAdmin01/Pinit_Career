import re

with open("src/lib/data/curriculumData.ts", "r", encoding="utf-8") as fp:
    text = fp.read()

# Look for bcom-accounting or bcom_accounting
pos = text.find("bcom-accounting")
if pos != -1:
    print("Found bcom-accounting at position", pos)
    chunk = text[pos:pos+4000]
    titles = re.findall(r"title:\s*['\"]([^'\"]+)['\"]", chunk)
    for idx, t in enumerate(titles, 1):
        print(f"Item {idx}: {t}")
else:
    print("bcom-accounting string not found in curriculumData.ts")
