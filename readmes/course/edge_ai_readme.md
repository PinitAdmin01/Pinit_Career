# Edge AI, DSP & TinyML Systems — 30-Day Masterclass Curriculum

This comprehensive document outlines the daily curriculum roadmap for the **Edge AI, DSP & TinyML Systems (30-Day Masterclass)** course in PinIT Career OS, detailing every lecture topic, coding challenge, and test suite.

---

## 🧠 Course Overview
* **Name**: Edge AI, DSP & TinyML Systems
* **ID**: `course-iot-edge-ai`
* **Duration**: 30 Days (4 Weeks)
* **Target Audience**: TinyML Engineers / DSP Developers / Edge AI Architects
* **Learning Interface**: Model output arrays, tensor arena buffers charts, window sliding frames diagrams, and inference latency logs.
* **Evaluation Sandbox**: Computational engines checking weight quantization calibrations, tensor arena allocations capacity rules, SIMD register alignment dividers, DSP sliding window frames counts formulas, inference latency deadlines microsecond bounds, classification probabilities thresholds triggers, and pipeline compliance capstone audits.

---

## 📅 Detailed Day-by-Day Syllabus

### 🧠 Week 1: Weight Quantization, SIMD Acceleration & DSP Windowing

#### 🟢 Day 1: Introduction to TinyML Pipelines & Model Quantization
* **Lecture Syllabus**:
  - TinyML deployment lifecycle steps
  - Floating point vs Integer model sizes
  - Microcontroller RAM and Flash limits
* **Status**: Lecture Only (No coding exams or assignments for Day 1 to build core conceptual memory).

#### 🟢 Day 2: Embedded Device Constraints & Float32 Footprint Estimation
* **Lecture Syllabus**:
  - Weight metrics calculations
  - Flash memory limits on STM32 boards
  - Memory allocation overhead models
* **Status**: Lecture Only (No coding exams or assignments for Day 2).

#### 🟢 Day 3: Weight Quantization & Scaling parameters math
* **Lecture Syllabus**:
  - Quantization scaling equations
  - Zero-point coordinate alignments
  - Int8 integer scale limits
* **Coding Exam**: `edge-basics-exam-day-3` (`quantizeWeight`)
  - **Task**: Write a JS function `quantizeWeight(val, scale, zeroPoint)` compressing float weights to integer values.
  - **Test**: `quantizeWeight(0.5, 0.1, 10) === 15` (clamps between -128 and 127).
* **Coding Assignment**: `edge-basics-assign-day-3` (`dequantizeWeight`)
  - **Task**: Write a JS function `dequantizeWeight(qVal, scale, zeroPoint)` converting integers to floats.
  - **Test**: Multiplies weights scales.

#### 🟢 Day 4: TFLite Micro: Tensor Arena sizing and memory offsets
* **Lecture Syllabus**:
  - Tensor Arena buffer allocations
  - Dynamic RAM constraints
  - Preventing heap memory fragmentations
* **Coding Exam**: `edge-basics-exam-day-4` (`isArenaSizedSafe`)
  - **Task**: Write a JS function `isArenaSizedSafe(arenaSize, bufferSizesArray)` checking memory bounds.
  - **Test**: Rejects allocation sums exceeding arena space capacity.
* **Coding Assignment**: `edge-basics-assign-day-4` (`getArenaMargin`)
  - **Task**: Write a JS function `getArenaMargin(arenaSize, bufferSizesArray)` calculating free memory.
  - **Test**: Returns clamped margin capacity values.

#### 🟢 Day 5: SIMD Vector Acceleration: Registers alignment
* **Lecture Syllabus**:
  - SIMD parallel registers accelerations
  - Vector lengths alignments constraints
  - Verifying array metrics limits
* **Coding Exam**: `edge-basics-exam-day-5` (`isValidSimdLength`)
  - **Task**: Write a JS function `isValidSimdLength(len)` checking register alignments.
  - **Test**: Enforces positive lengths divisible by 4.
* **Coding Assignment**: `edge-basics-assign-day-5` (`getSimdPadding`)
  - **Task**: Write a JS function `getSimdPadding(len)` padding lengths.
  - **Test**: Returns element padding sizes required.

#### 🟢 Day 6: DSP sampling pipelines: Sliding signal window frames
* **Lecture Syllabus**:
  - DSP signal buffer pipelines
  - Sliding window stride sizes configurations
  - Continuous signal feature extraction
* **Coding Exam**: `edge-basics-exam-day-6` (`getDspFrameCount`)
  - **Task**: Write a JS function `getDspFrameCount(totalSamples, windowSize, strideSize)` slicing signal streams.
  - **Test**: Computes overlap counts sliding by strides.
* **Coding Assignment**: `edge-basics-assign-day-6` (`getOverlapPct`)
  - **Task**: Write a JS function `getOverlapPct(windowSize, strideSize)` computing frame overlaps.
  - **Test**: Converts stride ratios to percentages.

#### 🟢 Day 7: Edge Execution Benchmarks: Latency deadline validations
* **Lecture Syllabus**:
  - Edge AI inference latency tracking
  - Hardware execution deadlines constraints
  - Inference speed optimization goals
* **Coding Exam**: `edge-basics-exam-day-7` (`isInferenceOnTime`)
  - **Task**: Write a JS function `isInferenceOnTime(latencyMs, maxClockCycleUs)` auditing clock deadlines.
  - **Test**: Converts milliseconds to microseconds, evaluating limits.
* **Coding Assignment**: `edge-basics-assign-day-7` (`msToUs`)
  - **Task**: Write a JS function `msToUs(ms)` converting latency units.
  - **Test**: Multiplies input by 1000.

---

### 🧠 Week 2: Model Classifiers & Pipeline compliance Audits

#### 🟢 Day 8: TinyML Classifier: Output confidence scorer
* **Lecture Syllabus**:
  - Model output class vectors
  - Evaluating soft-max confidence probabilities
  - Triggering hardware alert outputs rules
* **Coding Exam**: `edge-basics-exam-day-8` (`isAnomalyDetected`)
  - **Task**: Write a JS function `isAnomalyDetected(confidences, anomalyIndex, threshold)` checking classification vectors.
  - **Test**: Triggers alert outputs if anomaly confidence exceeds thresholds.
* **Coding Assignment**: `edge-basics-assign-day-8` (`getArgmax`)
  - **Task**: Write a JS function `getArgmax(arr)` finding top probability index.
  - **Test**: Returns index of largest float.

#### 🟢 Day 9: Final Capstone: TinyML Pipeline & DSP compliance audit
* **Lecture Syllabus**:
  - Weight quantization bounds checks
  - Tensor arena allocation sizing review
  - DSP frame buffer calculations validations
* **Coding Exam**: `edge-basics-exam-day-9` (`evaluateTinyMlBuild`)
  - **Task**: Write a JS function `evaluateTinyMlBuild(report)` auditing TinyML pipelines.
  - **Test**: Checks weights quantization, arena sizes, and latency parameters in report.
* **Coding Assignment**: `edge-basics-assign-day-9` (`getMemoryAlert`)
  - **Task**: Write a JS function `getMemoryAlert(marginKb)` scoring memory.
  - **Test**: Returns WARNING if margin falls under 16KB.

---

### 🧠 Week 3: Applied TinyML Applications & DSP Optimizations

#### 🟢 Day 10: TinyML Pipeline & DSP compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing weight quantization metrics
  - Assembling pipeline profile checklists
  - Verifying DSP sampling window parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 11: TinyML Pipeline & DSP compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing weight quantization metrics
  - Assembling pipeline profile checklists
  - Verifying DSP sampling window parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 12: TinyML Pipeline & DSP compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing weight quantization metrics
  - Assembling pipeline profile checklists
  - Verifying DSP sampling window parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 13: TinyML Pipeline & DSP compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing weight quantization metrics
  - Assembling pipeline profile checklists
  - Verifying DSP sampling window parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 14: TinyML Pipeline & DSP compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing weight quantization metrics
  - Assembling pipeline profile checklists
  - Verifying DSP sampling window parameters
* **Status**: Lecture Only (Capstones pipeline review).

---

### 🧠 Week 4: Applied TinyML Applications & DSP Optimizations (Review)

#### 🟢 Day 15: TinyML Pipeline & DSP compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing weight quantization metrics
  - Assembling pipeline profile checklists
  - Verifying DSP sampling window parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 16: TinyML Pipeline & DSP compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing weight quantization metrics
  - Assembling pipeline profile checklists
  - Verifying DSP sampling window parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 17: TinyML Pipeline & DSP compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing weight quantization metrics
  - Assembling pipeline profile checklists
  - Verifying DSP sampling window parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 18: TinyML Pipeline & DSP compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing weight quantization metrics
  - Assembling pipeline profile checklists
  - Verifying DSP sampling window parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 19: TinyML Pipeline & DSP compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing weight quantization metrics
  - Assembling pipeline profile checklists
  - Verifying DSP sampling window parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 20: TinyML Pipeline & DSP compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing weight quantization metrics
  - Assembling pipeline profile checklists
  - Verifying DSP sampling window parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 21: TinyML Pipeline & DSP compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing weight quantization metrics
  - Assembling pipeline profile checklists
  - Verifying DSP sampling window parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 22: TinyML Pipeline & DSP compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing weight quantization metrics
  - Assembling pipeline profile checklists
  - Verifying DSP sampling window parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 23: TinyML Pipeline & DSP compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing weight quantization metrics
  - Assembling pipeline profile checklists
  - Verifying DSP sampling window parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 24: TinyML Pipeline & DSP compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing weight quantization metrics
  - Assembling pipeline profile checklists
  - Verifying DSP sampling window parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 25: TinyML Pipeline & DSP compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing weight quantization metrics
  - Assembling pipeline profile checklists
  - Verifying DSP sampling window parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 26: TinyML Pipeline & DSP compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing weight quantization metrics
  - Assembling pipeline profile checklists
  - Verifying DSP sampling window parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 27: TinyML Pipeline & DSP compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing weight quantization metrics
  - Assembling pipeline profile checklists
  - Verifying DSP sampling window parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 28: TinyML Pipeline & DSP compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing weight quantization metrics
  - Assembling pipeline profile checklists
  - Verifying DSP sampling window parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 29: TinyML Pipeline & DSP compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing weight quantization metrics
  - Assembling pipeline profile checklists
  - Verifying standards validations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 30: TinyML Pipeline & DSP compliance audit (Review)
* **Lecture Syllabus**:
  - Assemble final Edge AI TinyML deployments and DSP pipeline profiles compliance audit report
  - Verify Int8 weights quantizations scales and Tensor Arena memory buffers
  - Confirm DSP sliding sampling window frames counts and hardware inference latency deadline configurations
* **Status**: Lecture Only (Final day capstone audit checklist review).

---
*Created by Antigravity*
