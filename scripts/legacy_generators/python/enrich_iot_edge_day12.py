import json

with open('scripts/iot_edge_day12.json', 'r', encoding='utf-8') as f:
    d12 = json.load(f)

expansions = [
    # Part 0 (353 words) -> needs +265 words (target >= 618)
    (0, [
        "In enterprise Internet of Things deployments, output dequantization also forms the contract boundary between localized embedded firmware and remote enterprise cloud platforms. When an edge appliance communicates over low-bandwidth cellular LPWAN (such as NB-IoT or LTE-M) or satellite links, transmitting raw high-frequency sensor streams (e.g., streaming 10,000 samples of 16-bit vibration data every second) would consume gigabytes of data and cost thousands of dollars per device per month in cellular data roaming fees.",
        "Instead, the localized TinyML engine continuously analyzes the raw high-frequency telemetry in-place within internal SRAM, reducing thousands of data points into a single high-level inference output. Dequantizing this output into standardized engineering units (such as IEEE 754 floating-point fault probabilities or ISO vibration severity classes) allows the firmware to transmit a tiny 12-byte payload only when significant events occur or on an hourly heartbeat schedule. This edge-to-cloud architectural synergy slashes wireless bandwidth consumption by over 99.9 percent while providing real-time local autonomous protection that functions flawlessly even during complete cellular network blackouts."
    ]),
    # Part 1 (300 words) -> needs +318 words (target >= 618)
    (1, [
        "To achieve maximum execution speed when evaluating Softmax on microcontrollers without hardware FPUs (such as ARM Cortex-M0+ or low-cost RISC-V cores), engineers frequently deploy Fixed-Point Integer Softmax approximations. Instead of invoking the expensive mathematical exponential function `expf()`, which relies on Taylor series polynomial expansion and software division, the firmware pre-calculates an integer Look-Up Table (LUT) or applies a piecewise linear polynomial approximation.",
        "Because the shifted logit differences $(q_i - q_{max})$ are negative integers bounded within a narrow range (typically $0$ down to $-30$, since any difference below $-30$ produces an exponent so close to zero that its contribution is mathematically negligible), a 32-entry uint16 lookup table fits inside 64 bytes of Flash memory. When the processor evaluates the Softmax layer, it uses the integer difference as an index into this Flash LUT, accumulates the 16-bit integer values into a 32-bit register, and normalizes the output using a fast integer reciprocal multiplier. This fixed-point LUT Softmax executes in less than 50 clock cycles across four classes, eliminating floating-point instructions entirely."
    ]),
    # Part 2 (315 words) -> needs +305 words (target >= 618)
    (2, [
        "In addition to 2D convolutions, the CMSIS-NN library applies dual-MAC optimization to Depthwise-Separable Convolutions and Fully-Connected Dense layers. In depthwise convolutions (`arm_depthwise_conv_s8`), each spatial kernel filters only a single input channel, which alters memory access patterns compared to standard convolutions. Instead of loading weights across multiple input channels, CMSIS-NN rearranges the input feature maps using an optimized `im2col` scratchpad buffer inside the Tensor Arena.",
        "By structuring the input pixels into contiguous memory blocks, the CPU loads consecutive 8-bit activations directly into 32-bit registers, ensuring that memory bus bandwidth is utilized at 100 percent efficiency. On advanced Cortex-M55 and Cortex-M85 microcontrollers featuring the ARM Helium M-Profile Vector Extension (MVE), CMSIS-NN elevates performance even further by replacing 32-bit `SMLAD` instructions with 128-bit vector arithmetic instructions (`VMLADAV.S8`). Helium vector registers process sixteen 8-bit multiply-accumulate operations in a single cycle, achieving up to 15x acceleration over standard reference C++ code and establishing a new benchmark for embedded TinyML throughput."
    ]),
    # Part 3 (306 words) -> needs +315 words (target >= 618)
    (3, [
        "When designing high-throughput DSP signal chains that combine traditional filtering with neural network inference, cross-bank register management is a critical architectural consideration. In modern ARM Cortex-M microcontrollers, the processor core features two physically distinct register files: the General-Purpose Register File (comprising 13 general-purpose 32-bit registers $R_0$ through $R_{12}$, plus SP, LR, and PC) and the Floating-Point / Vector Register File (comprising 32 single-precision 32-bit registers $S_0$ through $S_{31}$, which can also be addressed as 16 double-precision 64-bit registers $D_0$ through $D_{15}$).",
        "Moving data between these two register files requires explicit coprocessor instructions (`VMOV`). While a single `VMOV` instruction takes only 1 to 2 clock cycles, the hidden cost lies in instruction pipeline synchronization. When a floating-point instruction follows a `VMOV`, the hardware must wait for the integer pipeline to commit its write-back before the floating-point execution unit can decode the operand. In an inner loop executing tens of thousands of output rescaling iterations, these subtle pipeline stalls accumulate into thousands of wasted clock cycles. Pure fixed-point integer rescaling confines the entire execution graph to the general-purpose integer registers, eliminating pipeline synchronization bubbles and maximizing instructions-per-clock (IPC) efficiency."
    ]),
    # Part 4 (296 words) -> needs +325 words (target >= 618)
    (4, [
        "In safety-critical cyber-physical installations—such as automated emergency braking in commercial vehicles or pressure relief valves in chemical refining—the Actuator Safety Gate must also integrate with the microcontroller's hardware Watchdog Timer (WDT) and Fail-Safe Output (FSO) hardware circuits. In the event of a software deadlock, power glitch, or firmware freeze, the hardware watchdog must automatically force all actuator drive pins into a de-energized, fail-safe quiescent state.",
        "Furthermore, modern functional safety standards (such as ISO 26262 ASIL-D or IEC 61508 SIL-3) mandate Dual-Channel Architecture with Cross-Checking (1oo2 or 2oo2 voting). In a 1oo2 safety architecture, two independent microcontroller cores run the quantized inference pipeline in parallel. Both cores must independently evaluate the sensor stream, dequantize the anomaly logits, apply hysteresis persistence, and agree on the emergency shutdown command before the hardware actuator relay is energized. If one core experiences an internal bit-flip or memory fault, the cross-channel comparator detects the discrepancy within microseconds and trips a safe hardware fault, ensuring that neither neural network anomalies nor silicon hardware defects can ever compromise operational safety."
    ])
]

for idx, paras in expansions:
    d12['parts'][idx]['say'].extend(paras)

with open('scripts/iot_edge_day12.json', 'w', encoding='utf-8') as f:
    json.dump(d12, f, indent=2)

print("Enriched Day 12 successfully.")
