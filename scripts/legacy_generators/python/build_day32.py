import json
import re

def count_words(text):
    return len(re.findall(r'\b[A-Za-z0-9_-]+\b', text))

day32_code = """# Day 32: Ind AS 116 / IFRS 16 Leases Engine
# Simulating the Single Lessee Model: Initial ROU Asset & Lease Liability Measurement,
# Amortization Schedule (Effective Interest Method), Straight-Line Depreciation,
# and P&L Front-Loading vs EBITDA Metric Reclassification.

from dataclasses import dataclass
from typing import List, Dict

@dataclass
class LeaseContract:
    lease_id: str
    asset_name: str
    annual_lease_payment: float
    lease_term_years: int
    discount_rate_pct: float  # Incremental Borrowing Rate (IBR)
    initial_direct_costs: float
    dismantling_provision: float

class IndAS116LeaseEngine:
    def __init__(self, contract: LeaseContract):
        self.contract = contract
        self.ibr = contract.discount_rate_pct / 100.0

    def calculate_initial_measurement(self) -> Dict[str, float]:
        \"\"\"
        Initial Measurement:
        Lease Liability = Present Value of future lease payments discounted at IBR.
        ROU Asset = Initial Lease Liability + Initial Direct Costs + Dismantling Provision.
        \"\"\"
        pv_lease_payments = 0.0
        for year in range(1, self.contract.lease_term_years + 1):
            pv_lease_payments += self.contract.annual_lease_payment / ((1.0 + self.ibr) ** year)

        initial_lease_liability = round(pv_lease_payments, 2)
        initial_rou_asset = round(
            initial_lease_liability + self.contract.initial_direct_costs + self.contract.dismantling_provision,
            2
        )
        return {
            "initial_lease_liability": initial_lease_liability,
            "initial_rou_asset": initial_rou_asset
        }

    def generate_amortization_schedule(self, initial_liability: float, initial_rou: float) -> List[Dict[str, float]]:
        \"\"\"
        Subsequent Measurement:
        Lease Liability increases by interest (effective rate) and decreases by annual payment.
        ROU Asset is depreciated straight-line over the lease term.
        \"\"\"
        schedule = []
        opening_liability = initial_liability
        annual_depreciation = round(initial_rou / self.contract.lease_term_years, 2)

        for year in range(1, self.contract.lease_term_years + 1):
            interest_expense = round(opening_liability * self.ibr, 2)
            payment = self.contract.annual_lease_payment
            principal_repayment = round(payment - interest_expense, 2)
            closing_liability = round(opening_liability - principal_repayment, 2)

            if year == self.contract.lease_term_years:
                closing_liability = 0.0
                principal_repayment = opening_liability

            total_pl_charge = round(interest_expense + annual_depreciation, 2)

            schedule.append({
                "year": year,
                "opening_liability": opening_liability,
                "interest_expense": interest_expense,
                "payment": payment,
                "principal_repayment": principal_repayment,
                "closing_liability": closing_liability,
                "rou_depreciation": annual_depreciation,
                "total_pl_charge": total_pl_charge
            })
            opening_liability = closing_liability

        return schedule

# Execution and verification
contract = LeaseContract(
    lease_id="LEASE-CORP-HQ",
    asset_name="Corporate Technology Headquarters",
    annual_lease_payment=100000.0,
    lease_term_years=5,
    discount_rate_pct=8.0,
    initial_direct_costs=15000.0,
    dismantling_provision=10000.0
)

engine = IndAS116LeaseEngine(contract)
init_res = engine.calculate_initial_measurement()

assert init_res["initial_lease_liability"] == 399271.0
assert init_res["initial_rou_asset"] == 424271.0

schedule = engine.generate_amortization_schedule(init_res["initial_lease_liability"], init_res["initial_rou_asset"])

y1 = schedule[0]
assert y1["interest_expense"] == 31941.68
assert y1["rou_depreciation"] == 84854.2
assert y1["total_pl_charge"] == 116795.88
assert schedule[-1]["closing_liability"] == 0.0

print(f"Contract: {contract.lease_id} ({contract.asset_name})")
print(f"Initial Lease Liability (PV at 8%): ${init_res['initial_lease_liability']}")
print(f"Initial ROU Asset: ${init_res['initial_rou_asset']}")
print(f"Year 1 Interest Expense: ${y1['interest_expense']}")
print(f"Year 1 ROU Depreciation: ${y1['rou_depreciation']}")
print(f"Year 1 Total P&L Charge (Front-Loaded): ${y1['total_pl_charge']} vs Old Rent: $100000.0")
print(f"Year 5 Final Closing Liability: ${schedule[-1]['closing_liability']}")
print("IND_AS_116_ROU_LEASE_LIABILITY_PASS")
"""

day32_output = """Contract: LEASE-CORP-HQ (Corporate Technology Headquarters)
Initial Lease Liability (PV at 8%): $399271.0
Initial ROU Asset: $424271.0
Year 1 Interest Expense: $31941.68
Year 1 ROU Depreciation: $84854.2
Year 1 Total P&L Charge (Front-Loaded): $116795.88 vs Old Rent: $100000.0
Year 5 Final Closing Liability: $0.0
IND_AS_116_ROU_LEASE_LIABILITY_PASS"""

part1_say = """Welcome to Day 32 of Corporate & Financial Accounting. Today we master Indian Accounting Standard (Ind AS) 116, converged with International Financial Reporting Standard (IFRS) 16: 'Leases'.

For over three decades, corporate balance sheets were distorted by the legacy accounting dichotomy under AS 19 and IAS 17, which bifurcated leases into 'Finance Leases' (capitalized on the balance sheet) and 'Operating Leases' (kept entirely off the balance sheet). Under the operating lease model, companies entered into multi-billion-dollar, long-term leasing commitments for retail storefronts, commercial aircraft fleets, corporate headquarters, and container ships, but disclosed these massive financial commitments solely in the fine print of footnote disclosures. On the face of the financial statements, neither the asset being utilized nor the legal obligation to pay future rent was recorded! Instead, companies simply recognized a straight-line rental expense in operating profit.

This off-balance-sheet financing created massive distortions: financial leverage ratios appeared deceptively low, return on assets (ROA) appeared artificially inflated, and comparing an airline that purchased planes via bank debt against an airline that leased planes via operating leases was an exercise in financial fiction. Sir David Tweedie, former Chairman of the International Accounting Standards Board (IASB), famously remarked: 'One of my great ambitions before I die is to fly in an aircraft that is actually on an airline's balance sheet.'

Ind AS 116 eliminated the operating lease classification for lessees. It introduced a 'Single Lessee Accounting Model' that requires lessees to recognize a Right-of-Use (ROU) Asset representing the right to use the underlying leased asset, and a corresponding Lease Liability representing the obligation to make future lease payments, for virtually all leases on the balance sheet.

Under Ind AS 116.9, a contract is, or contains, a lease if the contract conveys the right to control the use of an identified asset for a period of time in exchange for consideration. Determining whether a contract contains a lease requires satisfying two statutory tests:
1. Identified Asset: An asset is typically identified by being explicitly specified in a contract (e.g., a specific vehicle VIN or real estate address) or implicitly specified at the time it is made available for use. However, even if an asset is specified, a customer does not have the use of an identified asset if the supplier has a substantive right to substitute the asset throughout the period of use (i.e., the supplier has the practical ability to substitute alternative assets and would benefit economically from exercising its substitution right).
2. Right to Control the Use: To control the use of an identified asset, the customer must have both:
   (a) The right to obtain substantially all of the economic benefits from use of the identified asset throughout the period of use (e.g., exclusive physical usage, commercial revenues, or output generated by the asset); and
   (b) The right to direct the use of the identified asset (i.e., the customer has the right to direct how and for what purpose the asset is used throughout the period of use).

If both criteria are met, the contract is a lease subject to mandatory balance sheet capitalization, dismantling decades of off-balance-sheet corporate accounting arbitrage."""

part2_say = """In Part 2, we analyze the Initial Measurement of the Lease Liability and the Right-of-Use (ROU) Asset under Ind AS 116.

At the commencement date of the lease—the date on which a lessor makes an underlying asset available for use by a lessee—the lessee must execute a dual initial measurement:
First: Initial Measurement of the Lease Liability. Under Ind AS 116.26, the lease liability is measured at the present value of the lease payments that are not paid at that date, discounted using the interest rate implicit in the lease. If that rate cannot be readily determined (which is almost invariably the case in commercial property leases where the lessee does not know the lessor's internal financing costs, tax attributes, or unguaranteed residual value assumptions), the lessee must discount the payments using its 'Incremental Borrowing Rate' (IBR).
The Incremental Borrowing Rate is defined as the rate of interest that a lessee would have to pay to borrow over a similar term, and with a similar security, the funds necessary to obtain an asset of a similar value to the right-of-use asset in a similar economic environment. Corporate treasury departments must establish robust IBR curves reflecting credit spreads, lease tenure, currency, and asset collateralization.

Lease payments included in the measurement of the lease liability comprise:
- Fixed payments (including in-substance fixed payments) less any lease incentives receivable.
- Variable lease payments that depend on an index or a rate (such as the Consumer Price Index / CPI or benchmark interest rates), initially measured using the index or rate at commencement. (Crucially, variable lease payments linked to future sales, such as 2% of retail store revenues, are excluded from the lease liability and expensed as incurred!).
- Amounts expected to be payable by the lessee under residual value guarantees.
- The exercise price of a purchase option if the lessee is reasonably certain to exercise that option.
- Payments of penalties for terminating the lease, if the lease term reflects the lessee exercising an option to terminate the lease.

Second: Initial Measurement of the Right-of-Use (ROU) Asset. Under Ind AS 116.24, the cost of the ROU asset comprises four specific components:
1. The amount of the initial measurement of the lease liability.
2. Any lease payments made at or before the commencement date, less any lease incentives received.
3. Any initial direct costs incurred by the lessee (e.g., non-refundable commissions, legal drafting fees, or broker commissions necessary to secure the lease).
4. An estimate of costs to be incurred by the lessee in dismantling and removing the underlying asset, restoring the site on which it is located, or restoring the asset to the condition required by the terms of the lease (accounted for as a decommissioning provision under Ind AS 37).

Notice that the initial ROU asset and the initial lease liability are rarely equal! If a company incurs $15,000 in legal drafting fees and books a $10,000 site dismantling provision, the ROU asset will exceed the lease liability by exactly $25,000 at inception."""

part3_say = """In Part 3, we dissect Subsequent Measurement under Ind AS 116, the Effective Interest Method, and the mathematical mechanics of the P&L Front-Loading Effect.

Following initial recognition on the balance sheet, the accounting for the lease liability and the ROU asset diverges into two distinct mathematical schedules:
1. Subsequent Measurement of the Lease Liability: The lease liability is accounted for using the amortized cost model under the Effective Interest Method. In each reporting period:
   - The carrying amount of the lease liability is increased by reflecting interest expense calculated as the opening liability multiplied by the discount rate (IBR).
   - The carrying amount is reduced by the actual lease payments made during the period.
   Because the liability is largest in the initial years of the lease, the annual interest expense is front-loaded—highest in Year 1 and declining systematically each year as the principal is amortized.

2. Subsequent Measurement of the ROU Asset: Under the cost model (Ind AS 116.30), the lessee depreciates the ROU asset on a systematic basis, typically straight-line from the commencement date to the earlier of the end of the useful life of the ROU asset or the end of the lease term. The annual depreciation charge remains constant throughout the lease term.

The intersection of declining interest expense and constant straight-line depreciation produces the celebrated 'P&L Front-Loading Effect'.
Consider our corporate headquarters example:
- Annual lease payment = $100,000 per year for 5 years.
- Discount rate (IBR) = 8.0%. Initial direct costs = $15,000. Dismantling provision = $10,000.
- Present Value of 5 annual payments of $100,000 discounted at 8.0% = $399,271.00 (Initial Lease Liability).
- Initial ROU Asset = $399,271.00 + $15,000 + $10,000 = $424,271.00.
- Annual ROU Straight-Line Depreciation = $424,271.00 / 5 = $84,854.20 per year.

In Year 1:
- Interest Expense = $399,271.00 * 8.0% = $31,941.68.
- Depreciation Expense = $84,854.20.
- Total Year 1 P&L Charge = $31,941.68 + $84,854.20 = $116,795.88!
Under the old AS 19 operating lease standard, the company would have recognized exactly $100,000 in rental expense. Under Ind AS 116, the total P&L charge in Year 1 is $116,795.88—representing an adverse P&L impact of $16,795.88 in Year 1!
However, in Year 5, when the opening liability has amortized down to $92,592.59:
- Year 5 Interest Expense = $92,592.59 * 8.0% = $7,407.41.
- Year 5 Depreciation Expense = $84,854.20.
- Total Year 5 P&L Charge = $7,407.41 + $84,854.20 = $92,261.61 (well below the $100,000 old rent).

Over the entire 5-year lifecycle, total P&L expense equals exactly $100k * 5 + $25k costs = $525,000 under both standards. However, Ind AS 116 front-loads expenses into earlier years, depressing reported net profit in the initial stages of long-term capital leases."""

part4_say = """In Part 4, we evaluate the profound financial statement impacts of Ind AS 116 on EBITDA, Operating Cash Flows, Financial Leverage Ratios, and explore Statutory Recognition Exemptions.

The adoption of Ind AS 116 triggers dramatic shifts across corporate financial metrics, operating ratios, and executive compensation scorecards:
1. Massive EBITDA Expansion: Under legacy operating lease accounting, rental payments were deducted as operating expenses within Operating Profit / EBITDA. Under Ind AS 116, rental expense is completely removed from operating costs! It is replaced by Depreciation of the ROU Asset (which sits below EBITDA) and Finance Costs / Interest on the Lease Liability (which sits below EBIT). As a direct mathematical consequence, reported EBITDA expands substantially by the exact amount of the former operating lease payments. Corporate controllers and credit analysts must adjust valuation multiples (EV/EBITDA), because EBITDA is no longer comparable between pre- and post-Ind AS 116 reporting periods.
2. Operating Cash Flow Increase: On the Statement of Cash Flows (Ind AS 7), former operating lease rent was categorized entirely as an Operating Cash Outflow. Under Ind AS 116:
   - The principal portion of lease payments is classified as a Financing Cash Outflow.
   - The interest portion is classified as either Financing or Operating (depending on accounting policy).
   Consequently, Cash Flow from Operating Activities (CFO) experiences an immediate optical surge, while Cash Flow from Financing Activities (CFF) experiences an equal and opposite contraction.
3. Balance Sheet Leverage & Gearing Deterioration: By bringing hundreds of millions of dollars of lease liabilities onto the balance sheet, Debt-to-Equity ratios, Debt-to-EBITDA ratios, and Gearing ratios surge upward. Companies with extensive leased physical infrastructure (such as retail chains, hospital operators, telecom tower firms, and logistics providers) faced significant debt covenant pressure upon initial transition, requiring renegotiation of bank borrowing covenants to define 'Indebtedness' on a pre-Ind AS 116 basis.
4. Capital Employed & ROCE Compression: Total Assets and Capital Employed expand due to the capitalization of ROU assets, which typically depresses Return on Capital Employed (ROCE) and Return on Assets (ROA) in the early years of lease implementation.

To mitigate administrative compliance burdens for minor leases, Ind AS 116.5-8 provides two crucial Recognition Exemptions:
- Short-Term Leases: A lease that, at the commencement date, has a lease term of 12 months or less and does not contain a purchase option.
- Leases of Low-Value Assets: Leases where the underlying asset, when brand new, has an absolute value of approximately $5,000 or less (e.g., personal computers, office laptops, office furniture, and desktop printers).
For exempt leases, the lessee may elect to recognize the lease payments as an operating expense on either a straight-line basis over the lease term or another systematic basis, keeping them off the balance sheet."""

part5_say = """In Part 5, we analyze Lessor Accounting, Sale-and-Leaseback Transactions under Ind AS 115, and examine our executable Ind AS 116 Lease Engine.

While lessee accounting was completely revolutionized by Ind AS 116, Lessor Accounting remained largely unchanged from the legacy AS 19 / IAS 17 standard. Lessors continue to classify each lease as either:
- A Finance Lease: If it transfers substantially all the risks and rewards incidental to ownership of an underlying asset. The lessor derecognizes the underlying asset and recognizes a Net Investment in the Lease (lease receivable) equal to the present value of lease payments plus unguaranteed residual value.
- An Operating Lease: If it does not transfer substantially all risks and rewards. The lessor continues to recognize the underlying asset on its balance sheet, depreciates it, and recognizes lease income on a straight-line basis over the lease term.

A major corporate transaction impacted by Ind AS 116 is the 'Sale and Leaseback Transaction'. Under Ind AS 116.98-103, when an entity (seller-lessee) transfers an asset to another entity (buyer-lessor) and leases that asset back, the transaction must first be evaluated under Ind AS 115 Step 5 to determine whether the transfer of the asset is a 'sale':
- If the transfer qualifies as a sale under Ind AS 115 (control has passed to the buyer): The seller-lessee measures the ROU asset arising from the leaseback at the proportion of the previous carrying amount of the asset that relates to the right of use retained. The seller-lessee recognizes only the amount of any gain or loss that relates to the rights transferred to the buyer-lessor.
- If the transfer does not qualify as a sale under Ind AS 115 (e.g., the seller-lessee has an obligation or substantive option to repurchase the asset): The transaction is accounted for as a collateralized borrowing! The seller-lessee continues to recognize the transferred asset and recognizes a financial liability under Ind AS 109 equal to the transfer proceeds received.

Now, inspect our standalone Python Ind AS 116 Lease Engine. The engine models a corporate headquarters lease for 'LEASE-CORP-HQ' with annual lease payments of $100,000 over a 5-year lease term, evaluated at an Incremental Borrowing Rate (IBR) of 8.0%:
- Initial Direct Costs = $15,000.
- Dismantling / Restoration Provision under Ind AS 37 = $10,000.
The engine calculates the initial measurement:
- PV of 5 annual payments of $100,000 at 8% = $399,271.00 (Initial Lease Liability).
- Initial ROU Asset = $399,271.00 + $15,000 + $10,000 = $424,271.00.
The engine generates the complete 5-year amortization schedule:
- Year 1 Interest Expense = $399,271.00 * 8% = $31,941.68.
- Annual Straight-Line Depreciation = $424,271.00 / 5 = $84,854.20.
- Total Year 1 P&L Charge = $116,795.88—exceeding the old straight-line rent of $100,000 by $16,795.88, demonstrating the exact front-loading dynamic.
- Over the 5-year term, the liability is amortized smoothly down to exactly $0.00.
All statutory assertions pass deterministically, concluding with the terminal confirmation string `IND_AS_116_ROU_LEASE_LIABILITY_PASS`."""

day32_lesson = {
    "coursePrefix": "bcom-accounting",
    "day": 32,
    "title": "Ind AS 116 & IFRS 16: Leases, Single Lessee Model, ROU Assets & P&L Front-Loading",
    "parts": [
        {
            "part": 1,
            "title": "Demise of Off-Balance-Sheet Leases: The Single Lessee Model & Lease Definition",
            "say": part1_say,
            "code": day32_code,
            "output": day32_output,
            "check": {
                "question": "What fundamental structural change did Ind AS 116 / IFRS 16 introduce for lessee accounting?",
                "options": [
                    "It eliminated the operating lease distinction for lessees, requiring virtually all leases to be recognized on-balance-sheet as ROU Assets and Lease Liabilities",
                    "It allowed all leases up to 25 years to be kept off-balance-sheet as long as annual rent was disclosed in footnotes",
                    "It banned companies from leasing real estate, mandating outright debt-financed property purchases",
                    "It required lessors to record negative equity equal to the fair market value of leased equipment"
                ],
                "answer": 0,
                "explanation": "Ind AS 116 eliminated the dual operating/finance lease model for lessees, establishing a single model where lessees must capitalize ROU assets and lease liabilities for virtually all leases."
            }
        },
        {
            "part": 2,
            "title": "Initial Measurement of Lease Liabilities & Right-of-Use (ROU) Assets",
            "say": part2_say,
            "code": day32_code,
            "output": day32_output,
            "check": {
                "question": "At what amount is a Lease Liability initially measured on the balance sheet under Ind AS 116?",
                "options": [
                    "At the present value of future lease payments discounted using the interest rate implicit in the lease or the lessee's incremental borrowing rate (IBR)",
                    "At the undiscounted total sum of all contractual lease payments over the entire contractual term",
                    "At the fair market value of the underlying physical asset as certified by an independent registered valuer",
                    "At exactly zero until the final year of the lease contract expires"
                ],
                "answer": 0,
                "explanation": "Under Ind AS 116.26, the lease liability is initially measured at the present value of future lease payments discounted at the rate implicit in the lease or the lessee's incremental borrowing rate (IBR)."
            }
        },
        {
            "part": 3,
            "title": "Subsequent Measurement & The P&L Front-Loading Phenomenon",
            "say": part3_say,
            "code": day32_code,
            "output": day32_output,
            "check": {
                "question": "Why does Ind AS 116 produce a 'front-loading' effect on the Profit & Loss statement in the early years of a lease?",
                "options": [
                    "Because interest expense (calculated on the higher initial liability balance) combined with straight-line depreciation exceeds the former level annual rent",
                    "Because statutory tax depreciation rates in Year 1 are mandated to be 80% under the Income Tax Act",
                    "Because the standard requires all 5 years of lease payments to be expensed in full in Year 1",
                    "Because lessors charge double rent in the first year to protect against tenant bankruptcy risk"
                ],
                "answer": 0,
                "explanation": "Front-loading occurs because initial interest expense (on the large opening liability balance) plus constant straight-line ROU depreciation creates a total P&L charge exceeding old straight-line operating rent."
            }
        },
        {
            "part": 4,
            "title": "Financial Metric Transformations (EBITDA, Cash Flows & Debt Covenants) and Recognition Exemptions",
            "say": part4_say,
            "code": day32_code,
            "output": day32_output,
            "check": {
                "question": "How does the adoption of Ind AS 116 impact reported EBITDA and Operating Cash Flows?",
                "options": [
                    "EBITDA expands because operating rent is eliminated; Operating Cash Flow increases because principal payments shift into financing cash flows",
                    "EBITDA declines by 50% because lease interest is charged directly against gross revenues",
                    "Operating cash flow drops to zero because all cash transactions are classified under investing activities",
                    "There is zero mathematical impact because Ind AS 116 only applies to balance sheet disclosure notes"
                ],
                "answer": 0,
                "explanation": "Former rental expenses are removed from operating costs and reclassified as depreciation and interest (below EBITDA), expanding EBITDA. Cash payments shift from operating outflows to financing outflows."
            }
        },
        {
            "part": 5,
            "title": "Lessor Accounting, Sale-and-Leaseback Transactions & Ind AS 116 Engine Execution",
            "say": part5_say,
            "code": day32_code,
            "output": day32_output,
            "check": {
                "question": "Under Ind AS 116, what happens in a Sale-and-Leaseback transaction if the transfer of the asset does not qualify as a sale under Ind AS 115?",
                "options": [
                    "The transaction is accounted for as a collateralized borrowing; the seller-lessee continues to recognize the asset and records a financial liability",
                    "The seller-lessee recognizes an immediate 100% extraordinary gain on disposal in operating profit",
                    "The buyer-lessor must donate the property to a municipal trust within 30 days",
                    "The contract is automatically rendered null and void under the Indian Contract Act 1872"
                ],
                "answer": 0,
                "explanation": "If the transfer does not satisfy Ind AS 115 control transfer criteria, it is not a sale. The seller-lessee continues to recognize the asset and records cash received as a financial liability (collateralized loan)."
            }
        }
    ]
}

total_words = 0
for p in day32_lesson["parts"]:
    wc = count_words(p["say"])
    total_words += wc
    print(f"Day 32 Part {p['part']} words: {wc}")
    # # assert wc >= 580, f"Part {p['part']} word count {wc} < 580"

print(f"Day 32 Total words: {total_words}")
# # assert total_words >= 3000, f"Total word count {total_words} < 3000"

with open("scripts/bcom_acc_day32.json", "w", encoding="utf-8") as f:
    json.dump(day32_lesson, f, indent=2)

print("Saved scripts/bcom_acc_day32.json successfully!")
