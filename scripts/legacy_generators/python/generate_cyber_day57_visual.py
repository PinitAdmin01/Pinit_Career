# scripts/generate_cyber_day57_visual.py
import json
import hashlib
import re
from scripts.cyber_day57_data import DAY_57_DATA

entries = []
parts = DAY_57_DATA["parts"]

specs_data = [
    {
        "title": "Chaos Security Invariant Validation vs Fragile Static Testing",
        "left_label": "Fragile Static Testing",
        "left_content": [
            "Assumes underlying network, identity, and cloud infrastructure operate without disruption",
            "Fails to identify latent fail-open bugs where services downgrade to unencrypted plaintext",
            "Evaluates security controls only during scheduled annual audit windows",
            "Leaves production vulnerable to catastrophic cascading failures during outages"
        ],
        "right_label": "Chaos Security Engineering",
        "right_content": [
            "Actively injects network latency, credential expiration, and packet corruption into topologies",
            "Empirically proves that systems fail closed, maintaining default-deny authorization",
            "Runs continuous automated experiments in production to reveal architectural weaknesses",
            "Validates that mission-critical security invariants hold under severe operational stress"
        ],
        "captions": [
            "Architectural layout displays continuous chaos security experiment execution pipeline.",
            "Deep operational inspection audits steady-state metrics and security invariant evaluation.",
            "Comparative review demonstrates proactive fault injection preventing catastrophic fail-open vulnerabilities.",
            "Final verification asserts that all security boundaries maintain default-deny enforcement under stress."
        ]
    },
    {
        "title": "eBPF Kernel-Level Fault Injection vs User-Space Mocking",
        "left_label": "User-Space Mocking",
        "left_content": [
            "Mocks application APIs without testing underlying Linux operating system kernel behaviors",
            "Blind to system call race conditions, memory exhaustion, and driver packet drops",
            "Fails to simulate low-level rootkit hooks and malicious debugging intrusions",
            "Cannot validate whether host security agents withstand kernel-level event storms"
        ],
        "right_label": "eBPF Kernel Fault Probing",
        "right_content": [
            "Attaches non-invasive kernel probes directly to system call entrypoints and network drivers",
            "Simulates kernel error codes and drops packets before network stack allocation",
            "Verifies that security daemons deterministically intercept unauthorized debugging syscalls",
            "Guarantees that kernel monitoring sensors remain resilient under extreme event churn"
        ],
        "captions": [
            "Structural overview maps extended Berkeley packet filter probes attached to operating system system calls.",
            "Detailed inspection analyzes kernel error injection and simulated packet corruption.",
            "Comparative analysis illustrates low-level kernel validation surpassing shallow application mocks.",
            "Verification confirms runtime sensor resilience and deterministic interception of unauthorized calls."
        ]
    },
    {
        "title": "Byzantine Fault Tolerant Mesh Consensus vs Centralized Authorization",
        "left_label": "Centralized Authorization",
        "left_content": [
            "Single subverted server can broadcast malicious or forged authorization approvals",
            "Compromised credential revocation node can unilaterally hide active security breaches",
            "Vulnerable to split-brain inconsistencies and insider manipulation attacks",
            "Lacks multi-node cryptographic verification for critical identity state changes"
        ],
        "right_label": "Byzantine Quorum Consensus",
        "right_content": [
            "Requires cryptographic supermajority quorum across independent physical nodes",
            "Verifies private key signatures on every vote, instantly isolating poisoned dispatches",
            "Mathematically guarantees cluster state progression despite malicious subverted participants",
            "Enforces hardware-backed enrollment certifying node identities via physical enclave attestation"
        ],
        "captions": [
            "Diagram maps decentralized Byzantine consensus topology across distributed security nodes.",
            "Deep inspection tracks cryptographic vote signing and threshold quorum verification.",
            "Comparative evaluation demonstrates Byzantine fault tolerance neutralizing subverted insider nodes.",
            "Final verification validates cluster state convergence and permanent isolation of corrupted members."
        ]
    },
    {
        "title": "Autonomous Closed-Loop Self-Healing vs Manual Incident Triage",
        "left_label": "Manual Incident Triage",
        "left_content": [
            "Human analysts take hours to inspect logs, locate infected hosts, and apply firewalls",
            "Nation-state adversaries and automated worms exploit human latency to compromise the network",
            "Manual credential rotation requires complex operational coordination and downtime",
            "Workload eviction and node rebuilding are slow and error-prone during active incidents"
        ],
        "right_label": "Autonomous Self-Healing Mesh",
        "right_content": [
            "Automated orchestrator cordons compromised nodes and evicts clean pods in milliseconds",
            "Instantaneous cryptographic revocation invalidates short-lived certificates and identity tokens",
            "Dynamic microsegmentation policies freeze infected containers while preserving memory for forensics",
            "Cloud auto-scaling groups deploy cryptographically attested golden image replacements automatically"
        ],
        "captions": [
            "Workflow diagram illustrates automated four-stage closed-loop security healing pipeline.",
            "Detailed inspection monitors instantaneous node cordoning, credential revocation, and container isolation.",
            "Comparative review demonstrates sub-second automated healing eliminating human response delays.",
            "Verification certifies pristine cluster restoration and tamper-evident audit ledger generation."
        ]
    },
    {
        "title": "Production Cloud-Native Security Resilience Platform Engine",
        "left_label": "Unverified Cloud Deployments",
        "left_content": [
            "Deployments lack empirical proof of failure behavior during multi-zone cloud outages",
            "Byzantine vulnerabilities remain undetected until exploited by sophisticated adversaries",
            "Self-healing workflows are uncoordinated, resulting in prolonged service downtime",
            "Security posture degrades silently under high-throughput adversarial traffic conditions"
        ],
        "right_label": "Unified Security Resilience Engine",
        "right_content": [
            "Automated chaos pipelines validate steady-state preservation across distributed clusters",
            "Byzantine consensus algorithms ensure reliable authorization during severe node subversion",
            "Closed-loop orchestrators achieve sub-second node cordoning and credential rotation",
            "Comprehensive resilience scoring verifies over ninety-eight percent operational survivability"
        ],
        "captions": [
            "Comprehensive platform schematic details end-to-end cloud-native security resilience engine.",
            "Deep operational inspection benchmarks fault injection, Byzantine quorum, and self-healing latencies.",
            "Comparative analysis highlights battle-tested survivability over fragile unverified cloud architectures.",
            "Formal verification certifies planetary platform resilience accreditation and production readiness."
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
    "day": 57,
    "promptSha": prompt_sha,
    "entries": entries
}

out_path = "src/lib/data/lessonVisuals/cyber/day-57.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Generated {out_path} successfully! Zero-digit check PASSED.")
