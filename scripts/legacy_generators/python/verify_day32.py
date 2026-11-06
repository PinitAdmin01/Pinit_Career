# scripts/verify_day32.py
import json
import subprocess
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def verify():
    with open('scripts/iot_sec_day32.json', 'r', encoding='utf-8') as f:
        d = json.load(f)

    print(f"Verifying Day {d['day']}: {d['title']}")
    for i, p in enumerate(d['parts']):
        text = ' '.join(p['say']) if isinstance(p['say'], list) else p['say']
        words = len(text.split())
        print(f"Part {i+1}: {words} words")
        assert words >= 580, f"Part {i+1} has {words} words, must be >= 580"

    for i, p in enumerate(d['parts']):
        res = subprocess.run([sys.executable, '-'], input=p['code'], text=True, capture_output=True)
        if res.returncode != 0:
            print(f"Part {i+1} execution error:\n{res.stderr}")
            sys.exit(1)
        p['output'] = res.stdout
        print(f"Part {i+1} code & output synced!")

    with open('scripts/iot_sec_day32.json', 'w', encoding='utf-8') as f:
        json.dump(d, f, indent=2)

    print("ALL DAY 32 CHECKS PASSED 100%!")

if __name__ == '__main__':
    verify()
