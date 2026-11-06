import json
import subprocess

with open("scripts/iot_net_day24.json", "r", encoding="utf-8") as f:
    d = json.load(f)

print(f"=== DAY {d['day']}: {d['title']} ===")
total_words = 0
for idx, p in enumerate(d["parts"]):
    say_text = " ".join(p["say"]) if isinstance(p["say"], list) else p["say"]
    w_count = len(say_text.split())
    total_words += w_count
    print(f"Part {idx+1} '{p['title'][:35]}': {w_count} words (>=580: {w_count >= 580})")
    
    # Run code and verify output
    res = subprocess.run(["python", "-c", p["code"]], capture_output=True, text=True)
    if res.returncode != 0:
        print(f"  ERR in Part {idx+1}: {res.stderr}")
    else:
        out_match = res.stdout.strip() == p["output"].strip()
        print(f"  Code exec: OK, Output matches: {out_match}")
        if not out_match:
            print(f"    Expected:\n{p['output']}")
            print(f"    Actual:\n{res.stdout}")

print(f"Total Day Words: {total_words} (>=3000: {total_words >= 3000})")
