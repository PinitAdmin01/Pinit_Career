# scripts/generate_cyber_day50_visual.py
import json
import hashlib
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from cyber_day50_data import DAY_50_DATA as day50_data

entries = []

captions = [
    [
        "Architectural overview illustrates multi-cloud zero-trust workload identity federated through cryptographic credentials.",
        "Deep inspection evaluates workload identity documents and trust domain bundles across heterogeneous cloud environments.",
        "Comparative analysis demonstrates cryptographic workload identity over perimeter network access controls.",
        "Verification confirms workload attestation, cryptographic token validation, and mutual transport layer security defense."
    ],
    [
        "Architectural overview displays concentric defense-in-depth layers connecting host kernels to cloud control planes.",
        "Deep inspection traces multi-layer containment boundaries across namespaces, containers, pods, and cloud policies.",
        "Comparative analysis demonstrates non-aligned defensive layers neutralizing multi-stage intrusion chains.",
        "Verification confirms full pipeline compliance, zero defensive gaps, and verified multi-layer containment."
    ],
    [
        "Architectural overview illustrates continuous compliance telemetry fusing cloud posture management with kernel probes.",
        "Deep inspection analyzes real-time system call streams and cloud events to trigger automated remediation workflows.",
        "Comparative analysis demonstrates sub-second automated threat containment over reactive human incident response.",
        "Verification confirms anomaly detection, automated policy enforcement, and continuous runtime health."
    ],
    [
        "Architectural overview displays automated adversary breach simulation testing multi-stage attack scenarios.",
        "Deep inspection evaluates containment rate against container breakouts, confused deputy attacks, and data exfiltration.",
        "Comparative analysis demonstrates empirical red-team verification over theoretical compliance checklists.",
        "Verification confirms simulated threat interception, complete attack containment, and zero compromise."
    ],
    [
        "Architectural overview presents the grand milestone capstone audit certifying sovereign multi-cloud security.",
        "Deep inspection evaluates complete five-dimension compliance across hosts, containers, clusters, identities, and meshes.",
        "Comparative analysis demonstrates complete mathematical compliance across all enterprise cloud security benchmarks.",
        "Verification confirms grand milestone capstone certification, zero security regressions, and cloud defense mastery."
    ]
]

for idx, p in enumerate(day50_data["parts"]):
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
            "title": f"Milestone 10 Capstone: {p['title']}",
            "left": {
                "label": "Vulnerable Multi-Cloud Infrastructure",
                "content": [
                    "Implicit trust on internal networks exposes microservices to lateral compromise and packet sniffing",
                    "Single-barrier security models collapse completely when application-level exploits succeed",
                    "Reactive human ticket queues result in multi-hour delay before responding to active intrusions",
                    "Unverified theoretical security checklists fail silently under real-world adversary attack chains"
                ]
            },
            "right": {
                "label": "Zero-Trust Mesh & Continuous Compliance",
                "content": [
                    "SPIFFE verifiable workload identity and mutual TLS enforce cryptographic identity per RPC",
                    "Concentric five-layer defense-in-depth pipeline contains breakouts from kernel to cloud IAM",
                    "Continuous telemetry and event-driven automation trigger sub-second remediation playbooks",
                    "Automated adversary breach simulation proves one hundred percent containment across attack scenarios"
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
            "leftLabel": "Vulnerable Multi-Cloud Infrastructure",
            "rightLabel": "Zero-Trust Mesh & Continuous Compliance",
            "leftContent": [
                "Implicit trust on internal networks exposes microservices to lateral compromise and packet sniffing",
                "Single-barrier security models collapse completely when application-level exploits succeed",
                "Reactive human ticket queues result in multi-hour delay before responding to active intrusions",
                "Unverified theoretical security checklists fail silently under real-world adversary attack chains"
            ],
            "rightContent": [
                "SPIFFE verifiable workload identity and mutual TLS enforce cryptographic identity per RPC",
                "Concentric five-layer defense-in-depth pipeline contains breakouts from kernel to cloud IAM",
                "Continuous telemetry and event-driven automation trigger sub-second remediation playbooks",
                "Automated adversary breach simulation proves one hundred percent containment across attack scenarios"
            ]
        }
    }
    entries.append(entry)

prompt_content = f"cyber-day-50-milestone-10-capstone-multi-cloud-zero-trust-mesh"
prompt_sha = hashlib.sha256(prompt_content.encode("utf-8")).hexdigest()

envelope = {
    "schemaVersion": 2,
    "course": "cyber",
    "prefix": "cyber",
    "day": 50,
    "promptSha": prompt_sha,
    "entries": entries
}

os.makedirs("src/lib/data/lessonVisuals/cyber", exist_ok=True)
out_path = "src/lib/data/lessonVisuals/cyber/day-50.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Generated {out_path} successfully with 0 digits in captions!")
