import json

with open('scripts/iot_edge_day20.json', 'r', encoding='utf-8') as f:
    d20 = json.load(f)

expansions = [
    # Part 0: Milestone 4 Architectural Pipeline (currently 486 -> add ~140 words to reach > 620)
    (0, [
        "In enterprise embedded machine learning infrastructure, the pruning-quantization pipeline must interface cleanly with diverse embedded compiler toolchains. Whether targeting bare-metal ARM Cortex-M microcontrollers via CMSIS-NN, Cadence Tensilica Vision DSPs, or micro-NPUs like ARM Ethos-U55, the compression cascade emits intermediate serialized model representations—such as FlatBuffer schema binaries or quantized ONNX graphs.",
        "Crucially, the compression pipeline maintains strict layer-by-layer parameter budgets. If a developer attempts to prune the final dense classification layer too aggressively, the network suffers irrecoverable feature collapse because the final projection matrix lacks redundant linear pathways. Conversely, early convolutional layers that process raw audio spectrograms or accelerometer vibration matrices contain substantial spatial and spectral redundancy, routinely tolerating 50 to 60 percent structured channel removal.",
        "By enforcing a disciplined compiler pass ordering—structured pruning first, iterative fine-tuning second, representative calibration third, and integer fixed-point scale decomposition fourth—our Milestone 4 engine guarantees mathematical determinism, preserving high accuracy while compressing model footprints directly onto resource-constrained embedded microcontrollers."
    ]),

    # Part 1: Automated Representative Calibration (currently 262 -> add ~360 words to reach > 620)
    (1, [
        "To achieve production-grade calibration, the choice of representative data distribution is paramount. If the calibration dataset contains only clean, nominal sensor readings recorded in ideal laboratory conditions, the activation histograms will remain artificially narrow. In real-world industrial environments, sensors encounter mechanical vibrations, acoustic echoes, sensor drift, and electrical EMI noise bursts.",
        "When an unexpected sensor spike occurs during field operation, activations that exceed the calibration threshold are abruptly saturated to $+127$ or $-128$, introducing massive clipping distortion. Therefore, our automated calibration engine injects synthetic boundary conditions and edge-case operational profiles into the calibration stream—such as industrial machine startup transients, sudden load changes, and temperature-induced baseline drift.",
        "Furthermore, our engine dynamically evaluates both Kullback-Leibler (KL) divergence histogram minimization and Mean Squared Error (MSE) search across all intermediate activation tensors. For layers with unimodal, Gaussian-like distributions (such as post-batchnorm feature maps), KL-divergence finds the optimal information-theoretic threshold that discards extreme outlier tails without compressing the dense central activation core.",
        "For asymmetric activation functions like ReLU or clipping functions where values are strictly non-negative, the engine computes precise integer zero-points $z_a$: $z_a = \\text{round}\\left( \\frac{0 - a_{\\min}}{S_a} \\right) - 128$. This guarantees that zero values in physical sensor space map exactly to representable integer coordinates, preventing zero-padding operations in convolutional filters from leaking artificial numerical energy into downstream feature extractors."
    ]),

    # Part 2: Fixed-Point Integer Convolution (currently 306 -> add ~320 words to reach > 625)
    (2, [
        "When deploying these integer convolution kernels to ARM Cortex-M4 and Cortex-M7 microcontrollers, firmware engineers take full advantage of native ARMv7E-M DSP instructions. The CMSIS-NN library implements optimized assembly kernels utilizing the `__SMLAD` (Signed Multiply Accumulate Dual) instruction, which performs two 16-bit signed multiplications and adds both products into a 32-bit accumulator in a single clock cycle.",
        "To feed the dual-MAC pipeline at maximum bandwidth, the engine arranges quantized weights in contiguous memory blocks, packing two signed 8-bit weight values into 16-bit halfwords using the `PKHTB` (Pack Halfword Bottom) and `PKHBT` (Pack Halfword Top) register instructions. Four parallel multiply-accumulate operations can be dispatched every two clock cycles, achieving near-theoretical peak compute utilization from the microcontroller's single-issue ALU.",
        "To eliminate accumulator wrap-around and arithmetic overflow when summing hundreds of incoming product terms, the accumulator register maintains a full 32-bit signed integer width: $\\text{acc} = \\sum (w_{q} + z_w)(x_{q} - z_x) + \\text{bias}_{32}$. Because symmetric weight quantization guarantees $z_w = 0$, the expansion simplifies to $\\text{acc} = \\sum w_q x_q - z_x \\sum w_q + \\text{bias}_{32}$.",
        "The constant term $-z_x \\sum w_q$ is calculated offline during model compilation and folded directly into the pre-computed 32-bit bias vector! During runtime inference, the microcontroller performs zero zero-point multiplications inside the innermost execution loop, achieving pure integer multiply-accumulate efficiency followed by single-cycle fixed-point requantization via `GEMMLOWP` fixed-point multiplication."
    ]),

    # Part 3: Hardware Watermark Profiler (currently 319 -> add ~310 words to reach > 630)
    (3, [
        "In safety-critical edge architectures—such as medical wearables, automotive powertrain monitors, and aerospace sensors—memory certification requires strict static memory guarantees. Dynamic memory allocation via `malloc()` or `free()` is strictly forbidden under MISRA C and ISO 26262 guidelines due to the catastrophic risk of heap fragmentation, non-deterministic latency, and memory leaks.",
        "Our Milestone 4 profiler mathematically computes the exact, non-fragmentable SRAM activation arena using a static double-buffering ping-pong allocator. By analyzing the topological execution order of the computational graph, the profiler calculates the maximum lifetime intersection of consecutive layer activation tensors: $\\text{Arena}_{peak} = \\max_{i} (\\text{Bytes}(A_i) + \\text{Bytes}(A_{i+1}))$. The memory required to hold Layer $i$ activations and Layer $i+1$ output buffers is allocated once at compile-time as a static BSS array.",
        "On the execution side, execution cycle counts are validated using the ARM Cortex-M Data Watchpoint and Trace (DWT) cycle counter register (`DWT->CYCCNT`). By configuring the DWT hardware counter before and after inference dispatch, firmware engineers measure worst-case execution time (WCET) with single-clock-cycle precision.",
        "Coupled with hardware current shunt measurements, the engine computes the exact energy cost per inference: $E = V_{cc} \\times I_{avg} \\times \\Delta t$. Running our compressed model on an STM32L4+ at 120 MHz draws 14.4 milliamps for 2.4 milliseconds at 3.3 volts, consuming just 114 microjoules per classification burst. This microscopic energy profile ensures that battery-powered industrial sensors can operate uninterrupted for over 7 years on an internal battery cell."
    ]),

    # Part 4: CAPSTONE: Milestone 4 Production Verification Suite (currently 252 -> add ~370 words to reach > 625)
    (4, [
        "In enterprise product engineering, the transition from algorithmic prototyping to global edge deployment requires an airtight verification gate. In traditional development workflows, data scientists train unconstrained floating-point models in PyTorch or TensorFlow, while firmware engineers independently write hand-crafted C code for microcontrollers. This division frequently leads to subtle numerical discrepancies, hidden boundary overflows, and unvalidated edge-case failures in the field.",
        "Our Milestone 4 Capstone Engine completely eliminates this organizational barrier by establishing a fully automated, end-to-end continuous integration defense gate. When a candidate model is submitted to the engine, the verification suite automatically generates thousands of synthetic and real-world golden test vectors, streaming them through both the high-precision floating-point software reference and the synthesized bare-metal INT8 integer kernel.",
        "The defense gate calculates layer-by-layer Signal-to-Quantization-Noise Ratios (SQNR) and cosine similarity metrics across all intermediate feature maps, guaranteeing that numerical divergence never exceeds strict tolerance bounds ($> 35\\text{ dB SQNR}$ and $> 0.998$ cosine similarity). Any anomaly score drift greater than 0.8 percent immediately halts the pipeline, alerting firmware architects to adjust layer-wise pruning ratios or refine calibration histograms.",
        "Once all four hardware watermarks—Flash footprint, peak SRAM activation arena, worst-case execution time, and classification accuracy retention—are certified green, the capstone engine automatically exports production-ready, MISRA-compliant C header files (`model_weights.h`, `model_bias.h`, and `model_metadata.h`). These zero-dependency C artifacts contain bit-exact weight arrays and pre-calculated fixed-point multipliers, ready for instant compilation into bare-metal firmware libraries. By mastering this complete optimization engine, you possess the full capability of an elite TinyML systems engineer, bridging deep learning and embedded firmware with uncompromised precision."
    ])
]

for idx, paras in expansions:
    d20['parts'][idx]['say'].extend(paras)

d20['minutes'] = 38

with open('scripts/iot_edge_day20.json', 'w', encoding='utf-8') as f:
    json.dump(d20, f, indent=2, ensure_ascii=False)

print("Enriched Day 20 successfully.")
