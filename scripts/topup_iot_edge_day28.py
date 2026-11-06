import json

with open('scripts/iot_edge_day28.json', 'r', encoding='utf-8') as f:
    d28 = json.load(f)

# Current word counts: [482, 369, 336, 353, 362] Total: 1902
# Need: [120, 230, 260, 245, 235] words to reach >= 580 in all parts

expansions = [
    # Part 0: currently 482 -> add ~125 words to reach > 607
    (0, [
        "In modern industrial economics, the true financial cost of a false alarm is staggeringly high. When an automated protection system halts an automotive assembly line or a continuous chemical catalytic reactor, restarting the production line requires hours of purge cycles, safety inspections, and recalibration procedures, easily costing upwards of fifty thousand dollars per hour in lost throughput.",
        "When false alarms occur repeatedly, human operators develop 'alarm fatigue.' Maintenance technicians begin disabling automated shutdown interlocks or ignoring edge sensor alerts entirely. When a genuine mechanical failure finally occurs, the warnings are dismissed, leading to catastrophic machine seizure. By eliminating false alarms through multi-modal physics correlation, we restore human trust in autonomous edge AI systems."
    ]),

    # Part 1: currently 369 -> add ~235 words to reach > 604
    (1, [
        "To implement this circular DMA architecture cleanly inside FreeRTOS or Zephyr RTOS, developers utilize a dedicated sensor acquisition daemon running at high interrupt priority. When the I2S audio DMA half-transfer interrupt (`DMA_IT_HT`) and full-transfer interrupt (`DMA_IT_TC`) fire, the ISR places a lightweight message into an RTOS message queue with minimal interrupt latency.",
        "Meanwhile, the SPI accelerometer driver operates using hardware double-buffering. Because SPI bus transfers occur in discrete bursts while audio streams continuously, the synchronization layer uses hardware timer timestamps to interpolate or align the discrete IMU sample packets against the continuous audio sample stream.",
        "If a clock drift occurs—for instance, if the crystal oscillator driving the audio codec runs 0.05 percent faster than the microcontroller's internal RC oscillator—the synchronizer detects the sample count deviation at the window boundary. By executing lightweight sample drop or zero-order hold sample replication, the system maintains strict phase lock without accumulating phase drift over months of unattended continuous operation."
    ]),

    # Part 2: currently 336 -> add ~265 words to reach > 601
    (2, [
        "The mathematical beauty of Kurtosis lies in its sensitivity to rare, high-amplitude impulse shocks. The fourth central moment raises deviations from the mean to the fourth power: $(x - \\mu)^4$. When a machine is running normally with smooth, continuous Gaussian vibration, extreme outliers are exceedingly rare, yielding a theoretical Kurtosis of exactly 3.0. In contrast, standard deviation only squares deviations: $(x - \\mu)^2$.",
        "When an early bearing crack forms, it produces an impulse shock that lasts for only a fraction of a millisecond every rotation. Over a 1.0-second window containing 200 samples, 195 samples remain normal, while 5 samples exhibit sharp shock spikes. Squaring these 5 spikes barely raises the overall RMS vibration, leaving standard deviation virtually unchanged! But raising those 5 spikes to the fourth power causes the Kurtosis to jump from 3.0 to 7.5, providing an unmistakable early warning signal weeks before RMS vibration reflects any damage.",
        "Similarly, for the acoustic domain, compressing 16,000 raw time-domain audio samples into 13 MFCC coefficients preserves the spectral timbre and formant envelope of metal-on-metal friction while discarding phase noise and volume fluctuations. The resulting 19-dimensional fused vector provides the neural network with clean, orthogonal, physically interpretable representations of machine health."
    ]),

    # Part 3: currently 353 -> add ~245 words to reach > 598
    (3, [
        "Let us examine how the cross-modal attention gating layer operates in fixed-point integer arithmetic on an ARM Cortex-M processor. In floating-point math, computing the sigmoid function $\\sigma(x) = \\frac{1}{1 + e^{-x}}$ involves an expensive exponential call that consumes dozens of CPU cycles. On our INT8 runtime, we replace the exponential calculation with a piece-wise linear approximation (PWL) or a 256-byte pre-computed lookup table stored in Flash memory.",
        "The cross-sensor attention gating weight $\\alpha$ is quantized to an 8-bit unsigned integer ($0 \\text{ to } 255$, representing $0.0 \\text{ to } 1.0$). When multiplying the 8-dimensional embedding vectors by $\\alpha$, the processor uses the ARM SIMD `SMUAD` (Dual 16-bit Signed Multiply) or `SMLAD` instructions, scaling the entire embedding vector in just two clock cycles.",
        "Because both sensor branches and the gating mechanism are executed sequentially within the same static Tensor Arena buffer, peak SRAM memory is bounded to under 4 Kilobytes. This deterministic memory footprint ensures that multi-modal intelligence can be integrated alongside industrial communications stacks without risking heap collisions or memory fragmentation."
    ]),

    # Part 4: currently 362 -> add ~240 words to reach > 602
    (4, [
        "The triumph of the high-speed rail multi-modal deployment demonstrates a profound systems engineering lesson: algorithmic excellence cannot compensate for flawed physical assumptions. When the engineering team initially deployed single-axis accelerometers, they possessed state-of-the-art neural networks, yet the system failed because the physical sensor was blind to the difference between a track joint and a bearing defect.",
        "By introducing an orthogonal physical sensing modality—acoustic emission—the engineers gave the neural network the multi-dimensional sensory data required to resolve physical ambiguity. In safety-critical embedded systems, true reliability is achieved at the intersection of sensor physics, deterministic signal processing, and low-latency machine learning.",
        "Today, this multi-modal axle box architecture is deployed on thousands of high-speed passenger rail carriages worldwide, protecting millions of passengers daily while operating invisibly and autonomously on edge silicon powered by harvested mechanical kinetic energy."
    ])
]

for idx, paras in expansions:
    d28['parts'][idx]['say'].extend(paras)

d28['minutes'] = 38

with open('scripts/iot_edge_day28.json', 'w', encoding='utf-8') as f:
    json.dump(d28, f, indent=2, ensure_ascii=False)

print("Enriched Day 28 successfully.")
