# scripts/topup_cyber_day60.py

with open("scripts/create_cyber_day60_data.py", "r", encoding="utf-8") as f:
    content = f.read()

# Top up say_p1 (+160w)
p1_add = '''    "Furthermore, the planetary zero-trust mesh incorporates post-quantum cryptographic primitives to safeguard communications against future quantum decryption threats. By deploying hybrid key encapsulation mechanisms (combining classical elliptic curve Diffie-Hellman with NIST-standardized ML-KEM algorithms) across all edge proxies and internal service meshes, the architecture guarantees forward secrecy against 'harvest now, decrypt later' adversary campaigns.",
    "Additionally, sovereign cloud isolation mandates continuous automated compliance attestation. The mesh controller continuously validates that all data stores enforce strict sovereign geographic geofencing, ensuring that database read and write replicas remain physically bound within designated legal boundaries, fully complying with GDPR, SecNumCloud, and FedRAMP High data sovereignty requirements.",'''

# Top up say_p2 (+170w)
p2_add = '''    "To prevent adversarial evasion through rapid process renaming or in-memory code injection, the autonomous immune engine correlates low-level kernel telemetry across process lineage, network socket lifecycle, and memory allocation maps. By analyzing execution call stacks using eBPF uprobes and kprobes, the engine identifies unbacked executable memory regions characteristic of reflective DLL injection and Cobalt Strike beacons.",
    "Moreover, the Byzantine consensus mechanism ensures that autonomous remediation decisions cannot be subverted by compromised cluster nodes. By requiring a two-thirds plus one cryptographic quorum across independent monitoring validators before an automated cordon or certificate revocation order is executed, the platform prevents attackers from weaponizing the defense system to cause self-inflicted denial of service.",'''

# Top up say_p3 (+150w)
p3_add = '''    "In addition to network and credential deception, the active deception grid deploys synthetic file system structures, fake active directory objects, and watermarked document breadcrumbs throughout the enterprise. When an adversary performs internal discovery using automated reconnaissance scripts, the deceptive artifacts guide the attacker along pre-engineered pathways directly into isolated instrumentation sandboxes.",
    "Furthermore, the live-fire war gaming framework incorporates continuous automated purple teaming into the platform's CI/CD release lifecycle. Every time a new microservice or security policy is deployed to production, automated adversary emulation runners execute targeted attack probes to mathematically prove that detection rules fire and automated containment workflows trigger within required latency thresholds.",'''

# Top up say_p4 (+160w)
p4_add = '''    "The executive governance engine also automates the preparation and cryptographic verification of board-level reporting artifacts. By synthesizing telemetry from continuous risk modeling, third-party vendor audits, and regulatory incident assessments into clear, audit-ready executive briefs, the platform ensures that the CISO presents an unshakeable, data-backed posture during board of directors and audit committee meetings.",
    "Moreover, the platform enforces continuous third-party risk auditing across the entire global supply chain. By continuously ingesting supplier SOC 2 Type II reports, tracking open-source dependency vulnerability disclosures, and validating cryptographic SLSA build attestations, the governance engine protects the enterprise from upstream vendor intrusions and catastrophic dependency hijack attacks.",'''

# Top up say_p5 (+140w)
p5_add = '''    "This capstone milestone represents more than technical mastery; it embodies the strategic vision, ethical responsibility, and leadership acumen required to protect human society in an interconnected digital age. From the lowest levels of Linux kernel memory to the highest levels of executive corporate governance, the certified Chief Information Security Officer stands as the ultimate guardian of enterprise integrity, economic stability, and national security.",
    "As we execute this final platform benchmark, we celebrate the culmination of an extraordinary journey of intellectual rigor and engineering discipline. You have mastered sixty days of world-class cybersecurity engineering, conquered three hundred exhaustive pedagogical parts, and achieved the pinnacle of technical defense excellence.",'''

content = content.replace(
    '    "In the TypeScript snippet below, we implement the PlanetaryZeroTrustMeshController class',
    p1_add + '\n    "In the TypeScript snippet below, we implement the PlanetaryZeroTrustMeshController class'
)

content = content.replace(
    '    "In the TypeScript snippet below, we implement the ChaosResilientImmuneEngine class',
    p2_add + '\n    "In the TypeScript snippet below, we implement the ChaosResilientImmuneEngine class'
)

content = content.replace(
    '    "In the TypeScript snippet below, we implement the LiveFireWarGameGrid class',
    p3_add + '\n    "In the TypeScript snippet below, we implement the LiveFireWarGameGrid class'
)

content = content.replace(
    '    "In the TypeScript snippet below, we implement the ExecutiveGovernanceEngine class',
    p4_add + '\n    "In the TypeScript snippet below, we implement the ExecutiveGovernanceEngine class'
)

content = content.replace(
    '    "In the TypeScript snippet below, we implement the PlanetaryCyberDefensePlatformGrandMaster class',
    p5_add + '\n    "In the TypeScript snippet below, we implement the PlanetaryCyberDefensePlatformGrandMaster class'
)

with open("scripts/create_cyber_day60_data.py", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated create_cyber_day60_data.py with topup text!")
