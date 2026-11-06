import json
import hashlib
import re
import os

STOP_WORDS = {
    'this', 'that', 'with', 'from', 'have', 'were', 'what', 'when', 'your', 'will',
    'then', 'them', 'they', 'some', 'each', 'also', 'just', 'into', 'only', 'more',
    'here', 'make', 'like', 'than', 'been', 'there', 'their', 'which', 'about', 'would',
    'could', 'should', 'other', 'these', 'those', 'after', 'first', 'where', 'while',
    'being', 'does', 'doing', 'look', 'same', 'over', 'such', 'most'
}

def get_important_words(text):
    words = re.findall(r'[a-z0-9]+', text.lower())
    return {w for w in words if len(w) >= 4 and w not in STOP_WORDS}

with open("scripts/branch_c/day32_lesson.json", "r", encoding="utf-8") as f:
    lesson = json.load(f)

entries = []

captions_data = [
    # Part 1
    {
        "say1": "Flow network models directed edge bandwidth capacity.",
        "say2": "Flow conservation balances incoming and outgoing transit rates.",
        "example": "Content distribution network routes video streaming traffic.",
        "tryIt": "Transit edge adjustments verify continuous flow conservation."
    },
    # Part 2
    {
        "say1": "Residual graph models remaining available transmission capacity.",
        "say2": "Backward edges allow redirecting previously committed flow.",
        "example": "Service provider routes data through parallel fiber links.",
        "tryIt": "Inspecting residual map verifies backward flow capacity."
    },
    # Part 3
    {
        "say1": "Breadth search selects shortest path with fewest edges.",
        "say2": "Monotonic distance bounds total augmentation cycles.",
        "example": "Core switching centers calculate maximum call routing capacity.",
        "tryIt": "Execution queue prioritizes shortest augmenting path."
    },
    # Part 4
    {
        "say1": "Circulation networks balance multiple sources and sinks.",
        "say2": "Super source reduction aggregates distributed producer supplies.",
        "example": "Pipeline transfers telemetry to distributed storage warehouses.",
        "tryIt": "Transformed demand values match consumer capacity limits."
    },
    # Part 5
    {
        "say1": "Enterprise optimizer computes maximum throughput transit routes.",
        "say2": "High performance adjacency representation accelerates sweeps.",
        "example": "Platform deploys optimizer to manage gateway replication.",
        "tryIt": "Increasing conduit capacity reveals upstream network bottlenecks."
    }
]

table_specs = [
    # Part 1 Table Spec
    {
        "columns": ["Network Link", "Maximum Capacity", "Assigned Flow", "Conservation Status"],
        "rows_step1": [
            ["Source -> TransitA", "Ten Units", "Seven Units", "Capacity Bounded"],
            ["Source -> TransitB", "Ten Units", "Five Units", "Capacity Bounded"]
        ],
        "rows_step2": [
            ["TransitA Node", "Seven Inflow", "Seven Outflow", "Strict Equilibrium"],
            ["TransitB Node", "Six Inflow", "Six Outflow", "Strict Equilibrium"]
        ],
        "rows_step3": [
            ["Origin Storage", "Source Hub", "Twelve Dispatched", "Delivery Valid"],
            ["Edge Consumers", "Sink Terminal", "Twelve Received", "Balanced Intake"]
        ],
        "rows_step4": [
            ["TransitA -> Sink", "Eight Units", "Six Units", "Headroom Intact"],
            ["TransitB -> Sink", "Ten Units", "Six Units", "Throughput Certified"]
        ]
    },
    # Part 2 Table Spec
    {
        "columns": ["Conduit Pair", "Forward Residual", "Backward Residual", "State Action"],
        "rows_step1": [
            ["Channel S to A", "Three Units Available", "Seven Units Pushed", "Augment Active"],
            ["Channel A to T", "Zero Units Available", "Seven Units Pushed", "Link Saturated"]
        ],
        "rows_step2": [
            ["Backward Channel A to S", "Rollback Buffer", "Reversible Units", "Path Alternation"],
            ["Forward Channel S to B", "Positive Headroom", "Zero Committed", "Viable Forward"]
        ],
        "rows_step3": [
            ["Primary Fiber Trunk", "Bottleneck Reached", "Full Capacity", "Reroute Triggered"],
            ["Secondary Fiber Path", "Available Headroom", "Partial Flow", "Active Intake"]
        ],
        "rows_step4": [
            ["Augmented Topology", "Residual Updated", "Conservation Maintained", "Optimal Allocation"],
            ["Rollback Mechanism", "No Packet Loss", "Dynamic Reversal", "Verified Robust"]
        ]
    },
    # Part 3 Table Spec
    {
        "columns": ["Traversal Step", "Search Metric", "Bottleneck Capacity", "Algorithmic Bound"],
        "rows_step1": [
            ["Breadth Search Wave", "Fewest Edge Count", "Four Units Added", "Polynomial Guarantee"],
            ["Queue Ordering", "Level By Level", "Direct Route First", "Monotonic Distance"]
        ],
        "rows_step2": [
            ["Critical Edge Cut", "Residual Exhausted", "Bottleneck Equal", "Edge Drop Trigger"],
            ["Distance Increase", "Two Step Growth", "Source Monotonicity", "Bounded Criticality"]
        ],
        "rows_step3": [
            ["Chicago to Toledo", "First Hop", "Ten Units Dispatched", "Fast Saturation"],
            ["Toledo to New York", "Second Hop", "Four Units Delivered", "Immediate Path Done"]
        ],
        "rows_step4": [
            ["Edmonds Karp Loop", "Two Augmentations", "Thirteen Units Total", "Polynomial Stop"],
            ["Complexity Ceiling", "Vertex Times Edges", "Order V Times E Sq", "Optimal Scaling"]
        ]
    },
    # Part 4 Table Spec
    {
        "columns": ["Transformation Stage", "Node Category", "Capacity Formula", "Feasibility Status"],
        "rows_step1": [
            ["Super Source Addition", "Multiple Producers", "Sum Supply Limits", "Unification Done"],
            ["Super Sink Addition", "Multiple Consumers", "Sum Demand Limits", "Unification Done"]
        ],
        "rows_step2": [
            ["Lower Bound Offset", "Transit Conduit", "Cap Minus Lower", "Shifted Zero Base"],
            ["Node Net Demands", "Intermediate Junction", "Inflow Outflow Sum", "Demand Adjusted"]
        ],
        "rows_step3": [
            ["Ingestion Gateways", "Three Data Sources", "Super Source Bound", "Active Streaming"],
            ["Lake Warehouses", "Four Sink Targets", "Super Sink Bound", "Intake Monitored"]
        ],
        "rows_step4": [
            ["Demand Sum Equality", "Positive Demands", "Super Source Saturated", "Feasible Circulation"],
            ["Reconstructed Mesh", "Original Bounds Added", "Optimal Conservation", "Complete Delivery"]
        ]
    },
    # Part 5 Table Spec
    {
        "columns": ["Pipeline Conduit", "Ingress Gbps", "Egress Gbps", "Health Classification"],
        "rows_step1": [
            ["Ingress to EdgeRouterA", "Forty Allocated", "Forty Saturated", "Critical Bottleneck"],
            ["Ingress to EdgeRouterB", "Twenty Allocated", "Ten Headroom", "Viable Reserve"]
        ],
        "rows_step2": [
            ["EdgeRouterA to MeshAlpha", "Twenty Five Pushed", "Twenty Five Saturated", "Full Utilization"],
            ["CoreMeshBeta to Egress", "Thirty Five Pushed", "Thirty Five Saturated", "Minimum Cut Bound"]
        ],
        "rows_step3": [
            ["Virginia Ingress Hub", "Sixty Gbps Dispatched", "Zero Packet Drop", "High Throughput"],
            ["Frankfurt Egress Hub", "Sixty Gbps Delivered", "Exact Conservation", "SLA Compliant"]
        ],
        "rows_step4": [
            ["Kernel eBPF Telemetry", "Wire Speed Counters", "Thirty Second Window", "Proactive Alert"],
            ["Autonomous Controller", "Multi Path Allocation", "Zero Downtime Route", "Optimal State"]
        ]
    }
]

for idx, part in enumerate(lesson["parts"]):
    caps = captions_data[idx]
    tbl = table_specs[idx]
    
    # Check say1 (attached to part.say[0])
    w_cap = get_important_words(caps["say1"])
    w_text = get_important_words(part["say"][0])
    shared_say1 = w_cap.intersection(w_text)
    assert len(shared_say1) >= 1, f"Part {idx+1} say1 shares {len(shared_say1)} words: {shared_say1}"
    assert len(caps["say1"]) <= 75 and caps["say1"].endswith('.') and not re.search(r'\d', caps["say1"])
    
    # Check say2 (attached to part.say[1])
    w_cap = get_important_words(caps["say2"])
    w_text = get_important_words(part["say"][1])
    shared_say2 = w_cap.intersection(w_text)
    assert len(shared_say2) >= 1, f"Part {idx+1} say2 shares {len(shared_say2)} words: {shared_say2}"
    assert len(caps["say2"]) <= 75 and caps["say2"].endswith('.') and not re.search(r'\d', caps["say2"])
    
    # Check example
    w_cap = get_important_words(caps["example"])
    w_text = get_important_words(part["example"])
    shared_ex = w_cap.intersection(w_text)
    assert len(shared_ex) >= 1, f"Part {idx+1} example shares {len(shared_ex)} words: {shared_ex}"
    assert len(caps["example"]) <= 75 and caps["example"].endswith('.') and not re.search(r'\d', caps["example"])
    
    # Check tryIt
    w_cap = get_important_words(caps["tryIt"])
    w_text = get_important_words(part["tryIt"])
    shared_try = w_cap.intersection(w_text)
    assert len(shared_try) >= 1, f"Part {idx+1} tryIt shares {len(shared_try)} words: {shared_try}"
    assert len(caps["tryIt"]) <= 75 and caps["tryIt"].endswith('.') and not re.search(r'\d', caps["tryIt"])
    
    code_hash = hashlib.sha256(part["code"].encode("utf-8")).hexdigest()
    title_short = part["title"][:40]
    
    spec_obj = {
        "template": "table",
        "title": f"{title_short} Transit Matrix",
        "columns": tbl["columns"],
        "steps": [
            {
                "at": "say1",
                "caption": caps["say1"],
                "rows": tbl["rows_step1"]
            },
            {
                "at": "say2",
                "caption": caps["say2"],
                "rows": tbl["rows_step2"]
            },
            {
                "at": "example",
                "caption": caps["example"],
                "rows": tbl["rows_step3"]
            },
            {
                "at": "tryIt",
                "caption": caps["tryIt"],
                "rows": tbl["rows_step4"]
            }
        ]
    }
    
    entry = {
        "partTitle": part["title"],
        "codeHash": code_hash,
        "filled": spec_obj,
        "spec": spec_obj
    }
    entries.append(entry)

prompt_str = f"Course dsa-optim Day 32: {lesson['title']}"
prompt_sha = hashlib.sha256(prompt_str.encode("utf-8")).hexdigest()

day_visual = {
    "schemaVersion": "2.0.0",
    "prefix": "dsa-optim",
    "day": 32,
    "promptSha": prompt_sha,
    "model": "gemini-2.5-pro",
    "entries": entries
}

out_dir = "src/lib/data/lessonVisuals/dsa-optim"
os.makedirs(out_dir, exist_ok=True)
out_path = os.path.join(out_dir, "day-32.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(day_visual, f, indent=2)

print(f"Generated {out_path} successfully!")
