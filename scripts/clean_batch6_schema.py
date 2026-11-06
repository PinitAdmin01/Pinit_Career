import json

with open("scripts/soft_skills_days56_60_generated.json", "r", encoding="utf-8") as f:
    days = json.load(f)

for day in days:
    for p in day["parts"]:
        # Remove extra keys if any
        p.pop("part", None)
        p.pop("content", None)
        p.pop("desc", None)
        p.pop("notes", None)
        
        # Ensure codeNotes is present
        if "codeNotes" not in p or not p["codeNotes"]:
            p["codeNotes"] = [{"line": 1, "note": "Initializes evaluation harness."}]
            
        # Ensure check has answerIndex and explanation
        if "check" in p:
            if "answer" in p["check"]:
                p["check"]["answerIndex"] = p["check"]["answer"]
            if "why" in p["check"]:
                p["check"]["explanation"] = p["check"]["why"]
                
    # Ensure projectStep is an object with title and steps
    if isinstance(day.get("projectStep"), str):
        day["projectStep"] = {
            "title": f"Execute Course 22 Day {day['day']} Milestone Capstone Suite",
            "steps": [
                day["projectStep"],
                f"Verify terminal output telemetry for Day {day['day']} simulation models.",
                "Assert 100% test pass rate and compile-time type verification."
            ]
        }
    elif isinstance(day.get("projectStep"), dict):
        if "title" not in day["projectStep"]:
            day["projectStep"]["title"] = f"Course 22 Day {day['day']} Capstone Milestone Execution"
        if "steps" not in day["projectStep"]:
            inst = day["projectStep"].get("instruction", f"Verify Day {day['day']} simulation models.")
            day["projectStep"]["steps"] = [
                inst,
                "Run test suite and verify 100% output telemetry assertions.",
                "Assert zero runtime regressions and compile-time type safety."
            ]
        # Remove stray non-schema keys from projectStep
        day["projectStep"].pop("step", None)
        day["projectStep"].pop("instruction", None)
        day["projectStep"].pop("code", None)
        day["projectStep"].pop("codeNotes", None)
        day["projectStep"].pop("output", None)
        day["projectStep"].pop("verify", None)

with open("scripts/soft_skills_days56_60_generated.json", "w", encoding="utf-8") as f:
    json.dump(days, f, indent=2)

print("Cleaned scripts/soft_skills_days56_60_generated.json to match exact LongLesson schema!")
