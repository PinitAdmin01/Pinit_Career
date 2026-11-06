# scripts/branch_c/generate_dsa_visuals_day50.py
import json
import hashlib
import os

with open("scripts/branch_c/day50_lesson.json", "r", encoding="utf-8") as f:
    lesson = json.load(f)

captions_data = [
    # Part 1
    {
        "say1": "Advanced data structures mark culmination of algorithmic optimization.",
        "say2": "Capstone milestone synthesizes algorithmic theory into planetary systems.",
        "example": "Global cloud hyperscaler networks model continental fiber spans.",
        "tryIt": "Examine typescript code modeling multi region backbone with core regions."
    },
    # Part 2
    {
        "say1": "Dynamic allocation of bandwidth deploys highest label preflow push.",
        "say2": "Push relabel operates through localized fluid relaxation models.",
        "example": "International streaming surges spike traffic demands across transit hubs.",
        "tryIt": "Examine typescript code simulating dynamic bandwidth dispatch across hubs."
    },
    # Part 3
    {
        "say1": "Carrier grade resilience integrates real time minimum cut telemetry.",
        "say2": "Undersea fiber cut updates edge capacity executing residual reachability.",
        "example": "Submarine earthquake in pacific severs critical undersea fiber spans.",
        "tryIt": "Examine typescript code simulating fiber severance and minimum cut."
    },
    # Part 4
    {
        "say1": "Multi tenant admission deploys maximum bipartite matching reductions.",
        "say2": "Broker models tenant admission as bipartite graph connecting fiber slots.",
        "example": "Enterprise cloud marketplace matches reservation requests for channels.",
        "tryIt": "Examine typescript code matching enterprise tenant reservation requests."
    },
    # Part 5
    {
        "say1": "Milestone capstone unifies subsystems into enterprise bandwidth broker.",
        "say2": "Enterprise bandwidth broker functions as autonomous cloud clearinghouse.",
        "example": "Cloud consortium deploys bandwidth broker managing transoceanic links.",
        "tryIt": "Explore enterprise bandwidth broker class building transoceanic mesh."
    }
]

titles = [
    "Planetary Transoceanic Interconnect Backbone Model.",
    "Highest Label Preflow Push Multi Terabit Allocation.",
    "Undersea Fiber Severance Minimum Cut Bottleneck Table.",
    "Bipartite Tenant Channel Matching Allocation Matrix.",
    "Enterprise Bandwidth Broker Planetary Governance."
]

columns_list = [
    ["Planetary Transit Hub", "Interconnect Ingress Egress", "Optical Carrier Throughput"],
    ["Active Transit Node", "Current Height Bucket", "Discharge Bandwidth Delta"],
    ["Subsea Cable Segment", "Severance Failure State", "Surviving Bottleneck Cut"],
    ["Tenant Reservation Class", "Requested Carrier Channel", "Matching Allocation Status"],
    ["Broker Operations Metric", "Algorithmic Foundation", "Planetary Infrastructure Output"]
]

rows_list = [
    [
        ["Ashburn Continental Origin", "Primary Ingress Super Gateway", "Continuous Non Blocking Inflow"],
        ["Tokyo Transpacific Terminal", "Egress Egress Aggregation Hub", "Terabit Scale Regional Delivery"]
    ],
    [
        ["Highest Altitude Router", "Maximum Height Level", "Downward Fluid Energy Cascade"],
        ["Intermediate Switch Hub", "Local Elevation Relabeled", "Backpressure Flow Regulation"]
    ],
    [
        ["Transpacific Cable System", "Severed Optical Strands", "Alternative Terrestrial Bypass"],
        ["Surviving Terrestrial Link", "Saturated Capacity Limit", "Critical Min Cut Bottleneck"]
    ],
    [
        ["High Frequency Trading", "Dedicated Low Latency Fiber", "Direct Optical Path Matched"],
        ["Media Streaming Pipeline", "High Bandwidth Elastic Slot", "Conflict Free Channel Reserved"]
    ],
    [
        ["Dynamic Capacity Trading", "Highest Label Preflow Push", "Continuous Multi Terabit Yield"],
        ["Fault Tolerant Recovery", "Residual Min Cut Reachability", "Sub Second Disaster Remediated"]
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
    "day": 50,
    "promptSha": "dsa-optim-day-50-milestone-10-capstone-pipeline",
    "model": "gemini-2.5-pro",
    "entries": entries
}

out_dir = r"src/lib/data/lessonVisuals/dsa-optim"
os.makedirs(out_dir, exist_ok=True)
out_path = os.path.join(out_dir, "day-50.json")

with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Generated {out_path} with {len(entries)} visual entries.")
