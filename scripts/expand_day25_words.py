# scripts/expand_day25_words.py
import json

with open("scripts/iot_net_day25.json", "r", encoding="utf-8") as f:
    d = json.load(f)

expansions = {
    0: (
        "In mission-critical wireless systems such as smart electricity metering and industrial SCADA telemetry, "
        "the management of frame counter rollover is governed by strict cryptographic standards. "
        "A 32-bit unsigned integer counter provides exactly 4,294,967,295 unique frame values. "
        "Under no circumstances is a counter permitted to roll over from 0xFFFFFFFF back to 0x00000000 while using the same cryptographic session key. "
        "If a key were reused after counter rollover, identical nonces would encrypt different messages under the same keystream, "
        "completely destroying AES-CTR confidentiality and allowing attackers to perform trivial two-time pad XOR cryptanalysis. "
        "To prevent rollover disasters, IEEE 802.15.4 and LoRaWAN firmware triggers an automatic Key Renegotiation Handshake when the frame counter "
        "reaches a safety high-water mark (typically 2^31 or 90% of maximum). If re-keying cannot be completed before the counter exhausts its space, "
        "the device halts radio transmission, ensuring cryptographic boundaries remain inviolate."
    ),
    1: (
        "In addition to checkpointing, ultra-low-power industrial sensor nodes employ FRAM (Ferroelectric Random Access Memory) or EEPROM emulation "
        "with circular record pointers to maximize hardware longevity. Unlike standard NOR flash that requires block-level erasing before rewriting, "
        "FRAM allows single-byte writes with virtually unlimited write endurance (exceeding 10^14 write cycles) and negligible energy expenditure. "
        "When using standard flash memory, firmware engineers allocate a dedicated flash sector as a circular ring buffer of 4-byte counter entries. "
        "The firmware appends each new counter value sequentially to the next 32-bit word in the sector. Only when the entire 4-kilobyte flash sector "
        "is filled (after 1,024 write operations) is an erase cycle performed. Combining circular sector logging with periodic checkpointing reduces "
        "physical silicon degradation to imperceptible levels, guaranteeing that utility meters operate continuously for decades without flash failure."
    ),
    2: (
        "Protocol-aware reactive jamming presents an even more insidious threat than simple continuous carrier noise. "
        "In a reactive jamming attack, the adversary's SDR receiver remains completely silent, monitoring the RF channel until it detects the specific "
        "preamble and Start-of-Frame Delimiter (SFD) of an IEEE 802.15.4 frame. The moment the SFD is detected, the jammer transmits a microsecond "
        "burst of noise over the PHY header or FCS checksum, corrupting the packet while maintaining a low average RF power footprint that evades "
        "simple noise floor threshold detectors. To defeat reactive jammers, advanced industrial mesh protocols deploy Time-Slotted Channel Hopping (TSCH). "
        "Under TSCH, nodes hop to a pseudo-random frequency channel on every single 10-millisecond time slot using an agreed cryptographic hopping sequence, "
        "rendering reactive jammers incapable of predicting or intercepting subsequent transmissions."
    ),
    3: (
        "Hardware tamper detection envelopes extend far beyond simple micro-mechanical switches on the outer casing. "
        "High-assurance cryptographic modules conforming to FIPS 140-3 Level 4 incorporate continuous active tamper mesh layers embedded within the PCB itself. "
        "A serpentine trace of microscopic copper wires is routed on internal PCB layers directly surrounding the Secure Element and microcontroller. "
        "The Secure Element injects a continuous pseudo-random pulse train through the serpentine trace. If an attacker attempts to drill through the PCB, "
        "use laser cutting, or apply focused ion beams to probe silicon bond wires, the serpentine trace is cut or shorted. "
        "This instantaneous circuit disruption triggers the tamper interrupt, firing the zeroization circuit and wiping all internal cryptographic keys "
        "in less than 2 microseconds, ensuring that hardware attacks yield zero intelligence to the adversary."
    ),
    4: (
        "The convergence of physical tamper resilience, spectral agility, and link-layer cryptographic integrity represents the gold standard "
        "of sovereign cyber-physical system design. In military logistics, municipal water filtration, and electrical grid substations, "
        "an IoT node is not merely a telemetry sensor; it is an active physical actuator whose compromise could disrupt civil infrastructure. "
        "By enforcing strict monotonic counter invariants, isolating non-volatile storage from flash wear-out, autonomously evading hostile jamming "
        "through channel hopping, and engineering instant zeroization upon chassis breach, our master security architecture delivers mathematically proven, "
        "defense-in-depth protection. This sovereign security paradigm ensures that industrial IoT networks remain uncompromised, resilient, and fully operational "
        "under the most hostile electronic warfare and physical espionage conditions."
    )
}

for idx, exp in expansions.items():
    d["parts"][idx]["say"].append(exp)

with open("scripts/iot_net_day25.json", "w", encoding="utf-8") as f:
    json.dump(d, f, indent=2)

print("Expanded scripts/iot_net_day25.json successfully.")
