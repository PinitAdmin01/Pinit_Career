import re
import json
import subprocess
import sys
import os

print("=" * 80)
print("BLOCK 8 (DAYS 36-40) & MILESTONE 8 BRUTAL 3RD-PERSON VERIFICATION AUDIT")
print("Course: bcom_law (Corporate Law, IBC & Compliance)")
print("Topic: Insolvency and Bankruptcy Code (IBC 2016) & CIRP Masterclass")
print("=" * 80)

# Load bcomLawLongLessons.ts content
ts_path = "src/lib/data/bcomLawLongLessons.ts"
with open(ts_path, "r", encoding="utf-8") as f:
    ts_content = f.read()

# Parse Days 36-40 directly from ts_content
block8_days = []
for d in range(36, 41):
    start_tag = f'"day": {d},'
    pos = ts_content.find(start_tag)
    if pos == -1:
        start_tag = f'day: {d},'
        pos = ts_content.find(start_tag)
    assert pos != -1, f"Day {d} not found in bcomLawLongLessons.ts!"
    
    brace_start = ts_content.rfind('{', 0, pos)
    depth = 0
    in_string = False
    escape = False
    brace_end = -1
    for i in range(brace_start, len(ts_content)):
        char = ts_content[i]
        if escape:
            escape = False
            continue
        if char == '\\':
            escape = True
            continue
        if char == '"':
            in_string = not in_string
            continue
        if not in_string:
            if char == '{':
                depth += 1
            elif char == '}':
                depth -= 1
                if depth == 0:
                    brace_end = i + 1
                    break
    assert brace_end != -1, f"Could not find closing brace for Day {d}"
    day_json_str = ts_content[brace_start:brace_end]
    day_obj = json.loads(day_json_str)
    block8_days.append(day_obj)

print(f"Loaded and verified {len(block8_days)} Block 8 lessons (Days 36-40) directly from bcomLawLongLessons.ts.\n")

total_block_words = 0
total_parts_verified = 0

for day_obj in block8_days:
    day_num = day_obj["day"]
    day_title = day_obj["title"]
    parts = day_obj["parts"]
    
    print(f"AUDITING DAY {day_num}: {day_title}")
    print("-" * 75)
    
    assert len(parts) == 5, f"Day {day_num} must have exactly 5 parts, found {len(parts)}"
    day_words = 0
    
    for idx, p in enumerate(parts):
        p_num = p["part"]
        p_title = p["title"]
        say = p["say"]
        ex = p["example"]
        code = p["code"]
        expected_out = p["output"]
        try_it = p["tryIt"]
        chk = p["check"]
        
        # 1. Word count verification: >= 600 words per part
        words = sum(len(para.split()) for para in say)
        day_words += words
        total_block_words += words
        total_parts_verified += 1
        
        assert words >= 600, f"Day {day_num} Part {p_num} failed word count: {words} < 600!"
        print(f"  [PASS] Part {p_num} ({words} words): {p_title[:45]}...")
        
        # 2. Example verification
        assert len(ex.strip()) > 30, f"Day {day_num} Part {p_num} missing concrete example!"
        
        # 3. Python deterministic code execution and stdout match
        run_res = subprocess.run([sys.executable, "-c", code], capture_output=True, text=True)
        assert run_res.returncode == 0, f"Day {day_num} Part {p_num} Python execution failed:\n{run_res.stderr}"
        actual_out = run_res.stdout
        assert actual_out == expected_out, f"Day {day_num} Part {p_num} stdout mismatch!\nExpected:\n{expected_out}\nActual:\n{actual_out}"
        
        # 4. MCQ verification: 4 options, answerIndex: 0
        assert len(chk["options"]) == 4, f"Day {day_num} Part {p_num} MCQ must have 4 options!"
        assert chk["answerIndex"] == 0, f"Day {day_num} Part {p_num} MCQ answerIndex must be 0!"
        assert len(chk["why"].strip()) > 20, f"Day {day_num} Part {p_num} MCQ missing explanation!"
        
        # 5. Outage puzzle / capstone check for Part 5
        if p_num == 5:
            assert any(k in p_title.lower() for k in ["puzzle", "anti-pattern", "crisis", "capstone", "simulator", "engine", "defense"]), \
                f"Day {day_num} Part 5 must be an outage puzzle / anti-pattern defense / capstone simulator!"
                
    # Day Total Word count: >= 3000 words (25 mins spoken audio)
    print(f"Day {day_num} Total Words: {day_words:,} words (Target >= 3000 words, >= 25 mins spoken audio)")
    assert day_words >= 3000, f"Day {day_num} total words {day_words} < 3000!"
    
    # 6. Gate v2 Visual JSON check
    vis_cmd = ["npx", "tsx", "scripts/visuals/check.mts", "--course", "bcom_law", "--day", str(day_num)]
    vis_res = subprocess.run(vis_cmd, capture_output=True, text=True, shell=True)
    assert vis_res.returncode == 0, f"Day {day_num} visual check failed:\n{vis_res.stderr}\n{vis_res.stdout}"
    assert "PASS" in vis_res.stdout, f"Day {day_num} visual did not pass Gate v2:\n{vis_res.stdout}"
    print(f"  [PASS] Gate v2 Visual JSON: {vis_res.stdout.strip()}")
    print()

print("=" * 80)
print("AUDIT SUMMARY FOR BLOCK 8 (DAYS 36-40):")
print(f"Total Spoken Words Across Block 8: {total_block_words:,} words (Average {total_block_words/5:,.1f} words/day)")
print(f"Total Parts Audited: {total_parts_verified}/25 parts")
print(f"Total Days Implemented in Course 09 (bcom_law): 40 / 60 Days (Days 1 to 40)")
print("[SUCCESS] BLOCK 8 (DAYS 36-40) & MILESTONE 8 IS OFFICIALLY 100% COMPLETE & VERIFIED!")
print("=" * 80)
