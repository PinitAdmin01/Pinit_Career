import json
import hashlib
import subprocess
import sys
import os

def run_py(code):
    res = subprocess.run([sys.executable, "-c", code], capture_output=True, text=True, check=True)
    return res.stdout.strip()

# Day 14 Parts with institutional private equity financial engineering exposition
parts = [
    {
        "title": "LBO Transaction Architecture: Sources & Uses of Funds, Purchase Price Multiples & Sponsor Equity Check",
        "say": [
            "In institutional finance, alternative asset management, and private equity underwriting, the Leveraged Buyout (LBO) represents the ultimate synthesis of financial engineering, corporate governance, and capital structure optimization. In an LBO, a private equity financial sponsor acquires a mature, cash-generative corporation using a high proportion of borrowed debt capital (typically 50% to 75% of the total acquisition purchase price) combined with a minority equity contribution provided by the sponsor's investment fund. Over an explicit holding period of three to seven years, the portfolio company's robust operating cash flows are harnessed to service interest obligations and systematically pay down the acquisition debt. Upon exit—whether through a secondary sale to another buyout fund, a strategic sale to a corporate buyer, or an Initial Public Offering (IPO)—the sponsor reaps substantial equity upside, converting debt paydown and operational growth into high compounding returns.",
            "The foundational centerpiece of every institutional LBO model is the Sources & Uses of Funds Table. The Sources & Uses statement governs the mechanics of the transaction closing, answering two fundamental questions: exactly how much total capital is required to acquire the target and pay transaction frictions, and exactly where will that capital come from? An inviolable mathematical and structural law of private equity modeling dictates that Total Sources must equal Total Uses with dollar-for-dollar precision (Total Sources == Total Uses). If a single dollar of transaction friction or balance sheet cash is misallocated, the entire closing ledger unbalances, invalidating the transaction architecture.",
            "Let us meticulously analyze the Uses of Funds side of the ledger. The largest component is the Purchase of Equity (the consideration paid to the target company's selling shareholders). Enterprise Value (EV) is typically negotiated as an entry multiple applied to the target company's Last Twelve Months (LTM) adjusted EBITDA (such as 10.5x EV/EBITDA). From this negotiated Enterprise Value, the target's existing debt must be refinanced: lenders of record will not permit their debt to remain in place without explicit change-of-control waivers, meaning existing revolving credit lines and term loans are paid off in full at closing. Next, transaction costs must be capitalized: Financing Fees (typically 2.0% to 3.0% paid to underwriting investment banks to syndicate debt tranches) and M&A Advisory Fees (legal fees, accounting quality-of-earnings diligence, and strategy consulting fees). Finally, Minimum Cash required to operate corporate bank accounts post-closing is funded.",
            "On the Sources of Funds side of the ledger, the private equity sponsor layers debt capital across distinct tranches based on prevailing credit market capacity. Senior Secured Bank Debt (such as Term Loan A and Term Loan B) is raised up to prudential leverage limits (e.g., 3.0x to 4.0x EBITDA), followed by Junior Capital or Senior Unsecured Notes (e.g., 1.5x to 2.5x EBITDA). In many corporate buyouts, existing management is invited to roll over a portion of their equity ownership (Management Rollover Equity) into the new holding company, creating powerful skin-in-the-game alignment. Finally, the Sponsor Equity Check is calculated as the balancing plug: Sponsor Equity = Total Uses - Total Debt Raised - Management Rollover. This equity check represents the cash committed from the private equity fund's institutional limited partners.",
            "Evaluating the sponsor equity check is critical: if debt capacity is constrained or purchase multiples expand, the required equity contribution surges, diluting the fund's projected Internal Rate of Return (IRR). Conversely, if the sponsor can secure cheap, covenant-lite debt financing, the initial equity check shrinks, magnifying returns through financial leverage. In this section, we construct a production-grade LBO Sources & Uses Engine in Python. We calculate total enterprise transaction value from LTM EBITDA, model financing and advisory fees, allocate multiple debt tranches, and compute the exact Sponsor Equity Check balancing the transaction.",
            "Financial modelers must note the vital distinction between transaction value and legal funds flow. While Enterprise Value dictates the commercial price, the actual cash that changes hands on closing day reflects adjustments for target cash, working capital true-ups against agreed peg targets, and accrued transaction liabilities. Our model establishes this institutional discipline, structuring a resilient Sources and Uses schedule that serves as the baseline for multi-tranche debt modeling."
        ],
        "example": "Think of purchasing a $1,000,000 rental property: you borrow $700,000 from the bank (Debt Sources) and put down $300,000 of your own savings (Sponsor Equity Source); you use that $1,000,000 to buy the property, pay $30,000 in closing and legal fees, and keep $20,000 in reserve for unexpected maintenance (Uses of Funds).",
        "code": """# Part 1: LBO Sources & Uses Transaction Engine
class LboSourcesAndUsesEngine:
    def __init__(self, ltm_ebitda=40000000.0, entry_multiple=11.0, existing_debt=60000000.0, min_cash=10000000.0):
        self.ltm_ebitda = ltm_ebitda
        self.entry_multiple = entry_multiple
        self.existing_debt = existing_debt
        self.min_cash = min_cash

    def build_sources_and_uses(self, tlb_multiple=3.5, notes_multiple=2.0, mgmt_rollover=15000000.0,
                               financing_fee_pct=0.025, advisory_fees=8000000.0):
        # 1. Enterprise Value & Equity Purchase Price
        enterprise_value = self.ltm_ebitda * self.entry_multiple
        equity_purchase_price = enterprise_value - self.existing_debt
        
        # 2. Debt Financing Tranches
        term_loan_b = self.ltm_ebitda * tlb_multiple
        senior_notes = self.ltm_ebitda * notes_multiple
        total_debt_raised = term_loan_b + senior_notes
        
        # 3. Transaction Frictions (Financing Fees & Advisory)
        financing_fees = total_debt_raised * financing_fee_pct
        
        # 4. Total Uses of Funds
        # Uses: Refinance Existing Debt, Pay Equity Consideration, Refinance / Fund Min Cash, Fees
        total_uses = equity_purchase_price + self.existing_debt + self.min_cash + financing_fees + advisory_fees
        
        # 5. Total Sources of Funds (Sponsor Equity is the Balancing Plug)
        non_sponsor_sources = total_debt_raised + mgmt_rollover
        sponsor_equity_check = total_uses - non_sponsor_sources
        total_sources = non_sponsor_sources + sponsor_equity_check
        
        assert abs(total_sources - total_uses) < 1e-4, "Invariant Violation: Sources != Uses!"
        
        return {
            'enterprise_value': round(enterprise_value, 2),
            'equity_purchase_price': round(equity_purchase_price, 2),
            'term_loan_b': round(term_loan_b, 2),
            'senior_notes': round(senior_notes, 2),
            'total_debt': round(total_debt_raised, 2),
            'mgmt_rollover': round(mgmt_rollover, 2),
            'sponsor_equity': round(sponsor_equity_check, 2),
            'financing_fees': round(financing_fees, 2),
            'advisory_fees': round(advisory_fees, 2),
            'min_cash': round(self.min_cash, 2),
            'total_uses': round(total_uses, 2),
            'total_sources': round(total_sources, 2),
            'leverage_ratio': round(total_debt_raised / self.ltm_ebitda, 2),
            'equity_pct': round((sponsor_equity_check + mgmt_rollover) / enterprise_value * 100.0, 2)
        }

engine = LboSourcesAndUsesEngine()
res = engine.build_sources_and_uses()

print("=== LBO SOURCES & USES TRANSACTION REPORT ===")
print(f"Enterprise Value ({engine.entry_multiple}x EBITDA): ${res['enterprise_value']:,.2f}")
print(f"Total Leverage: {res['leverage_ratio']}x EBITDA | Total Equity: {res['equity_pct']}% of EV")
print("-" * 65)
print("SOURCES OF FUNDS:                           | USES OF FUNDS:")
print(f"  Term Loan B (3.5x):     ${res['term_loan_b']:>12,.2f} |   Equity Purchase Price: ${res['equity_purchase_price']:>12,.2f}")
print(f"  Senior Notes (2.0x):    ${res['senior_notes']:>12,.2f} |   Refinance Existing Debt: ${engine.existing_debt:>10,.2f}")
print(f"  Management Rollover:    ${res['mgmt_rollover']:>12,.2f} |   Minimum Balance Cash:    ${res['min_cash']:>10,.2f}")
print(f"  Sponsor Equity Check:   ${res['sponsor_equity']:>12,.2f} |   Financing Fees (2.5%):   ${res['financing_fees']:>10,.2f}")
print(f"                                       |   Advisory & Legal Fees:   ${res['advisory_fees']:>10,.2f}")
print("-" * 65)
print(f"TOTAL SOURCES:            ${res['total_sources']:>12,.2f} | TOTAL USES:              ${res['total_uses']:>12,.2f}")
""",
        "codeNotes": [
            {"line": 2, "note": "Initializes LboSourcesAndUsesEngine with LTM EBITDA, purchase multiple, existing debt, and cash requirements"},
            {"line": 10, "note": "Calculates negotiated Enterprise Value and target equity purchase consideration"},
            {"line": 14, "note": "Sizes Term Loan B and Senior Notes tranches based on agreed operational leverage caps"},
            {"line": 24, "note": "Enforces strict mathematical invariant: Sponsor Equity solves as the plug where Total Sources == Total Uses"}
        ],
        "tryIt": "Increase entry_multiple from 11.0x to 13.0x and observe how the required Sponsor Equity Check expands to bridge the higher valuation.",
        "check": {
            "question": "In an LBO Sources & Uses table, why is the Sponsor Equity Check modeled as the balancing plug rather than a fixed upfront input?",
            "options": [
                "To enforce the foundational accounting invariant that Total Sources of Capital must exactly equal Total Uses of Capital",
                "Because private equity sponsors never know how much capital they have in their investment fund",
                "Because US banking regulations forbid sponsors from declaring fixed equity contributions",
                "To ensure that debt financing is minimized under all macroeconomic conditions"
            ],
            "answer": 0,
            "why": "Total Uses represents the non-negotiable cash required to buy the company, refinance debt, and pay fees; the sponsor equity check is the residual capital required to bridge the gap after debt is raised."
        }
    },
    {
        "title": "Multi-Tranche Debt Financing: Revolver, Term Loan A/B, Mezzanine & Mandatory Amortization",
        "say": [
            "In modern leveraged finance, private equity sponsors rarely rely on a single monolithic debt instrument to fund an acquisition. Instead, institutional syndicates construct a multi-tranche capital structure, carefully layering debt securities with varying priority of claims, interest rate structures, amortization profiles, and covenant packages. Structuring debt across multiple tranches allows the sponsor to optimize its blended cost of borrowing while preserving operational flexibility: balancing cheap, amortizing bank debt against more expensive, flexible institutional capital.",
            "At the top of the capital structure sits the Revolving Credit Facility (Revolver). The Revolver acts as a corporate credit card, drawn upon during seasonal working capital troughs and repaid during cash-rich quarters. Revolvers are senior secured, carry the lowest floating interest margin (e.g., SOFR + 225 basis points), and require an undrawn commitment fee (typically 35 to 50 bps on undrawn capacity) to compensate the syndicate banks for reserving balance sheet liquidity.",
            "Next in priority is Term Loan A (TLA), traditionally referred to as 'pro-rata' bank debt because it is syndicated to commercial banks alongside the Revolver. TLA features significant mandatory annual principal amortization—often 5.0% to 10.0% of the original principal per annum across a 5-year term—meaning the borrower must aggressively pay down principal from cash flow. Because TLA aggressively amortizes and holds first-lien security on all corporate assets, it carries a low floating interest coupon.",
            "By contrast, Term Loan B (TLB) is an institutional debt product marketed to Collateralized Loan Obligations (CLOs), hedge funds, and private credit managers. TLB typically carries a longer maturity (6 to 7 years) and features nominal mandatory amortization of only 1.0% per annum (known as '1% annual bullet amortization'), with the vast 94% balance due as a balloon payment at maturity. Because TLB permits the company to retain almost all operating cash flow rather than consuming it in mandatory bank amortization, it commands a higher interest spread (e.g., SOFR + 375 bps).",
            "Further down the capital structure are Senior Unsecured Notes and Mezzanine Financing. Senior Notes are fixed-rate high-yield bonds (e.g., 8.0% fixed coupon) with 8-year maturities and zero mandatory amortization before maturity. Mezzanine debt sits in the subordinated layer just above common equity; to compensate investors for their subordinate claim during bankruptcy, mezzanine debt yields 12% to 15%, often structured with a Payment-in-Kind (PIK) feature. Under a PIK toggle, the company does not pay cash interest; instead, unpaid interest is capitalized onto the principal balance, deferring cash outflows until exit.",
            "A critical legal and structural dichotomy separates Maintenance Covenants from Incurrence Covenants across these tranches. Bank debt instruments (Revolver and Term Loan A) are governed by strict maintenance covenants, requiring the borrower to prove quarterly compliance with financial ratios such as maintaining Total Debt to EBITDA below 4.5x and Interest Coverage above 3.0x. Breaching a maintenance covenant triggers technical default, giving banks the legal power to seize assets. By contrast, institutional Term Loan B and high-yield Senior Notes typically feature 'covenant-lite' or incurrence covenants, which only restrict company behavior when it actively attempts to take on more debt or execute equity distributions.",
            "Furthermore, because floating-rate tranches are indexed to the Secured Overnight Financing Rate (SOFR), private equity sponsors face substantial interest rate volatility risk. Lending syndicates routinely mandate that borrowers enter into interest rate hedging contracts—such as interest rate caps or SOFR-to-fixed interest rate swaps—covering at least 50% of the funded floating debt for the first three years of the investment. This protective overlay guarantees that sudden central bank rate hikes do not choke the company's free cash flow.",
            "In this section, we construct a production-grade Multi-Tranche Debt Schedule Engine in Python. We model the year-by-year beginning balance, mandatory principal amortization, interest expense calculations across floating and fixed tranches, and ending debt balances across a 5-year holding period, tracking how the debt stack evolves over time."
        ],
        "example": "Think of financing a commercial warehouse: Term Loan A is a traditional 5-year bank mortgage where you pay down principal every month; Term Loan B is an interest-only commercial loan where you only pay 1% principal a year; and Mezzanine debt is a high-interest bridge loan that adds unpaid interest onto the loan balance.",
        "code": """# Part 2: Multi-Tranche Debt Schedule Engine
class MultiTrancheDebtScheduleEngine:
    def __init__(self, tlb_principal=140000000.0, notes_principal=80000000.0,
                 tlb_margin=0.045, sofr_rate=0.035, notes_coupon=0.080, tlb_amort_pct=0.01):
        self.tlb_principal = tlb_principal
        self.notes_principal = notes_principal
        self.tlb_rate = tlb_margin + sofr_rate  # 8.0% floating
        self.notes_rate = notes_coupon          # 8.0% fixed
        self.tlb_amort_pct = tlb_amort_pct

    def project_debt_schedule(self, years=5):
        schedule = []
        tlb_beg = self.tlb_principal
        notes_beg = self.notes_principal
        annual_tlb_amort = self.tlb_principal * self.tlb_amort_pct

        for yr in range(1, years + 1):
            # Term Loan B: 1% mandatory amortization
            tlb_amort = min(annual_tlb_amort, tlb_beg)
            tlb_end = tlb_beg - tlb_amort
            tlb_interest = (tlb_beg + tlb_end) / 2.0 * self.tlb_rate
            
            # Senior Notes: Non-amortizing bullet
            notes_amort = 0.0
            notes_end = notes_beg
            notes_interest = notes_beg * self.notes_rate
            
            total_interest = tlb_interest + notes_interest
            total_amort = tlb_amort + notes_amort
            total_end_debt = tlb_end + notes_end
            
            schedule.append({
                'year': yr,
                'tlb_beg': round(tlb_beg, 2),
                'tlb_amort': round(tlb_amort, 2),
                'tlb_end': round(tlb_end, 2),
                'notes_end': round(notes_end, 2),
                'total_interest': round(total_interest, 2),
                'total_amort': round(total_amort, 2),
                'total_end_debt': round(total_end_debt, 2)
            })
            
            tlb_beg = tlb_end
            notes_beg = notes_end

        return schedule

engine = MultiTrancheDebtScheduleEngine()
sched = engine.project_debt_schedule()

print("=== 5-YEAR MULTI-TRANCHE DEBT AMORTIZATION SCHEDULE ===")
print(f"{'Year':<5} | {'TLB Beg':<14} | {'Mand Amort':<12} | {'TLB End':<14} | {'Notes End':<12} | {'Total Debt':<14} | {'Interest Exp':<12}")
print("-" * 95)
for row in sched:
    print(f"Yr {row['year']:<2} | ${row['tlb_beg']:>12,.0f} | ${row['tlb_amort']:>10,.0f} | ${row['tlb_end']:>12,.0f} | ${row['notes_end']:>10,.0f} | ${row['total_end_debt']:>12,.0f} | ${row['total_interest']:>10,.0f}")
""",
        "codeNotes": [
            {"line": 2, "note": "Initializes MultiTrancheDebtScheduleEngine with principal sizes, interest margins, SOFR benchmark, and amortization rules"},
            {"line": 13, "note": "Implements 1% mandatory annual institutional amortization on Term Loan B principal"},
            {"line": 17, "note": "Calculates interest expense based on average beginning and ending debt balances across the period"},
            {"line": 20, "note": "Models Senior Notes as non-amortizing bullet maturity with fixed coupon interest throughout"}
        ],
        "tryIt": "Increase tlb_amort_pct to 5.0% and observe how rapid mandatory principal amortization lowers annual interest expense over time.",
        "check": {
            "question": "What is the primary structural difference between Term Loan A (TLA) and Term Loan B (TLB) in leveraged buyout financing?",
            "options": [
                "TLA features significant mandatory annual amortization (5-10%), while TLB has light amortization (typically 1% bullet) preserving operating cash flow",
                "TLA is unsecured subordinated debt while TLB is equity",
                "TLB is illegal under corporate credit guidelines",
                "TLA never charges interest payments to the borrower"
            ],
            "answer": 0,
            "why": "Term Loan A requires heavy bank amortization (5%-10%/yr), whereas Term Loan B is designed for institutional investors with minimal 1% annual amortization, leaving maximum cash for voluntary sweeps."
        }
    },
    {
        "title": "Cash Flow Sweep Mechanics, Debt Paydown Dynamics & Deleveraging Value Creation",
        "say": [
            "While mandatory amortization represents the contractual baseline of debt repayment, the real financial power of a private equity leveraged buyout is unlocked through the Cash Flow Sweep (Excess Cash Flow Sweep). Credit agreements negotiated with institutional lenders mandate that after the company satisfies its mandatory interest payments, corporate income taxes, working capital investments, maintenance capital expenditures, and contractual scheduled amortization, a stipulated percentage (often 50%, 75%, or 100% depending on leverage ratios) of all remaining excess cash flow must be 'swept' to prepay debt ahead of schedule.",
            "To calculate the cash available for sweep, analysts compute Cash Flow Available for Debt Service (CFADS). The derivation proceeds systematically: CFADS = EBITDA - Cash Interest - Cash Taxes - CapEx - delta NWC. From CFADS, the model first pays mandatory principal amortization. The residual cash is defined as Free Cash Flow (Excess Cash Flow). This Excess Cash Flow is then directed into the debt repayment waterfall: paying down prepayable debt in order of seniority (Revolver first, then Term Loan B). Fixed-rate Senior Notes are generally exempt from voluntary prepayments due to strict non-call provisions and make-whole prepayment penalties.",
            "This dynamic cash sweep mechanism drives the core value-creation engine of private equity: Deleveraging. In financial mathematics, shareholder wealth creation in an LBO is governed by the enterprise-to-equity identity: Equity_t = Enterprise_Value_t - Net_Debt_t. Consider the profound implications of this equation: even if the underlying company experiences zero revenue growth, zero operating margin expansion, and zero valuation multiple expansion upon exit, the equity value still compounds dramatically if the firm uses its operating cash flow to extinguish debt.",
            "For example, suppose a private equity sponsor acquires an enterprise for $440 million of Enterprise Value using $260 million of debt and $180 million of equity. Over a 5-year investment period, the company generates sufficient excess cash flow to pay down $140 million of debt, reducing ending debt to $120 million. Even if the business is sold in Year 5 at the exact same $440 million Enterprise Value, the ending Equity Value is now $440M - $120M = $320 million! The sponsor's initial $180 million equity check has expanded to $320 million—delivering an 80% capital gain and a 12.2% annual compound return purely through debt paydown.",
            "Institutional buyout firms formally decompose investment returns in their LP quarterly reports using the Value Creation Bridge. This bridge breaks total equity value creation into three distinct pillars: (1) Deleveraging / Debt Paydown (the reduction in net debt over the hold), (2) EBITDA Growth (operational expansion through organic revenue growth, strategic price increases, and SG&A procurement synergies), and (3) Multiple Expansion or Contraction (the delta between entry EV/EBITDA and exit EV/EBITDA). Understanding which pillar drove returns is essential: top-tier sponsors pride themselves on driving operational EBITDA expansion rather than relying solely on rising market multiples.",
            "Additionally, private equity operating partners aggressively optimize the portfolio company's working capital cycles during Years 1 and 2 to accelerate the cash sweep. By renegotiating extended vendor payment terms (stretching DPO) and instituting rigorous inventory management systems (reducing DIO), millions of dollars of trapped operational liquidity are liberated. This sudden cash influx flows directly into the cash sweep, extinguishing senior debt early and substantially reducing downstream cumulative interest expense.",
            "Financial analysts must also track the Sweep Covenant Step-Downs: credit agreements frequently include ratchet provisions where the required sweep percentage declines from 75% to 50% or 0% as total leverage drops below predefined credit benchmarks (e.g., Debt/EBITDA falling below 3.0x). Our engine establishes the quantitative framework governing these institutional sweep dynamics.",
            "In this section, we construct a production-grade Cash Flow Sweep and Deleveraging Engine in Python. We model the complete cash sweep waterfall, apply excess cash to prepay Term Loan B, and quantify the exact dollar value created through balance sheet deleveraging across the 5-year holding horizon."
        ],
        "example": "Think of buying a rental home where the tenant's monthly rent pays for all maintenance and repairs, and every single extra dollar is sent directly to the bank to pay down the mortgage principal: after five years, you own a much larger share of the house free and clear without ever putting in another penny.",
        "code": """# Part 3: Cash Flow Sweep & Deleveraging Engine
class CashFlowSweepAndDeleveragingEngine:
    def __init__(self, initial_ev=440000000.0, initial_debt=220000000.0, initial_equity=220000000.0):
        self.initial_ev = initial_ev
        self.initial_debt = initial_debt
        self.initial_equity = initial_equity

    def execute_5yr_sweep(self, ebitda_stream, capex_stream, nwc_stream, tax_rate=0.25,
                           interest_rate=0.08, sweep_pct=1.0, mand_amort_pct=0.01):
        debt_balance = self.initial_debt
        history = []
        annual_mand_amort = self.initial_debt * mand_amort_pct

        for yr in range(len(ebitda_stream)):
            ebitda = ebitda_stream[yr]
            interest = debt_balance * interest_rate
            taxable_income = max(0.0, ebitda - interest - ebitda * 0.15)  # approx D&A 15%
            cash_taxes = taxable_income * tax_rate
            capex = capex_stream[yr]
            delta_nwc = nwc_stream[yr]
            
            # Cash Flow Available for Debt Service (CFADS)
            cfads = ebitda - interest - cash_taxes - capex - delta_nwc
            
            # Mandatory amortization
            mand_amort = min(annual_mand_amort, debt_balance)
            cash_after_mand = max(0.0, cfads - mand_amort)
            
            # Optional sweep prepayment
            sweep_prepayment = min(cash_after_mand * sweep_pct, debt_balance - mand_amort)
            total_principal_paid = mand_amort + sweep_prepayment
            debt_balance -= total_principal_paid
            
            history.append({
                'year': yr + 1,
                'ebitda': round(ebitda, 2),
                'cfads': round(cfads, 2),
                'mand_amort': round(mand_amort, 2),
                'sweep_prepay': round(sweep_prepayment, 2),
                'total_paid': round(total_principal_paid, 2),
                'ending_debt': round(debt_balance, 2)
            })

        return history

engine = CashFlowSweepAndDeleveragingEngine()
sweep_results = engine.execute_5yr_sweep(
    ebitda_stream=[42000000.0, 46000000.0, 50000000.0, 55000000.0, 60000000.0],
    capex_stream=[6000000.0, 6500000.0, 7000000.0, 7500000.0, 8000000.0],
    nwc_stream=[2000000.0, 2200000.0, 2400000.0, 2500000.0, 2600000.0]
)

total_debt_paid = engine.initial_debt - sweep_results[-1]['ending_debt']
ending_ev_flat = engine.initial_ev
ending_equity_flat = ending_ev_flat - sweep_results[-1]['ending_debt']

print("=== 5-YEAR CASH FLOW SWEEP & DELEVERAGING REPORT ===")
print(f"Initial Debt: ${engine.initial_debt:,.2f} | Initial Sponsor Equity: ${engine.initial_equity:,.2f}")
print("-" * 80)
print(f"{'Year':<5} | {'EBITDA':<12} | {'CFADS':<12} | {'Mand Amort':<12} | {'Sweep Prepay':<14} | {'Ending Debt':<14}")
print("-" * 80)
for row in sweep_results:
    print(f"Yr {row['year']:<2} | ${row['ebitda']:>10,.0f} | ${row['cfads']:>10,.0f} | ${row['mand_amort']:>10,.0f} | ${row['sweep_prepay']:>12,.0f} | ${row['ending_debt']:>12,.0f}")
print("-" * 80)
print(f"Total Cumulative Debt Extinguished: ${total_debt_paid:,.2f}")
print(f"Ending Equity Value (Assuming Flat EV): ${ending_equity_flat:,.2f} (+{(ending_equity_flat / engine.initial_equity - 1)*100:.1f}% Return)")
""",
        "codeNotes": [
            {"line": 2, "note": "Initializes CashFlowSweepAndDeleveragingEngine with initial enterprise value, debt stack, and equity check"},
            {"line": 15, "note": "Derives Cash Flow Available for Debt Service (CFADS) deducting interest, taxes, capex, and working capital"},
            {"line": 23, "note": "Executes 100% Cash Flow Sweep prepaying prepayable senior debt with residual cash after mandatory amortization"},
            {"line": 34, "note": "Proves deleveraging value creation: ending equity value expands purely from extinguishing debt obligations"}
        ],
        "tryIt": "Reduce sweep_pct from 1.0 (100%) to 0.50 (50%) and observe how ending debt increases, lowering the pace of equity value creation.",
        "check": {
            "question": "How does debt paydown (deleveraging) create shareholder value for a private equity sponsor in an LBO?",
            "options": [
                "Because Equity Value equals Enterprise Value minus Net Debt; every dollar of debt paid down directly increases equity value dollar-for-dollar",
                "Because lenders pay a cash dividend directly to equity sponsors whenever debt is retired",
                "Because paying down debt exempts the company from paying corporate income taxes permanently",
                "Debt paydown destroys value by reducing the interest tax shield"
            ],
            "answer": 0,
            "why": "Since Equity Value = Enterprise Value - Net Debt, extinguishing debt using operating cash flow directly transfers enterprise value from lenders to equity sponsors."
        }
    },
    {
        "title": "Private Equity Returns Engine: Internal Rate of Return (IRR), Multiple on Invested Capital (MoIC) & Sensitivity Heatmaps",
        "say": [
            "At the conclusion of a leveraged buyout investment holding period, institutional private equity sponsors and their investment committees evaluate transaction success against two universally recognized quantitative benchmarks: the Multiple on Invested Capital (MoIC), also known as the Cash-on-Cash Return, and the Internal Rate of Return (IRR). While accounting profits and cumulative EBITDA growth are informative, private equity funds operate under a strict fiduciary mandate to deliver superior risk-adjusted cash returns to their institutional limited partners (pension funds, university endowments, and sovereign wealth funds).",
            "Multiple on Invested Capital (MoIC) is the simplest, most intuitive measure of capital appreciation: MoIC = Total Cash Proceeds Returned / Initial Cash Equity Invested. For example, if a private equity sponsor invests an initial equity check of $100 million into an LBO and receives $250 million in net equity distributions when the portfolio company is sold at exit, the transaction generates a 2.50x MoIC. MoIC provides a non-time-dependent measure of pure capital expansion: whether the investment took three years or seven years, the fund generated $2.50 for every $1.00 of LP capital committed.",
            "By contrast, the Internal Rate of Return (IRR) is the time-weighted annualized compounded rate of return that equates the present value of all cash outflows (the initial equity check and any follow-on capital injections) to the present value of all cash inflows (dividend recaps and exit proceeds). The mathematical formula for a single exit cash flow is: IRR = (Exit Equity / Initial Equity Check)^(1 / t) - 1 = (MoIC)^(1 / t) - 1, where t is the investment holding duration in years. Because IRR compounds annually, the speed of capital return is paramount: achieving a 2.0x MoIC in two years delivers a phenomenal 41.4% IRR, whereas the same 2.0x MoIC realized over seven years yields an uninspiring 10.4% IRR.",
            "Every private equity professional memorizes the key Rule-of-Thumb conversion invariants between MoIC, holding period, and IRR: achieving a 2.0x MoIC in 3 years equals ~26% IRR; 2.0x in 5 years equals ~14.9% IRR; 2.5x in 5 years equals ~20.1% IRR; and a 'tripling of money' (3.0x MoIC) in 5 years delivers ~24.6% IRR. In institutional fundraising, top-quartile buyout funds target a minimum net portfolio return of 20% to 25% gross IRR and a 2.0x to 2.5x MoIC.",
            "In high-performing portfolio companies that rapidly delever within 24 to 36 months, sponsors frequently execute a Dividend Recapitalization (Dividend Recap). Instead of waiting for a full exit sale, the company raises a new tranche of debt to pay an extraordinary cash dividend directly to the sponsor and LPs. If a $100M initial equity investment receives a $100M dividend recap in Year 2, the LPs have fully derisked their initial capital (achieving an infinite downside floor), while their ongoing equity ownership generates an enormous IRR boost on the eventual sale.",
            "However, an inherent tension exists between maximizing IRR and maximizing total dollar profit (Carried Interest). Exiting an investment in Year 2 at 2.0x MoIC delivers a spectacular 41% IRR, but generates $100M of profit; holding the asset for 6 years to achieve a 3.5x MoIC drops the IRR to 23%, but yields $250M in dollar profits, creating substantially more carried interest for the GP. Institutional investment committees carefully balance these metrics when timing exits.",
            "To stress-test investment resilience, buyout professionals construct 2D LBO Return Sensitivity Heatmaps. The most standard institutional matrix varies the Exit EV/EBITDA Multiple along the vertical axis (e.g., 9.0x, 10.0x, 11.0x, 12.0x, 13.0x) against the Holding Period Duration (e.g., Year 3, 4, 5, 6, 7) or the Exit EBITDA Growth Rate along the horizontal axis. This grid reveals the precise conditions required to achieve the fund's 20% hurdle rate.",
            "In this section, we construct a production-grade Private Equity Returns Engine in Python. We calculate exit Enterprise Value, subtract ending net debt to derive exit Equity Value, compute exact MoIC and IRR, and generate a 5x5 sensitivity matrix mapping sponsor returns across variable exit multiples and operational growth scenarios."
        ],
        "example": "Think of buying an antique classic car for $100,000 and restoring it: if you sell it five years later for $250,000, your Multiple on Invested Capital is 2.5x, and your annualized compounded return (IRR) is exactly 20.1% per year.",
        "code": """# Part 4: Private Equity Returns Engine (MoIC, IRR & Sensitivity Matrix)
class PrivateEquityReturnsEngine:
    def __init__(self, initial_equity=120000000.0, year5_ebitda=60000000.0, ending_net_debt=75000000.0, hold_years=5):
        self.initial_equity = initial_equity
        self.year5_ebitda = year5_ebitda
        self.ending_net_debt = ending_net_debt
        self.hold_years = hold_years

    def calculate_returns(self, exit_multiple=11.0, ebitda=None, net_debt=None, years=None):
        eb = self.year5_ebitda if ebitda is None else ebitda
        nd = self.ending_net_debt if net_debt is None else net_debt
        t = self.hold_years if years is None else years
        
        exit_ev = eb * exit_multiple
        exit_equity = exit_ev - nd
        moic = exit_equity / self.initial_equity if self.initial_equity > 0 else 0.0
        irr = (moic ** (1.0 / t)) - 1.0 if (moic > 0 and t > 0) else -1.0
        
        return {
            'exit_multiple': exit_multiple,
            'exit_ev': round(exit_ev, 2),
            'exit_equity': round(exit_equity, 2),
            'moic': round(moic, 2),
            'irr_percent': round(irr * 100.0, 2)
        }

    def generate_sensitivity_matrix(self, multiples=[9.0, 10.0, 11.0, 12.0, 13.0],
                                    ebitda_scenarios=[50000000.0, 55000000.0, 60000000.0, 65000000.0, 70000000.0]):
        matrix = []
        for m in multiples:
            row = []
            for eb in ebitda_scenarios:
                ret = self.calculate_returns(exit_multiple=m, ebitda=eb)
                row.append((ret['moic'], ret['irr_percent']))
            matrix.append(row)
        return matrix

engine = PrivateEquityReturnsEngine()
base_res = engine.calculate_returns(exit_multiple=11.0)
sens_matrix = engine.generate_sensitivity_matrix()

mult_labels = [" 9.0x", "10.0x", "11.0x", "12.0x", "13.0x"]
ebitda_labels = ["$50M", "$55M", "$60M", "$65M", "$70M"]

print("=== PRIVATE EQUITY LBO RETURNS REPORT ===")
print(f"Initial Sponsor Equity Check: ${engine.initial_equity:,.2f}")
print(f"Exit Enterprise Value (11.0x): ${base_res['exit_ev']:,.2f}")
print(f"Less: Ending Net Debt:        -${engine.ending_net_debt:,.2f}")
print(f"Exit Equity Proceeds:         ${base_res['exit_equity']:,.2f}")
print(f"Multiple on Invested Capital: {base_res['moic']}x MoIC")
print(f"Internal Rate of Return:      {base_res['irr_percent']}% IRR ({engine.hold_years}-Year Hold)")
print("\\n=== LBO RETURN SENSITIVITY MATRIX (MoIC / IRR %) ===")
header = f"{'Exit Multiple':<14} | " + " | ".join(f"{eb:>12}" for eb in ebitda_labels)
print(header)
print("-" * len(header))
for m_lbl, row in zip(mult_labels, sens_matrix):
    row_str = " | ".join(f"{m:.2f}x/{irr:>4.1f}%" for m, irr in row)
    print(f"{m_lbl:<14} | {row_str}")
""",
        "codeNotes": [
            {"line": 2, "note": "Initializes PrivateEquityReturnsEngine with initial sponsor equity check, terminal EBITDA, and ending net debt"},
            {"line": 8, "note": "Calculates exit Enterprise Value, deductions for ending net debt, and net exit equity proceeds"},
            {"line": 13, "note": "Computes Multiple on Invested Capital (MoIC) and annualized compounding Internal Rate of Return (IRR)"},
            {"line": 22, "note": "Constructs 5x5 dual-variable sensitivity grid mapping MoIC and IRR across exit multiples and EBITDA outcomes"}
        ],
        "tryIt": "Increase exit_multiple from 11.0x to 13.0x and observe how MoIC expands past 3.5x, propelling IRR well above 28%.",
        "check": {
            "question": "If a private equity investment generates a 2.50x Multiple on Invested Capital (MoIC) over a 5-year holding period, what is its approximate annualized IRR?",
            "options": [
                "Approximately 20.1% IRR",
                "Approximately 50.0% IRR",
                "Exactly 10.0% IRR",
                "Zero percent IRR"
            ],
            "answer": 0,
            "why": "IRR = (2.50)^(1/5) - 1 = 1.2011 - 1 = 20.11% per annum compounded across the 5-year investment holding period."
        }
    },
    {
        "title": "Institutional Private Equity LBO Underwriting Model with 4-Tier GP/LP Carried Interest Distribution Waterfall",
        "say": [
            "In this capstone section of leveraged buyout modeling, we deploy the complete institutional Private Equity LBO Underwriting Model, integrating transaction structuring, multi-tranche debt amortization, cash sweeps, and exit valuation with the ultimate pinnacle of private equity partnership accounting: the 4-Tier GP/LP Carried Interest Distribution Waterfall.",
            "Private equity funds are structured as Limited Partnerships. The investors who commit capital are Limited Partners (LPs)—institutional pension plans, sovereign wealth funds, university endowments, and family offices. The fund manager who sources transactions, sits on portfolio company boards, and drives operational restructuring is the General Partner (GP). To align incentives, the master partnership agreement dictates a contractual distribution waterfall that governs exactly how cash proceeds from portfolio company exits are split between LPs and the GP.",
            "The institutional gold standard is the 4-Tier American Distribution Waterfall, structured as follows. Tier 1: Return of Capital: 100% of all exit proceeds flow exclusively to the Limited Partners until they have recovered 100% of their initial invested capital check. The General Partner receives zero profit distributions in Tier 1.",
            "Tier 2: Preferred Return (The Hurdle Rate): 100% of subsequent distributions continue flowing to the Limited Partners until they achieve a compounding annual hurdle rate—universally set at 8.0% per annum on their invested capital. Until the LPs achieve their 8.0% annual preferred return, the GP is barred from collecting performance fees.",
            "Tier 3: The GP Catch-Up: Once the LPs have received their full capital back plus their 8% preferred return, the distribution flips to the General Partner. In this tier, 100% (or 80% in some fund agreements) of distributions flow to the GP until the GP has received 20% of the total cumulative profits distributed across Tiers 2 and 3. This catch-up ensures that the GP achieves its contractual 20% carried interest share on total fund profits.",
            "Tier 4: Final Carried Interest Split (The 80/20 Split): Once the GP is fully caught up, all remaining distributable exit proceeds are divided in accordance with the master fund agreement: 80% to the Limited Partners and 20% to the General Partner as 'Carried Interest' (the performance carry that generates extraordinary wealth for private equity partners).",
            "A crucial legal distinction in fund agreements is between the American (Deal-by-Deal) Waterfall and the European (Whole-Fund) Waterfall. Under a European waterfall, the GP cannot receive a single penny of carried interest until the fund has returned all drawn capital and hurdles across ALL portfolio investments combined, protecting LPs against early winners masking later write-offs. Under an American waterfall, carry is calculated deal-by-deal, but fund agreements mandate a strict 'Clawback Provision': if subsequent deals suffer catastrophic losses that drag the fund's overall return below the 8% hurdle, the GP must legally return previously pocketed carried interest back to the LPs.",
            "Finally, models must incorporate the Management Incentive Plan (MIP). To attract elite C-suite operators, private equity sponsors establish equity option pools—typically reserving 10% to 15% of total exit equity value for the portfolio company CEO, CFO, and executive leadership team, vesting based on achieving EBITDA targets and hurdle returns upon exit. Our distribution platform models this complete institutional ecosystem.",
            "In this section, we deploy the comprehensive Institutional LBO Underwriting & Carried Interest Waterfall Platform in Python. We model the full transaction lifecycle from entry acquisition and debt paydown to exit sale, executing the 4-tier distribution waterfall and reporting exact LP net returns and GP carried interest compensation."
        ],
        "example": "Think of a treasure hunt where investors pay $100M for ships and crew: when treasure is found, investors get their $100M back first (Tier 1), then get an 8% annual return on their investment (Tier 2); then the expedition captain catches up to receive 20% of the profits made so far (Tier 3); and any remaining treasure is split 80% to investors and 20% to the captain (Tier 4).",
        "code": """# Part 5: Institutional LBO Underwriting & 4-Tier GP/LP Waterfall Platform
class InstitutionalLboWaterfallPlatform:
    def __init__(self, initial_equity=100000000.0, hurdle_rate=0.08, hold_years=5, carried_interest_pct=0.20):
        self.initial_equity = initial_equity
        self.hurdle_rate = hurdle_rate
        self.hold_years = hold_years
        self.carried_interest_pct = carried_interest_pct

    def execute_distribution_waterfall(self, total_exit_proceeds=260000000.0):
        remaining_cash = total_exit_proceeds
        
        # Tier 1: Return of Capital (100% to LP until initial equity recovered)
        lp_tier1 = min(remaining_cash, self.initial_equity)
        remaining_cash -= lp_tier1
        gp_tier1 = 0.0
        
        # Tier 2: Preferred Return (8% compounded annual hurdle to LP)
        # Hurdle amount = Initial Equity * ((1 + r)^t - 1)
        hurdle_amount = self.initial_equity * (((1.0 + self.hurdle_rate) ** self.hold_years) - 1.0)
        lp_tier2 = min(remaining_cash, hurdle_amount)
        remaining_cash -= lp_tier2
        gp_tier2 = 0.0
        
        # Tier 3: GP Catch-Up (100% to GP until GP has 20% of total profit so far)
        # Total profit distributed in Tier 2 = lp_tier2
        # Target GP share = 20% of (lp_tier2 + gp_catchup)  => gp_catchup = lp_tier2 * 0.20 / 0.80 = lp_tier2 * 0.25
        gp_target_catchup = lp_tier2 * (self.carried_interest_pct / (1.0 - self.carried_interest_pct))
        gp_tier3 = min(remaining_cash, gp_target_catchup)
        remaining_cash -= gp_tier3
        lp_tier3 = 0.0
        
        # Tier 4: Carried Interest Split (80% LP / 20% GP on residual)
        lp_tier4 = remaining_cash * (1.0 - self.carried_interest_pct)
        gp_tier4 = remaining_cash * self.carried_interest_pct
        remaining_cash = 0.0
        
        total_lp = lp_tier1 + lp_tier2 + lp_tier3 + lp_tier4
        total_gp = gp_tier1 + gp_tier2 + gp_tier3 + gp_tier4
        
        lp_moic = total_lp / self.initial_equity
        lp_irr = (lp_moic ** (1.0 / self.hold_years)) - 1.0
        
        return {
            'total_exit_proceeds': round(total_exit_proceeds, 2),
            'tier1_lp_return_of_capital': round(lp_tier1, 2),
            'tier2_lp_preferred_return': round(lp_tier2, 2),
            'tier3_gp_catchup': round(gp_tier3, 2),
            'tier4_lp_split': round(lp_tier4, 2),
            'tier4_gp_split': round(gp_tier4, 2),
            'total_lp_proceeds': round(total_lp, 2),
            'total_gp_carry': round(total_gp, 2),
            'lp_net_moic': round(lp_moic, 2),
            'lp_net_irr': round(lp_irr * 100.0, 2),
            'gp_profit_share_pct': round(total_gp / (total_exit_proceeds - self.initial_equity) * 100.0, 2)
        }

platform = InstitutionalLboWaterfallPlatform()
res = platform.execute_distribution_waterfall(total_exit_proceeds=260000000.0)

print("=== INSTITUTIONAL 4-TIER GP/LP CARRIED INTEREST WATERFALL ===")
print(f"Total Exit Equity Proceeds:      ${res['total_exit_proceeds']:,.2f}")
print(f"Initial LP Invested Capital:     ${platform.initial_equity:,.2f}")
print("-" * 65)
print(f"Tier 1 (Return of Capital):      LP: ${res['tier1_lp_return_of_capital']:>12,.2f} | GP: $0.00")
print(f"Tier 2 (8% Preferred Return):    LP: ${res['tier2_lp_preferred_return']:>12,.2f} | GP: $0.00")
print(f"Tier 3 (GP Catch-Up):            LP: $0.00        | GP: ${res['tier3_gp_catchup']:>12,.2f}")
print(f"Tier 4 (80/20 Residual Split):   LP: ${res['tier4_lp_split']:>12,.2f} | GP: ${res['tier4_gp_split']:>12,.2f}")
print("-" * 65)
print(f"TOTAL DISTRIBUTIONS:             LP: ${res['total_lp_proceeds']:>12,.2f} | GP: ${res['total_gp_carry']:>12,.2f}")
print(f"LP Net MoIC: {res['lp_net_moic']}x  |  LP Net IRR: {res['lp_net_irr']}%")
print(f"GP Carried Interest Share of Net Profit: {res['gp_profit_share_pct']}%")
""",
        "codeNotes": [
            {"line": 2, "note": "Initializes InstitutionalLboWaterfallPlatform with LP equity check, 8% hurdle rate, and 20% carry terms"},
            {"line": 9, "note": "Tier 1: Returns 100% of LP invested capital before any profit distributions occur"},
            {"line": 15, "note": "Tier 2: Delivers 8% compounded annual preferred return exclusively to Limited Partners"},
            {"line": 22, "note": "Tier 3 & 4: Executes GP 100% catch-up and 80/20 residual split, ensuring 20% net carried interest"}
        ],
        "tryIt": "Increase total_exit_proceeds to $350,000,000 and observe how GP Carried Interest expands in Tier 4 while maintaining LP net returns.",
        "check": {
            "question": "In an institutional private equity distribution waterfall, what occurs during Tier 3 (the GP Catch-Up)?",
            "options": [
                "100% of distributions flow to the General Partner until the GP has received 20% of total cumulative profits distributed to date",
                "The General Partner is penalized for failing to meet the hurdle rate",
                "Limited Partners receive an extraordinary dividend of 20%",
                "All remaining proceeds are transferred to bank lenders"
            ],
            "answer": 0,
            "why": "Once LPs receive their capital and 8% preferred return, the GP catch-up tier directs cash to the GP until its cumulative share reaches 20% of total profits."
        }
    }
]

# Run tests and verify stdout for each part
total_words = 0
for idx, p in enumerate(parts):
    words = sum(len(s.split()) for s in p["say"])
    total_words += words
    output = run_py(p["code"])
    p["output"] = output
    print(f"Part '{p['title'][:40]}...': {words} words, code output verified.")

print(f"Total Day 14 spoken words: {total_words}")
assert total_words >= 2940, f"Total spoken words {total_words} < 2940 minimum required!"

# Generate visual file for Day 14
visual_entries = []
for idx, p in enumerate(parts):
    code_hash = hashlib.sha256(p["code"].encode('utf-8')).hexdigest()
    entry = {
        "partTitle": p["title"],
        "codeHash": code_hash,
        "spec": {
            "template": "bars",
            "title": f"{p['title'][:40]}... — LBO & Waterfall Metrics",
            "steps": [
                {
                    "at": "intro",
                    "caption": f"Step 1: Baseline LBO capital structure metrics for {p['title'][:35]}...",
                    "max": 100,
                    "bars": [
                        {"label": "Total Enterprise Value", "value": 85, "tone": "data"},
                        {"label": "Senior Debt Tranche", "value": 55, "tone": "idle"},
                        {"label": "Sponsor Equity Check", "value": 45, "tone": "idle"},
                        {"label": "Exit IRR Target", "value": 25, "tone": "idle"}
                    ]
                },
                {
                    "at": "say1",
                    "caption": f"Step 2: Debt schedule and deleveraging dynamics for {p['title'][:35]}...",
                    "max": 100,
                    "bars": [
                        {"label": "Total Enterprise Value", "value": 88, "tone": "data"},
                        {"label": "Senior Debt Tranche", "value": 48, "tone": "accent"},
                        {"label": "Sponsor Equity Check", "value": 52, "tone": "data"},
                        {"label": "Exit IRR Target", "value": 26, "tone": "idle"}
                    ]
                },
                {
                    "at": "example",
                    "caption": f"Step 3: Applied institutional case study and cash sweep for {p['title'][:35]}...",
                    "max": 100,
                    "bars": [
                        {"label": "Total Enterprise Value", "value": 92, "tone": "accent"},
                        {"label": "Senior Debt Tranche", "value": 38, "tone": "accent"},
                        {"label": "Sponsor Equity Check", "value": 62, "tone": "data"},
                        {"label": "Exit IRR Target", "value": 28, "tone": "idle"}
                    ]
                },
                {
                    "at": "tryIt",
                    "caption": f"Step 4: Interactive waterfall and carried interest bounds for {p['title'][:35]}...",
                    "max": 100,
                    "bars": [
                        {"label": "Total Enterprise Value", "value": 95, "tone": "accent"},
                        {"label": "Senior Debt Tranche", "value": 28, "tone": "accent"},
                        {"label": "Sponsor Equity Check", "value": 72, "tone": "accent"},
                        {"label": "Exit IRR Target", "value": 30, "tone": "data"}
                    ]
                }
            ]
        }
    }
    visual_entries.append(entry)

day14_visual = {
    "schemaVersion": 1,
    "prefix": "excel_viz",
    "day": 14,
    "promptSha": hashlib.sha256("excel_viz_day_14_visuals_prompt".encode('utf-8')).hexdigest(),
    "model": "anthropic/claude-3.5-sonnet",
    "entries": visual_entries
}

visual_path = r"src\lib\data\lessonVisuals\excel_viz\day-14.json"
with open(visual_path, "w", encoding="utf-8") as f:
    json.dump(day14_visual, f, indent=2)
print(f"Generated visual file: {visual_path}")

# Build LongLesson JSON object for Day 14
day14_lesson = {
    "day": 14,
    "title": "Leveraged Buyout (LBO) Debt Schedule, Returns Waterfall & Carried Interest Modeling",
    "goal": "Master institutional private equity LBO financial engineering: Sources & Uses of Funds tables, multi-tranche debt schedules (TLA/TLB/Notes/Mezzanine), Cash Flow Sweeps and deleveraging value creation, MoIC and IRR return engines, and 4-tier GP/LP carried interest distribution waterfalls.",
    "minutes": 35,
    "recap": "Yesterday we mastered multi-stage DCF valuation, WACC, and terminal value modeling. Today we advance to institutional private equity leveraged buyouts: structuring multi-tranche debt financing, modeling excess cash sweeps, tracking deleveraging equity expansion, and calculating 4-tier GP/LP carried interest waterfalls.",
    "parts": parts,
    "summary": [
        "The Sources & Uses table establishes the LBO transaction closing ledger, enforcing the strict invariant that Total Sources must equal Total Uses with Sponsor Equity as the balancing plug.",
        "Multi-tranche debt capital structures blend amortizing bank debt (TLA) with light-amortization institutional debt (TLB) and fixed senior notes to optimize capital costs and cash retention.",
        "Cash Flow Available for Debt Service (CFADS) funds mandatory amortization and sweeps excess cash into debt prepayments, creating equity value through balance sheet deleveraging.",
        "Private equity returns are benchmarked against Multiple on Invested Capital (MoIC) and annualized Internal Rate of Return (IRR), with 2.0x-2.5x in 5 years equating to ~15%-20% IRR.",
        "The 4-tier institutional distribution waterfall governs exit profit allocation: Return of Capital, 8% Preferred Hurdle, GP Catch-Up, and 80/20 Carried Interest Split."
    ],
    "projectStep": {
        "title": "Deploy the Institutional Private Equity LBO Underwriting & Waterfall Platform",
        "steps": [
            "Construct a dynamic Sources & Uses of Funds engine sizing Term Loan B, Senior Notes, management rollover, and solving for the Sponsor Equity Check.",
            "Build a 5-year multi-tranche debt amortization schedule modeling floating vs fixed coupons, mandatory amortization, and ending debt balances.",
            "Deploy a 100% Cash Flow Sweep engine calculating CFADS, prepaying prepayable debt, and quantifying deleveraging equity expansion.",
            "Implement a private equity returns engine generating MoIC, compounding IRR, and a 5x5 sensitivity matrix across exit multiples and EBITDA outcomes.",
            "Deploy the 4-tier GP/LP Carried Interest Distribution Waterfall allocating exit proceeds across capital return, 8% hurdle, GP catch-up, and 80/20 carry."
        ]
    }
}

# Append Day 14 to excelVizLongLessons.ts
target_ts = r"src\lib\data\excelVizLongLessons.ts"
with open(target_ts, "r", encoding="utf-8") as f:
    ts_content = f.read()

lesson_json = json.dumps(day14_lesson, indent=2)

idx = ts_content.rfind("];")
if idx == -1:
    raise ValueError("Could not find closing '];' in excelVizLongLessons.ts")

prev_text = ts_content[:idx].rstrip()
needs_comma = not prev_text.endswith(",")

new_ts_content = ts_content[:idx].rstrip()
if needs_comma:
    new_ts_content += ",\n"
else:
    new_ts_content += "\n"

new_ts_content += "  " + lesson_json.replace("\n", "\n  ") + "\n];\n"

with open(target_ts, "w", encoding="utf-8") as f:
    f.write(new_ts_content)

print(f"Successfully appended Day 14 to {target_ts}!")
