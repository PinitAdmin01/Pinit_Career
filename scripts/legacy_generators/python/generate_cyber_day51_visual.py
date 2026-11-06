# scripts/generate_cyber_day51_visual.py
import json
import hashlib
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from cyber_day51_data import DAY_51_DATA as day51_data

entries = []

captions = [
    [
        "Architectural overview illustrates security operations center telemetry ingestion and semantic log normalization.",
        "Deep inspection evaluates parsing of raw syslog streams into standardized common event format records.",
        "Comparative analysis demonstrates semantic schema normalization over unstructured proprietary vendor logs.",
        "Verification confirms field extraction, schema conformity, and normalized telemetry pipeline streaming."
    ],
    [
        "Architectural overview displays sliding time window correlation linking disparate security events across systems.",
        "Deep inspection evaluates temporal event counts against threshold rules to detect multi-stage brute force attacks.",
        "Comparative analysis demonstrates time-bounded behavioral correlation over isolated single-event alerting.",
        "Verification confirms threshold breach detection, offending source address identification, and incident generation."
    ],
    [
        "Architectural overview illustrates multi-factor alert triage evaluating vulnerability severity and asset criticality.",
        "Deep inspection analyzes incident priority rankings to prevent analyst alert fatigue on operational noise.",
        "Comparative analysis demonstrates risk-weighted triage prioritization over raw volume alert dispatching.",
        "Verification confirms emergency escalation, priority tier assignment, and focused analyst response."
    ],
    [
        "Architectural overview displays tiered storage architectures balancing real-time search with compliance archiving.",
        "Deep inspection monitors index lifecycle transitions across high-speed search tiers and immutable cold archives.",
        "Comparative analysis demonstrates cost-effective compliance archiving over monolithic expensive storage clusters.",
        "Verification confirms regulatory retention window compliance, immutable storage lock enforcement, and audit defense."
    ],
    [
        "Architectural overview presents the complete enterprise security operations center platform certifying operational readiness.",
        "Deep inspection evaluates unified performance across ingestion pipelines, normalization, correlation, and storage.",
        "Comparative analysis demonstrates twenty-four-seven operational defense across distributed digital infrastructure.",
        "Verification confirms full platform certification, zero monitoring defects, and verified operations readiness."
    ]
]

for idx, p in enumerate(day51_data["parts"]):
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
            "title": f"SOC Architecture & SIEM: {p['title']}",
            "left": {
                "label": "Legacy Unmanaged Log Architecture",
                "content": [
                    "Heterogeneous unstructured syslog strings are stored in disparate siloed directories without schema",
                    "Single-event alerts trigger on every failed login, flooding analyst queues with thousands of false positives",
                    "Alerts lack asset criticality context, treating developer sandbox warnings identical to production breaches",
                    "Logs are deleted after forty-eight hours to save disk space, violating mandatory compliance regulations"
                ]
            },
            "right": {
                "label": "Enterprise SOC & SIEM Architecture",
                "content": [
                    "Encrypted ingestion normalizes disparate feeds into standardized Common Event Format (CEF) schemas",
                    "Sliding time window correlation links multi-stage attack chains and detects brute force intrusions",
                    "Multi-factor triage classifies priority (P1 to P4) based on CVSS scores, asset criticality, and EPSS",
                    "Tiered storage with hot search and immutable WORM compliance archives satisfies regulatory mandates"
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
            "leftLabel": "Legacy Unmanaged Log Architecture",
            "rightLabel": "Enterprise SOC & SIEM Architecture",
            "leftContent": [
                "Heterogeneous unstructured syslog strings are stored in disparate siloed directories without schema",
                "Single-event alerts trigger on every failed login, flooding analyst queues with thousands of false positives",
                "Alerts lack asset criticality context, treating developer sandbox warnings identical to production breaches",
                "Logs are deleted after forty-eight hours to save disk space, violating mandatory compliance regulations"
            ],
            "rightContent": [
                "Encrypted ingestion normalizes disparate feeds into standardized Common Event Format (CEF) schemas",
                "Sliding time window correlation links multi-stage attack chains and detects brute force intrusions",
                "Multi-factor triage classifies priority (P1 to P4) based on CVSS scores, asset criticality, and EPSS",
                "Tiered storage with hot search and immutable WORM compliance archives satisfies regulatory mandates"
            ]
        }
    }
    entries.append(entry)

prompt_content = f"cyber-day-51-soc-architecture-siem-fundamentals"
prompt_sha = hashlib.sha256(prompt_content.encode("utf-8")).hexdigest()

envelope = {
    "schemaVersion": 2,
    "course": "cyber",
    "prefix": "cyber",
    "day": 51,
    "promptSha": prompt_sha,
    "entries": entries
}

os.makedirs("src/lib/data/lessonVisuals/cyber", exist_ok=True)
out_path = "src/lib/data/lessonVisuals/cyber/day-51.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Generated {out_path} successfully with 0 digits in captions!")
