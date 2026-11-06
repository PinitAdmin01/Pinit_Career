import json

with open('scripts/block6_iot_sec_all_days.json', 'r', encoding='utf-8') as f:
    days = json.load(f)

print("Parsed block6_iot_sec_all_days.json successfully!")
for d in days:
    wcs = [sum(len(s.split()) for s in p["say"]) for p in d["parts"]]
    print(f"Day {d['day']}: {sum(wcs)} total words, part words: {wcs}")
