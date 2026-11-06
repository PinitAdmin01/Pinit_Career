import json

with open('scripts/iot_edge_day17.json', 'r', encoding='utf-8') as f:
    d17 = json.load(f)

expansions = [
    # Part 0 (currently 515 -> add ~85 words to reach > 600)
    (0, [
        "In enterprise machine learning workflows, deciding between PTQ and QAT also impacts development velocity and project economics. PTQ can be executed on a developer laptop in under two minutes using automated tooling such as TensorFlow Lite Converter or ONNX Runtime Quantizer. It requires zero access to proprietary training pipelines, compute clusters, or hyperparameter tuning infrastructure.",
        "QAT, by contrast, requires standing up full GPU training pipelines, managing optimizer learning rate schedules, and running multiple training epochs under simulated quantization noise. For teams developing commercial products, the standard engineering workflow begins with PTQ as a rapid baseline; only when a layer demonstrates unacceptable accuracy degradation or clinical sensitivity loss do engineers invest the compute capital required for Quantization-Aware Training."
    ]),
    # Part 1 (currently 411 -> add ~190 words to reach > 600)
    (1, [
        "To ensure representative calibration datasets maintain statistical validity, dataset curation must follow strict environmental sampling protocols. In industrial condition monitoring, for example, equipment does not operate in a single steady state; a pump experiences cold startup transients, varying hydraulic load pressures, fluid cavitation events, and gradual bearing wear.",
        "If a calibration dataset captures only steady-state nominal operations, the resulting activation histograms will severely underestimate the dynamic range encountered during startup or peak load. When a high-load condition occurs in the field, activations will heavily saturate at $+127$, causing clipped predictions and missed failure alarms. High-reliability TinyML calibration guidelines require representative datasets to incorporate stratified samples across all operational envelopes: idle, nominal, peak-stress, and known early-fault vibrational regimes.",
        "Furthermore, calibration datasets must be sanitized to eliminate anomalous corrupted frames caused by ADC voltage dropouts or loose sensor wiring. A single corrupt frame with a full-scale rail voltage spike can distort percentile calculations unless robust outlier filters are applied prior to histogram generation."
    ]),
    # Part 2 (currently 466 -> add ~140 words to reach > 600)
    (2, [
        "In modern deep learning frameworks such as PyTorch 2.0 and TensorFlow, FakeQuant nodes also incorporate Learnable Step Size Quantization (LSQ). In standard QAT with fixed scale factors, the clipping threshold is static throughout training. Under LSQ, the scale factor $S$ itself is treated as a continuously learnable parameter with its own gradient: $\\frac{\\partial L}{\\partial S}$.",
        "During backpropagation, the optimizer simultaneously adjusts both the weight values and the quantization step sizes, automatically discovering the optimal compromise between clipping distortion and bucket resolution for each individual layer. This end-to-end differentiability enables sub-byte quantization (such as 4-bit weights and 4-bit activations, INT4) to achieve performance comparable to full-precision floating-point baselines on ultra-compact microcontrollers."
    ]),
    # Part 3 (currently 417 -> add ~185 words to reach > 600)
    (3, [
        "To understand how per-channel quantization interacts with modern compiler toolchains, we must inspect the physical memory layout of quantized convolution kernels in Flash memory. In a standard 2D convolution with $C_{out}$ output channels, the kernel weights are arranged as a 4D array of dimensions $[C_{out}, K_h, K_w, C_{in}]$.",
        "In per-channel quantization, the $C_{out}$ scale factors are pre-computed during compilation and stored as an adjacent array of 32-bit floating-point or fixed-point values in Read-Only Flash memory. When the CMSIS-NN optimized convolution kernel (`arm_convolve_s8`) executes, its outer loop iterates over the output channels. At the start of each channel iteration, the processor loads the channel-specific scale factor and bias into CPU registers $R_8$ and $R_9$.",
        "The inner spatial and input-channel loops then execute purely on 8-bit integer weights using SIMD dual-MAC instructions (`__SMLAD`). Because the scale factor is loaded only once per output channel—rather than once per multiply-accumulate operation—per-channel quantization introduces zero measurable cycle overhead compared to per-tensor quantization while delivering substantial gains in signal-to-noise ratio."
    ]),
    # Part 4 (currently 251 -> add ~355 words to reach > 600)
    (4, [
        "In safety-critical edge AI engineering, the culmination of the quantization pipeline is the automated regression test suite executed inside physical Hardware-in-the-Loop (HIL) environments. Software simulations in Python or PyTorch provide essential mathematical insights, but real physical microcontrollers introduce hardware-specific nuances: cache line alignment, memory bus wait states, interrupt latency jitter, and internal power rail fluctuations.",
        "Our capstone optimization engine automatically exports the calibrated model as a self-contained, statically allocated C++ header file (`model_data.h`) and associated CMSIS-NN inference driver. The test harness flashes this binary onto target evaluation boards (such as an STM32L431KC or NXP LPC55S69) via automated JTAG/SWD debug probes.",
        "On the target board, the test harness injects exact test vectors over high-speed SPI or UART, reads back the 8-bit integer prediction outputs, and compares them byte-for-byte against the Python reference simulation. Any bit-level divergence—whether caused by an unhandled compiler rounding difference or register allocation bug—triggers an immediate assertion failure.",
        "Furthermore, the test bench measures physical execution time using silicon cycle counters (such as ARM DWT `CYCCNT`) and monitors dynamic current consumption using precision shunt current amplifiers. Only when the physical hardware demonstrates 100 percent bit-exact mathematical agreement, sub-10 millisecond execution latency, and zero memory leaks does the build receive final production sign-off. This rigorous synthesis represents the gold standard of professional TinyML engineering."
    ])
]

for idx, paras in expansions:
    d17['parts'][idx]['say'].extend(paras)

d17['minutes'] = 38

with open('scripts/iot_edge_day17.json', 'w', encoding='utf-8') as f:
    json.dump(d17, f, indent=2)

print("Enriched Day 17 successfully.")
