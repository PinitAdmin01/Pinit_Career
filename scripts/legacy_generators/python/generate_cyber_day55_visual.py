# scripts/generate_cyber_day55_visual.py
import json
import hashlib
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from cyber_day55_data import DAY_55_DATA as day55_data

entries = []

captions = [
    [
        "Architectural overview illustrates autonomous security operations center telemetry ingestion and standardized parsing.",
        "Deep inspection monitors multi-source telemetry packets across firewalls, endpoints, and cloud audit trails.",
        "Comparative analysis demonstrates unified common event format normalization over siloed unstandardized log storage.",
        "Verification confirms telemetry ingestion health, standardized schema versioning, and continuous event pipeline flow."
    ],
    [
        "Architectural overview displays the end-to-end detection-to-response pipeline coordinating containment and acquisition.",
        "Deep inspection traces rapid incident progression from correlation to automated containment and volatile memory capture.",
        "Comparative analysis demonstrates sub-second automated containment over slow sequential human incident response.",
        "Verification confirms hermetic threat containment, volatile evidence preservation, and sub-second response latency."
    ],
    [
        "Architectural overview illustrates continuous threat hunting loops and automated adversary emulation across systems.",
        "Deep inspection maps tactical technique coverage across all fourteen enterprise attack lifecycle phases.",
        "Comparative analysis demonstrates proactive hypothesis-driven hunting over passive reactive alert queue monitoring.",
        "Verification confirms full tactical technique coverage, zero visibility blind spots, and verified hunting mastery."
    ],
    [
        "Architectural overview displays adversary simulation validating breach containment and judicial evidence admissibility.",
        "Deep inspection asserts hardware write-blocker enforcement and identical cryptographic hash baseline verification.",
        "Comparative analysis demonstrates legally defensible scientific forensics over unverified ad-hoc evidence handling.",
        "Verification confirms legal chain of custody attestation, cryptographic hash equivalence, and court admissibility."
    ],
    [
        "Architectural overview presents the grand milestone capstone audit certifying sovereign security operations readiness.",
        "Deep inspection evaluates complete five-dimension compliance across ingestion, hunting, automation, forensics, and orchestration.",
        "Comparative analysis demonstrates complete mathematical compliance across all enterprise security operations benchmarks.",
        "Verification confirms grand milestone capstone certification, zero operational regressions, and secops mastery."
    ]
]

for idx, p in enumerate(day55_data["parts"]):
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
            "title": f"Milestone 11 Capstone: {p['title']}",
            "left": {
                "label": "Fragmented Siloed SOC",
                "content": [
                    "Siloed telemetry leaves analysts blind to cross-system multi-stage adversary intrusion chains",
                    "Manual containment processes take hours, allowing ransomware to encrypt the entire network",
                    "Reactive queues wait passively for known alerts while covert nation-state threats dwell undetected",
                    "Evidence handling lacks write-blockers and cryptographic ledgers, breaching legal chain of custody"
                ]
            },
            "right": {
                "label": "Autonomous Enterprise SOC Engine",
                "content": [
                    "Unified telemetry mesh normalizes all feeds into Common Event Format (CEF) schemas at ingestion",
                    "Sub-second SOAR playbooks isolate infected endpoints and revoke compromised user credentials",
                    "Continuous automated threat hunting loops achieve over ninety percent coverage across ATT&CK tactics",
                    "Hardware write-blockers and volatile memory dumps preserve evidence with verified cryptographic ledgers"
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
            "leftLabel": "Fragmented Siloed SOC",
            "rightLabel": "Autonomous Enterprise SOC Engine",
            "leftContent": [
                "Siloed telemetry leaves analysts blind to cross-system multi-stage adversary intrusion chains",
                "Manual containment processes take hours, allowing ransomware to encrypt the entire network",
                "Reactive queues wait passively for known alerts while covert nation-state threats dwell undetected",
                "Evidence handling lacks write-blockers and cryptographic ledgers, breaching legal chain of custody"
            ],
            "rightContent": [
                "Unified telemetry mesh normalizes all feeds into Common Event Format (CEF) schemas at ingestion",
                "Sub-second SOAR playbooks isolate infected endpoints and revoke compromised user credentials",
                "Continuous automated threat hunting loops achieve over ninety percent coverage across ATT&CK tactics",
                "Hardware write-blockers and volatile memory dumps preserve evidence with verified cryptographic ledgers"
            ]
        }
    }
    entries.append(entry)

prompt_content = f"cyber-day-55-milestone-11-capstone-autonomous-enterprise-soc"
prompt_sha = hashlib.sha256(prompt_content.encode("utf-8")).hexdigest()

envelope = {
    "schemaVersion": 2,
    "course": "cyber",
    "prefix": "cyber",
    "day": 55,
    "promptSha": prompt_sha,
    "entries": entries
}

os.makedirs("src/lib/data/lessonVisuals/cyber", exist_ok=True)
out_path = "src/lib/data/lessonVisuals/cyber/day-55.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Generated {out_path} successfully with 0 digits in captions!")
