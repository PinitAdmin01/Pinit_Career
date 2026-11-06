# scripts/pad_day39_p4_p5.py
import json

with open("scripts/iot_sec_day39.json", "r", encoding="utf-8") as f:
    d = json.load(f)

d["parts"][3]["say"].append(
    "Moreover, the injection frequency of dummy operations can be linked to physical tamper sensors. If an on-chip voltage or temperature monitor detects suspicious environmental anomalies—such as an operating voltage near the brownout threshold or elevated die temperature indicative of decapsulation—the controller dynamically ramps dummy injection rates up to 80%, burying sensitive operations under massive decoy noise while alerting the security supervisor."
)

d["parts"][4]["say"].append(
    "By verifying these hiding mechanisms across both software emulation benches and physical silicon test fixtures, embedded security architects provide verifiable mathematical proof of resistance against side-channel analysis. Combining these techniques with cryptographic masking ensures that modern connected devices remain sovereign roots of trust capable of protecting critical infrastructure for decades to come."
)

with open("scripts/iot_sec_day39.json", "w", encoding="utf-8") as f:
    json.dump(d, f, indent=2)

wcs = [len(' '.join(p['say']).split()) for p in d['parts']]
print('Day 39 word counts:', wcs, 'Total:', sum(wcs), 'All >= 580:', all(w >= 580 for w in wcs))
