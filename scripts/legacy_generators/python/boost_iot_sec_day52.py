# scripts/boost_iot_sec_day52.py
import re

with open("scripts/build_iot_sec_day52.py", "r", encoding="utf-8") as f:
    text = f.read()

# Part 2 booster:
p2_extra = '''        "In cryptographic engineering, Montgomery multiplication forms the mathematical foundation of side-channel protected public-key accelerators. When mapping Montgomery reduction to physical registers, hardware designers must account for intermediate bit-width expansion. Because the product of two 16-bit coefficients can reach up to 32 bits, the accumulator registers must accommodate the full dynamic range without truncation prior to the shift-by-16 division stage. By structuring the reduction as a unified MAC (Multiply-Accumulate) operation, modern Cortex-M and RISC-V cores can execute the entire sequence in constant time.",
        "Furthermore, in security certification laboratories (such as Common Criteria EAL5+ and FIPS 140-3), Montgomery reduction pipelines are subjected to differential power analysis (DPA) and electromagnetic analysis (EMA). To neutralize first-order side-channel leakage during the reduction phase, hardware architects frequently apply random additive blinding to intermediate operands or randomize the Montgomery modulus representation. Because the mathematical output remains strictly congruent modulo q, these physical blinding countermeasures preserve exact algorithmic correctness while completely decoupling power consumption from secret coefficient values."'''

# Part 3 booster:
p3_extra = '''        "When architecting the butterfly pipeline in silicon, the sequencing of memory operations requires rigorous mathematical alignment. In the decimation-in-frequency formulation, the stride between paired butterfly coefficients halves with each successive stage: from 128 coefficients in stage 1 down to 2 coefficients in stage 7. To maintain maximum memory bus saturation, the Address Generation Unit employs a counter-based bit-manipulation network that calculates both source and destination addresses in a single clock cycle without requiring dedicated division or modulo logic.",
        "In addition, modern post-quantum coprocessors implement butterfly folding techniques to minimize silicon die area. Rather than instantiating 128 physical butterfly hardware units (which would consume excessive gate count and static leakage power), practical automotive microcontrollers instantiate a small cluster of 2 or 4 high-speed pipelined butterfly engines. These engines continuously process coefficient pairs streamed from dual-port SRAM, achieving an optimal balance between execution latency, silicon footprint, and thermal dissipation.",
        "Another critical consideration is fault-injection hardening. During the execution of the 7 forward butterfly stages, an adversary employing localized laser fault injection (LFI) or clock glitching might attempt to corrupt a single intermediate butterfly calculation to induce faulty polynomial outputs for algebraic fault analysis (AFA). To detect and neutralize such attacks, the butterfly unit computes parity invariants across each addition and subtraction, immediately aborting the transform and latching a security violation if an arithmetic fault is detected."'''

# Part 4 booster:
p4_extra = '''        "The mathematical duality between the Cooley-Tukey and Gentleman-Sande butterfly configurations represents one of the most elegant triumphs of modern cryptographic signal processing. While the Cooley-Tukey butterfly applies twiddle factor multiplication after addition and subtraction, the Gentleman-Sande butterfly executes twiddle multiplication on the lower difference output. In hardware, this allows the same physical arithmetic datapath to be reconfigured between forward and inverse transform modes simply by toggling a multiplexer on the multiplier input lines.",
        "Moreover, scaling by the degree inverse n^(-1) mod q at the conclusion of the INTT requires careful consideration of numerical overflow. In fixed-point embedded ALUs, multiplying 256 coefficients by 3316 produces 32-bit products that must immediately undergo Montgomery reduction back to the 16-bit modular range [0, 3328]. By pipelining this normalization pass with the final memory write-back stage, the coprocessor completes the entire INTT transform with zero auxiliary cycles.",
        "In mission-critical embedded systems, the integrity of the recovered polynomial coefficients is validated using lightweight algebraic check-sums. Before the polynomial is released to higher-level cryptographic state machines, the hardware evaluates a deterministic zero-knowledge linear hash of the coefficient array. If memory bus noise, ionizing radiation, or intentional voltage tampering altered any coefficient during the transform, the verification engine detects the anomaly and triggers an instantaneous secure memory purge, ensuring that corrupted state is never utilized in cryptographic operations."'''

# Part 5 booster:
p5_extra = '''        "From a system-on-chip (SoC) integration perspective, the hardware NTT coprocessor must interface seamlessly with the main processor's Direct Memory Access (DMA) controller. In a typical automotive gateway or industrial PLC architecture, large polynomial matrices representing public keys and ciphertexts are transferred between main system Flash, external DDR or Octal-SPI RAM, and the coprocessor's localized dual-bank SRAM. By supporting scatter-gather DMA bursts with autonomous descriptor chains, the coprocessor can execute multi-polynomial matrix operations without interrupting the host CPU.",
        "Power dissipation profiling reveals that the dedicated hardware NTT accelerator reduces total energy consumption by over 92% compared to software execution. Because the coprocessor completes polynomial multiplications in tens of microseconds rather than milliseconds, the microcontroller can quickly return to low-power sleep modes, drastically extending battery operational lifetime in remote wireless sensor nodes and asset tracking tags.",
        "Finally, comprehensive security verification mandates that the hardware NTT coprocessor resist non-invasive side-channel attacks across its entire operating voltage and temperature envelope (-40C to +125C). By pairing constant-time Montgomery arithmetic with balanced differential logic and localized power supply decoupling capacitors, the physical silicon emits minimal electromagnetic radiation, achieving full compliance with ISO/IEC 17825 and Common Criteria post-quantum assurance requirements."'''

# Inject into p2_say:
idx2 = text.find('p2_say = [')
end_p2 = text.find('    ]', idx2)
text = text[:end_p2] + ',\n' + p2_extra + '\n' + text[end_p2:]

# Inject into p3_say:
idx3 = text.find('p3_say = [')
end_p3 = text.find('    ]', idx3)
text = text[:end_p3] + ',\n' + p3_extra + '\n' + text[end_p3:]

# Inject into p4_say:
idx4 = text.find('p4_say = [')
end_p4 = text.find('    ]', idx4)
text = text[:end_p4] + ',\n' + p4_extra + '\n' + text[end_p4:]

# Inject into p5_say:
idx5 = text.find('p5_say = [')
end_p5 = text.find('    ]', idx5)
text = text[:end_p5] + ',\n' + p5_extra + '\n' + text[end_p5:]

with open("scripts/build_iot_sec_day52.py", "w", encoding="utf-8") as f:
    f.write(text)

print("Boosted scripts/build_iot_sec_day52.py successfully!")
