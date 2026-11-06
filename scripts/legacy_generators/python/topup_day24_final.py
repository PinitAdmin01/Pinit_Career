# scripts/topup_day24_final.py
import json

with open("scripts/iot_net_day24.json", "r", encoding="utf-8") as f:
    d = json.load(f)

d["parts"][1]["say"].append(
    "By maintaining rigorous event isolation and priority queuing, the asynchronous URC dispatcher guarantees that no network notification is ever dropped or delayed during live operations."
)

d["parts"][3]["say"].append(
    "In addition, monitoring socket transmission return codes and buffer occupancy flags ensures that socket backpressure is handled smoothly, "
    "preventing buffer overflow when transmitting high-frequency industrial telemetry over bandwidth-constrained cellular links."
)

with open("scripts/iot_net_day24.json", "w", encoding="utf-8") as f:
    json.dump(d, f, indent=2)

print("Final top-up for Day 24 completed.")
