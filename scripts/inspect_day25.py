import json

with open("scripts/block5_iot_sec_all_days.json", "r", encoding="utf-8") as f:
    days = json.load(f)

d25 = [d for d in days if d["day"] == 25][0]
print("Day 25 title:", d25["title"])
print("Day 25 Part 5 title:", d25["parts"][4]["title"])
print("Day 25 Part 5 code starts with:", d25["parts"][4]["code"][:60])
print("Contains 'ApexIndustrialDeviceSecurityCore':", "ApexIndustrialDeviceSecurityCore" in d25["parts"][4]["code"])
