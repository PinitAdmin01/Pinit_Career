with open('scripts/build_iot_sec_day54.py', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('fake_ecc_sig = b"\\xAA" * 64', 'fake_ecc_sig = bytes([0xAA] * 64)')
text = text.replace('fake_pqc_sig = b"\\xBB" * 3309', 'fake_pqc_sig = bytes([0xBB] * 3309)')
# In case it has direct non-ascii characters:
import re
text = re.sub(r'fake_ecc_sig = b".*" \* 64', 'fake_ecc_sig = bytes([0xAA] * 64)', text)
text = re.sub(r'fake_pqc_sig = b".*" \* 3309', 'fake_pqc_sig = bytes([0xBB] * 3309)', text)

with open('scripts/build_iot_sec_day54.py', 'w', encoding='utf-8') as f:
    f.write(text)

print('Fixed byte literals in build_iot_sec_day54.py!')
