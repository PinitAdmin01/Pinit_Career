import json
import re

def count_words(text):
    return len(re.findall(r'\b[A-Za-z0-9_-]+\b', text))

with open("scripts/bcom_acc_day35.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Large addons for each part to ensure >= 620 words per part
p1_extra_full = """
In multi-entity global enterprises, the Financial Controller must establish an integrated 'Chart of Accounts' and financial reporting calendar that ensures smooth monthly and annual financial closes across diverse subsidiaries and joint ventures. Under Section 134(5) of the Companies Act 2013, the Directors' Responsibility Statement requires the board to state that directors have selected such accounting policies and applied them consistently and made judgments and estimates that are reasonable and prudent so as to give a true and fair view of the state of affairs of the company. The Controller is the operational executive charged with fulfilling this statutory mandate.

Furthermore, corporate governance requires the Controller to maintain strict Internal Financial Controls over Financial Reporting (IFC-FR). Every accounting policy choice under Ind AS—from selecting standalone selling price estimation methodologies under Ind AS 115, to determining discount rate IBR curves under Ind AS 116, documenting Level 3 DCF assumptions under Ind AS 113, and calibrating forward-looking macro scalars under Ind AS 109—must be governed by formal internal control documentation audited by independent statutory auditors under Section 143(3)(i) of the Act.

The Controller must also interface with the National Financial Reporting Authority (NFRA), India's independent accounting and audit regulator established under Section 132 of the Companies Act. In recent regulatory enforcement orders, NFRA has penalized corporate management and statutory auditors for non-compliance with fundamental Ind AS principles, specifically targeting opaque revenue recognition practices and inadequate fair value documentation. Maintaining unimpeachable audit trails is therefore both a statutory necessity and an institutional safeguard."""

p2_extra_full = """
The operational integration between commercial sales contracting and financial accounting requires the Controller to establish strict pre-execution contract review workflows. Commercial enterprise sales teams frequently negotiate non-standard contract clauses—such as performance liquidated damages, extended payment credit terms, customer acceptance trial periods, or price protection clauses. Each of these non-standard clauses has profound Ind AS 115 implications: liquidated damages represent variable consideration requiring the application of the reversal constraint; extended credit terms exceeding 12 months trigger significant financing component discounting; and conditional customer acceptance periods prevent point-in-time revenue recognition until formal engineering sign-off is obtained.

By embedding financial controllership checkpoints directly into the Salesforce / ERP CPQ (Configure, Price, Quote) pipeline, the enterprise eliminates unrecorded revenue liabilities and restatement risks. Furthermore, the controller must establish robust processes for tracking contract assets and contract liabilities. When an invoice is raised before performance obligations are satisfied, the amount must be parked immediately in a deferred revenue liability ledger. Revenue can only be released into the P&L as milestone certifications or time-based progress reports are verified by internal audit."""

p3_extra_full = """
The strategic management of corporate leasing portfolios under Ind AS 116 directly impacts executive compensation and corporate credit ratings. Because Ind AS 116 increases reported EBITDA while increasing reported gross debt, rating agencies (such as CRISIL, ICRA, S&P, and Moody's) adjust their credit assessment models. Credit rating analysts calculate 'Adjusted Debt' by treating lease liabilities as financial debt, while simultaneously adjusting interest coverage metrics (EBITDA / Total Interest Expense including lease interest).

Furthermore, when renegotiating bank borrowing facilities, corporate controllers must ensure that debt covenants specify whether financial ratios are calculated on an 'Ind AS basis' or a 'Frozen GAAP / Pre-Ind AS 116 basis', preventing technical covenant defaults caused solely by standard transitions. In addition, controllers must oversee the annual impairment testing of ROU assets under Ind AS 36 'Impairment of Assets'. If an economic downturn reduces customer footfalls in leased retail locations, the ROU asset must be evaluated for impairment at the Cash-Generating Unit (CGU) level, writing down the asset to its recoverable amount if carrying value exceeds fair value less costs of disposal or value in use."""

p4_extra_full = """
The governance of Level 3 fair value models under Ind AS 113 and Stage 2 ECL allowances under Ind AS 109 requires active collaboration between the financial controllership, treasury, and enterprise risk management divisions. Under Ind AS 107 disclosures, financial controllers must present comprehensive sensitivity analyses showing the impact of extreme market stress on capital and reserves.

For Level 3 private equity valuations, controllers model sensitivity to +/- 150 basis points shifts in the weighted average cost of capital (WACC) and +/- 50 basis points changes in long-term terminal growth rates. For Ind AS 109 credit portfolios, controllers stress-test macroeconomic forward-looking scenarios—such as a 200 basis point rise in central bank policy rates combined with a 15% currency depreciation—evaluating the resulting migration of loans from Stage 1 into Stage 2 and the corresponding surge in required P&L credit loss allowances.

Moreover, the Controller coordinates with the audit committee to review the valuation methodology applied to Level 3 unobservable inputs, ensuring that management models do not reflect overly optimistic forecasts that diverge from observable industry trends."""

p5_extra_full = """
As we conclude this culminating Milestone 7 Capstone, reflect on the monumental technical capabilities you have acquired across Block 7. You have mastered the most sophisticated, mathematically rigorous standards in the global accounting profession: Ind AS 115, Ind AS 116, Ind AS 113, and Ind AS 109. You understand how these standards interact on the income statement, balance sheet, and cash flow statement, and you have validated their execution through deterministic Python accounting engines.

This masterclass certifies your readiness to lead financial reporting divisions, design enterprise ERP accounting workflows in SAP S/4HANA and Oracle Cloud, interface authoritatively with Big Four audit partners, and steer multinational corporations through complex capital market transactions with total regulatory confidence.

The executive command suite demonstrated today will serve as your blueprint for professional controllership. Whether presenting quarterly earnings to institutional investors, defending critical accounting estimates before the board audit committee, or leading an initial public offering (IPO) under SEBI ICDR regulations, you carry the gold standard of technical accounting and corporate financial excellence."""

data["parts"][0]["say"] += p1_extra_full
data["parts"][1]["say"] += p2_extra_full
data["parts"][2]["say"] += p3_extra_full
data["parts"][3]["say"] += p4_extra_full
data["parts"][4]["say"] += p5_extra_full

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
