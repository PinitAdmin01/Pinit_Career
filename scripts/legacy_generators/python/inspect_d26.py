with open('scripts/build_iot_net_day26.py', encoding='utf-8') as f:
    text = f.read()

idx = text.find('part_meta = [')
print(text[idx+1800:idx+4500])
