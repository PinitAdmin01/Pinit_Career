# scripts/generate_cyber_day56_visual.py
import json
import hashlib
import re
from scripts.cyber_day56_data import DAY_56_DATA

entries = []
parts = DAY_56_DATA["parts"]

specs_data = [
    {
        "title": "BeyondCorp Context-Aware Gateway vs Legacy VPN Perimeter",
        "left_label": "Legacy VPN Perimeter",
        "left_content": [
            "Network location grants implicit corporate trust across the entire internal network",
            "Single compromised credential allows broad lateral movement across internal microservices",
            "Zero continuous device health auditing after initial network tunnel establishment",
            "Static perimeter firewall blind to dynamic device posture and endpoint telemetry"
        ],
        "right_label": "BeyondCorp Identity-Aware Gateway",
        "right_content": [
            "Location does not equal trust; every request requires cryptographic context evaluation",
            "Mutual TLS client certificates and hardware security keys enforce strict user identity",
            "Continuous endpoint health auditing validates disk encryption and active EDR status",
            "Dynamic context-aware policies terminate unauthorized sessions at the public edge"
        ],
        "captions": [
            "Architectural overview contrasts context-aware zero-trust access against legacy perimeter networks.",
            "Deep inspection validates cryptographic client certificates, user identity, and endpoint posture.",
            "Comparative evaluation demonstrates dynamic identity proxies preventing unauthorized network lateral traversal.",
            "Verification confirms perimeterless gateway policy enforcement, telemetry auditing, and session termination."
        ]
    },
    {
        "title": "Photonic Hardware Data Diode vs Bidirectional Firewall",
        "left_label": "Bidirectional Software Firewall",
        "left_content": [
            "Software stack vulnerable to zero-day packet parsing exploits and buffer overflows",
            "Bidirectional TCP return paths allow compromised systems to establish reverse command shells",
            "Operational technology enclaves exposed to malware command-and-control backchannels",
            "Configuration drift can inadvertently open outbound egress ports to the internet"
        ],
        "right_label": "Unidirectional Photonic Data Diode",
        "right_content": [
            "Physical fiber-optic link allows light to propagate in only a single physical direction",
            "Absence of return optical detector mathematically prevents reverse data exfiltration",
            "Protocol breaks terminate external connections and sanitize incoming payload formats",
            "High-security enclaves receive critical threat telemetry without compromising physical isolation"
        ],
        "captions": [
            "Architectural diagram illustrates physical photonic isolation separating untrusted networks from sovereign enclaves.",
            "Detailed inspection analyzes unidirectional optical transmission and automated protocol payload stripping.",
            "Comparative analysis highlights absolute physical unidirectionality over vulnerable stateful software inspection engines.",
            "Final verification asserts mathematical impossibility of reverse command channels or exfiltration paths."
        ]
    },
    {
        "title": "Dedicated Sovereign HSM Key Sovereignty vs Cloud-Managed KMS",
        "left_label": "Cloud-Provider Managed KMS",
        "left_content": [
            "Master encryption keys stored within multi-tenant cloud service provider memory systems",
            "Foreign government subpoenas can compel cloud providers to decrypt sensitive customer data",
            "Key destruction across distributed multi-tenant storage media is legally unverified",
            "Lack of physical cryptographic boundary leaves master keys subject to hypervisor compromise"
        ],
        "right_label": "Sovereign FIPS Level Three HSM",
        "right_content": [
            "Master cryptographic keys generated and retained exclusively within on-premises HSM hardware",
            "Physical micro-wire tamper sensor grids zeroize volatile RAM in nanoseconds upon intrusion",
            "Hold Your Own Key model prevents cloud providers from ever possessing plaintext master keys",
            "Cryptographic shredding instantly renders petabytes of distributed ciphertext mathematically unrecoverable"
        ],
        "captions": [
            "Architectural layout details sovereign hardware security modules and envelope key hierarchy.",
            "Deep inspection tracks multi-party split-knowledge controls and physical tamper response sensors.",
            "Comparative review demonstrates customer-held keys preventing foreign extraterritorial jurisdictional disclosure.",
            "Verification certifies instantaneous cryptographic shredding rendering distributed cloud ciphertext permanently unrecoverable."
        ]
    },
    {
        "title": "Micro-Perimeter SPIFFE Identity vs Coarse Enterprise VLANs",
        "left_label": "Coarse Enterprise VLANs",
        "left_content": [
            "Broad subnets allow unencrypted plaintext communication between internal microservices",
            "Perimeter breach exposes all adjacent databases and workloads to sniffing and ARP poisoning",
            "Lacks fine-grained cryptographic workload attestation between ephemeral containers",
            "Direct network routes permit compromised web frontends to query cardholder vaults"
        ],
        "right_label": "Cryptographic Micro-Perimeters",
        "right_content": [
            "Every container operates inside an isolated micro-segment with default-deny network rules",
            "Mutual TLS handshakes enforce short-lived SPIFFE verifiable identity documents for all traffic",
            "FIPS-grade cipher suites guarantee end-to-end forward secrecy across all internal communications",
            "Cryptographic zoning mathematically blocks direct ingress connections into sensitive compliance vaults"
        ],
        "captions": [
            "Structural overview maps micro-perimeter boundaries surrounding independent cloud-native container workloads.",
            "Detailed inspection validates mutual TLS handshake parameters and ephemeral cryptographic certificates.",
            "Comparative evaluation shows granular identity segmentation preventing lateral pivot across corporate tiers.",
            "Final verification confirms kernel-level packet filtering enforcing strict default-deny zoning policies."
        ]
    },
    {
        "title": "Production Sovereign Zero-Trust Mesh Platform Engine",
        "left_label": "Uncoordinated Defensive Silos",
        "left_content": [
            "Fragmented access gateways fail to correlate endpoint posture with cloud permissions",
            "Sovereign data boundaries lack hardware diode enforcement, risking regulatory penalties",
            "Keys held by multiple disparate cloud vendors without unified cryptographic governance",
            "Unmonitored service mesh routes allow unauthorized cross-zone data transfer"
        ],
        "right_label": "Unified Sovereign Zero-Trust Mesh",
        "right_content": [
            "BeyondCorp gateway continuously enforces multi-factor authentication and device certificates",
            "Photonic diodes guarantee immutable unidirectional telemetry ingestion into sovereign enclaves",
            "FIPS-compliant HSM infrastructure enforces customer key custody and cryptographic shredding",
            "SPIFFE-attested micro-perimeters and eBPF kernel rules block unauthorized lateral communications"
        ],
        "captions": [
            "Comprehensive platform architecture displays fully integrated sovereign zero-trust defense mesh.",
            "Deep operational inspection tracks multi-checkpoint evaluation across identity, diodes, and cryptography.",
            "Comparative review demonstrates cohesive planetary defense posture versus fragmented legacy perimeter solutions.",
            "Formal verification validates full operational readiness across all international data sovereignty frameworks."
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
    "day": 56,
    "promptSha": prompt_sha,
    "entries": entries
}

out_path = "src/lib/data/lessonVisuals/cyber/day-56.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Generated {out_path} successfully! Zero-digit check PASSED.")
