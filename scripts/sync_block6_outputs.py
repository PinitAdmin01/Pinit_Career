# scripts/sync_block6_outputs.py
import json
import subprocess
import sys

for day in range(26, 31):
    filename = f"scripts/iot_sec_day{day}.json"
    with open(filename, "r", encoding="utf-8") as f:
        d = json.load(f)

    for i, p in enumerate(d["parts"]):
        res = subprocess.run([sys.executable, "-"], input=p["code"], text=True, capture_output=True)
        if res.returncode != 0:
            print(f"Error on Day {day} Part {i+1}: {res.stderr}")
            sys.exit(1)
        p["output"] = res.stdout

    with open(filename, "w", encoding="utf-8") as f:
        json.dump(d, f, indent=2)

print("Synchronized all outputs for Days 26 to 30!")
