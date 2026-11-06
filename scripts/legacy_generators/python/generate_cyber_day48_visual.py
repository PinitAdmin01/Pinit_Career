# scripts/generate_cyber_day48_visual.py
import json
import hashlib
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from cyber_day48_data import DAY_48_DATA as day48_data

entries = []

captions = [
    [
        "Architectural overview illustrates kubernetes control plane request admission traversing authentication, authorization, and admission.",
        "Deep inspection evaluates client credentials and role bindings before granting persistent datastore storage access.",
        "Comparative analysis demonstrates multi-stage control plane validation over unauthenticated direct storage access.",
        "Verification confirms authentication success, role authorization, admission gate clearance, and datastore persistence."
    ],
    [
        "Architectural overview displays role-based access control structures enforcing least privilege permissions.",
        "Deep inspection audits roles and service accounts to detect wildcard resources and broad secrets access.",
        "Comparative analysis demonstrates granular namespaced scoping over overly broad administrative access.",
        "Verification confirms absence of wildcard grants, restricted secrets access, and secure token configuration."
    ],
    [
        "Architectural overview illustrates pod security admission evaluating workloads against the restricted standard.",
        "Deep inspection monitors pod security contexts to enforce non-root execution and read-only filesystems.",
        "Comparative analysis demonstrates kernel-level container confinement over unhardened privileged pod execution.",
        "Verification confirms non-root user enforcement, read-only rootfs compliance, and capability dropping."
    ],
    [
        "Architectural overview displays cluster network microsegmentation enforcing default-deny ingress and egress rules.",
        "Deep inspection analyzes network policies to block lateral movement and isolate link-local metadata endpoints.",
        "Comparative analysis demonstrates isolated workload networking over default flat cluster connectivity.",
        "Verification confirms default-deny enforcement, metadata service isolation, and permitted microsegmentation."
    ],
    [
        "Architectural overview presents the complete kubernetes cluster security auditor coordinating multi-checkpoint evaluation.",
        "Deep inspection evaluates unified compliance across control planes, role permissions, pod standards, and network policies.",
        "Comparative analysis demonstrates defense in depth across distributed container orchestration clusters.",
        "Verification confirms full cluster certification, zero security defects, and verified cloud infrastructure defense."
    ]
]

for idx, p in enumerate(day48_data["parts"]):
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
            "title": f"Kubernetes Security: {p['title']}",
            "left": {
                "label": "Vulnerable Kubernetes Cluster",
                "content": [
                    "Control plane allows anonymous access and stores secrets in unencrypted plaintext on disk",
                    "Service accounts possess wildcard cluster-admin permissions and auto-mount API tokens",
                    "Pods execute as root with privileged capabilities and access to host namespaces",
                    "Flat unsegmented network allows arbitrary cross-namespace traffic and cloud metadata access"
                ]
            },
            "right": {
                "label": "Hardened Kubernetes Architecture",
                "content": [
                    "Control plane enforces mTLS, etcd encryption at rest, and validating admission controllers",
                    "Least-privilege RBAC eliminates wildcards and disables automated ServiceAccount token mounting",
                    "Pod Security Admission Restricted standard mandates non-root execution and read-only rootfs",
                    "Default-deny network policies enforce microsegmentation and block cloud metadata IP egress"
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
            "leftLabel": "Vulnerable Kubernetes Cluster",
            "rightLabel": "Hardened Kubernetes Architecture",
            "leftContent": [
                "Control plane allows anonymous access and stores secrets in unencrypted plaintext on disk",
                "Service accounts possess wildcard cluster-admin permissions and auto-mount API tokens",
                "Pods execute as root with privileged capabilities and access to host namespaces",
                "Flat unsegmented network allows arbitrary cross-namespace traffic and cloud metadata access"
            ],
            "rightContent": [
                "Control plane enforces mTLS, etcd encryption at rest, and validating admission controllers",
                "Least-privilege RBAC eliminates wildcards and disables automated ServiceAccount token mounting",
                "Pod Security Admission Restricted standard mandates non-root execution and read-only rootfs",
                "Default-deny network policies enforce microsegmentation and block cloud metadata IP egress"
            ]
        }
    }
    entries.append(entry)

prompt_content = f"cyber-day-48-kubernetes-security-pod-security-standards"
prompt_sha = hashlib.sha256(prompt_content.encode("utf-8")).hexdigest()

envelope = {
    "schemaVersion": 2,
    "course": "cyber",
    "prefix": "cyber",
    "day": 48,
    "promptSha": prompt_sha,
    "entries": entries
}

os.makedirs("src/lib/data/lessonVisuals/cyber", exist_ok=True)
out_path = "src/lib/data/lessonVisuals/cyber/day-48.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Generated {out_path} successfully with 0 digits in captions!")
