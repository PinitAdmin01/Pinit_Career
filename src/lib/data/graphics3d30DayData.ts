import { buildEnrichedDayQuests, DayConfig } from './curriculumEnricher';

export const GRAPHICS_3D_30_DAYS_CONFIGS: DayConfig[] = [
  {
    title: "3D Computer Graphics Fundamentals & Pipeline",
    desc: "Understand vertex transformations, coordinate spaces (Local, World, View, Clip, Screen), and rasterization.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of 3D Computer Graphics Fundamentals & Pipeline.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: 3D Computer Graphics Fundamentals & Pipeline Validation",
    eDesc: "Implement a JavaScript validation function for 3D Computer Graphics Fundamentals & Pipeline.",
    eStarter: "function g3dTaskDay1(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof g3dTaskDay1 !== 'function') throw new Error('Function g3dTaskDay1 not found');\nif (g3dTaskDay1('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: 3D Computer Graphics Fundamentals & Pipeline Practice",
    aDesc: "Write an auxiliary helper function for 3D Computer Graphics Fundamentals & Pipeline.",
    aStarter: "function g3dTaskDay1Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof g3dTaskDay1Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "WebGL Canvas Setup & Context Initialization",
    desc: "Initialize WebGL2 rendering contexts, configure clear colors, and handle viewport resize events.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of WebGL Canvas Setup & Context Initialization.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: WebGL Canvas Setup & Context Initialization Validation",
    eDesc: "Implement a JavaScript validation function for WebGL Canvas Setup & Context Initialization.",
    eStarter: "function g3dTaskDay2(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof g3dTaskDay2 !== 'function') throw new Error('Function g3dTaskDay2 not found');\nif (g3dTaskDay2('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: WebGL Canvas Setup & Context Initialization Practice",
    aDesc: "Write an auxiliary helper function for WebGL Canvas Setup & Context Initialization.",
    aStarter: "function g3dTaskDay2Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof g3dTaskDay2Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Linear Algebra: Vectors, Dot & Cross Products",
    desc: "Compute 3D directional vectors, dot products for lighting intensity, and cross products for surface normals.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Linear Algebra: Vectors, Dot & Cross Products.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Linear Algebra: Vectors, Dot & Cross Products Validation",
    eDesc: "Implement a JavaScript validation function for Linear Algebra: Vectors, Dot & Cross Products.",
    eStarter: "function g3dTaskDay3(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof g3dTaskDay3 !== 'function') throw new Error('Function g3dTaskDay3 not found');\nif (g3dTaskDay3('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Linear Algebra: Vectors, Dot & Cross Products Practice",
    aDesc: "Write an auxiliary helper function for Linear Algebra: Vectors, Dot & Cross Products.",
    aStarter: "function g3dTaskDay3Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof g3dTaskDay3Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Matrices & 3D Transformations (Translation, Rotation, Scale)",
    desc: "Construct 4x4 transformation matrices, combine transformation hierarchies, and understand matrix order.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Matrices & 3D Transformations (Translation, Rotation, Scale).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Matrices & 3D Transformations (Translation, Rotation, Scale) Validation",
    eDesc: "Implement a JavaScript validation function for Matrices & 3D Transformations (Translation, Rotation, Scale).",
    eStarter: "function g3dTaskDay4(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof g3dTaskDay4 !== 'function') throw new Error('Function g3dTaskDay4 not found');\nif (g3dTaskDay4('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Matrices & 3D Transformations (Translation, Rotation, Scale) Practice",
    aDesc: "Write an auxiliary helper function for Matrices & 3D Transformations (Translation, Rotation, Scale).",
    aStarter: "function g3dTaskDay4Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof g3dTaskDay4Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Perspective & Orthographic Camera Projections",
    desc: "Configure field of view (FOV), aspect ratios, near/far clipping planes, and projection matrices.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Perspective & Orthographic Camera Projections.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Perspective & Orthographic Camera Projections Validation",
    eDesc: "Implement a JavaScript validation function for Perspective & Orthographic Camera Projections.",
    eStarter: "function g3dTaskDay5(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof g3dTaskDay5 !== 'function') throw new Error('Function g3dTaskDay5 not found');\nif (g3dTaskDay5('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Perspective & Orthographic Camera Projections Practice",
    aDesc: "Write an auxiliary helper function for Perspective & Orthographic Camera Projections.",
    aStarter: "function g3dTaskDay5Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof g3dTaskDay5Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Three.js Scene Graph & Object Hierarchies",
    desc: "Structure parent-child coordinate spaces in Three.js, traverse scene graphs, and manage world positions.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Three.js Scene Graph & Object Hierarchies.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Three.js Scene Graph & Object Hierarchies Validation",
    eDesc: "Implement a JavaScript validation function for Three.js Scene Graph & Object Hierarchies.",
    eStarter: "function g3dTaskDay6(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof g3dTaskDay6 !== 'function') throw new Error('Function g3dTaskDay6 not found');\nif (g3dTaskDay6('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Three.js Scene Graph & Object Hierarchies Practice",
    aDesc: "Write an auxiliary helper function for Three.js Scene Graph & Object Hierarchies.",
    aStarter: "function g3dTaskDay6Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof g3dTaskDay6Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Geometries: Buffers, Vertices & Index Arrays",
    desc: "Define BufferGeometry, attribute arrays (positions, normals, UVs), and optimize indexed draw calls.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Geometries: Buffers, Vertices & Index Arrays.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Geometries: Buffers, Vertices & Index Arrays Validation",
    eDesc: "Implement a JavaScript validation function for Geometries: Buffers, Vertices & Index Arrays.",
    eStarter: "function g3dTaskDay7(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof g3dTaskDay7 !== 'function') throw new Error('Function g3dTaskDay7 not found');\nif (g3dTaskDay7('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Geometries: Buffers, Vertices & Index Arrays Practice",
    aDesc: "Write an auxiliary helper function for Geometries: Buffers, Vertices & Index Arrays.",
    aStarter: "function g3dTaskDay7Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof g3dTaskDay7Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Lighting Models: Ambient, Directional & Point Lights",
    desc: "Simulate diffuse illumination, light attenuation decay, and specular highlights using Phong reflections.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Lighting Models: Ambient, Directional & Point Lights.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Lighting Models: Ambient, Directional & Point Lights Validation",
    eDesc: "Implement a JavaScript validation function for Lighting Models: Ambient, Directional & Point Lights.",
    eStarter: "function g3dTaskDay8(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof g3dTaskDay8 !== 'function') throw new Error('Function g3dTaskDay8 not found');\nif (g3dTaskDay8('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Lighting Models: Ambient, Directional & Point Lights Practice",
    aDesc: "Write an auxiliary helper function for Lighting Models: Ambient, Directional & Point Lights.",
    aStarter: "function g3dTaskDay8Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof g3dTaskDay8Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Materials: Basic, Lambert, Phong & Standard PBR",
    desc: "Compare unlit materials with physically based rendering (PBR) roughness, metalness, and env maps.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Materials: Basic, Lambert, Phong & Standard PBR.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Materials: Basic, Lambert, Phong & Standard PBR Validation",
    eDesc: "Implement a JavaScript validation function for Materials: Basic, Lambert, Phong & Standard PBR.",
    eStarter: "function g3dTaskDay9(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof g3dTaskDay9 !== 'function') throw new Error('Function g3dTaskDay9 not found');\nif (g3dTaskDay9('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Materials: Basic, Lambert, Phong & Standard PBR Practice",
    aDesc: "Write an auxiliary helper function for Materials: Basic, Lambert, Phong & Standard PBR.",
    aStarter: "function g3dTaskDay9Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof g3dTaskDay9Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Texture Mapping: Diffuse, Normal & Roughness Maps",
    desc: "Map 2D texture coordinates (UVs), apply tangent-space normal maps for fine surface bump details.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Texture Mapping: Diffuse, Normal & Roughness Maps.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Texture Mapping: Diffuse, Normal & Roughness Maps Validation",
    eDesc: "Implement a JavaScript validation function for Texture Mapping: Diffuse, Normal & Roughness Maps.",
    eStarter: "function g3dTaskDay10(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof g3dTaskDay10 !== 'function') throw new Error('Function g3dTaskDay10 not found');\nif (g3dTaskDay10('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Texture Mapping: Diffuse, Normal & Roughness Maps Practice",
    aDesc: "Write an auxiliary helper function for Texture Mapping: Diffuse, Normal & Roughness Maps.",
    aStarter: "function g3dTaskDay10Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof g3dTaskDay10Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Custom GLSL Vertex & Fragment Shaders",
    desc: "Write raw GLSL shaders, pass uniform variables, calculate UV coordinates, and render procedural noise patterns.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Custom GLSL Vertex & Fragment Shaders.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Custom GLSL Vertex & Fragment Shaders Validation",
    eDesc: "Implement a JavaScript validation function for Custom GLSL Vertex & Fragment Shaders.",
    eStarter: "function g3dTaskDay11(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof g3dTaskDay11 !== 'function') throw new Error('Function g3dTaskDay11 not found');\nif (g3dTaskDay11('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Custom GLSL Vertex & Fragment Shaders Practice",
    aDesc: "Write an auxiliary helper function for Custom GLSL Vertex & Fragment Shaders.",
    aStarter: "function g3dTaskDay11Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof g3dTaskDay11Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Procedural Noise & Terrain Generation",
    desc: "Implement Perlin noise and Simplex noise algorithms in shaders to generate realistic mountain terrains.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Procedural Noise & Terrain Generation.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Procedural Noise & Terrain Generation Validation",
    eDesc: "Implement a JavaScript validation function for Procedural Noise & Terrain Generation.",
    eStarter: "function g3dTaskDay12(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof g3dTaskDay12 !== 'function') throw new Error('Function g3dTaskDay12 not found');\nif (g3dTaskDay12('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Procedural Noise & Terrain Generation Practice",
    aDesc: "Write an auxiliary helper function for Procedural Noise & Terrain Generation.",
    aStarter: "function g3dTaskDay12Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof g3dTaskDay12Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Shadow Mapping & Directional Cascades",
    desc: "Tune shadow map resolutions, shadow camera frustums, bias values to eliminate shadow acne, and PCF soft filtering.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Shadow Mapping & Directional Cascades.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Shadow Mapping & Directional Cascades Validation",
    eDesc: "Implement a JavaScript validation function for Shadow Mapping & Directional Cascades.",
    eStarter: "function g3dTaskDay13(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof g3dTaskDay13 !== 'function') throw new Error('Function g3dTaskDay13 not found');\nif (g3dTaskDay13('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Shadow Mapping & Directional Cascades Practice",
    aDesc: "Write an auxiliary helper function for Shadow Mapping & Directional Cascades.",
    aStarter: "function g3dTaskDay13Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof g3dTaskDay13Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Environment Mapping & Image-Based Lighting (HDR/IBL)",
    desc: "Load equirectangular HDR skyboxes, generate pre-filtered environment maps, and simulate realistic reflections.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Environment Mapping & Image-Based Lighting (HDR/IBL).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Environment Mapping & Image-Based Lighting (HDR/IBL) Validation",
    eDesc: "Implement a JavaScript validation function for Environment Mapping & Image-Based Lighting (HDR/IBL).",
    eStarter: "function g3dTaskDay14(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof g3dTaskDay14 !== 'function') throw new Error('Function g3dTaskDay14 not found');\nif (g3dTaskDay14('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Environment Mapping & Image-Based Lighting (HDR/IBL) Practice",
    aDesc: "Write an auxiliary helper function for Environment Mapping & Image-Based Lighting (HDR/IBL).",
    aStarter: "function g3dTaskDay14Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof g3dTaskDay14Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Loading 3D Models (GLTF / GLB Loader)",
    desc: "Import complex 3D assets, parse embedded scene hierarchies, materials, textures, and mesh primitives.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Loading 3D Models (GLTF / GLB Loader).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Loading 3D Models (GLTF / GLB Loader) Validation",
    eDesc: "Implement a JavaScript validation function for Loading 3D Models (GLTF / GLB Loader).",
    eStarter: "function g3dTaskDay15(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof g3dTaskDay15 !== 'function') throw new Error('Function g3dTaskDay15 not found');\nif (g3dTaskDay15('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Loading 3D Models (GLTF / GLB Loader) Practice",
    aDesc: "Write an auxiliary helper function for Loading 3D Models (GLTF / GLB Loader).",
    aStarter: "function g3dTaskDay15Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof g3dTaskDay15Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Skeletal Animation & Skinned Meshes",
    desc: "Rig skinned meshes, bone transformation matrices, skinning weights, and blend animation clips smoothly.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Skeletal Animation & Skinned Meshes.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Skeletal Animation & Skinned Meshes Validation",
    eDesc: "Implement a JavaScript validation function for Skeletal Animation & Skinned Meshes.",
    eStarter: "function g3dTaskDay16(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof g3dTaskDay16 !== 'function') throw new Error('Function g3dTaskDay16 not found');\nif (g3dTaskDay16('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Skeletal Animation & Skinned Meshes Practice",
    aDesc: "Write an auxiliary helper function for Skeletal Animation & Skinned Meshes.",
    aStarter: "function g3dTaskDay16Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof g3dTaskDay16Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Morph Targets & Blendshapes for Facial Animation",
    desc: "Interpolate morph target weights for real-time avatar facial expressions and phoneme lip-syncing.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Morph Targets & Blendshapes for Facial Animation.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Morph Targets & Blendshapes for Facial Animation Validation",
    eDesc: "Implement a JavaScript validation function for Morph Targets & Blendshapes for Facial Animation.",
    eStarter: "function g3dTaskDay17(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof g3dTaskDay17 !== 'function') throw new Error('Function g3dTaskDay17 not found');\nif (g3dTaskDay17('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Morph Targets & Blendshapes for Facial Animation Practice",
    aDesc: "Write an auxiliary helper function for Morph Targets & Blendshapes for Facial Animation.",
    aStarter: "function g3dTaskDay17Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof g3dTaskDay17Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Raycasting & 3D Interactive Object Selection",
    desc: "Cast pointer rays from camera through screen pixels to detect 3D mesh intersections and click events.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Raycasting & 3D Interactive Object Selection.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Raycasting & 3D Interactive Object Selection Validation",
    eDesc: "Implement a JavaScript validation function for Raycasting & 3D Interactive Object Selection.",
    eStarter: "function g3dTaskDay18(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof g3dTaskDay18 !== 'function') throw new Error('Function g3dTaskDay18 not found');\nif (g3dTaskDay18('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Raycasting & 3D Interactive Object Selection Practice",
    aDesc: "Write an auxiliary helper function for Raycasting & 3D Interactive Object Selection.",
    aStarter: "function g3dTaskDay18Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof g3dTaskDay18Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "3D Camera Controls (OrbitControls & First-Person)",
    desc: "Implement smooth spherical coordinate OrbitControls, zoom constraints, pan boundaries, and first-person WASD.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of 3D Camera Controls (OrbitControls & First-Person).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: 3D Camera Controls (OrbitControls & First-Person) Validation",
    eDesc: "Implement a JavaScript validation function for 3D Camera Controls (OrbitControls & First-Person).",
    eStarter: "function g3dTaskDay19(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof g3dTaskDay19 !== 'function') throw new Error('Function g3dTaskDay19 not found');\nif (g3dTaskDay19('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: 3D Camera Controls (OrbitControls & First-Person) Practice",
    aDesc: "Write an auxiliary helper function for 3D Camera Controls (OrbitControls & First-Person).",
    aStarter: "function g3dTaskDay19Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof g3dTaskDay19Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Particle Systems & GPU Mesh Instancing",
    desc: "Simulate 50,000 interactive particles using GPU instanced meshes and compute transformation matrices.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Particle Systems & GPU Mesh Instancing.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Particle Systems & GPU Mesh Instancing Validation",
    eDesc: "Implement a JavaScript validation function for Particle Systems & GPU Mesh Instancing.",
    eStarter: "function g3dTaskDay20(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof g3dTaskDay20 !== 'function') throw new Error('Function g3dTaskDay20 not found');\nif (g3dTaskDay20('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Particle Systems & GPU Mesh Instancing Practice",
    aDesc: "Write an auxiliary helper function for Particle Systems & GPU Mesh Instancing.",
    aStarter: "function g3dTaskDay20Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof g3dTaskDay20Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Post-Processing Pipeline (Bloom, Vignette, DOF)",
    desc: "Configure Three.js EffectComposer, render multi-pass bloom glow effects, chromatic aberration, and depth of field.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Post-Processing Pipeline (Bloom, Vignette, DOF).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Post-Processing Pipeline (Bloom, Vignette, DOF) Validation",
    eDesc: "Implement a JavaScript validation function for Post-Processing Pipeline (Bloom, Vignette, DOF).",
    eStarter: "function g3dTaskDay21(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof g3dTaskDay21 !== 'function') throw new Error('Function g3dTaskDay21 not found');\nif (g3dTaskDay21('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Post-Processing Pipeline (Bloom, Vignette, DOF) Practice",
    aDesc: "Write an auxiliary helper function for Post-Processing Pipeline (Bloom, Vignette, DOF).",
    aStarter: "function g3dTaskDay21Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof g3dTaskDay21Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Screen-Space Ambient Occlusion (SSAO)",
    desc: "Simulate soft contact shadows in crevices and corners using depth buffer screen-space sampling.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Screen-Space Ambient Occlusion (SSAO).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Screen-Space Ambient Occlusion (SSAO) Validation",
    eDesc: "Implement a JavaScript validation function for Screen-Space Ambient Occlusion (SSAO).",
    eStarter: "function g3dTaskDay22(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof g3dTaskDay22 !== 'function') throw new Error('Function g3dTaskDay22 not found');\nif (g3dTaskDay22('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Screen-Space Ambient Occlusion (SSAO) Practice",
    aDesc: "Write an auxiliary helper function for Screen-Space Ambient Occlusion (SSAO).",
    aStarter: "function g3dTaskDay22Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof g3dTaskDay22Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Physics Simulation in 3D (Rapier / Cannon.js)",
    desc: "Integrate rigid body dynamics, gravity, collisions, friction, and restitution bounce coefficients.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Physics Simulation in 3D (Rapier / Cannon.js).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Physics Simulation in 3D (Rapier / Cannon.js) Validation",
    eDesc: "Implement a JavaScript validation function for Physics Simulation in 3D (Rapier / Cannon.js).",
    eStarter: "function g3dTaskDay23(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof g3dTaskDay23 !== 'function') throw new Error('Function g3dTaskDay23 not found');\nif (g3dTaskDay23('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Physics Simulation in 3D (Rapier / Cannon.js) Practice",
    aDesc: "Write an auxiliary helper function for Physics Simulation in 3D (Rapier / Cannon.js).",
    aStarter: "function g3dTaskDay23Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof g3dTaskDay23Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Audio-Reactive 3D Visualizations (Web Audio API)",
    desc: "Extract frequency spectrum data from audio streams and modulate 3D mesh scales and shader colors.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Audio-Reactive 3D Visualizations (Web Audio API).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Audio-Reactive 3D Visualizations (Web Audio API) Validation",
    eDesc: "Implement a JavaScript validation function for Audio-Reactive 3D Visualizations (Web Audio API).",
    eStarter: "function g3dTaskDay24(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof g3dTaskDay24 !== 'function') throw new Error('Function g3dTaskDay24 not found');\nif (g3dTaskDay24('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Audio-Reactive 3D Visualizations (Web Audio API) Practice",
    aDesc: "Write an auxiliary helper function for Audio-Reactive 3D Visualizations (Web Audio API).",
    aStarter: "function g3dTaskDay24Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof g3dTaskDay24Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "3D Web Optimization (Draco Compression & LOD)",
    desc: "Compress GLTF models with Draco geometry compression, manage Level of Detail (LOD), and reduce draw calls.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of 3D Web Optimization (Draco Compression & LOD).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: 3D Web Optimization (Draco Compression & LOD) Validation",
    eDesc: "Implement a JavaScript validation function for 3D Web Optimization (Draco Compression & LOD).",
    eStarter: "function g3dTaskDay25(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof g3dTaskDay25 !== 'function') throw new Error('Function g3dTaskDay25 not found');\nif (g3dTaskDay25('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: 3D Web Optimization (Draco Compression & LOD) Practice",
    aDesc: "Write an auxiliary helper function for 3D Web Optimization (Draco Compression & LOD).",
    aStarter: "function g3dTaskDay25Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof g3dTaskDay25Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "VRM Avatar Standard & VRoid Integration",
    desc: "Load humanoid VRM avatar models, parse spring bones physics, expression blendshapes, and eye gaze tracking.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of VRM Avatar Standard & VRoid Integration.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: VRM Avatar Standard & VRoid Integration Validation",
    eDesc: "Implement a JavaScript validation function for VRM Avatar Standard & VRoid Integration.",
    eStarter: "function g3dTaskDay26(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof g3dTaskDay26 !== 'function') throw new Error('Function g3dTaskDay26 not found');\nif (g3dTaskDay26('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: VRM Avatar Standard & VRoid Integration Practice",
    aDesc: "Write an auxiliary helper function for VRM Avatar Standard & VRoid Integration.",
    aStarter: "function g3dTaskDay26Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof g3dTaskDay26Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Real-Time Avatar Lip-Sync & Phoneme Mapping",
    desc: "Map audio frequency energy and phoneme cues to VRM blendshapes (`aa`, `ih`, `ou`, `ee`, `oh`) for realistic speech.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Real-Time Avatar Lip-Sync & Phoneme Mapping.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Real-Time Avatar Lip-Sync & Phoneme Mapping Validation",
    eDesc: "Implement a JavaScript validation function for Real-Time Avatar Lip-Sync & Phoneme Mapping.",
    eStarter: "function g3dTaskDay27(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof g3dTaskDay27 !== 'function') throw new Error('Function g3dTaskDay27 not found');\nif (g3dTaskDay27('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Real-Time Avatar Lip-Sync & Phoneme Mapping Practice",
    aDesc: "Write an auxiliary helper function for Real-Time Avatar Lip-Sync & Phoneme Mapping.",
    aStarter: "function g3dTaskDay27Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof g3dTaskDay27Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "WebGL Context Loss & GPU Memory Management",
    desc: "Handle `webglcontextlost` events, recursively dispose geometries, textures, and force GPU context cleanup.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of WebGL Context Loss & GPU Memory Management.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: WebGL Context Loss & GPU Memory Management Validation",
    eDesc: "Implement a JavaScript validation function for WebGL Context Loss & GPU Memory Management.",
    eStarter: "function g3dTaskDay28(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof g3dTaskDay28 !== 'function') throw new Error('Function g3dTaskDay28 not found');\nif (g3dTaskDay28('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: WebGL Context Loss & GPU Memory Management Practice",
    aDesc: "Write an auxiliary helper function for WebGL Context Loss & GPU Memory Management.",
    aStarter: "function g3dTaskDay28Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof g3dTaskDay28Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "WebXR & Immersive VR/AR Experiences",
    desc: "Enable WebXR sessions, track VR headset controllers, render stereo camera views, and manage spatial anchors.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of WebXR & Immersive VR/AR Experiences.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: WebXR & Immersive VR/AR Experiences Validation",
    eDesc: "Implement a JavaScript validation function for WebXR & Immersive VR/AR Experiences.",
    eStarter: "function g3dTaskDay29(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof g3dTaskDay29 !== 'function') throw new Error('Function g3dTaskDay29 not found');\nif (g3dTaskDay29('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: WebXR & Immersive VR/AR Experiences Practice",
    aDesc: "Write an auxiliary helper function for WebXR & Immersive VR/AR Experiences.",
    aStarter: "function g3dTaskDay29Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof g3dTaskDay29Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Capstone: Interactive 3D WebGL Avatar Engine",
    desc: "Assemble an end-to-end 3D scene with custom GLSL shaders, VRoid avatar lip-sync, PBR lighting, and bloom effects.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Capstone: Interactive 3D WebGL Avatar Engine.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Capstone: Interactive 3D WebGL Avatar Engine Validation",
    eDesc: "Implement a JavaScript validation function for Capstone: Interactive 3D WebGL Avatar Engine.",
    eStarter: "function g3dTaskDay30(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof g3dTaskDay30 !== 'function') throw new Error('Function g3dTaskDay30 not found');\nif (g3dTaskDay30('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Capstone: Interactive 3D WebGL Avatar Engine Practice",
    aDesc: "Write an auxiliary helper function for Capstone: Interactive 3D WebGL Avatar Engine.",
    aStarter: "function g3dTaskDay30Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof g3dTaskDay30Aux !== 'function') throw new Error('Auxiliary function not found');"
  }
];

export const GRAPHICS_3D_30_DAYS_QUESTS = GRAPHICS_3D_30_DAYS_CONFIGS.flatMap((cfg, i) =>
  buildEnrichedDayQuests('g3d', i + 1, cfg)
);
