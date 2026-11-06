import subprocess
import sys

snippets = [
    # Snippet 1: Particle Engine Memory Footprint
    {
        'name': 'Day 35 Snippet 1 - Engine Memory Sizer',
        'code': """interface ParticleLayout {
  positionBytes: number; // vec3<f32> + f32 pad (16 bytes)
  velocityBytes: number; // vec3<f32> + f32 mass (16 bytes)
}

class GPGPUMemorySizer {
  static calculateFootprint(particleCount: number, layout: ParticleLayout): { perParticleBytes: number; singleBufferMB: number; pingPongMB: number } {
    const perParticleBytes = layout.positionBytes + layout.velocityBytes;
    const singleBufferBytes = particleCount * perParticleBytes;
    const singleBufferMB = singleBufferBytes / (1024 * 1024);
    const pingPongMB = singleBufferMB * 2;
    return { perParticleBytes, singleBufferMB, pingPongMB };
  }
}

const layout: ParticleLayout = { positionBytes: 16, velocityBytes: 16 };
const particleCount = 1_000_000;
const memory = GPGPUMemorySizer.calculateFootprint(particleCount, layout);

console.log(`[GPGPU Memory] Particle Count: ${particleCount.toLocaleString("en-US")}`);
console.log(`[GPGPU Memory] Bytes Per Particle: ${memory.perParticleBytes} bytes`);
console.log(`[GPGPU Memory] Single Buffer Size: ${memory.singleBufferMB.toFixed(2)} MB`);
console.log(`[GPGPU Memory] Ping-Pong VRAM Allocation: ${memory.pingPongMB.toFixed(2)} MB`);
""",
        'expected': """[GPGPU Memory] Particle Count: 1,000,000
[GPGPU Memory] Bytes Per Particle: 32 bytes
[GPGPU Memory] Single Buffer Size: 30.52 MB
[GPGPU Memory] Ping-Pong VRAM Allocation: 61.04 MB"""
    },
    # Snippet 2: Ping-Pong Double Buffer Switcher
    {
        'name': 'Day 35 Snippet 2 - Ping-Pong Switcher',
        'code': """class PingPongBufferManager {
  private currentReadIndex: number = 0;

  getReadBuffer(): string {
    return `Buffer_${this.currentReadIndex === 0 ? "A" : "B"}`;
  }

  getWriteBuffer(): string {
    return `Buffer_${this.currentReadIndex === 0 ? "B" : "A"}`;
  }

  swap(): void {
    this.currentReadIndex = 1 - this.currentReadIndex;
  }
}

const manager = new PingPongBufferManager();
console.log(`[Frame 0] Read: ${manager.getReadBuffer()}, Write: ${manager.getWriteBuffer()}`);
manager.swap();
console.log(`[Frame 1] Read: ${manager.getReadBuffer()}, Write: ${manager.getWriteBuffer()}`);
manager.swap();
console.log(`[Frame 2] Read: ${manager.getReadBuffer()}, Write: ${manager.getWriteBuffer()}`);
""",
        'expected': """[Frame 0] Read: Buffer_A, Write: Buffer_B
[Frame 1] Read: Buffer_B, Write: Buffer_A
[Frame 2] Read: Buffer_A, Write: Buffer_B"""
    },
    # Snippet 3: Workgroup Indirect Draw Argument Generator
    {
        'name': 'Day 35 Snippet 3 - Indirect Draw Generator',
        'code': """interface IndirectDrawParams {
  vertexCount: number;
  instanceCount: number;
  firstVertex: number;
  firstInstance: number;
}

class GPUIndirectDrawBuilder {
  static createDrawArguments(liveInstances: number): { params: IndirectDrawParams; bufferSize: number; arrayView: Uint32Array } {
    const params: IndirectDrawParams = {
      vertexCount: 6, // 2 triangles per camera-facing quad
      instanceCount: liveInstances,
      firstVertex: 0,
      firstInstance: 0
    };
    const bufferSize = 4 * 4; // 4 * sizeof(u32) = 16 bytes
    const arrayView = new Uint32Array([params.vertexCount, params.instanceCount, params.firstVertex, params.firstInstance]);
    return { params, bufferSize, arrayView };
  }
}

const drawArgs = GPUIndirectDrawBuilder.createDrawArguments(784_250);
console.log(`[Indirect Draw] Vertex Count: ${drawArgs.params.vertexCount}`);
console.log(`[Indirect Draw] Active Instances: ${drawArgs.params.instanceCount.toLocaleString("en-US")}`);
console.log(`[Indirect Draw] Buffer Size: ${drawArgs.bufferSize} bytes`);
console.log(`[Indirect Draw] Packed Buffer: [${drawArgs.arrayView.join(", ")}]`);
""",
        'expected': """[Indirect Draw] Vertex Count: 6
[Indirect Draw] Active Instances: 784,250
[Indirect Draw] Buffer Size: 16 bytes
[Indirect Draw] Packed Buffer: [6, 784250, 0, 0]"""
    },
    # Snippet 4: Performance Profiler & Frame Budget
    {
        'name': 'Day 35 Snippet 4 - Performance Profiler',
        'code': """interface PassTiming {
  computePassMs: number;
  renderPassMs: number;
}

class WebGPUFrameProfiler {
  static evaluateBudget(timing: PassTiming): { totalMs: number; fps: number; within60FpsBudget: boolean } {
    const totalMs = timing.computePassMs + timing.renderPassMs;
    const fps = Math.round(1000 / totalMs);
    const within60FpsBudget = totalMs <= 16.66;
    return { totalMs: parseFloat(totalMs.toFixed(2)), fps, within60FpsBudget };
  }
}

const timing: PassTiming = {
  computePassMs: 3.42,
  renderPassMs: 5.18
};

const profile = WebGPUFrameProfiler.evaluateBudget(timing);
console.log(`[Frame Profiler] Total GPU Time: ${profile.totalMs} ms`);
console.log(`[Frame Profiler] Estimated Frame Rate: ${profile.fps} FPS`);
console.log(`[Frame Profiler] Within 60 FPS Budget (<= 16.6ms): ${profile.within60FpsBudget}`);
""",
        'expected': """[Frame Profiler] Total GPU Time: 8.6 ms
[Frame Profiler] Estimated Frame Rate: 116 FPS
[Frame Profiler] Within 60 FPS Budget (<= 16.6ms): true"""
    },
    # Snippet 5: 5-Gate Defense Matrix
    {
        'name': 'Day 35 Snippet 5 - 5-Gate Defense Matrix',
        'code': """interface EngineConfig {
  bufferStrideBytes: number;
  workgroupThreads: number;
  sharedMemoryBytes: number;
  hasCpuReadback: boolean;
  hasDeviceLostHandler: boolean;
}

class GPGPUDefenseMatrix {
  static audit(cfg: EngineConfig): { allGatesPassed: boolean; auditResults: Record<string, boolean> } {
    const auditResults = {
      "Gate 1 - 16-Byte Struct Alignment": cfg.bufferStrideBytes % 16 === 0,
      "Gate 2 - Warp-Aligned Workgroups": cfg.workgroupThreads % 32 === 0,
      "Gate 3 - Shared Memory Safety (<= 16KB)": cfg.sharedMemoryBytes <= 16384,
      "Gate 4 - Zero CPU Readback Overhead": !cfg.hasCpuReadback,
      "Gate 5 - Resilient Device Lost Handling": cfg.hasDeviceLostHandler
    };
    const allGatesPassed = Object.values(auditResults).every(v => v);
    return { allGatesPassed, auditResults };
  }
}

const config: EngineConfig = {
  bufferStrideBytes: 32,
  workgroupThreads: 256,
  sharedMemoryBytes: 4096,
  hasCpuReadback: false,
  hasDeviceLostHandler: true
};

const audit = GPGPUDefenseMatrix.audit(config);
for (const [gate, passed] of Object.entries(audit.auditResults)) {
  console.log(`[Defense Matrix] ${gate}: ${passed ? "PASS" : "FAIL"}`);
}
console.log(`[Defense Matrix] Engine Production Ready: ${audit.allGatesPassed}`);
""",
        'expected': """[Defense Matrix] Gate 1 - 16-Byte Struct Alignment: PASS
[Defense Matrix] Gate 2 - Warp-Aligned Workgroups: PASS
[Defense Matrix] Gate 3 - Shared Memory Safety (<= 16KB): PASS
[Defense Matrix] Gate 4 - Zero CPU Readback Overhead: PASS
[Defense Matrix] Gate 5 - Resilient Device Lost Handling: PASS
[Defense Matrix] Engine Production Ready: true"""
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
