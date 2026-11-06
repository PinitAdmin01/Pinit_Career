import json
import sys
from day46_builder import build_day46
from day47_builder import build_day47
from day48_builder import build_day48
from day49_builder import build_day49
from day50_builder import build_day50

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

def compile_block10():
    print("Compiling Block 10 (Days 46-50) for Course 31: bcom_ait...")
    d46 = build_day46()
    d47 = build_day47()
    d48 = build_day48()
    d49 = build_day49()
    d50 = build_day50()
    
    block10 = [d46, d47, d48, d49, d50]
    assert len(block10) == 5, f"Expected 5 days, got {len(block10)}"
    
    total_block_words = 0
    total_parts = 0
    
    for day_idx, day in enumerate(block10):
        day_num = day["day"]
        expected_day = 46 + day_idx
        assert day_num == expected_day, f"Expected day {expected_day}, got {day_num}"
        assert len(day["parts"]) == 5, f"Day {day_num} must have exactly 5 parts, got {len(day['parts'])}"
        
        day_words = 0
        for part_idx, part in enumerate(day["parts"]):
            total_parts += 1
            words = sum(len(p.split()) for p in part["say"])
            day_words += words
            assert words >= 600, f"Day {day_num} Part {part_idx+1} word shortfall: {words} < 600"
            assert part["example"], f"Day {day_num} Part {part_idx+1} missing example"
            assert part["code"], f"Day {day_num} Part {part_idx+1} missing code"
            assert part["output"], f"Day {day_num} Part {part_idx+1} missing output"
            assert len(part["codeNotes"]) >= 4, f"Day {day_num} Part {part_idx+1} codeNotes < 4"
            assert part["tryIt"], f"Day {day_num} Part {part_idx+1} missing tryIt"
            
            check = part["check"]
            assert len(check["options"]) == 4, f"Day {day_num} Part {part_idx+1} options != 4"
            assert check["answer"] == 0, f"Day {day_num} Part {part_idx+1} answer != 0"
            assert check["answerIndex"] == 0, f"Day {day_num} Part {part_idx+1} answerIndex != 0"
            assert check["why"], f"Day {day_num} Part {part_idx+1} missing why"
            
        print(f"Day {day_num} Verified: 5 parts, {day_words} words (all parts >= 600 words)")
        assert day_words >= 3000, f"Day {day_num} total words shortfall: {day_words} < 3000"
        total_block_words += day_words
        
    print(f"\n==========================================")
    print(f"Block 10 Compilation Summary:")
    print(f"Total Days: {len(block10)} (Days 46 to 50)")
    print(f"Total Parts: {total_parts} (Exactly 25 parts)")
    print(f"Total Words: {total_block_words} (Average {total_block_words/25:.1f} words/part)")
    print(f"==========================================\n")
    
    out_path = "scripts/data_bcom_ait_block10.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(block10, f, indent=2, ensure_ascii=False)
        
    print(f"SUCCESS: Saved compiled Block 10 payload to {out_path}!")

if __name__ == "__main__":
    compile_block10()
