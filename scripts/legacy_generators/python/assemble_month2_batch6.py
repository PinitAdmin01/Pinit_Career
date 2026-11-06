# scripts/assemble_month2_batch6.py
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

from scripts.make_month2_days56_57 import day56_lesson, day57_lesson
from scripts.make_month2_days58_59_60 import day58_lesson, day59_lesson, day60_lesson

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
    day56_lesson,
    day57_lesson,
    day58_lesson,
    day59_lesson,
    day60_lesson
]

# Provide goals and recaps for complete pedagogical excellence
recaps = {
    56: "Yesterday, you established enterprise spreadsheet security, AES-256 encryption, and SOX 404 audit logging. Today, we inaugurate Stage 12: Forensic Auditing & Catastrophes with Historic Catastrophe Post-Mortem 1: The $6.2 Billion JPMorgan 'London Whale' VaR formula division disaster.",
    57: "Yesterday, you forensically reconstructed the JPMorgan London Whale VaR division flaw and manual clipboard copying. Today, we investigate Historic Catastrophe Post-Mortem 2: The Reinhart-Rogoff $200B Austerity Omission and the catastrophic `=AVERAGE(A1:A15)` range truncation error.",
    58: "Yesterday, you analyzed the Reinhart-Rogoff austerity omission and structured Excel table dynamic references. Today, we deconstruct Historic Catastrophe Post-Mortem 3: The Fannie Mae $1.3B restatement and the MI5 wiretap telephone leading-zero truncation caused by IEEE 754 precision limits.",
    59: "Yesterday, you solved IEEE 754 precision constraints, telephony truncation, and type coercion. Today, we step into the executive suite with the Principal Financial Systems Architect Modernization RFC: Transitioning Monolithic Workbooks to Governed Lakehouses.",
    60: "Yesterday, you authored the $15M Modernization RFC and defended the coexistence lakehouse architecture before the EARB. Today is the ultimate summit of Course 21: Capstone 2: ApexEnterpriseAnalytics Full-Scale Financial Engineering & Enterprise Data Modeling Master Capstone Viva Gate."
}

# Domain bar metrics for each day
visual_metrics = {
    56: ["Synthetic Portfolio", "VaR Division Flaw", "Manual Clipboard", "SR 11-7 Audit Seal"],
    57: ["Macroeconomic Base", "Range Truncation", "Country Weighting", "Structured Table"],
    58: ["IEEE 754 Float Bound", "Telephony Zero Loss", "Apostrophe Guard", "Power Query Schema"],
    59: ["Shadow IT Sprawl", "Modernization ROI", "Lakehouse Coexistence", "EARB Board Approval"],
    60: ["3-Statement Core", "Star Schema DAX", "Chaos Stress Defense", "Apex Master Seal"]
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
                        "caption": f"Step 1: Architectural baseline configuration and parameter ingestion for {part['title']}",
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
                        "caption": f"Step 2: Processing pipeline execution and intermediate simulation for {part['title']}",
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
                        "caption": f"Step 3: Stress testing, boundary verification, and anomaly detection for {part['title']}",
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
                        "caption": f"Step 4: Sovereign institutional governance and production certification for {part['title']}",
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

# 3. Append Days 56-60 into src/lib/data/excelVizLongLessons.ts
ts_file_path = os.path.join("src", "lib", "data", "excelVizLongLessons.ts")
with open(ts_file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Check if Day 56 is already added
if '"day": 56' in content or 'day: 56' in content:
    print("Days 56-60 already detected in excelVizLongLessons.ts! Skipping insertion.")
else:
    # Find the closing "];"
    closing_idx = content.rfind("];")
    if closing_idx == -1:
        raise RuntimeError("Could not find closing '];' in excelVizLongLessons.ts")
    
    # Format Days 56-60 as JSON objects
    new_days_snippets = []
    for day_obj in days_data:
        json_str = json.dumps(day_obj, indent=2, ensure_ascii=False)
        new_days_snippets.append(json_str)
    
    combined_new_code = ",\n" + ",\n".join(new_days_snippets) + "\n];\n"
    new_content = content[:closing_idx].rstrip() + combined_new_code
    
    with open(ts_file_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"Successfully appended Days 56-60 to {ts_file_path}!")

print("\n=== BATCH 6 ASSEMBLY COMPLETE ===")
