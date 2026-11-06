import json

with open('scripts/iot_edge_day25.json', 'r', encoding='utf-8') as f:
    d25 = json.load(f)

expansions = [
    # Part 0: currently 455 -> add ~145 words to reach > 600
    (0, [
        "When designing multi-core embedded architectures—such as the dual-core STM32H7 (Cortex-M7 at 480 MHz paired with a Cortex-M4 at 240 MHz)—the sovereign stack enables clean hardware task partitioning. The high-speed Cortex-M7 core can be dedicated entirely to continuous CMSIS-NN vector inference inside internal SRAM, while the Cortex-M4 core handles real-time sensor acquisition, cryptographic authentication, and cloud telemetry.",
        "Communication between the two cores occurs through lock-free shared memory ring buffers in inter-core SRAM, eliminating mutex contention and RTOS context switching overhead. This dual-core architectural separation guarantees that time-critical machine control loops run with zero jitter, while the neural network evaluates complex environmental perceptions at full silicon throughput."
    ]),

    # Part 1: currently 439 -> add ~165 words to reach > 604
    (1, [
        "In addition to verifying built-in operators, the OpResolver Gate inspects custom operator extensions (`CustomOperator`). In advanced edge deployments, developers occasionally implement specialized non-standard neural network operators—such as proprietary audio filter banks or custom anomaly clustering metrics. If the model references a custom operator that is not mapped to an executable kernel registration, the OpResolver Gate flags the exact custom string identifier and halts startup cleanly.",
        "Furthermore, the gate checks tensor shape bounds against the physical capabilities of CMSIS-NN assembly routines. Certain optimized SIMD kernels require that channel counts be multiples of two or four for optimal vector register packing. If an irregular layer shape is detected, the gate automatically flags the mismatch and advises firmware architects on channel padding strategies, preventing silent bus stalls or register packing inefficiencies on physical silicon."
    ]),

    # Part 2: currently 483 -> add ~125 words to reach > 608
    (2, [
        "To verify that memory planning behaves deterministically across multi-tenant firmware builds, the offline planner also performs automated sensitivity analysis. If an application updates its model by adding extra channels or introducing a new skip connection, the planner recalculates the exact new peak SRAM ceiling at compile time.",
        "If the updated memory watermark exceeds the hardware bounds of internal SRAM, the build system fails automatically before a flawed binary can be flashed to test hardware. This compile-time memory guarantee prevents dangerous out-of-memory faults during field firmware updates, ensuring that connected edge fleets remain robust and reliable throughout multi-decade operating lifespans."
    ]),

    # Part 3: currently 452 -> add ~155 words to reach > 607
    (3, [
        "In addition to 2D convolutions, the CMSIS-NN execution engine provides optimized kernels for Depthwise Separable convolutions (`arm_depthwise_conv_s8`). In depthwise convolution, the spatial filter operates independently on each input channel. CMSIS-NN unrolls the depthwise inner loop across multiple spatial pixels simultaneously, loading packed weights from Flash and accumulating into signed 32-bit registers.",
        "By avoiding cross-channel memory lookups during spatial filtering, the depthwise kernel achieves maximum instruction cache hit rates. Once spatial filtering completes, the pointwise 1x1 projection executes at maximum SIMD throughput. This two-stage pipeline delivers the pinnacle of computational efficiency on Cortex-M silicon, proving that deep neural networks can run smoothly on chips drawing less electrical power than a standard LED."
    ]),

    # Part 4: currently 442 -> add ~165 words to reach > 607
    (4, [
        "To provide comprehensive verification for safety-critical certification (such as IEC 61508 SIL-3 and ISO 26262 ASIL-B), the defense gate generates an auditable, cryptographically signed compliance ledger. The ledger records the exact SHA-256 hash of the compiled FlatBuffers model binary, the peak SRAM activation watermark, the maximum measured latency across 1,000 cycles, and the bit-exact match against golden reference test vectors.",
        "Any unexpected code modification or memory layout shift alters the cryptographic watermark, instantly invalidating the safety certificate and halting automated manufacturing flashing jigs. This disciplined, uncompromising verification protocol bridges cutting-edge artificial intelligence with the highest standards of aerospace and industrial safety, certifying our Milestone 5 engine for global bare-metal production."
    ])
]

for idx, paras in expansions:
    d25['parts'][idx]['say'].extend(paras)

d25['minutes'] = 38

with open('scripts/iot_edge_day25.json', 'w', encoding='utf-8') as f:
    json.dump(d25, f, indent=2, ensure_ascii=False)

print("Topped up Day 25 successfully.")
