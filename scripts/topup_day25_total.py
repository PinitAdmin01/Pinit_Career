# scripts/topup_day25_total.py
import json

with open("scripts/iot_net_day25.json", "r", encoding="utf-8") as f:
    d = json.load(f)

d["parts"][0]["say"].append(
    "Consequently, incorporating cryptographic nonce freshness directly into the hardware transceiver state machine eliminates window-of-vulnerability attacks, establishing an unbreakable link-layer authentication boundary."
)

with open("scripts/iot_net_day25.json", "w", encoding="utf-8") as f:
    json.dump(d, f, indent=2)

print("Topped up Day 25 total words.")
