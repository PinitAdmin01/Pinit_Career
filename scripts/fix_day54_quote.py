with open('scripts/build_iot_sec_day54.py', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('"""Production-grade hybrid secure bootloader executing 5-stage verification gating."""', '# Production-grade hybrid secure bootloader executing 5-stage verification gating')

with open('scripts/build_iot_sec_day54.py', 'w', encoding='utf-8') as f:
    f.write(text)

print('Replaced successfully!')
