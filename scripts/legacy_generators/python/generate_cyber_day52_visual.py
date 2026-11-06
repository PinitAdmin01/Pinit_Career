# scripts/generate_cyber_day52_visual.py
import json
import hashlib
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from cyber_day52_data import DAY_52_DATA as day52_data

entries = []

captions = [
    [
        "Architectural overview illustrates proactive threat hunting tracking adversary tradecraft across the pyramid of pain.",
        "Deep inspection evaluates adversary disruption cost associated with detecting tactics, techniques, and procedures.",
        "Comparative analysis demonstrates high-impact behavioral tracking over fragile static indicator lookups.",
        "Verification confirms tactical indicator classification, maximum adversary disruption, and proactive hunt initiation."
    ],
    [
        "Architectural overview displays enterprise detection mapping across the adversary tactics and techniques matrix.",
        "Deep inspection evaluates coverage percentages across core tactical stages to isolate visibility blind spots.",
        "Comparative analysis demonstrates comprehensive kill-chain visibility over fragmented, unaligned monitoring.",
        "Verification confirms complete tactical coverage, blind spot remediation, and verified adversary tracking."
    ],
    [
        "Architectural overview illustrates universal detection engineering utilizing standardized vendor-agnostic schemas.",
        "Deep inspection parses universal rule criteria and transpiles detection logic into native operational query languages.",
        "Comparative analysis demonstrates portable detection as code pipelines over proprietary locked query formats.",
        "Verification confirms query transpilation fidelity, filter preservation, and automated detection deployment."
    ],
    [
        "Architectural overview displays deep file and memory inspection identifying malicious implants and payloads.",
        "Deep inspection analyzes byte patterns, string signatures, and conditional logic inside binary memory buffers.",
        "Comparative analysis demonstrates deep in-memory implant discovery over superficial disk-only antivirus scanning.",
        "Verification confirms signature pattern matching, webshell detection, and memory threat isolation."
    ],
    [
        "Architectural overview presents the complete threat hunting and detection engine certifying operational excellence.",
        "Deep inspection evaluates unified performance across tradecraft hunting, matrix coverage, rules, and memory scans.",
        "Comparative analysis demonstrates continuous proactive hunting over passive reactive alert queue monitoring.",
        "Verification confirms full platform certification, zero detection regressions, and verified hunting mastery."
    ]
]

for idx, p in enumerate(day52_data["parts"]):
    code = p["code"]
    code_hash = hashlib.sha256(code.encode("utf-8")).hexdigest()
    
    # Check no digits in captions
    for c in captions[idx]:
        for ch in c:
            if ch.isdigit():
                raise ValueError(f"Digit found in caption: {c}")

    entry = {
        "partTitle": p["title"],
        "codeHash": code_hash,
        "spec": {
            "template": "compare",
            "title": f"Threat Hunting: {p['title']}",
            "left": {
                "label": "Reactive Alert-Driven SOC",
                "content": [
                    "Analysts wait passively for static hash and IP alerts while adversaries dwell undetected for months",
                    "Security coverage lacks framework alignment, leaving critical lateral movement blind spots unmonitored",
                    "Detection rules are written in proprietary locked query languages requiring manual rewrite per SIEM",
                    "Fileless in-memory implants and stealth webshells evade traditional disk-based antivirus scanners"
                ]
            },
            "right": {
                "label": "Proactive Threat Hunting Engine",
                "content": [
                    "Hypothesis-driven threat hunting tracks adversary behavioral tradecraft at the top of the pyramid of pain",
                    "Systematic MITRE ATT&CK mapping ensures over ninety percent coverage across all tactical kill-chain phases",
                    "Universal Sigma YAML rules transpile automatically into native Splunk, Elastic, and Sentinel queries",
                    "YARA memory and byte pattern scanning exposes reflective DLL loaders, webshells, and beacon implants"
                ]
            },
            "steps": [
                {
                    "at": "intro",
                    "caption": captions[idx][0]
                },
                {
                    "at": "inspect",
                    "caption": captions[idx][1]
                },
                {
                    "at": "compare",
                    "caption": captions[idx][2]
                },
                {
                    "at": "verify",
                    "caption": captions[idx][3]
                }
            ]
        },
        "filled": {
            "leftLabel": "Reactive Alert-Driven SOC",
            "rightLabel": "Proactive Threat Hunting Engine",
            "leftContent": [
                "Analysts wait passively for static hash and IP alerts while adversaries dwell undetected for months",
                "Security coverage lacks framework alignment, leaving critical lateral movement blind spots unmonitored",
                "Detection rules are written in proprietary locked query languages requiring manual rewrite per SIEM",
                "Fileless in-memory implants and stealth webshells evade traditional disk-based antivirus scanners"
            ],
            "rightContent": [
                "Hypothesis-driven threat hunting tracks adversary behavioral tradecraft at the top of the pyramid of pain",
                "Systematic MITRE ATT&CK mapping ensures over ninety percent coverage across all tactical kill-chain phases",
                "Universal Sigma YAML rules transpile automatically into native Splunk, Elastic, and Sentinel queries",
                "YARA memory and byte pattern scanning exposes reflective DLL loaders, webshells, and beacon implants"
            ]
        }
    }
    entries.append(entry)

prompt_content = f"cyber-day-52-threat-hunting-detection-engineering"
prompt_sha = hashlib.sha256(prompt_content.encode("utf-8")).hexdigest()

envelope = {
    "schemaVersion": 2,
    "course": "cyber",
    "prefix": "cyber",
    "day": 52,
    "promptSha": prompt_sha,
    "entries": entries
}

os.makedirs("src/lib/data/lessonVisuals/cyber", exist_ok=True)
out_path = "src/lib/data/lessonVisuals/cyber/day-52.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Generated {out_path} successfully with 0 digits in captions!")
