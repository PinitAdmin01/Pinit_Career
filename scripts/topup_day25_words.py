# scripts/topup_day25_words.py
import json

with open("scripts/iot_net_day25.json", "r", encoding="utf-8") as f:
    d = json.load(f)

topups = {
    1: (
        "Furthermore, modern microcontrollers integrate dedicated hardware wear-leveling controllers directly into on-chip flash memory controllers. "
        "These hardware blocks automatically distribute writes across multiple physical sectors without requiring complex software tracking, "
        "providing seamless non-volatile persistence that guarantees monotonic frame counter integrity across decades of continuous unattended deployment."
    ),
    2: (
        "In enterprise mesh gateways, jamming detection algorithms also correlate link-layer packet loss metrics with physical layer RSSI shifts. "
        "If frame error rates spike from 1% to 100% while ambient RSSI simultaneously jumps by 30 dB, the gateway confirms an active jammer and immediately "
        "transmits an urgent out-of-band cellular or satellite alert to the security operations center before executing automated channel hopping."
    ),
    3: (
        "In addition to active PCB meshes, environmental sensors monitor ambient temperature, clock glitching, and supply voltage fluctuations. "
        "If an attacker attempts to freeze the chip using liquid nitrogen to prolong SRAM retention or inject voltage spikes to bypass instruction checks, "
        "the Secure Element detects the physical out-of-bounds anomaly and executes instantaneous zeroization before any secrets can be compromised."
    ),
    4: (
        "As you complete this masterclass, recognize that every layer of the IoT networking stack—from the application payload down to the physical silicon— "
        "must be architected with sovereign zero-trust principles. By mastering the synergy between monotonic link-layer counters, robust wear-leveling, "
        "spectral jamming evasion, and physical zeroization, you stand among the elite elite firmware engineers capable of defending mission-critical "
        "infrastructure against the most sophisticated cyber and physical threats on earth."
    )
}

for idx, text in topups.items():
    d["parts"][idx]["say"].append(text)

with open("scripts/iot_net_day25.json", "w", encoding="utf-8") as f:
    json.dump(d, f, indent=2)

print("Topped up Day 25 words successfully.")
