# scripts/branch_c/generate_dsa_visuals_day59.py
import json
import hashlib
import os

with open("scripts/branch_c/day59_lesson.json", "r", encoding="utf-8") as f:
    lesson = json.load(f)

captions_data = [
    # Part 1
    {
        "say1": "Deliberate randomization delivers optimal performance in algorithms.",
        "say2": "Las vegas and monte carlo paradigms classify randomized algorithms.",
        "example": "Cloud firewall utilizes universal hash function against attackers.",
        "tryIt": "Examine typescript code evaluating linear congruential formula."
    },
    # Part 2
    {
        "say1": "Treap combines binary search tree with randomized priority heap.",
        "say2": "Treap maintains binary search tree and max heap priority invariants.",
        "example": "Matching engine maintains limit orders in self balancing treap.",
        "tryIt": "Examine typescript code rotating nodes to restore priority invariant."
    },
    # Part 3
    {
        "say1": "Skip list achieves logarithmic search performance via forward lanes.",
        "say2": "Ordered linked lists form express lanes determined by coin flips.",
        "example": "Redis sorted set uses skip list for concurrent score lookups.",
        "tryIt": "Examine typescript code linking forward pointers across tower levels."
    },
    # Part 4
    {
        "say1": "Streaming probabilistic structures summarize massive telemetry data.",
        "say2": "Count min sketch estimates event frequency using universal hash rows.",
        "example": "Delivery network monitors requests detecting attacks and unique visitors.",
        "tryIt": "Examine typescript code updating counters and estimating cardinality."
    },
    # Part 5
    {
        "say1": "Enterprise stream telemetry platform analyzes cybersecurity events.",
        "say2": "Enterprise gateways process network traffic identifying attack vectors.",
        "example": "Gateway detects volumetric flood triggering firewall mitigation.",
        "tryIt": "Explore complete stream processor evaluating heavy hitter thresholds."
    }
]

titles = [
    "Randomized Algorithm Paradigms And Universal Hash Matrix.",
    "Treap Cartesian Key Order And Randomized Max Heap Balance.",
    "Skip List Multi Level Probabilistic Forward Pointer Towers.",
    "Count Min Sketch Frequency And HyperLogLog Cardinality Array.",
    "Enterprise Stream Telemetry High Velocity Attack Mitigation."
]

columns_list = [
    ["Algorithm Classification", "Execution Time Model", "Correctness Guarantee"],
    ["Treap Node Key Value", "Randomized Heap Priority", "Tree Rotation Direction"],
    ["Tower Level Index", "Forward Pointer Step", "Coin Flip Probability"],
    ["Universal Hash Row", "Sketch Counter Column", "Probabilistic Frequency Bound"],
    ["Ingress Packet Stream", "Count Min Frequency Score", "Firewall Mitigation Action"]
]

rows_list = [
    [
        ["Las Vegas Paradigm", "Randomized Variable Runtime", "Strict Deterministic Correctness"],
        ["Monte Carlo Paradigm", "Deterministic Bounded Time", "Provable Error Probability Bound"]
    ],
    [
        ["Binary Search Key", "Left Child Smaller Key", "Right Child Greater Key"],
        ["Cartesian Heap Priority", "Single Tree Rotation", "Balanced Logarithmic Height"]
    ],
    [
        ["Express Lane Pointer", "Skip Over Subordinate Nodes", "Staircase Search Descent"],
        ["Geometric Coin Flip", "Promoted Higher Level", "Lock Free Pointer Swap"]
    ],
    [
        ["Pairwise Universal Hash", "Conservative Counter Update", "Minimum Row Noise Filter"],
        ["Leading Zeros Register", "Harmonic Mean Aggregator", "Sub Kilobyte Memory Footprint"]
    ],
    [
        ["Volumetric Flood IP", "Heavy Hitter Limit Exceeded", "Instant Edge Firewall Drop"],
        ["Unique Visitor Session", "HyperLogLog Stream Count", "Continuous Topology Overview"]
    ]
]

entries = []

for idx, part in enumerate(lesson["parts"]):
    code = part["code"]
    code_hash = hashlib.sha256(code.encode("utf-8")).hexdigest()
    caps = captions_data[idx]
    title = titles[idx]
    cols = columns_list[idx]
    rows = rows_list[idx]

    steps = [
        {
            "at": "say1",
            "caption": caps["say1"],
            "rows": rows
        },
        {
            "at": "say2",
            "caption": caps["say2"],
            "rows": rows
        },
        {
            "at": "example",
            "caption": caps["example"],
            "rows": rows
        },
        {
            "at": "tryIt",
            "caption": caps["tryIt"],
            "rows": rows
        }
    ]

    filled_obj = {
        "template": "table",
        "title": title,
        "columns": cols,
        "steps": steps
    }

    entry = {
        "partTitle": part["title"],
        "codeHash": code_hash,
        "filled": filled_obj,
        "spec": filled_obj
    }
    entries.append(entry)

envelope = {
    "schemaVersion": "2.0.0",
    "prefix": "dsa-optim",
    "day": 59,
    "promptSha": "dsa-optim-day-59-randomized-and-probabilistic",
    "model": "gemini-2.5-pro",
    "entries": entries
}

out_dir = r"src/lib/data/lessonVisuals/dsa-optim"
os.makedirs(out_dir, exist_ok=True)
out_path = os.path.join(out_dir, "day-59.json")

with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Generated {out_path} with {len(entries)} visual entries.")
