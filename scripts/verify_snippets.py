import json
import subprocess

with open('scripts/block7_iot_net_all_days.json', 'r', encoding='utf-8') as f:
    days = json.load(f)

for day in days:
    for idx, part in enumerate(day['parts']):
        code = part['code']
        try:
            res = subprocess.run(['python', '-c', code], capture_output=True, text=True, check=True)
            expected = part['output'].strip().replace('\r\n', '\n')
            actual = res.stdout.strip().replace('\r\n', '\n')
            if expected != actual:
                print(f"OUTPUT MISMATCH: Day {day['day']} Part {idx+1}")
                print("EXPECTED:\n", expected)
                print("ACTUAL:\n", actual)
        except subprocess.CalledProcessError as e:
            print(f"FAILED: Day {day['day']} Part {idx+1}: {e.stderr}")

print("Check finished.")
