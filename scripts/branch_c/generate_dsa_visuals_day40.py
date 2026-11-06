# scripts/branch_c/generate_dsa_visuals_day40.py
import json
import hashlib
import os

with open("scripts/branch_c/day40_lesson.json", "r", encoding="utf-8") as f:
    lesson = json.load(f)

captions_data = [
    # Part 1
    {
        "say1": "Milestone capstone unifies string algorithms into threat engine.",
        "say2": "Threat signatures categorize malicious patterns across taxonomy.",
        "example": "Perimeter firewall correlates threat signatures across packet streams.",
        "tryIt": "Signature registry tracks threat category and severity metrics."
    },
    # Part 2
    {
        "say1": "Multi tier screening filters benign traffic using sliding tokens.",
        "say2": "Rolling hash prefilter identifies candidate threats in streams.",
        "example": "Carrier backbone filter bypasses benign traffic at line rate.",
        "tryIt": "Token prefilter screens payload buffers extracting candidate hits."
    },
    # Part 3
    {
        "say1": "Circular buffer maintains boundary continuity across data packets.",
        "say2": "Network gateway inspects packets maintaining session continuity.",
        "example": "Network sensor inspects segmented payloads across transport boundaries.",
        "tryIt": "Ring buffer retains tail bytes connecting split attack fragments."
    },
    # Part 4
    {
        "say1": "Threat classification engine analyzes payload security telemetry.",
        "say2": "Automaton scanner correlates matched patterns with threat metadata.",
        "example": "Security operations center ingests structured incident alerts.",
        "tryIt": "Automaton scanner extracts threat detections with exact offsets."
    },
    # Part 5
    {
        "say1": "Grand capstone deploys enterprise deep packet inspection engine.",
        "say2": "Inspection engine evaluates packet payload returning verdict.",
        "example": "Cloud defense cluster sanitizes ingress transit streams in real time.",
        "tryIt": "Enterprise engine evaluates simulated network packets and exploits."
    }
]

titles = [
    "Unified Threat Signature Taxonomy.",
    "Multi Tier Packet Screening Architecture.",
    "Circular Ring Buffer Boundary Continuity.",
    "Line Rate Threat Classification Matrix.",
    "Enterprise Deep Packet Inspection Engine."
]

columns_list = [
    ["Signature Category", "Severity Rating", "Pattern Format"],
    ["Inspection Tier", "Screening Mechanism", "Throughput Impact"],
    ["Packet Segment", "Overlap Tail Retention", "Reconstruction Action"],
    ["Detected Exploit Class", "Severity Level", "Mitigation Verdict"],
    ["Engine Pipeline Phase", "Autonomous Decision", "Telemetry Output"]
]

rows_list = [
    [
        ["SQL Injection Exploit", "Critical Severity Rating", "Exact String Pattern"],
        ["Binary Shellcode Sled", "Critical Execution Hazard", "Byte Sequence Signature"]
    ],
    [
        ["Tier One Fast Screening", "Rolling Prefix Token Set", "Sub Nanosecond Bypass"],
        ["Tier Two Deep Scan", "Aho Corasick Automaton", "Exact Threat Pinpointing"]
    ],
    [
        ["Preceding Network Packet", "Trailing Overlap Tail Retained", "Boundary Context Preserved"],
        ["Subsequent Ingress Frame", "Overlap Prepend Operation", "Contiguous String Evaluation"]
    ],
    [
        ["Remote Code Execution", "Critical Exploit Hazard", "Instant Drop Action"],
        ["Anomalous Query Parameter", "Medium Security Alert", "Audit Log Telemetry"]
    ],
    [
        ["Legitimate Packet Scan", "Immediate Allow Forwarding", "Zero Overhead Telemetry"],
        ["Critical Exploit Detection", "Wire Speed Drop Action", "Security Incident Alert"]
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
    "day": 40,
    "promptSha": "dsa-optim-day-40-dpi-capstone-pipeline",
    "model": "gemini-2.5-pro",
    "entries": entries
}

out_dir = r"src/lib/data/lessonVisuals/dsa-optim"
os.makedirs(out_dir, exist_ok=True)
out_path = os.path.join(out_dir, "day-40.json")

with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Generated {out_path} with {len(entries)} visual entries.")
