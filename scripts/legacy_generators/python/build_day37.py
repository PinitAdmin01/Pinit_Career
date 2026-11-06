import json
import re

def count_words(text):
    return len(re.findall(r'\b[A-Za-z0-9_-]+\b', text))

day37_code = """# Day 37: Ind AS 12 Income Taxes & Deferred Tax Engine
# Balance Sheet Liability Method calculating Taxable vs Deductible Temporary Differences and Net DTA/DTL.

from dataclasses import dataclass
from typing import List, Dict

@dataclass
class BalanceSheetItem:
    item_name: str
    is_asset: bool
    carrying_amount: float
    tax_base: float

class IndAS12DeferredTaxEngine:
    def __init__(self, enterprise_name: str, tax_rate_pct: float):
        self.enterprise_name = enterprise_name
        self.tax_rate = tax_rate_pct / 100.0

    def compute_deferred_tax(self, items: List[BalanceSheetItem]) -> Dict[str, any]:
        \"\"\"Calculates temporary differences and DTA/DTL using Balance Sheet Liability method.\"\"\"
        taxable_temp_diff = 0.0
        deductible_temp_diff = 0.0
        details = []

        for item in items:
            if item.is_asset:
                diff = item.carrying_amount - item.tax_base
                if diff > 0:
                    taxable_temp_diff += diff
                    kind = "Taxable (DTL)"
                else:
                    deductible_temp_diff += abs(diff)
                    kind = "Deductible (DTA)"
            else: # Liability
                diff = item.tax_base - item.carrying_amount
                if diff > 0:
                    taxable_temp_diff += diff
                    kind = "Taxable (DTL)"
                else:
                    deductible_temp_diff += abs(diff)
                    kind = "Deductible (DTA)"

            details.append({
                "item": item.item_name,
                "carrying": item.carrying_amount,
                "tax_base": item.tax_base,
                "difference": round(abs(item.carrying_amount - item.tax_base), 2),
                "type": kind
            })

        dtl_amount = round(taxable_temp_diff * self.tax_rate, 2)
        dta_amount = round(deductible_temp_diff * self.tax_rate, 2)
        net_position = round(dtl_amount - dta_amount, 2)
        is_net_dtl = net_position > 0

        return {
            "taxable_temporary_difference": round(taxable_temp_diff, 2),
            "deductible_temporary_difference": round(deductible_temp_diff, 2),
            "deferred_tax_liability": dtl_amount,
            "deferred_tax_asset": dta_amount,
            "net_deferred_tax_balance": abs(net_position),
            "net_classification": "Net Deferred Tax Liability" if is_net_dtl else "Net Deferred Tax Asset",
            "details": details
        }

# Enacted tax rate under Section 115BAA: 22% base + 10% surcharge + 4% cess = 25.168%
engine = IndAS12DeferredTaxEngine("Vertex Industrial Solutions Ltd", 25.168)

portfolio = [
    BalanceSheetItem("Plant & Machinery (SLM vs WDV)", is_asset=True, carrying_amount=800000.0, tax_base=600000.0),
    BalanceSheetItem("Provision for Warranties", is_asset=False, carrying_amount=150000.0, tax_base=0.0),
    BalanceSheetItem("Right-of-Use Asset (Ind AS 116)", is_asset=True, carrying_amount=517024.0, tax_base=0.0),
    BalanceSheetItem("Lease Liability (Ind AS 116)", is_asset=False, carrying_amount=492024.0, tax_base=0.0),
]

res = engine.compute_deferred_tax(portfolio)

assert res["taxable_temporary_difference"] == 717024.0
assert res["deductible_temporary_difference"] == 642024.0
assert res["deferred_tax_liability"] == 180460.60
assert res["deferred_tax_asset"] == 161584.60
assert res["net_deferred_tax_balance"] == 18876.00
assert res["net_classification"] == "Net Deferred Tax Liability"

print(f"Enterprise: {engine.enterprise_name} (Tax Rate: {engine.tax_rate*100}%)")
print(f"Total Taxable Temporary Differences: ${res['taxable_temporary_difference']}")
print(f"Total Deductible Temporary Differences: ${res['deductible_temporary_difference']}")
print(f"Gross DTL: ${res['deferred_tax_liability']} | Gross DTA: ${res['deferred_tax_asset']}")
print(f"Reported Balance Sheet Position: {res['net_classification']} of ${res['net_deferred_tax_balance']}")
print("IND_AS_12_INCOME_TAXES_DTA_DTL_PASS")
"""

day37_output = """Enterprise: Vertex Industrial Solutions Ltd (Tax Rate: 25.168000000000003%)
Total Taxable Temporary Differences: $717024.0
Total Deductible Temporary Differences: $642024.0
Gross DTL: $180460.6 | Gross DTA: $161584.6
Reported Balance Sheet Position: Net Deferred Tax Liability of $18876.0
IND_AS_12_INCOME_TAXES_DTA_DTL_PASS"""

part1_say = r"""Welcome to Day 37 of Corporate & Financial Accounting. Today we master one of the most intellectually demanding, mathematically intricate, and scrutinised standards in international corporate reporting: Indian Accounting Standard (Ind AS) 12 and International Accounting Standard (IAS) 12, 'Income Taxes'. For corporate financial controllers, tax directors, and statutory auditors, the accounting for corporate income taxes represents the crucial bridge between financial accounting profit reported under Ind AS and taxable income computed under the Income Tax Act, 1961.

Corporate income tax accounting encompasses two distinct statutory components:
1. Current Tax: The amount of income taxes payable (or recoverable) in respect of the taxable profit (or tax loss) for a period, computed strictly under the provisions of the prevailing tax law (such as the Income Tax Act in India).
2. Deferred Tax: The amounts of income taxes payable or recoverable in future periods, arising from the recovery of the carrying amount of assets or settlement of the carrying amount of liabilities recognized on the balance sheet.

To understand why Ind AS 12 is structured as it is, we must appreciate the historical evolution of tax accounting. Under legacy Indian GAAP (Accounting Standard 22 / AS 22), companies followed the 'Income Statement Approach' based on 'Timing Differences'. Accountants compared revenue and expenses recognized in the Profit and Loss Account against revenue and expenses allowable for tax purposes. If an expense was debited in P&L this year but tax-deductible next year, a timing difference was recorded.

However, the international financial reporting community discovered that the Income Statement Approach had fatal structural blind spots! It completely failed to account for tax consequences arising from balance sheet transactions that bypassed the income statement—such as revaluations of property, plant, and equipment recognized in Other Comprehensive Income (OCI), business combinations where acquired assets are stepped up to fair value under Ind AS 103, and equity transactions like share issue expenses debited directly to Securities Premium under Ind AS 32.

Consequently, Ind AS 12 and IAS 12 completely abandoned the Income Statement timing difference approach in favor of the rigorous 'Balance Sheet Liability Method' based on 'Temporary Differences'. Under the Balance Sheet Liability Method, deferred tax is calculated by systematically comparing the Carrying Amount of every single asset and liability on the balance sheet against its statutory 'Tax Base'. 

Furthermore, corporate controllers must distinguish between 'Temporary Differences' and 'Permanent Differences'. Permanent differences are items of revenue or expense that are recognized in accounting profit but never in taxable profit, or vice versa. Common examples in corporate India include corporate social responsibility (CSR) expenditures disallowed under Section 37(1) of the Income Tax Act, statutory fines and penalties levied by regulatory authorities, and tax-exempt dividend income. Crucially, permanent differences NEVER generate deferred tax assets or liabilities because they will never reverse in future periods; instead, they permanently alter the company's Effective Tax Rate (ETR).

The fundamental premise of the balance sheet approach is deceptively simple yet profoundly rigorous: whenever an entity recognizes an asset, it expects to recover the carrying amount of that asset in future periods through use or sale. If that recovery will generate taxable cash flows that exceed the amounts that will be deductible for tax purposes, a Deferred Tax Liability (DTL) MUST be recognized today! Conversely, if the recovery or settlement will generate future tax deductions exceeding future taxable income, a Deferred Tax Asset (DTA) is recognized. Over the course of today's masterclass, we will construct the complete balance sheet tax engine governing converged corporate reporting."""

part2_say = r"""In Part 2, we explore the precise statutory definition of the 'Tax Base' and dismantle the initial recognition exemption under Ind AS 12.

The entire architecture of the Balance Sheet Liability Method hinges upon a single foundational concept: the Tax Base. Under Ind AS 12, the Tax Base of an asset or liability is defined as the amount attributed to that asset or liability for tax purposes by the taxation authorities.
Let us define the exact rules for determining the tax base:
1. Tax Base of an Asset: The tax base of an asset is the amount that will be deductible for tax purposes against any taxable economic benefits that will flow to an entity when it recovers the carrying amount of the asset.
   * If those economic benefits will not be taxable, the tax base of the asset is equal to its carrying amount.
   * For example, consider an industrial machine purchased for $1,000,000. In Year 1, accounting depreciation under Ind AS 16 (Straight-Line Method over 10 years) is $100,000, so the carrying amount is $900,000. However, tax depreciation under Section 32 of the Income Tax Act (Written Down Value method at 15% plus initial depreciation of 20%) is $350,000. The tax base of the machine is $1,000,000 - $350,000 = $650,000.
2. Tax Base of a Liability: The tax base of a liability is its carrying amount, less any amount that will be deductible for tax purposes in respect of that liability in future periods.
   * For example, consider a Provision for Warranties of $150,000 recognized under Ind AS 37. Under the Income Tax Act, warranty expenses are not deductible when accrued; they are deductible only when actual warranty claims are settled in cash. Therefore, future tax deductions equal $150,000. The tax base of the liability is $150,000 (carrying amount) - $150,000 (future deductions) = $0.00!
   * In the case of revenue received in advance (Contract Liability / Deferred Revenue of $100,000), if the cash was already taxed when received at inception, the tax base of the resulting liability is $0.00.

Furthermore, controllers must navigate the tax bases of consolidated group assets. In multi-entity corporate groups, intra-group inventory transfers frequently occur at a profit markup. Under Ind AS 110, unrealized intra-group profits must be eliminated upon consolidation, which reduces the carrying amount of inventory back to original cost. However, in the purchasing subsidiary's local tax return, the tax base of the inventory remains the higher transfer price! This creates a deductible temporary difference on consolidation, mandating the recognition of a Deferred Tax Asset in the consolidated financial statements.

Next, controllers must understand the 'Initial Recognition Exemption' (IRE). Under Ind AS 12 Paragraphs 15 and 24, an entity does not recognize a deferred tax liability or asset on the initial recognition of an asset or liability in a transaction that:
1. Is NOT a business combination; AND
2. At the time of the transaction, affects NEITHER accounting profit nor taxable profit (tax loss).

For decades, the Initial Recognition Exemption caused intense debate regarding Ind AS 116 Leases and decommissioning provisions under Ind AS 37. When an entity capitalizes a Right-of-Use (ROU) asset and a lease liability at inception, cash is not immediately affected, and neither accounting profit nor taxable profit is impacted. Did the IRE apply, exempting leases from deferred tax?
To resolve this ambiguity, the International Accounting Standards Board (IASB) issued the landmark 'Deferred Tax related to Assets and Liabilities arising from a Single Transaction' amendments (adopted into Ind AS 12 by the Ministry of Corporate Affairs). The amendments narrowed the IRE: the exemption DOES NOT APPLY to transactions that give rise to equal taxable and deductible temporary differences on initial recognition!
Therefore, entities MUST recognize both a Deferred Tax Liability on the ROU Asset and a Deferred Tax Asset on the Lease Liability, tracking both lines through their respective amortization schedules."""

part3_say = r"""In Part 3, we analyze Taxable versus Deductible Temporary Differences and the rigorous probability recognition threshold for Deferred Tax Assets.

Once the Carrying Amount and Tax Base of every balance sheet line item are established, the Controller computes the 'Temporary Difference' (Carrying Amount minus Tax Base). Ind AS 12 bifurcates all temporary differences into two categories:
1. Taxable Temporary Differences: Temporary differences that will result in taxable amounts in determining taxable profit (tax loss) of future periods when the carrying amount of the asset or liability is recovered or settled.
   * A taxable temporary difference arises whenever:
     - The Carrying Amount of an Asset is GREATER than its Tax Base (e.g., accelerated tax depreciation where Tax Base < Carrying Amount).
     - The Carrying Amount of a Liability is LESS than its Tax Base.
   * Every Taxable Temporary Difference gives rise to a DEFERRED TAX LIABILITY (DTL). Under Ind AS 12, recognition of a DTL is mandatory (with narrow exceptions for initial goodwill recognition).
2. Deductible Temporary Differences: Temporary differences that will result in amounts that are deductible in determining taxable profit (tax loss) of future periods when the carrying amount of the asset or liability is recovered or settled.
   * A deductible temporary difference arises whenever:
     - The Carrying Amount of an Asset is LESS than its Tax Base (e.g., impairment loss recognized under Ind AS 36, or expected credit loss allowance under Ind AS 109 not yet deductible for tax).
     - The Carrying Amount of a Liability is GREATER than its Tax Base (e.g., warranty provisions, gratuity provisions under Ind AS 19, or lease liabilities under Ind AS 116).
   * Deductible Temporary Differences give rise to a DEFERRED TAX ASSET (DTA).

However, unlike DTLs which must always be recognized, the recognition of a DEFERRED TAX ASSET is subject to a strict statutory test under Ind AS 12 Paragraph 24:
"A deferred tax asset shall be recognized for all deductible temporary differences to the extent that it is PROBABLE that taxable profit will be available against which the deductible temporary difference can be utilized."

What constitutes 'Probable' under Ind AS 12?
In IFRS jurisprudence, 'probable' means 'more likely than not'—representing an objective probability exceeding 50%. Management cannot simply assume future profits based on optimism. Ind AS 12 establishes a sequential hierarchy of evidence:
1. Existence of Sufficient Taxable Temporary Differences: If the entity has existing DTLs reversing in the same period and tax jurisdiction, DTA recognition is automatically justified because the reversing DTLs will generate taxable income to absorb the DTA deductions.
2. Strong Historical Profitability and Reliable Forecasts: In the absence of sufficient DTLs, management must produce audited, board-approved business plans showing convincing evidence of future taxable profits.
3. Tax Planning Opportunities: Actions that the entity can legally take to generate taxable profit, such as changing depreciation methods or selling appreciated corporate property.

Under Ind AS 12 Paragraph 56, the carrying amount of a deferred tax asset must be reviewed at the end of each reporting period. If it is no longer probable that sufficient taxable profit will be available, the carrying amount must be written down through P&L. Conversely, if an entity previously had unrecorded DTAs and its profitability prospects dramatically improve (for example, by securing a lucrative multi-year corporate contract), the previously unrecorded DTA is recognized immediately in P&L, generating a deferred tax credit. Under Section 72 of the Income Tax Act, business losses can be carried forward for a maximum of 8 assessment years, mandating careful scheduling of loss expiration horizons."""

part4_say = r"""In Part 4, we examine the quantitative measurement of deferred taxes, applicable corporate tax rates, MAT credit entitlements, Pillar Two rules, and presentation outside the income statement.

Under Ind AS 12 Paragraph 46, deferred tax assets and liabilities must be measured at the tax rates that are expected to apply to the period when the asset is realized or the liability is settled, based on tax rates (and tax laws) that have been ENACTED or SUBSTANTIVELY ENACTED by the end of the reporting period.
In corporate India, the determination of the applicable tax rate requires careful statutory analysis:
- The Taxation Laws (Amendment) Act, 2019, introduced Section 115BAA into the Income Tax Act, granting domestic corporate entities the option to pay income tax at a concessional base rate of 22%, subject to surcharges of 10% and education cess of 4%, resulting in an Effective Tax Rate of:
  $Effective Rate = 22\% \times (1 + 0.10) \times (1 + 0.04) = 25.168\%$!
- If a corporation opts for Section 115BAA, it must abandon all special deductions (such as Section 80JJAA, Section 35(2AB) scientific research, and holiday tax exemptions) and cannot utilize accumulated Minimum Alternate Tax (MAT) credit balances.
- If a corporation remains under the old tax regime, the standard corporate tax rate is 30% base + 12% surcharge + 4% cess = 34.944%, and it remains subject to MAT under Section 115JB at 15% base + surcharge + cess = 17.472%.

When an entity switches from the old 34.944% regime to Section 115BAA at 25.168%, Ind AS 12 mandates that ALL OPEN DEFERRED TAX BALANCES MUST BE REMEASURED at the new 25.168% rate immediately in the period of transition! If a company held a large DTA, remeasuring it down from 34.944% to 25.168% produces an immediate deferred tax charge hitting the Profit and Loss statement.

Furthermore, corporate controllers of multinational enterprises must monitor the OECD/G20 Pillar Two Global Anti-Base Erosion (GloBE) rules introducing a 15% global minimum tax. Ind AS 12 has introduced a mandatory temporary exception from accounting for deferred taxes arising from Pillar Two legislation, requiring targeted qualitative and quantitative footnote disclosures of the entity's exposure to Pillar Two income taxes instead.

Ind AS 12 also enforces the strict 'Underlying Transaction Principle' governing where deferred tax is presented:
1. Profit or Loss: Deferred tax relating to items recognized in P&L is recognized in P&L (the vast majority of operational transactions).
2. Other Comprehensive Income (OCI): Deferred tax relating to items recognized in OCI MUST be recognized in OCI! For example, unrealized fair value gains on equity instruments classified as FVTOCI under Ind AS 109, and actuarial remeasurement gains/losses on defined benefit pension plans under Ind AS 19.
3. Directly in Equity: Deferred tax relating to items credited or debited directly to equity must be recognized directly in equity. A prime example is share issue expenses (such as underwriting and merchant banking fees for an IPO) written off against Securities Premium under Section 52 of the Companies Act; the tax shield is credited directly to Securities Premium!

Finally, regarding Balance Sheet Presentation: under Ind AS 12 Paragraph 74, an entity can offset deferred tax assets and deferred tax liabilities ONLY if:
1. The entity has a legally enforceable right to set off current tax assets against current tax liabilities; AND
2. The deferred tax assets and deferred tax liabilities relate to income taxes levied by the same taxation authority on the same taxable entity.
Consequently, on the face of the Schedule III Balance Sheet, deferred tax is presented strictly as a single line: either Net Deferred Tax Asset (under Non-Current Assets) or Net Deferred Tax Liability (under Non-Current Liabilities). Deferred tax balances can NEVER be classified as current assets or liabilities!"""

part5_say = r"""In Part 5, we execute our Python Ind AS 12 Deferred Tax Engine, verify all statutory and mathematical assertions, and review the effective tax rate reconciliation.

Now, inspect our standalone Python class `IndAS12DeferredTaxEngine`. This system encapsulates the full balance sheet liability method across a diversified corporate asset-liability portfolio for Vertex Industrial Solutions Ltd:
1. Enacted Corporate Tax Rate: The engine initializes with the Section 115BAA corporate tax rate of 25.168%.
2. Portfolio Valuation:
   - Plant & Machinery: Carrying Amount = $800,000 (SLM depreciation); Tax Base = $600,000 (accelerated WDV). The carrying amount exceeds the tax base by $200,000, creating a Taxable Temporary Difference.
   - Provision for Warranties: Carrying Amount = $150,000; Tax Base = $0 (deductible on cash payment). The liability creates a Deductible Temporary Difference of $150,000.
   - Right-of-Use Asset (Ind AS 116): Carrying Amount = $517,024; Tax Base = $0. Creates a Taxable Temporary Difference of $517,024.
   - Lease Liability (Ind AS 116): Carrying Amount = $492,024; Tax Base = $0. Creates a Deductible Temporary Difference of $492,024.
3. Aggregation of Temporary Differences:
   - Total Taxable Temporary Differences = $\$200,000 + \$517,024 = \$717,024.00$.
   - Total Deductible Temporary Differences = $\$150,000 + \$492,024 = \$642,024.00$.
4. Computation of Gross and Net Tax Balances:
   - Gross Deferred Tax Liability (DTL) = $\$717,024.00 \times 25.168\% = \$180,460.60$.
   - Gross Deferred Tax Asset (DTA) = $\$642,024.00 \times 25.168\% = \$161,584.60$.
   - Net Balance Sheet Position = $\$180,460.60 - \$161,584.60 = \$18,876.00$.
   - Classification: Because DTL exceeds DTA, the enterprise reports a single line 'Net Deferred Tax Liability' of $\$18,876.00$ under Non-Current Liabilities on its Balance Sheet!

Behind each code line in `IndAS12DeferredTaxEngine` lies an automated reconciliation system. The Python loop iterates over `BalanceSheetItem` dataclasses, dynamically categorizing differences based on asset vs liability rules: for assets, positive differences ($Carrying > TaxBase$) are taxable; for liabilities, positive differences ($TaxBase > Carrying$) are taxable. The engine aggregates gross totals, applies the floating-point rounded tax rate, and determines the statutory net balance sheet presentation.

Let us review the corporate double-entry accounting entries required to record these deferred tax balances at year-end:
- If the opening Net DTL was zero, the Year 1 closing entry is:
  * Debit: Deferred Tax Expense (Profit & Loss) — $\$18,876.00$
  * Credit: Net Deferred Tax Liability (Balance Sheet) — $\$18,876.00$
- If a portion of the temporary difference arose from an OCI item (e.g. an upward revaluation of land under Ind AS 16), the entry would be:
  * Debit: Other Comprehensive Income (Tax on Revaluation Surplus)
  * Credit: Deferred Tax Liability

Under Ind AS 12 Paragraph 81(c), entities must publish a detailed 'Effective Tax Rate Reconciliation' explaining the relationship between tax expense and accounting profit. The reconciliation starts from Profit Before Tax multiplied by the statutory rate (25.168%) and itemizes reconciling items: permanent non-deductible expenses (such as CSR expenditure under Section 135 and penalties), tax-exempt income (such as agricultural income or dividend exemptions), differential tax rates on capital gains, and unrecorded deferred tax adjustments.

Upon execution of our Python validation script, every balance sheet temporary difference reconciles with mathematical perfection, validating the engine and emitting the terminal triumph confirmation string:
`IND_AS_12_INCOME_TAXES_DTA_DTL_PASS`.
You have now conquered the balance sheet liability approach, temporary differences, and deferred tax accounting under Ind AS 12. In Day 38, we will explore the complex architecture of Earnings Per Share (EPS) under Ind AS 33, mastering the treasury stock method for stock options and the if-converted method for convertible debentures across complex capital structures in modern corporate finance."""

day37_lesson = {
    "coursePrefix": "bcom-accounting",
    "day": 37,
    "title": "Ind AS 12 & IAS 12: Income Taxes, Balance Sheet Liability Approach & Deferred Tax Assets / Liabilities",
    "parts": [
        {
            "part": 1,
            "title": "Current Tax vs Deferred Tax & The Shift to the Balance Sheet Liability Method",
            "say": part1_say,
            "code": day37_code,
            "output": day37_output,
            "check": {
                "question": "Why did Ind AS 12 replace legacy Indian GAAP's income statement timing difference method with the balance sheet liability method?",
                "options": [
                    "To capture tax consequences of balance sheet items that bypass the income statement, such as revaluations in OCI, business combinations, and equity transaction costs",
                    "To eliminate all deferred tax reporting and require only cash-basis tax accounting",
                    "To ensure that corporate income tax is always recognized as zero on the balance sheet",
                    "To force corporations to compute tax depreciation using straight-line methods"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "The Balance Sheet Liability Method computes deferred tax by comparing carrying amounts against tax bases, capturing all temporary differences including those that bypass P&L through OCI or equity.",
                "why": "The Balance Sheet Liability Method computes deferred tax by comparing carrying amounts against tax bases, capturing all temporary differences including those that bypass P&L through OCI or equity."
            }
        },
        {
            "part": 2,
            "title": "The Tax Base Concept, Asset vs Liability Formulations & Initial Recognition Narrowing",
            "say": part2_say,
            "code": day37_code,
            "output": day37_output,
            "check": {
                "question": "What is the tax base of a $150,000 warranty provision under Ind AS 12 when warranty expenses are tax-deductible only upon cash settlement?",
                "options": [
                    "$0.00, because the carrying amount of $150,000 minus future tax deductions of $150,000 equals zero",
                    "$150,000 representing the gross accrued provision",
                    "$37,752 representing the net tax shield",
                    "Indeterminate until the warranty period expires"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "The tax base of a liability is its carrying amount less any future tax deductions ($150,000 - $150,000 = $0.00).",
                "why": "The tax base of a liability is its carrying amount less any future tax deductions ($150,000 - $150,000 = $0.00)."
            }
        },
        {
            "part": 3,
            "title": "Taxable vs Deductible Temporary Differences & The DTA Probability Threshold",
            "say": part3_say,
            "code": day37_code,
            "output": day37_output,
            "check": {
                "question": "Under what condition is a Deferred Tax Asset (DTA) recognized for deductible temporary differences under Ind AS 12?",
                "options": [
                    "Only to the extent that it is probable (more likely than not) that future taxable profit will be available against which the deduction can be utilized",
                    "Automatically in full regardless of whether the entity has any future profit prospects",
                    "Only if the entity receives written advance authorization from the Income Tax Department",
                    "Never, because Ind AS 12 prohibits the recognition of deferred tax assets"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Ind AS 12 Paragraph 24 restricts DTA recognition to the extent that it is probable (>50% likelihood) that sufficient future taxable profit will exist to absorb the tax deduction.",
                "why": "Ind AS 12 Paragraph 24 restricts DTA recognition to the extent that it is probable (>50% likelihood) that sufficient future taxable profit will exist to absorb the tax deduction."
            }
        },
        {
            "part": 4,
            "title": "Substantively Enacted Tax Rates (Section 115BAA), MAT Credits & Balance Sheet Netting",
            "say": part4_say,
            "code": day37_code,
            "output": day37_output,
            "check": {
                "question": "What is the effective enacted corporate tax rate under Section 115BAA in India used for measuring deferred tax balances?",
                "options": [
                    "25.168% (22% base rate + 10% surcharge + 4% education cess)",
                    "34.944% (30% base rate + 12% surcharge + 4% cess)",
                    "15.000% flat rate with zero surcharge",
                    "18.500% Minimum Alternate Tax rate"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Section 115BAA specifies a 22% base corporate tax rate. Applying the mandatory 10% surcharge yields 24.2%, and adding the 4% health & education cess yields the exact effective rate of 25.168%.",
                "why": "Section 115BAA specifies a 22% base corporate tax rate. Applying the mandatory 10% surcharge yields 24.2%, and adding the 4% health & education cess yields the exact effective rate of 25.168%."
            }
        },
        {
            "part": 5,
            "title": "Python Deferred Tax Engine Execution & Ind AS 12 Balance Sheet Certification",
            "say": part5_say,
            "code": day37_code,
            "output": day37_output,
            "check": {
                "question": "What is the terminal confirmation string emitted by the Ind AS 12 simulation engine upon verifying all balance sheet temporary difference assertions?",
                "options": [
                    "IND_AS_12_INCOME_TAXES_DTA_DTL_PASS",
                    "DEFERRED_TAX_CALCULATION_REJECTED_AUDIT_ERROR",
                    "BALANCE_SHEET_LIABILITY_MISMATCH_FAIL",
                    "INCOME_TAX_RECONCILIATION_ABORTED"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "The Ind AS 12 engine validates all temporary differences, gross DTL/DTA, and net liability classification, concluding with IND_AS_12_INCOME_TAXES_DTA_DTL_PASS.",
                "why": "The Ind AS 12 engine validates all temporary differences, gross DTL/DTA, and net liability classification, concluding with IND_AS_12_INCOME_TAXES_DTA_DTL_PASS."
            }
        }
    ]
}

total_words = 0
for p in day37_lesson["parts"]:
    wc = count_words(p["say"])
    total_words += wc
    print(f"Day 37 Part {p['part']} words: {wc}")

for p in day37_lesson["parts"]:
    wc = count_words(p["say"])
    assert wc >= 580, f"Part {p['part']} word count {wc} < 580"

print(f"Day 37 Total words: {total_words}")
assert total_words >= 3000, f"Total word count {total_words} < 3000"

with open("scripts/bcom_acc_day37.json", "w", encoding="utf-8") as f:
    json.dump(day37_lesson, f, indent=2)

print("Saved scripts/bcom_acc_day37.json successfully!")
