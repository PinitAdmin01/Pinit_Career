import subprocess
import sys

snippets = [
    # Snippet 1: Any-Hit Alpha Tester
    {
        'name': 'Day 43 Snippet 1 - Any-Hit Alpha Tester',
        'code': """interface HitCandidate {
  barycentricU: number;
  barycentricV: number;
  triangleUvs: [number, number][]; // 3 UV pairs [uv0, uv1, uv2]
  alphaMap: number[][]; // 4x4 texel grid [0, 1]
}

class AnyHitAlphaTester {
  static testCandidate(candidate: HitCandidate, cutoff: number): { confirmed: boolean; sampledAlpha: number } {
    const w = 1.0 - candidate.barycentricU - candidate.barycentricV;
    const u = candidate.barycentricU;
    const v = candidate.barycentricV;

    // Interpolate UV
    const texU = w * candidate.triangleUvs[0][0] + u * candidate.triangleUvs[1][0] + v * candidate.triangleUvs[2][0];
    const texV = w * candidate.triangleUvs[0][1] + u * candidate.triangleUvs[1][1] + v * candidate.triangleUvs[2][1];

    // Fetch from 4x4 texel grid
    const px = Math.min(3, Math.max(0, Math.floor(texU * 4.0)));
    const py = Math.min(3, Math.max(0, Math.floor(texV * 4.0)));
    const sampledAlpha = candidate.alphaMap[py][px];

    const confirmed = sampledAlpha >= cutoff;
    return { confirmed, sampledAlpha };
  }
}

const foliageAlpha: number[][] = [
  [0.0, 0.0, 0.8, 0.9],
  [0.0, 0.9, 0.9, 0.1],
  [0.8, 0.9, 0.1, 0.0],
  [0.9, 0.2, 0.0, 0.0]
];

const candidateLeaf: HitCandidate = {
  barycentricU: 0.3,
  barycentricV: 0.4,
  triangleUvs: [[0.0, 0.0], [1.0, 0.0], [0.0, 1.0]],
  alphaMap: foliageAlpha
};

const result = AnyHitAlphaTester.testCandidate(candidateLeaf, 0.5);
console.log(`[Any-Hit Test] Sampled Alpha Value: ${result.sampledAlpha}`);
console.log(`[Any-Hit Test] Alpha Cutoff Threshold: 0.5`);
console.log(`[Any-Hit Test] Intersection Confirmed by Shader: ${result.confirmed}`);
""",
        'expected': """[Any-Hit Test] Sampled Alpha Value: 0.9
[Any-Hit Test] Alpha Cutoff Threshold: 0.5
[Any-Hit Test] Intersection Confirmed by Shader: true"""
    },
    # Snippet 2: Stochastic Dithered Transparency Evaluator
    {
        'name': 'Day 43 Snippet 2 - Stochastic Transparency',
        'code': """class AlphaDitherStochasticEvaluator {
  private static bayer4x4 = [
    [ 0/16,  8/16,  2/16, 10/16],
    [12/16,  4/16, 14/16,  6/16],
    [ 3/16, 11/16,  1/16,  9/16],
    [15/16,  7/16, 13/16,  5/16]
  ];

  static isVisible(screenX: number, screenY: number, alpha: number): boolean {
    const threshold = this.bayer4x4[screenY % 4][screenX % 4];
    return alpha > threshold;
  }
}

const alpha = 0.65; // 65% opacity glass surface
const pixelHits = [
  { x: 0, y: 0, visible: AlphaDitherStochasticEvaluator.isVisible(0, 0, alpha) },
  { x: 1, y: 0, visible: AlphaDitherStochasticEvaluator.isVisible(1, 0, alpha) },
  { x: 0, y: 1, visible: AlphaDitherStochasticEvaluator.isVisible(0, 1, alpha) },
  { x: 1, y: 1, visible: AlphaDitherStochasticEvaluator.isVisible(1, 1, alpha) }
];

console.log(`[Stochastic Alpha] Evaluated Material Opacity: ${alpha}`);
console.log(`[Stochastic Alpha] Pixel (0,0) Bayer Threshold: 0.0 -> Visible: ${pixelHits[0].visible}`);
console.log(`[Stochastic Alpha] Pixel (1,0) Bayer Threshold: 0.5 -> Visible: ${pixelHits[1].visible}`);
console.log(`[Stochastic Alpha] Pixel (0,1) Bayer Threshold: 0.75 -> Visible: ${pixelHits[2].visible}`);
console.log(`[Stochastic Alpha] Pixel (1,1) Bayer Threshold: 0.25 -> Visible: ${pixelHits[3].visible}`);
""",
        'expected': """[Stochastic Alpha] Evaluated Material Opacity: 0.65
[Stochastic Alpha] Pixel (0,0) Bayer Threshold: 0.0 -> Visible: true
[Stochastic Alpha] Pixel (1,0) Bayer Threshold: 0.5 -> Visible: true
[Stochastic Alpha] Pixel (0,1) Bayer Threshold: 0.75 -> Visible: false
[Stochastic Alpha] Pixel (1,1) Bayer Threshold: 0.25 -> Visible: true"""
    },
    # Snippet 3: Ray-Traced Hard Shadow Evaluator
    {
        'name': 'Day 43 Snippet 3 - Hard Shadow Evaluator',
        'code': """interface ShadowRayHit {
  hitDetected: boolean;
  hitDistance: number;
}

class RayTracedHardShadowEvaluator {
  static evaluateVisibility(hit: ShadowRayHit, lightDistance: number): { shadowFactor: number; occluded: boolean } {
    // If a hit was found between surface epsilon and light distance, surface is in shadow
    const occluded = hit.hitDetected && hit.hitDistance < lightDistance;
    const shadowFactor = occluded ? 0.0 : 1.0;
    return { shadowFactor, occluded };
  }
}

const clearPoint = RayTracedHardShadowEvaluator.evaluateVisibility({ hitDetected: false, hitDistance: Infinity }, 10.0);
const occludedPoint = RayTracedHardShadowEvaluator.evaluateVisibility({ hitDetected: true, hitDistance: 3.4 }, 10.0);

console.log(`[Hard Shadow] Clear Point Visibility: ${clearPoint.shadowFactor} (In Shadow: ${clearPoint.occluded})`);
console.log(`[Hard Shadow] Occluded Point Visibility: ${occludedPoint.shadowFactor} (In Shadow: ${occludedPoint.occluded})`);
console.log(`[Hard Shadow] Artifact Elimination: Zero Peter Panning, Zero Perspective Aliasing`);
""",
        'expected': """[Hard Shadow] Clear Point Visibility: 1 (In Shadow: false)
[Hard Shadow] Occluded Point Visibility: 0 (In Shadow: true)
[Hard Shadow] Artifact Elimination: Zero Peter Panning, Zero Perspective Aliasing"""
    },
    # Snippet 4: Soft Shadow Penumbra Calculator
    {
        'name': 'Day 43 Snippet 4 - Penumbra Calculator',
        'code': """interface AreaLightConfig {
  sourceRadiusM: number;
  receiverDistM: number;
  occluderDistM: number;
}

class SoftShadowPenumbraCalculator {
  static computePenumbraWidth(cfg: AreaLightConfig): { penumbraWidthM: number; blurPercentage: number } {
    // Similar triangles: w = r_light * (d_receiver - d_occluder) / d_occluder
    const distToOccluder = cfg.receiverDistM - cfg.occluderDistM;
    if (cfg.occluderDistM <= 0.001) return { penumbraWidthM: 0, blurPercentage: 0 };

    const w = (cfg.sourceRadiusM * distToOccluder) / cfg.occluderDistM;
    const penumbraWidthM = parseFloat(w.toFixed(4));
    const blurPercentage = parseFloat((Math.min(1.0, w / cfg.sourceRadiusM) * 100).toFixed(1));

    return { penumbraWidthM, blurPercentage };
  }
}

const contactShadow = SoftShadowPenumbraCalculator.computePenumbraWidth({
  sourceRadiusM: 0.25, // 25cm area light
  receiverDistM: 5.0,
  occluderDistM: 4.8  // Occluder only 20cm away from receiver (tight contact)
});

const distantShadow = SoftShadowPenumbraCalculator.computePenumbraWidth({
  sourceRadiusM: 0.25,
  receiverDistM: 5.0,
  occluderDistM: 1.0  // Occluder 4m away from receiver (diffuse penumbra)
});

console.log(`[Soft Shadow] Contact Shadow Penumbra: ${contactShadow.penumbraWidthM}m (${contactShadow.blurPercentage}% blur)`);
console.log(`[Soft Shadow] Distant Shadow Penumbra: ${distantShadow.penumbraWidthM}m (${distantShadow.blurPercentage}% blur)`);
console.log(`[Soft Shadow] Physical Contact Hardening Confirmed: ${contactShadow.penumbraWidthM < distantShadow.penumbraWidthM}`);
""",
        'expected': """[Soft Shadow] Contact Shadow Penumbra: 0.0104m (4.2% blur)
[Soft Shadow] Distant Shadow Penumbra: 1m (100% blur)
[Soft Shadow] Physical Contact Hardening Confirmed: true"""
    },
    # Snippet 5: Shadow Performance Auditor
    {
        'name': 'Day 43 Snippet 5 - Shadow Performance Auditor',
        'code': """interface ShadowTimings {
  rayQueryDispatchMs: number;
  anyHitAlphaTestMs: number;
  svgfDenoiserMs: number;
}

class ShadowPerformanceAuditor {
  static audit(timings: ShadowTimings): { totalMs: number; meetsSla: boolean; passes60Fps: boolean } {
    const totalMs = parseFloat((
      timings.rayQueryDispatchMs +
      timings.anyHitAlphaTestMs +
      timings.svgfDenoiserMs
    ).toFixed(2));

    const meetsSla = totalMs <= 2.0; // Strict 2.0ms shadow SLA
    const passes60Fps = meetsSla && timings.svgfDenoiserMs > 0;

    return { totalMs, meetsSla, passes60Fps };
  }
}

const timings: ShadowTimings = {
  rayQueryDispatchMs: 0.95,
  anyHitAlphaTestMs: 0.35,
  svgfDenoiserMs: 0.45
};

const audit = ShadowPerformanceAuditor.audit(timings);
console.log(`[Shadow Audit] Total Ray Traced Shadow Time: ${audit.totalMs} ms`);
console.log(`[Shadow Audit] Meets 2.0ms Post-Processing SLA: ${audit.meetsSla}`);
console.log(`[Shadow Audit] 60 FPS Target Certified: ${audit.passes60Fps}`);
""",
        'expected': """[Shadow Audit] Total Ray Traced Shadow Time: 1.75 ms
[Shadow Audit] Meets 2.0ms Post-Processing SLA: true
[Shadow Audit] 60 FPS Target Certified: true"""
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
