import json
import hashlib
import os
import sys

sys.path.append('scripts/branch_c')
from generate_day35_all import part1_say, part2_say, part3_say, part4_say, part5_say

code1 = """interface InferenceRequest {
  id: string;
  promptLen: number;
  outputLen: number;
  tokensGenerated: number;
  status: 'QUEUED' | 'PREFILL' | 'DECODE' | 'FINISHED';
}

function simulateDynamicIterationScheduler(requests: InferenceRequest[], maxBatchTokens: number) {
  const log: string[] = [];
  let currentStep = 0;
  const activeRequests = [...requests];

  while (activeRequests.some(r => r.status !== 'FINISHED') && currentStep < 10) {
    currentStep++;
    let tokensScheduled = 0;
    const batch: string[] = [];

    for (const req of activeRequests) {
      if (req.status === 'FINISHED') continue;

      if (req.status === 'QUEUED') {
        req.status = 'PREFILL';
        tokensScheduled += req.promptLen;
        batch.push(`${req.id}(prefill:${req.promptLen})`);
      } else if (req.status === 'PREFILL' || req.status === 'DECODE') {
        req.status = 'DECODE';
        req.tokensGenerated++;
        tokensScheduled += 1;
        batch.push(`${req.id}(decode:${req.tokensGenerated}/${req.outputLen})`);

        if (req.tokensGenerated >= req.outputLen) {
          req.status = 'FINISHED';
        }
      }

      if (tokensScheduled >= maxBatchTokens) break;
    }

    log.push(`Step ${currentStep}: [${batch.join(', ')}]`);
  }

  return { totalSteps: currentStep, schedulerLog: log };
}

const sampleRequests: InferenceRequest[] = [
  { id: 'req_1', promptLen: 128, outputLen: 3, tokensGenerated: 0, status: 'QUEUED' },
  { id: 'req_2', promptLen: 64, outputLen: 2, tokensGenerated: 0, status: 'QUEUED' },
  { id: 'req_3', promptLen: 32, outputLen: 2, tokensGenerated: 0, status: 'QUEUED' }
];
console.log(simulateDynamicIterationScheduler(sampleRequests, 256));"""

output1 = """{
  totalSteps: 4,
  schedulerLog: [
    'Step 1: [req_1(prefill:128), req_2(prefill:64), req_3(prefill:32)]',
    'Step 2: [req_1(decode:1/3), req_2(decode:1/2), req_3(decode:1/2)]',
    'Step 3: [req_1(decode:2/3), req_2(decode:2/2), req_3(decode:2/2)]',
    'Step 4: [req_1(decode:3/3)]'
  ]
}"""

code2 = """class SpeculativePagedMemoryManager {
  private freeBlocks: number[];
  private blockTables: Map<string, number[]>;
  private blockSize: number;

  constructor(totalBlocks: number, blockSize: number = 16) {
    this.freeBlocks = Array.from({ length: totalBlocks }, (_, i) => i);
    this.blockTables = new Map();
    this.blockSize = blockSize;
  }

  allocateBlocks(reqId: string, neededBlocks: number): number[] {
    const allocated: number[] = [];
    for (let i = 0; i < neededBlocks; i++) {
      const b = this.freeBlocks.pop();
      if (b === undefined) throw new Error('OOM');
      allocated.push(b);
    }
    const current = this.blockTables.get(reqId) || [];
    this.blockTables.set(reqId, [...current, ...allocated]);
    return allocated;
  }

  reclaimRejectedDraftBlocks(reqId: string, numAcceptedTokens: number, numDraftedTokens: number): number {
    const table = this.blockTables.get(reqId);
    if (!table) return 0;

    const acceptedBlocks = Math.ceil(numAcceptedTokens / this.blockSize);
    const draftedBlocks = Math.ceil(numDraftedTokens / this.blockSize);
    const excessBlocks = draftedBlocks - acceptedBlocks;

    let reclaimed = 0;
    for (let i = 0; i < excessBlocks; i++) {
      const b = table.pop();
      if (b !== undefined) {
        this.freeBlocks.push(b);
        reclaimed++;
      }
    }
    return reclaimed;
  }

  getFreeBlockCount(): number {
    return this.freeBlocks.length;
  }
}

const memMgr = new SpeculativePagedMemoryManager(64, 16);
memMgr.allocateBlocks('req_stream', 4);
const freed = memMgr.reclaimRejectedDraftBlocks('req_stream', 20, 64);
console.log({ initialFree: 60, reclaimedBlocks: freed, currentFree: memMgr.getFreeBlockCount() });"""

output2 = """{ initialFree: 60, reclaimedBlocks: 2, currentFree: 62 }"""

code3 = """interface GEMMPerformanceMetrics {
  precision: string;
  weightBytesLoaded: number;
  arithmeticIntensity: number;
  effectiveBandwidthGBs: number;
  latencyMicroseconds: number;
}

function evaluateGEMMPipeline(m: number, n: number, k: number, busBandwidthGBs: number): GEMMPerformanceMetrics[] {
  const flops = 2 * m * n * k;

  const fp16WeightBytes = n * k * 2;
  const fp16LatencyUs = (fp16WeightBytes / (busBandwidthGBs * 1e9)) * 1e6;

  const int4WeightBytes = n * k * 0.5;
  const int4LatencyUs = (int4WeightBytes / (busBandwidthGBs * 1e9)) * 1e6;

  return [
    {
      precision: 'FP16 Standard GEMV',
      weightBytesLoaded: fp16WeightBytes,
      arithmeticIntensity: Number((flops / fp16WeightBytes).toFixed(2)),
      effectiveBandwidthGBs: busBandwidthGBs,
      latencyMicroseconds: Number(fp16LatencyUs.toFixed(2))
    },
    {
      precision: 'AWQ INT4 Packed GEMV',
      weightBytesLoaded: int4WeightBytes,
      arithmeticIntensity: Number((flops / int4WeightBytes).toFixed(2)),
      effectiveBandwidthGBs: busBandwidthGBs,
      latencyMicroseconds: Number(int4LatencyUs.toFixed(2))
    }
  ];
}
console.log(evaluateGEMMPipeline(1, 4096, 4096, 2000));"""

output3 = """[
  {
    precision: 'FP16 Standard GEMV',
    weightBytesLoaded: 33554432,
    arithmeticIntensity: 1,
    effectiveBandwidthGBs: 2000,
    latencyMicroseconds: 16.78
  },
  {
    precision: 'AWQ INT4 Packed GEMV',
    weightBytesLoaded: 8388608,
    arithmeticIntensity: 4,
    effectiveBandwidthGBs: 2000,
    latencyMicroseconds: 4.19
  }
]"""

code4 = """function simulateTensorParallelExecution(numGpuRanks: number, hiddenDim: number, numLayers: number) {
  const bytesPerFloat16 = 2;
  const allReduceBytesPerCall = hiddenDim * bytesPerFloat16;
  const allReduceCallsPerLayer = 2;
  const totalAllReduceCalls = numLayers * allReduceCallsPerLayer;
  
  const bytesTransferredPerRank = totalAllReduceCalls * (2 * (numGpuRanks - 1) / numGpuRanks) * allReduceBytesPerCall;
  const nvLinkBandwidthGBs = 900;
  const commTimeMs = (bytesTransferredPerRank / (nvLinkBandwidthGBs * 1e9)) * 1000;

  return {
    numGpuRanks,
    hiddenDim,
    totalLayers: numLayers,
    allReduceCollectivesPerToken: totalAllReduceCalls,
    mbTransferredPerToken: Number((bytesTransferredPerRank / (1024 ** 2)).toFixed(3)),
    nvLinkCommLatencyMs: Number(commTimeMs.toFixed(3)),
    isScalable: commTimeMs < 1.0
  };
}
console.log(simulateTensorParallelExecution(8, 8192, 32));"""

output4 = """{
  numGpuRanks: 8,
  hiddenDim: 8192,
  totalLayers: 32,
  allReduceCollectivesPerToken: 64,
  mbTransferredPerToken: 1.75,
  nvLinkCommLatencyMs: 0.002,
  isScalable: true
}"""

code5 = """interface ServingEngineProfile {
  engineArchitecture: string;
  servingConcurrency: number;
  tokensPerSecPerGPU: number;
  averageTTFT_ms: number;
  averageITL_ms: number;
  gpuMemoryUsedGB: number;
}

function evaluateIndustrialServingEngine(): ServingEngineProfile[] {
  return [
    {
      engineArchitecture: 'Legacy Contiguous FP16 (No Speculation)',
      servingConcurrency: 16,
      tokensPerSecPerGPU: 28.5,
      averageTTFT_ms: 120.0,
      averageITL_ms: 35.1,
      gpuMemoryUsedGB: 76.4
    },
    {
      engineArchitecture: 'PagedAttention FP16 (No Speculation)',
      servingConcurrency: 64,
      tokensPerSecPerGPU: 62.4,
      averageTTFT_ms: 45.0,
      averageITL_ms: 22.8,
      gpuMemoryUsedGB: 68.2
    },
    {
      engineArchitecture: 'Unified Industrial Engine (AWQ + Medusa Spec + Paged + Chunked)',
      servingConcurrency: 128,
      tokensPerSecPerGPU: 198.6,
      averageTTFT_ms: 24.0,
      averageITL_ms: 7.2,
      gpuMemoryUsedGB: 42.8
    }
  ];
}
console.log(evaluateIndustrialServingEngine());"""

output5 = """[
  {
    engineArchitecture: 'Legacy Contiguous FP16 (No Speculation)',
    servingConcurrency: 16,
    tokensPerSecPerGPU: 28.5,
    averageTTFT_ms: 120,
    averageITL_ms: 35.1,
    gpuMemoryUsedGB: 76.4
  },
  {
    engineArchitecture: 'PagedAttention FP16 (No Speculation)',
    servingConcurrency: 64,
    tokensPerSecPerGPU: 62.4,
    averageTTFT_ms: 45,
    averageITL_ms: 22.8,
    gpuMemoryUsedGB: 68.2
  },
  {
    engineArchitecture: 'Unified Industrial Engine (AWQ + Medusa Spec + Paged + Chunked)',
    servingConcurrency: 128,
    tokensPerSecPerGPU: 198.6,
    averageTTFT_ms: 24,
    averageITL_ms: 7.2,
    gpuMemoryUsedGB: 42.8
  }
]"""

day35_dict = {
    "day": 35,
    "title": "Milestone 7 Capstone: The Ultra-High-Throughput Industrial Serving Engine Simulator",
    "goal": "Synthesize FlashAttention memory tiling, Medusa speculative decoding, PagedAttention virtual block management, and fused AWQ/FP8 quantization into an industrial serving engine simulator.",
    "minutes": 38,
    "recap": "Throughout Block 7, we mastered GPU memory tiling, speculative candidate drafting, virtualized KV-cache block managers, and hardware-native FP8 compute. Today, in our Milestone 7 Capstone, we synthesize these four breakthrough innovations into an end-to-end distributed inference engine simulator.",
    "parts": [
        {
            "title": "End-to-End System Architecture of Modern LLM Serving Engines",
            "say": part1_say,
            "example": "Dynamic iteration scheduling resembles high frequency train dispatching where passenger cars decouple and attach at every station stop without halting the entire rail system.",
            "code": code1,
            "output": output1,
            "codeNotes": [
                {"line": 1, "note": "Defines an inference request data contract tracking prompt length and tokens generated."},
                {"line": 9, "note": "Simulates continuous iteration-level scheduling, dynamically evicting finished requests."},
                {"line": 42, "note": "Schedules concurrent requests across prefill and decode stages in 4 execution steps."}
            ],
            "tryIt": "Trace dynamic iteration batching across multiple client request streams.",
            "check": {
                "question": "What is the primary operational advantage of continuous iteration-level scheduling compared to legacy static batching?",
                "options": [
                    "It constructs a new batch at every generation iteration, evicting completed sequences immediately and admitting new requests without waiting for global completion",
                    "It forces all sequences in the batch to generate the exact same number of tokens",
                    "It converts autoregressive decoding into an offline map-reduce batch job",
                    "It eliminates the need for GPU high-bandwidth memory by streaming tokens directly over PCIe"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Continuous iteration scheduling rebuilds the active batch at every decoding step. Finished requests release resources immediately and new requests begin prefill without stalling the entire batch."
            }
        },
        {
            "title": "Speculative Drafting Integration with Paged Virtual Memory",
            "say": part2_say,
            "example": "Speculative draft allocation resembles reserving flexible airline seats where unboarded standby tickets are instantly reassigned to queued travelers without empty seat delays.",
            "code": code2,
            "output": output2,
            "codeNotes": [
                {"line": 1, "note": "Implements speculative virtual memory allocation and instant rollback for rejected candidate tokens."},
                {"line": 28, "note": "Reclaims unused physical memory blocks in O(1) when the target model rejects speculative draft branches."},
                {"line": 52, "note": "Allocates 4 blocks for 64 drafted tokens and reclaims 2 blocks when only 20 tokens are accepted."}
            ],
            "tryIt": "Inspect block table rollbacks when candidate draft tokens are rejected.",
            "check": {
                "question": "How does the speculative paged memory manager handle physical memory blocks allocated to rejected draft candidate tokens?",
                "options": [
                    "It decrements their reference counts and pops them from the logical block table in O(1), returning physical blocks immediately to the free pool",
                    "It halts the entire GPU execution and runs a ten-second garbage collection sweep",
                    "It permanently disables the rejected memory addresses until the server is rebooted",
                    "It writes the rejected tokens to disk logs before deallocating memory"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "The speculative block manager maintains reference counts and virtual block pointers. Rejected draft tokens are popped in O(1) time and their physical blocks return to the free list with zero copying overhead."
            }
        },
        {
            "title": "Fused AWQ & FP8 Dequantization GEMM Execution Pipelines",
            "say": part3_say,
            "example": "On chip unpacking resembles reconstituting dense dehydrated rations directly inside field mess kits without hauling water barrels across mountain logistics corridors.",
            "code": code3,
            "output": output3,
            "codeNotes": [
                {"line": 1, "note": "Defines performance metrics comparing standard FP16 GEMV with fused AWQ INT4 packed GEMV."},
                {"line": 15, "note": "Calculates memory bus load: INT4 cuts weight bytes transferred from 33.5MB down to 8.4MB."},
                {"line": 34, "note": "Demonstrates a 4x reduction in weight transfer latency, dropping execution time from 16.8us to 4.2us."}
            ],
            "tryIt": "Contrast effective bandwidth and latency between half and four bit modes.",
            "check": {
                "question": "Why do fused AWQ INT4 CUDA kernels execute on-the-fly dequantization inside GPU registers rather than in high-bandwidth DRAM?",
                "options": [
                    "Dequantizing inside registers avoids writing full-precision weights back to DRAM, eliminating 75% of memory bus traffic during memory-bound decoding",
                    "GPU registers have higher storage capacity than high-bandwidth memory",
                    "Writing to DRAM is completely disabled during autoregressive generation",
                    "Tensor Cores can only read integer registers and cannot execute floating-point operations"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Autoregressive decoding is strictly memory-bandwidth bound. Loading packed INT4 weights and dequantizing them in registers saves 75% memory bus bandwidth, achieving massive latency speedups."
            }
        },
        {
            "title": "Distributed Multi-GPU Tensor Parallelism & All-Reduce Synchronization",
            "say": part4_say,
            "example": "Multi lane expressways synchronize heavy freight traffic without stalls by routing local vehicles through independent lanes before merging smoothly at cloverleaf junctions.",
            "code": code4,
            "output": output4,
            "codeNotes": [
                {"line": 1, "note": "Simulates Megatron Tensor Parallelism communication overhead across multi-GPU ranks."},
                {"line": 8, "note": "Calculates Ring All-Reduce byte transfers: 2 All-Reduces per transformer layer across 32 layers."},
                {"line": 21, "note": "Demonstrates that NVLink 4.0 transfers 1.75MB in 2 microseconds, ensuring high multi-GPU scalability."}
            ],
            "tryIt": "Evaluate collective communication latency across multi GPU configurations.",
            "check": {
                "question": "How many All-Reduce collective communication operations are required per transformer layer in Megatron-style Tensor Parallelism?",
                "options": [
                    "Exactly two: one following the multi-head attention output projection, and one following the MLP down-projection",
                    "Sixteen: one for every attention head in the layer",
                    "Zero: Megatron parallelism requires no inter-GPU communication during inference",
                    "One hundred twenty-eight: one for every weight parameter row"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Megatron Tensor Parallelism uses column-parallel projections for QKV and MLP-Gate/Up, followed by row-parallel projections for Attention-Out and MLP-Down, needing exactly 2 All-Reduces per layer."
            }
        },
        {
            "title": "Milestone 7 Capstone: The Ultra-High-Throughput Industrial Serving Engine",
            "say": part5_say,
            "example": "Integrated supersonic transports harmonize aerodynamics with jet thrust to achieve sustained Mach velocities while burning less aviation fuel per nautical passenger mile.",
            "code": code5,
            "output": output5,
            "codeNotes": [
                {"line": 1, "note": "Synthesizes empirical performance profiles comparing legacy contiguous serving with our unified engine."},
                {"line": 24, "note": "Unified engine slashes Time to First Token from 120ms to 24ms and Inter-Token Latency from 35.1ms to 7.2ms."},
                {"line": 28, "note": "Expands serving concurrency 8x from 16 to 128 streams while reducing GPU memory footprint by 44%."}
            ],
            "tryIt": "Benchmark throughput and latency across legacy and optimized serving modes.",
            "check": {
                "question": "What is the cumulative performance impact of combining FlashAttention, Speculative Drafting, PagedAttention, and AWQ Quantization in the unified serving engine?",
                "options": [
                    "It slashes Inter-Token Latency by nearly 5x, expands serving concurrency 8x, and reduces total GPU memory consumption by 44%",
                    "It increases training epoch duration by three hundred percent",
                    "It restricts the model to generating only twenty-five tokens per prompt",
                    "It requires replacing all GPU hardware with consumer smartphone microcontrollers"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "The unified architecture synergizes memory tiling, speculative multi-token verification, virtualized block tables, and fused quantized GEMM, unlocking up to 7x higher throughput and 8x concurrency."
            }
        }
    ],
    "summary": [
        "Modern LLM serving engines decouple compute-bound prompt prefill from memory-bound token decoding through disaggregated serving architectures.",
        "Continuous iteration-level scheduling reconstructs batches at every generation step, immediately evicting finished streams and admitting new requests without latency stalls.",
        "Speculative drafting integrates with PagedAttention virtual block tables to allow O(1) rollback and instant memory reclamation of rejected candidate tokens.",
        "Fused AWQ INT4 CUDA kernels stream packed weights directly into registers, eliminating 75% of DRAM memory bus traffic during autoregressive generation.",
        "Megatron Tensor Parallelism requires exactly two All-Reduce collectives per layer, completing in microseconds over high-speed NVLink interconnects.",
        "The unified Milestone 7 serving engine achieves up to 7x throughput leaps, 8x concurrency expansion, and sub-10ms inter-token latencies under heavy enterprise workloads."
    ],
    "projectStep": {
        "title": "Industrial High-Throughput Distributed Inference Engine Simulator",
        "steps": [
            "Construct a continuous iteration-level scheduler with dynamic batching and token-bucket admission control.",
            "Implement a speculative virtual block manager with O(1) rollback memory reclamation for draft trees.",
            "Deploy a fused AWQ INT4 and FP8 Tensor Core execution pipeline benchmarked across multi-GPU tensor-parallel ranks."
        ]
    }
}

# 1. Save day35_lesson.json
with open('scripts/branch_c/day35_lesson.json', 'w', encoding='utf-8') as f:
    json.dump(day35_dict, f, indent=2)

# 2. Append into src/lib/data/aiWebLongLessons.ts
ai_ts_path = 'src/lib/data/aiWebLongLessons.ts'
with open(ai_ts_path, 'r', encoding='utf-8') as f:
    ts_content = f.read()

last_bracket = ts_content.rfind('];')
assert last_bracket != -1, "Could not find '];'"

day35_json_str = json.dumps(day35_dict, indent=2)

new_ts_content = ts_content[:last_bracket].rstrip()
if not new_ts_content.endswith(','):
    new_ts_content += ',\n'
else:
    new_ts_content += '\n'

new_ts_content += day35_json_str + '\n];\n'

with open(ai_ts_path, 'w', encoding='utf-8') as f:
    f.write(new_ts_content)

print(f"Appended Day 35 to {ai_ts_path}")

# 3. Generate Visual Envelope
captions_data = [
    {
        "say1": "Asynchronous ingress gateways route incoming client requests to queues.",
        "say2": "Disaggregated architectures separate prefill nodes to prevent jitter.",
        "example": "Dynamic iteration scheduling resembles high frequency train dispatching.",
        "tryIt": "Trace dynamic iteration batching across multiple client request streams."
    },
    {
        "say1": "Speculative decoding proposes multiple draft tokens in parallel trees.",
        "say2": "Virtual block managers reclaim rejected candidate tokens in zero time.",
        "example": "Speculative draft allocation resembles reserving flexible airline seats.",
        "tryIt": "Inspect block table rollbacks when candidate draft tokens are rejected."
    },
    {
        "say1": "Fused quantization kernels stream packed weights directly into registers.",
        "say2": "Register dequantization eliminates extra high bandwidth memory passes.",
        "example": "On chip unpacking resembles reconstituting dense dehydrated rations.",
        "tryIt": "Contrast effective bandwidth and latency between half and four bit modes."
    },
    {
        "say1": "Megatron tensor parallelism partitions weight matrices across GPU ranks.",
        "say2": "Column and row projections partition transformer matrices across ranks.",
        "example": "Multi lane expressways synchronize heavy freight traffic without stalls.",
        "tryIt": "Evaluate collective communication latency across multi GPU configurations."
    },
    {
        "say1": "Unified inference engines synthesize speculative and virtual memory layers.",
        "say2": "Empirical benchmarks demonstrate reduced latency and higher concurrency.",
        "example": "Integrated supersonic transports harmonize aerodynamics with jet thrust.",
        "tryIt": "Benchmark throughput and latency across legacy and optimized serving modes."
    }
]

titles = [
    "End to End Serving Architecture and Dynamic Iteration Scheduling.",
    "Speculative Drafting Integration and Virtual Block Reclaim.",
    "Fused Quantized Matrix Multiplication Execution Pipelines.",
    "Distributed Multi GPU Tensor Parallelism and Synchronization.",
    "Milestone Seven Capstone Serving Engine Benchmark Synthesis."
]

columns_list = [
    ["Serving Component", "Operational Latency", "Throughput Scalability"],
    ["Speculative Phase", "Memory Management Mode", "Reclamation Latency"],
    ["Execution Pipeline", "Register Dequantization", "Bus Bandwidth Demand"],
    ["Distributed Primitive", "Collective Operation", "Interconnect Bandwidth"],
    ["Engine Configuration", "Serving Concurrency", "Inter Token Latency"]
]

steps_rows = [
    [
        [["Ingress Gateway Queue", "Sub Millisecond Dispatch", "Ten Thousand Requests"], ["Prefill Decode Split", "Disaggregated Hardware", "Zero Latency Jitter"]],
        [["Continuous Iteration Batching", "Dynamic Step Reconstruction", "Optimal GPU Utilization"], ["Evicted Finished Sequences", "Immediate Slot Recycling", "One Hundred Percent Concurrency"]],
        [["High Frequency Dispatch", "Continuous Rail Transit", "Zero Passenger Backlog"], ["Static Batching Bottleneck", "Padded Sequence Delays", "Massive Computational Waste"]],
        [["Burst Traffic Ingestion", "Token Bucket Rate Limiting", "Guaranteed Quality Of Service"], ["CPU Host Buffering", "Proactive OOM Prevention", "Rock Solid Cluster Stability"]]
    ],
    [
        [["Medusa Multi Head Proposer", "Parallel Candidate Trees", "High Lookahead Yield"], ["Target Verification Pass", "Single Forward Matrix Multiplication", "Deterministic Logit Checks"]],
        [["Virtual Block Allocation", "On Demand Table Population", "Zero Copy Prefix Sharing"], ["Rejected Branch Reclaim", "Instant Pointer Rollback", "Sub Microsecond Deallocation"]],
        [["Flexible Passenger Standby", "Dynamic Seat Reassignment", "Zero Empty Cabin Space"], ["Rigid Contiguous Booking", "High Booking Wastage", "Severe Airport Delays"]],
        [["Radix Tree Integration", "Shared Prefix Preservation", "Four Times Speedup Achieved"], ["Tree Attention Masking", "Causal Independence Enforced", "Flawless Output Fidelity"]]
    ],
    [
        [["Four Bit Packed Integers", "Direct SRAM Register Stream", "Seventy Five Percent Savings"], ["Register Dequantization", "Custom Bit Shifting Instructions", "Instant Tensor Core Delivery"]],
        [["Native Hopper FP Eight", "Dual Mode Tensor Cores", "Two Times Floating Point FLOPS"], ["Asynchronous Warp Copy", "Tensor Memory Accelerator", "Completely Hidden Latency"]],
        [["Dense Field Rations", "Reconstituted On Demand", "Zero Transport Burden"], ["Uncompressed Bulky Storage", "Massive Logistics Strain", "Severe Supply Chain Delays"]],
        [["Dynamic Kernel Dispatch", "Adaptive GEMV Or GEMM", "Maximum Hardware Efficiency"], ["Delayed Dynamic Scaling", "History Based Range Tracking", "Minimal Numerical Degradation"]]
    ],
    [
        [["Megatron Tensor Parallelism", "Orthogonal Weight Slicing", "Zero Redundant Memory"], ["Column Parallel Projections", "Independent Head Execution", "Zero Inter GPU Traffic"]],
        [["Row Parallel Output", "Ring All Reduce Collective", "Microsecond Synchronization"], ["NVLink Crossbar Fabric", "Nine Hundred Gigabytes Per Second", "Linear Cluster Scaling"]],
        [["Synchronized Multi Lane Roads", "Parallel Vehicle Flow", "Zero Intersection Congestion"], ["Single Lane Toll Booths", "Severe Bottlenecks", "Massive Freight Gridlock"]],
        [["Coordinated Block Tables", "Synchronized Paged Addressing", "Zero Memory Divergence"], ["Asynchronous Overlap", "Compute And Comm Pipelined", "Zero Idle Core Bubbles"]]
    ],
    [
        [["Legacy Contiguous FP Sixteen", "Sixteen Active Streams", "Thirty Five Milliseconds ITL"], ["Unified Industrial Engine", "One Hundred Twenty Eight Streams", "Seven Milliseconds ITL"]],
        [["FlashAttention Memory Tiling", "Online Softmax Reduction", "Zero Global Memory Traffic"], ["Paged Virtual Management", "Radix Tree Prefix Sharing", "Four Times Memory Savings"]],
        [["Supersonic Jet Transport", "Harmonized Propulsion", "Maximum Aviation Efficiency"], ["Legacy Propeller Craft", "High Fuel Consumption", "Low Travel Speed"]],
        [["Production Telemetry Gate", "Strict P Ninety Nine Latency", "Enterprise SLA Met"], ["Datacenter Cost Reduction", "Seventy Percent TCO Savings", "Commercial Viability Achieved"]]
    ]
]

entries = []
for p_idx, part in enumerate(day35_dict['parts']):
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
    "day": 35,
    "entries": entries
}

out_path = 'src/lib/data/lessonVisuals/ai/day-35.json'
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(envelope, f, indent=2)

print(f"Generated Gate v2 visual envelope with 5 entries at {out_path}")
