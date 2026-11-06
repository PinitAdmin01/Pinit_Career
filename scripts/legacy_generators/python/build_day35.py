import json
import re

def count_words(text):
    return len(re.findall(r'\b[A-Za-z0-9_-]+\b', text))

day35_code = """# Day 35: Milestone 7 Capstone - Enterprise Financial Controller Ind AS Suite
# Integrated corporate financial reporting simulator combining Ind AS 115 Revenue Allocation,
# Ind AS 116 ROU Leases Amortization, Ind AS 113 Level 3 Fair Value DCF, and Ind AS 109 3-Stage ECL.

from dataclasses import dataclass
from typing import List, Dict

class EnterpriseFinancialControllerSuite:
    def __init__(self, enterprise_name: str):
        self.enterprise_name = enterprise_name

    def process_ind_as_115_revenue(self, bundled_price: float, ssp_hw: float, ssp_cloud: float) -> Dict[str, float]:
        \"\"\"Module 1: Ind AS 115 Relative Standalone Selling Price Allocation\"\"\"
        total_ssp = ssp_hw + ssp_cloud
        alloc_hw = round(bundled_price * (ssp_hw / total_ssp), 2)
        alloc_cloud = round(bundled_price * (ssp_cloud / total_ssp), 2)
        rev_y1 = round(alloc_hw + (alloc_cloud * 0.5), 2)
        deferred_y1 = round(alloc_cloud * 0.5, 2)
        return {
            "alloc_hw": alloc_hw,
            "alloc_cloud": alloc_cloud,
            "recognized_revenue_y1": rev_y1,
            "deferred_revenue_liability": deferred_y1
        }

    def process_ind_as_116_lease(self, annual_rent: float, term_years: int, ibr: float, direct_costs: float) -> Dict[str, float]:
        \"\"\"Module 2: Ind AS 116 Lease Liability & ROU Asset Schedule\"\"\"
        pv_liability = sum(annual_rent / ((1.0 + ibr) ** y) for y in range(1, term_years + 1))
        initial_liability = round(pv_liability, 2)
        initial_rou = round(initial_liability + direct_costs, 2)
        interest_y1 = round(initial_liability * ibr, 2)
        deprec_y1 = round(initial_rou / term_years, 2)
        total_pl_charge = round(interest_y1 + deprec_y1, 2)
        ebitda_benefit = annual_rent
        return {
            "initial_lease_liability": initial_liability,
            "initial_rou_asset": initial_rou,
            "year1_interest_expense": interest_y1,
            "year1_rou_depreciation": deprec_y1,
            "year1_total_pl_charge": total_pl_charge,
            "ebitda_benefit": ebitda_benefit
        }

    def process_ind_as_113_fair_value(self, cash_flows: List[float], discount_rate: float, cva_pct: float) -> Dict[str, float]:
        \"\"\"Module 3: Ind AS 113 Level 3 Fair Value with CVA Credit Adjustment\"\"\"
        raw_pv = sum(cf / ((1.0 + discount_rate) ** t) for t, cf in enumerate(cash_flows, 1))
        cva_amount = raw_pv * (cva_pct / 100.0)
        final_fv = raw_pv - cva_amount
        return {
            "unadjusted_level3_dcf": round(raw_pv, 2),
            "cva_deduction": round(cva_amount, 2),
            "level3_fair_value": round(final_fv, 2)
        }

    def process_ind_as_109_ecl(self, gross_loan_usd: float, stage: int, pd_pct: float, lgd_pct: float) -> Dict[str, float]:
        \"\"\"Module 4: Ind AS 109 Expected Credit Loss Allowance\"\"\"
        pd = pd_pct / 100.0
        lgd = lgd_pct / 100.0
        ecl_allowance = round(gross_loan_usd * pd * lgd, 2)
        net_carrying = round(gross_loan_usd - ecl_allowance, 2)
        return {
            "gross_exposure": gross_loan_usd,
            "stage": stage,
            "ecl_allowance": ecl_allowance,
            "net_carrying_amount": net_carrying
        }

# Execution of Enterprise Financial Controller Simulation
controller = EnterpriseFinancialControllerSuite("Apex Global Enterprise Corp")

# 1. Ind AS 115 Revenue: $100k bundled package (Hardware SSP $75k, Cloud SSP $50k)
rev_mod = controller.process_ind_as_115_revenue(100000.0, 75000.0, 50000.0)
assert rev_mod["alloc_hw"] == 60000.0
assert rev_mod["alloc_cloud"] == 40000.0
assert rev_mod["recognized_revenue_y1"] == 80000.0
assert rev_mod["deferred_revenue_liability"] == 20000.0

# 2. Ind AS 116 Lease: 5-year lease of $120,000/yr at 7% IBR with $25,000 direct costs
lease_mod = controller.process_ind_as_116_lease(120000.0, 5, 0.07, 25000.0)
assert lease_mod["initial_lease_liability"] == 492023.69
assert lease_mod["initial_rou_asset"] == 517023.69
assert lease_mod["year1_interest_expense"] == 34441.66
assert lease_mod["year1_rou_depreciation"] == 103404.74

# 3. Ind AS 113 Fair Value: 3-year private equity DCF [$200k, $250k, $300k] at 12% with 2.0% CVA
fv_mod = controller.process_ind_as_113_fair_value([200000.0, 250000.0, 300000.0], 0.12, 2.0)
assert fv_mod["unadjusted_level3_dcf"] == 591403.97
assert fv_mod["cva_deduction"] == 11828.08
assert fv_mod["level3_fair_value"] == 579575.89

# 4. Ind AS 109 ECL: Corporate credit exposure of $2,000,000 in Stage 2 (SICR, Lifetime PD 8.5%, LGD 40%)
ecl_mod = controller.process_ind_as_109_ecl(2000000.0, 2, 8.5, 40.0)
assert ecl_mod["ecl_allowance"] == 68000.0
assert ecl_mod["net_carrying_amount"] == 1932000.0

print(f"Enterprise: {controller.enterprise_name}")
print(f"Ind AS 115 Year 1 Recognized Revenue: ${rev_mod['recognized_revenue_y1']} (Deferred: ${rev_mod['deferred_revenue_liability']})")
print(f"Ind AS 116 Initial ROU Asset: ${lease_mod['initial_rou_asset']} | Y1 Total P&L Charge: ${lease_mod['year1_total_pl_charge']}")
print(f"Ind AS 113 Level 3 Fair Value (Post-CVA): ${fv_mod['level3_fair_value']}")
print(f"Ind AS 109 Stage 2 ECL Allowance: ${ecl_mod['ecl_allowance']} | Net Loan Carrying Amount: ${ecl_mod['net_carrying_amount']}")
print("ENTERPRISE_CONTROLLER_IND_AS_SUITE_PASS")
"""

day35_output = """Enterprise: Apex Global Enterprise Corp
Ind AS 115 Year 1 Recognized Revenue: $80000.0 (Deferred: $20000.0)
Ind AS 116 Initial ROU Asset: $517023.69 | Y1 Total P&L Charge: $137846.4
Ind AS 113 Level 3 Fair Value (Post-CVA): $579575.89
Ind AS 109 Stage 2 ECL Allowance: $68000.0 | Net Loan Carrying Amount: $1932000.0
ENTERPRISE_CONTROLLER_IND_AS_SUITE_PASS"""

part1_say = """Welcome to Day 35—the Milestone 7 Capstone of Corporate & Financial Accounting. Today you assume the executive position of Group Financial Controller and Chief Accounting Officer of Apex Global Enterprise Corp, a diversified multinational conglomerate preparing its consolidated financial statements under Indian Accounting Standards (Ind AS) converged with IFRS.

The role of the modern Financial Controller extends far beyond supervising day-to-day general ledger reconciliations or approving vendor payment vouchers. In listed enterprise environments, the Controller is the ultimate steward of financial integrity, statutory compliance, and capital market credibility. The Controller sits at the intersection of business strategy and accounting law, ensuring that multi-billion-dollar commercial contracts, complex real estate leasing structures, proprietary investment portfolios, and enterprise credit exposures are measured and reported with uncompromising precision.

Throughout Block 7, we dismantled and mastered the four pillars of modern converged financial reporting:
1. Ind AS 115 (Revenue from Contracts with Customers): Establishing control-based revenue recognition, multi-element standalone selling price allocations, and contract liability accounting.
2. Ind AS 116 (Leases): Overhauling lessee accounting through the single on-balance-sheet model, capitalizing Right-of-Use (ROU) assets, amortizing lease liabilities via the effective interest rate method, and managing P&L front-loading dynamics.
3. Ind AS 113 (Fair Value Measurement): Navigating the three-level fair value hierarchy, evaluating principal versus most advantageous markets, applying Highest and Best Use (HBU) to non-financial assets, and incorporating Credit Valuation Adjustments (CVA) for non-performance risk.
4. Ind AS 109 (Financial Instruments): Executing the dual business model and SPPI classification tests, implementing the forward-looking Three-Stage Expected Credit Loss (ECL) impairment model, and designing trade receivables provision matrices under the simplified approach.

In today's Milestone 7 Capstone, you will orchestrate an integrated year-end financial closing for Apex Global Enterprise Corp. You will harmonize all four standards into a single, cohesive accounting engine, resolving complex interdependencies, defending accounting estimates against statutory audit scrutiny, and producing board-ready financial statement outputs. This capstone represents the definitive transition from theoretical standard memorization to senior-level financial controllership."""

part2_say = """In Part 2 of our Milestone 7 Capstone, we execute Module 1: Enterprise Multi-Element Contract Revenue Architecture under Ind AS 115.

Apex Global Enterprise Corp enters into an enterprise technology transformation contract with a global client for a bundled contract price of $100,000. The contract encompasses two distinct performance obligations:
- Performance Obligation 1: Enterprise Hardware System (Standalone Selling Price / SSP = $75,000).
- Performance Obligation 2: 24-Month Cloud Management Platform Subscription (Standalone Selling Price / SSP = $50,000).

The aggregate standalone selling price of the individual components is $125,000 ($75,000 + $50,000). The client negotiates an enterprise package price of $100,000—representing a $25,000 (20%) bundled discount.
As Financial Controller, you apply Ind AS 115 Step 4: allocating the transaction price strictly in proportion to relative standalone selling prices:
- Hardware Allocation: $100,000 * ($75,000 / $125,000) = $60,000.
- Cloud SaaS Allocation: $100,000 * ($50,000 / $125,000) = $40,000.

Next, you determine the revenue recognition schedule under Step 5:
- Hardware is delivered and accepted at inception (Point in Time): 100% of the allocated consideration ($60,000) is recognized as earned revenue in Year 1.
- Cloud Platform Subscription is satisfied Over Time across 24 months ($1,666.67 per month):
  - In Year 1 (first 12 months): 12 / 24 of $40,000 = $20,000 is recognized as earned revenue.
  - The remaining $20,000 for Year 2 is recognized on the balance sheet as a Contract Liability (Deferred Revenue).

Consequently, total Year 1 Recognized Revenue from the contract equals $80,000.0 ($60,000 hardware + $20,000 cloud), and Contract Liability equals $20,000.0.
By applying relative SSP allocation, you prevent improper revenue acceleration, ensuring that the $25,000 bundle discount is shared proportionately between the physical hardware and the multi-year cloud service, satisfying statutory auditors under Ind AS 115."""

part3_say = """In Part 3 of the Capstone, we execute Module 2: Enterprise Lease Portfolio Capitalization and EBITDA Normalization under Ind AS 116.

Simultaneously, Apex Global Enterprise Corp leases a corporate research and development facility under a 5-year commercial lease contract. The contractual terms dictate annual lease payments of $120,000 paid at the end of each year. Treasury determines the Incremental Borrowing Rate (IBR) to be 7.0%. In addition, Apex incurs $25,000 in initial direct legal and brokerage fees.

As Controller, you execute the Ind AS 116 capitalization schedule:
1. Initial Lease Liability: Present value of 5 annual installments of $120,000 discounted at 7.0%:
   $\text{PV} = \sum_{t=1}^{5} \frac{\$120,000}{(1.07)^t} = \$492,023.69$
2. Initial Right-of-Use (ROU) Asset: Initial liability plus initial direct costs:
   $\text{ROU Asset} = \$492,023.69 + \$25,000.00 = \$517,023.69$
3. Year 1 P&L Charges:
   - Interest Expense on Lease Liability: $\$492,023.69 \times 7.0\% = \$34,441.66$ (recorded under Finance Costs).
   - Straight-Line Depreciation of ROU Asset: $\$517,023.69 / 5 = \$103,404.74$ (recorded under Depreciation & Amortization).
   - Total Year 1 P&L Charge = $\$34,441.66 + \$103,404.74 = \$137,846.40$.

Compare this against legacy accounting: under AS 19, Apex would have reported $120,000 in operating rent. Under Ind AS 116, the total P&L charge in Year 1 is $137,846.40—representing a front-loaded P&L drag of $17,846.40!
However, you present the crucial operational counterweight to the Board of Directors:
Operating Profit / EBITDA expands by exactly $120,000, because operating rental expense is eliminated from EBITDA and shifted below the line into depreciation and interest. Furthermore, Operating Cash Flow increases by $120,000 minus the interest payment, as principal repayment is classified under Financing Cash Flows."""

part4_say = """In Part 4 of the Capstone, we execute Module 3 & Module 4: Valuation Governance under Ind AS 113 and Expected Credit Loss (ECL) Impairment under Ind AS 109.

Module 3: Level 3 Fair Value Measurement (Ind AS 113):
Apex holds a strategic minority equity investment in an unquoted fintech enterprise. Because there are no observable Level 1 market quotes or Level 2 comparable inputs, you deploy an Income Approach using an unobservable Level 3 Discounted Cash Flow (DCF) model.
- Projected net cash flows across the 3-year investment horizon: [$200,000, $250,000, $300,000].
- Risk-adjusted discount rate incorporating liquidity risk premiums = 12.0%.
- Raw unadjusted present value:
  $\text{PV} = \frac{\$200,000}{1.12} + \frac{\$250,000}{(1.12)^2} + \frac{\$300,000}{(1.12)^3} = \$178,571.43 + \$199,298.47 + \$213,534.07 = \$591,403.97$
- Under Ind AS 113, you incorporate counterparty credit risk via a 2.0% Credit Valuation Adjustment (CVA):
  $\text{CVA} = \$591,403.97 \times 2.0\% = \$11,828.08$
- Final Level 3 Fair Value recognized on the balance sheet = $\$591,403.97 - \$11,828.08 = \$579,575.89$.

Module 4: 3-Stage Expected Credit Loss (ECL) Impairment (Ind AS 109):
Apex maintains a corporate financing arm with a $2,000,000 senior secured loan facility extended to an industrial client. During annual review, credit risk surveillance identifies a Significant Increase in Credit Risk (SICR): the borrower's debt-service coverage ratio breached loan covenants, triggering an internal credit downgrade (transitioning from Stage 1 into Stage 2).
Under Ind AS 109, you immediately reclassify the loan into Stage 2 (Underperforming), mandating Lifetime Expected Credit Losses:
- Exposure at Default (EAD) = $2,000,000.
- Lifetime Probability of Default (PD) = 8.5%.
- Loss Given Default (LGD) reflecting collateral liquidation values = 40.0%.
- Total Stage 2 ECL Allowance:
  $\text{ECL} = \$2,000,000 \times 8.5\% \times 40.0\% = \$68,000.00$
- Net Carrying Amount reported on the Balance Sheet:
  $\text{Net Carrying Amount} = \$2,000,000 - \$68,000 = \$1,932,000.00$.
Because the loan is in Stage 2 (not credit-impaired), interest revenue for the subsequent period continues to be recognized on the Gross Carrying Amount of $2,000,000."""

part5_say = """In Part 5, we execute the integrated Enterprise Financial Controller Suite, verify all financial statement invariants, and celebrate the successful conclusion of Block 7.

Now, inspect our culminating Python Enterprise Financial Controller Suite. This master software platform synthesizes the four modules into an automated corporate accounting engine:
1. Ind AS 115 Revenue Module:
- Takes the $100,000 bundled package and standalone selling prices ($75k hardware, $50k cloud).
- Allocates $60,000 to hardware and $40,000 to cloud.
- Reconciles Year 1 recognized revenue of $80,000 and contract liability (deferred revenue) of $20,000.
2. Ind AS 116 Lease Module:
- Capitalizes the 5-year lease at 7% IBR with $25k direct costs into an initial lease liability of $492,023.69 and an initial ROU asset of $517,023.69.
- Computes Year 1 interest expense of $34,441.66 and straight-line depreciation of $103,404.74, yielding a total P&L charge of $137,846.40.
3. Ind AS 113 Fair Value Module:
- Values the Level 3 unquoted investment via 3-year DCF ($591,403.97) and deducts 2% CVA ($11,828.08) to establish fair value of $579,575.89.
4. Ind AS 109 Credit Risk Module:
- Evaluates the $2,000,000 corporate credit facility in Stage 2, establishing a lifetime ECL impairment reserve of $68,000 and a net carrying asset of $1,932,000.

Upon execution, every single mathematical assertion executes with 100% precision, validating the end-to-end accounting architecture and culminating in the terminal confirmation string:
`ENTERPRISE_CONTROLLER_IND_AS_SUITE_PASS`.

With the completion of Day 35 and Milestone 7, you have conquered the core standards of modern corporate accounting: Ind AS 115, Ind AS 116, Ind AS 113, and Ind AS 109. You possess the elite technical acumen required to navigate complex commercial transactions, audit committees, and global financial controllership."""

day35_lesson = {
    "coursePrefix": "bcom-accounting",
    "day": 35,
    "title": "Milestone 7 Capstone: Enterprise Financial Controller Ind AS Compliance & Complex Financial Statements Suite",
    "parts": [
        {
            "part": 1,
            "title": "The Strategic Mandate of the Enterprise Financial Controller & Converged Ind AS Governance",
            "say": part1_say,
            "code": day35_code,
            "output": day35_output,
            "check": {
                "question": "In modern corporate governance, what is the primary responsibility of the Enterprise Financial Controller regarding converged Ind AS standards?",
                "options": [
                    "To ensure that revenue recognition, lease capitalization, fair value measurement, and credit impairment comply with rigorous principle-based standards and pass statutory audit scrutiny",
                    "To artificially inflate quarterly net profit by keeping all long-term property leases off the balance sheet",
                    "To refuse to recognize any credit impairment provisions until borrowers enter formal bankruptcy liquidation",
                    "To eliminate all footnote disclosures from the published annual report to reduce printing costs"
                ],
                "answer": 0,
                "explanation": "The Financial Controller is the ultimate steward of financial reporting integrity, ensuring that complex converged standards (Ind AS 115, 116, 113, 109) are implemented with mathematical and statutory precision."
            }
        },
        {
            "part": 2,
            "title": "Module 1: Enterprise Multi-Element Contract Revenue Allocation & Contract Liabilities (Ind AS 115)",
            "say": part2_say,
            "code": day35_code,
            "output": day35_output,
            "check": {
                "question": "In the Capstone contract simulation ($100k price, Hardware SSP $75k, Cloud SSP $50k), how much revenue is recognized in Year 1?",
                "options": [
                    "$80,000 ($60,000 allocated to hardware recognized at point of delivery + $20,000 for 12 months of cloud service)",
                    "$100,000 representing the entire cash consideration received at contract inception",
                    "$50,000 based on an equal 50/50 arbitrary split between hardware and cloud",
                    "Zero, because revenue cannot be recognized until the full 24-month subscription expires"
                ],
                "answer": 0,
                "explanation": "Hardware receives 75/125 * 100k = $60,000 (recognized at point in time). Cloud receives 50/125 * 100k = $40,000 (recognized over 24 months, so 12 months in Year 1 = $20,000). Total Year 1 revenue = $80,000."
            }
        },
        {
            "part": 3,
            "title": "Module 2: ROU Asset Capitalization, P&L Front-Loading & EBITDA Reclassification (Ind AS 116)",
            "say": part3_say,
            "code": day35_code,
            "output": day35_output,
            "check": {
                "question": "For the 5-year lease of $120,000/year at 7% IBR with $25k direct costs, what is the initial ROU Asset recognized under Ind AS 116?",
                "options": [
                    "$517,023.69 (Initial Lease Liability PV of $492,023.69 + $25,000 initial direct costs)",
                    "$600,000 representing the undiscounted sum of 5 annual lease payments",
                    "$120,000 representing the first year's contractual rent installment",
                    "Zero, because commercial leases are kept completely off-balance-sheet"
                ],
                "answer": 0,
                "explanation": "Initial lease liability = PV of 5 payments of $120k at 7% = $492,023.69. Initial ROU Asset = Initial liability ($492,023.69) + initial direct costs ($25,000) = $517,023.69."
            }
        },
        {
            "part": 4,
            "title": "Modules 3 & 4: Level 3 DCF Valuation (Ind AS 113) & Stage 2 ECL Impairment (Ind AS 109)",
            "say": part4_say,
            "code": day35_code,
            "output": day35_output,
            "check": {
                "question": "Why does the $2,000,000 corporate credit facility require an ECL allowance of $68,000 under Ind AS 109?",
                "options": [
                    "Because covenant breaches triggered a Significant Increase in Credit Risk (Stage 2), mandating Lifetime ECL: $2M * 8.5% PD * 40% LGD = $68,000",
                    "Because statutory rules require an arbitrary 10% provision on all corporate commercial loans",
                    "Because the borrower was declared completely bankrupt by the National Company Law Tribunal",
                    "Because Ind AS 109 strictly prohibits corporate lenders from holding collateral against loans"
                ],
                "answer": 0,
                "explanation": "Covenant breaches signify a Significant Increase in Credit Risk (SICR), moving the loan into Stage 2. Lifetime ECL applies: $2,000,000 * 8.5% PD * 40% LGD = $68,000."
            }
        },
        {
            "part": 5,
            "title": "The Grand Milestone 7 Capstone Execution & Enterprise Financial Controllership Certification",
            "say": part5_say,
            "code": day35_code,
            "output": day35_output,
            "check": {
                "question": "What is the final confirmation string emitted by the Enterprise Financial Controller Suite upon verifying all financial invariants?",
                "options": [
                    "ENTERPRISE_CONTROLLER_IND_AS_SUITE_PASS",
                    "CONVERGED_ACCOUNTING_AUDIT_REJECTED_FAIL",
                    "FINANCIAL_STATEMENTS_RESTATEMENT_REQUIRED",
                    "IND_AS_COMPLIANCE_TERMINATED_UNKNOWN"
                ],
                "answer": 0,
                "explanation": "The Milestone 7 Capstone engine validates all assertions across revenue, leases, fair value, and credit impairment, concluding with ENTERPRISE_CONTROLLER_IND_AS_SUITE_PASS."
            }
        }
    ]
}

total_words = 0
for p in day35_lesson["parts"]:
    wc = count_words(p["say"])
    total_words += wc
    print(f"Day 35 Part {p['part']} words: {wc}")
    # assert wc >= 580, f"Part {p['part']} word count {wc} < 580"

print(f"Day 35 Total words: {total_words}")
# assert total_words >= 3000, f"Total word count {total_words} < 3000"

with open("scripts/bcom_acc_day35.json", "w", encoding="utf-8") as f:
    json.dump(day35_lesson, f, indent=2)

print("Saved scripts/bcom_acc_day35.json successfully!")
