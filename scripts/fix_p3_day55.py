with open('scripts/build_iot_sec_day55.py', 'r', encoding='utf-8') as f:
    text = f.read()

target = '"Today, we construct the complete Dual-Signature Secure Boot Verification Engine'
addition = '"Furthermore, QuantumShield implements an on-chip dual-root key revocation mechanism. The eFuse matrix contains multiple root certificate slots: primary and backup keys for both classical and post-quantum algorithms. If a corporate signing key is compromised, an authenticated revocation manifest burns a dedicated revocation fuse, permanently invalidating the compromised root key while seamlessly activating the backup root certificate with zero device downtime.",\n        '

assert target in text, "Target string not found!"
text = text.replace(target, addition + target, 1)

with open('scripts/build_iot_sec_day55.py', 'w', encoding='utf-8') as f:
    f.write(text)

print('Successfully added paragraph to Day 55 Part 3!')
