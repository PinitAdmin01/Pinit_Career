import subprocess
import sys

snippets = [
    # Snippet 1: Circle of Confusion Calculator
    {
        'name': 'Day 39 Snippet 1 - Circle of Confusion Calculator',
        'code': """interface CameraLensConfig {
  focalLengthMm: number;    // e.g. 50mm
  fStop: number;            // e.g. 1.8
  focusDistanceM: number;   // e.g. 2.5m
  sensorHeightMm: number;   // e.g. 24mm (Full Frame 35mm format)
  screenHeightPx: number;   // e.g. 1080px
}

class CircleOfConfusionCalculator {
  static evaluateCoCPixels(cfg: CameraLensConfig, objectDistanceM: number): number {
    const f = cfg.focalLengthMm / 1000.0; // convert to meters
    const P = cfg.focusDistanceM;
    const D = objectDistanceM;
    const A = f / cfg.fStop; // aperture diameter in meters

    if (D <= 0 || P <= f) return 0.0;

    // Thin lens formula: c = |D - P| / D * (f^2 / (fStop * (P - f)))
    const cocMeters = (Math.abs(D - P) / D) * ((f * f) / (cfg.fStop * (P - f)));
    const pixelsPerMeter = cfg.screenHeightPx / (cfg.sensorHeightMm / 1000.0);
    const cocPixels = cocMeters * pixelsPerMeter;

    return parseFloat(cocPixels.toFixed(2));
  }
}

const config: CameraLensConfig = {
  focalLengthMm: 50,
  fStop: 1.8,
  focusDistanceM: 2.5,
  sensorHeightMm: 24,
  screenHeightPx: 1080
};

const fgCoC = CircleOfConfusionCalculator.evaluateCoCPixels(config, 1.2);
const focusCoC = CircleOfConfusionCalculator.evaluateCoCPixels(config, 2.5);
const bgCoC = CircleOfConfusionCalculator.evaluateCoCPixels(config, 8.0);

console.log(`[Circle of Confusion] Lens: ${config.focalLengthMm}mm f/${config.fStop}, Focus: ${config.focusDistanceM}m`);
console.log(`[Circle of Confusion] Foreground (1.2m) CoC: ${fgCoC} px`);
console.log(`[Circle of Confusion] In-Focus Plane (2.5m) CoC: ${focusCoC} px`);
console.log(`[Circle of Confusion] Background (8.0m) CoC: ${bgCoC} px`);
""",
        'expected': """[Circle of Confusion] Lens: 50mm f/1.8, Focus: 2.5m
[Circle of Confusion] Foreground (1.2m) CoC: 27.64 px
[Circle of Confusion] In-Focus Plane (2.5m) CoC: 0 px
[Circle of Confusion] Background (8.0m) CoC: 17.54 px"""
    },
    # Snippet 2: Tile-Max CoC Separator
    {
        'name': 'Day 39 Snippet 2 - Tile-Max CoC Separator',
        'code': """interface TileCoCEvaluation {
  maxNearCoC: number;
  maxFarCoC: number;
  requiresBlurPass: boolean;
}

class TileMaxCoCSeparator {
  static evaluateTile(pixelCoCs: number[], tileSize: number): TileCoCEvaluation {
    let maxNear = 0;
    let maxFar = 0;

    for (const coc of pixelCoCs) {
      if (coc < 0) {
        maxNear = Math.max(maxNear, Math.abs(coc));
      } else {
        maxFar = Math.max(maxFar, coc);
      }
    }

    const requiresBlurPass = (maxNear > 0.5) || (maxFar > 0.5);
    return {
      maxNearCoC: parseFloat(maxNear.toFixed(1)),
      maxFarCoC: parseFloat(maxFar.toFixed(1)),
      requiresBlurPass
    };
  }
}

// Simulated 4x4 tile near focal boundary: negative = near field, positive = far field
const tilePixels = [
  -12.4, -14.2, -8.1, 0.0,
  -10.5, -5.2, 0.0, 4.3,
  -2.1, 0.0, 8.2, 16.5,
  0.0, 6.4, 15.1, 24.8
];

const tileResult = TileMaxCoCSeparator.evaluateTile(tilePixels, 4);
console.log(`[Tile-Max CoC] Max Near Field CoC: ${tileResult.maxNearCoC} px`);
console.log(`[Tile-Max CoC] Max Far Field CoC: ${tileResult.maxFarCoC} px`);
console.log(`[Tile-Max CoC] Requires Compute Blur Dispatch: ${tileResult.requiresBlurPass}`);
""",
        'expected': """[Tile-Max CoC] Max Near Field CoC: 14.2 px
[Tile-Max CoC] Max Far Field CoC: 24.8 px
[Tile-Max CoC] Requires Compute Blur Dispatch: true"""
    },
    # Snippet 3: Bokeh Poisson Disk Sampler
    {
        'name': 'Day 39 Snippet 3 - Bokeh Poisson Disk Sampler',
        'code': """interface DiskSample {
  u: number;
  v: number;
  weight: number;
}

class BokehDiskKernel {
  static generateSpiralDisk(sampleCount: number, maxRadius: number): DiskSample[] {
    const samples: DiskSample[] = [];
    const goldenAngle = Math.PI * (3.0 - Math.sqrt(5.0)); // ~2.3999 rad

    for (let i = 0; i < sampleCount; i++) {
      const theta = i * goldenAngle;
      const r = Math.sqrt((i + 0.5) / sampleCount) * maxRadius;
      const u = parseFloat((r * Math.cos(theta)).toFixed(3));
      const v = parseFloat((r * Math.sin(theta)).toFixed(3));
      const weight = parseFloat((1.0 / sampleCount).toFixed(4));
      samples.push({ u, v, weight });
    }
    return samples;
  }
}

const kernel = BokehDiskKernel.generateSpiralDisk(8, 12.0);
console.log(`[Bokeh Disk Kernel] Generated Samples: ${kernel.length}`);
console.log(`[Bokeh Disk Kernel] Sample 0 Offset: (${kernel[0].u}, ${kernel[0].v})`);
console.log(`[Bokeh Disk Kernel] Sample 4 Offset: (${kernel[4].u}, ${kernel[4].v})`);
console.log(`[Bokeh Disk Kernel] Normalized Uniform Weight: ${kernel[0].weight}`);
""",
        'expected': """[Bokeh Disk Kernel] Generated Samples: 8
[Bokeh Disk Kernel] Sample 0 Offset: (3, 0)
[Bokeh Disk Kernel] Sample 4 Offset: (-8.862, -1.568)
[Bokeh Disk Kernel] Normalized Uniform Weight: 0.125"""
    },
    # Snippet 4: Specular Bokeh Sprite Compactor
    {
        'name': 'Day 39 Snippet 4 - Specular Bokeh Sprite Compactor',
        'code': """interface PixelCandidate {
  x: number;
  y: number;
  hdrLuminance: number;
  cocRadius: number;
}

interface BokehSprite {
  posX: number;
  posY: number;
  radius: number;
  energyScale: number;
}

class BokehSpriteCompactor {
  static compactCandidates(candidates: PixelCandidate[], threshold: number): BokehSprite[] {
    const sprites: BokehSprite[] = [];

    for (const c of candidates) {
      // Must be intensely bright and significantly blurred to warrant a dedicated sprite
      if (c.hdrLuminance > threshold && c.cocRadius >= 8.0) {
        sprites.push({
          posX: c.x,
          posY: c.y,
          radius: c.cocRadius,
          energyScale: parseFloat((c.hdrLuminance / threshold).toFixed(2))
        });
      }
    }
    return sprites;
  }
}

const candidates: PixelCandidate[] = [
  { x: 120, y: 340, hdrLuminance: 4.8, cocRadius: 18.0 },
  { x: 450, y: 210, hdrLuminance: 0.8, cocRadius: 12.0 }, // Below brightness threshold
  { x: 800, y: 600, hdrLuminance: 7.2, cocRadius: 2.0 },  // CoC too small
  { x: 920, y: 150, hdrLuminance: 12.5, cocRadius: 24.5 }
];

const sprites = BokehSpriteCompactor.compactCandidates(candidates, 3.0);
console.log(`[Bokeh Compaction] Total Candidates Audited: ${candidates.length}`);
console.log(`[Bokeh Compaction] Compacted Specular Sprites: ${sprites.length}`);
console.log(`[Bokeh Compaction] Sprite 0: Pos(${sprites[0].posX}, ${sprites[0].posY}), Radius: ${sprites[0].radius}px, Energy: ${sprites[0].energyScale}x`);
console.log(`[Bokeh Compaction] Sprite 1: Pos(${sprites[1].posX}, ${sprites[1].posY}), Radius: ${sprites[1].radius}px, Energy: ${sprites[1].energyScale}x`);
""",
        'expected': """[Bokeh Compaction] Total Candidates Audited: 4
[Bokeh Compaction] Compacted Specular Sprites: 2
[Bokeh Compaction] Sprite 0: Pos(120, 340), Radius: 18px, Energy: 1.6x
[Bokeh Compaction] Sprite 1: Pos(920, 150), Radius: 24.5px, Energy: 4.17x"""
    },
    # Snippet 5: DoF Performance Auditor
    {
        'name': 'Day 39 Snippet 5 - DoF Performance Auditor',
        'code': """interface DoFPassTimings {
  cocTileMaxMs: number;
  nearFarBlurMs: number;
  spriteCompactionMs: number;
  bilateralCompositeMs: number;
}

class DoFPerformanceAuditor {
  static auditTimings(timings: DoFPassTimings): { totalMs: number; meetsSLA: boolean; passesQuality: boolean } {
    const totalMs = parseFloat((
      timings.cocTileMaxMs +
      timings.nearFarBlurMs +
      timings.spriteCompactionMs +
      timings.bilateralCompositeMs
    ).toFixed(2));

    const meetsSLA = totalMs <= 2.50; // Strict 2.5ms SLA for 60 FPS
    const passesQuality = meetsSLA && timings.nearFarBlurMs > 0;

    return { totalMs, meetsSLA, passesQuality };
  }
}

const timings: DoFPassTimings = {
  cocTileMaxMs: 0.32,
  nearFarBlurMs: 1.45,
  spriteCompactionMs: 0.18,
  bilateralCompositeMs: 0.35
};

const report = DoFPerformanceAuditor.auditTimings(timings);
console.log(`[DoF Audit] Total Pipeline Execution Time: ${report.totalMs} ms`);
console.log(`[DoF Audit] Meets 2.5ms Post-Processing SLA: ${report.meetsSLA}`);
console.log(`[DoF Audit] Production Quality Certified: ${report.passesQuality}`);
""",
        'expected': """[DoF Audit] Total Pipeline Execution Time: 2.3 ms
[DoF Audit] Meets 2.5ms Post-Processing SLA: true
[DoF Audit] Production Quality Certified: true"""
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
