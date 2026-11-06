# scripts/check_day46_keys.py
text = open("src/lib/data/distributedWebLongLessons.ts", "r", encoding="utf-8").read()
idx = text.find('"day": 46')
part_idx = text.find('"parts": [', idx)
print(text[part_idx:part_idx+400])
