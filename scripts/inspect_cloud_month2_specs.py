# scripts/inspect_cloud_month2_specs.py
import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/visuals/cloud-masterclass-spec.ts', 'r', encoding='utf-8') as f:
    text = f.read()

m2_idx = text.find('CLOUD_MONTH_2_SPECS')
if m2_idx != -1:
    m2_text = text[m2_idx:]
    days = re.findall(r'day:\s*(\d+),\s*month:\s*2,\s*blockNum:\s*(\d+),\s*title:\s*["\']([^"\']+)["\']', m2_text)
    print(f"Total Month 2 Days found in spec: {len(days)}")
    for d, b, t in days:
        print(f"Day {d} (Block {b}): {t}")
else:
    print("Could not find CLOUD_MONTH_2_SPECS")
