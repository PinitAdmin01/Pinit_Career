# scripts/generate_cyber_day49_visual.py
import json
import hashlib
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from cyber_day49_data import DAY_49_DATA as day49_data

entries = []

captions = [
    [
        "Architectural overview illustrates cross-account role assumption protected by unique external identifier tokens.",
        "Deep inspection evaluates trust policies to ensure mandatory validation of secret client tokens before credential issuance.",
        "Comparative analysis demonstrates confused deputy exploit mitigation over unrestricted cross-account trust relationships.",
        "Verification confirms external token validation, assume-role authorization, and temporary credential generation."
    ],
    [
        "Architectural overview displays organization service control policies enforcing immutable administrative guardrails.",
        "Deep inspection monitors organization hierarchies to block unapproved regions and protect audit trails.",
        "Comparative analysis demonstrates organization-level permission boundaries overriding local account administrative privileges.",
        "Verification confirms audit trail preservation, security detector protection, and geographic region confinement."
    ],
    [
        "Architectural overview illustrates infrastructure as code state file protection utilizing customer-managed cryptographic keys.",
        "Deep inspection verifies server-side encryption and distributed locking tables to prevent state corruption.",
        "Comparative analysis demonstrates secure remote state backends over unencrypted local developer state files.",
        "Verification confirms cryptographic state encryption, distributed lock coordination, and state confidentiality defense."
    ],
    [
        "Architectural overview displays shift-left static infrastructure analysis scanning blueprints before cloud provisioning.",
        "Deep inspection analyzes resource blocks to detect open administrative ports and unencrypted storage volumes.",
        "Comparative analysis demonstrates pre-deployment misconfiguration interception over reactive post-deployment remediation.",
        "Verification confirms policy violation detection, automated pipeline failure, and insecure manifest rejection."
    ],
    [
        "Architectural overview presents the complete cloud identity and infrastructure policy engine coordinating deployment gates.",
        "Deep inspection evaluates unified compliance across trust policies, organizational guardrails, state encryption, and scans.",
        "Comparative analysis demonstrates comprehensive multi-account governance against configuration drift and lateral pivots.",
        "Verification confirms full deployment plan certification, zero critical findings, and authorized infrastructure release."
    ]
]

for idx, p in enumerate(day49_data["parts"]):
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
            "title": f"Cloud IAM & IaC Hardening: {p['title']}",
            "left": {
                "label": "Vulnerable Cloud Infrastructure",
                "content": [
                    "Cross-account trust policies omit external IDs, exposing accounts to confused deputy exploits",
                    "Child accounts lack organizational guardrails and can disable audit logging and detectors",
                    "Terraform state files reside unencrypted on local disks containing plaintext passwords and keys",
                    "Insecure infrastructure definitions with open administrative ports are committed and applied"
                ]
            },
            "right": {
                "label": "Hardened Cloud Architecture",
                "content": [
                    "Cryptographically verified external IDs neutralize confused deputy vulnerabilities in trust policies",
                    "Service Control Policies enforce immutable guardrails protecting audit trails and restricting regions",
                    "Remote state backends enforce customer-managed KMS encryption and distributed DynamoDB state locking",
                    "Static IaC scanners (Checkov, Tfsec) block pull requests with high or critical misconfigurations"
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
            "leftLabel": "Vulnerable Cloud Infrastructure",
            "rightLabel": "Hardened Cloud Architecture",
            "leftContent": [
                "Cross-account trust policies omit external IDs, exposing accounts to confused deputy exploits",
                "Child accounts lack organizational guardrails and can disable audit logging and detectors",
                "Terraform state files reside unencrypted on local disks containing plaintext passwords and keys",
                "Insecure infrastructure definitions with open administrative ports are committed and applied"
            ],
            "rightContent": [
                "Cryptographically verified external IDs neutralize confused deputy vulnerabilities in trust policies",
                "Service Control Policies enforce immutable guardrails protecting audit trails and restricting regions",
                "Remote state backends enforce customer-managed KMS encryption and distributed DynamoDB state locking",
                "Static IaC scanners (Checkov, Tfsec) block pull requests with high or critical misconfigurations"
            ]
        }
    }
    entries.append(entry)

prompt_content = f"cyber-day-49-cloud-iam-iac-hardening"
prompt_sha = hashlib.sha256(prompt_content.encode("utf-8")).hexdigest()

envelope = {
    "schemaVersion": 2,
    "course": "cyber",
    "prefix": "cyber",
    "day": 49,
    "promptSha": prompt_sha,
    "entries": entries
}

os.makedirs("src/lib/data/lessonVisuals/cyber", exist_ok=True)
out_path = "src/lib/data/lessonVisuals/cyber/day-49.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Generated {out_path} successfully with 0 digits in captions!")
