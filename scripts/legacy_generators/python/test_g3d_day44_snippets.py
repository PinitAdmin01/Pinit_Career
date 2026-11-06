import subprocess
import os

c1 = """interface MonteCarloResult {
  estimatedIntegral: number;
  sampleCount: number;
  variance: number;
}

class MonteCarloIntegrator {
  // Integrate f(x) = x^2 over [0, 1]. Exact analytical value = 1/3 (0.333333...)
  static estimateXSquared(samples: number[]): MonteCarloResult {
    let sum = 0.0;
    let sumSq = 0.0;
    const n = samples.length;

    for (let i = 0; i < n; i++) {
      const fx = samples[i] * samples[i];
      sum += fx;
      sumSq += fx * fx;
    }

    const mean = sum / n;
    const variance = (sumSq / n - mean * mean) / n;
    return {
      estimatedIntegral: parseFloat(mean.toFixed(6)),
      sampleCount: n,
      variance: parseFloat(variance.toFixed(8))
    };
  }
}

// Low-discrepancy stratified samples over [0, 1]
const stratifiedSamples = [0.05, 0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.95];
const res = MonteCarloIntegrator.estimateXSquared(stratifiedSamples);

console.log(`[Monte Carlo] Sample Count: ${res.sampleCount}`);
console.log(`[Monte Carlo] Estimated Value: ${res.estimatedIntegral} (Analytical: 0.333333)`);
console.log(`[Monte Carlo] Estimator Variance: ${res.variance}`);"""

c2 = """interface Vector3 {
  x: number;
  y: number;
  z: number;
}

class CosineHemisphereSampler {
  // Shirley Concentric Disk Mapping into Cosine Hemisphere
  static sample(u1: number, u2: number): { dir: Vector3; pdf: number } {
    const r = Math.sqrt(u1);
    const theta = 2.0 * Math.PI * u2;
    const x = r * Math.cos(theta);
    const y = r * Math.sin(theta);
    const z = Math.sqrt(Math.max(0.0, 1.0 - u1));

    // PDF of cosine-weighted hemisphere is cos(theta) / pi = z / pi
    const pdf = z / Math.PI;

    return {
      dir: {
        x: parseFloat(x.toFixed(4)),
        y: parseFloat(y.toFixed(4)),
        z: parseFloat(z.toFixed(4))
      },
      pdf: parseFloat(pdf.toFixed(5))
    };
  }
}

const samplePoint = CosineHemisphereSampler.sample(0.25, 0.125);
console.log(`[Cosine Sampler] Direction: [${samplePoint.dir.x}, ${samplePoint.dir.y}, ${samplePoint.dir.z}]`);
console.log(`[Cosine Sampler] Evaluated PDF: ${samplePoint.pdf}`);
console.log(`[Cosine Sampler] Unit Length Norm: ${parseFloat(Math.hypot(samplePoint.dir.x, samplePoint.dir.y, samplePoint.dir.z).toFixed(4))}`);"""

c3 = """interface GGXSample {
  halfVector: [number, number, number];
  pdf: number;
}

class GGXMicrofacetSampler {
  // Sample half-vector H according to Walter GGX distribution
  static sampleHalfVector(u1: number, u2: number, roughness: number): GGXSample {
    const alpha = Math.max(0.001, roughness * roughness);
    const alpha2 = alpha * alpha;

    const phi = 2.0 * Math.PI * u1;
    const cosTheta = Math.sqrt((1.0 - u2) / (1.0 + (alpha2 - 1.0) * u2));
    const sinTheta = Math.sqrt(Math.max(0.0, 1.0 - cosTheta * cosTheta));

    const hx = sinTheta * Math.cos(phi);
    const hy = sinTheta * Math.sin(phi);
    const hz = cosTheta;

    // GGX NDF D(H)
    const denom = cosTheta * cosTheta * (alpha2 - 1.0) + 1.0;
    const d = alpha2 / (Math.PI * denom * denom);
    const pdf = (d * cosTheta);

    return {
      halfVector: [parseFloat(hx.toFixed(4)), parseFloat(hy.toFixed(4)), parseFloat(hz.toFixed(4))],
      pdf: parseFloat(pdf.toFixed(4))
    };
  }
}

const ggxSample = GGXMicrofacetSampler.sampleHalfVector(0.25, 0.5, 0.3);
console.log(`[GGX Sampler] Half-Vector H: [${ggxSample.halfVector.join(', ')}]`);
console.log(`[GGX Sampler] Sampling PDF: ${ggxSample.pdf}`);
console.log(`[GGX Sampler] Specular Lobe Alignment Confirmed: ${ggxSample.halfVector[2] > 0.9}`);"""

c4 = """class MultipleImportanceSampling {
  // Balance Heuristic: w_a = pdf_a / (pdf_a + pdf_b)
  static balanceHeuristic(pdfA: number, pdfB: number): number {
    if (pdfA + pdfB <= 0.0) return 0.0;
    return parseFloat((pdfA / (pdfA + pdfB)).toFixed(4));
  }

  // Power Heuristic (beta = 2): w_a = (pdf_a)^2 / ((pdf_a)^2 + (pdf_b)^2)
  static powerHeuristic(pdfA: number, pdfB: number): number {
    const a2 = pdfA * pdfA;
    const b2 = pdfB * pdfB;
    if (a2 + b2 <= 0.0) return 0.0;
    return parseFloat((a2 / (a2 + b2)).toFixed(4));
  }
}

// Light sampling PDF = 12.0 (small bright light source), BRDF sampling PDF = 2.0
const wLightBalance = MultipleImportanceSampling.balanceHeuristic(12.0, 2.0);
const wLightPower = MultipleImportanceSampling.powerHeuristic(12.0, 2.0);

console.log(`[MIS] Balance Heuristic Light Weight: ${wLightBalance}`);
console.log(`[MIS] Power Heuristic Light Weight: ${wLightPower}`);
console.log(`[MIS] Heuristic Conservation Sum: ${parseFloat((wLightBalance + (2.0 / (12.0 + 2.0))).toFixed(4))}`);"""

c5 = """interface PathVertex {
  depth: number;
  throughput: [number, number, number];
  terminated: boolean;
}

class RussianRoulettePathTracer {
  static evaluateContinuation(vertex: PathVertex, randomUniform: number): PathVertex {
    // Luminance of current path throughput
    const luminance = 0.2126 * vertex.throughput[0] + 0.7152 * vertex.throughput[1] + 0.0722 * vertex.throughput[2];
    
    // Always trace first 2 bounces; afterwards apply survival probability q = min(0.95, luminance)
    if (vertex.depth < 2) {
      return { ...vertex, terminated: false };
    }

    const survivalProb = Math.min(0.95, Math.max(0.05, luminance));
    if (randomUniform > survivalProb) {
      // Path absorbed (terminated)
      return { ...vertex, terminated: true };
    }

    // Unbiased reweighting: divide throughput by survival probability
    const boost = 1.0 / survivalProb;
    const newThroughput: [number, number, number] = [
      parseFloat((vertex.throughput[0] * boost).toFixed(4)),
      parseFloat((vertex.throughput[1] * boost).toFixed(4)),
      parseFloat((vertex.throughput[2] * boost).toFixed(4))
    ];

    return {
      depth: vertex.depth + 1,
      throughput: newThroughput,
      terminated: false
    };
  }
}

const vertexBounce3: PathVertex = {
  depth: 2,
  throughput: [0.4, 0.4, 0.4],
  terminated: false
};

const survived = RussianRoulettePathTracer.evaluateContinuation(vertexBounce3, 0.2);
const killed = RussianRoulettePathTracer.evaluateContinuation(vertexBounce3, 0.85);

console.log(`[Russian Roulette] Survived Bounce 3 Throughput: [${survived.throughput.join(', ')}]`);
console.log(`[Russian Roulette] Survived Status: ${!survived.terminated}`);
console.log(`[Russian Roulette] Low-Energy Path Absorbed: ${killed.terminated}`);"""

snippets = [c1, c2, c3, c4, c5]

for i, code in enumerate(snippets, 1):
    tmp_file = f"scripts/tmp_day44_snippet_{i}.ts"
    with open(tmp_file, "w", encoding="utf-8") as f:
        f.write(code)
    res = subprocess.run(["npx", "tsx", tmp_file], capture_output=True, text=True, shell=True)
    if res.returncode != 0:
        print(f"Snippet {i} FAILED: {res.stderr}")
    else:
        print(f"Snippet {i} PASSED. Output:\n{res.stdout.strip()}")
    if os.path.exists(tmp_file):
        os.remove(tmp_file)
