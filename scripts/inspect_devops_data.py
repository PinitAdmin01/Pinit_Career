import re

with open('src/lib/data/cloud30DayData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

days = re.findall(r'"day":\s*(\d+)', text)
print(f"cloud30DayData days found: {len(days)}")

with open('src/lib/data/longLessons.ts', 'r', encoding='utf-8') as f:
    ll = f.read()

# Let's see how longLessons imports devops and cloud
devops_matches = [line for line in ll.splitlines() if 'devops' in line.lower()]
print("longLessons.ts devops matches:")
for l in devops_matches:
    print(" ", l)

cloud_matches = [line for line in ll.splitlines() if 'cloud' in line.lower()]
print("longLessons.ts cloud matches:")
for l in cloud_matches:
    print(" ", l)
