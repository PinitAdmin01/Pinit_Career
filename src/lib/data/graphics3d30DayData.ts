import { buildEnrichedDayQuests } from './curriculumEnricher';
export interface DayConfig {
  title: string;
  desc: string;
  syllabus: string[];
  eTitle: string;
  eDesc: string;
  eStarter: string;
  eHint: string;
  eTest: string;
  aTitle: string;
  aDesc: string;
  aStarter: string;
  aHint: string;
  aTest: string;
}

export const GRAPHICS_3D_30_DAYS_CONFIGS: DayConfig[] = [
  {
    title: "What is 3D Graphics? — Coordinate Spaces, Normalized Device Coordinates (NDC) and WebGL Setup",
    desc: "3D Graphics is the process of creating three-dimensional images on a flat, two-dimensional computer screen. To do this, we must understand how a computer maps 3D coordinate points (with X, Y, and Z axes) onto a 2D grid of screen pixels. Let us start with COORDINATE SPACES: (1) 2D Screen Space: a flat coordinate grid on your monitor. The X-axis runs horizontally, and the Y-axis runs vertically. Coordinates are measured in pixels (like 1920x1080). (2) 3D World Space: the virtual 3D environment. Here, we add a Z-axis representing depth. X moves left/right, Y moves up/down, and Z moves forward/backward (into and out of the screen). (3) Normalized Device Coordinates (NDC): WebGL (the browser's 3D engine) does not use pixels directly. Instead, WebGL uses NDC, where the screen width and height are mapped from -1 to 1. The center of the screen is (0, 0). The top-right corner is (1, 1). The bottom-left corner is (-1, -1). Regardless of your monitor's size, NDC remains the same. WebGL's job is to translate your 3D world coordinates into NDC, which it then maps to screen pixels. What is WebGL? WebGL (Web Graphics Library) is a JavaScript API that allows browsers to render interactive 3D graphics directly using the computer's GPU (Graphics Processing Unit) without plugins. To start rendering, you create an HTML <canvas> element, get its WebGL context: const gl = canvas.getContext('webgl2');, define the viewport size: gl.viewport(0, 0, canvas.width, canvas.height);, and clear the screen with a background color: gl.clearColor(0.1, 0.1, 0.1, 1.0);. (Real world: Video games like Minecraft or 3D web applications like Google Maps use these exact WebGL coordinates. When you rotate the camera, WebGL calculates the new coordinate matrices instantly, translating coordinates from virtual 3D space to NDC, rendering 60 pictures per second on your flat monitor screen.)",
    syllabus: ["3D coordinate spaces: 2D Screen Space (pixel coordinates) vs 3D World Space (adding Z-axis for depth representation). Cartesian coordinate systems and axes directions.", "Normalized Device Coordinates (NDC): the standard WebGL coordinate space mapping screen bounds from -1 to 1. Center of screen = (0, 0), top-right = (1, 1), bottom-left = (-1, -1).", "WebGL context: HTML <canvas> element setup. gl.getContext('webgl2') requests the GPU rendering interface. gl.viewport maps NDC to screen pixels. gl.clearColor clears the screen background."],
    eTitle: "Exam: Viewport Space Mapper",
    eDesc: "Not tested on day 1",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Canvas Aspect Ratio Calculator",
    aDesc: "Not tested on day 1",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Real-Time Rendering — The Render Loop, requestAnimationFrame and Delta Time",
    desc: "In static web applications, a page loads once and stays still until the user clicks something. In 3D graphics and games, the page must update constantly. We achieve this using a RENDER LOOP. A render loop is a continuous loop that runs 60 times per second, performing three tasks: (1) Update: recalculate physics and object positions. (2) Clear: wipe the canvas clean. (3) Draw: render the updated scene. To build a render loop in JavaScript, we use 'requestAnimationFrame(callback)'. This built-in browser function schedules a function to run right before the browser performs its next screen repaint, aligning perfectly with your monitor's refresh rate (e.g. 60Hz or 140Hz). This creates smooth animations and automatically pauses when you switch tabs, saving laptop battery power. WHAT IS DELTA TIME? If you move a 3D box by writing 'box.x += 5' inside your render loop, the box's speed will depend on the computer's speed. On a 60Hz monitor, the loop runs 60 times per second, moving the box 300 pixels. On a 140Hz gaming monitor, the loop runs 140 times per second, moving the box 700 pixels! The game runs twice as fast on better hardware. To fix this, we calculate Delta Time: the elapsed time in seconds between the current frame and the previous frame. We then multiply our speed by delta time: 'box.x += speed * deltaTime'. This ensures the box moves at the exact same physical speed on all computers. (Real world: If a game has a lag spike and drops from 60fps to 10fps, delta time increases. The lag compensation math ensures that your character still moves to the correct position, preventing the animation from running in slow-motion.)",
    syllabus: ["The Render Loop pattern: Update -> Clear -> Draw. Continually repeating this loop is what creates the illusion of smooth motion and animation in 3D games and web applications.", "requestAnimationFrame (rAF): browser utility that schedules drawing ticks. Auto-syncs with monitor refresh rates, pauses in hidden browser tabs, and prevents screen tearing.", "Delta Time: time elapsed between frames (seconds). Calculating: (now - lastTime) / 1000. Multiplying speed by delta time achieves frame-rate independent movement across all devices."],
    eTitle: "Exam: Frame Delta Calculator",
    eDesc: "Not tested on day 2",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Frame Rate (FPS) Estimator",
    aDesc: "Not tested on day 2",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "3D Vectors: Magnitude Normalization & Light Reflections",
    desc: "Understand unit vectors calculations, vector magnitudes, and light reflection normals. (Real world: Shaders convert arbitrary direction vectors to unit vectors with a magnitude of 1.0, simplifying light reflection math.)",
    syllabus: ["Calculating 3D vector magnitudes", "Vector normalization and unit vectors", "Zero division guards in normalization"],
    eTitle: "Exam: Vector Normalizer",
    eDesc: "Write a JS function `normalizeVector3(x, y, z)` returning array [nx, ny, nz] representing the unit vector. Return [0, 0, 0] if magnitude is 0.",
    eStarter: "function normalizeVector3(x, y, z) {\n    // Write your code here\n    \n}",
    eHint: "Compute magnitude: Math.sqrt(x*x + y*y + z*z). Divide elements by magnitude if positive.",
    eTest: "if (typeof normalizeVector3 !== 'function') throw new Error('Method normalizeVector3 not found.');\nconst n1 = normalizeVector3(3, 0, 0);\nif (n1[0] !== 1 || n1[1] !== 0 || n1[2] !== 0) throw new Error('Normalization failed');",
    aTitle: "Assignment: Vector3 Magnitude Calculator",
    aDesc: "Write a JS function `getVector3Magnitude(x, y, z)` returning magnitude float.",
    aStarter: "function getVector3Magnitude(x, y, z) {\n    // Write your code here\n    \n}",
    aHint: "Calculate root sum of squares.",
    aTest: "if (typeof getVector3Magnitude !== 'function') throw new Error('Method getVector3Magnitude not found.');"
  },
  {
    title: "Matrices: Translation matrices & Avatar offset coordinates",
    desc: "Master 3D translation math. (Real world: Game engines translate 3D vertex positions using 4x4 coordinate matrices, moving character models through game spaces.)",
    syllabus: ["4x4 Transformation matrices properties", "Applying coordinate translations offsets", "Constructing homogeneous translation matrices"],
    eTitle: "Exam: Translation Matrix Builder",
    eDesc: "Write a JS function `buildTranslationMatrix(tx, ty, tz)` returning a flat 16-element float array representing a 4x4 column-major translation matrix.",
    eStarter: "function buildTranslationMatrix(tx, ty, tz) {\n    // Write your code here\n    \n}",
    eHint: "Build identity matrix, setting index 12 to tx, 13 to ty, 14 to tz.",
    eTest: "if (typeof buildTranslationMatrix !== 'function') throw new Error('Method buildTranslationMatrix not found');\nconst m = buildTranslationMatrix(5, -2, 10);\nif (m[12] !== 5 || m[13] !== -2 || m[14] !== 10 || m[15] !== 1) throw new Error('Translation matrix failed');",
    aTitle: "Assignment: Matrix column resolver",
    aDesc: "Write a JS function `isIdentityMatrix(m)` returning true if m is identity matrix.",
    aStarter: "function isIdentityMatrix(m) {\n    // Write your code here\n    \n}",
    aHint: "Verify indices values.",
    aTest: "if (typeof isIdentityMatrix !== 'function') throw new Error('Method isIdentityMatrix not found');"
  },
  {
    title: "Matrices: Scaling transformations & Avatar proportions",
    desc: "Master scale transformation math. (Real world: Avatar customization panels scale bone transform factors, resizing shoulders or heights models boundaries.)",
    syllabus: ["Scaling matrices configurations", "Adjusting height width scaling parameters", "Resizing bones coordinates factors"],
    eTitle: "Exam: Scaling Matrix Builder",
    eDesc: "Write a JS function `buildScalingMatrix(sx, sy, sz)` returning 16-element float array representing 4x4 column-major scaling matrix.",
    eStarter: "function buildScalingMatrix(sx, sy, sz) {\n    // Write your code here\n    \n}",
    eHint: "Set indices 0 to sx, 5 to sy, 10 to sz, and 15 to 1.",
    eTest: "if (typeof buildScalingMatrix !== 'function') throw new Error('Method buildScalingMatrix not found');\nconst m = buildScalingMatrix(2, 3, 4);\nif (m[0] !== 2 || m[5] !== 3 || m[10] !== 4) throw new Error('Scaling matrix failed');",
    aTitle: "Assignment: Uniform scale checker",
    aDesc: "Write a JS function `isUniformScale(sx, sy, sz)` returning true if sx === sy && sy === sz.",
    aStarter: "function isUniformScale(sx, sy, sz) {\n    // Write your code here\n    \n}",
    aHint: "Compare parameters.",
    aTest: "if (typeof isUniformScale !== 'function') throw new Error('Method isUniformScale not found');"
  },
  {
    title: "Avatar Rigging: Bone weights skinning interpolator",
    desc: "Master bone joints calculations. (Real world: Graphic renderers interpolate vertex weights, computing final coordinates locations based on bone structures rotations.)",
    syllabus: ["Skeletal rigging structures pipelines", "Bone influence weights allocations", "Calculating dynamic skinning coordinates"],
    eTitle: "Exam: Skinning Weights Validator",
    eDesc: "Write a JS function `isSkinningWeightNormalized(weightsList)` returning true if sum of floats in weightsList is exactly 1.0 (within 0.001 margin of error). Returns false otherwise.",
    eStarter: "function isSkinningWeightNormalized(weightsList) {\n    // Write your code here\n    \n}",
    eHint: "Sum values in array, evaluating absolute difference against target 1.0 limit.",
    eTest: "if (typeof isSkinningWeightNormalized !== 'function') throw new Error('Method isSkinningWeightNormalized not found');\nif (isSkinningWeightNormalized([0.6, 0.4]) !== true) throw new Error('Skinning validation failed');",
    aTitle: "Assignment: Maximum bone influence checker",
    aDesc: "Write a JS function `exceedsMaxInfluences(weightsList, max)` returning true if weightsList.length > max.",
    aStarter: "function exceedsMaxInfluences(weightsList, max) {\n    // Write your code here\n    \n}",
    aHint: "Compare count.",
    aTest: "if (typeof exceedsMaxInfluences !== 'function') throw new Error('Method exceedsMaxInfluences not found');"
  },
  {
    title: "Morph Targets: Facial blendshapes weights interpolator",
    desc: "Master vertex morphing pipelines. (Real world: Facial capture software computes blendshapes values, translating user smiles to mesh animations values.)",
    syllabus: ["Morph target blendshapes schemas", "Vertex position delta additions", "Evaluating facial expression keyframes interpolations"],
    eTitle: "Exam: Blendshape Target Interpolator",
    eDesc: "Write a JS function `interpolateMorph(baseVal, targetVal, weight)` returning `baseVal + (targetVal - baseVal) * weight`. Return baseVal if weight < 0 or weight > 1.",
    eStarter: "function interpolateMorph(baseVal, targetVal, weight) {\n    // Write your code here\n    \n}",
    eHint: "Implement standard linear interpolation equation using parameters.",
    eTest: "if (typeof interpolateMorph !== 'function') throw new Error('Method interpolateMorph not found');\nif (interpolateMorph(10, 20, 0.5) !== 15) throw new Error('Morph interpolation failed');",
    aTitle: "Assignment: Blendshape weight clamp helper",
    aDesc: "Write a JS function `clampWeight(weight)` returning Math.max(0, Math.min(1, weight)).",
    aStarter: "function clampWeight(weight) {\n    // Write your code here\n    \n}",
    aHint: "Clamp values between 0 and 1.",
    aTest: "if (typeof clampWeight !== 'function') throw new Error('Method clampWeight not found');"
  },
  {
    title: "3D Cameras: Perspective projection matrix setup",
    desc: "Master viewport perspective camera math. (Real world: 3D engines generate projection matrices using field of view (FOV) and aspect ratios, transforming 3D scenes to screen pixels.)",
    syllabus: ["Camera frustum parameters configuration", "Perspective vs Orthographic matrices math", "Structuring projection matrix coordinates maps"],
    eTitle: "Exam: Perspective Projection Matrix Builder",
    eDesc: "Write a JS function `buildPerspectiveMatrix(fovRad, aspect, near, far)` returning a flat 16-element float array where index 0 is `1 / (aspect * Math.tan(fovRad/2))` and index 5 is `1 / Math.tan(fovRad/2)`.",
    eStarter: "function buildPerspectiveMatrix(fovRad, aspect, near, far) {\n    // Write your code here\n    \n}",
    eHint: "Assemble standard perspective projection math inside 16-elements array.",
    eTest: "if (typeof buildPerspectiveMatrix !== 'function') throw new Error('Method buildPerspectiveMatrix not found');\nconst m = buildPerspectiveMatrix(Math.PI/2, 1, 0.1, 100);\nif (Math.abs(m[5] - 1) > 0.001) throw new Error('Perspective camera math failed');",
    aTitle: "Assignment: Near-far plane check",
    aDesc: "Write a JS function `isNearFarPlaneSafe(near, far)` returning true if near > 0 and far > near.",
    aStarter: "function isNearFarPlaneSafe(near, far) {\n    // Write your code here\n    \n}",
    aHint: "Compare input plane limits.",
    aTest: "if (typeof isNearFarPlaneSafe !== 'function') throw new Error('Method isNearFarPlaneSafe not found');"
  },
  {
    title: "Final Capstone: 3D Engine & Avatar compliance audit",
    desc: "Perform evaluations of transformation matrices parameters, check skeletal rigging skinning weights, verify blendshapes expressions ranges, and evaluate camera projection metrics. (Real world: Avatar engine developers audit assets, checking rendering speeds.)",
    syllabus: ["Transformations matrices compliance checks", "Rigging weights normalization validation", "Camera projection parameters checks"],
    eTitle: "Exam: Graphics Compliance Auditor",
    eDesc: "Write a JS function `evaluateGraphicsBuild(report)` returning true if report.matricesValid === true and report.weightsNormalized === true and report.projectionSafe === true.",
    eStarter: "function evaluateGraphicsBuild(report) {\n    // Write your code here\n    \n}",
    eHint: "Verify report.matricesValid, report.weightsNormalized, and report.projectionSafe boolean properties in report.",
    eTest: "if (typeof evaluateGraphicsBuild !== 'function') throw new Error('Method evaluateGraphicsBuild not found');\nconst rep = { matricesValid: true, weightsNormalized: true, projectionSafe: true };\nif (evaluateGraphicsBuild(rep) !== true) throw new Error('Graphics compliance check failed');",
    aTitle: "Assignment: Frame rendering rater",
    aDesc: "Write a JS function `getGraphicsFpsRating(fps)` returning 'excellent' if fps >= 60, 'playable' if fps >= 30, and 'unplayable' otherwise.",
    aStarter: "function getGraphicsFpsRating(fps) {\n    // Write your code here\n    \n}",
    aHint: "Check frame rate intervals.",
    aTest: "if (typeof getGraphicsFpsRating !== 'function') throw new Error('Method getGraphicsFpsRating not found');"
  },
  {
    title: "Final Capstone: 3D Engine & Avatar compliance audit (Review)",
    desc: "Review 3D engines structures, evaluate transformation matrices parameters, check rigging skinning weights, and verify camera perspective projection layouts. (Real world: Avatar engine developers audit assets, checking rendering speeds.)",
    syllabus: ["Reviewing perspective camera parameters", "Assembling graphics compliance checklists", "Verifying matrix transformations coordinates"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: 3D Engine & Avatar compliance audit (Review)",
    desc: "Review 3D engines structures, evaluate transformation matrices parameters, check rigging skinning weights, and verify camera perspective projection layouts. (Real world: Avatar engine developers audit assets, checking rendering speeds.)",
    syllabus: ["Reviewing perspective camera parameters", "Assembling graphics compliance checklists", "Verifying matrix transformations coordinates"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: 3D Engine & Avatar compliance audit (Review)",
    desc: "Review 3D engines structures, evaluate transformation matrices parameters, check rigging skinning weights, and verify camera perspective projection layouts. (Real world: Avatar engine developers audit assets, checking rendering speeds.)",
    syllabus: ["Reviewing perspective camera parameters", "Assembling graphics compliance checklists", "Verifying matrix transformations coordinates"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: 3D Engine & Avatar compliance audit (Review)",
    desc: "Review 3D engines structures, evaluate transformation matrices parameters, check rigging skinning weights, and verify camera perspective projection layouts. (Real world: Avatar engine developers audit assets, checking rendering speeds.)",
    syllabus: ["Reviewing perspective camera parameters", "Assembling graphics compliance checklists", "Verifying matrix transformations coordinates"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: 3D Engine & Avatar compliance audit (Review)",
    desc: "Review 3D engines structures, evaluate transformation matrices parameters, check rigging skinning weights, and verify camera perspective projection layouts. (Real world: Avatar engine developers audit assets, checking rendering speeds.)",
    syllabus: ["Reviewing perspective camera parameters", "Assembling graphics compliance checklists", "Verifying matrix transformations coordinates"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: 3D Engine & Avatar compliance audit (Review)",
    desc: "Review 3D engines structures, evaluate transformation matrices parameters, check rigging skinning weights, and verify camera perspective projection layouts. (Real world: Avatar engine developers audit assets, checking rendering speeds.)",
    syllabus: ["Reviewing perspective camera parameters", "Assembling graphics compliance checklists", "Verifying matrix transformations coordinates"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: 3D Engine & Avatar compliance audit (Review)",
    desc: "Review 3D engines structures, evaluate transformation matrices parameters, check rigging skinning weights, and verify camera perspective projection layouts. (Real world: Avatar engine developers audit assets, checking rendering speeds.)",
    syllabus: ["Reviewing perspective camera parameters", "Assembling graphics compliance checklists", "Verifying matrix transformations coordinates"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: 3D Engine & Avatar compliance audit (Review)",
    desc: "Review 3D engines structures, evaluate transformation matrices parameters, check rigging skinning weights, and verify camera perspective projection layouts. (Real world: Avatar engine developers audit assets, checking rendering speeds.)",
    syllabus: ["Reviewing perspective camera parameters", "Assembling graphics compliance checklists", "Verifying matrix transformations coordinates"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: 3D Engine & Avatar compliance audit (Review)",
    desc: "Review 3D engines structures, evaluate transformation matrices parameters, check rigging skinning weights, and verify camera perspective projection layouts. (Real world: Avatar engine developers audit assets, checking rendering speeds.)",
    syllabus: ["Reviewing perspective camera parameters", "Assembling graphics compliance checklists", "Verifying matrix transformations coordinates"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: 3D Engine & Avatar compliance audit (Review)",
    desc: "Review 3D engines structures, evaluate transformation matrices parameters, check rigging skinning weights, and verify camera perspective projection layouts. (Real world: Avatar engine developers audit assets, checking rendering speeds.)",
    syllabus: ["Reviewing perspective camera parameters", "Assembling graphics compliance checklists", "Verifying matrix transformations coordinates"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: 3D Engine & Avatar compliance audit (Review)",
    desc: "Review 3D engines structures, evaluate transformation matrices parameters, check rigging skinning weights, and verify camera perspective projection layouts. (Real world: Avatar engine developers audit assets, checking rendering speeds.)",
    syllabus: ["Reviewing perspective camera parameters", "Assembling graphics compliance checklists", "Verifying matrix transformations coordinates"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: 3D Engine & Avatar compliance audit (Review)",
    desc: "Review 3D engines structures, evaluate transformation matrices parameters, check rigging skinning weights, and verify camera perspective projection layouts. (Real world: Avatar engine developers audit assets, checking rendering speeds.)",
    syllabus: ["Reviewing perspective camera parameters", "Assembling graphics compliance checklists", "Verifying matrix transformations coordinates"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  }
];

export const GRAPHICS_3D_30_DAYS_QUESTS = GRAPHICS_3D_30_DAYS_CONFIGS.flatMap((cfg, dIdx) => {
  const dayNum = dIdx + 1;
  const lecture = {
    id: `graphics3d-basics-lecture-day-${dayNum}`,
    title: `Day ${dayNum} Learning: ${cfg.title}`,
    desc: cfg.desc,
    type: "lecture" as const,
    requiresAvatar: true,
    syllabus: cfg.syllabus,
    skillCategory: "theory" as const,
    xp: 150,
    pins: 5
  };
  if (dayNum === 1) {
    return [
      lecture,
      {
        id: `graphics3d-basics-lecture2-day-1`,
        title: `Day 1 Deep Dive: Syntax, Execution Rules, and Line-by-Line Breakdown`,
        desc: `In-depth step-by-step breakdown of Day 1 concepts, memory layout, and execution mechanics. ${cfg.desc}`,
        type: "lecture" as const,
        requiresAvatar: true,
        syllabus: cfg.syllabus,
        skillCategory: "theory" as const,
        xp: 150,
        pins: 5
      },
      {
        id: `graphics3d-basics-lecture3-day-1`,
        title: `Day 1 Workshop: Real-World Industry Context & Visualization Guide`,
        desc: `Practical visualization guide and real-world system architecture context for Day 1. ${cfg.desc}`,
        type: "lecture" as const,
        requiresAvatar: true,
        syllabus: cfg.syllabus,
        skillCategory: "theory" as const,
        xp: 150,
        pins: 5
      }
    ];
  }
  if (dayNum === 2) {
    return [
      lecture,
      {
        id: `graphics3d-basics-lecture2-day-2`,
        title: `Day 2 Deep Dive: Flow Control, Logic Branching, and Execution Paths`,
        desc: `In-depth line-by-line mechanics of conditionals, loops, and memory execution state. ${cfg.desc}`,
        type: "lecture" as const,
        requiresAvatar: true,
        syllabus: cfg.syllabus,
        skillCategory: "theory" as const,
        xp: 150,
        pins: 5
      },
      {
        id: `graphics3d-basics-lecture3-day-2`,
        title: `Day 2 Workshop: Practical Code Workshop & Edge Case Pitfall Warnings`,
        desc: `Practical code workshop analyzing common edge cases, off-by-one errors, and production traps. ${cfg.desc}`,
        type: "lecture" as const,
        requiresAvatar: true,
        syllabus: cfg.syllabus,
        skillCategory: "theory" as const,
        xp: 150,
        pins: 5
      }
    ];
  }
  return buildEnrichedDayQuests('graphics3d-basics', dayNum, cfg);
});
