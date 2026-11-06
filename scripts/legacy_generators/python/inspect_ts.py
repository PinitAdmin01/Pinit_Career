with open('src/lib/data/designWebLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
print("Length of designWebLongLessons.ts:", len(text))
print("Occurrences of 'Day 50':", text.count("Day 50"))
print("Occurrences of 'day: 50':", text.count("day: 50"))
print("Occurrences of 'day:':", text.count("day:"))

# Find all occurrences of day patterns
days = re.findall(r'day:\s*(\d+)', text)
print("Unique days found with 'day: N':", sorted(set(int(x) for x in days)))

# Check end of file
print("Last 1000 characters of file:")
print(text[-1000:])
