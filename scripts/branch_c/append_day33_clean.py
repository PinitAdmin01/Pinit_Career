import json
import hashlib
import os

from generate_day33_all import part1_say, part2_say, part3_say, part4_say, part5_say

code1 = """function simulateMemoryFragmentation(numRequests: number, maxContextLen: number, avgActualLen: number) {
  const bytesPerToken = 2 * 32 * 128 * 2;
  const legacyAllocatedBytes = numRequests * maxContextLen * bytesPerToken;
  const actualUsedBytes = numRequests * avgActualLen * bytesPerToken;
  const internalFragmentationBytes = legacyAllocatedBytes - actualUsedBytes;
  const legacyWastedRatio = (internalFragmentationBytes / legacyAllocatedBytes) * 100;
  const blockSize = 16;
  const blocksPerReq = Math.ceil(avgActualLen / blockSize);
  const pagedAllocatedBytes = numRequests * blocksPerReq * blockSize * bytesPerToken;
  const pagedWastedBytes = pagedAllocatedBytes - actualUsedBytes;
  const pagedWastedRatio = (pagedWastedBytes / pagedAllocatedBytes) * 100;

  return {
    numRequests,
    legacyAllocatedGB: Number((legacyAllocatedBytes / (1024 ** 3)).toFixed(2)),
    actualUsedGB: Number((actualUsedBytes / (1024 ** 3)).toFixed(2)),
    legacyWastePercent: `${legacyWastedRatio.toFixed(1)}%`,
    pagedAllocatedGB: Number((pagedAllocatedBytes / (1024 ** 3)).toFixed(2)),
    pagedWastePercent: `${pagedWastedRatio.toFixed(1)}%`
  };
}
console.log(simulateMemoryFragmentation(32, 4096, 1200));"""

output1 = """{
  numRequests: 32,
  legacyAllocatedGB: 2,
  actualUsedGB: 0.59,
  legacyWastePercent: '70.7%',
  pagedAllocatedGB: 0.59,
  pagedWastePercent: '0.0%'
}"""

code2 = """class PagedBlockManager {
  private freeBlocks: number[];
  private blockTables: Map<string, number[]>;
  private blockSize: number;

  constructor(totalBlocks: number, blockSize: number = 16) {
    this.freeBlocks = Array.from({ length: totalBlocks }, (_, i) => i);
    this.blockTables = new Map();
    this.blockSize = blockSize;
  }

  allocate(requestId: string, numTokens: number): number[] {
    const neededBlocks = Math.ceil(numTokens / this.blockSize);
    const assigned: number[] = [];
    for (let i = 0; i < neededBlocks; i++) {
      const b = this.freeBlocks.pop();
      if (b === undefined) throw new Error('Out of memory');
      assigned.push(b);
    }
    this.blockTables.set(requestId, assigned);
    return assigned;
  }

  translateTokenAddress(requestId: string, tokenIndex: number): { blockId: number; offset: number } {
    const table = this.blockTables.get(requestId);
    if (!table) throw new Error('Request not found');
    const logicalBlockIndex = Math.floor(tokenIndex / this.blockSize);
    const offset = tokenIndex % this.blockSize;
    return { blockId: table[logicalBlockIndex], offset };
  }
}

const manager = new PagedBlockManager(100, 16);
const allocated = manager.allocate('req-01', 45);
console.log('Allocated physical blocks for req-01 (45 tokens):', allocated);
console.log('Translate token index 35:', manager.translateTokenAddress('req-01', 35));"""

output2 = """Allocated physical blocks for req-01 (45 tokens): [ 99, 98, 97 ]
Translate token index 35: { blockId: 97, offset: 3 }"""

code3 = """interface PrefixNode {
  tokenHash: string;
  physicalBlockId: number;
  refCount: number;
  children: Map<string, PrefixNode>;
}

class RadixPrefixCache {
  private root: Map<string, PrefixNode> = new Map();

  cacheSystemPrompt(promptTokens: string[], blockIds: number[]): number {
    let currentMap = this.root;
    let cachedBlocks = 0;
    for (let i = 0; i < promptTokens.length; i++) {
      const tok = promptTokens[i];
      if (!currentMap.has(tok)) {
        const node: PrefixNode = {
          tokenHash: tok,
          physicalBlockId: blockIds[i],
          refCount: 1,
          children: new Map()
        };
        currentMap.set(tok, node);
        cachedBlocks++;
      } else {
        const existing = currentMap.get(tok)!;
        existing.refCount++;
      }
      currentMap = currentMap.get(tok)!.children;
    }
    return cachedBlocks;
  }

  lookupPrefix(promptTokens: string[]): { matchedBlocks: number[]; cacheHitRate: string } {
    let currentMap = this.root;
    const matched: number[] = [];
    for (const tok of promptTokens) {
      if (currentMap.has(tok)) {
        const node = currentMap.get(tok)!;
        matched.push(node.physicalBlockId);
        currentMap = node.children;
      } else {
        break;
      }
    }
    const hitRate = ((matched.length / promptTokens.length) * 100).toFixed(1);
    return { matchedBlocks: matched, cacheHitRate: `${hitRate}%` };
  }
}

const prefixCache = new RadixPrefixCache();
prefixCache.cacheSystemPrompt(['You', 'are', 'an', 'enterprise', 'AI'], [10, 11, 12, 13, 14]);
const lookup = prefixCache.lookupPrefix(['You', 'are', 'an', 'enterprise', 'AI', 'assist', 'me']);
console.log('Prefix cache lookup result:', lookup);"""

output3 = """Prefix cache lookup result: { matchedBlocks: [ 10, 11, 12, 13, 14 ], cacheHitRate: '71.4%' }"""

code4 = """function scheduleChunkedPrefillBatch(
  pendingPrefills: { reqId: string; remainingTokens: number }[],
  activeDecodes: { reqId: string }[],
  maxTokensPerBatch: number = 512
) {
  let tokenBudget = maxTokensPerBatch;
  let scheduledDecodes = Math.min(activeDecodes.length, tokenBudget);
  tokenBudget -= scheduledDecodes;

  let scheduledPrefills = 0;
  let chunkedCount = 0;
  for (const prefill of pendingPrefills) {
    if (tokenBudget <= 0) break;
    const chunk = Math.min(prefill.remainingTokens, tokenBudget);
    scheduledPrefills += chunk;
    tokenBudget -= chunk;
    prefill.remainingTokens -= chunk;
    chunkedCount++;
  }

  return {
    prefillTokens: scheduledPrefills,
    decodeTokens: scheduledDecodes,
    totalTokens: scheduledPrefills + scheduledDecodes,
    chunkedRequests: chunkedCount
  };
}

const prefills = [{ reqId: 'p1', remainingTokens: 1024 }, { reqId: 'p2', remainingTokens: 512 }];
const decodes = [{ reqId: 'd1' }, { reqId: 'd2' }, { reqId: 'd3' }, { reqId: 'd4' }];
console.log(scheduleChunkedPrefillBatch(prefills, decodes, 512));"""

output4 = """{
  prefillTokens: 508,
  decodeTokens: 4,
  totalTokens: 512,
  chunkedRequests: 1
}"""

code5 = """function evaluateVLLMCapacity(totalVRAMGB: number, modelParamsB: number) {
  const weightsGB = modelParamsB * 2;
  const runtimeOverheadGB = 4.0;
  const kvCacheAvailableGB = totalVRAMGB - weightsGB - runtimeOverheadGB;
  const bytesPerToken = 16384;
  const avgTokensPerStream = 2048;
  const memoryPerStreamGB = (avgTokensPerStream * bytesPerToken) / (1024 ** 3);

  const maxConcurrentPaged = Math.floor(kvCacheAvailableGB / memoryPerStreamGB);
  const maxConcurrentLegacy = Math.floor(maxConcurrentPaged * 0.32);

  return {
    gpuTotalMemoryGB: totalVRAMGB,
    weightsGB,
    kvCacheAvailableGB: Number(kvCacheAvailableGB.toFixed(2)),
    maxConcurrentStreams: maxConcurrentPaged,
    throughputGain: `${(maxConcurrentPaged / maxConcurrentLegacy).toFixed(2)}x vs Legacy`
  };
}
console.log(evaluateVLLMCapacity(80, 7));"""

output5 = """{
  gpuTotalMemoryGB: 80,
  weightsGB: 14,
  kvCacheAvailableGB: 62,
  maxConcurrentStreams: 1984,
  throughputGain: '3.13x vs Legacy'
}"""

day33_dict = {
    "day": 33,
    "title": "PagedAttention & KV-Cache Virtual Memory Fragmentation: vLLM Block Managers, Zero-Copy Prefix Caching & Chunked Prefill",
    "goal": "Master physical GPU memory management, PagedAttention virtual block tables, zero-copy prefix caching, and chunked prefill scheduling to eliminate memory fragmentation in high-throughput LLM serving.",
    "minutes": 38,
    "recap": "Yesterday we mastered Speculative Decoding and Medusa multi-head tree drafting to break through the memory-bandwidth bottleneck during token generation. Today we conquer the primary limiter of multi-user concurrency: KV-cache memory fragmentation, using PagedAttention and vLLM block managers.",
    "parts": [
        {
            "title": "The KV-Cache Memory Wall & Physical Fragmentation",
            "say": part1_say,
            "example": "Contiguous allocation is like a parking garage that reserves an entire tour bus stall for every vehicle that enters; a compact motorcycle wastes ninety percent of its stall while other cars are turned away at the gate.",
            "code": code1,
            "output": output1,
            "codeNotes": [
                {"line": 1, "note": "Simulates memory fragmentation contrasting legacy pre-allocation with paged block allocation."},
                {"line": 6, "note": "Pre-allocating max context buffers incurs over 70% internal fragmentation waste."},
                {"line": 10, "note": "Paged allocation on demand confines waste to less than 4% on the final block."}
            ],
            "tryIt": "Simulate fragmentation across varying context lengths and memory waste.",
            "check": {
                "question": "Why did legacy LLM serving systems waste between sixty and eighty percent of physical GPU memory?",
                "options": [
                    "They pre-allocated monolithic contiguous buffers sized to the maximum context length for every incoming request upfront",
                    "GPU memory chips lose half their capacity when operating at high temperatures",
                    "The Transformer architecture stores key and value tensors in uncompressed ASCII format",
                    "CUDA blocks require sixty-four bytes of padding between consecutive floating point numbers"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Legacy runtimes pre-allocated contiguous memory corresponding to the maximum supported context length for every request, leaving the vast majority of reserved DRAM empty and fragmented."
            }
        },
        {
            "title": "PagedAttention Architecture & Operating System Virtual Memory Paging Analogy",
            "say": part2_say,
            "example": "PagedAttention is like a loose-leaf binder: instead of binding a thousand-page blank book for every student, the teacher hands out single sheets as needed and indexes their locations in a simple notebook directory.",
            "code": code2,
            "output": output2,
            "codeNotes": [
                {"line": 1, "note": "Implements the PagedBlockManager maintaining logical-to-physical block translation tables."},
                {"line": 12, "note": "Allocates fixed physical blocks from a central pool on demand as token sequences grow."},
                {"line": 23, "note": "Translates any logical token index into a physical block ID and intra-block offset in O(1) time."}
            ],
            "tryIt": "Inspect translated token address offsets and verify physical block indices.",
            "check": {
                "question": "How does PagedAttention eliminate external memory fragmentation in GPU DRAM?",
                "options": [
                    "By partitioning the KV-cache into fixed-size physical blocks, allowing any freed block to be assigned to any request immediately",
                    "By compressing all token vectors using lossy JPEG encoding",
                    "By enforcing identical prompt lengths across all active users in the cluster",
                    "By moving all key and value tensors into CPU system RAM permanently"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Because all physical memory blocks are identical in size (e.g., 16 tokens), any freed block can be reassigned to any active request without creating unusable address gaps."
            }
        },
        {
            "title": "Zero-Copy Prefix Caching & Radix Tree Management",
            "say": part3_say,
            "example": "Prefix caching is like a printing press that prints the common front page once for ten thousand readers, adding customized personal address stickers to each copy rather than re-typesetting the entire newspaper ten thousand times.",
            "code": code3,
            "output": output3,
            "codeNotes": [
                {"line": 1, "note": "Defines Radix Tree prefix nodes tracking physical block IDs and atomic reference counts."},
                {"line": 10, "note": "Caches shared system prompt token sequences and stores physical block references in the tree."},
                {"line": 34, "note": "Matches incoming prompt prefixes against cached blocks, achieving high cache hit rates with zero memory copy."}
            ],
            "tryIt": "Simulate divergent prompt branching and observe prefix cache hit rate.",
            "check": {
                "question": "What mechanism ensures that multiple requests can share identical prefix blocks safely without corrupting each other's state?",
                "options": [
                    "Copy-on-write semantics with atomic reference counters that duplicate a block only when a request modifies it",
                    "Read-only file system locks enforced by the Linux operating system kernel",
                    "Re-encrypting all shared tensors with distinct public keys for every user",
                    "Executing all user requests sequentially in single-threaded mode"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Copy-on-write (COW) semantics allow multiple requests to read the same physical block while tracking reference counts, copying the block only when a divergent token is appended."
            }
        },
        {
            "title": "Chunked Prefill & Mixed Batching Scheduling",
            "say": part4_say,
            "example": "Monolithic prefill is like a grocery shopper with five full shopping carts who blocks the single checkout lane for twenty minutes; chunked prefill checks out ten items at a time, letting quick single-item shoppers pass through in between.",
            "code": code4,
            "output": output4,
            "codeNotes": [
                {"line": 1, "note": "Schedules mixed batches interleaving prefill chunks with ongoing decode steps."},
                {"line": 7, "note": "Prioritizes autoregressive decode steps to preserve smooth streaming inter-token latency SLAs."},
                {"line": 14, "note": "Allocates remaining batch token budget to slice large incoming prompts into uniform prefill chunks."}
            ],
            "tryIt": "Tune batch token budget and observe decode prefill token allocation.",
            "check": {
                "question": "Why does chunked prefill prevent inter-token latency jitter in continuous batching engines?",
                "options": [
                    "It slices long prompts into small uniform chunks, preventing long prefill bursts from starving ongoing decode streams",
                    "It doubles the clock speed of GPU memory buses during prompt evaluation",
                    "It discards prompt tokens that exceed five hundred twelve characters",
                    "It converts autoregressive generation into non-autoregressive parallel classification"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Chunked prefill caps the maximum computation per iteration, ensuring that ongoing token generation streams are never starved by multi-second prefill bursts."
            }
        },
        {
            "title": "Production vLLM Deployment, Memory Telemetry & Enterprise Capacity Planning",
            "say": part5_say,
            "example": "Operating production vLLM without capacity planning is like an airport that welcomes flights without checking terminal gates; proper memory management guarantees every landing jet has an immediate gate and refuels without circling.",
            "code": code5,
            "output": output5,
            "codeNotes": [
                {"line": 1, "note": "Calculates physical GPU memory allocation across weights, runtime overhead, and the KV-cache block pool."},
                {"line": 9, "note": "Demonstrates over 3.1x concurrency gain on an 80GB GPU by eliminating memory fragmentation."},
                {"line": 17, "note": "Supports nearly 2,000 concurrent user streams simultaneously on a single A100 accelerator."}
            ],
            "tryIt": "Evaluate capacity across different accelerators and concurrency limits.",
            "check": {
                "question": "What happens in a production vLLM deployment when physical GPU KV-cache capacity is temporarily exhausted?",
                "options": [
                    "The block manager swaps least-recently-used physical blocks to host CPU memory over PCIe, preventing out-of-memory crashes",
                    "The GPU hardware resets and terminates all running server processes",
                    "The model begins generating random punctuation characters",
                    "The cluster automatically purchases additional cloud GPU instances"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "vLLM implements graceful swapping, migrating unreferenced or low-priority physical blocks to host system memory over PCIe to prevent fatal out-of-memory exceptions."
            }
        }
    ],
    "summary": [
        "The KV-cache memory requirement scales linearly with sequence length and concurrency, causing legacy contiguous allocation to waste up to 80% of GPU DRAM in fragmentation.",
        "PagedAttention divides the KV-cache into fixed-size physical blocks (e.g., 16 tokens), using logical block tables to translate token positions into scattered memory locations.",
        "Virtual block tables eliminate external fragmentation entirely and confine internal fragmentation to the very last block of a request (under 4% total memory waste).",
        "Zero-copy prefix caching uses a Radix Tree with copy-on-write semantics to share identical prompt blocks across multiple requests without memory duplication.",
        "Chunked prefill slices long prompts into uniform chunks (e.g., 512 tokens), co-scheduling prefill computation with ongoing decode steps to eliminate generation jitter.",
        "Production capacity planning balances the GPU memory utilization ratio, model weights, and physical block pools to increase serving concurrency by 2x to 4x."
    ],
    "projectStep": {
        "title": "Industrial PagedAttention Memory Manager & Radix Prefix Cache Engine",
        "steps": [
            "Implement a virtualized block manager that maintains logical-to-physical block tables and executes O(1) address translation.",
            "Construct a Radix Tree prefix cache supporting copy-on-write reference counting for shared conversational system prompts.",
            "Deploy a chunked prefill mixed-batch scheduler that enforces token budgets to eliminate prefill latency spikes on active streaming decodes."
        ]
    }
}

# 1. Save day33_lesson.json
with open('scripts/branch_c/day33_lesson.json', 'w', encoding='utf-8') as f:
    json.dump(day33_dict, f, indent=2)

# 2. Append into src/lib/data/aiWebLongLessons.ts
ai_ts_path = 'src/lib/data/aiWebLongLessons.ts'
with open(ai_ts_path, 'r', encoding='utf-8') as f:
    ts_content = f.read()

last_bracket = ts_content.rfind('];')
assert last_bracket != -1, "Could not find '];'"

day33_json_str = json.dumps(day33_dict, indent=2)

new_ts_content = ts_content[:last_bracket].rstrip()
if not new_ts_content.endswith(','):
    new_ts_content += ',\n'
else:
    new_ts_content += '\n'

new_ts_content += day33_json_str + '\n];\n'

with open(ai_ts_path, 'w', encoding='utf-8') as f:
    f.write(new_ts_content)

print(f"Appended Day 33 to {ai_ts_path}")

# 3. Generate Visual Envelope
captions_data = [
    {
        "say1": "Contiguous memory allocation creates severe internal cache fragmentation.",
        "say2": "Preallocating maximum context buffers leaves vast global memory unused.",
        "example": "Rigid parking reservations waste space when compact vehicles enter.",
        "tryIt": "Simulate fragmentation across varying context lengths and memory waste."
    },
    {
        "say1": "PagedAttention partitions physical memory into fixed size token blocks.",
        "say2": "Logical block tables map token sequences to scattered physical blocks.",
        "example": "Loose leaf indexing allocates sheets on demand without empty pages.",
        "tryIt": "Inspect translated token address offsets and verify physical block indices."
    },
    {
        "say1": "Zero copy prefix caching eliminates duplicate prompt tensor evaluations.",
        "say2": "Radix tree cache records shared prefix blocks across independent queries.",
        "example": "Printing common text once saves massive typesetting time across readers.",
        "tryIt": "Simulate divergent prompt branching and observe prefix cache hit rate."
    },
    {
        "say1": "Monolithic prompt prefill bursts monopolize tensor cores and cause jitter.",
        "say2": "Chunked prefill divides large prompts into uniform schedulable slices.",
        "example": "Interleaving item scanning allows quick shoppers to pass without delay.",
        "tryIt": "Tune batch token budget and observe decode prefill token allocation."
    },
    {
        "say1": "Production serving configuration tunes memory utilization and block pools.",
        "say2": "Allocating dedicated block pools supports thousands of concurrent streams.",
        "example": "Managed terminal gates ensure arriving flights land without air delays.",
        "tryIt": "Evaluate capacity across different accelerators and concurrency limits."
    }
]

titles = [
    "Contiguous Memory Allocation and Physical Cache Fragmentation.",
    "PagedAttention Block Tables and Virtual Address Translation.",
    "Zero Copy Prefix Caching and Radix Tree Reference Counting.",
    "Chunked Prefill Scheduling and Interleaved Decode Execution.",
    "Production vLLM Deployment and Enterprise Capacity Planning."
]

columns_list = [
    ["Allocation Model", "Memory Waste Ratio", "Concurrency Limitation"],
    ["Memory Architecture", "Block Allocation Mode", "Address Resolution"],
    ["Caching Strategy", "Duplicate KV Vectors", "Time To First Token"],
    ["Batching Scheme", "Execution Duration", "Inter Token Latency"],
    ["Engine Setting", "Physical Memory Pool", "Active Stream Capacity"]
]

steps_rows = [
    [
        [["Contiguous Legacy Preallocation", "Seventy Percent Waste", "Severe Concurrency Limit"], ["Paged Dynamic Allocation", "Under Four Percent Waste", "Maximum Concurrency Scale"]],
        [["Max Context Buffer Allocated", "Empty Unused Space Preserved", "Premature Out Of Memory"], ["On Demand Token Allocation", "Zero Unused Space Reserved", "One Hundred Percent DRAM Use"]],
        [["Rigid Tour Bus Stall", "Single Vehicle Parked", "Massive Idle Asphalt"], ["Flexible Compact Parking", "Vehicles Slotted Tightly", "Zero Wasted Garage Space"]],
        [["Short Sequence Request", "Low Actual Memory Utilized", "Eighty Percent Reclaimed"], ["Long Sequence Request", "Progressive Memory Growth", "Smooth Linear Scaling"]]
    ],
    [
        [["Physical Frame Partitioning", "Fixed Sixteen Token Blocks", "Global Pool Management"], ["Virtual Address Translation", "Logical Block Table Lookup", "Direct Non Contiguous Gathering"]],
        [["Logical Block Zero", "Physical Block Ninety Nine", "Zero Stride Contiguity Required"], ["Logical Block One", "Physical Block Twelve", "Scattered DRAM Allocation"]],
        [["Prebound Blank Notebook", "Fixed Unalterable Pages", "High Paper Waste"], ["Loose Leaf Ring Binder", "Sheets Inserted On Demand", "Optimal Storage Efficiency"]],
        [["Logical Token Index Thirty Five", "Physical Block Ninety Seven", "Intra Block Offset Three"], ["Translation Latency", "Sub Microsecond Bit Shift", "Zero GPU Compute Penalty"]]
    ],
    [
        [["Redundant Prefix Processing", "Full Recomputation Per Query", "Severe Server Congestion"], ["Zero Copy Prefix Caching", "Reused Existing Block Tables", "Instant First Token Arrival"]],
        [["System Prompt Shared", "Single Physical Storage", "Dozens Of Pointer References"], ["Copy On Write Divergence", "Private Block Cloned", "Independent Generation Maintained"]],
        [["Typesetting Front Page Repeatedly", "Hours Of Wasted Press Time", "Bottlenecked Distribution"], ["Printing Common Plate Once", "Immediate High Speed Press", "Instant Custom Dispatch"]],
        [["Cache Hit Ratio High", "Seventy Percent Prefill Skipped", "Three Times Throughput Gain"], ["Cache Miss Fallback", "Evaluate New Prefix Chunk", "Register In Radix Tree"]]
    ],
    [
        [["Monolithic Prefill Burst", "Hundreds Of Milliseconds Stall", "Severe Jitter On Decodes"], ["Chunked Prefill Slicing", "Uniform Five Hundred Twelve Tokens", "Consistent Iteration Timing"]],
        [["Mixed Batch Construction", "Co Scheduled Prefill And Decode", "Balanced Tensor Core Load"], ["Token Budget Allocation", "Decode Streams Prioritized", "Guaranteed Streaming Latency"]],
        [["Shopper With Five Full Carts", "Blocking Single Cash Register", "Long Customer Wait Lines"], ["Quick Item Lane Interleaving", "Smooth Steady Checkout", "Minimal Queue Delay"]],
        [["Iteration Latency Capped", "Sub Thirty Milliseconds", "Strict SLA Compliance Maintained"], ["Hardware Saturation", "High Arithmetic Intensity", "Zero Pipeline Bubble Loss"]]
    ],
    [
        [["Eighty Gigabyte A One Hundred", "Seventy Two Gigabytes Reserved", "Fifty Four Gigabyte KV Pool"], ["Model Weights Footprint", "Fourteen Gigabytes FP Sixteen", "Static Memory Allocation"]],
        [["Block Table Concurrency", "Nearly Two Thousand Streams", "Over Three Times Legacy Scale"], ["Tensor Parallel Eight Way", "Synchronized Block Tables", "Zero Inter Rank Divergence"]],
        [["Unmanaged Airport Runways", "Planes Circling In Stacks", "Severe Flight Delays"], ["Synchronized Gate Management", "Smooth Runway Operations", "Zero Holding Pattern Overhead"]],
        [["Memory Pressure Warning", "Eighty Five Percent Threshold", "Proactive Eviction Triggered"], ["Host Swapping Support", "PCIe Block Migration", "Zero Fatal Server Crashes"]]
    ]
]

entries = []
for p_idx, part in enumerate(day33_dict['parts']):
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
    "day": 33,
    "entries": entries
}

out_path = 'src/lib/data/lessonVisuals/ai/day-33.json'
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(envelope, f, indent=2)

print(f"Generated Gate v2 visual envelope with 5 entries at {out_path}")
