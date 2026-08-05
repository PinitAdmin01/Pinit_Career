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

export const IOT_EDGE_AI_30_DAYS_CONFIGS: DayConfig[] = [
  {
    title: "What is IoT Edge AI & TinyML? — Pipelines, Float vs Integer and Microcontroller Limits",
    desc: "IoT Edge AI (often called TinyML, or Tiny Machine Learning) is the practice of running machine learning models directly on small, low-power microcontrollers (like the chips inside smartwatches, smart rings, and home appliances) rather than on giant cloud servers. Before Edge AI, if a smart home sensor wanted to detect a leak, it had to send raw sensor data over Wi-Fi to a cloud server, wait for the cloud AI to analyze it, and receive a response. This had three major flaws: (1) Latency: waiting for Wi-Fi took seconds. (2) Power: sending Wi-Fi signals drains batteries in days. (3) Privacy: sending private camera or voice feeds to external servers is a security risk. TinyML solves this by running the model locally on the device itself. To understand TinyML, we must understand the constraints of a MICROCONTROLLER (MCU). Unlike your laptop with 16GB RAM and 512GB storage, a microcontroller might only have 256KB of RAM and 1MB of storage! A standard AI model is far too large to fit on these chips. We solve this using QUANTIZATION. In training, models represent numbers as 32-bit floating points (Float32 — numbers with decimals that take 4 bytes of memory each). Quantization converts these decimal numbers into 8-bit integers (Int8 — whole numbers from -128 to 127 that take only 1 byte of memory each). This makes the model 4 times smaller instantly, allowing it to fit into the microcontroller's tiny memory. (Real world: Google's wake-word detector on Android phones ('Hey Google') uses TinyML. The microphone feed is analyzed locally on a tiny low-power chip 24/7. The phone's main processor remains asleep, saving battery until the local chip detects the wake word and wakes the rest of the phone up.)",
    syllabus: ["IoT Edge AI (TinyML) = running ML models locally on low-power microcontrollers (smartwatches, sensors) rather than cloud servers. Eliminates latency, saves battery power, and guarantees data privacy.", "Microcontroller (MCU) limits: MCUs have tiny memory spaces (e.g. 256KB RAM / 1MB Flash). Standard cloud models are too large to fit directly without compression optimizations.", "Quantization = converting Float32 decimal weights (4 bytes each) to Int8 integers (1 byte each). Model sizes shrink by 4x, making them compatible with embedded device storage."],
    eTitle: "Exam: ReLU Activation Validator",
    eDesc: "Not tested on day 1",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: LeakyReLU boundary checker",
    aDesc: "Not tested on day 1",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Microcontroller Memory Architecture — Flash vs SRAM and Estimating Model Sizes",
    desc: "Before you can deploy an AI model to an embedded device, you must understand where the model lives and runs inside the chip. A microcontroller has two primary memory types: (1) Flash Memory: the non-volatile storage. It behaves like your computer's hard drive — it stores your code and model weights. The data in Flash is read-only at runtime and persists even when the device is powered off. (2) SRAM (Static RAM): the volatile running memory, like your computer's RAM. SRAM is where the processor stores runtime variables, stacks, and the 'activation maps' (temporary layer calculations) during model execution. Data in SRAM is lost when power is turned off. WHY RAM IS THE BOTTLENECK: while microcontrollers often have up to 1MB of Flash, they usually have less than 256KB of SRAM. This means your model's weights can comfortably fit in Flash, but the active calculation memory during the forward pass (inference) must fit in SRAM. If your model's layer calculations exceed the available SRAM, the device will crash. ESTIMATING MODEL SIZE: we can calculate the storage size of our model weights using a simple formula: Size = Number of Parameters * Bytes per Weight. For example, a model with 100,000 parameters: Float32 size = 100,000 * 4 bytes = 400,000 bytes (~400KB). Int8 size = 100,000 * 1 byte = 100,000 bytes (~100KB). (Real world: When building a smart doorbell camera, the developer calculates: the image classification model has 300,000 parameters. In Float32, it requires 1.2MB, which exceeds the board's 1MB Flash. By quantizing it to Int8, it only requires 300KB, leaving plenty of room in Flash for the camera control code.)",
    syllabus: ["Microcontroller memory: Flash (non-volatile, stores compiled code and model weights, read-only at runtime) vs SRAM (volatile, stores activation layers and variables).", "RAM bottleneck: Flash space is usually larger (up to 1MB+), while SRAM running memory is extremely limited (often <256KB). Active model layers must fit in SRAM.", "Size calculation formula: size in bytes = parameter count * bytes per weight. Float32 weights use 4 bytes each, while quantized Int8 weights use 1 byte each."],
    eTitle: "Exam: Model Size Estimator",
    eDesc: "Not tested on day 2",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Parameters Count check",
    aDesc: "Not tested on day 2",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Weight Quantization & Scaling parameters math",
    desc: "Master float32 to int8 quantization scaling equations. (Real world: Model compilers calculate scale and zero-point parameters, mapping float weights to integer ranges.)",
    syllabus: ["Quantization scaling equations", "Zero-point coordinate alignments", "Int8 integer scale limits"],
    eTitle: "Exam: Weight Quantizer",
    eDesc: "Write a JS function `quantizeWeight(val, scale, zeroPoint)` returning Math.round(val / scale) + zeroPoint. Clamped between -128 and 127. Return zeroPoint if scale is <= 0.",
    eStarter: "function quantizeWeight(val, scale, zeroPoint) {\n    // Write your code here\n    \n}",
    eHint: "Divide val by scale, round, add zeroPoint, clamp to [-128, 127] limits.",
    eTest: "if (typeof quantizeWeight !== 'function') throw new Error('Method quantizeWeight not found');\nif (quantizeWeight(0.5, 0.1, 10) !== 15) throw new Error('Standard quantization failed');\nif (quantizeWeight(100.0, 0.1, 0) !== 127) throw new Error('Upper clamp check failed');\nif (quantizeWeight(-100.0, 0.1, 0) !== -128) throw new Error('Lower clamp check failed');",
    aTitle: "Assignment: Dequantize Weight check",
    aDesc: "Write a JS function `dequantizeWeight(qVal, scale, zeroPoint)` returning (qVal - zeroPoint) * scale.",
    aStarter: "function dequantizeWeight(qVal, scale, zeroPoint) {\n    // Write your code here\n    \n}",
    aHint: "Subtract zeroPoint, multiply by scale.",
    aTest: "if (typeof dequantizeWeight !== 'function') throw new Error('Method dequantizeWeight not found');\nif (Math.abs(dequantizeWeight(15, 0.1, 10) - 0.5) > 1e-6) throw new Error('Dequantize math failed');"
  },
  {
    title: "TFLite Micro: Tensor Arena sizing and memory offsets",
    desc: "Learn heap memory layout allocations. (Real world: TinyML interpreters carve a dedicated arena space from MCU RAM, preventing dynamic memory fragmentation.)",
    syllabus: ["Tensor Arena buffer allocations", "Dynamic RAM constraints", "Preventing heap memory fragmentations"],
    eTitle: "Exam: Tensor Arena Sizing Auditor",
    eDesc: "Write a JS function `isArenaSizedSafe(arenaSize, bufferSizesArray)` returning true if arenaSize is strictly greater than sum of bufferSizesArray elements. Return false if bufferSizesArray is null or arenaSize <= 0.",
    eStarter: "function isArenaSizedSafe(arenaSize, bufferSizesArray) {\n    // Write your code here\n    \n}",
    eHint: "Sum bufferSizesArray using reduce, compare with arenaSize. Check boundaries.",
    eTest: "if (typeof isArenaSizedSafe !== 'function') throw new Error('Method isArenaSizedSafe not found');\nif (isArenaSizedSafe(1000, [200, 300, 400]) !== true) throw new Error('Safe size check failed');\nif (isArenaSizedSafe(800, [200, 300, 400]) !== false) throw new Error('Overflow size check failed');",
    aTitle: "Assignment: Arena margin calculator",
    aDesc: "Write a JS function `getArenaMargin(arenaSize, bufferSizesArray)` returning arenaSize - sum of buffers. Return 0 if negative.",
    aStarter: "function getArenaMargin(arenaSize, bufferSizesArray) {\n    // Write your code here\n    \n}",
    aHint: "Subtract sum of elements from arenaSize, clamp.",
    aTest: "if (typeof getArenaMargin !== 'function') throw new Error('Method getArenaMargin not found');\nif (getArenaMargin(1000, [200, 300]) !== 500) throw new Error('Margin math failed');"
  },
  {
    title: "SIMD Vector Acceleration: Registers alignment",
    desc: "Master processor vector acceleration rules. (Real world: DSP chips execute mathematical steps in parallel, requiring vector array lengths that align with registers sizes.)",
    syllabus: ["SIMD parallel registers accelerations", "Vector lengths alignments constraints", "Verifying array metrics limits"],
    eTitle: "Exam: SIMD Vector Validator",
    eDesc: "Write a JS function `isValidSimdLength(len)` returning true if len is positive integer and multiple of 4. Returns false otherwise.",
    eStarter: "function isValidSimdLength(len) {\n    // Write your code here\n    \n}",
    eHint: "Verify len > 0, check modulo 4 remainder equals 0.",
    eTest: "if (typeof isValidSimdLength !== 'function') throw new Error('Method isValidSimdLength not found');\nif (isValidSimdLength(16) !== true) throw new Error('Valid SIMD length check failed');\nif (isValidSimdLength(15) !== false) throw new Error('Non-multiple length check failed');",
    aTitle: "Assignment: SIMD Padding Generator",
    aDesc: "Write a JS function `getSimdPadding(len)` returning count of padding elements needed to align length to next multiple of 4: `(4 - (len % 4)) % 4`.",
    aStarter: "function getSimdPadding(len) {\n    // Write your code here\n    \n}",
    aHint: "Apply modulo operations to calculate padding size.",
    aTest: "if (typeof getSimdPadding !== 'function') throw new Error('Method getSimdPadding not found');\nif (getSimdPadding(10) !== 2) throw new Error('Padding math failed');"
  },
  {
    title: "DSP sampling pipelines: Sliding signal window frames",
    desc: "Master DSP raw data buffer slicing rules. (Real world: Accelerometer gesture models process data in sliding frames, sliding by 50% strides to ensure continuous event capturing.)",
    syllabus: ["DSP signal buffer pipelines", "Sliding window stride sizes configurations", "Continuous signal feature extraction"],
    eTitle: "Exam: DSP Window Stride Slicer",
    eDesc: "Write a JS function `getDspFrameCount(totalSamples, windowSize, strideSize)` returning number of complete sliding frames that can be parsed: `Math.floor((totalSamples - windowSize) / strideSize) + 1`. Return 0 if totalSamples < windowSize or strideSize <= 0.",
    eStarter: "function getDspFrameCount(totalSamples, windowSize, strideSize) {\n    // Write your code here\n    \n}",
    eHint: "Subtract window size from samples count, divide by stride, take floor, add 1. Verify bounds.",
    eTest: "if (typeof getDspFrameCount !== 'function') throw new Error('Method getDspFrameCount not found');\nif (getDspFrameCount(128, 64, 32) !== 3) throw new Error('DSP frame slicing count failed');",
    aTitle: "Assignment: Overlap percentage calculator",
    aDesc: "Write a JS function `getOverlapPct(windowSize, strideSize)` returning Math.round(((windowSize - strideSize) / windowSize) * 100). Return 0 if windowSize <= 0.",
    aStarter: "function getOverlapPct(windowSize, strideSize) {\n    // Write your code here\n    \n}",
    aHint: "Calculate overlap percentage scale.",
    aTest: "if (typeof getOverlapPct !== 'function') throw new Error('Method getOverlapPct not found');"
  },
  {
    title: "Edge Execution Benchmarks: Latency deadline validations",
    desc: "Master edge inference timing budgets. (Real world: Smart rings verify model inference times against hardware clock interrupt cycles to avoid UI frame drops.)",
    syllabus: ["Edge AI inference latency tracking", "Hardware execution deadlines constraints", "Inference speed optimization goals"],
    eTitle: "Exam: Inference Latency Auditor",
    eDesc: "Write a JS function `isInferenceOnTime(latencyMs, maxClockCycleUs)` returning true if latencyMs * 1000 <= maxClockCycleUs. Return false if inputs are negative.",
    eStarter: "function isInferenceOnTime(latencyMs, maxClockCycleUs) {\n    // Write your code here\n    \n}",
    eHint: "Convert milliseconds parameters to microseconds, evaluating threshold constraints limits.",
    eTest: "if (typeof isInferenceOnTime !== 'function') throw new Error('Method isInferenceOnTime not found');\nif (isInferenceOnTime(5, 6000) !== true) throw new Error('Inference latency auditor failed');",
    aTitle: "Assignment: Clock cycle converter",
    aDesc: "Write a JS function `msToUs(ms)` returning ms * 1000. Return 0 if negative.",
    aStarter: "function msToUs(ms) {\n    // Write your code here\n    \n}",
    aHint: "Multiply input by 1000.",
    aTest: "if (typeof msToUs !== 'function') throw new Error('Method msToUs not found');"
  },
  {
    title: "TinyML Classifier: Output confidence scorer",
    desc: "Master model output classification logic. (Real world: Industrial anomaly sensors trigger emergency valves shutting routines if model anomaly probabilities exceed 95% threshold limits.)",
    syllabus: ["Model output class vectors", "Evaluating soft-max confidence probabilities", "Triggering hardware alert outputs rules"],
    eTitle: "Exam: Classification Threshold Validator",
    eDesc: "Write a JS function `isAnomalyDetected(confidences, anomalyIndex, threshold)` returning true if confidences[anomalyIndex] >= threshold. Return false if inputs are invalid or index is out of bounds.",
    eStarter: "function isAnomalyDetected(confidences, anomalyIndex, threshold) {\n    // Write your code here\n    \n}",
    eHint: "Access array at target index, evaluating decimal probabilities thresholds bounds.",
    eTest: "if (typeof isAnomalyDetected !== 'function') throw new Error('Method isAnomalyDetected not found');\nif (isAnomalyDetected([0.1, 0.05, 0.85], 2, 0.8) !== true) throw new Error('Anomaly validation failed');",
    aTitle: "Assignment: Argmax classifier finder",
    aDesc: "Write a JS function `getArgmax(arr)` returning index of largest float value in array.",
    aStarter: "function getArgmax(arr) {\n    // Write your code here\n    \n}",
    aHint: "Find maximum element index in array loop.",
    aTest: "if (typeof getArgmax !== 'function') throw new Error('Method getArgmax not found');"
  },
  {
    title: "Final Capstone: TinyML Pipeline & DSP compliance audit",
    desc: "Perform evaluations of weight quantization parameters, check tensor arena memory boundaries, verify DSP window sliding strides counts, and evaluate inference latency deadlines. (Real world: TinyML architects profile compiled binaries, auditing RAM usage and pipeline speeds.)",
    syllabus: ["Weight quantization bounds checks", "Tensor arena allocation sizing review", "DSP frame buffer calculations validations"],
    eTitle: "Exam: TinyML Compliance Auditor",
    eDesc: "Write a JS function `evaluateTinyMlBuild(report)` returning true if report.quantizationSafe === true and report.arenaMemorySufficient === true and report.latencyBelowThreshold === true.",
    eStarter: "function evaluateTinyMlBuild(report) {\n    // Write your code here\n    \n}",
    eHint: "Verify report.quantizationSafe, report.arenaMemorySufficient, and report.latencyBelowThreshold boolean properties in report.",
    eTest: "if (typeof evaluateTinyMlBuild !== 'function') throw new Error('Method evaluateTinyMlBuild not found');\nconst rep = { quantizationSafe: true, arenaMemorySufficient: true, latencyBelowThreshold: true };\nif (evaluateTinyMlBuild(rep) !== true) throw new Error('TinyML compliance check failed');",
    aTitle: "Assignment: Memory alert scorer",
    aDesc: "Write a JS function `getMemoryAlert(marginKb)` returning marginKb < 16 ? 'WARNING' : 'OK'.",
    aStarter: "function getMemoryAlert(marginKb) {\n    // Write your code here\n    \n}",
    aHint: "Check integer margin threshold constraints.",
    aTest: "if (typeof getMemoryAlert !== 'function') throw new Error('Method getMemoryAlert not found');"
  },
  {
    title: "Final Capstone: TinyML Pipeline & DSP compliance audit (Review)",
    desc: "Review TinyML models compilations, evaluate weight quantization parameters, check tensor arena sizing maps, and verify DSP sliding frame stride counts. (Real world: TinyML architects profile compiled binaries, auditing RAM usage and pipeline speeds.)",
    syllabus: ["Reviewing weight quantization metrics", "Assembling pipeline profile checklists", "Verifying DSP sampling window parameters"],
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
    title: "Final Capstone: TinyML Pipeline & DSP compliance audit (Review)",
    desc: "Review TinyML models compilations, evaluate weight quantization parameters, check tensor arena sizing maps, and verify DSP sliding frame stride counts. (Real world: TinyML architects profile compiled binaries, auditing RAM usage and pipeline speeds.)",
    syllabus: ["Reviewing weight quantization metrics", "Assembling pipeline profile checklists", "Verifying DSP sampling window parameters"],
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
    title: "Final Capstone: TinyML Pipeline & DSP compliance audit (Review)",
    desc: "Review TinyML models compilations, evaluate weight quantization parameters, check tensor arena sizing maps, and verify DSP sliding frame stride counts. (Real world: TinyML architects profile compiled binaries, auditing RAM usage and pipeline speeds.)",
    syllabus: ["Reviewing weight quantization metrics", "Assembling pipeline profile checklists", "Verifying DSP sampling window parameters"],
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
    title: "Final Capstone: TinyML Pipeline & DSP compliance audit (Review)",
    desc: "Review TinyML models compilations, evaluate weight quantization parameters, check tensor arena sizing maps, and verify DSP sliding frame stride counts. (Real world: TinyML architects profile compiled binaries, auditing RAM usage and pipeline speeds.)",
    syllabus: ["Reviewing weight quantization metrics", "Assembling pipeline profile checklists", "Verifying DSP sampling window parameters"],
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
    title: "Final Capstone: TinyML Pipeline & DSP compliance audit (Review)",
    desc: "Review TinyML models compilations, evaluate weight quantization parameters, check tensor arena sizing maps, and verify DSP sliding frame stride counts. (Real world: TinyML architects profile compiled binaries, auditing RAM usage and pipeline speeds.)",
    syllabus: ["Reviewing weight quantization metrics", "Assembling pipeline profile checklists", "Verifying DSP sampling window parameters"],
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
    title: "Final Capstone: TinyML Pipeline & DSP compliance audit (Review)",
    desc: "Review TinyML models compilations, evaluate weight quantization parameters, check tensor arena sizing maps, and verify DSP sliding frame stride counts. (Real world: TinyML architects profile compiled binaries, auditing RAM usage and pipeline speeds.)",
    syllabus: ["Reviewing weight quantization metrics", "Assembling pipeline profile checklists", "Verifying DSP sampling window parameters"],
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
    title: "Final Capstone: TinyML Pipeline & DSP compliance audit (Review)",
    desc: "Review TinyML models compilations, evaluate weight quantization parameters, check tensor arena sizing maps, and verify DSP sliding frame stride counts. (Real world: TinyML architects profile compiled binaries, auditing RAM usage and pipeline speeds.)",
    syllabus: ["Reviewing weight quantization metrics", "Assembling pipeline profile checklists", "Verifying DSP sampling window parameters"],
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
    title: "Final Capstone: TinyML Pipeline & DSP compliance audit (Review)",
    desc: "Review TinyML models compilations, evaluate weight quantization parameters, check tensor arena sizing maps, and verify DSP sliding frame stride counts. (Real world: TinyML architects profile compiled binaries, auditing RAM usage and pipeline speeds.)",
    syllabus: ["Reviewing weight quantization metrics", "Assembling pipeline profile checklists", "Verifying DSP sampling window parameters"],
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
    title: "Final Capstone: TinyML Pipeline & DSP compliance audit (Review)",
    desc: "Review TinyML models compilations, evaluate weight quantization parameters, check tensor arena sizing maps, and verify DSP sliding frame stride counts. (Real world: TinyML architects profile compiled binaries, auditing RAM usage and pipeline speeds.)",
    syllabus: ["Reviewing weight quantization metrics", "Assembling pipeline profile checklists", "Verifying standards validations"],
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
    title: "Final Capstone: TinyML Pipeline & DSP compliance audit (Review)",
    desc: "Review TinyML models compilations, evaluate weight quantization parameters, check tensor arena sizing maps, and verify DSP sliding frame stride counts. (Real world: TinyML architects profile compiled binaries, auditing RAM usage and pipeline speeds.)",
    syllabus: ["Reviewing weight quantization metrics", "Assembling pipeline profile checklists", "Verifying standards validations"],
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
    title: "Final Capstone: TinyML Pipeline & DSP compliance audit (Review)",
    desc: "Review TinyML models compilations, evaluate weight quantization parameters, check tensor arena sizing maps, and verify DSP sliding frame stride counts. (Real world: TinyML architects profile compiled binaries, auditing RAM usage and pipeline speeds.)",
    syllabus: ["Reviewing weight quantization metrics", "Assembling pipeline profile checklists", "Verifying standards validations"],
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
    title: "Final Capstone: TinyML Pipeline & DSP compliance audit (Review)",
    desc: "Review TinyML models compilations, evaluate weight quantization parameters, check tensor arena sizing maps, and verify DSP sliding frame stride counts. (Real world: TinyML architects profile compiled binaries, auditing RAM usage and pipeline speeds.)",
    syllabus: ["Reviewing weight quantization metrics", "Assembling pipeline profile checklists", "Verifying standards validations"],
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

export const IOT_EDGE_AI_30_DAYS_QUESTS = IOT_EDGE_AI_30_DAYS_CONFIGS.flatMap((cfg, dIdx) => {
  const dayNum = dIdx + 1;
  const lecture = {
    id: `edge-basics-lecture-day-${dayNum}`,
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
        id: `edge-basics-lecture2-day-1`,
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
        id: `edge-basics-lecture3-day-1`,
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
        id: `edge-basics-lecture2-day-2`,
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
        id: `edge-basics-lecture3-day-2`,
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
  return buildEnrichedDayQuests('edge-basics', dayNum, cfg);
});
