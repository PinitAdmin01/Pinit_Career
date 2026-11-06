import json
import sys
import os

# Ensure UTF-8 output in Windows
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

# Add current scripts directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from day31_builder import build_day31
from day32_builder import build_day32
from day33_builder import build_day33
from day34_builder import build_day34
from day35_builder import build_day35

def compile_block7():
    print("Compiling Block 7 (Days 31 to 35)...")
    d31 = build_day31()
    d32 = build_day32()
    d33 = build_day33()
    d34 = build_day34()
    d35 = build_day35()

    days = [d31, d32, d33, d34, d35]
    print(f"Successfully built {len(days)} days.")
    
    total_words_block = 0
    total_parts_block = 0

    for day_idx, day in enumerate(days, start=31):
        assert day["day"] == day_idx, f"Expected day {day_idx}, got {day['day']}"
        assert len(day["parts"]) == 5, f"Expected 5 parts in Day {day_idx}, got {len(day['parts'])}"
        
        day_words = 0
        for p_idx, part in enumerate(day["parts"], start=1):
            total_parts_block += 1
            words = sum(len(p.split()) for p in part["say"])
            day_words += words
            assert words >= 600, f"Day {day_idx} Part {p_idx} has only {words} words (<600)"
            assert len(part["example"].strip()) > 30, f"Day {day_idx} Part {p_idx} example too short"
            assert len(part["code"].strip()) > 50, f"Day {day_idx} Part {p_idx} code too short"
            assert len(part["output"].strip()) > 0, f"Day {day_idx} Part {p_idx} output empty"
            assert len(part["tryIt"].strip()) > 20, f"Day {day_idx} Part {p_idx} tryIt too short"
            assert len(part["codeNotes"]) >= 3, f"Day {day_idx} Part {p_idx} codeNotes too short"
            chk = part["check"]
            assert len(chk["options"]) == 4, f"Day {day_idx} Part {p_idx} options != 4"
            assert chk["answer"] == 0, f"Day {day_idx} Part {p_idx} answer != 0"
            assert chk["answerIndex"] == 0, f"Day {day_idx} Part {p_idx} answerIndex != 0"
            assert len(chk["why"].strip()) > 20, f"Day {day_idx} Part {p_idx} why too short"
        
        assert day_words >= 3000, f"Day {day_idx} total words {day_words} < 3000"
        total_words_block += day_words
        print(f"Day {day_idx} validated: 5 parts, {day_words} total words.")

    output_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data_bcom_ait_block7.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(days, f, indent=2, ensure_ascii=False)
        
    print(f"\n=======================================================")
    print(f"BLOCK 7 COMPILED SUCCESSFULLY!")
    print(f"Total Days: {len(days)} (Days 31-35)")
    print(f"Total Parts: {total_parts_block} (All >= 600 words)")
    print(f"Total Spoken Words: {total_words_block} words (Avg: {total_words_block // len(days)} words/day)")
    print(f"Saved to: {output_path}")
    print(f"=======================================================\n")

if __name__ == "__main__":
    compile_block7()
