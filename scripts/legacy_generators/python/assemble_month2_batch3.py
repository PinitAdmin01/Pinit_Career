# scripts/assemble_month2_batch3.py
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

from scripts.make_month2_days41_42 import day41_lesson, day42_lesson
from scripts.make_month2_days43_44_45 import day43_lesson, day44_lesson, day45_lesson

def run_py(code_str: str) -> str:
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        exec(code_str, {})
    return buf.getvalue()

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
    day41_lesson,
    day42_lesson,
    day43_lesson,
    day44_lesson,
    day45_lesson
]

# Provide goals and recaps for complete pedagogical excellence
recaps = {
    41: "Yesterday, you achieved Milestone 5 by deploying the production ApexModel Star Schema and enterprise DAX suite. Today, we advance into Module 6: Exploratory Data Analysis, mathematical distribution moments, and Tukey outlier filters.",
    42: "Yesterday, you mastered EDA, Skewness, Kurtosis, and Tukey's IQR outlier fences. Today, we move into Inferential Statistics, Hypothesis Testing, Student's T-Tests, and Single-Factor ANOVA.",
    43: "Yesterday, you executed hypothesis tests and ANOVA with Bonferroni corrections. Today, we master Bivariate Correlation, Ordinary Least Squares (OLS) Linear Regression, and the LINE econometrics assumptions.",
    44: "Yesterday, you fit OLS regression models and diagnosed residual heteroscedasticity. Today, we conquer Time-Series Forecasting, Classical Seasonality Decomposition, and Holt-Winters Exponential Triple Smoothing (FORECAST.ETS).",
    45: "Yesterday, you mastered time-series decomposition, ETS forecasting, and confidence interval cones. Today, we synthesize all econometric capabilities into our Milestone 6 Capstone: ApexAnalytics Statistical Testing & Forecasting Platform."
}

# Domain bar metrics for each day
visual_metrics = {
    41: ["Moment Profiler", "IQR Tukey Filter", "Shape Diagnostics", "Multi-Cohort Audit"],
    42: ["Null Hypothesis", "Welch's T-Test", "ANOVA Variance", "Bonferroni FWER"],
    43: ["Pearson Covariance", "OLS Closed-Form", "LINE Residuals", "R² Goodness-of-Fit"],
    44: ["Classical Decomp", "Holt-Winters ETS", "MAPE / RMSE Error", "95% Prediction Cone"],
    45: ["4-Pillar Matrix", "Multi-Arm A/B Suite", "Validated OLS Engine", "Executive Forecast"]
}

# 1. Clean code and compute deterministic execution output
for day_obj in days_data:
    day_num = day_obj["day"]
    day_obj["minutes"] = 30
    day_obj["recap"] = recaps[day_num]

    for part in day_obj["parts"]:
        part["code"] = clean_code(part["code"])
        part["output"] = run_py(part["code"])

# 2. Generate visual JSON files
visuals_dir = os.path.join("src", "lib", "data", "lessonVisuals", "excel_viz")
os.makedirs(visuals_dir, exist_ok=True)

for day_obj in days_data:
    day_num = day_obj["day"]
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
                        "caption": f"Step 1: Ingestion and distributional baseline setup for {part['title']}",
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
                        "caption": f"Step 2: Algorithmic calculation and statistical analysis for {part['title']}",
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
                        "caption": f"Step 3: Stress testing and statistical validation for {part['title']}",
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
                        "caption": f"Step 4: Econometric gating and production verification for {part['title']}",
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

# 3. Append Days 41-45 into src/lib/data/excelVizLongLessons.ts
ts_file_path = os.path.join("src", "lib", "data", "excelVizLongLessons.ts")
with open(ts_file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Check if Day 41 is already added
if '"day": 41' in content or 'day: 41' in content:
    print("Days 41-45 already detected in excelVizLongLessons.ts! Skipping insertion.")
else:
    # Find the closing "];"
    closing_idx = content.rfind("];")
    if closing_idx == -1:
        raise RuntimeError("Could not find closing '];' in excelVizLongLessons.ts")
    
    # Format Days 41-45 as JSON objects
    new_days_snippets = []
    for day_obj in days_data:
        json_str = json.dumps(day_obj, indent=2, ensure_ascii=False)
        new_days_snippets.append(json_str)
    
    combined_new_code = ",\n" + ",\n".join(new_days_snippets) + "\n];\n"
    new_content = content[:closing_idx].rstrip() + combined_new_code
    
    with open(ts_file_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"Successfully appended Days 41-45 to {ts_file_path}!")
