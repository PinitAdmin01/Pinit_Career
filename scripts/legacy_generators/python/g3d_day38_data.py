# Auto-generated Day 38 Data
DAY_38_DATA = {
  "day": 38,
  "coursePrefix": "g3d",
  "title": "Volumetric Light Scattering, Froxel Grids & Ray Marching in Participating Media",
  "goal": "Master real-time volumetric atmospheric lighting: participating media extinction, frustum-aligned voxel grids (Froxels), Henyey-Greenstein anisotropic phase scattering, and Beer-Lambert transmittance integration.",
  "recap": "Recap of Day 37: Screen-Space Reflections (SSR), camera-space reflection rays, hierarchical Hi-Z depth traversal, binary refinement, and cubemap fallbacks.",
  "minutes": 120,
  "parts": [
    {
      "part": 1,
      "title": "Frustum-Aligned Voxel Grids (Froxels): Dimensions, Logarithmic Slicing & VRAM Allocation",
      "say": [
        "Welcome to Day 38 of 3D Computer Graphics, WebGL2 & GPU Shader Architecture. Over the past two days, we mastered post-processing compute pipelines: Temporal Anti-Aliasing (TAA) on Day 36 and Screen-Space Reflections (SSR) on Day 37. Today, we expand our rendering engine into the third dimension with atmospheric physics: Volumetric Light Scattering, Froxel Grids, and Ray Marching in Participating Media.",
        "In classical 3D graphics, space between virtual objects is assumed to be an empty vacuum: light travels unobstructed from a light bulb to a wall, bounces off the wall, and travels straight into the camera lens. But in the physical real world, air is never empty! The atmosphere is densely populated with Participating Media: microscopic nitrogen and oxygen gas molecules, atmospheric dust motes, aerosol water droplets (fog and mist), and carbon soot particles (smoke). When photons travel through these particles, they interact continuously through three distinct radiometric phenomena: Absorption, Out-Scattering, and In-Scattering.",
        "To simulate volumetric lighting across millions of screen pixels without grinding the GPU to a halt, modern rendering engines\u2014including Avalanche Studios, Frostbite, and Unreal Engine 5\u2014abandon per-pixel ray marching in favor of Frustum-Aligned Voxel Grids, universally called Froxels.",
        "A standard world-space 3D voxel grid divides space into uniform cubes $(X, Y, Z)$ aligned with world axes. However, a world-space grid is extraordinarily wasteful for real-time camera rendering: voxels behind the camera or outside the view frustum waste precious memory, while distant voxels close to the camera lack the spatial resolution required for fine atmospheric detail. Froxels solve this by constructing a 3D grid shaped exactly like the camera's viewing frustum!",
        "Consider the physical analogy of an old-fashioned accordion bellows camera or an amphitheater seating chart. Imagine an amphitheater with one hundred curved rows fanning out from the stage. The front rows close to the stage have narrow seats packed tightly together, allowing the director to see fine facial expressions. The back rows high up in the stadium span hundreds of feet across. The seating chart perfectly matches the cone of vision of the audience. A Froxel grid organizes VRAM memory along this identical perspective geometry: narrow voxels near the camera near plane, expanding outward proportionally to camera field of view.",
        "In a modern WebGPU engine, a typical Froxel grid has dimensions such as 160 x 90 x 64 (160 voxels horizontally, 90 voxels vertically, and 64 depth slices along the view axis), totaling 921,600 voxels. In screen space $(X, Y)$, each froxel tile corresponds to an 8 x 8 or 16 x 16 pixel block on the full-resolution display.",
        "Along the depth axis $(Z)$, froxel slices are distributed Logarithmically: depth(slice) = z_near * (z_far / z_near)^(slice / maxSlices). This logarithmic clustering places dense, fine-grained voxel slices near the camera (where volumetric shadows and spotlight cones must be crisp) and stretches wider slices into the distance, perfectly matching the human eye's perspective projection.",
        "In WebGPU compute shaders, the Froxel grid is represented as a 3D texture (`texture_storage_3d<rgba16float, write>`). In Pass 1 (Light Injection), a compute shader dispatches one thread per froxel. The thread computes the 3D world position of its froxel center, tests visibility against the directional shadow map, evaluates spotlight and point light attenuation, and writes in-scattered light and extinction into the 3D volume in a fraction of a millisecond!",
        "To evaluate light injection efficiently across hundreds of dynamic light sources, modern froxel pipelines leverage Clustered Light Culling. Before injecting light into the 3D volume, a pre-pass compute shader builds an AABB bounding box for each froxel tile and computes an active light index list per cluster. When the froxel injection kernel runs, each thread loops exclusively over the specific lights that intersect its local voxel, completely bypassing distant or non-overlapping light sources.",
        "Additionally, shadow map evaluation inside the froxel volume is optimized using Screen-Space Shadow Masks and hardware PCF (Percentage-Closer Filtering). For directional sun rays, froxels sample the cascaded shadow map (CSM) texture using 2x2 bilinear PCF filtering. This eliminates harsh pixelated shadow boundaries inside dust beams, giving crepuscular god rays their soft, ethereal, and cinematic quality.",
        "In the TypeScript snippet below, we implement the `FroxelGridSizer`. We evaluate grid dimensions, calculate total voxel capacity and VRAM allocation, and compute logarithmic depth distribution across froxel slices.",
        "Notice how 921,600 froxels consume barely seven megabytes of VRAM while providing full volumetric coverage. Next, we examine anisotropic phase functions."
      ],
      "example": "An amphitheater seating chart where rows fan outward proportionally to audience vision, packing dense seats near the stage.",
      "code": "interface FroxelConfig {\n  width: number;\n  height: number;\n  depthSlices: number;\n  bytesPerVoxel: number; // RGBA16F = 8 bytes\n}\n\nclass FroxelGridSizer {\n  static evaluateGrid(cfg: FroxelConfig): { totalVoxels: number; vramMegabytes: number } {\n    const totalVoxels = cfg.width * cfg.height * cfg.depthSlices;\n    const vramBytes = totalVoxels * cfg.bytesPerVoxel;\n    const vramMegabytes = parseFloat((vramBytes / (1024 * 1024)).toFixed(2));\n    return { totalVoxels, vramMegabytes };\n  }\n\n  static getSliceDepth(slice: number, maxSlices: number, nearZ: number, farZ: number): number {\n    // Logarithmic depth distribution: depth = near * (far / near)^(slice / maxSlices)\n    const ratio = farZ / nearZ;\n    const depth = nearZ * Math.pow(ratio, slice / maxSlices);\n    return parseFloat(depth.toFixed(2));\n  }\n}\n\nconst config: FroxelConfig = { width: 160, height: 90, depthSlices: 64, bytesPerVoxel: 8 };\nconst grid = FroxelGridSizer.evaluateGrid(config);\nconst nearSliceDepth = FroxelGridSizer.getSliceDepth(8, 64, 0.1, 100.0);\nconst farSliceDepth = FroxelGridSizer.getSliceDepth(32, 64, 0.1, 100.0);\n\nconsole.log(`[Froxel Grid] Dimensions: ${config.width}x${config.height}x${config.depthSlices}`);\nconsole.log(`[Froxel Grid] Total Froxels: ${grid.totalVoxels.toLocaleString(\"en-US\")}`);\nconsole.log(`[Froxel Grid] VRAM Allocation: ${grid.vramMegabytes} MB`);\nconsole.log(`[Froxel Grid] Slice 8 Depth: ${nearSliceDepth}m, Slice 32 Depth: ${farSliceDepth}m`);",
      "output": "[Froxel Grid] Dimensions: 160x90x64\n[Froxel Grid] Total Froxels: 921,600\n[Froxel Grid] VRAM Allocation: 7.03 MB\n[Froxel Grid] Slice 8 Depth: 0.24m, Slice 32 Depth: 3.16m",
      "check": {
        "question": "Why are Froxel depth slices distributed logarithmically along the view Z axis rather than uniformly?",
        "options": [
          "Because logarithmic distribution places dense, high-resolution slices near the camera where volumetric details are critical, while stretching wider slices into the distance.",
          "Because WebGPU compute shaders cannot allocate uniform 3D textures.",
          "Because logarithmic depth reduces floating-point precision on near geometry.",
          "Because uniform depth distribution causes graphics cards to overheat."
        ],
        "answer": 0,
        "answerIndex": 0,
        "why": "Perspective projection causes nearby volume elements to cover more screen area, making logarithmic depth clustering mathematically optimal."
      }
    },
    {
      "part": 2,
      "title": "Henyey-Greenstein Phase Function & Anisotropic Forward Scattering",
      "say": [
        "When a photon strikes an atmospheric aerosol droplet, it does not bounce off in all directions with equal probability! Microscopic molecules (like nitrogen in clean air) scatter light almost equally in all directions (Rayleigh Scattering, which makes the sky blue). But larger atmospheric aerosols (like fog droplets, mist, smoke particles, and dust motes) exhibit strong Anisotropic Forward Scattering (Mie Scattering): photons passing through the droplet are deflected forward along their original trajectory far more intensely than they bounce backward.",
        "This anisotropic forward scattering explains why driving into the sunset makes atmospheric haze appear blindingly bright, whereas looking away from the setting sun makes the sky appear clear and dark. In computer graphics, this directional scattering distribution is governed by The Phase Function P(theta), most universally formulated by the Henyey-Greenstein Phase Function.",
        "Consider the physical analogy of a tennis player returning a 100 mph serve. If the tennis ball strikes the taut nylon strings of the racquet squarely, the ball deflects with high velocity forward into the opponent's court. Very rarely does a 100 mph tennis ball bounce backward into the player's own face! The racquet has a strong forward directional bias. In atmospheric optics, the Henyey-Greenstein function acts as the mathematical model of this directional racquet.",
        "The Henyey-Greenstein phase function is parameterized by a single physical scalar called the Asymmetry Factor g in (-1.0, 1.0): P(theta) = (1.0 - g^2) / (4 * pi * (1.0 + g^2 - 2 * g * cos(theta))^1.5), where theta is the scattering angle between the incoming light direction L and the outgoing view direction V (so cos(theta) = L . V).",
        "When g = 0.0, the function reduces to 1 / (4 * pi), representing perfectly uniform Isotropic Scattering. When g > 0.0 (typically g = 0.5 to 0.8 for coastal fog and battlefield smoke), the phase function spikes sharply when looking toward the light source (cos(theta) -> 1.0). At cos(theta) = 1.0, forward scattering intensity is over twenty-five times greater than perpendicular side scattering!",
        "In our WebGPU light injection kernel, evaluating Henyey-Greenstein takes only five floating-point instructions per light source. It transforms flat, dull volumetric fog into dramatic, cinematic light shafts with brilliant halos around street lamps, headlights, and setting suns.",
        "In production rendering suites, artists often combine multiple Henyey-Greenstein lobes to create a Dual-Lobe Phase Function: P_dual(theta) = k * P(theta, g_1) + (1.0 - k) * P(theta, g_2). By blending a sharp forward lobe (g_1 = 0.8) with a subtle backward backscattering lobe (g_2 = -0.2), the phase function captures both the intense forward glow of light shafts and the subtle backward sheen observed in real-world coastal mist and dusty cathedrals.",
        "Furthermore, phase function evaluation is modulated by ambient light probes. While direct sunlight exhibits strong directional forward scattering, diffuse sky radiation scattered from clouds provides omnidirectional ambient in-scattering. The injection shader blends the directional Henyey-Greenstein phase result with spherical harmonic ambient probes, ensuring that fog in deep shadows remains softly illuminated by surrounding sky light.",
        "To prevent mathematical singularity when evaluating Henyey-Greenstein in high-energy spotlight beams, shaders clamp the denominator against an epsilon threshold. In extreme forward scattering where g approaches 1.0, the angular peak becomes infinitely sharp. Clamping the phase output prevents numeric overflow and firefly artifacts on client GPU hardware.",
        "When implementing phase functions in high-performance WebGPU compute shaders, precomputed one-dimensional lookup textures or polynomial approximations can further minimize arithmetic overhead. However, because modern floating-point execution units execute fused multiply-add operations at line rate, evaluating the analytical Henyey-Greenstein formula directly in WGSL remains both mathematically precise and blisteringly fast across desktop and mobile hardware.",
        "In the TypeScript snippet below, we implement the `HenyeyGreensteinPhase`. We evaluate phase scattering values across direct forward, side, and backward viewing angles under aerosol asymmetry factors.",
        "Notice how forward scattering delivers more than ten times higher radiance than perpendicular side scattering. We now integrate this scattered light along the viewing ray using the Beer-Lambert law."
      ],
      "example": "A tennis player returning a 100 mph serve who deflects the ball forward into the opponent court with strong directional bias.",
      "code": "class HenyeyGreensteinPhase {\n  static evaluate(cosTheta: number, g: number): number {\n    // P(theta) = (1 - g^2) / (4 * pi * (1 + g^2 - 2 * g * cosTheta)^1.5)\n    const g2 = g * g;\n    const denom = 4 * Math.PI * Math.pow(1 + g2 - 2 * g * cosTheta, 1.5);\n    const p = (1 - g2) / denom;\n    return parseFloat(p.toFixed(4));\n  }\n}\n\nconst g = 0.5; // Forward scattering (aerosols/fog)\nconst forward = HenyeyGreensteinPhase.evaluate(1.0, g); // Looking directly into light\nconst side = HenyeyGreensteinPhase.evaluate(0.0, g); // Perpendicular view\nconst back = HenyeyGreensteinPhase.evaluate(-1.0, g); // Looking directly away\n\nconsole.log(`[Phase Function] Asymmetry Factor g: ${g}`);\nconsole.log(`[Phase Function] Direct Forward Scattering (cos=1.0): ${forward}`);\nconsole.log(`[Phase Function] Side Scattering (cos=0.0): ${side}`);\nconsole.log(`[Phase Function] Back Scattering (cos=-1.0): ${back}`);",
      "output": "[Phase Function] Asymmetry Factor g: 0.5\n[Phase Function] Direct Forward Scattering (cos=1.0): 0.4775\n[Phase Function] Side Scattering (cos=0.0): 0.0427\n[Phase Function] Back Scattering (cos=-1.0): 0.0177",
      "check": {
        "question": "How does an asymmetry factor g > 0 in the Henyey-Greenstein phase function alter volumetric light scattering?",
        "options": [
          "It concentrates scattered light strongly in the forward direction along the light beam, creating intense glowing halos when looking toward light sources.",
          "It reflects all light backward like a solid mirror.",
          "It absorbs all light wavelengths except blue light.",
          "It scatters light uniformly in all directions with equal probability."
        ],
        "answer": 0,
        "answerIndex": 0,
        "why": "A positive asymmetry factor models Mie scattering in aerosols and fog, where photons are strongly deflected forward along their original trajectory."
      }
    },
    {
      "part": 3,
      "title": "Radiometry of Participating Media & Beer-Lambert Law Transmittance",
      "say": [
        "To accurately simulate how light diminishes and fades as it penetrates fog, smoke, or water, graphics engines turn to the foundational law of optical transmission: The Beer-Lambert Law. In any participating medium, photons encounter particles along their path. With every micrometer of travel, a constant fraction of photons is extinguished through absorption or deflection.",
        "Consider the everyday physical analogy of tinted sunglasses or swimming underwater in a deep lake. When you swim just beneath the surface, sunlight is brilliant and shimmering. As you dive down ten feet, the ambient illumination dims noticeably. When you dive down thirty feet, the water turns into a deep, somber indigo, and at one hundred feet, near-total darkness envelopes you. The water does not suddenly switch off the light at a specific threshold! Rather, each meter of water absorbs and scatters a fixed percentage of whatever photons entered it. That compound decay over distance is exponential attenuation.",
        "In radiative transfer physics, the loss of light along a beam is governed by Extinction: the sum of the absorption coefficient sigma_a and the scattering coefficient sigma_s, yielding the total extinction coefficient sigma_t = sigma_a + sigma_s. As light travels through participating media over distance d, its intensity decays exponentially according to the Beer-Lambert Law: T(d) = exp(-sigma_t * d), where T in [0, 1] represents the Transmittance (the fraction of original light that survives unabsorbed).",
        "When sigma_t is small (e.g. 0.01 per meter for clean mountain air), light penetrates hundreds of meters before dimming. When sigma_t is large (e.g. 0.5 to 2.0 per meter for dense fire smoke or steam clouds), light extinguishes within just a few meters, plunging objects behind the fog into impenetrable opacity.",
        "Furthermore, wavelength-dependent scattering explains atmospheric color phenomena. While large aerosol droplets scatter all wavelengths equally (creating white or gray fog), smaller particles scatter short blue wavelengths far more intensely than long red wavelengths. By specifying distinct scattering coefficients for red, green, and blue channels, the volumetric engine naturally reproduces rich amber sunsets, fiery horizon glows, and deep blue atmospheric haze.",
        "A vital physical metric derived from the extinction coefficient is the Mean Free Path: lambda = 1.0 / sigma_t. The mean free path represents the average physical distance a photon travels through the participating medium before colliding with a particle. In thin air, the mean free path spans several kilometers. In moderate morning mist, it shrinks to fifty meters. In heavy industrial soot or maritime fog, the mean free path can drop to less than two meters! Understanding the mean free path allows graphics programmers to select appropriate step sizes for volumetric ray marching and froxel depth distribution without introducing undersampling artifacts.",
        "Another critical distinction in volumetric optics is Single Scattering versus Multiple Scattering. In single scattering, photons from a light source collide with an aerosol particle exactly once before entering the camera lens. Single scattering creates sharp, dramatic god rays and crisp light cones. However, in dense participating media like cumulus clouds or thick steam, photons collide and bounce hundreds of times before escaping\u2014a process known as multiple scattering. While full multiple scattering requires offline path tracing, modern real-time engines approximate multiple scattering by injecting an ambient isotropic scattering term into the froxel volume or by cascading multiple phase function lobes.",
        "Real-world atmospheres also exhibit height-based exponential density gradients, known as Barometric Falloff: rho(height) = rho_ground * exp(-height / scale_height). As altitude increases, atmospheric density and particle concentration diminish exponentially. In our shader pipeline, combining this height-based density equation with 3D noise textures creates realistic low-lying fog banks that pool in valleys and river basins while leaving high mountain peaks bathed in crystal-clear sunlight.",
        "To accurately simulate heterogeneous atmospheres\u2014such as localized chimney smoke, ground-hugging swamp mist, or steam plumes rising from subway grates\u2014engines modulate extinction coefficients using 3D Density Volumes or Procedural 3D Simplex Noise. By sampling a low-frequency 3D noise texture displaced by virtual wind vectors, the compute shader dynamically evaluates localized aerosol density rho(x, y, z). In areas of heavy fog, extinction increases sharply; in clear mountain air, extinction drops to baseline atmospheric levels.",
        "In the TypeScript snippet below, we demonstrate the physical foundations of extinction coefficients and exponential transmittance using `BeerLambertTransmittance`, calculating how light decays across two, five, and fifteen meters of fog.",
        "Notice how transmittance drops from 74% at two meters down to barely 10% at fifteen meters. With transmittance established, we now explore front-to-back ray integration."
      ],
      "example": "Deep swimming in a freshwater lake where daylight dims progressively and exponentially with each additional meter of water depth.",
      "code": "class BeerLambertTransmittance {\n  static computeTransmittance(extinctionCoeff: number, stepDistance: number): number {\n    // T = exp(-sigma_t * d)\n    const opticalDepth = extinctionCoeff * stepDistance;\n    const transmittance = Math.exp(-opticalDepth);\n    return parseFloat(transmittance.toFixed(4));\n  }\n}\n\nconst extinction = 0.15; // Moderate fog extinction coefficient\nconst step1 = BeerLambertTransmittance.computeTransmittance(extinction, 2.0);\nconst step2 = BeerLambertTransmittance.computeTransmittance(extinction, 5.0);\nconst step3 = BeerLambertTransmittance.computeTransmittance(extinction, 15.0);\n\nconsole.log(`[Beer-Lambert] Extinction Coefficient: ${extinction}/m`);\nconsole.log(`[Beer-Lambert] Transmittance over 2m: ${step1}`);\nconsole.log(`[Beer-Lambert] Transmittance over 5m: ${step2}`);\nconsole.log(`[Beer-Lambert] Transmittance over 15m: ${step3}`);",
      "output": "[Beer-Lambert] Extinction Coefficient: 0.15/m\n[Beer-Lambert] Transmittance over 2m: 0.7408\n[Beer-Lambert] Transmittance over 5m: 0.4724\n[Beer-Lambert] Transmittance over 15m: 0.1054",
      "check": {
        "question": "What mathematical formula describes the exponential attenuation of light through participating media in the Beer-Lambert Law?",
        "options": [
          "T = exp(-sigma_t * d), where sigma_t is the extinction coefficient and d is the distance traveled through the media.",
          "T = 1.0 - sigma_t * d / 2.0.",
          "T = sigma_t * d^2.",
          "T = log(sigma_t + d)."
        ],
        "answer": 0,
        "answerIndex": 0,
        "why": "The Beer-Lambert law dictates that light intensity decreases exponentially as a function of the extinction coefficient and traveled distance."
      }
    },
    {
      "part": 4,
      "title": "Front-to-Back Volume Ray Marching & In-Scatter Integration",
      "say": [
        "Now that each froxel in our 3D volume contains its injected in-scattered light (L_in) and extinction coefficient (sigma_t), the engine must calculate the total accumulated light reaching the camera along every viewing ray. This is accomplished in Pass 2: The Volumetric Integration Pass.",
        "In classical rendering, integrating along a ray meant stepping through space from the camera to the surface, sampling lighting at every step. In a froxel pipeline, we perform this integration in a single, lightning-fast compute pass running along the depth columns of the 3D froxel texture!",
        "Consider the physical analogy of an accountant auditing a stack of fifty semi-transparent receipts placed one on top of the other inside a glass display case. To determine the net cumulative visibility of all fifty receipts, the auditor does not take them out and re-read them one by one for every customer who visits the museum. Instead, the auditor performs a single running scan from front to back: Receipt 1 has 80% opacity and adds $10; Receipt 2 adds $15 through the remaining 20% visibility; and so forth. The running total is precomputed and recorded in a single ledger column.",
        "In our WebGPU compute pass, a compute kernel dispatches one thread per (X, Y) column of the froxel grid (e.g. 160 x 90 = 14,400 threads). Thread (x, y) maintains two running accumulation registers: accumulated_light (initialized to vec3(0.0)) and net_transmittance (initialized to 1.0).",
        "The thread loops through depth slices from z = 0 (near plane) to z = 63 (far plane). At each slice, it loads the froxel's in-scattered light and extinction. It calculates the step distance Delta_d between the current slice depth and the previous slice depth. Using the Beer-Lambert law, slice transmittance is T_slice = exp(-sigma_t * Delta_d).",
        "The thread updates its registers: it adds the slice's in-scattered light scaled by the current net_transmittance (accumulated_light += in_scatter * net_transmittance), and then multiplies the running transmittance by the slice transmittance (net_transmittance *= T_slice). It writes { rgb: accumulated_light, a: net_transmittance } into an Integrated 3D Froxel Texture (`texture_storage_3d<rgba16float>`).",
        "At the conclusion of this single compute pass, every froxel in the entire 3D volume stores the exact pre-integrated atmospheric light and transmittance from the camera lens to that specific point in space! Sampling volumetric lighting at any arbitrary 3D position in the scene now requires a single trilinear texture lookup.",
        "To achieve mathematically rigorous integration across exponential density gradients, modern kernels utilize Closed-Form Analytical Step Integration. Instead of assuming in-scattered light is constant across the entire slice interval Delta_d, the integral of L_in(s) * exp(-sigma_t * s) is solved analytically over the step interval: L_slice = L_in * (1.0 - exp(-sigma_t * Delta_d)) / sigma_t. This closed-form integration eliminates discretization stepping error, ensuring flawless convergence even across coarse depth slices.",
        "Additionally, memory bandwidth during the integration pass is streamlined using workgroup shared memory. A single compute workgroup of 64 threads processes 64 consecutive depth slices for a column in parallel, using prefix scan reductions to evaluate cumulative transmittance. This collapses the integration pass into sub-microsecond execution times on modern GPU hardware.",
        "Furthermore, the integrated 3D froxel texture is bound as a hardware trilinear sampler in subsequent render passes. Because WebGPU hardware texture samplers execute trilinear filtering in silicon across both screen space and depth slices, sampling the integrated volume at any world position incurs zero ALU cost, enabling seamless integration with particle effects and transparent alpha surfaces.",
        "In the TypeScript snippet below, we implement the `VolumetricRayAccumulator`. We execute the running front-to-back integration loop over consecutive volume slices and compute cumulative light and final net transmittance.",
        "Notice how four volume slices integrate into 0.6948 accumulated light with 0.4096 remaining transmittance. We now composite this volume onto our scene geometry."
      ],
      "example": "An accountant scanning through a stack of semi-transparent receipts in a single front-to-back pass to calculate cumulative visibility.",
      "code": "interface VolumeStep {\n  inScatteredLight: number;\n  transmittance: number;\n}\n\nclass VolumetricRayAccumulator {\n  static integrate(steps: VolumeStep[]): { accumulatedLight: number; finalTransmittance: number } {\n    let accLight = 0;\n    let netTransmittance = 1.0;\n\n    for (const step of steps) {\n      accLight += step.inScatteredLight * netTransmittance;\n      netTransmittance *= step.transmittance;\n    }\n\n    return {\n      accumulatedLight: parseFloat(accLight.toFixed(4)),\n      finalTransmittance: parseFloat(netTransmittance.toFixed(4))\n    };\n  }\n}\n\nconst slices: VolumeStep[] = [\n  { inScatteredLight: 0.25, transmittance: 0.8 },\n  { inScatteredLight: 0.30, transmittance: 0.8 },\n  { inScatteredLight: 0.20, transmittance: 0.8 },\n  { inScatteredLight: 0.15, transmittance: 0.8 }\n];\n\nconst result = VolumetricRayAccumulator.integrate(slices);\nconsole.log(`[Volumetric Integration] Step Count: ${slices.length}`);\nconsole.log(`[Volumetric Integration] Total In-Scattered Light: ${result.accumulatedLight}`);\nconsole.log(`[Volumetric Integration] Final Net Transmittance: ${result.finalTransmittance}`);",
      "output": "[Volumetric Integration] Step Count: 4\n[Volumetric Integration] Total In-Scattered Light: 0.6948\n[Volumetric Integration] Final Net Transmittance: 0.4096",
      "check": {
        "question": "How does the column-wise froxel integration pass evaluate cumulative light and transmittance along each viewing ray?",
        "options": [
          "By marching front-to-back across depth slices, adding in-scattered light scaled by running transmittance, and multiplying running transmittance by slice transmittance.",
          "By sorting all scene triangles in back-to-front order and rasterizing them with additive blending.",
          "By shooting random Monte Carlo rays from each froxel into the sky hemisphere.",
          "By copying the 2D depth buffer directly into the screen-space reflection texture."
        ],
        "answer": 0,
        "answerIndex": 0,
        "why": "Front-to-back integration uses the Beer-Lambert law to accumulate radiance while tracking residual transmittance along the column ray."
      }
    },
    {
      "part": 5,
      "title": "Temporal Accumulation, Bilateral Upsampling & Full-Resolution Compositing",
      "say": [
        "We now reach the final stage of our volumetric lighting pipeline: Bilateral Upsampling, Temporal Accumulation, and Full-Resolution Compositing. Our integrated froxel volume was computed at a downscaled resolution (160 x 90 x 64). If we sampled this low-resolution volume directly onto our 4K or 1080p geometry using naive bilinear interpolation, a severe visual artifact would emerge: Edge Bleeding (Light Leaking). Bright fog from a distant sun shaft would bleed across the silhouette of a dark foreground character, creating blurry glowing halos around character edges.",
        "To achieve crisp, artifact-free volumetric fog, the compositing pass deploys Depth-Aware Bilateral Upsampling and Temporal Accumulation.",
        "Consider the physical analogy of a stained-glass window artisan restoring a cathedral rose window. The artisan does not slap a wide roller of translucent varnish indiscriminately across delicate lead frames and colored glass pieces! If the varnish crossed lead boundaries, dark shadows would wash out into the bright glass. Instead, the artisan carefully inspects the physical boundaries of each pane: applying varnish smoothly across the glass, but stopping cleanly at the lead frame. Bilateral upsampling operates with this exact geometric discipline.",
        "During the full-resolution post-processing composite pass, a compute shader processes each screen pixel (u, v). It reads the pixel's full-resolution depth z_full from the G-Buffer. It then inspects the four surrounding froxel columns. For each candidate froxel, it compares the froxel's depth slice against z_full. If the candidate froxel depth differs significantly from the geometry depth (|z_froxel - z_full| > epsilon), that candidate is rejected or down-weighted in the bilateral kernel! Only froxels that share the same geometric surface plane contribute to the composite, completely eliminating edge bleeding.",
        "Next, Temporal Accumulation is applied across frames: using the TAA motion vectors generated on Day 36, the current froxel volume is blended with the historical froxel volume (alpha = 0.15). This temporal filter smooths out any stepping artifacts and eliminates shadow map aliasing inside volumetric light shafts.",
        "Finally, the integrated fog color is blended over the HDR scene color using the alpha channel transmittance: C_final = C_scene * T_fog + C_fog. Deep valleys, smoky corridors, and sunlit dust motes appear with cinematic atmospheric depth.",
        "When compositing volumetric fog over translucent surfaces\u2014such as glass windows, water surfaces, or particle fire\u2014the render graph carefully orders pass execution. Opaque geometry is shaded first, volumetric fog is composited over opaque surfaces, and translucent forward-shaded materials are rendered subsequently with volumetric fog sampled at their local depth coordinates. This ensures that a glass window properly displays volumetric fog behind it while receiving ambient lighting on its front face.",
        "In high-end architectural and cinematic presentations, volumetric fog compositing includes Chromatic Dispersion. By slightly offsetting the sampling coordinates for red, green, and blue light channels according to atmospheric wavelength refractions, thick smoke and localized steam plumes produce subtle, photorealistic chromatic edges around high-intensity searchlights.",
        "Volumetric fog also directly influences HDR exposure and tonemapping. Because in-scattered light adds positive radiance across the entire frame, scene average luminance rises, which causes adaptive auto-exposure systems to adjust target exposure downward. To maintain consistent exposure between clear and foggy environments, modern post-processing graphs calculate exposure metering either before volumetric compositing or by subtracting an estimated ambient atmospheric baseplate from luminance histograms.",
        "Finally, production engines continuously monitor performance scaling on mobile and integrated GPUs. If frame presentation time spikes, the engine dynamically downsamples the froxel grid from 160 x 90 x 64 to 80 x 45 x 32, relying on temporal reprojection to preserve visual sharpness while cutting VRAM usage to less than two megabytes.",
        "In the TypeScript snippet below, we construct the `VolumetricQualityAuditor`. We measure compute pass execution times, evaluate bilateral depth rejection, and certify 60 FPS compliance.",
        "Notice how total volumetric execution completes in just 2.2 milliseconds, well within the 3.0ms budget. Tomorrow, in Day 39, we explore Compute-Driven Depth of Field (DoF) and Bokeh Sprites!"
      ],
      "example": "A stained-glass window restorer applying translucent varnish smoothly across glass panes while strictly respecting dark lead boundary frames.",
      "code": "interface VolumetricMetrics {\n  froxelComputeMs: number;\n  upsampleCompositeMs: number;\n  edgeBleedArtifactsDetected: boolean;\n}\n\nclass VolumetricQualityAuditor {\n  static audit(metrics: VolumetricMetrics): { totalMs: number; withinBudget: boolean; passedQuality: boolean } {\n    const totalMs = parseFloat((metrics.froxelComputeMs + metrics.upsampleCompositeMs).toFixed(2));\n    const withinBudget = totalMs <= 3.0; // Under 3ms budget\n    const passedQuality = withinBudget && !metrics.edgeBleedArtifactsDetected;\n    return { totalMs, withinBudget, passedQuality };\n  }\n}\n\nconst metrics: VolumetricMetrics = {\n  froxelComputeMs: 1.62,\n  upsampleCompositeMs: 0.58,\n  edgeBleedArtifactsDetected: false\n};\n\nconst audit = VolumetricQualityAuditor.audit(metrics);\nconsole.log(`[Volumetric Audit] Total Pass Execution Time: ${audit.totalMs} ms`);\nconsole.log(`[Volumetric Audit] Within 3ms Budget: ${audit.withinBudget}`);\nconsole.log(`[Volumetric Audit] Production Quality Certified: ${audit.passedQuality}`);",
      "output": "[Volumetric Audit] Total Pass Execution Time: 2.2 ms\n[Volumetric Audit] Within 3ms Budget: true\n[Volumetric Audit] Production Quality Certified: true",
      "check": {
        "question": "Why is depth-aware bilateral upsampling critical when compositing low-resolution froxel volumes onto full-resolution geometry?",
        "options": [
          "It compares geometry depth with froxel depth to prevent bright background fog from bleeding across foreground character silhouettes.",
          "It doubles the resolution of the G-Buffer normal texture.",
          "It converts the volumetric fog into a 2D particle system.",
          "It enables ray tracing on graphics cards that lack RT cores."
        ],
        "answer": 0,
        "answerIndex": 0,
        "why": "Bilateral depth weighting rejects froxel samples that sit across depth discontinuities, completely preventing light bleeding and halo artifacts."
      }
    }
  ],
  "projectStep": {
    "title": "Implement Real-Time Volumetric Fog & Froxel Light Scattering",
    "steps": [
      "Allocate 3D froxel textures with logarithmic depth slice distribution.",
      "Inject spotlight and shadow-occluded directional light into froxels using Henyey-Greenstein scattering.",
      "Execute the front-to-back pre-integration compute pass with Beer-Lambert transmittance.",
      "Composite integrated volumetric lighting using depth-aware bilateral upsampling and TAA reprojection."
    ]
  },
  "summary": [
    "Participating media introduces absorption, out-scattering, and in-scattering, creating volumetric fog and dramatic god rays.",
    "Frustum-Aligned Voxel Grids (Froxels) organize VRAM along camera perspective geometry with logarithmic depth clustering.",
    "The Henyey-Greenstein phase function models Mie forward scattering, producing brilliant halos around bright light sources.",
    "Beer-Lambert exponential transmittance and in-scattering are pre-integrated in a single column-wise compute pass.",
    "Depth-aware bilateral upsampling and temporal accumulation eliminate edge bleeding, delivering cinema-grade volumetric lighting at 60 FPS."
  ]
}
