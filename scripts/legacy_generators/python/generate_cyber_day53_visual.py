# scripts/generate_cyber_day53_visual.py
import json
import hashlib
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from cyber_day53_data import DAY_53_DATA as day53_data

entries = []

captions = [
    [
        "Architectural overview illustrates security orchestration dispatching actions across firewalls, endpoints, and identity providers.",
        "Deep inspection monitors programmatic action execution to verify sub-second latency across all integrated platforms.",
        "Comparative analysis demonstrates programmatic orchestration over error-prone manual response workflows.",
        "Verification confirms multi-system action execution, low latency response, and successful platform coordination."
    ],
    [
        "Architectural overview displays automated threat intelligence ingestion parsing structured cyber threat records.",
        "Deep inspection evaluates pattern matching syntax to extract network observables for automated blocking.",
        "Comparative analysis demonstrates machine-speed threat intelligence sharing over unstandardized manual reports.",
        "Verification confirms observable extraction, threat feed synchronization, and automated firewall policy updates."
    ],
    [
        "Architectural overview illustrates coordinated multi-system ransomware containment executing in parallel across systems.",
        "Deep inspection traces simultaneous endpoint network isolation, session token revocation, and perimeter address blocking.",
        "Comparative analysis demonstrates sub-second automated containment over slow sequential human incident response.",
        "Verification confirms host isolation, session revocation, malicious traffic blocking, and rapid containment."
    ],
    [
        "Architectural overview displays deterministic incident lifecycle state machine transitions with tamper-evident audit ledgers.",
        "Deep inspection verifies valid sequential state progression and cryptographic timestamping of all defensive actions.",
        "Comparative analysis demonstrates auditable incident governance over opaque unrecorded manual interventions.",
        "Verification confirms valid state transitions, immutable audit logging, and automated rollback capability."
    ],
    [
        "Architectural overview presents the complete security orchestration and automated response platform certifying readiness.",
        "Deep inspection evaluates unified performance across action connectors, threat feeds, playbooks, and audit ledgers.",
        "Comparative analysis demonstrates comprehensive enterprise incident containment across distributed digital estates.",
        "Verification confirms full platform certification, zero orchestration regressions, and operational mastery."
    ]
]

for idx, p in enumerate(day53_data["parts"]):
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
            "title": f"SOAR & Incident Response: {p['title']}",
            "left": {
                "label": "Manual Slow-Response SOC",
                "content": [
                    "Analysts manually copy-paste threat indicators between isolated portals, taking hours to respond",
                    "Threat intelligence arrives as unstructured human-readable documents requiring manual triage",
                    "Ransomware spreads unimpeded while engineers manually seek administrative approvals for containment",
                    "Incident actions operate as an unrecorded black box without audit ledgers or rollback mechanisms"
                ]
            },
            "right": {
                "label": "Automated SOAR Engine",
                "content": [
                    "Bidirectional API connectors execute firewall blocks and endpoint isolation in sub-second timeframes",
                    "Automated TAXII channels ingest structured STIX objects, pushing indicators directly into blocklists",
                    "Coordinated playbooks isolate infected hosts and revoke user sessions simultaneously in parallel",
                    "Deterministic state machines maintain cryptographically signed audit ledgers and single-click rollbacks"
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
            "leftLabel": "Manual Slow-Response SOC",
            "rightLabel": "Automated SOAR Engine",
            "leftContent": [
                "Analysts manually copy-paste threat indicators between isolated portals, taking hours to respond",
                "Threat intelligence arrives as unstructured human-readable documents requiring manual triage",
                "Ransomware spreads unimpeded while engineers manually seek administrative approvals for containment",
                "Incident actions operate as an unrecorded black box without audit ledgers or rollback mechanisms"
            ],
            "rightContent": [
                "Bidirectional API connectors execute firewall blocks and endpoint isolation in sub-second timeframes",
                "Automated TAXII channels ingest structured STIX objects, pushing indicators directly into blocklists",
                "Coordinated playbooks isolate infected hosts and revoke user sessions simultaneously in parallel",
                "Deterministic state machines maintain cryptographically signed audit ledgers and single-click rollbacks"
            ]
        }
    }
    entries.append(entry)

prompt_content = f"cyber-day-53-soar-automated-playbooks-stix-taxii"
prompt_sha = hashlib.sha256(prompt_content.encode("utf-8")).hexdigest()

envelope = {
    "schemaVersion": 2,
    "course": "cyber",
    "prefix": "cyber",
    "day": 53,
    "promptSha": prompt_sha,
    "entries": entries
}

os.makedirs("src/lib/data/lessonVisuals/cyber", exist_ok=True)
out_path = "src/lib/data/lessonVisuals/cyber/day-53.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Generated {out_path} successfully with 0 digits in captions!")
