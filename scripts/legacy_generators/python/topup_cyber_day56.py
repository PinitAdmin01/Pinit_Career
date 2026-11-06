# scripts/topup_cyber_day56.py

with open("scripts/create_cyber_day56_data.py", "r", encoding="utf-8") as f:
    content = f.read()

# Top up say_p2
p2_add = '''    "Moreover, sovereign data diodes eliminate the entire class of vulnerabilities associated with software-based firewalls, including zero-day packet parsing exploits, buffer overflows in stateful inspection engines, and configuration drift. Because the physical medium itself permits only single-direction photon flow, no malicious firmware modification or compromised operating system kernel on the receiver can force the diode to transmit data backward. This physical immutability makes data diodes the gold standard for high-consequence operational technology and classified intelligence fabrics.",
    "Engineers designing sovereign data diode pipelines must also account for asynchronous reliable transport. Because traditional TCP handshakes and ACK packets cannot travel backward through the diode, the transport layer relies on forward error correction (FEC), redundant packet transmission, and cryptographically signed batch manifests verified by the receiving enclave.",'''

# Top up say_p3
p3_add = '''    "In addition to tamper-responsiveness, enterprise HSM architectures mandate multi-party split-knowledge controls (such as Shamir Secret Sharing or M-of-N quorum authorization). Under M-of-N quorum controls, no single rogue engineer, cloud administrator, or compromised corporate credential can authorize the export or destruction of master keys. At least three out of five designated cryptographic key custodians must physically insert their hardware smart cards and supply individual passphrases simultaneously to authorize sensitive key administration operations.",
    "Furthermore, hardware security modules generate high-entropy true random numbers via physical quantum noise diodes rather than pseudo-random software algorithms. This guarantees that encryption keys cannot be predicted or reversed through mathematical cryptanalysis or PRNG state reproduction attacks.",'''

# Top up say_p4
p4_add = '''    "To prevent identity forging, SPIFFE IDs are issued dynamically by SPIRE (the SPIFFE Runtime Environment) agents running on each cluster node. The SPIRE agent verifies the container's platform credentials—such as Kubernetes service account tokens, Docker container cgroup labels, and Linux namespace IDs—before issuing a short-lived SVID (SPIFFE Verifiable Identity Document). This guarantees that compromised containers cannot spoof another service's identity, maintaining total identity integrity across the cluster.",
    "Additionally, micro-perimeters enforce continuous behavioral anomaly detection. Even after mutual TLS authentication succeeds, eBPF probes inspect network call frequency, payload size distributions, and RPC method invocations to instantly detect compromised internal workloads attempting abnormal internal queries or data collection.",'''

# Top up say_p5
p5_add = '''    "As modern sovereign platforms operate across distributed jurisdictions, the platform benchmark also continuously audits cryptographic agility. By supporting automated certificate rotation, dynamic cipher negotiation, and post-quantum cryptographic primitives (such as ML-KEM and ML-DSA), the platform ensures that sovereign enclaves remain resilient against future quantum cryptanalysis threats while adhering to immediate Zero Trust Architecture mandates.",
    "Ultimately, the production sovereign mesh represents the convergence of hardware physics, cryptographic mathematics, and decentralized identity governance. Rather than hoping perimeter walls hold against determined nation-state adversaries, the sovereign platform operates under the pragmatic assumption that individual nodes will be breached, guaranteeing that lateral movement is mathematically impossible and sensitive state assets remain perpetually secure.",'''

# Insert additions before the snippet explanation lines
content = content.replace(
    '    "In the TypeScript snippet below, we implement the SovereignAirGapDiode class',
    p2_add + '\n    "In the TypeScript snippet below, we implement the SovereignAirGapDiode class'
)

content = content.replace(
    '    "In the TypeScript snippet below, we implement the SovereignEncryptionController class',
    p3_add + '\n    "In the TypeScript snippet below, we implement the SovereignEncryptionController class'
)

content = content.replace(
    '    "In the TypeScript snippet below, we implement the MicroPerimeterMesh class',
    p4_add + '\n    "In the TypeScript snippet below, we implement the MicroPerimeterMesh class'
)

content = content.replace(
    '    "In the TypeScript snippet below, we implement the ProductionSovereignMeshPlatform class',
    p5_add + '\n    "In the TypeScript snippet below, we implement the ProductionSovereignMeshPlatform class'
)

with open("scripts/create_cyber_day56_data.py", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated create_cyber_day56_data.py with topup text!")
