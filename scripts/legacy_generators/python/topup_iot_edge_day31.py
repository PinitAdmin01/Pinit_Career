import json

with open('scripts/iot_edge_day31.json', 'r', encoding='utf-8') as f:
    d31 = json.load(f)

# Current counts: [550, 452, 405, 455, 463] Total: 2325
# Need to add ~40-185 words per part to comfortably pass 580 words per part (>= 2900 total words)

expansions = [
    # Part 0: currently 550 -> add ~60 words to reach > 610
    (0, [
        "In addition, signal integrity on physical camera circuit boards demands strict adherence to controlled differential impedance and high-speed termination practices. In MIPI-CSI2 routing, differential pairs must maintain 100-Ohm differential impedance with length matching within five mils to prevent inter-pair skew from causing packet corruption.",
        "Similarly, for parallel DVP layouts, series damping resistors of 22 to 33 Ohms are inserted adjacent to the camera module on PCLK and data lines to suppress inductive ringing and transmission line reflections on fast clock edges."
    ]),

    # Part 1: currently 452 -> add ~155 words to reach > 607
    (1, [
        "To achieve maximum throughput with minimal CPU intervention, advanced microcontroller architectures utilize linked-list DMA scatter-gather descriptors. Instead of reconfiguring DMA channel registers inside an interrupt service routine on every single frame, the camera interface automatically reloads the next memory buffer descriptor directly from a descriptor chain in SRAM upon receiving the VSYNC pulse.",
        "This autonomous hardware reload reduces frame-to-frame switching latency to under 50 nanoseconds, eliminating the risk that a delayed RTOS interrupt handler will miss the start of the next video frame.",
        "Furthermore, modern embedded camera controllers incorporate hardware cropping and windowing blocks directly in the camera peripheral pipeline. If an image sensor outputs a 640x480 frame, but the downstream neural network only requires a 96x96 region-of-interest, the camera hardware can drop extraneous horizontal pixels and vertical lines on-the-fly before DMA transfers begin, reducing memory bus traffic by over 90 percent."
    ]),

    # Part 2: currently 405 -> add ~200 words to reach > 605
    (2, [
        "Beyond spatial luminance efficiency, understanding the spectral response curves of silicon photodiodes provides crucial insight into embedded optical calibration. Silicon is naturally sensitive to near-infrared (NIR) wavelengths up to 1,100 nanometers. Without an optical infrared-cut (IR-cut) filter placed over the lens, ambient infrared heat energy passes through all three color dyes, contaminating the red and green photodiodes and washing out color contrast.",
        "In industrial micro-vision systems operating under artificial factory LED or halogen lighting, camera modules incorporate an optical 650-nanometer IR-cut filter to isolate the true visible spectrum.",
        "Furthermore, because the transmission efficiency of the blue dye filter is typically lower than that of green and red dyes, the raw electrical signal from blue photodiodes is weaker. Embedded camera ISP (Image Signal Processor) pipelines apply digital Auto White Balance (AWB) multipliers to scale red and blue channel gains relative to green, restoring natural color balance before image tensors are delivered to the neural network."
    ]),

    # Part 3: currently 455 -> add ~150 words to reach > 605
    (3, [
        "In resource-constrained microcontrollers running Cortex-M processors with Helium vector extensions (ARMv8.1-M) or CMSIS-DSP, bilinear debayering can be further accelerated using packed 16-bit vector registers. Rather than processing individual pixels sequentially, vector instructions load eight adjacent 8-bit Bayer pixels simultaneously, performing vector addition and arithmetic shifts across eight color coordinates in parallel.",
        "This SIMD vectorization reduces the execution time of debayering a 96x96 image to less than 400 microseconds, consuming under 12 microjoules of electrical energy.",
        "Moreover, if the downstream neural network operates on grayscale luminance rather than color, the debayering step can be simplified into a direct 4-pixel averaging pass: $Y = \\frac{1}{4}(R + 2G + B)$. This direct luminance projection executes in a single pass, completely bypassing 3-channel RGB memory allocations."
    ]),

    # Part 4: currently 463 -> add ~145 words to reach > 608
    (4, [
        "The pharmaceutical packaging crisis highlights a fundamental axiom of embedded computer vision: software intelligence is completely dependent on physical hardware determinism. When a machine vision system fails on a factory floor, machine learning engineers often rush to retrain neural network weights or tweak confidence thresholds, failing to realize that the root cause lies in physical sensor bus timing and memory collisions.",
        "By mastering DMA ring buffers, VSYNC synchronization, and fixed-point ISP pipelines, embedded engineers bridge the gap between silicon physics and deep learning, building robust vision systems that operate flawlessly at line speeds exceeding 1,000 units per minute.",
        "This disciplined systems approach ensures that safety-critical industrial automation maintains zero false rejections and absolute regulatory compliance."
    ])
]

for idx, paras in expansions:
    d31['parts'][idx]['say'].extend(paras)

d31['minutes'] = 38

with open('scripts/iot_edge_day31.json', 'w', encoding='utf-8') as f:
    json.dump(d31, f, indent=2, ensure_ascii=False)

print("Enriched Day 31 successfully.")
