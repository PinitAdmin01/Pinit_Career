# scripts/topup_day35_proper.py
import json

with open('scripts/iot_sec_day35.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

p2_extra = [
    "Furthermore, the GlitchEmulationCore models non-ideal decoupling capacitor dynamics and package parasitic inductances. On a physical printed circuit board, the microcontroller is surrounded by multi-layer ceramic capacitors (MLCCs). When a high-speed crowbar transient shunts the power rail, the effective impedance seen by the silicon core is governed by the frequency-dependent equivalent series resistance (ESR) and equivalent series inductance (ESL) of these capacitors.",
    "The emulation core incorporates a second-order RLC transfer function that computes the exact ringing frequency, damping factor, and voltage overshoot following the glitch pulse. If the voltage ringing produces an inductive spike exceeding the absolute maximum voltage rating of the core (e.g., VDD > 3.6V), the analog supervisor logic trips an over-voltage protection alarm, preventing electrical overstress while still trapping the glitch attempt."
]

p3_extra = [
    "In addition to lockstep comparison and odd-parity data checking, the LockstepAndParityBus incorporates Temporal Bus Scrambling with Address Remapping. During device boot, an internal linear-feedback shift register (LFSR) seeded by the hardware True Random Number Generator generates an ephemeral 32-bit permutation mask. All address lines traversing the internal interconnect between the CPU and SRAM are XORed with this dynamic mask.",
    "Because the physical address lines carry scrambled values that change on every boot cycle, an attacker attempting to use localized electromagnetic fault injection or micro-probing cannot determine which physical wires correspond to specific sensitive memory regions. Even if an EMFI pulse manages to perturb a bit on the scrambled address bus, the resulting de-scrambled address maps to an unmapped memory region, instantly triggering an unrecoverable hard bus fault exception."
]

p4_extra = [
    "To guarantee uncompromised zeroization under all physical failure modes, the autonomous zeroization pipeline employs a Fail-Secure Hardware Latch with Redundant Power Reservoirs. The zeroization circuitry is powered by an independent on-chip storage capacitor (typically a trench-capacitor array fabricated beneath the active circuitry) that stores sufficient energy to complete the zeroization sequence even if the external power supply lines are completely severed.",
    "When an optical photodiode detects a laser strike or an active mesh wire is cut, the hardware latch fires unconditionally. The discharge transistors remain fully active for a minimum of 10,000 clock cycles, actively pulling both the true and complementary nodes of every SRAM bitcell to ground. Once zeroization completes, the controller permanently burns an irreversible eFuse tamper flag, permanently disabling the secure bootloader from ever booting again on that compromised silicon die."
]

p5_extra = [
    "Looking forward into Month 2, Milestone 7 marks the decisive conquest of Block 7: Physical Fault Injection, Glitching Attacks & Silicon Countermeasures. Over the upcoming blocks of Month 2, Course 19 will continue advancing into the deepest frontiers of hardware security: Block 8 (Days 36-40) explores Differential Power Analysis (DPA), Correlation Power Analysis (CPA), and Electromagnetic Side-Channel Cryptanalysis; Block 9 (Days 41-45) investigates Invasive Silicon Decapsulation, FIB Circuit Modification, and Optical Probing Defenses; and Block 10 (Days 46-50) conquers Post-Quantum Cryptography (PQC) and Lattice-Based Silicon Accelerators (ML-KEM / ML-DSA).",
    "By achieving 100% attack mitigation across all simulated fault vectors and certifying Grade-A+ resilience, the candidate proves that the GlitchShield platform possesses the physical tamper resilience, structural integrity, and mathematical rigor demanded by modern mission-critical edge deployments. With all tests passing and all invariants verified, Milestone 7 of Course 19 is officially certified!"
]

d['parts'][1]['say'].extend(p2_extra)
d['parts'][2]['say'].extend(p3_extra)
d['parts'][3]['say'].extend(p4_extra)
d['parts'][4]['say'].extend(p5_extra)

with open('scripts/iot_sec_day35.json', 'w', encoding='utf-8') as f:
    json.dump(d, f, indent=2)

print("Topped up Day 35!")
for i, p in enumerate(d['parts']):
    words = len(' '.join(p['say']).split())
    print(f"Part {i+1}: {words} words, {len(p['say'])} paragraphs")
