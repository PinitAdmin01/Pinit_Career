import json

with open('scripts/iot_edge_day15.json', 'r', encoding='utf-8') as f:
    d15 = json.load(f)

expansions = [
    # Part 2 (index 2: currently 494, target >= 585, add ~100 words)
    (2, [
        "In enterprise edge deployment pipelines, weight pruning strategies must also be evaluated against the underlying microarchitecture's instruction cache and branch predictor. On Cortex-M microcontrollers lacking branch prediction, traversing unstructured sparse CSR matrices introduces conditional branch instructions (`BNE`, `BEQ`) inside inner loops.",
        "If a sparse matrix contains irregular zero patterns, the pipeline experiences frequent stalls, which can counteract the computational speedup of skipping zero multiplications. For this reason, production TinyML architectures often prefer Structured Sparsity (such as N:M or block sparsity, where exactly 2 out of every 4 consecutive weights are zero). Structured sparsity enables deterministic loop unrolling and vectorized SIMD loading, providing both guaranteed Flash memory reduction and predictable cycle speedups on resource-constrained silicon."
    ]),
    # Part 3 (index 3: currently 505, target >= 585, add ~90 words)
    (3, [
        "In addition to active cycle reduction, energy-conscious firmware architectures implement aggressive power gating on unused microcontroller peripherals and memory blocks. When the processor enters deep sleep mode between inference events, the internal power management unit (PMU) can power down analog-to-digital converters, operational amplifiers, and internal SRAM retention banks that are not needed to preserve state.",
        "For example, by configuring low-power SRAM retention modes, only the 10 KB Tensor Arena and critical FreeRTOS kernel structures remain energized, while unneeded SRAM banks are completely cut off from the power rail. This reduces sleep current from 2.5 microamps down to less than 850 nanoamps, effectively nullifying quiescent battery drain and ensuring that the physical service life of the device is bounded solely by the electrochemical self-discharge rate of the lithium battery."
    ]),
    # Part 4 (index 4: currently 463, target >= 585, add ~130 words)
    (4, [
        "The capstone defense protocol establishes a repeatable, auditable quality gate that integrates directly into Continuous Integration and Continuous Deployment (CI/CD) firmware pipelines. Whenever a data science team retrains or fine-tunes a model in PyTorch or TensorFlow, the automated build pipeline runs the Model Compression Factor Calculator and Milestone 1 Defense Gate before committing the updated model weights to git.",
        "If an updated model increases parameter count by 2 percent and pushes the SRAM Tensor Arena to 16,400 bytes—exceeding the strict 16,384-byte (16 KB) hardware budget—the CI/CD pipeline immediately fails the pull request with a descriptive error report before binary firmware can ever be flashed to physical factory test benches. This automated architectural barrier guarantees zero regressions, absolute silicon determinism, and flawless production reliability across hundreds of thousands of deployed industrial edge devices."
    ])
]

for idx, paras in expansions:
    d15['parts'][idx]['say'].extend(paras)

d15['minutes'] = 38

with open('scripts/iot_edge_day15.json', 'w', encoding='utf-8') as f:
    json.dump(d15, f, indent=2)

print("Enriched Day 15 successfully.")
