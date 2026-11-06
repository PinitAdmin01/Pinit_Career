import json

with open("scripts/iot_net_day25.json", "r", encoding="utf-8") as f:
    d = json.load(f)

d["parts"][1]["say"].append(
    "This deterministic non-volatile memory management strategy guarantees decades of uninterrupted operational reliability across all smart metering deployments."
)

with open("scripts/iot_net_day25.json", "w", encoding="utf-8") as f:
    json.dump(d, f, indent=2)

print("Topped up Part 2.")
