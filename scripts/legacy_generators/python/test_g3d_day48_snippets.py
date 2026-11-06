import subprocess
import os

c1 = """interface AnisotropicResult {
  alphaX: number;
  alphaY: number;
  anisotropyFactor: number;
}

class AnisotropicGgxCalculator {
  // Roughness mapping: alpha_x = roughness^2 * (1 + anisotropy), alpha_y = roughness^2 * (1 - anisotropy)
  static computeAlphas(roughness: number, anisotropy: number): AnisotropicResult {
    const r2 = roughness * roughness;
    const ax = Math.max(0.001, r2 * (1.0 + anisotropy));
    const ay = Math.max(0.001, r2 * (1.0 - anisotropy));

    return {
      alphaX: parseFloat(ax.toFixed(4)),
      alphaY: parseFloat(ay.toFixed(4)),
      anisotropyFactor: anisotropy
    };
  }
}

const brushedMetal = AnisotropicGgxCalculator.computeAlphas(0.4, 0.7); // Strongly brushed aluminum
console.log(`[Anisotropic GGX] Alpha X (Tangential Roughness): ${brushedMetal.alphaX}`);
console.log(`[Anisotropic GGX] Alpha Y (Bitangential Roughness): ${brushedMetal.alphaY}`);
console.log(`[Anisotropic GGX] Anisotropic Elongation Ratio: ${parseFloat((brushedMetal.alphaX / brushedMetal.alphaY).toFixed(2))}`);"""

c2 = """interface KajiyaKayResult {
  specularIntensity: number;
  sinTdotL: number;
  sinTdotV: number;
}

class KajiyaKayHairModel {
  // S = (T.L * T.V + sin(T,L) * sin(T,V))^exponent
  static evaluateSpecular(tangentDotL: number, tangentDotV: number, exponent: number): KajiyaKayResult {
    const sinTL = Math.sqrt(Math.max(0.0, 1.0 - tangentDotL * tangentDotL));
    const sinTV = Math.sqrt(Math.max(0.0, 1.0 - tangentDotV * tangentDotV));
    const cosDiff = tangentDotL * tangentDotV + sinTL * sinTV;
    const spec = Math.pow(Math.max(0.0, cosDiff), exponent);

    return {
      specularIntensity: parseFloat(spec.toFixed(4)),
      sinTdotL: parseFloat(sinTL.toFixed(4)),
      sinTdotV: parseFloat(sinTV.toFixed(4))
    };
  }
}

const highlightPeak = KajiyaKayHairModel.evaluateSpecular(0.2, 0.2, 32.0); // Aligned on reflection cone
const highlightOff = KajiyaKayHairModel.evaluateSpecular(0.2, -0.6, 32.0);

console.log(`[Kajiya-Kay] Highlight Peak Intensity: ${highlightPeak.specularIntensity}`);
console.log(`[Kajiya-Kay] Off-Cone Intensity: ${highlightOff.specularIntensity}`);
console.log(`[Kajiya-Kay] Specular Highlight Cone Formation Confirmed: ${highlightPeak.specularIntensity > highlightOff.specularIntensity}`);"""

c3 = """interface MarschnerLobes {
  primaryReflectanceR: number;    // Primary reflection from outer cuticle
  transmissionTT: number;         // Forward transmission through fiber
  secondaryReflectanceTRT: number;// Internal bounce colored highlight
}

class MarschnerHairModel {
  // Cuticle scale tilt alpha tilts the primary reflection toward the root by ~2-3 degrees
  static evaluateLobes(longitudinalShiftDeg: number, cuticleTiltDeg: number): MarschnerLobes {
    const thetaR = longitudinalShiftDeg - 2.0 * cuticleTiltDeg;
    const thetaTRT = longitudinalShiftDeg + 4.0 * cuticleTiltDeg;

    const r = Math.exp(-Math.pow(thetaR / 5.0, 2.0));
    const tt = Math.exp(-Math.pow(longitudinalShiftDeg / 10.0, 2.0)) * 0.6;
    const trt = Math.exp(-Math.pow(thetaTRT / 7.0, 2.0)) * 0.35;

    return {
      primaryReflectanceR: parseFloat(r.toFixed(4)),
      transmissionTT: parseFloat(tt.toFixed(4)),
      secondaryReflectanceTRT: parseFloat(trt.toFixed(4))
    };
  }
}

const lobes = MarschnerHairModel.evaluateLobes(5.0, 2.5); // 5 degree shift, 2.5 degree cuticle tilt
console.log(`[Marschner Slices] R Lobe (White Specular): ${lobes.primaryReflectanceR}`);
console.log(`[Marschner Slices] TT Lobe (Backlit Glow): ${lobes.transmissionTT}`);
console.log(`[Marschner Slices] TRT Lobe (Colored Glint): ${lobes.secondaryReflectanceTRT}`);"""

c4 = """interface HairPigmentation {
  eumelanin: number;   // Brown/black pigment [0, 1]
  pheomelanin: number; // Red/blonde pigment [0, 1]
}

class MelaninHairAbsorber {
  static computeFiberAlbedo(pigment: HairPigmentation): { albedoRed: number; albedoGreen: number; albedoBlue: number } {
    // Eumelanin absorbs strongly across all channels; pheomelanin preserves red
    const aR = Math.exp(-(0.4 * pigment.eumelanin + 0.05 * pigment.pheomelanin));
    const aG = Math.exp(-(0.8 * pigment.eumelanin + 0.35 * pigment.pheomelanin));
    const aB = Math.exp(-(1.4 * pigment.eumelanin + 0.95 * pigment.pheomelanin));

    return {
      albedoRed: parseFloat(aR.toFixed(3)),
      albedoGreen: parseFloat(aG.toFixed(3)),
      albedoBlue: parseFloat(aB.toFixed(3))
    };
  }
}

const chestnutBrown = MelaninHairAbsorber.computeFiberAlbedo({ eumelanin: 0.5, pheomelanin: 0.3 });
console.log(`[Hair Melanin] Chestnut Brown Red Albedo: ${chestnutBrown.albedoRed}`);
console.log(`[Hair Melanin] Chestnut Brown Green Albedo: ${chestnutBrown.albedoGreen}`);
console.log(`[Hair Melanin] Chestnut Brown Blue Albedo: ${chestnutBrown.albedoBlue}`);
console.log(`[Hair Melanin] Realistic Warm Hair Tint Confirmed: ${chestnutBrown.albedoRed > chestnutBrown.albedoBlue}`);"""

c5 = """interface HairPassTimings {
  hairInterpolationMs: number;
  anisotropicShadingMs: number;
  deepShadowFilteringMs: number;
}

class HairPerformanceAuditor {
  static audit(timings: HairPassTimings): { totalMs: number; meetsSla: boolean } {
    const totalMs = parseFloat((
      timings.hairInterpolationMs +
      timings.anisotropicShadingMs +
      timings.deepShadowFilteringMs
    ).toFixed(2));

    const meetsSla = totalMs <= 2.0; // Strict 2.0ms Hair SLA
    return { totalMs, meetsSla };
  }
}

const timings: HairPassTimings = {
  hairInterpolationMs: 0.65,
  anisotropicShadingMs: 0.85,
  deepShadowFilteringMs: 0.42
};

const audit = HairPerformanceAuditor.audit(timings);
console.log(`[Hair Audit] Total Hair Subsystem Execution Time: ${audit.totalMs} ms`);
console.log(`[Hair Audit] Meets 2.0ms Hair Budget SLA: ${audit.meetsSla}`);
console.log(`[Hair Audit] 60 FPS Target Certified: ${audit.meetsSla}`);"""

snippets = [c1, c2, c3, c4, c5]

for i, code in enumerate(snippets, 1):
    tmp_file = f"scripts/tmp_day48_snippet_{i}.ts"
    with open(tmp_file, "w", encoding="utf-8") as f:
        f.write(code)
    res = subprocess.run(["npx", "tsx", tmp_file], capture_output=True, text=True, shell=True)
    if res.returncode != 0:
        print(f"Snippet {i} FAILED: {res.stderr}")
    else:
        print(f"Snippet {i} PASSED. Output:\n{res.stdout.strip()}")
    if os.path.exists(tmp_file):
        os.remove(tmp_file)
