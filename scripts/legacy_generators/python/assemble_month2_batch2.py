# scripts/assemble_month2_batch2.py
import sys
import os
import json
import hashlib

# Ensure utf-8
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

sys.path.insert(0, os.path.abspath("."))

from scripts.make_month2_days36_37 import get_day_36, get_day_37
from scripts.make_month2_days38_39_40 import get_day_38, get_day_39, get_day_40

days_data = [
    get_day_36(),
    get_day_37(),
    get_day_38(),
    get_day_39(),
    get_day_40()
]

# Provide goals and recaps for complete pedagogical excellence
goals = {
    36: "Master Power Query M language functional architecture, let-in evaluation graphs, parametric custom functions, and 100% Query Folding pushdown.",
    37: "Architect Kimball Dimensional Star Schemas, VertiPaq dictionary bit-packing, surrogate key invariants, and role-playing relationship traversal.",
    38: "Master Data Analysis Expressions (DAX) evaluation contexts, explicit measures vs calculated columns, CALCULATE, and iterative X-functions.",
    39: "Engineer enterprise Time Intelligence in DAX with contiguous calendar dimensions, TOTALYTD, SAMEPERIODLASTYEAR, and rolling moving averages.",
    40: "Deploy the Milestone 5 ApexModel Enterprise Star Schema & High-Performance DAX Platform certified with a cryptographic SOX 404 audit seal."
}

recaps = {
    36: "Yesterday, you mastered Three-Statement modeling and Monte Carlo DCF in Milestone 4. Today, we step into the advanced data modeling engine: Power Query M internals.",
    37: "Yesterday, you mastered Power Query M language and query folding. Today, we conquer Dimensional Modeling, Star Schemas, and the VertiPaq columnar engine.",
    38: "Yesterday, you constructed Kimball Star Schemas and optimized VertiPaq memory. Today, we master the formula engine: DAX evaluation contexts and CALCULATE.",
    39: "Yesterday, you conquered DAX evaluation contexts and CALCULATE. Today, we unlock dynamic Time Intelligence across historical fiscal periods.",
    40: "Yesterday, you mastered DAX Time Intelligence and rolling run rates. Today, we unite all disciplines into our Milestone 5 Capstone: ApexModel Enterprise Suite."
}

# Domain bar metrics for each day
visual_metrics = {
    36: ["Mashup Engine DAG", "Custom M Functions", "Relational Pushdown", "Folding Audit Seal"],
    37: ["Kimball Star Schema", "VertiPaq Bit-Packing", "Surrogate Key Purity", "Active vs Inactive Path"],
    38: ["Filter Context", "Zero-RAM Measures", "CALCULATE Engine", "Iterative SUMX Scan"],
    39: ["Contiguous Calendar", "TOTALYTD Expansion", "YoY Period Growth", "Trailing Moving Avg"],
    40: ["Multi-Fact Star Core", "100% Query Folding", "11x VertiPaq Ratio", "Executive Scorecard"]
}

# 1. Generate visual JSON files
visuals_dir = os.path.join("src", "lib", "data", "lessonVisuals", "excel_viz")
os.makedirs(visuals_dir, exist_ok=True)

for day_obj in days_data:
    day_num = day_obj["day"]
    day_obj["goal"] = goals[day_num]
    day_obj["minutes"] = 30
    day_obj["recap"] = recaps[day_num]
    
    day_visual_entries = []
    labels = visual_metrics[day_num]
    
    for p_idx, part in enumerate(day_obj["parts"]):
        # Exact sha256 hash of the exact code string
        code_str = part["code"]
        code_hash = hashlib.sha256(code_str.encode('utf-8')).hexdigest()
        
        entry = {
            "partTitle": part["title"],
            "codeHash": code_hash,
            "spec": {
                "template": "bars",
                "title": f"{part['title']} — {day_obj['title']}",
                "steps": [
                    {
                        "at": "intro",
                        "caption": f"Step 1: Ledger ingestion and statutory framework for {part['title']}",
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
                        "caption": f"Step 2: Processing recursive linkages and calculations for {part['title']}",
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
                        "caption": f"Step 3: Real-world stress testing and scenarios for {part['title']}",
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
                        "caption": f"Step 4: Active experimentation and parameter tuning for {part['title']}",
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

# 2. Append Days 36-40 into src/lib/data/excelVizLongLessons.ts
ts_file_path = os.path.join("src", "lib", "data", "excelVizLongLessons.ts")
with open(ts_file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Check if Day 36 is already added
if '"day": 36' in content or 'day: 36' in content:
    print("Days 36-40 already detected in excelVizLongLessons.ts! Skipping insertion.")
else:
    # Find the closing "];"
    closing_idx = content.rfind("];")
    if closing_idx == -1:
        raise RuntimeError("Could not find closing '];' in excelVizLongLessons.ts")
    
    # Format Days 36-40 as JSON objects
    new_days_snippets = []
    for day_obj in days_data:
        json_str = json.dumps(day_obj, indent=2, ensure_ascii=False)
        new_days_snippets.append(json_str)
    
    combined_new_code = ",\n" + ",\n".join(new_days_snippets) + "\n];\n"
    new_content = content[:closing_idx].rstrip() + combined_new_code
    
    with open(ts_file_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"Successfully appended Days 36-40 to {ts_file_path}!")
