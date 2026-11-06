import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('tests/iot_net_days56_60_expansion.test.ts', 'r', encoding='utf-8') as f:
    print(f.read()[:3000])
