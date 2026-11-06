import json
import re

with open("scripts/bcom_acc_day33.json", "r", encoding="utf-8") as f:
    data = json.load(f)

extra_p5_2 = """
Finally, corporate controllers must ensure that fair value adjustments flow into the correct statement: whether into the Profit & Loss statement (e.g., FVTPL financial assets or investment property under fair value models) or into Other Comprehensive Income (OCI) without recycling (e.g., equity investments designated at FVTOCI, or revaluation surplus for property, plant, and equipment under Ind AS 16). Understanding the precise P&L versus OCI routing is crucial for maintaining earnings quality and regulatory capital compliance."""

data["parts"][4]["say"] += extra_p5_2

def count_words(t):
    return len(re.findall(r'\b[A-Za-z0-9_-]+\b', t))

total_words = 0
for p in data["parts"]:
    wc = count_words(p["say"])
    total_words += wc
    print(f"Day 33 Part {p['part']} words: {wc}")
    assert wc >= 580, f"Part {p['part']} word count {wc} < 580"

print(f"Day 33 Total words: {total_words}")
assert total_words >= 3000, f"Total word count {total_words} < 3000"

with open("scripts/bcom_acc_day33.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

print("Saved updated scripts/bcom_acc_day33.json successfully!")
