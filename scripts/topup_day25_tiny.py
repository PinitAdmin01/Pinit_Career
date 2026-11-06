# scripts/topup_day25_tiny.py
import json

with open("scripts/iot_net_day25.json", "r", encoding="utf-8") as f:
    d = json.load(f)

d["parts"][4]["say"].append(
    "This uncompromising engineering rigor forms the bedrock upon which the next generation of safe, resilient industrial IoT systems will be built."
)

with open("scripts/iot_net_day25.json", "w", encoding="utf-8") as f:
    json.dump(d, f, indent=2)

print("Tiny topup applied to Day 25.")
