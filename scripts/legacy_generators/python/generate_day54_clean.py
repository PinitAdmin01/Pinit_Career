import json
import re

def count_words(text):
    return len(re.findall(r'\b[A-Za-z0-9_-]+\b', text))

with open("scripts/test_day54_code.py", "r", encoding="utf-8") as f:
    day54_code = f.read()

day54_output = """Division: Thermal Turbine Division
Initial Net Carrying Amount: $32,000,000.00
Fair Value Less Costs to Sell (FVLCTS): $27,500,000.00
Ind AS 105 Measurement Impairment Loss: $4,500,000.00
Goodwill Written Off: $2,000,000.00
Allocated to Plant & Machinery (50.0%): $1,250,000.00 | Post-Carrying: $12,750,000.00
Allocated to Factory Buildings (35.71%): $892,857.14 | Post-Carrying: $9,107,142.86
Allocated to Turbine Patents (14.29%): $357,142.86 | Post-Carrying: $3,642,857.14
Post-Measurement Net Carrying Amount: $27,500,000.00
Cessation of Depreciation: Strictly Enforced under Ind AS 105.25
Discontinued Operations Pre-Tax Result: $-1,500,000.00
Discontinued Operations Tax Benefit (25.168%): $377,520.00
Single-Line Discontinued Operations Post-Tax Net Result: $-1,122,480.00
IND_AS_105_HELD_FOR_SALE_DISCONTINUED_PASS"""

part1_say = r"""Welcome to Day 54 of Corporate & Financial Accounting! Today we master Indian Accounting Standard 105 (Ind AS 105) and its international counterpart International Financial Reporting Standard 5 (IFRS 5)—Non-Current Assets Held for Sale and Discontinued Operations.

In strategic corporate restructuring, industrial conglomerates frequently divest non-core manufacturing divisions, carve out operational business segments, or dispose of underperforming real estate to strengthen balance sheet liquidity and focus on core high-return activities. However, the timing and presentation of these divestitures create significant accounting and earnings manipulation risks. Management might be tempted to prematurely stop depreciating assets to inflate operating profits, or conceal operational losses inside continuing operations. Ind AS 105 establishes strict, objective criteria to govern both the measurement and financial statement presentation of assets held for sale and discontinued operations.

Under Ind AS 105.6, an entity shall classify a non-current asset (or disposal group) as held for sale if its carrying amount will be recovered principally through a sale transaction rather than through continuing use.
To qualify for this classification, the asset or disposal group must satisfy two non-negotiable, cumulative conditions simultaneously:
1. Available for Immediate Sale (Ind AS 105.7):
   The asset (or disposal group) must be available for immediate sale in its present condition subject only to terms that are usual and customary for sales of such assets (or disposal groups).
   This means that the entity cannot require substantial ongoing use or operational modifications before transferring ownership. For example, if an entity decides to sell its corporate headquarters building but plans to continue occupying it until a new facility is constructed two years later, the building is NOT available for immediate sale and cannot be classified as held for sale!
2. The Sale Must Be Highly Probable (Ind AS 105.8):
   For the sale to be highly probable, the standard prescribes five strict criteria that must be empirically evidenced:
   (a) The appropriate level of management (typically the Board of Directors or an authorized executive committee) must be committed to a plan to sell the asset (or disposal group);
   (b) An active program to locate a buyer and complete the plan must have been initiated;
   (c) The asset (or disposal group) must be actively marketed for sale at a price that is reasonable in relation to its current fair value;
   (d) The sale should be expected to qualify for recognition as a completed sale within one year from the date of classification (with very narrow exceptions for delays caused by circumstances beyond the entity's control where the entity remains committed to the sale); and
   (e) Actions required to complete the plan should indicate that it is unlikely that significant changes to the plan will be made or that the plan will be withdrawn.

Disposal Group Concept (Ind AS 105.4):
A disposal group is a group of assets to be disposed of, by sale or otherwise, together as a group in a single transaction, and liabilities directly associated with those assets that will be transferred in the transaction. If a disposal group is a Cash-Generating Unit (CGU) to which goodwill has been allocated under Ind AS 36, or if it represents an operating division within such a CGU, goodwill must be allocated to the disposal group based on the relative values of the operation disposed of and the portion of the CGU retained.

In our enterprise case study, the Board of Directors of Mahindra Sterling Industrial Holdings Ltd approved a binding resolution on October 1 to divest its Thermal Turbine Manufacturing Division. A major international energy conglomerate has executed a letter of intent to purchase the entire operational division for $29,000,000.00, with closing legally scheduled within five months. Because the division is available immediately and meets all five highly probable criteria, it is formally classified as a Disposal Group Held for Sale under Ind AS 105."""

part2_say = r"""In Part 2 of Day 54, we master the Measurement Architecture of Assets Held for Sale: The Lower of Carrying Amount and Fair Value Less Costs to Sell (FVLCTS).

Once an asset or disposal group satisfies the held-for-sale criteria, Ind AS 105 introduces a fundamental shift from historical cost accounting to fair value net realization:

1. The Core Measurement Invariant (Ind AS 105.15):
   An entity shall measure a non-current asset (or disposal group) classified as held for sale at the LOWER of its carrying amount and fair value less costs to sell:
   $$\text{Measurement} = \min(\text{Carrying Amount}, \text{Fair Value Less Costs to Sell (FVLCTS)})$$
   - Fair Value is determined under Ind AS 113 as the exit price agreed upon between market participants.
   - Costs to Sell are the incremental costs directly attributable to the disposal of an asset (or disposal group), excluding finance costs and income tax expense (e.g. legal fees, stamp duties, brokerage commissions, and site decommissioning costs).

2. Measurement Impairment Loss Recognition (Ind AS 105.20):
   An entity shall recognize an immediate impairment loss for any initial or subsequent write-down of the asset (or disposal group) to fair value less costs to sell. This loss is recognized in the Statement of Profit and Loss.

3. Detailed Disposal Group Balance Sheet Audit for Mahindra Sterling:
   Prior to held-for-sale reclassification on October 1, the carrying amounts of the Thermal Turbine Division's assets and liabilities are:
   - Allocated Division Goodwill: $\$2,000,000.00$
   - Plant & Specialized Machinery (PPE): $\$14,000,000.00$
   - Factory Land & Buildings (PPE): $\$10,000,000.00$
   - Proprietary Turbine Design Patents (Intangibles): $\$4,000,000.00$
   - Working Capital (Inventories & Trade Receivables): $\$6,000,000.00$
   - Gross Assets: $\$36,000,000.00$
   - Trade Payables & Associated Operating Provisions: $\$4,000,000.00$
   - Net Carrying Amount of Disposal Group:
     $$\text{Net Carrying Amount} = \$36,000,000.00 - \$4,000,000.00 = \$32,000,000.00$$

4. Determining Fair Value Less Costs to Sell (FVLCTS):
   - Agreed transaction price with the strategic buyer: $\$29,000,000.00$.
   - Directly attributable legal, regulatory filing, and environmental severance costs: $\$1,500,000.00$.
   - Net Fair Value Less Costs to Sell:
     $$\text{Net FVLCTS} = \$29,000,000.00 - \$1,500,000.00 = \$27,500,000.00$$
   - Total Ind AS 105 Measurement Impairment Loss:
     $$\text{Impairment Loss} = \$32,000,000.00 - \$27,500,000.00 = \$4,500,000.00$$

5. Allocation Waterfall of Disposal Group Impairment Loss (Ind AS 105.23):
   Under Ind AS 105, an impairment loss recognized for a disposal group shall reduce the carrying amount of the non-current assets of the group that are within the scope of the measurement requirements of Ind AS 105, in the order of allocation set out in Ind AS 36:
   - Step 1 (Goodwill): The first $\$2,000,000.00$ of impairment loss is allocated to Goodwill, writing it down completely from $\$2,000,000.00$ to $\$0.00$.
   - Step 2 (Pro-Rata Allocation to Qualifying Non-Current Assets):
     The remaining $\$2,500,000.00$ loss ($4.5M - $2.0M) is allocated pro-rata across the qualifying non-current assets: Plant & Machinery ($14M), Factory Buildings ($10M), and Turbine Patents ($4M). Total qualifying asset base = $\$14\text{M} + \$10\text{M} + \$4\text{M} = \$28,000,000.00$. Working capital ($6M) is excluded from Ind AS 105 measurement allocation because it is governed by Ind AS 2 (Inventories) and Ind AS 109 (Financial Instruments).
     - Plant & Machinery ($14M / 28M = 50.0\%$): Absorbs $\$2,500,000 \times 50.0\% = \$1,250,000.00$. Revised carrying = $\$12,750,000.00$.
     - Factory Buildings ($10M / 28M = 35.714\%$): Absorbs $\$2,500,000 \times (10/28) = \$892,857.14$. Revised carrying = $\$9,107,142.86$.
     - Turbine Patents ($4M / 28M = 14.286\%$): Absorbs $\$2,500,000 \times (4/28) = \$357,142.86$. Revised carrying = $\$3,642,857.14$.
   - Reconciled Post-Measurement Net Carrying:
     $$\text{Net Carrying} = (\$0 + \$12.75\text{M} + \$9.107\text{M} + \$3.643\text{M} + \$6.0\text{M}) - \$4.0\text{M} = \$27,500,000.00$$
     The net assets of the disposal group now equal exactly its FVLCTS of $\$27,500,000.00$!"""

part3_say = r"""In Part 3 of Day 54, we examine Operational Invariants: Cessation of Depreciation, Subsequent Impairment Reversals, and Changes to a Plan of Sale.

Classifying an asset or disposal group as held for sale alters its operational accounting in three fundamental ways:

1. The Absolute Cessation of Depreciation and Amortization (Ind AS 105.25):
   - Critical Invariant: An entity shall NOT depreciate (or amortize) a non-current asset while it is classified as held for sale or while it is part of a disposal group classified as held for sale!
   - Accounting Rationale: Depreciation represents the systematic allocation of an asset's depreciable cost over its useful life through continuing operational use. Because a held-for-sale asset will be recovered through sale rather than continuing use, depreciation ceases. The asset is instead subject to ongoing fair value less costs to sell impairment reviews at each subsequent reporting date.
   - Financial Statement Impact for Mahindra Sterling: From October 1 through the March 31 financial year-end (6 months), depreciation that would otherwise have been recognized under normal operational use (approximately $\$1,200,000.00$ across plant, machinery, and buildings) is completely halted.
   - However, interest expense and other financing costs attributable to the liabilities of a disposal group classified as held for sale (such as lease liabilities or supplier credit interest) shall continue to be recognized in profit or loss.

2. Subsequent Increases in Fair Value & Reversal Limits (Ind AS 105.21-22):
   - If, at a subsequent reporting date, the fair value less costs to sell of the held-for-sale asset increases, the entity shall recognize a gain in profit or loss.
   - Statutory Ceiling Invariant: The gain recognized shall NOT be in excess of the cumulative impairment loss that has been recognized, either in accordance with Ind AS 105 or previously in accordance with Ind AS 36!
   - Furthermore, under no circumstances can any impairment loss previously allocated to Goodwill be reversed. Once written down under Ind AS 105, goodwill is permanently extinguished.

3. Accounting for Changes to a Plan of Sale (Ind AS 105.26-29):
   - What happens if the criteria for held for sale are no longer met (for instance, if the acquirer defaults, regulatory antitrust approval is denied, or management cancels the sale after 12 months)?
   - If an entity ceases to classify an asset (or disposal group) as held for sale, the entity must immediately reclassify the asset back into Property, Plant and Equipment or Intangible Assets.
   - Measurement on Reclassification: The asset shall be measured at the LOWER of:
     (a) Its carrying amount before the asset was classified as held for sale, adjusted for any depreciation, amortization, or revaluations that would have been recognized had the asset not been classified as held for sale; and
     (b) Its recoverable amount at the date of the subsequent decision not to sell.
   - The entity shall include any required adjustment to the carrying amount of a non-current asset that ceases to be classified as held for sale in profit or loss from continuing operations in the period in which the criteria are no longer met. The entity shall present that adjustment in the same Statement of Profit and Loss line item used to present a gain or loss, if any, recognized when the asset was initially classified as held for sale.
   
4. Non-Current Assets That Are to Be Abandoned (Ind AS 105.13):
   - Crucial Statutory Distinction: An entity shall NOT classify as held for sale a non-current asset (or disposal group) that is to be abandoned!
   - Rationale: Its carrying amount will be recovered principally through continuing use until the end of its economic life, rather than through a sale transaction. Examples include assets to be used until the end of their economic life, or facilities to be closed rather than sold. However, if the abandonment involves a separate major line of business or geographical area of operations, the operations of the disposal group qualify as a discontinued operation at the date on which it ceases to be used, even though it was never classified as held for sale prior to that date!"""

part4_say = r"""In Part 4 of Day 54, we master Discontinued Operations: Definition, Operational Carve-Outs, and the Single-Line Presentation Invariant in Profit and Loss.

A critical dimension of Ind AS 105 is ensuring that investors can distinguish between earnings generated by the ongoing core business and earnings generated by operations that will disappear following divestiture. This is achieved through the Discontinued Operations framework:

1. Definition of a Discontinued Operation (Ind AS 105.31):
   A discontinued operation is a component of an entity that either has been disposed of or is classified as held for sale, and:
   (a) Represents a separate major line of business or geographical area of operations;
   (b) Is part of a single coordinated plan to dispose of a separate major line of business or geographical area of operations; or
   (c) Is a subsidiary acquired exclusively with a view to resale.
   - Component of an Entity: A component comprises operations and cash flows that can be clearly distinguished, operationally and for financial reporting purposes, from the rest of the entity (e.g. an operating segment under Ind AS 108 or a distinct Cash-Generating Unit under Ind AS 36).
   - In Mahindra Sterling's structure, the Thermal Turbine Division represents an entire standalone business line and operating segment, fulfilling criterion (a) completely.

2. The Single-Line Presentation Invariant (Ind AS 105.33):
   On the face of the Statement of Profit and Loss, an entity shall present a single amount comprising the total of:
   (i) The post-tax profit or loss of discontinued operations; and
   (ii) The post-tax gain or loss recognized on the measurement to fair value less costs to sell or on the disposal of the assets or disposal group(s) constituting the discontinued operation.

3. Quantifying the Single Line for Mahindra Sterling:
   Let us audit the full-year operational performance and measurement write-down of the Thermal Turbine Division:
   - Annual Operating Revenue of Division: $\$18,000,000.00$
   - Annual Operating Expenses (Cost of sales, salaries, utilities): $\$15,000,000.00$
   - Pre-Tax Operating Profit: $\$18,000,000.00 - \$15,000,000.00 = \$3,000,000.00$
   - Pre-Tax Ind AS 105 Measurement Impairment Loss: $-\$4,500,000.00$
   - Total Pre-Tax Result of Discontinued Operations:
     $$\text{Total Pre-Tax Result} = \$3,000,000.00 - \$4,500,000.00 = -\$1,500,000.00$$
   - Applicable Corporate Income Tax Rate (Section 115BAA): 25.168%.
   - Income Tax Effect: Because the division generated a pre-tax loss of $\$1,500,000.00$, it generates an income tax benefit of:
     $$\text{Tax Benefit} = -\$1,500,000.00 \times 25.168\% = -\$377,520.00$$
   - Net Post-Tax Result of Discontinued Operations:
     $$\text{Net Loss} = -\$1,500,000.00 - (-\$377,520.00) = -\$1,122,480.00$$
   - Presentation on Face of P&L:
     Mahindra Sterling presents a single line item below Profit After Tax from Continuing Operations:
     "Loss from Discontinued Operations (Net of Tax): $(\$1,122,480.00)$".
   - Comparative Restatement Rule: An entity must re-present the disclosures for prior periods in the Statement of Profit and Loss so that the disclosures relate to all operations that have been discontinued by the end of the reporting period for the latest period presented. This guarantees that historical revenue and profit trends reflect only continuing core operations!

4. Earnings Per Share (EPS) Presentation Invariant (Ind AS 105.33 / Ind AS 33):
   - Under Ind AS 33 (Earnings Per Share), an entity must present basic and diluted earnings per share for continuing operations and for discontinued operations separately, either on the face of the Statement of Profit and Loss or in the notes to financial statements.
   - For Mahindra Sterling, presenting discontinued EPS separately ensures that institutional equity research analysts and institutional asset managers do not penalize the ongoing core business valuation multiples for the transient $-1.12M post-tax loss incurred by the divested turbine segment, preserving accurate price-to-earnings (P/E) multiples for continuing operations. Furthermore, net cash flows attributable to the operating, investing, and financing activities of discontinued operations must be disclosed separately either on the face of the Statement of Cash Flows or in the notes."""

part5_say = r"""In Part 5 of Day 54, we execute our standalone Python software engine `IndAS105DisposalGroupEngine`, verify all financial statement invariants, review balance sheet carve-outs, and certify completion of Day 54!

Inspect our standalone Python simulation code in the interactive sandbox editor. It encapsulates the full Ind AS 105 accounting workflow for Mahindra Sterling Industrial Holdings Ltd:
1. Disposal Group Register: Initializes gross assets ($36.0M across Goodwill, Plant, Buildings, Patents, Working Capital) and operating liabilities ($4.0M), establishing an initial net carrying amount of $32,000,000.00.
2. Fair Value Less Costs to Sell (FVLCTS): Computes net exit value of $27,500,000.00 ($29M agreed price - $1.5M direct disposal costs).
3. Measurement Write-Down: Identifies the $4,500,000.00 impairment write-down required under the lower of carrying amount and FVLCTS rule.
4. Two-Tier Allocation Waterfall:
   - Tier 1: Writes off 100% of Goodwill ($2,000,000.00 to $0.00).
   - Tier 2: Allocates remaining $2,500,000.00 pro-rata across qualifying non-current assets: Plant & Machinery ($1,250,000.00; new carrying $12.75M), Factory Buildings ($892,857.14; new carrying $9.11M), and Turbine Patents ($357,142.86; new carrying $3.64M).
5. Post-Measurement Net Asset Reconciliation: Verifies that net assets equal exactly $27,500,000.00.
6. Single-Line Discontinued Operations P&L Engine: Synthesizes operating revenues ($18M), operating costs ($15M), and measurement impairment (-$4.5M) into a pre-tax loss of -$1,500,000.00. Applies 25.168% tax rate to compute tax benefit of $377,520.00, yielding the exact single-line post-tax loss of -$1,122,480.00.

Balance Sheet Presentation under Schedule III:
Under Division II of Schedule III of the Companies Act 2013:
- The assets of the disposal group classified as held for sale ($31,500,000.00 post-impairment gross assets) must be presented separately from other assets under Current Assets on the face of the Balance Sheet as "Assets Classified as Held for Sale".
- The liabilities of the disposal group ($4,000,000.00) must be presented separately from other liabilities under Current Liabilities as "Liabilities Directly Associated with Assets Classified as Held for Sale".
- Offsetting assets and liabilities of a disposal group on the balance sheet is strictly prohibited!
- Under Clause 3(i) and Clause 3(xvii) of CARO 2020, statutory auditors verify that proper board authorization was documented, asset impairment was allocated in accordance with Ind AS 36, and that cash losses from discontinued operations are accurately reported.
- Under Regulation 30 of the SEBI (Listing Obligations and Disclosure Requirements) Regulations, 2015, listed enterprises are legally mandated to disclose material divestitures, sales of divisions, or disposal group agreements to stock exchanges (NSE and BSE) within 24 hours of board approval, including the expected date of completion, amount of turnover contributed by such unit, and details of the buyer.
- In addition, under Standard on Auditing (SA) 570 (Going Concern), if a divested division generated a substantial portion of operating cash flows, the statutory auditor must evaluate whether the disposal compromises the going-concern viability of the remaining enterprise, or conversely, whether the divestiture successfully restores financial solvency.

Our automated software platform performs deterministic validation checks across each accounting step, ensuring that the trial balance, cash flow statement, and balance sheet reflect exact mathematical harmony. The engine validates that post-measurement net assets match the $27,500,000.00 FVLCTS to the exact cent, and that the single-line post-tax loss of -$1,122,480.00 is computed correctly net of the 25.168% Section 115BAA tax shield. When our Python simulation engine executes, every single assertion and statutory check validates with zero discrepancy, culminating in the terminal confirmation string:
`IND_AS_105_HELD_FOR_SALE_DISCONTINUED_PASS`."""

day54_lesson = {
    "coursePrefix": "bcom-accounting",
    "day": 54,
    "title": "Ind AS 105 / IFRS 5: Non-Current Assets Held for Sale & Discontinued Operations (Classification, Measurement, Cessation of Depreciation & Presentation)",
    "parts": [
        {
            "part": 1,
            "title": "Ind AS 105 Classification Criteria: Available for Immediate Sale & Highly Probable Invariants",
            "say": part1_say,
            "code": day54_code,
            "output": day54_output,
            "check": {
                "question": "What two conditions must be met simultaneously for an asset or disposal group to be classified as held for sale under Ind AS 105?",
                "options": [
                    "It must be available for immediate sale in its present condition AND its sale must be highly probable within one year",
                    "It must be fully depreciated AND owned by the government",
                    "It must have zero operating liabilities AND generate positive cash flow",
                    "It must be listed on a commodity exchange AND insured against flood"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Ind AS 105.6-8 requires that the asset/disposal group must be available for immediate sale in its present condition and its sale must be highly probable within 12 months.",
                "why": "Ind AS 105.6-8 requires that the asset/disposal group must be available for immediate sale in its present condition and its sale must be highly probable within 12 months."
            }
        },
        {
            "part": 2,
            "title": "Measurement Architecture: Lower of Carrying Amount and Fair Value Less Costs to Sell (FVLCTS)",
            "say": part2_say,
            "code": day54_code,
            "output": day54_output,
            "check": {
                "question": "How is a non-current asset or disposal group measured upon classification as held for sale under Ind AS 105?",
                "options": [
                    "At the lower of its carrying amount and fair value less costs to sell (FVLCTS)",
                    "At its original historical acquisition cost with zero adjustment",
                    "At its undiscounted projected cash flows over 5 years",
                    "At the higher of net book value and liquidation scrap value"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Ind AS 105.15 prescribes measurement at the lower of carrying amount and fair value less costs to sell (FVLCTS).",
                "why": "Ind AS 105.15 prescribes measurement at the lower of carrying amount and fair value less costs to sell (FVLCTS)."
            }
        },
        {
            "part": 3,
            "title": "Operational Invariants: Cessation of Depreciation, Subsequent Reversals & Changes to a Plan of Sale",
            "say": part3_say,
            "code": day54_code,
            "output": day54_output,
            "check": {
                "question": "What is the statutory rule under Ind AS 105.25 regarding depreciation and amortization while an asset is classified as held for sale?",
                "options": [
                    "An entity shall NOT depreciate (or amortize) a non-current asset while it is classified as held for sale",
                    "Depreciation continues at double the normal straight-line rate",
                    "Amortization is charged directly to retained earnings instead of profit or loss",
                    "Depreciation is only suspended if approved by the National Company Law Tribunal"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Ind AS 105.25 strictly mandates that an entity shall not depreciate or amortize a non-current asset while classified as held for sale.",
                "why": "Ind AS 105.25 strictly mandates that an entity shall not depreciate or amortize a non-current asset while classified as held for sale."
            }
        },
        {
            "part": 4,
            "title": "Discontinued Operations Architecture & Single-Line P&L Presentation Invariant",
            "say": part4_say,
            "code": day54_code,
            "output": day54_output,
            "check": {
                "question": "How must the results of discontinued operations be presented on the face of the Statement of Profit and Loss under Ind AS 105.33?",
                "options": [
                    "As a single amount comprising the post-tax profit/loss of discontinued operations and post-tax gain/loss on measurement or disposal",
                    "Commingled line-by-line within continuing revenues and expenses without distinction",
                    "Excluded completely from financial statements and reported only in tax returns",
                    "Recorded as an offset against share premium in the equity section"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Ind AS 105.33 requires presentation of a single line item on the face of the P&L representing the total post-tax result of discontinued operations.",
                "why": "Ind AS 105.33 requires presentation of a single line item on the face of the P&L representing the total post-tax result of discontinued operations."
            }
        },
        {
            "part": 5,
            "title": "Enterprise Ind AS 105 Software Engine, Balance Sheet Carve-Out & Day 54 Certification",
            "say": part5_say,
            "code": day54_code,
            "output": day54_output,
            "check": {
                "question": "What is the final confirmation string emitted by the Enterprise Ind AS 105 Engine upon verifying all measurement and single-line P&L assertions?",
                "options": [
                    "IND_AS_105_HELD_FOR_SALE_DISCONTINUED_PASS",
                    "IND_AS_105_MEASUREMENT_ERROR_HALT",
                    "DISPOSAL_GROUP_ALLOCATION_FAILED",
                    "SINGLE_LINE_PNL_RECONCILIATION_EXCEPTION"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "The simulation engine verifies all held-for-sale measurement and discontinued operation assertions and concludes by emitting IND_AS_105_HELD_FOR_SALE_DISCONTINUED_PASS.",
                "why": "The simulation engine verifies all held-for-sale measurement and discontinued operation assertions and concludes by emitting IND_AS_105_HELD_FOR_SALE_DISCONTINUED_PASS."
            }
        }
    ]
}

total_words = 0
for p in day54_lesson["parts"]:
    wc = count_words(p["say"])
    total_words += wc
    print(f"Day 54 Part {p['part']} words: {wc}")

for p in day54_lesson["parts"]:
    wc = count_words(p["say"])
    assert wc >= 580, f"Part {p['part']} word count {wc} < 580"

print(f"Day 54 Total words: {total_words}")
assert total_words >= 3000, f"Total word count {total_words} < 3000"

with open("scripts/bcom_acc_day54.json", "w", encoding="utf-8") as f:
    json.dump(day54_lesson, f, indent=2)

print("Saved scripts/bcom_acc_day54.json successfully!")
