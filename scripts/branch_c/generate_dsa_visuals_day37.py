import json
import hashlib
import os

with open("scripts/branch_c/day37_lesson.json", "r", encoding="utf-8") as f:
    lesson = json.load(f)

captions_data = [
    # Part 1
    {
        "say1": "Linear pattern matching eliminates rewinding upon character mismatch.",
        "say2": "Seminal cornerstone defines prefix function for longest proper borders.",
        "example": "Document indexing parser computes border arrays across wiki headers.",
        "tryIt": "Prefix oracle computes borders that expand and contract in linear time."
    },
    # Part 2
    {
        "say1": "Search algorithm discovers pattern occurrences in linear execution time.",
        "say2": "Pattern pointer advances strictly forward without rewinding text indices.",
        "example": "Border firewall inspects transit packet payloads at wire speed.",
        "tryIt": "Matcher executes instantaneous state fallbacks finding exact offset."
    },
    # Part 3
    {
        "say1": "Prefix function uncovers structural string periodicity and symmetries.",
        "say2": "Period border duality determines smallest periodic repetition.",
        "example": "Telemetry pipeline analyzes periodic vibration waveforms from sensor.",
        "tryIt": "Analyzer checks modular divisibility discovering repeating unit."
    },
    # Part 4
    {
        "say1": "Deterministic automaton executes character transitions without loop jitter.",
        "say2": "Prefix automaton maps alphabet characters into state transitions.",
        "example": "Matching engine scans exchange protocol messages via single table lookup.",
        "tryIt": "Simulate stream verifies automaton state transitions and pattern matches."
    },
    # Part 5
    {
        "say1": "Cloud observability architecture monitors streaming logs in real time.",
        "say2": "Matcher processes streaming chunks with deterministic linear throughput.",
        "example": "Proxy daemon detects gateway timeout triggering automated circuit breaker.",
        "tryIt": "Scanner bridges log chunk boundaries preserving active pattern state."
    }
]

table_steps_data = [
    # Part 1
    {
        "columns": ["Prefix Substring", "Longest Proper Border", "Computed Pi Value"],
        "rows_step1": [["Prefix s[0..0] ('a')", "Empty String Set", "0 Integer Border"], ["Prefix s[0..1] ('aa')", "Proper Border 'a'", "1 Integer Border"]],
        "rows_step2": [["Prefix s[0..4] ('aabaa')", "Proper Border 'aa'", "2 Integer Border"], ["Prefix s[0..6] ('aabaaab')", "Proper Border 'aab'", "3 Integer Border"]],
        "rows_step3": [["Document Marker A", "Linear Border Scan", "Inductive Advance"], ["Document Marker B", "Fallback j = pi[j-1]", "O(N) Amortized Pass"]],
        "rows_step4": [["Prefix Function Pi", "Zero Text Backtracking", "Sub-millisecond SLA"], ["Border Array Table", "Deterministic Invariant", "Optimal Precomputation"]]
    },
    # Part 2
    {
        "columns": ["KMP Matching State", "Text Pointer Action", "Pattern Pointer Action"],
        "rows_step1": [["Character Match", "Strict Advance i++", "Pattern Pointer j++"], ["Character Mismatch", "Zero Backtrack Fixed i", "Fallback j = pi[j-1]"]],
        "rows_step2": [["Full Pattern Hit", "Occurrence at i-m+1", "Transition j = pi[m-1]"], ["Streaming Socket", "Monotonic Forward Sweep", "Hardware Buffer Flush"]],
        "rows_step3": [["Transit Packet Scan", "40 Gbps Interface", "Real-time Payload"], ["Malware Signature", "Exact Offset Discovery", "Firewall Intercept"]],
        "rows_step4": [["ReDoS Protection", "Linear O(N+M) Guarantee", "Anti-Denial Exploit"], ["Carrier Execution", "Constant Per-Byte Cost", "Deterministic Safety"]]
    },
    # Part 3
    {
        "columns": ["Periodicity Metric", "Border Array State", "Run-Length Encoding"],
        "rows_step1": [["String 'abcabcabcabc'", "Longest Border pi[11]=9", "Candidate Period k=3"], ["Divisibility Check", "12 mod 3 === 0 Valid", "Repeat Count r=4"]],
        "rows_step2": [["String 'aabaabaabaab'", "Longest Border pi[11]=9", "Candidate Period k=3"], ["Divisibility Check", "12 mod 3 === 0 Valid", "Repeat Count r=4"]],
        "rows_step3": [["Turbine Vibration", "Sinusoidal Waveform", "Sensor Oscillation"], ["Bearing Imbalance", "Periodic Run Flagged", "RLE Compression Pass"]],
        "rows_step4": [["Irregular Sequence", "Border pi[15]=0", "Non-periodic Unit"], ["Period-Border Duality", "Linear O(N) Screening", "Zero False Compressions"]]
    },
    # Part 4
    {
        "columns": ["DFA Transition Phase", "State Function Input", "Output Target State"],
        "rows_step1": [["State 0 on Char 'a'", "Advance to Match Prefix", "Target State 1"], ["State 1 on Char 'b'", "Advance to Match Prefix", "Target State 2"]],
        "rows_step2": [["State 2 on Char 'a'", "Full Pattern Reached", "Target State 3 (Hit)"], ["State 2 on Char 'c'", "Fallback via Pi Array", "Precomputed State 0"]],
        "rows_step3": [["Stock Exchange Feed", "FIX Message Stream", "25 Gbps Interface"], ["Surveillance Rule", "CancelReplaceOrd Alert", "Sub-microsecond SLA"]],
        "rows_step4": [["Memory Architecture", "64-byte Cache Alignment", "Zero DRAM Page Miss"], ["DFA Matrix Lookup", "Single Machine Op", "Hardware Wire Speed"]]
    },
    # Part 5
    {
        "columns": ["Log Surveillance Phase", "Chunk State Transfer", "Incident Telemetry"],
        "rows_step1": [["Ingress Chunk 1", "Initial State j=0", "1 Split Match at 81"], ["Chunk 1 Boundary Exit", "State Saved j=nextState", "Zero Buffer Copy"]],
        "rows_step2": [["Ingress Chunk 2", "Resumed from nextState", "1 Match at Offset 81"], ["Incident Detection", "502_BAD_GATEWAY Found", "CRITICAL Severity Alert"]],
        "rows_step3": [["Circuit Breaker", "Automated Remediation", "Downstream Failover"], ["Prometheus Metric", "OpenTelemetry Stream", "Cluster Histogram Up"]],
        "rows_step4": [["Multi-Core Sharding", "Consistent Hash Ring", "Zero Lock Contention"], ["Streaming Benchmark", ">500 MB/s Core Rate", "Carrier SLA Compliance"]]
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

prompt_str = f"Course dsa-optim Day 37: {lesson['title']}"
prompt_sha = hashlib.sha256(prompt_str.encode("utf-8")).hexdigest()

day_visual = {
    "schemaVersion": "2.0.0",
    "prefix": "dsa-optim",
    "day": 37,
    "promptSha": prompt_sha,
    "model": "gemini-2.5-pro",
    "entries": entries
}

out_dir = "src/lib/data/lessonVisuals/dsa-optim"
os.makedirs(out_dir, exist_ok=True)
out_path = os.path.join(out_dir, "day-37.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(day_visual, f, indent=2)

print(f"Generated {out_path} successfully with {len(entries)} entries!")
