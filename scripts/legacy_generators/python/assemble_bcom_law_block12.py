import json

print("=== ASSEMBLING BCOM_LAW BLOCK 12 (DAYS 56-60) INTO BCOM_LAW_LONG_LESSONS ===")

days_data = []
for day_num in range(56, 61):
    fpath = f"scripts/bcom_law_day{day_num}.json"
    with open(fpath, "r", encoding="utf-8") as f:
        d = json.load(f)
        
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

strip_content = content.rstrip()
if not strip_content.endswith("];"):
    raise RuntimeError(f"Expected file to end with '];', found: {repr(strip_content[-20:])}")

base_content = strip_content[:-2].rstrip()

serialized_days = []
for d in days_data:
    serialized_days.append(json.dumps(d, indent=2))

new_tail = ",\n" + ",\n".join(serialized_days) + "\n];\n"
new_content = base_content + new_tail

with open(ts_file, "w", encoding="utf-8") as f:
    f.write(new_content)

print(f"Successfully appended Days 56-60 into {ts_file}!")
