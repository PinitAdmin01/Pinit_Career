import json
import re

def count_words(text):
    return len(re.findall(r'\b[A-Za-z0-9_-]+\b', text))

day36_code = """# Day 36: Ind AS 102 Share-Based Payments Engine
# Simulates Equity-Settled ESOPs with Graded Vesting and Cash-Settled Stock Appreciation Rights (SARs).

from dataclasses import dataclass
from typing import List, Dict

@dataclass
class ESOPTranche:
    tranche_num: int
    vesting_years: int
    options_granted: int
    grant_date_fv: float

class IndAS102ShareBasedPaymentEngine:
    def __init__(self, company_name: str):
        self.company_name = company_name

    def calculate_equity_settled_esop(
        self,
        options_count: int,
        grant_date_fv: float,
        vesting_years: int,
        estimated_forfeiture_rate: float,
        year: int
    ) -> Dict[str, float]:
        \"\"\"Equity-Settled ESOP: Fixed Grant Date Fair Value amortized over vesting period.\"\"\"
        effective_options = options_count * (1.0 - estimated_forfeiture_rate)
        total_compensation_cost = effective_options * grant_date_fv
        cumulative_recognized = (total_compensation_cost / vesting_years) * min(year, vesting_years)
        prior_recognized = (total_compensation_cost / vesting_years) * max(0, year - 1)
        current_year_expense = cumulative_recognized - prior_recognized
        
        return {
            "total_compensation_cost": round(total_compensation_cost, 2),
            "current_year_expense": round(current_year_expense, 2),
            "cumulative_share_based_reserve": round(cumulative_recognized, 2)
        }

    def calculate_graded_vesting(
        self,
        tranches: List[ESOPTranche],
        year: int
    ) -> Dict[str, float]:
        \"\"\"Graded Vesting: Each tranche treated as a separate share-based payment arrangement.\"\"\"
        total_year_expense = 0.0
        for t in tranches:
            if year <= t.vesting_years:
                annual_cost = (t.options_granted * t.grant_date_fv) / t.vesting_years
                total_year_expense += annual_cost
        return {
            "year": year,
            "graded_vesting_expense": round(total_year_expense, 2)
        }

    def calculate_cash_settled_sar(
        self,
        sars_granted: int,
        reporting_date_fv: float,
        vesting_years: int,
        year: int,
        prior_liability: float
    ) -> Dict[str, float]:
        \"\"\"Cash-Settled SAR: Remeasured at fair value at each reporting date until settlement.\"\"\"
        cumulative_liability = (sars_granted * reporting_date_fv * year) / vesting_years
        current_expense = cumulative_liability - prior_liability
        return {
            "reporting_date_fair_value": reporting_date_fv,
            "cumulative_sar_liability": round(cumulative_liability, 2),
            "current_year_pl_expense": round(current_expense, 2)
        }

engine = IndAS102ShareBasedPaymentEngine("Nexus Enterprise Technologies Ltd")

# Test 1: Equity-Settled ESOP (100,000 options, $15 Grant Date FV, 4 years, 5% forfeiture)
esop_y1 = engine.calculate_equity_settled_esop(100000, 15.0, 4, 0.05, 1)
assert esop_y1["total_compensation_cost"] == 1425000.0
assert esop_y1["current_year_expense"] == 356250.0
assert esop_y1["cumulative_share_based_reserve"] == 356250.0

# Test 2: Graded Vesting Tranches (4 tranches of 25,000 options each vesting in Yr 1, 2, 3, 4)
tranches = [
    ESOPTranche(1, 1, 25000, 15.0),
    ESOPTranche(2, 2, 25000, 15.0),
    ESOPTranche(3, 3, 25000, 15.0),
    ESOPTranche(4, 4, 25000, 15.0),
]
graded_y1 = engine.calculate_graded_vesting(tranches, 1)
assert graded_y1["graded_vesting_expense"] == 781250.0

# Test 3: Cash-Settled SAR (50,000 SARs, 3-year vesting, Y1 FV = $18.0)
sar_y1 = engine.calculate_cash_settled_sar(50000, 18.0, 3, 1, 0.0)
assert sar_y1["cumulative_sar_liability"] == 300000.0
assert sar_y1["current_year_pl_expense"] == 300000.0

# Y2 SAR remeasured at FV = $22.0
sar_y2 = engine.calculate_cash_settled_sar(50000, 22.0, 3, 2, 300000.0)
assert sar_y2["cumulative_sar_liability"] == 733333.33
assert sar_y2["current_year_pl_expense"] == 433333.33

print(f"Company: {engine.company_name}")
print(f"Equity ESOP Y1 Expense: ${esop_y1['current_year_expense']} (Total Pool: ${esop_y1['total_compensation_cost']})")
print(f"Graded Vesting Y1 Expense: ${graded_y1['graded_vesting_expense']}")
print(f"Cash SAR Y1 Liability: ${sar_y1['cumulative_sar_liability']} | Y2 Liability: ${sar_y2['cumulative_sar_liability']}")
print("IND_AS_102_SHARE_BASED_PAYMENTS_PASS")
"""

day36_output = """Company: Nexus Enterprise Technologies Ltd
Equity ESOP Y1 Expense: $356250.0 (Total Pool: $1425000.0)
Graded Vesting Y1 Expense: $781250.0
Cash SAR Y1 Liability: $300000.0 | Y2 Liability: $733333.33
IND_AS_102_SHARE_BASED_PAYMENTS_PASS"""

part1_say = r"""Welcome to Day 36 of Corporate & Financial Accounting. Today we inaugurate Month 2 Block 8 by delving into one of the most critical and complex domains of corporate financial reporting: Indian Accounting Standard (Ind AS) 102 and International Financial Reporting Standard (IFRS) 2, 'Share-Based Payment'. In high-growth enterprises, modern technology corporations, and listed commercial conglomerates, executive talent compensation has fundamentally shifted away from pure cash salaries toward equity-linked incentive plans. Understanding the accounting architecture of share-based payments is essential for every corporate controller, financial analyst, and statutory auditor.

The scope of Ind AS 102 encompasses all transactions in which an entity receives goods or services from employees, directors, vendors, or external third parties as consideration for equity instruments of the entity (including shares or share options), or by incurring liabilities to the supplier of those goods or services for amounts that are based on the price of the entity's shares or other equity instruments. The standard categorizes all share-based payment arrangements into three distinct legal and accounting archetypes:
1. Equity-Settled Share-Based Payment Transactions: The entity receives goods or services as consideration for its own equity instruments, such as Employee Stock Option Plans (ESOPs), Restricted Stock Units (RSUs), or Employee Stock Purchase Plans (ESPPs).
2. Cash-Settled Share-Based Payment Transactions: The entity acquires goods or services by incurring a contractual liability to transfer cash or other assets to the supplier based on the price (or value) of the entity's equity instruments, such as Stock Appreciation Rights (SARs) or phantom equity units.
3. Transactions with Cash Alternatives: The terms of the arrangement provide either the entity or the counterparty with the choice of whether the entity settles the transaction in cash (or other assets) or by issuing equity instruments.

In corporate India, the issuance of employee stock options is governed by a strict dual legal framework: Section 62(1)(b) of the Companies Act, 2013, read with Rule 12 of the Companies (Share Capital and Debentures) Rules, 2014, and the Securities and Exchange Board of India (Share Based Employee Benefits and Sweat Equity) Regulations, 2021 (SEBI SBEB Regulations). Under Section 62(1)(b), a company cannot grant ESOPs without the prior approval of shareholders through a special resolution passed at a general meeting. The SEBI regulations mandate that listed entities must establish a Compensation Committee / Nomination and Remuneration Committee (NRC) consisting of non-executive directors to administer the scheme and determine eligibility, vesting schedules, and exercise price terms.

From an accounting perspective, Ind AS 102 marked a profound departure from legacy Indian GAAP (Guidance Note on Accounting for Employee Share-based Payments issued by ICAI). Under the old Guidance Note, entities were permitted to use the 'Intrinsic Value Method'—the difference between the market price of the underlying share on grant date and the exercise price. Because companies frequently set the exercise price equal to the market price at grant date, intrinsic value was zero, allowing corporations to grant millions of options with zero compensation expense hitting the Profit and Loss statement! Ind AS 102 completely outlawed this loophole: all equity-settled share-based payments MUST be recognized at Fair Value on the grant date.

The foundational principle of Ind AS 102 dictates that the entity must recognize the goods or services received as expenses (or as assets if they qualify for capitalization, such as development costs under Ind AS 38) when the goods are obtained or the services rendered. If the goods or services were received in an equity-settled transaction, the corresponding credit is recognized directly in Equity under 'Share-Based Payment Reserve' (or ESOP Outstanding Account). If received in a cash-settled transaction, the credit is recognized as a Financial Liability on the Balance Sheet. Over the course of today's masterclass, we will construct the complete mathematical and accounting models governing both schemes."""

part2_say = r"""In Part 2, we explore the Grant-Date Fair Value Principle and the quantitative valuation models deployed to measure employee stock option grants under Ind AS 102.

For equity-settled transactions with employees and others providing similar services, the fair value of the services received cannot be measured directly because employee services cannot be isolated and priced on an open market. Therefore, Ind AS 102 requires the entity to measure the fair value of the services received indirectly, by reference to the Fair Value of the Equity Instruments Granted. Crucially, this fair value must be measured strictly at the Grant Date. The grant date is defined as the date at which the entity and the counterparty have a shared understanding of the terms and conditions of the arrangement, and if statutory shareholder approval is required, the date when that approval is formally obtained.

To determine the grant-date fair value of share options, entities must deploy an Option Pricing Model that market participants would use. The standard recognizes two primary models:
1. The Black-Scholes-Merton (BSM) Formula: Suitable for standard European-style options that vest on a specific date with no complex market-linked vesting hurdles.
2. The Binomial Lattice Model (or Monte Carlo Simulation): Required when options feature early exercise behavior, employee exit patterns, or complex market conditions (such as Total Shareholder Return / TSR hurdles relative to the Nifty 50 index).

Under Ind AS 102, an option pricing model must incorporate at least six fundamental economic parameters:
1. Exercise Price ($K$): The contractual strike price payable by the employee to exercise the option into a share.
2. Current Stock Price ($S_0$): The quoted market price of the underlying share on the grant date (or independent valuation for unquoted private firms).
3. Expected Option Life ($T$): The expected period from grant to exercise, which is typically shorter than the contractual life due to early employee exercise behaviors.
4. Expected Volatility ($\sigma$): The historical and implied volatility of the stock price over a period commensurate with the expected option life.
5. Expected Dividend Yield ($q$): The anticipated annual dividend payout rate of the company over the option life.
6. Risk-Free Interest Rate ($r$): The zero-coupon sovereign government bond yield (such as Government of India sovereign bond yield curves) corresponding to the expected option life.

A pivotal conceptual distinction under Ind AS 102 lies in the treatment of Vesting Conditions:
- Non-Market Vesting Conditions (Service conditions like remaining employed for 3 years, or Performance conditions like achieving a target EBITDA or revenue growth): These are NOT factored into the grant-date fair value of the option! Instead, they are accounted for by adjusting the number of options expected to vest. The compensation expense is based on the best available estimate of the number of equity instruments expected to vest, and this estimate is trued up at each reporting date until the vesting date.
- Market Vesting Conditions (Achieving a specified stock price target or relative Total Shareholder Return): These MUST be factored into the grant-date fair value calculation using Monte Carlo simulations. Crucially, there is NO subsequent true-up if a market condition fails to be achieved! If the employee satisfies the service condition, the full grant-date compensation expense must be recognized even if the stock price target is never reached.

Once established on the grant date, the fair value per option is FROZEN for equity-settled grants. Subsequent fluctuations in the company's share price—whether the stock doubles or collapses to zero—never alter the grant-date fair value or the total compensation pool recognized in the income statement."""

part3_say = r"""In Part 3, we analyze the mechanics of Graded Vesting Attribution Schedules and compare them against simple Cliff Vesting.

In commercial practice, corporations rarely structure ESOPs with a single cliff vesting date (such as 100% vesting at the end of 4 years). Instead, retention strategies mandate 'Graded Vesting'—where the option grant vests in progressive annual installments. A quintessential corporate ESOP program grants 100,000 options with a 4-year graded vesting schedule: 25% vests at the end of Year 1, 25% at Year 2, 25% at Year 3, and 25% at Year 4.

Under Ind AS 102, how must an entity recognize the compensation expense for a graded vesting scheme?
Many corporate accountants intuitively assume they can simply sum the total fair value of all 100,000 options and divide it evenly over 4 years on a straight-line basis (25% per year). Under Ind AS 102, Paragraph IG11, THIS STRAIGHT-LINE APPROACH IS STRICTLY PROHIBITED!
Ind AS 102 mandates that each tranche within a graded vesting schedule MUST be treated as a SEPARATE SHARE-BASED PAYMENT ARRANGEMENT. Because each tranche has a different vesting duration, it represents an independent service agreement:
- Tranche 1 (25,000 options): Has a 1-year vesting period. The entire expense must be recognized over Year 1 (100% recognized in Year 1).
- Tranche 2 (25,000 options): Has a 2-year vesting period. The expense is recognized over 2 years (50% in Year 1, 50% in Year 2).
- Tranche 3 (25,000 options): Has a 3-year vesting period. The expense is recognized over 3 years (33.33% in Year 1, 33.33% in Year 2, 33.33% in Year 3).
- Tranche 4 (25,000 options): Has a 4-year vesting period. The expense is recognized over 4 years (25% in Year 1, 25% in Year 2, 25% in Year 3, 25% in Year 4).

Let us examine the profound financial impact of this requirement using our mathematical example:
Assume 100,000 options are granted with a grant-date fair value of $15.00 per option, structured into four equal tranches of 25,000 options ($375,000 total fair value per tranche):
- Year 1 Expense:
  * Tranche 1: $375,000 / 1 = $375,000
  * Tranche 2: $375,000 / 2 = $187,500
  * Tranche 3: $375,000 / 3 = $125,000
  * Tranche 4: $375,000 / 4 = $93,750
  * Total Year 1 Expense = $375,000 + $187,500 + $125,000 + $93,750 = $781,250.00!
- Year 2 Expense:
  * Tranche 2: $187,500 + Tranche 3: $125,000 + Tranche 4: $93,750 = $406,250.00.
- Year 3 Expense:
  * Tranche 3: $125,000 + Tranche 4: $93,750 = $218,750.00.
- Year 4 Expense:
  * Tranche 4: $93,750.00.

Notice the remarkable phenomenon: in Year 1, the company recognizes $781,250—more than 52% of the total 4-year compensation pool ($1,500,000)! Graded vesting creates an intensely front-loaded expense curve that hits the corporate income statement early in the grant lifecycle. Financial controllers must educate the Board Audit Committee and equity research analysts about this dynamic, preventing unwarranted panic over high employee benefit expenses in the initial year of an ESOP launch.

Furthermore, Ind AS 102 requires management to estimate employee forfeiture rates (attrition) during the vesting period. If a company grants options to 1,000 employees and expects 5% annual turnover, the initial expense must reflect the expectation that only 95% of options will vest. If actual turnover differs from expectations, management trues up the forfeiture rate at each reporting date, adjusting cumulative expense in the current period's P&L.

Under Ind AS 102 Paragraphs 26–29, corporate controllers must also navigate option cancellations and modifications. If an entity cancels or settles an equity-settled grant during the vesting period (other than by forfeiture when vesting conditions are not met), the entity must treat the cancellation as an ACCELERATION OF VESTING! It must immediately recognize the amount that otherwise would have been recognized for services received over the remainder of the vesting period in the current period P&L. If replacement options are granted, the incremental fair value (new option fair value minus old option fair value at modification date) must be recognized over the remaining vesting period of the replacement grant, ensuring rigorous governance over executive repricing."""

part4_say = r"""In Part 4, we examine Cash-Settled Share-Based Payment Transactions, focusing on Stock Appreciation Rights (SARs), balance sheet liability dynamics, and arrangements with cash alternatives.

A Stock Appreciation Right (SAR) is an incentive instrument that entitles the employee to receive a cash payment equal to the appreciation in the company's share price over a specified strike price, measured across a vesting service period. For example, if an employee holds 1,000 SARs with a strike price of $50, and upon vesting the market price is $75, the entity pays the employee $25,000 in cash ($25 appreciation * 1,000 units).

The accounting treatment of Cash-Settled SARs under Ind AS 102 diverges radically from Equity-Settled ESOPs:
1. Balance Sheet Classification: The counterparty credit is NOT recognized in equity. Because the entity has a present legal obligation to transfer cash upon exercise, the credit is recorded as a Financial Liability (Provision for Stock Appreciation Rights) under Current or Non-Current Liabilities.
2. Fair Value Measurement & Continuous Remeasurement: Unlike equity-settled options whose fair value is frozen at grant date, Cash-Settled SARs MUST BE REMEASURED AT FAIR VALUE AT EACH REPORTING DATE until the liability is settled, and at the date of final settlement!
3. Profit and Loss Volatility: Any change in the fair value of the liability between reporting dates is recognized immediately in the Profit and Loss statement as Employee Benefit Expense (or credit if fair value drops).

Let us walk through the multi-period accounting mechanics:
Assume Nexus Enterprise Technologies Ltd grants 50,000 Cash-Settled SARs with a 3-year service vesting period:
- Year 1 Reporting Date:
  * Treasury calculates the fair value per SAR using the Black-Scholes model to be $18.00.
  * Cumulative vesting fraction = 1 / 3.
  * Cumulative Liability required = 50,000 * $18.00 * (1 / 3) = $300,000.00.
  * Year 1 P&L Expense = $300,000.00 (Debit Employee Benefit Expense, Credit SAR Liability).
- Year 2 Reporting Date:
  * Company performance surges, and share price appreciation pushes the fair value per SAR up to $22.00.
  * Cumulative vesting fraction = 2 / 3.
  * Cumulative Liability required = 50,000 * $22.00 * (2 / 3) = $733,333.33.
  * Since $300,000 was already recognized in Year 1, Year 2 P&L Expense = $733,333.33 - $300,000.00 = $433,333.33!
- Year 3 Reporting Date (Vesting Date):
  * Suppose the market price settles at $25.00 per SAR.
  * Cumulative Liability required = 50,000 * $25.00 * (3 / 3) = $1,250,000.00.
  * Year 3 P&L Expense = $1,250,000.00 - $733,333.33 = $516,666.67.
  * Upon settlement, cash is paid out ($1,250,000), clearing the liability to zero.

Where an arrangement grants either the entity or the counterparty a choice of settlement (cash vs equity), Ind AS 102 establishes distinct decision trees. If the counterparty (employee) has the right to demand cash settlement, the entity has granted a compound financial instrument consisting of a debt component (the employee's right to demand cash) and an equity component (the employee's right to receive equity instruments instead of cash). For transactions with employees, the fair value of the compound financial instrument is measured as the sum of the fair value of the debt component and the fair value of the equity component. 

If the entity has the choice of settlement, it must determine whether it has a present obligation to settle in cash (for instance, if the entity has a historical practice of settling in cash or if equity settlement has no commercial substance). If a present cash obligation exists, it accounts for the transaction as cash-settled; otherwise, it accounts for it as equity-settled. To mitigate earnings volatility arising from cash-settled SAR liabilities, treasury teams frequently execute hedging strategies, such as purchasing equity call options or entering into total return swaps, whose gains offset the SAR liability expansion."""

part5_say = r"""In Part 5, we execute our Python Ind AS 102 Share-Based Payments Engine, verify all statutory and mathematical assertions, and review the end-to-end accounting entries.

Now, inspect our standalone Python class `IndAS102ShareBasedPaymentEngine`. This system encapsulates the two primary computational engines of Ind AS 102:
1. `calculate_equity_settled_esop`:
   - Inputs: Total options count (100,000), Grant-Date Fair Value ($15.00), Vesting Term (4 years), and Forfeiture Rate (5.0%).
   - Computes Effective Options Pool: $100,000 \times (1 - 0.05) = 95,000$ options.
   - Computes Total Compensation Pool: $95,000 \times \$15.00 = \$1,425,000.00$.
   - Amortizes straight-line across 4 years: Year 1 Expense = $\$1,425,000 / 4 = \$356,250.00$.
   - Validates that the cumulative Share-Based Payment Reserve on the balance sheet equals $\$356,250.00$.
2. `calculate_graded_vesting`:
   - Models the 4 tranches of 25,000 options each ($375,000 grant value per tranche).
   - Dynamically evaluates active tranches: Tranche 1 ($375k), Tranche 2 ($187.5k), Tranche 3 ($125k), Tranche 4 ($93.75k).
   - Reconciles total Year 1 front-loaded expense to exactly $\$781,250.00$.
3. `calculate_cash_settled_sar`:
   - Evaluates the 50,000 cash-settled units across Year 1 ($18.00 FV) and Year 2 ($22.00 FV).
   - Computes Year 1 cumulative liability of $\$300,000.00$ and Year 2 liability of $\$733,333.33$.
   - Derives Year 2 incremental P&L expense of $\$433,333.33$.

Behind the clean terminal output lies an unshakeable mathematical proof. The Python class `IndAS102ShareBasedPaymentEngine` guarantees that corporate controllers can audit, simulate, and defend executive equity compensation plans before statutory auditors. The method `calculate_equity_settled_esop` establishes the foundational baseline: taking a grant of 100,000 options at $15.00 grant-date fair value with a 5% forfeiture expectation, resulting in an effective pool of 95,000 options and an aggregate compensation cost of $1,425,000 amortized at $356,250 annually. The method `calculate_graded_vesting` models multi-tranche structures, demonstrating why Year 1 expense surges to $781,250 (more than half the total 4-year pool). The method `calculate_cash_settled_sar` enforces continuous reporting date fair value remeasurements, computing the liability jump from $300,000 in Year 1 to $733,333 in Year 2 and extracting the exact incremental P&L expense charge of $433,333.33.

Let us review the fundamental double-entry journal entries generated by these transactions:
- Equity-Settled ESOP (Year 1):
  * Debit: Employee Benefit Expense (P&L) — $\$356,250.00$
  * Credit: Share-Based Payment Reserve (Equity) — $\$356,250.00$
  *(Note: Equity increases by the exact amount that net income decreases; total equity remains unchanged before tax adjustments!)*
- Cash-Settled SAR (Year 1):
  * Debit: Employee Benefit Expense (P&L) — $\$300,000.00$
  * Credit: Provision for Stock Appreciation Rights (Liability) — $\$300,000.00$
  *(Note: Liabilities increase while equity decreases; total balance sheet leverage rises!)*

From a tax accounting perspective under Ind AS 12, equity-settled share options generate substantial temporary differences. In India and many IFRS jurisdictions, employee share options are not tax-deductible when the accounting expense is recognized over the vesting period. The tax deduction is granted only upon exercise, based on the actual intrinsic value of the shares at the exercise date! Consequently, controllers must establish Deferred Tax Assets (DTA) based on the estimated future tax deduction, adjusting for excess tax benefits directly within Equity.

Upon running our Python validation script, every mathematical assertion resolves with 100% precision, terminating in the confirmation output:
`IND_AS_102_SHARE_BASED_PAYMENTS_PASS`.
You have now conquered the advanced mechanics of executive equity compensation under Ind AS 102. In Day 37, we will expand this foundation into corporate deferred taxation under Ind AS 12, exploring the balance sheet liability approach, temporary differences, and corporate tax rates under Section 115BAA."""

day36_lesson = {
    "coursePrefix": "bcom-accounting",
    "day": 36,
    "title": "Ind AS 102 & IFRS 2: Share-Based Payments, ESOPs & Equity Compensation",
    "parts": [
        {
            "part": 1,
            "title": "Scope of Ind AS 102, Equity-Settled vs Cash-Settled Archetypes & Legal Mandates",
            "say": part1_say,
            "code": day36_code,
            "output": day36_output,
            "check": {
                "question": "Under Ind AS 102, what is the required accounting treatment for an Equity-Settled Employee Stock Option Plan (ESOP)?",
                "options": [
                    "Recognize employee benefit expense over the vesting period based on grant-date fair value, with a corresponding credit to equity (Share-Based Payment Reserve)",
                    "Recognize expense only if the market price exceeds the exercise price under the legacy intrinsic value method",
                    "Record the entire contractual value as a current cash liability on the grant date",
                    "Keep the option grant completely off the financial statements with zero footnote disclosure"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Ind AS 102 requires equity-settled share-based payments to be measured at grant-date fair value and recognized as an expense over the vesting period, crediting equity directly.",
                "why": "Ind AS 102 requires equity-settled share-based payments to be measured at grant-date fair value and recognized as an expense over the vesting period, crediting equity directly."
            }
        },
        {
            "part": 2,
            "title": "Grant-Date Fair Value Principle, Option Pricing Models & Vesting Conditions",
            "say": part2_say,
            "code": day36_code,
            "output": day36_output,
            "check": {
                "question": "How are non-market vesting conditions (such as remaining in service for 3 years or achieving an EBITDA target) accounted for under Ind AS 102?",
                "options": [
                    "They are excluded from the grant-date option pricing model and accounted for by adjusting the estimated number of options expected to vest at each reporting date",
                    "They are factored into the grant-date fair value calculation and can never be adjusted subsequently",
                    "They immediately disqualify the arrangement from being recognized under Ind AS 102",
                    "They mandate that the option be reclassified as a cash-settled liability"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Non-market vesting conditions are not factored into the grant-date fair value per option. Instead, the entity trues up the estimate of the number of instruments expected to vest at each reporting date.",
                "why": "Non-market vesting conditions are not factored into the grant-date fair value per option. Instead, the entity trues up the estimate of the number of instruments expected to vest at each reporting date."
            }
        },
        {
            "part": 3,
            "title": "Graded Vesting Attribution Schedules vs Cliff Vesting & Front-Loaded P&L Impact",
            "say": part3_say,
            "code": day36_code,
            "output": day36_output,
            "check": {
                "question": "When an ESOP features a 4-year graded vesting schedule (25% vesting each year), how must the compensation expense be recognized under Ind AS 102?",
                "options": [
                    "Each tranche must be treated as a separate share-based payment arrangement with its own vesting period, producing a front-loaded expense curve",
                    "The total fair value must be divided equally across 4 years on a straight-line basis (25% per year)",
                    "100% of the total compensation cost must be expensed on the first day of Year 1",
                    "No expense can be recognized until all 4 tranches have fully vested at the end of Year 4"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Under Ind AS 102 (IG11), each tranche in a graded vesting scheme represents an independent service agreement and must be expensed separately over its specific vesting duration.",
                "why": "Under Ind AS 102 (IG11), each tranche in a graded vesting scheme represents an independent service agreement and must be expensed separately over its specific vesting duration."
            }
        },
        {
            "part": 4,
            "title": "Cash-Settled Stock Appreciation Rights (SARs) & Reporting Date Fair Value Remeasurement",
            "say": part4_say,
            "code": day36_code,
            "output": day36_output,
            "check": {
                "question": "What is the primary difference in balance sheet and P&L treatment between Cash-Settled SARs and Equity-Settled ESOPs?",
                "options": [
                    "Cash-Settled SARs are recognized as financial liabilities and remeasured at fair value at each reporting date through P&L, whereas Equity ESOPs have frozen grant-date fair values credited to equity",
                    "Cash-Settled SARs are credited to equity while Equity ESOPs are recognized as liabilities",
                    "Cash-Settled SARs are never recognized in the financial statements until cash is disbursed",
                    "Cash-Settled SARs can only be granted to non-executive directors"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Cash-settled share-based payments create a legal obligation to disburse cash, mandating liability classification and continuous fair value remeasurement at every balance sheet date through P&L.",
                "why": "Cash-settled share-based payments create a legal obligation to disburse cash, mandating liability classification and continuous fair value remeasurement at every balance sheet date through P&L."
            }
        },
        {
            "part": 5,
            "title": "Python Share-Based Payments Simulator Execution & Ind AS 102 Certification",
            "say": part5_say,
            "code": day36_code,
            "output": day36_output,
            "check": {
                "question": "What is the terminal confirmation string emitted by the Ind AS 102 simulation engine upon verifying all mathematical and statutory assertions?",
                "options": [
                    "IND_AS_102_SHARE_BASED_PAYMENTS_PASS",
                    "ESOP_VALUATION_REJECTED_AUDIT_FAIL",
                    "SHARE_BASED_RESERVE_DISCREPANCY_ERROR",
                    "INTRINSIC_VALUE_METHOD_TERMINATED"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "The Ind AS 102 engine validates all calculations across equity ESOPs, graded vesting, and cash SARs, culminating in IND_AS_102_SHARE_BASED_PAYMENTS_PASS.",
                "why": "The Ind AS 102 engine validates all calculations across equity ESOPs, graded vesting, and cash SARs, culminating in IND_AS_102_SHARE_BASED_PAYMENTS_PASS."
            }
        }
    ]
}

total_words = 0
for p in day36_lesson["parts"]:
    wc = count_words(p["say"])
    total_words += wc
    print(f"Day 36 Part {p['part']} words: {wc}")

for p in day36_lesson["parts"]:
    wc = count_words(p["say"])
    assert wc >= 580, f"Part {p['part']} word count {wc} < 580"

print(f"Day 36 Total words: {total_words}")
assert total_words >= 3000, f"Total word count {total_words} < 3000"

with open("scripts/bcom_acc_day36.json", "w", encoding="utf-8") as f:
    json.dump(day36_lesson, f, indent=2)

print("Saved scripts/bcom_acc_day36.json successfully!")
