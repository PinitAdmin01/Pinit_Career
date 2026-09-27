# Edge AI, DSP & TinyML Systems — 30-Day Masterclass Curriculum

This comprehensive document outlines the daily curriculum roadmap for the **Edge AI, DSP & TinyML Systems (30-Day Masterclass)** course in PinIT Career OS, detailing every lecture topic, coding challenge, and test suite.

---

## 🧠 Course Overview
* **Name**: Edge AI, DSP & TinyML Systems
* **ID**: `course-iot-edge-ai`
* **Duration**: 30 Days (4 Weeks)
* **Target Audience**: TinyML Engineers / Embedded AI Developers
* **Learning Interface**: Quantized tensor topologies, audio spectrogram visualizers, model latency charts, and DSP signal buffers.
* **Evaluation Sandbox**: TinyML compilers verifying ReLU activation functions, Int8 weight quantizations, digital signal filtering buffers, and classification accuracy dropouts.

---

## 📅 Detailed Day-by-Day Syllabus

### 🧠 Week 1: Quantization & Tensor Arena Allocations

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
* **Coding Exam**: `edgeai-basics-exam-day-3` (`quantizeWeight`)
  - **Task**: Write a JS function `quantizeWeight(val, scale, zeroPoint)` mapping float weights to integer ranges.
  - **Test**: `quantizeWeight(0.5, 0.1, 10)` returns `15`, clamped between `-128` and `127`.
* **Coding Assignment**: `edgeai-basics-assign-day-3` (`dequantizeWeight`)
  - **Task**: Write a JS function `dequantizeWeight(qVal, scale, zeroPoint)` reversing quantization.
  - **Test**: Multiplies values back to floating decimal representations.

#### 🟢 Day 4: TFLite Micro: Tensor Arena sizing and memory offsets
* **Lecture Syllabus**:
  - Tensor Arena buffer allocations
  - Dynamic RAM constraints
  - Preventing heap memory fragmentations
* **Coding Exam**: `edgeai-basics-exam-day-4` (`isArenaSizedSafe`)
  - **Task**: Write a JS function `isArenaSizedSafe(arenaSize, bufferSizesArray)` auditing memory limits.
  - **Test**: Compares heap allocation targets against total available arena buffers.
* **Coding Assignment**: `edgeai-basics-assign-day-4` (`getArenaMargin`)
  - **Task**: Write a JS function `getArenaMargin(arenaSize, bufferSizesArray)` computing buffer headroom.
  - **Test**: Deducts array total sizes from arena bounds.

#### 🟢 Day 5: SIMD Vector Acceleration: Registers alignment
* **Lecture Syllabus**:
  - SIMD parallel registers accelerations
  - Vector lengths alignments constraints
  - Verifying array metrics limits
* **Coding Exam**: `edgeai-basics-exam-day-5` (`isValidSimdLength`)
  - **Task**: Write a JS function `isValidSimdLength(len)` checking register alignments.
  - **Test**: Confirms length parameters are positive and multiples of 4.
* **Coding Assignment**: `edgeai-basics-assign-day-5` (`getSimdPadding`)
  - **Task**: Write a JS function `getSimdPadding(len)` calculating SIMD data alignment padding.
  - **Test**: Returns remaining count to reach the next multiple of 4.

#### 🟢 Day 6: Float16 compression format & range representability
* **Lecture Syllabus**:
  - Float16 representation properties
  - Quantized range boundaries
  - Half-precision conversion rules
* **Coding Exam**: `edgeai-basics-exam-day-6` (`isFloat16Representable`)
  - **Task**: Write a JS function `isFloat16Representable(val)` verifying exponent boundaries.
  - **Test**: Confirms absolute values fit between `5.96e-8` and `65504`.
* **Coding Assignment**: `edgeai-basics-assign-day-6` (`mockFloat16`)
  - **Task**: Write a JS function `mockFloat16(val)` simulating half-precision.
  - **Test**: Formats inputs to a precision of 4 characters.

#### 🟢 Day 7: Layer computation deadlines
* **Lecture Syllabus**:
  - Compiler layer execution speed
  - auditing model operation counts
  - minimizing latency overhead
* **Coding Exam**: `edgeai-basics-exam-day-7` (`isLayerSpeedSafe`)
  - **Task**: Write a JS function `isLayerSpeedSafe(opCount, msPerOp, deadlineMs)` monitoring execution deadlines.
  - **Test**: Rejects layers whose operation duration products exceed deadlines.
* **Coding Assignment**: `edgeai-basics-assign-day-7` (`getLayerExecutionMargin`)
  - **Task**: Write a JS function `getLayerExecutionMargin(opCount, msPerOp, deadlineMs)` checking execution headroom.
  - **Test**: Returns subtraction margins.

---

### 🧠 Week 2: DSP Signal Processing & Spectrogram Filters

#### 🟢 Day 8: DSP Sampling Rate: Period conversions
* **Lecture Syllabus**:
  - Nyquist-Shannon sampling frequencies
  - FFT spectral leakage windowing
  - Frequency bin resolution checks
* **Coding Exam**: `edgeai-basics-exam-day-8` (`getSamplingInterval`)
  - **Task**: Write a JS function `getSamplingInterval(frequencyHz)` calculating Period.
  - **Test**: Translates frequencies to millisecond ranges, rejecting zero inputs.
* **Coding Assignment**: `edgeai-basics-assign-day-8` (`getSamplingPeriodMicroseconds`)
  - **Task**: Write a JS function `getSamplingPeriodMicroseconds(freq)` converting to microseconds.
  - **Test**: Divides 1e6 by frequency units.

#### 🟢 Day 9: Sensor Signal Processing: Moving average sliding window smoothing
* **Lecture Syllabus**:
  - sliding window average algorithms
  - smoothing sensor signal noises
  - Buffer arrays indexing constraints
* **Coding Exam**: `edgeai-basics-exam-day-9` (`movingAverage`)
  - **Task**: Write a JS function `movingAverage(values, windowSize)` filtering accelerometer noises.
  - **Test**: Outputs arrays of window averages, handling empty inputs gracefully.
* **Coding Assignment**: `edgeai-basics-assign-day-9` (`isWindowOffsetSafe`)
  - **Task**: Write a JS function `isWindowOffsetSafe(len, index, size)` validating indexing boundaries.
  - **Test**: Restricts sliding window offsets to arrays limits.

#### 🟢 Day 10: ADC Conversion: Nyquist limits & aliasing distortion prevention
* **Lecture Syllabus**:
  - Nyquist limits and aliasing distortion
  - ADC conversion frequency targets
  - verifying signal maximum frequencies
* **Coding Exam**: `edgeai-basics-exam-day-10` (`isSamplingFrequencyAdequate`)
  - **Task**: Write a JS function `isSamplingFrequencyAdequate(sampleRate, maxFreq)` verifying ADC frequencies.
  - **Test**: Enforces sampling frequency to be at least double the signal maximum bounds.
* **Coding Assignment**: `edgeai-basics-assign-day-10` (`getMinNyquistRate`)
  - **Task**: Write a JS function `getMinNyquistRate(maxFreq)` finding minimum rates.
  - **Test**: Multiplies max frequency parameters by 2.

#### 🟢 Day 11: Windowing functions: Hann window cosine scaling parameters
* **Lecture Syllabus**:
  - Hann and Hamming window functions
  - Mathematical cosine scaling formulas
  - Spectral leakage boundary controls
* **Coding Exam**: `edgeai-basics-exam-day-11` (`getHannCoefficient`)
  - **Task**: Write a JS function `getHannCoefficient(index, size)` compiling window profiles.
  - **Test**: Applies cosine equations, returning `0` at boundary indices.
* **Coding Assignment**: `edgeai-basics-assign-day-11` (`scaleWindowAmplitude`)
  - **Task**: Write a JS function `scaleWindowAmplitude(val, coeff)` scaling amplitudes.
  - **Test**: Multiplies coefficients with inputs.

#### 🟢 Day 12: FFT: Bin frequencies spectral resolution estimation
* **Lecture Syllabus**:
  - FFT bins spectral calculations
  - FFT points parameters (256, 512, 1024)
  - Resolving overlapping frequency outputs
* **Coding Exam**: `edgeai-basics-exam-day-12` (`getFftBinResolution`)
  - **Task**: Write a JS function `getFftBinResolution(sampleRate, fftPoints)` estimating bin frequencies.
  - **Test**: Divides sampling rate by FFT points counts.
* **Coding Assignment**: `edgeai-basics-assign-day-12` (`isPowerOfTwo`)
  - **Task**: Write a JS function `isPowerOfTwo(val)` checking FFT constraints.
  - **Test**: Uses bitwise operations to check inputs.

#### 🟢 Day 13: Digital Filter design: High-pass Butterworth filter cutoff limits
* **Lecture Syllabus**:
  - Digital Butterworth noise filters
  - High-pass cutoff frequency checks
  - Verifying signal frequencies margins
* **Coding Exam**: `edgeai-basics-exam-day-13` (`isCutoffFrequencySafe`)
  - **Task**: Write a JS function `isCutoffFrequencySafe(cutoff, Nyquist)` checking cutoff parameters.
  - **Test**: Enforces cutoff frequency to lie below Nyquist limits.
* **Coding Assignment**: `edgeai-basics-assign-day-13` (`getCutoffMargin`)
  - **Task**: Write a JS function `getCutoffMargin(cutoff, Nyquist)` tracking cutoff headroom.
  - **Test**: Subtracts values to get margins.

#### 🟢 Day 14: Spectrogram Generation: Row-column cell dimensions checks
* **Lecture Syllabus**:
  - Spectrogram row-column indices
  - Features matrix allocations size
  - Structuring spectrogram data arrays
* **Coding Exam**: `edgeai-basics-exam-day-14` (`isValidSpectrogramSize`)
  - **Task**: Write a JS function `isValidSpectrogramSize(rows, cols)` verifying matrix parameters.
  - **Test**: Checks both dimensions are strictly positive integers.
* **Coding Assignment**: `edgeai-basics-assign-day-14` (`getSpectrogramCellsCount`)
  - **Task**: Write a JS function `getSpectrogramCellsCount(rows, cols)` calculating total cell counts.
  - **Test**: Multiplies row and column dimensions.

---

### 🧠 Week 3: Classification confidence & hardware interrupts

#### 🟢 Day 15: Classifier Threshold evaluation: Gesture classification confidence checking
* **Lecture Syllabus**:
  - Gesture classifiers confidence benchmarks
  - Threshold evaluation constraints
  - microcontroller wake triggers bounds
* **Coding Exam**: `edgeai-basics-exam-day-15` (`isConfidenceAcceptable`)
  - **Task**: Write a JS function `isConfidenceAcceptable(score, threshold)` verifying scores.
  - **Test**: Checks classification outputs meet keyword trigger limits.
* **Coding Assignment**: `edgeai-basics-assign-day-15` (`getConfidenceMargin`)
  - **Task**: Write a JS function `getConfidenceMargin(score, threshold)` tracking margins.
  - **Test**: Subtracts thresholds, clamping outputs.

#### 🟢 Day 16: IMU Calibration: Accelerometer bias offset calculation
* **Lecture Syllabus**:
  - IMU sensor calibration algorithms
  - Zero-bias offset calibrations
  - Subtracting static gravity components
* **Coding Exam**: `edgeai-basics-exam-day-16` (`calibrateImuValue`)
  - **Task**: Write a JS function `calibrateImuValue(rawVal, biasOffset)` calibrating data.
  - **Test**: Subtracts static biases from IMU values.
* **Coding Assignment**: `edgeai-basics-assign-day-16` (`isBiasExceeded`)
  - **Task**: Write a JS function `isBiasExceeded(bias, limit)` tracking offsets.
  - **Test**: Asserts absolute biases are below limits.

#### 🟢 Day 17: CNN Layer output layout: Stride dimensions checking
* **Lecture Syllabus**:
  - CNN layers output size equations
  - Convolutional stride parameters
  - Validating audio feature inputs
* **Coding Exam**: `edgeai-basics-exam-day-17` (`getConvOutputSize`)
  - **Task**: Write a JS function `getConvOutputSize(inputSize, filterSize, stride)` predicting layout sizes.
  - **Test**: Solves convolutional math, verifying stride limits.
* **Coding Assignment**: `edgeai-basics-assign-day-17` (`getPoolingOutputSize`)
  - **Task**: Write a JS function `getPoolingOutputSize(inputSize, poolSize)` calculating max-pooling sizes.
  - **Test**: Divides inputs by pooling sizes.

#### 🟢 Day 18: MCU active sleep profiles: Hardware interrupt lines checking
* **Lecture Syllabus**:
  - Microcontroller active sleep modes
  - Interrupt-driven wake pipelines
  - Pin change trigger thresholds
* **Coding Exam**: `edgeai-basics-exam-day-18` (`isWakeTriggered`)
  - **Task**: Write a JS function `isWakeTriggered(pinState, targetEdge)` verifying wake triggers.
  - **Test**: Confirms pin states match rising/falling edges case-insensitively.
* **Coding Assignment**: `edgeai-basics-assign-day-18` (`isActiveLow`)
  - **Task**: Write a JS function `isActiveLow(state)` checking active-low pins.
  - **Test**: Returns true if pin state is low or 0.

#### 🟢 Day 19: Model validation metrics: Classification confusion matrix accuracy
* **Lecture Syllabus**:
  - Confusion matrix parameters (TP, TN, FP, FN)
  - Accuracy and precision formulas
  - Microcontroller model validations
* **Coding Exam**: `edgeai-basics-exam-day-19` (`getClassifierAccuracy`)
  - **Task**: Write a JS function `getClassifierAccuracy(tp, tn, fp, fn)` calculating validation scores.
  - **Test**: Divides correctly identified elements by totals.
* **Coding Assignment**: `edgeai-basics-assign-day-19` (`getClassifierErrorRate`)
  - **Task**: Write a JS function `getClassifierErrorRate(tp, tn, fp, fn)` finding classification errors.
  - **Test**: Subtracts accuracy scores from 100%.

#### 🟢 Day 20: MFCC Feature Extraction: Filterbank bin limits checking
* **Lecture Syllabus**:
  - MFCC filterbank indices constraints
  - Vocal frequency whitelists
  - Speech pattern feature parsers
* **Coding Exam**: `edgeai-basics-exam-day-20` (`isMfccBinValid`)
  - **Task**: Write a JS function `isMfccBinValid(binIndex, totalBins)` checking index boundaries.
  - **Test**: restrains bins indices inside total MFCC count limits.
* **Coding Assignment**: `edgeai-basics-assign-day-20` (`getMfccActiveBinsCount`)
  - **Task**: Write a JS function `getMfccActiveBinsCount(binsArray)` counting active coefficients.
  - **Test**: Filters positive elements counts.

#### 🟢 Day 21: Microphone Signal Decibels: Amplitude power logarithmic conversions
* **Lecture Syllabus**:
  - Logarithmic decibel conversion math
  - Signal power ratios indicators
  - Microphone decibel amplitude logs
* **Coding Exam**: `edgeai-basics-exam-day-21` (`getDecibels`)
  - **Task**: Write a JS function `getDecibels(powerRatio)` converting amplitude ratios.
  - **Test**: Performs Math.log10 scaling, rejecting negative inputs.
* **Coding Assignment**: `edgeai-basics-assign-day-21` (`isDecibelTooLoud`)
  - **Task**: Write a JS function `isDecibelTooLoud(db, threshold)` auditing decibels.
  - **Test**: Compares current decibels against loudness thresholds.

---

### 🧠 Week 4: Wear leveling, Operator Whitelists & TinyML Capstones

#### 🟢 Day 22: TFLite Micro whitelisted layers operations auditor
* **Lecture Syllabus**:
  - TFLite Micro whitelisted operations
  - validating model compiler operators
  - Microcontroller firmware runtimes constraints
* **Coding Exam**: `edgeai-basics-exam-day-22` (`isOperatorSupported`)
  - **Task**: Write a JS function `isOperatorSupported(opName, whitelist)` checking compiler targets.
  - **Test**: Resolves if target operators exist in firmware whitelists.
* **Coding Assignment**: `edgeai-basics-assign-day-22` (`getWhitelistSize`)
  - **Task**: Write a JS function `getWhitelistSize(whitelist)` tracking size limits.
  - **Test**: Reports operator array lengths.

#### 🟢 Day 23: Model latency deadline constraints checker
* **Lecture Syllabus**:
  - Inference latency targets
  - Checking performance limits
  - Optimizing model execution speeds
* **Coding Exam**: `edgeai-basics-exam-day-23` (`isLatencySafe`)
  - **Task**: Write a JS function `isLatencySafe(latencyMs, maxAllowedMs)` checking timing constraints.
  - **Test**: Flags latencies exceeding real-time loop deadlines.
* **Coding Assignment**: `edgeai-basics-assign-day-23` (`getLatencyMargin`)
  - **Task**: Write a JS function `getLatencyMargin(latencyMs, maxAllowedMs)` tracking execution headroom.
  - **Test**: Subtracts values to find safety buffers.

#### 🟢 Day 24: Flash wear leveling write cycles counter
* **Lecture Syllabus**:
  - Flash memory wear leveling
  - Tracking write cycle limits
  - Flash hardware storage lifespans
* **Coding Exam**: `edgeai-basics-exam-day-24` (`isFlashLifeSafe`)
  - **Task**: Write a JS function `isFlashLifeSafe(writeCycles, maxCycles)` tracking hardware wear limits.
  - **Test**: Warns when write counts near chip endurance limits.
* **Coding Assignment**: `edgeai-basics-assign-day-24` (`getWriteCyclesLeft`)
  - **Task**: Write a JS function `getWriteCyclesLeft(writeCycles, maxCycles)` calculating remaining cycles.
  - **Test**: Subtracts write cycles from life limits.

#### 🟢 Day 25: Embedded dynamic memory heap allocation safety check
* **Lecture Syllabus**:
  - Microcontroller RAM heap constraints
  - Validating dynamic buffer sizes
  - Preventing heap allocation leaks
* **Coding Exam**: `edgeai-basics-exam-day-25` (`isHeapAllocationSafe`)
  - **Task**: Write a JS function `isHeapAllocationSafe(allocSize, availableHeap)` checking allocation safety.
  - **Test**: Restricts dynamic memory allocations below available heap capacity limits.
* **Coding Assignment**: `edgeai-basics-assign-day-25` (`getHeapSpaceLeft`)
  - **Task**: Write a JS function `getHeapSpaceLeft(allocSize, availableHeap)` finding remaining heap.
  - **Test**: Subtracts allocations from heap limits.

#### 🟢 Day 26: Device current draw calculations
* **Lecture Syllabus**:
  - Power consumption profiling variables
  - Sleep interval timing profiles
  - Predicting battery lifetime metrics
* **Coding Exam**: `edgeai-basics-exam-day-26` (`getAverageCurrent`)
  - **Task**: Write a JS function `getAverageCurrent(activeMa, sleepMa, activeTimeMs, totalTimeMs)` computing power draws.
  - **Test**: Computes weighted averages based on sleep and wake profiles.
* **Coding Assignment**: `edgeai-basics-assign-day-26` (`getBatteryLifeHours`)
  - **Task**: Write a JS function `getBatteryLifeHours(capacityMah, averageMa)` predicting battery life.
  - **Test**: Divides capacity by average current draws.

#### 🟢 Day 27: Model layer parameters complexity counts
* **Lecture Syllabus**:
  - NN layer weights parameters count
  - Dense and convolutional layer sizes
  - Auditing model complexity limits
* **Coding Exam**: `edgeai-basics-exam-day-27` (`getDenseLayerParams`)
  - **Task**: Write a JS function `getDenseLayerParams(inputUnits, outputUnits, useBias)` computing parameter counts.
  - **Test**: Multiplies dimensions and adds biases checks.
* **Coding Assignment**: `edgeai-basics-assign-day-27` (`getComplexity`)
  - **Task**: Write a JS function `getComplexity(totalParams)` classifying model sizes.
  - **Test**: Emits HEAVY, MEDIUM, or LIGHT labels.

#### 🟢 Day 28: Hardware accelerator DSP execution speedup ratios
* **Lecture Syllabus**:
  - DSP software-hardware runtimes
  - Calculating accelerator speedup ratios
  - Optimizing hardware speed metrics
* **Coding Exam**: `edgeai-basics-exam-day-28` (`calculateSpeedup`)
  - **Task**: Write a JS function `calculateSpeedup(swTimeMs, hwTimeMs)` evaluating speedup factors.
  - **Test**: Divides software runtimes by hardware accelerator runtimes.
* **Coding Assignment**: `edgeai-basics-assign-day-28` (`isSpeedupAcceptable`)
  - **Task**: Write a JS function `isSpeedupAcceptable(ratio, target)` auditing benchmarks.
  - **Test**: Compares speedup ratios against target levels.

#### 🟢 Day 29: Quantization model accuracy drop monitor
* **Lecture Syllabus**:
  - Model quantization precision checks
  - Comparing float32 and int8 scores
  - Quantization dropouts limits check
* **Coding Exam**: `edgeai-basics-exam-day-29` (`isAccuracyDropSafe`)
  - **Task**: Write a JS function `isAccuracyDropSafe(floatAcc, int8Acc, maxDrop)` auditing quantization dropouts.
  - **Test**: Checks accuracy drops are below maximum drop parameters.
* **Coding Assignment**: `edgeai-basics-assign-day-29` (`getAccuracyDrop`)
  - **Task**: Write a JS function `getAccuracyDrop(floatAcc, int8Acc)` finding accuracy drops.
  - **Test**: Subtracts int8 scores from float32 baselines.

#### 🟢 Day 30: Capstone: Deployment viability health scorer
* **Lecture Syllabus**:
  - TinyML deployment health metrics
  - Uptime and latency diagnostics
  - Health scorer dashboard equations
* **Coding Exam**: `edgeai-basics-exam-day-30` (`getTinyMlHealthScore`)
  - **Task**: Write a JS function `getTinyMlHealthScore(accuracyPercent, flashPercent, currentMa)` compiling scores.
  - **Test**: Returns score integers between `0` and `100`, accounting for RAM and battery health parameters.
* **Coding Assignment**: `edgeai-basics-assign-day-30` (`isAccuracyHealthy`)
  - **Task**: Write a JS function `isAccuracyHealthy(acc)` checking validation scores.
  - **Test**: Enforces a minimum classification accuracy threshold of 85%.

---
*Created by Antigravity*
