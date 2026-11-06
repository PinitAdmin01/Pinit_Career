import { compileTs } from '../src/lib/code/ts/compileTs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

async function runSnippet(code: string): Promise<string> {
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
    JSON
  };
  vm.runInNewContext(compiled.js, sandbox, { timeout: 2000 });
  return out.join('\n');
}

async function main() {
  console.log('Testing Day 40 Snippets...');

  // Snippet 1
  const code1 = `interface ShardCapacityPlan {
  totalTargetEventsPerSec: number;
  averageRecordSizeBytes: number;
  maxIngestBytesPerShardSec: number;
  maxIngestRecordsPerShardSec: number;
  requiredShards: number;
}

function calculateShardTopology(eventsPerSec: number, recordSizeBytes: number): ShardCapacityPlan {
  const bytesPerShard = 1048576; // 1 MB/sec
  const recordsPerShard = 1000;  // 1,000 records/sec
  
  const shardsByRecords = Math.ceil(eventsPerSec / recordsPerShard);
  const shardsByBandwidth = Math.ceil((eventsPerSec * recordSizeBytes) / bytesPerShard);
  const required = Math.max(shardsByRecords, shardsByBandwidth);

  return {
    totalTargetEventsPerSec: eventsPerSec,
    averageRecordSizeBytes: recordSizeBytes,
    maxIngestBytesPerShardSec: bytesPerShard,
    maxIngestRecordsPerShardSec: recordsPerShard,
    requiredShards: required,
  };
}

const plan = calculateShardTopology(1000000, 500);
console.log(\`KINESIS_TOPOLOGY_CALCULATION: TargetEvents=\${plan.totalTargetEventsPerSec.toLocaleString('en-US')} RecordSize=\${plan.averageRecordSizeBytes}B RequiredShards=\${plan.requiredShards} TotalIngestMB=\${((plan.totalTargetEventsPerSec * plan.averageRecordSizeBytes) / (1024 * 1024)).toFixed(1)}MB/s\`);`;
  const out1 = await runSnippet(code1);
  console.log('Snippet 1 Output:\n', out1);
  assert.equal(out1, 'KINESIS_TOPOLOGY_CALCULATION: TargetEvents=1,000,000 RecordSize=500B RequiredShards=1000 TotalIngestMB=476.8MB/s');

  // Snippet 2
  const code2 = `interface StreamEvent {
  eventId: string;
  timestampMs: number;
  value: number;
}

class WatermarkProcessor {
  private currentWatermark: number = 0;
  private maxAllowedLatenessMs: number;

  constructor(maxLatenessMs: number) {
    this.maxAllowedLatenessMs = maxLatenessMs;
  }

  processEvent(evt: StreamEvent): { accepted: boolean; currentWatermark: number; reason?: string } {
    if (evt.timestampMs < this.currentWatermark - this.maxAllowedLatenessMs) {
      return { accepted: false, currentWatermark: this.currentWatermark, reason: 'DROPPED_LATE_EVENT' };
    }
    if (evt.timestampMs - this.maxAllowedLatenessMs > this.currentWatermark) {
      this.currentWatermark = evt.timestampMs - this.maxAllowedLatenessMs;
    }
    return { accepted: true, currentWatermark: this.currentWatermark };
  }
}

const processor = new WatermarkProcessor(5000); // 5s allowed lateness
const res1 = processor.processEvent({ eventId: 'e1', timestampMs: 10000, value: 42 });
const res2 = processor.processEvent({ eventId: 'e2', timestampMs: 15000, value: 55 });
const res3 = processor.processEvent({ eventId: 'e3', timestampMs: 3000, value: 99 });

console.log(\`FLINK_WATERMARK: Event1 Accepted=\${res1.accepted} Watermark=\${res1.currentWatermark}ms\`);
console.log(\`FLINK_WATERMARK: Event2 Accepted=\${res2.accepted} Watermark=\${res2.currentWatermark}ms\`);
console.log(\`FLINK_WATERMARK: Event3 Accepted=\${res3.accepted} Reason=\${res3.reason} Watermark=\${res3.currentWatermark}ms\`);`;
  const out2 = await runSnippet(code2);
  console.log('Snippet 2 Output:\n', out2);
  assert.equal(out2, 'FLINK_WATERMARK: Event1 Accepted=true Watermark=5000ms\nFLINK_WATERMARK: Event2 Accepted=true Watermark=10000ms\nFLINK_WATERMARK: Event3 Accepted=false Reason=DROPPED_LATE_EVENT Watermark=10000ms');

  // Snippet 3
  const code3 = `interface MetricSample {
  deviceId: string;
  metric: number;
  timestamp: number;
}

class TumblingWindowAggregator {
  private windowSizeMs: number;
  private state: Map<string, { sum: number; count: number; windowStart: number }> = new Map();

  constructor(windowSizeMs: number) {
    this.windowSizeMs = windowSizeMs;
  }

  addSample(sample: MetricSample): { emitted: boolean; average?: number } {
    const windowStart = Math.floor(sample.timestamp / this.windowSizeMs) * this.windowSizeMs;
    const key = \`\${sample.deviceId}:\${windowStart}\`;

    const current = this.state.get(key) || { sum: 0, count: 0, windowStart };
    current.sum += sample.metric;
    current.count += 1;
    this.state.set(key, current);

    // If sample signals next window, emit completed window
    if (sample.timestamp >= windowStart + this.windowSizeMs - 1000 && current.count >= 3) {
      const avg = current.sum / current.count;
      this.state.delete(key); // State TTL pruning
      return { emitted: true, average: Math.round(avg * 10) / 10 };
    }
    return { emitted: false };
  }
}

const aggregator = new TumblingWindowAggregator(60000); // 1-minute window
aggregator.addSample({ deviceId: 'sensor-42', metric: 75.0, timestamp: 1000 });
aggregator.addSample({ deviceId: 'sensor-42', metric: 85.0, timestamp: 30000 });
const result = aggregator.addSample({ deviceId: 'sensor-42', metric: 80.0, timestamp: 59500 });

console.log(\`TUMBLING_WINDOW_RESULT: Emitted=\${result.emitted} WindowAvg=\${result.average} StateTTLPruned=true\`);`;
  const out3 = await runSnippet(code3);
  console.log('Snippet 3 Output:\n', out3);
  assert.equal(out3, 'TUMBLING_WINDOW_RESULT: Emitted=true WindowAvg=80 StateTTLPruned=true');

  // Snippet 4
  const code4 = `interface IngestRecord {
  recordId: string;
  isAnomaly: boolean;
  value: number;
}

class DualEgressDispatcher {
  dispatch(batch: IngestRecord[]): { mskKafkaAlerts: number; s3ParquetLake: number } {
    let kafkaCount = 0;
    let lakeCount = 0;

    for (const record of batch) {
      lakeCount++; // All records go to S3 Data Lake via Firehose
      if (record.isAnomaly) {
        kafkaCount++; // Real-time MSK topic receives anomaly alerts only
      }
    }
    return { mskKafkaAlerts: kafkaCount, s3ParquetLake: lakeCount };
  }
}

const dispatcher = new DualEgressDispatcher();
const batch: IngestRecord[] = [
  { recordId: 'r1', isAnomaly: false, value: 50 },
  { recordId: 'r2', isAnomaly: true, value: 99 },
  { recordId: 'r3', isAnomaly: false, value: 52 },
  { recordId: 'r4', isAnomaly: true, value: 105 },
  { recordId: 'r5', isAnomaly: false, value: 48 },
];

const dispatchRes = dispatcher.dispatch(batch);
console.log(\`DUAL_EGRESS_ROUTING: TotalBatched=\${batch.length} MSKAnomalyAlerts=\${dispatchRes.mskKafkaAlerts} S3LakeColdStorage=\${dispatchRes.s3ParquetLake}\`);`;
  const out4 = await runSnippet(code4);
  console.log('Snippet 4 Output:\n', out4);
  assert.equal(out4, 'DUAL_EGRESS_ROUTING: TotalBatched=5 MSKAnomalyAlerts=2 S3LakeColdStorage=5');

  // Snippet 5
  const code5 = `interface PipelineMetrics {
  incomingEventsPerSec: number;
  kinesisShards: number;
  flinkParallelism: number;
  mskBrokers: number;
  p99LatencyMs: number;
}

class Milestone7TelemetryEngine {
  private metrics: PipelineMetrics;

  constructor(metrics: PipelineMetrics) {
    this.metrics = metrics;
  }

  evaluateCapacity(): string {
    const isScaleSufficient = this.metrics.incomingEventsPerSec >= 1000000 &&
                              this.metrics.kinesisShards >= 1000 &&
                              this.metrics.p99LatencyMs < 2000;

    return \`MILESTONE_7_VERIFICATION: TargetRate=\${this.metrics.incomingEventsPerSec.toLocaleString('en-US')}eps Shards=\${this.metrics.kinesisShards} FlinkWorkers=\${this.metrics.flinkParallelism} MSKBrokers=\${this.metrics.mskBrokers} P99Latency=\${this.metrics.p99LatencyMs}ms Status=\${isScaleSufficient ? 'PRODUCTION_GRADE_PASS' : 'FAIL'}\`;
  }
}

const engine = new Milestone7TelemetryEngine({
  incomingEventsPerSec: 1000000,
  kinesisShards: 1000,
  flinkParallelism: 256,
  mskBrokers: 12,
  p99LatencyMs: 850,
});

console.log(engine.evaluateCapacity());`;
  const out5 = await runSnippet(code5);
  console.log('Snippet 5 Output:\n', out5);
  assert.equal(out5, 'MILESTONE_7_VERIFICATION: TargetRate=1,000,000eps Shards=1000 FlinkWorkers=256 MSKBrokers=12 P99Latency=850ms Status=PRODUCTION_GRADE_PASS');

  console.log('All 5 snippets passed with 100% exact match!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
