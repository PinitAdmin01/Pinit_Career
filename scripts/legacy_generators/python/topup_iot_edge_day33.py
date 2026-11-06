import json

with open('scripts/iot_edge_day33.json', 'r', encoding='utf-8') as f:
    d33 = json.load(f)

# Current counts: [445, 356, 315, 420, 333] Total: 1869
# Need to add ~150-280 words per part to comfortably exceed 580 words per part (>= 2900 total words)

expansions = [
    # Part 0: currently 445 -> add ~170 words to reach > 615
    (0, [
        "In addition, memory bandwidth saturation is another hidden trap of full-frame allocations. On an ARM Cortex-M processor, internal SRAM is typically connected via 32-bit AHB bus matrices. When a camera DMA controller writes a 300 Kilobyte frame while the CPU reads that same memory to resize it, bus contention spikes dramatically.",
        "The CPU core experiences frequent bus stalls, waiting for the DMA controller to release the internal bus arbiter. This bus contention degrades real-time deterministic performance across all concurrent firmware tasks, including high-priority motor control loops and time-critical communication stacks.",
        "By restricting camera memory traffic to streaming line buffers, bus contention is reduced to microscopic bursts. The DMA controller transfers a single scanline and releases the bus, allowing the CPU to run with zero pipeline stalls and ensuring that hard real-time safety invariants are rigorously upheld."
    ]),

    # Part 1: currently 356 -> add ~260 words to reach > 616
    (1, [
        "To synchronize the rolling line buffers seamlessly with the physical camera hardware, firmware engineers configure the microcontroller's Direct Memory Access controller in circular double-buffer mode. The DMA peripheral is programmed with two distinct memory destination addresses: `LineBuffer[0]` and `LineBuffer[1]`.",
        "When the camera asserts the Horizontal Reference ($HREF$) strobe, the DMA controller transfers the active pixels of that scanline into the first buffer. As soon as the transfer completes, the DMA controller automatically switches its internal destination pointer to the second buffer and asserts a Half-Transfer or Transfer-Complete interrupt (`DMA_IT_TC`).",
        "Inside the line-complete interrupt service routine, the firmware toggles an atomic synchronization flag. The main application thread, waiting on an RTOS task notification or direct semaphore, immediately unblocks and executes horizontal bilinear scaling across the two active line buffers.",
        "Because the camera sensor incorporates a physical horizontal blanking interval between consecutive scanlines (typically lasting 10 to 15 microseconds), the CPU has a dedicated temporal window to execute interpolation before the camera begins transmitting the subsequent row. This hardware-synchronized cadence guarantees that neither line buffer is ever overwritten while the interpolation engine is actively reading its contents."
    ]),

    # Part 2: currently 315 -> add ~300 words to reach > 615
    (2, [
        "The mathematical precision of Q16.16 fixed-point arithmetic is essential for preventing visual artifacts known as 'pixel swimming' or spatial jitter in video streams. When an image downscaler operates using low-precision integer approximations (such as 8-bit integer truncation), fractional coordinate errors accumulate across horizontal scanlines.",
        "As an object moves smoothly across the camera's field of view, this rounding error causes the interpolated pixel boundaries to jump back and forth by a full pixel between adjacent frames. When fed into a convolutional neural network, this spatial jitter degrades feature extraction filters, causing confidence scores to fluctuate wildly.",
        "With Q16.16 representation, the fractional coordinate precision is $\\frac{1}{65,536} = 0.00001525$! This means coordinate tracking is accurate to within 15 micro-pixels! Over a 640-pixel scanline, the maximum cumulative coordinate drift is mathematically bounded to less than 0.001 pixels, completely imperceptible to neural network filters.",
        "Furthermore, by structuring the fixed-point inner loop to use 32-bit registers, the algorithm exploits ARM Cortex-M SIMD instructions—such as `SMLAD` (Dual 16-bit Signed Multiply with 32-bit Accumulate) and `PKHBT` (Pack Halfword). These assembly instructions allow two adjacent pixels to be multiplied, blended, and accumulated in a single CPU clock cycle, delivering unmatched computational throughput on bare silicon."
    ]),

    # Part 3: currently 420 -> add ~195 words to reach > 615
    (3, [
        "The logistics scanner incident demonstrates a fundamental principle of mission-critical embedded software: dynamic heap memory allocation (`malloc`, `free`, `new`) is an existential hazard in long-running systems. While dynamic memory management is convenient in high-level desktop programming, embedded microcontrollers lack virtual memory management units (MMU) and automatic background garbage collectors.",
        "Over days or weeks of continuous runtime, small memory allocations of varying lifetimes inevitably create uncoalesced holes throughout the heap. Even if the total free heap memory appears large, the largest single contiguous block shrinks relentlessly. When a burst of high-throughput traffic demands a large allocation, the system panics and aborts.",
        "In safety-critical automotive, medical, and aerospace engineering (governed by standards like MISRA-C and DO-178C), dynamic heap allocation is strictly prohibited. By allocating the rolling line buffers as static global arrays in the `.bss` segment, memory addresses are resolved at compile time by the linker. The system is immune to fragmentation, guaranteeing 100 percent operational determinism throughout decades of uninterrupted field service."
    ]),

    # Part 4: currently 333 -> add ~280 words to reach > 613
    (4, [
        "To manage multi-tile results efficiently, the patch-based vision processor implements a spatial Non-Maximum Suppression and coordinate fusion gate. When a microscopic defect—such as a solder bridge or hairline PCB crack—lies directly on the boundary between two adjacent tiles, both tiles may detect the defect within their overlapping margins.",
        "Because both detections report global coordinates within a Euclidean distance smaller than the physical defect diameter, the fusion layer automatically merges the candidate coordinates into a single unified defect record, computing the confidence-weighted centroid position.",
        "Furthermore, in edge inspection applications where defects are rare, the system can deploy Tiered Hierarchical Processing: First, the streaming line-buffer downscaler runs a low-resolution $96 \\times 96$ global FOMO model to detect regions of interest (ROI) across the entire PCB in 18 milliseconds. If a suspicious anomaly is detected in the upper-right quadrant, the system selectively triggers high-resolution patch-based inspection exclusively over that specific quadrant!",
        "This hierarchical approach combines the speed of global downscaling with the microscopic precision of patch processing, maintaining 30 FPS throughput while catching defects smaller than the head of a pin."
    ])
]

for idx, paras in expansions:
    d33['parts'][idx]['say'].extend(paras)

d33['minutes'] = 38

with open('scripts/iot_edge_day33.json', 'w', encoding='utf-8') as f:
    json.dump(d33, f, indent=2, ensure_ascii=False)

print("Enriched Day 33 successfully with 5 parts.")
