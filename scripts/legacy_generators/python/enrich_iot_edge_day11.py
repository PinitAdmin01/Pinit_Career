import json

with open('scripts/iot_edge_day11.json', 'r', encoding='utf-8') as f:
    d11 = json.load(f)

expansions = [
    # Part 0 (357 words) -> needs +260 words (target >= 615)
    (0, [
        "In production industrial telemetry environments, understanding the physical origins of signal dynamic range is vital for configuring the quantizer engine. When an accelerometer on a 10,000-RPM centrifugal compressor measures vibration, normal operating conditions produce root-mean-square (RMS) accelerations of only 0.5 to 1.5 g. However, during mechanical shock events or aerodynamic surging, transient peak accelerations can spike instantaneously to over 25 g.",
        "If the quantizer's scale factor is sized naively to accommodate the maximum possible 25 g shock spike across the entire 256-level grid, normal operating vibration features are squeezed into only 10 to 15 discrete integer quanta. This loss of fine spectral detail blinds the feature extraction pipeline, preventing the detection of subtle early-stage bearing micro-cracks. Conversely, if the scale is tuned too tightly around normal operation, shock transients will saturate the integer bounds at -128 and 127. Advanced quantizers address this tension through Dynamic Range Calibration and Statistical Percentile Clipping, establishing an optimal balance that preserves maximum resolution where the signal spends 99 percent of its operational lifespan."
    ]),
    # Part 1 (318 words) -> needs +300 words (target >= 615)
    (1, [
        "To appreciate the subtlety of integer rounding modes, one must examine the micro-architectural behavior of modern ARM Cortex-M processors. In the ARMv7E-M and ARMv8-M instruction set architectures, the floating-point unit provides hardware instructions for rounding and conversion: `VCVTR.S32.F32` (Vector Convert with Round to Nearest-Even) and `VCVT.S32.F32` (Vector Convert with Truncation).",
        "If a firmware developer writes a naive cast in C++—`(int8_t)(f_val / scale)`—the compiler is forced by the ANSI C standard to emit the truncation instruction `VCVT.S32.F32`. This single truncation cast introduces directional error into every sample. By contrast, writing an explicit round-to-nearest expression or utilizing ARM CMSIS intrinsic functions instructs the compiler to emit `VCVTR.S32.F32`, executing unbiased half-to-even rounding in a single clock cycle. Furthermore, combining `VCVTR` with the hardware saturation instruction `SSAT` (Signed Saturate) produces a completely branchless, two-instruction quantization sequence that runs at the maximum clock frequency of the processor without causing pipeline bubbles."
    ]),
    # Part 2 (295 words) -> needs +320 words (target >= 615)
    (2, [
        "In mission-critical cyber-physical systems—such as avionics flight surface actuators or medical infusion pumps—validating dequantization fidelity is a mandatory requirement for regulatory functional safety certification under DO-178C or IEC 62304. Safety auditors require mathematical proof that the error introduced by numerical quantization cannot cause control loop instability.",
        "To establish this proof, engineers execute automated Monte Carlo simulation suites that inject millions of synthetic and recorded sensor trajectories through the quantizer-dequantizer engine. By comparing the original continuous inputs against the reconstructed outputs, the test harness computes the empirical error histogram and performs Kolmogorov-Smirnov statistical tests. This proves that the quantization noise is uncorrelated with the input signal, has zero mean, and adheres strictly to the theoretical variance limit of $S^2 / 12$. Demonstrating that the maximum reconstruction error is bounded by $S/2$ guarantees that downstream PID controllers or neural network classifiers will never encounter unmodeled numerical transients."
    ]),
    # Part 3 (299 words) -> needs +320 words (target >= 615)
    (3, [
        "The advantages of Per-Channel Symmetric Quantization become even more pronounced when analyzing depthwise-separable convolutional networks like MobileNet. In standard 2D convolutions, each output filter sums across all input channels, which tends to average out extreme weight variations. In depthwise convolutions, by contrast, each filter channel operates entirely in isolation on a single input channel.",
        "Because depthwise filter channels do not share weights or mix activations, their individual weight standard deviations can vary by more than two orders of magnitude across the layer. Under a monolithic Per-Tensor quantization scheme, depthwise layers experience severe catastrophic accuracy degradation, often rendering MobileNet completely unusable on microcontrollers. By deploying Per-Channel scaling, each depthwise filter is quantized to its own tailored scale factor $S_w[c]$. The CMSIS-NN kernel `arm_depthwise_conv_s8` reads the channel scale vector during its execution, applying per-channel effective multipliers to deliver maximum spatial filtering fidelity at full hardware speed."
    ]),
    # Part 4 (203 words) -> needs +415 words (target >= 615)
    (4, [
        "When integrating the generated C++ quantization header into an embedded software stack, careful architectural boundaries must be maintained between peripheral hardware drivers and machine learning runtimes. Typically, sensor data is acquired via peripheral Direct Memory Access (DMA) running in the background without CPU intervention. For example, a 3-axis digital accelerometer streams samples via SPI into a circular double buffer in SRAM at 1,600 samples per second.",
        "When a buffer fills, the DMA controller fires an interrupt (`DMA_Complete_IRQHandler`). The interrupt service routine notifies an RTOS worker task (e.g., via a FreeRTOS task notification or Zephyr semaphores). Inside the worker task, the firmware calls the inline `Quantize_VibrationInput_Sample()` function to stream samples into the input tensor of the TFLM Tensor Arena. Because the quantization routine uses pre-computed reciprocal scaling (`kInvScale`) and branchless saturation clamping, quantizing a 512-sample sensor window takes less than 1,500 clock cycles (under 10 microseconds on a 160 MHz Cortex-M4).",
        "This lightning-fast input ingestion leaves over 99 percent of the CPU's processing budget available for the neural network's convolutional layers and application business logic. Furthermore, unit tests compiled against this C++ header run automatically on PC host simulation and target microcontroller silicon, validating that both environments generate bit-identical quantized tensors before physical deployment."
    ])
]

for idx, paras in expansions:
    d11['parts'][idx]['say'].extend(paras)

with open('scripts/iot_edge_day11.json', 'w', encoding='utf-8') as f:
    json.dump(d11, f, indent=2)

print("Enriched Day 11 successfully.")
