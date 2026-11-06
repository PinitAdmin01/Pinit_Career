import sys
sys.stdout.reconfigure(encoding='utf-8')
import json
from collections import Counter
from pathlib import Path

data = json.loads(Path("scripts/audit_findings_complete.json").read_text(encoding="utf-8"))

type_counts = Counter()
severity_counts = Counter()
course_issue_counts = Counter()

for prefix, info in data.items():
    for df in info["day_findings"]:
        for issue in df["issues"]:
            type_counts[issue["type"]] += 1
            severity_counts[issue["severity"]] += 1
            course_issue_counts[prefix] += 1

print("=== ISSUES BY TYPE ===")
for t, c in type_counts.most_common():
    print(f"  {t:<45}: {c}")

print("\n=== ISSUES BY SEVERITY ===")
for s, c in severity_counts.most_common():
    print(f"  {s:<15}: {c}")

print("\n=== TOP COURSES BY ISSUE COUNT ===")
for prefix, c in course_issue_counts.most_common(15):
    print(f"  {prefix:<25}: {c} issues across {data[prefix]['days_with_issues']} days")
