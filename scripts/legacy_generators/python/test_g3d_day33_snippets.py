import subprocess
import sys

snippets = [
    # Snippet 1: Atomic Counter Allocation
    {
        'name': 'Day 33 Snippet 1 - Atomic Counter Allocation',
        'code': """interface AllocationRequest {
  threadId: number;
  count: number;
}

class AtomicCounterSimulator {
  private counter: number = 0;

  atomicAdd(amount: number): number {
    const oldVal = this.counter;
    this.counter += amount;
    return oldVal;
  }

  getTotal(): number {
    return this.counter;
  }
}

const allocator = new AtomicCounterSimulator();
const requests: AllocationRequest[] = [
  { threadId: 0, count: 1 },
  { threadId: 1, count: 2 },
  { threadId: 2, count: 1 },
  { threadId: 3, count: 3 }
];

const allocations = requests.map(req => ({
  threadId: req.threadId,
  startOffset: allocator.atomicAdd(req.count),
  count: req.count
}));

allocations.forEach(a => {
  console.log(`[Atomic Counter] Thread ${a.threadId}: Allocated offset ${a.startOffset} (count ${a.count})`);
});
console.log(`[Atomic Counter] Total Elements Allocated: ${allocator.getTotal()}`);
""",
        'expected': """[Atomic Counter] Thread 0: Allocated offset 0 (count 1)
[Atomic Counter] Thread 1: Allocated offset 1 (count 2)
[Atomic Counter] Thread 2: Allocated offset 3 (count 1)
[Atomic Counter] Thread 3: Allocated offset 4 (count 3)
[Atomic Counter] Total Elements Allocated: 7"""
    },
    # Snippet 2: Atomic Min/Max Bounding Box Accumulator
    {
        'name': 'Day 33 Snippet 2 - Atomic Min/Max Bounding Box',
        'code': """interface Point3D {
  x: number;
  y: number;
  z: number;
}

class AtomicAABBSimulator {
  minX: number = 10000;
  minY: number = 10000;
  maxX: number = -10000;
  maxY: number = -10000;

  update(p: Point3D): void {
    // Simulating atomicMin and atomicMax
    if (p.x < this.minX) this.minX = p.x;
    if (p.y < this.minY) this.minY = p.y;
    if (p.x > this.maxX) this.maxX = p.x;
    if (p.y > this.maxY) this.maxY = p.y;
  }
}

const aabb = new AtomicAABBSimulator();
const points: Point3D[] = [
  { x: 12, y: 45, z: 0 },
  { x: -5, y: 88, z: 0 },
  { x: 34, y: -12, z: 0 },
  { x: 99, y: 3, z: 0 }
];

points.forEach(p => aabb.update(p));

console.log(`[Atomic AABB] Bounds X: [${aabb.minX}, ${aabb.maxX}]`);
console.log(`[Atomic AABB] Bounds Y: [${aabb.minY}, ${aabb.maxY}]`);
""",
        'expected': """[Atomic AABB] Bounds X: [-5, 99]
[Atomic AABB] Bounds Y: [-12, 88]"""
    },
    # Snippet 3: Lock-Free Compare-and-Swap (CAS) Loop
    {
        'name': 'Day 33 Snippet 3 - Lock-Free CAS Loop',
        'code': """interface CASResult {
  oldValue: number;
  exchanged: boolean;
}

class AtomicCompareExchangeSimulator {
  private value: number;

  constructor(initial: number) {
    this.value = initial;
  }

  compareExchange(expected: number, desired: number): CASResult {
    if (this.value === expected) {
      this.value = desired;
      return { oldValue: expected, exchanged: true };
    }
    return { oldValue: this.value, exchanged: false };
  }

  getValue(): number {
    return this.value;
  }
}

const memory = new AtomicCompareExchangeSimulator(100);
// Thread attempts atomic CAS update: exchange 100 -> 250
const attempt1 = memory.compareExchange(99, 250); // Mismatched expected
const attempt2 = memory.compareExchange(100, 250); // Matches expected

console.log(`[Atomic CAS] Attempt 1 (expected 99): Exchanged=${attempt1.exchanged}, Value=${attempt1.oldValue}`);
console.log(`[Atomic CAS] Attempt 2 (expected 100): Exchanged=${attempt2.exchanged}, NewValue=${memory.getValue()}`);
""",
        'expected': """[Atomic CAS] Attempt 1 (expected 99): Exchanged=false, Value=100
[Atomic CAS] Attempt 2 (expected 100): Exchanged=true, NewValue=250"""
    },
    # Snippet 4: Blelloch Work-Efficient Parallel Prefix Sum
    {
        'name': 'Day 33 Snippet 4 - Blelloch Parallel Prefix Sum',
        'code': """class BlellochScanSimulator {
  static exclusiveScan(arr: number[]): { prefixSum: number[]; totalSum: number } {
    const a = [...arr];
    const n = a.length;

    // Up-sweep (reduce) phase
    for (let d = 0; d < Math.log2(n); d++) {
      const stride = 1 << (d + 1);
      for (let k = 0; k < n; k += stride) {
        a[k + stride - 1] += a[k + (1 << d) - 1];
      }
    }

    const totalSum = a[n - 1];
    a[n - 1] = 0; // Clear the last element

    // Down-sweep phase
    for (let d = Math.log2(n) - 1; d >= 0; d--) {
      const stride = 1 << (d + 1);
      for (let k = 0; k < n; k += stride) {
        const leftIdx = k + (1 << d) - 1;
        const rightIdx = k + stride - 1;
        const temp = a[leftIdx];
        a[leftIdx] = a[rightIdx];
        a[rightIdx] += temp;
      }
    }

    return { prefixSum: a, totalSum };
  }
}

const inputValues = [3, 1, 7, 0, 4, 1, 6, 3];
const result = BlellochScanSimulator.exclusiveScan(inputValues);

console.log(`[Blelloch Scan] Input: [${inputValues.join(", ")}]`);
console.log(`[Blelloch Scan] Exclusive Prefix Sum: [${result.prefixSum.join(", ")}]`);
console.log(`[Blelloch Scan] Total Sum: ${result.totalSum}`);
""",
        'expected': """[Blelloch Scan] Input: [3, 1, 7, 0, 4, 1, 6, 3]
[Blelloch Scan] Exclusive Prefix Sum: [0, 3, 4, 11, 11, 15, 16, 22]
[Blelloch Scan] Total Sum: 25"""
    },
    # Snippet 5: GPU Stream Compaction
    {
        'name': 'Day 33 Snippet 5 - GPU Stream Compaction',
        'code': """interface Particle {
  id: number;
  alive: boolean;
}

class GPUStreamCompactor {
  static compactAliveParticles(particles: Particle[]): { compactedIds: number[]; count: number } {
    // Step 1: Generate predicate flags (1 if alive, 0 if dead)
    const flags = particles.map(p => (p.alive ? 1 : 0));
    
    // Step 2: Compute exclusive prefix sum on flags
    const offsets: number[] = [];
    let currentOffset = 0;
    for (const f of flags) {
      offsets.push(currentOffset);
      currentOffset += f;
    }
    const totalAlive = currentOffset;

    // Step 3: Scatter alive elements into compacted output buffer
    const compacted: number[] = new Array(totalAlive);
    for (let i = 0; i < particles.length; i++) {
      if (flags[i] === 1) {
        compacted[offsets[i]] = particles[i].id;
      }
    }

    return { compactedIds: compacted, count: totalAlive };
  }
}

const testParticles: Particle[] = [
  { id: 101, alive: true },
  { id: 102, alive: false },
  { id: 103, alive: true },
  { id: 104, alive: true },
  { id: 105, alive: false },
  { id: 106, alive: true },
  { id: 107, alive: false },
  { id: 108, alive: true }
];

const compaction = GPUStreamCompactor.compactAliveParticles(testParticles);
console.log(`[Stream Compaction] Alive Particles Count: ${compaction.count}`);
console.log(`[Stream Compaction] Compacted Output IDs: [${compaction.compactedIds.join(", ")}]`);
""",
        'expected': """[Stream Compaction] Alive Particles Count: 5
[Stream Compaction] Compacted Output IDs: [101, 103, 104, 106, 108]"""
    }
]

failed = False
for s in snippets:
    proc = subprocess.run(['npx', 'tsx'], input=s['code'], capture_output=True, text=True, shell=True)
    out = proc.stdout.strip()
    exp = s['expected'].strip()
    if out == exp:
        print(f"PASS: {s['name']}")
    else:
        print(f"FAIL: {s['name']}")
        print(f"Expected:\n{exp}")
        print(f"Got:\n{out}")
        if proc.stderr:
            print(f"Stderr:\n{proc.stderr}")
        failed = True

if failed:
    sys.exit(1)
print("ALL 5 SNIPPETS PASS!")
