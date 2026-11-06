with open("scripts/bcom_acc_day32.json", "r", encoding="utf-8") as f:
    import json
    data = json.load(f)

extra_p4 = """
Additionally, under Ind AS 116.C10, lessees adopting the modified retrospective method were granted key practical expedients, including applying a single discount rate to a portfolio of leases with reasonably similar characteristics, relying on previous assessments of whether leases were onerous under Ind AS 37 immediately before the date of initial application, and excluding initial direct costs from the measurement of the ROU asset at the transition date."""

data["parts"][3]["say"] += extra_p4

import re
def count_words(t):
    return len(re.findall(r'\b[A-Za-z0-9_-]+\b', t))

total_words = 0
for p in data["parts"]:
    wc = count_words(p["say"])
    total_words += wc
    print(f"Day 32 Part {p['part']} words: {wc}")
    assert wc >= 580, f"Part {p['part']} word count {wc} < 580"

print(f"Day 32 Total words: {total_words}")
assert total_words >= 3000, f"Total word count {total_words} < 3000"

with open("scripts/bcom_acc_day32.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

print("Saved updated scripts/bcom_acc_day32.json successfully!")
