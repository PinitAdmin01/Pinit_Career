with open("scripts/build_iot_sec_day59.py", "r", encoding="utf-8") as f:
    text = f.read()

p3_more = '''        "Additionally, the battery-backed tamper logging register incorporates non-volatile counter latches that record the precise duration of any environmental excursion. If an adversary attempts a brief, transient temperature dip or momentary lid opening hoping the circuit will self-reset when normal conditions resume, the hardware latch permanently preserves the trip state until an authenticated factory service tool clears the register with an authorized cryptographic token."'''

p5_more = '''        "In enterprise industrial facility management, automated incident containment is the vital link between detection and disaster prevention. When the emergency siren packet is received by the plant SCADA monitoring network, automated security orchestrators can instantly isolate the affected network segment, transition downstream industrial processes to safe shutdown states, and dispatch physical security personnel to the exact coordinates of the compromised device.",
        "Moreover, the complete firmware architecture of Day 59 bridges the divide between regulatory compliance and operational realpolitik. Far too often, compliance is treated as a superficial paperwork exercise consisting of checklist self-attestations. Our implementation proves that genuine ISA/IEC 62443-4-2 Security Level 4 resilience is achievable on production embedded microcontrollers through disciplined, defense-in-depth hardware and software engineering.",
        "As we conclude Day 59, our industrial IoT security foundation stands complete: from quantum-resilient lattice mathematics and physical side-channel defenses to zero-trust mesh networking, hardware Secure Elements, formal protocol proofs, and automated SL4 incident response. Everything is now poised for our final milestone capstone tomorrow."'''

pos3 = text.find('p3_say = [')
end3 = text.find('    ]', pos3)
text = text[:end3] + ',\n' + p3_more + '\n' + text[end3:]

pos5 = text.find('p5_say = [')
end5 = text.find('    ]', pos5)
text = text[:end5] + ',\n' + p5_more + '\n' + text[end5:]

with open("scripts/build_iot_sec_day59.py", "w", encoding="utf-8") as f:
    f.write(text)

print("Boosted Parts 3 and 5 of Day 59!")
