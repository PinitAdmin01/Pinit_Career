// Part 1: Legacy Contiguous KV-Cache vs Paged Memory Fragmentation Simulator
function simulateMemoryFragmentation(numRequests: number, maxContextLen: number, avgActualLen: number) {
  const bytesPerToken = 2 * 32 * 128 * 2; // 2 (K+V) * 32 layers * 128 headDim * 2 bytes (FP16) = 16,384 bytes = 16 KB/token
  
  // Legacy contiguous allocation: allocates maxContextLen upfront for each request
  const legacyAllocatedBytes = numRequests * maxContextLen * bytesPerToken;
  const actualUsedBytes = numRequests * avgActualLen * bytesPerToken;
  const internalFragmentationBytes = legacyAllocatedBytes - actualUsedBytes;
  const legacyWastedRatio = (internalFragmentationBytes / legacyAllocatedBytes) * 100;

  // PagedAttention allocation: allocates in blocks of 16 tokens on-demand
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

console.log('--- PART 1: MEMORY FRAGMENTATION ---');
console.log(simulateMemoryFragmentation(32, 4096, 1200));

// Part 2: PagedAttention Block Table Address Translation
interface PhysicalBlock {
  blockId: number;
  tokensStored: number;
  data: string[];
}

class PagedBlockManager {
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

console.log('--- PART 2: BLOCK TABLE TRANSLATION ---');
const manager = new PagedBlockManager(100, 16);
const allocated = manager.allocate('req-01', 45);
console.log('Allocated physical blocks for req-01 (45 tokens):', allocated);
console.log('Translate token index 35:', manager.translateTokenAddress('req-01', 35));

// Part 3: Zero-Copy Prefix Caching (Radix Tree Simulator)
interface PrefixNode {
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

console.log('--- PART 3: ZERO-COPY PREFIX CACHING ---');
const prefixCache = new RadixPrefixCache();
prefixCache.cacheSystemPrompt(['You', 'are', 'an', 'enterprise', 'AI'], [10, 11, 12, 13, 14]);
const lookup = prefixCache.lookupPrefix(['You', 'are', 'an', 'enterprise', 'AI', 'assist', 'me']);
console.log('Prefix cache lookup result:', lookup);

// Part 4: Chunked Prefill Scheduler Simulator
interface BatchSchedule {
  prefillTokens: number;
  decodeTokens: number;
  totalTokens: number;
  chunkedRequests: number;
}

function scheduleChunkedPrefillBatch(
  pendingPrefills: { reqId: string; remainingTokens: number }[],
  activeDecodes: { reqId: string }[],
  maxTokensPerBatch: number = 512
): BatchSchedule {
  let tokenBudget = maxTokensPerBatch;
  let scheduledDecodes = 0;
  let scheduledPrefills = 0;
  let chunkedCount = 0;

  // 1. Decode steps always get priority to protect inter-token latency SLAs
  scheduledDecodes = Math.min(activeDecodes.length, tokenBudget);
  tokenBudget -= scheduledDecodes;

  // 2. Remaining token budget allocated to prefill chunks
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

console.log('--- PART 4: CHUNKED PREFILL SCHEDULER ---');
const prefills = [{ reqId: 'p1', remainingTokens: 1024 }, { reqId: 'p2', remainingTokens: 512 }];
const decodes = [{ reqId: 'd1' }, { reqId: 'd2' }, { reqId: 'd3' }, { reqId: 'd4' }];
console.log(scheduleChunkedPrefillBatch(prefills, decodes, 512));

// Part 5: Production vLLM Capacity Telemetry Evaluator
interface VLLMCapacityMetrics {
  gpuTotalMemoryGB: number;
  weightsGB: number;
  kvCacheAvailableGB: number;
  maxConcurrentStreams: number;
  throughputGain: string;
}

function evaluateVLLMCapacity(totalVRAMGB: number, modelParamsB: number): VLLMCapacityMetrics {
  const weightsGB = modelParamsB * 2; // FP16
  const runtimeOverheadGB = 4.0;
  const kvCacheAvailableGB = totalVRAMGB - weightsGB - runtimeOverheadGB;
  const bytesPerToken = 16384; // 16 KB per token for 7B model
  const avgTokensPerStream = 2048;
  const memoryPerStreamGB = (avgTokensPerStream * bytesPerToken) / (1024 ** 3); // ~0.03125 GB

  // In legacy contiguous allocation, memory waste restricts concurrency by 3x
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

console.log('--- PART 5: VLLM CAPACITY TELEMETRY ---');
console.log(evaluateVLLMCapacity(80, 7));
