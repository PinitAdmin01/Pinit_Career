# scripts/assemble_iot_net_block5.py
import json

print("=== ASSEMBLING IOT_NET BLOCK 5 (DAYS 21-25) ===")

days = []
for d_num in range(21, 26):
    file_path = f"scripts/iot_net_day{d_num}.json"
    with open(file_path, "r", encoding="utf-8") as f:
        day_data = json.load(f)
        
    # Verify invariants
    assert day_data["coursePrefix"] == "iot_net"
    assert day_data["day"] == d_num
    assert len(day_data["parts"]) == 5
    assert "summary" in day_data and len(day_data["summary"]) >= 4
    
    day_words = 0
    for p_idx, part in enumerate(day_data["parts"]):
        assert "title" in part
        assert "say" in part
        assert "example" in part
        assert "code" in part
        assert "output" in part
        assert "codeNotes" in part and len(part["codeNotes"]) >= 3
        assert "tryIt" in part and len(part["tryIt"]) > 10
        assert "check" in part and "question" in part["check"]
        assert part["check"]["answer"] == 0
        
        words = len(" ".join(part["say"]).split()) if isinstance(part["say"], list) else len(part["say"].split())
        assert words >= 580, f"Day {d_num} Part {p_idx+1} has only {words} words (< 580)!"
        day_words += words
        
    assert day_words >= 3000, f"Day {d_num} has only {day_words} words (< 3000)!"
    print(f"Day {d_num} Invariants Verified: 5 parts, {day_words} total words.")
    days.append(day_data)

with open("scripts/block5_iot_net_all_days.json", "w", encoding="utf-8") as f:
    json.dump(days, f, indent=2, ensure_ascii=False)

print(f"Successfully assembled all 5 days ({len(days)} days) into scripts/block5_iot_net_all_days.json!")
