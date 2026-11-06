import glob, os, re

files = glob.glob('src/lib/data/*LongLessons.ts')
total_days = 0
courses = {}
for f in sorted(files):
    with open(f, 'r', encoding='utf-8', errors='ignore') as fp:
        txt = fp.read()
    matches = [int(m) for m in re.findall(r'[\'"]?day[\'"]?\s*:\s*(\d+)', txt)]
    unique_days = len(set(matches))
    if unique_days > 0:
        courses[os.path.basename(f)] = unique_days
        total_days += unique_days

print("--- CURRENT LESSON DAYS IN CODEBASE ---")
for k, v in courses.items():
    print(f"{k}: {v} days")

print(f"\nTotal Implemented LongLesson Days across all courses: {total_days}")

# Master PDF/Bible target: 36 courses.
# How many total days across all courses in the Master 36-course curriculum?
# Standard curriculum is 36 courses x 60 days (or 30/60 days per course).
# Let's inspect docs/visuals/PINIT_36_COURSES_MASTERCLASS_SRS_500P.md or check what total scope is.
