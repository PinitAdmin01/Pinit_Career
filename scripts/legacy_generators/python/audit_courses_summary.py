import os, sys, re

sys.stdout.reconfigure(encoding='utf-8')

files = [f for f in os.listdir('src/lib/data') if f.endswith('LongLessons.ts')]
print(f"Total LongLessons files: {len(files)}")
for f in sorted(files):
    path = os.path.join('src/lib/data', f)
    content = open(path, encoding='utf-8').read()
    days = sorted(set(int(x) for x in re.findall(r'["\']?day["\']?:\s*(\d+)', content)))
    status = "100% COMPLETE" if len(days) == 60 else f"{len(days)}/60 days"
    print(f"{f:35} : {len(days):2} days (min: {min(days) if days else 0}, max: {max(days) if days else 0}) -> {status}")
