import re

with open('src/lib/data/aiWebLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

days = [int(d) for d in re.findall(r'"day":\s*(\d+)', text)]
print(f"Total days found: {len(days)}")
print(f"Min day: {min(days) if days else None}, Max day: {max(days) if days else None}")
print(f"Days: {days}")

prefix_match = re.search(r'"coursePrefix":\s*"([^"]+)"', text)
if prefix_match:
    print(f"Course prefix: {prefix_match.group(1)}")
else:
    # check without quotes
    prefix_match2 = re.search(r'coursePrefix:\s*[\'"]([^\'"]+)[\'"]', text)
    if prefix_match2:
        print(f"Course prefix: {prefix_match2.group(1)}")
    else:
        print("No coursePrefix field found directly in lessons. Checking coursesData.ts...")

# Check coursesData.ts for course 12 or ai-web prefix
with open('src/lib/data/coursesData.ts', 'r', encoding='utf-8') as f:
    c_text = f.read()

for match in re.finditer(r'id:\s*[\'"]([^\'"]+)[\'"][\s\S]*?AI_WEB_LONG_LESSONS', c_text):
    print("Found in coursesData.ts:", match.group(0)[:200])

for match in re.finditer(r'prefix:\s*[\'"]([^\'"]+)[\'"]', c_text):
    pass
