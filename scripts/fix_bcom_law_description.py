# scripts/fix_bcom_law_description.py
with open("src/lib/data/bcomLawLongLessons.ts", "r", encoding="utf-8") as f:
    c = f.read()

new_c = c.replace('"description": "Master corporate governance around Related Party', '"goal": "Master corporate governance around Related Party')
new_c = new_c.replace('"description": "Master the end-to-end operationalization of corporate', '"goal": "Master the end-to-end operationalization of corporate')

if new_c != c:
    with open("src/lib/data/bcomLawLongLessons.ts", "w", encoding="utf-8") as f:
        f.write(new_c)
    print("Replaced description with goal successfully.")
else:
    print("No changes were made.")
