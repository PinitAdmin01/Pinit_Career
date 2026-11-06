# scripts/audit_cloud_devops.py
import re

def audit_file(filepath, name):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            text = f.read()
        days = sorted(list(set([int(m) for m in re.findall(r'["\']?day["\']?:\s*(\d+)', text)])))
        print(f"=== {name} ({filepath}) ===")
        print(f"Total days: {len(days)}")
        print(f"Days: {days}")
        if days:
            print(f"Range: {min(days)} to {max(days)}")
    except Exception as e:
        print(f"Error auditing {filepath}: {e}")

audit_file("src/lib/data/cloudWebLongLessons.ts", "Cloud Web Long Lessons")
audit_file("src/lib/data/cloud30DayData.ts", "Cloud 30 Day Data")
audit_file("src/lib/data/devopsWebLongLessons.ts", "Devops Web Long Lessons")
audit_file("src/lib/data/devops30DayData.ts", "Devops 30 Day Data")
