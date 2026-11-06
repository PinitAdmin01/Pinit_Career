with open("scripts/build_iot_sec_day57.py", "r", encoding="utf-8") as f:
    text = f.read()

p4_more = '''        "Additionally, the ISO 7816-4 error handling architecture maps hardware failure modes into standardized 2-byte status words. When an incoming APDU requests access to a slot protected by a hardware lock without establishing prior IO bus encryption, the Secure Element does not panic or return vague errors. Instead, it returns SW = 0x6982 (Security status not satisfied), allowing the host firmware driver to cleanly identify the authentication deficiency and initiate re-authentication without destabilizing the operating system."'''

p5_more = '''        "In enterprise IoT deployments spanning millions of distributed edge devices, hardware-based root of trust enables zero-touch cloud onboarding. When a newly powered device contacts the enterprise device management platform, it presents its factory-provisioned certificate and proves possession of its private key via an APDU-delegated signature. The cloud platform verifies the signature against the manufacturer's root CA, automatically registers the device, and provisions operational certificates without requiring any manual technician intervention on the factory floor."'''

pos4 = text.find('p4_say = [')
end4 = text.find('    ]', pos4)
text = text[:end4] + ',\n' + p4_more + '\n' + text[end4:]

pos5 = text.find('p5_say = [')
end5 = text.find('    ]', pos5)
text = text[:end5] + ',\n' + p5_more + '\n' + text[end5:]

with open("scripts/build_iot_sec_day57.py", "w", encoding="utf-8") as f:
    f.write(text)

print("Boosted Parts 4 and 5 of Day 57!")
