# scripts/topup_day49_p5.py
import json

with open("scripts/bcom_law_day49.json", "r", encoding="utf-8") as f:
    d = json.load(f)

extra_p5 = [
    "From a corporate leadership and board fiduciary perspective, multi-entity restructurings demand acute awareness of director liability under Section 66 of the IBC and international equivalents such as Section 214 of the UK Insolvency Act (wrongful trading). When an enterprise group faces financial distress, directors of subsidiary companies face intense conflicting duties: their primary fiduciary duty shifts from maximizing shareholder value to preserving assets for the collective benefit of creditors. Directors who blindly approve upstream guarantees or asset transfers to bail out a struggling parent entity without adequate consideration face personal liability and disqualification. By adhering to formal cross-border protocols and seeking joint judicial sanction, directors insulate themselves from wrongful trading allegations and safeguard their personal governance standing."
]

d["parts"][4]["say"].extend(extra_p5)

with open("scripts/bcom_law_day49.json", "w", encoding="utf-8") as f:
    json.dump(d, f, indent=2)

print("Part 5 words:", sum(len(s.split()) for s in d["parts"][4]["say"]))
print("Total words:", sum(sum(len(s.split()) for s in p["say"]) for p in d["parts"]))
