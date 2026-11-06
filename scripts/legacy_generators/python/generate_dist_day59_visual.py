# scripts/generate_dist_day59_visual.py
import json
import hashlib
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from dist_day59_data import DAY_59_DATA as day59_data

entries = []

captions = [
    [
        "Architectural overview illustrates processor cache hierarchies and spatial padding separating independent worker sequences.",
        "Deep inspection monitors memory cache line boundaries preventing cross-core cache coherence invalidation storms.",
        "Comparative analysis demonstrates single-digit nanosecond execution over multi-cycle bus invalidation stalls.",
        "Verification confirms memory padding alignment, zero false sharing across cores, and low latency execution."
    ],
    [
        "Architectural overview displays pre-allocated circular ring buffers eliminating memory allocations during event publishing.",
        "Deep inspection evaluates power-of-two bitmask indexing and atomic sequence barriers coordinating concurrent worker threads.",
        "Comparative analysis demonstrates tens of millions of events per second over blocking operating system mutex queues.",
        "Verification confirms bitmask wrapping, lock-free cursor progression, and deterministic event consumption."
    ],
    [
        "Architectural overview illustrates kernel-bypass networking reading network interface buffers directly in user space.",
        "Deep inspection evaluates user-space poll-mode drivers and shared submission and completion ring queues.",
        "Comparative analysis demonstrates zero kernel context switches over traditional operating system socket interrupts.",
        "Verification confirms submission queue processing, completion queue polling, and zero-syscall performance."
    ],
    [
        "Architectural overview displays off-heap memory management and zero-copy binary serialization traversing raw byte layouts.",
        "Deep inspection evaluates fixed byte offsets and direct memory pointer access without object allocations or parsing.",
        "Comparative analysis demonstrates total elimination of garbage collection pauses over heavy JSON object parsing.",
        "Verification confirms structured binary reading, zero heap allocations, and deterministic memory traversal."
    ],
    [
        "Architectural overview displays the production high-frequency trading matching engine and microsecond audit dashboard.",
        "Deep inspection monitors millions of orders per second executing in hundreds of nanoseconds with zero garbage collection pauses.",
        "Comparative analysis demonstrates absolute execution determinism, zero lock contention, and bare-metal performance.",
        "Verification certifies sub-microsecond tail latency, zero runtime allocations, and enterprise production readiness."
    ]
]

for idx, p in enumerate(day59_data["parts"]):
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
            "title": f"High-Frequency Zero-Allocation: {p['title']}",
            "left": {
                "label": "Traditional Managed Runtimes",
                "content": [
                    "False sharing forces continuous multi-core cache line invalidations",
                    "Blocking queues suffer high operating system mutex contention delays",
                    "Linux socket syscalls incur heavy context switches and packet copies",
                    "Garbage collection stop-the-world pauses destroy latency determinism"
                ]
            },
            "right": {
                "label": "Mechanical Sympathy Architecture",
                "content": [
                    "Cache line padding guarantees dedicated sixty-four-byte lines per counter",
                    "Lock-free circular ring buffers use single-cycle bitmask indexing",
                    "Kernel-bypass poll-mode drivers read packets directly into user space",
                    "Off-heap memory and FlatBuffers enable zero-copy binary traversal"
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
            "leftLabel": "Traditional Managed Runtimes",
            "rightLabel": "Mechanical Sympathy Architecture",
            "leftHighlights": [
                "False sharing stalls",
                "Mutex queue lockups",
                "Kernel context switches",
                "GC stop-the-world freezes"
            ],
            "rightHighlights": [
                "Cache line isolation",
                "Pre-allocated ring buffers",
                "Zero-syscall io_uring",
                "Zero-copy binary layouts"
            ]
        }
    }
    entries.append(entry)

envelope = {
    "schemaVersion": 2,
    "course": "dist",
    "prefix": "dist",
    "day": 59,
    "promptSha": hashlib.sha256(b"dist-day-59-high-frequency-zero-allocation-disruptor-io-uring-flatbuffers").hexdigest(),
    "model": "gemini-2.5-pro",
    "entries": entries
}

os.makedirs("src/lib/data/lessonVisuals/dist", exist_ok=True)
out_path = "src/lib/data/lessonVisuals/dist/day-59.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Successfully generated {out_path} with {len(entries)} visual entries!")
