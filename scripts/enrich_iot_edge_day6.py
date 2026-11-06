import json

with open('scripts/iot_edge_day6.json', 'r', encoding='utf-8') as f:
    d6 = json.load(f)

expansions = [
    # Part 0 (currently 397) -> needs +210 words
    (0, [
        "In production battery-operated deployments, the physical implications of SRAM allocation go far beyond software stability. Static RAM cells are constructed using six-transistor (6T) CMOS topologies that require continuous electrical biasing to maintain state. When an edge microcontroller leaves its ultra-low-power deep sleep mode and powers up internal SRAM banks to execute a convolutional layer, the sudden capacitive charging of internal bus lines causes instantaneous current spikes ranging from 15 to 45 milliamps.",
        "If a neural network model's intermediate activation footprint is unoptimized and sprawls haphazardly across multiple physical SRAM banks, the power management unit (PMU) is prevented from gating off unused memory banks. Conversely, by precisely compressing peak activation memory into a compact, contiguous memory footprint, you enable partial-array self-refresh and selective power-gating on modern ARM Cortex-M33 and Cortex-M55 architectures. This micro-architectural optimization slashes static leakage current by up to 60 percent during intermediate compute phases, transforming a sensor device that lasts six months into a sovereign edge appliance capable of five to ten years of autonomous battery operation."
    ]),
    # Part 1 (currently 362) -> needs +230 words
    (1, [
        "Furthermore, we must account for the spatial realities of non-linear convolutional operations within the ping-pong topology. While dense layers exhibit simple vector-matrix dimensions, 2D convolutional and depthwise-separable convolutional layers involve spatial expansion, padding strides, and channel multiplexing. When the processor executes an im2col (image-to-column) transformation to convert a 2D convolution into a high-speed matrix multiplication (GEMM) executed by CMSIS-DSP, an auxiliary column buffer is temporarily required.",
        "An unprincipled memory planner might allocate this im2col scratchpad as a third independent RAM buffer, needlessly inflating the total system memory ceiling. By contrast, a sophisticated TinyML runtime fuses the im2col scratchpad directly inside the existing inactive ping-pong buffer! Because the inactive buffer will not be read until the subsequent layer begins, its memory addresses can serve as transient scratchpad workspace for the current layer's inner convolution loop. When the layer concludes, the final activation tensor sits cleanly in the destination buffer, having utilized zero additional static memory bytes. This zero-waste buffer reuse strategy ensures that even high-dimensional audio and vibration spectrogram networks can execute comfortably within low-cost commercial silicon."
    ]),
    # Part 2 (currently 360) -> needs +230 words
    (2, [
        "To systematically master residual memory scheduling across arbitrary directed acyclic graphs (DAGs), industry-standard runtimes model the entire neural network as a 2D Geometric Bin Packing Problem. Each tensor is treated as a rigid geometric rectangle whose width equals its active temporal lifespan (from the creation layer step to the final consuming layer step), and whose height equals its physical size in bytes. The scheduling objective is to pack all rectangular tensor profiles into the minimum possible total height (the Tensor Arena watermark) without any two overlapping rectangles colliding.",
        "When residual branches spawn multiple downstream child operators—such as feature pyramid networks (FPN) or multi-head attention blocks on microcontrollers—a single tensor may possess multiple divergent lifespans. The allocator must perform Static Reference Counting: during compilation, each tensor descriptor is assigned an immutable consumer counter. As each layer operator finishes execution, the runtime decrements the source tensor's reference count. The very instant the reference count reaches zero, the memory range is immediately returned to the free allocator pool. This deterministic reference counting prevents memory leaks without incurring the non-deterministic garbage collection overheads that render managed languages like Python or Java unviable for real-time microcontrollers."
    ]),
    # Part 3 (currently 355) -> needs +235 words
    (3, [
        "In addition to vector SIMD alignment, 16-byte alignment plays an indispensable role in Direct Memory Access (DMA) transactions and multi-core cache coherency. In high-throughput industrial edge applications, raw sensor data (such as 16-bit audio from an I2S microphone or 3-axis acceleration from a high-speed SPI accelerometer) is streamed directly into the input tensor buffer of the Tensor Arena via autonomous peripheral DMA without involving the CPU core.",
        "Microcontroller DMA engines transfer data in burst beats—typically 4 beats of 32-bit words (exactly 16 bytes per burst transaction). If an input tensor buffer begins at an unaligned memory offset (e.g. 0x20000003), the DMA controller cannot perform burst transfers. It is forced to drop into single-byte transfer mode, quadrupling bus occupancy, congesting the internal AHB bus matrix, and starving concurrent high-priority peripherals. Furthermore, on advanced microcontrollers with instruction and data caches (L1 D-Cache on Cortex-M7), cache line invalidation and write-back operations operate on discrete 32-byte cache lines. Aligning all major tensor buffers to 16 or 32-byte boundaries ensures that cache maintenance instructions never flush adjacent, unrelated variables, completely eliminating subtle, intermittent data corruption bugs."
    ]),
    # Part 4 (currently 276) -> needs +315 words
    (4, [
        "As a Principal TinyML Systems Architect, your final responsibility during static memory verification is establishing the Formal Safety and Certification Baseline under international standards such as IEC 61508 (Industrial Functional Safety) or ISO 26262 (Automotive Safety Integrity Level - ASIL). In safety-critical embedded systems, dynamic memory allocation is universally outlawed because it violates the principle of deterministic timing and predictable execution states.",
        "Every single byte of SRAM utilized by the neural network must be statically mapped into the firmware binary's BSS segment at link time. The compiler and linker scripts generate a deterministic symbol map (e.g., `_tensor_arena_start` and `_tensor_arena_end`) whose physical boundaries are cryptographically hashed and verified during the bootloader's power-on self-test (POST). When a safety audit inspector inspects your firmware architecture, you present the automated Memory Manifesto generated by our auditor harness.",
        "This document proves that under 100 percent worst-case operating conditions—including simultaneous maximum interrupt nesting, maximum CAN-FD packet burst queuing, and active neural network inference—the system stack and the Tensor Arena maintain an inviolable physical buffer zone. The hardware Memory Protection Unit is formally configured to trigger an unrecoverable safety shutdown if a rogue pointer attempts to cross this boundary. By marrying mathematical memory lifespan modeling with physical hardware safety enforcement, you ensure that TinyML transitions from an experimental academic prototype into an unbreakable, sovereign industrial computing reality."
    ])
]

for idx, paras in expansions:
    d6['parts'][idx]['say'].extend(paras)

with open('scripts/iot_edge_day6.json', 'w', encoding='utf-8') as f:
    json.dump(d6, f, indent=2)

print("Enriched Day 6 successfully.")
