# scripts/topup_day23_part3.py
import json

with open("scripts/iot_net_day23.json", "r", encoding="utf-8") as f:
    d = json.load(f)

extra = (
    "Therefore, meticulous calculation of component self-resonance and tolerance boundaries is an essential discipline, "
    "empowering RF systems engineers to achieve repeatable, high-yield impedance transformations across thousands of production wireless IoT boards."
)

d["parts"][2]["say"].append(extra)

with open("scripts/iot_net_day23.json", "w", encoding="utf-8") as f:
    json.dump(d, f, indent=2)

print("Topped up Part 3 of Day 23.")
