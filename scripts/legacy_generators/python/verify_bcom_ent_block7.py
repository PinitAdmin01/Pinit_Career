import json
import subprocess
import sys
import hashlib
import os

print("=" * 80)
print("AUDIT: BCOM_ENT MONTH 2 BLOCK 7 (DAYS 31 TO 35) FULL INVARIANT VERIFICATION")
print("=" * 80)

def word_count(paragraphs):
    return sum(len(p.split()) for p in paragraphs)

with open("src/lib/data/bcomEntLongLessons.ts", "r", encoding="utf-8") as f:
    text = f.read()

decoder = json.JSONDecoder()

for day_num in [31, 32, 33, 34, 35]:
    visual_file = f"src/lib/data/lessonVisuals/bcom_ent/day-{day_num}.json"
    assert os.path.exists(visual_file), f"Missing {visual_file}"
    
    with open(visual_file, "r", encoding="utf-8") as f:
        visual = json.load(f)
        
    marker = f'"coursePrefix": "bcom_ent",\n    "day": {day_num},'
    if marker not in text:
        marker = f'"coursePrefix": "bcom_ent",\r\n    "day": {day_num},'
    
    idx = text.find(marker)
    assert idx != -1, f"Could not find Day {day_num} marker in bcomEntLongLessons.ts!"
    
    brace_idx = text.rfind('{', 0, idx)
    lesson, _ = decoder.raw_decode(text[brace_idx:])
    
    print(f"\n--- DAY {day_num}: {lesson['title']} ---")
    
    parts = lesson.get("parts", [])
    assert len(parts) == 5, f"Day {day_num} has {len(parts)} parts, expected 5!"
    print(f"  [PASS] 5 Parts confirmed.")
    
    day_words = 0
    for p_idx, part in enumerate(parts):
        w = word_count(part["say"])
        day_words += w
        assert w >= 600, f"Day {day_num} Part {p_idx+1} word count {w} < 600!"
        print(f"    Part {p_idx+1}: {w} spoken words (>= 600)")
        
        # Example check
        assert len(part.get("example", "").strip()) > 30, f"Day {day_num} Part {p_idx+1} example missing!"
        
        # Check MCQ
        chk = part.get("check", {})
        assert len(chk.get("options", [])) == 4, f"Day {day_num} Part {p_idx+1} options != 4!"
        assert chk.get("answerIndex") == 0, f"Day {day_num} Part {p_idx+1} answerIndex != 0!"
        assert len(chk.get("why", "").strip()) > 10, f"Day {day_num} Part {p_idx+1} missing why!"
        
        # Code execution match
        code = part["code"]
        expected_out = part["output"]
        res = subprocess.run([sys.executable, "-c", code], capture_output=True, text=True, check=True)
        assert res.stdout == expected_out, f"Day {day_num} Part {p_idx+1} code output mismatch!"
        
        # Visual hash check
        c_hash = hashlib.sha256(code.encode("utf-8")).hexdigest()
        v_entry = visual["entries"][p_idx]
        assert v_entry["codeHash"] == c_hash, f"Day {day_num} Part {p_idx+1} visual codeHash mismatch!"
        assert len(v_entry["spec"]["steps"]) == 4, f"Day {day_num} Part {p_idx+1} visual steps != 4!"
        
    print(f"  [PASS] Total Spoken Words: {day_words} words (Target >= 3000, ~{day_words/125:.1f} mins speaking time).")
    assert day_words >= 3000, f"Day {day_num} total words {day_words} < 3000!"
    print(f"  [PASS] Standard-Library Python execution verified deterministically (5/5).")
    print(f"  [PASS] Gate v2 visual JSON envelopes and SHA-256 codeHashes verified (5/5).")

print("\n" + "=" * 80)
print("ALL 5 DAYS (DAYS 31 TO 35) FULLY VERIFIED DIRECTLY FROM bcomEntLongLessons.ts!")
print("=" * 80)
