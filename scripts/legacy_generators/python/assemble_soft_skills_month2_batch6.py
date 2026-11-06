import json

with open("scripts/soft_skills_days56_60_generated.json", "r", encoding="utf-8") as f:
    batch6_days = json.load(f)

with open("src/lib/data/softSkillsLongLessons.ts", "r", encoding="utf-8") as f:
    ts_content = f.read()

# Locate the closing bracket of SOFT_SKILLS_LONG_LESSONS
# Notice the last two lines:
# 18346: }
# 18347: ];
# 18348: 

last_bracket = ts_content.rfind("];")
if last_bracket == -1:
    raise ValueError("Could not find closing bracket ]; in softSkillsLongLessons.ts")

# Convert batch6_days into TypeScript JSON snippet
batch6_ts_entries = []
for day in batch6_days:
    # Ensure answerIndex and explanation exist for full compatibility
    for p in day["parts"]:
        if "check" in p:
            p["check"]["answerIndex"] = p["check"]["answer"]
            p["check"]["explanation"] = p["check"]["why"]
    day_json = json.dumps(day, indent=2)
    batch6_ts_entries.append(day_json)

appended_code = ",\n" + ",\n".join(batch6_ts_entries) + "\n];\n"

new_ts_content = ts_content[:last_bracket] + appended_code

with open("src/lib/data/softSkillsLongLessons.ts", "w", encoding="utf-8") as f:
    f.write(new_ts_content)

print(f"Successfully assembled Days 56-60 into src/lib/data/softSkillsLongLessons.ts!")
