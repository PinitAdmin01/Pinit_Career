import json, re, glob, os

# 1. Load coursesData.ts
with open('src/lib/data/coursesData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

courses = re.findall(r'id:\s*["\']([^"\']+)["\'].*?title:\s*["\']([^"\']+)["\']', text, re.DOTALL)

# 2. Check each course's LongLesson status via longLessons.ts LONG_LESSON_SOURCES
with open('src/lib/data/longLessons.ts', 'r', encoding='utf-8') as f:
    ll_text = f.read()

# Extract prefix mapping from LONG_LESSON_SOURCES
sources_block = re.search(r'const LONG_LESSON_SOURCES.*?\{([^}]+)\}', ll_text, re.DOTALL)
sources = {}
if sources_block:
    for line in sources_block.group(1).split('\n'):
        m = re.search(r'["\']?([a-zA-Z0-9_-]+)["\']?\s*:\s*([A-Za-z0-9_]+)', line)
        if m:
            sources[m.group(1)] = m.group(2)

print("="*90)
print(f"ANALYSIS OF ALL 51 COURSES IN coursesData.ts AGAINST LONG_LESSON_SOURCES")
print("="*90)

# Check all LongLessons files
data_dir = 'src/lib/data'
files = glob.glob(os.path.join(data_dir, '*LongLessons.ts'))
file_days = {}
for f in files:
    fname = os.path.basename(f)
    if fname == 'longLessons.ts': continue
    with open(f, 'r', encoding='utf-8', errors='ignore') as fp:
        content = fp.read()
    days = re.findall(r'["\']?day["\']?\s*:\s*(\d+)', content)
    day_nums = sorted(list(set(int(d) for d in days if 1 <= int(d) <= 60)))
    file_days[fname] = len(day_nums)

for cid, title in courses:
    # Try to find corresponding file
    matched_file = None
    for fname in file_days:
        clean_cid = cid.replace('course-', '').replace('-', '')
        clean_fname = fname.lower().replace('longlessons.ts', '').replace('web', '').replace('basics', '').replace('python', '')
        if clean_fname in clean_cid or clean_cid in clean_fname:
            matched_file = fname
            break
    print(f"{cid:<32} | {title:<40} | Matched: {str(matched_file):<25}")
