# scripts/boost_day30.py
import json

with open("scripts/iot_net_day30.json", "r", encoding="utf-8") as f:
    d = json.load(f)

p2_boost = (
    "In addition to cryptographic message verification, all hardware secure elements enforce physical active shield protection. "
    "If an invasive physical attack breaches the silicon passivation layer, the internal active mesh detects the capacitance anomaly and immediately executes hardware zeroization, "
    "erasing all Root of Trust private keys within nanoseconds before any cryptographic material can be compromised."
)

p3_boost = (
    "Furthermore, RPL local repair integrates cross-layer feedback from the IEEE 802.15.4 MAC layer. "
    "When a unicast transmission fails consecutive MAC-level retransmissions, the MAC layer notifies the RPL routing engine immediately, "
    "allowing the node to switch to a healthy backup parent without waiting for higher-layer transport timeouts or application retries."
)

p4_boost = (
    "Modern energy harvesting controllers also incorporate hardware supercapacitor balancing circuits. "
    "Because high-voltage supercapacitors consist of two series-connected cells to achieve 5.0V or 5.4V ratings, "
    "active balancing ensures that cell voltage differentials never exceed individual breakdown limits, guaranteeing reliable multi-decade lifespan without catastrophic dielectric puncture."
)

p5_boost = (
    "As we conclude this masterclass, remember that the true measure of an engineering system is its reliability under adverse conditions. "
    "By mastering the synergy between heterogeneous radio fabrics, zero-trust cryptographic defense, autonomous self-healing, and perpetual energy harvesting, "
    "you are fully certified and equipped to lead the future of connected infrastructure worldwide."
)

d["parts"][1]["say"].append(p2_boost)
d["parts"][2]["say"].append(p3_boost)
d["parts"][3]["say"].append(p4_boost)
d["parts"][4]["say"].append(p5_boost)

with open("scripts/iot_net_day30.json", "w", encoding="utf-8") as f:
    json.dump(d, f, indent=2)

print("Day 30 boost applied.")
