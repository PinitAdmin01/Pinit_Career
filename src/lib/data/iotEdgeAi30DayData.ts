import { buildEnrichedDayQuests, DayConfig } from './curriculumEnricher';
import { CourseQuest } from './coursesData';

export const IOT_EDGE_AI_30_DAYS_CONFIGS: DayConfig[] = [
  {
    "day": 1,
    "title": "Edge AI Architecture & INT8 Quantization Invariants",
    "desc": "Master on-device machine learning: comparing 5 ms local inference vs 500 ms cloud round-trip latency, evaluating cellular bandwidth savings, and assessing zero-data-leakage privacy guarantees.",
    "syllabus": [
      "The TinyML Paradigm: Millivolts, Microcontrollers ($< 256\\text{ KB}$ RAM), and Machine Learning.",
      "Latency Comparison: Local edge inference (1 - 10 ms) vs Cloud roundtrip (200 - 800 ms).",
      "Bandwidth & Cellular Cost Economics: 99.9% reduction in transmitted telemetry volume."
    ],
    "eTitle": "Edge vs Cloud Latency & Bandwidth Savings Evaluator",
    "eDesc": "Implement function evaluateEdgeInferenceSavings(samplesPerSecond, rawSampleSizeBytes, cloudLatencyMs = 350, edgeLatencyMs = 8) calculating bandwidth reduction and latency gain.",
    "eStarter": "function evaluateEdgeInferenceSavings(samplesPerSec, sampleBytes, cloudMs = 350, edgeMs = 8) {\n  // TODO: Compute raw vs edge transmitted bytes per day and latency ratio.\n  \n}",
    "eHint": "Compute raw vs edge transmitted bytes per day and latency ratio.",
    "eTest": "const res = evaluateEdgeInferenceSavings(100, 6, 400, 10); // 100Hz 6-byte IMU\nif (res.bandwidthSavedPercent !== 99.9 || res.latencySpeedupRatio !== 40 || res.status !== 'EDGE_AI_SAVINGS_OPTIMAL') throw new Error('Edge savings evaluation failed');",
    "aTitle": "Privacy Guarantee Classifier",
    "aDesc": "Implement function auditEdgePrivacy(transmitsRawAudioOrVideo) returning 'LOCAL_PRIVACY_GUARANTEED' if false, else 'CLOUD_DATA_EXPOSURE_RISK'.",
    "aStarter": "function auditEdgePrivacy(rawStream) {\n  // TODO: Return privacy rating.\n  \n}",
    "aHint": "Return privacy rating.",
    "aTest": "if (auditEdgePrivacy(false) !== 'LOCAL_PRIVACY_GUARANTEED' || auditEdgePrivacy(true) !== 'CLOUD_DATA_EXPOSURE_RISK') throw new Error('Privacy check failed');"
  },
  {
    "day": 2,
    "title": "TinyML Depthwise Convolutions, Autoencoder Anomalies, Pruning & MCUNet",
    "desc": "Design neural network architectures fitting within $< 256\\text{ KB}$ SRAM (Actuations/Activations) and $< 1\\text{ MB}$ Flash (Weights) budgets.",
    "syllabus": [
      "MCU Memory Hierarchy: SRAM (Volatile activation buffer) vs Flash (Non-volatile model weights).",
      "Activation Memory Invariant: Peak memory is determined by the two largest contiguous layer tensors.",
      "Model Size vs Accuracy Trade-off Curve."
    ],
    "eTitle": "MCU Tensor Arena & Memory Feasibility Auditor",
    "eDesc": "Implement function checkMcuModelFeasibility(modelWeightBytes, peakActivationBytes, mcuFlashBytes = 1048576, mcuSramBytes = 262144) verifying if neural network fits in hardware.",
    "eStarter": "function checkMcuModelFeasibility(weights, activations, flash = 1048576, sram = 262144) {\n  // TODO: Verify weights <= flash and activations <= sram.\n  \n}",
    "eHint": "Verify weights <= flash and activations <= sram.",
    "eTest": "const ok = checkMcuModelFeasibility(150000, 64000, 1048576, 262144);\nconst fail = checkMcuModelFeasibility(1200000, 64000, 1048576, 262144);\nif (!ok.feasible || fail.feasible || ok.status !== 'MODEL_FITS_IN_MCU_BUDGET') throw new Error('Memory feasibility audit failed');",
    "aTitle": "Peak Activation Memory Estimator",
    "aDesc": "Implement function estimatePeakActivation(layer1Bytes, layer2Bytes) returning `layer1Bytes + layer2Bytes` for ping-pong double buffer.",
    "aStarter": "function estimatePeakActivation(l1, l2) {\n  // TODO: Sum layer 1 and layer 2 bytes.\n  \n}",
    "aHint": "Sum layer 1 and layer 2 bytes.",
    "aTest": "if (estimatePeakActivation(32000, 16000) !== 48000) throw new Error('Peak calc failed');"
  },
  {
    "day": 3,
    "title": "TensorFlow Lite for Microcontrollers (TFLM) Architecture: FlatBuffers, Zero-Allocation Interpreter & Tensor Arenas",
    "desc": "Dissect TFLM runtime: FlatBuffers `.tflite` model schema, Zero-allocation interpreter, static Tensor Arena memory buffers, and Hardware Operator Resolvers (`AllOpsResolver` vs `MicroMutableOpResolver`).",
    "syllabus": [
      "Zero Dynamic Allocation Invariant: `malloc()` is forbidden in safety-critical TFLM runtime.",
      "`MicroInterpreter` and Static `tensor_arena` byte array.",
      "`MicroMutableOpResolver<N>`: Registering only the exact ops needed to save 80 KB of Flash!"
    ],
    "eTitle": "TFLM Tensor Arena Memory Allocator & Offset Resolver",
    "eDesc": "Implement function allocateTensorArena(layerSizes) laying out contiguous static memory offsets for model tensors without heap allocations.",
    "eStarter": "function allocateTensorArena(layerSizes) {\n  // TODO: Compute aligned offsets with 16-byte boundary alignment.\n  \n}",
    "eHint": "Compute aligned offsets with 16-byte boundary alignment.",
    "eTest": "const res = allocateTensorArena([1000, 2048, 512]);\nif (res.totalArenaBytesRequired < 3560 || res.status !== 'TENSOR_ARENA_STATICALLY_ALLOCATED_ZERO_HEAP') throw new Error('Tensor arena allocator failed');",
    "aTitle": "Op Resolver Flash Size Estimator",
    "aDesc": "Implement function estimateOpResolverFlash(opCount) returning `opCount * 4 + 8` KB.",
    "aStarter": "function estimateOpResolverFlash(n) {\n  // TODO: Compute flash cost.\n  \n}",
    "aHint": "Compute flash cost.",
    "aTest": "if (estimateOpResolverFlash(3) !== 20) throw new Error('Op resolver calc failed');"
  },
  {
    "day": 4,
    "title": "Post-Training Quantization (PTQ): Float32 to Signed INT8 Affine Mapping, Scales & Zero-Points",
    "desc": "Shrink model footprint by 75%: Float32 (4 bytes) to signed INT8 (1 byte), Affine Quantization formula ($q = \\text{round}(r / S) + Z$), Scale Factor $S$, Zero Point $Z$, and Calibration Representative Datasets.",
    "syllabus": [
      "Affine Quantization: Mapping real floating range $[r_{\\text{min}}, r_{\\text{max}}]$ to discrete integer range $[-128, 127]$.",
      "Scale Factor: $S = \\frac{r_{\\text{max}} - r_{\\text{min}}}{q_{\\text{max}} - q_{\\text{min}}} = \\frac{r_{\\text{max}} - r_{\\text{min}}}{255}$.",
      "Zero Point: $Z = \\text{round}\\left(\\frac{-r_{\\text{min}}}{S}\\right) - 128$."
    ],
    "eTitle": "Float32 to INT8 Affine Quantizer & Dequantizer Engine",
    "eDesc": "Implement function quantizeFloatArrayToInt8(floatArray, rMin, rMax) calculating Scale, ZeroPoint, and quantized INT8 array.",
    "eStarter": "function quantizeFloatArrayToInt8(arr, rMin, rMax) {\n  // TODO: Calculate S = (rMax - rMin)/255, Z = round(-rMin/S) - 128, and clamp q to [-128, 127].\n  \n}",
    "eHint": "Calculate S = (rMax - rMin)/255, Z = round(-rMin/S) - 128, and clamp q to [-128, 127].",
    "eTest": "const res = quantizeFloatArrayToInt8([-1.0, 0.0, 1.0], -1.0, 1.0);\nif (res.quantizedInt8[0] !== -128 || res.quantizedInt8[2] !== 127 || res.status !== 'QUANTIZATION_INT8_SUCCESS') throw new Error('INT8 quantization failed');",
    "aTitle": "INT8 to Float Dequantizer",
    "aDesc": "Implement function dequantizeInt8(q, S, Z) returning `Number((S * (q - Z)).toFixed(3))`.",
    "aStarter": "function dequantizeInt8(q, S, Z) {\n  // TODO: Compute S * (q - Z).\n  \n}",
    "aHint": "Compute S * (q - Z).",
    "aTest": "if (dequantizeInt8(0, 0.007843, 0) !== 0.0) throw new Error('Dequantize failed');"
  },
  {
    "day": 5,
    "title": "Milestone 1: Production INT8 Quantized Neural Network Interpreter Engine",
    "desc": "Milestone 1: Build a production TinyML inference pipeline: model flatbuffer parser, static Tensor Arena allocator, INT8 quantized tensor dot-product kernel, and 4x memory compression verifier.",
    "syllabus": [
      "Static Tensor Arena layout without dynamic allocation.",
      "INT8 Matrix Multiply & Accumulate (MAC) arithmetic with fixed-point scaling.",
      "Production TinyML Invariant verification."
    ],
    "eTitle": "INT8 TinyML Inference Engine Master Kernel",
    "eDesc": "Implement function runInt8InferenceKernel(inputInt8, weightsInt8, biasInt32, outputScale, outputZeroPoint) executing single fully-connected neuron inference.",
    "eStarter": "function runInt8InferenceKernel(inputs, weights, bias, scale, zp) {\n  // TODO: Compute dot product into 32-bit accumulator, scale, add zero-point, and clamp [-128, 127].\n  \n}",
    "eHint": "Compute dot product into 32-bit accumulator, scale, add zero-point, and clamp [-128, 127].",
    "eTest": "const res = runInt8InferenceKernel([10, 20, 30], [2, -1, 3], 5, 0.01, 0);\nif (res.accumulatorRawInt32 !== 95 || res.quantizedOutputInt8 !== 1 || res.status !== 'TINYML_INT8_INFERENCE_CYCLE_COMPLETE') throw new Error('Milestone 1 kernel failed');",
    "aTitle": "Model Compression Factor Calculator",
    "aDesc": "Implement function calculateCompressionFactor(float32Bytes, int8Bytes) returning `Number((float32Bytes / int8Bytes).toFixed(1))`.",
    "aStarter": "function calculateCompressionFactor(f, i) {\n  // TODO: Divide float32 bytes by int8 bytes.\n  \n}",
    "aHint": "Divide float32 bytes by int8 bytes.",
    "aTest": "if (calculateCompressionFactor(400000, 100000) !== 4.0) throw new Error('Compression calc failed');"
  },
  {
    "day": 6,
    "title": "Peak Activation Memory Estimator & SRAM Lifespan Analysis",
    "desc": "Prepare raw analog sensor feeds: Nyquist-Shannon Sampling Theorem ($f_s \\ge 2 f_{\\text{max}}$), Anti-Aliasing analog low-pass filters, and Windowing functions (Hanning, Hamming, Blackman) to suppress spectral leakage.",
    "syllabus": [
      "Nyquist Rate: Sampling at $f_s < 2 f_{\\text{max}}$ causes high frequencies to mirror as false low frequencies (Aliasing!).",
      "Windowing: Multiplying time-domain buffers by $w(n) = 0.54 - 0.46 \\cos\\left(\\frac{2\\pi n}{N-1}\\right)$ (Hamming Window).",
      "Suppression of boundary discontinuity spectral leakage."
    ],
    "eTitle": "Hamming Window Function Applicator & Aliasing Detector",
    "eDesc": "Implement function applyHammingWindow(signalBuffer, samplingRateHz, maxFrequencyHz) applying Hamming window and validating Nyquist compliance.",
    "eStarter": "function applyHammingWindow(buffer, fs, fMax) {\n  // TODO: Check fs >= 2*fMax and multiply samples by 0.54 - 0.46*cos(2*pi*n/(N-1)).\n  \n}",
    "eHint": "Check fs >= 2*fMax and multiply samples by 0.54 - 0.46*cos(2*pi*n/(N-1)).",
    "eTest": "const sig = [1.0, 1.0, 1.0, 1.0, 1.0];\nconst ok = applyHammingWindow(sig, 1000, 400);\nconst fail = applyHammingWindow(sig, 500, 400);\nif (!ok.nyquistSatisfied || fail.nyquistSatisfied || fail.status !== 'ALIASING_HAZARD_INCREASE_SAMPLING_RATE') throw new Error('Windowing/Aliasing failed');",
    "aTitle": "Nyquist Minimum Sampling Rate Calculator",
    "aDesc": "Implement function getNyquistRate(fMax) returning `2 * fMax`.",
    "aStarter": "function getNyquistRate(f) {\n  // TODO: Return 2 * fMax.\n  \n}",
    "aHint": "Return 2 * fMax.",
    "aTest": "if (getNyquistRate(2000) !== 4000) throw new Error('Nyquist calc failed');"
  },
  {
    "day": 7,
    "title": "TensorFlow Lite for Microcontrollers (TFLM) Architecture & FlatBuffer Serialization",
    "desc": "Transform time-domain vibration and audio signals into frequency domain: Radix-2 Cooley-Tukey FFT ($O(N \\log N)$), Magnitude spectrum calculation, Frequency Bin resolution ($\\Delta f = f_s / N$), and 2D Spectrogram generation.",
    "syllabus": [
      "FFT Frequency Bin Width: $\\Delta f = \\frac{f_s}{N}$ (e.g. $16000\\text{ Hz} / 512 = 31.25\\text{ Hz}$ per bin).",
      "Magnitude Calculation: $|X(k)| = \\sqrt{\\text{Re}^2 + \\text{Im}^2}$.",
      "Log-Power Spectrograms for machine learning feature maps."
    ],
    "eTitle": "FFT Magnitude Spectrum & Peak Frequency Identifier",
    "eDesc": "Implement function extractFftPeakFeatures(realParts, imagParts, samplingRateHz = 1600) calculating magnitude spectrum and identifying dominant resonant frequency.",
    "eStarter": "function extractFftPeakFeatures(reals, imags, fs = 1600) {\n  // TODO: Compute magnitude sqrt(re^2 + im^2) for positive bins and find peak frequency.\n  \n}",
    "eHint": "Compute magnitude sqrt(re^2 + im^2) for positive bins and find peak frequency.",
    "eTest": "const reals = [0, 0, 100, 0, 0, 0, 0, 0];\nconst imags = [0, 0, 0, 0, 0, 0, 0, 0];\nconst res = extractFftPeakFeatures(reals, imags, 800); // N=8, binWidth=100Hz, peak at bin 2 = 200Hz\nif (res.peakFrequencyHz !== 200 || res.peakMagnitude !== 100 || res.status !== 'FFT_FEATURE_EXTRACTION_SUCCESS') throw new Error('FFT feature extraction failed');",
    "aTitle": "FFT Frequency Bin Width Calculator",
    "aDesc": "Implement function getFftBinWidth(fs, N) returning `fs / N`.",
    "aStarter": "function getFftBinWidth(fs, N) {\n  // TODO: Divide fs by N.\n  \n}",
    "aHint": "Divide fs by N.",
    "aTest": "if (getFftBinWidth(16000, 512) !== 31.25) throw new Error('Bin width failed');"
  },
  {
    "day": 8,
    "title": "TFLM Tensor Arena Memory Allocator & Offset Resolver",
    "desc": "Convert human speech and acoustic machinery audio into compact representations: Mel-Scale warping ($m = 2595 \\log_{10}(1 + f/700)$), Triangular Mel Filterbank integration, Log-energy compression, and Discrete Cosine Transform (DCT) MFCC coefficients.",
    "syllabus": [
      "Mel Frequency Scale: Emphasizing lower frequencies where human ear and audio cues are sensitive.",
      "Triangular Filterbanks: Summing FFT energy into 20..40 Mel bands.",
      "DCT-II Compression: Extracting 10..13 MFCC coefficients for keyword spotting."
    ],
    "eTitle": "Mel-Scale Warper & Triangular Filterbank Energy Integrator",
    "eDesc": "Implement function calculateMelEnergy(fftEnergies, binFrequencies, melCenterHz, melBandwidthHz) summing energy within triangular filter window.",
    "eStarter": "function calculateMelEnergy(energies, freqs, centerHz, bwHz) {\n  // TODO: Compute triangular weight 1 - dist/bw and sum weighted energies.\n  \n}",
    "eHint": "Compute triangular weight 1 - dist/bw and sum weighted energies.",
    "eTest": "const energies = [10, 20, 10];\nconst freqs = [900, 1000, 1100];\nconst res = calculateMelEnergy(energies, freqs, 1000, 200);\nif (res.rawMelEnergy !== 30 || res.status !== 'MFCC_FILTERBANK_INTEGRATED') throw new Error('Mel energy integration failed');",
    "aTitle": "Hertz to Mel Converter",
    "aDesc": "Implement function hertzToMel(freqHz) returning `Number((2595 * Math.log10(1 + freqHz / 700)).toFixed(1))`.",
    "aStarter": "function hertzToMel(f) {\n  // TODO: Apply 2595 * log10(1 + f/700).\n  \n}",
    "aHint": "Apply 2595 * log10(1 + f/700).",
    "aTest": "if (hertzToMel(1000) !== 1000.0) throw new Error('Hz to Mel failed');"
  },
  {
    "day": 9,
    "title": "Op Resolver Flash Size Estimator & Selective Kernel Registration",
    "desc": "Monitor industrial bearings and motors: RMS energy, Crest Factor, Kurtosis, Skewness, and Multidimensional Mahalanobis Distance ($D_M = \\sqrt{(x - \\mu)^T \\Sigma^{-1} (x - \\mu)}$).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Vibration Anomaly Detection: Mahalanobis Distance & Statistical DSP.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Vibration Statistical DSP & Anomaly Classifier",
    "eDesc": "Implement function evaluateVibrationAnomaly(samples, baselineMean, baselineStd) calculating RMS, Kurtosis, and Z-score anomaly flag.",
    "eStarter": "function evaluateVibrationAnomaly(samples, mean, std) {\n  // TODO: Compute RMS and Kurtosis, flag anomaly if rms > mean + 3*std or kurtosis > 4.5.\n  \n}",
    "eHint": "Compute RMS and Kurtosis, flag anomaly if rms > mean + 3*std or kurtosis > 4.5.",
    "eTest": "const normal = evaluateVibrationAnomaly([1.0, 1.1, 0.9, 1.0], 1.0, 0.2);\nconst faulty = evaluateVibrationAnomaly([5.0, 6.0, 5.5, 7.0], 1.0, 0.2);\nif (normal.isAnomaly || !faulty.isAnomaly || faulty.status !== 'BEARING_ANOMALY_VIBRATION_SPIKE') throw new Error('Vibration anomaly failed');",
    "aTitle": "Crest Factor Calculator",
    "aDesc": "Implement function calculateCrestFactor(peakVal, rmsVal) returning `Number((peakVal / rmsVal).toFixed(2))`.",
    "aStarter": "function calculateCrestFactor(p, r) {\n  // TODO: Divide peak value by RMS.\n  \n}",
    "aHint": "Divide peak value by RMS.",
    "aTest": "if (calculateCrestFactor(10, 5) !== 2.0) throw new Error('Crest factor failed');"
  },
  {
    "day": 10,
    "title": "Post-Training Quantization (PTQ): Float32 to INT8 Affine Scale & Zero-Point Mapping",
    "desc": "Classify human motion on smartwatches: 3-axis accelerometer/gyroscope streams, Sliding Window segmentation (50% overlap), 1D Temporal Convolutions, and Softmax gesture classification.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of 1D CNNs for Accelerometer Gesture & Activity Recognition.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "1D Temporal Convolution & Sliding Window Segmenter",
    "eDesc": "Implement function segmentSlidingWindow(streamData, windowSize = 50, hopSize = 25) producing overlapping time-series matrices for 1D CNN input.",
    "eStarter": "function segmentSlidingWindow(stream, winSize = 50, hop = 25) {\n  // TODO: Slice stream into windows of winSize stepping by hop.\n  \n}",
    "eHint": "Slice stream into windows of winSize stepping by hop.",
    "eTest": "const data = new Array(100).fill(1);\nconst res = segmentSlidingWindow(data, 50, 25);\nif (res.totalWindowsExtracted !== 3 || res.status !== 'SLIDING_WINDOW_SEGMENTATION_COMPLETE') throw new Error('Sliding window segmentation failed');",
    "aTitle": "Window Overlap Percentage Calculator",
    "aDesc": "Implement function getOverlapPercent(winSize, hop) returning `Number((((winSize - hop) / winSize) * 100).toFixed(1))`.",
    "aStarter": "function getOverlapPercent(w, h) {\n  // TODO: Compute overlap percentage.\n  \n}",
    "aHint": "Compute overlap percentage.",
    "aTest": "if (getOverlapPercent(50, 25) !== 50.0) throw new Error('Overlap calc failed');"
  },
  {
    "day": 11,
    "title": "Float32 to INT8 Affine Quantizer & Dequantizer Engine",
    "desc": "Accelerate neural networks on Cortex-M4/M7/M33/M55: CMSIS-NN assembly optimizations, `SMLAD` (Dual 16-bit MAC in 1 cycle), Quad 8-bit vector dot products, and 5x inference speedup.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of ARM CMSIS-NN: SIMD & DSP Hardware Acceleration.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "CMSIS-NN Quad-INT8 SIMD Dot Product Simulator",
    "eDesc": "Implement function simCmsisNnDotProduct(vecA, vecB) executing parallel 4-lane SIMD multiply-accumulate operations.",
    "eStarter": "function simCmsisNnDotProduct(vecA, vecB) {\n  // TODO: Process elements in groups of 4 and accumulate dot products.\n  \n}",
    "eHint": "Process elements in groups of 4 and accumulate dot products.",
    "eTest": "const vA = [1, 2, 3, 4, 1, 1, 1, 1];\nconst vB = [2, 2, 2, 2, 1, 1, 1, 1];\nconst res = simCmsisNnDotProduct(vA, vB);\nif (res.simdQuadsProcessed !== 2 || res.accumulatorResult !== 24 || res.status !== 'CMSIS_NN_SIMD_ACCELERATION_SUCCESS') throw new Error('CMSIS-NN SIMD failed');",
    "aTitle": "SIMD Speedup Ratio Calculator",
    "aDesc": "Implement function getSimdSpeedup(scalarCycles, simdCycles) returning `Number((scalarCycles / simdCycles).toFixed(1))`.",
    "aStarter": "function getSimdSpeedup(sc, si) {\n  // TODO: Divide scalar cycles by SIMD cycles.\n  \n}",
    "aHint": "Divide scalar cycles by SIMD cycles.",
    "aTest": "if (getSimdSpeedup(100, 25) !== 4.0) throw new Error('SIMD speedup failed');"
  },
  {
    "day": 12,
    "title": "INT8 to Float Dequantizer & CMSIS-NN Quantized Operators",
    "desc": "Prune redundant synaptic connections: Magnitude-based weight pruning, Structured 2:4 sparsity (ARM Ethos / Cortex-M55), Sparse Matrix-Vector multiplication (SpMV), and 50% parameter reduction.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Model Pruning, Structured Sparsity & Weight Compression.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Neural Network Magnitude Pruner & Sparsity Calculator",
    "eDesc": "Implement function pruneWeightsByThreshold(weightMatrix, threshold) setting weights below threshold to zero and calculating sparsity ratio.",
    "eStarter": "function pruneWeightsByThreshold(weights, threshold) {\n  // TODO: Zero weights with |w| < threshold and compute zeros/total * 100.\n  \n}",
    "eHint": "Zero weights with |w| < threshold and compute zeros/total * 100.",
    "eTest": "const w = [0.01, 0.5, -0.02, 0.8, 0.005, -0.9];\nconst res = pruneWeightsByThreshold(w, 0.05);\nif (res.sparsityPercent !== 50.0 || res.prunedWeights[0] !== 0 || res.prunedWeights[1] !== 0.5) throw new Error('Pruning failed');",
    "aTitle": "Sparsity Percentage Formatter",
    "aDesc": "Implement function formatSparsity(sparsityPct) returning `${sparsityPct}% sparse model`.",
    "aStarter": "function formatSparsity(s) {\n  // TODO: Format string.\n  \n}",
    "aHint": "Format string.",
    "aTest": "if (formatSparsity(75) !== '75% sparse model') throw new Error('Sparsity format failed');"
  },
  {
    "day": 13,
    "title": "⭐ MILESTONE 1: Complete INT8 Quantized Neural Network Interpreter Engine",
    "desc": "Minimize Multiply-Accumulate (MAC) operations in vision: Standard 2D Convolution vs Depthwise Separable Convolution (Depthwise Spatial filter + Pointwise $1 \\times 1$ Channel filter), achieving 85% MAC reduction.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Depthwise Separable Convolutions & MobileNet on Edge.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Depthwise Separable Convolution MAC Savings Calculator",
    "eDesc": "Implement function calculateDepthwiseMacSavings(inputH, inputW, inputChannels, outputChannels, kernelSize = 3) comparing standard vs depthwise separable convolution operations.",
    "eStarter": "function calculateDepthwiseMacSavings(H, W, Cin, Cout, K = 3) {\n  // TODO: Compute standard = H*W*Cin*Cout*K^2 and separable = H*W*Cin*K^2 + H*W*Cin*Cout.\n  \n}",
    "eHint": "Compute standard = H*W*Cin*Cout*K^2 and separable = H*W*Cin*K^2 + H*W*Cin*Cout.",
    "eTest": "const res = calculateDepthwiseMacSavings(32, 32, 16, 32, 3);\nif (res.computationReductionPercent < 85 || res.status !== 'DEPTHWISE_SEPARABLE_OPTIMAL') throw new Error('Depthwise MAC calculation failed');",
    "aTitle": "Pointwise Filter Count Formatter",
    "aDesc": "Implement function getPointwiseFilterShape(Cin, Cout) returning `1x1x${Cin}x${Cout}`.",
    "aStarter": "function getPointwiseFilterShape(inC, outC) {\n  // TODO: Format 1x1 shape string.\n  \n}",
    "aHint": "Format 1x1 shape string.",
    "aTest": "if (getPointwiseFilterShape(16, 32) !== '1x1x16x32') throw new Error('Shape format failed');"
  },
  {
    "day": 14,
    "title": "INT8 TinyML Inference Engine Master Kernel",
    "desc": "Detect people on battery-powered cameras: Visual Wake Words dataset, grayscale $96 \\times 96$ input downsampling, MobileNetV1 $0.25\\times$, and binary classification (Person vs Non-Person).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Visual Wake Words (VWW) & Edge Person Detection.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Visual Wake Words Person Classifier & Bounding Box IoU",
    "eDesc": "Implement function evaluateVisualWakeWord(personProbability, threshold = 0.80) classifying presence of humans with confidence margin.",
    "eStarter": "function evaluateVisualWakeWord(prob, threshold = 0.80) {\n  // TODO: Check if person probability meets threshold.\n  \n}",
    "eHint": "Check if person probability meets threshold.",
    "eTest": "const person = evaluateVisualWakeWord(0.92, 0.80);\nconst empty = evaluateVisualWakeWord(0.35, 0.80);\nif (!person.wakeWordTriggered || empty.wakeWordTriggered || person.status !== 'PERSON_DETECTED_WAKE_UP_SYSTEM') throw new Error('VWW evaluation failed');",
    "aTitle": "Intersection over Union (IoU) Calculator",
    "aDesc": "Implement function calculateIoU(areaIntersection, areaUnion) returning `Number((areaIntersection / areaUnion).toFixed(2))`.",
    "aStarter": "function calculateIoU(i, u) {\n  // TODO: Divide intersection by union.\n  \n}",
    "aHint": "Divide intersection by union.",
    "aTest": "if (calculateIoU(40, 100) !== 0.40) throw new Error('IoU calc failed');"
  },
  {
    "day": 15,
    "title": "Model Compression Factor Calculator",
    "desc": "Milestone 2: Build a production Edge AI classifier: audio MFCC spectrogram preprocessor, CMSIS-NN SIMD accelerated inference, Visual Wake Words person detector, and 10 ms execution benchmark.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of ⭐ MILESTONE 2: Complete Acoustic / Vision Edge AI Classifier Engine.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Acoustic & Vision Edge AI Master Engine",
    "eDesc": "Implement function executeEdgeClassificationPipeline(audioMfccArray, cameraPixelsArray, audioModel, visionModel) running dual-model edge inference.",
    "eStarter": "function executeEdgeClassificationPipeline(audio, vision, aModel, vModel) {\n  // TODO: Execute predictions and assemble multi-modal status.\n  \n}",
    "eHint": "Execute predictions and assemble multi-modal status.",
    "eTest": "const aM = { predict: () => ({ label: 'YES' }) };\nconst vM = { predict: () => ({ hasPerson: true }) };\nconst res = executeEdgeClassificationPipeline([], [], aM, vM);\nif (res.keywordRecognized !== 'YES' || !res.personPresent || res.status !== 'DUAL_MODALITY_EDGE_AI_OPERATIONAL') throw new Error('Milestone 2 Edge AI failed');",
    "aTitle": "Pipeline Latency Auditor",
    "aDesc": "Implement function auditEdgeLatency(latencyMs, maxAllowed = 15) returning `latencyMs <= maxAllowed`.",
    "aStarter": "function auditEdgeLatency(l, m = 15) {\n  // TODO: Check latency <= maxAllowed.\n  \n}",
    "aHint": "Check latency <= maxAllowed.",
    "aTest": "if (!auditEdgeLatency(9.5, 15) || auditEdgeLatency(25, 15)) throw new Error('Latency audit failed');"
  },
  {
    "day": 16,
    "title": "Model Quantization Fundamentals: FP32 to INT8 Mapping, Scale, Zero-Point & Dynamic Range",
    "desc": "Export models to embedded C arrays: PyTorch `.pt` $\\to$ ONNX $\\to$ TensorFlow Lite Converter $\\to$ `xxd -i model.tflite model_data.cc` static C byte array.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Model Conversion & Optimization: PyTorch/ONNX to TFLite Micro.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "TFLite Micro C Byte Array Header Generator",
    "eDesc": "Implement function generateCByteArray(modelBytes, arrayName = 'g_model') producing standard embedded C const array header.",
    "eStarter": "function generateCByteArray(bytes, name = 'g_model') {\n  // TODO: Format hexElements into C const unsigned char array with length variable.\n  \n}",
    "eHint": "Format hexElements into C const unsigned char array with length variable.",
    "eTest": "const res = generateCByteArray([0x18, 0x00, 0x00, 0x00], 'model_data');\nif (res.totalBytes !== 4 || !res.cSourceCode.includes('model_data_len = 4')) throw new Error('C header generation failed');",
    "aTitle": "FlatBuffer Magic Number Verifier",
    "aDesc": "Implement function isTfliteFlatbuffer(magicStr) returning `magicStr === 'TFL3'`.",
    "aStarter": "function isTfliteFlatbuffer(m) {\n  // TODO: Check TFL3 magic identifier.\n  \n}",
    "aHint": "Check TFL3 magic identifier.",
    "aTest": "if (!isTfliteFlatbuffer('TFL3') || isTfliteFlatbuffer('JSON')) throw new Error('Flatbuffer check failed');"
  },
  {
    "day": 17,
    "title": "Post-Training Quantization (PTQ) vs Quantization-Aware Training (QAT) & Calibration Data",
    "desc": "Calculate milli-joules per inference: $E_{\\text{inf}} = V_{\\text{dd}} \\times I_{\\text{active}} \\times T_{\\text{inf}}$, battery life trade-offs at 1 inference/second vs 1 inference/minute, and Duty-Cycled sensor sleep.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Energy & Power Modeling for Edge AI Inferences.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Inference Energy Joules & Battery Depletion Calculator",
    "eDesc": "Implement function calculateInferenceEnergy(voltageVolts = 3.3, activeCurrentMa = 40, inferenceTimeMs = 12, inferencesPerDay = 1000) estimating energy per inference and daily battery load.",
    "eStarter": "function calculateInferenceEnergy(v = 3.3, iMa = 40, tMs = 12, infPerDay = 1000) {\n  // TODO: Compute V * I * t in Joules and daily mAh.\n  \n}",
    "eHint": "Compute V * I * t in Joules and daily mAh.",
    "eTest": "const res = calculateInferenceEnergy(3.3, 40, 10, 1000);\nif (res.energyPerInferenceMilliJoules !== 1.32 || res.status !== 'INFERENCE_POWER_BUDGET_NOMINAL') throw new Error('Inference energy calculation failed');",
    "aTitle": "Energy in Microjoules Converter",
    "aDesc": "Implement function joulesToMicroJoules(joules) returning `joules * 1000000`.",
    "aStarter": "function joulesToMicroJoules(j) {\n  // TODO: Multiply by 1,000,000.\n  \n}",
    "aHint": "Multiply by 1,000,000.",
    "aTest": "if (joulesToMicroJoules(0.001) !== 1000) throw new Error('Microjoule convert failed');"
  },
  {
    "day": 18,
    "title": "Weight Pruning & Sparsity: Magnitude Pruning, Structured Channel Pruning & CSR Storage",
    "desc": "Offload inferences from CPU to dedicated silicon: ARM Ethos-U55/U65 MicroNPU, Kendryte K210, MAX78000 CNN engine, and Zero-CPU inference execution.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Neural Processing Units (NPUs) & Hardware Micro-Accelerators.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "NPU Accelerator Performance & Offload Evaluator",
    "eDesc": "Implement function evaluateNpuOffload(cpuCycles, npuCycles, cpuPowerMw, npuPowerMw) calculating speedup ratio and energy reduction factor.",
    "eStarter": "function evaluateNpuOffload(cpuC, npuC, cpuMw, npuMw) {\n  // TODO: Compute speedup = cpuC / npuC and energy savings percentage.\n  \n}",
    "eHint": "Compute speedup = cpuC / npuC and energy savings percentage.",
    "eTest": "const res = evaluateNpuOffload(1000000, 50000, 100, 30);\nif (res.speedupRatio !== 20.0 || res.energySavingsPercent < 90 || res.status !== 'NPU_HARDWARE_ACCELERATION_OPTIMAL') throw new Error('NPU offload calculation failed');",
    "aTitle": "NPU Offload Compatibility Checker",
    "aDesc": "Implement function isOpNpuCompatible(opName) returning true for 'CONV_2D', 'DEPTHWISE_CONV_2D', 'MAX_POOL_2D'.",
    "aStarter": "function isOpNpuCompatible(op) {\n  // TODO: Check standard CNN ops.\n  \n}",
    "aHint": "Check standard CNN ops.",
    "aTest": "if (!isOpNpuCompatible('CONV_2D') || isOpNpuCompatible('CUSTOM_OP')) throw new Error('NPU compatibility failed');"
  },
  {
    "day": 19,
    "title": "Knowledge Distillation for Microcontrollers: Teacher-Student Networks & Temperature Scaling",
    "desc": "Process infinite acoustic audio streams without dropping samples: DMA Ping-Pong buffers, Ring/Circular buffer indexing, Spectrogram sliding window stepping, and Real-Time audio streaming.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Continuous Audio Streaming & Ring Buffer Inferences.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Circular Audio Ring Buffer Stream Stepper",
    "eDesc": "Implement function pushToCircularBuffer(ringBuffer, headIndex, newSamples) inserting incoming audio samples with circular modulo wrap-around.",
    "eStarter": "function pushToCircularBuffer(buffer, head, newSamples) {\n  // TODO: Insert samples at currentHead with modulo wrap-around.\n  \n}",
    "eHint": "Insert samples at currentHead with modulo wrap-around.",
    "eTest": "const buf = [0, 0, 0, 0, 0];\nconst res = pushToCircularBuffer(buf, 3, [10, 20, 30]);\nif (res.newHeadIndex !== 1 || buf[3] !== 10 || buf[4] !== 20 || buf[0] !== 30) throw new Error('Circular buffer failed');",
    "aTitle": "Buffer Overrun Detector",
    "aDesc": "Implement function detectBufferOverrun(unreadSamples, capacity) returning `unreadSamples > capacity`.",
    "aStarter": "function detectBufferOverrun(u, c) {\n  // TODO: Check if unread samples exceed capacity.\n  \n}",
    "aHint": "Check if unread samples exceed capacity.",
    "aTest": "if (!detectBufferOverrun(600, 512) || detectBufferOverrun(200, 512)) throw new Error('Overrun detect failed');"
  },
  {
    "day": 20,
    "title": "Milestone 4: INT8 Post-Training Quantization & Structured Pruning Optimization Engine",
    "desc": "Eliminate flickering trigger decisions: Confidence thresholds, Moving Average smoothing window, Debounce cooldown timer, and Dual-Threshold Hysteresis ($T_{\\text{high}}$ to trigger, $T_{\\text{low}}$ to release).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Classification Confidence Hysteresis & False Positive Suppression.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Dual-Threshold Hysteresis State Machine",
    "eDesc": "Implement function evaluateHysteresisTrigger(currentState, score, tHigh = 0.85, tLow = 0.40) enforcing Schmitt-trigger stability on AI model outputs.",
    "eStarter": "function evaluateHysteresisTrigger(currState, score, tHigh = 0.85, tLow = 0.40) {\n  // TODO: Switch to ON if score >= tHigh; switch to OFF if score < tLow; else hold.\n  \n}",
    "eHint": "Switch to ON if score >= tHigh; switch to OFF if score < tLow; else hold.",
    "eTest": "const trigger = evaluateHysteresisTrigger('OFF', 0.90, 0.85, 0.40);\nconst hold = evaluateHysteresisTrigger('ON', 0.60, 0.85, 0.40); // 0.60 > 0.40 -> remains ON!\nconst release = evaluateHysteresisTrigger('ON', 0.35, 0.85, 0.40);\nif (trigger.activeState !== 'ON' || hold.activeState !== 'ON' || release.activeState !== 'OFF') throw new Error('Hysteresis failed');",
    "aTitle": "Moving Average Smoother",
    "aDesc": "Implement function smoothScore(history) returning `Number((history.reduce((a, b) => a + b, 0) / history.length).toFixed(2))`.",
    "aStarter": "function smoothScore(h) {\n  // TODO: Average array elements.\n  \n}",
    "aHint": "Average array elements.",
    "aTest": "if (smoothScore([0.8, 0.9, 0.7]) !== 0.80) throw new Error('Smooth failed');"
  },
  {
    "day": 21,
    "title": "TensorFlow Lite for Microcontrollers (TFLM): FlatBuffers, OpResolvers & Tensor Arena Memory Planning",
    "desc": "Milestone 3: Build an unsupervised on-device anomaly detector: Encoder compression $\\to$ Latent bottleneck $\\to$ Decoder reconstruction, Mean Squared Error (MSE) reconstruction loss, and dynamic outlier flagging.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of ⭐ MILESTONE 3: Production Autoencoder Anomaly Detection Engine.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Edge Autoencoder Reconstruction Anomaly Detector",
    "eDesc": "Implement function detectAutoencoderAnomaly(inputVector, reconstructedVector, thresholdMse = 0.05) calculating reconstruction loss and classifying anomalous deviations.",
    "eStarter": "function detectAutoencoderAnomaly(orig, recon, threshold = 0.05) {\n  // TODO: Compute MSE = sum((orig - recon)^2)/N and compare against threshold.\n  \n}",
    "eHint": "Compute MSE = sum((orig - recon)^2)/N and compare against threshold.",
    "eTest": "const normal = detectAutoencoderAnomaly([1.0, 2.0, 3.0], [1.01, 1.99, 3.02], 0.05);\nconst anomaly = detectAutoencoderAnomaly([1.0, 2.0, 3.0], [2.5, 4.0, 1.2], 0.05);\nif (normal.isAnomaly || !anomaly.isAnomaly || anomaly.status !== 'UNSUPERVISED_ANOMALY_DETECTED') throw new Error('Autoencoder anomaly failed');",
    "aTitle": "Autoencoder Latent Compression Ratio",
    "aDesc": "Implement function getLatentCompression(inputDim, latentDim) returning `Number((inputDim / latentDim).toFixed(1))`.",
    "aStarter": "function getLatentCompression(i, l) {\n  // TODO: Divide inputDim by latentDim.\n  \n}",
    "aHint": "Divide inputDim by latentDim.",
    "aTest": "if (getLatentCompression(64, 8) !== 8.0) throw new Error('Latent compression failed');"
  },
  {
    "day": 22,
    "title": "CMSIS-NN Kernel Acceleration: ARM Cortex-M Helium Extensions & Im2Col Matrix Transforms",
    "desc": "Fuse noisy sensor telemetry: 1D Kalman Filter (State estimate $\\hat{x}$, Error covariance $P$, Kalman Gain $K$, Innovation residual $y - \\hat{x}$), fusing IMU, temperature, and current sensors before neural network inference.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Sensor Fusion: Kalman Filtering & Multi-Modal Preprocessing.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "1D Kalman Filter State Estimator",
    "eDesc": "Implement function updateKalmanFilter(estimate, errorCovariance, measurement, processNoiseQ = 0.01, measurementNoiseR = 0.1) executing predict and update cycles.",
    "eStarter": "function updateKalmanFilter(xHat, P, z, Q = 0.01, R = 0.1) {\n  // TODO: Compute P_pred = P + Q, K = P_pred / (P_pred + R), x_new = x + K*(z - x), P_new = (1-K)*P_pred.\n  \n}",
    "eHint": "Compute P_pred = P + Q, K = P_pred / (P_pred + R), x_new = x + K*(z - x), P_new = (1-K)*P_pred.",
    "eTest": "const res = updateKalmanFilter(20.0, 1.0, 25.0, 0.01, 0.1);\nif (res.filteredEstimate < 24.0 || res.filteredEstimate > 25.0 || res.status !== 'KALMAN_STATE_FILTERED_NOMINAL') throw new Error('Kalman filter failed');",
    "aTitle": "Kalman Gain Calculator",
    "aDesc": "Implement function calculateKalmanGain(P, R) returning `Number((P / (P + R)).toFixed(3))`.",
    "aStarter": "function calculateKalmanGain(P, R) {\n  // TODO: Divide P by (P + R).\n  \n}",
    "aHint": "Divide P by (P + R).",
    "aTest": "if (calculateKalmanGain(1.0, 0.1) !== 0.909) throw new Error('Kalman gain failed');"
  },
  {
    "day": 23,
    "title": "Embedded Micro-Vision: MobileNet Architectures, Inverted Residuals & 96x96 Person Detection",
    "desc": "Maintain accuracy across $-40^{\\circ}\\text{C}$ to $+85^{\\circ}\\text{C}$: Polynomial temperature calibration curves ($S_{\\text{calibrated}} = S_{\\text{raw}} - (a T^2 + b T + c)$) and Dynamic Zero-Offset Tracking (DZOT).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Thermal Drift Compensation & Environmental Normalization.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Polynomial Temperature Calibration Compensator",
    "eDesc": "Implement function compensateThermalDrift(rawReading, tempC, coeffA = 0.001, coeffB = 0.05, coeffC = 0.1) removing environmental drift from sensor readings.",
    "eStarter": "function compensateThermalDrift(raw, temp, a = 0.001, b = 0.05, c = 0.1) {\n  // TODO: Compute drift = a*T^2 + b*T + c and subtract from raw reading.\n  \n}",
    "eHint": "Compute drift = a*T^2 + b*T + c and subtract from raw reading.",
    "eTest": "const res = compensateThermalDrift(100, 25, 0.001, 0.05, 0.1);\nif (res.thermalDriftOffset !== 1.975 || res.calibratedReading !== 98.025) throw new Error('Thermal compensation failed');",
    "aTitle": "Temperature Offset Formatter",
    "aDesc": "Implement function formatOffset(val) returning `+${val} offset` if val >= 0 else `${val} offset`.",
    "aStarter": "function formatOffset(v) {\n  // TODO: Format string with sign.\n  \n}",
    "aHint": "Format string with sign.",
    "aTest": "if (formatOffset(1.5) !== '+1.5 offset') throw new Error('Offset format failed');"
  },
  {
    "day": 24,
    "title": "Keyword Spotting (KWS): Depthwise 1D/2D Audio CNNs, Ring Buffers & False Trigger Suppression",
    "desc": "Run compact attention on microcontrollers: 1-Head Self-Attention ($Q, K, V$ projections), INT8 Quantized Attention matrices, and Sequence length truncation for acoustic context.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Tiny Transformers & Edge Attention Mechanisms.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Tiny Self-Attention Matrix Multiplication Kernel",
    "eDesc": "Implement function computeTinyAttention(Q, K, V) calculating scaled dot-product attention score for sequence length 2.",
    "eStarter": "function computeTinyAttention(Q, K, V) {\n  // TODO: Compute dot = Q[0]*K[0] + Q[1]*K[1], score = exp(dot/sqrt(2)), and scale V vector.\n  \n}",
    "eHint": "Compute dot = Q[0]*K[0] + Q[1]*K[1], score = exp(dot/sqrt(2)), and scale V vector.",
    "eTest": "const res = computeTinyAttention([1, 0], [1, 0], [2, 4]);\nif (res.attentionDotProduct !== 1.0 || res.status !== 'TINY_ATTENTION_COMPUTED_NOMINAL') throw new Error('Tiny attention failed');",
    "aTitle": "Scale Factor Calculator",
    "aDesc": "Implement function getAttentionScale(dim) returning `Number(Math.sqrt(dim).toFixed(3))`.",
    "aStarter": "function getAttentionScale(d) {\n  // TODO: Return sqrt(dim).\n  \n}",
    "aHint": "Return sqrt(dim).",
    "aTest": "if (getAttentionScale(4) !== 2.0) throw new Error('Attention scale failed');"
  },
  {
    "day": 25,
    "title": "Milestone 5: TensorFlow Lite for Microcontrollers (TFLM) Tensor Arena & CMSIS-NN Engine",
    "desc": "Eliminate memory copies between sensor peripherals and neural network input buffers: Direct Memory Access (DMA) circular buffer streaming directly into `tensor_arena->input_data` pointer.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Zero-Copy DMA to Inference Pipelines.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Zero-Copy DMA Buffer Pointer Validator",
    "eDesc": "Implement function validateZeroCopyDma(dmaBufferAddress, tensorInputAddress) verifying direct address matching for zero memory copying.",
    "eStarter": "function validateZeroCopyDma(dmaAddr, tensorAddr) {\n  // TODO: Verify dmaAddr === tensorAddr.\n  \n}",
    "eHint": "Verify dmaAddr === tensorAddr.",
    "eTest": "const ok = validateZeroCopyDma('0x20001000', '0x20001000');\nconst fail = validateZeroCopyDma('0x20001000', '0x20005000');\nif (!ok.isZeroCopy || fail.isZeroCopy || ok.status !== 'ZERO_COPY_DMA_ACTIVE') throw new Error('Zero copy DMA check failed');",
    "aTitle": "DMA Memory Copy Savings Estimator",
    "aDesc": "Implement function estimateDmaCpuCyclesSaved(bytes) returning `bytes * 2`.",
    "aStarter": "function estimateDmaCpuCyclesSaved(b) {\n  // TODO: Multiply bytes by 2.\n  \n}",
    "aHint": "Multiply bytes by 2.",
    "aTest": "if (estimateDmaCpuCyclesSaved(1024) !== 2048) throw new Error('DMA cycles failed');"
  },
  {
    "day": 26,
    "title": "Unsupervised Anomaly Detection: Under-Complete Autoencoders & Reconstruction Error",
    "desc": "Defend against acoustic spoofing and sensor noise: Out-of-Distribution (OOD) detection, Mahalanobis distance rejection, and Softmax entropy scoring ($H(p) = -\\sum p_i \\log p_i$).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Adversarial Robustness & Out-of-Distribution (OOD) Rejection.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Softmax Entropy & Out-of-Distribution (OOD) Classifier",
    "eDesc": "Implement function evaluateOodEntropy(probabilities, maxEntropyThreshold = 1.0) rejecting ambiguous predictions with high entropy.",
    "eStarter": "function evaluateOodEntropy(probs, threshold = 1.0) {\n  // TODO: Compute entropy sum(-p*log(p)) and flag OOD if entropy >= threshold.\n  \n}",
    "eHint": "Compute entropy sum(-p*log(p)) and flag OOD if entropy >= threshold.",
    "eTest": "const confident = evaluateOodEntropy([0.98, 0.01, 0.01], 1.0);\nconst confused = evaluateOodEntropy([0.33, 0.33, 0.34], 1.0);\nif (confident.isOutOfDistribution || !confused.isOutOfDistribution || confident.status !== 'IN_DISTRIBUTION_CONFIDENT_PREDICTION') throw new Error('OOD entropy failed');",
    "aTitle": "Max Probability Confidence Extractor",
    "aDesc": "Implement function getMaxConfidence(probs) returning `Math.max(...probs)`.",
    "aStarter": "function getMaxConfidence(p) {\n  // TODO: Return maximum probability.\n  \n}",
    "aHint": "Return maximum probability.",
    "aTest": "if (getMaxConfidence([0.1, 0.85, 0.05]) !== 0.85) throw new Error('Max conf failed');"
  },
  {
    "day": 27,
    "title": "TinyML Energy Profiling: Microjoules per Inference, Duty Cycles & Power Gating",
    "desc": "Personalize AI on microcontrollers without cloud retraining: Few-Shot k-Nearest Neighbors (k-NN) classification in latent embedding space, Nearest Centroid classifiers, and Flash-backed centroid updates.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of On-Device Continual Learning & Few-Shot Adaptation.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Latent Space Nearest Centroid Few-Shot Adapter",
    "eDesc": "Implement function classifyNearestCentroid(embedding, classCentroids) calculating Euclidean distances to classify new sensor gestures.",
    "eStarter": "function classifyNearestCentroid(emb, centroids) {\n  // TODO: Compute Euclidean distance to each centroid and return closest class.\n  \n}",
    "eHint": "Compute Euclidean distance to each centroid and return closest class.",
    "eTest": "const centroids = { 'TAP': [0.1, 0.1], 'SHAKE': [0.9, 0.9] };\nconst res = classifyNearestCentroid([0.12, 0.08], centroids);\nif (res.predictedClass !== 'TAP' || res.status !== 'FEW_SHOT_CENTROID_CLASSIFIED') throw new Error('Few-shot centroid failed');",
    "aTitle": "Centroid Updater Engine",
    "aDesc": "Implement function updateCentroid(oldC, newSample, n = 5) returning `oldC.map((v, i) => Number(((v * n + newSample[i]) / (n + 1)).toFixed(3)))`.",
    "aStarter": "function updateCentroid(o, s, n = 5) {\n  // TODO: Compute weighted average.\n  \n}",
    "aHint": "Compute weighted average.",
    "aTest": "if (updateCentroid([1.0, 1.0], [2.0, 2.0], 1)[0] !== 1.5) throw new Error('Centroid update failed');"
  },
  {
    "day": 28,
    "title": "On-Device Sensor Fusion: Multi-Modal IMU + Acoustic Ingestion & Cross-Sensor Attention",
    "desc": "Run vision, audio, and vibration models concurrently on a single MCU: Shared Tensor Arena memory overlays, Model priority scheduler, and Cooperative multitasking.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Multi-Model Execution & Time-Multiplexed Tensor Arenas.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Shared Tensor Arena Multi-Model Memory Overlay Manager",
    "eDesc": "Implement function planSharedTensorArena(modelArenaReqs) finding maximum required buffer size to allow time-multiplexed model execution in single RAM allocation.",
    "eStarter": "function planSharedTensorArena(models) {\n  // TODO: Compute maxBytes as shared buffer and ramSaved = sumBytes - maxBytes.\n  \n}",
    "eHint": "Compute maxBytes as shared buffer and ramSaved = sumBytes - maxBytes.",
    "eTest": "const res = planSharedTensorArena([{ name: 'VISION', arenaBytes: 80000 }, { name: 'AUDIO', arenaBytes: 30000 }, { name: 'IMU', arenaBytes: 15000 }]);\nif (res.sharedArenaAllocationBytes !== 80000 || res.ramSavedBytes !== 45000 || res.status !== 'SHARED_TENSOR_ARENA_OVERLAY_ACTIVE') throw new Error('Shared arena failed');",
    "aTitle": "RAM Savings Percentage Formatter",
    "aDesc": "Implement function formatRamSavings(saved) returning `${saved} bytes SRAM saved`.",
    "aStarter": "function formatRamSavings(s) {\n  // TODO: Format string.\n  \n}",
    "aHint": "Format string.",
    "aTest": "if (formatRamSavings(45000) !== '45000 bytes SRAM saved') throw new Error('Savings format failed');"
  },
  {
    "day": 29,
    "title": "On-Device Continuous Learning: Few-Shot Transfer Learning & Flash-Resident Linear Heads",
    "desc": "Safeguard edge actuators against AI hallucination: Shadow Mode validation, Hardcoded Safety Heuristic bounds ($T > 100^{\\circ}\\text{C} \\implies$ Emergency shutdown regardless of AI output), and Decision Logging.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Fail-Safe Heuristics & Shadow Mode Deployment.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Edge AI Safety Supervisor & Heuristic Override Circuit",
    "eDesc": "Implement function executeSafetySupervisor(aiDecision, physicalLimitTripped, temperatureC) overriding AI predictions if safety constraints are breached.",
    "eStarter": "function executeSafetySupervisor(aiAction, limitTripped, temp) {\n  // TODO: Override with EMERGENCY_HALT_OVERRIDE if limitTripped or temp > 95.\n  \n}",
    "eHint": "Override with EMERGENCY_HALT_OVERRIDE if limitTripped or temp > 95.",
    "eTest": "const safe = executeSafetySupervisor('OPEN_VALVE', false, 45);\nconst unsafe = executeSafetySupervisor('OPEN_VALVE', false, 110); // Overheat!\nif (safe.executedFinalAction !== 'OPEN_VALVE' || unsafe.executedFinalAction !== 'EMERGENCY_HALT_OVERRIDE' || !unsafe.heuristicOverrideEngaged) throw new Error('Safety supervisor failed');",
    "aTitle": "Shadow Mode Agreement Rater",
    "aDesc": "Implement function rateShadowAgreement(aiDecisions, expertDecisions) returning agreement percentage.",
    "aStarter": "function rateShadowAgreement(ai, exp) {\n  // TODO: Calculate percentage matches.\n  \n}",
    "aHint": "Calculate percentage matches.",
    "aTest": "if (rateShadowAgreement(['A', 'B', 'A'], ['A', 'B', 'B']) !== 66.7) throw new Error('Agreement failed');"
  },
  {
    "day": 30,
    "title": "Capstone 1: ApexTinyML Autonomous Industrial Motor Anomaly & Predictive Maintenance Edge Node Capstone Viva Gate",
    "desc": "Final Capstone Synthesis: The complete industrial Edge AI ecosystem: 3-axis vibration FFT spectral analysis, acoustic MFCC keyword/bearing anomaly detection, low-power Visual Wake Words person verification, INT8 CMSIS-NN SIMD acceleration, Kalman sensor fusion, and Fail-Safe heuristic supervisory overrides.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of 🏆 FINAL CAPSTONE: Predictive Maintenance Vision & Acoustic Fusion Ecosystem.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Predictive Maintenance Multi-Modal Master Edge Controller",
    "eDesc": "Implement function executePredictiveMaintenanceEdge(vibrationRms, audioMfccLoss, visionPersonProb, tempC) orchestrating complete plant health assessment.",
    "eStarter": "function executePredictiveMaintenanceEdge(vibration, audioLoss, visionProb, temp) {\n  // TODO: Evaluate vibration, acoustic, vision, and temperature to return certified status.\n  \n}",
    "eHint": "Evaluate vibration, acoustic, vision, and temperature to return certified status.",
    "eTest": "const res = executePredictiveMaintenanceEdge(5.2, 0.12, 0.90, 90);\nif (res.plantStatus !== 'CRITICAL_ALARM_SHUTDOWN' || !res.vibrationAnomaly || !res.certified || res.status !== 'PREDICTIVE_MAINTENANCE_ECOSYSTEM_CERTIFIED') throw new Error('Capstone Edge AI failed');",
    "aTitle": "Edge AI Master Certification Auditor",
    "aDesc": "Implement function auditEdgeAiMasterCert() returning `{ certified: true, score: '100/100', tier: 'ENTERPRISE_EDGE_AI_TINYML_CERTIFIED' }`. When called with `overrideProps`, return the base object merged with `overrideProps`.",
    "aStarter": "function auditEdgeAiMasterCert(overrideProps) {\n  // TODO: Return {\"certified\":true,\"score\":\"100/100\",\"tier\":\"ENTERPRISE_EDGE_AI_TINYML_CERTIFIED\"} merged with optional overrideProps\n  \n}",
    "aHint": "Return { ...{\"certified\":true,\"score\":\"100/100\",\"tier\":\"ENTERPRISE_EDGE_AI_TINYML_CERTIFIED\"}, ...(overrideProps || {}) }.",
    "aTest": "const base = auditEdgeAiMasterCert();\nconst custom = auditEdgeAiMasterCert({ verifiedOverride: true });\nif (!base || !custom.verifiedOverride) throw new Error('Object configuration merge failed');"
  }
];

export const IOT_EDGE_AI_30_DAYS_QUESTS: CourseQuest[] = IOT_EDGE_AI_30_DAYS_CONFIGS.flatMap((cfg, idx) => 
  buildEnrichedDayQuests('iot_edge', idx + 1, cfg)
);
