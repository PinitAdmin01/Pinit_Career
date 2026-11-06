# scripts/boost_iot_sec_day34.py
import json

def boost_day34():
    with open('scripts/iot_sec_day34.json', 'r', encoding='utf-8') as f:
        d = json.load(f)

    p1_add = [
        "In deep-submicron analog design, the implementation of a high-speed negative dV/dt monitor requires careful balancing between sensitivity and false-alarm immunity. If the differentiator capacitance is oversized or the comparator threshold is set too aggressively, normal switching noise from heavy CPU workloads (such as simultaneous execution of vector arithmetic or activation of all radio transmitters) can induce transient supply drops that falsely trigger security alarms, resulting in spurious device resets.",
        "To achieve false-alarm immunity, modern secure microcontrollers implement Adaptive Dual-Threshold Voltage Supervisors. The supervisor features two parallel comparator stages: Stage 1 evaluates the instantaneous rate of change (dV/dt), while Stage 2 evaluates the absolute voltage depth (V_drop). A security alarm is asserted if and only if both conditions are met simultaneously: the voltage drop must occur faster than 0.5 V/ns AND the supply voltage must fall below an absolute safety limit (e.g., VDD < 75% of nominal).",
        "Additionally, the analog comparator incorporates Auto-Zeroing and Dynamic Offset Cancellation. Over time, thermal drift and silicon aging cause transistor threshold voltages to shift slightly, which could alter the calibrated dV/dt trip point. The auto-zeroing circuit periodically disconnects the comparator inputs during idle clock cycles, samples its internal offset voltage onto a storage capacitor, and subtracts this offset during active monitoring. This ensures that the glitch detection threshold remains rock-solid within +/- 2% accuracy across the entire 15-year industrial operating lifespan."
    ]

    p2_add = [
        "When designing Dual-Core Lockstep (DCLS) architectures for high-security microcontrollers, silicon architects must also solve the challenge of Split-Lock Mode and Asynchronous Interrupt Handling. In certain automotive safety processors (such as ARM Cortex-R5F or Cortex-R52 clusters), the dual cores can be dynamically configured between 'Lockstep Mode' (for SIL-3 / ASIL-D safety and high-assurance cryptographic operations) and 'Split Mode' (where the two cores operate independently as an SMP dual-core cluster to achieve maximum application throughput).",
        "However, in high-security applications, dynamic switching between split and lockstep modes presents a severe vulnerability: an attacker who compromises an unprivileged thread could command the hardware to enter Split Mode, disabling the lockstep comparator and leaving the system vulnerable to fault injection. Consequently, in secure IoT microcontrollers, the lockstep configuration is irreversibly locked in hardware via eFuse lifecycle registers at factory provisioning. Once programmed into Lockstep Mode, hardware disables the split-mode control registers permanently.",
        "Furthermore, managing asynchronous external interrupts in staggered lockstep requires specialized cycle alignment hardware. If an external GPIO interrupt or timer tick strikes the Primary Core at cycle N, the interrupt cannot be delivered immediately to the Shadow Core, which is still at cycle N-2. The interrupt controller includes an exact FIFO delay buffer that stores the incoming interrupt vector and delivers it to the Shadow Core exactly 2 cycles later, ensuring that both cores take the interrupt branch at the identical instruction boundary and maintain cycle-accurate synchrony."
    ]

    p3_add = [
        "In modern hardware cryptographic accelerators, error detection must extend beyond simple parity bits to cover complex Galois Field (GF) arithmetic. In AES-GCM or ChaCha20-Poly1305, an attacker targeting the Galois Hash (GHASH) multiplier with localized EMFI can induce a chosen-ciphertext fault that reveals the internal authentication hash subkey (H). Simple parity cannot detect faults that flip an even number of bits (such as 2 or 4 simultaneous bit-flips caused by a focused laser beam).",
        "To defeat multi-bit physical fault injection, high-assurance cryptographic engines implement Non-Linear Residue Checking and Invariant Cryptographic Redundancy. For 32-bit and 64-bit datapaths, the datapath computes a non-linear arithmetic checksum modulo a small prime number (such as Modulo 3 or Modulo 7). In Modulo-3 arithmetic, any single-bit flip changes the residue by +1 or -1, while double-bit flips in adjacent wires change the residue by +1, -1, or +2. None of these changes evaluate to 0 modulo 3.",
        "Whenever an arithmetic operation is performed (e.g., C = A + B), an auxiliary hardware unit computes the residue: Residue(C) must strictly equal (Residue(A) + Residue(B)) mod 3. If a laser strike or clock glitch perturbs the internal adder logic, the residue check fails with greater than 99.9% probability across arbitrary multi-bit fault patterns. The engine aborts the cipher operation instantly, suppressing the emission of corrupted ciphertext and completely defeating Differential Fault Analysis."
    ]

    p4_add = [
        "The physical layout of the Autonomous Hardware Zeroization Controller is subject to rigorous physical tamper protection rules under FIPS 140-3 Level 4 and Common Criteria AVA_VAN.5. If the zeroization control lines (the wires that command pull-down transistors to discharge key SRAM) are exposed on upper metal layers, a skilled adversary using a focused ion beam (FIB) could theoretically cut the zeroization trace before triggering a physical tamper sensor, disabling the self-destruct mechanism.",
        "To neutralize FIB micro-probing attacks, secure silicon implements Active-Low Distributed Zeroization Rails routed exclusively on the lowest, most buried metal layers (Metal 1 and Metal 2), directly beneath dense active shield meshes. In an active-low architecture, the zeroization signal is asserted when the control wire is pulled low (0V). The pull-down transistors connected to the key SRAM cells have their gates held high by a continuous dynamic charge pump.",
        "If an attacker attempts to cut the zeroization trace with a focused ion beam or laser, the cut severs the holding charge, causing the line to float to ground. The floating line immediately turns on the discharge pull-down transistors, triggering autonomous key zeroization! This 'fail-secure' architecture ensures that physical destruction of the security circuitry achieves the exact same outcome as a sensor trip: total, irreversible destruction of all cryptographic assets within picoseconds."
    ]

    p5_add = [
        "In modern automated hardware validation pipelines, the Hardware Glitch Verification Suite acts as the automated gatekeeper during post-silicon characterization. When new engineering samples arrive from the semiconductor fabrication foundry, automated automated test equipment (ATE) benches subject the packaged devices to thousands of hours of accelerated physical fault injection testing.",
        "The automated test harness interfaces with robotic XYZ micromanipulators, programmable laser sources, crowbar pulse generators, and temperature chambers. The suite executes automated stress matrix sweeps, monitoring the hardware detection subsystems under extreme operational conditions: high voltage (+10% VDD), low voltage (-10% VDD), maximum operating frequency (overclocked by 20%), and extreme temperatures (-40 C to +125 C).",
        "To achieve formal certification for mission-critical industrial edge deployment, the microcontroller must pass the verification suite with a zero-tolerance standard: exactly 0 undetected faults across a minimum of 1,000,000 injected fault attempts. Every single fault must either be absorbed by hardware decoupling, trapped by lockstep/parity monitors, or intercepted by analog supervisors triggering autonomous zeroization.",
        "With Day 34 successfully engineered and verified, the silicon hardware detection fabric is complete. Tomorrow, on Day 35, we bring together all voltage, clock, electromagnetic, optical, and hardware detection mechanisms into the grand capstone milestone of Month 2 Block 7: Milestone 7 — The GlitchShield Silicon Fault-Injection Resilience Engine."
    ]

    d['parts'][0]['say'].extend(p1_add)
    d['parts'][1]['say'].extend(p2_add)
    d['parts'][2]['say'].extend(p3_add)
    d['parts'][3]['say'].extend(p4_add)
    d['parts'][4]['say'].extend(p5_add)

    with open('scripts/iot_sec_day34.json', 'w', encoding='utf-8') as f:
        json.dump(d, f, indent=2)

    print("Day 34 boosted successfully!")

if __name__ == '__main__':
    boost_day34()
