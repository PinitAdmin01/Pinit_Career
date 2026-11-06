// Test runner for Day 37 snippets
import vm from 'node:vm';
import { compileTs } from '../src/lib/code/ts/compileTs';

async function testSnippet(name: string, code: string): Promise<string> {
  const compiled = await compileTs(code);
  const out: string[] = [];
  const sandbox = {
    console: {
      log: (...args: unknown[]) => out.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '))
    },
    Math,
    Map,
    Set,
    String,
    Number,
    Boolean,
    Array,
    Object,
    JSON,
    BigInt,
    Date
  };
  vm.runInNewContext(compiled.js, sandbox, { timeout: 3000 });
  return out.join('\n');
}

const c1 = `interface ShardCapacity {
  shardId: string;
  maxWriteBytesPerSec: number;
  maxWriteRecordsPerSec: number;
  maxReadBytesPerSec: number;
}

class KinesisStreamTopology {
  private shards: ShardCapacity[] = [];

  constructor(shardCount: number) {
    for (let i = 0; i < shardCount; i++) {
      this.shards.push({
        shardId: \`shard-\${String(i).padStart(4, '0')}\`,
        maxWriteBytesPerSec: 1024 * 1024,
        maxWriteRecordsPerSec: 1000,
        maxReadBytesPerSec: 2 * 1024 * 1024,
      });
    }
  }

  evaluateIngest(recordsPerSec: number, avgSizeBytes: number): string {
    const totalBytesPerSec = recordsPerSec * avgSizeBytes;
    const streamWriteCapacityBytes = this.shards.length * 1024 * 1024;
    const streamWriteCapacityRecords = this.shards.length * 1000;

    const isThrottled = totalBytesPerSec > streamWriteCapacityBytes || recordsPerSec > streamWriteCapacityRecords;
    const throughputMB = (totalBytesPerSec / (1024 * 1024)).toFixed(2);
    const capacityMB = (streamWriteCapacityBytes / (1024 * 1024)).toFixed(2);

    return \`KINESIS_TOPOLOGY_STATUS: Shards=\${this.shards.length} IngestRate=\${throughputMB}MB/s (\${recordsPerSec} rec/s) MaxCapacity=\${capacityMB}MB/s Throttled=\${isThrottled}\`;
  }
}

const stream = new KinesisStreamTopology(10);
console.log(stream.evaluateIngest(8000, 1024));
console.log(stream.evaluateIngest(12000, 1024));`;

const c2 = `interface ShardHashRange {
  shardId: string;
  shardIndex: number;
}

class PartitionHashRouter {
  private shardRanges: ShardHashRange[] = [];

  constructor(shardCount: number) {
    for (let i = 0; i < shardCount; i++) {
      this.shardRanges.push({
        shardId: \`shard-\${String(i).padStart(4, '0')}\`,
        shardIndex: i,
      });
    }
  }

  // FNV-1a 64-bit hashing mapped directly to top-level shard partition index
  private hashKey(key: string): number {
    let h = 14695981039346656037n;
    for (let i = 0; i < key.length; i++) {
      h ^= BigInt(key.charCodeAt(i));
      h = (h * 1099511628211n) & 0xffffffffffffffffn;
    }
    return Number(h >> 62n); // Returns 0, 1, 2, or 3 for 4 shards
  }

  routeKey(partitionKey: string): string {
    const idx = this.hashKey(partitionKey);
    return this.shardRanges[idx].shardId;
  }
}

const router = new PartitionHashRouter(4);
const lowCardinalityKeys = ['device-type-A', 'device-type-A', 'device-type-A', 'device-type-B'];
const highCardinalityKeys = ['gamma', 'delta', 'telemetry', 'kinesis'];

const lowShards = lowCardinalityKeys.map(k => router.routeKey(k));
const highShards = highCardinalityKeys.map(k => router.routeKey(k));

console.log(\`LOW_CARDINALITY_ROUTING: UniqueKeys=2 TargetShards=\${new Set(lowShards).size}/4 HotShardDetected=\${new Set(lowShards).size < 3}\`);
console.log(\`HIGH_CARDINALITY_ROUTING: UniqueKeys=4 TargetShards=\${new Set(highShards).size}/4 UniformDistribution=\${new Set(highShards).size === 4}\`);`;

const c3 = `interface ShardNode {
  id: string;
  parent?: string;
  status: 'OPEN' | 'CLOSED';
  startHash: bigint;
  endHash: bigint;
}

class ShardLineageEngine {
  private shards: Map<string, ShardNode> = new Map();

  addRootShard(id: string, startHash: bigint, endHash: bigint) {
    this.shards.set(id, { id, status: 'OPEN', startHash, endHash });
  }

  splitShard(parentShardId: string, childAId: string, childBId: string): string {
    const parent = this.shards.get(parentShardId);
    if (!parent || parent.status !== 'OPEN') {
      throw new Error(\`Cannot split non-open shard \${parentShardId}\`);
    }

    parent.status = 'CLOSED';
    const mid = parent.startHash + (parent.endHash - parent.startHash) / 2n;

    this.shards.set(childAId, {
      id: childAId,
      parent: parentShardId,
      status: 'OPEN',
      startHash: parent.startHash,
      endHash: mid,
    });

    this.shards.set(childBId, {
      id: childBId,
      parent: parentShardId,
      status: 'OPEN',
      startHash: mid + 1n,
      endHash: parent.endHash,
    });

    const openCount = Array.from(this.shards.values()).filter(s => s.status === 'OPEN').length;
    return \`SPLIT_COMPLETE: Parent=\${parentShardId} (CLOSED) -> Children=[\${childAId}, \${childBId}] (OPEN) ActiveOpenShards=\${openCount}\`;
  }
}

const lineage = new ShardLineageEngine();
lineage.addRootShard('shard-0000', 0n, 1000n);
console.log(lineage.splitShard('shard-0000', 'shard-0001', 'shard-0002'));`;

const c4 = `interface ConsumerPerformance {
  consumerName: string;
  type: 'STANDARD_SHARED' | 'ENHANCED_FAN_OUT';
  pollIntervalMs: number;
  avgLatencyMs: number;
  dedicatedThroughputMBs: number;
}

function evaluateConsumerModel(consumers: number): { standard: ConsumerPerformance; efo: ConsumerPerformance } {
  const standard: ConsumerPerformance = {
    consumerName: 'Standard-Shared-GetRecords',
    type: 'STANDARD_SHARED',
    pollIntervalMs: 1000,
    avgLatencyMs: 1200,
    dedicatedThroughputMBs: +(2.0 / consumers).toFixed(2),
  };

  const efo: ConsumerPerformance = {
    consumerName: 'Enhanced-Fan-Out-HTTP2-Push',
    type: 'ENHANCED_FAN_OUT',
    pollIntervalMs: 0,
    avgLatencyMs: 68,
    dedicatedThroughputMBs: 2.0,
  };

  return { standard, efo };
}

const metrics = evaluateConsumerModel(5);
console.log(\`[\${metrics.standard.type}] Consumers=5 DedicatedBandwidth=\${metrics.standard.dedicatedThroughputMBs}MB/s AvgLatency=\${metrics.standard.avgLatencyMs}ms\`);
console.log(\`[\${metrics.efo.type}] Consumers=5 DedicatedBandwidth=\${metrics.efo.dedicatedThroughputMBs}MB/s AvgLatency=\${metrics.efo.avgLatencyMs}ms\`);`;

const c5 = `interface TelemetryRecord {
  partitionKey: string;
  payloadBytes: number;
}

class ProductionKinesisPipeline {
  private activeShards: number;
  private efoConsumers: string[];

  constructor(initialShards: number, efoConsumers: string[]) {
    this.activeShards = initialShards;
    this.efoConsumers = efoConsumers;
  }

  simulateIngestBurst(records: TelemetryRecord[]): { totalBytes: number; throttled: boolean; maxShardLoadMB: number } {
    const totalBytes = records.reduce((acc, r) => acc + r.payloadBytes, 0);
    const capacityBytes = this.activeShards * 1024 * 1024;
    const throttled = totalBytes > capacityBytes;
    const maxShardLoadMB = +(totalBytes / (1024 * 1024 * this.activeShards)).toFixed(2);

    return { totalBytes, throttled, maxShardLoadMB };
  }

  getPipelineHealth(): string {
    const writeCapacityMB = this.activeShards;
    const totalReadCapacityMB = this.activeShards * 2 * this.efoConsumers.length;

    return \`KINESIS_PRODUCTION_PIPELINE_OK: Shards=\${this.activeShards} IngestCapacity=\${writeCapacityMB}MB/s EFOPipes=\${this.efoConsumers.length} TotalEFOReadCapacity=\${totalReadCapacityMB}MB/s Status=ACTIVE\`;
  }
}

const pipeline = new ProductionKinesisPipeline(8, ['AnalyticsEngine', 'FraudDetectionService', 'DataLakeS3Archiver']);
const batch: TelemetryRecord[] = Array.from({ length: 4000 }, (_, i) => ({
  partitionKey: \`sensor-\${i}-fixed\`,
  payloadBytes: 1024,
}));

const burst = pipeline.simulateIngestBurst(batch);
console.log(pipeline.getPipelineHealth());
console.log(\`BURST_SIMULATION: Records=\${batch.length} TotalVolume=\${(burst.totalBytes / 1024).toFixed(0)}KB AvgShardLoad=\${burst.maxShardLoadMB}MB/s Throttled=\${burst.throttled}\`);`;

async function main() {
  console.log('=== PART 1 ===');
  console.log(await testSnippet('P1', c1));
  console.log('\n=== PART 2 ===');
  console.log(await testSnippet('P2', c2));
  console.log('\n=== PART 3 ===');
  console.log(await testSnippet('P3', c3));
  console.log('\n=== PART 4 ===');
  console.log(await testSnippet('P4', c4));
  console.log('\n=== PART 5 ===');
  console.log(await testSnippet('P5', c5));
}

main();
