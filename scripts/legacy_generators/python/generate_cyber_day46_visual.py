# scripts/generate_cyber_day46_visual.py
import json
import hashlib
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from cyber_day46_data import DAY_46_DATA as day46_data

entries = []

captions = [
    [
        "Architectural overview illustrates process isolation boundaries enforced through linux kernel namespaces and control groups.",
        "Deep inspection evaluates process identifier isolation and unified resource limits across memory, processors, and threads.",
        "Comparative analysis demonstrates multi-tenant host containment preventing fork bomb denial of service attacks.",
        "Verification confirms complete namespace separation, process ceiling enforcement, and host stability defense."
    ],
    [
        "Architectural overview displays traditional superuser privilege decomposition into fine-grained capability tokens.",
        "Deep inspection audits capability bounding sets to detect and purge dangerous administrative tokens.",
        "Comparative analysis demonstrates least privilege confinement over legacy monolithic superuser access.",
        "Verification confirms capability stripping, administrative token purge, and containment of privilege escalation."
    ],
    [
        "Architectural overview illustrates system call sandboxing utilizing berkeley packet filter bytecode filters.",
        "Deep inspection evaluates system call numbers against default-deny filtering policies and whitelists.",
        "Comparative analysis demonstrates kernel attack surface reduction blocking high-risk administrative routines.",
        "Verification confirms system call whitelisting, prohibited invocation interception, and kernel defense."
    ],
    [
        "Architectural overview displays mandatory access control rules paired with cryptographic file integrity monitoring.",
        "Deep inspection evaluates baseline cryptographic hash records against live operating system binaries.",
        "Comparative analysis demonstrates automated tamper detection over discretionary file permission models.",
        "Verification confirms cryptographic hash discrepancy detection, audit alert generation, and host defense."
    ],
    [
        "Architectural overview presents the complete host hardening benchmark coordinating multi-checkpoint host validation.",
        "Deep inspection evaluates unified compliance across namespaces, control groups, capabilities, filters, and baselines.",
        "Comparative analysis demonstrates defense in depth across host operating systems against multi-stage intrusions.",
        "Verification confirms full host hardening compliance, zero security gaps, and verified host infrastructure defense."
    ]
]

for idx, p in enumerate(day46_data["parts"]):
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
            "title": f"Linux Host Hardening: {p['title']}",
            "left": {
                "label": "Unhardened Host Infrastructure",
                "content": [
                    "Containers share host process tables and global resource ceilings without boundaries",
                    "Monolithic superuser processes retain omnipotent system administration privileges",
                    "Unprivileged processes freely invoke all four hundred plus kernel system calls",
                    "Operating system binaries and configuration files lack cryptographic integrity verification"
                ]
            },
            "right": {
                "label": "Hardened Host Defense Architecture",
                "content": [
                    "Complete namespace isolation and unified control groups prevent host resource exhaustion",
                    "Fine-grained capabilities drop superuser powers and strip dangerous administrative tokens",
                    "Seccomp-bpf system call sandboxing enforces strict whitelisting with default-deny policies",
                    "Cryptographic file integrity monitoring and auditd hooks detect tampering immediately"
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
            "leftLabel": "Unhardened Host Infrastructure",
            "rightLabel": "Hardened Host Defense Architecture",
            "leftContent": [
                "Containers share host process tables and global resource ceilings without boundaries",
                "Monolithic superuser processes retain omnipotent system administration privileges",
                "Unprivileged processes freely invoke all four hundred plus kernel system calls",
                "Operating system binaries and configuration files lack cryptographic integrity verification"
            ],
            "rightContent": [
                "Complete namespace isolation and unified control groups prevent host resource exhaustion",
                "Fine-grained capabilities drop superuser powers and strip dangerous administrative tokens",
                "Seccomp-bpf system call sandboxing enforces strict whitelisting with default-deny policies",
                "Cryptographic file integrity monitoring and auditd hooks detect tampering immediately"
            ]
        }
    }
    entries.append(entry)

prompt_content = f"cyber-day-46-linux-kernel-hardening-host-defense"
prompt_sha = hashlib.sha256(prompt_content.encode("utf-8")).hexdigest()

envelope = {
    "schemaVersion": 2,
    "course": "cyber",
    "prefix": "cyber",
    "day": 46,
    "promptSha": prompt_sha,
    "entries": entries
}

os.makedirs("src/lib/data/lessonVisuals/cyber", exist_ok=True)
out_path = "src/lib/data/lessonVisuals/cyber/day-46.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Generated {out_path} successfully with 0 digits in captions!")
