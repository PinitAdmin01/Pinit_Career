import json
import re

def count_words(text):
    return len(re.findall(r'\b[A-Za-z0-9_-]+\b', text))

with open("scripts/bcom_acc_day35.json", "r", encoding="utf-8") as f:
    data = json.load(f)

p2_more = """
In addition to contract review, the Controller must oversee the estimation of Standalone Selling Prices (SSP) when observable catalog prices do not exist. In high-tech and enterprise software, companies frequently sell bespoke customizations where no standalone market exists. Under Ind AS 115, controllers must maintain structured 'Expected Cost Plus Margin' schedules, documenting the labor hours, engineering overhead rates, and historical margin benchmarks used to derive synthetic SSPs. If synthetic SSPs are not grounded in objective historical data, statutory auditors will challenge the relative allocation, potentially requiring revenue restatements under Section 130 of the Companies Act."""

p3_more = """
The operational accounting for lease modifications under Ind AS 116.44-46 represents another crucial controllership function. During commercial renegotiations, corporate tenants frequently negotiate lease term extensions, rent reductions, or reductions in leased square footage. When a lease modification occurs, the controller must remeasure the lease liability using a revised discount rate as of the modification date. If the modification decreases the scope of the lease (e.g., surrendering two floors of an office building), the controller must derecognize a proportionate portion of the ROU asset and recognize the resulting gain or loss in P&L."""

p4_more = """
The interaction between Ind AS 109 Expected Credit Loss provisioning and Reserve Bank of India (RBI) regulatory capital requirements warrants meticulous alignment. For corporate non-banking financial companies (NBFCs) and banking subsidiaries within conglomerate groups, finance teams must maintain automated data pipelines feeding loan origination systems (LOS) into the ECL computation engine. When loans migrate between Stage 1, Stage 2, and Stage 3, the engine must automatically generate journal entries debiting credit impairment expense and crediting the loss allowance account, ensuring seamless alignment between accounting records and supervisory regulatory returns."""

p5_more = """
The architecture of converged Ind AS reporting prepares you for executive boardroom leadership. As enterprise resource planning systems increasingly leverage artificial intelligence for automated journal entry matching, invoice extraction, and lease schedule generation, the strategic value of the financial controller lies in critical judgment, statutory interpretation, and ethical stewardship. You stand ready to defend complex corporate positions, maintain unimpeachable financial records, and lead capital market initiatives with technical mastery."""

data["parts"][1]["say"] += p2_more
data["parts"][2]["say"] += p3_more
data["parts"][3]["say"] += p4_more
data["parts"][4]["say"] += p5_more

total_words = 0
for p in data["parts"]:
    wc = count_words(p["say"])
    total_words += wc
    print(f"Day 35 Part {p['part']} words: {wc}")
    assert wc >= 580, f"Part {p['part']} word count {wc} < 580"

print(f"Day 35 Total words: {total_words}")
assert total_words >= 3000, f"Total word count {total_words} < 3000"

with open("scripts/bcom_acc_day35.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

print("Saved updated scripts/bcom_acc_day35.json successfully!")
