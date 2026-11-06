import subprocess
import os

c1 = """interface AtmosphereTransmittance {
  rayLengthKm: number;
  transmittanceRed: number;
  transmittanceBlue: number;
}

class RayleighAtmosphereCalculator {
  // Rayleigh scattering coefficients: beta_R is proportional to 1 / lambda^4
  // Red (680nm) = 0.0058 / km, Blue (440nm) = 0.0331 / km
  static computeTransmittance(distanceKm: number): AtmosphereTransmittance {
    const tRed = Math.exp(-0.0058 * distanceKm);
    const tBlue = Math.exp(-0.0331 * distanceKm);

    return {
      rayLengthKm: distanceKm,
      transmittanceRed: parseFloat(tRed.toFixed(4)),
      transmittanceBlue: parseFloat(tBlue.toFixed(4))
    };
  }
}

const noon = RayleighAtmosphereCalculator.computeTransmittance(10.0);   // Overhead direct sky
const sunset = RayleighAtmosphereCalculator.computeTransmittance(80.0); // Grazing horizon sunset

console.log(`[Atmosphere] Overhead Sky Blue Transmittance: ${noon.transmittanceBlue}`);
console.log(`[Atmosphere] Sunset Red Transmittance: ${sunset.transmittanceRed}`);
console.log(`[Atmosphere] Sunset Blue Transmittance: ${sunset.transmittanceBlue}`);
console.log(`[Atmosphere] Iconic Sunset Reddening Confirmed: ${sunset.transmittanceRed > sunset.transmittanceBlue * 5.0}`);"""

c2 = """interface CloudDensitySample {
  altitudeKm: number;
  rawPerlinWorley: number;
  erodedDensity: number;
}

class ProceduralCloudDensityGenerator {
  // Erode low-frequency Perlin-Worley shape using high-frequency Worley detail
  static sampleDensity(altitudeKm: number, perlinWorleyShape: number, worleyDetail: number): CloudDensitySample {
    // Cloud height gradient: cloud layer between 1.5km and 4.0km
    const heightNorm = Math.min(1.0, Math.max(0.0, (altitudeKm - 1.5) / 2.5));
    const heightGradient = Math.sin(heightNorm * Math.PI); // Parabolic dome

    const baseCloud = perlinWorleyShape * heightGradient;
    // Remap erosion: erode edges where detail is high
    const eroded = Math.max(0.0, (baseCloud - worleyDetail * 0.35) / (1.0 - 0.35));

    return {
      altitudeKm,
      rawPerlinWorley: parseFloat(baseCloud.toFixed(4)),
      erodedDensity: parseFloat(eroded.toFixed(4))
    };
  }
}

const midCloud = ProceduralCloudDensityGenerator.sampleDensity(2.75, 0.85, 0.25);
const edgeCloud = ProceduralCloudDensityGenerator.sampleDensity(3.8, 0.45, 0.65);

console.log(`[Cloud Modeling] Mid-Cloud Core Density: ${midCloud.erodedDensity}`);
console.log(`[Cloud Modeling] Cloud Billow Edge Density: ${edgeCloud.erodedDensity}`);
console.log(`[Cloud Modeling] Billow Erosion Functional: ${midCloud.erodedDensity > edgeCloud.erodedDensity}`);"""

c3 = """interface RayMarchStats {
  totalSteps: number;
  accumulatedOpticalDepth: number;
  finalTransmittance: number;
  earlyTerminated: boolean;
}

class VolumetricCloudRayMarcher {
  static marchRay(stepSizeM: number, sampleDensities: number[]): RayMarchStats {
    let opticalDepth = 0.0;
    let transmittance = 1.0;
    let stepCount = 0;
    let earlyTerminated = false;

    for (let i = 0; i < sampleDensities.length; i++) {
      stepCount++;
      const rho = sampleDensities[i];
      if (rho > 0.001) {
        // Extinction sigma_t = 0.1 * density
        opticalDepth += 0.1 * rho * stepSizeM;
        transmittance = Math.exp(-opticalDepth);

        // Early ray termination threshold
        if (transmittance < 0.005) {
          earlyTerminated = true;
          break;
        }
      }
    }

    return {
      totalSteps: stepCount,
      accumulatedOpticalDepth: parseFloat(opticalDepth.toFixed(3)),
      finalTransmittance: parseFloat(transmittance.toFixed(4)),
      earlyTerminated
    };
  }
}

// 64 march steps through dense cloud volume
const densities = Array(64).fill(0.8);
const marchResult = VolumetricCloudRayMarcher.marchRay(50.0, densities);

console.log(`[Volumetric March] Total Steps Executed: ${marchResult.totalSteps} / 64`);
console.log(`[Volumetric March] Accumulated Optical Depth: ${marchResult.accumulatedOpticalDepth}`);
console.log(`[Volumetric March] Early Ray Termination Confirmed: ${marchResult.earlyTerminated}`);"""

c4 = """interface PowderScatteringResult {
  density: number;
  beerLambert: number;
  powderFactor: number;
  compositeLuminance: number;
}

class CloudPowderEffectCalculator {
  // Beer-Powder approximation: T = exp(-d) * (1 - exp(-2 * d))
  static evaluatePowder(density: number, stepLength: number): PowderScatteringResult {
    const d = density * stepLength;
    const beer = Math.exp(-d);
    // Dark edges effect inside cloud folds
    const powder = 1.0 - Math.exp(-2.0 * d);
    const composite = beer * powder * 2.0;

    return {
      density,
      beerLambert: parseFloat(beer.toFixed(4)),
      powderFactor: parseFloat(powder.toFixed(4)),
      compositeLuminance: parseFloat(composite.toFixed(4))
    };
  }
}

const thinVoxel = CloudPowderEffectCalculator.evaluatePowder(0.1, 10.0);
const denseVoxel = CloudPowderEffectCalculator.evaluatePowder(0.8, 10.0);

console.log(`[Powder Effect] Thin Edge Luminance: ${thinVoxel.compositeLuminance}`);
console.log(`[Powder Effect] Dense Cloud Core Luminance: ${denseVoxel.compositeLuminance}`);
console.log(`[Powder Effect] Fold Shadowing Suppression Active: ${denseVoxel.compositeLuminance < 0.01}`);"""

c5 = """interface CloudPipelineTimings {
  quarterResMarchMs: number;
  temporalReprojectionMs: number;
  bilateralBilateralUpscaleMs: number;
}

class VolumetricPerformanceAuditor {
  static audit(timings: CloudPipelineTimings): { totalMs: number; meetsSla: boolean } {
    const totalMs = parseFloat((
      timings.quarterResMarchMs +
      timings.temporalReprojectionMs +
      timings.bilateralBilateralUpscaleMs
    ).toFixed(2));

    const meetsSla = totalMs <= 2.5; // Strict 2.5ms Volumetric Cloud SLA
    return { totalMs, meetsSla };
  }
}

const timings: CloudPipelineTimings = {
  quarterResMarchMs: 1.45,
  temporalReprojectionMs: 0.45,
  bilateralBilateralUpscaleMs: 0.38
};

const audit = VolumetricPerformanceAuditor.audit(timings);
console.log(`[Cloud Audit] Total Volumetric Cloud Execution: ${audit.totalMs} ms`);
console.log(`[Cloud Audit] Meets 2.5ms Atmospheric SLA: ${audit.meetsSla}`);
console.log(`[Cloud Audit] 60 FPS Target Certified: ${audit.meetsSla}`);"""

snippets = [c1, c2, c3, c4, c5]

for i, code in enumerate(snippets, 1):
    tmp_file = f"scripts/tmp_day49_snippet_{i}.ts"
    with open(tmp_file, "w", encoding="utf-8") as f:
        f.write(code)
    res = subprocess.run(["npx", "tsx", tmp_file], capture_output=True, text=True, shell=True)
    if res.returncode != 0:
        print(f"Snippet {i} FAILED: {res.stderr}")
    else:
        print(f"Snippet {i} PASSED. Output:\n{res.stdout.strip()}")
    if os.path.exists(tmp_file):
        os.remove(tmp_file)
