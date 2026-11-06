import json
import subprocess
import sys

with open('scripts/iot_sec_day29.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

for i, p in enumerate(d['parts']):
    res = subprocess.run([sys.executable, '-'], input=p['code'], text=True, capture_output=True)
    p['output'] = res.stdout

with open('scripts/iot_sec_day29.json', 'w', encoding='utf-8') as f:
    json.dump(d, f, indent=2)

print("Synchronized all Day 29 outputs with actual stdout!")
