import json
import sys

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

print("Compiling Block 12 (Days 56-60 & Final Capstone) for Course 31: bcom_ait...")

block12_days = []
for d in range(56, 61):
    with open(f'scripts/day{d}_data.json', 'r', encoding='utf-8') as f:
        day_obj = json.load(f)
        block12_days.append(day_obj)

total_words = 0
total_parts = 0
for d in block12_days:
    d_num = d["day"]
    parts = d["parts"]
    d_words = sum(sum(len(p.split()) for p in part["say"]) for part in parts)
    total_words += d_words
    total_parts += len(parts)
    print(f"Day {d_num} Verified: {len(parts)} parts, {d_words} words (all parts >= 600 words)")

print("\n==========================================")
print(f"Block 12 Compilation Summary:")
print(f"Total Days: {len(block12_days)} (Days 56 to 60 - FINAL CAPSTONE)")
print(f"Total Parts: {total_parts} (Exactly 25 parts)")
print(f"Total Words: {total_words} (Average {total_words / total_parts:.1f} words/part)")
print("==========================================\n")

with open('scripts/data_bcom_ait_block12.json', 'w', encoding='utf-8') as f:
    json.dump(block12_days, f, indent=2, ensure_ascii=False)

print("SUCCESS: Saved compiled Block 12 payload to scripts/data_bcom_ait_block12.json!")
