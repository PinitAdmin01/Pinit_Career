import json

with open('scripts/iot_edge_day14.json', 'r', encoding='utf-8') as f:
    d14 = json.load(f)

topups = [
    # Part 1 (index 1: currently 510, needs +80 words)
    (1, [
        "In mission-critical industrial implementations, configuring DMA peripheral transfers requires deep awareness of hardware bus arbitration and bus matrix concurrency. On advanced ARM Cortex-M microcontrollers, the Direct Memory Access controller shares the internal multi-layer AHB bus matrix with the primary CPU core and high-speed communication peripherals.",
        "If the DMA controller and the CPU core simultaneously attempt to access the exact same physical SRAM bank, hardware arbitration inserts wait states (bus stalls), degrading real-time performance. To eliminate bus contention entirely, high-performance edge architectures place the circular DMA receive buffers in a dedicated SRAM bank—such as SRAM2 or tightly-coupled memory (TCM)—while the CPU executes its INT8 quantized inference engine out of SRAM1 or DTCM. This physical memory segregation allows DMA peripheral streaming and neural network inference to execute with zero bus conflicts, ensuring clock-cycle-perfect deterministic throughput."
    ]),
    # Part 2 (index 2: currently 453, needs +140 words)
    (2, [
        "When performing fixed-point spectral analysis on embedded microcontrollers, selecting the optimal windowing function involves an explicit trade-off between spectral resolution and dynamic range dynamic range suppression. While the rectangular window provides the narrowest main lobe, its high sidelobe leakage (-13 dB) obscures weak harmonic anomaly frequencies beneath strong fundamental tones.",
        "The Hanning window attenuates sidelobes to -31 dB, making it ideal for general acoustic classification, whereas the Flat-Top or Blackman-Harris window suppresses sidelobes beyond -60 dB, which is essential for detecting sub-audible bearing defect harmonics in industrial motors. In our INT8 fixed-point pipeline, window coefficients are precomputed off-line, converted to Q15 fixed-point integers, and stored in read-only Flash. By multiplying incoming 16-bit time-domain samples with these Q15 coefficients using SIMD dual-multiply instructions, the pipeline eliminates floating-point transcendental function calls entirely, achieving studio-grade spectral decomposition in a fraction of a millisecond."
    ]),
    # Part 3 (index 3: currently 535, needs +60 words)
    (3, [
        "To validate worst-case execution time under real-world operating conditions, firmware engineers utilize hardware-based cycle counting mechanisms built directly into the silicon core. In ARM Cortex-M processors, the Data Watchpoint and Trace (DWT) unit provides a 32-bit cycle count register (`DWT->CYCCNT`) that increments on every single system clock cycle with zero measurement overhead.",
        "By reading the cycle counter immediately before and after the master kernel execution loop, the firmware captures exact elapsed cycle counts for each inference frame. If a particular frame encounters an unusually high cycle count—caused by an unexpected interrupt burst or cache miss—the master kernel logs the event to a high-watermark diagnostic register, providing irrefutable empirical evidence for safety certification."
    ]),
    # Part 4 (index 4: currently 437, needs +155 words)
    (4, [
        "The production C++ firmware synthesis also integrates comprehensive fault tolerance and graceful degradation strategies required by industrial functional safety standards such as IEC 61508 SIL-3. In remote harsh environments, electromagnetic interference (EMI) or power supply ripple can induce bit flips in volatile memory registers, commonly known as Single Event Upsets (SEUs).",
        "To guard against silent data corruption, our C++ master kernel incorporates cyclic redundancy checks (CRC-32) computed over the static weight parameters during startup and periodic background health checks. Additionally, input tensors are validated against bounded sanity ranges to detect sensor disconnections or analog saturation. If an invalid tensor is detected, the kernel immediately transitions to a failsafe default state, issues an authenticated diagnostic warning over CAN-FD or Industrial Ethernet, and prevents erroneous control actuation. This holistic engineering approach ensures that our edge AI deployment is not merely accurate in software, but completely resilient and fail-safe in silicon."
    ])
]

for idx, paras in topups:
    d14['parts'][idx]['say'].extend(paras)

with open('scripts/iot_edge_day14.json', 'w', encoding='utf-8') as f:
    json.dump(d14, f, indent=2)

print("Topup Day 14 completed.")
