import json

block7_days = []
for d in range(31, 36):
    with open(f"scripts/iot_net_day{d}.json", "r", encoding="utf-8") as f:
        data = json.load(f)
        block7_days.append(data)

with open("scripts/block7_iot_net_all_days.json", "w", encoding="utf-8") as f:
    json.dump(block7_days, f, indent=2)

print(f"Assembled {len(block7_days)} days into scripts/block7_iot_net_all_days.json.")
