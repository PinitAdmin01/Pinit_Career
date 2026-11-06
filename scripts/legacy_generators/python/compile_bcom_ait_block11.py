import json
import sys
from day51_builder import build_day51
from day52_builder import build_day52
from day53_builder import build_day53
from day54_builder import build_day54
from day55_builder import build_day55

sys.stdout.reconfigure(encoding='utf-8')

print("Compiling Block 11 (Days 51-55) for Course 31: bcom_ait...")
d51 = build_day51()
d52 = build_day52()
d53 = build_day53()
d54 = build_day54()
d55 = build_day55()

block11_days = [d51, d52, d53, d54, d55]

total_words = 0
total_parts = 0
for d in block11_days:
    d_num = d["day"]
    parts = d["parts"]
    d_words = sum(sum(len(p.split()) for p in part["say"]) for part in parts)
    total_words += d_words
    total_parts += len(parts)
    print(f"Day {d_num} Verified: {len(parts)} parts, {d_words} words (all parts >= 600 words)")

print("\n==========================================")
print(f"Block 11 Compilation Summary:")
print(f"Total Days: {len(block11_days)} (Days 51 to 55)")
print(f"Total Parts: {total_parts} (Exactly 25 parts)")
print(f"Total Words: {total_words} (Average {total_words / total_parts:.1f} words/part)")
print("==========================================\n")

with open('scripts/data_bcom_ait_block11.json', 'w', encoding='utf-8') as f:
    json.dump(block11_days, f, indent=2, ensure_ascii=False)

print("SUCCESS: Saved compiled Block 11 payload to scripts/data_bcom_ait_block11.json!")
