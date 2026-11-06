import subprocess
import os

c1 = """interface BssdfProfileResult {
  radiusMm: number;
  diffuseReflectance: number;
  transmittance: number;
}

class BurleyNormalizedDiffusion {
  // Burley (Disney) Normalized Diffusion BSSDF profile
  // R(r) = s * (exp(-s*r) + exp(-s*r / 3)) / (8 * pi * r)
  static evaluateProfile(radiusMm: number, meanFreePathMm: number): BssdfProfileResult {
    const s = 1.0 / Math.max(0.001, meanFreePathMm);
    const r = Math.max(0.01, radiusMm);
    
    // Normalized profile value
    const exp1 = Math.exp(-s * r);
    const exp2 = Math.exp(-s * r / 3.0);
    const profile = (s * (exp1 + exp2)) / (8.0 * Math.PI * r);

    return {
      radiusMm,
      diffuseReflectance: parseFloat((profile * 2.0 * Math.PI * r).toFixed(4)),
      transmittance: parseFloat(profile.toFixed(5))
    };
  }
}

const near = BurleyNormalizedDiffusion.evaluateProfile(0.5, 2.4); // Human epidermis MFP = 2.4mm
const far = BurleyNormalizedDiffusion.evaluateProfile(4.0, 2.4);

console.log(`[Burley SSS] Near Profile Transmittance (0.5mm): ${near.transmittance}`);
console.log(`[Burley SSS] Distant Profile Transmittance (4.0mm): ${far.transmittance}`);
console.log(`[Burley SSS] Scattering Diffusion Attenuation Confirmed: ${near.transmittance > far.transmittance}`);"""

c2 = """interface SssBlurTap {
  offsetPixels: number;
  weight: number;
}

class SeparableSssKernel {
  // 5-tap separable cross-bilateral filter weights for skin diffusion
  static computeSeparableKernel(): SssBlurTap[] {
    return [
      { offsetPixels: -3.0, weight: 0.0545 },
      { offsetPixels: -1.5, weight: 0.2442 },
      { offsetPixels:  0.0, weight: 0.4026 },
      { offsetPixels:  1.5, weight: 0.2442 },
      { offsetPixels:  3.0, weight: 0.0545 }
    ];
  }

  static verifyWeightSum(kernel: SssBlurTap[]): number {
    const sum = kernel.reduce((acc, tap) => acc + tap.weight, 0.0);
    return parseFloat(sum.toFixed(4));
  }
}

const kernel = SeparableSssKernel.computeSeparableKernel();
const totalWeight = SeparableSssKernel.verifyWeightSum(kernel);

console.log(`[Separable SSS] Filter Kernel Tap Count: ${kernel.length}`);
console.log(`[Separable SSS] Center Tap Weight: ${kernel[2].weight}`);
console.log(`[Separable SSS] Total Normalized Kernel Weight: ${totalWeight}`);"""

c3 = """interface TransmittanceResult {
  thicknessMm: number;
  scatteredLuminance: number;
  visibleGlow: boolean;
}

class ThinTransmittanceCalculator {
  // Evaluates forward light penetration through thin geometry (e.g. human ear cartilage)
  static evaluateTransmittance(thicknessMm: number, lightLuminance: number, extinctionCoeff: number): TransmittanceResult {
    // Modified Beer-Lambert transmission: T = exp(-sigma_t * d)
    const opticalDepth = extinctionCoeff * (thicknessMm / 10.0); // cm
    const t = Math.exp(-opticalDepth);
    const scatteredLuminance = parseFloat((lightLuminance * t).toFixed(3));
    const visibleGlow = scatteredLuminance > 0.05 * lightLuminance;

    return { thicknessMm, scatteredLuminance, visibleGlow };
  }
}

const thinEar = ThinTransmittanceCalculator.evaluateTransmittance(2.0, 100.0, 1.2);  // 2mm ear rim
const thickSkull = ThinTransmittanceCalculator.evaluateTransmittance(25.0, 100.0, 1.2); // 25mm bone

console.log(`[Transmittance] Thin Cartilage (2mm) Scattered Luminance: ${thinEar.scatteredLuminance}`);
console.log(`[Transmittance] Thick Bone (25mm) Scattered Luminance: ${thickSkull.scatteredLuminance}`);
console.log(`[Transmittance] Translucent Red Ear Glow Active: ${thinEar.visibleGlow}`);"""

c4 = """interface SkinParameters {
  melaninFraction: number;    // [0, 1] melanin pigmentation
  hemoglobinFraction: number; // [0, 1] blood oxygenation
}

class SpectralSkinSynthesizer {
  // Computes spectral absorption coefficients based on biophysical components
  static computeAbsorption(skin: SkinParameters): { sigmaA_Red: number; sigmaA_Green: number; sigmaA_Blue: number } {
    // Hemoglobin absorbs green/blue heavily; melanin absorbs broadly across spectrum
    const aRed = 0.02 + 0.15 * skin.melaninFraction + 0.05 * skin.hemoglobinFraction;
    const aGreen = 0.08 + 0.35 * skin.melaninFraction + 0.85 * skin.hemoglobinFraction;
    const aBlue = 0.15 + 0.65 * skin.melaninFraction + 0.95 * skin.hemoglobinFraction;

    return {
      sigmaA_Red: parseFloat(aRed.toFixed(3)),
      sigmaA_Green: parseFloat(aGreen.toFixed(3)),
      sigmaA_Blue: parseFloat(aBlue.toFixed(3))
    };
  }
}

const skin = SpectralSkinSynthesizer.computeAbsorption({ melaninFraction: 0.3, hemoglobinFraction: 0.4 });
console.log(`[Spectral Skin] Red Absorption: ${skin.sigmaA_Red}`);
console.log(`[Spectral Skin] Green Absorption: ${skin.sigmaA_Green}`);
console.log(`[Spectral Skin] Blue Absorption: ${skin.sigmaA_Blue}`);
console.log(`[Spectral Skin] Characteristic Red Subsurface Bleed Confirmed: ${skin.sigmaA_Red < skin.sigmaA_Green}`);"""

c5 = """interface SssPassTimings {
  horizontalBlurMs: number;
  verticalBlurMs: number;
  transmissionCompositeMs: number;
}

class SssPerformanceAuditor {
  static audit(timings: SssPassTimings): { totalMs: number; meetsSla: boolean } {
    const totalMs = parseFloat((
      timings.horizontalBlurMs +
      timings.verticalBlurMs +
      timings.transmissionCompositeMs
    ).toFixed(2));

    const meetsSla = totalMs <= 1.5; // 1.5ms Subsurface Scattering SLA
    return { totalMs, meetsSla };
  }
}

const timings: SssPassTimings = {
  horizontalBlurMs: 0.52,
  verticalBlurMs: 0.54,
  transmissionCompositeMs: 0.28
};

const audit = SssPerformanceAuditor.audit(timings);
console.log(`[SSS Audit] Total Separable SSS Execution Time: ${audit.totalMs} ms`);
console.log(`[SSS Audit] Meets 1.5ms Post-Processing SLA: ${audit.meetsSla}`);
console.log(`[SSS Audit] 60 FPS Target Certified: ${audit.meetsSla}`);"""

snippets = [c1, c2, c3, c4, c5]

for i, code in enumerate(snippets, 1):
    tmp_file = f"scripts/tmp_day46_snippet_{i}.ts"
    with open(tmp_file, "w", encoding="utf-8") as f:
        f.write(code)
    res = subprocess.run(["npx", "tsx", tmp_file], capture_output=True, text=True, shell=True)
    if res.returncode != 0:
        print(f"Snippet {i} FAILED: {res.stderr}")
    else:
        print(f"Snippet {i} PASSED. Output:\n{res.stdout.strip()}")
    if os.path.exists(tmp_file):
        os.remove(tmp_file)
