# scripts/check_day51_keys.py
import re

text = open("src/lib/data/distributedWebLongLessons.ts", "r", encoding="utf-8").read()
idx = text.find('"day": 51')
part_idx = text.find('"parts": [', idx)
print(text[part_idx:part_idx+400])
