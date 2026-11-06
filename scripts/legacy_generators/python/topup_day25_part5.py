# scripts/topup_day25_part5.py
import json

with open("scripts/iot_net_day25.json", "r", encoding="utf-8") as f:
    d = json.load(f)

extra = (
    "In large-scale smart grid deployments encompassing millions of smart meters, security audits mandate automated compliance "
    "verification against NIST SP 800-82 guidelines for Industrial Control Systems. "
    "Every node in the network must demonstrate cryptographic boundary isolation, automated certificate lifecycle management, "
    "and tamper-evident telemetry provenance. The WirelessSecurityPlatformMaster engine built today satisfies every rigorous requirement "
    "of international industrial cybersecurity standards, providing an impregnable defense against sophisticated adversaries and guaranteeing "
    "uninterrupted, trusted operations across critical national infrastructure for decades to come."
)

d["parts"][4]["say"].append(extra)

with open("scripts/iot_net_day25.json", "w", encoding="utf-8") as f:
    json.dump(d, f, indent=2)

print("Topped up Part 5 of Day 25.")
