import json

with open('scripts/iot_edge_day23.json', 'r', encoding='utf-8') as f:
    d23 = json.load(f)

expansions = [
    # Part 0: Visual Wake Words (currently 422 -> add ~195 words to reach > 615)
    (0, [
        "In physical hardware implementations, feeding camera pixels into a microcontroller requires tight synchronization between the image sensor and the MCU's peripheral bus. Microcontrollers interface with ultra-low-power camera modules (such as the Omnivision OV2640 or Himax HM01B0) using a parallel Digital Video Port (DVP) or an SPI bus with hardware frame-sync signals (`VSYNC` and `HREF`).",
        "To avoid wasting CPU cycles reading pixels one by one, the camera interface utilizes Direct Memory Access (DMA) in circular double-buffer mode. As pixel bytes stream off the camera sensor, the DMA controller autonomously transfers them into a dedicated 9,216-byte input buffer in internal SRAM without interrupting the CPU.",
        "Furthermore, camera shutter physics plays a critical role in micro-vision accuracy. In low-cost rolling shutter cameras, rapid physical movement causes geometric rolling distortion, causing vertical door frames or walking humans to appear slanted.",
        "By pairing 96x96 resolution with global shutter sensors or high-frame-rate pixel binning, edge systems eliminate motion artifacts while maintaining minimal memory usage, ensuring clean feature extraction for the downstream neural network."
    ]),

    # Part 1: MobileNetV1 Architecture & Width Multiplier (currently 364 -> add ~255 words to reach > 615)
    (1, [
        "In addition to the width multiplier $\\alpha$, MobileNetV1 introduced a complementary scaling parameter: the Resolution Multiplier, denoted by $\\rho$ (rho). While $\\alpha$ scales the number of channels across all layers, $\\rho$ uniformly scales the spatial resolution of the input image and intermediate feature maps: $\\rho \\in \\{1.0, 0.85, 0.71, 0.57\\}$.",
        "Because computational Multiply-Accumulate operations scale with spatial area ($H \\times W$), applying a resolution multiplier $\\rho$ reduces total inference MACs by a factor of $\\rho^2$! By simultaneously tuning both $\\alpha$ and $\\rho$, embedded firmware engineers can explore a two-dimensional Pareto optimal frontier.",
        "For example, if an application requires higher spatial resolution to detect humans at a 10-meter distance, the engineer can increase $\\rho$ while decreasing $\\alpha$ to keep the total parameter count within 250 KB of Flash. Conversely, if high channel capacity is needed to distinguish complex textural patterns at close range, $\\alpha$ can be increased while downsampling resolution.",
        "However, firmware architects must beware of over-pruning: when $\\alpha$ drops below 0.20, channel representation becomes too narrow, causing severe quantization sensitivity during post-training INT8 conversion. Keeping $\\alpha$ at 0.25 represents the sweet spot of maximal compression and rock-solid numerical stability."
    ]),

    # Part 2: MobileNetV2 Inverted Residuals & Linear Bottlenecks (currently 386 -> add ~235 words to reach > 620)
    (2, [
        "Another brilliant mathematical refinement introduced in MobileNetV2 is the ReLU6 non-linear activation function: $\\text{ReLU6}(x) = \\min(\\max(0, x), 6)$. Why does MobileNetV2 clamp positive values at 6.0 rather than allowing unbounded linear growth like standard ReLU?",
        "In low-precision integer quantized firmware, unbounded activations are dangerous. If an outlier activation reaches an extreme value like 120.0, the uniform quantization scale factor $S$ must expand dramatically to cover that high dynamic range. This expansion dilutes the precision of the remaining 99 percent of normal activations, packing them into a tiny handful of discrete integer bins and introducing severe quantization noise.",
        "By hard-clamping activations at 6.0, ReLU6 guarantees that intermediate feature maps occupy a strictly bounded dynamic range $[0, 6.0]$. When quantized to signed 8-bit integers, each integer step corresponds to exactly $6.0 / 127 \\approx 0.0472$, preserving high numerical resolution across subtle facial gradients.",
        "Coupled with linear bottlenecks on the final projection layer, MobileNetV2 ensures that neither positive saturation nor negative zero-clamping destroys low-dimensional manifold structures, delivering robust person detection in a fraction of the silicon area."
    ]),

    # Part 3: Layer-by-Layer Activation Memory Profiling (currently 388 -> add ~230 words to reach > 615)
    (3, [
        "When examining the spatial dimensions across MobileNet layers, firmware engineers must also consider stride-2 downsampling memory boundaries. In layers where stride is 2—such as Layer 1, Layer 3, Layer 5, Layer 8, and Layer 11—the spatial height and width are halved simultaneously ($48 \\to 24$, $24 \\to 12$, $12 \\to 6$, $6 \\to 3$).",
        "During downsampling, the output feature map is four times smaller in spatial area than the input feature map ($H/2 \\times W/2 = HW/4$). Advanced memory planners exploit this spatial contraction by implementing in-place partial memory overwrites: as the convolution kernel processes the upper half of the input image, the lower half of the input buffer has not yet been read.",
        "The output tensor can begin writing its early rows directly into the freed memory space of the previous layer! This partial in-place streaming reduces the required ping-pong buffer margin even further, pushing the total SRAM activation arena down from 54 kilobytes toward an ultra-lean 36 kilobytes.",
        "Coupled with static Flash storage of quantized weights, the entire visual wake words pipeline executes with zero external memory chips, slashing bill-of-materials (BOM) cost by over three dollars per board across millions of manufactured edge units."
    ]),

    # Part 4: Production 96x96 Person Detector Simulation (currently 192 -> add ~425 words to reach > 615)
    (4, [
        "In commercial IoT product design, deploying a continuous 96x96 computer vision model introduces a vital hardware constraint: battery power and thermal budgeting. If a microcontroller runs computer vision inference 30 times a second continuously, the CPU remains at 100 percent load, drawing 15 to 25 milliamps of current and draining a standard lithium battery pack in less than two weeks.",
        "To achieve multi-year battery life, industrial micro-vision systems employ intelligent duty-cycling and hardware event triggering. In smart building thermostats and security cameras, the microcontroller remains in an ultra-low-power DeepSleep state drawing less than 2.5 microamps of quiescent current.",
        "An inexpensive, passive infrared (PIR) motion sensor or an ultra-low-power ambient light sensor monitors the room. When thermal movement is detected, the sensor generates a hardware interrupt on an external GPIO pin, waking the microcontroller in less than 50 microseconds.",
        "The camera captures a single 96x96 frame via DMA, our MobileNet Person Detector executes in just 41.5 milliseconds, and if a human presence is confirmed, the device broadcasts a secure BLE or LoRa packet before immediately returning to deep sleep. The average power consumption over time remains under 20 microamps, enabling standard AA alkaline batteries to power the device for over five continuous years.",
        "Furthermore, embedded micro-vision offers an immense societal and privacy advantage: zero raw video is ever transmitted over the internet or saved to disk. The camera pixels are processed purely in ephemeral SRAM registers and discarded in milliseconds, emitting only an anonymous, encrypted boolean status flag. This zero-privacy-risk architecture complies with GDPR and HIPAA mandates, cementing Visual Wake Words as the future of ethical, ubiquitous edge artificial intelligence."
    ])
]

for idx, paras in expansions:
    d23['parts'][idx]['say'].extend(paras)

d23['minutes'] = 38

with open('scripts/iot_edge_day23.json', 'w', encoding='utf-8') as f:
    json.dump(d23, f, indent=2, ensure_ascii=False)

print("Enriched Day 23 successfully.")
