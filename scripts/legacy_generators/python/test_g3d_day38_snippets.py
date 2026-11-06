import subprocess
import sys

snippets = [
    # Snippet 1: Froxel Grid Index & Volume Sizer
    {
        'name': 'Day 38 Snippet 1 - Froxel Grid Sizer',
        'code': """interface FroxelConfig {
  width: number;
  height: number;
  depthSlices: number;
  bytesPerVoxel: number; // RGBA16F = 8 bytes
}

class FroxelGridSizer {
  static evaluateGrid(cfg: FroxelConfig): { totalVoxels: number; vramMegabytes: number } {
    const totalVoxels = cfg.width * cfg.height * cfg.depthSlices;
    const vramBytes = totalVoxels * cfg.bytesPerVoxel;
    const vramMegabytes = parseFloat((vramBytes / (1024 * 1024)).toFixed(2));
    return { totalVoxels, vramMegabytes };
  }

  static getSliceDepth(slice: number, maxSlices: number, nearZ: number, farZ: number): number {
    // Logarithmic depth distribution: depth = near * (far / near)^(slice / maxSlices)
    const ratio = farZ / nearZ;
    const depth = nearZ * Math.pow(ratio, slice / maxSlices);
    return parseFloat(depth.toFixed(2));
  }
}

const config: FroxelConfig = { width: 160, height: 90, depthSlices: 64, bytesPerVoxel: 8 };
const grid = FroxelGridSizer.evaluateGrid(config);
const nearSliceDepth = FroxelGridSizer.getSliceDepth(8, 64, 0.1, 100.0);
const farSliceDepth = FroxelGridSizer.getSliceDepth(32, 64, 0.1, 100.0);

console.log(`[Froxel Grid] Dimensions: ${config.width}x${config.height}x${config.depthSlices}`);
console.log(`[Froxel Grid] Total Froxels: ${grid.totalVoxels.toLocaleString("en-US")}`);
console.log(`[Froxel Grid] VRAM Allocation: ${grid.vramMegabytes} MB`);
console.log(`[Froxel Grid] Slice 8 Depth: ${nearSliceDepth}m, Slice 32 Depth: ${farSliceDepth}m`);
""",
        'expected': """[Froxel Grid] Dimensions: 160x90x64
[Froxel Grid] Total Froxels: 921,600
[Froxel Grid] VRAM Allocation: 7.03 MB
[Froxel Grid] Slice 8 Depth: 0.24m, Slice 32 Depth: 3.16m"""
    },
    # Snippet 2: Henyey-Greenstein Phase Function
    {
        'name': 'Day 38 Snippet 2 - Henyey-Greenstein Phase Function',
        'code': """class HenyeyGreensteinPhase {
  static evaluate(cosTheta: number, g: number): number {
    // P(theta) = (1 - g^2) / (4 * pi * (1 + g^2 - 2 * g * cosTheta)^1.5)
    const g2 = g * g;
    const denom = 4 * Math.PI * Math.pow(1 + g2 - 2 * g * cosTheta, 1.5);
    const p = (1 - g2) / denom;
    return parseFloat(p.toFixed(4));
  }
}

const g = 0.5; // Forward scattering (aerosols/fog)
const forward = HenyeyGreensteinPhase.evaluate(1.0, g); // Looking directly into light
const side = HenyeyGreensteinPhase.evaluate(0.0, g); // Perpendicular view
const back = HenyeyGreensteinPhase.evaluate(-1.0, g); // Looking directly away

console.log(`[Phase Function] Asymmetry Factor g: ${g}`);
console.log(`[Phase Function] Direct Forward Scattering (cos=1.0): ${forward}`);
console.log(`[Phase Function] Side Scattering (cos=0.0): ${side}`);
console.log(`[Phase Function] Back Scattering (cos=-1.0): ${back}`);
""",
        'expected': """[Phase Function] Asymmetry Factor g: 0.5
[Phase Function] Direct Forward Scattering (cos=1.0): 0.4775
[Phase Function] Side Scattering (cos=0.0): 0.0427
[Phase Function] Back Scattering (cos=-1.0): 0.0177"""
    },
    # Snippet 3: Beer-Lambert Law Transmittance Calculator
    {
        'name': 'Day 38 Snippet 3 - Beer-Lambert Transmittance',
        'code': """class BeerLambertTransmittance {
  static computeTransmittance(extinctionCoeff: number, stepDistance: number): number {
    // T = exp(-sigma_t * d)
    const opticalDepth = extinctionCoeff * stepDistance;
    const transmittance = Math.exp(-opticalDepth);
    return parseFloat(transmittance.toFixed(4));
  }
}

const extinction = 0.15; // Moderate fog extinction coefficient
const step1 = BeerLambertTransmittance.computeTransmittance(extinction, 2.0);
const step2 = BeerLambertTransmittance.computeTransmittance(extinction, 5.0);
const step3 = BeerLambertTransmittance.computeTransmittance(extinction, 15.0);

console.log(`[Beer-Lambert] Extinction Coefficient: ${extinction}/m`);
console.log(`[Beer-Lambert] Transmittance over 2m: ${step1}`);
console.log(`[Beer-Lambert] Transmittance over 5m: ${step2}`);
console.log(`[Beer-Lambert] Transmittance over 15m: ${step3}`);
""",
        'expected': """[Beer-Lambert] Extinction Coefficient: 0.15/m
[Beer-Lambert] Transmittance over 2m: 0.7408
[Beer-Lambert] Transmittance over 5m: 0.4724
[Beer-Lambert] Transmittance over 15m: 0.1054"""
    },
    # Snippet 4: Volumetric Light Accumulation Loop
    {
        'name': 'Day 38 Snippet 4 - Light Accumulation Loop',
        'code': """interface VolumeStep {
  inScatteredLight: number;
  transmittance: number;
}

class VolumetricRayAccumulator {
  static integrate(steps: VolumeStep[]): { accumulatedLight: number; finalTransmittance: number } {
    let accLight = 0;
    let netTransmittance = 1.0;

    for (const step of steps) {
      accLight += step.inScatteredLight * netTransmittance;
      netTransmittance *= step.transmittance;
    }

    return {
      accumulatedLight: parseFloat(accLight.toFixed(4)),
      finalTransmittance: parseFloat(netTransmittance.toFixed(4))
    };
  }
}

const slices: VolumeStep[] = [
  { inScatteredLight: 0.25, transmittance: 0.8 },
  { inScatteredLight: 0.30, transmittance: 0.8 },
  { inScatteredLight: 0.20, transmittance: 0.8 },
  { inScatteredLight: 0.15, transmittance: 0.8 }
];

const result = VolumetricRayAccumulator.integrate(slices);
console.log(`[Volumetric Integration] Step Count: ${slices.length}`);
console.log(`[Volumetric Integration] Total In-Scattered Light: ${result.accumulatedLight}`);
console.log(`[Volumetric Integration] Final Net Transmittance: ${result.finalTransmittance}`);
""",
        'expected': """[Volumetric Integration] Step Count: 4
[Volumetric Integration] Total In-Scattered Light: 0.6948
[Volumetric Integration] Final Net Transmittance: 0.4096"""
    },
    # Snippet 5: Volumetric Quality & Upsampling Auditor
    {
        'name': 'Day 38 Snippet 5 - Volumetric Quality Auditor',
        'code': """interface VolumetricMetrics {
  froxelComputeMs: number;
  upsampleCompositeMs: number;
  edgeBleedArtifactsDetected: boolean;
}

class VolumetricQualityAuditor {
  static audit(metrics: VolumetricMetrics): { totalMs: number; withinBudget: boolean; passedQuality: boolean } {
    const totalMs = parseFloat((metrics.froxelComputeMs + metrics.upsampleCompositeMs).toFixed(2));
    const withinBudget = totalMs <= 3.0; // Under 3ms budget
    const passedQuality = withinBudget && !metrics.edgeBleedArtifactsDetected;
    return { totalMs, withinBudget, passedQuality };
  }
}

const metrics: VolumetricMetrics = {
  froxelComputeMs: 1.62,
  upsampleCompositeMs: 0.58,
  edgeBleedArtifactsDetected: false
};

const audit = VolumetricQualityAuditor.audit(metrics);
console.log(`[Volumetric Audit] Total Pass Execution Time: ${audit.totalMs} ms`);
console.log(`[Volumetric Audit] Within 3ms Budget: ${audit.withinBudget}`);
console.log(`[Volumetric Audit] Production Quality Certified: ${audit.passedQuality}`);
""",
        'expected': """[Volumetric Audit] Total Pass Execution Time: 2.2 ms
[Volumetric Audit] Within 3ms Budget: true
[Volumetric Audit] Production Quality Certified: true"""
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
