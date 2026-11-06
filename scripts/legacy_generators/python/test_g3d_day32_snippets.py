import subprocess

s1 = """interface BuiltinVariables {
  workgroupId: [number, number, number];
  localInvocationId: [number, number, number];
  workgroupSize: [number, number, number];
}

class WGSLBuiltinIndexCalculator {
  static computeGlobalInvocationId(vars: BuiltinVariables): [number, number, number] {
    return [
      vars.workgroupId[0] * vars.workgroupSize[0] + vars.localInvocationId[0],
      vars.workgroupId[1] * vars.workgroupSize[1] + vars.localInvocationId[1],
      vars.workgroupId[2] * vars.workgroupSize[2] + vars.localInvocationId[2]
    ];
  }
}

const vars: BuiltinVariables = {
  workgroupId: [5, 2, 0],
  localInvocationId: [17, 3, 0],
  workgroupSize: [64, 4, 1]
};

const globalId = WGSLBuiltinIndexCalculator.computeGlobalInvocationId(vars);
console.log(`[WGSL Builtins] Workgroup: (${vars.workgroupId.join(",")}), Local: (${vars.localInvocationId.join(",")})`);
console.log(`[WGSL Builtins] Global Invocation ID: (${globalId.join(",")})`);"""
exp1 = """[WGSL Builtins] Workgroup: (5,2,0), Local: (17,3,0)
[WGSL Builtins] Global Invocation ID: (337,11,0)"""

s2 = """interface SharedBufferConfig {
  elementCount: number;
  elementSizeBytes: number;
  maxSharedLimitBytes: number;
}

class WorkgroupMemoryManager {
  static evaluateSharedAllocation(cfg: SharedBufferConfig): { allocatedBytes: number; fitsInLimit: boolean } {
    const allocatedBytes = cfg.elementCount * cfg.elementSizeBytes;
    return {
      allocatedBytes,
      fitsInLimit: allocatedBytes <= cfg.maxSharedLimitBytes
    };
  }
}

const config: SharedBufferConfig = {
  elementCount: 256,
  elementSizeBytes: 16, // vec4<f32>
  maxSharedLimitBytes: 16384 // 16KB on-chip cache
};

const alloc = WorkgroupMemoryManager.evaluateSharedAllocation(config);
console.log(`[Workgroup Memory] Allocation Size: ${alloc.allocatedBytes} bytes`);
console.log(`[Workgroup Memory] Fits in Hardware Limit: ${alloc.fitsInLimit}`);"""
exp2 = """[Workgroup Memory] Allocation Size: 4096 bytes
[Workgroup Memory] Fits in Hardware Limit: true"""

s3 = """interface ThreadState {
  threadId: number;
  sharedVal: number;
  reachedBarrier: boolean;
}

class WorkgroupBarrierSimulator {
  static synchronizeThreads(threads: ThreadState[]): string {
    const allReached = threads.every(t => t.reachedBarrier);
    if (!allReached) return "[Barrier] Stalled: Unsynchronized thread execution";
    return `[Barrier] Synchronized: All ${threads.length} invocations passed workgroupBarrier()`;
  }
}

const threads: ThreadState[] = [
  { threadId: 0, sharedVal: 10, reachedBarrier: true },
  { threadId: 1, sharedVal: 20, reachedBarrier: true },
  { threadId: 2, sharedVal: 30, reachedBarrier: true },
  { threadId: 3, sharedVal: 40, reachedBarrier: true }
];

console.log(WorkgroupBarrierSimulator.synchronizeThreads(threads));"""
exp3 = """[Barrier] Synchronized: All 4 invocations passed workgroupBarrier()"""

s4 = """interface StridePattern {
  stride: number;
  bankCount: number;
}

class BankConflictDetector {
  static analyzeAccessStride(pattern: StridePattern): { conflicts: boolean; effectiveBandwidthPct: number } {
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const factor = gcd(pattern.stride, pattern.bankCount);
    const conflicts = factor > 1;
    const effectiveBandwidthPct = Math.round((1 / factor) * 100);
    return { conflicts, effectiveBandwidthPct };
  }
}

const stride1 = BankConflictDetector.analyzeAccessStride({ stride: 1, bankCount: 32 });
const stride2 = BankConflictDetector.analyzeAccessStride({ stride: 2, bankCount: 32 });

console.log(`[Bank Conflicts] Stride 1: Conflicts=${stride1.conflicts}, Bandwidth=${stride1.effectiveBandwidthPct}%`);
console.log(`[Bank Conflicts] Stride 2: Conflicts=${stride2.conflicts}, Bandwidth=${stride2.effectiveBandwidthPct}%`);"""
exp4 = """[Bank Conflicts] Stride 1: Conflicts=false, Bandwidth=100%
[Bank Conflicts] Stride 2: Conflicts=true, Bandwidth=50%"""

s5 = """class ParallelReductionSimulator {
  static reduceSum(elements: number[]): { steps: number; totalSum: number } {
    const data = [...elements];
    let steps = 0;
    for (let stride = Math.floor(data.length / 2); stride > 0; stride = Math.floor(stride / 2)) {
      for (let i = 0; i < stride; i++) {
        data[i] += data[i + stride];
      }
      steps++;
    }
    return { steps, totalSum: data[0] };
  }
}

const inputData = [1, 2, 3, 4, 5, 6, 7, 8];
const reduction = ParallelReductionSimulator.reduceSum(inputData);
console.log(`[Parallel Reduction] Elements: ${inputData.length}, Steps: ${reduction.steps}`);
console.log(`[Parallel Reduction] Final Computed Sum: ${reduction.totalSum}`);"""
exp5 = """[Parallel Reduction] Elements: 8, Steps: 3
[Parallel Reduction] Final Computed Sum: 36"""

for idx, (code, exp) in enumerate([(s1, exp1), (s2, exp2), (s3, exp3), (s4, exp4), (s5, exp5)]):
    with open('tmp_test_g3d32.ts', 'w', encoding='utf-8') as f:
        f.write(code.strip())
    res = subprocess.run(['npx', 'tsx', 'tmp_test_g3d32.ts'], capture_output=True, text=True, shell=True)
    act = res.stdout.strip()
    status = 'PASS' if act == exp.strip() else f'FAIL\nExp:\n{exp}\nAct:\n{act}'
    print(f'G3D Day 32 Snippet {idx+1}: {status}')
