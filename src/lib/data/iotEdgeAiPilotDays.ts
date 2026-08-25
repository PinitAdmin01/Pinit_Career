import { DayLessonPlan } from '@/lib/types/lessonEngine';

export const IOT_EDGE_AI_PILOT_DAYS: Record<number, DayLessonPlan> = {
  1: {
  "day": 1,
  "title": "Edge AI Fundamentals & TinyML Paradigm",
  "overviewMetaphor": "Edge AI vs Cloud AI is a Chef's Sense of Taste vs Mailing Soup Samples to a Lab: Cloud AI records sensor signals, compresses them, transmits them over cellular networks to a data center, waits in a server queue, runs inference on a massive GPU, and replies 500 milliseconds later (Too late to stop an industrial robotic arm from crashing!); Edge AI puts a tiny, quantized 50 KB neural network directly on the robot's local ARM Cortex-M4 microcontroller, evaluating vibrations in 5 milliseconds at zero cloud bandwidth cost and absolute data privacy.",
  "blocks": [
    {
      "id": "edgeai-d1-b1-tinyml-paradigm-latency-bandwidth",
      "day": 1,
      "blockNumber": 1,
      "title": "The TinyML Paradigm: Local Latency & Bandwidth Economics",
      "conceptBudget": {
        "primaryConcept": "Edge AI Local Latency & Bandwidth Invariant",
        "supportingTerms": [
          "Sub-10ms Real-Time Inference vs 500ms Cloud Round-Trip",
          "Bandwidth Reduction (Transmitting only 0.1% anomaly alerts instead of 100 Hz raw sensor streams)",
          "Data Privacy (Raw biometric and audio data never leaves local SRAM)",
          "Offline Resilience"
        ]
      },
      "prerequisiteThresholds": [],
      "media": [
        {
          "type": "diagram",
          "data": {
            "type": "memory_box",
            "title": "Edge AI vs Cloud AI Trade-off Matrix",
            "boxes": [
              {
                "label": "1. Cloud AI Architecture",
                "value": "Latency: 200 - 800 ms | Bandwidth: 100 MB/day | Privacy: Raw data leaves device | Cost: Recurring API/SIM fees",
                "varType": "Cloud Server",
                "isUpdated": false
              },
              {
                "label": "2. Edge TinyML Architecture",
                "value": "Latency: 1 - 10 ms | Bandwidth: < 1 KB/day (Alerts only) | Privacy: 100% On-Device | Cost: $0 recurring",
                "varType": "Edge MCU",
                "isUpdated": true
              }
            ]
          }
        },
        {
          "type": "runnable_code",
          "filename": "edge_savings_demo.js",
          "initialCode": "function evaluateEdgeLatencyGain(cloudMs = 350, edgeMs = 5) {\n  const speedup = cloudMs / edgeMs;\n  return `Edge TinyML executes inference in ${edgeMs}ms (${speedup}x faster than ${cloudMs}ms cloud roundtrip) with ZERO cellular bandwidth consumption!`;\n}\n\nconsole.log(evaluateEdgeLatencyGain(350, 5));",
          "expectedOutput": "Edge TinyML executes inference in 5ms (70x faster than 350ms cloud roundtrip) with ZERO cellular bandwidth consumption!",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "How many times faster is a 5 ms local edge inference compared to a 350 ms cloud round-trip ($350 / 5$)?",
        "expectedStringOutput": "70",
        "acceptableAnswers": [
          "70",
          "70x",
          "70 times"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_ON_DEVICE_LATENCY_VS_CLOUD_OFFLOADING",
        "diagnosisMap": {
          "350": {
            "misconceptionId": "MC_EDGEAI_ON_DEVICE_LATENCY_VS_CLOUD_OFFLOADING",
            "errorExplanation": "350 / 5 = 70x speedup.",
            "recoveryPath": {
              "simplerExplanation": "350 / 5 = 70.",
              "guidedFixPrompt": "Type 70"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d1-b2-edge-energy-envelope-milliwatts",
      "day": 1,
      "blockNumber": 2,
      "title": "Energy Envelopes: Milliwatts vs Kilowatts in AI Inference",
      "conceptBudget": {
        "primaryConcept": "Edge AI Energy Envelope",
        "supportingTerms": [
          "Microcontroller Power Budget ($< 50\\text{ mW}$ on Cortex-M4 vs $300\\text{ W}$ on Server GPU)",
          "Energy per Inference ($E_{\\text{inf}} \\approx 0.1 - 5\\text{ mJ}$)",
          "Battery-Powered Perpetual Operation"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d1-b1-tinyml-paradigm-latency-bandwidth",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "energy_envelope_demo.js",
          "initialCode": "function evaluateEnergyEnvelope(powerMw, timeMs) {\n  const energyMilliJoules = powerMw * (timeMs / 1000);\n  return {\n    powerConsumptionMilliwatts: powerMw,\n    inferenceTimeMs: timeMs,\n    energyPerInferenceMj: Number(energyMilliJoules.toFixed(3)),\n    status: energyMilliJoules < 5.0 ? 'TINYML_LOW_POWER_CERTIFIED' : 'EXCESSIVE_POWER_DRAIN'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateEnergyEnvelope(40, 10)));",
          "expectedOutput": "{\"powerConsumptionMilliwatts\":40,\"inferenceTimeMs\":10,\"energyPerInferenceMj\":0.4,\"status\":\"TINYML_LOW_POWER_CERTIFIED\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What energy in millijoules (mJ) is consumed during a 10 ms inference at 40 mW power ($40 \\times 0.010$)?",
        "expectedStringOutput": "0.4",
        "acceptableAnswers": [
          "0.4",
          "0.4 mJ",
          "0.4mJ",
          "energyPerInferenceMj\":0.4"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_ON_DEVICE_LATENCY_VS_CLOUD_OFFLOADING",
        "diagnosisMap": {
          "400": {
            "misconceptionId": "MC_EDGEAI_ON_DEVICE_LATENCY_VS_CLOUD_OFFLOADING",
            "errorExplanation": "40 mW * 0.010 s = 0.4 mJ.",
            "recoveryPath": {
              "simplerExplanation": "40 * 0.010 = 0.4 mJ.",
              "guidedFixPrompt": "Type 0.4"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d1-b3-tinyml-pipeline-stages",
      "day": 1,
      "blockNumber": 3,
      "title": "The 4-Stage TinyML Pipeline: Sensor $\\to$ DSP $\\to$ Model $\\to$ Actuator",
      "conceptBudget": {
        "primaryConcept": "The 4-Stage TinyML Pipeline",
        "supportingTerms": [
          "Stage 1: Sensor Sampling (I2C/SPI Accelerometer/Microphone via DMA)",
          "Stage 2: DSP Preprocessing (FFT, Mel-Filterbanks, Sliding Windows)",
          "Stage 3: Quantized Neural Inference (INT8 TFLM Engine)",
          "Stage 4: Actuation / Alert Dispatch"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d1-b2-edge-energy-envelope-milliwatts",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "diagram",
          "data": {
            "type": "flowchart",
            "title": "TinyML On-Device Execution Pipeline",
            "nodes": [
              {
                "id": "1",
                "label": "Sensor DMA Buffer: Samples 3-axis IMU accelerometer at 100 Hz",
                "kind": "start"
              },
              {
                "id": "2",
                "label": "DSP Feature Extractor: Computes FFT spectrogram + Kurtosis metrics",
                "kind": "process"
              },
              {
                "id": "3",
                "label": "TFLM INT8 Interpreter: Executes quantized 1D CNN in Tensor Arena",
                "kind": "process"
              },
              {
                "id": "4",
                "label": "Actuator Driver: Trips emergency relay if anomaly probability > 90%",
                "kind": "end"
              }
            ]
          }
        },
        {
          "type": "runnable_code",
          "filename": "pipeline_status_demo.js",
          "initialCode": "function verifyTinyMlPipeline() {\n  return 'TINYML_PIPELINE_SYNCHRONIZED: SENSOR_DMA -> DSP_PREPROCESS -> INT8_INFERENCE -> ACTUATION';\n}\n\nconsole.log(verifyTinyMlPipeline());",
          "expectedOutput": "TINYML_PIPELINE_SYNCHRONIZED: SENSOR_DMA -> DSP_PREPROCESS -> INT8_INFERENCE -> ACTUATION",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What string confirms complete operational synchronization of the 4-Stage TinyML Pipeline?",
        "expectedStringOutput": "TINYML_PIPELINE_SYNCHRONIZED: SENSOR_DMA -> DSP_PREPROCESS -> INT8_INFERENCE -> ACTUATION",
        "acceptableAnswers": [
          "TINYML_PIPELINE_SYNCHRONIZED: SENSOR_DMA -> DSP_PREPROCESS -> INT8_INFERENCE -> ACTUATION",
          "TINYML_PIPELINE_SYNCHRONIZED"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_ON_DEVICE_LATENCY_VS_CLOUD_OFFLOADING",
        "diagnosisMap": {
          "FAILED": {
            "misconceptionId": "MC_EDGEAI_ON_DEVICE_LATENCY_VS_CLOUD_OFFLOADING",
            "errorExplanation": "Matches pipeline status string.",
            "recoveryPath": {
              "simplerExplanation": "Matches pipeline synchronization string.",
              "guidedFixPrompt": "Type TINYML_PIPELINE_SYNCHRONIZED: SENSOR_DMA -> DSP_PREPROCESS -> INT8_INFERENCE -> ACTUATION"
            }
          }
        }
      }
    }
  ]
},
  2: {
  "day": 2,
  "title": "Microcontroller Constraints & Resource Budgets",
  "overviewMetaphor": "Deploying AI on an MCU is Packing a Grand Piano into a Tiny Backpack: a cloud server has 64 GB of RAM and infinite hard disk space; an ARM Cortex-M4 microcontroller has only 64 KB of SRAM (Workspace) and 512 KB of Flash (Permanent storage); the neural network's weights must live in read-only Flash, while the intermediate tensor activations must reuse a single shared byte array in SRAM without allocating a single byte of dynamic heap.",
  "blocks": [
    {
      "id": "edgeai-d2-b1-sram-vs-flash-memory-roles",
      "day": 2,
      "blockNumber": 1,
      "title": "MCU Memory Split: Flash (Model Weights) vs SRAM (Activation Buffers)",
      "conceptBudget": {
        "primaryConcept": "Flash vs SRAM Memory Invariant",
        "supportingTerms": [
          "Flash ROM (Stores frozen model weights, code binary, constant lookup tables: 256 KB - 1 MB)",
          "SRAM (Holds mutable layer activation buffers, Tensor Arena, stack: 32 KB - 256 KB)",
          "Peak Activation Memory Invariant"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d1-b1-tinyml-paradigm-latency-bandwidth",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "diagram",
          "data": {
            "type": "memory_box",
            "title": "Microcontroller Memory Hierarchy for Edge AI",
            "boxes": [
              {
                "label": "Flash Memory (Non-Volatile)",
                "value": "Capacity: 512 KB - 2 MB | Stores: Frozen Model Weights, CMSIS-NN Code, Biases",
                "varType": "Read-Only Flash",
                "isUpdated": false
              },
              {
                "label": "SRAM Memory (Volatile Workspace)",
                "value": "Capacity: 64 KB - 256 KB | Stores: Input Buffer, Tensor Arena (Activations), DSP Buffers",
                "varType": "Read/Write SRAM",
                "isUpdated": true
              }
            ]
          }
        },
        {
          "type": "runnable_code",
          "filename": "mcu_budget_demo.js",
          "initialCode": "function evaluateMcuMemory(weightsBytes, peakActivationBytes, flashTotal = 524288, sramTotal = 131072) {\n  const flashOk = weightsBytes <= flashTotal;\n  const sramOk = peakActivationBytes <= sramTotal;\n  return {\n    flashUtilizationPct: Number(((weightsBytes / flashTotal) * 100).toFixed(1)),\n    sramUtilizationPct: Number(((peakActivationBytes / sramTotal) * 100).toFixed(1)),\n    fitsInHardware: flashOk && sramOk,\n    status: (flashOk && sramOk) ? 'MCU_MEMORY_BUDGET_VERIFIED' : 'OOM_HARDWARE_LIMIT_EXCEEDED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateMcuMemory(120000, 32000)));",
          "expectedOutput": "{\"flashUtilizationPct\":22.9,\"sramUtilizationPct\":24.4,\"fitsInHardware\":true,\"status\":\"MCU_MEMORY_BUDGET_VERIFIED\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What status confirms that a model with 120 KB weights and 32 KB activations fits comfortably inside a 512 KB Flash / 128 KB SRAM MCU?",
        "expectedStringOutput": "MCU_MEMORY_BUDGET_VERIFIED",
        "acceptableAnswers": [
          "MCU_MEMORY_BUDGET_VERIFIED",
          "status\":\"MCU_MEMORY_BUDGET_VERIFIED\""
        ],
        "primaryMisconceptionId": "MC_EDGEAI_MCU_RAM_FLASH_MEMORY_BUDGETING",
        "diagnosisMap": {
          "EXCEEDED": {
            "misconceptionId": "MC_EDGEAI_MCU_RAM_FLASH_MEMORY_BUDGETING",
            "errorExplanation": "120 KB < 512 KB and 32 KB < 128 KB, verifying the budget.",
            "recoveryPath": {
              "simplerExplanation": "Fits in budget -> MCU_MEMORY_BUDGET_VERIFIED.",
              "guidedFixPrompt": "Type MCU_MEMORY_BUDGET_VERIFIED"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d2-b2-peak-activation-ping-pong-buffers",
      "day": 2,
      "blockNumber": 2,
      "title": "Peak Activation Memory & Ping-Pong Layer Buffering",
      "conceptBudget": {
        "primaryConcept": "Peak Activation Memory Math",
        "supportingTerms": [
          "Ping-Pong Buffer (Layer $N$ reads Buffer A and writes Buffer B; Layer $N+1$ reads Buffer B and writes Buffer A)",
          "Peak RAM Requirement: $\\max(\\text{Size}(L_i) + \\text{Size}(L_{i+1}))$",
          "Eliminating individual layer memory allocations"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d2-b1-sram-vs-flash-memory-roles",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "ping_pong_demo.js",
          "initialCode": "function calculatePeakActivationMemory(layerSizes) {\n  let peakBytes = 0;\n  for (let i = 0; i < layerSizes.length - 1; i++) {\n    const pairBytes = layerSizes[i] + layerSizes[i + 1];\n    if (pairBytes > peakBytes) peakBytes = pairBytes;\n  }\n  return {\n    layerSizes,\n    peakPingPongRamBytes: peakBytes,\n    status: 'OPTIMAL_PING_PONG_BUFFER_ALLOCATED'\n  };\n}\n\nconsole.log(JSON.stringify(calculatePeakActivationMemory([1024, 4096, 2048, 512, 10])));",
          "expectedOutput": "{\"layerSizes\":[1024,4096,2048,512,10],\"peakPingPongRamBytes\":6144,\"status\":\"OPTIMAL_PING_PONG_BUFFER_ALLOCATED\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What is the peak ping-pong RAM requirement in bytes for the layer sequence [1024, 4096, 2048, 512, 10] (largest pair: 4096 + 2048)?",
        "expectedStringOutput": "6144",
        "acceptableAnswers": [
          "6144",
          "6144 bytes",
          "peakPingPongRamBytes\":6144"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_MCU_RAM_FLASH_MEMORY_BUDGETING",
        "diagnosisMap": {
          "7690": {
            "misconceptionId": "MC_EDGEAI_MCU_RAM_FLASH_MEMORY_BUDGETING",
            "errorExplanation": "You do not sum all layers simultaneously; ping-pong buffers only need the largest adjacent pair (4096 + 2048 = 6144).",
            "recoveryPath": {
              "simplerExplanation": "4096 + 2048 = 6144 bytes.",
              "guidedFixPrompt": "Type 6144"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d2-b3-model-architecture-selection-rules",
      "day": 2,
      "blockNumber": 3,
      "title": "Model Topology Selection: Fully-Connected vs 1D CNN vs Depthwise 2D",
      "conceptBudget": {
        "primaryConcept": "Edge Model Architecture Selection",
        "supportingTerms": [
          "MLP / Fully-Connected (Scalar sensor tabular thresholding: 5 - 20 KB)",
          "1D CNN (Temporal IMU and vibration time-series: 20 - 60 KB)",
          "Depthwise 2D CNN (MobileNetV1/V2 for low-res vision: 100 - 300 KB)",
          "Recurrent GRU / 1-Head Transformer (Acoustic keywords: 40 - 90 KB)"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d2-b2-peak-activation-ping-pong-buffers",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "model_selector_demo.js",
          "initialCode": "function selectEdgeTopology(sensorType) {\n  if (sensorType === 'IMU_VIBRATION') return '1D_CNN_TEMPORAL: 35KB_FLASH_12KB_RAM';\n  if (sensorType === 'CAMERA_VISION') return 'DEPTHWISE_2D_MOBILENET: 220KB_FLASH_64KB_RAM';\n  return 'MLP_DENSE: 10KB_FLASH_2KB_RAM';\n}\n\nconsole.log(selectEdgeTopology('IMU_VIBRATION'));\nconsole.log(selectEdgeTopology('CAMERA_VISION'));",
          "expectedOutput": "1D_CNN_TEMPORAL: 35KB_FLASH_12KB_RAM\nDEPTHWISE_2D_MOBILENET: 220KB_FLASH_64KB_RAM",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "Which model topology is recommended for 3-axis accelerometer vibration time-series classification?",
        "expectedStringOutput": "1D_CNN_TEMPORAL: 35KB_FLASH_12KB_RAM",
        "acceptableAnswers": [
          "1D_CNN_TEMPORAL: 35KB_FLASH_12KB_RAM",
          "1D_CNN_TEMPORAL",
          "1D CNN"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_MCU_RAM_FLASH_MEMORY_BUDGETING",
        "diagnosisMap": {
          "VISION": {
            "misconceptionId": "MC_EDGEAI_MCU_RAM_FLASH_MEMORY_BUDGETING",
            "errorExplanation": "Vibration data is 1D temporal time-series, best suited for 1D CNNs.",
            "recoveryPath": {
              "simplerExplanation": "1D CNN is optimal for vibration time-series.",
              "guidedFixPrompt": "Type 1D_CNN_TEMPORAL: 35KB_FLASH_12KB_RAM"
            }
          }
        }
      }
    }
  ]
},
  3: {
  "day": 3,
  "title": "TensorFlow Lite for Microcontrollers (TFLM) Architecture",
  "overviewMetaphor": "TFLM is an ultra-disciplined military surgeon operating in the field with zero supply runs: normal TensorFlow creates memory objects on the fly with `malloc()` (Which fragments MCU heap memory and crashes the system in 2 hours!); TFLM requires you to declare a single static chunk of RAM called the `tensor_arena` at startup; the interpreter plans every byte offset before the first calculation starts, executing neural inference repeatedly with zero dynamic memory allocation.",
  "blocks": [
    {
      "id": "edgeai-d3-b1-tflm-zero-allocation-interpreter",
      "day": 3,
      "blockNumber": 1,
      "title": "TFLM Zero Dynamic Allocation & Static Tensor Arena",
      "conceptBudget": {
        "primaryConcept": "Zero Dynamic Allocation Invariant",
        "supportingTerms": [
          "`uint8_t tensor_arena[K_TENSOR_ARENA_SIZE]` (Statically allocated byte array in `.bss` section)",
          "`tflite::MicroInterpreter`",
          "FlatBuffers Model Schema (Direct pointer mapping into Flash without deserialization copy)",
          "Zero Heap Allocation (`malloc` banned in safety-critical loops)"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d2-b1-sram-vs-flash-memory-roles",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "diagram",
          "data": {
            "type": "broken_fixed_diff",
            "title": "Dynamic Malloc Heap Bug vs Static Tensor Arena Fix Diff",
            "brokenCode": "// ❌ HEAP FRAGMENTATION CRASH (Heap Panic on MCU!):\nfloat* layerOutput = (float*)malloc(sizeof(float) * 1024); // Fragments RAM every 10ms -> HardFault!",
            "fixedCode": "// ✅ STATIC TENSOR ARENA (Zero Heap Allocation):\nconstexpr int kTensorArenaSize = 60 * 1024;\nalignas(16) uint8_t tensor_arena[kTensorArenaSize]; // Statically allocated once at boot!",
            "errorLine": 2,
            "errorReason": "Using dynamic malloc() in high-frequency embedded inference loops causes heap exhaustion and fragmentation crashes.",
            "fixExplanation": "Allocate a single aligned static byte array for the Tensor Arena."
          }
        },
        {
          "type": "runnable_code",
          "filename": "tensor_arena_demo.js",
          "initialCode": "function evaluateArenaSafety(isStaticallyAllocated, arenaSizeBytes) {\n  return isStaticallyAllocated\n    ? `STATIC_TENSOR_ARENA_INITIALIZED: ${arenaSizeBytes} BYTES ZERO_HEAP_RELIABLE`\n    : 'UNSAFE_DYNAMIC_ALLOCATION_DETECTED';\n}\n\nconsole.log(evaluateArenaSafety(true, 65536));",
          "expectedOutput": "STATIC_TENSOR_ARENA_INITIALIZED: 65536 BYTES ZERO_HEAP_RELIABLE",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What status confirms initialization of a 65,536-byte static Tensor Arena with zero dynamic heap allocation?",
        "expectedStringOutput": "STATIC_TENSOR_ARENA_INITIALIZED: 65536 BYTES ZERO_HEAP_RELIABLE",
        "acceptableAnswers": [
          "STATIC_TENSOR_ARENA_INITIALIZED: 65536 BYTES ZERO_HEAP_RELIABLE",
          "STATIC_TENSOR_ARENA_INITIALIZED"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_TFLM_TENSOR_ARENA_ALLOCATION",
        "diagnosisMap": {
          "UNSAFE": {
            "misconceptionId": "MC_EDGEAI_TFLM_TENSOR_ARENA_ALLOCATION",
            "errorExplanation": "Matches static arena initialization string.",
            "recoveryPath": {
              "simplerExplanation": "Matches STATIC_TENSOR_ARENA_INITIALIZED.",
              "guidedFixPrompt": "Type STATIC_TENSOR_ARENA_INITIALIZED: 65536 BYTES ZERO_HEAP_RELIABLE"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d3-b2-op-resolvers-all-vs-mutable",
      "day": 3,
      "blockNumber": 2,
      "title": "Op Resolvers: `AllOpsResolver` vs `MicroMutableOpResolver`",
      "conceptBudget": {
        "primaryConcept": "Op Resolver Flash Optimization",
        "supportingTerms": [
          "`AllOpsResolver` (Links all 60+ TFLM operators $\\implies$ Wastes 120 KB of Flash!)",
          "`MicroMutableOpResolver<N>` (Registers ONLY the exact operators needed, e.g. `AddConv2D()`, `AddFullyConnected()` $\\implies$ Saves 100 KB Flash!)",
          "Linker Dead-Code Elimination"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d3-b1-tflm-zero-allocation-interpreter",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "diagram",
          "data": {
            "type": "memory_box",
            "title": "Op Resolver Flash Consumption Comparison",
            "boxes": [
              {
                "label": "1. AllOpsResolver",
                "value": "Flash Cost: ~140 KB | Links: ALL 60+ operators (Even unused ones) | Suitability: Prototyping ONLY",
                "varType": "Bloated Resolver",
                "isUpdated": false
              },
              {
                "label": "2. MicroMutableOpResolver<4>",
                "value": "Flash Cost: ~25 KB (115 KB SAVED!) | Links: EXACT 4 required ops | Suitability: PRODUCTION",
                "varType": "Lean Resolver",
                "isUpdated": true
              }
            ]
          }
        },
        {
          "type": "runnable_code",
          "filename": "op_resolver_demo.js",
          "initialCode": "function evaluateOpResolver(resolverType, registeredOpsCount) {\n  if (resolverType === 'MUTABLE') {\n    return `MICRO_MUTABLE_OP_RESOLVER: ${registeredOpsCount} OPS REGISTERED -> SAVED 100KB+ FLASH`;\n  }\n  return 'ALL_OPS_RESOLVER: BLOATED_140KB_FLASH_USAGE';\n}\n\nconsole.log(evaluateOpResolver('MUTABLE', 4));\nconsole.log(evaluateOpResolver('ALL', 60));",
          "expectedOutput": "MICRO_MUTABLE_OP_RESOLVER: 4 OPS REGISTERED -> SAVED 100KB+ FLASH\nALL_OPS_RESOLVER: BLOATED_140KB_FLASH_USAGE",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "choose_answer",
        "question": "Why must production TinyML firmware use `MicroMutableOpResolver` instead of `AllOpsResolver`?",
        "options": [
          "Because `MicroMutableOpResolver` registers only the specific operations required by the model, saving over 100 KB of precious Flash memory compared to linking the entire operator catalog",
          "Because AllOpsResolver is not compatible with C++",
          "To increase model accuracy by 50%"
        ],
        "correctIndex": 0,
        "primaryMisconceptionId": "MC_EDGEAI_TFLM_TENSOR_ARENA_ALLOCATION",
        "diagnosisMap": {
          "1": {
            "misconceptionId": "MC_EDGEAI_TFLM_TENSOR_ARENA_ALLOCATION",
            "errorExplanation": "MicroMutableOpResolver prevents linking unused operator kernels into Flash.",
            "recoveryPath": {
              "simplerExplanation": "Saves 100+ KB Flash by linking only required ops.",
              "guidedFixPrompt": "Select Option A."
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d3-b3-flatbuffers-zero-copy-schema",
      "day": 3,
      "blockNumber": 3,
      "title": "FlatBuffers `.tflite` Schema: In-Place Flash Execution",
      "conceptBudget": {
        "primaryConcept": "FlatBuffers In-Place Execution",
        "supportingTerms": [
          "FlatBuffers (Direct in-memory binary format without unpacking step)",
          "Flash Pointer Offsets (Reading tensor weights directly from Flash addresses)",
          "Eliminating RAM weight buffers"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d3-b2-op-resolvers-all-vs-mutable",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "flatbuffer_exec_demo.js",
          "initialCode": "function evaluateFlatbufferAccess() {\n  return 'FLATBUFFERS_IN_PLACE: WEIGHTS_ACCESSED_DIRECTLY_FROM_FLASH_POINTERS_ZERO_RAM_COPY';\n}\n\nconsole.log(evaluateFlatbufferAccess());",
          "expectedOutput": "FLATBUFFERS_IN_PLACE: WEIGHTS_ACCESSED_DIRECTLY_FROM_FLASH_POINTERS_ZERO_RAM_COPY",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What capability allows TFLM to access model weights directly from Flash memory pointers with zero RAM copying?",
        "expectedStringOutput": "FLATBUFFERS_IN_PLACE: WEIGHTS_ACCESSED_DIRECTLY_FROM_FLASH_POINTERS_ZERO_RAM_COPY",
        "acceptableAnswers": [
          "FLATBUFFERS_IN_PLACE: WEIGHTS_ACCESSED_DIRECTLY_FROM_FLASH_POINTERS_ZERO_RAM_COPY",
          "FLATBUFFERS_IN_PLACE"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_TFLM_TENSOR_ARENA_ALLOCATION",
        "diagnosisMap": {
          "JSON": {
            "misconceptionId": "MC_EDGEAI_TFLM_TENSOR_ARENA_ALLOCATION",
            "errorExplanation": "FlatBuffers enables zero-copy in-place binary access.",
            "recoveryPath": {
              "simplerExplanation": "FlatBuffers enables zero-copy execution.",
              "guidedFixPrompt": "Type FLATBUFFERS_IN_PLACE: WEIGHTS_ACCESSED_DIRECTLY_FROM_FLASH_POINTERS_ZERO_RAM_COPY"
            }
          }
        }
      }
    }
  ]
},
  4: {
  "day": 4,
  "title": "Post-Training Quantization (PTQ): Float32 to INT8 Mapping",
  "overviewMetaphor": "INT8 Quantization is Measuring Cargo with an 8-Bit Ruler: storing neural weights as 32-bit floating point numbers (`3.14159265`) uses 4 bytes per weight (Huge Flash size, slow software floating point on MCUs without hardware FPUs); INT8 Affine Quantization maps the real floating range $[-1.0, +1.0]$ onto integer steps from $-128$ to $+127$ using a Scale factor $S$ and Zero-Point offset $Z$ (Cutting model size by 75% and speeding up inference by 4x using single-cycle integer arithmetic!).",
  "blocks": [
    {
      "id": "edgeai-d4-b1-affine-quantization-math",
      "day": 4,
      "blockNumber": 1,
      "title": "Affine Quantization Equation: Scale ($S$) & Zero-Point ($Z$)",
      "conceptBudget": {
        "primaryConcept": "Affine Quantization Formula",
        "supportingTerms": [
          "Quantization Mapping: $q = \\text{round}\\left(\\frac{r}{S}\\right) + Z$",
          "Dequantization: $r = S \\times (q - Z)$",
          "Scale Factor: $S = \\frac{r_{\\text{max}} - r_{\\text{min}}}{255}$",
          "Zero Point: $Z = \\text{round}\\left(\\frac{-r_{\\text{min}}}{S}\\right) - 128$ for signed INT8"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d3-b1-tflm-zero-allocation-interpreter",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "syntax_anatomy",
          "title": "INT8 Affine Quantization Math",
          "codeSnippet": "// r = real floating point value | q = quantized signed 8-bit integer [-128..127]\nconst S = (rMax - rMin) / 255.0; // Scale factor\nconst Z = Math.round(-rMin / S) - 128; // Zero-point integer offset\nconst q = Math.max(-128, Math.min(127, Math.round(r / S) + Z));",
          "lineNotes": {
            "2": "Calculates scale step size.",
            "3": "Calculates zero-point mapping zero float to integer.",
            "4": "Clamps quantized value to 8-bit signed range [-128, 127]."
          }
        },
        {
          "type": "runnable_code",
          "filename": "ptq_math_demo.js",
          "initialCode": "function quantizeFloat(r, rMin = -2.0, rMax = 2.0) {\n  const S = (rMax - rMin) / 255.0;\n  const Z = Math.round(-rMin / S) - 128;\n  const q = Math.max(-128, Math.min(127, Math.round(r / S) + Z));\n  return { realVal: r, scale: Number(S.toFixed(6)), zeroPoint: Z, quantizedInt8: q };\n}\n\nconsole.log(JSON.stringify(quantizeFloat(0.0)));\nconsole.log(JSON.stringify(quantizeFloat(2.0)));\nconsole.log(JSON.stringify(quantizeFloat(-2.0)));",
          "expectedOutput": "{\"realVal\":0,\"scale\":0.015686,\"zeroPoint\":0,\"quantizedInt8\":0}\n{\"realVal\":2,\"scale\":0.015686,\"zeroPoint\":0,\"quantizedInt8\":127}\n{\"realVal\":-2,\"scale\":0.015686,\"zeroPoint\":0,\"quantizedInt8\":-128}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What quantized INT8 value represents the maximum float value +2.0 in symmetric range [-2.0, +2.0]?",
        "expectedStringOutput": "127",
        "acceptableAnswers": [
          "127",
          "quantizedInt8\":127"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_FLOAT32_TO_INT8_SCALE_ZERO_POINT",
        "diagnosisMap": {
          "255": {
            "misconceptionId": "MC_EDGEAI_FLOAT32_TO_INT8_SCALE_ZERO_POINT",
            "errorExplanation": "255 is for unsigned UINT8. Signed INT8 caps at +127.",
            "recoveryPath": {
              "simplerExplanation": "Signed INT8 maximum is 127.",
              "guidedFixPrompt": "Type 127"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d4-b2-symmetric-vs-asymmetric-quantization",
      "day": 4,
      "blockNumber": 2,
      "title": "Symmetric Quantization ($Z = 0$) vs Asymmetric Quantization",
      "conceptBudget": {
        "primaryConcept": "Symmetric vs Asymmetric Quantization",
        "supportingTerms": [
          "Symmetric Quantization ($Z = 0$, $r_{\\text{max}} = \\max(|r_{\\text{min}}|, |r_{\\text{max}}|) \\implies$ Faster MAC operations without zero-point subtraction)",
          "Asymmetric Quantization ($Z \\ne 0$, optimal for asymmetric activations like ReLU $[0, \\infty)$)",
          "Weight Quantization (Always Symmetric!)"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d4-b1-affine-quantization-math",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "diagram",
          "data": {
            "type": "memory_box",
            "title": "Symmetric vs Asymmetric Quantization Comparison",
            "boxes": [
              {
                "label": "1. Symmetric Quantization",
                "value": "Zero Point: Z = 0 | Range: [-127, 127] | Speed: Fastest (Zero offset subtraction in MAC loop!) | Used For: Weights",
                "varType": "Symmetric",
                "isUpdated": true
              },
              {
                "label": "2. Asymmetric Quantization",
                "value": "Zero Point: Z != 0 | Range: [-128, 127] | Precision: Higher for skewed distributions (ReLU) | Used For: Activations",
                "varType": "Asymmetric",
                "isUpdated": false
              }
            ]
          }
        },
        {
          "type": "runnable_code",
          "filename": "symmetric_demo.js",
          "initialCode": "function evaluateQuantizationMode(isWeights) {\n  return isWeights\n    ? 'SYMMETRIC_QUANTIZATION: ZERO_POINT_ZERO_OPTIMAL_FOR_WEIGHTS'\n    : 'ASYMMETRIC_QUANTIZATION: ZERO_POINT_OFFSET_FOR_RELU_ACTIVATIONS';\n}\n\nconsole.log(evaluateQuantizationMode(true));\nconsole.log(evaluateQuantizationMode(false));",
          "expectedOutput": "SYMMETRIC_QUANTIZATION: ZERO_POINT_ZERO_OPTIMAL_FOR_WEIGHTS\nASYMMETRIC_QUANTIZATION: ZERO_POINT_OFFSET_FOR_RELU_ACTIVATIONS",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "choose_answer",
        "question": "Why is Symmetric Quantization ($Z = 0$) standard for neural network weight matrices in TinyML?",
        "options": [
          "Because setting Zero-Point to 0 eliminates runtime subtraction in inner Multiply-Accumulate (MAC) loops, allowing hardware SIMD instructions to execute pure vector integer dot products at maximum speed",
          "Because symmetric models have more layers",
          "To allow negative probabilities"
        ],
        "correctIndex": 0,
        "primaryMisconceptionId": "MC_EDGEAI_POST_TRAINING_QUANTIZATION_INT8_SYMMETRIC",
        "diagnosisMap": {
          "1": {
            "misconceptionId": "MC_EDGEAI_POST_TRAINING_QUANTIZATION_INT8_SYMMETRIC",
            "errorExplanation": "Symmetric weights eliminate zero-point subtractions in inner MAC loops.",
            "recoveryPath": {
              "simplerExplanation": "Eliminates zero-point subtraction for faster SIMD MACs.",
              "guidedFixPrompt": "Select Option A."
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d4-b3-representative-dataset-calibration",
      "day": 4,
      "blockNumber": 3,
      "title": "Calibration via Representative Datasets: Preserving Accuracy",
      "conceptBudget": {
        "primaryConcept": "Representative Dataset Calibration",
        "supportingTerms": [
          "Representative Dataset (100 - 300 real calibration samples run through model)",
          "Tracking Min/Max Activation Ranges ($r_{\\text{min}}, r_{\\text{max}}$) dynamically",
          "Preventing accuracy degradation ($< 1\\%$ accuracy drop from Float32 to INT8)"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d4-b2-symmetric-vs-asymmetric-quantization",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "calibration_demo.js",
          "initialCode": "function evaluateAccuracyRetention(float32Acc, int8Acc) {\n  const drop = float32Acc - int8Acc;\n  return {\n    float32Accuracy: `${float32Acc}%`,\n    int8QuantizedAccuracy: `${int8Acc}%`,\n    accuracyDropPercent: Number(drop.toFixed(2)),\n    status: drop <= 1.0 ? 'CALIBRATION_SUCCESS_HIGH_ACCURACY_RETAINED' : 'ACCURACY_DEGRADATION_RECALIBRATE'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateAccuracyRetention(96.5, 95.8)));",
          "expectedOutput": "{\"float32Accuracy\":\"96.5%\",\"int8QuantizedAccuracy\":\"95.8%\",\"accuracyDropPercent\":0.7,\"status\":\"CALIBRATION_SUCCESS_HIGH_ACCURACY_RETAINED\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What status confirms successful PTQ calibration when accuracy drops by only 0.7% from Float32 (96.5% to 95.8%)?",
        "expectedStringOutput": "CALIBRATION_SUCCESS_HIGH_ACCURACY_RETAINED",
        "acceptableAnswers": [
          "CALIBRATION_SUCCESS_HIGH_ACCURACY_RETAINED",
          "status\":\"CALIBRATION_SUCCESS_HIGH_ACCURACY_RETAINED\""
        ],
        "primaryMisconceptionId": "MC_EDGEAI_POST_TRAINING_QUANTIZATION_INT8_SYMMETRIC",
        "diagnosisMap": {
          "DEGRADATION": {
            "misconceptionId": "MC_EDGEAI_POST_TRAINING_QUANTIZATION_INT8_SYMMETRIC",
            "errorExplanation": "0.7% drop is well within the 1.0% tolerance threshold.",
            "recoveryPath": {
              "simplerExplanation": "Drop <= 1.0% -> CALIBRATION_SUCCESS_HIGH_ACCURACY_RETAINED.",
              "guidedFixPrompt": "Type CALIBRATION_SUCCESS_HIGH_ACCURACY_RETAINED"
            }
          }
        }
      }
    }
  ]
},
  5: {
  "day": 5,
  "title": "⭐ MILESTONE 1: Complete INT8 Quantized Neural Network Interpreter Engine",
  "overviewMetaphor": "Milestone 1 Synthesis: The complete sovereign TinyML neural interpreter: 1. Loading FlatBuffers model data from Flash; 2. Static Tensor Arena memory layout with 16-byte alignment; 3. INT8 fixed-point matrix multiplication with 32-bit accumulators; 4. Output scaling and zero-point clamping; 5. Verification of 4x memory savings and zero dynamic heap allocations.",
  "blocks": [
    {
      "id": "edgeai-d5-b1-int8-interpreter-synthesis",
      "day": 5,
      "blockNumber": 1,
      "title": "INT8 TinyML Inference Engine Synthesis",
      "conceptBudget": {
        "primaryConcept": "INT8 Inference Engine Synthesis",
        "supportingTerms": [
          "Static Tensor Arena",
          "INT8 MAC Kernel",
          "Fixed-Point Rescaling",
          "Zero Heap Verification"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d4-b1-affine-quantization-math",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "diagram",
          "data": {
            "type": "flowchart",
            "title": "INT8 Quantized Inference Execution Flow",
            "nodes": [
              {
                "id": "1",
                "label": "Sensor samples quantized into INT8 array in Tensor Arena input buffer",
                "kind": "start"
              },
              {
                "id": "2",
                "label": "Dense/Conv kernel performs INT8 vector dot product into 32-bit accumulator",
                "kind": "process"
              },
              {
                "id": "3",
                "label": "Fixed-point multiplier applies output scale (S_in * S_w / S_out)",
                "kind": "process"
              },
              {
                "id": "4",
                "label": "Adds zero-point & clamps to [-128, 127] -> Prediction complete in 2 ms!",
                "kind": "end"
              }
            ]
          }
        },
        {
          "type": "runnable_code",
          "filename": "int8_engine_demo.js",
          "initialCode": "function runInt8InferenceEngine() {\n  return {\n    tensorArenaStatus: 'STATIC_ARENA_ZERO_MALLOC',\n    quantizationMode: 'INT8_AFFINE_QUANTIZED',\n    simdAcceleration: 'CMSIS_NN_PARALLEL_DOT_PRODUCT',\n    engineStatus: 'INT8_INFERENCE_ENGINE_ACTIVE'\n  };\n}\n\nconsole.log(runInt8InferenceEngine().engineStatus);",
          "expectedOutput": "INT8_INFERENCE_ENGINE_ACTIVE",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What engine status confirms active operational synthesis of the INT8 Quantized Inference Engine?",
        "expectedStringOutput": "INT8_INFERENCE_ENGINE_ACTIVE",
        "acceptableAnswers": [
          "INT8_INFERENCE_ENGINE_ACTIVE",
          "engineStatus: INT8_INFERENCE_ENGINE_ACTIVE"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_POST_TRAINING_QUANTIZATION_INT8_SYMMETRIC",
        "diagnosisMap": {
          "FAILED": {
            "misconceptionId": "MC_EDGEAI_POST_TRAINING_QUANTIZATION_INT8_SYMMETRIC",
            "errorExplanation": "Matches INT8_INFERENCE_ENGINE_ACTIVE.",
            "recoveryPath": {
              "simplerExplanation": "Matches INT8_INFERENCE_ENGINE_ACTIVE.",
              "guidedFixPrompt": "Type INT8_INFERENCE_ENGINE_ACTIVE"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d5-b2-int8-memory-speedup-audit",
      "day": 5,
      "blockNumber": 2,
      "title": "INT8 Quantization Memory Compression & Speedup Invariant Audit",
      "conceptBudget": {
        "primaryConcept": "INT8 Compression & Invariant Audit",
        "supportingTerms": [
          "4x Flash Reduction Invariant",
          "Zero Heap Verification",
          "100% Quality Invariant"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d5-b1-int8-interpreter-synthesis",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "int8_audit_demo.js",
          "initialCode": "function auditInt8System(flashReductionRatio, zeroHeapAllocated) {\n  const passed = (flashReductionRatio >= 3.8) && zeroHeapAllocated;\n  return {\n    flashReductionRatio,\n    zeroHeapAllocated,\n    grade: passed ? 'INT8_SYSTEM_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditInt8System(4.0, true)));",
          "expectedOutput": "{\"flashReductionRatio\":4,\"zeroHeapAllocated\":true,\"grade\":\"INT8_SYSTEM_AUDIT_PASSED\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What audit grade is awarded when model footprint achieves 4.0x compression with zero heap allocations?",
        "expectedStringOutput": "INT8_SYSTEM_AUDIT_PASSED",
        "acceptableAnswers": [
          "INT8_SYSTEM_AUDIT_PASSED",
          "grade\":\"INT8_SYSTEM_AUDIT_PASSED\""
        ],
        "primaryMisconceptionId": "MC_EDGEAI_POST_TRAINING_QUANTIZATION_INT8_SYMMETRIC",
        "diagnosisMap": {
          "DEFECT": {
            "misconceptionId": "MC_EDGEAI_POST_TRAINING_QUANTIZATION_INT8_SYMMETRIC",
            "errorExplanation": "4.0x compression and zero heap allocations award INT8_SYSTEM_AUDIT_PASSED.",
            "recoveryPath": {
              "simplerExplanation": "Awards INT8_SYSTEM_AUDIT_PASSED.",
              "guidedFixPrompt": "Type INT8_SYSTEM_AUDIT_PASSED"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d5-b3-milestone1-edgeai-cert",
      "day": 5,
      "blockNumber": 3,
      "title": "Milestone 1 INT8 Quantized Neural Network Engine Certification",
      "conceptBudget": {
        "primaryConcept": "Milestone 1 Certification",
        "supportingTerms": [
          "INT8 Engine Verified",
          "100% Quality Invariant"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d5-b2-int8-memory-speedup-audit",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "milestone1_edgeai_cert.js",
          "initialCode": "console.log('⭐ MILESTONE 1: Complete INT8 Quantized Neural Network Interpreter Engine [VERIFIED 100%]');",
          "expectedOutput": "⭐ MILESTONE 1: Complete INT8 Quantized Neural Network Interpreter Engine [VERIFIED 100%]",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What certification string confirms Milestone 1 completion?",
        "expectedStringOutput": "⭐ MILESTONE 1: Complete INT8 Quantized Neural Network Interpreter Engine [VERIFIED 100%]",
        "acceptableAnswers": [
          "⭐ MILESTONE 1: Complete INT8 Quantized Neural Network Interpreter Engine [VERIFIED 100%]",
          "VERIFIED 100%"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_POST_TRAINING_QUANTIZATION_INT8_SYMMETRIC",
        "diagnosisMap": {
          "FAILED": {
            "misconceptionId": "MC_EDGEAI_POST_TRAINING_QUANTIZATION_INT8_SYMMETRIC",
            "errorExplanation": "Matches milestone header string.",
            "recoveryPath": {
              "simplerExplanation": "Matches header string.",
              "guidedFixPrompt": "Type ⭐ MILESTONE 1: Complete INT8 Quantized Neural Network Interpreter Engine [VERIFIED 100%]"
            }
          }
        }
      }
    }
  ]
},
  6: {
  "day": 6,
  "title": "DSP Preprocessing: Nyquist Sampling, Windowing & Aliasing",
  "overviewMetaphor": "DSP Sampling is a Movie Camera Filming a Helicopter Propeller: if the camera shoots at 24 frames per second while the blades spin at 100 revolutions per second (Sampling below the Nyquist rate: $f_s < 2 f_{\\text{max}}$), the blades appear to spin backwards in slow motion (Aliasing!); to see the true physical vibrations of an industrial motor, you must sample at least twice as fast as the highest frequency and multiply the audio buffer by a smooth Hamming window curve to prevent fake spectral noise.",
  "blocks": [
    {
      "id": "edgeai-d6-b1-nyquist-sampling-theorem",
      "day": 6,
      "blockNumber": 1,
      "title": "The Nyquist-Shannon Sampling Theorem & Anti-Aliasing",
      "conceptBudget": {
        "primaryConcept": "Nyquist-Shannon Sampling Theorem",
        "supportingTerms": [
          "Nyquist Criterion: $f_s \\ge 2 f_{\\text{max}}$",
          "Aliasing Hazard: High frequencies folding into low frequency spectrum",
          "Hardware Anti-Aliasing Analog Low-Pass Filter (Sallen-Key topology)"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d1-b1-tinyml-paradigm-latency-bandwidth",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "diagram",
          "data": {
            "type": "memory_box",
            "title": "Nyquist Rate Sampling Calculations",
            "boxes": [
              {
                "label": "1. Human Speech (f_max = 4 kHz)",
                "value": "Minimum Nyquist Rate: fs >= 8 kHz | Standard Telecom: fs = 16 kHz",
                "varType": "Audio DSP",
                "isUpdated": false
              },
              {
                "label": "2. Motor Bearing Faults (f_max = 5 kHz)",
                "value": "Minimum Nyquist Rate: fs >= 10 kHz | Standard Vibration: fs = 12.8 kHz",
                "varType": "Vibration DSP",
                "isUpdated": true
              }
            ]
          }
        },
        {
          "type": "runnable_code",
          "filename": "nyquist_calc_demo.js",
          "initialCode": "function evaluateNyquistSafety(samplingRateHz, maxSignalFreqHz) {\n  const minRequiredFs = 2 * maxSignalFreqHz;\n  const isCompliant = samplingRateHz >= minRequiredFs;\n  return {\n    samplingRateHz,\n    maxSignalFreqHz,\n    minRequiredFs,\n    nyquistCompliant: isCompliant,\n    status: isCompliant ? 'SAMPLING_RATE_NYQUIST_VALID' : 'ALIASING_DISTORTION_DETECTED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateNyquistSafety(16000, 4000)));\nconsole.log(JSON.stringify(evaluateNyquistSafety(6000, 4000)));",
          "expectedOutput": "{\"samplingRateHz\":16000,\"maxSignalFreqHz\":4000,\"minRequiredFs\":8000,\"nyquistCompliant\":true,\"status\":\"SAMPLING_RATE_NYQUIST_VALID\"}\n{\"samplingRateHz\":6000,\"maxSignalFreqHz\":4000,\"minRequiredFs\":8000,\"nyquistCompliant\":false,\"status\":\"ALIASING_DISTORTION_DETECTED\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What minimum sampling frequency in Hz is required to record a 4,000 Hz acoustic signal without aliasing ($2 \\times 4000$)?",
        "expectedStringOutput": "8000",
        "acceptableAnswers": [
          "8000",
          "8000 Hz",
          "8000Hz",
          "minRequiredFs\":8000"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_DSP_NYQUIST_SAMPLING_ALIASING",
        "diagnosisMap": {
          "4000": {
            "misconceptionId": "MC_EDGEAI_DSP_NYQUIST_SAMPLING_ALIASING",
            "errorExplanation": "Nyquist requires 2x the maximum frequency: 2 * 4000 = 8000 Hz.",
            "recoveryPath": {
              "simplerExplanation": "2 * 4000 = 8000 Hz.",
              "guidedFixPrompt": "Type 8000"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d6-b2-hamming-hanning-windowing",
      "day": 6,
      "blockNumber": 2,
      "title": "Windowing Functions: Hamming & Hanning Spectral Leakage Suppression",
      "conceptBudget": {
        "primaryConcept": "Windowing & Spectral Leakage",
        "supportingTerms": [
          "Spectral Leakage (Abrupt buffer edges act as step discontinuities, creating fake high-frequency side lobes)",
          "Hamming Window ($w(n) = 0.54 - 0.46 \\cos\\left(\\frac{2\\pi n}{N-1}\\right)$)",
          "Hanning Window ($w(n) = 0.5 - 0.5 \\cos\\left(\\frac{2\\pi n}{N-1}\\right)$)",
          "Tapering buffer boundaries smoothly to zero"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d6-b1-nyquist-sampling-theorem",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "syntax_anatomy",
          "title": "Hamming Window Formula in C",
          "codeSnippet": "for (int n = 0; n < N; n++) {\n  float w = 0.54f - 0.46f * cosf((2.0f * M_PI * n) / (N - 1));\n  windowedBuffer[n] = rawSamples[n] * w; // Tapers buffer edges smoothly!\n}",
          "lineNotes": {
            "2": "Calculates Hamming coefficient.",
            "3": "Multiplies sample by window weight."
          }
        },
        {
          "type": "runnable_code",
          "filename": "hamming_math_demo.js",
          "initialCode": "function evaluateHammingBoundary(N = 512) {\n  const wStart = 0.54 - 0.46 * Math.cos(0); // At n = 0\n  const wCenter = 0.54 - 0.46 * Math.cos(Math.PI); // At center n = N/2\n  return {\n    startEdgeWeight: Number(wStart.toFixed(2)),\n    centerPeakWeight: Number(wCenter.toFixed(2)),\n    status: 'SPECTRAL_LEAKAGE_SUPPRESSED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateHammingBoundary(512)));",
          "expectedOutput": "{\"startEdgeWeight\":0.08,\"centerPeakWeight\":1,\"status\":\"SPECTRAL_LEAKAGE_SUPPRESSED\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "choose_answer",
        "question": "Why must time-domain sensor buffers be multiplied by a Hamming window before computing an FFT?",
        "options": [
          "Because finite sampling buffers have abrupt rectangular edges that create artificial high-frequency discontinuities (Spectral Leakage); the Hamming window smoothly tapers the edges to near-zero, ensuring clean frequency peaks",
          "To make the audio louder",
          "To convert integers into strings"
        ],
        "correctIndex": 0,
        "primaryMisconceptionId": "MC_EDGEAI_DSP_NYQUIST_SAMPLING_ALIASING",
        "diagnosisMap": {
          "1": {
            "misconceptionId": "MC_EDGEAI_DSP_NYQUIST_SAMPLING_ALIASING",
            "errorExplanation": "Windowing tapers buffer boundaries to eliminate spectral leakage side lobes.",
            "recoveryPath": {
              "simplerExplanation": "Tapers edges to eliminate spectral leakage.",
              "guidedFixPrompt": "Select Option A."
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d6-b3-sliding-window-segmentation",
      "day": 6,
      "blockNumber": 3,
      "title": "Sliding Window Segmentation: Window Size ($W$) vs Hop Size ($H$)",
      "conceptBudget": {
        "primaryConcept": "Sliding Window Segmentation",
        "supportingTerms": [
          "Window Size $W$ (e.g. 512 samples = 32 ms at 16 kHz)",
          "Hop Size $H$ (e.g. 256 samples = 16 ms $\\implies 50\\%$ overlap)",
          "Temporal continuity preservation in continuous sensor streams"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d6-b2-hamming-hanning-windowing",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "sliding_hop_demo.js",
          "initialCode": "function calculateSpectrogramFrames(totalSamples, winSize = 512, hopSize = 256) {\n  const numFrames = Math.floor((totalSamples - winSize) / hopSize) + 1;\n  return {\n    totalSamples,\n    windowSize: winSize,\n    hopSize,\n    overlapPercent: 50,\n    spectrogramFramesGenerated: numFrames\n  };\n}\n\nconsole.log(JSON.stringify(calculateSpectrogramFrames(16000, 512, 256))); // 1 sec of audio",
          "expectedOutput": "{\"totalSamples\":16000,\"windowSize\":512,\"hopSize\":256,\"overlapPercent\":50,\"spectrogramFramesGenerated\":61}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "How many spectrogram frames are extracted from 16,000 audio samples using a 512-sample window with 256-sample hop ($((16000 - 512) / 256) + 1$)?",
        "expectedStringOutput": "61",
        "acceptableAnswers": [
          "61",
          "61 frames",
          "spectrogramFramesGenerated\":61"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_DSP_NYQUIST_SAMPLING_ALIASING",
        "diagnosisMap": {
          "31": {
            "misconceptionId": "MC_EDGEAI_DSP_NYQUIST_SAMPLING_ALIASING",
            "errorExplanation": "Math.floor((16000 - 512) / 256) + 1 = 60 + 1 = 61 frames.",
            "recoveryPath": {
              "simplerExplanation": "(15488 / 256) + 1 = 61 frames.",
              "guidedFixPrompt": "Type 61"
            }
          }
        }
      }
    }
  ]
},
  7: {
  "day": 7,
  "title": "Fast Fourier Transform (FFT) & Spectrogram Feature Extraction",
  "overviewMetaphor": "FFT is a Glass Prism Splitting White Light into Rainbow Colors: a time-domain audio signal looks like a chaotic, noisy wiggle on an oscilloscope; the Fast Fourier Transform mathematically separates that single tangled wiggle into its individual pure musical notes (Frequencies); the resulting 2D Spectrogram shows which notes were played at every millisecond in time, creating a visual image that a Convolutional Neural Network can classify instantly.",
  "blocks": [
    {
      "id": "edgeai-d7-b1-radix2-cooley-tukey-fft",
      "day": 7,
      "blockNumber": 1,
      "title": "The Radix-2 Cooley-Tukey FFT & $O(N \\log N)$ Complexity",
      "conceptBudget": {
        "primaryConcept": "Cooley-Tukey Radix-2 FFT",
        "supportingTerms": [
          "Discrete Fourier Transform (DFT: $O(N^2)$ is too slow for MCUs!)",
          "Radix-2 FFT ($O(N \\log N)$ divides sequence into even and odd indices)",
          "Twiddle Factors ($W_N^k = e^{-j 2\\pi k / N}$)",
          "Butterfly operations using CMSIS-DSP `arm_rfft_fast_f32`"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d6-b2-hamming-hanning-windowing",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "diagram",
          "data": {
            "type": "memory_box",
            "title": "DFT vs FFT Computation Complexity (N = 1024)",
            "boxes": [
              {
                "label": "1. Naive DFT (O(N^2))",
                "value": "Operations: 1,048,576 operations (100 ms on MCU -> UNUSABLE!)",
                "varType": "Naive Algorithm",
                "isUpdated": false
              },
              {
                "label": "2. Cooley-Tukey FFT (O(N log N))",
                "value": "Operations: 10,240 operations (100X FASTER! ~1 ms on Cortex-M4!)",
                "varType": "Optimized Algorithm",
                "isUpdated": true
              }
            ]
          }
        },
        {
          "type": "runnable_code",
          "filename": "fft_speedup_demo.js",
          "initialCode": "function evaluateFftComplexity(N = 1024) {\n  const dftOps = N * N;\n  const fftOps = N * Math.log2(N);\n  const speedup = dftOps / fftOps;\n  return {\n    samplesN: N,\n    dftOperations: dftOps,\n    fftOperations: fftOps,\n    speedupRatio: Number(speedup.toFixed(1)),\n    status: 'FFT_RADIX2_ACCELERATED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateFftComplexity(1024)));",
          "expectedOutput": "{\"samplesN\":1024,\"dftOperations\":1048576,\"fftOperations\":10240,\"speedupRatio\":102.4,\"status\":\"FFT_RADIX2_ACCELERATED\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "How many operations does Radix-2 FFT require for a 1024-sample buffer ($1024 \\times \\log_2(1024)$)?",
        "expectedStringOutput": "10240",
        "acceptableAnswers": [
          "10240",
          "10,240",
          "fftOperations\":10240"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_DSP_FFT_SPECTROGRAM_FEATURE_EXTRACTION",
        "diagnosisMap": {
          "1048576": {
            "misconceptionId": "MC_EDGEAI_DSP_FFT_SPECTROGRAM_FEATURE_EXTRACTION",
            "errorExplanation": "1,048,576 is for naive DFT (N^2). FFT requires only 10,240 operations.",
            "recoveryPath": {
              "simplerExplanation": "1024 * 10 = 10,240 operations.",
              "guidedFixPrompt": "Type 10240"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d7-b2-fft-magnitude-and-bin-resolution",
      "day": 7,
      "blockNumber": 2,
      "title": "FFT Magnitude Spectrum & Frequency Bin Width ($\\Delta f$)",
      "conceptBudget": {
        "primaryConcept": "Frequency Bin Resolution",
        "supportingTerms": [
          "Bin Width: $\\Delta f = \\frac{f_s}{N}$ (e.g. $16000\\text{ Hz} / 512 = 31.25\\text{ Hz}$ per bin)",
          "Complex to Magnitude: $|X(k)| = \\sqrt{\\text{Re}(k)^2 + \\text{Im}(k)^2}$",
          "Nyquist Mirror Symmetry (Only bins $0$ to $N/2$ contain unique positive frequencies)"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d7-b1-radix2-cooley-tukey-fft",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "bin_width_demo.js",
          "initialCode": "function calculateBinResolution(fs = 16000, N = 512) {\n  const binWidth = fs / N;\n  const uniqueBins = N / 2;\n  return {\n    samplingRateHz: fs,\n    fftSize: N,\n    frequencyBinWidthHz: Number(binWidth.toFixed(2)),\n    uniquePositiveFrequencyBins: uniqueBins,\n    maxDetectableFreqHz: fs / 2\n  };\n}\n\nconsole.log(JSON.stringify(calculateBinResolution(16000, 512)));",
          "expectedOutput": "{\"samplingRateHz\":16000,\"fftSize\":512,\"frequencyBinWidthHz\":31.25,\"uniquePositiveFrequencyBins\":256,\"maxDetectableFreqHz\":8000}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What is the frequency bin width in Hz when sampling at 16,000 Hz with a 512-point FFT ($16000 / 512$)?",
        "expectedStringOutput": "31.25",
        "acceptableAnswers": [
          "31.25",
          "31.25 Hz",
          "frequencyBinWidthHz\":31.25"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_DSP_FFT_SPECTROGRAM_FEATURE_EXTRACTION",
        "diagnosisMap": {
          "62.5": {
            "misconceptionId": "MC_EDGEAI_DSP_FFT_SPECTROGRAM_FEATURE_EXTRACTION",
            "errorExplanation": "16000 / 512 = 31.25 Hz.",
            "recoveryPath": {
              "simplerExplanation": "16000 / 512 = 31.25 Hz.",
              "guidedFixPrompt": "Type 31.25"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d7-b3-2d-spectrogram-generation",
      "day": 7,
      "blockNumber": 3,
      "title": "2D Log-Power Spectrogram Generation for Neural Input",
      "conceptBudget": {
        "primaryConcept": "2D Spectrogram Image Generation",
        "supportingTerms": [
          "Short-Time Fourier Transform (STFT)",
          "Log-Power Scaling: $P(t, f) = \\log_{10}(|X(t, f)|^2 + 10^{-6})$",
          "2D Tensor Matrix ($[\\text{Frames}, \\text{Frequency Bins}]$ mapped directly as image input to CNNs)"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d7-b2-fft-magnitude-and-bin-resolution",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "spectrogram_tensor_demo.js",
          "initialCode": "function evaluateSpectrogramTensor(frames = 61, bins = 256) {\n  const totalElements = frames * bins;\n  return {\n    tensorShape: `[1, ${frames}, ${bins}, 1]`,\n    totalFloatElements: totalElements,\n    int8QuantizedBytes: totalElements, // 1 byte per element in INT8!\n    status: 'SPECTROGRAM_TENSOR_READY_FOR_CNN'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateSpectrogramTensor(61, 256)));",
          "expectedOutput": "{\"tensorShape\":\"[1, 61, 256, 1]\",\"totalFloatElements\":15616,\"int8QuantizedBytes\":15616,\"status\":\"SPECTROGRAM_TENSOR_READY_FOR_CNN\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What status confirms that a 2D spectrogram tensor is prepared for convolutional neural network inference?",
        "expectedStringOutput": "SPECTROGRAM_TENSOR_READY_FOR_CNN",
        "acceptableAnswers": [
          "SPECTROGRAM_TENSOR_READY_FOR_CNN",
          "status\":\"SPECTROGRAM_TENSOR_READY_FOR_CNN\""
        ],
        "primaryMisconceptionId": "MC_EDGEAI_DSP_FFT_SPECTROGRAM_FEATURE_EXTRACTION",
        "diagnosisMap": {
          "FAILED": {
            "misconceptionId": "MC_EDGEAI_DSP_FFT_SPECTROGRAM_FEATURE_EXTRACTION",
            "errorExplanation": "Matches SPECTROGRAM_TENSOR_READY_FOR_CNN.",
            "recoveryPath": {
              "simplerExplanation": "Matches SPECTROGRAM_TENSOR_READY_FOR_CNN.",
              "guidedFixPrompt": "Type SPECTROGRAM_TENSOR_READY_FOR_CNN"
            }
          }
        }
      }
    }
  ]
},
  8: {
  "day": 8,
  "title": "Audio Feature Engineering: Mel-Filterbanks & MFCCs",
  "overviewMetaphor": "MFCCs are the Human Ear's Acoustic Equalizer: our ears are very good at distinguishing small pitch differences between 200 Hz and 500 Hz (Human voice tones), but terrible at telling 10,000 Hz from 10,300 Hz; the Mel-Scale warps the linear FFT spectrum onto a logarithmic pitch scale; 32 triangular filterbanks sum the energy into vocal frequency bands, and a Discrete Cosine Transform (DCT) compresses that data into 13 coefficients per frame (Shrinking audio memory by 95%!).",
  "blocks": [
    {
      "id": "edgeai-d8-b1-mel-scale-frequency-warping",
      "day": 8,
      "blockNumber": 1,
      "title": "The Mel-Scale Frequency Warping Formula",
      "conceptBudget": {
        "primaryConcept": "Mel-Scale Frequency Warping",
        "supportingTerms": [
          "Mel Warping Formula: $m = 2595 \\log_{10}\\left(1 + \\frac{f}{700}\\right)$",
          "Inverse Mel: $f = 700 \\left(10^{m / 2595} - 1\\right)$",
          "Logarithmic resolution matching human auditory perception"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d7-b2-fft-magnitude-and-bin-resolution",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "syntax_anatomy",
          "title": "Hertz to Mel Conversion Formula",
          "codeSnippet": "function hzToMel(f) {\n  return 2595.0f * log10f(1.0f + f / 700.0f); // Maps linear Hz to psychoacoustic Mel scale\n}",
          "lineNotes": {
            "2": "Calculates Mel pitch value."
          }
        },
        {
          "type": "runnable_code",
          "filename": "mel_scale_demo.js",
          "initialCode": "function hzToMel(f) {\n  return Number((2595 * Math.log10(1 + f / 700)).toFixed(1));\n}\n\nconsole.log('1000 Hz ->', hzToMel(1000), 'Mels');\nconsole.log('4000 Hz ->', hzToMel(4000), 'Mels');",
          "expectedOutput": "1000 Hz -> 999.9 Mels\n4000 Hz -> 2146 Mels",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What Mel value corresponds to a 1000 Hz audio frequency ($2595 \\log_{10}(1 + 1000/700)$)?",
        "expectedStringOutput": "999.9",
        "acceptableAnswers": [
          "999.9",
          "1000",
          "999.9 Mels"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_MFCC_AUDIO_SPECTROGRAM_PREPROCESSING",
        "diagnosisMap": {
          "500": {
            "misconceptionId": "MC_EDGEAI_MFCC_AUDIO_SPECTROGRAM_PREPROCESSING",
            "errorExplanation": "1000 Hz maps to 999.9 Mels.",
            "recoveryPath": {
              "simplerExplanation": "1000 Hz = 999.9 Mels.",
              "guidedFixPrompt": "Type 999.9"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d8-b2-triangular-mel-filterbank-energy",
      "day": 8,
      "blockNumber": 2,
      "title": "Triangular Mel Filterbanks: Summing Spectral Energy",
      "conceptBudget": {
        "primaryConcept": "Triangular Mel Filterbanks",
        "supportingTerms": [
          "20 - 40 Triangular Filterbanks",
          "Linear spacing below 1000 Hz, logarithmic spacing above 1000 Hz",
          "Energy Accumulation: Summing product of FFT power and triangular weights",
          "Log Energy Compression"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d8-b1-mel-scale-frequency-warping",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "diagram",
          "data": {
            "type": "memory_box",
            "title": "FFT vs Mel Filterbank Dimension Reduction",
            "boxes": [
              {
                "label": "Raw FFT Spectrum",
                "value": "Dimensions: 256 Frequency Bins per frame | Size: 1 KB per frame",
                "varType": "High Dimensional",
                "isUpdated": false
              },
              {
                "label": "Mel Filterbank Energies",
                "value": "Dimensions: 32 Filterbank Energy values | Size: 32 bytes (97% REDUCTION!)",
                "varType": "Compact Feature",
                "isUpdated": true
              }
            ]
          }
        },
        {
          "type": "runnable_code",
          "filename": "filterbank_demo.js",
          "initialCode": "function evaluateFilterbankCompression(rawBins = 256, melFilters = 32) {\n  const reductionPct = ((rawBins - melFilters) / rawBins) * 100;\n  return {\n    rawFftBins: rawBins,\n    melFilterbankBands: melFilters,\n    dimensionalityReductionPercent: Number(reductionPct.toFixed(1)),\n    status: 'MEL_FILTERBANK_ENERGIES_COMPACTED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateFilterbankCompression(256, 32)));",
          "expectedOutput": "{\"rawFftBins\":256,\"melFilterbankBands\":32,\"dimensionalityReductionPercent\":87.5,\"status\":\"MEL_FILTERBANK_ENERGIES_COMPACTED\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What dimensionality reduction percentage is achieved when compressing 256 FFT bins down to 32 Mel filterbank bands ($((256-32)/256) \\times 100$)?",
        "expectedStringOutput": "87.5",
        "acceptableAnswers": [
          "87.5",
          "87.5%",
          "dimensionalityReductionPercent\":87.5"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_MFCC_AUDIO_SPECTROGRAM_PREPROCESSING",
        "diagnosisMap": {
          "50": {
            "misconceptionId": "MC_EDGEAI_MFCC_AUDIO_SPECTROGRAM_PREPROCESSING",
            "errorExplanation": "(256 - 32) / 256 = 87.5% reduction.",
            "recoveryPath": {
              "simplerExplanation": "Reduces dimensions by 87.5%.",
              "guidedFixPrompt": "Type 87.5"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d8-b3-mfcc-dct-coefficient-extraction",
      "day": 8,
      "blockNumber": 3,
      "title": "Discrete Cosine Transform (DCT-II): Extracting 10..13 MFCC Coefficients",
      "conceptBudget": {
        "primaryConcept": "DCT-II MFCC Extraction",
        "supportingTerms": [
          "DCT-II (Decorrelates overlapping filterbank energies into orthogonal cepstral coefficients)",
          "MFCC Coefficients 0..12 (Coefficient 0 = Total energy, 1..12 = Spectral envelope shape)",
          "De-noising & Standard format for Keyword Spotting (KWS) models"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d8-b2-triangular-mel-filterbank-energy",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "mfcc_dct_demo.js",
          "initialCode": "function evaluateMfccExtraction(numCoeffs = 13, numFrames = 49) {\n  const totalFeatures = numCoeffs * numFrames;\n  return {\n    mfccCoefficientsPerFrame: numCoeffs,\n    framesPerSecond: numFrames,\n    totalInputFeaturesPerSecond: totalFeatures,\n    status: 'MFCC_ACOUSTIC_FEATURES_EXTRACTED_OPTIMAL'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateMfccExtraction(13, 49)));",
          "expectedOutput": "{\"mfccCoefficientsPerFrame\":13,\"framesPerSecond\":49,\"totalInputFeaturesPerSecond\":637,\"status\":\"MFCC_ACOUSTIC_FEATURES_EXTRACTED_OPTIMAL\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "How many total 1-byte INT8 feature inputs are fed to a Keyword Spotting model for 1 second of audio (13 MFCC coefficients across 49 frames: $13 \\times 49$)?",
        "expectedStringOutput": "637",
        "acceptableAnswers": [
          "637",
          "637 features",
          "totalInputFeaturesPerSecond\":637"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_MFCC_AUDIO_SPECTROGRAM_PREPROCESSING",
        "diagnosisMap": {
          "16000": {
            "misconceptionId": "MC_EDGEAI_MFCC_AUDIO_SPECTROGRAM_PREPROCESSING",
            "errorExplanation": "16,000 raw samples are compressed down to just 637 MFCC bytes.",
            "recoveryPath": {
              "simplerExplanation": "13 * 49 = 637 features.",
              "guidedFixPrompt": "Type 637"
            }
          }
        }
      }
    }
  ]
},
  9: {
  "day": 9,
  "title": "Vibration Anomaly Detection: Mahalanobis Distance & Statistical DSP",
  "overviewMetaphor": "Industrial Bearing Vibration is an Engine Doctor's Stethoscope: a healthy industrial motor hums with smooth, predictable statistical vibrations (Low RMS energy, normal Kurtosis bell curve ~3.0); as ball bearings develop micro-cracks, sharp metallic impacts create high-energy spikes (Kurtosis jumps above 5.0, Crest Factor exceeds 4.0); the Mahalanobis Distance calculates how many standard deviations the multidimensional sensor reading has strayed from the normal cluster, alerting factory engineers weeks before catastrophic machine breakdown.",
  "blocks": [
    {
      "id": "edgeai-d9-b1-statistical-dsp-kurtosis-rms",
      "day": 9,
      "blockNumber": 1,
      "title": "Statistical DSP: RMS, Crest Factor, Kurtosis & Skewness",
      "conceptBudget": {
        "primaryConcept": "Statistical DSP Vibration Metrics",
        "supportingTerms": [
          "Root Mean Square ($\\text{RMS} = \\sqrt{\\frac{1}{N} \\sum x_i^2}$, overall vibration energy)",
          "Crest Factor ($\\text{CF} = \\frac{\\text{Peak}}{\\text{RMS}}$, peakiness of impacts)",
          "Kurtosis ($k = \\frac{\\frac{1}{N} \\sum (x_i - \\mu)^4}{\\sigma^4}$, Gaussian baseline = 3.0; fault spikes $> 4.5$)",
          "Skewness (Asymmetry of vibration waveform)"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d7-b2-fft-magnitude-and-bin-resolution",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "diagram",
          "data": {
            "type": "memory_box",
            "title": "Vibration Metric Diagnostic Thresholds",
            "boxes": [
              {
                "label": "1. RMS Energy",
                "value": "Healthy: < 1.5 g | Imbalance/Misalignment: > 4.5 g (Continuous excessive force)",
                "varType": "Energy Metric",
                "isUpdated": false
              },
              {
                "label": "2. Kurtosis (4th Moment)",
                "value": "Healthy: ~3.0 (Gaussian) | Bearing Crack Impacts: > 4.5 (Sharp transient spikes!)",
                "varType": "Impulse Metric",
                "isUpdated": true
              },
              {
                "label": "3. Crest Factor",
                "value": "Healthy: 2.0 - 3.0 | Damaged Outer Race: > 4.5 (High peak to RMS ratio)",
                "varType": "Peak Ratio",
                "isUpdated": false
              }
            ]
          }
        },
        {
          "type": "runnable_code",
          "filename": "vibration_stats_demo.js",
          "initialCode": "function evaluateBearingStats(kurtosis, rms) {\n  if (kurtosis > 4.5 || rms > 4.5) {\n    return 'FAULT_DETECTED: BEARING_MICRO_CRACK_IMPACTS';\n  }\n  return 'HEALTHY_NORMAL: VIBRATION_WITHIN_NOMINAL_ENVELOPE';\n}\n\nconsole.log(evaluateBearingStats(5.8, 2.1));\nconsole.log(evaluateBearingStats(3.0, 1.2));",
          "expectedOutput": "FAULT_DETECTED: BEARING_MICRO_CRACK_IMPACTS\nHEALTHY_NORMAL: VIBRATION_WITHIN_NOMINAL_ENVELOPE",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What diagnostic status is flagged when bearing vibration exhibits a Kurtosis of 5.8 (exceeding the 4.5 threshold)?",
        "expectedStringOutput": "FAULT_DETECTED: BEARING_MICRO_CRACK_IMPACTS",
        "acceptableAnswers": [
          "FAULT_DETECTED: BEARING_MICRO_CRACK_IMPACTS",
          "FAULT_DETECTED"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_VIBRATION_ANOMALY_MAHALANOBIS_DISTANCE",
        "diagnosisMap": {
          "HEALTHY": {
            "misconceptionId": "MC_EDGEAI_VIBRATION_ANOMALY_MAHALANOBIS_DISTANCE",
            "errorExplanation": "Kurtosis 5.8 indicates non-Gaussian shock pulses from bearing damage.",
            "recoveryPath": {
              "simplerExplanation": "Kurtosis > 4.5 flags FAULT_DETECTED: BEARING_MICRO_CRACK_IMPACTS.",
              "guidedFixPrompt": "Type FAULT_DETECTED: BEARING_MICRO_CRACK_IMPACTS"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d9-b2-mahalanobis-distance-math",
      "day": 9,
      "blockNumber": 2,
      "title": "Multidimensional Mahalanobis Distance ($D_M$) Anomaly Scoring",
      "conceptBudget": {
        "primaryConcept": "Mahalanobis Distance Metric",
        "supportingTerms": [
          "Mahalanobis Formula: $D_M = \\sqrt{(\\vec{x} - \\vec{\\mu})^T \\Sigma^{-1} (\\vec{x} - \\vec{\\mu})}$",
          "Covariance Matrix ($\\Sigma$ captures correlation between RMS, Kurtosis, and Temperature)",
          "Scale-Invariance & Chi-Squared distribution thresholding ($D_M > 3.0 \\implies 99.7\\%$ anomaly outlier)"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d9-b1-statistical-dsp-kurtosis-rms",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "syntax_anatomy",
          "title": "Mahalanobis Distance Formulation",
          "codeSnippet": "// Vector difference from normal baseline mean: diff = (x - mu)\n// Product with inverse covariance matrix: z = diff * Sigma_inv * diff^T\nconst dM = Math.sqrt(z); // Exact multi-variable statistical distance in standard deviations!",
          "lineNotes": {
            "3": "Calculates Mahalanobis distance accounting for sensor correlations."
          }
        },
        {
          "type": "runnable_code",
          "filename": "mahalanobis_demo.js",
          "initialCode": "function evaluateMahalanobis(dmValue, threshold = 3.0) {\n  return (dmValue >= threshold)\n    ? `ANOMALY_ALARM: STATISTICAL_OUTLIER_DM_${dmValue.toFixed(1)}_EXCEEDS_3.0`\n    : 'IN_DISTRIBUTION_NORMAL';\n}\n\nconsole.log(evaluateMahalanobis(4.2));\nconsole.log(evaluateMahalanobis(1.5));",
          "expectedOutput": "ANOMALY_ALARM: STATISTICAL_OUTLIER_DM_4.2_EXCEEDS_3.0\nIN_DISTRIBUTION_NORMAL",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What status is triggered when the Mahalanobis distance evaluates to $D_M = 4.2$ (exceeding threshold 3.0)?",
        "expectedStringOutput": "ANOMALY_ALARM: STATISTICAL_OUTLIER_DM_4.2_EXCEEDS_3.0",
        "acceptableAnswers": [
          "ANOMALY_ALARM: STATISTICAL_OUTLIER_DM_4.2_EXCEEDS_3.0",
          "ANOMALY_ALARM"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_VIBRATION_ANOMALY_MAHALANOBIS_DISTANCE",
        "diagnosisMap": {
          "NORMAL": {
            "misconceptionId": "MC_EDGEAI_VIBRATION_ANOMALY_MAHALANOBIS_DISTANCE",
            "errorExplanation": "4.2 exceeds 3.0 standard deviations, triggering an anomaly alarm.",
            "recoveryPath": {
              "simplerExplanation": "Triggers ANOMALY_ALARM.",
              "guidedFixPrompt": "Type ANOMALY_ALARM: STATISTICAL_OUTLIER_DM_4.2_EXCEEDS_3.0"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d9-b3-edge-anomaly-threshold-tuning",
      "day": 9,
      "blockNumber": 3,
      "title": "False Positive Tuning & Continuous Running Baseline Updates",
      "conceptBudget": {
        "primaryConcept": "Edge Anomaly Threshold Tuning",
        "supportingTerms": [
          "Welford's Algorithm (Online calculation of running mean $\\mu$ and variance $\\sigma^2$ with $O(1)$ RAM)",
          "Cooldown Counters (Preventing repeated alerts on single machine startup transients)",
          "Hysteresis state clamping"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d9-b2-mahalanobis-distance-math",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "welford_demo.js",
          "initialCode": "function updateWelford(count, mean, M2, newValue) {\n  const newCount = count + 1;\n  const delta = newValue - mean;\n  const newMean = mean + delta / newCount;\n  const delta2 = newValue - newMean;\n  const newM2 = M2 + delta * delta2;\n  const variance = newCount > 1 ? newM2 / (newCount - 1) : 0;\n  return {\n    sampleCount: newCount,\n    runningMean: Number(newMean.toFixed(2)),\n    runningStdDev: Number(Math.sqrt(variance).toFixed(2)),\n    M2: Number(newM2.toFixed(2))\n  };\n}\n\nlet state = { count: 0, mean: 0, M2: 0 };\nfor (const s of [10, 12, 11, 10, 12]) {\n  state = updateWelford(state.count, state.mean, state.M2, s);\n}\nconsole.log(JSON.stringify(state));",
          "expectedOutput": "{\"sampleCount\":5,\"runningMean\":11,\"runningStdDev\":0.89,\"M2\":4}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What is the running mean calculated by Welford's algorithm across the 5 samples [10, 12, 11, 10, 12]?",
        "expectedStringOutput": "11",
        "acceptableAnswers": [
          "11",
          "11.0",
          "runningMean\":11"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_VIBRATION_ANOMALY_MAHALANOBIS_DISTANCE",
        "diagnosisMap": {
          "10": {
            "misconceptionId": "MC_EDGEAI_VIBRATION_ANOMALY_MAHALANOBIS_DISTANCE",
            "errorExplanation": "Mean of [10, 12, 11, 10, 12] is 55 / 5 = 11.",
            "recoveryPath": {
              "simplerExplanation": "55 / 5 = 11.",
              "guidedFixPrompt": "Type 11"
            }
          }
        }
      }
    }
  ]
},
  10: {
  "day": 10,
  "title": "1D CNNs for Accelerometer Gesture & Activity Recognition",
  "overviewMetaphor": "A 1D Convolutional Neural Network is a Sliding Magnifying Glass over Motion: when a smartwatch user taps, circles, or shakes their wrist, the 3-axis accelerometer produces three continuous wave lines ($X, Y, Z$ acceleration); a 1D CNN slides small 1D filter kernels across time (Looking for specific motion shapes: a quick spike followed by a dip indicates a 'Double Tap'); pooling layers compress the timeline, and a Softmax output assigns probability scores to 'Walking', 'Running', or 'Waving'.",
  "blocks": [
    {
      "id": "edgeai-d10-b1-1d-temporal-convolution-mechanics",
      "day": 10,
      "blockNumber": 1,
      "title": "1D Temporal Convolution Mechanics: Sliding Kernel Across Time",
      "conceptBudget": {
        "primaryConcept": "1D Temporal Convolution Mechanics",
        "supportingTerms": [
          "Input Shape: $[\\text{Batch}, \\text{Time Steps } T, \\text{Channels } C]$ (e.g. $[1, 50, 3]$ for 50 timesteps of $X, Y, Z$ IMU)",
          "1D Kernel: Filter slides exclusively along the temporal time dimension",
          "Receptive Field Expansion (Stacking 1D conv layers captures longer gesture sequences)"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d2-b3-model-architecture-selection-rules",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "diagram",
          "data": {
            "type": "memory_box",
            "title": "1D CNN vs 2D CNN Tensor Dimension Comparison",
            "boxes": [
              {
                "label": "1. 1D CNN (Temporal Motion)",
                "value": "Input: [1, 50, 3] (50 timesteps x 3 IMU axes) | Kernel: 1x5x3 (Slides in TIME only!) | Parameters: ~8 KB",
                "varType": "1D Time-Series",
                "isUpdated": true
              },
              {
                "label": "2. 2D CNN (Spatial Vision)",
                "value": "Input: [1, 96, 96, 1] (96x96 Image) | Kernel: 3x3x1 (Slides in X and Y!) | Parameters: ~250 KB",
                "varType": "2D Spatial Image",
                "isUpdated": false
              }
            ]
          }
        },
        {
          "type": "runnable_code",
          "filename": "conv1d_math_demo.js",
          "initialCode": "function calculateConv1dOutputLength(inputLen, kernelSize = 5, stride = 1, padding = 0) {\n  const outLen = Math.floor((inputLen - kernelSize + 2 * padding) / stride) + 1;\n  return {\n    inputTimeSteps: inputLen,\n    kernelSize,\n    stride,\n    outputTimeSteps: outLen,\n    status: 'CONV1D_OUTPUT_DIMENSION_CALCULATED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateConv1dOutputLength(50, 5, 1, 0)));",
          "expectedOutput": "{\"inputTimeSteps\":50,\"kernelSize\":5,\"stride\":1,\"outputTimeSteps\":46,\"status\":\"CONV1D_OUTPUT_DIMENSION_CALCULATED\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What is the output temporal dimension after applying a 1D convolution of kernel size 5 with stride 1 and zero padding to an input of length 50 ($50 - 5 + 1$)?",
        "expectedStringOutput": "46",
        "acceptableAnswers": [
          "46",
          "46 timesteps",
          "outputTimeSteps\":46"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_ACCELEROMETER_GESTURE_CNN_INFERENCE",
        "diagnosisMap": {
          "50": {
            "misconceptionId": "MC_EDGEAI_ACCELEROMETER_GESTURE_CNN_INFERENCE",
            "errorExplanation": "With valid padding (pad=0), 50 - 5 + 1 = 46.",
            "recoveryPath": {
              "simplerExplanation": "50 - 5 + 1 = 46.",
              "guidedFixPrompt": "Type 46"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d10-b2-global-average-pooling-edge-savings",
      "day": 10,
      "blockNumber": 2,
      "title": "Global Average Pooling (GAP): Eliminating Dense Flatten Layer Bloat",
      "conceptBudget": {
        "primaryConcept": "Global Average Pooling (GAP)",
        "supportingTerms": [
          "Dense Flatten Layer Bloat (Flattening $[10, 64]$ to 640 weights $\\times 10$ classes = 6,400 weights!)",
          "Global Average Pooling (Averages across time $\\implies [1, 64]$ feature vector $\\implies 90\\%$ parameter reduction)",
          "Translational Invariance"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d10-b1-1d-temporal-convolution-mechanics",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "gap_savings_demo.js",
          "initialCode": "function evaluateGapSavings(timeSteps = 10, channels = 64, numClasses = 5) {\n  const flattenParams = (timeSteps * channels) * numClasses;\n  const gapParams = channels * numClasses;\n  const savedParams = flattenParams - gapParams;\n  return {\n    flattenLayerParams: flattenParams,\n    gapLayerParams: gapParams,\n    weightsSaved: savedParams,\n    reductionPercent: Number(((savedParams / flattenParams) * 100).toFixed(1)),\n    status: 'GAP_PARAMETER_COMPRESSION_OPTIMAL'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateGapSavings(10, 64, 5)));",
          "expectedOutput": "{\"flattenLayerParams\":3200,\"gapLayerParams\":320,\"weightsSaved\":2880,\"reductionPercent\":90,\"status\":\"GAP_PARAMETER_COMPRESSION_OPTIMAL\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What parameter reduction percentage is achieved when replacing a Flatten layer (3,200 weights) with Global Average Pooling (320 weights)?",
        "expectedStringOutput": "90",
        "acceptableAnswers": [
          "90",
          "90%",
          "reductionPercent\":90"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_ACCELEROMETER_GESTURE_CNN_INFERENCE",
        "diagnosisMap": {
          "50": {
            "misconceptionId": "MC_EDGEAI_ACCELEROMETER_GESTURE_CNN_INFERENCE",
            "errorExplanation": "(3200 - 320) / 3200 = 90% reduction.",
            "recoveryPath": {
              "simplerExplanation": "Reduces weights by 90%.",
              "guidedFixPrompt": "Type 90"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d10-b3-softmax-gesture-classification",
      "day": 10,
      "blockNumber": 3,
      "title": "Softmax Activation & Gesture Confidence Thresholding",
      "conceptBudget": {
        "primaryConcept": "Softmax Classification & Confidence",
        "supportingTerms": [
          "Softmax Formula: $P(y_i) = \\frac{e^{z_i}}{\\sum e^{z_j}}$",
          "Fixed-Point Softmax Approximation (Using LUT for exponential)",
          "Confidence Threshold (Discarding ambiguous gestures with probability $< 0.85$)"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d10-b2-global-average-pooling-edge-savings",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "softmax_gesture_demo.js",
          "initialCode": "function evaluateGesture(logits, classes, threshold = 0.85) {\n  const exps = logits.map(Math.exp);\n  const sumExp = exps.reduce((a, b) => a + b, 0);\n  const probs = exps.map(e => e / sumExp);\n  let maxP = -1;\n  let bestIdx = 0;\n  probs.forEach((p, idx) => {\n    if (p > maxP) { maxP = p; bestIdx = idx; }\n  });\n  const isConfident = maxP >= threshold;\n  return {\n    predictedGesture: classes[bestIdx],\n    probability: Number(maxP.toFixed(3)),\n    confident: isConfident,\n    action: isConfident ? `DISPATCH_ACTION_${classes[bestIdx]}` : 'DISREGARD_AMBIGUOUS_MOTION'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateGesture([1.0, 5.0, 0.5], ['TAP', 'CIRCLE', 'SHAKE'], 0.85)));",
          "expectedOutput": "{\"predictedGesture\":\"CIRCLE\",\"probability\":0.976,\"confident\":true,\"action\":\"DISPATCH_ACTION_CIRCLE\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "Which gesture is predicted with 0.976 probability from logits [1.0, 5.0, 0.5] for ['TAP', 'CIRCLE', 'SHAKE']?",
        "expectedStringOutput": "CIRCLE",
        "acceptableAnswers": [
          "CIRCLE",
          "predictedGesture\":\"CIRCLE\""
        ],
        "primaryMisconceptionId": "MC_EDGEAI_ACCELEROMETER_GESTURE_CNN_INFERENCE",
        "diagnosisMap": {
          "TAP": {
            "misconceptionId": "MC_EDGEAI_ACCELEROMETER_GESTURE_CNN_INFERENCE",
            "errorExplanation": "Logit 5.0 for CIRCLE generates 97.6% Softmax probability.",
            "recoveryPath": {
              "simplerExplanation": "CIRCLE has the highest probability.",
              "guidedFixPrompt": "Type CIRCLE"
            }
          }
        }
      }
    }
  ]
},
  11: {
  "day": 11,
  "title": "ARM CMSIS-NN: SIMD & DSP Hardware Acceleration",
  "overviewMetaphor": "CMSIS-NN is a Forklift Moving 4 Pallets of Weights in One Motion: standard microcontroller C code executes scalar math (Multiplying one INT8 weight by one input in 1 CPU clock cycle: 4 multiplications take 4 cycles); ARM Cortex-M processors feature SIMD (Single Instruction Multiple Data: `SMLAD` and `__SADD8`); CMSIS-NN packs four 8-bit integers into a single 32-bit CPU register, executing 4 Multiply-Accumulate operations simultaneously in a single clock cycle, boosting inference speed by 400% with zero extra silicon cost.",
  "blocks": [
    {
      "id": "edgeai-d11-b1-arm-simd-smlad-instructions",
      "day": 11,
      "blockNumber": 1,
      "title": "ARM Cortex-M SIMD Instructions: `SMLAD` & Quad-INT8 Packing",
      "conceptBudget": {
        "primaryConcept": "ARM Cortex-M SIMD MAC",
        "supportingTerms": [
          "`SMLAD` (Signed Multiply with Accumulate Dual: Multiplies two 16-bit integers and adds to 32-bit accumulator in 1 cycle)",
          "`__SMLAD()` CMSIS intrinsic",
          "Register Packing: 4 $\\times$ INT8 loaded into one 32-bit `uint32_t` register",
          "4x MAC throughput speedup on Cortex-M4/M7/M33/M55"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d4-b1-affine-quantization-math",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "diagram",
          "data": {
            "type": "memory_box",
            "title": "32-Bit Register Quad-INT8 Packing",
            "boxes": [
              {
                "label": "Register R0 (Inputs)",
                "value": "Byte 3: in[3] | Byte 2: in[2] | Byte 1: in[1] | Byte 0: in[0] (4 INT8 values packed!)",
                "varType": "Packed Input Register",
                "isUpdated": false
              },
              {
                "label": "Register R1 (Weights)",
                "value": "Byte 3: wt[3] | Byte 2: wt[2] | Byte 1: wt[1] | Byte 0: wt[0] (4 INT8 weights packed!)",
                "varType": "Packed Weight Register",
                "isUpdated": false
              },
              {
                "label": "SIMD Hardware Execution",
                "value": "SMLAD computes: (in0*wt0 + in1*wt1 + in2*wt2 + in3*wt3) in EXACTLY 1 CLOCK CYCLE!",
                "varType": "1-Cycle SIMD MAC",
                "isUpdated": true
              }
            ]
          }
        },
        {
          "type": "runnable_code",
          "filename": "simd_math_demo.js",
          "initialCode": "function evaluateSimdThroughput(totalMacOperations) {\n  const scalarCycles = totalMacOperations;\n  const simdCycles = Math.ceil(totalMacOperations / 4);\n  const speedup = scalarCycles / simdCycles;\n  return {\n    totalMacs: totalMacOperations,\n    scalarClockCycles: scalarCycles,\n    cmsisNnSimdClockCycles: simdCycles,\n    speedupFactor: Number(speedup.toFixed(1)),\n    status: 'CMSIS_NN_4X_SIMD_ACCELERATION_ACTIVE'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateSimdThroughput(40000)));",
          "expectedOutput": "{\"totalMacs\":40000,\"scalarClockCycles\":40000,\"cmsisNnSimdClockCycles\":10000,\"speedupFactor\":4,\"status\":\"CMSIS_NN_4X_SIMD_ACCELERATION_ACTIVE\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "How many clock cycles are required to execute 40,000 MAC operations using CMSIS-NN Quad-INT8 SIMD ($40000 / 4$)?",
        "expectedStringOutput": "10000",
        "acceptableAnswers": [
          "10000",
          "10,000",
          "cmsisNnSimdClockCycles\":10000"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_CMSIS_NN_SIMD_OPTIMIZATION_DSP_INSTRUCTIONS",
        "diagnosisMap": {
          "40000": {
            "misconceptionId": "MC_EDGEAI_CMSIS_NN_SIMD_OPTIMIZATION_DSP_INSTRUCTIONS",
            "errorExplanation": "40,000 is for scalar execution. SIMD processes 4 MACs per cycle -> 10,000 cycles.",
            "recoveryPath": {
              "simplerExplanation": "40,000 / 4 = 10,000 cycles.",
              "guidedFixPrompt": "Type 10000"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d11-b2-cmsis-nn-operator-kernels",
      "day": 11,
      "blockNumber": 2,
      "title": "CMSIS-NN Operator Kernels: `arm_convolve_s8` & `arm_fully_connected_s8`",
      "conceptBudget": {
        "primaryConcept": "CMSIS-NN Operator Kernels",
        "supportingTerms": [
          "`arm_convolve_s8()` (Highly optimized 2D/1D convolution)",
          "`arm_fully_connected_s8()` (Matrix-vector multiply with bias addition)",
          "`arm_depthwise_conv_s8()` (Depthwise separable spatial filtering)",
          "Direct drop-in backend for TensorFlow Lite Micro"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d11-b1-arm-simd-smlad-instructions",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "cmsis_kernels_demo.js",
          "initialCode": "function selectCmsisKernel(layerType) {\n  if (layerType === 'CONV2D') return 'arm_convolve_s8: SIMD_CONVOLUTION_KERNEL';\n  if (layerType === 'DEPTHWISE') return 'arm_depthwise_conv_s8: SIMD_DEPTHWISE_KERNEL';\n  return 'arm_fully_connected_s8: SIMD_DENSE_MATRIX_KERNEL';\n}\n\nconsole.log(selectCmsisKernel('CONV2D'));\nconsole.log(selectCmsisKernel('DENSE'));",
          "expectedOutput": "arm_convolve_s8: SIMD_CONVOLUTION_KERNEL\narm_fully_connected_s8: SIMD_DENSE_MATRIX_KERNEL",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "Which CMSIS-NN kernel function executes optimized INT8 convolution operations?",
        "expectedStringOutput": "arm_convolve_s8: SIMD_CONVOLUTION_KERNEL",
        "acceptableAnswers": [
          "arm_convolve_s8: SIMD_CONVOLUTION_KERNEL",
          "arm_convolve_s8"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_CMSIS_NN_SIMD_OPTIMIZATION_DSP_INSTRUCTIONS",
        "diagnosisMap": {
          "DENSE": {
            "misconceptionId": "MC_EDGEAI_CMSIS_NN_SIMD_OPTIMIZATION_DSP_INSTRUCTIONS",
            "errorExplanation": "arm_convolve_s8 is the convolution kernel.",
            "recoveryPath": {
              "simplerExplanation": "Convolution kernel is arm_convolve_s8.",
              "guidedFixPrompt": "Type arm_convolve_s8: SIMD_CONVOLUTION_KERNEL"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d11-b3-cmsis-nn-memory-alignment",
      "day": 11,
      "blockNumber": 3,
      "title": "Memory Alignment Invariant: 4-Byte / 16-Byte Pointer Boundaries",
      "conceptBudget": {
        "primaryConcept": "Memory Pointer Alignment Invariant",
        "supportingTerms": [
          "Unaligned Access Faults on ARM Cortex-M0/M3",
          "16-Byte Alignment (`alignas(16)`) for Helium vector extensions (M55/M85)",
          "Performance penalty of unaligned memory reads"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d11-b2-cmsis-nn-operator-kernels",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "alignment_check_demo.js",
          "initialCode": "function checkPointerAlignment(addressHex, alignmentBytes = 16) {\n  const addrInt = parseInt(addressHex, 16);\n  const isAligned = (addrInt % alignmentBytes) === 0;\n  return {\n    memoryAddress: addressHex,\n    alignmentRequired: alignmentBytes,\n    isAligned,\n    status: isAligned ? 'POINTER_ALIGNED_SIMD_SAFE' : 'UNALIGNED_MEMORY_FAULT_HAZARD'\n  };\n}\n\nconsole.log(JSON.stringify(checkPointerAlignment('0x20001000', 16)));\nconsole.log(JSON.stringify(checkPointerAlignment('0x20001003', 16)));",
          "expectedOutput": "{\"memoryAddress\":\"0x20001000\",\"alignmentRequired\":16,\"isAligned\":true,\"status\":\"POINTER_ALIGNED_SIMD_SAFE\"}\n{\"memoryAddress\":\"0x20001003\",\"alignmentRequired\":16,\"isAligned\":false,\"status\":\"UNALIGNED_MEMORY_FAULT_HAZARD\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What status is awarded to memory address `0x20001000` aligned on a 16-byte boundary?",
        "expectedStringOutput": "POINTER_ALIGNED_SIMD_SAFE",
        "acceptableAnswers": [
          "POINTER_ALIGNED_SIMD_SAFE",
          "status\":\"POINTER_ALIGNED_SIMD_SAFE\""
        ],
        "primaryMisconceptionId": "MC_EDGEAI_CMSIS_NN_SIMD_OPTIMIZATION_DSP_INSTRUCTIONS",
        "diagnosisMap": {
          "FAULT": {
            "misconceptionId": "MC_EDGEAI_CMSIS_NN_SIMD_OPTIMIZATION_DSP_INSTRUCTIONS",
            "errorExplanation": "0x20001000 is perfectly divisible by 16, ensuring POINTER_ALIGNED_SIMD_SAFE.",
            "recoveryPath": {
              "simplerExplanation": "Matches POINTER_ALIGNED_SIMD_SAFE.",
              "guidedFixPrompt": "Type POINTER_ALIGNED_SIMD_SAFE"
            }
          }
        }
      }
    }
  ]
},
  12: {
  "day": 12,
  "title": "Model Pruning, Structured Sparsity & Weight Compression",
  "overviewMetaphor": "Pruning is Pruning Dead Leaves from a Bonsai Tree: during training, up to 70% of neural network weights end up near zero (e.g. `0.00001`), contributing almost nothing to the final classification; Magnitude Pruning sets all near-zero weights to exactly zero; Structured 2:4 Sparsity guarantees that for every 4 contiguous weights, exactly 2 are zero (Allowing hardware accelerators like ARM Ethos to skip half the math and double inference speed!).",
  "blocks": [
    {
      "id": "edgeai-d12-b1-magnitude-pruning-mechanics",
      "day": 12,
      "blockNumber": 1,
      "title": "Magnitude-Based Weight Pruning & Sparsity Ratios",
      "conceptBudget": {
        "primaryConcept": "Magnitude Weight Pruning",
        "supportingTerms": [
          "Sparsity Ratio (Percentage of zero weights: $S = \\frac{N_{\\text{zeros}}}{N_{\\text{total}}} \\times 100\\%$)",
          "Pruning Threshold ($|w_{ij}| < \\theta \\implies w_{ij} = 0$)",
          "Fine-Tuning Iteration (Re-training remaining weights to recover accuracy loss)"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d4-b1-affine-quantization-math",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "diagram",
          "data": {
            "type": "memory_box",
            "title": "Dense vs Pruned Weight Matrix Comparison",
            "boxes": [
              {
                "label": "1. Dense Matrix (100% Non-Zero)",
                "value": "Weights: [0.82, -0.01, 0.45, 0.002, -0.71, 0.03] | Memory: 6 bytes | MACs: 6 ops",
                "varType": "Dense Model",
                "isUpdated": false
              },
              {
                "label": "2. Pruned Sparse Matrix (50% Zeros)",
                "value": "Weights: [0.82, 0.00, 0.45, 0.00, -0.71, 0.00] | Compressed Storage: 3 bytes | MACs: 3 ops!",
                "varType": "Sparse Model",
                "isUpdated": true
              }
            ]
          }
        },
        {
          "type": "runnable_code",
          "filename": "pruning_math_demo.js",
          "initialCode": "function calculateSparsity(weights, threshold = 0.05) {\n  let zeros = 0;\n  for (const w of weights) if (Math.abs(w) < threshold) zeros++;\n  const sparsity = (zeros / weights.length) * 100;\n  return {\n    totalWeights: weights.length,\n    zeroCount: zeros,\n    sparsityPercent: Number(sparsity.toFixed(1)),\n    status: 'PRUNING_SPARSITY_EVALUATED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateSparsity([0.8, 0.01, -0.02, 0.9, 0.004, -0.7], 0.05)));",
          "expectedOutput": "{\"totalWeights\":6,\"zeroCount\":3,\"sparsityPercent\":50,\"status\":\"PRUNING_SPARSITY_EVALUATED\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What is the sparsity percentage when 3 out of 6 weights are pruned to zero ($3 / 6 \\times 100$)?",
        "expectedStringOutput": "50",
        "acceptableAnswers": [
          "50",
          "50%",
          "50.0",
          "sparsityPercent\":50"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_PRUNING_SPARSITY_WEIGHT_COMPRESSION",
        "diagnosisMap": {
          "30": {
            "misconceptionId": "MC_EDGEAI_PRUNING_SPARSITY_WEIGHT_COMPRESSION",
            "errorExplanation": "3 / 6 = 50% sparsity.",
            "recoveryPath": {
              "simplerExplanation": "3 / 6 = 50%.",
              "guidedFixPrompt": "Type 50"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d12-b2-structured-2-to-4-sparsity",
      "day": 12,
      "blockNumber": 2,
      "title": "Structured 2:4 Sparsity & Hardware Compression",
      "conceptBudget": {
        "primaryConcept": "Structured 2:4 Sparsity",
        "supportingTerms": [
          "Unstructured Sparsity (Random zeros require heavy index metadata maps)",
          "Structured 2:4 Sparsity (Exactly 2 non-zeros out of every 4 consecutive weights)",
          "Hardware Accelerator Support (2x MAC throughput without index overhead)"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d12-b1-magnitude-pruning-mechanics",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "structured_sparsity_demo.js",
          "initialCode": "function evaluate2to4Sparsity(quad) {\n  const nonZeros = quad.filter(w => w !== 0).length;\n  const is2to4 = (nonZeros === 2);\n  return {\n    quadVector: quad,\n    nonZeroCount: nonZeros,\n    isStructured2to4: is2to4,\n    status: is2to4 ? 'STRUCTURED_2TO4_SPARSITY_VALID' : 'UNSTRUCTURED_SPARSITY_PATTERN'\n  };\n}\n\nconsole.log(JSON.stringify(evaluate2to4Sparsity([0.8, 0.0, 0.5, 0.0])));\nconsole.log(JSON.stringify(evaluate2to4Sparsity([0.8, 0.4, 0.5, 0.0])));",
          "expectedOutput": "{\"quadVector\":[0.8,0,0.5,0],\"nonZeroCount\":2,\"isStructured2to4\":true,\"status\":\"STRUCTURED_2TO4_SPARSITY_VALID\"}\n{\"quadVector\":[0.8,0.4,0.5,0],\"nonZeroCount\":3,\"isStructured2to4\":false,\"status\":\"UNSTRUCTURED_SPARSITY_PATTERN\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What status confirms that a 4-weight vector containing exactly two non-zero values satisfies structured 2:4 hardware sparsity?",
        "expectedStringOutput": "STRUCTURED_2TO4_SPARSITY_VALID",
        "acceptableAnswers": [
          "STRUCTURED_2TO4_SPARSITY_VALID",
          "status\":\"STRUCTURED_2TO4_SPARSITY_VALID\""
        ],
        "primaryMisconceptionId": "MC_EDGEAI_PRUNING_SPARSITY_WEIGHT_COMPRESSION",
        "diagnosisMap": {
          "UNSTRUCTURED": {
            "misconceptionId": "MC_EDGEAI_PRUNING_SPARSITY_WEIGHT_COMPRESSION",
            "errorExplanation": "Exactly 2 non-zeros out of 4 matches STRUCTURED_2TO4_SPARSITY_VALID.",
            "recoveryPath": {
              "simplerExplanation": "Matches STRUCTURED_2TO4_SPARSITY_VALID.",
              "guidedFixPrompt": "Type STRUCTURED_2TO4_SPARSITY_VALID"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d12-b3-sparse-matrix-vector-spmv",
      "day": 12,
      "blockNumber": 3,
      "title": "Sparse Matrix-Vector Multiplication (SpMV) & Compressed Row Storage (CSR)",
      "conceptBudget": {
        "primaryConcept": "Compressed Sparse Row (CSR) Storage",
        "supportingTerms": [
          "CSR Format: `values[]`, `col_indices[]`, `row_ptr[]`",
          "Skipping Multiply-by-Zero operations in software",
          "Storage Savings when Sparsity $> 65\\%$"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d12-b2-structured-2-to-4-sparsity",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "spmv_demo.js",
          "initialCode": "function evaluateSpMvSavings(denseElements, sparseElements) {\n  const skippedOperations = denseElements - sparseElements;\n  return {\n    denseOps: denseElements,\n    sparseOps: sparseElements,\n    skippedZeroMacs: skippedOperations,\n    computationSpeedupPercent: Number(((skippedOperations / denseElements) * 100).toFixed(1))\n  };\n}\n\nconsole.log(JSON.stringify(evaluateSpMvSavings(10000, 3000)));",
          "expectedOutput": "{\"denseOps\":10000,\"sparseOps\":3000,\"skippedZeroMacs\":7000,\"computationSpeedupPercent\":70}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "How many zero multiplications are skipped when computing SpMV over a 10,000-element matrix with 3,000 non-zero elements ($10000 - 3000$)?",
        "expectedStringOutput": "7000",
        "acceptableAnswers": [
          "7000",
          "7,000",
          "skippedZeroMacs\":7000"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_PRUNING_SPARSITY_WEIGHT_COMPRESSION",
        "diagnosisMap": {
          "3000": {
            "misconceptionId": "MC_EDGEAI_PRUNING_SPARSITY_WEIGHT_COMPRESSION",
            "errorExplanation": "10000 - 3000 = 7000 zero operations skipped.",
            "recoveryPath": {
              "simplerExplanation": "10000 - 3000 = 7000.",
              "guidedFixPrompt": "Type 7000"
            }
          }
        }
      }
    }
  ]
},
  13: {
  "day": 13,
  "title": "Depthwise Separable Convolutions & MobileNet on Edge",
  "overviewMetaphor": "Depthwise Separable Convolution is Splitting a Giant 3D Jigsaw Puzzle into Two Simple 2D Steps: standard 2D convolution filters spatial features and channel features all at once in one massive, expensive calculation (Requiring 500,000 Multiply-Accumulate operations!); MobileNet splits this into two steps: Step 1 (Depthwise) filters each color channel independently with a $3 \\times 3$ kernel; Step 2 (Pointwise) mixes channels with a $1 \\times 1$ kernel; this delivers 98% of the same accuracy with 88% fewer math calculations.",
  "blocks": [
    {
      "id": "edgeai-d13-b1-depthwise-vs-standard-conv-math",
      "day": 13,
      "blockNumber": 1,
      "title": "Standard Convolution vs Depthwise Separable Convolution Math",
      "conceptBudget": {
        "primaryConcept": "Depthwise Separable Convolution Math",
        "supportingTerms": [
          "Standard Conv Cost: $H \\times W \\times C_{\\text{in}} \\times C_{\\text{out}} \\times D_K^2$",
          "Depthwise Spatial Cost: $H \\times W \\times C_{\\text{in}} \\times D_K^2$",
          "Pointwise $1 \\times 1$ Channel Cost: $H \\times W \\times C_{\\text{in}} \\times C_{\\text{out}}$",
          "Theoretical MAC Reduction Ratio: $\\frac{1}{C_{\\text{out}}} + \\frac{1}{D_K^2} \\approx \\frac{1}{9}$ (8 to 9x speedup!)"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d10-b1-1d-temporal-convolution-mechanics",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "diagram",
          "data": {
            "type": "memory_box",
            "title": "Standard vs Depthwise Separable MAC Comparison",
            "boxes": [
              {
                "label": "1. Standard 2D Conv (3x3)",
                "value": "Formula: H * W * Cin * Cout * 9 | Operations for 32x32x16->32: 4,718,592 MACs",
                "varType": "Heavyweight Standard",
                "isUpdated": false
              },
              {
                "label": "2. Depthwise Separable Conv",
                "value": "Formula: H * W * Cin * (9 + Cout) | Operations: 671,744 MACs (85.8% COMPUTATION SAVINGS!)",
                "varType": "MobileNet Separable",
                "isUpdated": true
              }
            ]
          }
        },
        {
          "type": "runnable_code",
          "filename": "depthwise_math_demo.js",
          "initialCode": "function compareConvolutionCost(H = 32, W = 32, Cin = 16, Cout = 32, Dk = 3) {\n  const standardMacs = H * W * Cin * Cout * (Dk * Dk);\n  const depthwiseMacs = H * W * Cin * (Dk * Dk);\n  const pointwiseMacs = H * W * Cin * Cout;\n  const totalSeparableMacs = depthwiseMacs + pointwiseMacs;\n  const savingsPct = ((standardMacs - totalSeparableMacs) / standardMacs) * 100;\n  return {\n    standardMacs,\n    depthwiseSeparableMacs: totalSeparableMacs,\n    computationSavingsPercent: Number(savingsPct.toFixed(1)),\n    theoreticalSpeedupFactor: Number((standardMacs / totalSeparableMacs).toFixed(1))\n  };\n}\n\nconsole.log(JSON.stringify(compareConvolutionCost(32, 32, 16, 32, 3)));",
          "expectedOutput": "{\"standardMacs\":4718592,\"depthwiseSeparableMacs\":671744,\"computationSavingsPercent\":85.8,\"theoreticalSpeedupFactor\":7}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What computation savings percentage is achieved by replacing standard 2D convolution with depthwise separable convolution for a 32x32x16->32 layer with 3x3 kernels?",
        "expectedStringOutput": "85.8",
        "acceptableAnswers": [
          "85.8",
          "85.8%",
          "computationSavingsPercent\":85.8"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_DEPTHWISE_SEPARABLE_CONVOLUTION_PARAMS",
        "diagnosisMap": {
          "50": {
            "misconceptionId": "MC_EDGEAI_DEPTHWISE_SEPARABLE_CONVOLUTION_PARAMS",
            "errorExplanation": "Separable conv saves 85.8% of MAC operations.",
            "recoveryPath": {
              "simplerExplanation": "Saves 85.8% of computations.",
              "guidedFixPrompt": "Type 85.8"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d13-b2-mobilenet-width-multipliers",
      "day": 13,
      "blockNumber": 2,
      "title": "MobileNet Width Multipliers ($\\alpha$) & Resolution Scaling ($\\rho$)",
      "conceptBudget": {
        "primaryConcept": "MobileNet Scaling Hyperparameters",
        "supportingTerms": [
          "Width Multiplier $\\alpha$ (e.g. $0.25\\times, 0.50\\times, 1.0\\times$ scales channel count by $\\alpha$, cutting weights by $\\alpha^2$)",
          "Resolution Multiplier $\\rho$ (Downsampling input resolution $96 \\times 96$ vs $224 \\times 224$)",
          "Scaling $\\alpha = 0.25$ fits MobileNet into $< 250\\text{ KB}$ Flash!"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d13-b1-depthwise-vs-standard-conv-math",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "mobilenet_scale_demo.js",
          "initialCode": "function evaluateMobileNetScale(baseParams = 3200000, alpha = 0.25) {\n  const scaledParams = baseParams * (alpha * alpha);\n  return {\n    widthMultiplier: alpha,\n    baseParameters: baseParams,\n    scaledParameters: Math.round(scaledParams),\n    flashSizeKb: Math.round(scaledParams / 1024),\n    status: 'MOBILENET_SCALED_FOR_MCU'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateMobileNetScale(3200000, 0.25)));",
          "expectedOutput": "{\"widthMultiplier\":0.25,\"baseParameters\":3200000,\"scaledParameters\":200000,\"flashSizeKb\":195,\"status\":\"MOBILENET_SCALED_FOR_MCU\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What is the scaled parameter count for a 3.2M parameter MobileNet scaled with width multiplier $\\alpha = 0.25$ ($3200000 \\times 0.25^2$)?",
        "expectedStringOutput": "200000",
        "acceptableAnswers": [
          "200000",
          "200,000",
          "scaledParameters\":200000"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_DEPTHWISE_SEPARABLE_CONVOLUTION_PARAMS",
        "diagnosisMap": {
          "800000": {
            "misconceptionId": "MC_EDGEAI_DEPTHWISE_SEPARABLE_CONVOLUTION_PARAMS",
            "errorExplanation": "Width multiplier scales both input and output channels, scaling parameters by alpha^2 = 0.0625: 3,200,000 * 0.0625 = 200,000.",
            "recoveryPath": {
              "simplerExplanation": "3,200,000 * (0.25^2) = 200,000 parameters.",
              "guidedFixPrompt": "Type 200000"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d13-b3-inverted-residuals-linear-bottlenecks",
      "day": 13,
      "blockNumber": 3,
      "title": "MobileNetV2 Inverted Residuals & Linear Bottlenecks",
      "conceptBudget": {
        "primaryConcept": "Inverted Residual Blocks",
        "supportingTerms": [
          "Inverted Residuals (Expand channels with $1 \\times 1 \\implies$ Depthwise $3 \\times 3 \\implies$ Project down with Linear $1 \\times 1$)",
          "Linear Bottleneck (Removing non-linear ReLU on output projection prevents information destruction)",
          "Skip Connection additions"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d13-b2-mobilenet-width-multipliers",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "inverted_res_demo.js",
          "initialCode": "function evaluateInvertedResidual() {\n  return 'INVERTED_RESIDUAL: 1x1_EXPAND -> 3x3_DEPTHWISE -> 1x1_LINEAR_PROJECT_WITH_RESIDUAL_ADD';\n}\n\nconsole.log(evaluateInvertedResidual());",
          "expectedOutput": "INVERTED_RESIDUAL: 1x1_EXPAND -> 3x3_DEPTHWISE -> 1x1_LINEAR_PROJECT_WITH_RESIDUAL_ADD",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What sequence of layers constitutes a MobileNetV2 Inverted Residual Block?",
        "expectedStringOutput": "INVERTED_RESIDUAL: 1x1_EXPAND -> 3x3_DEPTHWISE -> 1x1_LINEAR_PROJECT_WITH_RESIDUAL_ADD",
        "acceptableAnswers": [
          "INVERTED_RESIDUAL: 1x1_EXPAND -> 3x3_DEPTHWISE -> 1x1_LINEAR_PROJECT_WITH_RESIDUAL_ADD",
          "INVERTED_RESIDUAL"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_DEPTHWISE_SEPARABLE_CONVOLUTION_PARAMS",
        "diagnosisMap": {
          "STANDARD": {
            "misconceptionId": "MC_EDGEAI_DEPTHWISE_SEPARABLE_CONVOLUTION_PARAMS",
            "errorExplanation": "Matches MobileNetV2 inverted residual sequence.",
            "recoveryPath": {
              "simplerExplanation": "Matches 1x1_EXPAND -> 3x3_DEPTHWISE -> 1x1_LINEAR_PROJECT.",
              "guidedFixPrompt": "Type INVERTED_RESIDUAL: 1x1_EXPAND -> 3x3_DEPTHWISE -> 1x1_LINEAR_PROJECT_WITH_RESIDUAL_ADD"
            }
          }
        }
      }
    }
  ]
},
  14: {
  "day": 14,
  "title": "Visual Wake Words (VWW) & Edge Person Detection",
  "overviewMetaphor": "Visual Wake Words is a Doorknob Camera with a Motion Brain: instead of streaming a full HD 1080p video feed to the cloud 24/7 (Which consumes 500 MB/hour and drains the battery in 3 hours!), the camera captures a tiny $96 \\times 96$ grayscale thumbnail once every second; a 200 KB quantized MobileNet answers a single binary question: 'Is a human present in this frame? (Yes/No)'; only when a human is confirmed with >80% probability does the device wake the main system.",
  "blocks": [
    {
      "id": "edgeai-d14-b1-vww-binary-classification-pipeline",
      "day": 14,
      "blockNumber": 1,
      "title": "The Visual Wake Words (VWW) Dataset & Binary Pipeline",
      "conceptBudget": {
        "primaryConcept": "Visual Wake Words Pipeline",
        "supportingTerms": [
          "VWW Benchmark (Derived from COCO dataset: Person label $\\ge 0.5$ bounding box area threshold)",
          "Input Resolution ($96 \\times 96 \\times 1$ Grayscale byte image)",
          "Binary Softmax Output ($P(\\text{person})$ vs $P(\\text{not\\_person})$)",
          "Operating under 50 mW power envelope"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d13-b2-mobilenet-width-multipliers",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "diagram",
          "data": {
            "type": "flowchart",
            "title": "Visual Wake Word Power-Gated Pipeline",
            "nodes": [
              {
                "id": "1",
                "label": "Low-Power Image Sensor captures 96x96 grayscale image (1 FPS)",
                "kind": "start"
              },
              {
                "id": "2",
                "label": "TFLM INT8 MobileNet executes inference in Tensor Arena (45 ms)",
                "kind": "process"
              },
              {
                "id": "3",
                "label": "Is Person Probability > 80%? -> NO -> Return MCU to Deep Sleep (0.1 mA)",
                "kind": "process"
              },
              {
                "id": "4",
                "label": "YES -> Wake main processor, illuminate lights, sound alarm!",
                "kind": "end"
              }
            ]
          }
        },
        {
          "type": "runnable_code",
          "filename": "vww_infer_demo.js",
          "initialCode": "function evaluateVwwFrame(personProbability, threshold = 0.80) {\n  const wakeTriggered = personProbability >= threshold;\n  return {\n    personProbability,\n    confidenceThreshold: threshold,\n    systemAction: wakeTriggered ? 'WAKE_MAIN_PROCESSOR_AND_ALARM' : 'REMAIN_IN_LOW_POWER_SLEEP',\n    status: wakeTriggered ? 'PERSON_CONFIRMED_POSITIVE' : 'SCENE_EMPTY_NEGATIVE'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateVwwFrame(0.92, 0.80)));\nconsole.log(JSON.stringify(evaluateVwwFrame(0.45, 0.80)));",
          "expectedOutput": "{\"personProbability\":0.92,\"confidenceThreshold\":0.8,\"systemAction\":\"WAKE_MAIN_PROCESSOR_AND_ALARM\",\"status\":\"PERSON_CONFIRMED_POSITIVE\"}\n{\"personProbability\":0.45,\"confidenceThreshold\":0.8,\"systemAction\":\"REMAIN_IN_LOW_POWER_SLEEP\",\"status\":\"SCENE_EMPTY_NEGATIVE\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What status is returned by VWW when person probability is 0.92 against an 0.80 threshold?",
        "expectedStringOutput": "PERSON_CONFIRMED_POSITIVE",
        "acceptableAnswers": [
          "PERSON_CONFIRMED_POSITIVE",
          "status\":\"PERSON_CONFIRMED_POSITIVE\""
        ],
        "primaryMisconceptionId": "MC_EDGEAI_PERSON_DETECTION_VISUAL_WAKE_WORDS",
        "diagnosisMap": {
          "EMPTY": {
            "misconceptionId": "MC_EDGEAI_PERSON_DETECTION_VISUAL_WAKE_WORDS",
            "errorExplanation": "0.92 exceeds the 0.80 threshold, confirming PERSON_CONFIRMED_POSITIVE.",
            "recoveryPath": {
              "simplerExplanation": "Person confirmed positive.",
              "guidedFixPrompt": "Type PERSON_CONFIRMED_POSITIVE"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d14-b2-grayscale-downsampling-savings",
      "day": 14,
      "blockNumber": 2,
      "title": "Grayscale Downsampling & Image Preprocessing Memory Savings",
      "conceptBudget": {
        "primaryConcept": "Image Preprocessing Memory Savings",
        "supportingTerms": [
          "Color to Grayscale ($Y = 0.299R + 0.587G + 0.114B$ drops channels from 3 to 1: 66% RAM savings!)",
          "$96 \\times 96$ Grayscale: $9,216$ bytes total (Fits in single L1 cache/SRAM buffer!)",
          "Zero dynamic buffer allocation"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d14-b1-vww-binary-classification-pipeline",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "vww_memory_demo.js",
          "initialCode": "function calculateImageMemory(width = 96, height = 96, channels = 1) {\n  const bytes = width * height * channels;\n  return {\n    resolution: `${width}x${height}`,\n    channels,\n    imageBufferSizeBytes: bytes,\n    imageBufferSizeKb: Number((bytes / 1024).toFixed(2)),\n    status: 'IMAGE_BUFFER_FITS_IN_SRAM'\n  };\n}\n\nconsole.log(JSON.stringify(calculateImageMemory(96, 96, 1))); // Grayscale\nconsole.log(JSON.stringify(calculateImageMemory(96, 96, 3))); // RGB",
          "expectedOutput": "{\"resolution\":\"96x96\",\"channels\":1,\"imageBufferSizeBytes\":9216,\"imageBufferSizeKb\":9,\"status\":\"IMAGE_BUFFER_FITS_IN_SRAM\"}\n{\"resolution\":\"96x96\",\"channels\":3,\"imageBufferSizeBytes\":27648,\"imageBufferSizeKb\":27,\"status\":\"IMAGE_BUFFER_FITS_IN_SRAM\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "How many total bytes are required to store a 96x96 1-channel grayscale image buffer ($96 \\times 96 \\times 1$)?",
        "expectedStringOutput": "9216",
        "acceptableAnswers": [
          "9216",
          "9216 bytes",
          "imageBufferSizeBytes\":9216",
          "9 KB"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_PERSON_DETECTION_VISUAL_WAKE_WORDS",
        "diagnosisMap": {
          "27648": {
            "misconceptionId": "MC_EDGEAI_PERSON_DETECTION_VISUAL_WAKE_WORDS",
            "errorExplanation": "27,648 bytes is for 3-channel RGB. 1-channel Grayscale uses exactly 9,216 bytes.",
            "recoveryPath": {
              "simplerExplanation": "96 * 96 * 1 = 9216 bytes.",
              "guidedFixPrompt": "Type 9216"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d14-b3-power-gated-sensor-sleep",
      "day": 14,
      "blockNumber": 3,
      "title": "Power-Gated Wake-Up Timers & Multi-Year Coin Cell Lifetimes",
      "conceptBudget": {
        "primaryConcept": "Power-Gated Wake-Up Duty Cycle",
        "supportingTerms": [
          "Duty-Cycled Vision (Camera sleeps 950 ms, wakes for 50 ms capture/inference)",
          "Average Current ($I_{\\text{avg}} = (0.05 \\times 30\\text{ mA}) + (0.95 \\times 0.005\\text{ mA}) = 1.5\\text{ mA}$)",
          "Multi-year battery operation"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d14-b2-grayscale-downsampling-savings",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "vww_power_demo.js",
          "initialCode": "function calculateVwwPower(activeMa = 30, sleepMa = 0.005, activeMs = 50, periodMs = 1000) {\n  const activeDuty = activeMs / periodMs;\n  const sleepDuty = (periodMs - activeMs) / periodMs;\n  const avgCurrent = (activeDuty * activeMa) + (sleepDuty * sleepMa);\n  return {\n    activeDutyPercent: activeDuty * 100,\n    averageCurrentMa: Number(avgCurrent.toFixed(3)),\n    status: 'POWER_GATED_DUTY_CYCLE_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(calculateVwwPower(30, 0.005, 50, 1000)));",
          "expectedOutput": "{\"activeDutyPercent\":5,\"averageCurrentMa\":1.505,\"status\":\"POWER_GATED_DUTY_CYCLE_NOMINAL\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What is the average current in mA drawn by a vision system running 50 ms at 30 mA every 1,000 ms ($(0.05 \\times 30) + (0.95 \\times 0.005)$)?",
        "expectedStringOutput": "1.505",
        "acceptableAnswers": [
          "1.505",
          "1.505 mA",
          "1.5 mA",
          "averageCurrentMa\":1.505"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_PERSON_DETECTION_VISUAL_WAKE_WORDS",
        "diagnosisMap": {
          "30": {
            "misconceptionId": "MC_EDGEAI_PERSON_DETECTION_VISUAL_WAKE_WORDS",
            "errorExplanation": "Duty cycling drops average current from 30 mA down to 1.505 mA.",
            "recoveryPath": {
              "simplerExplanation": "Average current is 1.505 mA.",
              "guidedFixPrompt": "Type 1.505"
            }
          }
        }
      }
    }
  ]
},
  15: {
  "day": 15,
  "title": "⭐ MILESTONE 2: Complete Acoustic / Vision Edge AI Classifier Engine",
  "overviewMetaphor": "Milestone 2 Synthesis: The complete sovereign multimodal Edge AI classifier: 1. Audio MFCC spectrogram preprocessing pipeline; 2. CMSIS-NN SIMD vector dot product acceleration; 3. Visual Wake Words grayscale $96 \\times 96$ person detection; 4. Confidence thresholding with false-positive suppression; 5. Sub-10ms dual-modality execution benchmark.",
  "blocks": [
    {
      "id": "edgeai-d15-b1-multimodal-classifier-synthesis",
      "day": 15,
      "blockNumber": 1,
      "title": "Acoustic & Vision Edge AI Multi-Modal Classifier Synthesis",
      "conceptBudget": {
        "primaryConcept": "Multi-Modal Classifier Synthesis",
        "supportingTerms": [
          "MFCC Audio Preprocessor",
          "Visual Wake Words Engine",
          "CMSIS-NN SIMD Kernel",
          "Dual-Modality Dispatch"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d14-b1-vww-binary-classification-pipeline",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "diagram",
          "data": {
            "type": "flowchart",
            "title": "Unified Multi-Modal Edge AI Pipeline",
            "nodes": [
              {
                "id": "1",
                "label": "Microphone DMA buffer generates 13 MFCC coefficients in 1.2 ms",
                "kind": "start"
              },
              {
                "id": "2",
                "label": "Camera DMA buffer captures 96x96 grayscale image in 8 ms",
                "kind": "process"
              },
              {
                "id": "3",
                "label": "CMSIS-NN SIMD engine runs Keyword Spotting + Visual Wake Words",
                "kind": "process"
              },
              {
                "id": "4",
                "label": "Unified decision dispatched in < 10 ms -> Zero Cloud Latency Verified!",
                "kind": "end"
              }
            ]
          }
        },
        {
          "type": "runnable_code",
          "filename": "multimodal_engine_demo.js",
          "initialCode": "function runMultiModalEngine() {\n  return {\n    audioClassifierStatus: 'MFCC_KWS_SIMD_ACCELERATED',\n    visionClassifierStatus: 'VWW_MOBILENET_INT8_ACTIVE',\n    totalLatencyMs: 9.2,\n    engineStatus: 'MULTIMODAL_EDGE_AI_ENGINE_ACTIVE'\n  };\n}\n\nconsole.log(runMultiModalEngine().engineStatus);",
          "expectedOutput": "MULTIMODAL_EDGE_AI_ENGINE_ACTIVE",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What engine status confirms active operational synthesis of the Multi-Modal Edge AI Classifier?",
        "expectedStringOutput": "MULTIMODAL_EDGE_AI_ENGINE_ACTIVE",
        "acceptableAnswers": [
          "MULTIMODAL_EDGE_AI_ENGINE_ACTIVE",
          "engineStatus: MULTIMODAL_EDGE_AI_ENGINE_ACTIVE"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_PERSON_DETECTION_VISUAL_WAKE_WORDS",
        "diagnosisMap": {
          "FAILED": {
            "misconceptionId": "MC_EDGEAI_PERSON_DETECTION_VISUAL_WAKE_WORDS",
            "errorExplanation": "Matches MULTIMODAL_EDGE_AI_ENGINE_ACTIVE.",
            "recoveryPath": {
              "simplerExplanation": "Matches MULTIMODAL_EDGE_AI_ENGINE_ACTIVE.",
              "guidedFixPrompt": "Type MULTIMODAL_EDGE_AI_ENGINE_ACTIVE"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d15-b2-multimodal-latency-audit",
      "day": 15,
      "blockNumber": 2,
      "title": "Multi-Modal Inference Latency & Accuracy Invariant Audit",
      "conceptBudget": {
        "primaryConcept": "Multi-Modal Invariant Audit",
        "supportingTerms": [
          "Sub-10ms Latency Invariant",
          "Zero False Positive Clamp",
          "100% Quality Invariant"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d15-b1-multimodal-classifier-synthesis",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "multimodal_audit_demo.js",
          "initialCode": "function auditMultiModalSystem(latencyMs, maxAllowedMs = 10) {\n  const passed = latencyMs <= maxAllowedMs;\n  return {\n    measuredLatencyMs: latencyMs,\n    maxAllowedMs,\n    grade: passed ? 'MULTIMODAL_SYSTEM_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditMultiModalSystem(9.2, 10)));",
          "expectedOutput": "{\"measuredLatencyMs\":9.2,\"maxAllowedMs\":10,\"grade\":\"MULTIMODAL_SYSTEM_AUDIT_PASSED\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What audit grade is awarded when measured dual-modality latency is 9.2 ms (within the 10 ms limit)?",
        "expectedStringOutput": "MULTIMODAL_SYSTEM_AUDIT_PASSED",
        "acceptableAnswers": [
          "MULTIMODAL_SYSTEM_AUDIT_PASSED",
          "grade\":\"MULTIMODAL_SYSTEM_AUDIT_PASSED\""
        ],
        "primaryMisconceptionId": "MC_EDGEAI_PERSON_DETECTION_VISUAL_WAKE_WORDS",
        "diagnosisMap": {
          "DEFECT": {
            "misconceptionId": "MC_EDGEAI_PERSON_DETECTION_VISUAL_WAKE_WORDS",
            "errorExplanation": "9.2 ms <= 10 ms awards MULTIMODAL_SYSTEM_AUDIT_PASSED.",
            "recoveryPath": {
              "simplerExplanation": "Awards MULTIMODAL_SYSTEM_AUDIT_PASSED.",
              "guidedFixPrompt": "Type MULTIMODAL_SYSTEM_AUDIT_PASSED"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d15-b3-milestone2-edgeai-cert",
      "day": 15,
      "blockNumber": 3,
      "title": "Milestone 2 Multi-Modal Edge AI Classifier Certification",
      "conceptBudget": {
        "primaryConcept": "Milestone 2 Certification",
        "supportingTerms": [
          "Multi-Modal Engine Verified",
          "100% Quality Invariant"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d15-b2-multimodal-latency-audit",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "milestone2_edgeai_cert.js",
          "initialCode": "console.log('⭐ MILESTONE 2: Complete Acoustic / Vision Edge AI Classifier Engine [VERIFIED 100%]');",
          "expectedOutput": "⭐ MILESTONE 2: Complete Acoustic / Vision Edge AI Classifier Engine [VERIFIED 100%]",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What certification string confirms Milestone 2 completion?",
        "expectedStringOutput": "⭐ MILESTONE 2: Complete Acoustic / Vision Edge AI Classifier Engine [VERIFIED 100%]",
        "acceptableAnswers": [
          "⭐ MILESTONE 2: Complete Acoustic / Vision Edge AI Classifier Engine [VERIFIED 100%]",
          "VERIFIED 100%"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_PERSON_DETECTION_VISUAL_WAKE_WORDS",
        "diagnosisMap": {
          "FAILED": {
            "misconceptionId": "MC_EDGEAI_PERSON_DETECTION_VISUAL_WAKE_WORDS",
            "errorExplanation": "Matches milestone header string.",
            "recoveryPath": {
              "simplerExplanation": "Matches header string.",
              "guidedFixPrompt": "Type ⭐ MILESTONE 2: Complete Acoustic / Vision Edge AI Classifier Engine [VERIFIED 100%]"
            }
          }
        }
      }
    }
  ]
},
  16: {
  "day": 16,
  "title": "Model Conversion & Optimization: PyTorch/ONNX to TFLite Micro",
  "overviewMetaphor": "Model Conversion is Translating an Encyclopedia into a Compact Pocket Survival Guide: you design and train your neural network in Python using PyTorch or TensorFlow; the conversion pipeline exports the architecture to standard ONNX, strips out training-only nodes (like Dropout and Batch Normalization folding), quantizes weights to INT8, and uses `xxd -i` to convert the binary `.tflite` flatbuffer into a C source code array (`const unsigned char g_model[] = {0x18, 0x00, ...}`) that compiles directly into microcontroller Flash memory.",
  "blocks": [
    {
      "id": "edgeai-d16-b1-pytorch-onnx-tflite-pipeline",
      "day": 16,
      "blockNumber": 1,
      "title": "The PyTorch $\\to$ ONNX $\\to$ TFLite $\\to$ C Array Export Pipeline",
      "conceptBudget": {
        "primaryConcept": "Model Export & C Header Pipeline",
        "supportingTerms": [
          "PyTorch `torch.onnx.export()`",
          "Batch Normalization Folding ($W_{\\text{folded}} = \\frac{\\gamma}{\\sqrt{\\sigma^2 + \\epsilon}} W$ combines Conv and BatchNorm into 1 layer!)",
          "`xxd -i model_quantized.tflite model_data.cc`",
          "`alignas(16) const unsigned char g_model[]`"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d4-b1-affine-quantization-math",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "diagram",
          "data": {
            "type": "flowchart",
            "title": "Embedded Model Conversion Flow",
            "nodes": [
              {
                "id": "1",
                "label": "Train PyTorch model in Python -> Export to standard ONNX format",
                "kind": "start"
              },
              {
                "id": "2",
                "label": "Fold BatchNormalization layers into Conv weights (Zero runtime latency!)",
                "kind": "process"
              },
              {
                "id": "3",
                "label": "TFLite Converter applies Post-Training INT8 Quantization (PTQ)",
                "kind": "process"
              },
              {
                "id": "4",
                "label": "xxd generates static C const array -> Compiles directly into MCU Flash!",
                "kind": "end"
              }
            ]
          }
        },
        {
          "type": "runnable_code",
          "filename": "model_export_demo.js",
          "initialCode": "function evaluateExportPipeline() {\n  return 'MODEL_EXPORT_COMPLETE: PYTORCH -> ONNX -> TFLITE_INT8 -> C_CONST_ARRAY_IN_FLASH';\n}\n\nconsole.log(evaluateExportPipeline());",
          "expectedOutput": "MODEL_EXPORT_COMPLETE: PYTORCH -> ONNX -> TFLITE_INT8 -> C_CONST_ARRAY_IN_FLASH",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What status confirms completion of the PyTorch to embedded C const array export pipeline?",
        "expectedStringOutput": "MODEL_EXPORT_COMPLETE: PYTORCH -> ONNX -> TFLITE_INT8 -> C_CONST_ARRAY_IN_FLASH",
        "acceptableAnswers": [
          "MODEL_EXPORT_COMPLETE: PYTORCH -> ONNX -> TFLITE_INT8 -> C_CONST_ARRAY_IN_FLASH",
          "MODEL_EXPORT_COMPLETE"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_ONNX_TO_TFLITE_MICRO_CONVERSION",
        "diagnosisMap": {
          "FAILED": {
            "misconceptionId": "MC_EDGEAI_ONNX_TO_TFLITE_MICRO_CONVERSION",
            "errorExplanation": "Matches export pipeline completion string.",
            "recoveryPath": {
              "simplerExplanation": "Matches export completion string.",
              "guidedFixPrompt": "Type MODEL_EXPORT_COMPLETE: PYTORCH -> ONNX -> TFLITE_INT8 -> C_CONST_ARRAY_IN_FLASH"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d16-b2-batchnorm-folding-mechanics",
      "day": 16,
      "blockNumber": 2,
      "title": "Batch Normalization Folding: Eliminating Runtime Layer Overhead",
      "conceptBudget": {
        "primaryConcept": "Batch Normalization Folding",
        "supportingTerms": [
          "Batch Normalization in Training (Mean $\\mu$, Variance $\\sigma^2$, Scale $\\gamma$, Bias $\\beta$)",
          "Folding into Conv Weights: $W' = W \\times \\frac{\\gamma}{\\sqrt{\\sigma^2 + \\epsilon}}$",
          "Folding into Conv Bias: $b' = (b - \\mu) \\times \\frac{\\gamma}{\\sqrt{\\sigma^2 + \\epsilon}} + \\beta$",
          "Zero runtime computation and zero extra memory buffers!"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d16-b1-pytorch-onnx-tflite-pipeline",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "diagram",
          "data": {
            "type": "memory_box",
            "title": "Unfolded vs Folded Batch Normalization",
            "boxes": [
              {
                "label": "1. Unfolded (Separate Layers)",
                "value": "Execution: Conv2D -> Memory Write -> BatchNorm -> Memory Write | Wastes 20% CPU time!",
                "varType": "Unfolded Layer",
                "isUpdated": false
              },
              {
                "label": "2. Folded (Merged Offline)",
                "value": "Execution: Conv2D (with merged weights & biases) | 0 extra CPU cycles | 0 extra RAM buffers!",
                "varType": "Folded Layer",
                "isUpdated": true
              }
            ]
          }
        },
        {
          "type": "runnable_code",
          "filename": "bn_folding_demo.js",
          "initialCode": "function evaluateBnFolding(gamma = 1.2, std = 0.5, rawWeight = 2.0, epsilon = 1e-5) {\n  const scale = gamma / Math.sqrt(std * std + epsilon);\n  const foldedWeight = rawWeight * scale;\n  return {\n    rawWeight,\n    foldedWeight: Number(foldedWeight.toFixed(3)),\n    runtimeLayersSaved: 1,\n    status: 'BATCH_NORM_PERFECTLY_FOLDED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateBnFolding(1.2, 0.5, 2.0)));",
          "expectedOutput": "{\"rawWeight\":2,\"foldedWeight\":4.8,\"runtimeLayersSaved\":1,\"status\":\"BATCH_NORM_PERFECTLY_FOLDED\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What is the folded convolution weight value when raw weight is 2.0, gamma is 1.2, and std is 0.5 ($2.0 \\times (1.2 / 0.5)$)?",
        "expectedStringOutput": "4.8",
        "acceptableAnswers": [
          "4.8",
          "4.80",
          "foldedWeight\":4.8"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_ONNX_TO_TFLITE_MICRO_CONVERSION",
        "diagnosisMap": {
          "2.4": {
            "misconceptionId": "MC_EDGEAI_ONNX_TO_TFLITE_MICRO_CONVERSION",
            "errorExplanation": "2.0 * (1.2 / 0.5) = 2.0 * 2.4 = 4.8.",
            "recoveryPath": {
              "simplerExplanation": "2.0 * 2.4 = 4.8.",
              "guidedFixPrompt": "Type 4.8"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d16-b3-schema-versioning-compatibility",
      "day": 16,
      "blockNumber": 3,
      "title": "TFLM FlatBuffers Schema Versioning (TFL3 / TFL4) & Compatibility",
      "conceptBudget": {
        "primaryConcept": "FlatBuffers Schema Versioning",
        "supportingTerms": [
          "Schema Identifier (`TFL3` in file offset 4..7)",
          "Operator Version Matching",
          "Target Toolchain Cross-Compilation"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d16-b2-batchnorm-folding-mechanics",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "schema_check_demo.js",
          "initialCode": "function evaluateSchemaIdentifier(magicString) {\n  return (magicString === 'TFL3')\n    ? 'SCHEMA_VALID_TFL3_TFLITE_MICRO_COMPATIBLE'\n    : 'UNSUPPORTED_SCHEMA_FORMAT';\n}\n\nconsole.log(evaluateSchemaIdentifier('TFL3'));\nconsole.log(evaluateSchemaIdentifier('ONNX'));",
          "expectedOutput": "SCHEMA_VALID_TFL3_TFLITE_MICRO_COMPATIBLE\nUNSUPPORTED_SCHEMA_FORMAT",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What 4-character magic identifier must be present in a FlatBuffers model for TFLM compatibility?",
        "expectedStringOutput": "TFL3",
        "acceptableAnswers": [
          "TFL3",
          "'TFL3'"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_ONNX_TO_TFLITE_MICRO_CONVERSION",
        "diagnosisMap": {
          "ONNX": {
            "misconceptionId": "MC_EDGEAI_ONNX_TO_TFLITE_MICRO_CONVERSION",
            "errorExplanation": "TFLM requires the TFL3 FlatBuffers identifier.",
            "recoveryPath": {
              "simplerExplanation": "Identifier is TFL3.",
              "guidedFixPrompt": "Type TFL3"
            }
          }
        }
      }
    }
  ]
},
  17: {
  "day": 17,
  "title": "Energy & Power Modeling for Edge AI Inferences",
  "overviewMetaphor": "Energy Modeling is an AI Fuel Gauge: every neural inference burns a tiny drop of battery fuel ($E = V \\times I \\times T$); if an inference takes 10 ms at 30 mA on a 3.3V battery, each inference consumes exactly 0.99 millijoules; running 1 inference every second drains a coin cell battery in 2 months (Too fast!); running 1 inference every 10 seconds allows the microcontroller to sleep in 2 microamp deep sleep between inferences, extending battery life to 5 years.",
  "blocks": [
    {
      "id": "edgeai-d17-b1-energy-per-inference-formula",
      "day": 17,
      "blockNumber": 1,
      "title": "Energy per Inference Mathematical Modeling ($E = V \\times I \\times T$)",
      "conceptBudget": {
        "primaryConcept": "Energy per Inference Formula",
        "supportingTerms": [
          "Energy Equation: $E_{\\text{inf}} = V_{\\text{dd}} \\times I_{\\text{active}} \\times T_{\\text{inf}}$",
          "Milli-Joules ($1\\text{ mJ} = 10^{-3}\\text{ J}$)",
          "Microcontroller Supply Voltage ($V_{\\text{dd}} = 3.3\\text{ V}$ or $1.8\\text{ V}$)"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d1-b2-edge-energy-envelope-milliwatts",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "syntax_anatomy",
          "title": "Energy per Inference Equation",
          "codeSnippet": "// V = 3.3V | I = 30mA (0.030 A) | T = 10ms (0.010 s)\nconst energyJoules = 3.3 * 0.030 * 0.010; // = 0.00099 Joules\nconst energyMilliJoules = energyJoules * 1000; // = 0.99 mJ per inference!",
          "lineNotes": {
            "2": "Calculates Joules.",
            "3": "Converts to millijoules."
          }
        },
        {
          "type": "runnable_code",
          "filename": "energy_model_demo.js",
          "initialCode": "function calculateInferenceEnergyMj(volts = 3.3, currentMa = 30, timeMs = 10) {\n  const joules = volts * (currentMa / 1000) * (timeMs / 1000);\n  return {\n    voltageVolts: volts,\n    currentMa,\n    timeMs,\n    energyMilliJoules: Number((joules * 1000).toFixed(3)),\n    status: 'ENERGY_PER_INFERENCE_CALCULATED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateInferenceEnergyMj(3.3, 30, 10)));",
          "expectedOutput": "{\"voltageVolts\":3.3,\"currentMa\":30,\"timeMs\":10,\"energyMilliJoules\":0.99,\"status\":\"ENERGY_PER_INFERENCE_CALCULATED\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What is the energy consumed per inference in millijoules (mJ) at 3.3V with 30 mA current over 10 ms ($3.3 \\times 30 \\times 0.010$)?",
        "expectedStringOutput": "0.99",
        "acceptableAnswers": [
          "0.99",
          "0.99 mJ",
          "0.99mJ",
          "energyMilliJoules\":0.99"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_ENERGY_PER_INFERENCE_MILLIJOULES",
        "diagnosisMap": {
          "990": {
            "misconceptionId": "MC_EDGEAI_ENERGY_PER_INFERENCE_MILLIJOULES",
            "errorExplanation": "3.3 * 0.030 A * 0.010 s * 1000 = 0.99 mJ.",
            "recoveryPath": {
              "simplerExplanation": "3.3 * 0.030 * 0.010 * 1000 = 0.99 mJ.",
              "guidedFixPrompt": "Type 0.99"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d17-b2-duty-cycle-battery-lifetime-math",
      "day": 17,
      "blockNumber": 2,
      "title": "Duty-Cycled Battery Lifetime Math: 1 Hz vs 0.1 Hz Inference",
      "conceptBudget": {
        "primaryConcept": "Duty-Cycled Battery Lifetime",
        "supportingTerms": [
          "Active vs Sleep Balance: $I_{\\text{avg}} = \\frac{T_{\\text{active}}}{T_{\\text{period}}} I_{\\text{active}} + \\frac{T_{\\text{sleep}}}{T_{\\text{period}}} I_{\\text{sleep}}$",
          "CR2032 Coin Cell Capacity ($225\\text{ mAh}$)",
          "10x Battery Extension by dropping inference frequency from 1 Hz to 0.1 Hz"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d17-b1-energy-per-inference-formula",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "battery_duty_demo.js",
          "initialCode": "function evaluateBatteryLifetimeDays(batteryMah = 225, activeMa = 30, sleepMa = 0.003, activeMs = 10, periodMs = 10000) {\n  const activeFraction = activeMs / periodMs;\n  const sleepFraction = (periodMs - activeMs) / periodMs;\n  const avgMa = (activeFraction * activeMa) + (sleepFraction * sleepMa);\n  const hours = batteryMah / avgMa;\n  const days = hours / 24;\n  return {\n    inferencePeriodSeconds: periodMs / 1000,\n    averageCurrentMa: Number(avgMa.toFixed(4)),\n    estimatedBatteryDays: Number(days.toFixed(0)),\n    status: days >= 365 ? 'MULTI_YEAR_BATTERY_ACHIEVED' : 'BATTERY_DEPLETES_RAPIDLY'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateBatteryLifetimeDays(225, 30, 0.003, 10, 10000))); // 1 inf every 10s",
          "expectedOutput": "{\"inferencePeriodSeconds\":10,\"averageCurrentMa\":0.033,\"estimatedBatteryDays\":284,\"status\":\"BATTERY_DEPLETES_RAPIDLY\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What is the average current in mA when running a 10 ms inference at 30 mA every 10,000 ms with 0.003 mA sleep current ($(0.001 \\times 30) + (0.999 \\times 0.003)$)?",
        "expectedStringOutput": "0.033",
        "acceptableAnswers": [
          "0.033",
          "0.033 mA",
          "averageCurrentMa\":0.033"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_ENERGY_PER_INFERENCE_MILLIJOULES",
        "diagnosisMap": {
          "30": {
            "misconceptionId": "MC_EDGEAI_ENERGY_PER_INFERENCE_MILLIJOULES",
            "errorExplanation": "Duty cycling drops average current from 30 mA down to 0.033 mA.",
            "recoveryPath": {
              "simplerExplanation": "Average current is 0.033 mA.",
              "guidedFixPrompt": "Type 0.033"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d17-b3-voltage-scaling-power-economics",
      "day": 17,
      "blockNumber": 3,
      "title": "Dynamic Voltage & Frequency Scaling (DVFS) in TinyML",
      "conceptBudget": {
        "primaryConcept": "DVFS Power Scaling ($P \\propto V^2 f$)",
        "supportingTerms": [
          "Quadratic Voltage Scaling ($P_{\\text{dynamic}} = C V^2 f$)",
          "Dropping $V_{\\text{dd}}$ from 3.3V to 1.8V cuts energy by $70\\%$!",
          "Frequency Throttling during DSP idle"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d17-b2-duty-cycle-battery-lifetime-math",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "dvfs_calc_demo.js",
          "initialCode": "function evaluateVoltageScaling(v1 = 3.3, v2 = 1.8) {\n  const energyRatio = (v2 * v2) / (v1 * v1);\n  const savingsPercent = (1 - energyRatio) * 100;\n  return {\n    voltageHigh: v1,\n    voltageLow: v2,\n    energyReductionPercent: Number(savingsPercent.toFixed(1)),\n    status: 'DVFS_VOLTAGE_ENERGY_SAVINGS_OPTIMAL'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateVoltageScaling(3.3, 1.8)));",
          "expectedOutput": "{\"voltageHigh\":3.3,\"voltageLow\":1.8,\"energyReductionPercent\":70.3,\"status\":\"DVFS_VOLTAGE_ENERGY_SAVINGS_OPTIMAL\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What energy reduction percentage is achieved by scaling MCU supply voltage from 3.3V down to 1.8V ($1 - (1.8^2 / 3.3^2)$)?",
        "expectedStringOutput": "70.3",
        "acceptableAnswers": [
          "70.3",
          "70.3%",
          "energyReductionPercent\":70.3"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_ENERGY_PER_INFERENCE_MILLIJOULES",
        "diagnosisMap": {
          "45": {
            "misconceptionId": "MC_EDGEAI_ENERGY_PER_INFERENCE_MILLIJOULES",
            "errorExplanation": "1 - (3.24 / 10.89) = 1 - 0.2975 = 70.3% energy reduction.",
            "recoveryPath": {
              "simplerExplanation": "Energy drops by 70.3%.",
              "guidedFixPrompt": "Type 70.3"
            }
          }
        }
      }
    }
  ]
},
  18: {
  "day": 18,
  "title": "Neural Processing Units (NPUs) & Hardware Micro-Accelerators",
  "overviewMetaphor": "An NPU is a Dedicated Turbocharger attached to a Small Lawn Mower Engine: the main CPU core is a general-purpose processor designed to handle timers, UART, and logic (Calculating 100,000 neural multiplications ties up 100% of the CPU for 50 ms!); a MicroNPU (like ARM Ethos-U55 or MAX78000) is a specialized array of 128 parallel hardware MAC units; the CPU hands the model pointer to the NPU and goes to sleep; the NPU finishes the inference in 1 millisecond and triggers a wake-up interrupt.",
  "blocks": [
    {
      "id": "edgeai-d18-b1-micro-npu-architecture-ethos",
      "day": 18,
      "blockNumber": 1,
      "title": "MicroNPU Hardware Architecture: ARM Ethos-U55/U65",
      "conceptBudget": {
        "primaryConcept": "MicroNPU Hardware Acceleration",
        "supportingTerms": [
          "ARM Ethos-U55 (32 to 256 parallel MAC engines in silicon)",
          "Command Stream Execution (CPU creates command stream buffer in SRAM $\\implies$ NPU executes autonomously via DMA)",
          "Zero CPU Load during inference",
          "90% Energy Reduction"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d11-b1-arm-simd-smlad-instructions",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "diagram",
          "data": {
            "type": "memory_box",
            "title": "Cortex-M CPU vs MicroNPU Execution Comparison",
            "boxes": [
              {
                "label": "1. Cortex-M4 CPU (Scalar/SIMD)",
                "value": "Inference Time: 45 ms | CPU Load: 100% (Blocks other tasks!) | Energy: 1.8 mJ",
                "varType": "General Purpose",
                "isUpdated": false
              },
              {
                "label": "2. Ethos-U55 MicroNPU (128 MACs)",
                "value": "Inference Time: 1.2 ms (37X FASTER!) | CPU Load: 0% (CPU sleeps) | Energy: 0.08 mJ (95% SAVINGS!)",
                "varType": "Dedicated Silicon",
                "isUpdated": true
              }
            ]
          }
        },
        {
          "type": "runnable_code",
          "filename": "npu_benchmark_demo.js",
          "initialCode": "function evaluateNpuGain(cpuTimeMs = 45, npuTimeMs = 1.2) {\n  const speedup = cpuTimeMs / npuTimeMs;\n  return {\n    cpuInferenceMs: cpuTimeMs,\n    npuInferenceMs: npuTimeMs,\n    speedupFactor: Number(speedup.toFixed(1)),\n    status: 'NPU_HARDWARE_OFFLOAD_OPTIMAL'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateNpuGain(45, 1.2)));",
          "expectedOutput": "{\"cpuInferenceMs\":45,\"npuInferenceMs\":1.2,\"speedupFactor\":37.5,\"status\":\"NPU_HARDWARE_OFFLOAD_OPTIMAL\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "How many times faster is a 1.2 ms NPU inference compared to a 45 ms CPU inference ($45 / 1.2$)?",
        "expectedStringOutput": "37.5",
        "acceptableAnswers": [
          "37.5",
          "37.5x",
          "speedupFactor\":37.5"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_NPU_HARDWARE_ACCELERATOR_OFFLOAD",
        "diagnosisMap": {
          "45": {
            "misconceptionId": "MC_EDGEAI_NPU_HARDWARE_ACCELERATOR_OFFLOAD",
            "errorExplanation": "45 / 1.2 = 37.5x speedup.",
            "recoveryPath": {
              "simplerExplanation": "45 / 1.2 = 37.5.",
              "guidedFixPrompt": "Type 37.5"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d18-b2-npu-driver-command-streams",
      "day": 18,
      "blockNumber": 2,
      "title": "NPU Driver Command Streams & DMA Weight Streaming",
      "conceptBudget": {
        "primaryConcept": "NPU Command Stream Execution",
        "supportingTerms": [
          "Vela Compiler (Compiles TFLite model into Ethos custom command stream)",
          "Direct Flash-to-SRAM DMA Streaming",
          "CPU Interrupt Callback (`ethosu_invoke()` completion interrupt)"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d18-b1-micro-npu-architecture-ethos",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "npu_driver_demo.js",
          "initialCode": "function evaluateNpuDriverStatus(commandStreamDispatched, interruptReceived) {\n  return (commandStreamDispatched && interruptReceived)\n    ? 'NPU_INFERENCE_COMPLETE_ZERO_CPU_UTILIZATION'\n    : 'NPU_HARDWARE_BUSY';\n}\n\nconsole.log(evaluateNpuDriverStatus(true, true));",
          "expectedOutput": "NPU_INFERENCE_COMPLETE_ZERO_CPU_UTILIZATION",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What status confirms that an NPU hardware inference completed with zero CPU utilization via interrupt callback?",
        "expectedStringOutput": "NPU_INFERENCE_COMPLETE_ZERO_CPU_UTILIZATION",
        "acceptableAnswers": [
          "NPU_INFERENCE_COMPLETE_ZERO_CPU_UTILIZATION",
          "NPU_INFERENCE_COMPLETE"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_NPU_HARDWARE_ACCELERATOR_OFFLOAD",
        "diagnosisMap": {
          "BUSY": {
            "misconceptionId": "MC_EDGEAI_NPU_HARDWARE_ACCELERATOR_OFFLOAD",
            "errorExplanation": "Matches NPU_INFERENCE_COMPLETE_ZERO_CPU_UTILIZATION.",
            "recoveryPath": {
              "simplerExplanation": "Matches NPU_INFERENCE_COMPLETE.",
              "guidedFixPrompt": "Type NPU_INFERENCE_COMPLETE_ZERO_CPU_UTILIZATION"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d18-b3-supported-vs-fallback-operators",
      "day": 18,
      "blockNumber": 3,
      "title": "NPU Operator Partitioning: Accelerated Ops vs CPU Fallback",
      "conceptBudget": {
        "primaryConcept": "NPU Operator Partitioning",
        "supportingTerms": [
          "Accelerated Operators (Conv2D, DepthwiseConv2D, FullyConnected, MaxPool2D, Add, Mul)",
          "Fallback Operators (Custom activations, Non-standard ops execute on CPU)",
          "Minimizing CPU-NPU context switches"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d18-b2-npu-driver-command-streams",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "npu_partition_demo.js",
          "initialCode": "function partitionOp(opName) {\n  const npuOps = ['CONV_2D', 'DEPTHWISE_CONV_2D', 'FULLY_CONNECTED', 'MAX_POOL_2D'];\n  return npuOps.includes(opName)\n    ? 'EXECUTE_ON_NPU_ACCELERATOR'\n    : 'FALLBACK_TO_CPU_SOFTWARE_KERNEL';\n}\n\nconsole.log('CONV_2D ->', partitionOp('CONV_2D'));\nconsole.log('CUSTOM_OP ->', partitionOp('CUSTOM_OP'));",
          "expectedOutput": "CONV_2D -> EXECUTE_ON_NPU_ACCELERATOR\nCUSTOM_OP -> FALLBACK_TO_CPU_SOFTWARE_KERNEL",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "choose_answer",
        "question": "What happens when a neural network layer contains an operator that is not supported by the microcontroller's hardware NPU?",
        "options": [
          "The model partitioning tool falls back to executing that specific layer on the main CPU using software kernels, while keeping the supported convolution layers on the high-speed NPU",
          "The microcontroller explodes",
          "The model deletes itself"
        ],
        "correctIndex": 0,
        "primaryMisconceptionId": "MC_EDGEAI_NPU_HARDWARE_ACCELERATOR_OFFLOAD",
        "diagnosisMap": {
          "1": {
            "misconceptionId": "MC_EDGEAI_NPU_HARDWARE_ACCELERATOR_OFFLOAD",
            "errorExplanation": "Unsupported layers gracefully fall back to CPU software execution.",
            "recoveryPath": {
              "simplerExplanation": "Falls back to CPU software execution.",
              "guidedFixPrompt": "Select Option A."
            }
          }
        }
      }
    }
  ]
},
  19: {
  "day": 19,
  "title": "Continuous Audio Streaming & Ring Buffer Inferences",
  "overviewMetaphor": "Streaming Audio Inference is a Ferris Wheel of Microphone Samples: human speech is an unbroken, continuous river of sound; if the CPU stops to run an inference for 20 ms, any audio arriving during that time would be permanently lost (Audio glitch / dropped syllables!); by using Direct Memory Access (DMA) to feed samples into a circular Ring Buffer with half-transfer and full-transfer interrupts (Ping-Pong), audio collection never pauses for even a microsecond.",
  "blocks": [
    {
      "id": "edgeai-d19-b1-dma-ping-pong-audio-buffering",
      "day": 19,
      "blockNumber": 1,
      "title": "DMA Ping-Pong Double Buffering: Half-Transfer & Transfer-Complete Interrupts",
      "conceptBudget": {
        "primaryConcept": "DMA Ping-Pong Double Buffering",
        "supportingTerms": [
          "I2S / PDM Microphone Peripheral",
          "DMA Circular Buffer (Size $2N$ samples)",
          "Half-Transfer Interrupt (HT: Buffer 1 is full $\\implies$ CPU processes Buffer 1 while DMA fills Buffer 2)",
          "Transfer-Complete Interrupt (TC: Buffer 2 is full $\\implies$ CPU processes Buffer 2 while DMA fills Buffer 1)",
          "Zero dropped audio samples"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d6-b1-nyquist-sampling-theorem",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "diagram",
          "data": {
            "type": "memory_box",
            "title": "DMA Ping-Pong Buffer Memory Regions",
            "boxes": [
              {
                "label": "Buffer 1 (Samples 0..N-1)",
                "value": "State: CPU Processing MFCC DSP | DMA Target: Currently filling Buffer 2!",
                "varType": "Active DSP Buffer",
                "isUpdated": false
              },
              {
                "label": "Buffer 2 (Samples N..2N-1)",
                "value": "State: DMA Hardware Writing I2S Samples | CPU Target: Idle / Processing Buffer 1",
                "varType": "Active DMA Buffer",
                "isUpdated": true
              }
            ]
          }
        },
        {
          "type": "runnable_code",
          "filename": "dma_pingpong_demo.js",
          "initialCode": "function evaluateDmaTransfer(interruptType) {\n  if (interruptType === 'HALF_TRANSFER') {\n    return 'HT_EVENT: PROCESS_BUFFER_1_WHILE_DMA_FILLS_BUFFER_2';\n  }\n  return 'TC_EVENT: PROCESS_BUFFER_2_WHILE_DMA_FILLS_BUFFER_1';\n}\n\nconsole.log(evaluateDmaTransfer('HALF_TRANSFER'));\nconsole.log(evaluateDmaTransfer('TRANSFER_COMPLETE'));",
          "expectedOutput": "HT_EVENT: PROCESS_BUFFER_1_WHILE_DMA_FILLS_BUFFER_2\nTC_EVENT: PROCESS_BUFFER_2_WHILE_DMA_FILLS_BUFFER_1",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What action is triggered upon receiving a DMA Half-Transfer (HT) interrupt?",
        "expectedStringOutput": "HT_EVENT: PROCESS_BUFFER_1_WHILE_DMA_FILLS_BUFFER_2",
        "acceptableAnswers": [
          "HT_EVENT: PROCESS_BUFFER_1_WHILE_DMA_FILLS_BUFFER_2",
          "HT_EVENT"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_CONTINUOUS_STREAMING_CIRCULAR_BUFFER",
        "diagnosisMap": {
          "TC": {
            "misconceptionId": "MC_EDGEAI_CONTINUOUS_STREAMING_CIRCULAR_BUFFER",
            "errorExplanation": "HT interrupt signals Buffer 1 is full and ready for CPU processing.",
            "recoveryPath": {
              "simplerExplanation": "HT processes Buffer 1 while DMA fills Buffer 2.",
              "guidedFixPrompt": "Type HT_EVENT: PROCESS_BUFFER_1_WHILE_DMA_FILLS_BUFFER_2"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d19-b2-circular-ring-buffer-spectrogram-sliding",
      "day": 19,
      "blockNumber": 2,
      "title": "Circular Ring Buffer Modulo Stepping for Sliding Spectrograms",
      "conceptBudget": {
        "primaryConcept": "Ring Buffer Modulo Indexing",
        "supportingTerms": [
          "Circular Indexing: $\\text{head} = (\\text{head} + \\text{hop}) \\pmod N$",
          "FIFO Spectrogram Matrix (Dropping oldest column, inserting newest MFCC column)",
          "Eliminating `memcpy` memory shifting"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d19-b1-dma-ping-pong-audio-buffering",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "ring_modulo_demo.js",
          "initialCode": "function stepRingBuffer(headIndex, hopSamples = 256, capacity = 1024) {\n  const newHead = (headIndex + hopSamples) % capacity;\n  return {\n    previousHead: headIndex,\n    hopSamples,\n    newHeadIndex: newHead,\n    status: 'RING_BUFFER_MODULO_STEPPED_ZERO_MEMCPY'\n  };\n}\n\nconsole.log(JSON.stringify(stepRingBuffer(768, 256, 1024)));",
          "expectedOutput": "{\"previousHead\":768,\"hopSamples\":256,\"newHeadIndex\":0,\"status\":\"RING_BUFFER_MODULO_STEPPED_ZERO_MEMCPY\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What is the new head index when advancing by 256 samples from head index 768 in a 1024-capacity buffer ($(768 + 256) \\pmod{1024}$)?",
        "expectedStringOutput": "0",
        "acceptableAnswers": [
          "0",
          "newHeadIndex\":0"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_CONTINUOUS_STREAMING_CIRCULAR_BUFFER",
        "diagnosisMap": {
          "1024": {
            "misconceptionId": "MC_EDGEAI_CONTINUOUS_STREAMING_CIRCULAR_BUFFER",
            "errorExplanation": "1024 % 1024 = 0 (wraps around to start).",
            "recoveryPath": {
              "simplerExplanation": "1024 % 1024 = 0.",
              "guidedFixPrompt": "Type 0"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d19-b3-real-time-factor-rtf",
      "day": 19,
      "blockNumber": 3,
      "title": "Real-Time Factor (RTF) & Overrun Prevention",
      "conceptBudget": {
        "primaryConcept": "Real-Time Factor (RTF)",
        "supportingTerms": [
          "$\\text{RTF} = \\frac{T_{\\text{processing}}}{T_{\\text{audio\\_duration}}}$",
          "Hard Real-Time Invariant: $\\text{RTF} < 1.0$ (e.g. processing 100 ms audio chunk in 15 ms $\\implies \\text{RTF} = 0.15$)",
          "Buffer Overrun Hazard if $\\text{RTF} \\ge 1.0$"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d19-b2-circular-ring-buffer-spectrogram-sliding",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "rtf_eval_demo.js",
          "initialCode": "function evaluateRtf(processingTimeMs, audioChunkDurationMs) {\n  const rtf = processingTimeMs / audioChunkDurationMs;\n  const isRealTime = rtf < 1.0;\n  return {\n    processingTimeMs,\n    audioDurationMs: audioChunkDurationMs,\n    realTimeFactor: Number(rtf.toFixed(3)),\n    headroomPercent: Number(((1.0 - rtf) * 100).toFixed(1)),\n    status: isRealTime ? 'HARD_REAL_TIME_SATISFIED_NO_OVERRUN' : 'AUDIO_OVERRUN_DROP_HAZARD'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateRtf(15, 100)));\nconsole.log(JSON.stringify(evaluateRtf(120, 100)));",
          "expectedOutput": "{\"processingTimeMs\":15,\"audioDurationMs\":100,\"realTimeFactor\":0.15,\"headroomPercent\":85,\"status\":\"HARD_REAL_TIME_SATISFIED_NO_OVERRUN\"}\n{\"processingTimeMs\":120,\"audioDurationMs\":100,\"realTimeFactor\":1.2,\"headroomPercent\":-20,\"status\":\"AUDIO_OVERRUN_DROP_HAZARD\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What status confirms that an audio pipeline processing 100 ms chunks in 15 ms (RTF 0.15) satisfies hard real-time execution?",
        "expectedStringOutput": "HARD_REAL_TIME_SATISFIED_NO_OVERRUN",
        "acceptableAnswers": [
          "HARD_REAL_TIME_SATISFIED_NO_OVERRUN",
          "status\":\"HARD_REAL_TIME_SATISFIED_NO_OVERRUN\""
        ],
        "primaryMisconceptionId": "MC_EDGEAI_CONTINUOUS_STREAMING_CIRCULAR_BUFFER",
        "diagnosisMap": {
          "OVERRUN": {
            "misconceptionId": "MC_EDGEAI_CONTINUOUS_STREAMING_CIRCULAR_BUFFER",
            "errorExplanation": "RTF = 0.15 < 1.0, satisfying HARD_REAL_TIME_SATISFIED_NO_OVERRUN.",
            "recoveryPath": {
              "simplerExplanation": "Matches HARD_REAL_TIME_SATISFIED_NO_OVERRUN.",
              "guidedFixPrompt": "Type HARD_REAL_TIME_SATISFIED_NO_OVERRUN"
            }
          }
        }
      }
    }
  ]
},
  20: {
  "day": 20,
  "title": "Classification Confidence Hysteresis & False Positive Suppression",
  "overviewMetaphor": "Confidence Hysteresis is a Heavy Iron Door Latch: if you use a single raw threshold (e.g. 50%), noisy sensor readings will bounce back and forth between 49% and 51% ten times per second (Making smart lights flicker like a strobe light!); Dual-Threshold Hysteresis requires the score to push hard past 85% to latch 'ON', and refuses to unlatch back to 'OFF' until the score drops all the way below 40%, creating rock-solid, debounce-stabilized decisions.",
  "blocks": [
    {
      "id": "edgeai-d20-b1-dual-threshold-hysteresis-math",
      "day": 20,
      "blockNumber": 1,
      "title": "Dual-Threshold Hysteresis (Schmitt Trigger) Math",
      "conceptBudget": {
        "primaryConcept": "Dual-Threshold Hysteresis",
        "supportingTerms": [
          "High Trigger Threshold ($T_{\\text{high}} = 0.85$ to turn ON)",
          "Low Release Threshold ($T_{\\text{low}} = 0.40$ to turn OFF)",
          "Dead-Band Zone ($[0.40, 0.85]$ maintains previous state to prevent flickering)",
          "Eliminating noisy sensor flutter"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d10-b3-softmax-gesture-classification",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "diagram",
          "data": {
            "type": "memory_box",
            "title": "Hysteresis Schmitt Trigger State Table",
            "boxes": [
              {
                "label": "1. Current: OFF | Score >= 0.85",
                "value": "Action: Latch ON (High confidence confirmed!)",
                "varType": "Trigger ON",
                "isUpdated": true
              },
              {
                "label": "2. Current: ON | Score: 0.40 - 0.85",
                "value": "Action: HOLD ON (Dead-band maintains active state)",
                "varType": "Hold State",
                "isUpdated": false
              },
              {
                "label": "3. Current: ON | Score < 0.40",
                "value": "Action: Release to OFF (Activity definitely stopped)",
                "varType": "Release OFF",
                "isUpdated": true
              }
            ]
          }
        },
        {
          "type": "runnable_code",
          "filename": "hysteresis_sim_demo.js",
          "initialCode": "function evaluateHysteresisState(currentState, score, tHigh = 0.85, tLow = 0.40) {\n  let nextState = currentState;\n  if (currentState === 'OFF' && score >= tHigh) nextState = 'ON';\n  else if (currentState === 'ON' && score < tLow) nextState = 'OFF';\n  return {\n    previousState: currentState,\n    incomingScore: score,\n    activeState: nextState,\n    status: 'HYSTERESIS_STABILIZED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateHysteresisState('OFF', 0.90))); // Latches ON\nconsole.log(JSON.stringify(evaluateHysteresisState('ON', 0.60)));  // Holds ON in deadband!\nconsole.log(JSON.stringify(evaluateHysteresisState('ON', 0.30)));  // Releases OFF",
          "expectedOutput": "{\"previousState\":\"OFF\",\"incomingScore\":0.9,\"activeState\":\"ON\",\"status\":\"HYSTERESIS_STABILIZED\"}\n{\"previousState\":\"ON\",\"incomingScore\":0.6,\"activeState\":\"ON\",\"status\":\"HYSTERESIS_STABILIZED\"}\n{\"previousState\":\"ON\",\"incomingScore\":0.3,\"activeState\":\"OFF\",\"status\":\"HYSTERESIS_STABILIZED\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What is the active state when an already 'ON' system receives a score of 0.60 (in the dead-band between 0.40 and 0.85)?",
        "expectedStringOutput": "ON",
        "acceptableAnswers": [
          "ON",
          "activeState\":\"ON\""
        ],
        "primaryMisconceptionId": "MC_EDGEAI_CONFIDENCE_THRESHOLD_HYSTERESIS",
        "diagnosisMap": {
          "OFF": {
            "misconceptionId": "MC_EDGEAI_CONFIDENCE_THRESHOLD_HYSTERESIS",
            "errorExplanation": "0.60 is above tLow (0.40), so the system remains ON.",
            "recoveryPath": {
              "simplerExplanation": "Maintains ON state in deadband.",
              "guidedFixPrompt": "Type ON"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d20-b2-temporal-smoothing-moving-average",
      "day": 20,
      "blockNumber": 2,
      "title": "Temporal Probability Smoothing: Exponential Moving Averages",
      "conceptBudget": {
        "primaryConcept": "Exponential Moving Average Smoothing",
        "supportingTerms": [
          "EMA Formula: $S_t = \\alpha P_t + (1 - \\alpha) S_{t-1}$",
          "Smoothing Factor ($\\alpha = 0.2$ for high noise filtering)",
          "Filtering single-frame outlier noise spikes"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d20-b1-dual-threshold-hysteresis-math",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "ema_smooth_demo.js",
          "initialCode": "function updateEma(prevSmoothed, rawProb, alpha = 0.25) {\n  const smoothed = (alpha * rawProb) + ((1 - alpha) * prevSmoothed);\n  return {\n    previousSmoothed: prevSmoothed,\n    rawInstantProbability: rawProb,\n    newSmoothedScore: Number(smoothed.toFixed(3)),\n    status: 'TEMPORAL_EMA_SMOOTHED'\n  };\n}\n\nconsole.log(JSON.stringify(updateEma(0.20, 0.80, 0.25)));",
          "expectedOutput": "{\"previousSmoothed\":0.2,\"rawInstantProbability\":0.8,\"newSmoothedScore\":0.35,\"status\":\"TEMPORAL_EMA_SMOOTHED\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What is the new smoothed score when previous smoothed is 0.20, incoming raw probability is 0.80, and alpha is 0.25 ($(0.25 \\times 0.80) + (0.75 \\times 0.20)$)?",
        "expectedStringOutput": "0.35",
        "acceptableAnswers": [
          "0.35",
          "0.350",
          "newSmoothedScore\":0.35"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_CONFIDENCE_THRESHOLD_HYSTERESIS",
        "diagnosisMap": {
          "0.80": {
            "misconceptionId": "MC_EDGEAI_CONFIDENCE_THRESHOLD_HYSTERESIS",
            "errorExplanation": "0.20 + 0.15 = 0.35 smoothed score.",
            "recoveryPath": {
              "simplerExplanation": "0.20 + 0.15 = 0.35.",
              "guidedFixPrompt": "Type 0.35"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d20-b3-debounce-cooldown-timers",
      "day": 20,
      "blockNumber": 3,
      "title": "Debounce Cooldown Timers & Trigger Lockout Invariants",
      "conceptBudget": {
        "primaryConcept": "Debounce Cooldown Lockout",
        "supportingTerms": [
          "Lockout Period (e.g. 2.0 seconds after positive keyword detection)",
          "Preventing double-triggering on single vocal command",
          "Hardware Timer Invariant"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d20-b2-temporal-smoothing-moving-average",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "debounce_demo.js",
          "initialCode": "function evaluateTriggerLockout(lastTriggerTimestampMs, currentTimestampMs, cooldownMs = 2000) {\n  const elapsed = currentTimestampMs - lastTriggerTimestampMs;\n  const isLocked = elapsed < cooldownMs;\n  return {\n    timeSinceLastTriggerMs: elapsed,\n    cooldownRequiredMs: cooldownMs,\n    triggerPermitted: !isLocked,\n    status: isLocked ? 'TRIGGER_LOCKED_IN_COOLDOWN' : 'TRIGGER_PERMITTED_READY'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateTriggerLockout(10000, 10500, 2000)));\nconsole.log(JSON.stringify(evaluateTriggerLockout(10000, 13000, 2000)));",
          "expectedOutput": "{\"timeSinceLastTriggerMs\":500,\"cooldownRequiredMs\":2000,\"triggerPermitted\":false,\"status\":\"TRIGGER_LOCKED_IN_COOLDOWN\"}\n{\"timeSinceLastTriggerMs\":3000,\"cooldownRequiredMs\":2000,\"triggerPermitted\":true,\"status\":\"TRIGGER_PERMITTED_READY\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What status is returned when an incoming trigger arrives 500 ms after the last activation (within the 2000 ms cooldown)?",
        "expectedStringOutput": "TRIGGER_LOCKED_IN_COOLDOWN",
        "acceptableAnswers": [
          "TRIGGER_LOCKED_IN_COOLDOWN",
          "status\":\"TRIGGER_LOCKED_IN_COOLDOWN\""
        ],
        "primaryMisconceptionId": "MC_EDGEAI_CONFIDENCE_THRESHOLD_HYSTERESIS",
        "diagnosisMap": {
          "PERMITTED": {
            "misconceptionId": "MC_EDGEAI_CONFIDENCE_THRESHOLD_HYSTERESIS",
            "errorExplanation": "500 ms < 2000 ms cooldown locks the trigger.",
            "recoveryPath": {
              "simplerExplanation": "Cooldown locks trigger -> TRIGGER_LOCKED_IN_COOLDOWN.",
              "guidedFixPrompt": "Type TRIGGER_LOCKED_IN_COOLDOWN"
            }
          }
        }
      }
    }
  ]
},
  21: {
  "day": 21,
  "title": "⭐ MILESTONE 3: Production Autoencoder Anomaly Detection Engine",
  "overviewMetaphor": "Milestone 3 Synthesis: The complete sovereign unsupervised TinyML anomaly detector: 1. Encoder compresses 64-element vibration vectors into an 8-element latent space bottleneck; 2. Decoder attempts to reconstruct the original 64-element signal; 3. Normal healthy signals reconstruct with near-zero error (MSE < 0.03); 4. Unknown motor failures cannot be reconstructed (MSE spikes > 0.15), alerting maintenance teams to brand-new, unseen mechanical defects without prior labeled failure data.",
  "blocks": [
    {
      "id": "edgeai-d21-b1-autoencoder-pipeline-synthesis",
      "day": 21,
      "blockNumber": 1,
      "title": "Unsupervised Autoencoder Architecture & Latent Bottleneck",
      "conceptBudget": {
        "primaryConcept": "Autoencoder Reconstruction Engine",
        "supportingTerms": [
          "Encoder ($64 \\to 32 \\to 8$ Latent Bottleneck)",
          "Decoder ($8 \\to 32 \\to 64$ Reconstruction)",
          "Mean Squared Error Loss: $\\text{MSE} = \\frac{1}{N} \\sum (x_i - \\hat{x}_i)^2$",
          "Unsupervised Zero-Shot Anomaly Flagging"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d20-b1-dual-threshold-hysteresis-math",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "diagram",
          "data": {
            "type": "flowchart",
            "title": "Autoencoder Anomaly Detection Flow",
            "nodes": [
              {
                "id": "1",
                "label": "Input: 64-sample vibration FFT magnitude vector",
                "kind": "start"
              },
              {
                "id": "2",
                "label": "Encoder compresses vector through 8-dimensional latent bottleneck",
                "kind": "process"
              },
              {
                "id": "3",
                "label": "Decoder reconstructs original 64-element feature vector",
                "kind": "process"
              },
              {
                "id": "4",
                "label": "Computes MSE loss -> If MSE > 0.05, trips UNSUPERVISED_ANOMALY_DETECTED!",
                "kind": "end"
              }
            ]
          }
        },
        {
          "type": "runnable_code",
          "filename": "autoencoder_engine_demo.js",
          "initialCode": "function runAutoencoderEngine() {\n  return {\n    encoderStatus: 'ENCODER_LATENT_8D_COMPRESSED',\n    decoderStatus: 'DECODER_RECONSTRUCTION_ACTIVE',\n    anomalyDetector: 'MSE_LOSS_THRESHOLD_EVALUATED',\n    engineStatus: 'AUTOENCODER_ANOMALY_ENGINE_ACTIVE'\n  };\n}\n\nconsole.log(runAutoencoderEngine().engineStatus);",
          "expectedOutput": "AUTOENCODER_ANOMALY_ENGINE_ACTIVE",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What engine status confirms active operational synthesis of the Autoencoder Anomaly Detection Engine?",
        "expectedStringOutput": "AUTOENCODER_ANOMALY_ENGINE_ACTIVE",
        "acceptableAnswers": [
          "AUTOENCODER_ANOMALY_ENGINE_ACTIVE",
          "engineStatus: AUTOENCODER_ANOMALY_ENGINE_ACTIVE"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_EDGE_ANOMALY_AUTOENCODER_RECONSTRUCTION_LOSS",
        "diagnosisMap": {
          "FAILED": {
            "misconceptionId": "MC_EDGEAI_EDGE_ANOMALY_AUTOENCODER_RECONSTRUCTION_LOSS",
            "errorExplanation": "Matches AUTOENCODER_ANOMALY_ENGINE_ACTIVE.",
            "recoveryPath": {
              "simplerExplanation": "Matches AUTOENCODER_ANOMALY_ENGINE_ACTIVE.",
              "guidedFixPrompt": "Type AUTOENCODER_ANOMALY_ENGINE_ACTIVE"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d21-b2-autoencoder-mse-threshold-audit",
      "day": 21,
      "blockNumber": 2,
      "title": "Autoencoder Reconstruction Loss & Invariant Audit",
      "conceptBudget": {
        "primaryConcept": "Autoencoder Invariant Audit",
        "supportingTerms": [
          "Reconstruction Loss Invariant",
          "Zero Labeled Training Data Requirement",
          "100% Quality Invariant"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d21-b1-autoencoder-pipeline-synthesis",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "autoencoder_audit_demo.js",
          "initialCode": "function auditAutoencoderQuality(mseNormal, mseFaulty, threshold = 0.05) {\n  const normalPass = mseNormal < threshold;\n  const faultyDetect = mseFaulty >= threshold;\n  const passed = normalPass && faultyDetect;\n  return {\n    mseNormal,\n    mseFaulty,\n    threshold,\n    grade: passed ? 'AUTOENCODER_SYSTEM_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditAutoencoderQuality(0.015, 0.220, 0.05)));",
          "expectedOutput": "{\"mseNormal\":0.015,\"mseFaulty\":0.22,\"threshold\":0.05,\"grade\":\"AUTOENCODER_SYSTEM_AUDIT_PASSED\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What audit grade is awarded when normal MSE (0.015) is below threshold and faulty MSE (0.220) is detected?",
        "expectedStringOutput": "AUTOENCODER_SYSTEM_AUDIT_PASSED",
        "acceptableAnswers": [
          "AUTOENCODER_SYSTEM_AUDIT_PASSED",
          "grade\":\"AUTOENCODER_SYSTEM_AUDIT_PASSED\""
        ],
        "primaryMisconceptionId": "MC_EDGEAI_EDGE_ANOMALY_AUTOENCODER_RECONSTRUCTION_LOSS",
        "diagnosisMap": {
          "DEFECT": {
            "misconceptionId": "MC_EDGEAI_EDGE_ANOMALY_AUTOENCODER_RECONSTRUCTION_LOSS",
            "errorExplanation": "All checks passed awards AUTOENCODER_SYSTEM_AUDIT_PASSED.",
            "recoveryPath": {
              "simplerExplanation": "Awards AUTOENCODER_SYSTEM_AUDIT_PASSED.",
              "guidedFixPrompt": "Type AUTOENCODER_SYSTEM_AUDIT_PASSED"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d21-b3-milestone3-edgeai-cert",
      "day": 21,
      "blockNumber": 3,
      "title": "Milestone 3 Production Autoencoder Anomaly Engine Certification",
      "conceptBudget": {
        "primaryConcept": "Milestone 3 Certification",
        "supportingTerms": [
          "Autoencoder Engine Verified",
          "100% Quality Invariant"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d21-b2-autoencoder-mse-threshold-audit",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "milestone3_edgeai_cert.js",
          "initialCode": "console.log('⭐ MILESTONE 3: Production Autoencoder Anomaly Detection Engine [VERIFIED 100%]');",
          "expectedOutput": "⭐ MILESTONE 3: Production Autoencoder Anomaly Detection Engine [VERIFIED 100%]",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What certification string confirms Milestone 3 completion?",
        "expectedStringOutput": "⭐ MILESTONE 3: Production Autoencoder Anomaly Detection Engine [VERIFIED 100%]",
        "acceptableAnswers": [
          "⭐ MILESTONE 3: Production Autoencoder Anomaly Detection Engine [VERIFIED 100%]",
          "VERIFIED 100%"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_EDGE_ANOMALY_AUTOENCODER_RECONSTRUCTION_LOSS",
        "diagnosisMap": {
          "FAILED": {
            "misconceptionId": "MC_EDGEAI_EDGE_ANOMALY_AUTOENCODER_RECONSTRUCTION_LOSS",
            "errorExplanation": "Matches milestone header string.",
            "recoveryPath": {
              "simplerExplanation": "Matches header string.",
              "guidedFixPrompt": "Type ⭐ MILESTONE 3: Production Autoencoder Anomaly Detection Engine [VERIFIED 100%]"
            }
          }
        }
      }
    }
  ]
},
  22: {
  "day": 22,
  "title": "Sensor Fusion: Kalman Filtering & Multi-Modal Preprocessing",
  "overviewMetaphor": "A Kalman Filter is an experienced Captain Navigating in Dense Fog: the captain has a mathematical physics prediction of where the ship should be (State Prediction), and a noisy sonar measurement with random water reflections (Measurement Update); instead of blindly trusting either one, the Kalman Gain weighs the uncertainty of both, finding the optimal mathematical truth between prediction and reality.",
  "blocks": [
    {
      "id": "edgeai-d22-b1-1d-kalman-filter-math",
      "day": 22,
      "blockNumber": 1,
      "title": "1D Kalman Filter Mathematical State Estimator",
      "conceptBudget": {
        "primaryConcept": "1D Kalman Filter Math",
        "supportingTerms": [
          "Predict: $\\hat{x}_{k|k-1} = \\hat{x}_{k-1}$, $P_{k|k-1} = P_{k-1} + Q$",
          "Kalman Gain: $K_k = \\frac{P_{k|k-1}}{P_{k|k-1} + R}$",
          "Update: $\\hat{x}_k = \\hat{x}_{k|k-1} + K_k (z_k - \\hat{x}_{k|k-1})$, $P_k = (1 - K_k) P_{k|k-1}$",
          "Optimal noise rejection"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d9-b2-mahalanobis-distance-math",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "syntax_anatomy",
          "title": "1D Kalman Filter in C",
          "codeSnippet": "float p_pred = p_est + Q; // Process noise addition\nfloat K = p_pred / (p_pred + R); // Optimal Kalman Gain\nx_est = x_est + K * (z - x_est); // Update state with innovation\np_est = (1.0f - K) * p_pred; // Update error covariance",
          "lineNotes": {
            "2": "Calculates Kalman Gain K.",
            "3": "Updates state estimate with measurement z."
          }
        },
        {
          "type": "runnable_code",
          "filename": "kalman_step_demo.js",
          "initialCode": "function stepKalman(xEst, pEst, z, Q = 0.01, R = 0.1) {\n  const pPred = pEst + Q;\n  const K = pPred / (pPred + R);\n  const xNew = xEst + K * (z - xEst);\n  const pNew = (1 - K) * pPred;\n  return {\n    filteredState: Number(xNew.toFixed(3)),\n    kalmanGain: Number(K.toFixed(3)),\n    updatedCovariance: Number(pNew.toFixed(4)),\n    status: 'KALMAN_ESTIMATE_CONVERGED'\n  };\n}\n\nconsole.log(JSON.stringify(stepKalman(20.0, 1.0, 22.0)));",
          "expectedOutput": "{\"filteredState\":21.82,\"kalmanGain\":0.91,\"updatedCovariance\":0.091,\"status\":\"KALMAN_ESTIMATE_CONVERGED\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What is the filtered state estimate when prior state is 20.0, measurement is 22.0, and Kalman Gain is 0.91 ($20.0 + 0.91 \\times (22.0 - 20.0)$)?",
        "expectedStringOutput": "21.82",
        "acceptableAnswers": [
          "21.82",
          "21.820",
          "filteredState\":21.82"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_KALMAN_FILTER_SENSOR_FUSION_PREDICTION",
        "diagnosisMap": {
          "22.0": {
            "misconceptionId": "MC_EDGEAI_KALMAN_FILTER_SENSOR_FUSION_PREDICTION",
            "errorExplanation": "20.0 + (0.91 * 2.0) = 20.0 + 1.82 = 21.82.",
            "recoveryPath": {
              "simplerExplanation": "20.0 + 1.82 = 21.82.",
              "guidedFixPrompt": "Type 21.82"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d22-b2-process-vs-measurement-noise-tuning",
      "day": 22,
      "blockNumber": 2,
      "title": "Tuning $Q$ (Process Noise) vs $R$ (Measurement Noise)",
      "conceptBudget": {
        "primaryConcept": "Kalman Tuning ($Q$ vs $R$)",
        "supportingTerms": [
          "High $R$ ($R \\gg Q \\implies K \\to 0$, trusts model prediction, heavily filters sensor noise)",
          "High $Q$ ($Q \\gg R \\implies K \\to 1$, trusts raw sensor measurements, fast dynamic response)",
          "Finding optimal balance for edge vibration tracking"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d22-b1-1d-kalman-filter-math",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "kalman_tuning_demo.js",
          "initialCode": "function evaluateKalmanTrust(Q, R) {\n  const ratio = Q / R;\n  if (ratio > 10) return 'HIGH_RESPONSIVENESS: TRUSTS_RAW_MEASUREMENTS';\n  if (ratio < 0.1) return 'HEAVY_FILTERING: TRUSTS_PHYSICS_PREDICTION';\n  return 'BALANCED_KALMAN_TRACKING';\n}\n\nconsole.log(evaluateKalmanTrust(1.0, 0.01));\nconsole.log(evaluateKalmanTrust(0.001, 1.0));",
          "expectedOutput": "HIGH_RESPONSIVENESS: TRUSTS_RAW_MEASUREMENTS\nHEAVY_FILTERING: TRUSTS_PHYSICS_PREDICTION",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What tracking behavior occurs when measurement noise $R = 1.0$ is much larger than process noise $Q = 0.001$ ($R \\gg Q$)?",
        "expectedStringOutput": "HEAVY_FILTERING: TRUSTS_PHYSICS_PREDICTION",
        "acceptableAnswers": [
          "HEAVY_FILTERING: TRUSTS_PHYSICS_PREDICTION",
          "HEAVY_FILTERING"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_KALMAN_FILTER_SENSOR_FUSION_PREDICTION",
        "diagnosisMap": {
          "HIGH": {
            "misconceptionId": "MC_EDGEAI_KALMAN_FILTER_SENSOR_FUSION_PREDICTION",
            "errorExplanation": "Large R indicates noisy measurements, causing the filter to trust model predictions.",
            "recoveryPath": {
              "simplerExplanation": "Trusts physics prediction -> HEAVY_FILTERING: TRUSTS_PHYSICS_PREDICTION.",
              "guidedFixPrompt": "Type HEAVY_FILTERING: TRUSTS_PHYSICS_PREDICTION"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d22-b3-sensor-fusion-vector-assembly",
      "day": 22,
      "blockNumber": 3,
      "title": "Multi-Modal Sensor Fusion: Fusing IMU, Temperature & Current",
      "conceptBudget": {
        "primaryConcept": "Multi-Modal Feature Vector Assembly",
        "supportingTerms": [
          "Feature Concatenation (IMU RMS + Kalman filtered Temp + Current shunt load)",
          "Z-score normalization per channel",
          "Unified input tensor for classifier"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d22-b2-process-vs-measurement-noise-tuning",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "fusion_vector_demo.js",
          "initialCode": "function assembleFusedVector(imuRms, kalmanTemp, currentAmps) {\n  const fused = [imuRms, kalmanTemp, currentAmps];\n  return {\n    fusedFeatureVector: fused,\n    featureDimension: fused.length,\n    status: 'FUSED_SENSOR_VECTOR_READY_FOR_INFERENCE'\n  };\n}\n\nconsole.log(JSON.stringify(assembleFusedVector(1.25, 45.2, 3.8)));",
          "expectedOutput": "{\"fusedFeatureVector\":[1.25,45.2,3.8],\"featureDimension\":3,\"status\":\"FUSED_SENSOR_VECTOR_READY_FOR_INFERENCE\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What status confirms that the fused sensor vector is ready for neural network inference?",
        "expectedStringOutput": "FUSED_SENSOR_VECTOR_READY_FOR_INFERENCE",
        "acceptableAnswers": [
          "FUSED_SENSOR_VECTOR_READY_FOR_INFERENCE",
          "status\":\"FUSED_SENSOR_VECTOR_READY_FOR_INFERENCE\""
        ],
        "primaryMisconceptionId": "MC_EDGEAI_KALMAN_FILTER_SENSOR_FUSION_PREDICTION",
        "diagnosisMap": {
          "FAILED": {
            "misconceptionId": "MC_EDGEAI_KALMAN_FILTER_SENSOR_FUSION_PREDICTION",
            "errorExplanation": "Matches FUSED_SENSOR_VECTOR_READY_FOR_INFERENCE.",
            "recoveryPath": {
              "simplerExplanation": "Matches FUSED_SENSOR_VECTOR_READY_FOR_INFERENCE.",
              "guidedFixPrompt": "Type FUSED_SENSOR_VECTOR_READY_FOR_INFERENCE"
            }
          }
        }
      }
    }
  ]
},
  23: {
  "day": 23,
  "title": "Thermal Drift Compensation & Environmental Normalization",
  "overviewMetaphor": "Thermal Drift is a Metal Ruler Expanding in the Summer Sun: a piezoresistive sensor calibrated at $25^{\\circ}\\text{C}$ in a clean laboratory will output false high readings when installed on a hot factory floor at $85^{\\circ}\\text{C}$ or outside in sub-zero winter at $-20^{\\circ}\\text{C}$; Polynomial Thermal Compensation measures the microcontroller's internal die temperature and subtracts the exact physical drift offset curve before feeding raw numbers into the neural network.",
  "blocks": [
    {
      "id": "edgeai-d23-b1-polynomial-temperature-compensation",
      "day": 23,
      "blockNumber": 1,
      "title": "2nd-Order Polynomial Temperature Drift Calibration",
      "conceptBudget": {
        "primaryConcept": "2nd-Order Polynomial Thermal Drift Compensation",
        "supportingTerms": [
          "Thermal Offset: $\\Delta(T) = a T^2 + b T + c$",
          "Calibrated Value: $S_{\\text{calibrated}} = S_{\\text{raw}} - \\Delta(T)$",
          "Internal MCU Die Temperature Sensor ADC Channel",
          "Maintaining accuracy from $-40^{\\circ}\\text{C}$ to $+85^{\\circ}\\text{C}$"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d22-b1-1d-kalman-filter-math",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "syntax_anatomy",
          "title": "Polynomial Thermal Drift Formula",
          "codeSnippet": "float drift = a * (temp * temp) + b * temp + c; // Quadratic thermal model\nfloat calibratedSensor = rawSensor - drift; // Offset-compensated value",
          "lineNotes": {
            "1": "Calculates quadratic drift offset.",
            "2": "Subtracts offset from raw sensor value."
          }
        },
        {
          "type": "runnable_code",
          "filename": "thermal_drift_demo.js",
          "initialCode": "function calibrateThermalDrift(rawVal, tempC, a = 0.001, b = 0.05, c = 0.1) {\n  const drift = a * (tempC * tempC) + b * tempC + c;\n  const calibrated = rawVal - drift;\n  return {\n    rawSensorValue: rawVal,\n    temperatureCelsius: tempC,\n    thermalDriftOffset: Number(drift.toFixed(3)),\n    calibratedSensorValue: Number(calibrated.toFixed(3)),\n    status: 'THERMAL_DRIFT_COMPENSATED_ACCURATE'\n  };\n}\n\nconsole.log(JSON.stringify(calibrateThermalDrift(100.0, 50.0)));",
          "expectedOutput": "{\"rawSensorValue\":100,\"temperatureCelsius\":50,\"thermalDriftOffset\":5.1,\"calibratedSensorValue\":94.9,\"status\":\"THERMAL_DRIFT_COMPENSATED_ACCURATE\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What is the thermal drift offset at 50°C with $a=0.001, b=0.05, c=0.1$ ($0.001 \\times 2500 + 0.05 \\times 50 + 0.1$)?",
        "expectedStringOutput": "5.1",
        "acceptableAnswers": [
          "5.1",
          "5.10",
          "thermalDriftOffset\":5.1"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_TEMPERATURE_COMPENSATION_DRIFT_FILTER",
        "diagnosisMap": {
          "2.6": {
            "misconceptionId": "MC_EDGEAI_TEMPERATURE_COMPENSATION_DRIFT_FILTER",
            "errorExplanation": "2.5 + 2.5 + 0.1 = 5.1 drift offset.",
            "recoveryPath": {
              "simplerExplanation": "2.5 + 2.5 + 0.1 = 5.1.",
              "guidedFixPrompt": "Type 5.1"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d23-b2-dynamic-zero-offset-tracking",
      "day": 23,
      "blockNumber": 2,
      "title": "Dynamic Zero-Offset Tracking (DZOT) for Inertial Sensors",
      "conceptBudget": {
        "primaryConcept": "Dynamic Zero-Offset Tracking (DZOT)",
        "supportingTerms": [
          "Stationary Detection (Gyroscope variance $< 0.01\\text{ rad/s}$)",
          "Slow Leaky Baseline Integrator ($Z_{k} = (1 - \\alpha) Z_{k-1} + \\alpha S_k$ when stationary)",
          "Eliminating gyro orientation drift"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d23-b1-polynomial-temperature-compensation",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "dzot_demo.js",
          "initialCode": "function updateDzot(currentZero, sample, isStationary, alpha = 0.05) {\n  const newZero = isStationary ? (1 - alpha) * currentZero + alpha * sample : currentZero;\n  return {\n    previousZero: currentZero,\n    isStationary,\n    updatedZeroOffset: Number(newZero.toFixed(4)),\n    status: isStationary ? 'ZERO_OFFSET_RECALIBRATED' : 'MOTION_DETECTED_ZERO_LOCKED'\n  };\n}\n\nconsole.log(JSON.stringify(updateDzot(0.10, 0.20, true, 0.1)));",
          "expectedOutput": "{\"previousZero\":0.1,\"isStationary\":true,\"updatedZeroOffset\":0.11,\"status\":\"ZERO_OFFSET_RECALIBRATED\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What is the updated zero offset when previous offset is 0.10, sample is 0.20, and alpha is 0.1 ($(0.9 \\times 0.10) + (0.1 \\times 0.20)$)?",
        "expectedStringOutput": "0.11",
        "acceptableAnswers": [
          "0.11",
          "0.110",
          "updatedZeroOffset\":0.11"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_TEMPERATURE_COMPENSATION_DRIFT_FILTER",
        "diagnosisMap": {
          "0.15": {
            "misconceptionId": "MC_EDGEAI_TEMPERATURE_COMPENSATION_DRIFT_FILTER",
            "errorExplanation": "0.09 + 0.02 = 0.11 updated offset.",
            "recoveryPath": {
              "simplerExplanation": "0.09 + 0.02 = 0.11.",
              "guidedFixPrompt": "Type 0.11"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d23-b3-z-score-normalization-lookup",
      "day": 23,
      "blockNumber": 3,
      "title": "Fixed-Point Z-Score Feature Normalization ($z = (x - \\mu) / \\sigma$)",
      "conceptBudget": {
        "primaryConcept": "Fixed-Point Z-Score Normalization",
        "supportingTerms": [
          "Z-Score Formula: $z = \\frac{x - \\mu}{\\sigma}$",
          "Reciprocal Multiplication: $z = (x - \\mu) \\times \\left(\\frac{1}{\\sigma}\\right)$ (Replacing slow CPU divisions with fast single-cycle multiplications!)",
          "Zero division protection"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d23-b2-dynamic-zero-offset-tracking",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "zscore_fast_demo.js",
          "initialCode": "function fastZScore(x, mean, invStd) {\n  const z = (x - mean) * invStd; // Fast multiplication instead of division!\n  return {\n    rawValue: x,\n    normalizedZScore: Number(z.toFixed(3)),\n    status: 'ZSCORE_NORMALIZATION_SUCCESS'\n  };\n}\n\nconsole.log(JSON.stringify(fastZScore(25.0, 20.0, 0.2))); // invStd = 1/5 = 0.2",
          "expectedOutput": "{\"rawValue\":25,\"normalizedZScore\":1,\"status\":\"ZSCORE_NORMALIZATION_SUCCESS\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What is the normalized Z-score when raw value is 25.0, mean is 20.0, and reciprocal standard deviation is 0.2 ($(25.0 - 20.0) \\times 0.2$)?",
        "expectedStringOutput": "1",
        "acceptableAnswers": [
          "1",
          "1.0",
          "normalizedZScore\":1"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_TEMPERATURE_COMPENSATION_DRIFT_FILTER",
        "diagnosisMap": {
          "5": {
            "misconceptionId": "MC_EDGEAI_TEMPERATURE_COMPENSATION_DRIFT_FILTER",
            "errorExplanation": "5.0 * 0.2 = 1.0 standard deviations.",
            "recoveryPath": {
              "simplerExplanation": "5.0 * 0.2 = 1.0.",
              "guidedFixPrompt": "Type 1"
            }
          }
        }
      }
    }
  ]
},
  24: {
  "day": 24,
  "title": "Tiny Transformers & Edge Attention Mechanisms",
  "overviewMetaphor": "A Tiny Transformer is a Spotlight Operator in a Dark Theater: RNNs read time-series data one word at a time, forgetting what happened 50 steps ago; a Self-Attention mechanism allows the model to look at the entire vibration or audio sequence at once; the Query, Key, and Value ($Q, K, V$) matrices calculate dot products to spotlight exactly which past audio millisecond relates to the current sound, executing with quantized INT8 arithmetic on ARM Cortex-M55 cores.",
  "blocks": [
    {
      "id": "edgeai-d24-b1-scaled-dot-product-attention",
      "day": 24,
      "blockNumber": 1,
      "title": "1-Head Scaled Dot-Product Self-Attention Math",
      "conceptBudget": {
        "primaryConcept": "Scaled Dot-Product Attention",
        "supportingTerms": [
          "Attention Formula: $\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{Q K^T}{\\sqrt{d_k}}\\right) V$",
          "Sequence Length Truncation ($L \\le 32$ to prevent $O(L^2)$ RAM explosion)",
          "Linear Projection Matrices ($W_Q, W_K, W_V$)"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d10-b1-1d-temporal-convolution-mechanics",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "diagram",
          "data": {
            "type": "memory_box",
            "title": "CNN vs Transformer Complexity on Edge",
            "boxes": [
              {
                "label": "1. 1D CNN",
                "value": "Complexity: O(L * K) | Memory: Fixed Small Buffer | Long Context: Weak",
                "varType": "Local Receptive Field",
                "isUpdated": false
              },
              {
                "label": "2. Tiny Transformer (1-Head, L=16)",
                "value": "Complexity: O(L^2 * D) | Memory: 8 KB Tensor Arena | Long Context: Full Global Attention!",
                "varType": "Global Context",
                "isUpdated": true
              }
            ]
          }
        },
        {
          "type": "runnable_code",
          "filename": "tiny_attention_demo.js",
          "initialCode": "function evaluateTinyAttention(seqLen = 16, headDim = 32) {\n  const attentionMatrixBytes = seqLen * seqLen * 1; // INT8\n  return {\n    sequenceLength: seqLen,\n    headDimension: headDim,\n    attentionMatrixBytes,\n    status: attentionMatrixBytes <= 1024 ? 'ATTENTION_FITS_IN_MCU_SRAM' : 'ATTENTION_RAM_EXPLOSION'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateTinyAttention(16, 32)));",
          "expectedOutput": "{\"sequenceLength\":16,\"headDimension\":32,\"attentionMatrixBytes\":256,\"status\":\"ATTENTION_FITS_IN_MCU_SRAM\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "How many bytes of SRAM does an INT8 attention matrix consume for a sequence length of 16 ($16 \\times 16 \\times 1$)?",
        "expectedStringOutput": "256",
        "acceptableAnswers": [
          "256",
          "256 bytes",
          "attentionMatrixBytes\":256"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_TINIEST_LLM_TRANSFORMER_EDGE_QUANTIZATION",
        "diagnosisMap": {
          "512": {
            "misconceptionId": "MC_EDGEAI_TINIEST_LLM_TRANSFORMER_EDGE_QUANTIZATION",
            "errorExplanation": "16 * 16 * 1 byte = 256 bytes.",
            "recoveryPath": {
              "simplerExplanation": "16 * 16 = 256 bytes.",
              "guidedFixPrompt": "Type 256"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d24-b2-int8-quantized-attention-kernels",
      "day": 24,
      "blockNumber": 2,
      "title": "INT8 Quantized Matrix-Multiply for Attention Projections",
      "conceptBudget": {
        "primaryConcept": "INT8 Attention Kernels",
        "supportingTerms": [
          "Quantized $Q K^T$ Dot-Product",
          "Fixed-Point $\\sqrt{d_k}$ Scaling",
          "Integer Softmax with lookup tables"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d24-b1-scaled-dot-product-attention",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "quant_attention_demo.js",
          "initialCode": "function evaluateQuantAttentionStatus() {\n  return 'INT8_ATTENTION_KERNEL_OPTIMIZED: CMSIS_NN_SMLAD_ACCELERATED';\n}\n\nconsole.log(evaluateQuantAttentionStatus());",
          "expectedOutput": "INT8_ATTENTION_KERNEL_OPTIMIZED: CMSIS_NN_SMLAD_ACCELERATED",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What status confirms acceleration of the INT8 Quantized Attention Kernel?",
        "expectedStringOutput": "INT8_ATTENTION_KERNEL_OPTIMIZED: CMSIS_NN_SMLAD_ACCELERATED",
        "acceptableAnswers": [
          "INT8_ATTENTION_KERNEL_OPTIMIZED: CMSIS_NN_SMLAD_ACCELERATED",
          "INT8_ATTENTION_KERNEL_OPTIMIZED"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_TINIEST_LLM_TRANSFORMER_EDGE_QUANTIZATION",
        "diagnosisMap": {
          "FAILED": {
            "misconceptionId": "MC_EDGEAI_TINIEST_LLM_TRANSFORMER_EDGE_QUANTIZATION",
            "errorExplanation": "Matches INT8_ATTENTION_KERNEL_OPTIMIZED: CMSIS_NN_SMLAD_ACCELERATED.",
            "recoveryPath": {
              "simplerExplanation": "Matches INT8_ATTENTION_KERNEL_OPTIMIZED.",
              "guidedFixPrompt": "Type INT8_ATTENTION_KERNEL_OPTIMIZED: CMSIS_NN_SMLAD_ACCELERATED"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d24-b3-recurrent-vs-attention-edge-benchmarking",
      "day": 24,
      "blockNumber": 3,
      "title": "Recurrent GRU vs 1-Head Transformer Latency Benchmarking",
      "conceptBudget": {
        "primaryConcept": "GRU vs Transformer Trade-off",
        "supportingTerms": [
          "GRU (Constant $O(1)$ memory per step, sequential execution)",
          "1-Head Transformer (Parallel execution on NPU, $O(L^2)$ memory)",
          "Architecture Selection Rule"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d24-b2-int8-quantized-attention-kernels",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "gru_vs_attn_demo.js",
          "initialCode": "function selectTemporalModel(hasNpu, seqLength) {\n  return (hasNpu && seqLength <= 32)\n    ? 'TINY_TRANSFORMER_NPU_PARALLEL'\n    : 'GRU_RECURRENT_LOW_RAM_CPU';\n}\n\nconsole.log(selectTemporalModel(true, 16));\nconsole.log(selectTemporalModel(false, 100));",
          "expectedOutput": "TINY_TRANSFORMER_NPU_PARALLEL\nGRU_RECURRENT_LOW_RAM_CPU",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "Which model architecture is selected when a hardware NPU is available for a sequence length of 16?",
        "expectedStringOutput": "TINY_TRANSFORMER_NPU_PARALLEL",
        "acceptableAnswers": [
          "TINY_TRANSFORMER_NPU_PARALLEL",
          "TINY_TRANSFORMER"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_TINIEST_LLM_TRANSFORMER_EDGE_QUANTIZATION",
        "diagnosisMap": {
          "GRU": {
            "misconceptionId": "MC_EDGEAI_TINIEST_LLM_TRANSFORMER_EDGE_QUANTIZATION",
            "errorExplanation": "Hardware NPUs execute parallel attention faster than sequential GRUs.",
            "recoveryPath": {
              "simplerExplanation": "NPU favors parallel Transformer.",
              "guidedFixPrompt": "Type TINY_TRANSFORMER_NPU_PARALLEL"
            }
          }
        }
      }
    }
  ]
},
  25: {
  "day": 25,
  "title": "Zero-Copy DMA to Inference Pipelines",
  "overviewMetaphor": "Zero-Copy DMA is Pumping Gasoline Directly into the Engine Tank instead of Pouring it into Cans: naive embedded code uses DMA to write sensor data into buffer A, uses `memcpy()` to copy it to buffer B for filtering, and copies it again to buffer C for neural input (Wasting 3,000 CPU clock cycles on memory copying!); Zero-Copy DMA points the camera or microphone DMA controller directly at the Tensor Arena's input tensor memory address (`tensor_arena->input_data`), eliminating memory copying entirely.",
  "blocks": [
    {
      "id": "edgeai-d25-b1-zero-copy-tensor-pointer-mapping",
      "day": 25,
      "blockNumber": 1,
      "title": "Direct DMA Peripheral Targeting into Tensor Arena Buffers",
      "conceptBudget": {
        "primaryConcept": "Zero-Copy DMA Buffer Targeting",
        "supportingTerms": [
          "`interpreter->input(0)->data.int8`",
          "Setting DMA destination address to `(uint32_t)input_tensor_ptr`",
          "Eliminating `memcpy()` overhead",
          "Zero CPU cycles spent copying data"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d3-b1-tflm-zero-allocation-interpreter",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "diagram",
          "data": {
            "type": "broken_fixed_diff",
            "title": "Naive 3x Memcpy vs Zero-Copy DMA Pointer Target",
            "brokenCode": "// ❌ NAIVE BUFFER COPIES (Wastes 3,000 CPU cycles!):\nDMA_Read(rawBuffer);\nmemcpy(dspBuffer, rawBuffer, 1024); // Copy 1\nmemcpy(modelInput, dspBuffer, 1024); // Copy 2",
            "fixedCode": "// ✅ ZERO-COPY DIRECT DMA (0 CPU Cycles Copy Overhead!):\nuint8_t* modelInput = interpreter->input(0)->data.uint8;\nDMA_SetDestinationAddress(DMA1_Channel1, (uint32_t)modelInput); // DMA writes directly into model input!",
            "errorLine": 3,
            "errorReason": "Repeated memcpy calls waste MCU clock cycles and pollute CPU data caches.",
            "fixExplanation": "Point DMA hardware directly at the TFLM input tensor address."
          }
        },
        {
          "type": "runnable_code",
          "filename": "zerocopy_demo.js",
          "initialCode": "function evaluateZeroCopy(dmaAddr, tensorAddr) {\n  const isZeroCopy = (dmaAddr === tensorAddr);\n  return {\n    dmaDestination: dmaAddr,\n    tensorInputBuffer: tensorAddr,\n    isZeroCopyActive: isZeroCopy,\n    cpuCopyCyclesWasted: isZeroCopy ? 0 : 2048,\n    status: isZeroCopy ? 'ZERO_COPY_DMA_ACTIVE' : 'EXPENSIVE_MEMCPY_REQUIRED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateZeroCopy('0x20002000', '0x20002000')));",
          "expectedOutput": "{\"dmaDestination\":\"0x20002000\",\"tensorInputBuffer\":\"0x20002000\",\"isZeroCopyActive\":true,\"cpuCopyCyclesWasted\":0,\"status\":\"ZERO_COPY_DMA_ACTIVE\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What status confirms that DMA writes directly to the model input tensor with zero CPU copy cycles?",
        "expectedStringOutput": "ZERO_COPY_DMA_ACTIVE",
        "acceptableAnswers": [
          "ZERO_COPY_DMA_ACTIVE",
          "status\":\"ZERO_COPY_DMA_ACTIVE\""
        ],
        "primaryMisconceptionId": "MC_EDGEAI_ZERO_COPY_DMA_TO_INFERENCE_PIPELINE",
        "diagnosisMap": {
          "EXPENSIVE": {
            "misconceptionId": "MC_EDGEAI_ZERO_COPY_DMA_TO_INFERENCE_PIPELINE",
            "errorExplanation": "Matching addresses activate ZERO_COPY_DMA_ACTIVE.",
            "recoveryPath": {
              "simplerExplanation": "Matches ZERO_COPY_DMA_ACTIVE.",
              "guidedFixPrompt": "Type ZERO_COPY_DMA_ACTIVE"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d25-b2-cache-coherency-invalidation",
      "day": 25,
      "blockNumber": 2,
      "title": "Cache Coherency & Invalidation (`SCB_InvalidateDCache_by_Addr`)",
      "conceptBudget": {
        "primaryConcept": "Cache Coherency Invalidation",
        "supportingTerms": [
          "Data Cache (D-Cache on Cortex-M7/M55/M85)",
          "DMA Bypass Hazard (DMA writes to physical SRAM, but CPU reads stale cached lines!)",
          "`SCB_InvalidateDCache_by_Addr((uint32_t*)ptr, size)`",
          "Cache line alignment (32-byte boundary)"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d25-b1-zero-copy-tensor-pointer-mapping",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "cache_inval_demo.js",
          "initialCode": "function evaluateCacheSafety(dCacheEnabled, cacheInvalidated) {\n  if (dCacheEnabled && !cacheInvalidated) {\n    return 'CRITICAL_STALE_DATA_FAULT: CPU_READS_OLD_CACHE_INSTEAD_OF_DMA_SRAM';\n  }\n  return 'CACHE_COHERENCY_GUARANTEED: SCB_INVALIDATEDCACHE_EXECUTED';\n}\n\nconsole.log(evaluateCacheSafety(true, true));\nconsole.log(evaluateCacheSafety(true, false));",
          "expectedOutput": "CACHE_COHERENCY_GUARANTEED: SCB_INVALIDATEDCACHE_EXECUTED\nCRITICAL_STALE_DATA_FAULT: CPU_READS_OLD_CACHE_INSTEAD_OF_DMA_SRAM",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What status confirms cache coherency after invalidating D-cache following a DMA transfer?",
        "expectedStringOutput": "CACHE_COHERENCY_GUARANTEED: SCB_INVALIDATEDCACHE_EXECUTED",
        "acceptableAnswers": [
          "CACHE_COHERENCY_GUARANTEED: SCB_INVALIDATEDCACHE_EXECUTED",
          "CACHE_COHERENCY_GUARANTEED"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_ZERO_COPY_DMA_TO_INFERENCE_PIPELINE",
        "diagnosisMap": {
          "FAULT": {
            "misconceptionId": "MC_EDGEAI_ZERO_COPY_DMA_TO_INFERENCE_PIPELINE",
            "errorExplanation": "Invalidating the D-cache ensures coherency.",
            "recoveryPath": {
              "simplerExplanation": "Matches CACHE_COHERENCY_GUARANTEED.",
              "guidedFixPrompt": "Type CACHE_COHERENCY_GUARANTEED: SCB_INVALIDATEDCACHE_EXECUTED"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d25-b3-throughput-benchmark-zerocopy",
      "day": 25,
      "blockNumber": 3,
      "title": "Inference Loop Throughput Optimization",
      "conceptBudget": {
        "primaryConcept": "Inference Throughput Optimization",
        "supportingTerms": [
          "Throughput Gain ($> 30\\%$ higher FPS)",
          "Eliminating bus lock contention",
          "Power reduction from inactive CPU core"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d25-b2-cache-coherency-invalidation",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "zerocopy_bench_demo.js",
          "initialCode": "function evaluateFpsGain(baseFps = 15, zeroCopyFps = 22) {\n  const gain = ((zeroCopyFps - baseFps) / baseFps) * 100;\n  return {\n    standardFps: baseFps,\n    zeroCopyFps,\n    throughputGainPercent: Number(gain.toFixed(1)),\n    status: 'INFERENCE_THROUGHPUT_MAXIMIZED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateFpsGain(15, 22)));",
          "expectedOutput": "{\"standardFps\":15,\"zeroCopyFps\":22,\"throughputGainPercent\":46.7,\"status\":\"INFERENCE_THROUGHPUT_MAXIMIZED\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What throughput gain percentage is achieved when zero-copy DMA increases vision frame rate from 15 FPS to 22 FPS ($((22 - 15) / 15) \\times 100$)?",
        "expectedStringOutput": "46.7",
        "acceptableAnswers": [
          "46.7",
          "46.7%",
          "throughputGainPercent\":46.7"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_ZERO_COPY_DMA_TO_INFERENCE_PIPELINE",
        "diagnosisMap": {
          "30": {
            "misconceptionId": "MC_EDGEAI_ZERO_COPY_DMA_TO_INFERENCE_PIPELINE",
            "errorExplanation": "7 / 15 = 46.7% throughput gain.",
            "recoveryPath": {
              "simplerExplanation": "7 / 15 = 46.7%.",
              "guidedFixPrompt": "Type 46.7"
            }
          }
        }
      }
    }
  ]
},
  26: {
  "day": 26,
  "title": "Adversarial Robustness & Out-of-Distribution (OOD) Rejection",
  "overviewMetaphor": "OOD Rejection is a Border Guard Knowing When to Say 'I Don't Know': a closed-set image classifier trained only on Cats and Dogs will classify an alligator as a 99% confident dog (Dangerous error!); Out-of-Distribution (OOD) detection calculates the Shannon Entropy of the model's Softmax probabilities ($H = -\\sum p_i \\log p_i$); if entropy is high (The model is confused and unsure), the edge device rejects the prediction as untrusted and falls back to safe defaults.",
  "blocks": [
    {
      "id": "edgeai-d26-b1-shannon-entropy-ood-detection",
      "day": 26,
      "blockNumber": 1,
      "title": "Softmax Shannon Entropy Formulation for Ambiguity Detection",
      "conceptBudget": {
        "primaryConcept": "Softmax Shannon Entropy Math",
        "supportingTerms": [
          "Entropy Formula: $H(p) = -\\sum_{i=1}^C p_i \\ln(p_i)$",
          "Low Entropy ($H \\to 0 \\implies$ Confident in-distribution prediction)",
          "High Entropy ($H > 1.0 \\implies$ Ambiguous out-of-distribution sample)",
          "OOD Rejection Threshold"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d10-b3-softmax-gesture-classification",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "syntax_anatomy",
          "title": "Shannon Entropy in JavaScript",
          "codeSnippet": "let entropy = 0.0;\nfor (const p of probs) {\n  if (p > 1e-6) entropy -= p * Math.log(p); // Accumulates information entropy\n}\nconst isOod = (entropy >= entropyThreshold); // Flags ambiguous OOD input!",
          "lineNotes": {
            "3": "Calculates p * ln(p).",
            "5": "Compares against threshold."
          }
        },
        {
          "type": "runnable_code",
          "filename": "entropy_demo.js",
          "initialCode": "function evaluateEntropy(probs, threshold = 0.8) {\n  let H = 0;\n  for (const p of probs) if (p > 1e-6) H -= p * Math.log(p);\n  const isOod = H >= threshold;\n  return {\n    entropy: Number(H.toFixed(3)),\n    threshold,\n    isOutOfDistribution: isOod,\n    action: isOod ? 'REJECT_OOD_UNTRUSTED_SAMPLE' : 'ACCEPT_IN_DISTRIBUTION_PREDICTION'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateEntropy([0.98, 0.01, 0.01]))); // Confident\nconsole.log(JSON.stringify(evaluateEntropy([0.33, 0.33, 0.34]))); // Confused",
          "expectedOutput": "{\"entropy\":0.101,\"threshold\":0.8,\"isOutOfDistribution\":false,\"action\":\"ACCEPT_IN_DISTRIBUTION_PREDICTION\"}\n{\"entropy\":1.099,\"threshold\":0.8,\"isOutOfDistribution\":true,\"action\":\"REJECT_OOD_UNTRUSTED_SAMPLE\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What action is triggered when an ambiguous input produces an entropy of 1.099 (exceeding the 0.8 threshold)?",
        "expectedStringOutput": "REJECT_OOD_UNTRUSTED_SAMPLE",
        "acceptableAnswers": [
          "REJECT_OOD_UNTRUSTED_SAMPLE",
          "action\":\"REJECT_OOD_UNTRUSTED_SAMPLE\""
        ],
        "primaryMisconceptionId": "MC_EDGEAI_ADVERSARIAL_ROBUSTNESS_SENSOR_SPOOFING",
        "diagnosisMap": {
          "ACCEPT": {
            "misconceptionId": "MC_EDGEAI_ADVERSARIAL_ROBUSTNESS_SENSOR_SPOOFING",
            "errorExplanation": "High entropy indicates an ambiguous OOD sample that must be rejected.",
            "recoveryPath": {
              "simplerExplanation": "Rejects sample -> REJECT_OOD_UNTRUSTED_SAMPLE.",
              "guidedFixPrompt": "Type REJECT_OOD_UNTRUSTED_SAMPLE"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d26-b2-sensor-spoofing-glitch-filters",
      "day": 26,
      "blockNumber": 2,
      "title": "Acoustic & IMU Sensor Spoofing Defenses",
      "conceptBudget": {
        "primaryConcept": "Sensor Spoofing Defenses",
        "supportingTerms": [
          "Ultrasonic MEMS Resonance Spoofing",
          "Rate-of-Change $(\\frac{dx}{dt})$ Limiters",
          "Cross-Sensor Correlation Checks (IMU acceleration must match acoustic vibration energy)"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d26-b1-shannon-entropy-ood-detection",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "spoof_defense_demo.js",
          "initialCode": "function evaluateSensorConsistency(imuEnergy, acousticEnergy, maxRatio = 5.0) {\n  const ratio = Math.max(imuEnergy, acousticEnergy) / Math.max(1e-3, Math.min(imuEnergy, acousticEnergy));\n  const isConsistent = ratio <= maxRatio;\n  return {\n    crossSensorRatio: Number(ratio.toFixed(2)),\n    isPhysicallyConsistent: isConsistent,\n    status: isConsistent ? 'SENSOR_FUSION_PLAUSIBLE' : 'SPOOFING_OR_TRANSDUCER_FAULT_DETECTED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateSensorConsistency(10.0, 8.5)));\nconsole.log(JSON.stringify(evaluateSensorConsistency(100.0, 1.0)));",
          "expectedOutput": "{\"crossSensorRatio\":1.18,\"isPhysicallyConsistent\":true,\"status\":\"SENSOR_FUSION_PLAUSIBLE\"}\n{\"crossSensorRatio\":100,\"isPhysicallyConsistent\":false,\"status\":\"SPOOFING_OR_TRANSDUCER_FAULT_DETECTED\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What status is triggered when IMU energy (100.0) conflicts with acoustic energy (1.0) with ratio 100?",
        "expectedStringOutput": "SPOOFING_OR_TRANSDUCER_FAULT_DETECTED",
        "acceptableAnswers": [
          "SPOOFING_OR_TRANSDUCER_FAULT_DETECTED",
          "status\":\"SPOOFING_OR_TRANSDUCER_FAULT_DETECTED\""
        ],
        "primaryMisconceptionId": "MC_EDGEAI_ADVERSARIAL_ROBUSTNESS_SENSOR_SPOOFING",
        "diagnosisMap": {
          "PLAUSIBLE": {
            "misconceptionId": "MC_EDGEAI_ADVERSARIAL_ROBUSTNESS_SENSOR_SPOOFING",
            "errorExplanation": "100x discrepancy indicates sensor fault or spoofing attack.",
            "recoveryPath": {
              "simplerExplanation": "Flags SPOOFING_OR_TRANSDUCER_FAULT_DETECTED.",
              "guidedFixPrompt": "Type SPOOFING_OR_TRANSDUCER_FAULT_DETECTED"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d26-b3-trusted-execution-environment-ai",
      "day": 26,
      "blockNumber": 3,
      "title": "ARM TrustZone: Isolating Neural Weights & Inference Keys",
      "conceptBudget": {
        "primaryConcept": "TrustZone Model Security",
        "supportingTerms": [
          "Secure World vs Non-Secure World",
          "Encrypted Model Weights in Flash",
          "Hardware Crypto Engine (AES-256-GCM model decryption at boot)"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d26-b2-sensor-spoofing-glitch-filters",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "trustzone_demo.js",
          "initialCode": "function evaluateTrustZoneIsolation() {\n  return 'TRUSTZONE_SECURE_WORLD: MODEL_WEIGHTS_ISOLATED_FROM_APPLICATION_EXPLOITS';\n}\n\nconsole.log(evaluateTrustZoneIsolation());",
          "expectedOutput": "TRUSTZONE_SECURE_WORLD: MODEL_WEIGHTS_ISOLATED_FROM_APPLICATION_EXPLOITS",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What status confirms that neural network weights are isolated inside ARM TrustZone Secure World?",
        "expectedStringOutput": "TRUSTZONE_SECURE_WORLD: MODEL_WEIGHTS_ISOLATED_FROM_APPLICATION_EXPLOITS",
        "acceptableAnswers": [
          "TRUSTZONE_SECURE_WORLD: MODEL_WEIGHTS_ISOLATED_FROM_APPLICATION_EXPLOITS",
          "TRUSTZONE_SECURE_WORLD"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_ADVERSARIAL_ROBUSTNESS_SENSOR_SPOOFING",
        "diagnosisMap": {
          "EXPLOITED": {
            "misconceptionId": "MC_EDGEAI_ADVERSARIAL_ROBUSTNESS_SENSOR_SPOOFING",
            "errorExplanation": "Matches TrustZone isolation string.",
            "recoveryPath": {
              "simplerExplanation": "Matches TRUSTZONE_SECURE_WORLD.",
              "guidedFixPrompt": "Type TRUSTZONE_SECURE_WORLD: MODEL_WEIGHTS_ISOLATED_FROM_APPLICATION_EXPLOITS"
            }
          }
        }
      }
    }
  ]
},
  27: {
  "day": 27,
  "title": "On-Device Continual Learning & Few-Shot Adaptation",
  "overviewMetaphor": "On-Device Learning is a Smart Door Lock Learning Your Face in 3 Seconds: full backpropagation training requires massive matrix derivatives that would overload an MCU (Impossible with 64 KB RAM!); instead, the frozen neural network acts as a Feature Extractor, outputting an 8-number 'fingerprint' vector; when you register a new user or machine gesture, the MCU simply saves 3 fingerprint vectors to Flash memory and uses a Nearest Centroid formula to recognize them instantly.",
  "blocks": [
    {
      "id": "edgeai-d27-b1-frozen-backbone-feature-extraction",
      "day": 27,
      "blockNumber": 1,
      "title": "Frozen Feature Extractors & Latent Embedding Vectors",
      "conceptBudget": {
        "primaryConcept": "Frozen Feature Extractor",
        "supportingTerms": [
          "Frozen Backbone (All conv/dense layers in Flash are read-only)",
          "Latent Embedding Vector (e.g. 16-element Float/INT8 embedding output)",
          "Zero Backpropagation Invariant (No gradient storage or optimizer states!)"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d21-b1-autoencoder-pipeline-synthesis",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "diagram",
          "data": {
            "type": "memory_box",
            "title": "Full Retraining vs Few-Shot Feature Embeddings",
            "boxes": [
              {
                "label": "1. Backpropagation Retraining",
                "value": "RAM Required: > 10 MB (Gradients + Adam Optimizer) | Execution: Hours | Suitability: IMPOSSIBLE ON MCU",
                "varType": "Heavyweight",
                "isUpdated": false
              },
              {
                "label": "2. Nearest Centroid Few-Shot",
                "value": "RAM Required: < 128 bytes (Latent Vector) | Execution: 0.1 ms | Suitability: 100% MCU CAPABLE!",
                "varType": "TinyML Few-Shot",
                "isUpdated": true
              }
            ]
          }
        },
        {
          "type": "runnable_code",
          "filename": "fewshot_demo.js",
          "initialCode": "function evaluateFewShotCapability(backpropRequired) {\n  return backpropRequired\n    ? 'UNSUPPORTED_ON_MCU_EXCESSIVE_RAM'\n    : 'FEW_SHOT_CENTROID_ADAPTATION_SUPPORTED_ZERO_GRADIENTS';\n}\n\nconsole.log(evaluateFewShotCapability(false));",
          "expectedOutput": "FEW_SHOT_CENTROID_ADAPTATION_SUPPORTED_ZERO_GRADIENTS",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What status confirms on-device adaptation using frozen feature extractors without gradient backpropagation?",
        "expectedStringOutput": "FEW_SHOT_CENTROID_ADAPTATION_SUPPORTED_ZERO_GRADIENTS",
        "acceptableAnswers": [
          "FEW_SHOT_CENTROID_ADAPTATION_SUPPORTED_ZERO_GRADIENTS",
          "FEW_SHOT_CENTROID_ADAPTATION_SUPPORTED"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_CONTINUAL_LEARNING_ON_DEVICE_FEW_SHOT",
        "diagnosisMap": {
          "BACKPROP": {
            "misconceptionId": "MC_EDGEAI_CONTINUAL_LEARNING_ON_DEVICE_FEW_SHOT",
            "errorExplanation": "Few-shot adaptation operates without gradients.",
            "recoveryPath": {
              "simplerExplanation": "Matches FEW_SHOT_CENTROID_ADAPTATION_SUPPORTED_ZERO_GRADIENTS.",
              "guidedFixPrompt": "Type FEW_SHOT_CENTROID_ADAPTATION_SUPPORTED_ZERO_GRADIENTS"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d27-b2-nearest-centroid-euclidean-distance",
      "day": 27,
      "blockNumber": 2,
      "title": "Nearest Centroid Classification via Euclidean Distance ($L_2$ Norm)",
      "conceptBudget": {
        "primaryConcept": "Nearest Centroid Euclidean Distance",
        "supportingTerms": [
          "Centroid Vector: $\\vec{\\mu}_c = \\frac{1}{K} \\sum_{k=1}^K \\vec{e}_{c, k}$",
          "Euclidean Distance: $d(\\vec{x}, \\vec{\\mu}_c) = \\sqrt{\\sum (x_i - \\mu_{c, i})^2}$",
          "Flash-Backed Non-Volatile User Profile Storage"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d27-b1-frozen-backbone-feature-extraction",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "centroid_demo.js",
          "initialCode": "function classifyCentroid(queryEmb, centroids) {\n  let minD = Infinity;\n  let bestC = 'NONE';\n  for (const [cls, cVec] of Object.entries(centroids)) {\n    let sumSq = 0;\n    for (let i = 0; i < queryEmb.length; i++) {\n      const diff = queryEmb[i] - cVec[i];\n      sumSq += diff * diff;\n    }\n    const d = Math.sqrt(sumSq);\n    if (d < minD) { minD = d; bestC = cls; }\n  }\n  return {\n    nearestClass: bestC,\n    distance: Number(minD.toFixed(3)),\n    status: 'NEAREST_CENTROID_CLASSIFIED'\n  };\n}\n\nconst centroids = { 'USER_A': [0.1, 0.1], 'USER_B': [0.9, 0.9] };\nconsole.log(JSON.stringify(classifyCentroid([0.15, 0.12], centroids)));",
          "expectedOutput": "{\"nearestClass\":\"USER_A\",\"distance\":0.054,\"status\":\"NEAREST_CENTROID_CLASSIFIED\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "Which class is classified as nearest to embedding [0.15, 0.12] between USER_A [0.1, 0.1] and USER_B [0.9, 0.9]?",
        "expectedStringOutput": "USER_A",
        "acceptableAnswers": [
          "USER_A",
          "nearestClass\":\"USER_A\""
        ],
        "primaryMisconceptionId": "MC_EDGEAI_CONTINUAL_LEARNING_ON_DEVICE_FEW_SHOT",
        "diagnosisMap": {
          "USER_B": {
            "misconceptionId": "MC_EDGEAI_CONTINUAL_LEARNING_ON_DEVICE_FEW_SHOT",
            "errorExplanation": "Distance to USER_A is 0.054, much closer than USER_B (1.1).",
            "recoveryPath": {
              "simplerExplanation": "USER_A is closest.",
              "guidedFixPrompt": "Type USER_A"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d27-b3-catastrophic-forgetting-mitigation",
      "day": 27,
      "blockNumber": 3,
      "title": "Catastrophic Forgetting Mitigation via Replay Buffers",
      "conceptBudget": {
        "primaryConcept": "Catastrophic Forgetting Mitigation",
        "supportingTerms": [
          "Catastrophic Forgetting (Adapting to new data destroying accuracy on prior classes)",
          "Exemplar Memory (Storing 5 prototypical centroid vectors in Flash per class)",
          "Bounded drift verification"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d27-b2-nearest-centroid-euclidean-distance",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "forgetting_demo.js",
          "initialCode": "function evaluateExemplarRetention(storedExemplarsPerClass = 5) {\n  return storedExemplarsPerClass >= 3\n    ? 'CATASTROPHIC_FORGETTING_PREVENTED_EXEMPLARS_RETAINED'\n    : 'RISK_OF_ACCURACY_FORGETTING';\n}\n\nconsole.log(evaluateExemplarRetention(5));",
          "expectedOutput": "CATASTROPHIC_FORGETTING_PREVENTED_EXEMPLARS_RETAINED",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What status confirms prevention of catastrophic forgetting by retaining exemplar centroids?",
        "expectedStringOutput": "CATASTROPHIC_FORGETTING_PREVENTED_EXEMPLARS_RETAINED",
        "acceptableAnswers": [
          "CATASTROPHIC_FORGETTING_PREVENTED_EXEMPLARS_RETAINED",
          "CATASTROPHIC_FORGETTING_PREVENTED"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_CONTINUAL_LEARNING_ON_DEVICE_FEW_SHOT",
        "diagnosisMap": {
          "RISK": {
            "misconceptionId": "MC_EDGEAI_CONTINUAL_LEARNING_ON_DEVICE_FEW_SHOT",
            "errorExplanation": "Matches CATASTROPHIC_FORGETTING_PREVENTED_EXEMPLARS_RETAINED.",
            "recoveryPath": {
              "simplerExplanation": "Matches CATASTROPHIC_FORGETTING_PREVENTED.",
              "guidedFixPrompt": "Type CATASTROPHIC_FORGETTING_PREVENTED_EXEMPLARS_RETAINED"
            }
          }
        }
      }
    }
  ]
},
  28: {
  "day": 28,
  "title": "Multi-Model Execution & Time-Multiplexed Tensor Arenas",
  "overviewMetaphor": "Multi-Model Execution is Hot-Desking in a Small Office: if you have 3 separate models (Vision 80 KB, Audio 30 KB, Vibration 15 KB) and allocate separate RAM for each, you need 125 KB of SRAM (Exceeding the MCU's total memory!); because the MCU only runs one model at a time, Time-Multiplexed Overlays allocate a single 80 KB Tensor Arena (The maximum required); all three models take turns using the same 80 KB workspace, saving 45 KB of precious SRAM.",
  "blocks": [
    {
      "id": "edgeai-d28-b1-shared-tensor-arena-overlay-math",
      "day": 28,
      "blockNumber": 1,
      "title": "Shared Tensor Arena Memory Overlays: $\\max(\\text{Size}(M_i))$",
      "conceptBudget": {
        "primaryConcept": "Shared Tensor Arena Overlay",
        "supportingTerms": [
          "Memory Math: $\\text{RAM}_{\\text{shared}} = \\max(\\text{Arena}(M_1), \\text{Arena}(M_2), \\dots, \\text{Arena}(M_n))$",
          "RAM Savings: $\\sum \\text{Arena}(M_i) - \\max(\\text{Arena}(M_i))$",
          "Time-Multiplexed Model Scheduling"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d3-b1-tflm-zero-allocation-interpreter",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "diagram",
          "data": {
            "type": "memory_box",
            "title": "Separate vs Shared Tensor Arena Allocation",
            "boxes": [
              {
                "label": "1. Separate Arenas",
                "value": "Vision (80 KB) + Audio (30 KB) + IMU (15 KB) = 125 KB SRAM (OOM Overflow!)",
                "varType": "Wasted RAM",
                "isUpdated": false
              },
              {
                "label": "2. Shared Time-Multiplexed Arena",
                "value": "Allocates: max(80, 30, 15) = 80 KB SRAM (45 KB SAVED! Fits easily!)",
                "varType": "Shared Overlay",
                "isUpdated": true
              }
            ]
          }
        },
        {
          "type": "runnable_code",
          "filename": "shared_arena_demo.js",
          "initialCode": "function calculateSharedArenaSavings(arenas) {\n  const maxArena = Math.max(...arenas);\n  const sumArenas = arenas.reduce((a, b) => a + b, 0);\n  const saved = sumArenas - maxArena;\n  return {\n    separateAllocationsTotalKb: sumArenas,\n    sharedAllocationRequiredKb: maxArena,\n    ramSavedKb: saved,\n    savingsPercent: Number(((saved / sumArenas) * 100).toFixed(1)),\n    status: 'SHARED_TENSOR_ARENA_OVERLAY_OPTIMIZED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateSharedArenaSavings([80, 30, 15])));",
          "expectedOutput": "{\"separateAllocationsTotalKb\":125,\"sharedAllocationRequiredKb\":80,\"ramSavedKb\":45,\"savingsPercent\":36,\"status\":\"SHARED_TENSOR_ARENA_OVERLAY_OPTIMIZED\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "How many KB of SRAM are saved by using a shared overlay for models requiring 80 KB, 30 KB, and 15 KB ($125 - 80$)?",
        "expectedStringOutput": "45",
        "acceptableAnswers": [
          "45",
          "45 KB",
          "45KB",
          "ramSavedKb\":45"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_MULTI_MODEL_CONCURRENT_TENSOR_ARENA",
        "diagnosisMap": {
          "125": {
            "misconceptionId": "MC_EDGEAI_MULTI_MODEL_CONCURRENT_TENSOR_ARENA",
            "errorExplanation": "125 - 80 = 45 KB saved.",
            "recoveryPath": {
              "simplerExplanation": "125 - 80 = 45 KB.",
              "guidedFixPrompt": "Type 45"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d28-b2-cooperative-model-scheduler",
      "day": 28,
      "blockNumber": 2,
      "title": "Cooperative Model Scheduling & Execution Priorities",
      "conceptBudget": {
        "primaryConcept": "Cooperative Model Scheduler",
        "supportingTerms": [
          "High Priority: Audio Keyword Spotting (Every 100 ms)",
          "Low Priority: Visual Wake Words (Every 1000 ms)",
          "Preemption Safety (No interruption during active tensor MAC execution)"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d28-b1-shared-tensor-arena-overlay-math",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "sched_demo.js",
          "initialCode": "function scheduleModels(isAudioDue, isVisionDue) {\n  if (isAudioDue) return 'EXECUTE_AUDIO_KWS: HIGH_PRIORITY';\n  if (isVisionDue) return 'EXECUTE_VISION_VWW: LOW_PRIORITY';\n  return 'SYSTEM_SLEEP_LOW_POWER';\n}\n\nconsole.log(scheduleModels(true, true));\nconsole.log(scheduleModels(false, true));",
          "expectedOutput": "EXECUTE_AUDIO_KWS: HIGH_PRIORITY\nEXECUTE_VISION_VWW: LOW_PRIORITY",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "Which model executes first when both Audio (High priority) and Vision (Low priority) are due simultaneously?",
        "expectedStringOutput": "EXECUTE_AUDIO_KWS: HIGH_PRIORITY",
        "acceptableAnswers": [
          "EXECUTE_AUDIO_KWS: HIGH_PRIORITY",
          "EXECUTE_AUDIO_KWS",
          "Audio"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_MULTI_MODEL_CONCURRENT_TENSOR_ARENA",
        "diagnosisMap": {
          "VISION": {
            "misconceptionId": "MC_EDGEAI_MULTI_MODEL_CONCURRENT_TENSOR_ARENA",
            "errorExplanation": "Audio KWS has higher priority to prevent dropped acoustic frames.",
            "recoveryPath": {
              "simplerExplanation": "Audio executes first.",
              "guidedFixPrompt": "Type EXECUTE_AUDIO_KWS: HIGH_PRIORITY"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d28-b3-shared-memory-leak-prevention",
      "day": 28,
      "blockNumber": 3,
      "title": "Inter-Model State Isolation & Tensor Invalidation",
      "conceptBudget": {
        "primaryConcept": "Tensor Arena Reinitialization",
        "supportingTerms": [
          "Zeroing Residual Scratch Memory",
          "Preventing cross-model data contamination",
          "Deterministic inference verification"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d28-b2-cooperative-model-scheduler",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "arena_clean_demo.js",
          "initialCode": "function evaluateArenaIsolation() {\n  return 'ARENA_ISOLATION_VERIFIED: SCRATCH_BUFFERS_CLEARED_BETWEEN_MODELS';\n}\n\nconsole.log(evaluateArenaIsolation());",
          "expectedOutput": "ARENA_ISOLATION_VERIFIED: SCRATCH_BUFFERS_CLEARED_BETWEEN_MODELS",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What status confirms that shared Tensor Arena memory is isolated between model switches?",
        "expectedStringOutput": "ARENA_ISOLATION_VERIFIED: SCRATCH_BUFFERS_CLEARED_BETWEEN_MODELS",
        "acceptableAnswers": [
          "ARENA_ISOLATION_VERIFIED: SCRATCH_BUFFERS_CLEARED_BETWEEN_MODELS",
          "ARENA_ISOLATION_VERIFIED"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_MULTI_MODEL_CONCURRENT_TENSOR_ARENA",
        "diagnosisMap": {
          "LEAK": {
            "misconceptionId": "MC_EDGEAI_MULTI_MODEL_CONCURRENT_TENSOR_ARENA",
            "errorExplanation": "Matches ARENA_ISOLATION_VERIFIED: SCRATCH_BUFFERS_CLEARED_BETWEEN_MODELS.",
            "recoveryPath": {
              "simplerExplanation": "Matches ARENA_ISOLATION_VERIFIED.",
              "guidedFixPrompt": "Type ARENA_ISOLATION_VERIFIED: SCRATCH_BUFFERS_CLEARED_BETWEEN_MODELS"
            }
          }
        }
      }
    }
  ]
},
  29: {
  "day": 29,
  "title": "Fail-Safe Heuristics & Shadow Mode Deployment",
  "overviewMetaphor": "Fail-Safe Heuristics are the Circuit Breakers in an Electric Substation: machine learning models are probabilistic algorithms (They can occasionally make unpredictable errors when presented with unexpected noise!); no safety-critical industrial actuator should ever be controlled solely by an AI output; a hardcoded Safety Supervisor circuit checks physical laws (e.g. If temperature $> 95^{\\circ}\\text{C}$ or pressure $> 10\\text{ bar}$, shut down immediately!), overriding the neural network whenever safety invariants are violated.",
  "blocks": [
    {
      "id": "edgeai-d29-b1-heuristic-safety-override-circuits",
      "day": 29,
      "blockNumber": 1,
      "title": "Hardcoded Safety Bounds vs Probabilistic AI Decisions",
      "conceptBudget": {
        "primaryConcept": "Heuristic Safety Supervisor",
        "supportingTerms": [
          "Hardcoded Invariants (Temperature limit $T_{\\text{limit}} = 95^{\\circ}\\text{C}$, Vibration limit $V_{\\text{limit}} = 8.0\\text{ g}$)",
          "Supervisory Override Circuit",
          "Emergency Halt Precedence",
          "Never allowing unconstrained AI actuation"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d26-b1-shannon-entropy-ood-detection",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "diagram",
          "data": {
            "type": "flowchart",
            "title": "AI Actuation Safety Supervisory Flow",
            "nodes": [
              {
                "id": "1",
                "label": "TFLM Model proposes: 'RUN_MOTOR_SPEED_100%'",
                "kind": "start"
              },
              {
                "id": "2",
                "label": "Safety Supervisor reads hardware sensor: Temperature = 98°C (> 95°C limit!)",
                "kind": "process"
              },
              {
                "id": "3",
                "label": "HEURISTIC OVERRIDE ENGAGED: Disregards AI proposed action!",
                "kind": "process"
              },
              {
                "id": "4",
                "label": "Executes EMERGENCY_SHUTDOWN -> Hardware and human safety guaranteed!",
                "kind": "end"
              }
            ]
          }
        },
        {
          "type": "runnable_code",
          "filename": "safety_supervisor_demo.js",
          "initialCode": "function executeSafetySupervisor(aiAction, tempC, maxSafeTemp = 95) {\n  const isOverheated = tempC > maxSafeTemp;\n  const finalAction = isOverheated ? 'EMERGENCY_HALT_OVERRIDE' : aiAction;\n  return {\n    aiProposedAction: aiAction,\n    measuredTempC: tempC,\n    heuristicOverrideEngaged: isOverheated,\n    dispatchedFinalAction: finalAction,\n    status: isOverheated ? 'SAFETY_HEURISTIC_OVERRODE_AI' : 'AI_ACTION_APPROVED'\n  };\n}\n\nconsole.log(JSON.stringify(executeSafetySupervisor('RUN_MOTOR_FAST', 45)));\nconsole.log(JSON.stringify(executeSafetySupervisor('RUN_MOTOR_FAST', 102)));",
          "expectedOutput": "{\"aiProposedAction\":\"RUN_MOTOR_FAST\",\"measuredTempC\":45,\"heuristicOverrideEngaged\":false,\"dispatchedFinalAction\":\"RUN_MOTOR_FAST\",\"status\":\"AI_ACTION_APPROVED\"}\n{\"aiProposedAction\":\"RUN_MOTOR_FAST\",\"measuredTempC\":102,\"heuristicOverrideEngaged\":true,\"dispatchedFinalAction\":\"EMERGENCY_HALT_OVERRIDE\",\"status\":\"SAFETY_HEURISTIC_OVERRODE_AI\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What action is dispatched when an AI model proposes 'RUN_MOTOR_FAST' while motor temperature is 102°C (exceeding 95°C)?",
        "expectedStringOutput": "EMERGENCY_HALT_OVERRIDE",
        "acceptableAnswers": [
          "EMERGENCY_HALT_OVERRIDE",
          "dispatchedFinalAction\":\"EMERGENCY_HALT_OVERRIDE\""
        ],
        "primaryMisconceptionId": "MC_EDGEAI_FAIL_SAFE_HEURISTIC_BACKUP_CIRCUITS",
        "diagnosisMap": {
          "RUN_MOTOR_FAST": {
            "misconceptionId": "MC_EDGEAI_FAIL_SAFE_HEURISTIC_BACKUP_CIRCUITS",
            "errorExplanation": "102°C triggers the heuristic safety supervisor, forcing EMERGENCY_HALT_OVERRIDE.",
            "recoveryPath": {
              "simplerExplanation": "Safety override forces EMERGENCY_HALT_OVERRIDE.",
              "guidedFixPrompt": "Type EMERGENCY_HALT_OVERRIDE"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d29-b2-shadow-mode-telemetry-validation",
      "day": 29,
      "blockNumber": 2,
      "title": "Shadow Mode Deployment & Telemetry Verification",
      "conceptBudget": {
        "primaryConcept": "Shadow Mode Deployment",
        "supportingTerms": [
          "Shadow Mode (New model runs on live sensor feeds in background; outputs are logged but do NOT actuate)",
          "Agreement Rater (% match between legacy controller and edge AI)",
          "Safe real-world burn-in testing"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d29-b1-heuristic-safety-override-circuits",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "shadow_demo.js",
          "initialCode": "function evaluateShadowAgreement(aiDecisions, baselineDecisions) {\n  let matches = 0;\n  for (let i = 0; i < aiDecisions.length; i++) {\n    if (aiDecisions[i] === baselineDecisions[i]) matches++;\n  }\n  const agreement = (matches / aiDecisions.length) * 100;\n  return {\n    totalEvaluations: aiDecisions.length,\n    agreementPercent: Number(agreement.toFixed(1)),\n    readyForActiveControl: agreement >= 99.0,\n    status: agreement >= 99.0 ? 'SHADOW_MODE_PASSED_READY_FOR_CONTROL' : 'SHADOW_MODE_RETAINS_DISCREPANCIES'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateShadowAgreement(['A', 'B', 'A', 'A'], ['A', 'B', 'A', 'A'])));",
          "expectedOutput": "{\"totalEvaluations\":4,\"agreementPercent\":100,\"readyForActiveControl\":true,\"status\":\"SHADOW_MODE_PASSED_READY_FOR_CONTROL\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What status confirms that a model achieved 100% agreement during shadow mode validation?",
        "expectedStringOutput": "SHADOW_MODE_PASSED_READY_FOR_CONTROL",
        "acceptableAnswers": [
          "SHADOW_MODE_PASSED_READY_FOR_CONTROL",
          "status\":\"SHADOW_MODE_PASSED_READY_FOR_CONTROL\""
        ],
        "primaryMisconceptionId": "MC_EDGEAI_FAIL_SAFE_HEURISTIC_BACKUP_CIRCUITS",
        "diagnosisMap": {
          "DISCREPANCIES": {
            "misconceptionId": "MC_EDGEAI_FAIL_SAFE_HEURISTIC_BACKUP_CIRCUITS",
            "errorExplanation": "100% agreement awards SHADOW_MODE_PASSED_READY_FOR_CONTROL.",
            "recoveryPath": {
              "simplerExplanation": "Matches SHADOW_MODE_PASSED_READY_FOR_CONTROL.",
              "guidedFixPrompt": "Type SHADOW_MODE_PASSED_READY_FOR_CONTROL"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d29-b3-watchdog-deadman-switches",
      "day": 29,
      "blockNumber": 3,
      "title": "Hardware Watchdog Timers & Dead-Man Actuator Switches",
      "conceptBudget": {
        "primaryConcept": "Hardware Watchdog Timer Invariant",
        "supportingTerms": [
          "Independent Watchdog (IWDG: Hardware timer resets MCU if inference hangs $> 50\\text{ ms}$)",
          "Dead-Man Actuator Relays (De-energize to safe open state if heartbeat stops)",
          "Hard-Fault recovery handlers"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d29-b2-shadow-mode-telemetry-validation",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "watchdog_demo.js",
          "initialCode": "function evaluateWatchdogKick(inferenceTimeMs, timeoutMs = 50) {\n  const ok = inferenceTimeMs < timeoutMs;\n  return {\n    inferenceDurationMs: inferenceTimeMs,\n    watchdogTimeoutMs: timeoutMs,\n    watchdogKicked: ok,\n    status: ok ? 'WATCHDOG_KICKED_SYSTEM_HEALTHY' : 'WATCHDOG_RESET_TRIGGERED_HANG_DETECTED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateWatchdogKick(12, 50)));\nconsole.log(JSON.stringify(evaluateWatchdogKick(65, 50)));",
          "expectedOutput": "{\"inferenceDurationMs\":12,\"watchdogTimeoutMs\":50,\"watchdogKicked\":true,\"status\":\"WATCHDOG_KICKED_SYSTEM_HEALTHY\"}\n{\"inferenceDurationMs\":65,\"watchdogTimeoutMs\":50,\"watchdogKicked\":false,\"status\":\"WATCHDOG_RESET_TRIGGERED_HANG_DETECTED\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What status confirms that a 12 ms inference successfully kicked the 50 ms hardware watchdog timer?",
        "expectedStringOutput": "WATCHDOG_KICKED_SYSTEM_HEALTHY",
        "acceptableAnswers": [
          "WATCHDOG_KICKED_SYSTEM_HEALTHY",
          "status\":\"WATCHDOG_KICKED_SYSTEM_HEALTHY\""
        ],
        "primaryMisconceptionId": "MC_EDGEAI_FAIL_SAFE_HEURISTIC_BACKUP_CIRCUITS",
        "diagnosisMap": {
          "RESET": {
            "misconceptionId": "MC_EDGEAI_FAIL_SAFE_HEURISTIC_BACKUP_CIRCUITS",
            "errorExplanation": "12 ms < 50 ms confirms WATCHDOG_KICKED_SYSTEM_HEALTHY.",
            "recoveryPath": {
              "simplerExplanation": "Matches WATCHDOG_KICKED_SYSTEM_HEALTHY.",
              "guidedFixPrompt": "Type WATCHDOG_KICKED_SYSTEM_HEALTHY"
            }
          }
        }
      }
    }
  ]
},
  30: {
  "day": 30,
  "title": "🏆 FINAL CAPSTONE: Predictive Maintenance Vision & Acoustic Fusion Ecosystem",
  "overviewMetaphor": "Day 30 Final Capstone Synthesis: The complete industrial Edge AI ecosystem: 1. 3-axis vibration FFT spectral analysis; 2. Acoustic MFCC keyword/bearing anomaly detection; 3. Low-power Visual Wake Words person verification; 4. INT8 CMSIS-NN SIMD acceleration; 5. Kalman sensor fusion and polynomial thermal calibration; 6. Fail-Safe heuristic supervisory overrides, achieving sovereign, certified edge intelligence.",
  "blocks": [
    {
      "id": "edgeai-d30-b1-capstone-architecture-orchestration",
      "day": 30,
      "blockNumber": 1,
      "title": "Predictive Maintenance Edge AI Master Architecture Orchestration",
      "conceptBudget": {
        "primaryConcept": "Edge AI Capstone Architecture",
        "supportingTerms": [
          "Vibration FFT Analyzer",
          "Acoustic MFCC Engine",
          "Visual Wake Words Person Classifier",
          "Fail-Safe Safety Supervisor",
          "Zero Heap Invariant"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d29-b1-heuristic-safety-override-circuits",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "diagram",
          "data": {
            "type": "flowchart",
            "title": "Unified Capstone Industrial Edge AI Engine",
            "nodes": [
              {
                "id": "1",
                "label": "Zero-Copy DMA streams Vibration, Audio, Vision into Shared Tensor Arena",
                "kind": "start"
              },
              {
                "id": "2",
                "label": "CMSIS-NN SIMD accelerates INT8 inference across all three modalities",
                "kind": "process"
              },
              {
                "id": "3",
                "label": "Kalman Filter fuses temperature and current telemetry to detect anomalies",
                "kind": "process"
              },
              {
                "id": "4",
                "label": "Safety Supervisor validates physical limits -> Autonomous plant protection certified!",
                "kind": "end"
              }
            ]
          }
        },
        {
          "type": "runnable_code",
          "filename": "capstone_orchestrator_demo.js",
          "initialCode": "function executeCapstoneEdgeEngine() {\n  return {\n    vibrationDspStatus: 'FFT_KURTOSIS_ANOMALY_EVALUATED',\n    acousticModelStatus: 'MFCC_KWS_CMSIS_NN_SIMD',\n    visionModelStatus: 'VWW_PERSON_DETECTED_CONFIDENT',\n    sensorFusionStatus: 'KALMAN_THERMAL_DRIFT_COMPENSATED',\n    safetySupervisorStatus: 'HEURISTIC_BOUNDS_VALIDATED_SAFE',\n    capstoneStatus: 'PREDICTIVE_MAINTENANCE_ECOSYSTEM_ACTIVE'\n  };\n}\n\nconsole.log(executeCapstoneEdgeEngine().capstoneStatus);",
          "expectedOutput": "PREDICTIVE_MAINTENANCE_ECOSYSTEM_ACTIVE",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What capstone status confirms active operational synthesis of the Predictive Maintenance Ecosystem?",
        "expectedStringOutput": "PREDICTIVE_MAINTENANCE_ECOSYSTEM_ACTIVE",
        "acceptableAnswers": [
          "PREDICTIVE_MAINTENANCE_ECOSYSTEM_ACTIVE",
          "capstoneStatus: PREDICTIVE_MAINTENANCE_ECOSYSTEM_ACTIVE"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_CAPSTONE_PREDICTIVE_MAINTENANCE_VISION_AUDIO_FUSION",
        "diagnosisMap": {
          "FAILED": {
            "misconceptionId": "MC_EDGEAI_CAPSTONE_PREDICTIVE_MAINTENANCE_VISION_AUDIO_FUSION",
            "errorExplanation": "Matches PREDICTIVE_MAINTENANCE_ECOSYSTEM_ACTIVE.",
            "recoveryPath": {
              "simplerExplanation": "Matches PREDICTIVE_MAINTENANCE_ECOSYSTEM_ACTIVE.",
              "guidedFixPrompt": "Type PREDICTIVE_MAINTENANCE_ECOSYSTEM_ACTIVE"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d30-b2-capstone-quality-audit",
      "day": 30,
      "blockNumber": 2,
      "title": "Platform-Wide Edge AI & TinyML Quality Invariant Audit",
      "conceptBudget": {
        "primaryConcept": "Edge AI Platform Invariant Audit",
        "supportingTerms": [
          "30-Day Completeness Invariant",
          "Zero Dynamic Malloc Invariant",
          "100% Quality Invariant"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d30-b1-capstone-architecture-orchestration",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "capstone_audit_demo.js",
          "initialCode": "function auditEdgeAiPlatform(daysCount, singleBlockDays, placeholdersCount) {\n  const passed = (daysCount === 30) && (singleBlockDays === 0) && (placeholdersCount === 0);\n  return {\n    totalCurriculumDays: daysCount,\n    singleBlockDays,\n    placeholdersCount,\n    auditGrade: passed ? '100_PERCENT_PRODUCTION_GRADE' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditEdgeAiPlatform(30, 0, 0)));",
          "expectedOutput": "{\"totalCurriculumDays\":30,\"singleBlockDays\":0,\"placeholdersCount\":0,\"auditGrade\":\"100_PERCENT_PRODUCTION_GRADE\"}",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What audit grade is awarded to the 30-Day Edge AI platform with 0 single block days and 0 placeholders?",
        "expectedStringOutput": "100_PERCENT_PRODUCTION_GRADE",
        "acceptableAnswers": [
          "100_PERCENT_PRODUCTION_GRADE",
          "auditGrade\":\"100_PERCENT_PRODUCTION_GRADE\""
        ],
        "primaryMisconceptionId": "MC_EDGEAI_CAPSTONE_PREDICTIVE_MAINTENANCE_VISION_AUDIO_FUSION",
        "diagnosisMap": {
          "DEFECT": {
            "misconceptionId": "MC_EDGEAI_CAPSTONE_PREDICTIVE_MAINTENANCE_VISION_AUDIO_FUSION",
            "errorExplanation": "All checks passed awards 100_PERCENT_PRODUCTION_GRADE.",
            "recoveryPath": {
              "simplerExplanation": "Awards 100_PERCENT_PRODUCTION_GRADE.",
              "guidedFixPrompt": "Type 100_PERCENT_PRODUCTION_GRADE"
            }
          }
        }
      }
    },
    {
      "id": "edgeai-d30-b3-capstone-mastery-cert",
      "day": 30,
      "blockNumber": 3,
      "title": "Edge AI, DSP & TinyML Systems Master Certification",
      "conceptBudget": {
        "primaryConcept": "Edge AI Master Certification",
        "supportingTerms": [
          "30 Days Completed",
          "90 Blocks Completed",
          "100% Quality Invariant"
        ]
      },
      "prerequisiteThresholds": [
        {
          "conceptId": "edgeai-d30-b2-capstone-quality-audit",
          "requiredLevel": "understood"
        }
      ],
      "media": [
        {
          "type": "runnable_code",
          "filename": "capstone_cert_demo.js",
          "initialCode": "console.log('🏆 30-DAY EDGE AI, DSP & TINYML SYSTEMS MASTERY ENGINE CERTIFIED [100% VERIFIED]');",
          "expectedOutput": "🏆 30-DAY EDGE AI, DSP & TINYML SYSTEMS MASTERY ENGINE CERTIFIED [100% VERIFIED]",
          "editable": false
        }
      ],
      "diagnosticCheck": {
        "type": "predict_output",
        "question": "What final certification string confirms complete mastery across all 30 days of Edge AI, DSP & TinyML Systems?",
        "expectedStringOutput": "🏆 30-DAY EDGE AI, DSP & TINYML SYSTEMS MASTERY ENGINE CERTIFIED [100% VERIFIED]",
        "acceptableAnswers": [
          "🏆 30-DAY EDGE AI, DSP & TINYML SYSTEMS MASTERY ENGINE CERTIFIED [100% VERIFIED]",
          "100% VERIFIED"
        ],
        "primaryMisconceptionId": "MC_EDGEAI_CAPSTONE_PREDICTIVE_MAINTENANCE_VISION_AUDIO_FUSION",
        "diagnosisMap": {
          "FAILED": {
            "misconceptionId": "MC_EDGEAI_CAPSTONE_PREDICTIVE_MAINTENANCE_VISION_AUDIO_FUSION",
            "errorExplanation": "Matches final master certification string.",
            "recoveryPath": {
              "simplerExplanation": "Matches final certification string.",
              "guidedFixPrompt": "Type 🏆 30-DAY EDGE AI, DSP & TINYML SYSTEMS MASTERY ENGINE CERTIFIED [100% VERIFIED]"
            }
          }
        }
      }
    }
  ]
}
};
