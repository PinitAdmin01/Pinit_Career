import json

with open('scripts/iot_edge_day10.json', 'r', encoding='utf-8') as f:
    d10 = json.load(f)

expansions = [
    # Part 0 (386 words) -> needs +230 words (target >= 615)
    (0, [
        "In battery-powered industrial IoT and biomedical sensor nodes, the thermal and energetic consequences of integer arithmetic are staggering. Every time a processor executes a floating-point instruction on hardware FPUs or emulates it in software, the extensive combinational barrel shifters, normalization logic, and exponent aligners consume substantial dynamic energy. Energy consumption in digital CMOS circuits is governed by the fundamental dynamic power formula: P = alpha * C * V^2 * f.",
        "In integer-only ALU operations, the effective physical capacitance switched per multiply-accumulate operation is up to 10 to 15 times lower than in 32-bit floating-point units. Furthermore, because INT8 models execute in a fraction of the clock cycles, the microcontroller finishes inference far faster and immediately returns to an ultra-low-power sleep mode (such as ARM Stop or Standby mode consuming under 5 microamps). This Race-to-Sleep architectural paradigm—enabled directly by INT8 quantization—slashes average device energy consumption by over 90 percent, allowing wearable cardiac monitors and structural vibration beacons to operate for multiple years on a single coin-cell battery."
    ]),
    # Part 1 (361 words) -> needs +255 words (target >= 615)
    (1, [
        "To rigorously master affine quantization, we must also explore how rounding modes impact cumulative numerical accuracy across multi-layer networks. In standard computer software, floating-point numbers are rounded to integers using round-to-nearest-even (banker's rounding) to prevent upward or downward systematic bias. In TFLite quantization, this standard is maintained during offline calibration.",
        "However, on bare-metal microcontrollers, executing floating-point banker's rounding during runtime inference is out of the question. Instead, the runtime integer rescaling pipeline utilizes deterministic integer rounding: by adding a rounding nudge constant (`1 << 30` for positive numbers, or `1 - (1 << 30)` for negative numbers) prior to the bitwise right shift, the hardware achieves an exact integer equivalent of rounding to nearest without performing floating-point division. This bit-exact integer rounding ensures that edge inference yields identical classification results whether executed on a Cortex-M0+ running a simple integer ALU or a Cortex-M85 running 128-bit vector pipelines."
    ]),
    # Part 2 (348 words) -> needs +270 words (target >= 615)
    (2, [
        "When examining the internal implementation of ARM CMSIS-NN, we see how symmetric weight quantization directly enables loop unrolling and register reuse. Because the weight zero-point is zero ($Z_w = 0$), two adjacent 8-bit weight values can be packed into a single 16-bit halfword or four weights into a single 32-bit word directly in Flash memory.",
        "During convolutional filter execution, the CPU uses the `LDR` instruction to load four weights simultaneously into a general-purpose register. In parallel, four 8-bit input activations are loaded into another register. The CMSIS-NN assembly kernel unrolls the inner dot product, using instructions like `UXTB16` (Unsigned Extend Dual 8-bit to 16-bit) and `SMLAD` (Signed Multiply with Dual Accumulate). If weights had possessed non-zero zero-points, the CPU would have been forced to unpack every individual byte, subtract the zero-point, and perform scalar arithmetic, quadrupling the required instruction count. Symmetric weight quantization is thus the critical architectural enabler that transforms raw assembly SIMD instructions into practical deep learning acceleration."
    ]),
    # Part 3 (336 words) -> needs +280 words (target >= 615)
    (3, [
        "In addition to activation rescaling, bias vectors in convolutional and dense layers must also be seamlessly integrated into the integer-only arithmetic pipeline. How are 32-bit bias terms represented when weights are symmetric INT8 and activations are asymmetric INT8? In TFLM, biases are quantized as 32-bit integers (`int32_t`) with a scale factor equal to the product of the weight scale and input activation scale: $S_{bias} = S_w \\times S_{input}$.",
        "Because $S_{bias}$ matches the scale of the raw un-rescaled accumulator ($S_w \\times S_{input} \\sum q_w (q_a - Z_a)$), the quantized 32-bit bias can be added directly into the 32-bit accumulator with a simple integer addition (`acc += bias[c]`) before the fixed-point multiplier $M_0$ and bit-shift $n$ are applied! This elegant mathematical harmony ensures that bias addition introduces zero precision loss, requires no separate scaling operations, and executes in a single CPU clock cycle."
    ]),
    # Part 4 (309 words) -> needs +310 words (target >= 615)
    (4, [
        "Finally, in enterprise TinyML MLOps deployments, calibration datasets must be carefully curated to represent the full statistical distribution of field environments. If a vibration anomaly detection model is calibrated using telemetry collected only when machines are operating at room temperature (25 degrees Celsius), the intermediate activation dynamic ranges will not reflect operating conditions in extreme desert heat (60 degrees Celsius) or arctic freezing environments (-20 degrees Celsius). Temperature changes alter sensor amplifier gains and baseline noise levels.",
        "If real-world activation values exceed the calibrated $r_{max}$, the TFLite runtime clamps them to $127$. This saturation clipping introduces severe non-linear distortion, which can cause false alarms or missed failure detections in critical industrial infrastructure. High-maturity engineering teams implement Environmental Stratified Calibration: collecting representative sensor telemetry across the full operating temperature, vibration, and supply voltage envelope. By combining robust stratified calibration with automated FlatBuffer C++ export and TFLM Tensor Arena optimization, you create an end-to-end edge AI system that operates with bulletproof reliability across millions of hours of continuous service."
    ])
]

for idx, paras in expansions:
    d10['parts'][idx]['say'].extend(paras)

with open('scripts/iot_edge_day10.json', 'w', encoding='utf-8') as f:
    json.dump(d10, f, indent=2)

print("Enriched Day 10 successfully.")
