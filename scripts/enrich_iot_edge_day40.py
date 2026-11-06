import json

with open("scripts/iot_edge_day40.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Part 3: MFCC Feature Extraction & INT8 DS-CNN Classification Gate
data["parts"][2]["say"] = [
    "Now, we implement, defend, and certify the second half of our Milestone 7 engine: The CMSIS-DSP Vectorized MFCC Feature Extractor and Quantized INT8 1D DS-CNN Classification Gate.",
    "Once the pristine, denoised 16 kHz audio samples emerge from the NLMS filter, they stream directly into our STFT circular buffer. Every 20 milliseconds, the engine triggers feature extraction across a 400-sample window (25 ms).",
    "Let us trace the high-speed CMSIS-DSP feature pipeline: Step 1: Hanning Windowing (`arm_mult_q15`). Multiplies 400 audio samples by precalculated Q15 Hanning coefficients, tapering boundaries to zero and slashing spectral leakage by over 31 decibels.",
    "Step 2: 512-point Real Fast Fourier Transform (`arm_rfft_fast_q15`). Zero-pads 400 samples to 512 samples and computes the 257-bin linear power spectrum via `arm_cmplx_mag_squared_q15` in just 42 microseconds. The RFFT algorithm exploits Hermitian symmetry to execute in half the cycles of a complex FFT, utilizing Radix-4 butterfly assembly kernels and precomputed twiddle factor tables stored in Flash memory.",
    "Step 3: 26-band Triangular Mel Filterbank. Projects the 257 linear FFT bins onto 26 psychoacoustic Mel bands, concentrating spectral resolution below 1 Kilohertz to mirror the human cochlea. The triangular filter weights are stored in Flash memory as a compact sparse representation, requiring fewer than 420 memory reads per frame.",
    "Step 4: Logarithmic Compression & DCT-II (`arm_mat_mult_f32` / Q15). Takes the natural logarithm of Mel energies and projects through a 10x26 DCT-II matrix, producing 10 decorrelated cepstral coefficients ($c_0$ to $c_9$) in under 9 microseconds.",
    "Step 5: INT8 Quantized 1D DS-CNN Forward Inference. The newly computed 10-coefficient vector is appended to our rolling 49x10 spectrogram tensor inside the static 11.2 KB Tensor Arena. The TensorFlow Lite for Microcontrollers interpreter executes forward inference across five depthwise separable convolutional blocks using CMSIS-NN SIMD vector assembly (`arm_depthwise_conv_s8`). In just 5.75 milliseconds, the network outputs a 6-class probability distribution: Silence, Unknown speech, YES, NO, STOP, and ALARM.",
    "Let us examine how CMSIS-NN accelerates quantized depthwise separable convolutions: All weights and activations are quantized to signed 8-bit integers (`int8`). Requantization scales are decomposed into 32-bit Q31 multipliers $M_0$ and right-shift exponents $n$, executed via `arm_nn_requantize` with zero floating-point hardware instructions. The ARM Cortex-M SIMD instruction `__SMLAD` performs two parallel 16-bit multiply-accumulates per clock cycle, doubling throughput.",
    "To maximize SIMD utilization on ARM Cortex-M7 processors, the inner loop of `arm_depthwise_conv_s8` unrolls depthwise calculations into four-way blocks. Two 32-bit registers are loaded simultaneously using `LDRD` instructions, packing four 8-bit weights into two 16-bit register halves. The processor executes two `__SMLAD` instructions back-to-back, computing four MACs in just two clock cycles! The 32-bit accumulator is then rescaled, clamped with saturation math, and stored back into SRAM in packed 32-bit words, eliminating individual byte-write bus stalls.",
    "Let us analyze the internal activation buffer ping-pong mechanics: In TFLM, intermediate layer activations do not require separate memory allocations. The memory planner constructs an activation reuse graph: Layer 1 writes into Buffer A (1,600 bytes); Block 1 reads from Buffer A and writes into Buffer B (1,600 bytes); Block 2 reads from Buffer B and writes back into Buffer A! By ping-ponging between two contiguous 1.6 KB memory slices, the entire five-block neural network executes in less than 3.5 KB of active buffer memory! The remaining 7.5 KB of the Tensor Arena accommodates model state, scratchpads, and the 490-byte rolling spectrogram tensor.",
    "Step 6: Hysteresis Trigger Validation. To guarantee zero false alarms, a detection requires two consecutive 20 ms frames with confidence exceeding 0.85. If confirmed, a hardware GPIO trigger pulse is asserted immediately, completing the end-to-end voice trigger in under 26 milliseconds with deterministic real-time execution guarantees!"
]

with open("scripts/iot_edge_day40.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Enriched scripts/iot_edge_day40.json successfully.")
