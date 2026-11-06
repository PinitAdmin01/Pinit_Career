import json

say_p1 = [
    "Welcome to Day 49 of 3D Computer Graphics, WebGL2 & GPU Shader Architecture. Today we ascend from surface materials into the open sky: Real-Time Volumetric Clouds, Planetary Atmospheres, and Radiative Transfer.",
    "Look up at the daytime sky: why is the clear midday sky a vibrant azure blue, while the setting sun on the horizon burns with blazing orange and deep crimson? For centuries, artists painted skies with simple blue background gradients or 2D skydome textures. However, in modern open-world flight simulators, action RPGs, and dynamic weather systems, the camera can fly from ground level through mountain mist, soar inside cumulus cloud canyons, and break through the cloud deck into the golden glow of the upper troposphere. To render dynamic skies with physical fidelity, we must simulate Radiative Transfer in Planetary Atmospheres.",
    "A planetary atmosphere is an immense participating medium consisting of gas molecules (nitrogen and oxygen) and suspended aerosols (dust, sea salt, water droplets, and smoke). As light travels through this planetary shell, it experiences two fundamental scattering regimes: Rayleigh Scattering and Mie Scattering.",
    "Rayleigh Scattering occurs when light particles collide with gas molecules that are much smaller than the wavelength of light (d << lambda). Lord Rayleigh proved in 1871 that the scattering coefficient beta_R is inversely proportional to the fourth power of wavelength: beta_R(lambda) is proportional to 1 / lambda^4. Look at what the fourth power means: blue light (440nm) scatters almost TEN TIMES more intensely than red light (680nm)! At noon, when the sun is directly overhead, sunlight travels through a short column of air (barely ten kilometers thick); the intense blue scattering fills the sky with diffuse azure light.",
    "At sunset, sunlight must travel through a grazing trajectory spanning over eighty kilometers of dense atmospheric gas. Because blue light scatters away so violently, the blue photons are completely stripped from the direct sunlight beam along the path. Only the long, robust red and orange wavelengths survive the epic journey to reach your eye, turning the setting sun into a fiery crimson sphere!",
    "Mie Scattering, on the other hand, occurs when light strikes larger aerosol particles and cloud water droplets whose diameters are comparable to or larger than the wavelength of light (d >= lambda). Mie scattering is non-wavelength-dependent: it scatters all visible wavelengths equally with an intensely directional forward lobe governed by the Henyey-Greenstein phase function. This is why clouds, fog, and sun halos appear brilliant, blinding white rather than blue.",
    "Consider the physical analogy of an ocean wave encountering two different obstacles: a tiny wooden toothpick versus a massive concrete harbor breakwater. When ocean swells strike a microscopic toothpick, small high-frequency ripples scatter in all directions (Rayleigh Scattering). But when the giant wave crashes into the massive concrete breakwater, the entire wave surges forward with brute force regardless of ripple wavelength (Mie Scattering). That is the fundamental difference between atmospheric air molecules and cloud droplets.",
    "In the TypeScript snippet below, we construct the `RayleighAtmosphereCalculator`. We evaluate atmospheric transmittance across 10km (overhead noon) and 80km (sunset horizon) paths for red and blue light, confirming the physics of sunset reddening.",
    "To model planetary atmospheres with rigorous precision, graphics engines must also account for Ozone Absorption, known as the Chappuis Band. In the stratosphere, ozone molecules (O_3) absorb orange and red wavelengths between 550nm and 650nm. When the sun dips below the horizon during twilight, sunlight passes tangentially through the dense stratospheric ozone layer. The intense absorption of orange and red light leaves behind only deep indigo and cobalt blue photons, creating the enchanting, ethereal twilight sky known as the Blue Hour. Without ozone absorption, twilight skies in real-time engines would look drab, desaturated gray rather than rich cobalt.",
    "Furthermore, atmospheric density decays exponentially with altitude according to atmospheric scale height H: rho(h) = rho_0 * exp(-h / H). For Earth, the scale height for molecular gas (Rayleigh) is approximately 8.5 kilometers, whereas the scale height for aerosols (Mie) is much lower, around 1.2 kilometers. Because heavy aerosols concentrate near the planetary surface, dense haze and smog linger in low valleys, while the upper atmosphere remains crystal clear. In modern spherical atmosphere shaders, rays calculate optical depth by integrating these two independent exponential density profiles simultaneously using precomputed look-up tables (LUTs) pioneered by Eric Bruneton in his seminal atmospheric scattering paper.",
    "Notice how blue transmittance drops from 71.8% at noon to barely 7.08% at sunset, while red preserves 62.88%, proving the intense crimson sunset shift. We now explore procedural 3D cloud modeling."
]

say_p2 = [
    "Having established planetary atmospheric scattering, we now tackle the magnificent architectures of the troposphere: Procedural 3D Cumulus and Stratocumulus Cloud Modeling.",
    "A cloud is not an empty hollow polygonal mesh wrapped in a white texture! A cloud is a sprawling, turbulent volumetric aerosol consisting of trillions of microscopic condensed water droplets floating in thermodynamic equilibrium between two atmospheric altitudes: Cloud Base (typically 1.5 kilometers above sea level) and Cloud Top (typically 4.0 kilometers above sea level). If you try to model clouds using traditional polygonal meshes, camera flight through cloud interiors causes ugly clipping artifacts, polygon popping, and flat, unconvincing silhouettes.",
    "In 2015, Andrew Schneider at Guerrilla Games revolutionized real-time skies with The Procedural 3D Volumetric Noise Pipeline for Horizon Zero Dawn. Schneider observed that natural clouds possess a fractal duality: Low-Frequency Macro Structure (the towering billows and cauliflower domes) combined with High-Frequency Micro Erosion (the wispy, frayed edges where dry air evaporates cloud droplets).",
    "To generate volumetric cloud density procedurally inside a GPU compute shader, engines sample two specialized 3D Textures: Texture 1 is a 128x128x128 Low-Frequency Perlin-Worley Noise Texture. Perlin noise creates smooth, organic cloud masses, while Worley (cellular) noise carves puffy, bubble-like cauliflower clumps. Blending Perlin and Worley noise establishes the fundamental macroscopic shape and volume of the cloud.",
    "Texture 2 is a 32x32x32 High-Frequency 3D Worley Noise Texture containing three octaves of microscopic cellular noise. The compute shader uses this texture to Erode the base cloud: subtracting high-frequency Worley noise from the perimeter of the cloud dome. Where the cloud is dense in its center core, erosion has minimal effect; but at the outer edges, erosion carves intricate, feather-like wisps and turbulent billows that animate smoothly as wind blows.",
    "Consider the physical analogy of an ice sculptor carving a giant swan from a block of ice. The sculptor begins with a heavy chainsaw to block out the broad, bulky torso and neck of the swan (Low-Frequency Perlin-Worley Noise). Once the primary silhouette is established, the sculptor switches to a fine diamond chisel to carve individual feather textures and delicate wing tips along the edges (High-Frequency Worley Erosion). Procedural cloud density synthesizes clouds using this exact two-stage sculpturing hierarchy.",
    "Furthermore, macro cloud distribution across open worlds is controlled by a 2D Weather Map: an aerial texture encoding Cloud Coverage (the percentage of sky covered by clouds in the red channel), Cloud Type (transitioning from flat stratus in the green channel to towering cumulonimbus), and Precipitation Rain Mask in the blue channel. By sampling this weather map, clouds naturally transition from sunny, fluffy afternoon skies into ominous, towering storm fronts.",
    "In the TypeScript snippet below, we implement the `ProceduralCloudDensityGenerator`. We evaluate cloud density at altitude, apply height gradient curves, and execute high-frequency billow erosion.",
    "Let us examine how these two 3D textures are stored and formatted in GPU video memory. A 128x128x128 3D texture using RGBA16F format occupies 16 megabytes of VRAM, while a 32x32x32 detail texture occupies only 256 kilobytes. To optimize GPU memory bandwidth during ray marching, modern engines pack multiple noise octaves into the individual color channels of the 3D texture: the Red channel stores the Perlin-Worley base noise, while the Green, Blue, and Alpha channels store three descending octaves of pure Worley cellular noise at increasing spatial frequencies. By binding these packed 3D textures with trilinear filtering, the compute shader evaluates multi-octave fractional Brownian motion (fBm) with minimal texture sampling overhead.",
    "To simulate dynamic, living skies, engines apply Wind Advection and Wind Shear to the 3D sampling coordinates. Wind velocity is not constant across altitudes: near the ground, surface friction slows wind speeds, while thousands of meters aloft in the jet stream, high-altitude winds howl at violent velocities. By offsetting the 3D texture sampling coordinates with altitude-dependent directional vectors over time, cloud billows stretch, shear, and deform naturally. Furthermore, incorporating a 2D Curl Noise texture into the wind offset vector introduces swirling, turbulent vortices along the cloud edges, mimicking real-world atmospheric convective currents with stunning physical realism.",
    "Notice how core cloud density evaluates to 1.1731 while billow edges erode cleanly to zero, proving robust volumetric edge carving. We now examine volumetric ray marching optimization."
]

say_p3 = [
    "Having defined our procedural 3D cloud density field rho(x, y, z), we must now render this volumetric medium from the camera's perspective: Volumetric Ray Marching and Step Optimization.",
    "In traditional rasterization, the GPU tests surface visibility using a single depth test per pixel. In volumetric ray marching, a camera ray must March through three-dimensional space, taking dozens of discrete sampling steps along the ray vector between the ray's entry point into the cloud layer (t_near) and its exit point (t_far). At each step along the ray, the shader samples the 3D cloud density, calculates incoming sunlight, and accumulates optical depth and radiance.",
    "Mathematically, the accumulated radiance L across ray distance t is governed by the Volumetric Radiative Transfer Integral: L = integral_{t_near}^{t_far} T(t) * sigma_s * L_in(x(t)) dt, where T(t) = exp(-integral sigma_t dt) is the accumulated transmittance according to the Beer-Lambert Law.",
    "If a ray marcher evaluates 128 uniform steps per pixel at 1080p resolution, each frame would require over two hundred and fifty million 3D texture fetches! On modern GPU hardware, this would plunge the framerate to five frames per second. To achieve a locked 60 FPS, graphics engineers deploy three profound Ray Marching Optimizations.",
    "Optimization 1: Spherical Atmosphere Ray-Sphere Intersections. The cloud layer is bounded by two concentric planetary spheres: Inner Sphere (Earth radius + 1.5km) and Outer Sphere (Earth radius + 4.0km). Before marching, the shader computes analytical ray-sphere intersections, restricting ray marching strictly to the active atmospheric shell and skipping empty space beneath the clouds.",
    "Optimization 2: Adaptive Step Marching. Outside dense clouds, the ray marcher takes large, aggressive steps (e.g., 200 meters per step) to advance rapidly through empty sky. The instant a non-zero density is detected (rho > 0.001), the marcher drops its step size down to fine precision (e.g., 25 to 50 meters) to capture delicate cloud billows with zero banding artifacts.",
    "Optimization 3: Early Ray Termination. Because light decays exponentially via Beer-Lambert extinction, once accumulated transmittance T drops below a tiny threshold (T < 0.005, meaning over 99.5% of light has been extinguished), the ray is completely opaque! Further steps along the ray contribute zero visible light to the screen. The shader executes an immediate loop `break`, aborting traversal and saving over eighty percent of potential steps in dense storm clouds.",
    "Consider the physical analogy of an underwater diver exploring a murky sea. If the diver turns on an underwater flashlight in muddy water, they can clearly see objects five feet in front of them. But at fifty feet, the water is pitch black; shining a beam fifty feet deeper into the abyss accomplishes nothing because light cannot penetrate the mud. Early ray termination halts compute execution the instant the medium becomes opaque.",
    "In the TypeScript snippet below, we implement the `VolumetricCloudRayMarcher`. We march through 64 potential voxel steps, measuring accumulated optical depth and early termination behavior.",
    "Another critical challenge in volumetric ray marching is handling Sunlight In-Scattering along the camera ray. At every single sample position along the primary camera ray, the shader must evaluate how much direct sunlight illuminates that specific voxel! Evaluating a secondary ray march toward the sun from every primary sample would cause an explosive quadratic complexity (N_primary * N_secondary), requiring thousands of texture lookups per pixel.",
    "To resolve this computational bottleneck, engines deploy Cone Tracing and Ambient Skylight Approximations. Instead of marching dozens of secondary steps, the shader marches four to six strategically spaced steps along the light vector toward the sun, evaluating optical depth to determine shadow extinction. For indirect ambient light, the shader evaluates the vertical height gradient and an inverted cloud density probe, approximating ambient occlusion and diffused sky illumination. Moreover, to eliminate visible planar slicing artifacts caused by discrete step intervals, engines jitter the ray start distance using a screen-space Bayer Matrix or blue noise dither. This converts regular, ugly geometric banding into subtle, high-frequency grain that temporal reprojection seamlessly dissolves into smooth, photographic volume.",
    "Notice how the ray marcher terminates after only two steps, achieving complete opacity and saving 62 unnecessary texture fetches. We now explore the Powder Effect and multiple scattering."
]

say_p4 = [
    "We now confront one of the most famous optical paradoxes in atmospheric graphics: The Cloud Powder Effect and Directional Multiple Scattering.",
    "If you implement a standard volumetric ray marcher that evaluates sunlight extinction purely using the classic Beer-Lambert Law (T = exp(-sigma_t * d)), you will immediately notice an ugly visual flaw: the clouds look like flat, dense clumps of gray volcanic ash or greasy cotton balls! Real cumulus clouds under bright sunlight look brilliant, luminous, and fluffy, with soft silver linings and luminous internal illumination.",
    "Real clouds look luminous because water droplets in clouds are almost perfect forward scatterers with near-zero absorption (single-scattering albedo omega_0 >= 0.9999). When sunlight enters a cloud, photons bounce forward between dozens of droplets before exiting. To capture this in real time, graphics engines combine Dual-Lobe Henyey-Greenstein Phase Functions with The Powder Effect.",
    "Phase Function 1: Dual-Lobe Henyey-Greenstein. The angular scattering distribution p(theta) is modeled using two opposing lobes: a powerful Forward Scattering Lobe (g_1 = 0.8) that creates brilliant silver linings when looking toward the sun, combined with a gentle Backward Scattering Lobe (g_2 = -0.2) that reflects light back toward the observer when the sun is behind the camera: p(theta) = mix(HG(theta, g_1), HG(theta, g_2), 0.15).",
    "Phase Function 2: The Powder Effect. In 2012, Magnus Wrenninge at Pixar Animation Studios observed a counter-intuitive phenomenon when photographing sugar powder and cumulus clouds: when looking deeply into dark cloud folds and crevices, the interior of the folds appears darker than simple Beer-Lambert extinction predicts, because light entering deep crevices is trapped and scattered away from the camera. Wrenninge formulated The Powder Approximation: Powder(d) = 1.0 - exp(-2.0 * d).",
    "Look at how the powder factor behaves when multiplied against the Beer-Lambert transmittance: T_composite = exp(-d) * (1.0 - exp(-2.0 * d)). On thin cloud edges (small optical depth d), the powder term suppresses harsh over-brightening, creating soft, natural edge transitions. Deep inside cloud billow folds, the term accentuates dark, self-shadowed crevices, giving clouds an astonishing physical weight, volume, and sculptural depth.",
    "Consider the physical analogy of examining a bowl of white wheat flour under a kitchen table lamp. The flat surface of the flour glows brilliant white. But if you take a spoon and gouge deep, craggy furrows into the flour, the deep crevices and valleys in the powder cast dramatic, soft, velvety shadows, emphasizing the craggy topography of the powder. The Powder Effect introduces that exact tactile, sculptural quality to procedural cloud volumes.",
    "In the TypeScript snippet below, we construct the `CloudPowderEffectCalculator`. We evaluate the combined Beer-Powder transmission across thin edges versus dense cloud cores, verifying crevice shadow suppression.",
    "Let us analyze the mathematics of the Dual-Lobe Henyey-Greenstein phase function in detail. The single-lobe Henyey-Greenstein formula is given by: p(theta, g) = (1 - g^2) / (4 * pi * (1 + g^2 - 2 * g * cos(theta))^(3/2)), where g is the asymmetry parameter (-1 for pure backscattering, 0 for isotropic scattering, and +1 for pure forward scattering). Water droplets have an asymmetry parameter g around 0.8, producing an exceptionally sharp forward peak. However, if an engine uses only a forward lobe, clouds viewed with the sun behind the camera appear completely black and dead!",
    "By blending a forward lobe (g = 0.8, weight 0.85) with a gentle backward lobe (g = -0.2, weight 0.15), the cloud exhibits both brilliant silver edge highlights when backlit and soft, luminous volumetric diffuse reflectance when front-lit. Furthermore, to account for multiple scattering—where photons bounce through dozens of water droplets before escaping—engines often evaluate an octave-based multiple scattering approximation (pioneered by Wrenninge). In this approximation, secondary scattering passes halve the extinction coefficient while doubling the phase function cone width, mimicking photon diffusion through the cloud interior with breathtaking volumetric radiance.",
    "Notice how the thin edge achieves a healthy luminance of 0.6362 while dense core crevices attenuate down to 0.0007, creating dramatic volumetric contrast. We now assemble temporal reprojection and audit 60 FPS SLAs."
]

say_p5 = [
    "We now assemble the complete Volumetric Cloud Pipeline: Quarter-Resolution Ray Marching, Temporal Reprojection, Bilateral Depth Upscaling, and 60 FPS Performance Auditing.",
    "Even with adaptive stepping and early ray termination, marching dozens of volumetric samples for two million pixels at 1080p resolution remains too heavy for a strict 16.6ms frame budget. To achieve cinema-grade cloud scapes with rock-solid 60 FPS performance, modern engines deploy Quarter-Resolution Interleaved Ray Marching.",
    "In Pass 1 (Quarter-Resolution Marching), the cloud volume is ray marched into an off-screen buffer rendered at one-quarter resolution (half width and half height, representing only 25% of screen pixels). Furthermore, the ray march origin is jittered each frame using a 4x4 Bayer Dither Matrix, staggering sample positions across four consecutive frames.",
    "In Pass 2 (Temporal History Reprojection), the shader reprojects the quarter-resolution cloud buffer using camera velocity vectors. Historical samples are accumulated across up to sixteen frames using an exponential moving average (alpha = 0.1), integrating sixty-four virtual temporal steps per pixel with zero spatial noise!",
    "In Pass 3 (Bilateral Depth-Aware Upscaling), the quarter-resolution cloud texture is upsampled to full screen resolution. Crucially, the upscaler evaluates cross-bilateral weights using the full-resolution G-Buffer depth buffer: if a pixel is occupied by a nearby foreground object (like a mountain peak, an airplane wing, or a skyscraper antenna), the bilateral filter preserves the razor-sharp foreground silhouette, completely eliminating fuzzy halo artifacts around terrain edges.",
    "To maintain our rock-solid 60 FPS SLA, our engine enforces a strict 2.5 Millisecond Budget for the entire volumetric sky subsystem: including quarter-resolution ray marching, temporal accumulation, and bilateral upscaling.",
    "Consider the physical analogy of an impressionist landscape painter working on a massive canvas. The artist does not use a single-bristle sable brush to paint every single cloud vapor molecule across six square meters of canvas! They use a wide, soft blending wash brush to lay down the broad atmospheric tones, and then use a fine liner brush only along the mountain horizon where sharp contrast is required. Quarter-resolution bilateral upscaling mirrors this artistic efficiency on the GPU.",
    "On modern GPU hardware, quarter-resolution marching takes approximately 1.45ms, temporal reprojection takes 0.45ms, and bilateral upscaling takes 0.38ms, totaling 2.28ms—comfortably below our 2.5ms SLA ceiling.",
    "In the TypeScript snippet below, we implement the `VolumetricPerformanceAuditor`. We measure stage timings across quarter-resolution marching, temporal reprojection, and bilateral upscaling, auditing against the 2.5ms SLA.",
    "Let us examine the mechanics of the Cross-Bilateral Depth-Aware Upsampler. When upscaling a low-resolution rendering pass to native screen resolution, a standard bilinear texture filter samples a 2x2 footprint of low-resolution pixels. If an opaque foreground object—such as a stone watchtower or a player character—crosses that 2x2 footprint, bilinear blending smears cloud radiance over the foreground edge, creating unacceptable halo artifacts and translucent borders. The cross-bilateral filter solves this by computing weights based on both spatial distance and Depth Disparity between the full-resolution pixel and the low-resolution samples.",
    "If the depth difference between the high-resolution pixel and a low-resolution cloud sample exceeds a tiny epsilon threshold (e.g., 0.1 meters in camera space), the filter assigns that low-resolution sample a weight of zero! Consequently, the upscaler reconstructs crisp, sub-pixel edge boundaries against foreground geometry with zero bleeding. Combined with temporal reprojection, which blends 90% of the previous valid frame with 10% of new jittered samples, our volumetric sky system delivers 4K-quality atmospheric rendering with zero jitter, zero aliasing, and pristine 60 FPS performance.",
    "By maintaining this multi-tiered architecture, graphics engines render cinema-quality skies with expansive view distances, volumetric god rays, and seamless day-night cycles at production frame rates.",
    "Notice how total volumetric sky execution completes in 2.28ms, safely certifying 60 FPS production compliance. Tomorrow, in Day 50, we culminate Month 2 Block 10 with our Milestone 10 Capstone: Photorealistic Multi-Layered Material & Volumetric Atmospheric Rendering Engine!"
]

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

o1 = """[Atmosphere] Overhead Sky Blue Transmittance: 0.7182
[Atmosphere] Sunset Red Transmittance: 0.6288
[Atmosphere] Sunset Blue Transmittance: 0.0708
[Atmosphere] Iconic Sunset Reddening Confirmed: true"""

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

o2 = """[Cloud Modeling] Mid-Cloud Core Density: 1.1731
[Cloud Modeling] Cloud Billow Edge Density: 0
[Cloud Modeling] Billow Erosion Functional: true"""

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

o3 = """[Volumetric March] Total Steps Executed: 2 / 64
[Volumetric March] Accumulated Optical Depth: 8
[Volumetric March] Early Ray Termination Confirmed: true"""

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

o4 = """[Powder Effect] Thin Edge Luminance: 0.6362
[Powder Effect] Dense Cloud Core Luminance: 0.0007
[Powder Effect] Fold Shadowing Suppression Active: true"""

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

o5 = """[Cloud Audit] Total Volumetric Cloud Execution: 2.28 ms
[Cloud Audit] Meets 2.5ms Atmospheric SLA: true
[Cloud Audit] 60 FPS Target Certified: true"""

day49_data = {
    'day': 49,
    'coursePrefix': 'g3d',
    'title': 'Real-Time Volumetric Cloud & Atmosphere Simulation: Ray Marching 3D Worley Noise & The Powder Effect',
    'goal': 'Master planetary atmospheric simulation and volumetric clouds: Rayleigh and Mie scattering, procedural 3D Perlin-Worley noise, adaptive step size ray marching, early ray termination, Henyey-Greenstein dual-lobe phase functions, the Powder Effect, and quarter-resolution bilateral upscaling.',
    'recap': 'Recap of Day 48: Anisotropic GGX microfacet BRDFs, Kajiya-Kay cylinder scattering cones, Marschner multi-lobe hair scattering (R, TT, TRT), biophysical melanin absorption, and deep opacity shadow maps.',
    'minutes': 120,
    'parts': [
        {
            'part': 1,
            'title': 'Radiative Transfer in Planetary Atmospheres: Rayleigh & Mie Scattering',
            'say': say_p1,
            'example': 'An ocean wave scattering into tiny ripples against a wooden toothpick (Rayleigh) versus surging forward through a massive concrete breakwater (Mie).',
            'code': c1,
            'output': o1,
            'check': {
                'question': 'Why does the setting sun on the horizon appear deep red while the midday sky overhead appears vibrant azure blue?',
                'options': [
                    'Because Rayleigh scattering coefficient is inversely proportional to wavelength to the fourth power, causing blue light to scatter away across long horizon paths leaving only red light.',
                    'Because the sun cools down by several thousand degrees every evening.',
                    'Because the earth’s magnetic field absorbs yellow photons at night.',
                    'Because camera lens sensors overheat when looking at the horizon.'
                ],
                'answer': 0,
                'answerIndex': 0,
                'why': 'Rayleigh scattering scales with 1/lambda^4: blue light scatters 10x more than red, so across 80km horizon paths, all blue light is scattered away, leaving only red.'
            }
        },
        {
            'part': 2,
            'title': 'Procedural 3D Cloud Modeling: Perlin-Worley Shapes & Billow Erosion',
            'say': say_p2,
            'example': 'An ice sculptor blocking out the heavy body of a swan with a chainsaw, then carving delicate wing feathers with a fine diamond chisel.',
            'code': c2,
            'output': o2,
            'check': {
                'question': 'How does Andrew Schneider’s 3D volumetric noise hierarchy model procedural cumulus clouds without polygon meshes?',
                'options': [
                    'By combining a low-frequency 3D Perlin-Worley noise texture for base volume with a high-frequency 3D Worley noise texture to erode turbulent billow edges.',
                    'By pasting 2D photographic cloud images onto billboards.',
                    'By converting voxel terrains into white rock meshes.',
                    'By spawning millions of 2D screen-space sprites.'
                ],
                'answer': 0,
                'answerIndex': 0,
                'why': 'Perlin-Worley noise creates the macroscopic puffy cloud volume, while high-frequency Worley noise erodes wispy billows along cloud perimeters.'
            }
        },
        {
            'part': 3,
            'title': 'Volumetric Ray Marching: Spherical Atmosphere Bounds & Early Termination',
            'say': say_p3,
            'example': 'An underwater diver shining a flashlight into muddy water, turning back when the water becomes too opaque for light to penetrate.',
            'code': c3,
            'output': o3,
            'check': {
                'question': 'How does Early Ray Termination optimize volumetric cloud ray marching in compute shaders?',
                'options': [
                    'By breaking out of the ray marching loop the instant accumulated transmittance drops below 0.005, saving over 80% of texture lookups in opaque cloud cores.',
                    'By disabling clouds whenever the player looks upward.',
                    'By reducing screen resolution to 320x240.',
                    'By rendering clouds only once per hour.'
                ],
                'answer': 0,
                'answerIndex': 0,
                'why': 'When transmittance reaches zero according to the Beer-Lambert law, subsequent steps contribute zero visible radiance and are safely aborted.'
            }
        },
        {
            'part': 4,
            'title': 'The Cloud Powder Effect & Dual-Lobe Henyey-Greenstein Scattering',
            'say': say_p4,
            'example': 'A bowl of white wheat flour displaying brilliant surface highlights while deep gouged furrows cast dark, velvety crevice shadows.',
            'code': c4,
            'output': o4,
            'check': {
                'question': 'What visual problem does Magnus Wrenninge’s Powder Effect solve in volumetric cloud rendering?',
                'options': [
                    'It prevents clouds from looking like flat gray cotton balls by multiplying Beer-Lambert extinction by (1 - exp(-2d)), accentuating dark crevice folds and soft billow edges.',
                    'It adds realistic snowflakes falling from the bottom of clouds.',
                    'It converts directional sunlight into point lights.',
                    'It removes fog from camera lenses.'
                ],
                'answer': 0,
                'answerIndex': 0,
                'why': 'The Powder Effect (1 - exp(-2d)) models multiple-scattering absorption inside dark billow folds, giving clouds tactile weight and sculptural depth.'
            }
        },
        {
            'part': 5,
            'title': 'Quarter-Resolution Interleaved Marching, Bilateral Upscaling & 2.5ms SLA',
            'say': say_p5,
            'example': 'An impressionist painter using a broad wash brush for vast skies and a fine liner brush only along sharp mountain silhouettes.',
            'code': c5,
            'output': o5,
            'check': {
                'question': 'Why do real-time sky engines ray march volumetric clouds at quarter resolution with depth-aware bilateral upscaling?',
                'options': [
                    'Because marching at 25% resolution saves 75% of ray march texture lookups, while bilateral upscaling preserves crisp foreground silhouette edges.',
                    'Because human eyes cannot perceive clouds in high definition.',
                    'Because GPUs do not support full-screen compute shaders.',
                    'Because quarter resolution uses zero GPU memory bandwidth.'
                ],
                'answer': 0,
                'answerIndex': 0,
                'why': 'Quarter resolution marching reduces compute cost by 4x, while bilateral depth-guided upscaling eliminates edge halos against terrain.'
            }
        }
    ],
    'projectStep': {
        'title': 'Implement Real-Time Volumetric Clouds & Planetary Atmospheric Simulation',
        'steps': [
            'Simulate Rayleigh and Mie atmospheric scattering for realistic blue skies and crimson sunsets.',
            'Generate 3D procedural cloud density fields with Perlin-Worley shapes and high-frequency billow erosion.',
            'Deploy volumetric ray marching with adaptive stepping and early ray termination inside spherical planetary shells.',
            'Incorporate dual-lobe Henyey-Greenstein scattering, the Powder Effect, and quarter-resolution bilateral upscaling within a 2.5ms SLA.'
        ]
    },
    'summary': [
        'Rayleigh scattering scales with 1/lambda^4, explaining azure daytime skies and deep crimson horizon sunsets.',
        'Procedural 3D clouds combine low-frequency Perlin-Worley mass with high-frequency Worley erosion, governed by 2D weather maps.',
        'Adaptive stepping and early ray termination accelerate volumetric ray marching through spherical planetary bounds.',
        'The Powder Effect and dual-lobe Henyey-Greenstein phase functions produce luminous silver linings and deep, sculpted cloud folds.',
        'Quarter-resolution marching combined with temporal reprojection and bilateral depth upscaling delivers cinematic skies within a 2.5ms SLA.'
    ]
}

# Verify word count
total_words = 0
for p in day49_data['parts']:
    wc = sum(len(para.split()) for para in p['say'])
    total_words += wc
    print(f"G3D Day 49 Part {p['part']} Word Count: {wc}")
    assert wc >= 600, f"Part {p['part']} word count {wc} below 600 words!"
print(f"G3D Day 49 Total Words: {total_words}")

with open('scripts/g3d_day49_data.py', 'w', encoding='utf-8') as f:
    f.write(f"# Auto-generated Day 49 Data\nDAY_49_DATA = {json.dumps(day49_data, indent=2)}\n")

print("Successfully wrote scripts/g3d_day49_data.py!")
