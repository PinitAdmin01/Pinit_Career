# scripts/fix_day40_p2.py

path = "scripts/data_scrm_day40.py"
with open(path, "r", encoding="utf-8") as f:
    text = f.read()

target = '"statutory_revenue_restatement_usd": round(statutory_revenue_restatement_usd, 2)'
replacement = '"statutory_revenue_restatement_usd": round(statutory_downward_revenue_restatement, 2)'

assert target in text, "target not found"
text = text.replace(target, replacement)

with open(path, "w", encoding="utf-8") as f:
    f.write(text)

print("Fixed variable name in Day 40 Part 2 code.")
