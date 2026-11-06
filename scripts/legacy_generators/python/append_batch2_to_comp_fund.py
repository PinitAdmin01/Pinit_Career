import json

comp_path = "src/lib/data/compFundLongLessons.ts"
with open(comp_path, "r", encoding="utf-8") as f:
    text = f.read()

pos_close = text.rfind('\n];')
if pos_close == -1:
    raise Exception("Could not find array end marker '\\n];'")

# Check if Day 17 is already present
if '"day": 17,' in text:
    print("Day 17 already in compFundLongLessons.ts, finding where Day 17 starts...")
    pos17 = text.find('"day": 17,')
    start_cut = text.rfind('{', 0, pos17)
    text = text[:start_cut].rstrip()
    if text.endswith(','):
        text = text[:-1].rstrip()
    text = text + "\n];"
    pos_close = text.rfind('\n];')

days = [17, 18, 19, 20, 21]
new_days_json = []

for d in days:
    with open(f"scripts/day_{d}.json", "r", encoding="utf-8") as df:
        lesson = json.load(df)
        lesson_str = json.dumps(lesson, indent=2, ensure_ascii=False)
        new_days_json.append(lesson_str)

prefix = text[:pos_close].rstrip()
if not prefix.endswith(','):
    prefix += ','

appended_content = prefix + "\n" + ",\n".join(new_days_json) + "\n];\n"

with open(comp_path, "w", encoding="utf-8") as f:
    f.write(appended_content)

print("SUCCESS: Appended Days 17 to 21 to compFundLongLessons.ts!")
