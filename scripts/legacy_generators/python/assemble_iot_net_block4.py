# scripts/assemble_iot_net_block4.py
import json

days = []
for d in range(16, 21):
    path = f"scripts/iot_net_day{d}.json"
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
        days.append(data)

print(f"Loaded {len(days)} days for Block 4 (Days 16-20).")

total_words = 0
for d_data in days:
    d_num = d_data["day"]
    d_title = d_data["title"]
    parts = d_data["parts"]
    d_words = 0
    print(f"\nDay {d_num}: {d_title}")
    assert len(parts) == 5, f"Day {d_num} must have exactly 5 parts"
    for i, p in enumerate(parts):
        words = len(" ".join(p["say"]).split())
        d_words += words
        print(f"  Part {i+1}: {words} words - '{p['title']}'")
        assert words >= 580, f"Day {d_num} Part {i+1} has {words} words, below 580 requirement"
        assert p["code"] and len(p["code"]) > 0, f"Day {d_num} Part {i+1} missing code"
        assert p["output"] and len(p["output"]) > 0, f"Day {d_num} Part {i+1} missing output"
    print(f"  Total Day {d_num} words: {d_words}")
    assert d_words >= 3000, f"Day {d_num} total words {d_words} below 3000 requirement"
    total_words += d_words

print(f"\nAll invariants validated! Total Block 4 Words: {total_words}")

with open("scripts/block4_iot_net_all_days.json", "w", encoding="utf-8") as f:
    json.dump(days, f, indent=2)
print("Saved to scripts/block4_iot_net_all_days.json")
