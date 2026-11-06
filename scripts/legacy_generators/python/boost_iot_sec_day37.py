# scripts/boost_iot_sec_day37.py
import json

def boost_day37():
    with open('scripts/iot_sec_day37.json', 'r', encoding='utf-8') as f:
        d = json.load(f)

    p3_add = [
        "In physical silicon measurements, the choice of which bit b to target can influence differential peak clarity. Although in theory all 8 bits of the AES S-box output leak dynamic switching current, specific bit lines on a microcontroller's internal bus may experience differing parasitic capacitances due to physical layout geometry. For instance, bit 7 may run along an outer metal track adjacent to an analog ground plane, creating a higher capacitive load and consequently a taller differential peak than bit 3, which is shielded between adjacent signal lines. Security evaluators frequently test all 8 bits individually or aggregate them into a multi-bit difference-of-means to maximize the statistical contrast ratio."
    ]

    p4_add = [
        "In advanced hardware cryptanalysis, the success of a DPA sweep is further quantified by the Subkey Discrimination Ratio (SDR). SDR is defined as the ratio of the winner's maximum differential peak amplitude to the maximum peak amplitude among all 255 incorrect candidates: SDR = Peak(k_true) / max_{k != k_true} Peak(k). An SDR value greater than 1.5 indicates unambiguous key recovery with high statistical confidence. If SDR is between 1.0 and 1.2, the attack is borderline, and capturing an additional batch of traces is recommended to prevent false-positive ghost key assignments.",
        "Furthermore, when attacking higher rounds of AES (such as Round 10 during decryption), the attacker can work backward from the known ciphertext. In Round 10, the MixColumns transformation is absent, making the byte substitution directly accessible from the ciphertext bytes. The attacker computes V = InvSBox(C_i XOR K_10_guess) and partitions traces accordingly. This bidirectional capability allows hardware evaluators to attack cryptographic implementations from either the input plaintext or the output ciphertext side, providing dual verification of side-channel resilience."
    ]

    p5_add = [
        "Beyond software-level dummy delays and shuffling, modern secure microcontrollers integrate hardware-level Random Dynamic Clock Jitter (RDCJ). An on-chip true random number generator (TRNG) modulates the phase and frequency of the internal phase-locked loop (PLL) on a cycle-by-cycle basis. By introducing random clock edge phase shifts between +/- 5% to 25%, the arrival times of sensitive CMOS switching events drift continuously across acquisitions.",
        "To defeat such hardware clock jitter, sophisticated adversaries apply non-linear trace realignment techniques, including Phase-Only Correlation (POC) and Fast Fourier Transform (FFT) envelope demodulation. By converting time-series power traces into the frequency domain or tracking instantaneous phase shifts relative to a reference trace, attackers can reconstruct a perfectly synchronized virtual trace ensemble. This arms race demonstrates that while temporal desynchronization raises the empirical barrier and trace count requirement, true mathematical security against DPA can only be achieved when data values are cryptographically masked."
    ]

    d['parts'][2]['say'].extend(p3_add)
    d['parts'][3]['say'].extend(p4_add)
    d['parts'][4]['say'].extend(p5_add)

    with open('scripts/iot_sec_day37.json', 'w', encoding='utf-8') as f:
        json.dump(d, f, indent=2, ensure_ascii=False)

    print("Successfully boosted Day 37!")

if __name__ == '__main__':
    boost_day37()
