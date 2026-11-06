import json
import hashlib
import os

from generate_day31_all import day31_dict as lesson

assert lesson['day'] == 31

captions_data = [
    # Part 1
    {
        "say1": "Modern datacenter graphics hardware exhibits memory hierarchy bottlenecks.",
        "say2": "Standard attention sequentially computes quadratic intermediate matrices.",
        "example": "Standard attention transfers raw matrices across distant storage.",
        "tryIt": "Simulate memory access comparing sequence length and memory traffic."
    },
    # Part 2
    {
        "say1": "Global nature of standard softmax operator prevents direct kernel fusion.",
        "say2": "Online softmax algorithm incrementally updates running maximum and divisor.",
        "example": "Online softmax dynamically updates running score without reading past data.",
        "tryIt": "Verify online softmax avoids numerical overflow on extreme outlier logits."
    },
    # Part 3
    {
        "say1": "Initial attention kernel suffered architectural nesting inefficiencies.",
        "say2": "Inverted loop hierarchy assigns distinct query token blocks to threads.",
        "example": "Assigning dedicated desks prevents clerks from colliding during execution.",
        "tryIt": "Observe reduction in outer and inner loop iteration steps across tiles."
    },
    # Part 4
    {
        "say1": "Hopper architecture introduces asynchronous hardware tensor accelerator.",
        "say2": "Asynchronous bulk transfers stream tensor tiles directly into shared cache.",
        "example": "Automated conveyor belts unload while robotic arms assemble continuously.",
        "tryIt": "Recalculate total pipeline latency across dynamic scaling stages."
    },
    # Part 5
    {
        "say1": "Kernel dispatch manager inspects incoming request batch metrics.",
        "say2": "Profiling production inference servers under heavy concurrent query loads.",
        "example": "Keeping processing planes cruising at speed with minimal turnaround delay.",
        "tryIt": "Execute kernel benchmark comparing sequence length and speedup ratios."
    }
]

titles = [
    "GPU Memory Hierarchy and High Bandwidth Memory Bottleneck.",
    "Online Softmax Recurrence and Streaming Numerical Normalization.",
    "FlashAttention Loop Inversion and Warp Matrix Multiply Scheduling.",
    "Hopper Architecture Asynchronous Pipeline and FP Eight Execution.",
    "Production Serving Benchmarks and Kernel Telemetry Dispatch."
]

columns_list = [
    ["Architecture Tier", "Bandwidth", "Physical Storage"],
    ["Softmax Pass", "Required Operation", "Memory Access Pattern"],
    ["Kernel Version", "Outer Loop Variable", "Inner Loop Variable"],
    ["Generation Hardware", "Memory Transfer Mechanism", "Core Utilization"],
    ["Dispatch Metric", "Evaluated Parameter", "Selected Kernel"]
]

steps_rows = [
    # Part 1
    [
        [["High Bandwidth Memory", "Two Terabytes Per Second", "Global Device DRAM"], ["Static Random Access", "Nineteen Terabytes Per Second", "Streaming Multiprocessor SRAM"]],
        [["Tensor Core Multiply", "Compute Bound Peak Floating Points", "Extremely Low"], ["Intermediate Softmax", "Memory Bound Bandwidth Bottleneck", "High Stall Overhead"]],
        [["Score Matrix Multiply", "Global High Bandwidth Memory", "Quadratic Footprint"], ["Softmax Exponentiation", "Repeated Global Reads and Writes", "Quadratic Bandwidth"]],
        [["Vanilla PyTorch Attention", "Materialized In Global Memory", "Quadratic Latency Scaling"], ["FlashAttention Fused", "Confined Strictly To SRAM Cache", "Linear Latency Scaling"]]
    ],
    # Part 2
    [
        [["First Global Pass", "Find Maximum Scalar Across All Elements", "Read Entire Sequence"], ["Second Global Pass", "Sum Exponentials And Normalize Weights", "Read And Write All Elements"]],
        [["Standard Softmax", "Full Intermediate Array In Memory", "Requires All Elements Present"], ["Milakov Gimelshein", "Running Scalar Maximum And Denominator", "Streaming Tile Increments"]],
        [["Running Maximum Shift", "Multiply Previous Sum By Rescale Factor", "Prevent Floating Point Overflow"], ["Tile Contribution", "Accumulate New Exponentiated Logits", "Maintain Exact Sum"]],
        [["Floating Point Difference", "Zero Bitwise Divergence", "Exact Standard Equivalence"], ["Intermediate Memory", "Zero Intermediate HBM Allocation", "Constant Register Usage"]]
    ],
    # Part 3
    [
        [["FlashAttention One", "Key And Value Blocks Streamed", "Query Blocks In Inner Loop"], ["FlashAttention Two", "Query Blocks In Outer Loop", "Key And Value Blocks Streamed"]],
        [["FlashAttention One", "Atomic Adds Across Thread Blocks", "Intermittent Pipeline Locks"], ["FlashAttention Two", "Zero Inter Block Synchronization", "Uncontended Independent Execution"]],
        [["Warp Group Partitioning", "Dedicated Query Key Sub Tiles", "Maximum Tensor Core Usage"], ["Shared Memory Stride", "Conflict Free Bank Offsets", "Full Register Reuse"]],
        [["Strictly Above Diagonal", "Completely Bypass Matrix Multiplication", "Fifty Percent Compute Savings"], ["Intersecting Diagonal", "Apply In Register Masking Directly", "Zero Extraneous HBM Traffic"]]
    ],
    # Part 4
    [
        [["Ampere Architecture", "Software Thread Load Instructions", "ALU Cycles Consumed"], ["Hopper Architecture", "Hardware Tensor Memory Accelerator", "Zero ALU Cycle Overhead"]],
        [["Legacy Tensor Core", "Thread Register Fragments Required", "High Register Allocation"], ["Hopper Warpgroup", "Direct Shared Memory Tensor Pointers", "Minimal Register Footprint"]],
        [["Software Barrier", "Thread Block Syncthreads Lock", "Hundreds Of Wasted Cycles"], ["Hardware Transaction Barrier", "Hardware Decremented Byte Counter", "Immediate Microsecond Wakeup"]],
        [["Sixteen Bit Floating Point", "Static Global Scaling Factor", "Baseline Numerical Precision"], ["Eight Bit Floating Point", "Per Block Dynamic Rescaling Factor", "Full Baseline Accuracy Maintained"]]
    ],
    # Part 5
    [
        [["Short Prompt Prefill", "Sequence Below Threshold", "Padded Vector Attention"], ["Long Context Inference", "Sequence Exceeding Block Tile", "FlashAttention Kernel Dispatch"]],
        [["Memory Traffic At Eight K", "Sixteen Gigabytes Transferred", "Under Half Gigabyte Transferred"], ["Time To First Token", "Four Hundred Milliseconds", "One Hundred Fourteen Milliseconds"]],
        [["Aligned Multiple Of Sixty Four", "Coalesced One Hundred Twenty Eight Bit", "Peak Hardware Saturation"], ["Unaligned Arbitrary Dimension", "Split Uncoalesced Transactions", "Forty Percent Throughput Penalty"]],
        [["Model Flops Utilization", "Above Sixty Percent Peak", "Investigate Compute Bottlenecks"], ["Memory Bandwidth Saturation", "Below Twenty Percent During Attention", "Verify Kernel Tiling Integrity"]]
    ]
]

entries = []
for p_idx, part in enumerate(lesson['parts']):
    code_hash = hashlib.sha256(part['code'].encode('utf-8')).hexdigest()
    caps = captions_data[p_idx]
    
    spec_steps = []
    at_keys = ["say1", "say2", "example", "tryIt"]
    for s_idx, at_k in enumerate(at_keys):
        cap = caps[at_k]
        # Invariant assertions
        assert len(cap) <= 75, f"Part {p_idx+1} {at_k} caption too long: {len(cap)} ({cap})"
        assert cap.endswith('.'), f"Part {p_idx+1} {at_k} caption must end with period: ({cap})"
        assert not any(c.isdigit() for c in cap), f"Part {p_idx+1} {at_k} caption contains digits: ({cap})"
        spec_steps.append({
            "at": at_k,
            "caption": cap,
            "rows": steps_rows[p_idx][s_idx]
        })
    
    entry_dict = {
        "partTitle": part['title'],
        "codeHash": code_hash,
        "filled": {
            "template": "table",
            "title": titles[p_idx],
            "columns": columns_list[p_idx],
            "steps": spec_steps
        },
        "spec": {
            "template": "table",
            "title": titles[p_idx],
            "columns": columns_list[p_idx],
            "steps": spec_steps
        }
    }
    entries.append(entry_dict)

envelope = {
    "schemaVersion": "2.0.0",
    "prefix": "ai",
    "day": 31,
    "entries": entries
}

out_path = 'src/lib/data/lessonVisuals/ai/day-31.json'
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(envelope, f, indent=2)

print(f"Generated Gate v2 visual envelope with 5 entries at {out_path}")
