# scripts/generate_cyber_day47_visual.py
import json
import hashlib
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from cyber_day47_data import DAY_47_DATA as day47_data

entries = []

captions = [
    [
        "Architectural overview illustrates container daemon isolation boundaries and unprivileged socket protection.",
        "Deep inspection audits daemon settings to disable inter-container communication and enforce user namespace mapping.",
        "Comparative analysis demonstrates unprivileged daemon execution over default monolithic root socket access.",
        "Verification confirms daemon hardening, inter-container traffic blocking, and host isolation defense."
    ],
    [
        "Architectural overview displays minimal distroless base image composition stripping unnecessary tools.",
        "Deep inspection evaluates image layers to ensure complete removal of interactive shells and package managers.",
        "Comparative analysis demonstrates attack surface reduction over bloated distribution base image layers.",
        "Verification confirms non-root user execution, shell absence, and distroless runtime compliance."
    ],
    [
        "Architectural overview illustrates immutable read-only container root filesystems paired with ephemeral memory storage.",
        "Deep inspection monitors storage mounts to enforce read-only flags and secure temporary filesystem options.",
        "Comparative analysis demonstrates runtime tamper resistance over writable container storage layers.",
        "Verification confirms read-only rootfs enforcement, temporary memory boundary compliance, and filesystem integrity."
    ],
    [
        "Architectural overview displays automated vulnerability scanning pipelines evaluating software bills of materials.",
        "Deep inspection analyzes package inventories against vulnerability registries using severity and exploit prediction scores.",
        "Comparative analysis demonstrates proactive vulnerability gatekeeping over uninspected container deployments.",
        "Verification confirms blocking vulnerability detection, severity threshold enforcement, and registry isolation."
    ],
    [
        "Architectural overview presents the complete container security policy engine coordinating multi-checkpoint evaluation.",
        "Deep inspection evaluates unified compliance across non-root execution, immutable storage, and vulnerability scans.",
        "Comparative analysis demonstrates comprehensive container supply chain defense against deployment risks.",
        "Verification confirms full policy certification, zero security regressions, and production container authorization."
    ]
]

for idx, p in enumerate(day47_data["parts"]):
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
            "title": f"Container Security: {p['title']}",
            "left": {
                "label": "Vulnerable Container Deployment",
                "content": [
                    "Containers execute as root UID zero with direct access to the unhardened Docker daemon socket",
                    "Bloated distribution images bundle package managers, compilers, and interactive shells",
                    "Writable container filesystems permit runtime malware persistence and binary modification",
                    "Uninspected image layers carry unpatched critical vulnerabilities into production registries"
                ]
            },
            "right": {
                "label": "Hardened Container Architecture",
                "content": [
                    "Rootless container engines drop root privileges and disable inter-container communication",
                    "Distroless minimal base images strip package managers and shells to shrink attack surfaces",
                    "Read-only root filesystems and hardened ephemeral tmpfs mounts enforce runtime immutability",
                    "Automated vulnerability scanners and SBOM analyzers block images with critical CVEs"
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
            "leftLabel": "Vulnerable Container Deployment",
            "rightLabel": "Hardened Container Architecture",
            "leftContent": [
                "Containers execute as root UID zero with direct access to the unhardened Docker daemon socket",
                "Bloated distribution images bundle package managers, compilers, and interactive shells",
                "Writable container filesystems permit runtime malware persistence and binary modification",
                "Uninspected image layers carry unpatched critical vulnerabilities into production registries"
            ],
            "rightContent": [
                "Rootless container engines drop root privileges and disable inter-container communication",
                "Distroless minimal base images strip package managers and shells to shrink attack surfaces",
                "Read-only root filesystems and hardened ephemeral tmpfs mounts enforce runtime immutability",
                "Automated vulnerability scanners and SBOM analyzers block images with critical CVEs"
            ]
        }
    }
    entries.append(entry)

prompt_content = f"cyber-day-47-container-security-docker-isolation"
prompt_sha = hashlib.sha256(prompt_content.encode("utf-8")).hexdigest()

envelope = {
    "schemaVersion": 2,
    "course": "cyber",
    "prefix": "cyber",
    "day": 47,
    "promptSha": prompt_sha,
    "entries": entries
}

os.makedirs("src/lib/data/lessonVisuals/cyber", exist_ok=True)
out_path = "src/lib/data/lessonVisuals/cyber/day-47.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Generated {out_path} successfully with 0 digits in captions!")
