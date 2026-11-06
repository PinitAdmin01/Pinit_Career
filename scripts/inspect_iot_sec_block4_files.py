import json, os, sys

sys.stdout.reconfigure(encoding='utf-8')

for d in range(16, 21):
    fpath = f"scripts/iot_sec_day{d}.json"
    if os.path.exists(fpath):
        with open(fpath, "r", encoding="utf-8") as f:
            data = json.load(f)
        wc_parts = [sum(len(s.split()) for s in p["say"]) for p in data["parts"]]
        print(f"Day {d}: {data['title'][:60]}... | Total Words: {sum(wc_parts)} | Parts: {wc_parts}")
    else:
        print(f"Day {d}: File not found ({fpath})")
