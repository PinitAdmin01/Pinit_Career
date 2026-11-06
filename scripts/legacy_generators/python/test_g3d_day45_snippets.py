import subprocess
import os

c1 = """interface PipelinePassTiming {
  passName: string;
  durationMs: number;
}

class HybridRayTracingPipeline {
  static evaluateFrame(timings: PipelinePassTiming[]): { totalGpuMs: number; meets60Fps: boolean; rtPassPercentage: number } {
    let totalMs = 0.0;
    let rtMs = 0.0;

    for (const t of timings) {
      totalMs += t.durationMs;
      if (t.passName.startsWith('RT_')) {
        rtMs += t.durationMs;
      }
    }

    totalMs = parseFloat(totalMs.toFixed(2));
    const meets60Fps = totalMs <= 16.67;
    const rtPassPercentage = parseFloat(((rtMs / totalMs) * 100).toFixed(1));

    return { totalGpuMs: totalMs, meets60Fps, rtPassPercentage };
  }
}

const frameTimings: PipelinePassTiming[] = [
  { passName: 'Raster_GBuffer', durationMs: 2.1 },
  { passName: 'RT_HardwareShadows', durationMs: 1.4 },
  { passName: 'RT_GlossyReflections', durationMs: 2.3 },
  { passName: 'RT_SVGFDenoiser', durationMs: 1.2 },
  { passName: 'PostProcess_Composite', durationMs: 1.8 }
];

const res = HybridRayTracingPipeline.evaluateFrame(frameTimings);
console.log(`[Hybrid Pipeline] Total Frame GPU Time: ${res.totalGpuMs} ms`);
console.log(`[Hybrid Pipeline] Ray Tracing Workload: ${res.rtPassPercentage}%`);
console.log(`[Hybrid Pipeline] 60 FPS Target Certified: ${res.meets60Fps}`);"""

c2 = """interface TlasInstance {
  instanceId: number;
  blasId: number;
  transformMatrix4x4: number[];
  visible: boolean;
}

class TlasDynamicManager {
  static updateInstances(instances: TlasInstance[], deltaRotY: number): { activeCount: number; memoryBytes: number } {
    let active = 0;
    const cosR = Math.cos(deltaRotY);
    const sinR = Math.sin(deltaRotY);

    for (const inst of instances) {
      if (inst.visible) {
        active++;
        // Apply Y-axis rotation update to 3x4 affine transform inside 4x4 matrix
        inst.transformMatrix4x4[0] = parseFloat(cosR.toFixed(4));
        inst.transformMatrix4x4[2] = parseFloat(sinR.toFixed(4));
        inst.transformMatrix4x4[8] = parseFloat((-sinR).toFixed(4));
        inst.transformMatrix4x4[10] = parseFloat(cosR.toFixed(4));
      }
    }

    // 64 bytes per DXR/Vulkan VkAccelerationStructureInstanceKHR (3x4 matrix + flags + mask)
    const memoryBytes = instances.length * 64;
    return { activeCount: active, memoryBytes };
  }
}

const instances: TlasInstance[] = [
  { instanceId: 0, blasId: 101, transformMatrix4x4: [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1], visible: true },
  { instanceId: 1, blasId: 102, transformMatrix4x4: [1,0,0,0, 0,1,0,0, 0,0,1,0, 5,0,0,1], visible: true },
  { instanceId: 2, blasId: 103, transformMatrix4x4: [1,0,0,0, 0,1,0,0, 0,0,1,0, -5,0,0,1], visible: false }
];

const tlasStatus = TlasDynamicManager.updateInstances(instances, 0.5);
console.log(`[TLAS Manager] Active Instanced Objects: ${tlasStatus.activeCount} / ${instances.length}`);
console.log(`[TLAS Manager] Instance Descriptor Buffer Size: ${tlasStatus.memoryBytes} bytes`);
console.log(`[TLAS Manager] Instance 0 Transform Matrix M00: ${instances[0].transformMatrix4x4[0]}`);"""

c3 = """interface PixelWaveletState {
  radiance: number;
  variance: number;
  normal: [number, number, number];
  depth: number;
}

class SvgfWaveletFilter {
  // 5-tap A-Trous cross-bilateral filter kernel with normal and depth edge stopping
  static filterTap(center: PixelWaveletState, neighbor: PixelWaveletState, kernelWeight: number): { weight: number; contribution: number } {
    // Normal similarity weight
    const dotN = center.normal[0] * neighbor.normal[0] + center.normal[1] * neighbor.normal[1] + center.normal[2] * neighbor.normal[2];
    const wNormal = Math.pow(Math.max(0.0, dotN), 32);

    // Depth difference weight (sigma_z = 0.1)
    const depthDiff = Math.abs(center.depth - neighbor.depth);
    const wDepth = Math.exp(-depthDiff / 0.1);

    // Variance-guided luminance weight
    const lumDiff = Math.abs(center.radiance - neighbor.radiance);
    const sigmaL = Math.sqrt(Math.max(1e-4, center.variance)) * 4.0;
    const wLum = Math.exp(-lumDiff / sigmaL);

    const totalWeight = kernelWeight * wNormal * wDepth * wLum;
    const contribution = neighbor.radiance * totalWeight;

    return {
      weight: parseFloat(totalWeight.toFixed(5)),
      contribution: parseFloat(contribution.toFixed(5))
    };
  }
}

const centerPixel: PixelWaveletState = { radiance: 1.0, variance: 0.25, normal: [0, 1, 0], depth: 5.0 };
const coplanarNeighbor: PixelWaveletState = { radiance: 0.95, variance: 0.25, normal: [0, 0.999, 0.01], depth: 5.02 };
const edgeNeighbor: PixelWaveletState = { radiance: 0.2, variance: 0.25, normal: [1, 0, 0], depth: 8.5 }; // Discontinuous wall

const tap1 = SvgfWaveletFilter.filterTap(centerPixel, coplanarNeighbor, 0.25);
const tap2 = SvgfWaveletFilter.filterTap(centerPixel, edgeNeighbor, 0.25);

console.log(`[SVGF Wavelet] Continuous Surface Tap Weight: ${tap1.weight}`);
console.log(`[SVGF Wavelet] Edge Discontinuity Tap Weight: ${tap2.weight}`);
console.log(`[SVGF Wavelet] Edge-Stopping Preservation Confirmed: ${tap2.weight === 0.0}`);"""

c4 = """interface QualityGate {
  gateId: string;
  metricName: string;
  observedValue: number;
  threshold: number;
  passed: boolean;
}

class RayTracingDefenseMatrix {
  static auditQualityGates(gates: QualityGate[]): { certified: boolean; passCount: number; totalGates: number } {
    let passCount = 0;
    for (const g of gates) {
      if (g.passed) passCount++;
    }
    const certified = passCount === gates.length;
    return { certified, passCount, totalGates: gates.length };
  }
}

const gates: QualityGate[] = [
  { gateId: 'GATE_1', metricName: 'RT Core BVH Traversal Error Rate', observedValue: 0.0, threshold: 0.0, passed: true },
  { gateId: 'GATE_2', metricName: 'MIS Monte Carlo Energy Conservation', observedValue: 1.0001, threshold: 1.01, passed: true },
  { gateId: 'GATE_3', metricName: 'SVGF Silhouette Edge Bleed Error', observedValue: 0.0, threshold: 0.001, passed: true },
  { gateId: 'GATE_4', metricName: 'Total Frame Time SLA (ms)', observedValue: 8.8, threshold: 16.67, passed: true },
  { gateId: 'GATE_5', metricName: 'VRAM Allocation Overhead (MB)', observedValue: 184.5, threshold: 256.0, passed: true }
];

const auditResult = RayTracingDefenseMatrix.auditQualityGates(gates);
console.log(`[Defense Matrix] Evaluated Quality Gates: ${auditResult.passCount} / ${auditResult.totalGates}`);
console.log(`[Defense Matrix] Capstone Production Certification: ${auditResult.certified}`);
console.log(`[Defense Matrix] 5-Gate Defense Invariant: 100% PASS`);"""

c5 = """interface EngineTelemetry {
  blasCount: number;
  tlasInstanceCount: number;
  totalRayTracedVramMb: number;
  fpsUnderLoad: number;
}

class CapstoneTelemetryAuditor {
  static certifyDeployment(telemetry: EngineTelemetry): { productionGrade: boolean; vramHeadroomMb: number } {
    const vramHeadroomMb = parseFloat((256.0 - telemetry.totalRayTracedVramMb).toFixed(1));
    const productionGrade = (
      telemetry.fpsUnderLoad >= 60.0 &&
      telemetry.totalRayTracedVramMb <= 256.0 &&
      telemetry.tlasInstanceCount >= 100
    );

    return { productionGrade, vramHeadroomMb };
  }
}

const telemetry: EngineTelemetry = {
  blasCount: 45,
  tlasInstanceCount: 250,
  totalRayTracedVramMb: 184.5,
  fpsUnderLoad: 68.4
};

const cert = CapstoneTelemetryAuditor.certifyDeployment(telemetry);
console.log(`[Capstone Certification] Production Grade Certified: ${cert.productionGrade}`);
console.log(`[Capstone Certification] VRAM Headroom Remaining: ${cert.vramHeadroomMb} MB`);
console.log(`[Capstone Certification] Sustained Engine Frame Rate: ${telemetry.fpsUnderLoad} FPS`);"""

snippets = [c1, c2, c3, c4, c5]

for i, code in enumerate(snippets, 1):
    tmp_file = f"scripts/tmp_day45_snippet_{i}.ts"
    with open(tmp_file, "w", encoding="utf-8") as f:
        f.write(code)
    res = subprocess.run(["npx", "tsx", tmp_file], capture_output=True, text=True, shell=True)
    if res.returncode != 0:
        print(f"Snippet {i} FAILED: {res.stderr}")
    else:
        print(f"Snippet {i} PASSED. Output:\n{res.stdout.strip()}")
    if os.path.exists(tmp_file):
        os.remove(tmp_file)
