# scripts/boost_block8_words.py
import json

def boost_all():
    # Load and boost Day 37
    with open("scripts/iot_sec_day37.json", "r", encoding="utf-8") as f:
        d37 = json.load(f)

    d37["parts"][4]["say"].append(
        "To further evaluate software-level temporal defenses, security teams analyze the impact of high-entropy hardware true random number generators (TRNGs) on loop scheduling. When an embedded processor executes cryptographic routines with randomized instruction insertion, the execution latency for any specific micro-operation varies stochastically across traces. An attacker attempting to compute differential power traces finds that the target power spike at clock cycle t is spread across an interval [t - delta, t + delta], dramatically attenuating the difference-of-means peak. To recover the key under such temporal jitter, attackers must apply advanced elastic alignment techniques, such as Fast Dynamic Time Warping (FastDTW) or phase-only cross-correlation, which substantially inflate computational overhead and require orders of magnitude more captured traces."
    )
    d37["parts"][4]["say"].append(
        "Moreover, industrial smartcard specifications require that shuffling and dummy insertion be combined with algorithmic masking to achieve defense-in-depth. Relying solely on temporal shuffling leaves residual second-order vulnerabilities, as window-based integration attacks (e.g., integrating power consumption over the entire execution window of Round 1) can still detect the aggregate energy expended by the unmasked intermediate values. Therefore, hardware security modules incorporate both silicon-level pipeline randomization and algorithmic share-splitting to provide comprehensive resistance against high-order differential power analysis."
    )

    with open("scripts/iot_sec_day37.json", "w", encoding="utf-8") as f:
        json.dump(d37, f, indent=2)

    # Load and boost Day 38
    with open("scripts/iot_sec_day38.json", "r", encoding="utf-8") as f:
        d38 = json.load(f)

    d38["parts"][2]["say"].append(
        "In practical laboratory environments, signal acquisition artifacts such as probe impedance mismatches, high-frequency oscilloscope sampling clock jitter, and ground bounce introduce spurious phase variations. To combat these non-idealities, hardware security engineers configure finite impulse response (FIR) bandpass filters tuned specifically to the device's cryptographic clock harmonics. By suppressing both low-frequency mains hum (50/60 Hz) and out-of-band RF noise exceeding the Nyquist frequency of the switching logic, the preprocessed trace matrix preserves only the data-dependent CMOS charging transients, maximizing the signal-to-noise ratio prior to statistical evaluation."
    )

    d38["parts"][3]["say"].append(
        "When executing the CPA subkey sweep across large datasets, vectorization and parallel processing become critical. Modern security assessment benches leverage optimized SIMD instructions (such as AVX-512) or GPU-accelerated tensor kernels to compute the correlation matrix across 256 key candidates and tens of thousands of time samples simultaneously. This computational acceleration enables security evaluators to perform automated multi-byte key recovery across all 16 AES state bytes in minutes rather than hours, verifying whether silicon physical countermeasures provide uniform protection across the entire datapath."
    )
    d38["parts"][3]["say"].append(
        "Furthermore, hardware evaluators inspect the correlation evolution curve, which tracks the correlation coefficient r_max as a function of trace count N. In an unhardened device, the curve corresponding to the true key candidate diverges sharply from the random candidate envelope with as few as 100 to 200 traces. If a silicon countermeasure successfully flattens this evolution curve, the security analyst confirms that the Pearson correlation remains bounded within the statistical noise threshold, demonstrating resistance to first-order side-channel extraction."
    )

    d38["parts"][4]["say"].append(
        "The Minimum Traces to Disclosure (MTD) metric serves as a foundational baseline for Common Criteria (CC) EAL5+ and EAL6+ physical security certifications. Certification bodies mandate that certified secure elements and industrial microcontrollers withstand attacks involving at least 1,000,000 traces without exhibiting statistically significant correlation peaks. In addition to MTD, evaluators assess the Success Rate (SR) and Guessing Entropy (GE). Guessing Entropy quantifies the average rank of the true secret key within the sorted candidate list after processing N traces; a secure device must maintain a high guessing entropy even when subjected to extensive trace acquisition campaigns."
    )
    d38["parts"][4]["say"].append(
        "Silicon resilience engineering therefore demands systematic verification across process, voltage, and temperature (PVT) corners. Because temperature variations alter CMOS carrier mobility and threshold voltages, power dissipation profiles shift dynamically. Comprehensive side-channel resilience certification mandates that CPA evaluations be repeated at -40 deg C, +25 deg C, and +105 deg C to ensure that thermal drift does not expose hidden leakage channels in industrial automation hardware deployed in harsh factory environments."
    )

    with open("scripts/iot_sec_day38.json", "w", encoding="utf-8") as f:
        json.dump(d38, f, indent=2)

    # Load and boost Day 39
    with open("scripts/iot_sec_day39.json", "r", encoding="utf-8") as f:
        d39 = json.load(f)

    d39["parts"][3]["say"].append(
        "Beyond spatial mapping, frequency-domain analysis of electromagnetic emanations reveals localized carrier frequencies generated by internal phase-locked loops (PLLs) and clock distribution trees. In modern microcontrollers, the cryptographic datapath modulates these clock carriers, producing amplitude-modulated (AM) and phase-modulated (PM) sidebands. Security engineers deploy software-defined radios (SDRs) and spectrum analyzers to capture these modulated signals from several meters away, performing far-field electromagnetic analysis (DEMA). Demodulating the captured RF envelope reconstitutes the time-domain power trace, exposing the device to remote key extraction without requiring physical galvanic contact with the printed circuit board."
    )
    d39["parts"][3]["say"].append(
        "To counter RF-based EM exploitation, hardware architects implement spread-spectrum clock generation (SSCG). By continuously modulating the clock frequency across a predetermined band (e.g., +/- 2.5% triangular modulation), the radiated energy is distributed over a wider frequency spectrum rather than concentrating into sharp spectral peaks. This deliberate spectral spreading attenuates peak radiated emission levels below regulatory compliance thresholds (such as CISPR 32 and FCC Part 15) while simultaneously degrading the signal-to-noise ratio available to remote eavesdroppers attempting demodulation."
    )

    d39["parts"][4]["say"].append(
        "At the silicon layout level, dual-rail precharge logic (WDDL - Wave Dynamic Differential Logic) offers an effective physical defense against localized electromagnetic probing. In dual-rail circuits, every logical bit is routed as a complementary wire pair (true and false rails) that transition with identical electrical capacitance and symmetric geometric layout. Because both rails switch concurrently in every clock cycle, the net differential magnetic field emitted by the complementary pair cancels out in the near field according to Ampere's law, depriving micro-probes of localized spatial gradients."
    )
    d39["parts"][4]["say"].append(
        "Complementing dual-rail routing, active silicon shielding layers are fabricated on the topmost metal layers (Metal 6 or Metal 7). These active meshes carry pseudo-random bit sequences monitored continuously by on-chip tamper detection circuits. If an adversary attempts to decapsulate the package with nitric acid or mechanically mill the die surface to position an EM probe closer to internal metal layers, the mesh detects the physical break or short circuit and immediately triggers a zeroization signal, wiping cryptographic keys from battery-backed SRAM."
    )

    with open("scripts/iot_sec_day39.json", "w", encoding="utf-8") as f:
        json.dump(d39, f, indent=2)

    # Load and boost Day 40
    with open("scripts/iot_sec_day40.json", "r", encoding="utf-8") as f:
        d40 = json.load(f)

    d40["parts"][1]["say"].append(
        "In physical silicon measurements of unprotected coprocessors, register updates and bus transitions generate sharp current spikes that correlate strongly with the Hamming distance between consecutive state values. When an 8-bit or 32-bit internal register transitions from an all-zero precharge state to an S-Box output byte, charging the gate and parasitic line capacitances draws charge Q = C * V_dd from the power distribution network. This charge transfer produces a measurable voltage transient across parasitic bond-wire inductances, generating physical leakage that allows attackers to determine the exact number of bits flipping in the cryptographic datapath."
    )

    d40["parts"][2]["say"].append(
        "The mathematical foundation of the CPA attack engine lies in computing the sample Pearson correlation coefficient r between the hypothetical power model matrix H and the measured trace matrix T. Because Pearson's r normalizes for both scale and offset, it is invariant to static DC power consumption and linear amplifier gains. When evaluated across hundreds of power traces, the correlation coefficient for incorrect key hypotheses converges toward zero according to the central limit theorem, while the correlation coefficient for the correct key hypothesis stabilizes at a prominent peak, providing unequivocal physical evidence of key extraction."
    )
    d40["parts"][2]["say"].append(
        "In enterprise security evaluations, automated test benches execute subkey sweeps across multiple points of interest (POI). Rather than assuming that leakage occurs at a single predetermined clock cycle, the evaluation suite scans the entire temporal window of Round 1. By identifying the specific temporal index where the discrimination margin reaches its global maximum, security engineers pinpoint the exact pipeline register responsible for the leakage, providing actionable feedback to RTL design engineers for hardware remediation."
    )

    d40["parts"][4]["say"].append(
        "The mathematical proof of first-order Boolean masking relies on the properties of the exclusive-OR (XOR) operator. When a sensitive variable x is masked with a uniformly distributed random share m (x_prime = x ^ m), the probability distribution of x_prime is completely independent of x: P(x_prime = c | x = a) = 1 / 256 for all possible values a and c. Consequently, any statistical moment of order 1 (such as the mean power consumption) conveys zero information regarding x. Security evaluators utilize this formal property to prove that first-order DPA and CPA attacks are mathematically prevented, forcing adversaries to resort to computationally intensive second-order analysis."
    )
    d40["parts"][4]["say"].append(
        "To ensure that this theoretical security holds in physical silicon, the implementation must prevent physical glitch leakage. In CMOS logic gates, unequal signal propagation delays through combinational logic paths cause transient transitions (glitches) before the logic stabilizes. In masked S-Boxes, these glitches can transiently combine masked shares, unmasking the intermediate value and restoring first-order leakage. To neutralize glitch leakage, hardware security architectures insert pipeline synchronization registers (threshold implementations) between non-linear algebraic steps, ensuring that shares remain strictly isolated across every clock cycle."
    )

    with open("scripts/iot_sec_day40.json", "w", encoding="utf-8") as f:
        json.dump(d40, f, indent=2)

    print("Successfully boosted all days in Block 8!")

if __name__ == "__main__":
    boost_all()
