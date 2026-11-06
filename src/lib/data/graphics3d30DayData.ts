import { buildEnrichedDayQuests, DayConfig } from './curriculumEnricher';
import { CourseQuest } from './coursesData';

export const GRAPHICS_3D_30_DAYS_CONFIGS: DayConfig[] = [
  {
    "day": 1,
    "title": "The Programmable GPU Pipeline & Matrix Transformations",
    "desc": "Master 3D rendering pipeline stages, coordinate space transitions (Local $\\to$ World $\\to$ View $\\to$ Clip $\\to$ NDC $\\to$ Screen), and GPU rasterization.",
    "syllabus": [
      "The 3D Coordinate Space Pipeline (Local, World, View/Camera, Homogeneous Clip, Normalized Device Coordinates NDC, Screen Viewport).",
      "GPU Programmable Pipeline Stages: Vertex Shader $\\to$ Primitive Assembly $\\to$ Rasterization $\\to$ Fragment Shader $\\to$ Depth/Stencil Test.",
      "Right-Handed (OpenGL/WebGL) vs Left-Handed (DirectX/Unity) coordinate systems."
    ],
    "eTitle": "Coordinate Space Transformer Pipeline",
    "eDesc": "Implement function transformLocalToNdc(localPoint, modelMatrix, viewMatrix, projectionMatrix) multiplying matrices with homogenous divide ($W$).",
    "eStarter": "function transformLocalToNdc(point, m, v, p) {\n  // TODO: Compute projection * view * model * point and perform perspective divide by W.\n  \n}",
    "eHint": "Compute projection * view * model * point and perform perspective divide by W.",
    "eTest": "const ndc = transformLocalToNdc([2.0, 4.0, 5.0], {}, {}, {});\nif (ndc[0] !== 0.2 || ndc[1] !== 0.4) throw new Error('NDC transformation failed');",
    "aTitle": "Aspect Ratio Calculator",
    "aDesc": "Implement function calculateAspectRatio(width, height) returning `width / height` rounded to 3 decimal places.",
    "aStarter": "function calculateAspectRatio(w, h) {\n  // TODO: Compute w / h.\n  \n}",
    "aHint": "Compute w / h.",
    "aTest": "if (calculateAspectRatio(1920, 1080) !== 1.778) throw new Error('Aspect ratio failed');"
  },
  {
    "day": 2,
    "title": "PBR Shading, Shadow Mapping & WebGPU Architecture",
    "desc": "Initialize WebGL2 rendering contexts, configure clear colors, depth buffers, viewport aspect ratios, and handle canvas resize device pixel ratios (DPR).",
    "syllabus": [
      "WebGL2 (`HTMLCanvasElement.getContext('webgl2')`) capabilities.",
      "Viewport configuration (`gl.viewport(0, 0, width, height)`) & Device Pixel Ratio (Retina DPR scaling).",
      "Depth Buffer (`gl.enable(gl.DEPTH_TEST)`) & Double Buffering."
    ],
    "eTitle": "High-DPI Retina Canvas Viewport Scaler",
    "eDesc": "Implement function configureRetinaCanvas(displayWidth, displayHeight, devicePixelRatio = 2) calculating exact internal canvas buffer dimensions and CSS styles.",
    "eStarter": "function configureRetinaCanvas(width, height, dpr = 2) {\n  // TODO: Scale buffer dimensions by DPR while preserving CSS display size.\n  \n}",
    "eHint": "Scale buffer dimensions by DPR while preserving CSS display size.",
    "eTest": "const canvas = configureRetinaCanvas(800, 600, 2);\nif (canvas.bufferWidth !== 1600 || canvas.bufferHeight !== 1200) throw new Error('Retina buffer scaling failed');\nif (canvas.totalPixels !== 1920000) throw new Error('Pixel count calculation failed');",
    "aTitle": "RGBA Normalized Color Converter",
    "aDesc": "Implement function rgbToGlColor(r255, g255, b255, a1 = 1.0) returning `[r/255, g/255, b/255, a1]`.",
    "aStarter": "function rgbToGlColor(r, g, b, a = 1.0) {\n  // TODO: Divide 0-255 values by 255.\n  \n}",
    "aHint": "Divide 0-255 values by 255.",
    "aTest": "const c = rgbToGlColor(255, 128, 0);\nif (c[0] !== 1.0 || c[1] !== 0.502 || c[2] !== 0) throw new Error('GL color convert failed');"
  },
  {
    "day": 3,
    "title": "Advanced Graphics & Compute: Skeletal Skinning, SSAO, GPU Particles, HDR Tone Mapping & BVH",
    "desc": "Master 3D spatial vectors: Magnitude, normalization, Dot Products ($A \\cdot B = |A| |B| \\cos\\theta$) for lighting angles, and Cross Products ($A \\times B$) for perpendicular surface normals.",
    "syllabus": [
      "Vector Normalization: $\\hat{v} = \\frac{v}{\\|v\\|}$ preventing distorted lighting calculations.",
      "Dot Product ($A \\cdot B = x_1 x_2 + y_1 y_2 + z_1 z_2$): Determining perpendicular ($=0$), acute ($>0$), and obtuse ($<0$) angular alignment.",
      "Cross Product ($A \\times B$): Generating perpendicular surface normal vectors for polygon triangles."
    ],
    "eTitle": "Surface Normal Generator via Cross Product",
    "eDesc": "Implement function computeTriangleNormal(p0, p1, p2) calculating normalized surface normal vector perpendicular to triangle vertices.",
    "eStarter": "function computeTriangleNormal(p0, p1, p2) {\n  // TODO: Compute edge vectors, cross product, and divide by magnitude.\n  \n}",
    "eHint": "Compute edge vectors, cross product, and divide by magnitude.",
    "eTest": "const p0 = [0, 0, 0], p1 = [1, 0, 0], p2 = [0, 1, 0]; // XY plane triangle\nconst n = computeTriangleNormal(p0, p1, p2);\nif (n[0] !== 0 || n[1] !== 0 || n[2] !== 1) throw new Error('Surface normal should point straight up along +Z');",
    "aTitle": "3D Vector Dot Product Calculator",
    "aDesc": "Implement function dotProduct3D(a, b) returning `a[0]*b[0] + a[1]*b[1] + a[2]*b[2]`.",
    "aStarter": "function dotProduct3D(a, b) {\n  // TODO: Sum products of components.\n  \n}",
    "aHint": "Sum products of components.",
    "aTest": "if (dotProduct3D([1, 0, 0], [0, 1, 0]) !== 0) throw new Error('Perpendicular dot product failed');"
  },
  {
    "day": 4,
    "title": "Advanced WebGPU Multi-Pass Render Pipelines, Clustered Shading & Compute Physics",
    "desc": "Construct and compose 4x4 affine transformation matrices: Translation ($T$), Scale ($S$), Euler Rotations ($R_x, R_y, R_z$), and understand Non-Commutative Matrix Order ($M = T \\times R \\times S$).",
    "syllabus": [
      "Homogeneous Coordinates ($4 \\times 4$ matrices representing 3D spatial points with $W=1$).",
      "Transformation Matrix Order: $M = T \\times R \\times S$ (Scale first, Rotate second, Translate last).",
      "Matrix Multiplication non-commutativity ($A \\times B \\ne B \\times A$)."
    ],
    "eTitle": "4x4 Matrix TRS Translation & Scale Composer",
    "eDesc": "Implement function createTRSMatrix(tx, ty, tz, sx, sy, sz) returning column-major 16-element Float32Array.",
    "eStarter": "function createTRSMatrix(tx, ty, tz, sx, sy, sz) {\n  // TODO: Place scale values on diagonal (0, 5, 10), translation values in column 3 (12, 13, 14), and 1 at (15).\n  \n}",
    "eHint": "Place scale values on diagonal (0, 5, 10), translation values in column 3 (12, 13, 14), and 1 at (15).",
    "eTest": "const mat = createTRSMatrix(10, 20, 30, 2, 3, 4);\nif (mat[0] !== 2 || mat[5] !== 3 || mat[10] !== 4) throw new Error('Scale components incorrect');\nif (mat[12] !== 10 || mat[13] !== 20 || mat[14] !== 30) throw new Error('Translation components incorrect');",
    "aTitle": "Identity Matrix Generator",
    "aDesc": "Implement function getIdentityMatrix4x4() returning 16-element identity array. When called with `queryItem`, return `{ items, count, includesItem }`.",
    "aStarter": "function getIdentityMatrix4x4(queryItem) {\n  // TODO: Return [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1] when queryItem is undefined, or { items, count, includesItem: items.includes(queryItem) }\n  \n}",
    "aHint": "Define items = [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]. If queryItem === undefined return items; else return { items, count: items.length, includesItem: items.includes(queryItem) }.",
    "aTest": "const list = getIdentityMatrix4x4();\nif (!Array.isArray(list) || list.length !== 16) throw new Error('Expected array of length 16');\nconst found = getIdentityMatrix4x4(1);\nconst missing = getIdentityMatrix4x4('NON_EXISTENT_ELEMENT_XYZ');\nif (!found.includesItem || missing.includesItem || found.count !== 16) throw new Error('Parameterized array membership check failed');"
  },
  {
    "day": 5,
    "title": "Hardware WebGPU Ray Tracing, Compute Particles, SSGI & Volumetric Atmosphere",
    "desc": "Milestone 1: Build a complete WebGL interactive camera matrix engine: Orbit controls (Yaw, Pitch, Distance), View Matrix construction ($M_{\\text{view}} = \\text{LookAt}$), Model-View matrix chaining, and smooth arcball damping.",
    "syllabus": [
      "Camera LookAt Matrix: Eye position, Target look point, and Up vector.",
      "Spherical Coordinate Conversion: $\\theta$ (Yaw), $\\phi$ (Pitch), $r$ (Distance) to Cartesian $(x, y, z)$.",
      "Pitch Clamping ($[-89^\\circ, +89^\\circ]$) preventing camera gimbal flip."
    ],
    "eTitle": "Spherical Orbit Camera Position Calculator",
    "eDesc": "Implement function calculateOrbitEyePosition(target, yawRad, pitchRad, distance) returning 3D camera eye coordinates.",
    "eStarter": "function calculateOrbitEyePosition(target, yaw, pitch, radius) {\n  // TODO: Compute x = r*cos(pitch)*sin(yaw), y = r*sin(pitch), z = r*cos(pitch)*cos(yaw) relative to target.\n  \n}",
    "eHint": "Compute x = r*cos(pitch)*sin(yaw), y = r*sin(pitch), z = r*cos(pitch)*cos(yaw) relative to target.",
    "eTest": "const eye = calculateOrbitEyePosition([0, 0, 0], 0, 0, 10.0); // Facing straight down -Z\nif (eye[0] !== 0 || eye[1] !== 0 || eye[2] !== 10) throw new Error('Orbit camera eye position calculation failed');",
    "aTitle": "Degrees to Radians Converter",
    "aDesc": "Implement function degToRad(deg) returning `deg * (Math.PI / 180)`.",
    "aStarter": "function degToRad(deg) {\n  // TODO: Multiply by PI / 180.\n  \n}",
    "aHint": "Multiply by PI / 180.",
    "aTest": "if (degToRad(180) !== 3.1416) throw new Error('Deg to Rad failed');"
  },
  {
    "day": 6,
    "title": "Advanced Lighting & Global Illumination: Spherical Harmonics, Irradiance Probes & LPV",
    "desc": "Project 3D world points onto 2D screens: Field of View (FOV), Near/Far clipping planes, Perspective Frustum matrix math, and homogeneous divide.",
    "syllabus": [
      "Perspective Projection Matrix formula ($f = 1 / \\tan(\\text{FOV}_y / 2)$).",
      "Aspect Ratio correction ($x_{\\text{scale}} = f / \\text{aspect}$).",
      "Near / Far Depth Precision mapping ($Z_{\\text{NDC}} \\in [-1, +1]$ in WebGL)."
    ],
    "eTitle": "Perspective Projection Matrix Builder",
    "eDesc": "Implement function createPerspectiveMatrix(fovyRad, aspect, zNear, zFar) returning column-major 16-element Float32Array.",
    "eStarter": "function createPerspectiveMatrix(fovy, aspect, near, far) {\n  // TODO: Compute focal length f = 1/tan(fovy/2), set (0,0)=f/aspect, (1,1)=f, (2,2)=(far+near)/(near-far), (2,3)=-1.\n  \n}",
    "eHint": "Compute focal length f = 1/tan(fovy/2), set (0,0)=f/aspect, (1,1)=f, (2,2)=(far+near)/(near-far), (2,3)=-1.",
    "eTest": "const proj = createPerspectiveMatrix(Math.PI / 4, 1.0, 0.1, 100.0); // 45 deg FOV\nif (proj[5] < 2.41 || proj[5] > 2.42) throw new Error('Perspective focal length calculation incorrect');\nif (proj[11] !== -1) throw new Error('Homogeneous W divider must be -1');",
    "aTitle": "Horizontal FOV Calculator",
    "aDesc": "Implement function calculateFovX(fovyRad, aspect) returning `2 * Math.atan(Math.tan(fovy/2) * aspect)`.",
    "aStarter": "function calculateFovX(fovy, a) {\n  // TODO: Compute 2 * atan(tan(fovy/2) * aspect).\n  \n}",
    "aHint": "Compute 2 * atan(tan(fovy/2) * aspect).",
    "aTest": "const __chk = calculateFovX(1.0, 1.778);\nif (__chk === undefined || __chk === null || Number.isNaN(__chk)) throw new Error('Function must return a valid result');\nif (calculateFovX(1.0, 1.778) < 1.4) throw new Error('FOV X calc failed');"
  },
  {
    "day": 7,
    "title": "Advanced Shadow Techniques: Cascaded Shadow Maps (CSM), Virtual Shadow Maps (VSM) & PCSS",
    "desc": "Write OpenGL Shading Language (GLSL) code: Attributes, Uniforms, Varyings, Vertex position transforms (`gl_Position`), and Fragment color outputs (`gl_FragColor` / `fragColor`).",
    "syllabus": [
      "GLSL Types: `vec2`, `vec3`, `vec4`, `mat4`, `sampler2D`.",
      "Storage Qualifiers: `in` (Attributes per vertex), `uniform` (Global constant per draw call), `out`/`varying` (Interpolated fragment values).",
      "Compilation Pipeline: `gl.createShader()`, `gl.shaderSource()`, `gl.compileShader()`, `gl.attachShader()`, `gl.linkProgram()`."
    ],
    "eTitle": "GLSL Uniform Buffer Binding Layout Generator",
    "eDesc": "Implement function formatGlslUniforms(uniformMap) formatting GLSL uniform declarations and locations.",
    "eStarter": "function formatGlslUniforms(uniforms) {\n  // TODO: Map key-value pairs to 'uniform TYPE NAME;'.\n  \n}",
    "eHint": "Map key-value pairs to 'uniform TYPE NAME;'.",
    "eTest": "const res = formatGlslUniforms({ u_MVP: 'mat4', u_LightPos: 'vec3', u_Color: 'vec4' });\nif (res.count !== 3 || !res.declarations.includes('uniform mat4 u_MVP;')) throw new Error('GLSL uniform format failed');",
    "aTitle": "GLSL Vector Swizzle Simulator",
    "aDesc": "Implement function swizzleVec4(v, pattern = 'xyz') returning reordered array based on swizzle string.",
    "aStarter": "function swizzleVec4(v, p) {\n  // TODO: Map characters to indices 0, 1, 2, 3.\n  \n}",
    "aHint": "Map characters to indices 0, 1, 2, 3.",
    "aTest": "const s = swizzleVec4([10, 20, 30, 40], 'zyx');\nif (s[0] !== 30 || s[1] !== 20 || s[2] !== 10) throw new Error('Swizzle failed');"
  },
  {
    "day": 8,
    "title": "High-Performance GPU Geometry: GPU-Driven Rendering, Mesh Shaders & Draw Indirect",
    "desc": "Stream vertex geometry to the GPU with Vertex Buffer Objects (VBO), Element Buffer Objects (EBO / IBO) for indexed drawing, and Vertex Array Objects (VAO).",
    "syllabus": [
      "VBO Layout: Stride, Offset, Component Count, Normalized flag (`gl.vertexAttribPointer`).",
      "Indexed Drawing (`gl.drawElements` vs `gl.drawArrays`): Eliminating duplicate vertex data by 66%.",
      "VAO State Encapsulation: Binding all attribute pointers and EBO state in a single handle."
    ],
    "eTitle": "Interleaved Vertex Buffer Stride & Offset Calculator",
    "eDesc": "Implement function calculateVertexLayout(attributes) calculating total byte stride and individual byte offsets.",
    "eStarter": "function calculateVertexLayout(attributes) {\n  // TODO: Iterate attributes, multiply size by 4 bytes per float, accumulate stride.\n  \n}",
    "eHint": "Iterate attributes, multiply size by 4 bytes per float, accumulate stride.",
    "eTest": "const res = calculateVertexLayout([{ name: 'pos', size: 3 }, { name: 'norm', size: 3 }, { name: 'uv', size: 2 }]);\nif (res.totalStrideBytes !== 32) throw new Error('Total stride should be 32 bytes (8 floats * 4)');\nif (res.attributes.uv.offset !== 24) throw new Error('UV offset should be 24 bytes');",
    "aTitle": "Triangles to Indices Count Calculator",
    "aDesc": "Implement function getIndexCount(triangleCount) returning `triangleCount * 3`.",
    "aStarter": "function getIndexCount(t) {\n  // TODO: Multiply triangle count by 3.\n  \n}",
    "aHint": "Multiply triangle count by 3.",
    "aTest": "if (getIndexCount(12) !== 36) throw new Error('Index count failed');"
  },
  {
    "day": 9,
    "title": "Real-Time Post-Processing & Temporal Anti-Aliasing (TAA) with Motion Vectors",
    "desc": "Calculate real-time illumination: Ambient, Diffuse (Lambertian cosine law $N \\cdot L$), Specular highlights (Blinn Halfway Vector $N \\cdot H$), and Shininess exponents.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Phong & Blinn-Phong Lighting Models.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Blinn-Phong Lighting Intensity Calculator",
    "eDesc": "Implement function calculateBlinnPhong(normal, lightDir, viewDir, shininess = 32) computing combined Ambient + Diffuse + Specular intensity.",
    "eStarter": "function calculateBlinnPhong(n, l, v, shininess = 32) {\n  // TODO: Compute ambient + diffuse (N·L) + specular (N·H)^shininess.\n  \n}",
    "eHint": "Compute ambient + diffuse (N·L) + specular (N·H)^shininess.",
    "eTest": "const __echk = calculateBlinnPhong([0, 0, 1], [0, 0, 1], [0, 0, 1], 32);\nif (__echk === undefined || __echk === null || Number.isNaN(__echk)) throw new Error('Function must return a valid result');\nconst intensity = calculateBlinnPhong([0, 0, 1], [0, 0, 1], [0, 0, 1], 32);\nif (intensity < 1.25 || intensity > 1.35) throw new Error('Direct light Blinn-Phong calculation failed');",
    "aTitle": "Lambertian Diffuse Intensity Calculator",
    "aDesc": "Implement function getDiffuseIntensity(n, l) returning `Math.max(0, n[0]*l[0] + n[1]*l[1] + n[2]*l[2])`.",
    "aStarter": "function getDiffuseIntensity(n, l) {\n  // TODO: Compute dot product clamped to 0.\n  \n}",
    "aHint": "Compute dot product clamped to 0.",
    "aTest": "if (getDiffuseIntensity([0,1,0], [0,1,0]) !== 1.0) throw new Error('Diffuse calc failed');"
  },
  {
    "day": 10,
    "title": "⭐ Milestone 2 Capstone: Photorealistic GPU-Driven Real-Time Graphics Engine & 3D Master Certification",
    "desc": "Render photorealistic materials using Disney/Cook-Torrance PBR: Albedo (Base Color), Metallic reflection, Roughness scattering, Normal microfacets, and Fresnel Schlick.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Physically Based Rendering (PBR): Metallic-Roughness.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Fresnel-Schlick Specular Reflectance Calculator",
    "eDesc": "Implement function calculateFresnelSchlick(cosTheta, f0 = 0.04) returning reflectance $F = F_0 + (1 - F_0)(1 - \\cos\\theta)^5$.",
    "eStarter": "function calculateFresnelSchlick(cosTheta, f0 = 0.04) {\n  // TODO: Compute f0 + (1 - f0) * pow(1 - cosTheta, 5).\n  \n}",
    "eHint": "Compute f0 + (1 - f0) * pow(1 - cosTheta, 5).",
    "eTest": "const grazing = calculateFresnelSchlick(0.0, 0.04); // Grazing angle (90 deg)\nconst normal = calculateFresnelSchlick(1.0, 0.04);  // Direct head-on (0 deg)\nif (grazing !== 1.0 || normal !== 0.04) throw new Error('Fresnel Schlick calculation incorrect');",
    "aTitle": "Dielectric vs Metallic F0 Resolver",
    "aDesc": "Implement function getF0Reflectance(albedoHex, metallic) returning base reflectance array.",
    "aStarter": "function getF0Reflectance(albedo, metallic) {\n  // TODO: Return dielectric 0.04 vs metallic.\n  \n}",
    "aHint": "Return dielectric 0.04 vs metallic.",
    "aTest": "if (getF0Reflectance('#FFFFFF', 0.0)[0] !== 0.04) throw new Error('F0 resolver failed');"
  },
  {
    "day": 11,
    "title": "Real-Time Volumetric Rendering, Raymarching & Heterogeneous Atmospheric Scattering",
    "desc": "Map 2D bitmaps onto 3D surfaces: UV coordinate unwrapping ($U, V \\in [0, 1]$), Texture wrapping modes (Repeat, Clamp), Trilinear filtering, and GPU Mipmap pyramids.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Texture Mapping, UV Coordinates & Mipmapping.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "UV Tiling & Repeat Coordinate Clamping Engine",
    "eDesc": "Implement function resolveUvCoordinate(u, v, wrapMode = 'REPEAT') mapping out-of-bounds UV coordinates into normalized $[0, 1]$ texture space.",
    "eStarter": "function resolveUvCoordinate(u, v, wrap = 'REPEAT') {\n  // TODO: Modulo for repeat; clamp for clamp-to-edge.\n  \n}",
    "eHint": "Modulo for repeat; clamp for clamp-to-edge.",
    "eTest": "const r = resolveUvCoordinate(2.75, 1.25, 'REPEAT');\nif (r[0] !== 0.75 || r[1] !== 0.25) throw new Error('UV repeat wrapping failed');",
    "aTitle": "Mipmap Level Count Calculator",
    "aDesc": "Implement function calculateMipmapLevels(width, height) returning `1 + Math.floor(Math.log2(Math.max(width, height)))`.",
    "aStarter": "function calculateMipmapLevels(w, h) {\n  // TODO: Compute 1 + floor(log2(max(w, h))).\n  \n}",
    "aHint": "Compute 1 + floor(log2(max(w, h))).",
    "aTest": "if (calculateMipmapLevels(1024, 1024) !== 11) throw new Error('Mipmap level calc failed');"
  },
  {
    "day": 12,
    "title": "Ocean Waves Simulation, FFT & Phillips Spectrum",
    "desc": "Simulate high-resolution surface details without adding polygon geometry: Tangent, Bitangent, Normal (TBN) matrix construction and tangent-space normal perturbations.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Normal Mapping & Tangent Space (TBN Matrix).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "TBN Tangent Space Matrix Builder",
    "eDesc": "Implement function computeTbnMatrix(normal, tangent) calculating orthonormal Tangent-Bitangent-Normal $3 \\times 3$ matrix.",
    "eStarter": "function computeTbnMatrix(n, t) {\n  // TODO: Orthogonalize tangent with Gram-Schmidt, cross product with normal for bitangent.\n  \n}",
    "eHint": "Orthogonalize tangent with Gram-Schmidt, cross product with normal for bitangent.",
    "eTest": "const tbn = computeTbnMatrix([0, 0, 1], [1, 0, 0]);\nif (tbn.bitangent[0] !== 0 || tbn.bitangent[1] !== 1 || tbn.bitangent[2] !== 0) throw new Error('Bitangent calculation failed');",
    "aTitle": "Normal Map RGB-to-Vector Decoder",
    "aDesc": "Implement function decodeNormalMapPixel(r255, g255, b255) returning `[(r/255)*2 - 1, (g/255)*2 - 1, (b/255)*2 - 1]`.",
    "aStarter": "function decodeNormalMapPixel(r, g, b) {\n  // TODO: Convert 0..255 to -1..+1.\n  \n}",
    "aHint": "Convert 0..255 to -1..+1.",
    "aTest": "const n = decodeNormalMapPixel(128, 128, 255); // Standard flat blue normal map\nif (n[2] !== 1.0) throw new Error('Normal decoder failed');"
  },
  {
    "day": 13,
    "title": "Subsurface Scattering (SSS) & Human Skin",
    "desc": "Cast real-time dynamic shadows: 2-Pass Shadow Mapping (Pass 1: Render scene depth from light's perspective into Framebuffer; Pass 2: Compare depth in fragment shader) and Percentage-Closer Filtering (PCF).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Shadow Mapping: Depth Framebuffers & PCF Soft Shadows.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Percentage-Closer Filtering (PCF) Shadow Factor Calculator",
    "eDesc": "Implement function calculatePcfShadow(currentDepth, shadowMap3x3Samples, bias = 0.005) averaging shadow occlusion across $3 \\times 3$ kernel.",
    "eStarter": "function calculatePcfShadow(currentDepth, samples9, bias = 0.005) {\n  // TODO: Count samples where currentDepth - bias > mapDepth; return 1 - (shadows / total).\n  \n}",
    "eHint": "Count samples where currentDepth - bias > mapDepth; return 1 - (shadows / total).",
    "eTest": "const fullyLit = calculatePcfShadow(0.5, [0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8]);\nconst halfShadow = calculatePcfShadow(0.5, [0.2, 0.2, 0.2, 0.2, 0.8, 0.8, 0.8, 0.8, 0.8]);\nif (fullyLit !== 1.0 || halfShadow < 0.5 || halfShadow > 0.6) throw new Error('PCF shadow calculation failed');",
    "aTitle": "Shadow Bias Resolver",
    "aDesc": "Implement function calculateSlopeBias(nDotL, minBias = 0.001, maxBias = 0.005) returning `maxBias * (1 - nDotL) + minBias`.",
    "aStarter": "function calculateSlopeBias(nDotL, minB = 0.001, maxB = 0.005) {\n  // TODO: Scale bias by slope 1 - nDotL.\n  \n}",
    "aHint": "Scale bias by slope 1 - nDotL.",
    "aTest": "if (calculateSlopeBias(1.0) !== 0.001) throw new Error('Bias calc failed');"
  },
  {
    "day": 14,
    "title": "Hardware Ray Tracing Pipelines: DXR, Vulkan KHR & WebGPU Binding",
    "desc": "Elevate visual fidelity with Fullscreen Post-Processing: Offscreen Framebuffer textures, High Dynamic Range (HDR), Brightness threshold extraction, Gaussian blur Bloom, and ACES Filmic Tone Mapping.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Post-Processing: HDR, Bloom & Tone Mapping (ACES).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "ACES Filmic Tone Mapping Curve Evaluator",
    "eDesc": "Implement function applyAcesToneMapping(hdrColor) compressing infinite HDR radiance into LDR $[0, 1]$ screen display range.",
    "eStarter": "function applyAcesToneMapping(hdr) {\n  // TODO: Apply ACES formula per color channel and clamp to [0, 1].\n  \n}",
    "eHint": "Apply ACES formula per color channel and clamp to [0, 1].",
    "eTest": "const ldr = applyAcesToneMapping([2.0, 5.0, 10.0]);\nif (ldr[0] <= 0.8 || ldr[2] > 1.0) throw new Error('ACES tone mapping failed to smoothly compress HDR values');",
    "aTitle": "Luminance Extractor for Bloom Filter",
    "aDesc": "Implement function getLuminance(r, g, b) returning `0.2126*r + 0.7152*g + 0.0722*b`.",
    "aStarter": "function getLuminance(r, g, b) {\n  // TODO: Compute perceptual luminance weights.\n  \n}",
    "aHint": "Compute perceptual luminance weights.",
    "aTest": "if (getLuminance(1, 1, 1) !== 1.0) throw new Error('Luminance calc failed');"
  },
  {
    "day": 15,
    "title": "⭐ Milestone 3 Capstone: Real-Time Cinematic Digital Twin Engine & Grand Master Simulation Certification",
    "desc": "Milestone 2: Build a production 3D graphics engine: Multi-material PBR shading (Metallic-Roughness), Directional Shadow Mapping with PCF, and HDR ACES Tone Mapping post-processing pipeline.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of ⭐ MILESTONE 2: Complete PBR Deferred Rendering & Post-Processing Engine.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "PBR Master Material Shader Pipeline",
    "eDesc": "Implement function renderPbrFragment(albedo, metallic, roughness, lightIntensity, isShadowed) computing final tone-mapped RGB pixel output.",
    "eStarter": "function renderPbrFragment(albedo, metallic, roughness, light, isShadowed) {\n  // TODO: Modulate albedo by roughness, lighting, and shadow multiplier.\n  \n}",
    "eHint": "Modulate albedo by roughness, lighting, and shadow multiplier.",
    "eTest": "const res = renderPbrFragment([0.8, 0.5, 0.2], 0.0, 0.2, 1.0, false);\nif (res.status !== 'PBR_FRAGMENT_RENDER_SUCCESS' || res.shadedRgb[0] !== 0.72) throw new Error('Milestone 2 PBR pipeline failed');",
    "aTitle": "Material ID Classifier",
    "aDesc": "Implement function classifyMaterial(metallic, roughness) returning label string.",
    "aStarter": "function classifyMaterial(m, r) {\n  // TODO: Classify based on metallic and roughness.\n  \n}",
    "aHint": "Classify based on metallic and roughness.",
    "aTest": "if (classifyMaterial(0.9, 0.1) !== 'CHROME_MIRROR') throw new Error('Material class failed');"
  },
  {
    "day": 16,
    "title": "Skeletal Rigging: Bone Hierarchies & Joint Matrices",
    "desc": "Rig 3D character avatars for animation: Forward Kinematics (FK), Parent-Child Bone Hierarchies, Local Joint Transforms, and World Bone Matrix cascades ($M_{\\text{world}} = M_{\\text{parent}} \\times M_{\\text{local}}$).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Skeletal Rigging: Bone Hierarchies & Joint Matrices.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Bone Hierarchy Transform Cascader",
    "eDesc": "Implement function cascadeBoneTransforms(boneHierarchy) multiplying child local transforms by parent world matrices down the kinematic tree.",
    "eStarter": "function cascadeBoneTransforms(bones) {\n  // TODO: Traverse tree, adding local position to parent world position.\n  \n}",
    "eHint": "Traverse tree, adding local position to parent world position.",
    "eTest": "const bones = [{ name: 'Hips', parent: null, localPos: [0, 1.0, 0] }, { name: 'Spine', parent: 'Hips', localPos: [0, 0.5, 0] }, { name: 'Head', parent: 'Spine', localPos: [0, 0.3, 0] }];\nconst res = cascadeBoneTransforms(bones);\nif (res.Head[1] !== 1.8) throw new Error('Kinematic bone hierarchy cascade failed');",
    "aTitle": "Bone Depth Counter",
    "aDesc": "Implement function getBoneDepth(boneName, parentMap) returning integer depth in hierarchy.",
    "aStarter": "function getBoneDepth(b, map) {\n  // TODO: Traverse parent pointers and count depth.\n  \n}",
    "aHint": "Traverse parent pointers and count depth.",
    "aTest": "if (getBoneDepth('Head', { Head: 'Spine', Spine: 'Hips' }) !== 2) throw new Error('Bone depth failed');"
  },
  {
    "day": 17,
    "title": "Linear Blend Skinning (LBS) & Inverse Bind Matrices",
    "desc": "Deform character 3D mesh vertices smoothly with skeletal bones: Linear Blend Skinning (LBS: $\\sum w_i M_i P$), 4-Bone Weights per vertex (normalized to 1.0), and Inverse Bind Pose Matrices ($M_{\\text{bind}}^{-1}$).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Linear Blend Skinning (LBS) & Inverse Bind Matrices.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Linear Blend Skinning (LBS) Vertex Deformer",
    "eDesc": "Implement function deformSkinVertex(basePos, boneIndices4, boneWeights4, boneWorldMatrices) blending vertex position across up to 4 influencing bones.",
    "eStarter": "function deformSkinVertex(basePos, indices, weights, matrices) {\n  // TODO: Weighted sum of basePos transformed by each bone matrix.\n  \n}",
    "eHint": "Weighted sum of basePos transformed by each bone matrix.",
    "eTest": "const mats = [[0, 0, 0], [0, 2.0, 0]]; // Bone 0 static, Bone 1 lifted 2 units\nconst skinned = deformSkinVertex([0, 1.0, 0], [0, 1, 0, 0], [0.5, 0.5, 0, 0], mats); // 50/50 blend\nif (skinned[1] !== 2.0) throw new Error('LBS 50/50 vertex blending calculation failed');",
    "aTitle": "Skin Weight Normalizer",
    "aDesc": "Implement function normalizeWeights4(w) returning array summing exactly to 1.0.",
    "aStarter": "function normalizeWeights4(w) {\n  // TODO: Divide each weight by sum.\n  \n}",
    "aHint": "Divide each weight by sum.",
    "aTest": "const nw = normalizeWeights4([2, 2, 0, 0]);\nif (nw[0] !== 0.5 || nw[1] !== 0.5) throw new Error('Weight norm failed');"
  },
  {
    "day": 18,
    "title": "Inverse Kinematics (IK): FABRIK & CCD Algorithms",
    "desc": "Position avatar limbs automatically onto targets (e.g. feet on uneven terrain, hand grabbing a coffee mug): Forward And Backward Reaching Inverse Kinematics (FABRIK) and Cyclic Coordinate Descent (CCD).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Inverse Kinematics (IK): FABRIK & CCD Algorithms.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "FABRIK 2D/3D Inverse Kinematics 2-Bone Solver",
    "eDesc": "Implement function solveFabrik2Bone(root, joint, effector, target, length1 = 1.0, length2 = 1.0) calculating updated joint position to reach target.",
    "eStarter": "function solveFabrik2Bone(root, joint, effector, target, l1 = 1.0, l2 = 1.0) {\n  // TODO: Compute distance to target and compare with total arm length (l1 + l2).\n  \n}",
    "eHint": "Compute distance to target and compare with total arm length (l1 + l2).",
    "eTest": "const res = solveFabrik2Bone([0, 0, 0], [0, 1, 0], [0, 2, 0], [0, 1.5, 0], 1.0, 1.0);\nif (!res.targetReachable || res.status !== 'IK_TARGET_REACHED') throw new Error('FABRIK reachability test failed');",
    "aTitle": "Distance 3D Calculator",
    "aDesc": "Implement function distance3D(p1, p2) returning Euclidean distance.",
    "aStarter": "function distance3D(a, b) {\n  // TODO: Compute sqrt(dx^2 + dy^2 + dz^2).\n  \n}",
    "aHint": "Compute sqrt(dx^2 + dy^2 + dz^2).",
    "aTest": "if (distance3D([0,0,0], [3,4,0]) !== 5.0) throw new Error('Distance calc failed');"
  },
  {
    "day": 19,
    "title": "Keyframe Animation & Quaternion Slerp Interpolation",
    "desc": "Animate avatar joints without Gimbal Lock: Quaternions ($q = w + xi + yj + zk$), Keyframe tracks, Linear Interpolation (LERP) for position, and Spherical Linear Interpolation (SLERP) for rotations.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Keyframe Animation & Quaternion Slerp Interpolation.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Quaternion Spherical Linear Interpolation (SLERP)",
    "eDesc": "Implement function slerpQuaternion(q1, q2, t) interpolating smoothly along the shortest spherical rotation path.",
    "eStarter": "function slerpQuaternion(q1, q2, t) {\n  // TODO: Handle shortest path dot < 0, compute spherical weights w1 and w2.\n  \n}",
    "eHint": "Handle shortest path dot < 0, compute spherical weights w1 and w2.",
    "eTest": "const qA = [0, 0, 0, 1]; // Identity\nconst qB = [0, 0.7071, 0, 0.7071]; // 90 deg Y rotation\nconst qMid = slerpQuaternion(qA, qB, 0.5); // 45 deg Y rotation\nif (qMid[1] < 0.38 || qMid[1] > 0.39 || qMid[3] < 0.92 || qMid[3] > 0.93) throw new Error('Quaternion SLERP midpoint calculation failed');",
    "aTitle": "Linear Interpolation (LERP) Calculator",
    "aDesc": "Implement function lerp(a, b, t) returning `a + t * (b - a)`.",
    "aStarter": "function lerp(a, b, t) {\n  // TODO: Compute a + t * (b - a).\n  \n}",
    "aHint": "Compute a + t * (b - a).",
    "aTest": "if (lerp(10, 20, 0.5) !== 15.0) throw new Error('LERP failed');"
  },
  {
    "day": 20,
    "title": "Animation State Machines & Cross-Fade Blending",
    "desc": "Build smooth transitions between character motions (Idle $\\to$ Walk $\\to$ Run $\\to$ Jump): Hierarchical Animation State Machines, Normalized blend weights, and Cross-Fade duration timers.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Animation State Machines & Cross-Fade Blending.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Animation State Machine Cross-Fade Evaluator",
    "eDesc": "Implement function evaluateAnimationCrossfade(sourceAnim, targetAnim, transitionDurationSec, elapsedSec) returning normalized blend weights.",
    "eStarter": "function evaluateAnimationCrossfade(fromClip, toClip, duration, elapsed) {\n  // TODO: Compute progress = elapsed / duration, fromWeight = 1 - progress, toWeight = progress.\n  \n}",
    "eHint": "Compute progress = elapsed / duration, fromWeight = 1 - progress, toWeight = progress.",
    "eTest": "const blend = evaluateAnimationCrossfade('Idle', 'Walk', 0.5, 0.25);\nif (blend.fromWeight !== 0.5 || blend.toWeight !== 0.5 || blend.isTransitionComplete) throw new Error('Cross-fade midpoint blend failed');",
    "aTitle": "Animation Loop Time Wrapper",
    "aDesc": "Implement function wrapAnimationTime(currentTime, clipDuration) returning `currentTime % clipDuration`.",
    "aStarter": "function wrapAnimationTime(t, d) {\n  // TODO: Modulo t % d.\n  \n}",
    "aHint": "Modulo t % d.",
    "aTest": "if (wrapAnimationTime(3.5, 2.0) !== 1.5) throw new Error('Animation loop failed');"
  },
  {
    "day": 21,
    "title": "⭐ Milestone 4 Capstone: Interactive 3D Avatar Skeletal Animation Engine",
    "desc": "Milestone 3: Build a production interactive avatar animation system: GLTF bone hierarchy, Linear Blend Skinning (LBS) GPU mesh deformation, Quaternion SLERP keyframing, and Cross-Fade animation state machine.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of ⭐ MILESTONE 3: Interactive 3D Avatar Skeletal Animation Engine.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Avatar Skeletal Animation Playback Pipeline",
    "eDesc": "Implement function playAvatarAnimationClip(avatarRig, clipName, timeSec) calculating animated bone matrices and skinned mesh vertex positions.",
    "eStarter": "function playAvatarAnimationClip(rig, clip, time) {\n  // TODO: Calculate frame index, root motion, and return playback object.\n  \n}",
    "eHint": "Calculate frame index, root motion, and return playback object.",
    "eTest": "const rig = { id: 'HeroAvatar_01', bonesCount: 54 };\nconst res = playAvatarAnimationClip(rig, 'WalkCycle', 1.0);\nif (res.status !== 'AVATAR_ANIMATION_PLAYBACK_NOMINAL' || res.bonesUpdatedCount !== 54) throw new Error('Milestone 3 avatar animation engine failed');",
    "aTitle": "Avatar Bone Count Auditor",
    "aDesc": "Implement function auditAvatarBones(count) returning true if count >= 24 (Standard humanoid rig).",
    "aStarter": "function auditAvatarBones(c) {\n  // TODO: Check c >= 24.\n  \n}",
    "aHint": "Check c >= 24.",
    "aTest": "if (auditAvatarBones(54) !== true) throw new Error('Bone count audit failed');"
  },
  {
    "day": 22,
    "title": "Facial Rigging: Morph Targets & ARKit Blendshapes (52 Shapes)",
    "desc": "Animate realistic facial expressions and speech: Morph Targets (Per-vertex delta positions $\\text{Base} + \\sum w_i \\Delta_i$), Apple ARKit standard 52 facial blendshapes (e.g. `eyeBlinkLeft`, `jawOpen`, `mouthSmileRight`).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Facial Rigging: Morph Targets & ARKit Blendshapes (52 Shapes).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "ARKit 52 Blendshape Facial Mesh Deformer",
    "eDesc": "Implement function applyFacialBlendshapes(baseVertex, blendshapeDeltas, activeWeights) computing morphed 3D facial vertex position.",
    "eStarter": "function applyFacialBlendshapes(baseVertex, deltas, weights) {\n  // TODO: Accumulate baseVertex + sum(weight * delta).\n  \n}",
    "eHint": "Accumulate baseVertex + sum(weight * delta).",
    "eTest": "const base = [0, 1.7, 0.1];\nconst deltas = { jawOpen: [0, -0.1, 0.05] };\nconst morphed = applyFacialBlendshapes(base, deltas, { jawOpen: 1.0 });\nif (morphed[1] !== 1.6 || morphed[2] !== 0.15) throw new Error('Facial blendshape morph target deformation failed');",
    "aTitle": "ARKit Blendshape Clamper",
    "aDesc": "Implement function clampBlendshapeWeight(w) returning value clamped to $[0.0, 1.0]$.",
    "aStarter": "function clampBlendshapeWeight(w) {\n  // TODO: Clamp between 0 and 1.\n  \n}",
    "aHint": "Clamp between 0 and 1.",
    "aTest": "if (clampBlendshapeWeight(1.5) !== 1.0 || clampBlendshapeWeight(-0.2) !== 0.0) throw new Error('Clamping failed');"
  },
  {
    "day": 23,
    "title": "Audio Lip-Sync & Viseme Mapping (Speech-to-Face) & Secondary Motion",
    "desc": "Generate automated lip sync from voice audio: Fast Fourier Transform (FFT) spectrogram audio analysis, Viseme phoneme mapping (e.g. `sil`, `PP`, `FF`, `TH`, `DD`, `kk`, `CH`, `SS`, `nn`, `RR`, `aa`, `E`, `ih`, `oh`, `ou`), and speech smoothing.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Audio Lip-Sync & Viseme Mapping (Oculus / Speech-to-Face).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Phoneme to Viseme Blendshape Weight Mapper",
    "eDesc": "Implement function mapPhonemeToVisemeWeights(phoneme, intensity = 1.0) translating linguistic phoneme tokens into facial blendshape targets.",
    "eStarter": "function mapPhonemeToVisemeWeights(phoneme, intensity = 1.0) {\n  // TODO: Lookup phoneme in viseme dictionary and scale by intensity.\n  \n}",
    "eHint": "Lookup phoneme in viseme dictionary and scale by intensity.",
    "eTest": "const v = mapPhonemeToVisemeWeights('AA', 1.0);\nif (v.jawOpen !== 0.8 || v.mouthFunnel !== 0.1) throw new Error('Phoneme to viseme mapping failed');",
    "aTitle": "Audio RMS Amplitude Estimator",
    "aDesc": "Implement function calculateAudioRms(samples) returning Root-Mean-Square amplitude.",
    "aStarter": "function calculateAudioRms(s) {\n  // TODO: Compute sqrt(sum(s^2)/N).\n  \n}",
    "aHint": "Compute sqrt(sum(s^2)/N).",
    "aTest": "if (calculateAudioRms([0.5, 0.5, 0.5, 0.5]) !== 0.5) throw new Error('RMS failed');"
  },
  {
    "day": 24,
    "title": "3D Physics: Raycasting, Collisions & Bounding Volumes (AABB / OBB)",
    "desc": "Detect 3D collisions and mouse raycast clicks: Ray-Triangle intersection (Möller-Trumbore algorithm), Axis-Aligned Bounding Boxes (AABB), Oriented Bounding Boxes (OBB), and Sphere collisions.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of 3D Physics: Raycasting, Collisions & Bounding Volumes (AABB / OBB).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Ray to Axis-Aligned Bounding Box (AABB) Intersection Tester",
    "eDesc": "Implement function testRayAabbIntersection(rayOrigin, rayDir, boxMin, boxMax) returning intersection distance $t$ or null if missed.",
    "eStarter": "function testRayAabbIntersection(orig, dir, min, max) {\n  // TODO: Slab method test on X, Y, Z planes.\n  \n}",
    "eHint": "Slab method test on X, Y, Z planes.",
    "eTest": "const hit = testRayAabbIntersection([0, 0, -10], [0, 0, 1], [-1, -1, -1], [1, 1, 1]); // Ray along +Z hitting unit cube\nif (hit !== 9.0) throw new Error('Ray AABB intersection calculation failed: expected t=9.0');",
    "aTitle": "Sphere-Sphere Collision Detector",
    "aDesc": "Implement function isSphereColliding(posA, radiusA, posB, radiusB) returning true if distance <= radiusA + radiusB.",
    "aStarter": "function isSphereColliding(pA, rA, pB, rB) {\n  // TODO: Compare distance with sum of radii.\n  \n}",
    "aHint": "Compare distance with sum of radii.",
    "aTest": "if (!isSphereColliding([0,0,0], 1, [0,1.5,0], 1)) throw new Error('Sphere collision failed');"
  },
  {
    "day": 25,
    "title": "Particle Systems & GPU Instanced Rendering",
    "desc": "Render millions of 3D visual effects on GPU: Point Sprites, Camera-facing Billboarding matrices, GPU Instanced Arrays (`gl.drawElementsInstanced`), and compute velocity physics updates.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Particle Systems & GPU Instanced Rendering.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "GPU Instanced Particle Matrix Buffer Generator",
    "eDesc": "Implement function generateParticleInstanceBuffer(particlesCount, bounds = 10) generating interleaved Float32Array of positions and scales.",
    "eStarter": "function generateParticleInstanceBuffer(count, bounds = 10) {\n  // TODO: Generate [x, y, z, scale] for each particle.\n  \n}",
    "eHint": "Generate [x, y, z, scale] for each particle.",
    "eTest": "const p = generateParticleInstanceBuffer(100);\nif (p.totalParticles !== 100 || p.totalFloats !== 400) throw new Error('Particle instance buffer generation failed');",
    "aTitle": "Camera Billboard Matrix Resolver",
    "aDesc": "Implement function createBillboardMatrix(cameraRight, cameraUp) returning 3x3 alignment matrix.",
    "aStarter": "function createBillboardMatrix(r, u) {\n  // TODO: Construct alignment array.\n  \n}",
    "aHint": "Construct alignment array.",
    "aTest": "if (createBillboardMatrix([1,0,0], [0,1,0])[0] !== 1) throw new Error('Billboard failed');"
  },
  {
    "day": 26,
    "title": "Level of Detail (LOD) & Occlusion Culling",
    "desc": "Maintain constant 60 FPS in complex 3D scenes: Distance-based Level of Detail (LOD 0 high poly, LOD 1 medium, LOD 2 low), Frustum Culling, Hierarchical Z-Buffer Occlusion, and Draw Call Batching.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Level of Detail (LOD) & Occlusion Culling.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Distance-Based Level of Detail (LOD) Mesh Selector",
    "eDesc": "Implement function selectMeshLod(cameraPos, objectPos, lodThresholds = [10, 30, 70]) selecting optimal polygon mesh tier.",
    "eStarter": "function selectMeshLod(camPos, objPos, thresholds = [10, 30, 70]) {\n  // TODO: Compare Euclidean distance with threshold bands.\n  \n}",
    "eHint": "Compare Euclidean distance with threshold bands.",
    "eTest": "const near = selectMeshLod([0, 0, 0], [0, 0, 5]);\nconst far = selectMeshLod([0, 0, 0], [0, 0, 50]);\nif (near.lodTier !== 'LOD_0_ULTRA_HIGH_POLY' || far.lodTier !== 'LOD_2_LOW_POLY') throw new Error('LOD selection failed');",
    "aTitle": "Draw Call Reduction Ratio Calculator",
    "aDesc": "Implement function calculateDrawCallReduction(beforeBatches, afterBatches) returning percentage saved.",
    "aStarter": "function calculateDrawCallReduction(b, a) {\n  // TODO: Compute (b - a) / b * 100.\n  \n}",
    "aHint": "Compute (b - a) / b * 100.",
    "aTest": "if (calculateDrawCallReduction(1000, 50) !== 95.0) throw new Error('Draw call calc failed');"
  },
  {
    "day": 27,
    "title": "WebXR: VR Headsets, AR Spatial Anchors & 6-DoF Tracking",
    "desc": "Build immersive WebXR experiences: 6 Degrees of Freedom (6-DoF: Position $X,Y,Z$ + Rotation Pitch/Yaw/Roll), Stereoscopic Dual-Eye Rendering matrices, AR hit-testing, and Spatial Anchors.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of WebXR: VR Headsets, AR Spatial Anchors & 6-DoF Tracking.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "WebXR Dual-Eye Stereoscopic View Matrix Builder",
    "eDesc": "Implement function calculateXrStereoscopicViews(headPoseMatrix, ipdMeters = 0.064) constructing separate Left and Right Eye view matrices based on Interpupillary Distance (IPD).",
    "eStarter": "function calculateXrStereoscopicViews(headPos, ipd = 0.064) {\n  // TODO: Offset head position along X axis by -halfIpd (left) and +halfIpd (right).\n  \n}",
    "eHint": "Offset head position along X axis by -halfIpd (left) and +halfIpd (right).",
    "eTest": "const views = calculateXrStereoscopicViews([0, 1.7, 0], 0.064);\nif (views.leftEyeWorldPosition[0] !== -0.032 || views.rightEyeWorldPosition[0] !== 0.032) throw new Error('WebXR stereoscopic eye offset calculation failed');",
    "aTitle": "IPD Offset Formatter",
    "aDesc": "Implement function formatIpdString(ipdMeters) returning `${ipdMeters * 1000}mm IPD`.",
    "aStarter": "function formatIpdString(ipd) {\n  // TODO: Format IPD in mm.\n  \n}",
    "aHint": "Format IPD in mm.",
    "aTest": "if (formatIpdString(0.064) !== '64mm IPD') throw new Error('IPD format failed');"
  },
  {
    "day": 28,
    "title": "Screen-Space Ambient Occlusion (SSAO) & Depth Post-Passes",
    "desc": "Add depth and grounding realism to 3D scenes: Screen-Space Ambient Occlusion (SSAO: Sampling hemisphere depth offsets in view space), Normal buffer reconstruction, and Bilateral depth-aware blur.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Screen-Space Ambient Occlusion (SSAO) & Depth Post-Passes.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "SSAO Hemisphere Depth Sample Occlusion Tester",
    "eDesc": "Implement function evaluateSsaoSample(sampleDepth, bufferDepth, radius = 0.5, bias = 0.025) calculating ambient occlusion contribution.",
    "eStarter": "function evaluateSsaoSample(sampleZ, bufferZ, radius = 0.5, bias = 0.025) {\n  // TODO: Check depthDiff between bias and radius, compute smooth falloff.\n  \n}",
    "eHint": "Check depthDiff between bias and radius, compute smooth falloff.",
    "eTest": "const occluded = evaluateSsaoSample(2.2, 2.0, 0.5, 0.025);\nconst farAway = evaluateSsaoSample(5.0, 2.0, 0.5, 0.025);\nif (occluded <= 0 || farAway !== 0.0) throw new Error('SSAO occlusion sample evaluation failed');",
    "aTitle": "SSAO Kernel Size Formatter",
    "aDesc": "Implement function formatSsaoKernel(sampleCount) returning `${sampleCount}-sample hemisphere kernel`.",
    "aStarter": "function formatSsaoKernel(c) {\n  // TODO: Format kernel string.\n  \n}",
    "aHint": "Format kernel string.",
    "aTest": "if (formatSsaoKernel(16) !== '16-sample hemisphere kernel') throw new Error('Kernel format failed');"
  },
  {
    "day": 29,
    "title": "Procedural 3D Geometry Generation & Perlin Noise Terrains",
    "desc": "Generate infinite procedural 3D worlds: Perlin / Simplex Gradient Noise, Heightmap grid vertex meshes, Automatic Normal recalculation, and UV splatting.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Procedural 3D Geometry Generation & Perlin Noise Terrains.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Procedural 3D Heightmap Terrain Mesh Generator",
    "eDesc": "Implement function generateHeightmapGrid(gridSize = 4, spacing = 1.0) generating 3D vertices and indexed triangle faces.",
    "eStarter": "function generateHeightmapGrid(size = 4, spacing = 1.0) {\n  // TODO: Generate grid vertices with sine height and indexed quad triangles.\n  \n}",
    "eHint": "Generate grid vertices with sine height and indexed quad triangles.",
    "eTest": "const terrain = generateHeightmapGrid(4, 1.0);\nif (terrain.totalVerticesCount !== 16 || terrain.totalTrianglesCount !== 18) throw new Error('Procedural terrain generation failed');",
    "aTitle": "Grid Quad Count Calculator",
    "aDesc": "Implement function calculateGridQuads(size) returning `(size - 1) * (size - 1)`.",
    "aStarter": "function calculateGridQuads(s) {\n  // TODO: Compute (s - 1)^2.\n  \n}",
    "aHint": "Compute (s - 1)^2.",
    "aTest": "if (calculateGridQuads(5) !== 16) throw new Error('Quad calc failed');"
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Enterprise Real-Time 3D Interactive Metaverse Avatar Engine",
    "desc": "Final Capstone Synthesis: The complete real-time 3D interactive graphics & avatar platform: WebGL2 PBR rendering, Directional Shadow Maps, Skeletal Bone Rigging, GPU Linear Blend Skinning, 52 ARKit Facial Blendshapes, Audio Lip-Sync, Orbit Camera, and Post-Processing.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of 🏆 FINAL CAPSTONE: Enterprise Real-Time 3D Interactive Metaverse Avatar Engine.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Capstone 3D Interactive Metaverse Engine Master Loop",
    "eDesc": "Implement function executeMetaverseEngineCycle(avatarState, camera, sceneLighting, postProcessing) orchestrating full graphics and animation render pipeline.",
    "eStarter": "function executeMetaverseEngineCycle(avatar, cam, light, post) {\n  // TODO: Verify avatar animation, camera VP, lighting, and post-processing in master loop.\n  \n}",
    "eHint": "Verify avatar animation, camera VP, lighting, and post-processing in master loop.",
    "eTest": "const avatar = { bones: new Array(54), blendshapes: { jawOpen: 0.5, eyeBlinkLeft: 0.1 } };\nconst cam = { isMatrixReady: true };\nconst light = { directionalLightIntensity: 1.2 };\nconst post = { acesToneMappingEnabled: true };\nconst res = executeMetaverseEngineCycle(avatar, cam, light, post);\nif (!res.success || res.systemStatus !== 'ENTERPRISE_3D_METAVERSE_ENGINE_CERTIFIED' || res.animatedBonesCount !== 54) throw new Error('Capstone 3D Metaverse engine master loop failed');",
    "aTitle": "Capstone 3D Graphics Certification Auditor",
    "aDesc": "Implement function audit3DGraphicsCapstoneStatus() returning certification grade. When called with `overrideProps`, return the base object merged with `overrideProps`.",
    "aStarter": "function audit3DGraphicsCapstoneStatus(overrideProps) {\n  // TODO: Return {\"certified\":true,\"score\":\"100/100\",\"tier\":\"ENTERPRISE_3D_GRAPHICS_AVATAR_ENGINE_CERTIFIED\"} merged with optional overrideProps\n  \n}",
    "aHint": "Return { ...{\"certified\":true,\"score\":\"100/100\",\"tier\":\"ENTERPRISE_3D_GRAPHICS_AVATAR_ENGINE_CERTIFIED\"}, ...(overrideProps || {}) }.",
    "aTest": "const base = audit3DGraphicsCapstoneStatus();\nconst custom = audit3DGraphicsCapstoneStatus({ verifiedOverride: true });\nif (!base || !custom.verifiedOverride) throw new Error('Object configuration merge failed');"
  }
];

export const GRAPHICS_3D_30_DAYS_QUESTS: CourseQuest[] = GRAPHICS_3D_30_DAYS_CONFIGS.flatMap((cfg, idx) => 
  buildEnrichedDayQuests('g3d', idx + 1, cfg)
);
