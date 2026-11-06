import json
import re

def count_words(text):
    return len(re.findall(r'\b[A-Za-z0-9_-]+\b', text))

with open("scripts/bcom_acc_day34.json", "r", encoding="utf-8") as f:
    data = json.load(f)

extra_p5_addon = """
Corporate audit committees and Chief Risk Officers (CROs) conduct quarterly stress testing of the Ind AS 109 impairment engine. Sensitivity disclosures under Ind AS 107 must detail the monetary impact on profit before tax if probability of default (PD) weights were to shift by +/- 100 basis points, or if severe economic downside scenarios (such as sharp currency depreciation or benchmark interest rate hikes) were given higher probability weightings in the macroeconomic model."""

data["parts"][4]["say"] += extra_p5_addon

total_words = 0
for p in data["parts"]:
    wc = count_words(p["say"])
    total_words += wc
    print(f"Day 34 Part {p['part']} words: {wc}")
    assert wc >= 580, f"Part {p['part']} word count {wc} < 580"

print(f"Day 34 Total words: {total_words}")
assert total_words >= 3000, f"Total word count {total_words} < 3000"

with open("scripts/bcom_acc_day34.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

print("Saved updated scripts/bcom_acc_day34.json successfully!")
