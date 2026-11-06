with open("scripts/build_iot_sec_day55.py", "r", encoding="utf-8") as f:
    text = f.read()

p5_more = '''        "In enterprise IoT fleet management systems, remote attestation is the cornerstone of distributed zero-trust security. During the execution of Stage 5, our QuantumShield engine generates a signed Remote Attestation Token containing the device silicon serial number, the current monotonic eFuse SVN floor, and a cryptographic measurement PCR log of the newly booted firmware. This attestation token is signed using the device's composite ECDSA + ML-DSA private key, allowing cloud fleet managers to cryptographically verify device health before granting network access.",
        "Furthermore, the memory protection architecture strictly enforces spatial isolation during the entire boot sequence. Using the ARM Cortex-M Memory Protection Unit (MPU), the bootloader configures execute-never (XN) permissions across all data scratchpads and write-protects the active Flash sectors holding the newly staged firmware binary. These hardware memory attributes prevent return-oriented programming (ROP) and code injection exploits even in the event of unforeseen memory bugs in user application tasks.",
        "As we finalize this milestone capstone, the successful demonstration of the QuantumShield Dual-Engine Hybrid Root of Trust platform marks a decisive architectural breakthrough. It provides embedded systems engineers with an empirical, battle-tested blueprint for navigating the post-quantum cryptographic transition with zero compromises on performance, physical assurance, or device lifecycle longevity."'''

pos = text.find('p5_say = [')
end_pos = text.find('    ]', pos)
text = text[:end_pos] + ',\n' + p5_more + '\n' + text[end_pos:]

with open("scripts/build_iot_sec_day55.py", "w", encoding="utf-8") as f:
    f.write(text)

print("Boosted Part 5 of Day 55!")
