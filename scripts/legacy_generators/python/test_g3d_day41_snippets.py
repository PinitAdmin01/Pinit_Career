import subprocess
import sys

snippets = [
    # Snippet 1: Ray Generator from Camera Inversion
    {
        'name': 'Day 41 Snippet 1 - Ray Generator',
        'code': """interface CameraRayConfig {
  pixelX: number;
  pixelY: number;
  screenWidth: number;
  screenHeight: number;
  cameraPos: [number, number, number];
  invViewProj: number[]; // 16 elements (4x4 matrix)
}

class RayGenerator {
  static generateRay(cfg: CameraRayConfig): { origin: [number, number, number]; direction: [number, number, number] } {
    // Convert pixel to NDC [-1, 1]
    const ndcX = (2.0 * (cfg.pixelX + 0.5)) / cfg.screenWidth - 1.0;
    const ndcY = 1.0 - (2.0 * (cfg.pixelY + 0.5)) / cfg.screenHeight;

    // Transform near and far points by inverse view projection
    const targetNear = this.transformPoint([ndcX, ndcY, 0.0, 1.0], cfg.invViewProj);
    const targetFar = this.transformPoint([ndcX, ndcY, 1.0, 1.0], cfg.invViewProj);

    const dirX = targetFar[0] - targetNear[0];
    const dirY = targetFar[1] - targetNear[1];
    const dirZ = targetFar[2] - targetNear[2];
    const len = Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);

    const normDir: [number, number, number] = [
      parseFloat((dirX / len).toFixed(4)),
      parseFloat((dirY / len).toFixed(4)),
      parseFloat((dirZ / len).toFixed(4))
    ];

    return { origin: cfg.cameraPos, direction: normDir };
  }

  private static transformPoint(p: [number, number, number, number], m: number[]): [number, number, number] {
    const x = m[0] * p[0] + m[4] * p[1] + m[8] * p[2] + m[12] * p[3];
    const y = m[1] * p[0] + m[5] * p[1] + m[9] * p[2] + m[13] * p[3];
    const z = m[2] * p[0] + m[6] * p[1] + m[10] * p[2] + m[14] * p[3];
    const w = m[3] * p[0] + m[7] * p[1] + m[11] * p[2] + m[15] * p[3];
    return [x / w, y / w, z / w];
  }
}

// Identity matrix for testing
const identity = [
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1
];

const ray = RayGenerator.generateRay({
  pixelX: 960,
  pixelY: 540,
  screenWidth: 1920,
  screenHeight: 1080,
  cameraPos: [0.0, 1.5, 5.0],
  invViewProj: identity
});

console.log(`[Ray Generation] Camera Origin: [${ray.origin.join(", ")}]`);
console.log(`[Ray Generation] Ray Direction at Screen Center: [${ray.direction.join(", ")}]`);
""",
        'expected': """[Ray Generation] Camera Origin: [0, 1.5, 5]
[Ray Generation] Ray Direction at Screen Center: [0, 0, 1]"""
    },
    # Snippet 2: Ray Query Initializer & Traversal Configuration
    {
        'name': 'Day 41 Snippet 2 - Ray Query Initializer',
        'code': """enum RayQueryFlag {
  NONE = 0,
  OPAQUE = 1,
  NO_OPAQUE = 2,
  TERMINATE_ON_FIRST_HIT = 4
}

interface RayQueryConfig {
  origin: [number, number, number];
  direction: [number, number, number];
  tMin: number;
  tMax: number;
  flags: number;
}

class RayQueryInitializer {
  static configureShadowRay(origin: [number, number, number], lightDir: [number, number, number], maxDist: number): RayQueryConfig {
    return {
      origin: [origin[0], origin[1], origin[2]],
      direction: [lightDir[0], lightDir[1], lightDir[2]],
      tMin: 0.001, // Epsilon offset to prevent self-intersection acne
      tMax: maxDist,
      flags: RayQueryFlag.OPAQUE | RayQueryFlag.TERMINATE_ON_FIRST_HIT
    };
  }
}

const shadowRay = RayQueryInitializer.configureShadowRay([0, 1, 0], [0, 1, 0], 25.0);
console.log(`[Ray Query] TMin (Acne Offset): ${shadowRay.tMin}m`);
console.log(`[Ray Query] TMax (Distance Bound): ${shadowRay.tMax}m`);
console.log(`[Ray Query] Optimization Flags: ${shadowRay.flags} (OPAQUE | TERMINATE_ON_FIRST_HIT)`);
""",
        'expected': """[Ray Query] TMin (Acne Offset): 0.001m
[Ray Query] TMax (Distance Bound): 25m
[Ray Query] Optimization Flags: 5 (OPAQUE | TERMINATE_ON_FIRST_HIT)"""
    },
    # Snippet 3: Ray Hit Evaluator & Barycentric Interpolation
    {
        'name': 'Day 41 Snippet 3 - Ray Hit Evaluator',
        'code': """interface HitResult {
  hasHit: boolean;
  t: number;
  barycentricU: number;
  barycentricV: number;
  instanceId: number;
}

class RayHitEvaluator {
  static interpolateNormal(
    hit: HitResult,
    normals: [number, number, number][] // 3 vertex normals [n0, n1, n2]
  ): [number, number, number] {
    const w = 1.0 - hit.barycentricU - hit.barycentricV;
    const u = hit.barycentricU;
    const v = hit.barycentricV;

    const nx = w * normals[0][0] + u * normals[1][0] + v * normals[2][0];
    const ny = w * normals[0][1] + u * normals[1][1] + v * normals[2][1];
    const nz = w * normals[0][2] + u * normals[1][2] + v * normals[2][2];
    const len = Math.sqrt(nx * nx + ny * ny + nz * nz);

    return [
      parseFloat((nx / len).toFixed(4)),
      parseFloat((ny / len).toFixed(4)),
      parseFloat((nz / len).toFixed(4))
    ];
  }
}

const hit: HitResult = {
  hasHit: true,
  t: 3.42,
  barycentricU: 0.35,
  barycentricV: 0.45,
  instanceId: 12
};

const triNormals: [number, number, number][] = [
  [0, 1, 0],
  [0.2, 0.98, 0],
  [-0.1, 0.99, 0.1]
];

const hitNormal = RayHitEvaluator.interpolateNormal(hit, triNormals);
console.log(`[Ray Hit] Distance t: ${hit.t}m, Instance ID: ${hit.instanceId}`);
console.log(`[Ray Hit] Barycentrics: u=${hit.barycentricU}, v=${hit.barycentricV}, w=${(1 - hit.barycentricU - hit.barycentricV).toFixed(2)}`);
console.log(`[Ray Hit] Interpolated Surface Normal: [${hitNormal.join(", ")}]`);
""",
        'expected': """[Ray Hit] Distance t: 3.42m, Instance ID: 12
[Ray Hit] Barycentrics: u=0.35, v=0.45, w=0.20
[Ray Hit] Interpolated Surface Normal: [0.0253, 0.9986, 0.0455]"""
    },
    # Snippet 4: Ray-Traced Ambient Occlusion (RTAO) Evaluator
    {
        'name': 'Day 41 Snippet 4 - RTAO Evaluator',
        'code': """interface OcclusionSample {
  rayHit: boolean;
  distance: number;
}

class RayTracedAOEvaluator {
  static computeAO(samples: OcclusionSample[], maxAoDist: number): number {
    let unoccludedCount = 0;

    for (const s of samples) {
      if (!s.rayHit || s.distance > maxAoDist) {
        unoccludedCount++;
      }
    }

    const aoFactor = unoccludedCount / samples.length;
    return parseFloat(aoFactor.toFixed(3));
  }
}

const testSamples: OcclusionSample[] = [
  { rayHit: false, distance: Infinity },
  { rayHit: true, distance: 0.8 },  // Occluded within radius
  { rayHit: true, distance: 4.5 },  // Hit beyond 2.0m radius (treated as clear)
  { rayHit: false, distance: Infinity },
  { rayHit: true, distance: 0.3 }   // Occluded
];

const ao = RayTracedAOEvaluator.computeAO(testSamples, 2.0);
console.log(`[RTAO] Sample Rays Evaluated: ${testSamples.length}`);
console.log(`[RTAO] Ambient Occlusion Factor: ${ao} (1.0 = fully unoccluded)`);
console.log(`[RTAO] Surface Shadowing Percentage: ${(100 * (1.0 - ao)).toFixed(1)}%`);
""",
        'expected': """[RTAO] Sample Rays Evaluated: 5
[RTAO] Ambient Occlusion Factor: 0.6 (1.0 = fully unoccluded)
[RTAO] Surface Shadowing Percentage: 40.0%"""
    },
    # Snippet 5: Ray Tracing Performance Auditor
    {
        'name': 'Day 41 Snippet 5 - Ray Tracing Performance Auditor',
        'code': """interface RTMetrics {
  totalRaysDispatched: number;
  rayQueryExecutionMs: number;
  rayBoxTestsPerSecondM: number;
  maxSlaMs: number;
}

class RayTracingQualityAuditor {
  static audit(metrics: RTMetrics): { withinBudget: boolean; throughputCertified: boolean; mrps: number } {
    const withinBudget = metrics.rayQueryExecutionMs <= metrics.maxSlaMs;
    const mrps = parseFloat((metrics.totalRaysDispatched / (metrics.rayQueryExecutionMs * 1000.0)).toFixed(1)); // Million Rays Per Second
    const throughputCertified = mrps >= 50.0; // SLA: >= 50 Million Rays/sec on modern hardware

    return { withinBudget, throughputCertified, mrps };
  }
}

const metrics: RTMetrics = {
  totalRaysDispatched: 921600, // 1 ray per pixel at 720p or half-res 1080p
  rayQueryExecutionMs: 1.85,
  rayBoxTestsPerSecondM: 850,
  maxSlaMs: 2.50
};

const audit = RayTracingQualityAuditor.audit(metrics);
console.log(`[RT Audit] Rays Dispatched: ${metrics.totalRaysDispatched.toLocaleString("en-US")}`);
console.log(`[RT Audit] Execution Time: ${metrics.rayQueryExecutionMs} ms (Under ${metrics.maxSlaMs}ms SLA: ${audit.withinBudget})`);
console.log(`[RT Audit] Ray Throughput: ${audit.mrps} Million Rays/Sec (Meets Target: ${audit.throughputCertified})`);
""",
        'expected': """[RT Audit] Rays Dispatched: 921,600
[RT Audit] Execution Time: 1.85 ms (Under 2.5ms SLA: true)
[RT Audit] Ray Throughput: 498.2 Million Rays/Sec (Meets Target: true)"""
    }
]

def main():
    failed = 0
    for s in snippets:
        with open('scripts/temp_snippet.ts', 'w', encoding='utf-8') as f:
            f.write(s['code'])
        try:
            res = subprocess.run(['npx', 'tsx', 'scripts/temp_snippet.ts'], capture_output=True, text=True, check=True, shell=True)
            stdout = res.stdout.strip().replace('\r\n', '\n')
            expected = s['expected'].strip().replace('\r\n', '\n')
            if stdout == expected:
                print(f"PASS: {s['name']}")
            else:
                print(f"FAIL: {s['name']}")
                print("--- EXPECTED ---")
                print(expected)
                print("--- ACTUAL ---")
                print(stdout)
                failed += 1
        except Exception as e:
            print(f"ERROR: {s['name']}: {e}")
            failed += 1

    if failed == 0:
        print("ALL 5 SNIPPETS PASS!")
        sys.exit(0)
    else:
        print(f"{failed} SNIPPETS FAILED!")
        sys.exit(1)

if __name__ == '__main__':
    main()
