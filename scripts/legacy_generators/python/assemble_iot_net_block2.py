# scripts/assemble_iot_net_block2.py
import json

print("=== ASSEMBLING IOT_NET BLOCK 2 (DAYS 6-10) ===")
days = []
for d in range(6, 11):
    filename = f"scripts/iot_net_day{d}.json"
    with open(filename, "r", encoding="utf-8") as f:
        data = json.load(f)
    assert data["day"] == d, f"Day mismatch in {filename}"
    assert len(data["parts"]) == 5, f"Parts count mismatch in Day {d}"
    assert data["minutes"] == 38, f"Minutes != 38 in Day {d}"
    for p_idx, part in enumerate(data["parts"]):
        wc = len(" ".join(part["say"]).split())
        assert wc >= 580, f"Day {d} Part {p_idx+1} word count {wc} < 580"
        assert part["check"]["answer"] == 0, f"Day {d} Part {p_idx+1} check answer != 0"
        assert len(part["check"]["options"]) == 4, f"Day {d} Part {p_idx+1} options != 4"
        assert len(part["output"]) > 0, f"Day {d} Part {p_idx+1} output empty"
    days.append(data)
    print(f"Day {d}: Verified! (5 parts, all >= 580 words, exact outputs captured)")

with open("scripts/block2_iot_net_all_days.json", "w", encoding="utf-8") as f:
    json.dump(days, f, indent=2, ensure_ascii=False)

print("Successfully written scripts/block2_iot_net_all_days.json with 5 verified days!")
