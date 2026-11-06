# scripts/assemble_month2_batch4.py
import sys
import os
import json
import hashlib
import io
import contextlib

# Ensure utf-8
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

sys.path.insert(0, os.path.abspath("."))

from scripts.make_month2_days46_47 import day46_lesson, day47_lesson
from scripts.make_month2_days48_49_50 import day48_lesson, day49_lesson, day50_lesson

def run_py(code_str: str) -> str:
    buf = io.StringIO()
    g = {}
    with contextlib.redirect_stdout(buf):
        exec(code_str, g)
    return buf.getvalue().rstrip()

def clean_code(code: str) -> str:
    lines = code.splitlines()
    new_lines = []
    in_main = False
    for line in lines:
        stripped = line.strip()
        if stripped in ('if __name__ == "__main__":', "if __name__ == '__main__':"):
            in_main = True
            continue
        if in_main:
            if line.startswith('    '):
                new_lines.append(line[4:])
            else:
                new_lines.append(line)
        else:
            new_lines.append(line)
    return '\n'.join(new_lines).strip() + '\n'

days_data = [
    day46_lesson,
    day47_lesson,
    day48_lesson,
    day49_lesson,
    day50_lesson
]

# Provide goals and recaps for complete pedagogical excellence
recaps = {
    46: "Yesterday, you synthesized all econometric modeling capabilities into Milestone 6: ApexAnalytics. Today, we inaugurate Stage 10: Enterprise Automation with the Microsoft Excel Component Object Model (COM) DOM hierarchy and Range.Value2 2D memory arrays.",
    47: "Yesterday, you mastered explicit COM object variables, Range.Value2 memory buffering, and execution state controllers. Today, we conquer structured VBA error handling (On Error GoTo), the CleanExit state restoration architecture, and Worksheet_Change event automation.",
    48: "Yesterday, you engineered resilient error handling and event automation in desktop VBA. Today, we advance into modern cloud automation with TypeScript Office Scripts, Google V8 sandboxing, the Excel JavaScript API, and Power Automate webhooks.",
    49: "Yesterday, you built asynchronous cloud pipelines with TypeScript Office Scripts and Power Automate. Today, we master pure functional spreadsheet engineering with custom User-Defined Functions (UDFs) and modern LAMBDA helper functions (MAP, SCAN, REDUCE, BYROW).",
    50: "Yesterday, you mastered Turing-complete LAMBDA formulas, tail-recursion, and stateful accumulation. Today, we assemble the entire curriculum into our grand capstone: ⭐ Milestone 7: ApexAutomate Enterprise VBA & TypeScript Office Scripts Automation Suite."
}

# Domain bar metrics for each day
visual_metrics = {
    46: ["COM Hierarchy", "Value2 Array", "State Controller", "Ledger Consolidation"],
    47: ["Structured Error", "CleanExit Pattern", "Event Interceptor", "SOX 404 Ledger"],
    48: ["V8 Sandbox", "Batch Matrix", "JSON Webhook", "Cloud Flow"],
    49: ["Pure Lambda", "Tail Recursion", "Vector MAP / BYROW", "SCAN / REDUCE"],
    50: ["Desktop VBA 100k", "Cloud Script 25k", "Functional LAMBDA", "SOX 404 Audit Seal"]
}

# 1. Clean code and compute deterministic execution output
print("=== VERIFYING CODE AND DETERMINISTIC OUTPUTS ===")
for day_obj in days_data:
    day_num = day_obj["day"]
    day_obj["minutes"] = 30
    day_obj["recap"] = recaps[day_num]

    print(f"\nProcessing Day {day_num}: {day_obj['title']}")
    for p_idx, part in enumerate(day_obj["parts"]):
        cleaned = clean_code(part["code"])
        part["code"] = cleaned
        actual_out = run_py(cleaned)
        part["output"] = actual_out
        assert len(actual_out) > 0, f"Day {day_num} Part {p_idx+1} produced empty output!"
        print(f"  Part {p_idx+1}: {part['title'][:40]}... -> Code length: {len(cleaned)}, Output length: {len(actual_out)}")

# 2. Generate visual JSON files
visuals_dir = os.path.join("src", "lib", "data", "lessonVisuals", "excel_viz")
os.makedirs(visuals_dir, exist_ok=True)

print("\n=== GENERATING VISUAL JSON FILES ===")
for day_obj in days_data:
    day_num = day_obj["day"]
    day_visual_entries = []
    labels = visual_metrics[day_num]
    
    for p_idx, part in enumerate(day_obj["parts"]):
        code_str = part["code"]
        code_hash = hashlib.sha256(code_str.encode('utf-8')).hexdigest()
        
        entry = {
            "partTitle": part["title"],
            "codeHash": code_hash,
            "spec": {
                "template": "bars",
                "title": f"{part['title']} – {day_obj['title']}",
                "steps": [
                    {
                        "at": "intro",
                        "caption": f"Step 1: Architectural ingestion and baseline configuration for {part['title']}",
                        "max": 100,
                        "bars": [
                            {"label": labels[0], "value": 25, "tone": "accent"},
                            {"label": labels[1], "value": 20, "tone": "data"},
                            {"label": labels[2], "value": 15, "tone": "data"},
                            {"label": labels[3], "value": 10, "tone": "data"}
                        ]
                    },
                    {
                        "at": "say1",
                        "caption": f"Step 2: Execution pipeline and memory array processing for {part['title']}",
                        "max": 100,
                        "bars": [
                            {"label": labels[0], "value": 65, "tone": "accent"},
                            {"label": labels[1], "value": 60, "tone": "data"},
                            {"label": labels[2], "value": 55, "tone": "data"},
                            {"label": labels[3], "value": 45, "tone": "data"}
                        ]
                    },
                    {
                        "at": "example",
                        "caption": f"Step 3: Stress testing and failure boundary validation for {part['title']}",
                        "max": 100,
                        "bars": [
                            {"label": labels[0], "value": 85, "tone": "accent"},
                            {"label": labels[1], "value": 80, "tone": "data"},
                            {"label": labels[2], "value": 75, "tone": "data"},
                            {"label": labels[3], "value": 70, "tone": "data"}
                        ]
                    },
                    {
                        "at": "tryIt",
                        "caption": f"Step 4: Institutional governance and production certification for {part['title']}",
                        "max": 100,
                        "bars": [
                            {"label": labels[0], "value": 100, "tone": "accent"},
                            {"label": labels[1], "value": 95, "tone": "data"},
                            {"label": labels[2], "value": 90, "tone": "data"},
                            {"label": labels[3], "value": 85, "tone": "data"}
                        ]
                    }
                ]
            }
        }
        day_visual_entries.append(entry)
        
    v_path = os.path.join(visuals_dir, f"day-{day_num:02d}.json")
    with open(v_path, "w", encoding="utf-8") as vf:
        json.dump(day_visual_entries, vf, indent=2, ensure_ascii=False)
    print(f"Generated Visual JSON: {v_path} with {len(day_visual_entries)} visual specs.")

# 3. Append Days 46-50 into src/lib/data/excelVizLongLessons.ts
ts_file_path = os.path.join("src", "lib", "data", "excelVizLongLessons.ts")
with open(ts_file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Check if Day 46 is already added
if '"day": 46' in content or 'day: 46' in content:
    print("Days 46-50 already detected in excelVizLongLessons.ts! Skipping insertion.")
else:
    # Find the closing "];"
    closing_idx = content.rfind("];")
    if closing_idx == -1:
        raise RuntimeError("Could not find closing '];' in excelVizLongLessons.ts")
    
    # Format Days 46-50 as JSON objects
    new_days_snippets = []
    for day_obj in days_data:
        json_str = json.dumps(day_obj, indent=2, ensure_ascii=False)
        new_days_snippets.append(json_str)
    
    combined_new_code = ",\n" + ",\n".join(new_days_snippets) + "\n];\n"
    new_content = content[:closing_idx].rstrip() + combined_new_code
    
    with open(ts_file_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"Successfully appended Days 46-50 to {ts_file_path}!")

print("\n=== BATCH 4 ASSEMBLY COMPLETE ===")
