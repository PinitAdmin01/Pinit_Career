# scripts/fix_bcom_law_parts.py
import re

with open("src/lib/data/bcomLawLongLessons.ts", "r", encoding="utf-8") as f:
    c = f.read()

new_c = re.sub(r'"part":\s*\d+,\s*\n\s*', '', c)

if new_c != c:
    with open("src/lib/data/bcomLawLongLessons.ts", "w", encoding="utf-8") as f:
        f.write(new_c)
    print("Cleaned invalid part field from bcomLawLongLessons.ts successfully.")
else:
    print("No changes were made.")
