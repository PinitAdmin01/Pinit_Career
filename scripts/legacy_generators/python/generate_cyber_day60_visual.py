# scripts/generate_cyber_day60_visual.py
import json
import hashlib
import re
from scripts.cyber_day60_data import DAY_60_DATA

entries = []
parts = DAY_60_DATA["parts"]

specs_data = [
    {
        "title": "Milestone Twelve Capstone Foundation: Planetary Zero-Trust Mesh",
        "left_label": "Fragmented Perimeter Architecture",
        "left_content": [
            "Implicit trust granted to internal corporate networks and virtual private network tunnels",
            "Single compromised workstation enables unrestricted lateral traversal across cloud subnets",
            "Unprotected sovereign data borders risk severe regulatory violations and international data leakage",
            "Encryption keys held in cloud provider RAM subject to foreign extraterritorial subpoena"
        ],
        "right_label": "Planetary Sovereign Zero-Trust Mesh",
        "right_content": [
            "BeyondCorp identity proxies continuously audit hardware tokens and real-time device health",
            "Photonic hardware data diodes enforce immutable physical optical air-gaps for sovereign enclaves",
            "FIPS Level Three Hardware Security Modules guarantee customer custody and instant cryptographic shredding",
            "Mutual TLS with short-lived SPIFFE workload attestations isolates every container into a micro-perimeter"
        ],
        "captions": [
            "Architectural layout displays planetary zero-trust mesh spanning sovereign multi-cloud regions.",
            "Detailed operational inspection verifies context-aware gateways, optical diodes, and hardware key modules.",
            "Comparative review demonstrates uncompromising zero-trust verification surpassing vulnerable perimeter models.",
            "Final verification certifies baseline compliance, micro-perimeter attestation, and sovereign boundary security."
        ]
    },
    {
        "title": "Autonomous Cloud Immune Mesh vs Reactive Human Triage",
        "left_label": "Reactive Human Triage",
        "left_content": [
            "Security analysts take hours to inspect alert queues while malware spreads across production nodes",
            "Manual firewall rule configuration introduces syntax errors and catastrophic operational outages",
            "Compromised credentials remain active for hours during forensic incident investigations",
            "Lacks automated closed-loop mechanisms to isolate affected hosts at cloud machine speed"
        ],
        "right_label": "Autonomous Cloud Immune Mesh",
        "right_content": [
            "Extended Berkeley packet filter probes intercept and block unauthorized system calls in the kernel",
            "Decentralized Byzantine consensus achieves supermajority quorum across independent validator nodes",
            "Sub-second closed-loop orchestrator cordons compromised nodes and revokes certificates in milliseconds",
            "Dynamic microsegmentation policies freeze infected containers while preserving memory for forensics"
        ],
        "captions": [
            "Workflow diagram illustrates closed-loop cloud immune response pipeline and kernel interception.",
            "Deep operational inspection tracks system call blocking, Byzantine quorum, and automated node cordoning.",
            "Comparative evaluation demonstrates machine-speed remediation eliminating dangerous human triage delays.",
            "Verification confirms sub-second threat containment and tamper-evident cryptographic ledger generation."
        ]
    },
    {
        "title": "Active Live-Fire Deception Grid vs Untested Security Controls",
        "left_label": "Untested Security Controls",
        "left_content": [
            "Defensive playbooks remain unexercised until real nation-state adversaries breach production",
            "Passive monitoring waits for known signatures while stealthy intruders harvest internal credentials",
            "SOC analysts suffer from high false-positive rates and alert fatigue during attacks",
            "Enterprise lacks empirical proof of detection capabilities across common adversary techniques"
        ],
        "right_label": "Active Live-Fire Deception Grid",
        "right_content": [
            "TIBER-EU digital twin ranges continuously emulate dozens of weaponized adversary techniques",
            "Canary tokens create high-fidelity tripwires generating alerts with zero false-positive rates",
            "Software-defined networking transparently redirects intruders into isolated synthetic honeynets",
            "Purple team collaboration iteratively closes detection gaps to achieve over ninety-eight percent coverage"
        ],
        "captions": [
            "Structural overview maps active deception traps, decoy credentials, and live-fire range pipelines.",
            "Detailed inspection analyzes instant canary webhook activations and automated honeynet session redirection.",
            "Comparative review demonstrates proactive deception trapping stealthy adversaries before data discovery.",
            "Final verification certifies elite combat readiness and comprehensive MITRE matrix detection coverage."
        ]
    },
    {
        "title": "Executive Fiduciary Governance vs Subjective Risk Assessment",
        "left_label": "Subjective Risk Heatmaps",
        "left_content": [
            "Assigns arbitrary red, amber, and green colors to vulnerabilities without financial loss figures",
            "Fails to articulate cyber risk in business metrics understandable to executive boards of directors",
            "Lacks automated compliance monitoring to meet strict statutory incident disclosure deadlines",
            "Ignores software supply chain provenance, exposing production clusters to upstream attacks"
        ],
        "right_label": "Quantitative Risk & Governance Engine",
        "right_content": [
            "Automated engines assess incident materiality to enforce ninety-six hour SEC disclosure compliance",
            "FAIR methodology models loss event frequency and magnitude into exact annualized loss expectancy",
            "Cryptographic admission controllers enforce SLSA Level Three provenance and software bills of materials",
            "Executive boardroom dashboards map key risk indicators directly against approved risk appetite thresholds"
        ],
        "captions": [
            "Executive dashboard layout maps quantitative risk distributions and regulatory disclosure workflows.",
            "Deep operational inspection audits materiality assessments, probabilistic loss curves, and supply chain gates.",
            "Comparative analysis illustrates mathematical financial modeling surpassing arbitrary qualitative color matrices.",
            "Verification confirms Tier-One regulatory excellence, board appetite compliance, and fiduciary integrity."
        ]
    },
    {
        "title": "Grand Master Sovereign Planetary Defense Platform Execution",
        "left_label": "Legacy Enterprise IT",
        "left_content": [
            "Siloed tools, manual compliance, uncoordinated defenses, and blind spots across clouds",
            "Vulnerable to sophisticated nation-state threat actors and multi-stage supply chain breaches",
            "Executive leadership operates in the dark without quantifiable cyber risk governance",
            "Lacks cohesive architectural vision uniting low-level systems defense with board strategy"
        ],
        "right_label": "Grand Master Cyber Defense Platform",
        "right_content": [
            "Seamlessly unites all twelve milestone disciplines from foundational cryptography to planetary zero-trust",
            "Sub-second autonomous self-healing cloud immune mesh neutralizes advanced threats at machine speed",
            "Live-fire deception grids and purple team feedback achieve over ninety-eight percent combat coverage",
            "Conferences official Chief Information Security Officer Grand Master Accreditation with Highest Honors"
        ],
        "captions": [
            "Comprehensive capstone schematic displays fully integrated planetary sovereign cyber defense platform.",
            "Deep operational inspection audits all five planetary checkpoints across zero-trust, immunity, and governance.",
            "Comparative review demonstrates absolute defense supremacy across all enterprise cybersecurity domains.",
            "Formal verification confers Chief Information Security Officer Grand Master Accreditation with Highest Honors."
        ]
    }
]

for i, p in enumerate(parts):
    spec_meta = specs_data[i]
    code_hash = hashlib.sha256(p["code"].encode("utf-8")).hexdigest()
    
    steps = [
        {"at": "intro", "caption": spec_meta["captions"][0]},
        {"at": "inspect", "caption": spec_meta["captions"][1]},
        {"at": "compare", "caption": spec_meta["captions"][2]},
        {"at": "verify", "caption": spec_meta["captions"][3]},
    ]
    
    # Assert zero digits in captions
    for step in steps:
        assert not re.search(r'\d', step["caption"]), f"Digit found in caption: {step['caption']}"
    
    entry = {
        "partTitle": p["title"],
        "codeHash": code_hash,
        "spec": {
            "template": "compare",
            "title": spec_meta["title"],
            "left": {
                "label": spec_meta["left_label"],
                "content": spec_meta["left_content"]
            },
            "right": {
                "label": spec_meta["right_label"],
                "content": spec_meta["right_content"]
            },
            "steps": steps
        }
    }
    entries.append(entry)

prompt_content = json.dumps(entries, sort_keys=True)
prompt_sha = hashlib.sha256(prompt_content.encode("utf-8")).hexdigest()

envelope = {
    "schemaVersion": 2,
    "course": "cyber",
    "prefix": "cyber",
    "day": 60,
    "promptSha": prompt_sha,
    "entries": entries
}

out_path = "src/lib/data/lessonVisuals/cyber/day-60.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Generated {out_path} successfully! Zero-digit check PASSED.")
