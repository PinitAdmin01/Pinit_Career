import subprocess
import sys

snippets = [
    # Snippet 1: Halton Sequence Camera Jitter Generator
    {
        'name': 'Day 36 Snippet 1 - Halton Jitter Generator',
        'code': """class HaltonSequenceGenerator {
  static getHalton(index: number, base: number): number {
    let result = 0;
    let f = 1 / base;
    let i = index;
    while (i > 0) {
      result += f * (i % base);
      i = Math.floor(i / base);
      f /= base;
    }
    return result;
  }

  static getJitter(frameIndex: number): [number, number] {
    // Standard TAA Halton(2, 3) mapped to [-0.5, 0.5] pixel offset
    const jx = this.getHalton(frameIndex + 1, 2) - 0.5;
    const jy = this.getHalton(frameIndex + 1, 3) - 0.5;
    return [
      parseFloat(jx.toFixed(4)),
      parseFloat(jy.toFixed(4))
    ];
  }
}

const frames = [0, 1, 2, 3];
frames.forEach(f => {
  const [jx, jy] = HaltonSequenceGenerator.getJitter(f);
  console.log(`[TAA Jitter] Frame ${f}: Sub-pixel offset (${jx}, ${jy})`);
});
""",
        'expected': """[TAA Jitter] Frame 0: Sub-pixel offset (0, -0.1667)
[TAA Jitter] Frame 1: Sub-pixel offset (-0.25, 0.1667)
[TAA Jitter] Frame 2: Sub-pixel offset (0.25, -0.3889)
[TAA Jitter] Frame 3: Sub-pixel offset (-0.375, -0.0556)"""
    },
    # Snippet 2: Velocity Vector Reprojection Calculator
    {
        'name': 'Day 36 Snippet 2 - Velocity Vector Reprojection',
        'code': """interface ScreenCoord {
  u: number;
  v: number;
}

class MotionVectorCalculator {
  static computeVelocity(currentUv: ScreenCoord, prevUv: ScreenCoord): { du: number; dv: number; speed: number } {
    const du = currentUv.u - prevUv.u;
    const dv = currentUv.v - prevUv.v;
    const speed = Math.sqrt(du * du + dv * dv);
    return {
      du: parseFloat(du.toFixed(4)),
      dv: parseFloat(dv.toFixed(4)),
      speed: parseFloat(speed.toFixed(4))
    };
  }
}

const current: ScreenCoord = { u: 0.524, v: 0.481 };
const previous: ScreenCoord = { u: 0.518, v: 0.475 };
const vel = MotionVectorCalculator.computeVelocity(current, previous);

console.log(`[Motion Vector] Current UV: (${current.u}, ${current.v})`);
console.log(`[Motion Vector] Previous UV: (${previous.u}, ${previous.v})`);
console.log(`[Motion Vector] Screen Delta: (du=${vel.du}, dv=${vel.dv}), Speed=${vel.speed}`);
""",
        'expected': """[Motion Vector] Current UV: (0.524, 0.481)
[Motion Vector] Previous UV: (0.518, 0.475)
[Motion Vector] Screen Delta: (du=0.006, dv=0.006), Speed=0.0085"""
    },
    # Snippet 3: Neighborhood Color Clamping
    {
        'name': 'Day 36 Snippet 3 - Color Box Clamping',
        'code': """type RGB = [number, number, number];

class ColorAABBClamper {
  static clampHistory(historyColor: RGB, neighbors: RGB[]): RGB {
    const minC: RGB = [Infinity, Infinity, Infinity];
    const maxC: RGB = [-Infinity, -Infinity, -Infinity];

    for (const c of neighbors) {
      for (let i = 0; i < 3; i++) {
        if (c[i] < minC[i]) minC[i] = c[i];
        if (c[i] > maxC[i]) maxC[i] = c[i];
      }
    }

    return [
      Math.min(Math.max(historyColor[0], minC[0]), maxC[0]),
      Math.min(Math.max(historyColor[1], minC[1]), maxC[1]),
      Math.min(Math.max(historyColor[2], minC[2]), maxC[2])
    ];
  }
}

const currentNeighbors: RGB[] = [
  [0.8, 0.2, 0.1],
  [0.85, 0.22, 0.12],
  [0.79, 0.18, 0.09]
];
const ghostHistory: RGB = [0.1, 0.9, 0.8]; // Stale color from previous disoccluded object
const clamped = ColorAABBClamper.clampHistory(ghostHistory, currentNeighbors);

console.log(`[Color Box] Stale History: [${ghostHistory.join(", ")}]`);
console.log(`[Color Box] Clamped History: [${clamped.join(", ")}]`);
""",
        'expected': """[Color Box] Stale History: [0.1, 0.9, 0.8]
[Color Box] Clamped History: [0.79, 0.22, 0.12]"""
    },
    # Snippet 4: Exponential Moving Average (EMA) History Blender
    {
        'name': 'Day 36 Snippet 4 - EMA History Blender',
        'code': """type RGB = [number, number, number];

class TemporalBlender {
  static blend(currentColor: RGB, historyColor: RGB, alpha: number): RGB {
    return [
      parseFloat((currentColor[0] * alpha + historyColor[0] * (1 - alpha)).toFixed(4)),
      parseFloat((currentColor[1] * alpha + historyColor[1] * (1 - alpha)).toFixed(4)),
      parseFloat((currentColor[2] * alpha + historyColor[2] * (1 - alpha)).toFixed(4))
    ];
  }
}

const current: RGB = [0.9, 0.4, 0.2];
const history: RGB = [0.85, 0.38, 0.19];
const alpha = 0.1; // 10% new sample, 90% temporal accumulation

const blended = TemporalBlender.blend(current, history, alpha);
console.log(`[Temporal Blend] Current Sample: [${current.join(", ")}]`);
console.log(`[Temporal Blend] Accumulated History: [${history.join(", ")}]`);
console.log(`[Temporal Blend] Blended Result (alpha=${alpha}): [${blended.join(", ")}]`);
""",
        'expected': """[Temporal Blend] Current Sample: [0.9, 0.4, 0.2]
[Temporal Blend] Accumulated History: [0.85, 0.38, 0.19]
[Temporal Blend] Blended Result (alpha=0.1): [0.855, 0.382, 0.191]"""
    },
    # Snippet 5: TAA Frame Quality & Ghosting Auditor
    {
        'name': 'Day 36 Snippet 5 - TAA Quality Auditor',
        'code': """interface TAAQualityMetrics {
  edgeVarianceBefore: number;
  edgeVarianceAfter: number;
  ghostingPixelsDetected: number;
}

class TAAQualityAuditor {
  static audit(metrics: TAAQualityMetrics): { aliasingReductionPct: number; ghostingFree: boolean } {
    const aliasingReductionPct = Math.round(
      ((metrics.edgeVarianceBefore - metrics.edgeVarianceAfter) / metrics.edgeVarianceBefore) * 100
    );
    const ghostingFree = metrics.ghostingPixelsDetected === 0;
    return { aliasingReductionPct, ghostingFree };
  }
}

const metrics: TAAQualityMetrics = {
  edgeVarianceBefore: 0.45,
  edgeVarianceAfter: 0.08,
  ghostingPixelsDetected: 0
};

const result = TAAQualityAuditor.audit(metrics);
console.log(`[TAA Audit] Aliasing Edge Variance Reduction: ${result.aliasingReductionPct}%`);
console.log(`[TAA Audit] Ghosting Artifacts Eliminated: ${result.ghostingFree}`);
""",
        'expected': """[TAA Audit] Aliasing Edge Variance Reduction: 82%
[TAA Audit] Ghosting Artifacts Eliminated: true"""
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
