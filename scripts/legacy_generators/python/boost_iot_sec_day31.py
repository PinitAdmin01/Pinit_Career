# scripts/boost_iot_sec_day31.py
import json

def boost_day31():
    with open('scripts/iot_sec_day31.json', 'r', encoding='utf-8') as f:
        d = json.load(f)

    p1_add = [
        "In physical semiconductor characterization, the relationship between supply voltage and propagation delay is further complicated by transistor scaling down to deep sub-micron nodes (such as 28nm, 16nm FinFET, and below). In older planar CMOS technologies (e.g., 180nm or 90nm), the alpha index in the Alpha-Power Law delay model is approximately 2.0 (quadratic dependence on gate overdrive). In advanced FinFET nodes, velocity saturation and carrier mobility degradation reduce alpha to between 1.1 and 1.3.",
        "However, sub-micron nodes exhibit severe threshold voltage variability due to Random Dopant Fluctuation (RDF). When VDD drops close to Vth during a voltage glitch, RDF causes neighboring logic gates on the same silicon die to slow down at dramatically different rates. An arithmetic carry chain might slow down by a factor of 8x while the adjacent clock distribution tree slows down by only 4x. This differential delay mismatch destroys the balanced timing constraints engineered by static timing analysis (STA) tools.",
        "Furthermore, temperature plays an insidious compounding role in voltage glitching susceptibility. In conventional silicon operating ranges, higher temperatures reduce carrier mobility, slightly increasing propagation delay. But in deep under-voltage regimes (sub-threshold or near-threshold computing), temperature inversion occurs: at high temperatures, the thermal activation of carriers actually lowers the effective threshold voltage, partially offsetting the delay increase. Consequently, hardware penetration testers precisely characterize the target microcontroller across a thermal chamber (-20 C to +85 C) to identify the optimal temperature window where the glitch injection margin is widest."
    ]

    p2_add = [
        "When constructing an offensive crowbar fault-injection testbench, the physical layout of the printed circuit board (PCB) and the parasitic inductances of component leads become the primary engineering obstacles. A 10-nanosecond pulse carries frequency components well into the hundreds of megahertz (RF domain). At these frequencies, even a 5-millimeter trace of copper on a PCB exhibits approximately 5 nanohenries of parasitic inductance (L_trace).",
        "According to Faraday's law of induction, V = L * (di/dt). When the crowbar MOSFET switches on, attempting to sink 20 amperes in 1 nanosecond (di/dt = 20 * 10^9 A/s), a parasitic inductance of just 5 nanohenries produces an inductive voltage bounce of V = 5 * 10^-9 * 20 * 10^9 = 100 volts! This inductive spike can destroy the crowbar transistor or cause unpredictable ringing that oscillates across the VDD rail instead of producing a flat, clean voltage drop.",
        "To achieve a deterministic, square under-voltage pulse, hardware researchers replace long copper leads with ultra-low-inductance surface-mount component (SMD) packages (such as DirectFET or PowerPAK) placed directly adjacent to the microcontroller's decoupling capacitor pads. In advanced penetration testing labs, the decoupling capacitors are physically desoldered using hot-air rework stations, or replaced with high-frequency RF transmission line stubs terminated with 50-ohm characteristic impedance. This minimizes parasitic inductance and allows the crowbar shunt to control the silicon die voltage with sub-nanosecond precision."
    ]

    p3_add = [
        "To visualize the microarchitectural impact of an instruction skip, consider how an ARM Cortex-M processor executes an iterative cryptographic loop, such as the 10 rounds of AES-128 or the 64 rounds of SHA-256. The core loop in assembly consists of a loop counter decrement ('SUBS r3, r3, #1') followed by a conditional branch ('BNE aes_round_loop'). The security of AES depends entirely on completing all 10 rounds to achieve full diffusion and confusion.",
        "If a voltage glitch strikes the loop counter decrement instruction during Round 1, forcing the register to corrupt or causing the processor to skip the subtraction, the loop counter might prematurely equal zero or trigger an early exit branch. If the processor exits the AES algorithm after only 1 or 2 rounds, the ciphertext emitted on the output pins is essentially a linear transformation of the plaintext and the initial round key.",
        "This vulnerability forms the foundation of Differential Fault Analysis (DFA). In DFA, an attacker captures one authentic ciphertext block and one glitched ciphertext block generated from the same plaintext. By comparing the differences between the correct and glitched outputs, the attacker solves a small system of linear equations that directly reveals the 128-bit master encryption key within minutes! What took centuries of supercomputer brute-force to crack mathematically is completely broken in physical hardware by injecting a single 5-nanosecond voltage transient during round 9 or 10 of the encryption process."
    ]

    p4_add = [
        "Beyond dual-branching and canary invariants, advanced software hardening incorporates Variable Loop Unrolling and Instruction-Level Randomization. In standard compiler optimization (-O2 or -O3), loops are unrolled to eliminate branch overhead, producing long repetitive sequences of identical assembly instructions. However, from a physical fault injection perspective, deterministic unrolled loops provide an attacker with multiple identical, predictable targets for clock and voltage glitching.",
        "Hardened cryptographic libraries (such as those certified under PSA Certified Level 3 or Common Criteria EAL5+) implement randomized execution orders. For example, during an AES S-Box lookup or byte substitution phase across the 16 state bytes, the order in which the 16 bytes are processed is determined by an ephemeral pseudo-random permutation generated at runtime. Because the physical time offset for any specific byte operation is completely non-deterministic, an attacker attempting to glitch a specific byte substitution cannot determine when to trigger the crowbar pulse.",
        "Additionally, critical security routines enforce Register Redundancy with Complementary Variable Storage. Every critical variable (such as the device lifecycle status or authentication flag) is stored simultaneously in two separate CPU registers: Register A holds the true value (e.g., 0x5A5A5A5A), while Register B holds its bitwise complement (0xA5A5A5A5, computed as ~Register A). Prior to any state transition, an assembly instruction executes 'TEQ r0, r1' (Test Equivalence) or 'EORS r2, r0, r1' followed by an assertion that the XOR product strictly equals 0xFFFFFFFF. If a voltage glitch flipped bits in only one register, the complementary invariant fails instantly, preventing privilege escalation."
    ]

    p5_add = [
        "In enterprise hardware evaluation facilities, the GlitchShield Simulation Bench serves as the automated verification gateway before silicon tape-out or production board deployment. Because physical fault injection involves millions of test permutations across voltage depth, pulse duration, and clock phase, manual testing is impossible. Automated test frameworks interface FPGA glitch generators with digital storage oscilloscopes (DSOs) and automated device reset relays.",
        "The test framework executes automated Fault Sensitivity Mapping (FSM). During an FSM campaign, the bench sweeps the glitch parameters across a high-resolution grid, categorizing each test run into one of four distinct behavioral outcomes: 1) Normal Execution (Glitch had no observable effect; pulse was too weak or filtered); 2) Muted / Brownout Reset (Glitch was too strong; internal voltage supervisors forced a hardware reset); 3) Hard Fault / Crash (Glitch corrupted undefined memory or invalid opcodes, trapping into an exception handler); and 4) Security Exploit / Instruction Skip (The critical target branch was bypassed without crashing the system).",
        "The security engineer's objective is to completely eliminate Zone 4 (Security Exploit) from the sensitivity map. By combining high-speed analog glitch monitors, board-level decoupling engineering, dual-core lockstep CPU architectures, and compiler-level invariant instrumentation, the engineer ensures that any glitch capable of affecting logic execution lands squarely in Zone 2 (Brownout Reset) or Zone 3 (Hard Fault). The system safely resets and zeroizes sensitive state, leaving zero viable attack paths for the hardware adversary."
    ]

    d['parts'][0]['say'].extend(p1_add)
    d['parts'][1]['say'].extend(p2_add)
    d['parts'][2]['say'].extend(p3_add)
    d['parts'][3]['say'].extend(p4_add)
    d['parts'][4]['say'].extend(p5_add)

    with open('scripts/iot_sec_day31.json', 'w', encoding='utf-8') as f:
        json.dump(d, f, indent=2)

    print("Day 31 boosted successfully!")

if __name__ == '__main__':
    boost_day31()
