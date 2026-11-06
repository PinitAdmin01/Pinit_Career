import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('src/lib/data/coursesData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

courses = re.findall(r"id:\s*'([^']+)'", text)
print("Course IDs found in coursesData.ts:")
for i, c in enumerate(courses):
    print(f"  {i+1}: {c}")
