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

with open("scripts/branch_c/day35_lesson.json", "r", encoding="utf-8") as f:
    lesson = json.load(f)

captions_data = [
    # Part 1
    {
        "say1": "Massive routing infrastructure connects regional aggregation links.",
        "say2": "Hierarchical schedules balance formalizing multi commodity transit flow.",
        "example": "Algorithmic trading feeds traverse regional aggregation interface.",
        "tryIt": "Routing graphs enforce discrete hierarchical attributes on links."
    },
    # Part 2
    {
        "say1": "Augmenting flow paths maximize throughput across transit gateways.",
        "say2": "Reverse residual capacity cancels forward flow along transit edge.",
        "example": "Interface queue monitors uncover bottleneck links for provider.",
        "tryIt": "FlowEdge implementation verifies reachability and peak throughput."
    },
    # Part 3
    {
        "say1": "Link removal increases disconnected components across transit mesh.",
        "say2": "Resilience scanner scores single points of failure across subtree.",
        "example": "Submarine cable powers transatlantic communication across regions.",
        "tryIt": "Resilience implementation provides instantaneous diagnostic reports."
    },
    # Part 4
    {
        "say1": "Transient link flapping introduces control plane jitter during updates.",
        "say2": "Engine creates checkpoint to rollback unpredicted state churn.",
        "example": "Provider controller executes checkpoint rollback shedding payload.",
        "tryIt": "Parent pointers track component unions with instantaneous recovery."
    },
    # Part 5
    {
        "say1": "Cohesive architecture optimizes throughput removing bottleneck nodes.",
        "say2": "Autonomous infrastructure executes flow augmentation and formulation.",
        "example": "Secondary peering gateway absorbs broadcast traffic for provider.",
        "tryIt": "Verification represents pinnacle of throughput and resilience engineering."
    }
]

table_steps_data = [
    # Part 1
    {
        "columns": ["Transit Tier", "Capacity Bandwidth", "Operational Delay"],
        "rows_step1": [["Core Tier 1", "400 Gbps Trunk", "12 ms Target"], ["Aggregation Tier 2", "200 Gbps Trunk", "5 ms Target"]],
        "rows_step2": [["Edge Ingress Tier 3", "100 Gbps Interface", "2 ms Target"], ["Egress GW Tier 3", "250 Gbps Interface", "4 ms Target"]],
        "rows_step3": [["Algorithmic Trading", "High Priority Feed", "Sub-millisecond"], ["Ledger Sync Pipeline", "Bulk Capacity Channel", "5 ms SLA"]],
        "rows_step4": [["Tarjan SCC Cluster", "Cyclic Loop Pruning", "Acyclic Domain"], ["Capacity Verification", "1350 Gbps Aggregate", "Non-blocking Routing"]]
    },
    # Part 2
    {
        "columns": ["Residual Interface", "Forward Capacity", "Reverse Residual"],
        "rows_step1": [["Link Ingress to Agg", "120 Gbps Nominal", "0 Gbps Reverse"], ["Link Agg to Core", "100 Gbps Nominal", "0 Gbps Reverse"]],
        "rows_step2": [["Augmented Path 1", "70 Gbps Pushed", "70 Gbps Reverse"], ["Residual Headroom", "30 Gbps Available", "Dynamic Skew Symmetry"]],
        "rows_step3": [["S-T Reachable Set S", "Ingress and Agg Nodes", "Active Reachability"], ["S-T Unreachable T", "Egress Gateway Sink", "Zero Residual Edges"]],
        "rows_step4": [["Bottleneck Link 3-5", "110 Gbps Saturated", "Max-Flow Bottleneck"], ["Bottleneck Link 4-5", "80 Gbps Saturated", "Exact Min-Cut Bound"]]
    },
    # Part 3
    {
        "columns": ["Backbone Link", "Discovery tin", "Low-Link low"],
        "rows_step1": [["Intra-Core Ring 0-1", "Step 1 Timestamp", "Ancestral Back-Edge"], ["Intra-Core Ring 1-2", "Step 2 Timestamp", "Cycle Maintained"]],
        "rows_step2": [["Backbone Trunk 2-3", "Step 3 Timestamp", "Strict Bridge Condition"], ["Subtree Root 3", "Step 4 Timestamp", "Zero Ancestor Edges"]],
        "rows_step3": [["Transatlantic Cable", "London to New York", "Critical Trunk Bridge"], ["Articulation Router", "Router 2 and Router 3", "Cut Vertex Warning"]],
        "rows_step4": [["Resilience Metric", "Partition Vulnerability", "High-Priority SLA"], ["Protection Route", "Secondary Ring Path", "Biconnected Target"]]
    },
    # Part 4
    {
        "columns": ["Router Cluster", "Representative Root", "Subtree Rank"],
        "rows_step1": [["Cluster Alpha 0-1-2", "Router 0 Canonical", "Rank 1 Bound"], ["Cluster Beta 3-4", "Router 3 Canonical", "Rank 1 Bound"]],
        "rows_step2": [["Speculative Link 2-3", "Merged Root 0", "Rank 2 Increment"], ["Checkpoint Recorded", "Undo Stack Entry", "Reversible Delta"]],
        "rows_step3": [["BGP Flap Event", "Link Telemetry Drop", "Control Plane Alert"], ["Rollback Triggered", "Pop Stack Delta", "Restored Invariant"]],
        "rows_step4": [["Pre-Cutover State", "3 Active Components", "Zero Route Leaks"], ["Post-Rollback SLA", "Component Count Intact", "Sub-millisecond Time"]]
    },
    # Part 5
    {
        "columns": ["System Phase", "Flow Throughput", "Bottleneck Capacity"],
        "rows_step1": [["Phase 1 Baseline", "250 Gbps Max Flow", "250 Gbps Min Cut"], ["SPOF Detection", "Link 3-5 and 4-5", "Saturated Egress"]],
        "rows_step2": [["Protection Provision", "Secondary GW 6 Added", "100 Gbps Headroom"], ["Augmented Routing", "Multi-path Divergence", "Balanced Workload"]],
        "rows_step3": [["Phase 2 Enhanced", "270 Gbps Max Flow", "270 Gbps Min Cut"], ["Redundant Egress", "High Availability Mesh", "Zero Dropped Frames"]],
        "rows_step4": [["Verification Result", "Within SLA Envelope", "Deterministic Audit"], ["Telemetry Status", "Autonomous Carrier SLA", "Milestone 7 Pass"]]
    }
]

entries = []

for idx, (caps, tbl) in enumerate(zip(captions_data, table_steps_data)):
    part = lesson["parts"][idx]
    code_hash = hashlib.sha256(part["code"].encode("utf-8")).hexdigest()
    title_short = part["title"][:40]

    spec_obj = {
        "template": "table",
        "title": f"{title_short} Matrix",
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

prompt_str = f"Course dsa-optim Day 35: {lesson['title']}"
prompt_sha = hashlib.sha256(prompt_str.encode("utf-8")).hexdigest()

day_visual = {
    "schemaVersion": "2.0.0",
    "prefix": "dsa-optim",
    "day": 35,
    "promptSha": prompt_sha,
    "model": "gemini-2.5-pro",
    "entries": entries
}

out_dir = "src/lib/data/lessonVisuals/dsa-optim"
os.makedirs(out_dir, exist_ok=True)
out_path = os.path.join(out_dir, "day-35.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(day_visual, f, indent=2)

print(f"Generated {out_path} successfully with {len(entries)} entries!")
