import json

with open('src/lib/data/javaBasicsLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's extract day 1 object
# It starts around line 4
import re

day1_match = re.search(r'\{\s*"day":\s*1,\s*"title":\s*"(.*?)",\s*"goal":\s*"(.*?)",\s*"minutes":\s*(\d+),\s*"recap":\s*"(.*?)",\s*"parts":\s*(\[.*?\])\s*,\s*"day":\s*2', text, re.DOTALL)
if day1_match:
    print("Found day 1!")
    print("Title:", day1_match.group(1))
    print("Goal:", day1_match.group(2))
else:
    print("Day 1 match not found with regex, let's look closer")
