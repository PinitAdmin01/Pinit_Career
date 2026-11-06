import json

all_days = []
for day in [16, 17, 18, 19, 20]:
    with open(f"scripts/iot_sec_day{day}.json", "r", encoding="utf-8") as f:
        all_days.append(json.load(f))

with open("scripts/block4_iot_sec_all_days.json", "w", encoding="utf-8") as f:
    json.dump(all_days, f, indent=2)

print("Saved scripts/block4_iot_sec_all_days.json successfully!")
