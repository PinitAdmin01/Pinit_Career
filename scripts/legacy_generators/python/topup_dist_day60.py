# scripts/topup_dist_day60.py

content = open("scripts/create_dist_day60_data.py", "r", encoding="utf-8").read()

p2_extra = """    "Seventh, Continuous Asynchronous Edge-to-Core Garbage Collection and Merkle Tree Delta Sync: In addition to streaming individual CRDT mutations, edge PoPs and regional consensus hubs execute background anti-entropy reconciliation protocols using Merkle Trees and Bloom filters. Every five minutes, edge nodes compare cryptographic hash trees of local state against the regional core. Any missing or out-of-order mutations resulting from intermittent packet drops are detected and backfilled instantly over compressed TLS streams, ensuring complete mathematical state convergence across all global edge nodes without placing overhead on active user transaction paths.",
"""

p3_extra = """    "Eighth, Automated Cryptographic Certificate Lifecycle and Emergency Revocation: In a planetary grid with tens of thousands of ephemeral service instances, certificate expiration and security revoking cannot rely on manual administrative intervention. The SPIRE agent deployed on each host node continuously polls the central SPIRE server for certificate updates, refreshing X.509 SVID credentials every twelve hours well before their twenty-four-hour expiration. If an anomalous security pattern is detected, the control plane publishes an instantaneous cryptographic Certificate Revocation List (CRL) across the Envoy service mesh, isolating compromised credentials in under three seconds.",
"""

p4_extra = """    "Fifth, Cross-Region Data Resynchronization and Quorum Healing: Once a compromised or disconnected cloud region recovers from a major power or network catastrophe, the planetary self-healing control plane initiates an automated multi-stage Quorum Reintegration Workflow. Rather than overwhelming the newly online region with an uncontrolled flood of read and write traffic, the system keeps the region in an isolated drain state while high-speed Raft snapshot replication streams missing transactional commit logs from healthy peer clusters. Only when the replica's replication lag falls below ten milliseconds does the system re-admit the region into active voting quorum and restore incoming user traffic.",
"""

p5_extra = """    "Seventh, Lifelong Engineering Excellence and Planetary Leadership: The journey through sixty days of distributed systems design is not merely the completion of a curriculum, but the beginning of your journey as a world-class principal systems architect. The patterns, proofs, invariants, and trade-offs you have internalized—from consensus protocols and replication models to low-level hardware performance tuning—will serve as the foundational bedrock for building the next generation of global computing infrastructure.",
"""

# Replace in content
content = content.replace(
    '    "In the TypeScript snippet below, we implement the HybridStateSynchronizer.',
    f'{p2_extra}    "In the TypeScript snippet below, we implement the HybridStateSynchronizer.'
)

content = content.replace(
    '    "In the TypeScript snippet below, we implement the PlanetarySecurityMesh.',
    f'{p3_extra}    "In the TypeScript snippet below, we implement the PlanetarySecurityMesh.'
)

content = content.replace(
    '    "In the TypeScript snippet below, we implement the PlanetarySelfHealingController.',
    f'{p4_extra}    "In the TypeScript snippet below, we implement the PlanetarySelfHealingController.'
)

content = content.replace(
    '    "In the TypeScript snippet below, we implement the PlanetaryMasterCapstoneAuditor.',
    f'{p5_extra}    "In the TypeScript snippet below, we implement the PlanetaryMasterCapstoneAuditor.'
)

open("scripts/create_dist_day60_data.py", "w", encoding="utf-8").write(content)
print("Updated scripts/create_dist_day60_data.py with top-ups.")
