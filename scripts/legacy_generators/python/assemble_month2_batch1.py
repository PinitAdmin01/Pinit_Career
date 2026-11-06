# scripts/assemble_month2_batch1.py
import sys
import os
import json
import hashlib

# Ensure utf-8
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

sys.path.insert(0, os.path.abspath("."))

from scripts.make_month2_days31_32 import get_day_31, get_day_32
from scripts.make_month2_day33 import get_day_33
from scripts.make_month2_day34 import get_day_34
from scripts.make_month2_day35 import get_day_35

days_data = [
    get_day_31(),
    get_day_32(),
    get_day_33(),
    get_day_34(),
    get_day_35()
]

# Provide goals and recaps for complete pedagogical excellence
goals = {
    31: "Master dynamic Three-Statement financial modeling with closed-loop balance sheet equilibrium, working capital schedules, and automated retained earnings linkages.",
    32: "Architect institutional debt sculpting schedules, revolving credit sweeps, and circular reference resolution toggles under contraction mapping.",
    33: "Engineer institutional capital budgeting and Discounted Cash Flow valuation suites with WACC optimization and private equity distribution waterfalls.",
    34: "Build enterprise sensitivity engines, two-way data tables, tornado risk rankings, and 1,000-trial correlated Monte Carlo simulation cockpits.",
    35: "Deploy the Milestone 4 ApexValuation Three-Statement Financial Modeling & Monte Carlo DCF Platform certified with a cryptographic SOX 404 audit seal."
}

recaps = {
    31: "Welcome to Month 2 of Excel & Data Analysis Fundamentals. Having mastered Course 21 Month 1, we now ascend into advanced Wall Street corporate financial engineering.",
    32: "Yesterday, you mastered Three-Statement equilibrium and working capital mechanics. Today, we conquer debt sculpting and circular reference resolution.",
    33: "Yesterday, you tamed circular debt calculations with iterative contraction mapping. Today, we step into institutional DCF valuation and private equity waterfalls.",
    34: "Yesterday, you engineered DCF models and hurdle waterfalls. Today, we stress-test assumptions using sensitivity tables and Monte Carlo risk simulations.",
    35: "Yesterday, you built Monte Carlo risk engines and tornado charts. Today, we unite all disciplines into our Milestone 4 Capstone: ApexValuation Enterprise Suite."
}

# Domain bar metrics for each day
visual_metrics = {
    31: ["P&L Net Income", "Operating Cash Flow", "CapEx & PP&E", "Balance Sheet Balance"],
    32: ["Senior Term Debt", "Revolver Utilization", "DSCR Coverage", "Circularity Invariant"],
    33: ["Unlevered FCF", "WACC Discounting", "Terminal Value", "PE Equity Waterfall"],
    34: ["Two-Way Data Table", "Tornado Sensitivity", "Scenario Switch", "Monte Carlo VaR"],
    35: ["Three-Statement Core", "LBO Capital Structure", "Macro Stress Test", "Boardroom Valuation"]
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

# 2. Append Days 31-35 into src/lib/data/excelVizLongLessons.ts
ts_file_path = os.path.join("src", "lib", "data", "excelVizLongLessons.ts")
with open(ts_file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Check if Day 31 is already added
if '"day": 31' in content or 'day: 31' in content:
    print("Days 31-35 already detected in excelVizLongLessons.ts! Skipping insertion.")
else:
    # Find the closing "];"
    closing_idx = content.rfind("];")
    if closing_idx == -1:
        raise RuntimeError("Could not find closing '];' in excelVizLongLessons.ts")
    
    # Format Days 31-35 as JSON objects
    new_days_snippets = []
    for day_obj in days_data:
        json_str = json.dumps(day_obj, indent=2, ensure_ascii=False)
        new_days_snippets.append(json_str)
    
    combined_new_code = ",\n" + ",\n".join(new_days_snippets) + "\n];\n"
    new_content = content[:closing_idx].rstrip() + combined_new_code
    
    with open(ts_file_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"Successfully appended Days 31-35 to {ts_file_path}!")
