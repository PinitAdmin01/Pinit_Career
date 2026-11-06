import subprocess

s1 = """interface ComputePipelineState {
  pipelineId: string;
  entryPoint: string;
  workgroupSize: [number, number, number];
  isAsyncCompiled: boolean;
}

class WebGPUComputePipeline {
  static createPipeline(id: string, entry: string, size: [number, number, number]): ComputePipelineState {
    return {
      pipelineId: id,
      entryPoint: entry,
      workgroupSize: size,
      isAsyncCompiled: true
    };
  }

  static calculateInvocationsPerWorkgroup(state: ComputePipelineState): number {
    return state.workgroupSize[0] * state.workgroupSize[1] * state.workgroupSize[2];
  }
}

const pipeline = WebGPUComputePipeline.createPipeline("compute_fluid_sim", "main", [64, 1, 1]);
console.log(`[WebGPU Compute] Pipeline: ${pipeline.pipelineId}, Entry: ${pipeline.entryPoint}`);
console.log(`[WebGPU Compute] Invocations Per Workgroup: ${WebGPUComputePipeline.calculateInvocationsPerWorkgroup(pipeline)} threads`);"""
exp1 = """[WebGPU Compute] Pipeline: compute_fluid_sim, Entry: main
[WebGPU Compute] Invocations Per Workgroup: 64 threads"""

s2 = """interface AdapterLimits {
  maxComputeWorkgroupStorageSize: number;
  maxComputeInvocationsPerWorkgroup: number;
  maxBufferSize: number;
}

class WebGPUDeviceValidator {
  static validateComputeLimits(limits: AdapterLimits): { compliant: boolean; report: string } {
    const isStorageOk = limits.maxComputeWorkgroupStorageSize >= 16384;
    const isInvocationsOk = limits.maxComputeInvocationsPerWorkgroup >= 256;
    const isBufferOk = limits.maxBufferSize >= 268435456; // 256 MB

    const compliant = isStorageOk && isInvocationsOk && isBufferOk;
    return {
      compliant,
      report: `[WebGPU Limits] Storage: ${limits.maxComputeWorkgroupStorageSize / 1024}KB, Max Invocations: ${limits.maxComputeInvocationsPerWorkgroup}, Status: ${compliant ? "CERTIFIED" : "DEFICIENT"}`
    };
  }
}

const limits: AdapterLimits = {
  maxComputeWorkgroupStorageSize: 32768,
  maxComputeInvocationsPerWorkgroup: 1024,
  maxBufferSize: 1073741824
};

const result = WebGPUDeviceValidator.validateComputeLimits(limits);
console.log(result.report);
console.log(`[WebGPU Limits] Ready for GPGPU Compute: ${result.compliant}`);"""
exp2 = """[WebGPU Limits] Storage: 32KB, Max Invocations: 1024, Status: CERTIFIED
[WebGPU Limits] Ready for GPGPU Compute: true"""

s3 = """interface StructMember {
  name: string;
  size: number;
  align: number;
}

class WGSLMemoryLayoutCalculator {
  static computeOffsets(members: StructMember[]): { totalSize: number; offsets: Record<string, number> } {
    let currentOffset = 0;
    const offsets: Record<string, number> = {};

    for (const m of members) {
      if (currentOffset % m.align !== 0) {
        currentOffset += m.align - (currentOffset % m.align);
      }
      offsets[m.name] = currentOffset;
      currentOffset += m.size;
    }

    return { totalSize: currentOffset, offsets };
  }
}

const members: StructMember[] = [
  { name: "position", size: 12, align: 16 },
  { name: "velocity", size: 12, align: 16 },
  { name: "life", size: 4, align: 4 },
  { name: "mass", size: 4, align: 4 }
];

const layout = WGSLMemoryLayoutCalculator.computeOffsets(members);
console.log(`[WGSL Layout] Total Struct Size: ${layout.totalSize} bytes`);
console.log(`[WGSL Layout] Member Offsets: pos=${layout.offsets["position"]}, vel=${layout.offsets["velocity"]}, life=${layout.offsets["life"]}, mass=${layout.offsets["mass"]}`);"""
exp3 = """[WGSL Layout] Total Struct Size: 36 bytes
[WGSL Layout] Member Offsets: pos=0, vel=16, life=28, mass=32"""

s4 = """interface BindGroupEntrySpec {
  binding: number;
  visibility: "COMPUTE" | "VERTEX" | "FRAGMENT";
  type: "storage-buffer" | "uniform-buffer" | "texture";
}

class BindGroupLayoutValidator {
  static validate(entries: BindGroupEntrySpec[]): boolean {
    const bindings = new Set<number>();
    for (const e of entries) {
      if (bindings.has(e.binding)) return false;
      bindings.add(e.binding);
      if (e.visibility !== "COMPUTE") return false;
    }
    return true;
  }
}

const entries: BindGroupEntrySpec[] = [
  { binding: 0, visibility: "COMPUTE", type: "storage-buffer" },
  { binding: 1, visibility: "COMPUTE", type: "storage-buffer" },
  { binding: 2, visibility: "COMPUTE", type: "uniform-buffer" }
];

const isValid = BindGroupLayoutValidator.validate(entries);
console.log(`[BindGroup] Layout Binding Count: ${entries.length}`);
console.log(`[BindGroup] Compute Pipeline Bindings Valid: ${isValid}`);"""
exp4 = """[BindGroup] Layout Binding Count: 3
[BindGroup] Compute Pipeline Bindings Valid: true"""

s5 = """interface DispatchGrid {
  totalElements: number;
  workgroupSize: number;
}

class ComputePassDispatcher {
  static calculateWorkgroups(grid: DispatchGrid): { workgroupsNeeded: number; totalDispatchedThreads: number } {
    const workgroupsNeeded = Math.ceil(grid.totalElements / grid.workgroupSize);
    return {
      workgroupsNeeded,
      totalDispatchedThreads: workgroupsNeeded * grid.workgroupSize
    };
  }
}

const grid: DispatchGrid = { totalElements: 100000, workgroupSize: 256 };
const dispatch = ComputePassDispatcher.calculateWorkgroups(grid);
console.log(`[Compute Pass] Elements to Process: ${grid.totalElements}`);
console.log(`[Compute Pass] Workgroups Dispatched: ${dispatch.workgroupsNeeded} (Total Threads: ${dispatch.totalDispatchedThreads})`);"""
exp5 = """[Compute Pass] Elements to Process: 100000
[Compute Pass] Workgroups Dispatched: 391 (Total Threads: 100096)"""

for idx, (code, exp) in enumerate([(s1, exp1), (s2, exp2), (s3, exp3), (s4, exp4), (s5, exp5)]):
    with open('tmp_test_g3d.ts', 'w', encoding='utf-8') as f:
        f.write(code.strip())
    res = subprocess.run(['npx', 'tsx', 'tmp_test_g3d.ts'], capture_output=True, text=True, shell=True)
    act = res.stdout.strip()
    status = 'PASS' if act == exp.strip() else f'FAIL\nExp:\n{exp}\nAct:\n{act}'
    print(f'G3D Day 31 Snippet {idx+1}: {status}')
