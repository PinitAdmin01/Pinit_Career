# scripts/assemble_bcom_law_block11.py
import json

print("=== ASSEMBLING BCOM_LAW BLOCK 11 (DAYS 51-55) INTO BCOM_LAW_LONG_LESSONS ===")

days_data = []
for day_num in range(51, 56):
    fpath = f"scripts/bcom_law_day{day_num}.json"
    with open(fpath, "r", encoding="utf-8") as f:
        d = json.load(f)
        
    # Clean and conform to LongLesson interface
    for p in d["parts"]:
        if isinstance(p.get("tryIt"), list):
            p["tryIt"] = p["tryIt"][0] if p["tryIt"] else ""
        if "check" in p:
            expl = p["check"].get("explanation") or p["check"].get("why") or ""
            p["check"]["answer"] = 0
            p["check"]["answerIndex"] = 0
            p["check"]["why"] = expl
            p["check"]["explanation"] = expl
            
    days_data.append(d)

ts_file = "src/lib/data/bcomLawLongLessons.ts"
with open(ts_file, "r", encoding="utf-8") as f:
    content = f.read()

# Verify where the file ends
strip_content = content.rstrip()
if not strip_content.endswith("];"):
    raise RuntimeError(f"Expected file to end with '];', found: {repr(strip_content[-20:])}")

# Remove the trailing '];'
base_content = strip_content[:-2].rstrip()

# Build serialized days
serialized_days = []
for d in days_data:
    serialized_days.append(json.dumps(d, indent=2))

new_tail = ",\n" + ",\n".join(serialized_days) + "\n];\n"
new_content = base_content + new_tail

with open(ts_file, "w", encoding="utf-8") as f:
    f.write(new_content)

print(f"Successfully appended Days 51-55 into {ts_file}!")
