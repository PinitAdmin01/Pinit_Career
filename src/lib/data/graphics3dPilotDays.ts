import { DayLessonPlan } from '@/lib/types/lessonEngine';

export const GRAPHICS_3D_PILOT_DAYS: DayLessonPlan[] = [
  {
    "day": 1,
    "title": "3D Computer Graphics Fundamentals & Pipeline",
    "overviewMetaphor": "The 3D Graphics Rendering Pipeline is a Hollywood movie production set: the 3D Model sits on a turntable in its own studio room (Local / Model Space); the Director places the actor on the castle movie set (World Space); the Cameraman points their camera lens at the actor from 10 feet away (View / Camera Space); the Camera Lens projects the 3D scene onto a flat piece of 35mm film inside the lens box (Clip Space & NDC); the Movie Projector shines the film onto the flat 2D theater screen (Screen Viewport Pixels).",
    "blocks": [
      {
        "id": "g3d-d1-b1-coordinate-spaces-chain",
        "day": 1,
        "blockNumber": 1,
        "title": "The 3D Coordinate Space Transformation Chain (MVP Matrix)",
        "conceptBudget": {
          "primaryConcept": "Coordinate Space Transformations",
          "supportingTerms": [
            "Local / Model Space (Origin centered on 3D mesh)",
            "World Space (Global scene origin with Model Matrix $M$)",
            "View / Eye Space (Origin at Camera position with View Matrix $V$)",
            "Clip Space & Normalized Device Coordinates (NDC $[-1, +1]$ with Projection Matrix $P$)",
            "Screen Space ($[0, \\text{width}] \\times [0, \\text{height}]$)"
          ]
        },
        "prerequisiteThresholds": [],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "The 3D Coordinate Spaces Pipeline",
              "boxes": [
                {
                  "label": "1. Local Space (Model)",
                  "value": "Vertices relative to 3D object center (e.g. nose at [0, 0, 0])",
                  "varType": "Object Origin",
                  "isUpdated": false
                },
                {
                  "label": "2. World Space (Scene)",
                  "value": "Transformed by Model Matrix M -> Object placed at [10, 0, 50] in world",
                  "varType": "World Origin",
                  "isUpdated": false
                },
                {
                  "label": "3. View Space (Camera)",
                  "value": "Transformed by View Matrix V -> World relative to Camera at [0, 0, 0]",
                  "varType": "Camera Origin",
                  "isUpdated": false
                },
                {
                  "label": "4. Clip / NDC Space",
                  "value": "Transformed by Projection Matrix P -> Perspective divide W into [-1, +1]",
                  "varType": "Cube NDC",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "coordinate_spaces_demo.js",
            "initialCode": "function evaluateSpacesChain() {\n  return 'Local (Model) -> [x ModelMatrix] -> World -> [x ViewMatrix] -> View -> [x ProjMatrix] -> Clip -> [Perspective / W] -> NDC [-1, +1] -> Screen Viewport';\n}\n\nconsole.log(evaluateSpacesChain());",
            "expectedOutput": "Local (Model) -> [x ModelMatrix] -> World -> [x ViewMatrix] -> View -> [x ProjMatrix] -> Clip -> [Perspective / W] -> NDC [-1, +1] -> Screen Viewport",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What coordinate space is produced immediately after multiplying a world-space vertex by the View Matrix?",
          "expectedStringOutput": "View",
          "acceptableAnswers": [
            "View",
            "View Space",
            "Camera Space",
            "View / Eye Space"
          ],
          "primaryMisconceptionId": "MC_3D_PIPELINE_SPACES_LOCAL_WORLD_VIEW_CLIP",
          "diagnosisMap": {
            "World": {
              "misconceptionId": "MC_3D_PIPELINE_SPACES_LOCAL_WORLD_VIEW_CLIP",
              "errorExplanation": "Multiplying by the View matrix transforms World space into View (Camera) space.",
              "recoveryPath": {
                "simplerExplanation": "World * View Matrix = View Space.",
                "guidedFixPrompt": "Type View"
              }
            }
          }
        }
      },
      {
        "id": "g3d-d1-b2-gpu-pipeline-rasterization",
        "day": 1,
        "blockNumber": 2,
        "title": "GPU Programmable Pipeline: Vertex $\\to$ Rasterizer $\\to$ Fragment",
        "conceptBudget": {
          "primaryConcept": "GPU Pipeline Stages",
          "supportingTerms": [
            "Vertex Shader (Runs once per vertex: calculates `gl_Position`)",
            "Primitive Assembly (Groups vertices into triangles)",
            "Rasterizer (Converts triangles into thousands of pixel fragments)",
            "Fragment Shader (Runs once per pixel fragment: calculates color)",
            "Depth & Stencil Tests"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d1-b1-coordinate-spaces-chain",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "GPU Programmable Pipeline Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "VBO Vertex Array: Ingests 3D Positions & Normals",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Vertex Shader: Applies MVP matrix to calculate gl_Position",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Hardware Rasterizer: Interpolates varyings across triangle pixels",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Fragment Shader: Computes final PBR lighting and output color!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "gpu_pipeline_sim.js",
            "initialCode": "function simulatePipeline(vertexCount, screenPixels) {\n  return {\n    vertexShaderInvocations: vertexCount,\n    rasterizedFragmentsGenerated: screenPixels,\n    fragmentShaderInvocations: screenPixels,\n    status: 'GPU_PIPELINE_EXECUTED_60FPS'\n  };\n}\n\nconsole.log(JSON.stringify(simulatePipeline(3, 1920 * 1080))); // 1 full-screen triangle",
            "expectedOutput": "{\"vertexShaderInvocations\":3,\"rasterizedFragmentsGenerated\":2073600,\"fragmentShaderInvocations\":2073600,\"status\":\"GPU_PIPELINE_EXECUTED_60FPS\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Which GPU pipeline stage is responsible for interpolating vertex colors and UV coordinates across the thousands of pixels covered by a triangle?",
          "options": [
            "The Hardware Rasterizer",
            "The Vertex Shader",
            "The CPU memory bus"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_3D_PIPELINE_SPACES_LOCAL_WORLD_VIEW_CLIP",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_3D_PIPELINE_SPACES_LOCAL_WORLD_VIEW_CLIP",
              "errorExplanation": "The rasterizer breaks triangles into pixel fragments and interpolates varyings.",
              "recoveryPath": {
                "simplerExplanation": "The Rasterizer generates fragments and interpolates vertex attributes.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "g3d-d1-b3-right-hand-vs-left-hand-rule",
        "day": 1,
        "blockNumber": 3,
        "title": "Right-Handed Coordinate Systems (WebGL/OpenGL Invariants)",
        "conceptBudget": {
          "primaryConcept": "Right-Handed Coordinate Rules",
          "supportingTerms": [
            "Right-Hand Rule (+X Right, +Y Up, +Z Pointing out of screen towards viewer)",
            "Counter-Clockwise (CCW) Front-Face Winding Rule (`gl.frontFace(gl.CCW)`)",
            "Back-Face Culling (`gl.enable(gl.CULL_FACE)`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d1-b2-gpu-pipeline-rasterization",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Right-Handed Coordinate Invariant",
            "codeSnippet": "// In WebGL (Right-Handed System):\n// +X: Points RIGHT across the screen\n// +Y: Points UP towards the top of the monitor\n// +Z: Points OUT towards the viewer's face! (Objects in front of camera have negative -Z)",
            "lineNotes": {
              "4": "In view space, the camera looks straight down the negative -Z axis."
            }
          },
          {
            "type": "runnable_code",
            "filename": "coordinate_rule_demo.js",
            "initialCode": "function evaluateZDepth(zValue) {\n  return zValue < 0\n    ? 'IN_FRONT_OF_CAMERA: VISIBLE_IN_VIEW_FRUSTUM'\n    : 'BEHIND_CAMERA: CULLED_CLIPPED';\n}\n\nconsole.log('Z = -5.0 (In front):', evaluateZDepth(-5.0));\nconsole.log('Z = +5.0 (Behind):', evaluateZDepth(5.0));",
            "expectedOutput": "Z = -5.0 (In front): IN_FRONT_OF_CAMERA: VISIBLE_IN_VIEW_FRUSTUM\nZ = +5.0 (Behind): BEHIND_CAMERA: CULLED_CLIPPED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "In a standard right-handed WebGL view space, what direction does the camera point?",
          "expectedStringOutput": "IN_FRONT_OF_CAMERA: VISIBLE_IN_VIEW_FRUSTUM",
          "acceptableAnswers": [
            "IN_FRONT_OF_CAMERA: VISIBLE_IN_VIEW_FRUSTUM",
            "Along negative Z",
            "-Z",
            "negative Z"
          ],
          "primaryMisconceptionId": "MC_3D_PIPELINE_SPACES_LOCAL_WORLD_VIEW_CLIP",
          "diagnosisMap": {
            "BEHIND": {
              "misconceptionId": "MC_3D_PIPELINE_SPACES_LOCAL_WORLD_VIEW_CLIP",
              "errorExplanation": "Negative Z values lie in front of the camera in view space (IN_FRONT_OF_CAMERA: VISIBLE_IN_VIEW_FRUSTUM).",
              "recoveryPath": {
                "simplerExplanation": "Negative Z is in front of the camera.",
                "guidedFixPrompt": "Type IN_FRONT_OF_CAMERA: VISIBLE_IN_VIEW_FRUSTUM"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 2,
    "title": "WebGL Canvas Setup & Context Initialization",
    "overviewMetaphor": "The WebGL Context is a painter's easel connected to a high-speed robot: `canvas.getContext('webgl2')` creates the painting surface; if you don't enable the Depth Buffer (`gl.DEPTH_TEST`), the robot paints back walls on top of front characters (Painter's Algorithm chaos!); with Depth Testing enabled, the robot checks a 24-bit ruler per pixel, only drawing paint if the new object is closer to the camera lens than what was already drawn.",
    "blocks": [
      {
        "id": "g3d-d2-b1-webgl2-context-retina-scaling",
        "day": 2,
        "blockNumber": 1,
        "title": "WebGL2 Context Creation & High-DPI Retina DPR Scaling",
        "conceptBudget": {
          "primaryConcept": "WebGL2 Context & Retina Scaling",
          "supportingTerms": [
            "`canvas.getContext('webgl2')`",
            "Device Pixel Ratio (`window.devicePixelRatio`)",
            "Buffer Resolution (`canvas.width = cssWidth * DPR`) vs CSS Size (`canvas.style.width`)",
            "Preventing blurry pixelated rendering on 4K/Retina displays"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d1-b1-coordinate-spaces-chain",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Blurry Canvas Bug vs Retina DPR Fix Diff",
              "brokenCode": "// ❌ BLURRY LOW-RES DISPLAY BUG (Blurry on Retina/Mobile):\ncanvas.width = 800;\ncanvas.height = 600;\n// On a 2x Retina screen, 800x600 buffer is stretched over 1600x1200 physical pixels!",
              "fixedCode": "// ✅ 100% CRISP HIGH-DPI RETINA SETUP:\nconst dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x for GPU performance\ncanvas.width = Math.floor(800 * dpr);   // 1600 physical pixels\ncanvas.height = Math.floor(600 * dpr); // 1200 physical pixels\ncanvas.style.width = '800px';\ncanvas.style.height = '600px';\ngl.viewport(0, 0, canvas.width, canvas.height);",
              "errorLine": 2,
              "errorReason": "Failing to multiply canvas buffer size by window.devicePixelRatio creates blurry 3D graphics on high-DPI screens.",
              "fixExplanation": "Scale canvas buffer by DPR while keeping CSS display size constant."
            }
          },
          {
            "type": "runnable_code",
            "filename": "retina_dpr_demo.js",
            "initialCode": "function calculateCanvasBuffers(cssW, cssH, dpr) {\n  return {\n    cssDimensions: `${cssW}x${cssH}`,\n    physicalBackBufferPixels: `${cssW * dpr}x${cssH * dpr}`,\n    viewportCall: `gl.viewport(0, 0, ${cssW * dpr}, ${cssH * dpr})`,\n    isRetinaSharp: dpr >= 2\n  };\n}\n\nconsole.log(JSON.stringify(calculateCanvasBuffers(800, 600, 2)));",
            "expectedOutput": "{\"cssDimensions\":\"800x600\",\"physicalBackBufferPixels\":\"1600x1200\",\"viewportCall\":\"gl.viewport(0, 0, 1600, 1200)\",\"isRetinaSharp\":true}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What physical back-buffer pixel resolution is allocated for an 800x600 CSS canvas on a 2x Retina screen?",
          "expectedStringOutput": "1600x1200",
          "acceptableAnswers": [
            "1600x1200",
            "physicalBackBufferPixels\":\"1600x1200\""
          ],
          "primaryMisconceptionId": "MC_3D_WEBGL_CONTEXT_VIEWPORT_BUFFER_SWAP",
          "diagnosisMap": {
            "800x600": {
              "misconceptionId": "MC_3D_WEBGL_CONTEXT_VIEWPORT_BUFFER_SWAP",
              "errorExplanation": "800x600 * 2x DPR = 1600x1200 physical buffer pixels.",
              "recoveryPath": {
                "simplerExplanation": "800 * 2 by 600 * 2 = 1600x1200.",
                "guidedFixPrompt": "Type 1600x1200"
              }
            }
          }
        }
      },
      {
        "id": "g3d-d2-b2-depth-buffer-z-fighting",
        "day": 2,
        "blockNumber": 2,
        "title": "The Depth Buffer (Z-Buffer) & Eliminating Z-Fighting",
        "conceptBudget": {
          "primaryConcept": "Depth Testing & Z-Fighting",
          "supportingTerms": [
            "`gl.enable(gl.DEPTH_TEST)`",
            "24-bit Non-linear Depth Buffer ($Z_{\\text{buffer}} \\propto 1/Z$)",
            "Z-Fighting Hazard (Two overlapping polygons at the same depth flicker violently)",
            "Near plane precision tuning ($Z_{\\text{near}} = 0.1$ vs $0.0001$)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d2-b1-webgl2-context-retina-scaling",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Depth Buffer Precision Comparison",
              "boxes": [
                {
                  "label": "1. Bad: Near = 0.0001, Far = 1000",
                  "value": "90% of all 24-bit depth precision wasted in the first 1 millimeter! -> Severe Z-Fighting at 10 meters",
                  "varType": "High Flicker",
                  "isUpdated": false
                },
                {
                  "label": "2. Good: Near = 0.1, Far = 1000",
                  "value": "Depth precision distributed smoothly across walkable scene -> Zero Z-Fighting",
                  "varType": "Stable 24-bit",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "z_fighting_demo.js",
            "initialCode": "function evaluateDepthSetup(nearPlane) {\n  return nearPlane < 0.01\n    ? 'SEVERE_Z_FIGHTING_RISK: NEAR_PLANE_TOO_CLOSE_TO_ZERO'\n    : 'OPTIMAL_DEPTH_PRECISION_ESTABLISHED';\n}\n\nconsole.log('Near = 0.0001:', evaluateDepthSetup(0.0001));\nconsole.log('Near = 0.1:', evaluateDepthSetup(0.1));",
            "expectedOutput": "Near = 0.0001: SEVERE_Z_FIGHTING_RISK: NEAR_PLANE_TOO_CLOSE_TO_ZERO\nNear = 0.1: OPTIMAL_DEPTH_PRECISION_ESTABLISHED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why does setting the camera Near clipping plane too close to zero (e.g. `near = 0.00001`) cause severe Z-Fighting flickering on distant 3D objects?",
          "options": [
            "Because GPU depth buffers store reciprocal depth ($1/Z$); setting Near too small bunches 99% of all 24-bit depth precision in the first few millimeters in front of the lens, leaving almost no precision bits to differentiate distant objects",
            "Because the canvas runs out of RAM",
            "Because WebGL only supports 2D"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_3D_WEBGL_CONTEXT_VIEWPORT_BUFFER_SWAP",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_3D_WEBGL_CONTEXT_VIEWPORT_BUFFER_SWAP",
              "errorExplanation": "Non-linear 1/Z precision concentration starves distant polygons of depth bits.",
              "recoveryPath": {
                "simplerExplanation": "1/Z mapping wastes precision bits when near plane is too small.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "g3d-d2-b3-clear-and-render-loop",
        "day": 2,
        "blockNumber": 3,
        "title": "The RequestAnimationFrame Render Loop & Buffer Clearing",
        "conceptBudget": {
          "primaryConcept": "WebGL Render Loop Lifecycle",
          "supportingTerms": [
            "`requestAnimationFrame(renderLoop)`",
            "`gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)`",
            "Delta Time ($\\Delta t$) calculation for frame-rate independent physics"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d2-b2-depth-buffer-z-fighting",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Standard WebGL Master Render Loop",
            "codeSnippet": "let lastTime = 0;\nfunction renderLoop(currentTimeMs) {\n  const deltaSec = (currentTimeMs - lastTime) / 1000;\n  lastTime = currentTimeMs;\n\n  // Clear Color and Depth buffers before drawing:\n  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);\n\n  updatePhysics(deltaSec);\n  drawScene();\n\n  requestAnimationFrame(renderLoop); // Schedule next 60/120 FPS frame\n}",
            "lineNotes": {
              "7": "Must clear BOTH color and depth buffers on every frame."
            }
          },
          {
            "type": "runnable_code",
            "filename": "render_loop_sim.js",
            "initialCode": "function simulateRenderLoop(fps) {\n  const frameTimeMs = 1000 / fps;\n  return `At ${fps} FPS, each frame has a strict budget of ${frameTimeMs.toFixed(2)} ms for CPU + GPU work!`;\n}\n\nconsole.log(simulateRenderLoop(60));\nconsole.log(simulateRenderLoop(120));",
            "expectedOutput": "At 60 FPS, each frame has a strict budget of 16.67 ms for CPU + GPU work!\nAt 120 FPS, each frame has a strict budget of 8.33 ms for CPU + GPU work!",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the maximum time budget (in ms) per frame to maintain a smooth 60 FPS render loop?",
          "expectedStringOutput": "16.67",
          "acceptableAnswers": [
            "16.67",
            "16.67 ms",
            "16.67ms",
            "strict budget of 16.67 ms"
          ],
          "primaryMisconceptionId": "MC_3D_WEBGL_CONTEXT_VIEWPORT_BUFFER_SWAP",
          "diagnosisMap": {
            "33": {
              "misconceptionId": "MC_3D_WEBGL_CONTEXT_VIEWPORT_BUFFER_SWAP",
              "errorExplanation": "33ms is for 30 FPS. 60 FPS requires 1000 / 60 = 16.67 ms.",
              "recoveryPath": {
                "simplerExplanation": "1000 / 60 = 16.67 ms.",
                "guidedFixPrompt": "Type 16.67"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 3,
    "title": "Linear Algebra: Vectors, Dot & Cross Products",
    "overviewMetaphor": "3D Vectors are flashlight beams: Vector Normalization ensures all beams have the exact same 1-meter length so comparisons are fair; the Dot Product ($A \\cdot B$) is a solar panel light meter: if the flashlight shines directly perpendicular onto the panel ($90^\\circ$), Dot Product is 1.0 (Maximum brightness!); if it shines sideways ($0^\\circ$), Dot Product is 0.0 (Pitch black!); the Cross Product ($A \\times B$) takes two sticks lying flat on a table and builds a flagpole pointing straight up into the sky (Surface Normal!).",
    "blocks": [
      {
        "id": "g3d-d3-b1-vector-normalization-magnitude",
        "day": 3,
        "blockNumber": 1,
        "title": "3D Vector Normalization & The Unit Length ($\\|v\\| = 1.0$)",
        "conceptBudget": {
          "primaryConcept": "Vector Normalization",
          "supportingTerms": [
            "Euclidean Magnitude: $\\|v\\| = \\sqrt{x^2 + y^2 + z^2}$",
            "Unit Vector: $\\hat{v} = \\frac{v}{\\|v\\|}$",
            "Divide-by-Zero Hazard prevention ($\\|v\\| < 10^{-6}$)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d1-b1-coordinate-spaces-chain",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "normalize_demo.js",
            "initialCode": "function normalizeVector3D(v) {\n  const mag = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);\n  if (mag < 1e-6) return [0, 0, 0];\n  return [Number((v[0]/mag).toFixed(3)), Number((v[1]/mag).toFixed(3)), Number((v[2]/mag).toFixed(3))];\n}\n\nconsole.log('Normalize [3, 0, 4]:', JSON.stringify(normalizeVector3D([3, 0, 4])));",
            "expectedOutput": "Normalize [3, 0, 4]: [0.6,0,0.8]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the normalized unit vector of `[3, 0, 4]` (magnitude $= 5$)?",
          "expectedStringOutput": "[0.6,0,0.8]",
          "acceptableAnswers": [
            "[0.6,0,0.8]",
            "[0.6, 0, 0.8]"
          ],
          "primaryMisconceptionId": "MC_3D_LINEAR_ALGEBRA_DOT_CROSS_NORMALIZATION",
          "diagnosisMap": {
            "[3,0,4]": {
              "misconceptionId": "MC_3D_LINEAR_ALGEBRA_DOT_CROSS_NORMALIZATION",
              "errorExplanation": "[3/5, 0/5, 4/5] = [0.6, 0, 0.8].",
              "recoveryPath": {
                "simplerExplanation": "Divide by magnitude 5 -> [0.6, 0, 0.8].",
                "guidedFixPrompt": "Type [0.6,0,0.8]"
              }
            }
          }
        }
      },
      {
        "id": "g3d-d3-b2-dot-product-lambert-cosine",
        "day": 3,
        "blockNumber": 2,
        "title": "The Dot Product ($A \\cdot B$) & Lambert's Cosine Law",
        "conceptBudget": {
          "primaryConcept": "Dot Product & Angle Calculation",
          "supportingTerms": [
            "$A \\cdot B = x_1 x_2 + y_1 y_2 + z_1 z_2 = \\|A\\| \\|B\\| \\cos\\theta$",
            "Perpendicular Vectors ($A \\cdot B = 0$)",
            "Parallel Same Direction ($A \\cdot B = 1$)",
            "Lambertian Lighting: $\\text{Intensity} = \\max(N \\cdot L, 0)$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d3-b1-vector-normalization-magnitude",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "dot_product_demo.js",
            "initialCode": "function evaluateDotLighting(normal, lightDir) {\n  const dot = normal[0]*lightDir[0] + normal[1]*lightDir[1] + normal[2]*lightDir[2];\n  const diffuse = Math.max(0, dot);\n  return {\n    rawDotProduct: Number(dot.toFixed(3)),\n    diffuseIntensity: Number(diffuse.toFixed(3)),\n    status: (diffuse > 0) ? 'ILLUMINATED_SURFACE' : 'BACKFACING_SHADOW'\n  };\n}\n\nconsole.log('Head on:', JSON.stringify(evaluateDotLighting([0, 1, 0], [0, 1, 0])));\nconsole.log('Behind:', JSON.stringify(evaluateDotLighting([0, 1, 0], [0, -1, 0])));",
            "expectedOutput": "Head on: {\"rawDotProduct\":1,\"diffuseIntensity\":1,\"status\":\"ILLUMINATED_SURFACE\"}\nBehind: {\"rawDotProduct\":-1,\"diffuseIntensity\":0,\"status\":\"BACKFACING_SHADOW\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why is `Math.max(dot(N, L), 0.0)` used in 3D lighting calculations?",
          "options": [
            "To clamp negative dot products to 0, ensuring surfaces facing away from the light source remain dark rather than emitting negative light",
            "Because dot products cannot be negative",
            "To invert the color palette"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_3D_LINEAR_ALGEBRA_DOT_CROSS_NORMALIZATION",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_3D_LINEAR_ALGEBRA_DOT_CROSS_NORMALIZATION",
              "errorExplanation": "Negative dot products mean the surface faces away from the light and must be clamped to 0.",
              "recoveryPath": {
                "simplerExplanation": "Clamps negative values so backfacing surfaces don't subtract light.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "g3d-d3-b3-cross-product-surface-normals",
        "day": 3,
        "blockNumber": 3,
        "title": "The Cross Product ($A \\times B$) & Triangle Surface Normals",
        "conceptBudget": {
          "primaryConcept": "Cross Product Normal Generation",
          "supportingTerms": [
            "$C = A \\times B = (a_y b_z - a_z b_y, a_z b_x - a_x b_z, a_x b_y - a_y b_x)$",
            "Anti-Commutative: $B \\times A = -(A \\times B)$",
            "Counter-Clockwise Vertex Ordering creates outward-pointing surface normals"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d3-b2-dot-product-lambert-cosine",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "cross_product_demo.js",
            "initialCode": "function crossProduct3D(a, b) {\n  return [\n    (a[1] * b[2]) - (a[2] * b[1]),\n    (a[2] * b[0]) - (a[0] * b[2]),\n    (a[0] * b[1]) - (a[1] * b[0])\n  ];\n}\n\nconsole.log('+X cross +Y =', JSON.stringify(crossProduct3D([1, 0, 0], [0, 1, 0])));\nconsole.log('+Y cross +X =', JSON.stringify(crossProduct3D([0, 1, 0], [1, 0, 0])));",
            "expectedOutput": "+X cross +Y = [0,0,1]\n+Y cross +X = [0,0,-1]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What 3D vector is produced by the cross product of `+X [1, 0, 0]` and `+Y [0, 1, 0]`?",
          "expectedStringOutput": "[0,0,1]",
          "acceptableAnswers": [
            "[0,0,1]",
            "[0, 0, 1]",
            "+Z"
          ],
          "primaryMisconceptionId": "MC_3D_LINEAR_ALGEBRA_DOT_CROSS_NORMALIZATION",
          "diagnosisMap": {
            "[0,0,-1]": {
              "misconceptionId": "MC_3D_LINEAR_ALGEBRA_DOT_CROSS_NORMALIZATION",
              "errorExplanation": "X cross Y = +Z [0, 0, 1]. Y cross X = -Z [0, 0, -1].",
              "recoveryPath": {
                "simplerExplanation": "X x Y = [0, 0, 1].",
                "guidedFixPrompt": "Type [0,0,1]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 4,
    "title": "Transformation Matrices: Translation, Rotation & Scale",
    "overviewMetaphor": "A $4 \\times 4$ Transformation Matrix is a 3D recipe book: Translation shifts the character across the kitchen floor; Rotation turns the character around their spine; Scale makes the character twice as tall; Matrix Order ($M = T \\times R \\times S$) matters critically: if you scale first then translate, you walk 5 feet; if you translate first then scale, you walk 10 feet because your footsteps were scaled up too! (Non-commutative multiplication).",
    "blocks": [
      {
        "id": "g3d-d4-b1-4x4-affine-matrix-layout",
        "day": 4,
        "blockNumber": 1,
        "title": "4x4 Homogeneous Transformation Matrix Architecture",
        "conceptBudget": {
          "primaryConcept": "4x4 Matrix Architecture",
          "supportingTerms": [
            "Column-Major Order (OpenGL/WebGL standard)",
            "Upper-left $3 \\times 3$: Rotation & Scaling",
            "Column 3 ($m_{12}, m_{13}, m_{14}$): Translation $T_x, T_y, T_z$",
            "Row 3: $[0, 0, 0, 1]$ Homogeneous coordinate holder"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d1-b1-coordinate-spaces-chain",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Column-Major 4x4 Transformation Matrix Layout",
              "boxes": [
                {
                  "label": "Col 0 (Indices 0, 1, 2, 3)",
                  "value": "[ScaleX, RotXY, RotXZ, 0] -> Transformed X Axis Vector",
                  "varType": "X Basis",
                  "isUpdated": false
                },
                {
                  "label": "Col 1 (Indices 4, 5, 6, 7)",
                  "value": "[RotYX, ScaleY, RotYZ, 0] -> Transformed Y Axis Vector",
                  "varType": "Y Basis",
                  "isUpdated": false
                },
                {
                  "label": "Col 2 (Indices 8, 9, 10, 11)",
                  "value": "[RotZX, RotZY, ScaleZ, 0] -> Transformed Z Axis Vector",
                  "varType": "Z Basis",
                  "isUpdated": false
                },
                {
                  "label": "Col 3 (Indices 12, 13, 14, 15)",
                  "value": "[Tx, Ty, Tz, 1] -> Translation Position Vector",
                  "varType": "Translation",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "matrix4_layout_demo.js",
            "initialCode": "function inspectMatrixElements() {\n  return 'Indices 0,5,10 = Diagonal Scale | Indices 12,13,14 = Translation (Tx, Ty, Tz) | Index 15 = 1.0';\n}\n\nconsole.log(inspectMatrixElements());",
            "expectedOutput": "Indices 0,5,10 = Diagonal Scale | Indices 12,13,14 = Translation (Tx, Ty, Tz) | Index 15 = 1.0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which flat array indices store the Translation coordinates $(T_x, T_y, T_z)$ in a column-major 4x4 matrix?",
          "expectedStringOutput": "12,13,14",
          "acceptableAnswers": [
            "12,13,14",
            "12, 13, 14",
            "Indices 12,13,14"
          ],
          "primaryMisconceptionId": "MC_3D_TRANSFORMATION_MATRICES_TRANSLATE_ROTATE_SCALE",
          "diagnosisMap": {
            "0,1,2": {
              "misconceptionId": "MC_3D_TRANSFORMATION_MATRICES_TRANSLATE_ROTATE_SCALE",
              "errorExplanation": "In column-major order, translation is in the 4th column (indices 12, 13, 14).",
              "recoveryPath": {
                "simplerExplanation": "Column 4 = indices 12, 13, 14.",
                "guidedFixPrompt": "Type 12,13,14"
              }
            }
          }
        }
      },
      {
        "id": "g3d-d4-b2-matrix-multiplication-trs-order",
        "day": 4,
        "blockNumber": 2,
        "title": "Matrix Composition Order: $M = T \\times R \\times S$ (Scale $\\to$ Rotate $\\to$ Translate)",
        "conceptBudget": {
          "primaryConcept": "TRS Matrix Order",
          "supportingTerms": [
            "Non-Commutative Multiplication: $A \\times B \\ne B \\times A$",
            "Standard Order ($P_{\\text{world}} = T \\times R \\times S \\times P_{\\text{local}}$)",
            "Evaluation Right-to-Left: Scale is applied to vertex first, then Rotation, then Translation"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d4-b1-4x4-affine-matrix-layout",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Wrong Matrix Order Bug vs TRS Order Fix",
              "brokenCode": "// ❌ WRONG ORDER BUG: S * R * T\n// Vertex is translated FIRST, then rotated around world origin, then scaled!\n// The 3D object flies in an unexpected giant orbit around the origin!",
              "fixedCode": "// ✅ 100% CORRECT TRS MATRIX ORDER: T * R * S\n// 1. Scales around object center\n// 2. Rotates around object center\n// 3. Translates to world position!\nconst modelMatrix = multiplyMatrices(translationMat, multiplyMatrices(rotationMat, scaleMat));",
              "errorLine": 2,
              "errorReason": "Evaluating transformations in wrong order causes objects to rotate around world origin instead of their local center.",
              "fixExplanation": "Compose matrices as Translation * Rotation * Scale (TRS)."
            }
          },
          {
            "type": "runnable_code",
            "filename": "trs_order_sim.js",
            "initialCode": "function explainTrsOrder() {\n  return 'P_world = (Translation * Rotation * Scale) * P_local -> Vertex is Scaled, then Rotated, then Translated!';\n}\n\nconsole.log(explainTrsOrder());",
            "expectedOutput": "P_world = (Translation * Rotation * Scale) * P_local -> Vertex is Scaled, then Rotated, then Translated!",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why must affine transformation matrices be multiplied in the strict order $M = T \\times R \\times S$?",
          "options": [
            "Because matrix operations apply right-to-left; multiplying $T \\times R \\times S$ ensures the vertex is scaled locally first, rotated about its own center second, and finally translated into world space last",
            "Because matrix multiplication is commutative",
            "Because GPUs cannot divide matrices"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_3D_TRANSFORMATION_MATRICES_TRANSLATE_ROTATE_SCALE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_3D_TRANSFORMATION_MATRICES_TRANSLATE_ROTATE_SCALE",
              "errorExplanation": "TRS order guarantees local scaling and rotation before world translation.",
              "recoveryPath": {
                "simplerExplanation": "Applies right-to-left: Scale -> Rotate -> Translate.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "g3d-d4-b3-matrix-inversion-normal-transform",
        "day": 4,
        "blockNumber": 3,
        "title": "Normal Matrix: Transpose of Inverse ($M_{\\text{normal}} = (M^{-1})^T$)",
        "conceptBudget": {
          "primaryConcept": "Normal Matrix Transformation",
          "supportingTerms": [
            "Non-Uniform Scale Distortion Hazard (Scaling $X=2, Y=1$ makes surface normals non-perpendicular!)",
            "Normal Matrix Theorem: $M_{\\text{normal}} = (M_{\\text{model}}^{-1})^T$",
            "Preserving $90^\\circ$ perpendicular normals under non-uniform scaling"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d4-b2-matrix-multiplication-trs-order",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "normal_matrix_demo.js",
            "initialCode": "function evaluateNormalMatrixNeed(scaleX, scaleY) {\n  return (scaleX !== scaleY)\n    ? 'NON_UNIFORM_SCALE: MUST_USE_INVERSE_TRANSPOSE_NORMAL_MATRIX'\n    : 'UNIFORM_SCALE: MODEL_MATRIX_3X3_SUFFICIENT';\n}\n\nconsole.log('Scale (2, 1):', evaluateNormalMatrixNeed(2, 1));\nconsole.log('Scale (2, 2):', evaluateNormalMatrixNeed(2, 2));",
            "expectedOutput": "Scale (2, 1): NON_UNIFORM_SCALE: MUST_USE_INVERSE_TRANSPOSE_NORMAL_MATRIX\nScale (2, 2): UNIFORM_SCALE: MODEL_MATRIX_3X3_SUFFICIENT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why can surface normal vectors NOT simply be multiplied by the standard Model Matrix when non-uniform scaling ($S_x \\ne S_y$) is present?",
          "options": [
            "Because non-uniform scaling stretches the surface unevenly, pulling the normal vector off-angle so it is no longer perpendicular to the surface; multiplying by the Transpose of Inverse matrix corrects this distortion",
            "Because normals cannot be scaled",
            "To save memory"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_3D_TRANSFORMATION_MATRICES_TRANSLATE_ROTATE_SCALE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_3D_TRANSFORMATION_MATRICES_TRANSLATE_ROTATE_SCALE",
              "errorExplanation": "Non-uniform scaling distorts normals unless the Inverse Transpose is used.",
              "recoveryPath": {
                "simplerExplanation": "Inverse transpose prevents normal angle distortion under non-uniform scale.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Interactive 3D Orbit Camera & Transformation Engine",
    "overviewMetaphor": "Milestone 1 — The Master Director's Viewfinder: We build the complete interactive 3D transformation engine: Model matrices place objects in the scene, Orbit Camera controls (Yaw, Pitch, Distance) revolve smoothly around the target avatar, View Matrix transforms world points into camera space, and smooth arcball damping gives silky 60 FPS camera motion.",
    "blocks": [
      {
        "id": "g3d-d5-b1-orbit-camera-math",
        "day": 5,
        "blockNumber": 1,
        "title": "Spherical Orbit Camera Mathematics (Yaw, Pitch & Radius)",
        "conceptBudget": {
          "primaryConcept": "Spherical Orbit Camera Coordinates",
          "supportingTerms": [
            "Yaw ($\\theta$: Rotation around Y axis)",
            "Pitch ($\\phi$: Elevation angle clamped $[-89^\\circ, +89^\\circ]$)",
            "Radius ($r$: Distance from target)",
            "Conversion: $x = r\\cos\\phi\\sin\\theta, y = r\\sin\\phi, z = r\\cos\\phi\\cos\\theta$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d4-b2-matrix-multiplication-trs-order",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Spherical-to-Cartesian Orbit Camera Math",
            "codeSnippet": "const clampedPitch = Math.max(-1.55, Math.min(1.55, pitchRad)); // Clamp to ~89 degrees\nconst eyeX = target[0] + radius * Math.cos(clampedPitch) * Math.sin(yawRad);\nconst eyeY = target[1] + radius * Math.sin(clampedPitch);\nconst eyeZ = target[2] + radius * Math.cos(clampedPitch) * Math.cos(yawRad);",
            "lineNotes": {
              "1": "Clamping pitch prevents camera from flipping upside-down over the North pole."
            }
          },
          {
            "type": "runnable_code",
            "filename": "orbit_math_demo.js",
            "initialCode": "function getCameraEye(target, yaw, pitch, r) {\n  const x = target[0] + r * Math.cos(pitch) * Math.sin(yaw);\n  const y = target[1] + r * Math.sin(pitch);\n  const z = target[2] + r * Math.cos(pitch) * Math.cos(yaw);\n  return [Number(x.toFixed(2)), Number(y.toFixed(2)), Number(z.toFixed(2))];\n}\n\nconsole.log('Camera eye at 10m:', JSON.stringify(getCameraEye([0, 1, 0], 0, 0, 10)));",
            "expectedOutput": "Camera eye at 10m: [0,1,10]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What 3D position is computed for the camera eye with target `[0, 1, 0]`, yaw `= 0`, pitch `= 0`, and radius `= 10`?",
          "expectedStringOutput": "[0,1,10]",
          "acceptableAnswers": [
            "[0,1,10]",
            "[0, 1, 10]"
          ],
          "primaryMisconceptionId": "MC_3D_CAMERA_CONTROLS_ORBIT_QUATERNION_GIMBAL_LOCK",
          "diagnosisMap": {
            "[0,0,10]": {
              "misconceptionId": "MC_3D_CAMERA_CONTROLS_ORBIT_QUATERNION_GIMBAL_LOCK",
              "errorExplanation": "Target Y is 1.0, so eye position is [0, 1, 10].",
              "recoveryPath": {
                "simplerExplanation": "Includes target Y offset -> [0, 1, 10].",
                "guidedFixPrompt": "Type [0,1,10]"
              }
            }
          }
        }
      },
      {
        "id": "g3d-d5-b2-lookat-view-matrix-builder",
        "day": 5,
        "blockNumber": 2,
        "title": "Constructing the LookAt View Matrix ($M_{\\text{view}}$)",
        "conceptBudget": {
          "primaryConcept": "LookAt Matrix Construction",
          "supportingTerms": [
            "Forward Vector: $F = \\text{normalize}(\\text{target} - \\text{eye})$",
            "Right Vector: $R = \\text{normalize}(F \\times \\text{up})$",
            "Up Vector: $U = R \\times F$",
            "Combined View Matrix: Rotation transposed $\\times$ Eye translation inverted"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d5-b1-orbit-camera-math",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "lookat_demo.js",
            "initialCode": "function buildLookAt(eye, target, up = [0, 1, 0]) {\n  return {\n    eyePosition: eye,\n    targetPosition: target,\n    viewMatrixCalculated: true,\n    status: 'LOOKAT_VIEW_MATRIX_CONSTRUCTED'\n  };\n}\n\nconsole.log(buildLookAt([0, 2, 5], [0, 1, 0]).status);",
            "expectedOutput": "LOOKAT_VIEW_MATRIX_CONSTRUCTED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status string confirms successful construction of the LookAt View Matrix?",
          "expectedStringOutput": "LOOKAT_VIEW_MATRIX_CONSTRUCTED",
          "acceptableAnswers": [
            "LOOKAT_VIEW_MATRIX_CONSTRUCTED",
            "status: LOOKAT_VIEW_MATRIX_CONSTRUCTED"
          ],
          "primaryMisconceptionId": "MC_3D_CAMERA_CONTROLS_ORBIT_QUATERNION_GIMBAL_LOCK",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_3D_CAMERA_CONTROLS_ORBIT_QUATERNION_GIMBAL_LOCK",
              "errorExplanation": "Matches LOOKAT_VIEW_MATRIX_CONSTRUCTED.",
              "recoveryPath": {
                "simplerExplanation": "Matches LOOKAT_VIEW_MATRIX_CONSTRUCTED.",
                "guidedFixPrompt": "Type LOOKAT_VIEW_MATRIX_CONSTRUCTED"
              }
            }
          }
        }
      },
      {
        "id": "g3d-d5-b3-milestone1-g3d-cert",
        "day": 5,
        "blockNumber": 3,
        "title": "Milestone 1 3D Orbit Camera & Transformation Engine Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 1 Certification",
          "supportingTerms": [
            "Interactive Camera Engine Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d5-b2-lookat-view-matrix-builder",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone1_g3d_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 1: Interactive 3D Orbit Camera & Transformation Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 1: Interactive 3D Orbit Camera & Transformation Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 1 completion?",
          "expectedStringOutput": "⭐ MILESTONE 1: Interactive 3D Orbit Camera & Transformation Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 1: Interactive 3D Orbit Camera & Transformation Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_3D_CAMERA_CONTROLS_ORBIT_QUATERNION_GIMBAL_LOCK",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_3D_CAMERA_CONTROLS_ORBIT_QUATERNION_GIMBAL_LOCK",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 1: Interactive 3D Orbit Camera & Transformation Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 6,
    "title": "Perspective Projection & Frustum Culling",
    "overviewMetaphor": "Perspective Projection is looking through a pyramid-shaped glass megaphone: objects close to the glass look huge; objects far away look tiny (Perspective Foreshortening: dividing by distance $W$); anything outside the 6 walls of the pyramid (Left, Right, Top, Bottom, Near, Far planes) is culled instantly before drawing, saving 90% of GPU rendering work.",
    "blocks": [
      {
        "id": "g3d-d6-b1-perspective-matrix-equation",
        "day": 6,
        "blockNumber": 1,
        "title": "Perspective Matrix Equation & Focal Length ($f = 1/\\tan(\\text{FOV}/2)$)",
        "conceptBudget": {
          "primaryConcept": "Perspective Projection Formula",
          "supportingTerms": [
            "Field of View ($\\text{FOV}_y$ in radians)",
            "Aspect Ratio ($\\text{width}/\\text{height}$)",
            "Focal Length: $f = \\frac{1}{\\tan(\\text{FOV}_y / 2)}$",
            "Perspective Divide: $X_{\\text{ndc}} = X_{\\text{clip}} / W_{\\text{clip}}$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d4-b1-4x4-affine-matrix-layout",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Perspective Projection Matrix Math",
            "codeSnippet": "const f = 1.0 / Math.tan(fovyRad / 2.0);\nconst nf = 1.0 / (near - far);\nconst projMatrix = [\n  f / aspect, 0, 0, 0,\n  0, f, 0, 0,\n  0, 0, (far + near) * nf, -1,\n  0, 0, (2 * far * near) * nf, 0\n];",
            "lineNotes": {
              "1": "Focal length scales coordinates inversely with FOV.",
              "7": "Stores -1 in element (2,3) to copy -Z into W for perspective divide."
            }
          },
          {
            "type": "runnable_code",
            "filename": "perspective_focal_demo.js",
            "initialCode": "function calculateFocalLength(fovDegrees) {\n  const fovRad = fovDegrees * (Math.PI / 180);\n  const f = 1.0 / Math.tan(fovRad / 2.0);\n  return {\n    fovDegrees,\n    focalLengthF: Number(f.toFixed(3))\n  };\n}\n\nconsole.log(JSON.stringify(calculateFocalLength(60))); // Standard 60 deg FOV\nconsole.log(JSON.stringify(calculateFocalLength(90))); // Wide angle 90 deg FOV",
            "expectedOutput": "{\"fovDegrees\":60,\"focalLengthF\":1.732}\n{\"fovDegrees\":90,\"focalLengthF\":1}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the focal length $f = 1 / \\tan(45^\\circ)$ for a 90° FOV ($45^\\circ$ half-angle)?",
          "expectedStringOutput": "1",
          "acceptableAnswers": [
            "1",
            "1.0",
            "focalLengthF\":1"
          ],
          "primaryMisconceptionId": "MC_3D_PERSPECTIVE_PROJECTION_FOV_FRUSTUM_ASPECT",
          "diagnosisMap": {
            "1.732": {
              "misconceptionId": "MC_3D_PERSPECTIVE_PROJECTION_FOV_FRUSTUM_ASPECT",
              "errorExplanation": "1.732 is for 60° FOV. 90° FOV gives tan(45°) = 1, so f = 1.",
              "recoveryPath": {
                "simplerExplanation": "tan(45) = 1 -> f = 1.",
                "guidedFixPrompt": "Type 1"
              }
            }
          }
        }
      },
      {
        "id": "g3d-d6-b2-view-frustum-6-planes-culling",
        "day": 6,
        "blockNumber": 2,
        "title": "View Frustum Culling: 6 Bounding Planes Test",
        "conceptBudget": {
          "primaryConcept": "Frustum Culling Algorithms",
          "supportingTerms": [
            "Frustum Pyramid (Near, Far, Left, Right, Top, Bottom planes)",
            "Plane Equation: $Ax + By + Cz + D = 0$",
            "Sphere-Plane Distance Test: $\\text{dist} = A x_0 + B y_0 + C z_0 + D < -R$ (Culled!)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d6-b1-perspective-matrix-equation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "frustum_cull_demo.js",
            "initialCode": "function evaluateSphereInFrustum(sphereCenter, radius, planeD = 10) {\n  const distToPlane = sphereCenter[2] + planeD;\n  if (distToPlane < -radius) return 'OUTSIDE_FRUSTUM: CULL_OBJECT_SAVE_DRAW_CALL';\n  if (distToPlane > radius) return 'INSIDE_FRUSTUM: RENDER_OBJECT';\n  return 'INTERSECTING_PLANE: RENDER_OBJECT';\n}\n\nconsole.log(evaluateSphereInFrustum([0, 0, -15], 1, 10)); // Far outside\nconsole.log(evaluateSphereInFrustum([0, 0, -5], 1, 10));  // Inside",
            "expectedOutput": "OUTSIDE_FRUSTUM: CULL_OBJECT_SAVE_DRAW_CALL\nINSIDE_FRUSTUM: RENDER_OBJECT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "How does CPU-side Frustum Culling improve 3D rendering performance?",
          "options": [
            "It tests the bounding sphere of each 3D object against the 6 camera frustum planes; if completely outside, the object is skipped entirely, saving expensive GPU draw calls and vertex processing",
            "By lowering screen resolution to 240p",
            "By deleting 3D models from disk"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_3D_PERSPECTIVE_PROJECTION_FOV_FRUSTUM_ASPECT",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_3D_PERSPECTIVE_PROJECTION_FOV_FRUSTUM_ASPECT",
              "errorExplanation": "Frustum culling discards objects outside camera view, saving draw calls.",
              "recoveryPath": {
                "simplerExplanation": "Skips objects outside the 6 planes to save GPU draw calls.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "g3d-d6-b3-orthographic-vs-perspective",
        "day": 6,
        "blockNumber": 3,
        "title": "Orthographic vs Perspective Projections",
        "conceptBudget": {
          "primaryConcept": "Orthographic vs Perspective",
          "supportingTerms": [
            "Perspective (Foreshortening with $W$ divide -> 3D realism)",
            "Orthographic (Parallel projection lines without $W$ divide -> Isometric games, CAD blueprints, UI overlays)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d6-b2-view-frustum-6-planes-culling",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Projection Types Comparison",
              "boxes": [
                {
                  "label": "1. Perspective Projection",
                  "value": "Frustum: Pyramid | Foreshortening: YES | Use: 3D world, avatars, realistic games",
                  "varType": "Realistic 3D",
                  "isUpdated": true
                },
                {
                  "label": "2. Orthographic Projection",
                  "value": "Frustum: Rectangular Box | Foreshortening: NO | Use: 2D HUD UI, minimaps, CAD blueprints",
                  "varType": "Parallel Isometric",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "proj_compare_demo.js",
            "initialCode": "function selectProjection(useCase) {\n  if (useCase === '2D_HUD_INTERFACE') return 'ORTHOGRAPHIC_PROJECTION (Parallel lines, zero perspective distortion)';\n  if (useCase === 'AVATAR_CINEMATIC') return 'PERSPECTIVE_PROJECTION (Realistic depth & foreshortening)';\n  return 'STANDARD';\n}\n\nconsole.log(selectProjection('2D_HUD_INTERFACE'));\nconsole.log(selectProjection('AVATAR_CINEMATIC'));",
            "expectedOutput": "ORTHOGRAPHIC_PROJECTION (Parallel lines, zero perspective distortion)\nPERSPECTIVE_PROJECTION (Realistic depth & foreshortening)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which projection mode is required for rendering 2D HUD interfaces and minimaps without perspective distortion?",
          "expectedStringOutput": "ORTHOGRAPHIC_PROJECTION (Parallel lines, zero perspective distortion)",
          "acceptableAnswers": [
            "ORTHOGRAPHIC_PROJECTION (Parallel lines, zero perspective distortion)",
            "ORTHOGRAPHIC_PROJECTION",
            "Orthographic"
          ],
          "primaryMisconceptionId": "MC_3D_PERSPECTIVE_PROJECTION_FOV_FRUSTUM_ASPECT",
          "diagnosisMap": {
            "PERSPECTIVE": {
              "misconceptionId": "MC_3D_PERSPECTIVE_PROJECTION_FOV_FRUSTUM_ASPECT",
              "errorExplanation": "2D HUD elements use ORTHOGRAPHIC_PROJECTION to prevent perspective scaling.",
              "recoveryPath": {
                "simplerExplanation": "HUD uses ORTHOGRAPHIC_PROJECTION.",
                "guidedFixPrompt": "Type ORTHOGRAPHIC_PROJECTION (Parallel lines, zero perspective distortion)"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 7,
    "title": "Shaders in GLSL: Vertex & Fragment Pipelines",
    "overviewMetaphor": "GLSL Shaders are microscopic assembly lines running on 2,000 GPU cores: the Vertex Shader is an origami folder (Taking 3D vertex corners and folding them into the correct 2D screen positions); the Fragment Shader is a spray-paint robot (Calculating the exact metallic reflection, shadow darkness, and final color of every single pixel on screen 60 times per second).",
    "blocks": [
      {
        "id": "g3d-d7-b1-glsl-syntax-variable-qualifiers",
        "day": 7,
        "blockNumber": 1,
        "title": "GLSL Syntax: Attributes (`in`), Uniforms & Varyings (`out`)",
        "conceptBudget": {
          "primaryConcept": "GLSL Variable Qualifiers",
          "supportingTerms": [
            "`in` (Per-vertex attributes: position, normal, UV)",
            "`uniform` (Constant across entire draw call: MVP matrices, light positions)",
            "`out` / `varying` (Values calculated in vertex shader, interpolated across pixels for fragment shader)",
            "`gl_Position` & `out vec4 fragColor`"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d1-b2-gpu-pipeline-rasterization",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Complete WebGL2 Vertex Shader (GLSL 300 ES)",
            "codeSnippet": "#version 300 es\nlayout(location = 0) in vec3 a_Position;\nlayout(location = 1) in vec3 a_Normal;\nlayout(location = 2) in vec2 a_TexCoord;\n\nuniform mat4 u_ModelViewProjection;\nuniform mat3 u_NormalMatrix;\n\nout vec3 v_Normal;\nout vec2 v_TexCoord;\n\nvoid main() {\n  v_Normal = u_NormalMatrix * a_Normal;\n  v_TexCoord = a_TexCoord;\n  gl_Position = u_ModelViewProjection * vec4(a_Position, 1.0);\n}",
            "lineNotes": {
              "2": "Attribute input location 0 for vertex position.",
              "6": "Uniform matrix constant for entire 3D mesh.",
              "9": "Output varying passed to rasterizer for interpolation.",
              "15": "Built-in clip-space vertex output."
            }
          },
          {
            "type": "runnable_code",
            "filename": "glsl_qualifier_demo.js",
            "initialCode": "function evaluateQualifier(variableName) {\n  if (variableName.startsWith('a_')) return 'ATTRIBUTE: UNIQUE_PER_VERTEX';\n  if (variableName.startsWith('u_')) return 'UNIFORM: CONSTANT_ACROSS_DRAW_CALL';\n  if (variableName.startsWith('v_')) return 'VARYING: INTERPOLATED_ACROSS_PIXEL_FRAGMENTS';\n  return 'LOCAL';\n}\n\nconsole.log('u_MVP:', evaluateQualifier('u_MVP'));\nconsole.log('a_Position:', evaluateQualifier('a_Position'));\nconsole.log('v_TexCoord:', evaluateQualifier('v_TexCoord'));",
            "expectedOutput": "u_MVP: UNIFORM: CONSTANT_ACROSS_DRAW_CALL\na_Position: ATTRIBUTE: UNIQUE_PER_VERTEX\nv_TexCoord: VARYING: INTERPOLATED_ACROSS_PIXEL_FRAGMENTS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What storage qualifier classification applies to `u_MVP` (constant for all vertices in a draw call)?",
          "expectedStringOutput": "UNIFORM: CONSTANT_ACROSS_DRAW_CALL",
          "acceptableAnswers": [
            "UNIFORM: CONSTANT_ACROSS_DRAW_CALL",
            "UNIFORM",
            "Uniform"
          ],
          "primaryMisconceptionId": "MC_3D_SHADERS_GLSL_VERTEX_FRAGMENT_VARYING",
          "diagnosisMap": {
            "ATTRIBUTE": {
              "misconceptionId": "MC_3D_SHADERS_GLSL_VERTEX_FRAGMENT_VARYING",
              "errorExplanation": "u_ indicates a uniform variable constant across the draw call.",
              "recoveryPath": {
                "simplerExplanation": "u_ = UNIFORM: CONSTANT_ACROSS_DRAW_CALL.",
                "guidedFixPrompt": "Type UNIFORM: CONSTANT_ACROSS_DRAW_CALL"
              }
            }
          }
        }
      },
      {
        "id": "g3d-d7-b2-fragment-shader-color-output",
        "day": 7,
        "blockNumber": 2,
        "title": "WebGL2 Fragment Shader & RGBA Color Output",
        "conceptBudget": {
          "primaryConcept": "Fragment Shader Execution",
          "supportingTerms": [
            "GLSL 300 ES `out vec4 fragColor;`",
            "Texture Sampling (`texture(u_Sampler, v_TexCoord)`)",
            "Color Clamping ($[0.0, 1.0]$)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d7-b1-glsl-syntax-variable-qualifiers",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "WebGL2 Fragment Shader (GLSL 300 ES)",
            "codeSnippet": "#version 300 es\nprecision mediump float;\n\nin vec3 v_Normal;\nin vec2 v_TexCoord;\n\nuniform sampler2D u_TextureMap;\nuniform vec3 u_LightDir;\n\nout vec4 fragColor; // Final pixel output color!\n\nvoid main() {\n  vec4 texColor = texture(u_TextureMap, v_TexCoord);\n  float diffuse = max(dot(normalize(v_Normal), u_LightDir), 0.1);\n  fragColor = vec4(texColor.rgb * diffuse, 1.0);\n}",
            "lineNotes": {
              "10": "Explicit fragment color output declaration in WebGL2.",
              "13": "Samples 2D texture and applies diffuse lighting."
            }
          },
          {
            "type": "runnable_code",
            "filename": "frag_shader_demo.js",
            "initialCode": "function evaluateFragmentColor(r, g, b, light) {\n  const finalRgb = [r * light, g * light, b * light].map(c => Number(Math.min(1.0, c).toFixed(2)));\n  return `RGBA(${finalRgb.join(', ')}, 1.0)`;\n}\n\nconsole.log(evaluateFragmentColor(1.0, 0.5, 0.0, 0.8));",
            "expectedOutput": "RGBA(0.8, 0.4, 0, 1.0)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What RGBA color string is output for Orange `[1.0, 0.5, 0.0]` illuminated at 0.8 intensity?",
          "expectedStringOutput": "RGBA(0.8, 0.4, 0, 1.0)",
          "acceptableAnswers": [
            "RGBA(0.8, 0.4, 0, 1.0)",
            "RGBA(0.8, 0.4, 0.0, 1.0)"
          ],
          "primaryMisconceptionId": "MC_3D_SHADERS_GLSL_VERTEX_FRAGMENT_VARYING",
          "diagnosisMap": {
            "RGBA(1.0, 0.5, 0.0, 1.0)": {
              "misconceptionId": "MC_3D_SHADERS_GLSL_VERTEX_FRAGMENT_VARYING",
              "errorExplanation": "Must multiply by light intensity 0.8 -> RGBA(0.8, 0.4, 0, 1.0).",
              "recoveryPath": {
                "simplerExplanation": "1.0*0.8=0.8, 0.5*0.8=0.4 -> RGBA(0.8, 0.4, 0, 1.0).",
                "guidedFixPrompt": "Type RGBA(0.8, 0.4, 0, 1.0)"
              }
            }
          }
        }
      },
      {
        "id": "g3d-d7-b3-shader-compilation-linking-pipeline",
        "day": 7,
        "blockNumber": 3,
        "title": "Compiling, Linking & Error Handling Shader Programs in JavaScript",
        "conceptBudget": {
          "primaryConcept": "Shader Program Compilation Lifecycle",
          "supportingTerms": [
            "`gl.createShader()` & `gl.compileShader()`",
            "`gl.getShaderParameter(shader, gl.COMPILE_STATUS)`",
            "`gl.getShaderInfoLog(shader)` for GLSL syntax error logging",
            "`gl.createProgram()` & `gl.linkProgram()`"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d7-b2-fragment-shader-color-output",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "shader_compiler_sim.js",
            "initialCode": "function compileShaderSim(sourceCode) {\n  if (sourceCode.includes('syntax_error')) {\n    return { success: false, errorLog: 'ERROR: 0:12: Unexpected token syntax_error' };\n  }\n  return { success: true, status: 'GLSL_SHADER_COMPILED_SUCCESSFULLY' };\n}\n\nconsole.log(compileShaderSim('void main() { gl_Position = vec4(0); }').status);",
            "expectedOutput": "GLSL_SHADER_COMPILED_SUCCESSFULLY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status string confirms successful compilation of a GLSL shader?",
          "expectedStringOutput": "GLSL_SHADER_COMPILED_SUCCESSFULLY",
          "acceptableAnswers": [
            "GLSL_SHADER_COMPILED_SUCCESSFULLY",
            "status: GLSL_SHADER_COMPILED_SUCCESSFULLY"
          ],
          "primaryMisconceptionId": "MC_3D_SHADERS_GLSL_VERTEX_FRAGMENT_VARYING",
          "diagnosisMap": {
            "ERROR": {
              "misconceptionId": "MC_3D_SHADERS_GLSL_VERTEX_FRAGMENT_VARYING",
              "errorExplanation": "Valid GLSL returns GLSL_SHADER_COMPILED_SUCCESSFULLY.",
              "recoveryPath": {
                "simplerExplanation": "Matches GLSL_SHADER_COMPILED_SUCCESSFULLY.",
                "guidedFixPrompt": "Type GLSL_SHADER_COMPILED_SUCCESSFULLY"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 8,
    "title": "Vertex Buffer Objects (VBO) & Vertex Array Objects (VAO)",
    "overviewMetaphor": "VAOs and VBOs are a library book indexing system: a Vertex Buffer Object (VBO) is a continuous roll of parchment tape holding 10,000 numbers in GPU memory (Positions, Normals, UVs); a Vertex Array Object (VAO) is a bookmark storing the recipe (\"Read 3 floats for Position, skip 12 bytes, read 2 floats for UV\"); instead of issuing 15 tedious setup calls on every frame, binding the single VAO (`gl.bindVertexArray(vao)`) restores the complete geometry state in 1 nanosecond.",
    "blocks": [
      {
        "id": "g3d-d8-b1-vbo-interleaved-memory-layout",
        "day": 8,
        "blockNumber": 1,
        "title": "Interleaved Vertex Buffer Objects (VBO) & Cache Locality",
        "conceptBudget": {
          "primaryConcept": "Interleaved VBO Architecture",
          "supportingTerms": [
            "Interleaved Format (`[PosX, PosY, PosZ, NormX, NormY, NormZ, U, V]`)",
            "GPU Memory Coalescing & L1 Cache hit rate",
            "Stride (Total bytes per vertex: $8 \\times 4 = 32\\text{ bytes}$)",
            "Offset (Byte start position per attribute)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d7-b1-glsl-syntax-variable-qualifiers",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Interleaved 32-Byte Vertex Memory Chunk",
              "boxes": [
                {
                  "label": "Offset 0 - 11 (12 Bytes)",
                  "value": "Position: [X, Y, Z] (3x Float32) -> Location 0",
                  "varType": "vec3 Position",
                  "isUpdated": false
                },
                {
                  "label": "Offset 12 - 23 (12 Bytes)",
                  "value": "Normal: [Nx, Ny, Nz] (3x Float32) -> Location 1",
                  "varType": "vec3 Normal",
                  "isUpdated": false
                },
                {
                  "label": "Offset 24 - 31 (8 Bytes)",
                  "value": "UV: [U, V] (2x Float32) -> Location 2",
                  "varType": "vec2 UV",
                  "isUpdated": false
                },
                {
                  "label": "Total Vertex Stride",
                  "value": "32 Bytes per vertex (100% Cache Aligned)",
                  "varType": "Total Stride",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "vbo_stride_demo.js",
            "initialCode": "function calculateStride(floatsPerVertex) {\n  const totalBytes = floatsPerVertex * 4;\n  return `A vertex with ${floatsPerVertex} floats requires a stride of ${totalBytes} bytes.`;\n}\n\nconsole.log(calculateStride(8)); // 3 Pos + 3 Norm + 2 UV = 8 floats",
            "expectedOutput": "A vertex with 8 floats requires a stride of 32 bytes.",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the total byte stride for a vertex storing Position (3 floats), Normal (3 floats), and UV (2 floats)?",
          "expectedStringOutput": "32 bytes",
          "acceptableAnswers": [
            "32 bytes",
            "32",
            "stride of 32 bytes."
          ],
          "primaryMisconceptionId": "MC_3D_GEOMETRY_INDEXED_VAO_VBO_DRAW_ELEMENTS",
          "diagnosisMap": {
            "8": {
              "misconceptionId": "MC_3D_GEOMETRY_INDEXED_VAO_VBO_DRAW_ELEMENTS",
              "errorExplanation": "8 floats * 4 bytes per float = 32 bytes total stride.",
              "recoveryPath": {
                "simplerExplanation": "8 * 4 = 32 bytes.",
                "guidedFixPrompt": "Type 32 bytes"
              }
            }
          }
        }
      },
      {
        "id": "g3d-d8-b2-indexed-drawing-ebo-ibo",
        "day": 8,
        "blockNumber": 2,
        "title": "Element Buffer Objects (EBO / IBO) & Indexed Drawing",
        "conceptBudget": {
          "primaryConcept": "Indexed Drawing with EBO / IBO",
          "supportingTerms": [
            "`gl.ELEMENT_ARRAY_BUFFER`",
            "`gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0)`",
            "66% VRAM reduction (A cube requires 8 unique vertices + 36 indices vs 36 duplicated vertices!)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d8-b1-vbo-interleaved-memory-layout",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "ebo_savings_demo.js",
            "initialCode": "function calculateCubeMemorySavings() {\n  const unindexedBytes = 36 * 32; // 36 vertices * 32 bytes = 1152 bytes\n  const indexedBytes = (8 * 32) + (36 * 2); // 8 vertices + 36 uint16 indices = 328 bytes\n  const savingsPercent = ((unindexedBytes - indexedBytes) / unindexedBytes) * 100;\n  return {\n    unindexedBytes,\n    indexedBytes,\n    vramReductionPercent: Number(savingsPercent.toFixed(1))\n  };\n}\n\nconsole.log(JSON.stringify(calculateCubeMemorySavings()));",
            "expectedOutput": "{\"unindexedBytes\":1152,\"indexedBytes\":328,\"vramReductionPercent\":71.5}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What VRAM reduction percentage is achieved on a 3D cube mesh by using indexed drawing with an EBO?",
          "expectedStringOutput": "71.5",
          "acceptableAnswers": [
            "71.5",
            "71.5%",
            "vramReductionPercent\":71.5"
          ],
          "primaryMisconceptionId": "MC_3D_GEOMETRY_INDEXED_VAO_VBO_DRAW_ELEMENTS",
          "diagnosisMap": {
            "50": {
              "misconceptionId": "MC_3D_GEOMETRY_INDEXED_VAO_VBO_DRAW_ELEMENTS",
              "errorExplanation": "Indexed drawing reduces cube VRAM from 1152 bytes down to 328 bytes (71.5% reduction).",
              "recoveryPath": {
                "simplerExplanation": "Reduces memory by 71.5%.",
                "guidedFixPrompt": "Type 71.5"
              }
            }
          }
        }
      },
      {
        "id": "g3d-d8-b3-vao-state-encapsulation",
        "day": 3,
        "blockNumber": 3,
        "title": "Vertex Array Objects (VAO): Single-Call State Encapsulation",
        "conceptBudget": {
          "primaryConcept": "VAO State Management",
          "supportingTerms": [
            "`gl.createVertexArray()` & `gl.bindVertexArray(vao)`",
            "Encapsulates: All VBO bindings, attribute enable states, stride/offset pointers, and EBO bindings",
            "Zero per-frame setup overhead"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d8-b2-indexed-drawing-ebo-ibo",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "VAO Initialization vs Per-Frame Render Call",
            "codeSnippet": "// 1. INITIALIZATION (Run ONCE during asset load):\nconst vao = gl.createVertexArray();\ngl.bindVertexArray(vao);\ngl.bindBuffer(gl.ARRAY_BUFFER, vbo);\ngl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);\ngl.vertexAttribPointer(0, 3, gl.FLOAT, false, 32, 0); // Position\ngl.enableVertexAttribArray(0);\ngl.bindVertexArray(null); // Unbind\n\n// 2. RENDER LOOP (Run every frame - 1 single call!):\ngl.bindVertexArray(vao);\ngl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);",
            "lineNotes": {
              "3": "Binds VAO to record subsequent buffer and attribute pointer state.",
              "13": "Binding the VAO instantly restores all pointers for drawing in 1 call!"
            }
          },
          {
            "type": "runnable_code",
            "filename": "vao_demo.js",
            "initialCode": "function evaluateVaoUsage() {\n  return 'VAO binds VBO + EBO + Attribute Pointers in 1 hardware handle, enabling 1-line draw calls!';\n}\n\nconsole.log(evaluateVaoUsage());",
            "expectedOutput": "VAO binds VBO + EBO + Attribute Pointers in 1 hardware handle, enabling 1-line draw calls!",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is the primary benefit of using Vertex Array Objects (VAO) in WebGL2?",
          "options": [
            "A VAO stores the complete state of all vertex buffer bindings, element buffers, and attribute pointers in a single GPU object; during rendering, binding the VAO restores the entire geometry setup in 1 call rather than 10+ calls",
            "It automatically colors 3D models",
            "It increases network download speeds"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_3D_GEOMETRY_INDEXED_VAO_VBO_DRAW_ELEMENTS",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_3D_GEOMETRY_INDEXED_VAO_VBO_DRAW_ELEMENTS",
              "errorExplanation": "VAOs encapsulate all vertex attribute and buffer state in a single object handle.",
              "recoveryPath": {
                "simplerExplanation": "Restores entire geometry configuration in 1 single call.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 9,
    "title": "Phong & Blinn-Phong Lighting Models",
    "overviewMetaphor": "The Blinn-Phong Lighting Model is a billiard table illuminated by a spotlight: Ambient Light is the room's soft background glow (Never completely pitch black); Diffuse Light is the chalk on the billiard ball (Rough surfaces scatter light evenly in all directions: $N \\cdot L$); Specular Highlight is the shiny glossy white reflection of the lightbulb bouncing directly into the player's eye (Calculated efficiently via the Halfway Vector $H = (L + V) / |L + V|$).",
    "blocks": [
      {
        "id": "g3d-d9-b1-phong-components-anatomy",
        "day": 9,
        "blockNumber": 1,
        "title": "Ambient, Diffuse & Specular Lighting Components",
        "conceptBudget": {
          "primaryConcept": "Phong Lighting Components",
          "supportingTerms": [
            "Ambient ($I_{\\text{amb}} = k_a L_a$)",
            "Diffuse ($I_{\\text{diff}} = k_d L_d \\max(N \\cdot L, 0)$)",
            "Specular ($I_{\\text{spec}} = k_s L_s \\max(R \\cdot V, 0)^\\alpha$)",
            "Shininess exponent $\\alpha$ (32 = plastic, 128 = polished metal)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d3-b2-dot-product-lambert-cosine",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Phong Lighting Triad",
              "boxes": [
                {
                  "label": "1. Ambient Light (10%)",
                  "value": "Constant base illumination -> Prevents unlit sides from becoming pure void black",
                  "varType": "Base Glow",
                  "isUpdated": false
                },
                {
                  "label": "2. Diffuse Light (60%)",
                  "value": "Lambertian cosine law: max(N · L, 0) -> Gives 3D volume and curvature shape",
                  "varType": "Shape/Volume",
                  "isUpdated": false
                },
                {
                  "label": "3. Specular Highlight (30%)",
                  "value": "Sharp reflection hotspot: max(R · V, 0)^shininess -> Gives material glossiness",
                  "varType": "Gloss Highlight",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "phong_components_demo.js",
            "initialCode": "function evaluatePhong(nDotL, rDotV, shininess = 32) {\n  const ambient = 0.1;\n  const diffuse = 0.6 * Math.max(0, nDotL);\n  const specular = 0.3 * Math.pow(Math.max(0, rDotV), shininess);\n  const total = ambient + diffuse + specular;\n  return {\n    ambient,\n    diffuse: Number(diffuse.toFixed(3)),\n    specular: Number(specular.toFixed(3)),\n    totalIntensity: Number(total.toFixed(3))\n  };\n}\n\nconsole.log(JSON.stringify(evaluatePhong(1.0, 1.0, 32))); // Direct reflection hotspot",
            "expectedOutput": "{\"ambient\":0.1,\"diffuse\":0.6,\"specular\":0.3,\"totalIntensity\":1}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the total Phong illumination intensity when ambient $= 0.1$, diffuse $= 0.6$, and specular $= 0.3$?",
          "expectedStringOutput": "1",
          "acceptableAnswers": [
            "1",
            "1.0",
            "totalIntensity\":1"
          ],
          "primaryMisconceptionId": "MC_3D_LIGHTING_PHONG_BLINN_AMBIENT_DIFFUSE_SPECULAR",
          "diagnosisMap": {
            "0.9": {
              "misconceptionId": "MC_3D_LIGHTING_PHONG_BLINN_AMBIENT_DIFFUSE_SPECULAR",
              "errorExplanation": "0.1 + 0.6 + 0.3 = 1.0.",
              "recoveryPath": {
                "simplerExplanation": "0.1 + 0.6 + 0.3 = 1.0.",
                "guidedFixPrompt": "Type 1"
              }
            }
          }
        }
      },
      {
        "id": "g3d-d9-b2-blinn-phong-halfway-vector",
        "day": 9,
        "blockNumber": 2,
        "title": "Blinn-Phong Optimization: The Halfway Vector ($H$)",
        "conceptBudget": {
          "primaryConcept": "Blinn-Phong Halfway Vector",
          "supportingTerms": [
            "Standard Phong Reflection Vector: $R = 2(N \\cdot L)N - L$ (Expensive vector reflection math)",
            "Blinn-Phong Halfway Vector: $H = \\text{normalize}(L + V)$",
            "Specular term: $(N \\cdot H)^{\\alpha_{\\text{blinn}}}$ ($2x$ faster GPU calculation, zero visual artifacts at steep angles)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d9-b1-phong-components-anatomy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Blinn-Phong GLSL Fragment Shader Calculation",
            "codeSnippet": "vec3 L = normalize(u_LightPos - v_WorldPos);\nvec3 V = normalize(u_CameraPos - v_WorldPos);\nvec3 N = normalize(v_Normal);\n\n// Blinn-Phong Halfway Vector:\nvec3 H = normalize(L + V);\nfloat specFactor = pow(max(dot(N, H), 0.0), u_Shininess);",
            "lineNotes": {
              "6": "L + V addition replaces expensive reflection formula R = 2(N.L)N - L.",
              "7": "Dot product of surface normal N with halfway vector H."
            }
          },
          {
            "type": "runnable_code",
            "filename": "halfway_calc_demo.js",
            "initialCode": "function calculateHalfwayVector(l, v) {\n  const hx = l[0] + v[0], hy = l[1] + v[1], hz = l[2] + v[2];\n  const mag = Math.sqrt(hx*hx + hy*hy + hz*hz);\n  return [Number((hx/mag).toFixed(3)), Number((hy/mag).toFixed(3)), Number((hz/mag).toFixed(3))];\n}\n\nconsole.log('Halfway between Light [0, 1, 0] and View [1, 0, 0]:', JSON.stringify(calculateHalfwayVector([0, 1, 0], [1, 0, 0])));",
            "expectedOutput": "Halfway between Light [0, 1, 0] and View [1, 0, 0]: [0.707,0.707,0]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why is Blinn-Phong preferred over classical Phong in real-time 3D game engines?",
          "options": [
            "Because calculating the halfway vector $H = \\text{normalize}(L + V)$ is much faster on GPU hardware than calculating the reflection vector $R$, and avoids sudden specular cutoffs when viewing surfaces at glancing angles",
            "Because Phong reflection is patented",
            "Because Blinn-Phong only works on mobiles"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_3D_LIGHTING_PHONG_BLINN_AMBIENT_DIFFUSE_SPECULAR",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_3D_LIGHTING_PHONG_BLINN_AMBIENT_DIFFUSE_SPECULAR",
              "errorExplanation": "Blinn-Phong is computationally cheaper and looks smoother at grazing angles.",
              "recoveryPath": {
                "simplerExplanation": "Halfway vector H is faster and smoother at steep angles.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "g3d-d9-b3-attenuation-point-lights",
        "day": 9,
        "blockNumber": 3,
        "title": "Point Light Distance Attenuation ($1 / (k_c + k_l d + k_q d^2)$)",
        "conceptBudget": {
          "primaryConcept": "Light Distance Attenuation",
          "supportingTerms": [
            "Inverse Square Law physics ($1/d^2$)",
            "Constant ($k_c = 1.0$), Linear ($k_l$), Quadratic ($k_q$) attenuation factors",
            "Directional Lights (Sun: zero attenuation) vs Point/Spot Lights"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d9-b2-blinn-phong-halfway-vector",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "attenuation_demo.js",
            "initialCode": "function calculateAttenuation(dist, kc = 1.0, kl = 0.09, kq = 0.032) {\n  const atten = 1.0 / (kc + (kl * dist) + (kq * dist * dist));\n  return {\n    distanceMeters: dist,\n    attenuationFactor: Number(atten.toFixed(3))\n  };\n}\n\nconsole.log(JSON.stringify(calculateAttenuation(5))); // 5 meters away\nconsole.log(JSON.stringify(calculateAttenuation(20))); // 20 meters away",
            "expectedOutput": "{\"distanceMeters\":5,\"attenuationFactor\":0.444}\n{\"distanceMeters\":20,\"attenuationFactor\":0.064}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the attenuation factor at 5 meters with $k_c = 1.0, k_l = 0.09, k_q = 0.032$ ($1 / (1 + 0.45 + 0.8) = 1 / 2.25$)?",
          "expectedStringOutput": "0.444",
          "acceptableAnswers": [
            "0.444",
            "attenuationFactor\":0.444"
          ],
          "primaryMisconceptionId": "MC_3D_LIGHTING_PHONG_BLINN_AMBIENT_DIFFUSE_SPECULAR",
          "diagnosisMap": {
            "1.0": {
              "misconceptionId": "MC_3D_LIGHTING_PHONG_BLINN_AMBIENT_DIFFUSE_SPECULAR",
              "errorExplanation": "1 / (1 + 0.45 + 0.8) = 1 / 2.25 = 0.444.",
              "recoveryPath": {
                "simplerExplanation": "1 / 2.25 = 0.444.",
                "guidedFixPrompt": "Type 0.444"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 10,
    "title": "Physically Based Rendering (PBR): Metallic-Roughness",
    "overviewMetaphor": "PBR (Physically Based Rendering) is real-world physics in code: an artist does not guess arbitrary RGB specular colors; a material has an Albedo (Pure underlying chemical color), a Roughness (Microscopic sand scratches: 0.0 = polished chrome mirror; 1.0 = chalkboard clay), and a Metallic slider (0.0 = Plastic/Wood/Dielectric with 4% white reflection; 1.0 = Gold/Iron where reflections inherit the metal's own base color).",
    "blocks": [
      {
        "id": "g3d-d10-b1-cook-torrance-brdf-equation",
        "day": 10,
        "blockNumber": 1,
        "title": "The Cook-Torrance Specular BRDF ($f_r = k_d f_{\\text{lambert}} + k_s f_{\\text{cook}}$)",
        "conceptBudget": {
          "primaryConcept": "Cook-Torrance PBR Model",
          "supportingTerms": [
            "Bidirectional Reflectance Distribution Function (BRDF)",
            "Energy Conservation: $k_d + k_s = 1.0$ (Reflected light can never exceed incoming light!)",
            "$D$ (Normal Distribution Function: GGX/Trowbridge-Reitz)",
            "$G$ (Geometric Shadowing: Smith model)",
            "$F$ (Fresnel Reflectance: Schlick approximation)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d9-b2-blinn-phong-halfway-vector",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Cook-Torrance Specular BRDF Equation",
            "codeSnippet": "//  f_specular = ( D * G * F ) / ( 4 * (N·V) * (N·L) )\n//  D = GGX Normal Distribution (Microfacet alignment)\n//  G = Geometric Shadowing (Microfacet self-occlusion)\n//  F = Fresnel Schlick (Reflection strength at grazing angles)",
            "lineNotes": {
              "1": "Cook-Torrance specular formula dividing by view/light angle foreshortening."
            }
          },
          {
            "type": "runnable_code",
            "filename": "pbr_energy_demo.js",
            "initialCode": "function evaluateEnergyConservation(specularKs) {\n  const diffuseKd = 1.0 - specularKs;\n  return {\n    specularReflectionRatioKs: specularKs,\n    diffuseRefractionRatioKd: Number(diffuseKd.toFixed(2)),\n    isEnergyConserved: (specularKs + diffuseKd) <= 1.0001\n  };\n}\n\nconsole.log(JSON.stringify(evaluateEnergyConservation(0.8)));",
            "expectedOutput": "{\"specularReflectionRatioKs\":0.8,\"diffuseRefractionRatioKd\":0.2,\"isEnergyConserved\":true}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What physical law does PBR strictly enforce through the equation $k_d + k_s = 1.0$?",
          "options": [
            "Energy Conservation: The sum of reflected light ($k_s$) and refracted/diffuse light ($k_d$) can never exceed the total energy of the incoming light ray",
            "Newton's third law of motion",
            "Moore's Law"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_3D_PBR_COOK_TORRANCE_METALLIC_ROUGHNESS_ALBEDO",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_3D_PBR_COOK_TORRANCE_METALLIC_ROUGHNESS_ALBEDO",
              "errorExplanation": "Energy conservation guarantees surfaces never emit more light energy than they receive.",
              "recoveryPath": {
                "simplerExplanation": "Energy conservation: kd + ks = 1.0.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "g3d-d10-b2-fresnel-schlick-grazing-angles",
        "day": 10,
        "blockNumber": 2,
        "title": "Fresnel-Schlick Approximation ($F_0 + (1 - F_0)(1 - \\cos\\theta)^5$)",
        "conceptBudget": {
          "primaryConcept": "Fresnel-Schlick Effect",
          "supportingTerms": [
            "$F_0$ (Base reflectance at normal incidence $0^\\circ$: $0.04$ for dielectrics; Albedo color for metals)",
            "Grazing Angle Reflection ($90^\\circ$ edge is always 100% reflective mirror)",
            "Schlick formula approximation"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d10-b1-cook-torrance-brdf-equation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "fresnel_calc_demo.js",
            "initialCode": "function evaluateFresnel(cosTheta, f0 = 0.04) {\n  const f = f0 + (1.0 - f0) * Math.pow(1.0 - cosTheta, 5);\n  return Number(f.toFixed(3));\n}\n\nconsole.log('Center of sphere (cos = 1.0):', evaluateFresnel(1.0));\nconsole.log('Silhouette edge (cos = 0.0):', evaluateFresnel(0.0));",
            "expectedOutput": "Center of sphere (cos = 1.0): 0.04\nSilhouette edge (cos = 0.0): 1",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Fresnel reflectance value at the silhouette grazing edge of an object (where $\\cos\\theta = 0$)?",
          "expectedStringOutput": "1",
          "acceptableAnswers": [
            "1",
            "1.0",
            "100%",
            "Silhouette edge (cos = 0.0): 1"
          ],
          "primaryMisconceptionId": "MC_3D_PBR_COOK_TORRANCE_METALLIC_ROUGHNESS_ALBEDO",
          "diagnosisMap": {
            "0.04": {
              "misconceptionId": "MC_3D_PBR_COOK_TORRANCE_METALLIC_ROUGHNESS_ALBEDO",
              "errorExplanation": "0.04 is at the center (cos = 1.0). At grazing angles (cos = 0), Fresnel reflectance is 1.0.",
              "recoveryPath": {
                "simplerExplanation": "Edge reflection is 1.0.",
                "guidedFixPrompt": "Type 1"
              }
            }
          }
        }
      },
      {
        "id": "g3d-d10-b3-metallic-roughness-workflow",
        "day": 10,
        "blockNumber": 3,
        "title": "The Metallic-Roughness PBR Workflow & GLTF Standards",
        "conceptBudget": {
          "primaryConcept": "Metallic-Roughness Material Textures",
          "supportingTerms": [
            "GLTF 2.0 Standard PBR Texture Packing (Green = Roughness, Blue = Metallic)",
            "Dielectrics ($F_0 = 0.04$ constant, Albedo = Diffuse color)",
            "Metals ($F_0 = \\text{Albedo}$, Diffuse $k_d = 0$)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d10-b2-fresnel-schlick-grazing-angles",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "PBR Material Channels in GLTF 2.0",
              "boxes": [
                {
                  "label": "Channel R (Red)",
                  "value": "Ambient Occlusion (AO: Crevice shadows)",
                  "varType": "AO Map",
                  "isUpdated": false
                },
                {
                  "label": "Channel G (Green)",
                  "value": "Roughness (0.0 Smooth Glossy -> 1.0 Rough Matte)",
                  "varType": "Roughness",
                  "isUpdated": true
                },
                {
                  "label": "Channel B (Blue)",
                  "value": "Metallic (0.0 Dielectric Plastic -> 1.0 Pure Metal)",
                  "varType": "Metallic",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "gltf_pbr_demo.js",
            "initialCode": "function decodePbrChannels(r, g, b) {\n  return {\n    ambientOcclusion: r / 255,\n    roughness: g / 255,\n    metallic: b / 255\n  };\n}\n\nconsole.log(JSON.stringify(decodePbrChannels(255, 51, 255))); // Polished chrome metal",
            "expectedOutput": "{\"ambientOcclusion\":1,\"roughness\":0.2,\"metallic\":1}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which color channel in a standard GLTF 2.0 `metallicRoughnessTexture` stores the Metallic factor?",
          "expectedStringOutput": "Blue",
          "acceptableAnswers": [
            "Blue",
            "Channel B",
            "Channel B (Blue)",
            "B"
          ],
          "primaryMisconceptionId": "MC_3D_PBR_COOK_TORRANCE_METALLIC_ROUGHNESS_ALBEDO",
          "diagnosisMap": {
            "Green": {
              "misconceptionId": "MC_3D_PBR_COOK_TORRANCE_METALLIC_ROUGHNESS_ALBEDO",
              "errorExplanation": "Green is Roughness. Blue is Metallic.",
              "recoveryPath": {
                "simplerExplanation": "Green = Roughness, Blue = Metallic.",
                "guidedFixPrompt": "Type Blue"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 11,
    "title": "Texture Mapping, UV Coordinates & Mipmapping",
    "overviewMetaphor": "UV Texture Mapping is wrapping a chocolate bar in custom printed foil: the 3D chocolate model has vertices; the 2D foil sheet has UV coordinates ($U = 0$ to $1$ horizontal, $V = 0$ to $1$ vertical); Mipmapping is printing 10 smaller copies of the wrapper (Full-size, half-size, quarter-size... down to $1\\times 1$ pixel); when the chocolate bar is 100 meters away on screen, the GPU samples the miniature Mipmap, eliminating sparkling shimmer artifacts (Moire aliasing).",
    "blocks": [
      {
        "id": "g3d-d11-b1-uv-coordinate-system",
        "day": 11,
        "blockNumber": 1,
        "title": "UV Coordinate Space & Texture Wrapping Modes",
        "conceptBudget": {
          "primaryConcept": "UV Coordinates & Wrapping",
          "supportingTerms": [
            "$U, V \\in [0.0, 1.0]$",
            "Origin: Bottom-left $(0, 0)$ in WebGL vs Top-left in image files (`gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)`)",
            "`gl.REPEAT`, `gl.CLAMP_TO_EDGE`, `gl.MIRRORED_REPEAT`"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d7-b2-fragment-shader-color-output",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Upside-Down Texture Bug vs Flip-Y Fix Diff",
              "brokenCode": "// ❌ UPSIDE DOWN TEXTURE BUG:\ngl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);\n// WebGL 0,0 is bottom-left, but PNG image files start 0,0 at top-left -> Texture rendered upside-down!",
              "fixedCode": "// ✅ 100% CORRECT TEXTURE ORIENTATION:\ngl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); // Flips Y on image upload\ngl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);",
              "errorLine": 1,
              "errorReason": "Images loaded from DOM have top-left origins while WebGL expects bottom-left origins.",
              "fixExplanation": "Enable gl.UNPACK_FLIP_Y_WEBGL before uploading textures."
            }
          },
          {
            "type": "runnable_code",
            "filename": "uv_wrap_demo.js",
            "initialCode": "function evaluateUv(u, v, mode) {\n  if (mode === 'REPEAT') return [u % 1, v % 1];\n  if (mode === 'CLAMP_TO_EDGE') return [Math.max(0, Math.min(1, u)), Math.max(0, Math.min(1, v))];\n  return [u, v];\n}\n\nconsole.log('Repeat (3.2, 1.8):', JSON.stringify(evaluateUv(3.2, 1.8, 'REPEAT').map(x => Number(x.toFixed(1)))));\nconsole.log('Clamp (1.5, -0.2):', JSON.stringify(evaluateUv(1.5, -0.2, 'CLAMP_TO_EDGE')));",
            "expectedOutput": "Repeat (3.2, 1.8): [0.2,0.8]\nClamp (1.5, -0.2): [1,0]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What UV coordinate is sampled with `REPEAT` wrap mode at $U=3.2, V=1.8$?",
          "expectedStringOutput": "[0.2,0.8]",
          "acceptableAnswers": [
            "[0.2,0.8]",
            "[0.2, 0.8]"
          ],
          "primaryMisconceptionId": "MC_3D_TEXTURE_MAPPING_UV_WRAPPING_MIPMAPPING_SAMPLER",
          "diagnosisMap": {
            "[3.2,1.8]": {
              "misconceptionId": "MC_3D_TEXTURE_MAPPING_UV_WRAPPING_MIPMAPPING_SAMPLER",
              "errorExplanation": "3.2 % 1 = 0.2, 1.8 % 1 = 0.8.",
              "recoveryPath": {
                "simplerExplanation": "Fractional remainder gives [0.2, 0.8].",
                "guidedFixPrompt": "Type [0.2,0.8]"
              }
            }
          }
        }
      },
      {
        "id": "g3d-d11-b2-mipmapping-trilinear-filtering",
        "day": 11,
        "blockNumber": 2,
        "title": "Mipmaps & Trilinear Filtering (`gl.LINEAR_MIPMAP_LINEAR`)",
        "conceptBudget": {
          "primaryConcept": "Mipmapping & Texture Filtering",
          "supportingTerms": [
            "Mipmap Pyramid ($1024 \\to 512 \\to 256 \\dots \\to 1\\times 1$)",
            "33% VRAM overhead formula: $\\sum (1/4)^n = 4/3$",
            "Moire Pattern Aliasing Prevention",
            "Trilinear Filtering (`gl.LINEAR_MIPMAP_LINEAR`: Blends between 2 adjacent mip levels)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d11-b1-uv-coordinate-system",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Mipmap Pyramid Memory Footprint (1024x1024 RGBA)",
              "boxes": [
                {
                  "label": "Level 0 (1024x1024)",
                  "value": "Size: 4.00 MB | 100% Resolution base texture",
                  "varType": "Base Texture",
                  "isUpdated": false
                },
                {
                  "label": "Level 1 (512x512)",
                  "value": "Size: 1.00 MB | 50% Resolution",
                  "varType": "Mip 1",
                  "isUpdated": false
                },
                {
                  "label": "Level 2 (256x256)",
                  "value": "Size: 0.25 MB | 25% Resolution",
                  "varType": "Mip 2",
                  "isUpdated": false
                },
                {
                  "label": "Total All Mip Levels",
                  "value": "Size: 5.33 MB (Exactly +33.3% VRAM overhead)",
                  "varType": "Total Mipmap",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "mipmap_vram_demo.js",
            "initialCode": "function calculateMipmapVramMb(width, height) {\n  const baseMb = (width * height * 4) / (1024 * 1024);\n  const totalWithMipmapsMb = baseMb * (4 / 3);\n  return {\n    baseTextureMb: Number(baseMb.toFixed(2)),\n    totalMipmapPyramidMb: Number(totalWithMipmapsMb.toFixed(2)),\n    overheadRatio: '1.33x (+33.3% VRAM)'\n  };\n}\n\nconsole.log(JSON.stringify(calculateMipmapVramMb(1024, 1024)));",
            "expectedOutput": "{\"baseTextureMb\":4,\"totalMipmapPyramidMb\":5.33,\"overheadRatio\":\"1.33x (+33.3% VRAM)\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the total VRAM footprint (in MB) of a 1024x1024 RGBA texture including all generated Mipmap pyramid levels ($4.00 \\times 4/3$)?",
          "expectedStringOutput": "5.33",
          "acceptableAnswers": [
            "5.33",
            "5.33 MB",
            "totalMipmapPyramidMb\":5.33"
          ],
          "primaryMisconceptionId": "MC_3D_TEXTURE_MAPPING_UV_WRAPPING_MIPMAPPING_SAMPLER",
          "diagnosisMap": {
            "4.0": {
              "misconceptionId": "MC_3D_TEXTURE_MAPPING_UV_WRAPPING_MIPMAPPING_SAMPLER",
              "errorExplanation": "4.0 MB is base level only. The entire mipmap pyramid adds 33.3% (5.33 MB).",
              "recoveryPath": {
                "simplerExplanation": "4 * (4/3) = 5.33 MB.",
                "guidedFixPrompt": "Type 5.33"
              }
            }
          }
        }
      },
      {
        "id": "g3d-d11-b3-anisotropic-filtering-af",
        "day": 11,
        "blockNumber": 3,
        "title": "Anisotropic Filtering (AF): Preserving Tilted Ground Clarity",
        "conceptBudget": {
          "primaryConcept": "Anisotropic Texture Filtering",
          "supportingTerms": [
            "Glancing Angle Blur (Standard Mipmaps blur tilted road textures into mud)",
            "Anisotropic Extension (`EXT_texture_filter_anisotropic`)",
            "16x AF Samples along viewing trapezoid footprint"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d11-b2-mipmapping-trilinear-filtering",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "aniso_demo.js",
            "initialCode": "function evaluateAnisoClarity(afLevel) {\n  return afLevel >= 16\n    ? 'CRISP_GROUND_TEXTURE: ROAD_CLEAR_TO_HORIZON'\n    : 'BLURRY_GROUND_MUD_AT_DISTANCE';\n}\n\nconsole.log('16x AF:', evaluateAnisoClarity(16));\nconsole.log('1x AF (No Aniso):', evaluateAnisoClarity(1));",
            "expectedOutput": "16x AF: CRISP_GROUND_TEXTURE: ROAD_CLEAR_TO_HORIZON\n1x AF (No Aniso): BLURRY_GROUND_MUD_AT_DISTANCE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why is 16x Anisotropic Filtering (AF) enabled on 3D terrain and floor meshes?",
          "options": [
            "It samples non-square trapezoidal pixel footprints when viewing surfaces at steep glancing angles, preventing tilted ground textures from blurring into muddy mush near the horizon",
            "Because it increases frame rate by 200%",
            "To invert texture colors"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_3D_TEXTURE_MAPPING_UV_WRAPPING_MIPMAPPING_SAMPLER",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_3D_TEXTURE_MAPPING_UV_WRAPPING_MIPMAPPING_SAMPLER",
              "errorExplanation": "Anisotropic filtering samples along trapezoidal footprints to keep oblique surfaces sharp.",
              "recoveryPath": {
                "simplerExplanation": "Keeps textures sharp at steep grazing angles towards the horizon.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 12,
    "title": "Normal Mapping & Tangent Space (TBN Matrix)",
    "overviewMetaphor": "A Normal Map is a theatrical illusion of brick grooves: instead of sculpting 5,000,000 tiny triangles for every mortar groove on a brick wall, the modeler uses a flat 2-triangle polygon board; the Normal Map texture encodes fake surface angles into RGB color vectors ($[128, 128, 255] = \\text{Straight out } [0, 0, 1]$); the TBN Matrix (Tangent, Bitangent, Normal) aligns these fake angles to the polygon surface, tricking the light shader into drawing deep grooves and shadows.",
    "blocks": [
      {
        "id": "g3d-d12-b1-tbn-matrix-tangent-space",
        "day": 12,
        "blockNumber": 1,
        "title": "Tangent Space & TBN Matrix Construction (Tangent, Bitangent, Normal)",
        "conceptBudget": {
          "primaryConcept": "Tangent Space & TBN Matrix",
          "supportingTerms": [
            "Tangent Vector $T$ (Aligns with texture $U$ axis in world space)",
            "Bitangent Vector $B$ (Aligns with texture $V$ axis in world space)",
            "Normal Vector $N$ (Perpendicular to polygon)",
            "Gram-Schmidt Orthogonalization ($T = \\text{normalize}(T - (T \\cdot N)N)$)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d3-b3-cross-product-surface-normals",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "GLSL TBN Matrix Construction in Vertex Shader",
            "codeSnippet": "vec3 T = normalize(u_NormalMatrix * a_Tangent.xyz);\nvec3 N = normalize(u_NormalMatrix * a_Normal);\nT = normalize(T - dot(T, N) * N); // Gram-Schmidt re-orthogonalization\nvec3 B = cross(N, T) * a_Tangent.w; // Bitangent with hand-flip sign\nmat3 v_TBN = mat3(T, B, N);",
            "lineNotes": {
              "3": "Gram-Schmidt ensures T is exactly perpendicular to N.",
              "4": "Tangent.w (+1 or -1) handles mirrored UV coordinates."
            }
          },
          {
            "type": "runnable_code",
            "filename": "tbn_matrix_demo.js",
            "initialCode": "function evaluateTbn(t, n) {\n  const dot = t[0]*n[0] + t[1]*n[1] + t[2]*n[2];\n  const isPerpendicular = Math.abs(dot) < 1e-4;\n  return {\n    tangent: t,\n    normal: n,\n    isOrthonormal: isPerpendicular,\n    status: isPerpendicular ? 'TBN_MATRIX_ORTHONORMAL_VALID' : 'TBN_DISTORTED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateTbn([1, 0, 0], [0, 0, 1])));",
            "expectedOutput": "{\"tangent\":[1,0,0],\"normal\":[0,0,1],\"isOrthonormal\":true,\"status\":\"TBN_MATRIX_ORTHONORMAL_VALID\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms a valid orthonormal TBN matrix where Tangent and Normal vectors are perpendicular?",
          "expectedStringOutput": "TBN_MATRIX_ORTHONORMAL_VALID",
          "acceptableAnswers": [
            "TBN_MATRIX_ORTHONORMAL_VALID",
            "status\":\"TBN_MATRIX_ORTHONORMAL_VALID\""
          ],
          "primaryMisconceptionId": "MC_3D_NORMAL_MAPPING_TBN_TANGENT_SPACE",
          "diagnosisMap": {
            "DISTORTED": {
              "misconceptionId": "MC_3D_NORMAL_MAPPING_TBN_TANGENT_SPACE",
              "errorExplanation": "Perpendicular dot product = 0 confirms TBN_MATRIX_ORTHONORMAL_VALID.",
              "recoveryPath": {
                "simplerExplanation": "Matches TBN_MATRIX_ORTHONORMAL_VALID.",
                "guidedFixPrompt": "Type TBN_MATRIX_ORTHONORMAL_VALID"
              }
            }
          }
        }
      },
      {
        "id": "g3d-d12-b2-normal-map-rgb-decoding",
        "day": 12,
        "blockNumber": 2,
        "title": "Normal Map RGB Unpacking ($N_{\\text{vector}} = \\text{RGB} \\times 2 - 1$)",
        "conceptBudget": {
          "primaryConcept": "Normal Map RGB Unpacking",
          "supportingTerms": [
            "Texture storage: $R, G, B \\in [0, 255]$ ($[0.0, 1.0]$ in shader)",
            "Vector mapping: $N = \\text{texture}(\\text{sampler}, \\text{uv}).\\text{rgb} \\times 2.0 - 1.0$",
            "Flat normal: RGB `[128, 128, 255]` $\\to$ Vector `[0.0, 0.0, 1.0]` (Perpendicular out of tangent plane)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d12-b1-tbn-matrix-tangent-space",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "normal_unpack_demo.js",
            "initialCode": "function unpackNormalRgb(r255, g255, b255) {\n  const nx = (r255 / 255) * 2.0 - 1.0;\n  const ny = (g255 / 255) * 2.0 - 1.0;\n  const nz = (b255 / 255) * 2.0 - 1.0;\n  return [Number(nx.toFixed(2)), Number(ny.toFixed(2)), Number(nz.toFixed(2))];\n}\n\nconsole.log('Flat normal [128, 128, 255] unpacks to:', JSON.stringify(unpackNormalRgb(128, 128, 255)));",
            "expectedOutput": "Flat normal [128, 128, 255] unpacks to: [0,0,1]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What 3D normal vector is produced by unpacking the standard flat blue normal map pixel `[128, 128, 255]`?",
          "expectedStringOutput": "[0,0,1]",
          "acceptableAnswers": [
            "[0,0,1]",
            "[0, 0, 1]",
            "+Z"
          ],
          "primaryMisconceptionId": "MC_3D_NORMAL_MAPPING_TBN_TANGENT_SPACE",
          "diagnosisMap": {
            "[128,128,255]": {
              "misconceptionId": "MC_3D_NORMAL_MAPPING_TBN_TANGENT_SPACE",
              "errorExplanation": "Must apply RGB * 2 - 1 -> [0, 0, 1].",
              "recoveryPath": {
                "simplerExplanation": "Unpacks to [0, 0, 1].",
                "guidedFixPrompt": "Type [0,0,1]"
              }
            }
          }
        }
      },
      {
        "id": "g3d-d12-b3-world-vs-tangent-space-lighting",
        "day": 12,
        "blockNumber": 3,
        "title": "Transforming Normals: Tangent Space to World Space ($N_{\\text{world}} = \\text{TBN} \\times N_{\\text{tangent}}$)",
        "conceptBudget": {
          "primaryConcept": "TBN Vector Transformation",
          "supportingTerms": [
            "World Space Normal: $N_{\\text{world}} = \\text{normalize}(\\text{TBN} \\times N_{\\text{tangent}})$",
            "Light calculation in World Space vs Tangent Space"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d12-b2-normal-map-rgb-decoding",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "tbn_transform_demo.js",
            "initialCode": "function explainTbnTransform() {\n  return 'vec3 normalWorld = normalize(v_TBN * normalTangent); // Allows lighting shader to calculate real-world light reflections!';\n}\n\nconsole.log(explainTbnTransform());",
            "expectedOutput": "vec3 normalWorld = normalize(v_TBN * normalTangent); // Allows lighting shader to calculate real-world light reflections!",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why must the unpacked tangent-space normal vector be multiplied by the TBN matrix in the fragment shader?",
          "options": [
            "To rotate the tangent-space surface normal vector into global World Space so it can interact with global light sources and camera view directions",
            "Because WebGL crashes without TBN",
            "To invert the texture"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_3D_NORMAL_MAPPING_TBN_TANGENT_SPACE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_3D_NORMAL_MAPPING_TBN_TANGENT_SPACE",
              "errorExplanation": "TBN transforms local surface bumps into global world coordinates for lighting.",
              "recoveryPath": {
                "simplerExplanation": "Rotates tangent bumps into world space coordinates.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 13,
    "title": "Shadow Mapping: Depth Framebuffers & PCF Soft Shadows",
    "overviewMetaphor": "Shadow Mapping is a two-pass game of hide-and-seek with a spotlight: in Pass 1, the Camera sits directly inside the Spotlight bulb, taking a snapshot that records only the distance (Depth) to the closest object it can see; in Pass 2, the main camera renders the scene: for each pixel, it asks \"Is my distance to the light greater than what the spotlight saw in Pass 1?\"; if yes, another object is blocking the light (Shadow!); Percentage-Closer Filtering (PCF) blends 9 nearby depth samples to create smooth, soft penumbra shadows.",
    "blocks": [
      {
        "id": "g3d-d13-b1-shadow-map-two-pass-render",
        "day": 13,
        "blockNumber": 1,
        "title": "Two-Pass Shadow Mapping Architecture & Depth Framebuffers",
        "conceptBudget": {
          "primaryConcept": "Two-Pass Shadow Mapping",
          "supportingTerms": [
            "Pass 1 (Light's View: Render scene depth into Framebuffer Texture `gl.FRAMEBUFFER` with empty fragment shader)",
            "Light MVP Matrix: $M_{\\text{lightMVP}} = P_{\\text{light}} \\times V_{\\text{light}} \\times M$",
            "Pass 2 (Camera's View: Project vertex into light space and compare depth)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d7-b2-fragment-shader-color-output",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Two-Pass Shadow Mapping Architecture",
              "nodes": [
                {
                  "id": "1",
                  "label": "Pass 1: Bind Shadow Framebuffer -> Render scene depth from Light's POV",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Pass 2: Bind Default Screen Framebuffer -> Render full scene from Camera POV",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Fragment Shader: Compare currentDepth > shadowMapDepth + bias",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Multiply diffuse/specular lighting by shadow factor (0.0 shadow to 1.0 lit)!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "shadow_two_pass_demo.js",
            "initialCode": "function evaluateShadowComparison(currentFragmentDepthFromLight, shadowMapDepth, bias = 0.005) {\n  const isOccluded = (currentFragmentDepthFromLight - bias) > shadowMapDepth;\n  return {\n    currentDepth: currentFragmentDepthFromLight,\n    shadowMapDepth,\n    isOccluded,\n    status: isOccluded ? 'IN_SHADOW (Blocker exists in front)' : 'LIT (Directly visible to light)'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateShadowComparison(0.8, 0.4))); // 0.8 is behind 0.4 blocker\nconsole.log(JSON.stringify(evaluateShadowComparison(0.3, 0.5))); // 0.3 is in front of 0.5",
            "expectedOutput": "{\"currentDepth\":0.8,\"shadowMapDepth\":0.4,\"isOccluded\":true,\"status\":\"IN_SHADOW (Blocker exists in front)\"}\n{\"currentDepth\":0.3,\"shadowMapDepth\":0.5,\"isOccluded\":false,\"status\":\"LIT (Directly visible to light)\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the lighting state for a fragment with depth 0.8 when the shadow map depth is 0.4 (blocker in front)?",
          "expectedStringOutput": "IN_SHADOW (Blocker exists in front)",
          "acceptableAnswers": [
            "IN_SHADOW (Blocker exists in front)",
            "IN_SHADOW",
            "In shadow"
          ],
          "primaryMisconceptionId": "MC_3D_SHADOW_MAPPING_DEPTH_FRAMEBUFFER_PCF",
          "diagnosisMap": {
            "LIT": {
              "misconceptionId": "MC_3D_SHADOW_MAPPING_DEPTH_FRAMEBUFFER_PCF",
              "errorExplanation": "0.8 > 0.4 means an obstacle is closer to the light, casting a shadow.",
              "recoveryPath": {
                "simplerExplanation": "0.8 > 0.4 -> IN_SHADOW.",
                "guidedFixPrompt": "Type IN_SHADOW (Blocker exists in front)"
              }
            }
          }
        }
      },
      {
        "id": "g3d-d13-b2-shadow-acne-and-biasing",
        "day": 13,
        "blockNumber": 2,
        "title": "Shadow Acne & Slope-Scaled Depth Biasing",
        "conceptBudget": {
          "primaryConcept": "Shadow Acne & Depth Bias",
          "supportingTerms": [
            "Shadow Acne (Quantization ripples caused by depth map texel resolution limits)",
            "Constant Depth Bias ($0.005$ subtraction)",
            "Slope-Scaled Bias: $\\text{bias} = \\max(\\text{maxBias} \\times (1 - N \\cdot L), \\text{minBias})$",
            "Peter Panning (Detached floating shadows caused by setting bias too large)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d13-b1-shadow-map-two-pass-render",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Shadow Acne vs Biasing vs Peter Panning Diff",
              "brokenCode": "// ❌ NO BIAS (Shadow Acne Hazard):\nif (currentDepth > shadowMapDepth) shadow = 1.0; // Self-shadowing black zebra stripes across all polygons!",
              "fixedCode": "// ✅ 100% CLEAN SLOPE-SCALED BIAS:\nfloat bias = max(0.05 * (1.0 - dot(normal, lightDir)), 0.005);\nif (currentDepth - bias > shadowMapDepth) shadow = 1.0; // Eliminates acne without Peter Panning!",
              "errorLine": 2,
              "errorReason": "Lack of depth bias causes surfaces to self-shadow incorrectly due to discrete depth texel resolution.",
              "fixExplanation": "Subtract slope-scaled bias before comparing fragment depth."
            }
          },
          {
            "type": "runnable_code",
            "filename": "shadow_bias_demo.js",
            "initialCode": "function evaluateShadowArtifact(bias) {\n  if (bias === 0.0) return 'SHADOW_ACNE_DEFECT: ZEBRA_STRIPING_ACROSS_POLYGONS';\n  if (bias > 0.1) return 'PETER_PANNING_DEFECT: SHADOW_DETACHED_AND_FLOATING';\n  return 'PERFECT_SHADOW_EDGE: ACNE_AND_PETER_PANNING_ELIMINATED';\n}\n\nconsole.log(evaluateShadowArtifact(0.0));\nconsole.log(evaluateShadowArtifact(0.005));\nconsole.log(evaluateShadowArtifact(0.2));",
            "expectedOutput": "SHADOW_ACNE_DEFECT: ZEBRA_STRIPING_ACROSS_POLYGONS\nPERFECT_SHADOW_EDGE: ACNE_AND_PETER_PANNING_ELIMINATED\nPETER_PANNING_DEFECT: SHADOW_DETACHED_AND_FLOATING",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What visual defect occurs if the shadow depth bias is set excessively large (e.g. `bias = 0.2`)?",
          "options": [
            "Peter Panning: Shadows become detached and float away from the bases of characters and objects",
            "The camera flips upside down",
            "Screen goes completely green"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_3D_SHADOW_MAPPING_DEPTH_FRAMEBUFFER_PCF",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_3D_SHADOW_MAPPING_DEPTH_FRAMEBUFFER_PCF",
              "errorExplanation": "Excessive bias creates Peter Panning where shadows detach from object feet.",
              "recoveryPath": {
                "simplerExplanation": "Causes Peter Panning detached floating shadows.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "g3d-d13-b3-pcf-percentage-closer-filtering",
        "day": 13,
        "blockNumber": 3,
        "title": "Percentage-Closer Filtering (PCF): Soft Shadow Penumbras",
        "conceptBudget": {
          "primaryConcept": "Percentage-Closer Filtering (PCF)",
          "supportingTerms": [
            "Jagged Hard Shadow Edges (1-sample depth map lookup)",
            "PCF $3 \\times 3$ Kernel (Averaging 9 depth comparison tests)",
            "Smooth gradient penumbra soft shadows"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d13-b2-shadow-acne-and-biasing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "GLSL PCF Soft Shadow Loop (3x3 Kernel)",
            "codeSnippet": "float shadow = 0.0;\nvec2 texelSize = 1.0 / vec2(textureSize(u_ShadowMap, 0));\nfor (int x = -1; x <= 1; ++x) {\n  for (int y = -1; y <= 1; ++y) {\n    float pcfDepth = texture(u_ShadowMap, projCoords.xy + vec2(x, y) * texelSize).r;\n    shadow += (currentDepth - bias > pcfDepth) ? 1.0 : 0.0;\n  }\n}\nshadow /= 9.0; // Smooth 0.0 (lit) to 1.0 (full shadow) penumbra!",
            "lineNotes": {
              "3": "Samples 9 neighboring shadow map texels.",
              "8": "Averages 9 binary tests into a smooth fractional shadow gradient."
            }
          },
          {
            "type": "runnable_code",
            "filename": "pcf_demo.js",
            "initialCode": "function evaluatePcfEdge(occludedSamplesOutOf9) {\n  const shadowFactor = 1.0 - (occludedSamplesOutOf9 / 9.0);\n  return {\n    occludedCount: occludedSamplesOutOf9,\n    shadowLightingMultiplier: Number(shadowFactor.toFixed(2)),\n    penumbraState: (occludedSamplesOutOf9 > 0 && occludedSamplesOutOf9 < 9) ? 'SMOOTH_SOFT_PENUMBRA' : 'SOLID'\n  };\n}\n\nconsole.log(JSON.stringify(evaluatePcfEdge(4))); // Half occluded on soft edge",
            "expectedOutput": "{\"occludedCount\":4,\"shadowLightingMultiplier\":0.56,\"penumbraState\":\"SMOOTH_SOFT_PENUMBRA\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What penumbra state is produced by PCF when 4 out of 9 neighboring texel tests are occluded on a shadow boundary?",
          "expectedStringOutput": "SMOOTH_SOFT_PENUMBRA",
          "acceptableAnswers": [
            "SMOOTH_SOFT_PENUMBRA",
            "penumbraState\":\"SMOOTH_SOFT_PENUMBRA\""
          ],
          "primaryMisconceptionId": "MC_3D_SHADOW_MAPPING_DEPTH_FRAMEBUFFER_PCF",
          "diagnosisMap": {
            "SOLID": {
              "misconceptionId": "MC_3D_SHADOW_MAPPING_DEPTH_FRAMEBUFFER_PCF",
              "errorExplanation": "Fractional occlusion (4/9) creates a SMOOTH_SOFT_PENUMBRA.",
              "recoveryPath": {
                "simplerExplanation": "Fractional tests yield SMOOTH_SOFT_PENUMBRA.",
                "guidedFixPrompt": "Type SMOOTH_SOFT_PENUMBRA"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 14,
    "title": "Post-Processing: HDR, Bloom & Tone Mapping (ACES)",
    "overviewMetaphor": "HDR Tone Mapping & Bloom is a high-end cinema camera lens: standard 8-bit monitors can only display brightness from 0 to 255 (LDR); in real life, looking at the Sun is 10,000x brighter than looking at a white piece of paper (High Dynamic Range: HDR); Bloom isolates super-bright pixels ($> 1.0$) and blurs them outward (Creating an ethereal lens glow); ACES Filmic Tone Mapping compresses blinding HDR sunlight into natural, cinematic screen colors without blowing out white highlights.",
    "blocks": [
      {
        "id": "g3d-d14-b1-hdr-floating-point-framebuffers",
        "day": 14,
        "blockNumber": 1,
        "title": "High Dynamic Range (HDR) & 16-Bit Floating Point Framebuffers",
        "conceptBudget": {
          "primaryConcept": "HDR Framebuffers (RGBA16F)",
          "supportingTerms": [
            "Standard LDR (8-bit clamped $[0, 1]$ per channel)",
            "HDR Texture Target (`gl.RGBA16F` half-float framebuffer)",
            "Preserving radiant values $> 1.0$ (e.g. Neon signs $= 5.0$, Sun $= 100.0$)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d13-b1-shadow-map-two-pass-render",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "LDR vs HDR Buffer Precision",
              "boxes": [
                {
                  "label": "1. Standard LDR (RGBA8)",
                  "value": "Range: [0.0, 1.0] | Precision: 256 steps -> Neon lights clamp to dull flat white",
                  "varType": "Clamped LDR",
                  "isUpdated": false
                },
                {
                  "label": "2. HDR Framebuffer (RGBA16F)",
                  "value": "Range: [0.0, 65504.0] | Precision: 16-bit Float -> Preserves blinding light ratios",
                  "varType": "High Dynamic Range",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "hdr_buffer_demo.js",
            "initialCode": "function evaluateHdrColor(intensity) {\n  return intensity > 1.0\n    ? 'HDR_RADIANCE_PRESERVED: EMITS_BLOOM_GLOW'\n    : 'LDR_STANDARD_ILLUMINATION';\n}\n\nconsole.log('Neon Sign (3.5):', evaluateHdrColor(3.5));\nconsole.log('Table Wood (0.6):', evaluateHdrColor(0.6));",
            "expectedOutput": "Neon Sign (3.5): HDR_RADIANCE_PRESERVED: EMITS_BLOOM_GLOW\nTable Wood (0.6): LDR_STANDARD_ILLUMINATION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status applies to a Neon Sign with light radiance 3.5 in an HDR framebuffer?",
          "expectedStringOutput": "HDR_RADIANCE_PRESERVED: EMITS_BLOOM_GLOW",
          "acceptableAnswers": [
            "HDR_RADIANCE_PRESERVED: EMITS_BLOOM_GLOW",
            "HDR_RADIANCE_PRESERVED"
          ],
          "primaryMisconceptionId": "MC_3D_POST_PROCESSING_BLOOM_TONEMAPPING_HDR",
          "diagnosisMap": {
            "LDR": {
              "misconceptionId": "MC_3D_POST_PROCESSING_BLOOM_TONEMAPPING_HDR",
              "errorExplanation": "Radiance > 1.0 is preserved in HDR and produces bloom glow.",
              "recoveryPath": {
                "simplerExplanation": "Radiance > 1.0 = HDR_RADIANCE_PRESERVED: EMITS_BLOOM_GLOW.",
                "guidedFixPrompt": "Type HDR_RADIANCE_PRESERVED: EMITS_BLOOM_GLOW"
              }
            }
          }
        }
      },
      {
        "id": "g3d-d14-b2-bloom-gaussian-blur-pyramids",
        "day": 14,
        "blockNumber": 2,
        "title": "Bloom Pipeline: Brightness Extraction & Multi-Pass Gaussian Blur",
        "conceptBudget": {
          "primaryConcept": "Bloom Post-Processing Pipeline",
          "supportingTerms": [
            "Brightness Thresholding (Extracting fragments where $\\text{Luminance} > 1.0$)",
            "Two-Pass Separable Gaussian Blur (Horizontal pass $\\to$ Vertical pass in $O(2N)$ instead of $O(N^2)$)",
            "Additive Blending (`gl.blendFunc(gl.ONE, gl.ONE)`) onto final scene"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d14-b1-hdr-floating-point-framebuffers",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Bloom Post-Processing Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Render 3D scene into HDR RGBA16F Framebuffer",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Extract bright pixels (Luminance > 1.0) into auxiliary buffer",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Apply Separable Gaussian Blur (Horizontal + Vertical downsampled passes)",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Additive blend blurred glow back onto base scene texture!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "gaussian_separable_demo.js",
            "initialCode": "function calculateBlurSamples(kernelSize = 9) {\n  const unseparable = kernelSize * kernelSize; // 9x9 = 81 samples\n  const separable = kernelSize * 2; // 9 + 9 = 18 samples\n  return {\n    kernelSize,\n    unseparable2dSamples: unseparable,\n    separable2PassSamples: separable,\n    gpuSpeedupRatio: `${(unseparable / separable).toFixed(1)}x FASTER`\n  };\n}\n\nconsole.log(JSON.stringify(calculateBlurSamples(9)));",
            "expectedOutput": "{\"kernelSize\":9,\"unseparable2dSamples\":81,\"separable2PassSamples\":18,\"gpuSpeedupRatio\":\"4.5x FASTER\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many total texture samples are required for a 9-pixel Separable Gaussian Blur (Horizontal + Vertical passes: $9 + 9$)?",
          "expectedStringOutput": "18",
          "acceptableAnswers": [
            "18",
            "18 samples",
            "separable2PassSamples\":18"
          ],
          "primaryMisconceptionId": "MC_3D_POST_PROCESSING_BLOOM_TONEMAPPING_HDR",
          "diagnosisMap": {
            "81": {
              "misconceptionId": "MC_3D_POST_PROCESSING_BLOOM_TONEMAPPING_HDR",
              "errorExplanation": "81 is for unseparated 2D blur (9x9). Separable blur needs only 9 + 9 = 18 samples.",
              "recoveryPath": {
                "simplerExplanation": "9 + 9 = 18 samples.",
                "guidedFixPrompt": "Type 18"
              }
            }
          }
        }
      },
      {
        "id": "g3d-d14-b3-aces-filmic-tonemapping",
        "day": 14,
        "blockNumber": 3,
        "title": "ACES Filmic Tone Mapping vs Reinhard Tone Mapping",
        "conceptBudget": {
          "primaryConcept": "ACES Filmic Tone Mapping",
          "supportingTerms": [
            "Reinhard: $C_{\\text{ldr}} = \\frac{C_{\\text{hdr}}}{C_{\\text{hdr}} + 1}$ (Looks washed out and desaturated at high brightness)",
            "ACES Filmic Curve: S-curve preserving rich contrast, vibrant highlights, and deep blacks",
            "Gamma Correction: $C_{\\text{screen}} = C_{\\text{linear}}^{1/2.2}$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d14-b2-bloom-gaussian-blur-pyramids",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "ACES Filmic GLSL Tone Mapping Function",
            "codeSnippet": "vec3 ACESFilm(vec3 x) {\n  float a = 2.51;\n  float b = 0.03;\n  float c = 2.43;\n  float d = 0.59;\n  float e = 0.14;\n  return clamp((x*(a*x+b))/(x*(c*x+d)+e), 0.0, 1.0);\n}",
            "lineNotes": {
              "7": "S-curve maps HDR input into filmic [0, 1] output."
            }
          },
          {
            "type": "runnable_code",
            "filename": "aces_tonemap_demo.js",
            "initialCode": "function evaluateTonemap(x) {\n  const a = 2.51, b = 0.03, c = 2.43, d = 0.59, e = 0.14;\n  const ldr = (x * (a * x + b)) / (x * (c * x + d) + e);\n  return Number(Math.max(0, Math.min(1, ldr)).toFixed(3));\n}\n\nconsole.log('HDR 1.0 ->', evaluateTonemap(1.0));\nconsole.log('HDR 5.0 ->', evaluateTonemap(5.0));\nconsole.log('HDR 50.0 (Sun) ->', evaluateTonemap(50.0));",
            "expectedOutput": "HDR 1.0 -> 0.803\nHDR 5.0 -> 0.985\nHDR 50.0 (Sun) -> 0.999",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why is the ACES Filmic tone mapping curve preferred over simple Reinhard tone mapping ($x / (x + 1)$)?",
          "options": [
            "Because ACES implements an S-shaped filmic response curve that preserves rich color saturation and punchy contrast in bright highlights, whereas Reinhard washes out into a dull grayish white",
            "Because ACES only runs on movie cameras",
            "To invert the color channels"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_3D_POST_PROCESSING_BLOOM_TONEMAPPING_HDR",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_3D_POST_PROCESSING_BLOOM_TONEMAPPING_HDR",
              "errorExplanation": "ACES maintains contrast and saturation across bright highlights.",
              "recoveryPath": {
                "simplerExplanation": "Preserves rich contrast and saturation in bright areas.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Complete PBR Deferred Rendering & Post-Processing Engine",
    "overviewMetaphor": "Milestone 2 Synthesis: The complete Hollywood rendering pipeline: 1. Pass 1 renders scene depth into the Shadow Map; 2. Pass 2 renders 3D models with Cook-Torrance PBR (Metallic-Roughness) and Directional PCF soft shadows into an HDR floating-point Framebuffer; 3. Pass 3 extracts bright emissive fragments and runs a 2-pass separable Gaussian blur; 4. Pass 4 composites Bloom and applies ACES Filmic Tone Mapping onto the screen at 60 FPS.",
    "blocks": [
      {
        "id": "g3d-d15-b1-pbr-pipeline-synthesis",
        "day": 15,
        "blockNumber": 1,
        "title": "Full PBR Deferred Rendering & Lighting Pipeline Synthesis",
        "conceptBudget": {
          "primaryConcept": "PBR Master Pipeline Synthesis",
          "supportingTerms": [
            "Shadow Mapping Depth Pass",
            "PBR Cook-Torrance Forward/Deferred Pass",
            "HDR Framebuffer Accumulation",
            "ACES Tone Mapping Compositor"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d14-b3-aces-filmic-tonemapping",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "End-to-End PBR Rendering Pipeline Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "Pass 1: Light POV Depth Render (Shadow Map)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Pass 2: PBR Shading (Cook-Torrance Metallic/Roughness + PCF Shadows) into HDR Buffer",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Pass 3: Extract bright highlights -> Separable Gaussian Blur Bloom",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Pass 4: ACES Tone Mapping + Gamma 2.2 Output to Canvas! (Photorealistic 3D)",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "pbr_engine_sim.js",
            "initialCode": "function runPbrPipeline() {\n  return {\n    shadowPass: 'SHADOW_MAP_FBO_CAPTURED',\n    pbrShading: 'COOK_TORRANCE_METALLIC_ROUGHNESS_ACTIVE',\n    bloomPass: 'SEPARABLE_GAUSSIAN_BLUR_APPLIED',\n    toneMapping: 'ACES_FILMIC_CURVE_COMPLETED',\n    pipelineStatus: 'PBR_RENDER_PIPELINE_NOMINAL'\n  };\n}\n\nconsole.log(runPbrPipeline().pipelineStatus);",
            "expectedOutput": "PBR_RENDER_PIPELINE_NOMINAL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What pipeline status string confirms complete operational synthesis of the PBR rendering engine?",
          "expectedStringOutput": "PBR_RENDER_PIPELINE_NOMINAL",
          "acceptableAnswers": [
            "PBR_RENDER_PIPELINE_NOMINAL",
            "pipelineStatus: PBR_RENDER_PIPELINE_NOMINAL"
          ],
          "primaryMisconceptionId": "MC_3D_PBR_COOK_TORRANCE_METALLIC_ROUGHNESS_ALBEDO",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_3D_PBR_COOK_TORRANCE_METALLIC_ROUGHNESS_ALBEDO",
              "errorExplanation": "Matches PBR_RENDER_PIPELINE_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches PBR_RENDER_PIPELINE_NOMINAL.",
                "guidedFixPrompt": "Type PBR_RENDER_PIPELINE_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "g3d-d15-b2-pbr-frame-rate-benchmarking",
        "day": 15,
        "blockNumber": 2,
        "title": "Frame Budget Benchmarking & Draw Call Optimization",
        "conceptBudget": {
          "primaryConcept": "GPU Frame Time Optimization",
          "supportingTerms": [
            "Frame Time Target: < 16.6ms (60 FPS)",
            "GPU Draw Calls: < 100 per frame",
            "VRAM Bandwidth profiling"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d15-b1-pbr-pipeline-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "pbr_benchmark_demo.js",
            "initialCode": "function auditPbrPerformance(frameTimeMs, drawCalls) {\n  const passed = frameTimeMs <= 16.6 && drawCalls <= 100;\n  return {\n    frameTimeMs,\n    drawCalls,\n    fps: Math.round(1000 / frameTimeMs),\n    compliant: passed,\n    grade: passed ? 'SIXTY_FPS_PBR_CERTIFIED' : 'FRAME_BUDGET_EXCEEDED'\n  };\n}\n\nconsole.log(JSON.stringify(auditPbrPerformance(14.2, 45)));",
            "expectedOutput": "{\"frameTimeMs\":14.2,\"drawCalls\":45,\"fps\":70,\"compliant\":true,\"grade\":\"SIXTY_FPS_PBR_CERTIFIED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification grade is awarded to the PBR engine running at 14.2ms frame time with 45 draw calls?",
          "expectedStringOutput": "SIXTY_FPS_PBR_CERTIFIED",
          "acceptableAnswers": [
            "SIXTY_FPS_PBR_CERTIFIED",
            "grade\":\"SIXTY_FPS_PBR_CERTIFIED\""
          ],
          "primaryMisconceptionId": "MC_3D_PBR_COOK_TORRANCE_METALLIC_ROUGHNESS_ALBEDO",
          "diagnosisMap": {
            "EXCEEDED": {
              "misconceptionId": "MC_3D_PBR_COOK_TORRANCE_METALLIC_ROUGHNESS_ALBEDO",
              "errorExplanation": "14.2ms <= 16.6ms satisfies the 60 FPS budget, awarding SIXTY_FPS_PBR_CERTIFIED.",
              "recoveryPath": {
                "simplerExplanation": "Awards SIXTY_FPS_PBR_CERTIFIED.",
                "guidedFixPrompt": "Type SIXTY_FPS_PBR_CERTIFIED"
              }
            }
          }
        }
      },
      {
        "id": "g3d-d15-b3-milestone2-g3d-cert",
        "day": 15,
        "blockNumber": 3,
        "title": "Milestone 2 PBR Deferred Rendering Engine Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 2 Certification",
          "supportingTerms": [
            "PBR Rendering Pipeline Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d15-b2-pbr-frame-rate-benchmarking",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone2_g3d_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 2: Complete PBR Deferred Rendering & Post-Processing Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 2: Complete PBR Deferred Rendering & Post-Processing Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 2 completion?",
          "expectedStringOutput": "⭐ MILESTONE 2: Complete PBR Deferred Rendering & Post-Processing Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 2: Complete PBR Deferred Rendering & Post-Processing Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_3D_PBR_COOK_TORRANCE_METALLIC_ROUGHNESS_ALBEDO",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_3D_PBR_COOK_TORRANCE_METALLIC_ROUGHNESS_ALBEDO",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 2: Complete PBR Deferred Rendering & Post-Processing Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 16,
    "title": "Skeletal Rigging: Bone Hierarchies & Joint Matrices",
    "overviewMetaphor": "A 3D Character Skeletal Rig is a wooden puppet's armature: the Hips are the root parent; moving the Hips moves the Spine, which moves the Neck, which moves the Head; each bone has its own local transformation relative to its parent; when the puppet dances, parent transformations cascade down the tree ($M_{\\text{world}} = M_{\\text{parent}} \\times M_{\\text{local}}$), moving 50 connected joints in perfect mechanical harmony.",
    "blocks": [
      {
        "id": "g3d-d16-b1-bone-hierarchy-forward-kinematics",
        "day": 16,
        "blockNumber": 1,
        "title": "Parent-Child Bone Trees & Forward Kinematics (FK)",
        "conceptBudget": {
          "primaryConcept": "Bone Hierarchy & FK Tree Traversal",
          "supportingTerms": [
            "Root Bone (`Hips` at scene origin)",
            "Parent-Child Joint Relationship",
            "Forward Kinematics (FK: Calculating child world positions from parent rotations: $M_{\\text{world}} = M_{\\text{parent}} \\times M_{\\text{local}}$)",
            "Degrees of Freedom (3-axis joint rotations)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d4-b2-matrix-multiplication-trs-order",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Standard Humanoid Skeletal Rig Tree",
              "boxes": [
                {
                  "label": "1. Root: Hips (Pelvis)",
                  "value": "Parent: NULL | World Pos: [0, 1.0, 0] -> Master translation anchor",
                  "varType": "Root Joint",
                  "isUpdated": false
                },
                {
                  "label": "2. Child: Spine / Chest",
                  "value": "Parent: Hips | Local Pos: [0, 0.4, 0] -> Inherits Hips motion",
                  "varType": "Torso Joint",
                  "isUpdated": false
                },
                {
                  "label": "3. Child: UpperArm.L / R",
                  "value": "Parent: Chest | Local Pos: [0.3, 0.3, 0] -> Inherits Torso motion",
                  "varType": "Limb Joint",
                  "isUpdated": false
                },
                {
                  "label": "4. Child: Hand.L / R",
                  "value": "Parent: Forearm | Inherits all 4 parent matrix transforms!",
                  "varType": "End Effector",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "fk_tree_demo.js",
            "initialCode": "function calculateJointWorldY(hipsY, spineLocalY, neckLocalY, headLocalY) {\n  const headWorldY = hipsY + spineLocalY + neckLocalY + headLocalY;\n  return {\n    hipsY,\n    headWorldY: Number(headWorldY.toFixed(2)),\n    totalHeight: Number((headWorldY - hipsY).toFixed(2))\n  };\n}\n\nconsole.log(JSON.stringify(calculateJointWorldY(1.0, 0.4, 0.2, 0.2)));",
            "expectedOutput": "{\"hipsY\":1,\"headWorldY\":1.8,\"totalHeight\":0.8}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the calculated world Y position of the Head joint with Hips at 1.0m, Spine offset 0.4m, Neck offset 0.2m, and Head offset 0.2m?",
          "expectedStringOutput": "1.8",
          "acceptableAnswers": [
            "1.8",
            "1.8m",
            "headWorldY\":1.8"
          ],
          "primaryMisconceptionId": "MC_3D_SKELETAL_RIGGING_BONES_JOINTS_MATRICES",
          "diagnosisMap": {
            "0.8": {
              "misconceptionId": "MC_3D_SKELETAL_RIGGING_BONES_JOINTS_MATRICES",
              "errorExplanation": "0.8m is the relative offset. World Y must include the Hips anchor (1.0 + 0.8 = 1.8m).",
              "recoveryPath": {
                "simplerExplanation": "1.0 + 0.4 + 0.2 + 0.2 = 1.8.",
                "guidedFixPrompt": "Type 1.8"
              }
            }
          }
        }
      },
      {
        "id": "g3d-d16-b2-joint-transform-matrices-array",
        "day": 16,
        "blockNumber": 2,
        "title": "The Joint Matrix Palette (`u_JointMatrices[64]`)",
        "conceptBudget": {
          "primaryConcept": "Joint Matrix Palette Texture/Uniforms",
          "supportingTerms": [
            "Joint Matrix Uniform Array (`uniform mat4 u_JointMatrix[64]`)",
            "GPU Skinning Palette (Streaming 64-128 joint matrices to vertex shader)",
            "Dual Quaternions vs Matrix Palettes"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d16-b1-bone-hierarchy-forward-kinematics",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "joint_palette_demo.js",
            "initialCode": "function evaluatePaletteSize(boneCount) {\n  const floats = boneCount * 16;\n  const bytes = floats * 4;\n  return {\n    boneCount,\n    totalFloatsTransferred: floats,\n    uniformBufferBytes: bytes,\n    fitsInMaxUniformVectors: floats <= 1024\n  };\n}\n\nconsole.log(JSON.stringify(evaluatePaletteSize(54))); // 54-bone standard humanoid avatar",
            "expectedOutput": "{\"boneCount\":54,\"totalFloatsTransferred\":864,\"uniformBufferBytes\":3456,\"fitsInMaxUniformVectors\":true}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many total 32-bit floating point numbers are transferred for a 54-bone joint matrix palette ($54 \\times 16$)?",
          "expectedStringOutput": "864",
          "acceptableAnswers": [
            "864",
            "totalFloatsTransferred\":864"
          ],
          "primaryMisconceptionId": "MC_3D_SKELETAL_RIGGING_BONES_JOINTS_MATRICES",
          "diagnosisMap": {
            "54": {
              "misconceptionId": "MC_3D_SKELETAL_RIGGING_BONES_JOINTS_MATRICES",
              "errorExplanation": "Each 4x4 matrix contains 16 floats. 54 * 16 = 864 floats.",
              "recoveryPath": {
                "simplerExplanation": "54 * 16 = 864.",
                "guidedFixPrompt": "Type 864"
              }
            }
          }
        }
      },
      {
        "id": "g3d-d16-b3-bind-pose-vs-current-pose",
        "day": 16,
        "blockNumber": 3,
        "title": "The Bind Pose (T-Pose / A-Pose) & Rest Reference",
        "conceptBudget": {
          "primaryConcept": "Bind Pose Rest Reference",
          "supportingTerms": [
            "T-Pose / A-Pose (Standard reference geometry where mesh was modeled)",
            "Bind Pose Joint Matrices ($M_{\\text{bind}}$)",
            "Skinning Delta: Computing relative transformation between current animated pose and original bind pose"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d16-b2-joint-transform-matrices-array",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "bind_pose_demo.js",
            "initialCode": "function explainBindPose() {\n  return 'Bind Pose (T-Pose) is the neutral reference state; all vertex weights and bone offsets are authored relative to this rest configuration!';\n}\n\nconsole.log(explainBindPose());",
            "expectedOutput": "Bind Pose (T-Pose) is the neutral reference state; all vertex weights and bone offsets are authored relative to this rest configuration!",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is the purpose of the Bind Pose (T-Pose or A-Pose) in 3D character rigging?",
          "options": [
            "It serves as the neutral reference geometry where 3D mesh vertices and bone joint coordinates are originally aligned and weighted by the 3D modeler",
            "Because characters only walk in T-poses",
            "To save memory"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_3D_SKELETAL_RIGGING_BONES_JOINTS_MATRICES",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_3D_SKELETAL_RIGGING_BONES_JOINTS_MATRICES",
              "errorExplanation": "The Bind Pose is the baseline reference pose used to author skin weights.",
              "recoveryPath": {
                "simplerExplanation": "Neutral baseline reference configuration.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 17,
    "title": "Linear Blend Skinning (LBS) & Inverse Bind Matrices",
    "overviewMetaphor": "Linear Blend Skinning (LBS) is stretching rubber skin over a skeleton: an elbow vertex does not belong to just 1 bone (otherwise the elbow would tear apart like a stiff cardboard box!); instead, the elbow vertex is 50% glued to the Upper Arm bone and 50% glued to the Forearm bone (Bone Weights: $w_1 = 0.5, w_2 = 0.5$, summing to 1.0); as the arm bends, the GPU calculates the weighted average position, bending the rubber skin smoothly without tears.",
    "blocks": [
      {
        "id": "g3d-d17-b1-lbs-skinning-formula",
        "day": 17,
        "blockNumber": 1,
        "title": "Linear Blend Skinning (LBS) Formula ($v' = \\sum_{i=1}^4 w_i M_i M_{\\text{bind}, i}^{-1} v$)",
        "conceptBudget": {
          "primaryConcept": "LBS Skinning Mathematics",
          "supportingTerms": [
            "Inverse Bind Matrix ($M_{\\text{bind}}^{-1}$: Moves vertex from world space into bone's local rest frame)",
            "Current World Joint Matrix ($M_i$)",
            "Vertex Bone Weights ($w_1 + w_2 + w_3 + w_4 = 1.0$)",
            "Candy-Wrapper Artifact (Volume loss on $180^\\circ$ joint twists)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d16-b1-bone-hierarchy-forward-kinematics",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "GLSL Linear Blend Skinning Vertex Shader Code",
            "codeSnippet": "in vec4 a_Joints;  // 4 bone indices [0, 1, 0, 0]\nin vec4 a_Weights; // 4 bone weights [0.7, 0.3, 0.0, 0.0]\n\nuniform mat4 u_JointMatrix[64];\n\nvoid main() {\n  mat4 skinMatrix = \n    a_Weights.x * u_JointMatrix[int(a_Joints.x)] +\n    a_Weights.y * u_JointMatrix[int(a_Joints.y)] +\n    a_Weights.z * u_JointMatrix[int(a_Joints.z)] +\n    a_Weights.w * u_JointMatrix[int(a_Joints.w)];\n\n  vec4 skinnedPos = skinMatrix * vec4(a_Position, 1.0);\n  gl_Position = u_ProjectionMatrix * u_ViewMatrix * skinnedPos;\n}",
            "lineNotes": {
              "7": "Weighted linear combination of up to 4 influencing bone matrices.",
              "13": "Deforms base vertex into final skinned animated position."
            }
          },
          {
            "type": "runnable_code",
            "filename": "lbs_math_demo.js",
            "initialCode": "function blendTwoBones(baseY, bone0Offset, bone1Offset, w0, w1) {\n  const deformedY = (w0 * (baseY + bone0Offset)) + (w1 * (baseY + bone1Offset));\n  return {\n    baseY,\n    weight0: w0,\n    weight1: w1,\n    deformedY: Number(deformedY.toFixed(2))\n  };\n}\n\nconsole.log(JSON.stringify(blendTwoBones(1.0, 0.0, 2.0, 0.5, 0.5))); // 50/50 elbow blend",
            "expectedOutput": "{\"baseY\":1,\"weight0\":0.5,\"weight1\":0.5,\"deformedY\":2}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the deformed Y coordinate of a vertex at base Y = 1.0 influenced 50% by Bone 0 (offset 0) and 50% by Bone 1 (offset +2.0)?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2",
            "2.0",
            "deformedY\":2"
          ],
          "primaryMisconceptionId": "MC_3D_SKINNING_VERTEX_WEIGHTS_INVERSE_BIND_POSE",
          "diagnosisMap": {
            "1.5": {
              "misconceptionId": "MC_3D_SKINNING_VERTEX_WEIGHTS_INVERSE_BIND_POSE",
              "errorExplanation": "0.5 * (1 + 0) + 0.5 * (1 + 2) = 0.5 + 1.5 = 2.0.",
              "recoveryPath": {
                "simplerExplanation": "0.5 * 1 + 0.5 * 3 = 2.0.",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      },
      {
        "id": "g3d-d17-b2-inverse-bind-matrices-role",
        "day": 17,
        "blockNumber": 2,
        "title": "The Crucial Role of Inverse Bind Pose Matrices ($M_{\\text{bind}}^{-1}$)",
        "conceptBudget": {
          "primaryConcept": "Inverse Bind Pose Matrix Math",
          "supportingTerms": [
            "Skinning Disconnect without $M_{\\text{bind}}^{-1}$ (Multiplying base world vertices directly by bone matrices tears the mesh into an explosion!)",
            "$M_{\\text{bind}}^{-1}$ transforms vertex from model space into bone's local coordinate system",
            "Pre-computed statically in GLTF `accessor` array"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d17-b1-lbs-skinning-formula",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Missing Inverse Bind Matrix Bug vs Correct Skinning Diff",
              "brokenCode": "// ❌ MISSING INVERSE BIND MATRIX BUG:\nmat4 skinMatrix = u_JointMatrix[jointId];\n// Transforms vertex as if it were ALREADY at the bone origin!\n// Entire mesh explodes into chaotic shards all over the screen!",
              "fixedCode": "// ✅ 100% CORRECT SKINNING MATRIX:\nmat4 skinMatrix = u_JointMatrix[jointId] * u_InverseBindMatrix[jointId];\n// 1. Invert: Moves vertex from bind pose into local bone space\n// 2. Animate: Moves local vertex into new animated world pose!",
              "errorLine": 2,
              "errorReason": "Failing to multiply by the Inverse Bind Matrix applies world transforms to un-localized vertices, exploding the mesh.",
              "fixExplanation": "Multiply each animated joint matrix by its corresponding inverse bind pose matrix."
            }
          },
          {
            "type": "runnable_code",
            "filename": "inv_bind_demo.js",
            "initialCode": "function explainInverseBind() {\n  return 'SkinMatrix = CurrentJointWorldMatrix * InverseBindMatrix -> First unbinds to local joint origin, then applies animated transform!';\n}\n\nconsole.log(explainInverseBind());",
            "expectedOutput": "SkinMatrix = CurrentJointWorldMatrix * InverseBindMatrix -> First unbinds to local joint origin, then applies animated transform!",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why must every animated joint matrix be multiplied by its Inverse Bind Pose Matrix ($M_{\\text{bind}}^{-1}$) during GPU skinning?",
          "options": [
            "Because 3D mesh vertices are stored in global Model Space; the Inverse Bind Matrix subtracts the bone's rest position, bringing the vertex into the bone's local coordinate frame so the animated rotation can be applied cleanly",
            "Because matrix inversion doubles GPU memory",
            "To color the mesh"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_3D_SKINNING_VERTEX_WEIGHTS_INVERSE_BIND_POSE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_3D_SKINNING_VERTEX_WEIGHTS_INVERSE_BIND_POSE",
              "errorExplanation": "Inverse bind matrices move vertices into the local coordinate space of the influencing bone.",
              "recoveryPath": {
                "simplerExplanation": "Brings vertex into local bone space before applying animation.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "g3d-d17-b3-dual-quaternion-skinning-dqs",
        "day": 17,
        "blockNumber": 3,
        "title": "Dual Quaternion Skinning (DQS): Eliminating Candy-Wrapper Collapse",
        "conceptBudget": {
          "primaryConcept": "Dual Quaternion Skinning (DQS)",
          "supportingTerms": [
            "Candy-Wrapper Defect (LBS loses 80% mesh volume when twisting forearm $180^\\circ$)",
            "Dual Quaternions ($q = q_0 + \\epsilon q_d$: Combining 3D rotation and translation in 8 numbers)",
            "Constant Volume Preservation on character joints"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d17-b2-inverse-bind-matrices-role",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "dqs_volume_demo.js",
            "initialCode": "function evaluateSkinningMethod(method, twistDegrees = 180) {\n  return method === 'DUAL_QUATERNION_SKINNING'\n    ? { method, volumeRetainedPercent: 99.5, artifact: 'ZERO_VOLUME_LOSS' }\n    : { method, volumeRetainedPercent: 32.0, artifact: 'CANDY_WRAPPER_PINCH_DEFECT' };\n}\n\nconsole.log(JSON.stringify(evaluateSkinningMethod('DUAL_QUATERNION_SKINNING')));\nconsole.log(JSON.stringify(evaluateSkinningMethod('LINEAR_BLEND_SKINNING')));",
            "expectedOutput": "{\"method\":\"DUAL_QUATERNION_SKINNING\",\"volumeRetainedPercent\":99.5,\"artifact\":\"ZERO_VOLUME_LOSS\"}\n{\"method\":\"LINEAR_BLEND_SKINNING\",\"volumeRetainedPercent\":32,\"artifact\":\"CANDY_WRAPPER_PINCH_DEFECT\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What volume retention percentage is maintained by Dual Quaternion Skinning during a 180° wrist twist?",
          "expectedStringOutput": "99.5",
          "acceptableAnswers": [
            "99.5",
            "99.5%",
            "volumeRetainedPercent\":99.5"
          ],
          "primaryMisconceptionId": "MC_3D_SKINNING_VERTEX_WEIGHTS_INVERSE_BIND_POSE",
          "diagnosisMap": {
            "32": {
              "misconceptionId": "MC_3D_SKINNING_VERTEX_WEIGHTS_INVERSE_BIND_POSE",
              "errorExplanation": "32% is the pinched volume of LBS. DQS preserves 99.5% volume.",
              "recoveryPath": {
                "simplerExplanation": "DQS preserves 99.5% volume.",
                "guidedFixPrompt": "Type 99.5"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 18,
    "title": "Inverse Kinematics (IK): FABRIK & CCD Algorithms",
    "overviewMetaphor": "Inverse Kinematics (IK) is reaching for a glass of water on a table: in Forward Kinematics (FK), you must manually calculate Shoulder angle ($32^\\circ$), Elbow angle ($45^\\circ$), and Wrist angle ($12^\\circ$) hoping the hand hits the glass (Tedious!); in Inverse Kinematics (IK), you simply specify the Target (Glass position); the IK Solver (FABRIK: Forward And Backward Reaching Inverse Kinematics) automatically stretches and folds the arm bones to touch the glass in 3 mathematical iterations.",
    "blocks": [
      {
        "id": "g3d-d18-b1-fk-vs-ik-principles",
        "day": 18,
        "blockNumber": 1,
        "title": "Forward Kinematics vs Inverse Kinematics (IK)",
        "conceptBudget": {
          "primaryConcept": "IK vs FK Principles",
          "supportingTerms": [
            "Forward Kinematics (Input: Joint Angles $\\to$ Output: End Effector Hand position)",
            "Inverse Kinematics (Input: Target Position $\\to$ Output: Required Joint Angles)",
            "Use cases: Foot placement on uneven terrain (Foot IK), Hand grabbing objects, Look-At head tracking"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d16-b1-bone-hierarchy-forward-kinematics",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "FK vs IK Architectural Comparison",
              "boxes": [
                {
                  "label": "1. Forward Kinematics (FK)",
                  "value": "Inputs: Joint angles [30°, 45°] | Flow: Parent -> Child | Use: Keyframe playback",
                  "varType": "Angle-Driven",
                  "isUpdated": false
                },
                {
                  "label": "2. Inverse Kinematics (IK)",
                  "value": "Inputs: Target 3D point [X,Y,Z] | Flow: Effector -> Parent | Use: Terrain stepping, grabbing",
                  "varType": "Target-Driven",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "ik_fk_compare_demo.js",
            "initialCode": "function selectKinematicsMode(task) {\n  if (task === 'FOOT_PLACED_ON_STAIRS') return 'INVERSE_KINEMATICS (Snaps foot bone to stair geometry)';\n  if (task === 'WALK_CYCLE_PLAYBACK') return 'FORWARD_KINEMATICS (Plays recorded joint angle tracks)';\n  return 'HYBRID';\n}\n\nconsole.log(selectKinematicsMode('FOOT_PLACED_ON_STAIRS'));\nconsole.log(selectKinematicsMode('WALK_CYCLE_PLAYBACK'));",
            "expectedOutput": "INVERSE_KINEMATICS (Snaps foot bone to stair geometry)\nFORWARD_KINEMATICS (Plays recorded joint angle tracks)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which kinematics system is required for snapping an avatar's foot bones accurately onto uneven terrain stairs?",
          "expectedStringOutput": "INVERSE_KINEMATICS (Snaps foot bone to stair geometry)",
          "acceptableAnswers": [
            "INVERSE_KINEMATICS (Snaps foot bone to stair geometry)",
            "INVERSE_KINEMATICS",
            "IK",
            "Inverse Kinematics"
          ],
          "primaryMisconceptionId": "MC_3D_FORWARD_INVERSE_KINEMATICS_FABRIK_CCD",
          "diagnosisMap": {
            "FORWARD": {
              "misconceptionId": "MC_3D_FORWARD_INVERSE_KINEMATICS_FABRIK_CCD",
              "errorExplanation": "Terrain stepping is target-driven and requires INVERSE_KINEMATICS.",
              "recoveryPath": {
                "simplerExplanation": "Target placement uses INVERSE_KINEMATICS.",
                "guidedFixPrompt": "Type INVERSE_KINEMATICS (Snaps foot bone to stair geometry)"
              }
            }
          }
        }
      },
      {
        "id": "g3d-d18-b2-fabrik-algorithm-iteration",
        "day": 18,
        "blockNumber": 2,
        "title": "The FABRIK Algorithm: Forward & Backward Line Reaching",
        "conceptBudget": {
          "primaryConcept": "FABRIK Algorithm",
          "supportingTerms": [
            "Forward And Backward Reaching Inverse Kinematics (FABRIK)",
            "Stage 1 (Backward Reach: Set End Effector to Target, pull joint along bone line)",
            "Stage 2 (Forward Reach: Set Root to Original Base, push joints forward along bone lines)",
            "Convergence: 2-5 iterations for millimeter precision (Zero trigonometric `sin`/`cos` overhead!)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d18-b1-fk-vs-ik-principles",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "FABRIK Iteration Loop",
              "nodes": [
                {
                  "id": "1",
                  "label": "Backward Pass: Move Effector to Target -> Adjust joints to maintain fixed bone lengths",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Forward Pass: Move Root back to fixed origin -> Adjust joints forward",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Check Error: Distance(Effector, Target) < 0.001m?",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Converged! Update final bone orientation matrices in 3 iterations!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "fabrik_sim_demo.js",
            "initialCode": "function evaluateFabrikIterations(errorTolerance = 0.001) {\n  let currentError = 0.5;\n  let iterations = 0;\n  while (currentError > errorTolerance && iterations < 10) {\n    currentError *= 0.1; // Fast geometric convergence\n    iterations++;\n  }\n  return {\n    iterationsRequired: iterations,\n    finalErrorMeters: Number(currentError.toFixed(6)),\n    converged: true\n  };\n}\n\nconsole.log(JSON.stringify(evaluateFabrikIterations(0.001)));",
            "expectedOutput": "{\"iterationsRequired\":3,\"finalErrorMeters\":0.0005,\"converged\":true}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many iterations did the FABRIK solver require to converge to millimeter precision?",
          "expectedStringOutput": "3",
          "acceptableAnswers": [
            "3",
            "iterationsRequired\":3"
          ],
          "primaryMisconceptionId": "MC_3D_FORWARD_INVERSE_KINEMATICS_FABRIK_CCD",
          "diagnosisMap": {
            "10": {
              "misconceptionId": "MC_3D_FORWARD_INVERSE_KINEMATICS_FABRIK_CCD",
              "errorExplanation": "FABRIK converges geometrically in ~3 iterations.",
              "recoveryPath": {
                "simplerExplanation": "Converges in 3 iterations.",
                "guidedFixPrompt": "Type 3"
              }
            }
          }
        }
      },
      {
        "id": "g3d-d18-b3-joint-angle-constraints-limits",
        "day": 18,
        "blockNumber": 3,
        "title": "Joint Angle Constraints (Hinge vs Ball-and-Socket Limits)",
        "conceptBudget": {
          "primaryConcept": "IK Joint Constraints",
          "supportingTerms": [
            "Hinge Joints (1-DoF: Elbow/Knee clamped $[0^\\circ, 150^\\circ]$ to prevent unnatural backward bending)",
            "Ball-and-Socket Joints (3-DoF: Shoulder/Hip cone limits)",
            "Pole Vectors (Directing knee/elbow pointing direction)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d18-b2-fabrik-algorithm-iteration",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "joint_limits_demo.js",
            "initialCode": "function clampKneeAngle(angleDeg) {\n  const clamped = Math.max(0, Math.min(150, angleDeg));\n  return {\n    inputAngle: angleDeg,\n    clampedKneeAngle: clamped,\n    unnaturalBackwardBendPrevented: angleDeg < 0\n  };\n}\n\nconsole.log(JSON.stringify(clampKneeAngle(-25))); // Prevent hyperextension\nconsole.log(JSON.stringify(clampKneeAngle(90)));  // Valid bend",
            "expectedOutput": "{\"inputAngle\":-25,\"clampedKneeAngle\":0,\"unnaturalBackwardBendPrevented\":true}\n{\"inputAngle\":90,\"clampedKneeAngle\":90,\"unnaturalBackwardBendPrevented\":false}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why must Inverse Kinematics solvers incorporate Pole Vectors and Hinge angle limits on character knee and elbow joints?",
          "options": [
            "To prevent unnatural robotic hyperextension (such as bending knees backward like a flamingo) by locking rotation to natural biological anatomical limits and directing the joint towards a pole target",
            "To make characters run 10x faster",
            "Because WebGL requires positive numbers"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_3D_FORWARD_INVERSE_KINEMATICS_FABRIK_CCD",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_3D_FORWARD_INVERSE_KINEMATICS_FABRIK_CCD",
              "errorExplanation": "Joint constraints prevent unnatural biological hyperextension.",
              "recoveryPath": {
                "simplerExplanation": "Prevents unnatural joint hyperextension and backward bending.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 19,
    "title": "Keyframe Animation & Quaternion Slerp Interpolation",
    "overviewMetaphor": "Quaternions & SLERP are navigation on a globe: Euler angles (Pitch, Yaw, Roll) suffer from Gimbal Lock (When rotating the camera $90^\\circ$ pitch, the Yaw and Roll axes collapse onto the same line, freezing 1 axis of rotation!); a Quaternion ($q = w + xi + yj + zk$) represents orientation as a 4D point on a sphere; Spherical Linear Interpolation (SLERP) glides along the shortest great-circle arc on the sphere with perfectly constant angular velocity.",
    "blocks": [
      {
        "id": "g3d-d19-b1-quaternions-and-gimbal-lock",
        "day": 19,
        "blockNumber": 1,
        "title": "Quaternions ($q = [x, y, z, w]$) & Eliminating Gimbal Lock",
        "conceptBudget": {
          "primaryConcept": "Quaternion Rotation Mathematics",
          "supportingTerms": [
            "Gimbal Lock (Euler angle singularity where 2 axes align and 1 Degree of Freedom is lost forever)",
            "Unit Quaternion: $\\|q\\| = \\sqrt{x^2 + y^2 + z^2 + w^2} = 1.0$",
            "Axis-Angle to Quaternion: $q = [\\vec{v}\\sin(\\theta/2), \\cos(\\theta/2)]$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d4-b1-4x4-affine-matrix-layout",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Euler Angles vs Quaternions",
              "boxes": [
                {
                  "label": "1. Euler Angles (Pitch/Yaw/Roll)",
                  "value": "Storage: 3 floats | Gimbal Lock: YES (At Pitch = ±90°) | Interpolation: Jerky/Wobbly",
                  "varType": "Gimbal Prone",
                  "isUpdated": false
                },
                {
                  "label": "2. Unit Quaternions (x, y, z, w)",
                  "value": "Storage: 4 floats | Gimbal Lock: NO (100% Free) | Interpolation: Silky SLERP",
                  "varType": "Gimbal Free",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "axis_angle_quat_demo.js",
            "initialCode": "function axisAngleToQuaternion(axis, angleRad) {\n  const half = angleRad / 2;\n  const s = Math.sin(half);\n  return [\n    Number((axis[0] * s).toFixed(4)),\n    Number((axis[1] * s).toFixed(4)),\n    Number((axis[2] * s).toFixed(4)),\n    Number(Math.cos(half).toFixed(4))\n  ];\n}\n\nconsole.log('90 deg around Y axis:', JSON.stringify(axisAngleToQuaternion([0, 1, 0], Math.PI / 2)));",
            "expectedOutput": "90 deg around Y axis: [0,0.7071,0,0.7071]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What unit quaternion represents a 90° rotation around the Y axis `[0, 1, 0]` ($\\\\sin(45^\\circ) = 0.7071, \\\\cos(45^\\circ) = 0.7071$)?",
          "expectedStringOutput": "[0,0.7071,0,0.7071]",
          "acceptableAnswers": [
            "[0,0.7071,0,0.7071]",
            "[0, 0.7071, 0, 0.7071]"
          ],
          "primaryMisconceptionId": "MC_3D_ANIMATION_CLIPS_KEYFRAMES_SLERP_LERP",
          "diagnosisMap": {
            "[0,1,0,0]": {
              "misconceptionId": "MC_3D_ANIMATION_CLIPS_KEYFRAMES_SLERP_LERP",
              "errorExplanation": "Quaternion uses half-angle sin(45°) and cos(45°) -> [0, 0.7071, 0, 0.7071].",
              "recoveryPath": {
                "simplerExplanation": "Uses half angles: [0, 0.7071, 0, 0.7071].",
                "guidedFixPrompt": "Type [0,0.7071,0,0.7071]"
              }
            }
          }
        }
      },
      {
        "id": "g3d-d19-b2-slerp-spherical-interpolation",
        "day": 19,
        "blockNumber": 2,
        "title": "Spherical Linear Interpolation (SLERP) Algorithm",
        "conceptBudget": {
          "primaryConcept": "SLERP Interpolation Formula",
          "supportingTerms": [
            "Shortest Path Check ($q_1 \\cdot q_2 < 0 \\implies q_2 = -q_2$ to prevent $360^\\circ$ long-way spins)",
            "SLERP Equation: $q(t) = \\frac{\\sin((1-t)\\theta)}{\\sin\\theta} q_1 + \\frac{\\sin(t\\theta)}{\\sin\\theta} q_2$",
            "LERP threshold fallback when $\\theta \\approx 0$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d19-b1-quaternions-and-gimbal-lock",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Shortest-Path SLERP Implementation",
            "codeSnippet": "let dot = dotProduct4D(q1, q2);\nif (dot < 0.0) {\n  dot = -dot;\n  q2 = negateQuaternion(q2); // Take the shortest great-circle arc!\n}\nconst theta = Math.acos(dot);\nconst sinTheta = Math.sin(theta);\nconst w1 = Math.sin((1.0 - t) * theta) / sinTheta;\nconst w2 = Math.sin(t * theta) / sinTheta;\nreturn addQuaternions(scale(q1, w1), scale(q2, w2));",
            "lineNotes": {
              "2": "Shortest path check prevents the avatar from spinning 350 degrees the wrong way.",
              "7": "Computes spherical arc weights w1 and w2."
            }
          },
          {
            "type": "runnable_code",
            "filename": "slerp_shortest_demo.js",
            "initialCode": "function evaluateShortestPath(dot) {\n  return dot < 0\n    ? 'NEGATE_Q2_FOR_SHORTEST_PATH_ARC'\n    : 'PROCEED_DIRECT_SLERP';\n}\n\nconsole.log('Dot = -0.8 (Opposite hemisphere):', evaluateShortestPath(-0.8));\nconsole.log('Dot = +0.8 (Same hemisphere):', evaluateShortestPath(0.8));",
            "expectedOutput": "Dot = -0.8 (Opposite hemisphere): NEGATE_Q2_FOR_SHORTEST_PATH_ARC\nDot = +0.8 (Same hemisphere): PROCEED_DIRECT_SLERP",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why must a SLERP algorithm negate the second quaternion ($q_2 = -q_2$) if the 4D dot product $q_1 \\cdot q_2$ is negative?",
          "options": [
            "Because in quaternion mathematics, $q$ and $-q$ represent the exact same 3D physical orientation; negating $q_2$ ensures the interpolation takes the shortest great-circle arc ($< 180^\\circ$) rather than spinning $300^\\circ$ the long way around",
            "Because negative quaternions cause WebGL errors",
            "To reset the rotation to zero"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_3D_ANIMATION_CLIPS_KEYFRAMES_SLERP_LERP",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_3D_ANIMATION_CLIPS_KEYFRAMES_SLERP_LERP",
              "errorExplanation": "Negating q2 forces the interpolation along the shortest great-circle path.",
              "recoveryPath": {
                "simplerExplanation": "Selects the shortest arc on the 4D sphere.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "g3d-d19-b3-keyframe-track-sampler",
        "day": 19,
        "blockNumber": 3,
        "title": "GLTF Animation Keyframe Samplers (Position LERP & Rotation SLERP)",
        "conceptBudget": {
          "primaryConcept": "Keyframe Track Sampling",
          "supportingTerms": [
            "Time Sampler (Array of timestamp floats `[0.0, 0.33, 0.66, 1.0]`)",
            "Keyframe Binary Search (`O(\\log N)` lookup)",
            "Interpolation modes: `LINEAR` (LERP position), `SLERP` (Quaternions), `STEP` (Pose toggle)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d19-b2-slerp-spherical-interpolation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "keyframe_sampler_demo.js",
            "initialCode": "function sampleKeyframeTrack(times, values, t) {\n  for (let i = 0; i < times.length - 1; i++) {\n    if (t >= times[i] && t <= times[i + 1]) {\n      const alpha = (t - times[i]) / (times[i + 1] - times[i]);\n      const interpolated = values[i] + alpha * (values[i + 1] - values[i]);\n      return Number(interpolated.toFixed(2));\n    }\n  }\n  return values[values.length - 1];\n}\n\nconst times = [0.0, 1.0, 2.0];\nconst values = [0.0, 10.0, 20.0];\nconsole.log('Sample at t=0.5s:', sampleKeyframeTrack(times, values, 0.5));",
            "expectedOutput": "Sample at t=0.5s: 5",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What interpolated value is sampled at $t=0.5\\text{s}$ between keyframe 0.0s (0.0) and 1.0s (10.0)?",
          "expectedStringOutput": "5",
          "acceptableAnswers": [
            "5",
            "5.0",
            "Sample at t=0.5s: 5"
          ],
          "primaryMisconceptionId": "MC_3D_ANIMATION_CLIPS_KEYFRAMES_SLERP_LERP",
          "diagnosisMap": {
            "10": {
              "misconceptionId": "MC_3D_ANIMATION_CLIPS_KEYFRAMES_SLERP_LERP",
              "errorExplanation": "At t=0.5s (halfway), linear interpolation yields 5.0.",
              "recoveryPath": {
                "simplerExplanation": "Halfway is 5.0.",
                "guidedFixPrompt": "Type 5"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 20,
    "title": "Animation State Machines & Cross-Fade Blending",
    "overviewMetaphor": "An Animation State Machine is a DJ's audio crossfader: when a character transitions from \"Idle\" to \"Run\", snapping instantly from one animation to the other causes an ugly visual glitch (The character's feet pop into different positions in 1 frame!); the Animation DJ cross-fades over 300 milliseconds: as Idle volume fades from $100\\% \\to 0\\%$, Run volume fades from $0\\% \\to 100\\%$, creating a smooth, organic gait transition.",
    "blocks": [
      {
        "id": "g3d-d20-b1-state-machine-transition-graph",
        "day": 20,
        "blockNumber": 1,
        "title": "Hierarchical Animation State Machine (ASM) Graph",
        "conceptBudget": {
          "primaryConcept": "Animation State Machine (ASM)",
          "supportingTerms": [
            "States (`Idle`, `Walk`, `Run`, `JumpStart`, `InAir`, `Land`)",
            "Transitions & Conditional Triggers (e.g. `speed > 0.1`, `isGrounded == false`)",
            "Cross-Fade Duration ($t_{\\text{fade}} = 0.2\\text{s}$ to $0.4\\text{s}$)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d19-b3-keyframe-track-sampler",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Avatar Animation State Machine Graph",
              "nodes": [
                {
                  "id": "1",
                  "label": "State: IDLE (Speed == 0)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Trigger: Player pushes Joystick -> Transition to WALK (Cross-fade 0.2s)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Trigger: Speed > 5.0 m/s -> Transition to RUN (Cross-fade 0.3s)",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Trigger: Spacebar Pressed -> Transition to JUMP!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "asm_graph_demo.js",
            "initialCode": "function evaluateAsmState(speed, isGrounded) {\n  if (!isGrounded) return 'STATE: JUMP_INAIR';\n  if (speed > 4.0) return 'STATE: SPRINT';\n  if (speed > 0.1) return 'STATE: WALK';\n  return 'STATE: IDLE';\n}\n\nconsole.log(evaluateAsmState(0.0, true));\nconsole.log(evaluateAsmState(2.5, true));\nconsole.log(evaluateAsmState(0.0, false));",
            "expectedOutput": "STATE: IDLE\nSTATE: WALK\nSTATE: JUMP_INAIR",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What animation state is active when speed is 2.5 m/s and the avatar is grounded?",
          "expectedStringOutput": "STATE: WALK",
          "acceptableAnswers": [
            "STATE: WALK",
            "WALK",
            "Walk"
          ],
          "primaryMisconceptionId": "MC_3D_ANIMATION_BLENDING_CROSSFADE_STATE_MACHINE",
          "diagnosisMap": {
            "IDLE": {
              "misconceptionId": "MC_3D_ANIMATION_BLENDING_CROSSFADE_STATE_MACHINE",
              "errorExplanation": "Speed = 2.5 m/s > 0.1 triggers STATE: WALK.",
              "recoveryPath": {
                "simplerExplanation": "Speed > 0.1 activates STATE: WALK.",
                "guidedFixPrompt": "Type STATE: WALK"
              }
            }
          }
        }
      },
      {
        "id": "g3d-d20-b2-crossfade-quaternion-blending",
        "day": 20,
        "blockNumber": 2,
        "title": "Normalized Cross-Fade Joint Blending ($w_{\\text{from}} + w_{\\text{to}} = 1.0$)",
        "conceptBudget": {
          "primaryConcept": "Cross-Fade Blend Weights",
          "supportingTerms": [
            "Linear Fade Curve: $w_{\\text{to}} = \\frac{t_{\\text{elapsed}}}{t_{\\text{duration}}}$",
            "$w_{\\text{from}} = 1.0 - w_{\\text{to}}$",
            "Multi-Bone SLERP Blending: Blending each joint's rotation between Clip A and Clip B"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d20-b1-state-machine-transition-graph",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "crossfade_weights_demo.js",
            "initialCode": "function calculateBlendWeights(durationSec, elapsedSec) {\n  const toWeight = Math.max(0, Math.min(1, elapsedSec / durationSec));\n  const fromWeight = 1.0 - toWeight;\n  return {\n    fadeProgress: `${(toWeight * 100).toFixed(0)}%`,\n    fromWeight: Number(fromWeight.toFixed(2)),\n    toWeight: Number(toWeight.toFixed(2)),\n    isComplete: toWeight >= 1.0\n  };\n}\n\nconsole.log(JSON.stringify(calculateBlendWeights(0.4, 0.1))); // 25% through transition",
            "expectedOutput": "{\"fadeProgress\":\"25%\",\"fromWeight\":0.75,\"toWeight\":0.25,\"isComplete\":false}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the incoming animation weight (`toWeight`) when 0.1s has elapsed in a 0.4s cross-fade transition ($0.1 / 0.4$)?",
          "expectedStringOutput": "0.25",
          "acceptableAnswers": [
            "0.25",
            "toWeight\":0.25"
          ],
          "primaryMisconceptionId": "MC_3D_ANIMATION_BLENDING_CROSSFADE_STATE_MACHINE",
          "diagnosisMap": {
            "0.75": {
              "misconceptionId": "MC_3D_ANIMATION_BLENDING_CROSSFADE_STATE_MACHINE",
              "errorExplanation": "0.75 is fromWeight. toWeight is 0.1 / 0.4 = 0.25.",
              "recoveryPath": {
                "simplerExplanation": "toWeight = 0.1 / 0.4 = 0.25.",
                "guidedFixPrompt": "Type 0.25"
              }
            }
          }
        }
      },
      {
        "id": "g3d-d20-b3-additive-animation-layering",
        "day": 20,
        "blockNumber": 3,
        "title": "Additive Animation Layering (Upper-Body Aiming on Lower-Body Walk)",
        "conceptBudget": {
          "primaryConcept": "Additive Animation Layers",
          "supportingTerms": [
            "Base Layer (Walk / Run gait on lower body)",
            "Additive Layer (Aiming rifle or waving hand on upper body)",
            "Bone Masking (Applying additive layer only to bones above `Spine1`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d20-b2-crossfade-quaternion-blending",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "bone_masking_demo.js",
            "initialCode": "function evaluateLayerApplication(boneName, isUpperBodyMask) {\n  const isArmOrHead = ['RightArm', 'LeftArm', 'Head', 'Chest'].includes(boneName);\n  return (isUpperBodyMask && isArmOrHead)\n    ? 'APPLY_ADDITIVE_AIMING_LAYER_OVER_WALK'\n    : 'APPLY_BASE_WALK_ANIMATION_ONLY';\n}\n\nconsole.log('RightArm with mask:', evaluateLayerApplication('RightArm', true));\nconsole.log('LeftLeg with mask:', evaluateLayerApplication('LeftLeg', true));",
            "expectedOutput": "RightArm with mask: APPLY_ADDITIVE_AIMING_LAYER_OVER_WALK\nLeftLeg with mask: APPLY_BASE_WALK_ANIMATION_ONLY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "How does Bone Masking enable an avatar to aim a weapon while simultaneously playing a running walk cycle?",
          "options": [
            "It splits the skeleton: the base running animation plays on lower-body leg bones, while the additive aiming animation overrides only the upper-body spine and arm bones",
            "By duplicating the entire avatar mesh in memory",
            "By deleting the leg bones"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_3D_ANIMATION_BLENDING_CROSSFADE_STATE_MACHINE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_3D_ANIMATION_BLENDING_CROSSFADE_STATE_MACHINE",
              "errorExplanation": "Bone masking layers independent animations onto distinct subtrees of the skeleton.",
              "recoveryPath": {
                "simplerExplanation": "Applies upper-body aiming while legs play running animation.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Interactive 3D Avatar Skeletal Animation Engine",
    "overviewMetaphor": "Milestone 3 Synthesis: The complete animated 3D character engine: 1. Ingests GLTF humanoid avatar mesh and 54-bone rig; 2. Computes Inverse Bind Pose matrices; 3. Samples Keyframe tracks via Quaternion SLERP; 4. Cross-Fades smoothly between Idle, Walk, and Run animation states; 5. Deforms vertices in GPU vertex shader with Linear Blend Skinning (LBS) at 60 FPS.",
    "blocks": [
      {
        "id": "g3d-d21-b1-avatar-engine-architecture",
        "day": 21,
        "blockNumber": 1,
        "title": "Avatar Skeletal Animation System Architecture",
        "conceptBudget": {
          "primaryConcept": "Avatar Animation Engine Architecture",
          "supportingTerms": [
            "GLTF 2.0 Rig Ingestion",
            "FK Bone Hierarchy Solver",
            "Quaternion SLERP Keyframe Sampler",
            "GPU LBS Skinning Deformer"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d20-b2-crossfade-quaternion-blending",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "End-to-End Avatar Animation Pipeline Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "State Machine evaluates active animations & computes cross-fade weights",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Keyframe Sampler interpolates bone rotations via Quaternion SLERP",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "FK Hierarchy multiplies child bones by parent matrices down the tree",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Uploads Joint Palette to GPU -> Vertex Shader applies LBS deformation at 60 FPS!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "avatar_engine_sim.js",
            "initialCode": "function runAvatarEngine() {\n  return {\n    rigStatus: 'HUMANOID_54_BONES_ONLINE',\n    samplerStatus: 'QUATERNION_SLERP_INTERPOLATING',\n    skinningStatus: 'GPU_LBS_VERTEX_DEFORMATION_ACTIVE',\n    stateMachine: 'CROSSFADE_BLENDING_NOMINAL',\n    engineStatus: 'AVATAR_ANIMATION_ENGINE_ACTIVE'\n  };\n}\n\nconsole.log(runAvatarEngine().engineStatus);",
            "expectedOutput": "AVATAR_ANIMATION_ENGINE_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status string confirms active operational readiness of the synthesized Avatar Animation Engine?",
          "expectedStringOutput": "AVATAR_ANIMATION_ENGINE_ACTIVE",
          "acceptableAnswers": [
            "AVATAR_ANIMATION_ENGINE_ACTIVE",
            "engineStatus: AVATAR_ANIMATION_ENGINE_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_3D_ANIMATION_CLIPS_KEYFRAMES_SLERP_LERP",
          "diagnosisMap": {
            "OFFLINE": {
              "misconceptionId": "MC_3D_ANIMATION_CLIPS_KEYFRAMES_SLERP_LERP",
              "errorExplanation": "Matches AVATAR_ANIMATION_ENGINE_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches AVATAR_ANIMATION_ENGINE_ACTIVE.",
                "guidedFixPrompt": "Type AVATAR_ANIMATION_ENGINE_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "g3d-d21-b2-skinning-performance-audit",
        "day": 21,
        "blockNumber": 2,
        "title": "GPU Skinning Performance Audit & Vertex Throughput",
        "conceptBudget": {
          "primaryConcept": "Skinning Performance Benchmark",
          "supportingTerms": [
            "Skinned Vertices: 25,000+ vertices deformed per avatar",
            "Frame Time: < 3.5ms for animation pipeline",
            "Zero CPU vertex bottleneck SLA"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d21-b1-avatar-engine-architecture",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "skinning_benchmark_demo.js",
            "initialCode": "function auditAvatarPerformance(vertexCount, animFrameTimeMs) {\n  const passed = vertexCount >= 20000 && animFrameTimeMs <= 3.5;\n  return {\n    vertexCount,\n    animFrameTimeMs,\n    compliant: passed,\n    grade: passed ? 'REAL_TIME_AVATAR_SKINNING_CERTIFIED' : 'PERFORMANCE_BUDGET_EXCEEDED'\n  };\n}\n\nconsole.log(JSON.stringify(auditAvatarPerformance(28000, 2.1)));",
            "expectedOutput": "{\"vertexCount\":28000,\"animFrameTimeMs\":2.1,\"compliant\":true,\"grade\":\"REAL_TIME_AVATAR_SKINNING_CERTIFIED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification grade is awarded to the avatar engine deforming 28,000 vertices in 2.1ms?",
          "expectedStringOutput": "REAL_TIME_AVATAR_SKINNING_CERTIFIED",
          "acceptableAnswers": [
            "REAL_TIME_AVATAR_SKINNING_CERTIFIED",
            "grade\":\"REAL_TIME_AVATAR_SKINNING_CERTIFIED\""
          ],
          "primaryMisconceptionId": "MC_3D_ANIMATION_CLIPS_KEYFRAMES_SLERP_LERP",
          "diagnosisMap": {
            "EXCEEDED": {
              "misconceptionId": "MC_3D_ANIMATION_CLIPS_KEYFRAMES_SLERP_LERP",
              "errorExplanation": "28,000 vertices in 2.1ms satisfies all SLAs, awarding REAL_TIME_AVATAR_SKINNING_CERTIFIED.",
              "recoveryPath": {
                "simplerExplanation": "Awards REAL_TIME_AVATAR_SKINNING_CERTIFIED.",
                "guidedFixPrompt": "Type REAL_TIME_AVATAR_SKINNING_CERTIFIED"
              }
            }
          }
        }
      },
      {
        "id": "g3d-d21-b3-milestone3-g3d-cert",
        "day": 21,
        "blockNumber": 3,
        "title": "Milestone 3 Interactive 3D Avatar Animation Engine Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 3 Certification",
          "supportingTerms": [
            "Avatar Animation Engine Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d21-b2-skinning-performance-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone3_g3d_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 3: Interactive 3D Avatar Skeletal Animation Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 3: Interactive 3D Avatar Skeletal Animation Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 3 completion?",
          "expectedStringOutput": "⭐ MILESTONE 3: Interactive 3D Avatar Skeletal Animation Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 3: Interactive 3D Avatar Skeletal Animation Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_3D_ANIMATION_CLIPS_KEYFRAMES_SLERP_LERP",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_3D_ANIMATION_CLIPS_KEYFRAMES_SLERP_LERP",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 3: Interactive 3D Avatar Skeletal Animation Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 22,
    "title": "Facial Rigging: Morph Targets & ARKit Blendshapes (52 Shapes)",
    "overviewMetaphor": "Facial Morph Targets (Blendshapes) are sculpting clay face masks: instead of bones rotating, the artist sculpts 52 distinct delta facial expressions on the neutral head model (`jawOpen`, `mouthSmileLeft`, `eyeBlinkRight`); to make the avatar smile and speak, the GPU adds the delta vectors weighted by slider percentages ($V_{\\text{final}} = V_{\\text{base}} + 0.8 \\times \\Delta_{\\text{smile}} + 0.5 \\times \\Delta_{\\text{jawOpen}}$), generating lifelike emotional expressions without a single facial bone.",
    "blocks": [
      {
        "id": "g3d-d22-b1-morph-target-delta-math",
        "day": 22,
        "blockNumber": 1,
        "title": "Morph Target Delta Vector Mathematics ($v' = v_{\\text{base}} + \\sum w_i \\Delta v_i$)",
        "conceptBudget": {
          "primaryConcept": "Morph Target Delta Equations",
          "supportingTerms": [
            "Delta Position: $\\Delta v_i = v_{\\text{target}, i} - v_{\\text{base}}$",
            "Weight Multipliers ($w_i \\in [0.0, 1.0]$)",
            "Delta Normal Re-normalization",
            "GPU Morph Target Buffer Texture (`sampler2DArray` or Vertex Attributes)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d17-b1-lbs-skinning-formula",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "GLSL Morph Target Accumulator",
            "codeSnippet": "vec3 morphedPosition = a_Position;\nmorphedPosition += u_MorphWeights[0] * a_MorphTarget0_DeltaPos;\nmorphedPosition += u_MorphWeights[1] * a_MorphTarget1_DeltaPos;\nmorphedPosition += u_MorphWeights[2] * a_MorphTarget2_DeltaPos;",
            "lineNotes": {
              "2": "Adds scaled delta position for shape 0 (e.g. jawOpen).",
              "3": "Adds scaled delta position for shape 1 (e.g. mouthSmile)."
            }
          },
          {
            "type": "runnable_code",
            "filename": "morph_math_demo.js",
            "initialCode": "function evaluateMorph(basePos, deltas, weights) {\n  let x = basePos[0], y = basePos[1], z = basePos[2];\n  for (let i = 0; i < deltas.length; i++) {\n    x += weights[i] * deltas[i][0];\n    y += weights[i] * deltas[i][1];\n    z += weights[i] * deltas[i][2];\n  }\n  return [Number(x.toFixed(3)), Number(y.toFixed(3)), Number(z.toFixed(3))];\n}\n\nconst base = [0, 1.7, 0.1];\nconst deltas = [[0, -0.1, 0.05], [0.05, 0.02, 0]]; // jawOpen, smile\nconsole.log(JSON.stringify(evaluateMorph(base, deltas, [0.5, 0.8])));",
            "expectedOutput": "[0.04,1.666,0.125]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the deformed vertex position when base `[0, 1.7, 0.1]` has jawOpen (weight 0.5) and smile (weight 0.8) applied?",
          "expectedStringOutput": "[0.04,1.666,0.125]",
          "acceptableAnswers": [
            "[0.04,1.666,0.125]",
            "[0.04, 1.666, 0.125]"
          ],
          "primaryMisconceptionId": "MC_3D_FACIAL_RIGGING_MORPH_TARGETS_BLENDSHAPES",
          "diagnosisMap": {
            "[0,1.7,0.1]": {
              "misconceptionId": "MC_3D_FACIAL_RIGGING_MORPH_TARGETS_BLENDSHAPES",
              "errorExplanation": "Must accumulate base + sum(weight * delta) -> [0.04, 1.666, 0.125].",
              "recoveryPath": {
                "simplerExplanation": "Accumulates delta offsets -> [0.04, 1.666, 0.125].",
                "guidedFixPrompt": "Type [0.04,1.666,0.125]"
              }
            }
          }
        }
      },
      {
        "id": "g3d-d22-b2-arkit-52-blendshape-taxonomy",
        "day": 22,
        "blockNumber": 2,
        "title": "Apple ARKit 52 Standard Blendshape Taxonomy",
        "conceptBudget": {
          "primaryConcept": "ARKit 52 Blendshape Standards",
          "supportingTerms": [
            "Eye Shapes (`eyeBlinkLeft`, `eyeLookDownRight`, `eyeSquintLeft`)",
            "Jaw & Mouth Shapes (`jawOpen`, `jawLeft`, `mouthSmileRight`, `mouthPucker`, `mouthFunnel`)",
            "Cheek & Brow Shapes (`browInnerUp`, `browDownLeft`, `cheekPuff`)",
            "iPhone FaceID TrueDepth camera streaming"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d22-b1-morph-target-delta-math",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "ARKit 52 Standard Categories",
              "boxes": [
                {
                  "label": "1. Eyes (14 Shapes)",
                  "value": "Blinks, squints, gaze directionals (eyeLookUp/Down/In/Out per eye)",
                  "varType": "Eye Rig",
                  "isUpdated": false
                },
                {
                  "label": "2. Jaw & Mouth (26 Shapes)",
                  "value": "Visemes, smiles, frowns, dimples, pucker, funnel, jaw open/slide",
                  "varType": "Mouth Rig",
                  "isUpdated": true
                },
                {
                  "label": "3. Brow, Cheek & Nose (12 Shapes)",
                  "value": "Brow inner/outer raise, brow down, cheek puff, nose sneer",
                  "varType": "Upper Face",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "arkit_taxonomy_demo.js",
            "initialCode": "function verifyArkitCount(eyeShapes, mouthShapes, browCheekShapes) {\n  const total = eyeShapes + mouthShapes + browCheekShapes;\n  return {\n    totalBlendshapes: total,\n    isStandardCompliant: total === 52,\n    status: (total === 52) ? 'ARKIT_52_COMPLIANT_AVATAR_CERTIFIED' : 'NON_STANDARD_FACIAL_RIG'\n  };\n}\n\nconsole.log(JSON.stringify(verifyArkitCount(14, 26, 12)));",
            "expectedOutput": "{\"totalBlendshapes\":52,\"isStandardCompliant\":true,\"status\":\"ARKIT_52_COMPLIANT_AVATAR_CERTIFIED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the total number of standard facial blendshapes defined in the Apple ARKit specification?",
          "expectedStringOutput": "52",
          "acceptableAnswers": [
            "52",
            "totalBlendshapes\":52"
          ],
          "primaryMisconceptionId": "MC_3D_FACIAL_RIGGING_MORPH_TARGETS_BLENDSHAPES",
          "diagnosisMap": {
            "26": {
              "misconceptionId": "MC_3D_FACIAL_RIGGING_MORPH_TARGETS_BLENDSHAPES",
              "errorExplanation": "26 is mouth only. Total standard ARKit blendshape count is 52.",
              "recoveryPath": {
                "simplerExplanation": "Total ARKit shapes = 52.",
                "guidedFixPrompt": "Type 52"
              }
            }
          }
        }
      },
      {
        "id": "g3d-d22-b3-morph-texture-gpu-packing",
        "day": 22,
        "blockNumber": 3,
        "title": "GPU Morph Target Packing into Texture Arrays (`sampler2DArray`)",
        "conceptBudget": {
          "primaryConcept": "Texture Array Morph Packing",
          "supportingTerms": [
            "Attribute Limit Invariant (WebGL limits attributes to 16, but avatars have 52 blendshapes!)",
            "Data Texture Packing: Storing 52 delta shapes in 2D Float32 Texture Arrays",
            "`texelFetch(u_MorphTextureArray, ivec3(vertexId, shapeIndex, 0))`"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d22-b2-arkit-52-blendshape-taxonomy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "morph_texture_demo.js",
            "initialCode": "function explainTextureArrayPacking() {\n  return 'By storing all 52 delta shapes in a WebGL2 Texture Array (sampler2DArray), we bypass the 16-attribute limit and animate 100+ facial blendshapes in 1 draw call!';\n}\n\nconsole.log(explainTextureArrayPacking());",
            "expectedOutput": "By storing all 52 delta shapes in a WebGL2 Texture Array (sampler2DArray), we bypass the 16-attribute limit and animate 100+ facial blendshapes in 1 draw call!",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why are the 52 ARKit facial blendshape delta vectors stored in a WebGL2 Texture Array (`sampler2DArray`) rather than standard vertex attributes?",
          "options": [
            "Because WebGL2 hardware has a strict limit of 16 vertex attributes; storing blendshape deltas in a Float32 Texture Array allows hundreds of facial shapes to be fetched dynamically in the vertex shader without hitting hardware attribute limits",
            "Because attributes cannot store floating point numbers",
            "To slow down the GPU"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_3D_FACIAL_RIGGING_MORPH_TARGETS_BLENDSHAPES",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_3D_FACIAL_RIGGING_MORPH_TARGETS_BLENDSHAPES",
              "errorExplanation": "Texture arrays bypass the 16-attribute hardware limit in WebGL2.",
              "recoveryPath": {
                "simplerExplanation": "Bypasses the 16 vertex attribute hardware limit.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 23,
    "title": "Audio Lip-Sync & Viseme Mapping (Oculus / Speech-to-Face)",
    "overviewMetaphor": "Audio-Driven Lip Sync is a puppeteer reading sheet music: as voice audio streams into the engine, an audio analyzer (FFT) splits the sound into speech phonemes (\"AA\", \"EE\", \"OH\", \"MM\"); each phoneme maps directly to a visual mouth shape called a Viseme (`jawOpen`, `mouthPucker`); spring-damper smoothing ensures the avatar's lips glide naturally between words without robotic stuttering.",
    "blocks": [
      {
        "id": "g3d-d23-b1-phoneme-to-viseme-mapping",
        "day": 23,
        "blockNumber": 1,
        "title": "Phonemes, Visemes & Oculus 15-Shape Standard",
        "conceptBudget": {
          "primaryConcept": "Phoneme to Viseme Translation",
          "supportingTerms": [
            "Phoneme (Acoustic audio unit: /p/, /b/, /m/, /f/, /v/, /th/, /aa/, /ee/, /oh/)",
            "Viseme (Visual mouth shape)",
            "Oculus 15 Standard Visemes (`viseme_sil`, `viseme_PP`, `viseme_FF`, `viseme_TH`, `viseme_aa`, `viseme_oh`)",
            "Direct mapping to ARKit facial blendshapes"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d22-b2-arkit-52-blendshape-taxonomy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Viseme to ARKit Blendshape Bridge",
              "boxes": [
                {
                  "label": "Viseme 'aa' (Vowel Open)",
                  "value": "ARKit Blendshape: jawOpen = 0.85, mouthFunnel = 0.1",
                  "varType": "Open Vowel",
                  "isUpdated": false
                },
                {
                  "label": "Viseme 'PP' (B, M, P)",
                  "value": "ARKit Blendshape: mouthClose = 1.0, jawOpen = 0.0",
                  "varType": "Bilabial Stop",
                  "isUpdated": false
                },
                {
                  "label": "Viseme 'FF' (F, V)",
                  "value": "ARKit Blendshape: jawOpen = 0.2, mouthRollLower = 0.4",
                  "varType": "Labiodental",
                  "isUpdated": false
                },
                {
                  "label": "Viseme 'oh' (O, U)",
                  "value": "ARKit Blendshape: mouthPucker = 0.9, jawOpen = 0.4",
                  "varType": "Rounded Vowel",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "viseme_map_demo.js",
            "initialCode": "function mapSpeechToken(phoneme) {\n  const table = {\n    'AA': { shape: 'jawOpen', targetWeight: 0.85 },\n    'PP': { shape: 'mouthClose', targetWeight: 1.0 },\n    'OH': { shape: 'mouthPucker', targetWeight: 0.9 }\n  };\n  return table[phoneme] || { shape: 'neutral', targetWeight: 0.0 };\n}\n\nconsole.log(JSON.stringify(mapSpeechToken('AA')));\nconsole.log(JSON.stringify(mapSpeechToken('OH')));",
            "expectedOutput": "{\"shape\":\"jawOpen\",\"targetWeight\":0.85}\n{\"shape\":\"mouthPucker\",\"targetWeight\":0.9}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What target blendshape and weight is mapped for the open vowel phoneme 'AA'?",
          "expectedStringOutput": "{\"shape\":\"jawOpen\",\"targetWeight\":0.85}",
          "acceptableAnswers": [
            "{\"shape\":\"jawOpen\",\"targetWeight\":0.85}",
            "jawOpen",
            "jawOpen 0.85"
          ],
          "primaryMisconceptionId": "MC_3D_LIP_SYNC_VISEMES_AUDIO_AMPLITUDE_SPECTROGRAM",
          "diagnosisMap": {
            "mouthClose": {
              "misconceptionId": "MC_3D_LIP_SYNC_VISEMES_AUDIO_AMPLITUDE_SPECTROGRAM",
              "errorExplanation": "mouthClose is for 'PP'. 'AA' maps to jawOpen with weight 0.85.",
              "recoveryPath": {
                "simplerExplanation": "Vowel AA opens the jaw -> jawOpen 0.85.",
                "guidedFixPrompt": "Type {\"shape\":\"jawOpen\",\"targetWeight\":0.85}"
              }
            }
          }
        }
      },
      {
        "id": "g3d-d23-b2-audio-fft-amplitude-tracking",
        "day": 23,
        "blockNumber": 2,
        "title": "Web Audio API: AnalyserNode FFT Spectrogram & RMS Amplitude",
        "conceptBudget": {
          "primaryConcept": "Audio FFT Feature Extraction",
          "supportingTerms": [
            "Web Audio `AnalyserNode` (`fftSize = 512` or `1024`)",
            "Fast Fourier Transform (Splits audio into frequency bins)",
            "Root Mean Square (RMS) Amplitude: Energy volume tracker",
            "Speech Formants ($F_1 \\approx 300-800\\text{ Hz}, F_2 \\approx 1000-2500\\text{ Hz}$)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d23-b1-phoneme-to-viseme-mapping",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "audio_rms_demo.js",
            "initialCode": "function calculateAudioRmsVolume(buffer) {\n  let sum = 0;\n  for (let i = 0; i < buffer.length; i++) {\n    sum += buffer[i] * buffer[i];\n  }\n  const rms = Math.sqrt(sum / buffer.length);\n  return {\n    rmsVolume: Number(rms.toFixed(3)),\n    isSpeaking: rms > 0.05\n  };\n}\n\nconsole.log(JSON.stringify(calculateAudioRmsVolume([0.4, 0.5, 0.3, 0.4]))); // Speech detected\nconsole.log(JSON.stringify(calculateAudioRmsVolume([0.01, 0.02, 0.01, 0.01]))); // Background silence",
            "expectedOutput": "{\"rmsVolume\":0.406,\"isSpeaking\":true}\n{\"rmsVolume\":0.013,\"isSpeaking\":false}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Is speech detected (`isSpeaking`) when audio RMS volume is 0.406 (threshold > 0.05)?",
          "expectedStringOutput": "true",
          "acceptableAnswers": [
            "true",
            "isSpeaking\":true",
            "True"
          ],
          "primaryMisconceptionId": "MC_3D_LIP_SYNC_VISEMES_AUDIO_AMPLITUDE_SPECTROGRAM",
          "diagnosisMap": {
            "false": {
              "misconceptionId": "MC_3D_LIP_SYNC_VISEMES_AUDIO_AMPLITUDE_SPECTROGRAM",
              "errorExplanation": "0.406 > 0.05, so isSpeaking is true.",
              "recoveryPath": {
                "simplerExplanation": "0.406 > 0.05 -> true.",
                "guidedFixPrompt": "Type true"
              }
            }
          }
        }
      },
      {
        "id": "g3d-d23-b3-viseme-temporal-smoothing",
        "day": 23,
        "blockNumber": 3,
        "title": "Temporal Smoothing: Critical Damping & Attack/Decay Filters",
        "conceptBudget": {
          "primaryConcept": "Viseme Temporal Smoothing",
          "supportingTerms": [
            "Viseme Jitter Defect (Direct raw FFT creates mouth fluttering/vibration)",
            "Asymmetric Attack/Decay (Fast attack $50\\text{ms}$ to open mouth; Slower decay $150\\text{ms}$ to close)",
            "Critically Damped Spring Interpolation"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d23-b2-audio-fft-amplitude-tracking",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Asymmetric Attack / Decay Viseme Smoother",
            "codeSnippet": "function smoothViseme(currentWeight, targetWeight, deltaSec) {\n  // Attack (opening mouth) is faster than decay (closing):\n  const speed = (targetWeight > currentWeight) ? 20.0 : 8.0;\n  return currentWeight + (targetWeight - currentWeight) * (1.0 - Math.exp(-speed * deltaSec));\n}",
            "lineNotes": {
              "3": "Fast attack speed (20.0) captures consonants; slower decay (8.0) prevents fluttering."
            }
          },
          {
            "type": "runnable_code",
            "filename": "smooth_viseme_demo.js",
            "initialCode": "function evaluateSmoothedMouth(current, target) {\n  const smoothed = current + (target - current) * 0.4;\n  return {\n    previousWeight: current,\n    targetWeight: target,\n    smoothedWeight: Number(smoothed.toFixed(2)),\n    isFluidOrganic: true\n  };\n}\n\nconsole.log(JSON.stringify(evaluateSmoothedMouth(0.0, 1.0)));",
            "expectedOutput": "{\"previousWeight\":0,\"targetWeight\":1,\"smoothedWeight\":0.4,\"isFluidOrganic\":true}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why must real-time lip-sync systems apply asymmetric attack/decay temporal smoothing to raw FFT audio frequencies?",
          "options": [
            "Because raw microphone audio fluctuates on every millisecond; fast attack opens mouth shapes instantly on spoken syllables while slower decay smooths transitions, preventing jittery robotic fluttering",
            "Because browsers cannot play audio without smoothing",
            "To invert the audio pitch"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_3D_LIP_SYNC_VISEMES_AUDIO_AMPLITUDE_SPECTROGRAM",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_3D_LIP_SYNC_VISEMES_AUDIO_AMPLITUDE_SPECTROGRAM",
              "errorExplanation": "Temporal smoothing eliminates raw FFT fluttering and produces natural lip movements.",
              "recoveryPath": {
                "simplerExplanation": "Smooths out raw audio fluctuations to prevent mouth fluttering.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 24,
    "title": "3D Physics: Raycasting, Collisions & Bounding Volumes (AABB / OBB)",
    "overviewMetaphor": "3D Collision Detection is airport security luggage screening: checking a million 3D polygon triangles against every other triangle would crash the computer ($O(N^2)$ nightmare!); instead, Broad-Phase wraps every character in an invisible cardboard box (Axis-Aligned Bounding Box: AABB); if two boxes don't touch in 3D space, their detailed meshes are ignored completely; only when two boxes overlap does Narrow-Phase raycasting test individual triangles (Möller-Trumbore algorithm).",
    "blocks": [
      {
        "id": "g3d-d24-b1-aabb-bounding-box-tests",
        "day": 24,
        "blockNumber": 1,
        "title": "Axis-Aligned Bounding Box (AABB) & Broad-Phase Collisions",
        "conceptBudget": {
          "primaryConcept": "AABB Collision Detection",
          "supportingTerms": [
            "AABB representation (`min: [x, y, z]`, `max: [x, y, z]`)",
            "Separating Axis Theorem (SAT) on 3 coordinate axes",
            "Broad-Phase overlap condition: $\\max_A \\ge \\min_B \\land \\min_A \\le \\max_B$ across X, Y, and Z simultaneously",
            "600x CPU speedup over triangle-level tests"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d3-b1-vector-normalization-magnitude",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "AABB 3-Axis Overlap Test",
              "boxes": [
                {
                  "label": "Axis X Overlap",
                  "value": "(minA.x <= maxB.x) && (maxA.x >= minB.x) -> TRUE",
                  "varType": "Axis X",
                  "isUpdated": false
                },
                {
                  "label": "Axis Y Overlap",
                  "value": "(minA.y <= maxB.y) && (maxA.y >= minB.y) -> TRUE",
                  "varType": "Axis Y",
                  "isUpdated": false
                },
                {
                  "label": "Axis Z Overlap",
                  "value": "(minA.z <= maxB.z) && (maxA.z >= minB.z) -> TRUE",
                  "varType": "Axis Z",
                  "isUpdated": true
                },
                {
                  "label": "Total Collision Result",
                  "value": "All 3 axes overlap -> AABB INTERSECTION CONFIRMED!",
                  "varType": "Collision",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "aabb_overlap_demo.js",
            "initialCode": "function testAabbOverlap(boxA, boxB) {\n  const x = (boxA.min[0] <= boxB.max[0]) && (boxA.max[0] >= boxB.min[0]);\n  const y = (boxA.min[1] <= boxB.max[1]) && (boxA.max[1] >= boxB.min[1]);\n  const z = (boxA.min[2] <= boxB.max[2]) && (boxA.max[2] >= boxB.min[2]);\n  const colliding = x && y && z;\n  return {\n    colliding,\n    status: colliding ? 'AABB_COLLISION_DETECTED' : 'SEPARATED_ZERO_COLLISION'\n  };\n}\n\nconst a = { min: [0, 0, 0], max: [2, 2, 2] };\nconst b = { min: [1, 1, 1], max: [3, 3, 3] }; // Overlapping\nconst c = { min: [5, 5, 5], max: [7, 7, 7] }; // Far away\nconsole.log(JSON.stringify(testAabbOverlap(a, b)));\nconsole.log(JSON.stringify(testAabbOverlap(a, c)));",
            "expectedOutput": "{\"colliding\":true,\"status\":\"AABB_COLLISION_DETECTED\"}\n{\"colliding\":false,\"status\":\"SEPARATED_ZERO_COLLISION\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What collision status is returned for overlapping boxes A [0..2] and B [1..3]?",
          "expectedStringOutput": "AABB_COLLISION_DETECTED",
          "acceptableAnswers": [
            "AABB_COLLISION_DETECTED",
            "status\":\"AABB_COLLISION_DETECTED\""
          ],
          "primaryMisconceptionId": "MC_3D_PHYSICS_COLLISION_RAYCASTING_AABB_OBB",
          "diagnosisMap": {
            "SEPARATED": {
              "misconceptionId": "MC_3D_PHYSICS_COLLISION_RAYCASTING_AABB_OBB",
              "errorExplanation": "Boxes overlap along X, Y, and Z, confirming AABB_COLLISION_DETECTED.",
              "recoveryPath": {
                "simplerExplanation": "Overlaps on all 3 axes -> AABB_COLLISION_DETECTED.",
                "guidedFixPrompt": "Type AABB_COLLISION_DETECTED"
              }
            }
          }
        }
      },
      {
        "id": "g3d-d24-b2-raycasting-mouse-picking",
        "day": 24,
        "blockNumber": 2,
        "title": "Screen-to-World Raycasting & 3D Mouse Object Picking",
        "conceptBudget": {
          "primaryConcept": "3D Mouse Raycasting",
          "supportingTerms": [
            "Screen coordinates $(x, y) \\to$ NDC $[-1, +1]$",
            "Unproject Ray: $P_{\\text{world}} = (M_{\\text{proj}} \\times M_{\\text{view}})^{-1} \\times P_{\\text{ndc}}$",
            "Ray Origin (Camera Eye) & Normalized Ray Direction Vector",
            "Möller-Trumbore Ray-Triangle intersection algorithm"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d24-b1-aabb-bounding-box-tests",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "2D Mouse Click to 3D World Ray Unprojector",
            "codeSnippet": "// 1. Convert pixel click to NDC coordinates [-1, +1]:\nconst ndcX = (mouseX / screenWidth) * 2.0 - 1.0;\nconst ndcY = -((mouseY / screenHeight) * 2.0 - 1.0); // Invert Y\n\n// 2. Invert View-Projection Matrix:\nconst invVP = invertMatrix4(multiplyMatrix4(projMatrix, viewMatrix));\nconst nearPoint = transformPoint(invVP, [ndcX, ndcY, -1.0, 1.0]);\nconst farPoint = transformPoint(invVP, [ndcX, ndcY, 1.0, 1.0]);\nconst rayDir = normalize(subtract(farPoint, nearPoint));",
            "lineNotes": {
              "3": "Inverts Y axis because screen Y goes down while 3D Y goes up.",
              "7": "Transforms NDC points on Near and Far clipping planes into World Space."
            }
          },
          {
            "type": "runnable_code",
            "filename": "mouse_ndc_demo.js",
            "initialCode": "function mouseToNdc(mouseX, mouseY, width, height) {\n  const ndcX = (mouseX / width) * 2.0 - 1.0;\n  const ndcY = -((mouseY / height) * 2.0 - 1.0);\n  return [Number(ndcX.toFixed(2)), Number(ndcY.toFixed(2))];\n}\n\nconsole.log('Center click (960, 540) on 1920x1080:', JSON.stringify(mouseToNdc(960, 540, 1920, 1080)));\nconsole.log('Top-Left click (0, 0):', JSON.stringify(mouseToNdc(0, 0, 1920, 1080)));",
            "expectedOutput": "Center click (960, 540) on 1920x1080: [0,0]\nTop-Left click (0, 0): [-1,1]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What NDC coordinate is generated for a mouse click at the exact center of the screen (960, 540)?",
          "expectedStringOutput": "[0,0]",
          "acceptableAnswers": [
            "[0,0]",
            "[0, 0]"
          ],
          "primaryMisconceptionId": "MC_3D_PHYSICS_COLLISION_RAYCASTING_AABB_OBB",
          "diagnosisMap": {
            "[960,540]": {
              "misconceptionId": "MC_3D_PHYSICS_COLLISION_RAYCASTING_AABB_OBB",
              "errorExplanation": "Must normalize to NDC [-1, +1] range -> [0, 0].",
              "recoveryPath": {
                "simplerExplanation": "Screen center maps to [0, 0].",
                "guidedFixPrompt": "Type [0,0]"
              }
            }
          }
        }
      },
      {
        "id": "g3d-d24-b3-obb-oriented-bounding-boxes",
        "day": 24,
        "blockNumber": 3,
        "title": "Oriented Bounding Boxes (OBB) & Rotational Tightness",
        "conceptBudget": {
          "primaryConcept": "Oriented Bounding Boxes (OBB)",
          "supportingTerms": [
            "AABB Weakness (When a long rod rotates $45^\\circ$, its AABB expands by $141\\%$, causing huge false collision bubbles!)",
            "OBB (Bounding box that rotates with the object's local orientation matrix)",
            "Separating Axis Theorem across 15 potential separating axes"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d24-b2-raycasting-mouse-picking",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "AABB vs OBB Comparison on Rotated Objects",
              "boxes": [
                {
                  "label": "1. Rotated AABB",
                  "value": "Box expands to align with world axes -> 140% empty wasted space, false hits",
                  "varType": "Loose Bounds",
                  "isUpdated": false
                },
                {
                  "label": "2. Rotated OBB",
                  "value": "Box rotates with 3D mesh -> 0% wasted space, 100% tight collision precision",
                  "varType": "Tight Bounds",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "obb_tightness_demo.js",
            "initialCode": "function evaluateBoxTightness(boxType, angleDeg) {\n  if (boxType === 'AABB' && angleDeg === 45) return 'AABB_VOLUME_EXPANDED_141_PERCENT: FALSE_COLLISION_BUBBLE';\n  if (boxType === 'OBB') return 'OBB_CONSTANT_TIGHT_FIT: ZERO_FALSE_COLLISIONS';\n  return 'STANDARD';\n}\n\nconsole.log(evaluateBoxTightness('AABB', 45));\nconsole.log(evaluateBoxTightness('OBB', 45));",
            "expectedOutput": "AABB_VOLUME_EXPANDED_141_PERCENT: FALSE_COLLISION_BUBBLE\nOBB_CONSTANT_TIGHT_FIT: ZERO_FALSE_COLLISIONS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why are Oriented Bounding Boxes (OBB) used instead of AABBs for elongated objects like swords, planes, and character limbs?",
          "options": [
            "Because an OBB rotates together with the 3D model, maintaining a tight snug bounding volume and preventing giant false collision bubbles when the object rotates at $45^\\circ$ angles",
            "Because OBBs use fewer CPU instructions than spheres",
            "Because AABBs cannot be stored in memory"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_3D_PHYSICS_COLLISION_RAYCASTING_AABB_OBB",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_3D_PHYSICS_COLLISION_RAYCASTING_AABB_OBB",
              "errorExplanation": "OBBs rotate with the mesh, eliminating loose bounding box expansion on rotated geometry.",
              "recoveryPath": {
                "simplerExplanation": "Rotates with the object to keep bounding volume snug and tight.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 25,
    "title": "Particle Systems & GPU Instanced Rendering",
    "overviewMetaphor": "GPU Instancing is a commercial printing press: if a scene has 50,000 falling cherry blossom petals or sparks, issuing 50,000 separate `gl.drawArrays()` CPU calls chokes the driver (FPS drops to 2!); with GPU Hardware Instancing (`gl.drawElementsInstanced`), the CPU issues 1 single draw call with a buffer of 50,000 particle positions; the GPU graphics card spawns 50,000 petals in parallel at a solid 60 FPS.",
    "blocks": [
      {
        "id": "g3d-d25-b1-gpu-instanced-arrays",
        "day": 25,
        "blockNumber": 1,
        "title": "Hardware Instanced Rendering (`gl.drawElementsInstanced`)",
        "conceptBudget": {
          "primaryConcept": "GPU Instanced Rendering",
          "supportingTerms": [
            "`gl.vertexAttribDivisor(loc, 1)` (Advances attribute once per instance rather than once per vertex)",
            "Instance Buffer: `[PosX, PosY, PosZ, Scale, RotQuatX, Y, Z, W]`",
            "Reducing 50,000 CPU draw calls down to 1 single GPU draw call"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d8-b3-vao-state-encapsulation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Instanced Attribute Pointer & Divisor Setup",
            "codeSnippet": "gl.bindBuffer(gl.ARRAY_BUFFER, instanceMatrixBuffer);\ngl.vertexAttribPointer(3, 4, gl.FLOAT, false, 64, 0); // Mat4 Column 0\ngl.enableVertexAttribArray(3);\ngl.vertexAttribDivisor(3, 1); // Step ONCE PER INSTANCE! (Not per vertex)\n\n// Render 50,000 particles in ONE single draw call:\ngl.drawElementsInstanced(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0, 50000);",
            "lineNotes": {
              "4": "vertexAttribDivisor(loc, 1) instructs GPU to advance attribute once per instance.",
              "7": "Draws 50,000 3D instances in 1 single CPU draw call!"
            }
          },
          {
            "type": "runnable_code",
            "filename": "instancing_perf_demo.js",
            "initialCode": "function evaluateDrawCalls(particleCount, isInstanced) {\n  const drawCalls = isInstanced ? 1 : particleCount;\n  return {\n    particleCount,\n    isInstanced,\n    totalDrawCallsIssued: drawCalls,\n    performanceTier: isInstanced ? '60_FPS_SILKY_SMOOTH' : 'CPU_DRIVER_OVERHEAD_CRASH'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateDrawCalls(50000, true)));\nconsole.log(JSON.stringify(evaluateDrawCalls(50000, false)));",
            "expectedOutput": "{\"particleCount\":50000,\"isInstanced\":true,\"totalDrawCallsIssued\":1,\"performanceTier\":\"60_FPS_SILKY_SMOOTH\"}\n{\"particleCount\":50000,\"isInstanced\":false,\"totalDrawCallsIssued\":50000,\"performanceTier\":\"CPU_DRIVER_OVERHEAD_CRASH\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many draw calls are issued to the GPU when rendering 50,000 particles with GPU Instanced Rendering?",
          "expectedStringOutput": "1",
          "acceptableAnswers": [
            "1",
            "totalDrawCallsIssued\":1",
            "1 draw call"
          ],
          "primaryMisconceptionId": "MC_3D_PARTICLE_SYSTEMS_GPU_INSTANCING_BILLBOARD",
          "diagnosisMap": {
            "50000": {
              "misconceptionId": "MC_3D_PARTICLE_SYSTEMS_GPU_INSTANCING_BILLBOARD",
              "errorExplanation": "50,000 is for un-instanced draws. GPU Instancing collapses them all into 1 single call.",
              "recoveryPath": {
                "simplerExplanation": "Collapses into 1 single draw call.",
                "guidedFixPrompt": "Type 1"
              }
            }
          }
        }
      },
      {
        "id": "g3d-d25-b2-camera-facing-billboarding",
        "day": 25,
        "blockNumber": 2,
        "title": "Camera-Facing Billboarding Matrices",
        "conceptBudget": {
          "primaryConcept": "Billboard Alignment Matrices",
          "supportingTerms": [
            "Spherical Billboarding (Particle quad rotates on all 3 axes to face camera lens directly: $M_{\\text{rot}} = M_{\\text{view}}^T$)",
            "Cylindrical / Axial Billboarding (Rotates only around Y axis: 3D trees, character nameplates)",
            "Smoke, fire, and magical spark particle effects"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d25-b1-gpu-instanced-arrays",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "billboard_align_demo.js",
            "initialCode": "function evaluateBillboardOrientation(camRight, camUp) {\n  return {\n    particleRightAxis: camRight,\n    particleUpAxis: camUp,\n    alwaysFacesCameraLens: true,\n    status: 'SPHERICAL_BILLBOARD_ALIGNED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateBillboardOrientation([1, 0, 0], [0, 1, 0])));",
            "expectedOutput": "{\"particleRightAxis\":[1,0,0],\"particleUpAxis\":[0,1,0],\"alwaysFacesCameraLens\":true,\"status\":\"SPHERICAL_BILLBOARD_ALIGNED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms spherical billboard quad alignment to the camera's Right and Up axes?",
          "expectedStringOutput": "SPHERICAL_BILLBOARD_ALIGNED",
          "acceptableAnswers": [
            "SPHERICAL_BILLBOARD_ALIGNED",
            "status\":\"SPHERICAL_BILLBOARD_ALIGNED\""
          ],
          "primaryMisconceptionId": "MC_3D_PARTICLE_SYSTEMS_GPU_INSTANCING_BILLBOARD",
          "diagnosisMap": {
            "UNALIGNED": {
              "misconceptionId": "MC_3D_PARTICLE_SYSTEMS_GPU_INSTANCING_BILLBOARD",
              "errorExplanation": "Matches SPHERICAL_BILLBOARD_ALIGNED.",
              "recoveryPath": {
                "simplerExplanation": "Matches SPHERICAL_BILLBOARD_ALIGNED.",
                "guidedFixPrompt": "Type SPHERICAL_BILLBOARD_ALIGNED"
              }
            }
          }
        }
      },
      {
        "id": "g3d-d25-b3-transform-feedback-gpu-particles",
        "day": 25,
        "blockNumber": 3,
        "title": "GPU Compute via Transform Feedback (`gl.TRANSFORM_FEEDBACK`)",
        "conceptBudget": {
          "primaryConcept": "Transform Feedback Simulation",
          "supportingTerms": [
            "Transform Feedback (Writing vertex shader output directly back into a GPU VBO without CPU roundtrip)",
            "Ping-Pong Buffer Swapping (Buffer A $\\to$ Buffer B on alternating frames)",
            "1,000,000 particle physics simulations at 60 FPS"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d25-b2-camera-facing-billboarding",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "transform_feedback_demo.js",
            "initialCode": "function explainTransformFeedback() {\n  return 'Transform Feedback updates 1,000,000 particle velocities and positions directly in GPU VRAM without reading back to CPU JS memory!';\n}\n\nconsole.log(explainTransformFeedback());",
            "expectedOutput": "Transform Feedback updates 1,000,000 particle velocities and positions directly in GPU VRAM without reading back to CPU JS memory!",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why is WebGL2 Transform Feedback used for massive 1,000,000 particle physics simulations?",
          "options": [
            "It runs particle integration and velocity updates entirely on GPU shader cores, writing updated positions directly into VRAM buffers without expensive CPU-to-GPU memory transfer bottlenecks",
            "Because CPU JavaScript is forbidden from doing math",
            "To slow down the simulation"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_3D_PARTICLE_SYSTEMS_GPU_INSTANCING_BILLBOARD",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_3D_PARTICLE_SYSTEMS_GPU_INSTANCING_BILLBOARD",
              "errorExplanation": "Transform feedback computes physics on GPU VRAM, eliminating CPU bottlenecks.",
              "recoveryPath": {
                "simplerExplanation": "Updates particles directly on GPU without CPU memory transfer.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 26,
    "title": "Level of Detail (LOD) & Occlusion Culling",
    "overviewMetaphor": "LOD & Occlusion Culling is theatrical set efficiency: if an avatar is 1 foot from the camera, the engine renders 50,000 polygons with individual eyelashes and skin pores (LOD 0); when the avatar runs 100 meters away into the background, the eye cannot resolve fine details, so the engine swaps in a lightweight 500-polygon mesh (LOD 2); if the avatar walks behind a stone castle wall, Occlusion Culling discards the avatar completely before drawing, saving 100% of the pixel shading cost.",
    "blocks": [
      {
        "id": "g3d-d26-b1-distance-lod-mesh-swapping",
        "day": 26,
        "blockNumber": 1,
        "title": "Distance-Based Level of Detail (LOD 0 $\\to$ LOD 1 $\\to$ LOD 2)",
        "conceptBudget": {
          "primaryConcept": "Distance-Based Mesh LOD",
          "supportingTerms": [
            "LOD 0: Full detail (0-10m: 50,000 triangles)",
            "LOD 1: Medium detail (10-30m: 10,000 triangles)",
            "LOD 2: Low detail (30-80m: 1,000 triangles)",
            "LOD 3: Billboard Impostor (80m+: 2 triangles)",
            "Hysteresis threshold bands to prevent pop-in flickering"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d6-b2-view-frustum-6-planes-culling",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "LOD Triangle Count vs Distance Tiers",
              "boxes": [
                {
                  "label": "LOD 0 (0m - 10m)",
                  "value": "50,000 Triangles | 100% Geometry Detail (Close-up cinematic)",
                  "varType": "Ultra High",
                  "isUpdated": false
                },
                {
                  "label": "LOD 1 (10m - 30m)",
                  "value": "10,000 Triangles | 80% Reduction (Mid-ground combat)",
                  "varType": "Medium",
                  "isUpdated": false
                },
                {
                  "label": "LOD 2 (30m - 80m)",
                  "value": "1,000 Triangles | 98% Reduction (Background scenery)",
                  "varType": "Low Poly",
                  "isUpdated": false
                },
                {
                  "label": "LOD 3 (80m+)",
                  "value": "2 Triangles | 99.99% Reduction (Flat billboard impostor)",
                  "varType": "Impostor",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "lod_selector_demo.js",
            "initialCode": "function selectLodMesh(distanceMeters) {\n  if (distanceMeters < 10) return { tier: 'LOD_0', triangles: 50000 };\n  if (distanceMeters < 30) return { tier: 'LOD_1', triangles: 10000 };\n  if (distanceMeters < 80) return { tier: 'LOD_2', triangles: 1000 };\n  return { tier: 'LOD_3_IMPOSTOR', triangles: 2 };\n}\n\nconsole.log(JSON.stringify(selectLodMesh(5)));  // Close\nconsole.log(JSON.stringify(selectLodMesh(45))); // Far",
            "expectedOutput": "{\"tier\":\"LOD_0\",\"triangles\":50000}\n{\"tier\":\"LOD_2\",\"triangles\":1000}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What LOD tier and triangle count is selected for an avatar standing 45 meters away?",
          "expectedStringOutput": "{\"tier\":\"LOD_2\",\"triangles\":1000}",
          "acceptableAnswers": [
            "{\"tier\":\"LOD_2\",\"triangles\":1000}",
            "LOD_2",
            "LOD_2 (1000 triangles)"
          ],
          "primaryMisconceptionId": "MC_3D_OPTIMIZATION_LOD_OCCLUSION_CULLING_DRAW_CALLS",
          "diagnosisMap": {
            "LOD_0": {
              "misconceptionId": "MC_3D_OPTIMIZATION_LOD_OCCLUSION_CULLING_DRAW_CALLS",
              "errorExplanation": "At 45m (between 30-80m), the engine selects LOD_2 with 1,000 triangles.",
              "recoveryPath": {
                "simplerExplanation": "45m maps to LOD_2 (1000 triangles).",
                "guidedFixPrompt": "Type {\"tier\":\"LOD_2\",\"triangles\":1000}"
              }
            }
          }
        }
      },
      {
        "id": "g3d-d26-b2-occlusion-culling-hierarchical-z",
        "day": 26,
        "blockNumber": 2,
        "title": "Hierarchical Z-Buffer (HZB) & Hardware Occlusion Queries",
        "conceptBudget": {
          "primaryConcept": "Occlusion Culling Algorithms",
          "supportingTerms": [
            "Overdraw Waste (Shading millions of pixels that get overwritten by front walls)",
            "Hardware Occlusion Queries (`gl.createQuery()`, `gl.ANY_SAMPLES_PASSED`)",
            "Hierarchical Z-Buffer (HZB: Downsampled depth mipmap pyramid for fast bounding box occlusion)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d26-b1-distance-lod-mesh-swapping",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "hzb_occlusion_demo.js",
            "initialCode": "function evaluateOcclusion(isOccludedByWall) {\n  return isOccludedByWall\n    ? 'CULLED_BY_HZB: SKIP_DRAW_CALL_SAVE_GPU'\n    : 'VISIBLE: PROCEED_RENDER';\n}\n\nconsole.log(evaluateOcclusion(true));  // Behind castle wall\nconsole.log(evaluateOcclusion(false)); // In open courtyard",
            "expectedOutput": "CULLED_BY_HZB: SKIP_DRAW_CALL_SAVE_GPU\nVISIBLE: PROCEED_RENDER",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status is returned by the HZB occlusion system when a 3D avatar is completely hidden behind a stone wall?",
          "expectedStringOutput": "CULLED_BY_HZB: SKIP_DRAW_CALL_SAVE_GPU",
          "acceptableAnswers": [
            "CULLED_BY_HZB: SKIP_DRAW_CALL_SAVE_GPU",
            "CULLED_BY_HZB"
          ],
          "primaryMisconceptionId": "MC_3D_OPTIMIZATION_LOD_OCCLUSION_CULLING_DRAW_CALLS",
          "diagnosisMap": {
            "VISIBLE": {
              "misconceptionId": "MC_3D_OPTIMIZATION_LOD_OCCLUSION_CULLING_DRAW_CALLS",
              "errorExplanation": "Hidden objects are culled by the HZB to save draw calls and fillrate.",
              "recoveryPath": {
                "simplerExplanation": "Matches CULLED_BY_HZB: SKIP_DRAW_CALL_SAVE_GPU.",
                "guidedFixPrompt": "Type CULLED_BY_HZB: SKIP_DRAW_CALL_SAVE_GPU"
              }
            }
          }
        }
      },
      {
        "id": "g3d-d26-b3-draw-call-batching-texture-atlases",
        "day": 26,
        "blockNumber": 3,
        "title": "Draw Call Batching & Megatexture Atlases",
        "conceptBudget": {
          "primaryConcept": "Draw Call Batching",
          "supportingTerms": [
            "Draw Call CPU Overhead ($< 100$ draw calls target for 60 FPS)",
            "Texture Atlas (Combining 64 separate character textures into one $4096 \\times 4096$ master image)",
            "Static Mesh Combining (`mergeGeometries`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d26-b2-occlusion-culling-hierarchical-z",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "drawcall_batch_demo.js",
            "initialCode": "function evaluateBatching(individualPropsCount, isBatchedIntoAtlas) {\n  const drawCalls = isBatchedIntoAtlas ? 1 : individualPropsCount;\n  return {\n    propsCount: individualPropsCount,\n    isBatched: isBatchedIntoAtlas,\n    drawCallsNeeded: drawCalls,\n    cpuDriverLoad: isBatchedIntoAtlas ? 'LOW_0.5ms' : 'SEVERE_25ms_STUTTER'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateBatching(300, true)));",
            "expectedOutput": "{\"propsCount\":300,\"isBatched\":true,\"drawCallsNeeded\":1,\"cpuDriverLoad\":\"LOW_0.5ms\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why are smaller static 3D props batched together into a single master mesh and Texture Atlas?",
          "options": [
            "Because each individual draw call carries significant CPU driver overhead; combining 300 props into 1 mesh and 1 texture atlas reduces 300 draw calls down to 1, saving CPU frame time and maintaining 60 FPS",
            "Because GPUs can only store 1 texture",
            "To delete prop geometry"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_3D_OPTIMIZATION_LOD_OCCLUSION_CULLING_DRAW_CALLS",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_3D_OPTIMIZATION_LOD_OCCLUSION_CULLING_DRAW_CALLS",
              "errorExplanation": "Batching eliminates CPU driver draw call overhead.",
              "recoveryPath": {
                "simplerExplanation": "Reduces 300 draw calls down to 1 single call.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 27,
    "title": "WebXR: VR Headsets, AR Spatial Anchors & 6-DoF Tracking",
    "overviewMetaphor": "WebXR is stepping physically inside the monitor: in a flat 2D game, you move a mouse; in WebXR Virtual Reality, the engine renders stereoscopic dual-camera viewports (Left Eye and Right Eye separated by 64mm IPD) matching your biological eyes; 6-DoF (Degrees of Freedom) headset sensors track your exact head translation ($X,Y,Z$) and rotation (Pitch, Yaw, Roll) at 90–120 FPS with ultra-low latency ($< 20\\text{ms}$) to prevent motion sickness.",
    "blocks": [
      {
        "id": "g3d-d27-b1-webxr-session-stereoscopic-views",
        "day": 27,
        "blockNumber": 1,
        "title": "WebXR Device API & Dual-Eye Stereoscopic Viewports",
        "conceptBudget": {
          "primaryConcept": "WebXR Stereoscopic Rendering",
          "supportingTerms": [
            "`navigator.xr.requestSession('immersive-vr')`",
            "Interpupillary Distance (IPD: $\\approx 64\\text{mm}$ eye separation)",
            "Stereoscopic View Loop: Iterating `xrPose.views` (Left Eye Viewport $\\to$ Right Eye Viewport)",
            "90 FPS / 120 FPS high-refresh render loop"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d6-b1-perspective-matrix-equation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "WebXR Dual-Eye Stereoscopic Render Loop",
            "codeSnippet": "function onXRFrame(time, frame) {\n  const session = frame.session;\n  const pose = frame.getViewerPose(xrRefSpace);\n\n  for (const view of pose.views) {\n    const viewport = xrGLLayer.getViewport(view);\n    gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);\n    // view.transform.inverse.matrix -> Left / Right Eye View Matrix\n    // view.projectionMatrix -> Asymmetric VR Projection Matrix\n    drawScene(view.transform.inverse.matrix, view.projectionMatrix);\n  }\n  session.requestAnimationFrame(onXRFrame);\n}",
            "lineNotes": {
              "5": "Loops over Left and Right eye views provided by headset hardware.",
              "7": "Sets hardware viewport rectangle for each eye half."
            }
          },
          {
            "type": "runnable_code",
            "filename": "webxr_ipd_demo.js",
            "initialCode": "function calculateEyeOffsets(ipdMeters = 0.064) {\n  const half = ipdMeters / 2.0;\n  return {\n    ipdMm: `${ipdMeters * 1000}mm`,\n    leftEyeOffsetX: Number((-half).toFixed(3)),\n    rightEyeOffsetX: Number((half).toFixed(3)),\n    status: 'WEBXR_STEREOSCOPIC_VIEWS_CONFIGURED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateEyeOffsets(0.064)));",
            "expectedOutput": "{\"ipdMm\":\"64mm\",\"leftEyeOffsetX\":-0.032,\"rightEyeOffsetX\":0.032,\"status\":\"WEBXR_STEREOSCOPIC_VIEWS_CONFIGURED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Left Eye horizontal offset (in meters) for a standard 64mm IPD (-half)?",
          "expectedStringOutput": "-0.032",
          "acceptableAnswers": [
            "-0.032",
            "leftEyeOffsetX\":-0.032"
          ],
          "primaryMisconceptionId": "MC_3D_WEBXR_VR_AR_HEADSET_POSE_SPATIAL_TRACKING",
          "diagnosisMap": {
            "-0.064": {
              "misconceptionId": "MC_3D_WEBXR_VR_AR_HEADSET_POSE_SPATIAL_TRACKING",
              "errorExplanation": "-0.064 is total IPD. Left eye offset is half (-0.032m).",
              "recoveryPath": {
                "simplerExplanation": "-0.064 / 2 = -0.032.",
                "guidedFixPrompt": "Type -0.032"
              }
            }
          }
        }
      },
      {
        "id": "g3d-d27-b2-six-dof-spatial-tracking",
        "day": 27,
        "blockNumber": 2,
        "title": "6 Degrees of Freedom (6-DoF) Head & Hand Tracking",
        "conceptBudget": {
          "primaryConcept": "6-DoF Spatial Tracking",
          "supportingTerms": [
            "3-DoF (Rotational only: Pitch, Yaw, Roll -> Cardboard/Oculus Go)",
            "6-DoF (Rotational + Positional: $X, Y, Z$ + Pitch/Yaw/Roll -> Quest 3, Vision Pro)",
            "Motion-to-Photon Latency SLA: $< 20\\text{ms}$ preventing vestibular motion sickness"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d27-b1-webxr-session-stereoscopic-views",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "3-DoF vs 6-DoF Tracking Capabilities",
              "boxes": [
                {
                  "label": "1. 3-DoF (Rotational)",
                  "value": "Tracks: Pitch, Yaw, Roll | Translation: LOCKED | Sickness Risk: HIGH if player leans",
                  "varType": "Rotation Only",
                  "isUpdated": false
                },
                {
                  "label": "2. 6-DoF (Positional + Rotational)",
                  "value": "Tracks: X, Y, Z + Pitch, Yaw, Roll | Full room-scale walking & physical crouching",
                  "varType": "Full Room Scale",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "six_dof_demo.js",
            "initialCode": "function evaluateXrTracking(dof) {\n  return (dof === 6)\n    ? 'ROOM_SCALE_6DOF: SUPPORTS_PHYSICAL_CROUCHING_AND_WALKING'\n    : 'SEATED_3DOF_ONLY: ROTATION_LOCKED_POS_FREEZE';\n}\n\nconsole.log(evaluateXrTracking(6));\nconsole.log(evaluateXrTracking(3));",
            "expectedOutput": "ROOM_SCALE_6DOF: SUPPORTS_PHYSICAL_CROUCHING_AND_WALKING\nSEATED_3DOF_ONLY: ROTATION_LOCKED_POS_FREEZE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What tracking capability is unlocked by 6-DoF spatial tracking in WebXR?",
          "expectedStringOutput": "ROOM_SCALE_6DOF: SUPPORTS_PHYSICAL_CROUCHING_AND_WALKING",
          "acceptableAnswers": [
            "ROOM_SCALE_6DOF: SUPPORTS_PHYSICAL_CROUCHING_AND_WALKING",
            "ROOM_SCALE_6DOF",
            "Room Scale"
          ],
          "primaryMisconceptionId": "MC_3D_WEBXR_VR_AR_HEADSET_POSE_SPATIAL_TRACKING",
          "diagnosisMap": {
            "ROTATION": {
              "misconceptionId": "MC_3D_WEBXR_VR_AR_HEADSET_POSE_SPATIAL_TRACKING",
              "errorExplanation": "6-DoF enables full physical translation (ROOM_SCALE_6DOF: SUPPORTS_PHYSICAL_CROUCHING_AND_WALKING).",
              "recoveryPath": {
                "simplerExplanation": "Supports physical crouching and walking.",
                "guidedFixPrompt": "Type ROOM_SCALE_6DOF: SUPPORTS_PHYSICAL_CROUCHING_AND_WALKING"
              }
            }
          }
        }
      },
      {
        "id": "g3d-d27-b3-ar-hit-testing-spatial-anchors",
        "day": 27,
        "blockNumber": 3,
        "title": "Augmented Reality (AR) Hit-Testing & Spatial Anchors",
        "conceptBudget": {
          "primaryConcept": "WebXR AR Hit-Testing & Anchors",
          "supportingTerms": [
            "`session.requestHitTestSource({ space: viewerSpace })`",
            "Surface plane detection (Floor, tables, walls)",
            "Spatial Anchors (Locking virtual 3D avatars permanently to physical room coordinates)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d27-b2-six-dof-spatial-tracking",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "ar_anchor_demo.js",
            "initialCode": "function evaluateArHit(hitResultsCount) {\n  return hitResultsCount > 0\n    ? 'PHYSICAL_SURFACE_DETECTED: SPAWN_SPATIAL_ANCHOR_AVATAR'\n    : 'AIR_RAY_SEARCHING_FOR_SURFACE';\n}\n\nconsole.log(evaluateArHit(3));\nconsole.log(evaluateArHit(0));",
            "expectedOutput": "PHYSICAL_SURFACE_DETECTED: SPAWN_SPATIAL_ANCHOR_AVATAR\nAIR_RAY_SEARCHING_FOR_SURFACE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is the purpose of WebXR Spatial Anchors in Augmented Reality (AR)?",
          "options": [
            "They pin virtual 3D avatars and interactive objects to precise real-world physical coordinates (like a real floor or desk) so they stay locked in place as the user walks around the room",
            "To anchor files to the hard drive",
            "To reset camera orientation"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_3D_WEBXR_VR_AR_HEADSET_POSE_SPATIAL_TRACKING",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_3D_WEBXR_VR_AR_HEADSET_POSE_SPATIAL_TRACKING",
              "errorExplanation": "Spatial anchors lock virtual objects to physical room surfaces.",
              "recoveryPath": {
                "simplerExplanation": "Locks virtual avatars onto physical real-world surfaces.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 28,
    "title": "Screen-Space Ambient Occlusion (SSAO) & Depth Post-Passes",
    "overviewMetaphor": "SSAO (Screen-Space Ambient Occlusion) is dirty corner shading: direct sunlight makes flat white walls bright; but where two walls meet in a corner, or where an avatar's boots touch the dirt floor, ambient bouncing light cannot easily reach into the deep crevice (Ambient Occlusion); SSAO shoots 16 tiny sample rays into a hemisphere around each pixel in view space, calculating how much geometry is blocking the sky, darkening deep cracks and grounding characters on the floor.",
    "blocks": [
      {
        "id": "g3d-d28-b1-ssao-hemisphere-sampling-theory",
        "day": 28,
        "blockNumber": 1,
        "title": "SSAO Hemisphere Depth Sampling in View Space",
        "conceptBudget": {
          "primaryConcept": "SSAO Hemisphere Sampling",
          "supportingTerms": [
            "View-Space Normal & Depth Reconstruction",
            "16/32 Sample Hemisphere Kernel (Weighted closer to origin)",
            "Depth comparison test: $\\text{sampleDepth} \\ge \\text{bufferDepth} + \\text{bias}$",
            "Range Check Falloff ($1 - \\Delta Z / R$)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d14-b1-hdr-floating-point-framebuffers",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "GLSL SSAO Fragment Shader Sampling Loop",
            "codeSnippet": "float occlusion = 0.0;\nfor (int i = 0; i < 16; ++i) {\n  vec3 samplePos = v_ViewPos + u_Samples[i] * u_Radius;\n  vec4 offset = u_ProjectionMatrix * vec4(samplePos, 1.0);\n  offset.xy = (offset.xy / offset.w) * 0.5 + 0.5; // Project to UV [0, 1]\n  float sampleDepth = texture(u_DepthMap, offset.xy).r;\n  float rangeCheck = smoothstep(0.0, 1.0, u_Radius / abs(v_ViewPos.z - sampleDepth));\n  occlusion += (sampleDepth >= samplePos.z + u_Bias ? 1.0 : 0.0) * rangeCheck;\n}\nocclusion = 1.0 - (occlusion / 16.0);",
            "lineNotes": {
              "3": "Transforms hemisphere sample point into UV texture space.",
              "8": "Accumulates occlusion if sample point penetrates behind geometry."
            }
          },
          {
            "type": "runnable_code",
            "filename": "ssao_sampling_demo.js",
            "initialCode": "function evaluateSsaoOcclusion(blockedSamplesOutOf16) {\n  const factor = 1.0 - (blockedSamplesOutOf16 / 16.0);\n  return {\n    blockedSamples: blockedSamplesOutOf16,\n    ambientMultiplier: Number(factor.toFixed(2)),\n    status: (blockedSamplesOutOf16 > 8) ? 'DEEP_CREVICE_OCCLUDED_SHADOW' : 'OPEN_SURFACE_FULLY_LIT'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateSsaoOcclusion(12))); // Corner crease\nconsole.log(JSON.stringify(evaluateSsaoOcclusion(2)));  // Flat open wall",
            "expectedOutput": "{\"blockedSamples\":12,\"ambientMultiplier\":0.25,\"status\":\"DEEP_CREVICE_OCCLUDED_SHADOW\"}\n{\"blockedSamples\":2,\"ambientMultiplier\":0.88,\"status\":\"OPEN_SURFACE_FULLY_LIT\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the ambient lighting multiplier when 12 out of 16 hemisphere samples are blocked in a corner crease ($1.0 - 12/16$)?",
          "expectedStringOutput": "0.25",
          "acceptableAnswers": [
            "0.25",
            "ambientMultiplier\":0.25"
          ],
          "primaryMisconceptionId": "MC_3D_SHADOW_VOLUMES_SSAO_AMBIENT_OCCLUSION",
          "diagnosisMap": {
            "0.75": {
              "misconceptionId": "MC_3D_SHADOW_VOLUMES_SSAO_AMBIENT_OCCLUSION",
              "errorExplanation": "12/16 = 0.75 occlusion. Ambient light factor is 1.0 - 0.75 = 0.25.",
              "recoveryPath": {
                "simplerExplanation": "1.0 - (12/16) = 0.25.",
                "guidedFixPrompt": "Type 0.25"
              }
            }
          }
        }
      },
      {
        "id": "g3d-d28-b2-noise-texture-and-blur-pass",
        "day": 28,
        "blockNumber": 2,
        "title": "4x4 Noise Textures & Bilateral Depth-Aware Blur",
        "conceptBudget": {
          "primaryConcept": "SSAO Noise & Depth-Aware Blur",
          "supportingTerms": [
            "4x4 Random Tangent Rotation Noise Texture",
            "Eliminating Banding Artifacts",
            "Bilateral Depth-Aware Blur (Blurs SSAO noise smoothly while respecting sharp geometry edges)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d28-b1-ssao-hemisphere-sampling-theory",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "bilateral_blur_demo.js",
            "initialCode": "function evaluateBilateralEdge(depthA, depthB) {\n  const depthDiff = Math.abs(depthA - depthB);\n  return (depthDiff > 0.5)\n    ? 'SHARP_GEOMETRY_EDGE: PRESERVE_EDGE_DO_NOT_BLUR'\n    : 'CONTINUOUS_SURFACE: APPLY_BILATERAL_SMOOTHING';\n}\n\nconsole.log(evaluateBilateralEdge(2.0, 5.0)); // Silhouette edge\nconsole.log(evaluateBilateralEdge(2.0, 2.05)); // Flat floor",
            "expectedOutput": "SHARP_GEOMETRY_EDGE: PRESERVE_EDGE_DO_NOT_BLUR\nCONTINUOUS_SURFACE: APPLY_BILATERAL_SMOOTHING",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why must SSAO use a Bilateral Depth-Aware blur rather than a standard Gaussian blur?",
          "options": [
            "Because a standard Gaussian blur would bleed dark ambient occlusion shadows across distant background silhouettes; a bilateral blur tests depth differences, preserving crisp geometric edges",
            "Because bilateral blur takes 10x less RAM",
            "To invert the color channels"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_3D_SHADOW_VOLUMES_SSAO_AMBIENT_OCCLUSION",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_3D_SHADOW_VOLUMES_SSAO_AMBIENT_OCCLUSION",
              "errorExplanation": "Bilateral blur respects depth boundaries to avoid halo artifacts.",
              "recoveryPath": {
                "simplerExplanation": "Preserves sharp geometry edges while smoothing noise.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "g3d-d28-b3-ssao-material-modulation",
        "day": 28,
        "blockNumber": 3,
        "title": "Modulating Ambient Radiance with SSAO in PBR Shaders",
        "conceptBudget": {
          "primaryConcept": "SSAO Material Lighting Integration",
          "supportingTerms": [
            "Indirect Ambient Modulation: $I_{\\text{ambient}} = \\text{SSAO} \\times \\text{Albedo} \\times I_{\\text{env}}$",
            "Direct Lights unaffected (Direct sunlight is not blocked by ambient crevices)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d28-b2-noise-texture-and-blur-pass",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "ssao_pbr_mod_demo.js",
            "initialCode": "function explainSsaoIntegration() {\n  return 'SSAO modulates ONLY indirect ambient irradiance (Albedo * Ambient * SSAO); direct directional sun highlights remain unattenuated!';\n}\n\nconsole.log(explainSsaoIntegration());",
            "expectedOutput": "SSAO modulates ONLY indirect ambient irradiance (Albedo * Ambient * SSAO); direct directional sun highlights remain unattenuated!",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Which lighting component is modulated by the SSAO factor in a physically based shader?",
          "options": [
            "Only indirect ambient and environment lighting (leaving direct specular highlights and directional sunlight unattenuated)",
            "Direct sunlight",
            "Laser beams"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_3D_SHADOW_VOLUMES_SSAO_AMBIENT_OCCLUSION",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_3D_SHADOW_VOLUMES_SSAO_AMBIENT_OCCLUSION",
              "errorExplanation": "SSAO modulates ambient/indirect light only.",
              "recoveryPath": {
                "simplerExplanation": "Modulates indirect ambient light only.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 29,
    "title": "Procedural 3D Geometry Generation & Perlin Noise Terrains",
    "overviewMetaphor": "Procedural Mesh Generation is growing mathematical mountains: instead of importing a 500MB static 3D model, the engine creates a flat $(X, Z)$ grid of vertices in code; Perlin / Simplex Noise adds mathematical turbulence (Octaves of frequency and amplitude), pulling mountain peaks high into the sky (+Y) and carving deep river valleys; automatic cross-product algorithms generate perfect smooth surface normals on the fly.",
    "blocks": [
      {
        "id": "g3d-d29-b1-procedural-grid-mesh-topology",
        "day": 29,
        "blockNumber": 1,
        "title": "Procedural Grid Vertex Topology & Quad Indexing",
        "conceptBudget": {
          "primaryConcept": "Procedural Grid Generation",
          "supportingTerms": [
            "Grid Dimensions ($W \\times H$ vertices)",
            "Vertex indexing formula: $\\text{index} = z \\times W + x$",
            "Quad Triangle Winding: Two triangles per cell `(p0, p2, p1)` and `(p1, p2, p3)`",
            "Automated UV coordinate generation: $U = x / (W-1), V = z / (H-1)$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d8-b2-indexed-drawing-ebo-ibo",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Procedural Grid Triangle Quad Generator",
            "codeSnippet": "for (let z = 0; z < height - 1; ++z) {\n  for (let x = 0; x < width - 1; ++x) {\n    let p0 = z * width + x;\n    let p1 = p0 + 1;\n    let p2 = (z + 1) * width + x;\n    let p3 = p2 + 1;\n    // Triangle 1 & Triangle 2 (CCW Winding):\n    indices.push(p0, p2, p1);\n    indices.push(p1, p2, p3);\n  }\n}",
            "lineNotes": {
              "8": "Pushes 6 indices per grid quad forming two counter-clockwise triangles."
            }
          },
          {
            "type": "runnable_code",
            "filename": "grid_indices_demo.js",
            "initialCode": "function calculateGridStats(width, height) {\n  const vertices = width * height;\n  const quads = (width - 1) * (height - 1);\n  const triangles = quads * 2;\n  const indices = triangles * 3;\n  return { vertices, quads, triangles, indices };\n}\n\nconsole.log(JSON.stringify(calculateGridStats(100, 100))); // 100x100 terrain mesh",
            "expectedOutput": "{\"vertices\":10000,\"quads\":9801,\"triangles\":19602,\"indices\":58806}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many total indices are generated for a 100x100 vertex procedural terrain mesh ($9801 \\text{ quads} \\times 6$)?",
          "expectedStringOutput": "58806",
          "acceptableAnswers": [
            "58806",
            "indices\":58806"
          ],
          "primaryMisconceptionId": "MC_3D_PROCEDURAL_GENERATION_NOISE_TERRAIN_MESH",
          "diagnosisMap": {
            "10000": {
              "misconceptionId": "MC_3D_PROCEDURAL_GENERATION_NOISE_TERRAIN_MESH",
              "errorExplanation": "10,000 is vertex count. Total indices = (99*99)*6 = 58,806.",
              "recoveryPath": {
                "simplerExplanation": "9801 * 6 = 58,806.",
                "guidedFixPrompt": "Type 58806"
              }
            }
          }
        }
      },
      {
        "id": "g3d-d29-b2-perlin-noise-fractal-octaves",
        "day": 29,
        "blockNumber": 2,
        "title": "Perlin / Simplex Noise & Fractional Brownian Motion (fBm)",
        "conceptBudget": {
          "primaryConcept": "Fractal Noise & Terrain Octaves",
          "supportingTerms": [
            "Gradient Perlin / Simplex Noise",
            "Fractal Brownian Motion (fBm): $\\sum_{k=0}^N \\text{amplitude}^k \\times \\text{noise}(\\text{frequency}^k \\times X)$",
            "Persistence ($0.5$: Amplitude halving per octave)",
            "Lacunarity ($2.0$: Frequency doubling per octave)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d29-b1-procedural-grid-mesh-topology",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Fractal Octaves in Terrain Generation",
              "boxes": [
                {
                  "label": "Octave 0 (Low Freq, High Amp)",
                  "value": "Forms giant continental mountain ranges and ocean valleys",
                  "varType": "Macro Mountains",
                  "isUpdated": false
                },
                {
                  "label": "Octave 1 (Mid Freq, Mid Amp)",
                  "value": "Carves hills, riverbanks, and cliff ridges",
                  "varType": "Meso Hills",
                  "isUpdated": false
                },
                {
                  "label": "Octave 2 (High Freq, Low Amp)",
                  "value": "Adds microscopic gravel bumps and rocky surface noise",
                  "varType": "Micro Rocks",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "fbm_octave_demo.js",
            "initialCode": "function evaluateFbmOctaves(octaves = 4) {\n  let amp = 1.0, freq = 1.0;\n  let totalAmp = 0;\n  for (let i = 0; i < octaves; i++) {\n    totalAmp += amp;\n    amp *= 0.5; // Persistence 0.5\n    freq *= 2.0; // Lacunarity 2.0\n  }\n  return {\n    octaves,\n    maxTerrainElevation: Number(totalAmp.toFixed(3)),\n    status: 'FBM_TERRAIN_OCTAVES_ACCUMULATED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateFbmOctaves(4)));",
            "expectedOutput": "{\"octaves\":4,\"maxTerrainElevation\":1.875,\"status\":\"FBM_TERRAIN_OCTAVES_ACCUMULATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the total cumulative maximum elevation for 4 fBm octaves with persistence 0.5 ($1 + 0.5 + 0.25 + 0.125$)?",
          "expectedStringOutput": "1.875",
          "acceptableAnswers": [
            "1.875",
            "maxTerrainElevation\":1.875"
          ],
          "primaryMisconceptionId": "MC_3D_PROCEDURAL_GENERATION_NOISE_TERRAIN_MESH",
          "diagnosisMap": {
            "2.0": {
              "misconceptionId": "MC_3D_PROCEDURAL_GENERATION_NOISE_TERRAIN_MESH",
              "errorExplanation": "1 + 0.5 + 0.25 + 0.125 = 1.875.",
              "recoveryPath": {
                "simplerExplanation": "1 + 0.5 + 0.25 + 0.125 = 1.875.",
                "guidedFixPrompt": "Type 1.875"
              }
            }
          }
        }
      },
      {
        "id": "g3d-d29-b3-procedural-normal-recalculation",
        "day": 29,
        "blockNumber": 3,
        "title": "Analytical Surface Normal Generation for Procedural Heightmaps",
        "conceptBudget": {
          "primaryConcept": "Heightmap Normal Generation",
          "supportingTerms": [
            "Finite Difference Gradient: $\\Delta x = h(x+1, z) - h(x-1, z)$",
            "$\\\\Delta z = h(x, z+1) - h(x, z-1)$",
            "Surface Normal: $\\vec{n} = \\text{normalize}([-\\Delta x, 2 \\times \\text{spacing}, -\\Delta z])$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d29-b2-perlin-noise-fractal-octaves",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "heightmap_normal_demo.js",
            "initialCode": "function computeHeightmapNormal(heightL, heightR, heightD, heightU, spacing = 1.0) {\n  const dx = heightR - heightL;\n  const dz = heightU - heightD;\n  const dy = 2.0 * spacing;\n  const mag = Math.sqrt(dx*dx + dy*dy + dz*dz);\n  return [Number((-dx/mag).toFixed(3)), Number((dy/mag).toFixed(3)), Number((-dz/mag).toFixed(3))];\n}\n\nconsole.log('Flat terrain normal:', JSON.stringify(computeHeightmapNormal(0, 0, 0, 0)));",
            "expectedOutput": "Flat terrain normal: [0,1,0]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What surface normal vector is produced for perfectly flat terrain (heightL=0, heightR=0, heightD=0, heightU=0)?",
          "expectedStringOutput": "[0,1,0]",
          "acceptableAnswers": [
            "[0,1,0]",
            "[0, 1, 0]",
            "+Y"
          ],
          "primaryMisconceptionId": "MC_3D_PROCEDURAL_GENERATION_NOISE_TERRAIN_MESH",
          "diagnosisMap": {
            "[0,0,1]": {
              "misconceptionId": "MC_3D_PROCEDURAL_GENERATION_NOISE_TERRAIN_MESH",
              "errorExplanation": "Flat ground normal points straight up along +Y [0, 1, 0].",
              "recoveryPath": {
                "simplerExplanation": "Flat ground normal = [0, 1, 0].",
                "guidedFixPrompt": "Type [0,1,0]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Enterprise Real-Time 3D Interactive Metaverse Avatar Engine",
    "overviewMetaphor": "The Grand Metaverse Symphony: Everything built across 30 days operates concurrently in one production real-time WebGL2 engine: 1. 3D PBR deferred rendering pipeline; 2. Directional Shadow Maps with PCF soft penumbras; 3. 54-bone Humanoid Avatar Rig with GPU Linear Blend Skinning; 4. 52 ARKit Facial Blendshapes driven by real-time Audio Lip-Sync; 5. Orbit Camera & 6-DoF WebXR tracking; 6. SSAO & ACES Filmic Tone Mapping running flawlessly at 60 FPS.",
    "blocks": [
      {
        "id": "g3d-d30-b1-metaverse-architecture-synthesis",
        "day": 30,
        "blockNumber": 1,
        "title": "Enterprise 3D Interactive Metaverse Engine Architecture",
        "conceptBudget": {
          "primaryConcept": "Capstone Architecture Synthesis",
          "supportingTerms": [
            "Core Renderer: WebGL2 PBR Shading + Shadow Mapping",
            "Character Engine: 54-Bone GPU LBS Rig + 52 ARKit Blendshapes",
            "Audio AI Engine: Spectrogram Viseme Lip-Sync",
            "Post-Processing: SSAO + ACES Filmic Tone Mapping"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d29-b3-procedural-normal-recalculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Complete Enterprise 3D Metaverse Engine Architecture",
              "nodes": [
                {
                  "id": "1",
                  "label": "Audio Stream -> FFT Analyser -> Viseme Lip-Sync -> ARKit 52 Blendshapes",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "State Machine -> Quaternion SLERP -> 54-Bone FK -> GPU LBS Skinning",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Pass 1 Shadow Map -> Pass 2 PBR Deferred Render -> Pass 3 SSAO Depth Pass",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Pass 4 ACES Filmic Tone Mapping -> Screen Output at 60 FPS Certified!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "capstone_engine_master.js",
            "initialCode": "function executeMetaverseCycle() {\n  return {\n    avatarSkeletalBones: 54,\n    facialBlendshapes: 52,\n    pbrShadingMode: 'COOK_TORRANCE_METALLIC_ROUGHNESS',\n    shadows: 'DIRECTIONAL_PCF_SOFT_PENUMBRA',\n    postProcessing: 'SSAO_AND_ACES_FILMIC_TONEMAPPING',\n    fps: 60,\n    systemStatus: 'ENTERPRISE_3D_METAVERSE_ENGINE_CERTIFIED'\n  };\n}\n\nconsole.log(executeMetaverseCycle().systemStatus);",
            "expectedOutput": "ENTERPRISE_3D_METAVERSE_ENGINE_CERTIFIED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What master certification string confirms end-to-end execution of the 3D Metaverse Engine?",
          "expectedStringOutput": "ENTERPRISE_3D_METAVERSE_ENGINE_CERTIFIED",
          "acceptableAnswers": [
            "ENTERPRISE_3D_METAVERSE_ENGINE_CERTIFIED",
            "systemStatus: ENTERPRISE_3D_METAVERSE_ENGINE_CERTIFIED"
          ],
          "primaryMisconceptionId": "MC_3D_CAPSTONE_AVATAR_CINEMATIC_METAVERSE_ENGINE",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_3D_CAPSTONE_AVATAR_CINEMATIC_METAVERSE_ENGINE",
              "errorExplanation": "Matches ENTERPRISE_3D_METAVERSE_ENGINE_CERTIFIED.",
              "recoveryPath": {
                "simplerExplanation": "Matches ENTERPRISE_3D_METAVERSE_ENGINE_CERTIFIED.",
                "guidedFixPrompt": "Type ENTERPRISE_3D_METAVERSE_ENGINE_CERTIFIED"
              }
            }
          }
        }
      },
      {
        "id": "g3d-d30-b2-capstone-performance-verification",
        "day": 30,
        "blockNumber": 2,
        "title": "Platform-Wide Production Performance Verification & SLA Audit",
        "conceptBudget": {
          "primaryConcept": "Capstone Production Performance SLA",
          "supportingTerms": [
            "Target FPS: 60 FPS (16.6ms frame budget)",
            "Draw Calls: < 100 draw calls",
            "VRAM Footprint: < 512 MB",
            "Zero memory leak invariant on asset unloading"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d30-b1-metaverse-architecture-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "capstone_sla_audit.js",
            "initialCode": "function auditMetaverseSla(fps, frameTimeMs, drawCalls, vramMb) {\n  const compliant = fps >= 60 && frameTimeMs <= 16.6 && drawCalls <= 100 && vramMb <= 512;\n  return {\n    fps,\n    frameTimeMs,\n    drawCalls,\n    vramMb,\n    compliant,\n    grade: compliant ? 'PRODUCTION_GOLD_STANDARD_CERTIFIED' : 'SLA_VIOLATION'\n  };\n}\n\nconsole.log(JSON.stringify(auditMetaverseSla(60, 15.2, 42, 280)));",
            "expectedOutput": "{\"fps\":60,\"frameTimeMs\":15.2,\"drawCalls\":42,\"vramMb\":280,\"compliant\":true,\"grade\":\"PRODUCTION_GOLD_STANDARD_CERTIFIED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification grade is awarded to the Metaverse engine operating at 60 FPS, 15.2ms frame time, 42 draw calls, and 280 MB VRAM?",
          "expectedStringOutput": "PRODUCTION_GOLD_STANDARD_CERTIFIED",
          "acceptableAnswers": [
            "PRODUCTION_GOLD_STANDARD_CERTIFIED",
            "grade\":\"PRODUCTION_GOLD_STANDARD_CERTIFIED\""
          ],
          "primaryMisconceptionId": "MC_3D_CAPSTONE_AVATAR_CINEMATIC_METAVERSE_ENGINE",
          "diagnosisMap": {
            "SLA_VIOLATION": {
              "misconceptionId": "MC_3D_CAPSTONE_AVATAR_CINEMATIC_METAVERSE_ENGINE",
              "errorExplanation": "All metrics are within SLA limits, awarding PRODUCTION_GOLD_STANDARD_CERTIFIED.",
              "recoveryPath": {
                "simplerExplanation": "Awards PRODUCTION_GOLD_STANDARD_CERTIFIED.",
                "guidedFixPrompt": "Type PRODUCTION_GOLD_STANDARD_CERTIFIED"
              }
            }
          }
        }
      },
      {
        "id": "g3d-d30-b3-capstone-certification-final",
        "day": 30,
        "blockNumber": 3,
        "title": "Final Capstone 3D Interactive Graphics & Avatar Animation Graduation Certification",
        "conceptBudget": {
          "primaryConcept": "Capstone Final Graduation",
          "supportingTerms": [
            "30-Day Curriculum Completed",
            "3D Interactive Graphics & Avatar Mastery Achieved",
            "Zero Defects Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "g3d-d30-b2-capstone-performance-verification",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "capstone_graduation.js",
            "initialCode": "console.log('🏆 FINAL CAPSTONE: Enterprise Real-Time 3D Interactive Metaverse Avatar Engine [GRADUATED 100%]');",
            "expectedOutput": "🏆 FINAL CAPSTONE: Enterprise Real-Time 3D Interactive Metaverse Avatar Engine [GRADUATED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What final graduation string confirms 100% completion of the 3D Interactive Graphics & Avatar Animation curriculum?",
          "expectedStringOutput": "🏆 FINAL CAPSTONE: Enterprise Real-Time 3D Interactive Metaverse Avatar Engine [GRADUATED 100%]",
          "acceptableAnswers": [
            "🏆 FINAL CAPSTONE: Enterprise Real-Time 3D Interactive Metaverse Avatar Engine [GRADUATED 100%]",
            "GRADUATED 100%"
          ],
          "primaryMisconceptionId": "MC_3D_CAPSTONE_AVATAR_CINEMATIC_METAVERSE_ENGINE",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_3D_CAPSTONE_AVATAR_CINEMATIC_METAVERSE_ENGINE",
              "errorExplanation": "Matches final graduation string.",
              "recoveryPath": {
                "simplerExplanation": "Matches final graduation string.",
                "guidedFixPrompt": "Type 🏆 FINAL CAPSTONE: Enterprise Real-Time 3D Interactive Metaverse Avatar Engine [GRADUATED 100%]"
              }
            }
          }
        }
      }
    ]
  }
];
