# scripts/assemble_iot_net_block3.py
import json

print("=== ASSEMBLING IOT_NET BLOCK 3 (DAYS 11-15) ===")
days = []
for d in range(11, 16):
    filename = f"scripts/iot_net_day{d}.json"
    with open(filename, "r", encoding="utf-8") as f:
        data = json.load(f)
    assert data["day"] == d, f"Day mismatch in {filename}"
    assert len(data["parts"]) == 5, f"Parts count mismatch in Day {d}"
    assert data["minutes"] == 38, f"Minutes != 38 in Day {d}"
    total_wc = 0
    for p_idx, part in enumerate(data["parts"]):
        wc = len(" ".join(part["say"]).split())
        total_wc += wc
        assert wc >= 580, f"Day {d} Part {p_idx+1} word count {wc} < 580"
        assert part["check"]["answer"] == 0, f"Day {d} Part {p_idx+1} check answer != 0"
        assert len(part["check"]["options"]) == 4, f"Day {d} Part {p_idx+1} options != 4"
        assert len(part["output"]) > 0, f"Day {d} Part {p_idx+1} output empty"
    assert total_wc >= 3000, f"Day {d} total word count {total_wc} < 3000"
    days.append(data)
    print(f"Day {d}: Verified! (5 parts, all >= 580 words, total {total_wc} words, exact outputs captured)")

with open("scripts/block3_iot_net_all_days.json", "w", encoding="utf-8") as f:
    json.dump(days, f, indent=2, ensure_ascii=False)

print("Successfully written scripts/block3_iot_net_all_days.json with 5 verified days!")
