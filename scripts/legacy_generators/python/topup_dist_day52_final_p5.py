# scripts/topup_dist_day52_final_p5.py

with open("scripts/create_dist_day52_data.py", "r", encoding="utf-8") as f:
    content = f.read()

target = '"Notice how the production audit confirms 15,000,000 requests'
extra = '''    "By unifying transparent network interception, zero-trust cryptographic mutual TLS, fine-grained canary shifting, and agile circuit breaking, your production service mesh represents an impregnable traffic backbone for cloud-native enterprise operations.",
    "Notice how the production audit confirms 15,000,000 requests'''

content = content.replace(target, extra)

with open("scripts/create_dist_day52_data.py", "w", encoding="utf-8") as f:
    f.write(content)

print("Topped up Part 5 of Day 52!")
