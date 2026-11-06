import json
import re

def count_words(text):
    return len(re.findall(r'\b[A-Za-z0-9_-]+\b', text))

with open("scripts/bcom_acc_day32.json", "r", encoding="utf-8") as f:
    data = json.load(f)

p1_addon = """
To appreciate the legal and economic architecture of Ind AS 116, corporate controllers must distinguish between a lease contract and a service contract. In a service contract, the supplier retains control over the underlying assets and merely provides an operational outcome or service level agreement (SLA) to the customer. For example, if a transport enterprise contracts with a logistics provider to move 500 metric tons of cargo per week between Mumbai and Delhi, and the provider has the unfettered operational discretion to deploy any trucks from its fleet, utilize third-party sub-contractors, or switch vehicles at will, there is no 'identified asset'. Consequently, the contract is a service contract; the payments are expensed as operational freight costs as incurred, with zero balance sheet capitalization. Conversely, if the contract specifies five dedicated, custom-branded refrigerated trucks that the provider cannot substitute without client consent, an identified asset exists, triggering Ind AS 116 lease accounting."""

p2_addon = """
The determination of the lease term under Ind AS 116.18-21 requires sophisticated management judgment. The lease term is defined as the non-cancellable period of a lease, together with both: (a) periods covered by an option to extend the lease if the lessee is reasonably certain to exercise that option; and (b) periods covered by an option to terminate the lease if the lessee is reasonably certain not to exercise that option. When assessing whether a lessee is 'reasonably certain' to extend a lease, corporate management must consider all relevant economic incentives, including substantial leasehold improvements constructed on the premises that would be abandoned if vacated, relocation costs, negotiation of below-market rental renewal terms, and operational criticality of the location. If significant economic penalties exist, the lease term must be extended to incorporate the renewal period, expanding the initial lease liability."""

p3_addon = """
Furthermore, corporate finance teams must track the timing of lease payments. In our base simulation, lease payments occur in arrears at the end of each annual period. If lease payments occur in advance at the beginning of each period (which is standard practice in commercial real estate), the first payment occurs at Day 0 (commencement date). At commencement, the first payment reduces the lease liability immediately, meaning no interest expense accrues on that first installment. The initial ROU asset under advance payments equals the initial lease liability (PV of remaining 4 payments) plus the advance payment made at commencement, yielding identical total capitalized assets but shifting the cash outflow timing."""

p4_addon = """
The transition to Ind AS 116 provided reporting entities with two primary transition approaches: the Full Retrospective Approach (restating all prior comparative periods in accordance with Ind AS 8) or the Modified Retrospective Approach (recognizing the cumulative effect of initial application in opening retained earnings as of April 1, 2019, without restating comparative periods). Under the modified retrospective approach, lessees could choose, on a lease-by-lease basis, to measure the ROU asset at either: (a) its carrying amount as if Ind AS 116 had been applied since commencement, discounted at the transition IBR; or (b) an amount equal to the lease liability, adjusted for any prepaid or accrued lease payments.

Additionally, under Ind AS 116.C10, lessees adopting the modified retrospective method were granted key practical expedients, including applying a single discount rate to a portfolio of leases with reasonably similar characteristics, relying on previous assessments of whether leases were onerous under Ind AS 37 immediately before the date of initial application, and excluding initial direct costs from the measurement of the ROU asset at the transition date."""

p5_addon = """
In multi-currency corporate environments, cross-border leasing introduces foreign currency translation complexities under Ind AS 21 'The Effects of Changes in Foreign Exchange Rates'. When an Indian enterprise enters into a long-term aircraft lease denominated in US Dollars, the lease liability is a 'monetary item' that must be retranslated at each balance sheet date using the closing exchange rate, with resulting unrealized foreign exchange gains or losses recognized immediately in the Profit & Loss statement. Conversely, the ROU asset is a 'non-monetary item' measured at historical cost in INR, which is not retranslated at closing rates. This accounting mismatch can generate substantial P&L earnings volatility, prompting multinational corporate treasuries to execute cross-currency interest rate swaps (CCIRS) to hedge the foreign exchange exposure."""

data["parts"][0]["say"] += p1_addon
data["parts"][1]["say"] += p2_addon
data["parts"][2]["say"] += p3_addon
data["parts"][3]["say"] += p4_addon
data["parts"][4]["say"] += p5_addon

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
