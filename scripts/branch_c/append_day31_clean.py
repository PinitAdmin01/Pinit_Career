import json
import hashlib
import os

from generate_day31_full import part1_say, part2_say, part3_say, part4_say, part5_say

code1 = """function simulateMemoryAccess(seqLen: number, dModel: number, numHeads: number) {
  const headDim = dModel / numHeads;
  const scoreMatrixBytes = seqLen * seqLen * 4 * numHeads;
  const softmaxMatrixBytes = seqLen * seqLen * 4 * numHeads;
  const totalHBMBytes = scoreMatrixBytes + softmaxMatrixBytes;
  const blockSize = 64;
  const tiledSramBytes = blockSize * headDim * 4 * 2;
  return {
    seqLen,
    naiveHBM_MB: (totalHBMBytes / (1024 * 1024)).toFixed(2),
    tiledSRAM_KB: (tiledSramBytes / 1024).toFixed(2),
    ratio: (totalHBMBytes / tiledSramBytes).toFixed(0)
  };
}
console.log(simulateMemoryAccess(4096, 4096, 32));"""

output1 = """{
  seqLen: 4096,
  naiveHBM_MB: '4096.00',
  tiledSRAM_KB: '64.00',
  ratio: '65536'
}"""

code2 = """function onlineSoftmax(logits: number[]) {
  const maxVal = Math.max(...logits);
  const exps = logits.map(v => Math.exp(v - maxVal));
  const sumExp = exps.reduce((a, b) => a + b, 0);
  const standardSoftmax = exps.map(v => Number((v / sumExp).toFixed(4)));

  let m = -Infinity;
  let d = 0;
  for (let i = 0; i < logits.length; i++) {
    const x = logits[i];
    const prevM = m;
    m = Math.max(prevM, x);
    d = d * Math.exp(prevM - m) + Math.exp(x - m);
  }
  const onlineResult = logits.map(x => Number((Math.exp(x - m) / d).toFixed(4)));
  return { standardSoftmax, onlineSoftmax: onlineResult };
}
console.log(onlineSoftmax([2.4, 4.1, 1.2, 5.8, 3.0]));"""

output2 = """{
  standardSoftmax: [ 0.0259, 0.142, 0.0078, 0.777, 0.0473 ],
  onlineSoftmax: [ 0.0259, 0.142, 0.0078, 0.777, 0.0473 ]
}"""

code3 = """function simulateFlashAttention2(Q: number[][], K: number[][], V: number[][], blockSize: number): number[][] {
  const N = Q.length;
  const d = Q[0].length;
  const O: number[][] = Array.from({ length: N }, () => new Array(d).fill(0));
  const scale = 1.0 / Math.sqrt(d);

  for (let i = 0; i < N; i += blockSize) {
    const qi_end = Math.min(i + blockSize, N);
    const Q_block = Q.slice(i, qi_end);
    const m_block = new Array(qi_end - i).fill(-Infinity);
    const d_block = new Array(qi_end - i).fill(0);
    const O_block = Array.from({ length: qi_end - i }, () => new Array(d).fill(0));

    for (let j = 0; j < N; j += blockSize) {
      const kj_end = Math.min(j + blockSize, N);
      const K_block = K.slice(j, kj_end);
      const V_block = V.slice(j, kj_end);

      for (let bi = 0; bi < Q_block.length; bi++) {
        const scores: number[] = [];
        for (let bj = 0; bj < K_block.length; bj++) {
          let dot = 0;
          for (let k = 0; k < d; k++) dot += Q_block[bi][k] * K_block[bj][k];
          scores.push(dot * scale);
        }
        const tileMax = Math.max(...scores);
        const prevM = m_block[bi];
        const newM = Math.max(prevM, tileMax);
        const alpha = Math.exp(prevM - newM);
        let tileExpSum = 0;
        const P_tile: number[] = [];
        for (let bj = 0; bj < scores.length; bj++) {
          const p = Math.exp(scores[bj] - newM);
          P_tile.push(p);
          tileExpSum += p;
        }
        for (let k = 0; k < d; k++) {
          let pv = 0;
          for (let bj = 0; bj < V_block.length; bj++) pv += P_tile[bj] * V_block[bj][k];
          O_block[bi][k] = O_block[bi][k] * alpha + pv;
        }
        d_block[bi] = d_block[bi] * alpha + tileExpSum;
        m_block[bi] = newM;
      }
    }
    for (let bi = 0; bi < Q_block.length; bi++) {
      for (let k = 0; k < d; k++) O[i + bi][k] = Number((O_block[bi][k] / d_block[bi]).toFixed(4));
    }
  }
  return O;
}
console.log('Tiled FlashAttention Output:', simulateFlashAttention2(
  [[1, 0], [0, 1], [1, 1], [0.5, 0.5]],
  [[1, 0], [0, 1], [1, 1], [0.5, 0.5]],
  [[10, 20], [30, 40], [50, 60], [70, 80]],
  2
));"""

output3 = """Tiled FlashAttention Output: [
  [ 38.7904, 48.7904 ],
  [ 41.9634, 51.9634 ],
  [ 42.0447, 52.0447 ],
  [ 40.9587, 50.9587 ]
]"""

code4 = """interface HopperPipelineStage {
  stage: string;
  hardwareUnit: string;
  latencyNs: number;
  isAsynchronous: boolean;
}

function inspectHopperFA3Pipeline(): HopperPipelineStage[] {
  return [
    { stage: 'TMA Global-to-Shared Load', hardwareUnit: 'TMA Engine', latencyNs: 120, isAsynchronous: true },
    { stage: 'Warpgroup MMA FP8 Matrix Mult', hardwareUnit: 'Tensor Cores (WGMMA)', latencyNs: 45, isAsynchronous: true },
    { stage: 'Softmax Rescaling & Exponentiation', hardwareUnit: 'CUDA Cores (ALU)', latencyNs: 25, isAsynchronous: false },
    { stage: 'TMA Shared-to-Global Store', hardwareUnit: 'TMA Engine', latencyNs: 90, isAsynchronous: true }
  ];
}
console.log(inspectHopperFA3Pipeline());"""

output4 = """[
  {
    stage: 'TMA Global-to-Shared Load',
    hardwareUnit: 'TMA Engine',
    latencyNs: 120,
    isAsynchronous: true
  },
  {
    stage: 'Warpgroup MMA FP8 Matrix Mult',
    hardwareUnit: 'Tensor Cores (WGMMA)',
    latencyNs: 45,
    isAsynchronous: true
  },
  {
    stage: 'Softmax Rescaling & Exponentiation',
    hardwareUnit: 'CUDA Cores (ALU)',
    latencyNs: 25,
    isAsynchronous: false
  },
  {
    stage: 'TMA Shared-to-Global Store',
    hardwareUnit: 'TMA Engine',
    latencyNs: 90,
    isAsynchronous: true
  }
]"""

code5 = """interface KernelBenchmark {
  kernel: string;
  seqLen: number;
  hbmTrafficGB: number;
  runtimeMs: number;
  speedupRatio: string;
}

function benchmarkAttentionKernels(seqLen: number): KernelBenchmark[] {
  const naiveHBM = (seqLen * seqLen * 4 * 32 * 2) / (1024 * 1024 * 1024);
  const fa2HBM = (seqLen * 4096 * 4 * 4) / (1024 * 1024 * 1024);
  const fa3HBM = fa2HBM * 0.5;
  const naiveRuntime = seqLen * 0.05;
  const fa2Runtime = naiveRuntime * 0.28;
  const fa3Runtime = fa2Runtime * 0.52;

  return [
    { kernel: 'Standard PyTorch Attention', seqLen, hbmTrafficGB: Number(naiveHBM.toFixed(2)), runtimeMs: Number(naiveRuntime.toFixed(2)), speedupRatio: '1.00x (Baseline)' },
    { kernel: 'FlashAttention-2 (FP16)', seqLen, hbmTrafficGB: Number(fa2HBM.toFixed(2)), runtimeMs: Number(fa2Runtime.toFixed(2)), speedupRatio: `${(naiveRuntime / fa2Runtime).toFixed(2)}x` },
    { kernel: 'FlashAttention-3 (FP8 Hopper)', seqLen, hbmTrafficGB: Number(fa3HBM.toFixed(2)), runtimeMs: Number(fa3Runtime.toFixed(2)), speedupRatio: `${(naiveRuntime / fa3Runtime).toFixed(2)}x` }
  ];
}
console.log(benchmarkAttentionKernels(8192));"""

output5 = """[
  {
    kernel: 'Standard PyTorch Attention',
    seqLen: 8192,
    hbmTrafficGB: 16,
    runtimeMs: 409.6,
    speedupRatio: '1.00x (Baseline)'
  },
  {
    kernel: 'FlashAttention-2 (FP16)',
    seqLen: 8192,
    hbmTrafficGB: 0.5,
    runtimeMs: 114.69,
    speedupRatio: '3.57x'
  },
  {
    kernel: 'FlashAttention-3 (FP8 Hopper)',
    seqLen: 8192,
    hbmTrafficGB: 0.25,
    runtimeMs: 59.64,
    speedupRatio: '6.87x'
  }
]"""

day31_dict = {
    "day": 31,
    "title": "FlashAttention-2 & FlashAttention-3: Memory-Bound GPU Kernel Tiling, IO-Aware Exact Attention & Online Softmax Math",
    "goal": "Master GPU memory hierarchy physics, SRAM tiling, the online softmax recurrence, and Hopper TMA asynchronous execution pipelines to deploy FlashAttention-2/3 at scale.",
    "minutes": 38,
    "recap": "In Month 1, we established end-to-end foundation models, RAG pipelines, fine-tuning, and multi-agent coordination. Today we commence Month 2 by descending into GPU hardware physics, breaking the memory bandwidth bottleneck with FlashAttention-2 and FlashAttention-3.",
    "parts": [
        {
            "title": "GPU Memory Hierarchy & The Memory-Bound Attention Bottleneck",
            "say": part1_say,
            "example": "Standard attention is like a chef who carries twenty bags of raw flour back and forth between a distant cellar and the kitchen for every single cookie; FlashAttention brings one compact bin of flour onto the kitchen counter and bakes the entire batch on the spot.",
            "code": code1,
            "output": output1,
            "codeNotes": [
                {"line": 1, "note": "Defines the memory footprint simulation comparing standard attention HBM traffic with SRAM tiled buffers."},
                {"line": 3, "note": "Calculates intermediate scores matrix S byte size across sequence length and attention heads."},
                {"line": 8, "note": "Demonstrates that SRAM tiled buffer size is constant regardless of total sequence length."}
            ],
            "tryIt": "Simulate memory access for a sequence length of 16384 tokens and compare the HBM traffic with 4096 tokens.",
            "check": {
                "question": "Why does standard attention scale quadratically in memory traffic relative to sequence length?",
                "options": [
                    "Standard attention repeatedly writes and reads full intermediate N-by-N attention score and softmax probability matrices across global HBM",
                    "GPU Tensor Cores can only compute floating-point additions in single precision",
                    "CUDA blocks require sequential locks when executing row-wise exponentiations",
                    "The Transformer architecture disables L2 cache during backpropagation"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Standard attention materializes intermediate N-by-N score and probability matrices into slow HBM, incurring massive memory transfer penalties that scale quadratically with sequence length."
            }
        },
        {
            "title": "The Online Softmax Algorithm: Streaming Normalization without Global Maxima",
            "say": part2_say,
            "example": "Calculating your lifetime high test score normally requires gathering every single exam paper first; online softmax lets you update your personal record and rescaled average score dynamically as each exam is graded, without re-reading past papers.",
            "code": code2,
            "output": output2,
            "codeNotes": [
                {"line": 1, "note": "Compares standard two-pass softmax with Milakov and Gimelshein online streaming softmax."},
                {"line": 12, "note": "Dynamically updates running maximum m and rescales accumulated denominator d using exponential correction."},
                {"line": 17, "note": "Confirms exact bitwise matching between standard softmax and streaming online softmax outputs."}
            ],
            "tryIt": "Add an extreme outlier logit of 25.0 to the input array and verify that online softmax avoids numerical overflow.",
            "check": {
                "question": "How does the online softmax algorithm adjust previously accumulated sums when a larger local maximum is encountered in a new tile?",
                "options": [
                    "It multiplies previously accumulated denominators and partial outputs by exp(m_prev minus m_curr) to rescale them retroactively",
                    "It pauses kernel execution and restarts the attention computation from token zero",
                    "It truncates all negative logits to zero using a rectified linear activation unit",
                    "It writes the unnormalized vectors into global memory for a secondary reduction pass"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Online softmax applies the exact numerical correction factor exp(m_prev minus m_curr) to rescale previously accumulated partial sums and denominators to the new maximum without re-reading past data."
            }
        },
        {
            "title": "FlashAttention-1 & FlashAttention-2: Block-Wise Tiling & Forward Pass Loop Inversion",
            "say": part3_say,
            "example": "FlashAttention-1 grouped work by filing cabinets (Keys) and made clerks run between rooms; FlashAttention-2 assigns each clerk their own dedicated desk (Query) so they never collide or wait in line to submit work.",
            "code": code3,
            "output": output3,
            "codeNotes": [
                {"line": 1, "note": "Simulates FlashAttention-2 forward pass tiling where the outer loop iterates over Query blocks."},
                {"line": 7, "note": "Outer loop iterates across Q blocks, giving each thread block exclusive ownership of its output slice."},
                {"line": 13, "note": "Inner loop streams K and V blocks through shared memory, accumulating partial dot products."},
                {"line": 34, "note": "Updates running accumulator O_block with new tile values scaled by the online softmax correction factor."}
            ],
            "tryIt": "Increase blockSize from 2 to 4 and observe the reduction in outer and inner loop iteration steps.",
            "check": {
                "question": "What is the primary architectural improvement of FlashAttention-2 over FlashAttention-1?",
                "options": [
                    "Inverting the loop hierarchy so the outer loop iterates over Query blocks, eliminating atomic synchronization when writing outputs",
                    "Replacing half-precision floating point numbers with sixteen-bit integers",
                    "Restricting attention exclusively to non-causal encoder architectures",
                    "Eliminating the on-chip SRAM cache in favor of direct HBM streaming"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "FlashAttention-2 inverts the loop hierarchy to iterate over Query blocks in the outer loop, allowing each thread block to write its output slice directly without atomic contention or inter-block synchronization."
            }
        },
        {
            "title": "FlashAttention-3: Asynchronous Warpgroup GEMMs & FP8 Tensor Core Pipeline",
            "say": part4_say,
            "example": "Older GPU kernels acted like a single worker who stops packing boxes whenever a delivery truck arrives; Hopper FA3 acts like a robotic factory where automated conveyor belts unload trucks while robotic arms assemble boxes continuously.",
            "code": code4,
            "output": output4,
            "codeNotes": [
                {"line": 8, "note": "Inspects Hopper hardware execution stages showing asynchronous overlap between TMA and WGMMA."},
                {"line": 10, "note": "TMA engine streams data from HBM to shared memory asynchronously without using CUDA core cycles."},
                {"line": 11, "note": "WGMMA warpgroups execute FP8 matrix multiplications directly from shared memory in parallel."}
            ],
            "tryIt": "Add a new pipeline stage for dynamic FP8 scaling factor calculation and recalculate total pipeline latency.",
            "check": {
                "question": "How does the Hopper Tensor Memory Accelerator (TMA) improve FlashAttention-3 throughput?",
                "options": [
                    "TMA transfers tensor tiles between global memory and shared memory asynchronously without consuming ALU or register cycles",
                    "TMA replaces GPU streaming multiprocessors with fixed-function optical processors",
                    "TMA automatically increases GPU clock frequencies during causal masking",
                    "TMA converts all thirty-two bit floating point weights into single-bit binary representations"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "The Hopper Tensor Memory Accelerator (TMA) performs asynchronous multi-dimensional tensor copies directly between HBM and shared memory, completely freeing streaming multiprocessor threads for compute."
            }
        },
        {
            "title": "Enterprise Production Kernel Benchmarking & End-to-End FlashAttention Inference Simulator",
            "say": part5_say,
            "example": "Operating an enterprise LLM cluster without FlashAttention is like running an airline where jets spend ninety percent of their time taxiing on the runway; FlashAttention keeps the planes in the sky at cruising speed with minimal turnaround time.",
            "code": code5,
            "output": output5,
            "codeNotes": [
                {"line": 9, "note": "Simulates memory traffic and runtime across standard attention, FlashAttention-2, and FlashAttention-3."},
                {"line": 12, "note": "Calculates quadratic HBM traffic for naive attention versus linear HBM traffic for FlashAttention."},
                {"line": 18, "note": "Demonstrates over 3.5x speedup for FlashAttention-2 and over 6.8x speedup for FlashAttention-3 at 8K context."}
            ],
            "tryIt": "Run the benchmark with sequence length 16384 and compare the speedup ratios.",
            "check": {
                "question": "Why is head dimension memory alignment critical when deploying FlashAttention in production serving engines?",
                "options": [
                    "Aligned head dimensions enable coalesced vector memory transactions and hardware-accelerated TMA tensor copies",
                    "Unaligned dimensions prevent Python from compiling bytecode into assembly",
                    "Odd head dimensions violate the laws of matrix multiplication in linear algebra",
                    "Continuous batching requires all attention heads to be prime numbers"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "When head dimensions align with GPU warp boundaries (multiples of 32 or 64 bytes), the memory subsystem issues coalesced 128-bit vector loads, achieving maximum memory bandwidth efficiency."
            }
        }
    ],
    "summary": [
        "The GPU memory hierarchy separates high-capacity but bandwidth-constrained HBM from fast on-chip SRAM, creating severe memory-bound bottlenecks in naive attention.",
        "Standard attention materializes intermediate N-by-N score and probability matrices into HBM, scaling memory traffic quadratically O(N squared) with sequence length.",
        "The online softmax recurrence dynamically maintains running maximums and normalization denominators, allowing exact attention to be computed in tiled SRAM blocks with O(1) memory footprint.",
        "FlashAttention-2 inverts the loop hierarchy to iterate over Query blocks in the outer loop, eliminating atomic inter-block synchronization and maximizing warp-level MMA efficiency.",
        "FlashAttention-3 leverages NVIDIA Hopper hardware innovations, utilizing the Tensor Memory Accelerator (TMA) and Warpgroup MMA (WGMMA) for asynchronous memory-compute overlapping in FP8 precision.",
        "Enterprise serving platforms enforce strict head dimension alignment and integrate kernel dispatch telemetry to maintain compute-bound efficiency across multi-thousand token contexts."
    ],
    "projectStep": {
        "title": "Industrial High-Throughput Attention Kernel Benchmarking & Telemetry Suite",
        "steps": [
            "Construct a standalone profiling harness to measure HBM memory read/write traffic across varying sequence lengths from 1024 to 32768 tokens.",
            "Implement a numerical verification harness comparing standard PyTorch attention against tiled FlashAttention-2 with online softmax correction to verify zero floating-point divergence.",
            "Configure kernel dispatch parameters and head dimension alignment checks within the serving runtime to prevent uncoalesced memory transactions during large-scale concurrent inference."
        ]
    }
}

# 1. Save day31_lesson.json
with open('scripts/branch_c/day31_lesson.json', 'w', encoding='utf-8') as f:
    json.dump(day31_dict, f, indent=2)

# 2. Append into src/lib/data/aiWebLongLessons.ts
ai_ts_path = 'src/lib/data/aiWebLongLessons.ts'
with open(ai_ts_path, 'r', encoding='utf-8') as f:
    ts_content = f.read()

last_bracket = ts_content.rfind('];')
assert last_bracket != -1, "Could not find '];'"

day31_json_str = json.dumps(day31_dict, indent=2)

new_ts_content = ts_content[:last_bracket].rstrip()
if not new_ts_content.endswith(','):
    new_ts_content += ',\n'
else:
    new_ts_content += '\n'

new_ts_content += day31_json_str + '\n];\n'

with open(ai_ts_path, 'w', encoding='utf-8') as f:
    f.write(new_ts_content)

print(f"Appended Day 31 to {ai_ts_path}")

# 3. Generate Visual Envelope
captions_data = [
    {
        "say1": "Modern datacenter graphics hardware exhibits memory hierarchy bottlenecks.",
        "say2": "Standard attention sequentially computes quadratic intermediate matrices.",
        "example": "Standard attention transfers raw matrices across distant storage.",
        "tryIt": "Simulate memory access comparing sequence length and memory traffic."
    },
    {
        "say1": "Global nature of standard softmax operator prevents direct kernel fusion.",
        "say2": "Online softmax algorithm incrementally updates running maximum and divisor.",
        "example": "Online softmax dynamically updates running score without reading past data.",
        "tryIt": "Verify online softmax avoids numerical overflow on extreme outlier logits."
    },
    {
        "say1": "Initial attention kernel suffered architectural nesting inefficiencies.",
        "say2": "Inverted loop hierarchy assigns distinct query token blocks to threads.",
        "example": "Assigning dedicated desks prevents clerks from colliding during execution.",
        "tryIt": "Observe reduction in outer and inner loop iteration steps across tiles."
    },
    {
        "say1": "Hopper architecture introduces asynchronous hardware tensor accelerator.",
        "say2": "Asynchronous bulk transfers stream tensor tiles directly into shared cache.",
        "example": "Automated conveyor belts unload while robotic arms assemble continuously.",
        "tryIt": "Recalculate total pipeline latency across dynamic scaling stages."
    },
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
    [
        [["High Bandwidth Memory", "Two Terabytes Per Second", "Global Device DRAM"], ["Static Random Access", "Nineteen Terabytes Per Second", "Streaming Multiprocessor SRAM"]],
        [["Tensor Core Multiply", "Compute Bound Peak Floating Points", "Extremely Low"], ["Intermediate Softmax", "Memory Bound Bandwidth Bottleneck", "High Stall Overhead"]],
        [["Score Matrix Multiply", "Global High Bandwidth Memory", "Quadratic Footprint"], ["Softmax Exponentiation", "Repeated Global Reads and Writes", "Quadratic Bandwidth"]],
        [["Vanilla PyTorch Attention", "Materialized In Global Memory", "Quadratic Latency Scaling"], ["FlashAttention Fused", "Confined Strictly To SRAM Cache", "Linear Latency Scaling"]]
    ],
    [
        [["First Global Pass", "Find Maximum Scalar Across All Elements", "Read Entire Sequence"], ["Second Global Pass", "Sum Exponentials And Normalize Weights", "Read And Write All Elements"]],
        [["Standard Softmax", "Full Intermediate Array In Memory", "Requires All Elements Present"], ["Milakov Gimelshein", "Running Scalar Maximum And Denominator", "Streaming Tile Increments"]],
        [["Running Maximum Shift", "Multiply Previous Sum By Rescale Factor", "Prevent Floating Point Overflow"], ["Tile Contribution", "Accumulate New Exponentiated Logits", "Maintain Exact Sum"]],
        [["Floating Point Difference", "Zero Bitwise Divergence", "Exact Standard Equivalence"], ["Intermediate Memory", "Zero Intermediate HBM Allocation", "Constant Register Usage"]]
    ],
    [
        [["FlashAttention One", "Key And Value Blocks Streamed", "Query Blocks In Inner Loop"], ["FlashAttention Two", "Query Blocks In Outer Loop", "Key And Value Blocks Streamed"]],
        [["FlashAttention One", "Atomic Adds Across Thread Blocks", "Intermittent Pipeline Locks"], ["FlashAttention Two", "Zero Inter Block Synchronization", "Uncontended Independent Execution"]],
        [["Warp Group Partitioning", "Dedicated Query Key Sub Tiles", "Maximum Tensor Core Usage"], ["Shared Memory Stride", "Conflict Free Bank Offsets", "Full Register Reuse"]],
        [["Strictly Above Diagonal", "Completely Bypass Matrix Multiplication", "Fifty Percent Compute Savings"], ["Intersecting Diagonal", "Apply In Register Masking Directly", "Zero Extraneous HBM Traffic"]]
    ],
    [
        [["Ampere Architecture", "Software Thread Load Instructions", "ALU Cycles Consumed"], ["Hopper Architecture", "Hardware Tensor Memory Accelerator", "Zero ALU Cycle Overhead"]],
        [["Legacy Tensor Core", "Thread Register Fragments Required", "High Register Allocation"], ["Hopper Warpgroup", "Direct Shared Memory Tensor Pointers", "Minimal Register Footprint"]],
        [["Software Barrier", "Thread Block Syncthreads Lock", "Hundreds Of Wasted Cycles"], ["Hardware Transaction Barrier", "Hardware Decremented Byte Counter", "Immediate Microsecond Wakeup"]],
        [["Sixteen Bit Floating Point", "Static Global Scaling Factor", "Baseline Numerical Precision"], ["Eight Bit Floating Point", "Per Block Dynamic Rescaling Factor", "Full Baseline Accuracy Maintained"]]
    ],
    [
        [["Short Prompt Prefill", "Sequence Below Threshold", "Padded Vector Attention"], ["Long Context Inference", "Sequence Exceeding Block Tile", "FlashAttention Kernel Dispatch"]],
        [["Memory Traffic At Eight K", "Sixteen Gigabytes Transferred", "Under Half Gigabyte Transferred"], ["Time To First Token", "Four Hundred Milliseconds", "One Hundred Fourteen Milliseconds"]],
        [["Aligned Multiple Of Sixty Four", "Coalesced One Hundred Twenty Eight Bit", "Peak Hardware Saturation"], ["Unaligned Arbitrary Dimension", "Split Uncoalesced Transactions", "Forty Percent Throughput Penalty"]],
        [["Model Flops Utilization", "Above Sixty Percent Peak", "Investigate Compute Bottlenecks"], ["Memory Bandwidth Saturation", "Below Twenty Percent During Attention", "Verify Kernel Tiling Integrity"]]
    ]
]

entries = []
for p_idx, part in enumerate(day31_dict['parts']):
    code_hash = hashlib.sha256(part['code'].encode('utf-8')).hexdigest()
    caps = captions_data[p_idx]
    
    spec_steps = []
    at_keys = ["say1", "say2", "example", "tryIt"]
    for s_idx, at_k in enumerate(at_keys):
        cap = caps[at_k]
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
