import subprocess
import sys

snippets = [
    # Snippet 1: Camera-Space Reflection Vector Generator
    {
        'name': 'Day 37 Snippet 1 - Reflection Vector Generator',
        'code': """type Vec3 = [number, number, number];

class ReflectionRayGenerator {
  static reflect(v: Vec3, n: Vec3): Vec3 {
    // R = V - 2 * (V . N) * N
    const dotVN = v[0] * n[0] + v[1] * n[1] + v[2] * n[2];
    return [
      parseFloat((v[0] - 2 * dotVN * n[0]).toFixed(4)),
      parseFloat((v[1] - 2 * dotVN * n[1]).toFixed(4)),
      parseFloat((v[2] - 2 * dotVN * n[2]).toFixed(4))
    ];
  }
}

const viewDir: Vec3 = [0.0, -0.7071, 0.7071]; // Looking diagonally down at floor
const normal: Vec3 = [0.0, 1.0, 0.0]; // Floor normal pointing up
const refRay = ReflectionRayGenerator.reflect(viewDir, normal);

console.log(`[SSR Ray] View Vector: [${viewDir.join(", ")}]`);
console.log(`[SSR Ray] Surface Normal: [${normal.join(", ")}]`);
console.log(`[SSR Ray] Reflection Vector: [${refRay.join(", ")}]`);
""",
        'expected': """[SSR Ray] View Vector: [0, -0.7071, 0.7071]
[SSR Ray] Surface Normal: [0, 1, 0]
[SSR Ray] Reflection Vector: [0, 0.7071, 0.7071]"""
    },
    # Snippet 2: Linear Ray Marching Step Evaluator
    {
        'name': 'Day 37 Snippet 2 - Linear Ray Marching',
        'code': """interface RayHit {
  hit: boolean;
  stepIndex: number;
  rayZ: number;
  depthZ: number;
}

class ScreenSpaceRayMarcher {
  static march(depthBuffer: number[], startZ: number, stepZ: number, maxSteps: number): RayHit {
    let currentZ = startZ;
    for (let step = 0; step < maxSteps; step++) {
      currentZ += stepZ;
      const sceneDepth = depthBuffer[step];
      if (currentZ >= sceneDepth) {
        return {
          hit: true,
          stepIndex: step,
          rayZ: parseFloat(currentZ.toFixed(2)),
          depthZ: sceneDepth
        };
      }
    }
    return { hit: false, stepIndex: maxSteps, rayZ: currentZ, depthZ: 0 };
  }
}

const mockDepthProfile = [5.0, 5.0, 4.8, 3.2, 2.5, 2.0];
const startDepth = 1.0;
const stepDelta = 0.8;
const hit = ScreenSpaceRayMarcher.march(mockDepthProfile, startDepth, stepDelta, 6);

console.log(`[SSR Marcher] Intersection Detected: ${hit.hit}`);
console.log(`[SSR Marcher] Hit Step Index: ${hit.stepIndex}`);
console.log(`[SSR Marcher] Ray Depth: ${hit.rayZ}, Scene Depth: ${hit.depthZ}`);
""",
        'expected': """[SSR Marcher] Intersection Detected: true
[SSR Marcher] Hit Step Index: 3
[SSR Marcher] Ray Depth: 4.2, Scene Depth: 3.2"""
    },
    # Snippet 3: Binary Search Depth Refinement
    {
        'name': 'Day 37 Snippet 3 - Binary Search Refinement',
        'code': """class SSRBinaryRefiner {
  static refine(minZ: number, maxZ: number, targetDepth: number, iterations: number): number {
    let low = minZ;
    let high = maxZ;
    for (let i = 0; i < iterations; i++) {
      const mid = (low + high) / 2;
      if (mid < targetDepth) {
        low = mid;
      } else {
        high = mid;
      }
    }
    return parseFloat(((low + high) / 2).toFixed(4));
  }
}

const initialLow = 3.4; // Step before intersection
const initialHigh = 4.2; // Step after intersection
const exactDepth = 3.825;
const refined = SSRBinaryRefiner.refine(initialLow, initialHigh, exactDepth, 5);

console.log(`[SSR Refine] Initial Interval: [${initialLow}, ${initialHigh}]`);
console.log(`[SSR Refine] Refined Intersection Depth: ${refined}`);
console.log(`[SSR Refine] Precision Error: ${parseFloat(Math.abs(refined - exactDepth).toFixed(4))}`);
""",
        'expected': """[SSR Refine] Initial Interval: [3.4, 4.2]
[SSR Refine] Refined Intersection Depth: 3.8375
[SSR Refine] Precision Error: 0.0125"""
    },
    # Snippet 4: Fresnel & Screen Edge Fade Calculator
    {
        'name': 'Day 37 Snippet 4 - Fresnel & Edge Fade',
        'code': """class SSRAttenuationCalculator {
  static computeFresnel(cosTheta: number, f0: number = 0.04): number {
    // Schlick's approximation: F = F0 + (1 - F0) * (1 - cosTheta)^5
    const f = f0 + (1 - f0) * Math.pow(1 - cosTheta, 5);
    return parseFloat(f.toFixed(4));
  }

  static computeEdgeFade(u: number, v: number): number {
    // Attenuation based on distance to screen edge
    const distFromCenter = Math.max(Math.abs(u - 0.5), Math.abs(v - 0.5)) * 2; // [0, 1]
    const edgeFade = Math.max(0, 1 - Math.max(0, (distFromCenter - 0.8) / 0.2));
    return parseFloat(edgeFade.toFixed(4));
  }
}

const cosTheta = 0.25; // Grazing angle
const fresnel = SSRAttenuationCalculator.computeFresnel(cosTheta);
const fadeCenter = SSRAttenuationCalculator.computeEdgeFade(0.5, 0.5);
const fadeEdge = SSRAttenuationCalculator.computeEdgeFade(0.95, 0.5);

console.log(`[SSR Attenuation] Grazing Angle Fresnel (cos=0.25): ${fresnel}`);
console.log(`[SSR Attenuation] Screen Center Visibility: ${fadeCenter}`);
console.log(`[SSR Attenuation] Screen Edge Visibility (u=0.95): ${fadeEdge}`);
""",
        'expected': """[SSR Attenuation] Grazing Angle Fresnel (cos=0.25): 0.2678
[SSR Attenuation] Screen Center Visibility: 1
[SSR Attenuation] Screen Edge Visibility (u=0.95): 0.5"""
    },
    # Snippet 5: SSR Reflection Quality & Fallback Auditor
    {
        'name': 'Day 37 Snippet 5 - SSR Fallback Auditor',
        'code': """interface SSRRayResult {
  hitCount: number;
  totalRays: number;
  averageSteps: number;
}

class SSRQualityAuditor {
  static evaluate(stats: SSRRayResult): { hitRatePct: number; fallbackWeightPct: number; meetsBudget: boolean } {
    const hitRatePct = Math.round((stats.hitCount / stats.totalRays) * 100);
    const fallbackWeightPct = 100 - hitRatePct;
    const meetsBudget = stats.averageSteps <= 16;
    return { hitRatePct, fallbackWeightPct, meetsBudget };
  }
}

const stats: SSRRayResult = {
  hitCount: 780,
  totalRays: 1000,
  averageSteps: 9.4
};

const audit = SSRQualityAuditor.evaluate(stats);
console.log(`[SSR Audit] Screen-Space Hit Rate: ${audit.hitRatePct}%`);
console.log(`[SSR Audit] Environment Fallback Ratio: ${audit.fallbackWeightPct}%`);
console.log(`[SSR Audit] Average Steps Within Performance Budget: ${audit.meetsBudget}`);
""",
        'expected': """[SSR Audit] Screen-Space Hit Rate: 78%
[SSR Audit] Environment Fallback Ratio: 22%
[SSR Audit] Average Steps Within Performance Budget: true"""
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
