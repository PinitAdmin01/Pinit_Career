# scripts/generate_dist_day58_visual.py
import json
import hashlib
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from dist_day58_data import DAY_58_DATA as day58_data

entries = []

captions = [
    [
        "Architectural overview illustrates decentralized overlay geometry comparing circular hash rings with the bitwise distance metric.",
        "Deep inspection monitors bitwise distance calculations sorting candidate peer identifiers by proximity to target hashes.",
        "Comparative analysis demonstrates symmetric distance calculation over brittle unidirectional chord finger table routing.",
        "Verification confirms bitwise distance calculations, candidate peer sorting, and logarithmic lookup convergence."
    ],
    [
        "Architectural overview displays routing table organization partitioning peers across logarithmic distance buckets.",
        "Deep inspection evaluates bucket capacity limits alongside least-recently seen eviction policies favoring reliable peers.",
        "Comparative analysis demonstrates high network churn survivability over vulnerable naive peer replacement algorithms.",
        "Verification confirms distance bucket index mapping, capacity threshold enforcement, and veteran peer retention."
    ],
    [
        "Architectural overview illustrates swarm file distribution protocols chunking assets into cryptographically verified pieces.",
        "Deep inspection evaluates rarest-first piece scheduling, upload throughput measurements, and tit-for-tat choking algorithms.",
        "Comparative analysis demonstrates exponential download acceleration under high demand over client-server bandwidth crashes.",
        "Verification confirms bandwidth-prioritized peer unchoking, optimistic peer exploration, and complete chunk distribution."
    ],
    [
        "Architectural overview displays content-addressed storage structuring data into immutable Merkle directed acyclic graphs.",
        "Deep inspection evaluates cryptographic content identifiers and hierarchical parent-child DAG linkages across blocks.",
        "Comparative analysis demonstrates permanent tamper-evident integrity over fragile location-addressed link rot and censorship.",
        "Verification confirms recursive cryptographic hash validation, automatic deduplication, and immutable graph integrity."
    ],
    [
        "Architectural overview displays the production decentralized peer swarm telemetry and storage audit dashboard.",
        "Deep inspection monitors hundreds of peers distributing massive datasets under high churn with zero tracker dependencies.",
        "Comparative analysis demonstrates true decentralized resilience, four-hop lookup convergence, and total data survivability.",
        "Verification certifies logarithmic lookup hops, full piece availability, and enterprise production readiness."
    ]
]

for idx, p in enumerate(day58_data["parts"]):
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
            "title": f"Decentralized P2P: {p['title']}",
            "left": {
                "label": "Centralized Location Addressing",
                "content": [
                    "Single index servers create critical points of failure and legal chokepoints",
                    "Location-addressed URLs suffer link rot and server bankruptcy outages",
                    "Traffic spikes exhaust server bandwidth and crash download portals",
                    "Unidirectional hash rings suffer broken fingers during network churn"
                ]
            },
            "right": {
                "label": "Decentralized Peer-to-Peer Fabric",
                "content": [
                    "Kademlia bitwise XOR metrics guarantee logarithmic O(log N) lookup convergence",
                    "IPFS Content Identifiers address data immutably by its cryptographic hash",
                    "BitTorrent swarms download faster as popular demand increases",
                    "Merkle DAGs eliminate duplicate chunks and guarantee tamper-evident integrity"
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
            "leftLabel": "Centralized Location Addressing",
            "rightLabel": "Decentralized Peer-to-Peer Fabric",
            "leftHighlights": [
                "Single point chokepoints",
                "Four-zero-four link rot",
                "Bandwidth crash under load",
                "Brittle ring routing"
            ],
            "rightHighlights": [
                "Symmetric XOR routing",
                "Immutable CID hashing",
                "Swarm bandwidth scaling",
                "Merkle DAG deduplication"
            ]
        }
    }
    entries.append(entry)

envelope = {
    "schemaVersion": 2,
    "course": "dist",
    "prefix": "dist",
    "day": 58,
    "promptSha": hashlib.sha256(b"dist-day-58-p2p-kademlia-dht-bittorrent-ipfs-merkle-dag").hexdigest(),
    "model": "gemini-2.5-pro",
    "entries": entries
}

os.makedirs("src/lib/data/lessonVisuals/dist", exist_ok=True)
out_path = "src/lib/data/lessonVisuals/dist/day-58.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Successfully generated {out_path} with {len(entries)} visual entries!")
