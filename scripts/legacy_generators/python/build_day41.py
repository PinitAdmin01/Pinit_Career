import json
import re

def count_words(text):
    return len(re.findall(r'\b[A-Za-z0-9_-]+\b', text))

day41_code = """# Day 41: Ind AS 103 Business Combinations Architecture & PPA Modeling
# Enterprise M&A accounting engine implementing the Acquisition Method,
# Purchase Price Allocation (PPA), Deferred Tax on fair value step-ups, and dual NCI Goodwill.

from dataclasses import dataclass
from typing import Dict, Tuple

class BusinessCombinationsEngine:
    def __init__(self, acquirer: str, target: str, tax_rate_pct: float):
        self.acquirer = acquirer
        self.target = target
        self.tax_rate = tax_rate_pct / 100.0

    def compute_consideration(
        self,
        cash_paid: float,
        shares_issued: int,
        share_price: float,
        contingent_consideration_pv: float,
        acquisition_fees: float
    ) -> Tuple[float, float]:
        \"\"\"Calculates total consideration and separates expensed acquisition fees.\"\"\"
        equity_fair_value = shares_issued * share_price
        total_consideration = cash_paid + equity_fair_value + contingent_consideration_pv
        expensed_costs = acquisition_fees  # Expensed directly in P&L
        return total_consideration, expensed_costs

    def execute_purchase_price_allocation(
        self,
        target_book_net_assets: float,
        ppe_fair_value_step_up: float,
        intangible_assets_identified: float
    ) -> Dict[str, float]:
        \"\"\"Performs PPA including deferred tax liabilities on fair value adjustments.\"\"\"
        gross_step_up = ppe_fair_value_step_up + intangible_assets_identified
        dtl_on_step_up = gross_step_up * self.tax_rate
        net_identifiable_assets = (
            target_book_net_assets + gross_step_up - dtl_on_step_up
        )
        return {
            "gross_fair_value_step_up": round(gross_step_up, 2),
            "dtl_on_fair_value_adjustments": round(dtl_on_step_up, 2),
            "net_identifiable_assets": round(net_identifiable_assets, 2)
        }

    def compute_goodwill(
        self,
        consideration: float,
        net_identifiable_assets: float,
        nci_percentage: float,
        nci_fair_value: float = None
    ) -> Dict[str, float]:
        \"\"\"Computes goodwill under both Proportionate Share and Full Goodwill methods.\"\"\"
        # 1. Proportionate Share Method
        nci_prop = net_identifiable_assets * (nci_percentage / 100.0)
        goodwill_prop = consideration + nci_prop - net_identifiable_assets
        
        # 2. Full Goodwill (Fair Value) Method
        res = {
            "nci_proportionate": round(nci_prop, 2),
            "goodwill_proportionate": round(goodwill_prop, 2),
        }
        
        if nci_fair_value is not None:
            goodwill_full = consideration + nci_fair_value - net_identifiable_assets
            nci_goodwill = goodwill_full - goodwill_prop
            res.update({
                "nci_fair_value": round(nci_fair_value, 2),
                "goodwill_full": round(goodwill_full, 2),
                "nci_share_of_goodwill": round(nci_goodwill, 2)
            })
            
        return res

engine = BusinessCombinationsEngine("Phoenix Industrial Group Ltd", "Zenith Sensor Technologies Ltd", 25.168)

consideration, expensed_fees = engine.compute_consideration(
    cash_paid=8000000.0,
    shares_issued=400000,
    share_price=12.50,
    contingent_consideration_pv=1500000.0,
    acquisition_fees=450000.0
)
assert consideration == 14500000.0
assert expensed_fees == 450000.0

ppa = engine.execute_purchase_price_allocation(
    target_book_net_assets=10000000.0,
    ppe_fair_value_step_up=1200000.0,
    intangible_assets_identified=2000000.0
)
assert ppa["gross_fair_value_step_up"] == 3200000.0
assert ppa["dtl_on_fair_value_adjustments"] == 805376.0
assert ppa["net_identifiable_assets"] == 12394624.0

goodwill_res = engine.compute_goodwill(
    consideration=consideration,
    net_identifiable_assets=ppa["net_identifiable_assets"],
    nci_percentage=20.0,
    nci_fair_value=3500000.0
)
assert goodwill_res["nci_proportionate"] == 2478924.80
assert goodwill_res["goodwill_proportionate"] == 4584300.80
assert goodwill_res["goodwill_full"] == 5605376.00
assert goodwill_res["nci_share_of_goodwill"] == 1021075.20

print(f"Acquisition: {engine.acquirer} -> {engine.target}")
print(f"Total Consideration Transferred: ${consideration:,.2f}")
print(f"Acquisition Fees Expensed (P&L): ${expensed_fees:,.2f}")
print(f"Net Identifiable Assets Acquired: ${ppa['net_identifiable_assets']:,.2f}")
print(f"Proportionate Goodwill: ${goodwill_res['goodwill_proportionate']:,.2f} | NCI: ${goodwill_res['nci_proportionate']:,.2f}")
print(f"Full Goodwill: ${goodwill_res['goodwill_full']:,.2f} | NCI Fair Value: ${goodwill_res['nci_fair_value']:,.2f}")
print("IND_AS_103_BUSINESS_COMBINATIONS_PASS")
"""

day41_output = """Acquisition: Phoenix Industrial Group Ltd -> Zenith Sensor Technologies Ltd
Total Consideration Transferred: $14,500,000.00
Acquisition Fees Expensed (P&L): $450,000.00
Net Identifiable Assets Acquired: $12,394,624.00
Proportionate Goodwill: $4,584,300.80 | NCI: $2,478,924.80
Full Goodwill: $5,605,376.00 | NCI Fair Value: $3,500,000.00
IND_AS_103_BUSINESS_COMBINATIONS_PASS"""

part1_say = r"""Welcome to Day 41 of Corporate & Financial Accounting! Today we officially launch Month 2 Block 9—our executive deep dive into Advanced Corporate Reorganizations, Group Consolidation, and Mergers & Acquisitions (M&A). Across Block 9 (Days 41–45), we master the interconnected reporting architecture governing multi-entity holding companies: Ind AS 103 (Business Combinations), Ind AS 110 (Consolidated Financial Statements), Ind AS 111 (Joint Arrangements), Ind AS 28 (Investments in Associates), and Ind AS 112 (Disclosure of Interests in Other Entities).

Today in Day 41, we conquer Ind AS 103: Business Combinations, converged with International Financial Reporting Standard 3 (IFRS 3). In modern investment banking, private equity buyouts, and strategic corporate acquisitions, accounting for a business combination represents one of the most intellectually rigorous and high-stakes responsibilities of the Chief Financial Officer and Group Controller. When an enterprise executes an acquisition, the financial statements must accurately delineate whether the transaction represents the purchase of an operating business or merely an isolated basket of assets.

Under Ind AS 103 Appendix C and recent international amendments, an entity must first apply the 'Concentration Test' to determine whether an acquisition is an asset acquisition or a business combination. If substantially all of the fair value of the gross assets acquired is concentrated in a single identifiable asset or group of similar assets, the transaction is treated as an asset purchase. In an asset purchase, no goodwill is recognized, and transaction costs are capitalized into asset carrying amounts. However, if the acquired set includes inputs (such as skilled personnel, manufacturing plants, or operational contracts) and substantive processes that have the ability to create outputs (goods or services generating revenues), the transaction constitutes a 'Business' and falls squarely under the mandatory Acquisition Method of Ind AS 103!

The Acquisition Method requires the strict sequential execution of four statutory milestones:
1. Identifying the Acquirer: Establishing which combining entity obtains control over the other under Ind AS 110. In complex equity-swap transactions, controllers must analyze voting rights, board composition, and senior management appointments to detect reverse acquisitions (where the legal acquirer is the accounting acquiree).
2. Determining the Acquisition Date: The specific date on which the acquirer legally and substantively obtains control over the acquiree. This is the exact moment when the target's assets and liabilities are fair valued and its post-acquisition revenues and expenses begin flowing into the acquirer's consolidated statement of profit and loss.
3. Recognizing and Measuring Identifiable Assets Acquired, Liabilities Assumed, and Non-Controlling Interest (NCI): Carrying out comprehensive Purchase Price Allocation (PPA) at fair value under Ind AS 113.
4. Recognizing and Measuring Goodwill or Gain on Bargain Purchase: Reconciling the excess of consideration transferred plus NCI over the net identifiable assets acquired.

In corporate India, business combinations are heavily scrutinized by regulatory authorities, including the Competition Commission of India (CCI) under the Competition Act 2002, the Securities and Exchange Board of India (SEBI) under the Substantial Acquisition of Shares and Takeovers (SAST) Regulations, and the National Company Law Tribunal (NCLT) under Sections 230–232 of the Companies Act 2013 for court-approved schemes of arrangement. Independent auditors operating under the National Financial Reporting Authority (NFRA) must audit valuation models, purchase agreements, and tax implications with zero tolerance for manipulation. In addition, under Section 134(5) of the Companies Act 2013, the Board of Directors must formally report on the adequacy and operating effectiveness of internal financial controls regarding business combinations and valuation models. Furthermore, the controller must ensure compliance with the 12-month measurement period allowed under Ind AS 103 Paragraph 45, which permits provisional accounting adjustments to be recognized retrospectively if new information emerges regarding facts and circumstances existing at the acquisition date."""

part2_say = r"""In Part 2, we engineer the valuation of Consideration Transferred and dismantle the strict accounting treatment of acquisition-related advisory costs under Ind AS 103 Paragraph 37 and Paragraph 53.

Consideration transferred in a business combination is measured strictly at fair value on the acquisition date. In enterprise M&A transactions, consideration rarely consists solely of upfront cash. Strategic corporate acquirers structure multi-layered consideration packages designed to bridge valuation gaps and align seller incentives. The consideration transferred comprises:
1. Upfront Cash Consideration: The direct cash consideration wired to selling shareholders on the closing date.
2. Equity Instruments Issued: Shares of the acquirer issued as purchase consideration, measured at fair value on the acquisition date (market quote multiplied by shares issued). Under Section 39 and Section 40 of the Companies Act 2013 and Ind AS 32, the nominal value is credited to Share Capital and the excess fair value is credited to Securities Premium.
3. Deferred Consideration: Cash payments contractually agreed to be settled in future periods, discounted to present value using the acquirer's incremental borrowing rate. The unwinding of this discount over time is recognized strictly as finance cost in Profit & Loss under Ind AS 109.
4. Contingent Consideration (Earn-Outs): Contractual arrangements where the acquirer must transfer additional cash or shares if specified future performance hurdles (such as revenue thresholds, EBITDA targets, or patent approvals) are achieved. Ind AS 103 Paragraph 39 mandates that contingent consideration must be recognized at fair value on the acquisition date using probability-weighted discounted cash flow models or option pricing techniques.

Crucially, the classification of contingent consideration dictates its subsequent accounting:
- If classified as Equity (e.g., fixed number of shares to be issued), it is never re-measured, and subsequent settlement is accounted for within equity without affecting earnings.
- If classified as a Financial Liability (e.g., variable cash payout based on future EBITDA), it must be re-measured at fair value at each subsequent balance sheet reporting date under Ind AS 109, with all fair value gains and losses recognized immediately in Profit & Loss!

Now, contrast this with Acquisition-Related Advisory Costs. Historically, under legacy Indian GAAP (AS 14), companies capitalized legal fees, valuation expenses, and investment banking retainers into goodwill. Under Ind AS 103 Paragraph 53, this practice is strictly prohibited! Acquisition-related costs—including finder's fees, advisory, legal, accounting, valuation, and other professional fees—must be expensed in Profit & Loss in the periods in which the costs are incurred and the services received. The only statutory exception is the direct costs of issuing debt or equity instruments: debt issuance costs reduce the liability carrying value under Ind AS 109, and equity issuance costs are deducted directly from Securities Premium under Ind AS 32 Paragraph 37.

In our corporate case study, Phoenix Industrial Group Ltd acquires an 80% controlling interest in Zenith Sensor Technologies Ltd. The purchase consideration comprises:
- Cash consideration: $8,000,000.00 wired on the acquisition date.
- Equity shares issued: 400,000 ordinary shares of Phoenix at an acquisition-date market price of $12.50 per share = $5,000,000.00 (with $400,000 credited to Share Capital at $1 par and $4,600,000 credited to Securities Premium).
- Contingent consideration: Discounted present value of an EBITDA earn-out payable in 24 months = $1,500,000.00.
- Total Consideration Transferred = $\$8,000,000 + \$5,000,000 + \$1,500,000 = \$14,500,000.00$.
- In addition, Phoenix pays $450,000.00 in M&A advisory, legal, and valuation fees. Under Ind AS 103 Paragraph 53, this $450,000 is expensed immediately to P&L as professional fees, leaving consideration transferred at exactly $14,500,000.00, fully conforming to statutory IFC-FR controls."""

part3_say = r"""In Part 3, we execute the Purchase Price Allocation (PPA) process and evaluate the crucial interaction between fair value step-ups and Deferred Tax Liabilities (DTL) under Ind AS 12.

Under Ind AS 103 Paragraph 10, the acquirer must recognize, separately from goodwill, the identifiable assets acquired and liabilities assumed at their acquisition-date fair values. In an acquisition of shares, the acquiree's historical balance sheet typically reflects historical costs less accumulated depreciation. The PPA process requires the acquirer to engage independent registered valuers (operating under Section 247 of the Companies Act 2013 and ICAI Valuation Standards) to perform comprehensive asset appraisals across two critical domains:
1. Tangible Asset Fair Value Step-Ups:
   The acquirer appraises property, plant, and equipment (PPE), real estate land holdings, and factory machinery. The excess of fair market value over existing book value constitutes a fair value step-up under Ind AS 16. In our case, Zenith's sensor fabrication machinery is stepped up by $1,200,000.00 above historical book value.
2. Recognition of Previously Unrecorded Intangible Assets:
   Under Ind AS 103 Paragraph 13 and Ind AS 38, the acquirer must recognize intangible assets that were never capitalized on the target's historical balance sheet (often because they were internally generated research and development). An intangible asset is recognized if it meets either the 'Contractual-Legal Criterion' (such as operating licenses, patents, trademarks, and franchise agreements) or the 'Separability Criterion' (such as customer lists, proprietary algorithms, and unpatented technology that can be sold, transferred, or licensed). Here, Phoenix identifies unrecorded optical sensor patents valued at $2,000,000.00.

Now, observe the profound corporate taxation interplay governed by Ind AS 12 Paragraph 19!
When an acquirer acquires shares of a corporate subsidiary, the underlying legal entity continues to exist for corporate tax purposes. Under the Income Tax Act, 1961 (specifically Section 32 and Section 43(1)), the tax base of the target company's assets remains at historical written-down value (WDV). The tax authorities do NOT allow higher depreciation deductions on the fair value step-up!
Consequently:
- The Carrying Amount of the asset on the consolidated balance sheet increases to fair value ($13,200,000).
- The Tax Base remains frozen at historical tax depreciation WDV ($10,000,000).
- This creates an inescapable Taxable Temporary Difference of $3,200,000.00!
Under Ind AS 12 and Ind AS 103 Paragraph 24, the acquirer MUST recognize a Deferred Tax Liability (DTL) on the net fair value step-up:
$$\text{Deferred Tax Liability} = \text{Total Fair Value Step-Up} \times \text{Applicable Tax Rate}$$
This DTL directly reduces the net identifiable assets acquired, which in turn increases the resulting goodwill dollar-for-dollar!

Let us analyze the PPA for Zenith Sensor Technologies Ltd:
- Target Historical Book Value of Net Assets = $10,000,000.00.
- PPE Fair Value Step-Up (Plant & Sensor Fabrication Equipment) = $1,200,000.00.
- Newly Identified Intangible Asset (Proprietary Optical Sensor Patents) = $2,000,000.00.
- Gross Fair Value Step-Up = $\$1,200,000.00 + \$2,000,000.00 = \$3,200,000.00$.
- Enacted Corporate Tax Rate under Section 115BAA = 25.168%.
- Deferred Tax Liability recognized on PPA = $\$3,200,000.00 \times 25.168\% = \$805,376.00$.
- Net Identifiable Assets Acquired:
  $$\text{Net Identifiable Assets} = \$10,000,000.00 + \$3,200,000.00 - \$805,376.00 = \$12,394,624.00$$
Notice how rigorously this model reflects statutory reality: failing to recognize the $805,376.00 DTL would overstate net assets, understate goodwill, and trigger immediate audit qualifications by statutory auditors under Section 143(3) of the Companies Act 2013 and NFRA inspection frameworks. This deferred tax liability is not a cash liability due to the revenue authority today; rather, it reflects the unavoidable future tax cash outflow that will occur because the company cannot deduct the fair value step-up on tax returns."""

part4_say = r"""In Part 4, we conquer the determination of Non-Controlling Interest (NCI) and calculate Goodwill versus Gain on Bargain Purchase under Ind AS 103 Paragraph 19 and Paragraph 32.

When an acquirer acquires less than 100% of a target's equity (such as Phoenix's 80% stake in Zenith, leaving a 20% minority interest), Ind AS 103 provides a fundamental accounting policy choice for measuring Non-Controlling Interest on an acquisition-by-acquisition basis:
1. Method A: Proportionate Share of Net Identifiable Assets (Partial Goodwill Method):
   NCI is measured strictly as the minority shareholders' proportionate percentage of the target's net identifiable assets:
   $$\text{NCI}_{\text{proportionate}} = 20\% \times \$12,394,624.00 = \$2,478,924.80$$
   Under this method, Goodwill represents only the parent company's share of goodwill:
   $$\text{Goodwill}_{\text{proportionate}} = \text{Consideration Transferred} + \text{NCI}_{\text{proportionate}} - \text{Net Identifiable Assets}$$
   $$\text{Goodwill}_{\text{proportionate}} = \$14,500,000.00 + \$2,478,924.80 - \$12,394,624.00 = \$4,584,300.80$$
2. Method B: Fair Value Method (Full Goodwill Method):
   NCI is measured at its full fair value on the acquisition date (derived from quoted market prices of target shares or active valuation techniques incorporating minority discounts):
   Assume an independent valuation establishes the fair value of the 20% NCI stake at $3,500,000.00.
   Under the Full Goodwill method:
   $$\text{Goodwill}_{\text{full}} = \text{Consideration Transferred} + \text{NCI}_{\text{fair value}} - \text{Net Identifiable Assets}$$
   $$\text{Goodwill}_{\text{full}} = \$14,500,000.00 + \$3,500,000.00 - \$12,394,624.00 = \$5,605,376.00$$
   The difference of $\$5,605,376.00 - \$4,584,300.80 = \$1,021,075.20$ represents the NCI's share of goodwill, which is recognized directly on the consolidated balance sheet and credited to NCI within equity!

Now, examine the alternative scenario: Gain on Bargain Purchase (Negative Goodwill).
What happens if an acquirer negotiates a distressed acquisition where the Net Identifiable Assets exceed Consideration Transferred plus NCI?
Under IFRS 3, a negative goodwill balance is recognized immediately as a gain in Profit & Loss. However, Indian Accounting Standard Ind AS 103 contains a critical carve-out reflecting Indian regulatory conservatism!
Under Ind AS 103 Paragraph 34:
- The acquirer must first reassess whether all assets acquired and liabilities assumed have been correctly identified and measured at fair value, ensuring no hidden liabilities were omitted.
- If an excess still remains, and there is clear evidence of the bargain purchase (e.g., forced liquidation, insolvency auction under the Insolvency and Bankruptcy Code (IBC) 2016, or government distress sale), the gain is recognized in Other Comprehensive Income (OCI) on the acquisition date and accumulated in Equity as 'Capital Reserve'.
- If there is no clear evidence of the bargain purchase, the gain is transferred directly to Capital Reserve without flowing through OCI, preventing companies from inflating OCI with artificial gains!

Finally, under Ind AS 36, Goodwill recognized in a business combination is NEVER amortized! Instead, it must be allocated to Cash-Generating Units (CGUs) that are expected to benefit from the synergies of the combination, and tested for impairment at least annually, or more frequently if impairment indicators arise. Any impairment loss recognized on goodwill is irrevocable and can never be reversed in subsequent accounting periods, protecting capital market integrity. Moreover, on the face of the Consolidated Balance Sheet prepared under Division II of Schedule III of the Companies Act 2013, Non-Controlling Interest must be presented within total Equity, but explicitly segregated from the Equity attributable to the owners of the parent company, ensuring full transparency for institutional investors, rating agencies, and minority shareowners."""

part5_say = r"""In Part 5, we execute our deterministic Python M&A engine `BusinessCombinationsEngine`, verify every balance sheet consolidation assertion, and walk through the acquisition-date journal entries.

Let us trace the complete execution of our software platform:
1. Consideration and Advisory Fees:
   - Inputs $8,000,000 cash, 400,000 shares at $12.50 ($5,000,000), and $1,500,000 contingent consideration PV.
   - Accurately establishes Consideration Transferred of $14,500,000.00.
   - Isolates $450,000.00 of M&A advisory fees to be expensed in P&L.
2. Purchase Price Allocation:
   - Takes Zenith's historical net book value of $10,000,000.00.
   - Steps up PPE by $1,200,000.00 and capitalizes $2,000,000.00 of sensor patents.
   - Applies the Section 115BAA corporate tax rate of 25.168% to gross step-ups of $3,200,000.00 to compute a Deferred Tax Liability of $805,376.00.
   - Computes Net Identifiable Assets of $12,394,624.00.
3. Dual Goodwill Valuation:
   - Under the Proportionate Share Method, NCI is $2,478,924.80 and Goodwill is $4,584,300.80.
   - Under the Fair Value (Full Goodwill) Method, NCI is $3,500,000.00, Full Goodwill is $5,605,376.00, and NCI's share of goodwill is $1,021,075.20.

Now, inspect the formal Acquisition-Date Dual-Entry Journal Entries recorded by Phoenix Industrial Group on consolidation:
Entry 1: Record Consideration Transferred & Advisory Costs in Standalone Accounts:
- Debit: Investment in Zenith Sensor Technologies Ltd — $14,500,000.00
- Debit: M&A Professional & Advisory Expense (P&L) — $450,000.00
- Credit: Cash & Bank Balances — $8,450,000.00
- Credit: Equity Share Capital (Par $1) — $400,000.00
- Credit: Securities Premium Reserve — $4,600,000.00
- Credit: Contingent Consideration Financial Liability — $1,500,000.00.

Entry 2: Consolidation Elimination Entry on Acquisition Date (Proportionate Share Method):
- Debit: Target Net Identifiable Assets (Historical Book Assets) — $10,000,000.00
- Debit: Property, Plant & Equipment (Fair Value Step-Up) — $1,200,000.00
- Debit: Intangible Assets (Proprietary Sensor Patents) — $2,000,000.00
- Debit: Consolidated Goodwill — $4,584,300.80
- Credit: Deferred Tax Liability (Ind AS 12) — $805,376.00
- Credit: Non-Controlling Interest (Equity) — $2,478,924.80
- Credit: Investment in Zenith Sensor Technologies Ltd — $14,500,000.00.

Check: Total Debits = $\$10,000,000 + \$1,200,000 + \$2,000,000 + \$4,584,300.80 = \$17,784,300.80$.
Total Credits = $\$805,376 + \$2,478,924.80 + \$14,500,000 = \$17,784,300.80$.
The journal entry is in absolute mathematical equilibrium!

This rigorous treatment guarantees that the consolidated balance sheet conforms to Schedule III of the Companies Act 2013 and global IFRS 3 standards. The Chief Financial Officer presents this complete PPA schedule to the Board Audit Committee and external statutory auditors, verifying that every valuation parameter is substantiated by registered valuation reports. In post-acquisition accounting periods, the controller will oversee the annual impairment tests under Ind AS 36, manage the gradual reversal of the $805,376 deferred tax liability as the underlying factory equipment and patents are depreciated and amortized through profit and loss, and revalue the contingent consideration liability at each reporting date.

Our automated validation framework executes programmatic assertion tests across every output field, confirming that no mathematical discrepancy or rounding anomaly exists within the corporate M&A reporting pipeline. Every calculation reconciles to the exact cent, ensuring complete compliance with the Ind AS framework and statutory audit requirements. When our Python simulation engine executes, every single assertion validates with 100% precision, concluding with the terminal confirmation string:
`IND_AS_103_BUSINESS_COMBINATIONS_PASS`."""

day41_lesson = {
    "coursePrefix": "bcom-accounting",
    "day": 41,
    "title": "Ind AS 103 Business Combinations: The Acquisition Method, PPA & Goodwill Architecture",
    "parts": [
        {
            "part": 1,
            "title": "Scope, Governance & The Acquisition Method Framework (Ind AS 103)",
            "say": part1_say,
            "code": day41_code,
            "output": day41_output,
            "check": {
                "question": "What is the mandatory method of accounting for all business combinations under Ind AS 103?",
                "options": [
                    "The Acquisition Method (involving acquirer identification, acquisition date, PPA at fair value, and goodwill)",
                    "The Pooling of Interests method for all commercial acquisitions regardless of common control",
                    "The Proportional Consolidation method where assets are recorded at historical book value",
                    "The Cost Method where assets and liabilities are never recognized on the balance sheet"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Ind AS 103 mandates the Acquisition Method for all business combinations (except common control transactions which follow Appendix C pooling of interests).",
                "why": "Ind AS 103 mandates the Acquisition Method for all business combinations (except common control transactions which follow Appendix C pooling of interests)."
            }
        },
        {
            "part": 2,
            "title": "Measuring Consideration Transferred & Accounting for Acquisition Advisory Costs",
            "say": part2_say,
            "code": day41_code,
            "output": day41_output,
            "check": {
                "question": "Under Ind AS 103 Paragraph 53, how must acquisition-related costs (legal, valuation, and advisory fees) be accounted for?",
                "options": [
                    "They must be expensed in Profit & Loss in the period incurred, strictly prohibited from being capitalized into goodwill",
                    "They must be capitalized into the initial carrying value of goodwill",
                    "They must be deducted directly from the target company's retained earnings",
                    "They must be amortized over a 10-year period as preliminary expenses"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Ind AS 103 Paragraph 53 explicitly requires acquisition-related professional and advisory costs to be expensed in Profit & Loss when incurred.",
                "why": "Ind AS 103 Paragraph 53 explicitly requires acquisition-related professional and advisory costs to be expensed in Profit & Loss when incurred."
            }
        },
        {
            "part": 3,
            "title": "Purchase Price Allocation (PPA) & Deferred Tax on Fair Value Adjustments",
            "say": part3_say,
            "code": day41_code,
            "output": day41_output,
            "check": {
                "question": "Why does a fair value step-up on acquired assets create a Deferred Tax Liability (DTL) in a share acquisition?",
                "options": [
                    "Because the carrying amount increases to fair value while the tax base remains at historical written-down value, creating a taxable temporary difference",
                    "Because tax authorities immediately refund taxes on all asset revaluations",
                    "Because fair value adjustments eliminate all future corporate tax liabilities permanently",
                    "Because Ind AS 12 prohibits recognizing deferred taxes on business combinations"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "In a share acquisition, the tax base remains at historical tax cost while accounting carrying amount increases to fair value, creating a taxable temporary difference requiring a DTL under Ind AS 12.",
                "why": "In a share acquisition, the tax base remains at historical tax cost while accounting carrying amount increases to fair value, creating a taxable temporary difference requiring a DTL under Ind AS 12."
            }
        },
        {
            "part": 4,
            "title": "Goodwill vs Gain on Bargain Purchase & Non-Controlling Interest (NCI) Measurement",
            "say": part4_say,
            "code": day41_code,
            "output": day41_output,
            "check": {
                "question": "Under Ind AS 103, how is a Gain on Bargain Purchase (Negative Goodwill) recognized when clear evidence exists?",
                "options": [
                    "Recognized in Other Comprehensive Income (OCI) and accumulated in Equity as Capital Reserve",
                    "Recognized immediately as operating revenue in Profit & Loss like IFRS 3",
                    "Distributed immediately to equity shareholders as a cash dividend",
                    "Deducted from the carrying value of Property, Plant & Equipment"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Ind AS 103 contains a carve-out requiring Gain on Bargain Purchase to be recognized in OCI and accumulated in Equity as Capital Reserve (after reassessing all asset values).",
                "why": "Ind AS 103 contains a carve-out requiring Gain on Bargain Purchase to be recognized in OCI and accumulated in Equity as Capital Reserve (after reassessing all asset values)."
            }
        },
        {
            "part": 5,
            "title": "Executing the Python M&A Engine & Post-Merger Financial Statement Synthesis",
            "say": part5_say,
            "code": day41_code,
            "output": day41_output,
            "check": {
                "question": "In the Phoenix-Zenith case study, what is the proportionate goodwill recognized on acquisition?",
                "options": [
                    "$4,584,300.80 (Consideration $14.5M + NCI $2,478,924.80 - Net Assets $12,394,624)",
                    "$5,605,376.00 based on full goodwill",
                    "$14,500,000.00 equal to total consideration transferred",
                    "Zero, because the acquisition resulted in a bargain purchase"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Under the proportionate share method, Goodwill = $14,500,000 + $2,478,924.80 - $12,394,624.00 = $4,584,300.80.",
                "why": "Under the proportionate share method, Goodwill = $14,500,000 + $2,478,924.80 - $12,394,624.00 = $4,584,300.80."
            }
        }
    ]
}

total_words = 0
for p in day41_lesson["parts"]:
    wc = count_words(p["say"])
    total_words += wc
    print(f"Day 41 Part {p['part']} words: {wc}")

for p in day41_lesson["parts"]:
    wc = count_words(p["say"])
    assert wc >= 580, f"Part {p['part']} word count {wc} < 580"

print(f"Day 41 Total words: {total_words}")
assert total_words >= 3000, f"Total word count {total_words} < 3000"

with open("scripts/bcom_acc_day41.json", "w", encoding="utf-8") as f:
    json.dump(day41_lesson, f, indent=2)

print("Saved scripts/bcom_acc_day41.json successfully!")
