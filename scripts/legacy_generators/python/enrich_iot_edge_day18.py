import json

with open('scripts/iot_edge_day18.json', 'r', encoding='utf-8') as f:
    d18 = json.load(f)

expansions = [
    # Part 0 (currently 488 -> add ~115 words to reach > 600)
    (0, [
        "In production battery-operated edge deployments, the physical implications of a sovereign zero-heap engine extend directly to thermal management and silicon durability. When an embedded processor executes instructions out of internal Flash and accesses internal SRAM, electrical energy is dissipated as heat within the microcontroller's tiny silicon die.",
        "In harsh industrial environments—such as sealed explosive gas enclosures (ATEX/IECEx certified) or deep underground mining drills—ambient temperatures can reach 85 to 105 degrees Celsius, leaving minimal thermal margin before the silicon junctions exceed their 125-degree thermal damage threshold. By physically eliminating entire channels rather than sparse zero-skipping loops, the microcontroller operates with continuous linear instruction flow, avoiding pipeline flushes that consume excessive switching current."
    ]),
    # Part 1 (currently 365 -> add ~235 words to reach > 600)
    (1, [
        "To appreciate the mathematical depth of structured channel pruning, we must also examine how pruning interacts with batch normalization folding and multi-branch architectures like residual skip connections. In modern convolutional networks, convolutional layers are almost universally followed by Batch Normalization (BatchNorm) layers that normalize feature map channel distributions.",
        "When preparing a model for microcontroller deployment, the batch normalization parameters (running mean $\\mu$, running variance $\\sigma^2$, scale $\\gamma$, and bias $\\beta$) are mathematically folded directly into the convolutional filter weights: $W_{folded} = W \\times \\frac{\\gamma}{\\sqrt{\\sigma^2 + \\epsilon}}$. If a filter has an exceptionally small learned $\\gamma$ scaling factor in BatchNorm, its entire output channel will be attenuated toward zero during inference.",
        "This architectural coupling provides an alternative, highly principled pruning metric known as BatchNorm Scale Pruning (Network Slimming). By imposing an L1-regularization penalty on the BatchNorm $\\gamma$ scaling factors during training, the network is naturally driven toward channel sparsity: non-informative channels develop $\\gamma \\approx 0$, while vital feature extractors retain large $\\gamma$ values. Pruning channels with the smallest $\\gamma$ values guarantees that we excise filters whose contribution has already been suppressed by the network's own learned normalization parameters."
    ]),
    # Part 2 (currently 366 -> add ~235 words to reach > 600)
    (2, [
        "In addition to parameter count reduction and FLOP savings, the Lottery Ticket sub-networks discovered through iterative pruning demonstrate remarkable transfer learning and domain generalization properties. In industrial condition monitoring fleets, mechanical equipment exhibits significant domain drift: a centrifugal pump operating at 1,800 RPM in a Texas petrochemical plant exhibits different acoustic harmonics than an identical pump operating at 1,500 RPM in a Norwegian subsea pumping station.",
        "If an unpruned, overparameterized model is fine-tuned on local subsea sensor data, its excess parameter capacity easily overfits to high-frequency ambient flow noise, destroying its ability to detect genuine mechanical bearing faults. A streamlined, iteratively pruned winning ticket model, by contrast, has been stripped of all redundant capacity. Its remaining parameters represent compact, fundamental physical feature representations: shaft rotational harmonics, bearing ball-pass frequencies, and motor stator electromagnetic poles.",
        "Because the pruned sub-network cannot memorize noise, it generalizes with exceptional robustness across varying machine speeds, load profiles, and ambient temperatures, achieving significantly lower false positive alarm rates across industrial fleets."
    ]),
    # Part 3 (currently 373 -> add ~230 words to reach > 600)
    (3, [
        "When examining the spatial layout of the Tensor Arena, we see that structured channel pruning also simplifies Memory Protection Unit (MPU) configuration. In high-reliability software architectures, the microcontroller's hardware MPU is configured to enforce strict read and write permissions on every memory region. For example, the code and constant weights residing in Flash memory are marked as Read-Only and Execute-Never for data, preventing buggy firmware from accidentally writing over model weights.",
        "Within the SRAM Tensor Arena, the MPU can be configured to monitor the boundaries of Buffer A and Buffer B independently. By programming MPU sub-region disable bits or setting hardware watchpoints on the guard band separating the two buffers, the microcontroller can automatically detect whether an unrolled loop or stray pointer inside a custom operator attempts to write past the allocated boundary of the active buffer.",
        "By cutting the channel depth from 64 to 32, the required buffer size shrinks from 10 kilobytes to 5 kilobytes. This leaves ample SRAM headroom to insert wide hardware MPU guard bands between the two ping-pong buffers, enabling instantaneous safety isolation before any errant pointer can corrupt adjacent operating system stacks."
    ]),
    # Part 4 (currently 216 -> add ~385 words to reach > 600)
    (4, [
        "In enterprise continuous integration and deployment pipelines, the Structured Pruning Capstone Engine operates as an automated gatekeeper. Before any model binary is committed to the production firmware repository, the automated pipeline runs full-stack silicon regression profiling across simulated target microcontroller architectures.",
        "The automated harness validates four non-negotiable deployment criteria: First, Flash Budget Margin: proving that the pruned INT8 binary occupies less than 60 percent of available on-chip Flash memory, leaving ample room for bootloader failover partitions and network stacks. Second, SRAM Arena Boundary: proving that peak activation double-buffering leaves at least 30 percent free SRAM for operating system task stacks and peripheral DMA ring buffers.",
        "Third, WCET Real-Time Schedulability: demonstrating that worst-case execution time on native CMSIS-NN SIMD instruction pipelines remains strictly below 10 milliseconds at 80 MHz, easily satisfying the 100-millisecond physical sensor window period. Fourth, Golden Model Determinism: proving that the pruned model's classification output across a 1,000-sample industrial validation test bench achieves less than 0.2 percent divergence from the original floating-point baseline.",
        "When all four verification gates report GREEN, the engine signs the firmware binary with an elliptic curve digital signature (ECDSA-P256) and generates a comprehensive, auditable PDF compliance certificate for regulatory bodies. This rigorous, end-to-end engineering discipline ensures that our TinyML edge deployments are not only highly compressed, but mathematically bulletproof and certified for decades of autonomous field operation."
    ])
]

for idx, paras in expansions:
    d18['parts'][idx]['say'].extend(paras)

d18['minutes'] = 38

with open('scripts/iot_edge_day18.json', 'w', encoding='utf-8') as f:
    json.dump(d18, f, indent=2)

print("Enriched Day 18 successfully.")
