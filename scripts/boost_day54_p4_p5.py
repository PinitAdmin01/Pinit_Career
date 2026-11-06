with open("scripts/build_iot_sec_day54.py", "r", encoding="utf-8") as f:
    text = f.read()

p4_extra2 = '''        "Furthermore, the fault injection detection logic introduces randomized timing delays (jitter insertion) prior to sensitive branch evaluations. By perturbing the execution cycle count using a hardware True Random Number Generator (TRNG), the temporal window required for high-precision laser fault injection or clock glitching is continually randomized, increasing the difficulty of successful fault synchronization by several orders of magnitude."'''

p5_extra2 = '''        "Finally, the atomic eFuse advance in Stage 5 guarantees that the security version floor is permanently locked before the bootloader transfers execution control to the operating system kernel. This unyielding verification architecture delivers verifiable Common Criteria EAL5+ physical assurance and CNSA 2.0 quantum resilience, safeguarding industrial IoT devices across decades of harsh deployed operation."'''

pos4 = text.find('p4_say = [')
end4 = text.find('    ]', pos4)
text = text[:end4] + ',\n' + p4_extra2 + '\n' + text[end4:]

pos5 = text.find('p5_say = [')
end5 = text.find('    ]', pos5)
text = text[:end5] + ',\n' + p5_extra2 + '\n' + text[end5:]

with open("scripts/build_iot_sec_day54.py", "w", encoding="utf-8") as f:
    f.write(text)

print("Boosted Part 4 and 5 of Day 54!")
