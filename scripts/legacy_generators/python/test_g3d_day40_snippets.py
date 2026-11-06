import subprocess
import sys

snippets = [
    # Snippet 1: Post-Processing Render Graph Dependency Resolver
    {
        'name': 'Day 40 Snippet 1 - Post-Processing Render Graph',
        'code': """interface RenderPassNode {
  name: string;
  reads: string[];
  writes: string[];
}

class PostProcessingRenderGraph {
  private passes: RenderPassNode[] = [];

  addPass(pass: RenderPassNode): void {
    this.passes.push(pass);
  }

  resolveExecutionOrder(): string[] {
    // Topological sort based on read/write resource dependencies
    const order: string[] = [];
    const producedResources = new Set<string>(['SceneHDR', 'GBufferDepth', 'GBufferNormals', 'VelocityBuffer']);

    const remaining = [...this.passes];
    while (remaining.length > 0) {
      const readyIndex = remaining.findIndex(p => p.reads.every(r => producedResources.has(r)));
      if (readyIndex === -1) {
        throw new Error('Cyclic or unsatisfied dependency in render graph!');
      }
      const [nextPass] = remaining.splice(readyIndex, 1);
      order.push(nextPass.name);
      nextPass.writes.forEach(w => producedResources.add(w));
    }
    return order;
  }
}

const graph = new PostProcessingRenderGraph();
graph.addPass({ name: 'TAA_Reprojection', reads: ['SceneHDR', 'VelocityBuffer', 'GBufferDepth'], writes: ['ResolvedSceneHDR'] });
graph.addPass({ name: 'SSR_HiZ_Traversal', reads: ['ResolvedSceneHDR', 'GBufferDepth', 'GBufferNormals'], writes: ['SSR_CompositeHDR'] });
graph.addPass({ name: 'Volumetric_Froxel_Fog', reads: ['SSR_CompositeHDR', 'GBufferDepth'], writes: ['AtmosphericHDR'] });
graph.addPass({ name: 'Depth_Of_Field', reads: ['AtmosphericHDR', 'GBufferDepth'], writes: ['DoF_HDR'] });
graph.addPass({ name: 'Dual_Filter_Bloom', reads: ['DoF_HDR'], writes: ['BloomAccumulator'] });
graph.addPass({ name: 'ACES_Tone_Mapping', reads: ['DoF_HDR', 'BloomAccumulator'], writes: ['FinalDisplayLDR'] });

const executionSchedule = graph.resolveExecutionOrder();
console.log(`[Render Graph] Total Passes Scheduled: ${executionSchedule.length}`);
console.log(`[Render Graph] Initial Pass: ${executionSchedule[0]}`);
console.log(`[Render Graph] Mid-Pipeline Pass: ${executionSchedule[3]}`);
console.log(`[Render Graph] Final Display Pass: ${executionSchedule[5]}`);
""",
        'expected': """[Render Graph] Total Passes Scheduled: 6
[Render Graph] Initial Pass: TAA_Reprojection
[Render Graph] Mid-Pipeline Pass: Depth_Of_Field
[Render Graph] Final Display Pass: ACES_Tone_Mapping"""
    },
    # Snippet 2: ACES Filmic Tone Mapper & sRGB Gamma Curve
    {
        'name': 'Day 40 Snippet 2 - ACES Filmic Tone Mapper',
        'code': """class ACESFilmicToneMapper {
  static mapTone(hdrColor: [number, number, number]): [number, number, number] {
    // ACES Narkowicz 2015 fit: f(x) = (x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14)
    const mapChannel = (x: number): number => {
      const a = 2.51, b = 0.03, c = 2.43, d = 0.59, e = 0.14;
      const clamped = Math.max(0, x);
      const mapped = (clamped * (a * clamped + b)) / (clamped * (c * clamped + d) + e);
      // Clamp to [0, 1] and apply sRGB gamma correction (approx 1 / 2.2)
      const ldr = Math.min(1.0, Math.max(0.0, mapped));
      const srgb = Math.pow(ldr, 1.0 / 2.2);
      return parseFloat(srgb.toFixed(4));
    };

    return [mapChannel(hdrColor[0]), mapChannel(hdrColor[1]), mapChannel(hdrColor[2])];
  }
}

const shadowLDR = ACESFilmicToneMapper.mapTone([0.05, 0.05, 0.05]);
const midtoneLDR = ACESFilmicToneMapper.mapTone([1.0, 1.0, 1.0]);
const highlightLDR = ACESFilmicToneMapper.mapTone([10.0, 10.0, 10.0]);

console.log(`[ACES Tonemap] Shadow Input (0.05 HDR) -> Display: ${shadowLDR[0]}`);
console.log(`[ACES Tonemap] Midtone Input (1.00 HDR) -> Display: ${midtoneLDR[0]}`);
console.log(`[ACES Tonemap] Intense Highlight (10.0 HDR) -> Display: ${highlightLDR[0]}`);
""",
        'expected': """[ACES Tonemap] Shadow Input (0.05 HDR) -> Display: 0.2425
[ACES Tonemap] Midtone Input (1.00 HDR) -> Display: 0.9055
[ACES Tonemap] Intense Highlight (10.0 HDR) -> Display: 1"""
    },
    # Snippet 3: Dual-Filter Bloom Pyramid Allocator
    {
        'name': 'Day 40 Snippet 3 - Dual-Filter Bloom Pyramid Allocator',
        'code': """interface BloomMip {
  level: number;
  width: number;
  height: number;
  vramKb: number; // RGBA16F = 8 bytes per pixel
}

class DualFilterBloomPyramid {
  static generatePyramid(baseWidth: number, baseHeight: number, levels: number): BloomMip[] {
    const mips: BloomMip[] = [];
    let w = Math.floor(baseWidth / 2);
    let h = Math.floor(baseHeight / 2);

    for (let i = 0; i < levels; i++) {
      const vramBytes = w * h * 8;
      const vramKb = parseFloat((vramBytes / 1024).toFixed(1));
      mips.push({ level: i + 1, width: w, height: h, vramKb });
      w = Math.max(1, Math.floor(w / 2));
      h = Math.max(1, Math.floor(h / 2));
    }
    return mips;
  }
}

const pyramid = DualFilterBloomPyramid.generatePyramid(1920, 1080, 5);
const totalVramKb = pyramid.reduce((acc, m) => acc + m.vramKb, 0);

console.log(`[Bloom Pyramid] Levels Allocated: ${pyramid.length}`);
console.log(`[Bloom Pyramid] Level 1 (Half Res): ${pyramid[0].width}x${pyramid[0].height} (${pyramid[0].vramKb} KB)`);
console.log(`[Bloom Pyramid] Level 5 (1/32 Res): ${pyramid[4].width}x${pyramid[4].height} (${pyramid[4].vramKb} KB)`);
console.log(`[Bloom Pyramid] Total Pyramid VRAM: ${(totalVramKb / 1024).toFixed(2)} MB`);
""",
        'expected': """[Bloom Pyramid] Levels Allocated: 5
[Bloom Pyramid] Level 1 (Half Res): 960x540 (4050 KB)
[Bloom Pyramid] Level 5 (1/32 Res): 60x33 (15.5 KB)
[Bloom Pyramid] Total Pyramid VRAM: 5.27 MB"""
    },
    # Snippet 4: Post-Processing Frame Budget Validator
    {
        'name': 'Day 40 Snippet 4 - Post-Processing Frame Budget Validator',
        'code': """interface PassExecutionTimings {
  taaMs: number;
  ssrMs: number;
  volumetricMs: number;
  dofMs: number;
  bloomMs: number;
  toneMappingMs: number;
}

class PostProcessingFrameBudgetValidator {
  static validate(timings: PassExecutionTimings, maxBudgetMs: number = 6.0): {
    totalMs: number;
    remainingHeadroomMs: number;
    meets60FpsSLA: boolean;
  } {
    const totalMs = parseFloat((
      timings.taaMs +
      timings.ssrMs +
      timings.volumetricMs +
      timings.dofMs +
      timings.bloomMs +
      timings.toneMappingMs
    ).toFixed(2));

    const remainingHeadroomMs = parseFloat((maxBudgetMs - totalMs).toFixed(2));
    const meets60FpsSLA = totalMs <= maxBudgetMs;

    return { totalMs, remainingHeadroomMs, meets60FpsSLA };
  }
}

const timings: PassExecutionTimings = {
  taaMs: 0.85,
  ssrMs: 1.45,
  volumetricMs: 1.15,
  dofMs: 1.20,
  bloomMs: 0.42,
  toneMappingMs: 0.28
};

const result = PostProcessingFrameBudgetValidator.validate(timings, 6.0);
console.log(`[Frame Budget] Total Post-Processing Execution: ${result.totalMs} ms`);
console.log(`[Frame Budget] Remaining 6.0ms SLA Headroom: ${result.remainingHeadroomMs} ms`);
console.log(`[Frame Budget] 60 FPS Target Certified: ${result.meets60FpsSLA}`);
""",
        'expected': """[Frame Budget] Total Post-Processing Execution: 5.35 ms
[Frame Budget] Remaining 6.0ms SLA Headroom: 0.65 ms
[Frame Budget] 60 FPS Target Certified: true"""
    },
    # Snippet 5: 5-Gate Post-Processing Defense Matrix Auditor
    {
        'name': 'Day 40 Snippet 5 - 5-Gate Defense Matrix Auditor',
        'code': """interface DefenseGateResult {
  gateNumber: number;
  gateName: string;
  metric: string;
  value: number;
  threshold: number;
  passed: boolean;
}

class FiveGateDefenseMatrixAuditor {
  static auditGates(results: DefenseGateResult[]): {
    allGatesPassed: boolean;
    passCount: number;
    auditLog: string[];
  } {
    const passCount = results.filter(g => g.passed).length;
    const allGatesPassed = passCount === results.length;
    const auditLog = results.map(g =>
      `Gate ${g.gateNumber} [${g.gateName}]: ${g.passed ? 'PASSED' : 'FAILED'} (${g.metric}: ${g.value} <= ${g.threshold})`
    );
    return { allGatesPassed, passCount, auditLog };
  }
}

const gates: DefenseGateResult[] = [
  { gateNumber: 1, gateName: 'TAA_Variance_Clamping', metric: 'GhostingErrorPx', value: 0.12, threshold: 0.50, passed: true },
  { gateNumber: 2, gateName: 'SSR_HiZ_Depth_Precision', metric: 'FalseHitRatePct', value: 0.4, threshold: 1.0, passed: true },
  { gateNumber: 3, gateName: 'Froxel_Bilateral_Filter', metric: 'EdgeBleedPixels', value: 0, threshold: 0, passed: true },
  { gateNumber: 4, gateName: 'DoF_Energy_Conservation', metric: 'EnergyVariancePct', value: 0.85, threshold: 2.0, passed: true },
  { gateNumber: 5, gateName: 'ACES_Color_Gamut_Safety', metric: 'NanOrInfPixelCount', value: 0, threshold: 0, passed: true }
];

const audit = FiveGateDefenseMatrixAuditor.auditGates(gates);
console.log(`[Defense Matrix] Audit Status: ${audit.allGatesPassed ? '100% CERTIFIED' : 'FAILED'}`);
console.log(`[Defense Matrix] Total Gates Verified: ${audit.passCount} / ${gates.length}`);
console.log(`[Defense Matrix] ${audit.auditLog[0]}`);
console.log(`[Defense Matrix] ${audit.auditLog[4]}`);
""",
        'expected': """[Defense Matrix] Audit Status: 100% CERTIFIED
[Defense Matrix] Total Gates Verified: 5 / 5
[Defense Matrix] Gate 1 [TAA_Variance_Clamping]: PASSED (GhostingErrorPx: 0.12 <= 0.5)
[Defense Matrix] Gate 5 [ACES_Color_Gamut_Safety]: PASSED (NanOrInfPixelCount: 0 <= 0)"""
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
