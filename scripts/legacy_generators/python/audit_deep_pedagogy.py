import sys
sys.stdout.reconfigure(encoding='utf-8')
import os, glob, re, json
from pathlib import Path

data_dir = Path("src/lib/data")
visuals_dir = Path("src/lib/data/lessonVisuals")

# Load courses from coursesCatalog.ts and coursesData.ts
catalog_text = Path("src/lib/data/coursesCatalog.ts").read_text(encoding="utf-8", errors="ignore")
catalog_courses = re.findall(r'id:\s*[\'\"]([^\'\"]+)[\'\"],\s*title:\s*[\'\"]([^\'\"]+)[\'\"]', catalog_text)

print(f"Total catalog courses: {len(catalog_courses)}")

# Let's map each course to its longlesson file and 30day file
longlesson_files = sorted(list(data_dir.glob("*LongLessons.ts")))
print(f"Total LongLesson files: {len(longlesson_files)}")

audit_report = []

for ll_file in longlesson_files:
    text = ll_file.read_text(encoding="utf-8", errors="ignore")
    # extract prefix
    cp_match = re.search(r'coursePrefix[\'":\s]+([a-zA-Z0-9_-]+)', text)
    prefix = cp_match.group(1) if cp_match else ll_file.stem
    
    # find all days
    days = sorted(list(set(int(x) for x in re.findall(r'(?:\"day\"|day)\s*:\s*(\d+)', text))))
    
    # check visual envelopes
    envelope_dirs = list(visuals_dir.glob(f"*{prefix}*"))
    has_envelopes = len(envelope_dirs) > 0
    envelope_count = len(list(visuals_dir.glob(f"*{prefix}*/*.json"))) if has_envelopes else 0
    
    # Check avatar speech: count say arrays
    say_arrays = len(re.findall(r'\"say\"\s*:\s*\[|say\s*:\s*\[', text))
    
    # Check puzzle presence in data
    puzzle_count = len(re.findall(r'\"puzzle\"|puzzle\s*:', text))
    
    # Check example & output presence
    example_count = len(re.findall(r'\"example\"|example\s*:', text))
    output_count = len(re.findall(r'\"output\"|output\s*:', text))
    
    # Check check questions
    check_count = len(re.findall(r'\"check\"|check\s*:', text))
    
    audit_report.append({
        "file": ll_file.name,
        "prefix": prefix,
        "days_found": len(days),
        "min_day": min(days) if days else 0,
        "max_day": max(days) if days else 0,
        "m1_days": len([d for d in days if 1 <= d <= 30]),
        "m2_days": len([d for d in days if 31 <= d <= 60]),
        "say_arrays": say_arrays,
        "avg_say_per_day": round(say_arrays / max(1, len(days)), 2),
        "puzzle_count": puzzle_count,
        "example_count": example_count,
        "output_count": output_count,
        "check_count": check_count,
        "envelope_count": envelope_count
    })

print(f"{'Filename':<30} | {'Days':<5} | {'M1':<4} | {'M2':<4} | {'Say/Day':<8} | {'Puzzles':<8} | {'Visuals':<8}")
print("-" * 80)
for r in audit_report:
    print(f"{r['file']:<30} | {r['days_found']:<5} | {r['m1_days']:<4} | {r['m2_days']:<4} | {r['avg_say_per_day']:<8} | {r['puzzle_count']:<8} | {r['envelope_count']:<8}")
