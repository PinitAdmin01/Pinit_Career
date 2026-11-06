import sys, re

sys.stdout.reconfigure(encoding='utf-8')
with open('src/lib/data/fullstackJsLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

d1_idx = text.find('day: 1')
print("Day 1 section:")
print(text[d1_idx-50:d1_idx+400])

d30_idx = text.rfind('"day": 30')
print("\nDay 30 section:")
print(text[d30_idx-50:d30_idx+400])
