# scripts/build_iot_net_day6.py
"""
Builds Day 6 for Course 18: IoT Networking & Cloud Protocols (iot_net).
Day 6: IEEE 802.15.4 Architecture, 2.4 GHz PHY & O-QPSK DSSS Modulation
Pedagogical Invariants:
- Exactly 5 parts, each strictly >= 580 words (target >= 620 words).
- minutes: 38.
- 100% deterministic Python standard library execution, verified output capture.
- 4 multiple choice options with answer: 0 and deep why.
- Strict mathematical & architectural depth: 802.15.4 PHY, 16 channels, O-QPSK, half-sine pulse shaping, 32-chip PN DSSS, 9 dB processing gain, Wi-Fi coexistence.
"""

import json
import subprocess
import sys

def build_day6():
    # =========================================================================
    # Part 1: IEEE 802.15.4 Physical Layer (PHY) Architecture & 2.4 GHz Channelization
    # =========================================================================
    p1_say = [
        "Welcome to Day 6 of IoT Networking & Cloud Protocols. Having completed our foundational survey of wireless link budgets, Friis path loss models, and initial 6LoWPAN compression in Milestone 1, we now dive into the bedrock physical-layer standard of low-power industrial and building automation: IEEE 802.15.4.",
        "While Wi-Fi standards (IEEE 802.11a/b/g/n/ax) were conceived to stream tens to hundreds of megabits per second across power-hungry transceivers connected to main electrical lines, IEEE 802.15.4 was purposefully architected for ultra-low complexity, ultra-low cost, and microamp battery endurance. The overarching engineering goal is simple yet uncompromising: allow battery-powered microcontrollers to operate autonomously for 5 to 10 years on a single lithium coin cell while transmitting telemetry reliably over short to medium distances in hostile industrial and enterprise radio environments.",
        "The standard defines physical layers operating in multiple frequency bands (including 868 MHz in Europe, 915 MHz in North America, and 433 MHz in regional industrial bands), but the globally recognized, license-free standard operates within the 2.4 GHz Industrial, Scientific, and Medical (ISM) band (specifically 2400.0 MHz to 2483.5 MHz). Within this 83.5 MHz spectrum, IEEE 802.15.4 establishes exactly 16 non-overlapping channels, numbered Channel 11 through Channel 26.",
        "The mathematical formula governing the center frequency of each 2.4 GHz channel is: f_c = 2405 + 5 * (k - 11) MHz, where k is the channel number from 11 to 26. Thus, Channel 11 sits at 2405 MHz, Channel 12 at 2410 MHz, Channel 13 at 2415 MHz, and Channel 26 terminates at 2480 MHz. Notice that each channel is spaced exactly 5 MHz apart, with an occupied channel bandwidth of approximately 2 MHz, leaving a comfortable 3 MHz guard band between adjacent 802.15.4 channel centers. This 5 MHz channel spacing provides essential adjacent-channel suppression when multiple independent 802.15.4 networks coexist within the same facility.",
        "At this 2.4 GHz PHY, the standard mandates a raw over-the-air symbol rate of 62.5 ksymbols/second and an information bit rate of 250 kbps. Every 4 bits of raw binary data (one nibble) are mapped onto a single 16-ary quasi-orthogonal symbol, which is then expanded into a 32-chip sequence. Because 32 chips are transmitted for every symbol, the physical chip transmission rate is exactly 62.5 ksymbols/s * 32 chips/symbol = 2.0 Mchips/second. Each individual chip has a temporal duration of T_c = 1 / 2,000,000 s = 0.5 microseconds (500 nanoseconds), while each 4-bit symbol spans T_s = 32 * T_c = 16.0 microseconds, resulting in an effective bit duration of T_b = 4.0 microseconds.",
        "To understand the extreme sensitivity of 802.15.4 receivers, we must examine thermal noise physics. The thermal noise power available in a given receiver bandwidth is governed by Johnson-Nyquist noise: P_noise = k_B * T * B, where k_B is Boltzmann's constant (1.38e-23 J/K), T is temperature in Kelvin (290 K standard), and B is channel bandwidth (2 MHz). In logarithmic decibel-milliwatts, P_noise(dBm) = -174 dBm/Hz + 10 * log10(B) = -174 + 10 * log10(2,000,000) = -174 + 63.01 = -110.99 dBm. With a typical low-cost receiver noise figure (NF) of 6 dB to 8 dB, the effective thermal noise floor sits around -103 dBm to -105 dBm. Thanks to DSSS spreading gain, practical commercial receivers achieve clean packet demodulation at input signal levels as low as -95 dBm to -100 dBm.",
        "The physical layer packet data unit (PPDU) is meticulously structured to enable rapid, low-power receiver synchronization. The PPDU consists of three primary components: the Synchronization Header (SHR), the PHY Header (PHR), and the PHY Payload (PSDU - Physical Layer Service Data Unit).",
        "The SHR begins with a 4-octet (32-bit) Preamble field consisting of alternating binary zeros (0x00000000). The receiver hardware utilizes this unmodulated or steady-pattern preamble to train its automatic gain control (AGC), lock its phase-locked loop (PLL) synthesizer, and achieve bit/chip clock recovery. Immediately following the preamble is the 1-octet Start-of-Frame Delimiter (SFD), universally fixed in 802.15.4 to the binary value 11100101 (0xA7). When the receiver's correlator detects the SFD, it establishes absolute byte boundary alignment, transitioning the hardware from synchronization hunting to frame decoding.",
        "The PHR consists of an 8-bit field where the lower 7 bits designate the Frame Length (PSDU length in octets, ranging from 0 to 127 bytes), and the most significant bit is reserved (must be set to 0). The maximum physical transmission unit (MTU) of an IEEE 802.15.4 packet is therefore strictly constrained to 127 bytes (aBasePHYPayloadSize). This rigid 127-byte boundary is the fundamental constraint that makes upper-layer header compression (such as 6LoWPAN) indispensable for transmitting 1280-byte IPv6 MTUs.",
        "Understanding this channelization and framing architecture is crucial for wireless systems engineers. Because co-channel interference and spectral collisions with high-power 2.4 GHz Wi-Fi transmitters can degrade link quality if channel selection is not actively managed during commissioning, every firmware engineer must know the exact physical parameters governing 802.15.4 RF propagation."
    ]
    p1_example = "Think of 802.15.4 channels like narrow bicycle lanes running alongside a massive multi-lane highway (Wi-Fi). The bicycle lanes are spaced at exact 5 MHz intervals. If you ride your bicycle on lanes that share pavement with highway trucks (Wi-Fi channels 1, 6, and 11), your bicycle will be blown off the road. But on Channel 26, situated at the extreme high edge of the spectrum, bicycles can ride completely undisturbed."
    p1_code = """# IEEE 802.15.4 2.4 GHz Channelization & Frame Parameter Engine
class IEEE802154PhyChannelEngine:
    def __init__(self):
        self.raw_data_rate_bps = 250000     # 250 kbps
        self.symbol_rate_sps = 62500        # 62.5 ksymbols/s
        self.chip_rate_cps = 2000000        # 2.0 Mchips/s
        self.chips_per_symbol = 32
        self.bits_per_symbol = 4
        self.max_psdu_size = 127            # 127 octets maximum
        
    def get_channel_frequency_mhz(self, channel: int) -> float:
        if not (11 <= channel <= 26):
            raise ValueError(f"Invalid 802.15.4 channel {channel}. Valid range: 11-26.")
        return 2405.0 + 5.0 * (channel - 11)
        
    def calculate_transmission_time_us(self, psdu_bytes: int) -> float:
        if not (0 <= psdu_bytes <= self.max_psdu_size):
            raise ValueError(f"PSDU exceeds maximum physical frame size (0-127 bytes).")
        # Total frame = Preamble (4B) + SFD (1B) + PHR (1B) + PSDU (N bytes)
        total_octets = 4 + 1 + 1 + psdu_bytes
        # 1 octet = 8 bits = 2 symbols = 64 chips
        total_symbols = total_octets * 2
        # Symbol duration = 1 / 62500 s = 16 microseconds
        symbol_duration_us = 16.0
        return total_symbols * symbol_duration_us

phy = IEEE802154PhyChannelEngine()
print("=== IEEE 802.15.4 2.4 GHz PHY Spectrum Allocation ===")
for ch in [11, 15, 20, 25, 26]:
    freq = phy.get_channel_frequency_mhz(ch)
    print(f"Channel {ch:02d}: Center Frequency = {freq:.1f} MHz")

max_tx_time = phy.calculate_transmission_time_us(127)
min_tx_time = phy.calculate_transmission_time_us(10)
print(f"\\nTransmission Duration (127-byte Max PSDU): {max_tx_time:.1f} us ({max_tx_time/1000.0:.3f} ms)")
print(f"Transmission Duration (10-byte ACK/Beacon): {min_tx_time:.1f} us ({min_tx_time/1000.0:.3f} ms)")
"""
    p1_codeNotes = [
        "Defines IEEE802154PhyChannelEngine modeling the 2.4 GHz physical layer specification.",
        "Calculates exact RF center frequencies for channels 11 through 26 via 2405 + 5*(k-11) MHz.",
        "Computes exact microsecond packet transmission durations across 16 us symbol boundaries."
    ]
    p1_tryIt = "Modify the psdu_bytes input to evaluate transmission time for a 50-byte CoAP sensor packet and observe the exact microsecond duration."
    p1_check = {
        "question": "What is the center frequency of IEEE 802.15.4 Channel 26, and what is the maximum physical layer frame size (PSDU)?",
        "options": [
            "2480.0 MHz center frequency, with a strictly mandated maximum PSDU of 127 octets.",
            "2483.5 MHz center frequency, with a maximum PSDU of 1500 octets matching Ethernet.",
            "2405.0 MHz center frequency, with a maximum PSDU of 64 octets.",
            "2450.0 MHz center frequency, with a variable PSDU ranging up to 1024 octets."
        ],
        "answer": 0,
        "why": "Option 0 is mathematically correct: f_c = 2405 + 5*(26 - 11) = 2405 + 75 = 2480.0 MHz. The IEEE 802.15.4 PHR allocates 7 bits for the length field, restricting the maximum physical payload (PSDU) to exactly 127 bytes. Option 1 confuses the band edge with the channel center and assumes Ethernet MTU. Option 2 describes Channel 11. Option 3 is arbitrary."
    }

    # =========================================================================
    # Part 2: Offset Quadrature Phase Shift Keying (O-QPSK) & Half-Sine Shaping
    # =========================================================================
    p2_say = [
        "Having established the RF channels and framing, we must investigate how binary chips are physically converted into high-frequency electromagnetic waves across the antenna: Offset Quadrature Phase Shift Keying (O-QPSK) with half-sine pulse shaping.",
        "In basic binary phase shift keying (BPSK), the phase of a high-frequency carrier wave flips by 180 degrees whenever a bit transitions from 0 to 1 or 1 to 0. In standard Quadrature Phase Shift Keying (QPSK), two orthogonal carriers (the in-phase 'I' component and the quadrature 'Q' component, separated by a 90-degree phase shift) are modulated simultaneously by two independent bits, producing four possible constellation points: 45, 135, 225, and 315 degrees.",
        "However, standard QPSK possesses a catastrophic flaw for battery-operated IoT transmitters: when both the I and Q bits transition simultaneously (for example, moving from constellation point (1, 1) to (-1, -1)), the phase trajectory must pass directly through the origin (zero amplitude). When the RF signal envelope collapses to zero amplitude and then re-expands, the transmitter's power amplifier (PA) must operate with extreme linear fidelity.",
        "In low-cost, battery-powered microcontrollers, highly linear RF amplifiers (such as Class-A amplifiers) draw enormous quiescent battery current and operate with abysmal power-added efficiency (PAE), typically under 20% to 30%. If a nonlinear, saturated power amplifier (such as Class-C or Class-E) is used with standard QPSK, the zero-crossing envelope fluctuations cause intense 'spectral regrowth' or inter-modulation distortion. This distortion splatters spurious RF noise into adjacent channels, degrading neighboring wireless networks and violating FCC and ETSI adjacent channel power ratio (ACPR) regulatory masks.",
        "IEEE 802.15.4 solves this physical hardware limitation through Offset QPSK (O-QPSK). In O-QPSK, the bit/chip transitions on the Quadrature (Q) rail are delayed or staggered in time by exactly half a chip period (T_c / 2 = 250 ns) relative to the In-phase (I) rail. Because the I and Q transitions are offset in time, both rails can never transition at the exact same physical instant.",
        "Consequently, the phase constellation trajectory in O-QPSK can only make 90-degree phase turns at any moment; it can never pass through the origin (which requires a 180-degree simultaneous phase flip). The RF signal envelope never collapses to zero amplitude.",
        "To further smooth the transitions and restrict occupied radio bandwidth, 802.15.4 combines O-QPSK with Half-Sine Pulse Shaping. Each chip is represented not by a sharp, square voltage pulse (which has infinite high-frequency harmonics in the frequency domain, decaying slowly as 1/f), but by a smooth half-sine wave pulse: p(t) = sin(pi * t / T_c) for 0 <= t <= T_c.",
        "Remarkably, the mathematical combination of O-QPSK and half-sine pulse shaping is identical to Continuous Phase Frequency Shift Keying (CP-FSK) or Minimum Shift Keying (MSK). MSK produces an RF signal with a strictly constant envelope (0 dB peak-to-average power ratio, or PAPR = 1). In the frequency domain, the signal shifts smoothly between two frequencies: f_c + 1/(4*T_c) and f_c - 1/(4*T_c), which for T_c = 0.5 us corresponds to f_c +/- 500 kHz.",
        "Because the envelope amplitude remains completely constant across all phase trajectories, the microcontroller's transmitter can employ highly efficient, nonlinear saturated Class-C, Class-D, or Class-E power amplifiers. Saturated amplifiers achieve power-added efficiencies exceeding 60% to 70%, translating directly into minimal battery drain.",
        "This elegant modulation physics is precisely why modern 802.15.4 transceivers can broadcast signals consuming less than 10 to 15 milliamperes of battery current from a 3.0V coin cell while maintaining pristine spectral compliance and preventing cross-channel interference.",
        "Engineers evaluating RF frontends must appreciate that half-sine shaping also guarantees that 99.5% of total signal energy remains contained within the nominal 2.0 MHz channel bandwidth. This sharp spectral roll-off prevents side-channel energy leakage into adjacent channels, providing superior spectral hygiene."
    ]
    p2_example = "Think of driving a racing car around a tight corner. In standard QPSK, the driver slams on the brakes to a full dead stop at the center of the intersection (zero envelope) before accelerating backwards. In O-QPSK with half-sine shaping, the driver never stops; they round a smooth, circular banked curve at constant speed. The constant speed (constant envelope) saves engine wear and fuel (battery power)."
    p2_code = """# O-QPSK with Half-Sine Pulse Shaping (MSK Equivalence) Simulator
import math

class OQPSKModulator:
    def __init__(self, chip_rate_cps: int = 2000000):
        self.chip_rate = chip_rate_cps
        self.tc = 1.0 / chip_rate_cps        # Chip duration: 0.5 microseconds (500 ns)
        self.half_tc = self.tc / 2.0         # Offset: 250 ns
        
    def modulate_chip_sequence(self, chips: list[int], samples_per_chip: int = 8):
        # Separate chips into even (I-rail) and odd (Q-rail)
        # Bipolar mapping: 0 -> -1.0, 1 -> +1.0
        i_chips = [1.0 if c == 1 else -1.0 for c in chips[0::2]]
        q_chips = [1.0 if c == 1 else -1.0 for c in chips[1::2]]
        
        # Verify envelope trajectory across samples
        envelopes = []
        zero_crossings = 0
        
        # Inspect chip periods
        num_eval_chips = min(len(i_chips), len(q_chips))
        for idx in range(num_eval_chips):
            i_val = i_chips[idx]
            q_val = q_chips[idx]
            
            for s in range(samples_per_chip):
                t_rel = s / samples_per_chip
                # Half-sine pulse shaping p(t) = sin(pi * t)
                pulse_i = math.sin(math.pi * t_rel)
                pulse_q = math.sin(math.pi * ((t_rel + 0.5) % 1.0))
                
                i_sample = i_val * pulse_i
                q_sample = q_val * pulse_q
                
                # Envelope magnitude = sqrt(I^2 + Q^2)
                magnitude = math.sqrt(i_sample**2 + q_sample**2)
                envelopes.append(magnitude)
                if magnitude < 0.05:
                    zero_crossings += 1
                    
        return {
            "min_envelope": min(envelopes),
            "max_envelope": max(envelopes),
            "zero_crossings": zero_crossings,
            "avg_envelope": sum(envelopes) / len(envelopes)
        }

modulator = OQPSKModulator()
test_chips = [1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1]
stats = modulator.modulate_chip_sequence(test_chips)

print("=== O-QPSK Half-Sine Modulation Envelope Dynamics ===")
print(f"Total Chips Evaluated: {len(test_chips)}")
print(f"Minimum Envelope Magnitude: {stats['min_envelope']:.4f}")
print(f"Maximum Envelope Magnitude: {stats['max_envelope']:.4f}")
print(f"Average Envelope Magnitude: {stats['avg_envelope']:.4f}")
print(f"Zero-Crossing Envelope Collapses: {stats['zero_crossings']} (Strict Constant-Envelope Stability)")
"""
    p2_codeNotes = [
        "Implements OQPSKModulator modeling the I/Q rail separation and half-chip time offset.",
        "Applies half-sine pulse shaping p(t) = sin(pi*t/Tc) across discrete sub-chip samples.",
        "Proves that O-QPSK envelope magnitude remains strictly non-zero without zero-crossing collapse."
    ]
    p2_tryIt = "Change the test_chips sequence to an alternating [0, 1, 0, 1, 0, 1] pattern and verify that zero-crossing collapses remain strictly 0."
    p2_check = {
        "question": "Why does IEEE 802.15.4 utilize Offset QPSK (O-QPSK) with half-sine pulse shaping instead of conventional standard QPSK?",
        "options": [
            "The half-chip offset prevents simultaneous I and Q transitions, eliminating zero-crossing envelope collapses and allowing efficient non-linear power amplifiers without spectral regrowth.",
            "O-QPSK doubles the over-the-air raw bit rate from 250 kbps to 500 kbps across identical bandwidth.",
            "Conventional QPSK requires dual antennas, whereas O-QPSK operates using a single wire antenna.",
            "O-QPSK incorporates built-in AES-128 cryptographic encryption directly at the RF pulse level."
        ],
        "answer": 0,
        "why": "Option 0 correctly identifies the fundamental physics of O-QPSK: offsetting the Q rail by half a chip period prevents the phase trajectory from passing through the origin (0 amplitude). Combined with half-sine shaping, this yields an essentially constant envelope (MSK equivalent), enabling simple, highly efficient non-linear PAs without spectral splatter. Option 1 is false (the bit rate remains 250 kbps). Options 2 and 3 are physically nonsensical."
    }

    # =========================================================================
    # Part 3: Direct Sequence Spread Spectrum (DSSS) & 32-Chip PN Spreading
    # =========================================================================
    p3_say = [
        "Now we uncover the core mathematical mechanism that grants IEEE 802.15.4 its legendary noise immunity and resilience against multi-path fading: Direct Sequence Spread Spectrum (DSSS).",
        "In a conventional narrowband communications system, 1 bit of digital data is transmitted as 1 symbol of RF signal. If an interfering transmitter broadcasts a burst of noise on that exact frequency, or if destructive multipath reflection cancels the wave, the bit is obliterated and the receiver suffers an immediate bit error. Narrowband links are acutely vulnerable to localized spectral notches.",
        "IEEE 802.15.4 adopts a radically different philosophy. Instead of transmitting data bits directly, it spreads the energy of each bit across a much wider frequency spectrum using a pseudo-random noise (PN) sequence. This process is known as Direct Sequence Spread Spectrum.",
        "In the 2.4 GHz 802.15.4 specification, raw binary data arriving from the MAC layer is partitioned into 4-bit nibbles (b0, b1, b2, b3). Because 4 bits have 2^4 = 16 possible permutations, each nibble represents one of 16 data symbols (Symbol 0 through Symbol 15).",
        "The standard defines an immutable codebook of 16 quasi-orthogonal 32-chip pseudo-random noise sequences. When the transmitter prepares to send Symbol 0 (binary 0000), it does not transmit 0000; it transmits the 32-chip sequence: 11011001110000110101001000101110. When sending Symbol 1 (binary 1000, transmitted LSB-first), it transmits a circular-shifted and modified version: 11101101100111000011010100100010.",
        "Notice the mathematical expansion: 4 bits of information are expanded into 32 binary chips. The spreading factor (SF) is therefore: SF = 32 chips / 4 bits = 8 chips per bit.",
        "What does this spreading accomplish physically? It grants the receiver a massive signal advantage known as Processing Gain (G_p). The mathematical processing gain in decibels is calculated as: G_p = 10 * log10(Chipping Rate / Data Rate) = 10 * log10(2,000,000 / 250,000) = 10 * log10(8) ≈ 9.03 dB.",
        "When an 802.15.4 receiver listens to the incoming noisy channel, it runs the incoming digitized waveform through a bank of 16 parallel matched filters or cross-correlators. Each correlator computes the cross-correlation between the received signal and its assigned 32-chip reference sequence. In discrete bipolar math (where bit 1 is +1 and bit 0 is -1), the inner product across 32 chips produces a maximum score of +32 for an identical symbol match, and scores close to 0 (typically between -4 and +4) for any other quasi-orthogonal symbol.",
        "Uncorrelated background noise, thermal noise, and narrowband interference from other devices have near-zero mathematical correlation with the pseudo-random 32-chip sequence; the correlator averages their energy down towards zero across the 32 chips. In contrast, the matching 32-chip symbol correlates coherently across all 32 chips, producing a sharp, massive correlation spike that towers 9.03 dB above the noise floor.",
        "Because of this 9.03 dB processing gain, an 802.15.4 receiver can successfully demodulate and decode packets even when the received signal is buried beneath the background noise floor (negative Signal-to-Noise Ratio, SNR < 0 dB). This is why IEEE 802.15.4 radios achieve exceptional sensitivity ratings of -95 dBm to -100 dBm with miniature onboard trace antennas, allowing robust communication in industrial factories filled with metal reflections and electrical motor noise.",
        "In addition to noise averaging, the cross-correlation properties between different symbols in the 802.15.4 codebook were engineered with mathematical precision. In an ideal orthogonal codebook (such as Walsh-Hadamard codes), the cross-correlation between any two distinct codewords is identically zero. In 802.15.4, the 32-chip sequences are quasi-orthogonal: the maximum cross-correlation between any two different symbols is at most 4 out of 32 (a cross-correlation coefficient of 0.125 or -12 dB). This low cross-correlation prevents the receiver from ever misidentifying one symbol as another, even in the presence of severe phase jitter and frequency offsets up to +/- 40 ppm.",
        "This signaling architecture stands in stark contrast to legacy cellular CDMA systems (such as IS-95) which required complex power control loops to avoid the near-far problem. Because 802.15.4 combines quasi-orthogonal DSSS with packet-level CSMA/CA channel access, it achieves deterministic communication without requiring high-speed closed-loop power control silicon, drastically simplifying transceiver circuitry and conserving battery life.",
        "Furthermore, DSSS spreading provides substantial anti-jamming resilience (Jammer-to-Signal ratio J/S). An adversary or adjacent non-802.15.4 radio must transmit at least 9 dB higher power than the signal in the specific chipping band to successfully corrupt symbol correlation, rendering short-duration pulsed interference virtually harmless."
    ]
    p3_example = "Imagine a crowded, deafening cocktail party where 50 people are screaming at the top of their lungs (noise). If you whisper a single word ('yes' or 'no'), nobody can hear you. But if you and a friend agree on a secret 32-syllable rhythmic chant for 'yes', and you chant that pattern in cadence, your friend's brain filters out the chaotic background chatter and immediately locks onto the 32-syllable rhythm."
    p3_code = """# IEEE 802.15.4 32-Chip DSSS Spreading & Correlation Engine
class IEEE802154DSSSEngine:
    # Official 802.15.4 32-chip PN sequences for Symbols 0 through 15
    # (Symbols 0-7 base sequence circular shifts, Symbols 8-15 inverted shifts)
    SYMBOL_CHIP_TABLE = [
        [1,1,0,1,1,0,0,1,1,1,0,0,0,0,1,1,0,1,0,1,0,0,1,0,0,0,1,0,1,1,1,0], # 0
        [1,1,1,0,1,1,0,1,1,0,0,1,1,1,0,0,0,0,1,1,0,1,0,1,0,0,1,0,0,0,1,0], # 1
        [0,0,1,0,1,1,1,0,1,1,0,1,1,0,0,1,1,1,0,0,0,0,1,1,0,1,0,1,0,0,1,0], # 2
        [0,0,1,0,0,0,1,0,1,1,1,0,1,1,0,1,1,0,0,1,1,1,0,0,0,0,1,1,0,1,0,1], # 3
        [0,1,0,1,0,0,1,0,0,0,1,0,1,1,1,0,1,1,0,1,1,0,0,1,1,1,0,0,0,0,1,1], # 4
        [0,0,1,1,0,1,0,1,0,0,1,0,0,0,1,0,1,1,1,0,1,1,0,1,1,0,0,1,1,1,0,0], # 5
        [1,1,0,0,0,0,1,1,0,1,0,1,0,0,1,0,0,0,1,0,1,1,1,0,1,1,0,1,1,0,0,1], # 6
        [1,0,0,1,1,1,0,0,0,0,1,1,0,1,0,1,0,0,1,0,0,0,1,0,1,1,1,0,1,1,0,1], # 7
        [1,0,0,0,1,1,0,0,1,0,0,1,0,1,1,0,0,0,0,0,0,1,1,1,0,1,1,1,1,0,1,1], # 8
        [1,0,1,1,1,0,0,0,1,1,0,0,1,0,0,1,0,1,1,0,0,0,0,0,0,1,1,1,0,1,1,1], # 9
        [0,1,1,1,1,0,1,1,1,0,0,0,1,1,0,0,1,0,0,1,0,1,1,0,0,0,0,0,0,1,1,1], # 10
        [0,1,1,1,0,1,1,1,1,0,1,1,1,0,0,0,1,1,0,0,1,0,0,1,0,1,1,0,0,0,0,0], # 11
        [0,0,0,0,0,1,1,1,0,1,1,1,1,0,1,1,1,0,0,0,1,1,0,0,1,0,0,1,0,1,1,0], # 12
        [0,1,1,0,0,0,0,0,0,1,1,1,0,1,1,1,1,0,1,1,1,0,0,0,1,1,0,0,1,0,0,1], # 13
        [1,0,0,1,0,1,1,0,0,0,0,0,0,1,1,1,0,1,1,1,1,0,1,1,1,0,0,0,1,1,0,0], # 14
        [1,1,0,0,1,0,0,1,0,1,1,0,0,0,0,0,0,1,1,1,0,1,1,1,1,0,1,1,1,0,0,0]  # 15
    ]
    
    def spread_nibble(self, nibble: int) -> list[int]:
        if not (0 <= nibble <= 15):
            raise ValueError("Nibble must be 0-15.")
        return list(self.SYMBOL_CHIP_TABLE[nibble])
        
    def correlate_chips(self, received_chips: list[int]) -> tuple[int, int]:
        # Cross-correlate received chips against all 16 known symbol patterns
        # Returns (best_matching_symbol, correlation_peak_score)
        best_symbol = -1
        max_correlation = -9999
        
        for sym_idx, reference_chips in enumerate(self.SYMBOL_CHIP_TABLE):
            # Bipolar correlation: matching bit gives +1, mismatched bit gives -1
            score = sum(1 if r == c else -1 for r, c in zip(reference_chips, received_chips))
            if score > max_correlation:
                max_correlation = score
                best_symbol = sym_idx
                
        return best_symbol, max_correlation

dsss = IEEE802154DSSSEngine()
# Transmit Symbol 3 (Nibble = 3)
tx_symbol = 3
chips = dsss.spread_nibble(tx_symbol)

# Simulate noisy channel: flip 6 random chips out of 32 (severe 18.75% chip error rate)
corrupted_chips = list(chips)
flip_indices = [2, 7, 14, 19, 23, 28]
for idx in flip_indices:
    corrupted_chips[idx] = 1 - corrupted_chips[idx]

# Demodulate using matched correlator bank
decoded_symbol, peak_score = dsss.correlate_chips(corrupted_chips)

print("=== IEEE 802.15.4 DSSS Correlation & Noise Rejection ===")
print(f"Transmitted Symbol: {tx_symbol} (Expanded to {len(chips)} chips)")
print(f"Simulated Injected Bit/Chip Errors: {len(flip_indices)} / 32 chips")
print(f"Decoded Symbol at Receiver: {decoded_symbol}")
print(f"Correlation Peak Score: {peak_score} / 32.0 (Threshold > 0)")
print(f"Demodulation Result: {'PERFECT DECODE (NO DATA ERROR)' if decoded_symbol == tx_symbol else 'ERROR'}")
"""
    p3_codeNotes = [
        "Defines IEEE802154DSSSEngine with the exact 16-symbol 32-chip PN sequence lookup table.",
        "Demonstrates spreading 4-bit nibbles into 32 chips (8x chipping expansion).",
        "Implements a cross-correlation matched filter bank recovering data despite 6 flipped chips."
    ]
    p3_tryIt = "Introduce 10 flipped chips into the corrupted_chips array and observe whether the correlator still successfully recovers the original symbol."
    p3_check = {
        "question": "What is the theoretical Processing Gain (G_p) achieved by the IEEE 802.15.4 2.4 GHz DSSS spreading architecture?",
        "options": [
            "Approximately 9.03 dB, calculated as 10 * log10(2.0 Mchips/s / 250 kbps) = 10 * log10(8).",
            "Exactly 3.01 dB, corresponding to a 2x spreading factor.",
            "Zero dB, because DSSS does not alter signal-to-noise ratio in 2.4 GHz spectrum.",
            "18.06 dB, derived from a 64-chip spreading code across dual channels."
        ],
        "answer": 0,
        "why": "Option 0 is mathematically correct: the chipping rate is 2.0 Mchips/s and the information rate is 250 kbps. The ratio of chip rate to bit rate is 8 (or 32 chips / 4 bits = 8). The processing gain is G_p = 10 * log10(8) ≈ 9.03 dB. This 9 dB gain allows receivers to recover signals buried beneath noise. Options 1, 2, and 3 miscalculate the ratio or ignore spreading gain."
    }

    # =========================================================================
    # Part 4: Wi-Fi (802.11) vs 802.15.4 Spectral Overlap & Channel Coexistence
    # =========================================================================
    p4_say = [
        "Now we confront one of the most severe real-world operational challenges facing industrial and enterprise IoT deployments: Spectral Overlap and Coexistence between IEEE 802.15.4 and IEEE 802.11 (Wi-Fi).",
        "Both 802.15.4 (the foundation of Zigbee, Thread, 6LoWPAN, and WirelessHART) and 802.11b/g/n/ax (Wi-Fi) share the exact same 2.4 GHz ISM band. However, they compete for shared physical airspace under radically asymmetrical physical conditions.",
        "A typical commercial enterprise Wi-Fi access point transmits with substantial RF power (between +20 dBm and +30 dBm, representing 100 mW to 1.0 Watt of effective radiated power) across wide 20 MHz or 40 MHz channels. In stark contrast, an 802.15.4 sensor node broadcasts with modest power (typically 0 dBm to +8 dBm, representing a mere 1.0 mW to 6.3 mW) across a narrow 2 MHz channel.",
        "Because Wi-Fi transmitters radiate at power levels 100 to 1,000 times higher than an 802.15.4 radio, a nearby laptop downloading a large file or streaming video can completely overwhelm the low-noise amplifier (LNA) of an 802.15.4 receiver. This is the classic 'Near-Far Problem': the intense Wi-Fi signal desensitizes the 802.15.4 frontend, causing heavy packet loss, packet corruption, and endless MAC retransmissions that rapidly drain node batteries.",
        "To mitigate this cross-protocol interference, network engineers must analyze the spectral frequency map with precision. Standard 2.4 GHz Wi-Fi deployments in North America and worldwide utilize three primary non-overlapping channels: Wi-Fi Channel 1 (center 2412 MHz, covering 2401–2423 MHz), Wi-Fi Channel 6 (center 2437 MHz, covering 2426–2448 MHz), and Wi-Fi Channel 11 (center 2462 MHz, covering 2451–2473 MHz).",
        "When we overlay the sixteen 802.15.4 channels (11 through 26) across this Wi-Fi map, the severe conflict zones become obvious:",
        "Wi-Fi Channel 1 completely blankets 802.15.4 Channels 11, 12, 13, and 14. Wi-Fi Channel 6 obliterates 802.15.4 Channels 16, 17, 18, and 19. Wi-Fi Channel 11 blankets 802.15.4 Channels 21, 22, 23, and 24. Any 802.15.4 coordinator operating on these overlapping frequencies in an office or factory with active Wi-Fi will experience continuous packet collisions.",
        "However, careful mathematical examination of the spectrum reveals four precious 'quiet inter-channel guard gaps' where 802.15.4 signals escape the main spectral lobes of standard Wi-Fi transmissions: Channel 15 (2425 MHz, situated precisely in the gap between Wi-Fi Ch 1 and Ch 6), Channel 20 (2450 MHz, situated in the gap between Wi-Fi Ch 6 and Ch 11), Channel 25 (2475 MHz, sitting just past Wi-Fi Ch 11's upper skirt), and Channel 26 (2480 MHz).",
        "Channel 26 is uniquely advantageous: its center frequency of 2480 MHz places it entirely beyond the spectral mask of Wi-Fi Channel 11. In industrial facilities plagued by dense enterprise Wi-Fi interference, moving 802.15.4 coordinators from Channel 11 to Channel 25 or Channel 26 drops packet error rates from 45% down to under 0.5%. Note, however, that in North America, FCC rules restrict maximum transmit power on Channel 26 (often limited to +2 dBm to +3 dBm) to prevent out-of-band emissions into the restricted band above 2483.5 MHz.",
        "Understanding this spectral coexistence matrix is an essential competency for IoT architects. Proper channel planning during site surveys eliminates 95% of field connectivity issues before a single sensor node is mounted to the wall.",
        "In addition to manual static channel allocation, advanced modern industrial stacks (such as Thread and WirelessHART) implement dynamic channel agility or Channel Hopping (TSCH - Time Slotted Channel Hopping). By rapidly cycling transmissions across different channels for every successive time slot, TSCH guarantees that even if a Wi-Fi burst obliterates one packet on Channel 12, the subsequent retransmission occurs on Channel 20 or 26, ensuring deterministic message delivery."
    ]
    p4_example = "Imagine a peaceful park bench where two people are whispering (802.15.4). If three giant marching brass bands (Wi-Fi Channels 1, 6, and 11) march through the center of the lawn blasting trumpets at 100 decibels, the whisperers will be drowned out. But if the bench is positioned at the far edge of the park fence (Channel 26), the brass band's noise drops off, and the conversation flows uninterrupted."
    p4_code = """# Wi-Fi vs 802.15.4 Spectral Coexistence Analyzer
class SpectralCoexistenceAnalyzer:
    WIFI_CHANNELS_20MHZ = {
        1: (2401.0, 2423.0, 2412.0),
        6: (2426.0, 2448.0, 2437.0),
        11: (2451.0, 2473.0, 2462.0)
    }
    
    @classmethod
    def evaluate_802154_channel(cls, channel_154: int) -> dict:
        f_center = 2405.0 + 5.0 * (channel_154 - 11)
        # 802.15.4 occupies roughly +/- 1.0 MHz around center
        f_min = f_center - 1.0
        f_max = f_center + 1.0
        
        conflicts = []
        for wifi_ch, (w_min, w_max, w_center) in cls.WIFI_CHANNELS_20MHZ.items():
            # Check for spectral overlap
            if not (f_max < w_min or f_min > w_max):
                distance_to_center = abs(f_center - w_center)
                conflicts.append({
                    "wifi_ch": wifi_ch,
                    "distance_mhz": distance_to_center
                })
                
        is_safe = len(conflicts) == 0
        recommendation = "RECOMMENDED (INTERFERENCE-FREE)" if is_safe else "AVOID (HEAVY WI-FI CONFLICT)"
        if channel_154 in (15, 20):
            recommendation = "MODERATE (GUARD-BAND GAP, MINOR SIDELOBES)"
        if channel_154 == 26:
            recommendation = "BEST PRACTICE (TOTAL OUT-OF-BAND ISOLATION)"
            
        return {
            "channel": channel_154,
            "center_freq_mhz": f_center,
            "is_clear": is_safe,
            "conflicts": conflicts,
            "recommendation": recommendation
        }

analyzer = SpectralCoexistenceAnalyzer()
print("=== IEEE 802.15.4 vs 2.4 GHz Wi-Fi Spectral Coexistence ===")
for ch in [11, 15, 17, 20, 24, 25, 26]:
    report = analyzer.evaluate_802154_channel(ch)
    print(f"802.15.4 Ch {ch:02d} ({report['center_freq_mhz']:.1f} MHz): {report['recommendation']}")
    for c in report['conflicts']:
        print(f"   -> Overlaps with Wi-Fi Channel {c['wifi_ch']} (Delta: {c['distance_mhz']:.1f} MHz)")
"""
    p4_codeNotes = [
        "Models 20 MHz Wi-Fi channels 1, 6, and 11 spectral masks.",
        "Calculates exact overlap boundaries against IEEE 802.15.4 channels 11 through 26.",
        "Identifies optimal coexistence guard bands on channels 15, 20, 25, and 26."
    ]
    p4_tryIt = "Examine Channel 12 and verify that it experiences heavy co-channel overlap with Wi-Fi Channel 1."
    p4_check = {
        "question": "Which IEEE 802.15.4 channel offers the highest degree of isolation from standard enterprise Wi-Fi channels 1, 6, and 11?",
        "options": [
            "Channel 26 (center frequency 2480 MHz), which sits completely above the upper spectral skirt of Wi-Fi Channel 11.",
            "Channel 17 (center frequency 2435 MHz), because it sits near the center of the band.",
            "Channel 11 (center frequency 2405 MHz), because lower frequencies experience zero interference.",
            "Channel 18 (center frequency 2440 MHz), because Wi-Fi signals cannot penetrate 802.15.4 radios."
        ],
        "answer": 0,
        "why": "Option 0 is correct: Wi-Fi Channel 11 has an upper lobe edge at roughly 2473 MHz. IEEE 802.15.4 Channel 26 is centered at 2480 MHz (occupying 2479–2481 MHz), placing it entirely out of band from all three standard non-overlapping Wi-Fi channels (1, 6, and 11). Options 1, 2, and 3 place the 802.15.4 channel directly inside the high-power lobes of Wi-Fi Channel 6 or Channel 1."
    }

    # =========================================================================
    # Part 5: Complete 802.15.4 DSSS Symbol Spreader & Correlator Simulator
    # =========================================================================
    p5_say = [
        "To conclude Day 6, we integrate all physical-layer concepts into an end-to-end executable simulation: the complete IEEE 802.15.4 DSSS Symbol Spreader and Matched Filter Correlator Subsystem.",
        "In a real silicon transceiver (such as the Texas Instruments CC2652, Nordic Semiconductor nRF52840, or Silicon Labs EFR32 Mighty Gecko), incoming digital payload octets are streamed from the microcontroller's RAM via DMA directly into the radio's physical-layer FIFO buffer.",
        "The transmitter breaks each octet into two consecutive 4-bit nibbles: the least significant nibble (LSN, bits 0–3) followed by the most significant nibble (MSN, bits 4–7). Each nibble is translated via hardware table lookup into its corresponding 32-chip pseudo-random sequence from the official IEEE 802.15.4 codebook.",
        "These chips are then streamed at 2.0 Mchips/s into the O-QPSK modulator, half-sine shaped, upconverted to the selected 2.4 GHz channel frequency, and broadcast across the antenna into free space.",
        "Over the air, the signal encounters physical impairment: additive white Gaussian noise (AWGN), multipath phase cancellation, attenuation, and co-channel interference from neighboring networks. In our simulation, we model this hostile channel by injecting random bit/chip flip errors into the over-the-air chipstream at a severe 10% error rate.",
        "At the receiving antenna, the RF frontend downconverts the signal into I and Q baseband rails, digitizes the stream, and feeds the received chips into a bank of 16 cross-correlators. Each correlator computes the inner product between the incoming 32-chip block and one of the 16 reference symbol patterns.",
        "The symbol correlator that yields the highest correlation score is selected as the winning hypothesis. If the peak score exceeds a minimum threshold, the receiver accepts the decoded nibble; otherwise, a chip correlation error flag is raised to signal signal degradation.",
        "The decoded nibbles are then reassembled into full 8-bit octets and delivered into the MAC layer's receive buffer with complete data integrity. Because of the 9.03 dB processing gain, even when 10% of the individual chips are completely inverted by noise, the correlation peak remains decisive, and the original telemetry payload is reconstructed with 100% bit-perfect accuracy.",
        "Executing and testing this complete pipeline validates that the mathematical principles of DSSS spreading and O-QPSK modulation provide impermeable error resilience for mission-critical IoT telemetry in low-power wireless networks.",
        "To appreciate the hardware implementation inside modern silicon (such as the TI CC2652, Nordic nRF52840, or Silicon Labs EFR32), consider the receiver frontend architecture. Most modern transceivers employ a Low-IF or Zero-IF direct-conversion architecture. The incoming RF signal at 2.4 GHz is amplified by a low-noise amplifier (LNA) and mixed with local oscillator (LO) quadrature signals to produce analog baseband I and Q signals. These baseband signals pass through on-chip polyphase channel-select filters to reject out-of-band blockers before being digitized by high-speed analog-to-digital converters (ADCs) operating at an oversampling rate of 8 MSamples/s (4x oversampling relative to the 2.0 Mchips/s chipping rate).",
        "Within the digital baseband core, the receiver can implement either hard-decision or soft-decision correlation. A hard-decision correlator quantizes each incoming chip to a single binary bit (+1 or -1) before computing Hamming distances against the 16 reference templates. While computationally cheap and trivial to implement in discrete logic, hard-decision correlation sacrifices subtle energy information. In contrast, advanced industrial transceivers implement soft-decision correlation, feeding full 4-bit or 8-bit signed ADC sample values directly into the correlator accumulators. Soft-decision decoding extracts an additional 2.0 dB to 2.5 dB of effective signal-to-noise ratio (SNR) coding gain, allowing devices to maintain communication at extreme packet distances where hard-decision receivers drop the link.",
        "Finally, the receiver continuously calculates Link Quality Indicator (LQI) and Received Signal Strength Indicator (RSSI) metrics for every successfully received frame. The RSSI measures absolute RF power in dBm, while LQI measures the chip correlation peak sharpness (the margin between the winning correlation score and the second-highest runner-up). By delivering both RSSI and LQI to the upper MAC and routing layers, 802.15.4 enables dynamic link monitoring, allowing mesh routing protocols (like RPL and Thread) to route packets along reliable, high-LQI paths and bypass marginal links.",
        "By mastering this physical layer foundation, embedded engineers can configure transceivers, diagnose RF packet loss, and architect robust multi-hop mesh networks capable of surviving decades in the field.",
        "In subsequent lessons of Block 2, we will build directly upon this PHY foundation as we construct the MAC layer framing, CSMA/CA channel arbitration, and end-to-end network association engines."
    ]
    p5_example = "Think of sending a top-secret message broken into individual letters. Rather than shouting each letter, you play a 32-note musical chord for each letter. Even if static noise or someone slamming a door alters 5 of the notes in the chord, the musical ear recognizes the chord instantly and identifies the letter with 100% confidence."
    p5_code = """# Full IEEE 802.15.4 DSSS PHY Transmission, Channel & Reception Subsystem
import random

class IEEE802154PhyTransceiverPipeline:
    SYMBOL_CHIP_TABLE = [
        [1,1,0,1,1,0,0,1,1,1,0,0,0,0,1,1,0,1,0,1,0,0,1,0,0,0,1,0,1,1,1,0], # 0
        [1,1,1,0,1,1,0,1,1,0,0,1,1,1,0,0,0,0,1,1,0,1,0,1,0,0,1,0,0,0,1,0], # 1
        [0,0,1,0,1,1,1,0,1,1,0,1,1,0,0,1,1,1,0,0,0,0,1,1,0,1,0,1,0,0,1,0], # 2
        [0,0,1,0,0,0,1,0,1,1,1,0,1,1,0,1,1,0,0,1,1,1,0,0,0,0,1,1,0,1,0,1], # 3
        [0,1,0,1,0,0,1,0,0,0,1,0,1,1,1,0,1,1,0,1,1,0,0,1,1,1,0,0,0,0,1,1], # 4
        [0,0,1,1,0,1,0,1,0,0,1,0,0,0,1,0,1,1,1,0,1,1,0,1,1,0,0,1,1,1,0,0], # 5
        [1,1,0,0,0,0,1,1,0,1,0,1,0,0,1,0,0,0,1,0,1,1,1,0,1,1,0,1,1,0,0,1], # 6
        [1,0,0,1,1,1,0,0,0,0,1,1,0,1,0,1,0,0,1,0,0,0,1,0,1,1,1,0,1,1,0,1], # 7
        [1,0,0,0,1,1,0,0,1,0,0,1,0,1,1,0,0,0,0,0,0,1,1,1,0,1,1,1,1,0,1,1], # 8
        [1,0,1,1,1,0,0,0,1,1,0,0,1,0,0,1,0,1,1,0,0,0,0,0,0,1,1,1,0,1,1,1], # 9
        [0,1,1,1,1,0,1,1,1,0,0,0,1,1,0,0,1,0,0,1,0,1,1,0,0,0,0,0,0,1,1,1], # 10
        [0,1,1,1,0,1,1,1,1,0,1,1,1,0,0,0,1,1,0,0,1,0,0,1,0,1,1,0,0,0,0,0], # 11
        [0,0,0,0,0,1,1,1,0,1,1,1,1,0,1,1,1,0,0,0,1,1,0,0,1,0,0,1,0,1,1,0], # 12
        [0,1,1,0,0,0,0,0,0,1,1,1,0,1,1,1,1,0,1,1,1,0,0,0,1,1,0,0,1,0,0,1], # 13
        [1,0,0,1,0,1,1,0,0,0,0,0,0,1,1,1,0,1,1,1,1,0,1,1,1,0,0,0,1,1,0,0], # 14
        [1,1,0,0,1,0,0,1,0,1,1,0,0,0,0,0,0,1,1,1,0,1,1,1,1,0,1,1,1,0,0,0]  # 15
    ]
    
    def transmit_payload(self, payload: bytes) -> list[int]:
        chips = []
        for byte in payload:
            # LSB nibble first, then MSB nibble
            lsn = byte & 0x0F
            msn = (byte >> 4) & 0x0F
            chips.extend(self.SYMBOL_CHIP_TABLE[lsn])
            chips.extend(self.SYMBOL_CHIP_TABLE[msn])
        return chips
        
    def simulate_channel(self, chips: list[int], chip_error_rate: float = 0.10) -> list[int]:
        # Deterministic pseudo-random channel noise
        rng = random.Random(42)
        corrupted = list(chips)
        for i in range(len(corrupted)):
            if rng.random() < chip_error_rate:
                corrupted[i] = 1 - corrupted[i]
        return corrupted
        
    def receive_payload(self, chips: list[int]) -> bytes:
        decoded_bytes = bytearray()
        chips_per_symbol = 32
        num_symbols = len(chips) // chips_per_symbol
        
        symbols = []
        for s_idx in range(num_symbols):
            sub_chips = chips[s_idx * chips_per_symbol : (s_idx + 1) * chips_per_symbol]
            # Correlate
            best_sym = -1
            best_score = -9999
            for ref_sym, ref_chips in enumerate(self.SYMBOL_CHIP_TABLE):
                score = sum(1 if r == c else -1 for r, c in zip(ref_chips, sub_chips))
                if score > best_score:
                    best_score = score
                    best_sym = ref_sym
            symbols.append(best_sym)
            
        # Reassemble nibbles into bytes (pairs of LSN, MSN)
        for i in range(0, len(symbols), 2):
            lsn = symbols[i]
            msn = symbols[i + 1]
            byte_val = (msn << 4) | lsn
            decoded_bytes.append(byte_val)
            
        return bytes(decoded_bytes)

pipeline = IEEE802154PhyTransceiverPipeline()
original_data = b"IOT-802.15.4"

# 1. Transmit: Expand bytes to DSSS chip sequence
tx_chips = pipeline.transmit_payload(original_data)
# 2. Channel: Inject 10% severe chip error rate
rx_chips = pipeline.simulate_channel(tx_chips, chip_error_rate=0.10)
# 3. Receive: Matched correlator bank decoding
recovered_data = pipeline.receive_payload(rx_chips)

print("=== Full IEEE 802.15.4 DSSS Transceiver Simulation ===")
print(f"Original Payload: {original_data} ({len(original_data)} octets)")
print(f"Total DSSS Chips Broadcast: {len(tx_chips)} chips")
print(f"Total Chips Inverted by Noise: {sum(1 for a, b in zip(tx_chips, rx_chips) if a != b)} chips")
print(f"Recovered Payload: {recovered_data}")
print(f"End-to-End Integrity Verification: {'100% BIT-PERFECT RECOVERY' if recovered_data == original_data else 'FAILED'}")
"""
    p5_codeNotes = [
        "Constructs IEEE802154PhyTransceiverPipeline handling full serialization, spreading, and recovery.",
        "Splits payload bytes into LSN and MSN nibbles and maps each to 32-chip PN sequences.",
        "Injects a severe 10% random chip error rate and proves 100% bit-perfect recovery via matched correlators."
    ]
    p5_tryIt = "Increase the chip_error_rate to 0.22 (22% chip corruption) and observe at what noise threshold the correlator finally yields a bit error."
    p5_check = {
        "question": "In what order are the 4-bit nibbles of a data octet transmitted across the IEEE 802.15.4 physical layer?",
        "options": [
            "The least significant nibble (LSN, bits 0–3) is transmitted first, followed by the most significant nibble (MSN, bits 4–7).",
            "The most significant nibble (MSN, bits 4–7) is transmitted first, followed by the least significant nibble.",
            "All 8 bits are transmitted simultaneously over 8 parallel subcarriers.",
            "The nibbles are interleaved alternately bit-by-bit across dual antennas."
        ],
        "answer": 0,
        "why": "Option 0 accurately reflects the IEEE 802.15.4 standard specification: each data octet is divided into two 4-bit nibbles, with the lower nibble (bits 0–3) mapped to a 32-chip symbol and transmitted first, followed by the upper nibble (bits 4–7). Options 1, 2, and 3 describe alternative non-standard transmission schemes."
    }

    day6_data = {
        "coursePrefix": "iot_net",
        "day": 6,
        "title": "IEEE 802.15.4 Architecture, 2.4 GHz PHY & O-QPSK DSSS Modulation",
        "goal": "Master the physical-layer engineering of IEEE 802.15.4: 2.4 GHz channelization, O-QPSK constant-envelope modulation, 32-chip DSSS spreading, processing gain, and Wi-Fi coexistence.",
        "minutes": 38,
        "recap": "In Milestone 1, we architected low-power link budgets and 6LoWPAN border routers. Now in Block 2, we dive beneath the protocol stack to master the physical and MAC layers of IEEE 802.15.4.",
        "parts": [
            {
                "title": "IEEE 802.15.4 PHY Architecture & 2.4 GHz Channelization",
                "say": p1_say,
                "example": p1_example,
                "code": p1_code,
                "output": "",
                "codeNotes": p1_codeNotes,
                "tryIt": p1_tryIt,
                "check": p1_check
            },
            {
                "title": "Offset Quadrature Phase Shift Keying (O-QPSK) & Half-Sine Shaping",
                "say": p2_say,
                "example": p2_example,
                "code": p2_code,
                "output": "",
                "codeNotes": p2_codeNotes,
                "tryIt": p2_tryIt,
                "check": p2_check
            },
            {
                "title": "Direct Sequence Spread Spectrum (DSSS) & 32-Chip PN Spreading",
                "say": p3_say,
                "example": p3_example,
                "code": p3_code,
                "output": "",
                "codeNotes": p3_codeNotes,
                "tryIt": p3_tryIt,
                "check": p3_check
            },
            {
                "title": "Wi-Fi (802.11) vs 802.15.4 Spectral Overlap & Channel Coexistence",
                "say": p4_say,
                "example": p4_example,
                "code": p4_code,
                "output": "",
                "codeNotes": p4_codeNotes,
                "tryIt": p4_tryIt,
                "check": p4_check
            },
            {
                "title": "Complete 802.15.4 DSSS Symbol Spreader & Correlator Simulator",
                "say": p5_say,
                "example": p5_example,
                "code": p5_code,
                "output": "",
                "codeNotes": p5_codeNotes,
                "tryIt": p5_tryIt,
                "check": p5_check
            }
        ],
        "summary": [
            "IEEE 802.15.4 defines 16 channels in the 2.4 GHz ISM band (Channels 11–26, spaced 5 MHz apart) with a 127-byte maximum physical payload (PSDU).",
            "Offset QPSK (O-QPSK) staggers I and Q transitions by half a chip period, eliminating zero-crossing envelope collapses and allowing efficient non-linear power amplifiers.",
            "Half-sine pulse shaping makes O-QPSK mathematically equivalent to Minimum Shift Keying (MSK), delivering constant-envelope power efficiency.",
            "DSSS expands each 4-bit nibble into a 32-chip quasi-orthogonal sequence, providing ~9.03 dB of processing gain to extract signals from beneath the noise floor.",
            "Channels 15, 20, 25, and especially 26 provide critical guard-band isolation from high-power enterprise Wi-Fi channels 1, 6, and 11."
        ],
        "projectStep": {
            "title": "IEEE 802.15.4 Physical Layer Transceiver Engineering",
            "steps": [
                "Implement the 2.4 GHz channel center frequency calculator across Channels 11 through 26.",
                "Model O-QPSK half-sine pulse shaping and verify non-zero envelope magnitude trajectories.",
                "Construct the 16-entry 32-chip PN spreading codebook and implement matched filter correlation.",
                "Simulate Wi-Fi spectral interference and compute SINR degradation across overlapping channels.",
                "Synthesize the complete IEEE802154PhyTransceiverPipeline and verify error-free recovery under a 10% chip error rate."
            ]
        }
    }

    # Execute all code snippets dynamically to guarantee 100% exact output match
    for idx, p in enumerate(day6_data["parts"]):
        proc = subprocess.run([sys.executable, "-c", p["code"]], capture_output=True, text=True)
        if proc.returncode != 0:
            print(f"Day 6 Part {idx+1} execution error:\n{proc.stderr}")
            sys.exit(1)
        p["output"] = proc.stdout.strip()

    wcs = [len(" ".join(p["say"]).split()) for p in day6_data["parts"]]
    print(f"Day 6 Word Counts: {wcs} (Total: {sum(wcs)} words)")
    for idx, wc in enumerate(wcs):
        assert wc >= 580, f"Part {idx+1} word count {wc} < 580!"

    with open("scripts/iot_net_day6.json", "w", encoding="utf-8") as f:
        json.dump(day6_data, f, indent=2, ensure_ascii=False)
    print("Successfully built scripts/iot_net_day6.json!")

if __name__ == '__main__':
    build_day6()
