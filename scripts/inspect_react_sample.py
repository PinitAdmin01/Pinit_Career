with open('C:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/reactLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
days = re.findall(r'\{\s*["\']?day["\']?\s*:\s*(\d+).*?["\']?title["\']?\s*:\s*["\']([^"\']+)["\']', text)
print(f"Total days found: {len(days)}")
# Check a sample day 31
sample_day31 = text[text.find('"day": 31'):text.find('"day": 32')]
print(f"Day 31 length: {len(sample_day31)}")
num_questions = sample_day31.count('"question":')
print(f"Day 31 questions count: {num_questions}")
num_say = sample_day31.count('"say":')
print(f"Day 31 say arrays count: {num_say}")
