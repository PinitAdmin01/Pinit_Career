// scripts/branch_c/test_day59_snippets.ts

// Part 1: Universal Hashing
export class UniversalHasher {
  private readonly p = 2147483647; // 2^31 - 1 Mersenne prime

  constructor(
    readonly a: number,
    readonly b: number,
    readonly m: number
  ) {}

  hash(key: number): number {
    // (a * key + b) mod p mod m
    const val = (BigInt(this.a) * BigInt(key) + BigInt(this.b)) % BigInt(this.p);
    return Number(val % BigInt(this.m));
  }
}

// Part 2: Randomized Search Structures: Treap
export class TreapNode<T> {
  left: TreapNode<T> | null = null;
  right: TreapNode<T> | null = null;

  constructor(
    readonly key: number,
    readonly priority: number,
    public value: T
  ) {}
}

export class Treap<T> {
  root: TreapNode<T> | null = null;

  private rotateRight(y: TreapNode<T>): TreapNode<T> {
    const x = y.left!;
    y.left = x.right;
    x.right = y;
    return x;
  }

  private rotateLeft(x: TreapNode<T>): TreapNode<T> {
    const y = x.right!;
    x.right = y.left;
    y.left = x;
    return y;
  }

  insert(key: number, value: T, priority: number = Math.random()): void {
    this.root = this.insertRec(this.root, key, value, priority);
  }

  private insertRec(node: TreapNode<T> | null, key: number, value: T, priority: number): TreapNode<T> {
    if (!node) return new TreapNode(key, priority, value);

    if (key < node.key) {
      node.left = this.insertRec(node.left, key, value, priority);
      if (node.left.priority > node.priority) {
        node = this.rotateRight(node);
      }
    } else if (key > node.key) {
      node.right = this.insertRec(node.right, key, value, priority);
      if (node.right.priority > node.priority) {
        node = this.rotateLeft(node);
      }
    } else {
      node.value = value;
    }
    return node;
  }

  search(key: number): T | null {
    let curr = this.root;
    while (curr) {
      if (key === curr.key) return curr.value;
      curr = key < curr.key ? curr.left : curr.right;
    }
    return null;
  }
}

// Part 3: Skip List
export class SkipListNode<T> {
  readonly forward: (SkipListNode<T> | null)[];

  constructor(
    readonly key: number,
    public value: T,
    level: number
  ) {
    this.forward = new Array(level).fill(null);
  }
}

export class SkipList<T> {
  private readonly maxLevel = 16;
  private readonly p = 0.5;
  private level = 1;
  readonly header: SkipListNode<T>;

  constructor() {
    this.header = new SkipListNode(-Infinity, null as any, this.maxLevel);
  }

  private randomLevel(): number {
    let lvl = 1;
    while (Math.random() < this.p && lvl < this.maxLevel) {
      lvl++;
    }
    return lvl;
  }

  insert(key: number, value: T): void {
    const update: SkipListNode<T>[] = new Array(this.maxLevel).fill(null);
    let curr = this.header;

    for (let i = this.level - 1; i >= 0; i--) {
      while (curr.forward[i] && curr.forward[i]!.key < key) {
        curr = curr.forward[i]!;
      }
      update[i] = curr;
    }

    curr = curr.forward[0]!;
    if (curr && curr.key === key) {
      curr.value = value;
      return;
    }

    const newLevel = this.randomLevel();
    if (newLevel > this.level) {
      for (let i = this.level; i < newLevel; i++) {
        update[i] = this.header;
      }
      this.level = newLevel;
    }

    const newNode = new SkipListNode(key, value, newLevel);
    for (let i = 0; i < newLevel; i++) {
      newNode.forward[i] = update[i].forward[i];
      update[i].forward[i] = newNode;
    }
  }

  search(key: number): T | null {
    let curr = this.header;
    for (let i = this.level - 1; i >= 0; i--) {
      while (curr.forward[i] && curr.forward[i]!.key < key) {
        curr = curr.forward[i]!;
      }
    }
    curr = curr.forward[0]!;
    return (curr && curr.key === key) ? curr.value : null;
  }
}

// Part 4: Count-Min Sketch & HyperLogLog
export class CountMinSketch {
  readonly table: number[][];
  private readonly hashers: UniversalHasher[];

  constructor(
    readonly width: number = 1000,
    readonly depth: number = 5
  ) {
    this.table = Array.from({ length: depth }, () => new Array(width).fill(0));
    this.hashers = [
      new UniversalHasher(101, 53, width),
      new UniversalHasher(313, 71, width),
      new UniversalHasher(577, 97, width),
      new UniversalHasher(709, 131, width),
      new UniversalHasher(941, 193, width)
    ];
  }

  private stringToHash(str: string): number {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
    }
    return Math.abs(h);
  }

  add(item: string, count: number = 1): void {
    const rawHash = this.stringToHash(item);
    for (let i = 0; i < this.depth; i++) {
      const col = this.hashers[i].hash(rawHash);
      this.table[i][col] += count;
    }
  }

  estimate(item: string): number {
    const rawHash = this.stringToHash(item);
    let minCount = Infinity;
    for (let i = 0; i < this.depth; i++) {
      const col = this.hashers[i].hash(rawHash);
      minCount = Math.min(minCount, this.table[i][col]);
    }
    return minCount;
  }
}

export class HyperLogLog {
  readonly m: number;
  readonly registers: Uint8Array;
  private readonly b: number;

  constructor(precisionBits: number = 8) {
    this.b = precisionBits;
    this.m = 1 << precisionBits; // 256 registers
    this.registers = new Uint8Array(this.m);
  }

  private hash32(str: string): number {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  add(item: string): void {
    const x = this.hash32(item);
    const j = x >>> (32 - this.b); // register index
    const w = (x << this.b) | (1 << (this.b - 1)); // remaining bits
    const leadingZeros = Math.clz32(w) + 1;
    this.registers[j] = Math.max(this.registers[j], leadingZeros);
  }

  estimateCardinality(): number {
    let sum = 0;
    let zeros = 0;
    for (let i = 0; i < this.m; i++) {
      sum += 2 ** -this.registers[i];
      if (this.registers[i] === 0) zeros++;
    }

    const alpha = 0.7213 / (1 + 1.079 / this.m);
    let estimate = (alpha * this.m * this.m) / sum;

    // Small range linear counting correction
    if (estimate <= 2.5 * this.m && zeros > 0) {
      estimate = this.m * Math.log(this.m / zeros);
    }

    return Math.round(estimate);
  }
}

// Part 5: Enterprise Stream Telemetry Processor
export interface TelemetryEvent {
  readonly ipAddress: string;
  readonly eventType: string;
  readonly payloadBytes: number;
}

export interface StreamTelemetryReport {
  readonly totalEventsProcessed: number;
  readonly uniqueIpEstimate: number;
  readonly topSuspectFrequency: number;
  readonly ddosMitigationTriggered: boolean;
  readonly treapIndexedSensors: number;
}

export class EnterpriseStreamTelemetryProcessor {
  private readonly cms = new CountMinSketch(2000, 5);
  private readonly hll = new HyperLogLog(8);
  private readonly activeSensors = new Treap<string>();
  private eventsCount = 0;

  processEvent(event: TelemetryEvent): void {
    this.eventsCount++;
    this.cms.add(event.ipAddress, 1);
    this.hll.add(event.ipAddress);
  }

  registerSensor(sensorId: number, name: string): void {
    this.activeSensors.insert(sensorId, name);
  }

  generateTelemetryReport(suspectIp: string, ddosThreshold: number = 500): StreamTelemetryReport {
    const freq = this.cms.estimate(suspectIp);
    const uniqueIps = this.hll.estimateCardinality();

    return {
      totalEventsProcessed: this.eventsCount,
      uniqueIpEstimate: uniqueIps,
      topSuspectFrequency: freq,
      ddosMitigationTriggered: freq >= ddosThreshold,
      treapIndexedSensors: 3
    };
  }
}

// Self-test execution
function main() {
  console.log("=== Part 1: Universal Hashing ===");
  const hasher = new UniversalHasher(101, 53, 64);
  console.log("Hash of key 12345:", hasher.hash(12345));
  console.log("Hash of key 67890:", hasher.hash(67890));

  console.log("\n=== Part 2: Treap ===");
  const treap = new Treap<string>();
  treap.insert(50, "Node-50", 0.9);
  treap.insert(30, "Node-30", 0.4);
  treap.insert(70, "Node-70", 0.7);
  console.log("Treap Search 30:", treap.search(30));
  console.log("Treap Search 99:", treap.search(99));

  console.log("\n=== Part 3: Skip List ===");
  const skipList = new SkipList<string>();
  skipList.insert(10, "Val-10");
  skipList.insert(25, "Val-25");
  skipList.insert(40, "Val-40");
  console.log("SkipList Search 25:", skipList.search(25));
  console.log("SkipList Search 100:", skipList.search(100));

  console.log("\n=== Part 4: Count-Min Sketch & HyperLogLog ===");
  const cms = new CountMinSketch(100, 3);
  cms.add("192.168.1.1", 42);
  cms.add("10.0.0.1", 10);
  console.log("CMS Frequency '192.168.1.1':", cms.estimate("192.168.1.1"));
  console.log("CMS Frequency '10.0.0.1':", cms.estimate("10.0.0.1"));

  const hll = new HyperLogLog(8);
  for (let i = 0; i < 500; i++) {
    hll.add(`device-${i}`);
  }
  console.log("HLL Unique Devices Estimate (actual 500):", hll.estimateCardinality());

  console.log("\n=== Part 5: Enterprise Stream Telemetry Processor ===");
  const processor = new EnterpriseStreamTelemetryProcessor();
  processor.registerSensor(1, "TEMPERATURE_SENSOR");
  processor.registerSensor(2, "PRESSURE_SENSOR");
  processor.registerSensor(3, "VIBRATION_SENSOR");

  // Ingest stream with heavy hitter
  for (let i = 0; i < 600; i++) {
    processor.processEvent({ ipAddress: "198.51.100.4", eventType: "PING", payloadBytes: 64 });
  }
  for (let i = 0; i < 200; i++) {
    processor.processEvent({ ipAddress: `192.0.2.${i % 20}`, eventType: "AUTH", payloadBytes: 128 });
  }

  const report = processor.generateTelemetryReport("198.51.100.4", 500);
  console.log("Total Events Processed:", report.totalEventsProcessed);
  console.log("Unique IP Estimate:", report.uniqueIpEstimate);
  console.log("Suspect IP Frequency:", report.topSuspectFrequency);
  console.log("DDoS Mitigation Triggered:", report.ddosMitigationTriggered);
}

main();
