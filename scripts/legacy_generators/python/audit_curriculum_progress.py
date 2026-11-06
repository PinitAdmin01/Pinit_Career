# scripts/audit_curriculum_progress.py
import os
import re
import sys
import glob

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Inspect all LongLessons files
ll_files = glob.glob('src/lib/data/*LongLessons.ts')

prefix_to_file = {}
prefix_to_days = {}

for f in ll_files:
    with open(f, 'r', encoding='utf-8') as fh:
        content = fh.read()
    prefixes = re.findall(r'coursePrefix:\s*["\']([^"\']+)["\']', content)
    unique_prefixes = set(prefixes)
    days = re.findall(r'["\']?day["\']?:\s*(\d+)', content)
    unique_days = sorted(list(set(int(d) for d in days)))
    for p in unique_prefixes:
        prefix_to_file[p] = f
        prefix_to_days[p] = unique_days

# Also check lessonVisuals directories
visuals_dirs = glob.glob('src/lib/data/lessonVisuals/*')
visuals_counts = {}
for vd in visuals_dirs:
    if os.path.isdir(vd):
        p = os.path.basename(vd)
        files = [f for f in os.listdir(vd) if f.endswith('.json')]
        visuals_counts[p] = len(files)

print("=" * 75)
print("AUDIT OF ALL DETECTED LONG LESSON COURSE PREFIXES IN REPO:")
print("=" * 75)
total_days = 0
for p in sorted(prefix_to_days.keys()):
    days = prefix_to_days[p]
    v_count = visuals_counts.get(p, 0)
    total_days += len(days)
    print(f"Prefix: {p:<15} | Days: {len(days):<3} (Max Day: {max(days) if days else 0:<2}) | Visuals: {v_count:<3} | File: {os.path.basename(prefix_to_file[p])}")

print("=" * 75)
print(f"Total Unique LongLesson Days Implemented: {total_days}")

# Check agent_tasks.csv for curriculum tasks
csv_path = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
if os.path.exists(csv_path):
    with open(csv_path, 'r', encoding='utf-8', errors='ignore') as f:
        tasks = f.readlines()
    print(f"\nTotal Rows in agent_tasks.csv: {len(tasks)}")
    completed_tasks = sum(1 for t in tasks if 'COMPLETED' in t or 'Completed' in t)
    in_progress = sum(1 for t in tasks if 'IN_PROGRESS' in t or 'In Progress' in t)
    pending = sum(1 for t in tasks if 'PENDING' in t or 'Pending' in t)
    print(f"Completed Tasks: {completed_tasks}")
    print(f"In Progress Tasks: {in_progress}")
    print(f"Pending Tasks: {pending}")

# Check 500P SRS PDF / Markdown to see total target courses and days
md_path = "docs/visuals/PINIT_36_COURSES_MASTERCLASS_SRS_500P.md"
if os.path.exists(md_path):
    with open(md_path, 'r', encoding='utf-8') as f:
        md_text = f.read()
    print(f"\nMaster SRS 500P.md size: {len(md_text)} bytes")
