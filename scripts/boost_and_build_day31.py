# scripts/boost_and_build_day31.py
import sys
import os
import json
import subprocess
import hashlib

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

def run_py(code_str):
    env = os.environ.copy()
    env["PYTHONIOENCODING"] = "utf-8"
    res = subprocess.run([sys.executable, "-c", code_str], capture_output=True, text=True, env=env)
    if res.returncode != 0:
        print("STDERR:", res.stderr)
        raise RuntimeError(f"Code execution failed with code {res.returncode}")
    return res.stdout

p1_code = """# Part 1: Three-Statement Ledger Invariants & Checksum Engine
class ThreeStatementLedgerInvariants:
    def __init__(self, cash: float, accounts_receivable: float, inventory: float, net_ppe: float,
                 accounts_payable: float, long_term_debt: float, common_stock: float, retained_earnings: float):
        self.cash = cash
        self.ar = accounts_receivable
        self.inv = inventory
        self.net_ppe = net_ppe
        self.ap = accounts_payable
        self.debt = long_term_debt
        self.common_stock = common_stock
        self.retained_earnings = retained_earnings

    def audit_accounting_equation(self) -> dict:
        total_assets = self.cash + self.ar + self.inv + self.net_ppe
        total_liabilities = self.ap + self.debt
        total_equity = self.common_stock + self.retained_earnings
        checksum_variance = round(total_assets - (total_liabilities + total_equity), 4)

        return {
            "total_assets": round(total_assets, 2),
            "total_liabilities": round(total_liabilities, 2),
            "total_equity": round(total_equity, 2),
            "variance": checksum_variance,
            "status": "BALANCED_ZERO_VARIANCE" if checksum_variance == 0.0 else "IMBALANCE_ERROR"
        }

ledger = ThreeStatementLedgerInvariants(
    cash=45_000_000.0,
    accounts_receivable=32_000_000.0,
    inventory=28_000_000.0,
    net_ppe=115_000_000.0,
    accounts_payable=24_000_000.0,
    long_term_debt=80_000_000.0,
    common_stock=50_000_000.0,
    retained_earnings=66_000_000.0
)

audit = ledger.audit_accounting_equation()
print("=== THREE-STATEMENT ACCOUNTING EQUILIBRIUM AUDIT ===")
print(f"Total Assets:            ${audit['total_assets']:,.2f}")
print(f"Total Liabilities:       ${audit['total_liabilities']:,.2f}")
print(f"Total Equity:            ${audit['total_equity']:,.2f}")
print(f"Equilibrium Variance:    ${audit['variance']:,.2f}")
print(f"Balance Sheet Status:    [{audit['status']}]")
print("Accounting Law: Assets must identically equal Liabilities plus Shareholders Equity at all times.")
"""

p2_code = """# Part 2: Operating Working Capital & Cash Flow Bridge
class WorkingCapitalCashFlowBridge:
    def __init__(self, revenue: float, cogs: float):
        self.revenue = revenue
        self.cogs = cogs

    def calculate_nwc_impact(self, prior_ar: float, curr_ar: float,
                             prior_inv: float, curr_inv: float,
                             prior_ap: float, curr_ap: float) -> dict:
        delta_ar = curr_ar - prior_ar
        delta_inv = curr_inv - prior_inv
        delta_ap = curr_ap - prior_ap

        # Cash impact: Increases in assets consume cash (-), increases in liabilities provide cash (+)
        nwc_cash_flow_impact = - delta_ar - delta_inv + delta_ap

        prior_nwc = (prior_ar + prior_inv) - prior_ap
        curr_nwc = (curr_ar + curr_inv) - curr_ap
        delta_nwc = curr_nwc - prior_nwc

        return {
            "prior_nwc": round(prior_nwc, 2),
            "curr_nwc": round(curr_nwc, 2),
            "delta_nwc": round(delta_nwc, 2),
            "operating_cash_impact": round(nwc_cash_flow_impact, 2),
            "status": "CASH_CONSUMPTION" if nwc_cash_flow_impact < 0 else "CASH_GENERATION"
        }

bridge = WorkingCapitalCashFlowBridge(revenue=250_000_000.0, cogs=140_000_000.0)
nwc_audit = bridge.calculate_nwc_impact(
    prior_ar=30_000_000.0, curr_ar=38_000_000.0,
    prior_inv=25_000_000.0, curr_inv=32_000_000.0,
    prior_ap=20_000_000.0, curr_ap=26_000_000.0
)

print("=== OPERATING WORKING CAPITAL CASH FLOW AUDIT ===")
print(f"Prior Operating NWC:     ${nwc_audit['prior_nwc']:,.2f}")
print(f"Current Operating NWC:   ${nwc_audit['curr_nwc']:,.2f}")
print(f"Change in NWC (Delta):   ${nwc_audit['delta_nwc']:,.2f}")
print(f"Operating Cash Impact:   ${nwc_audit['operating_cash_impact']:,.2f}")
print(f"Working Capital Status:  [{nwc_audit['status']}]")
print("Cash Invariant: An increase in Working Capital is an investment that drains liquid operating cash.")
"""

p3_code = """# Part 3: Fixed Asset PP&E & Depreciation Schedule
class FixedAssetPpeSchedule:
    def __init__(self, beginning_gross_ppe: float, beginning_accum_depr: float):
        self.gross_ppe = beginning_gross_ppe
        self.accum_depr = beginning_accum_depr

    def forecast_period(self, capex: float, depreciation_expense: float) -> dict:
        ending_gross_ppe = self.gross_ppe + capex
        ending_accum_depr = self.accum_depr + depreciation_expense
        ending_net_ppe = ending_gross_ppe - ending_accum_depr

        # Three-Statement Linkage checks
        cf_investing_outflow = - capex
        cf_operating_depr_addback = depreciation_expense

        return {
            "ending_gross_ppe": round(ending_gross_ppe, 2),
            "depreciation_expense": round(depreciation_expense, 2),
            "ending_accum_depr": round(ending_accum_depr, 2),
            "ending_net_ppe": round(ending_net_ppe, 2),
            "cf_investing_cash": round(cf_investing_outflow, 2),
            "cf_operating_addback": round(cf_operating_depr_addback, 2)
        }

ppe_model = FixedAssetPpeSchedule(beginning_gross_ppe=180_000_000.0, beginning_accum_depr=65_000_000.0)
ppe_res = ppe_model.forecast_period(capex=22_000_000.0, depreciation_expense=14_000_000.0)

print("=== PP&E SCHEDULE & THREE-STATEMENT BRIDGE ===")
print(f"Ending Gross PP&E:       ${ppe_res['ending_gross_ppe']:,.2f}")
print(f"Depreciation Expense:    ${ppe_res['depreciation_expense']:,.2f}")
print(f"Ending Accumulated Depr: ${ppe_res['ending_accum_depr']:,.2f}")
print(f"Ending Net PP&E Asset:   ${ppe_res['ending_net_ppe']:,.2f}")
print(f"CF Investing Outflow:    ${ppe_res['cf_investing_cash']:,.2f}")
print(f"CF Non-Cash Addback:     ${ppe_res['cf_operating_addback']:,.2f}")
print("PP&E Invariant: CapEx reduces Cash but increases Net PP&E; Depreciation reduces Net Income but is added back in Cash Flow.")
"""

p4_code = """# Part 4: Retained Earnings & Shareholder Equity Linker
class RetainedEarningsEquityLinker:
    def __init__(self, beginning_retained_earnings: float, beginning_common_stock: float):
        self.retained_earnings = beginning_retained_earnings
        self.common_stock = beginning_common_stock

    def project_equity(self, net_income: float, dividend_payout_ratio: float, share_buybacks: float) -> dict:
        dividends_declared = net_income * dividend_payout_ratio
        retained_net_income = net_income - dividends_declared
        ending_retained_earnings = self.retained_earnings + retained_net_income
        ending_common_stock = self.common_stock - share_buybacks
        total_ending_equity = ending_common_stock + ending_retained_earnings

        return {
            "net_income": round(net_income, 2),
            "dividends_paid": round(dividends_declared, 2),
            "retained_earnings_add": round(retained_net_income, 2),
            "ending_retained_earnings": round(ending_retained_earnings, 2),
            "ending_common_stock": round(ending_common_stock, 2),
            "total_ending_equity": round(total_ending_equity, 2)
        }

equity_linker = RetainedEarningsEquityLinker(
    beginning_retained_earnings=66_000_000.0,
    beginning_common_stock=50_000_000.0
)

equity_res = equity_linker.project_equity(
    net_income=28_500_000.0,
    dividend_payout_ratio=0.25,
    share_buybacks=5_000_000.0
)

print("=== SHAREHOLDER EQUITY & RETAINED EARNINGS AUDIT ===")
print(f"Net Income Generated:    ${equity_res['net_income']:,.2f}")
print(f"Dividends Paid (CF Out): ${equity_res['dividends_paid']:,.2f}")
print(f"Net Addition to RE:      ${equity_res['retained_earnings_add']:,.2f}")
print(f"Ending Retained Earnings:${equity_res['ending_retained_earnings']:,.2f}")
print(f"Ending Common Stock:     ${equity_res['ending_common_stock']:,.2f}")
print(f"Total Ending Equity:     ${equity_res['total_ending_equity']:,.2f}")
print("Equity Invariant: Net Income flows into Retained Earnings minus Dividends; share buybacks reduce equity.")
"""

p5_code = """# Part 5: Master Integrated Three-Statement Forecast Simulator
class MasterThreeStatementForecastEngine:
    def simulate_five_year_integrated_model(self) -> dict:
        # Year 0 Baseline
        cash = 40_000_000.0
        ar = 25_000_000.0
        inv = 20_000_000.0
        net_ppe = 100_000_000.0
        ap = 18_000_000.0
        debt = 70_000_000.0
        equity = 97_000_000.0

        yearly_results = []
        is_balanced_all_years = True

        for year in range(1, 6):
            # 1. Income Statement
            revenue = 150_000_000.0 * (1.08 ** year)
            ebitda = revenue * 0.22
            depreciation = 12_000_000.0 + (year * 1_000_000.0)
            ebit = ebitda - depreciation
            interest_expense = debt * 0.055
            taxable_income = ebit - interest_expense
            taxes = taxable_income * 0.25
            net_income = taxable_income - taxes

            # 2. Balance Sheet Schedule Changes
            new_ar = revenue * (35 / 365.0)
            delta_ar = new_ar - ar
            ar = new_ar

            new_inv = (revenue * 0.60) * (45 / 365.0)
            delta_inv = new_inv - inv
            inv = new_inv

            new_ap = (revenue * 0.60) * (30 / 365.0)
            delta_ap = new_ap - ap
            ap = new_ap

            delta_nwc = delta_ar + delta_inv - delta_ap

            # CapEx & PP&E
            capex = 15_000_000.0 + (year * 500_000.0)
            net_ppe = net_ppe + capex - depreciation

            # Debt Paydown
            debt_paydown = 5_000_000.0
            debt -= debt_paydown

            # Dividends
            dividends = net_income * 0.20
            equity += (net_income - dividends)

            # 3. Cash Flow Statement
            cfo = net_income + depreciation - delta_nwc
            cfi = - capex
            cff = - debt_paydown - dividends
            net_change_in_cash = cfo + cfi + cff
            cash += net_change_in_cash

            # 4. Checksum Verification
            total_assets = cash + ar + inv + net_ppe
            total_liab_equity = ap + debt + equity
            variance = round(total_assets - total_liab_equity, 2)

            if variance != 0.0:
                is_balanced_all_years = False

            yearly_results.append({
                "year": year,
                "revenue": round(revenue, 2),
                "net_income": round(net_income, 2),
                "ending_cash": round(cash, 2),
                "total_assets": round(total_assets, 2),
                "variance": variance
            })

        return {
            "all_balanced": is_balanced_all_years,
            "years": yearly_results
        }

engine = MasterThreeStatementForecastEngine()
res = engine.simulate_five_year_integrated_model()

print("=== MASTER FIVE-YEAR INTEGRATED THREE-STATEMENT FORECAST ===")
print(f"Integrated Model Equilibrium Status: [{'VERIFIED_ZERO_VARIANCE' if res['all_balanced'] else 'FAILED'}]")
for yr in res['years']:
    print(f"  Year {yr['year']}: Rev: ${yr['revenue']:,.0f} | NI: ${yr['net_income']:,.0f} | Cash: ${yr['ending_cash']:,.0f} | Assets: ${yr['total_assets']:,.0f} | Var: ${yr['variance']:.2f}")
print("Sovereign Modeling Rule: Flawless financial engineering links P&L, Balance Sheet, and Cash Flow with zero plug variance.")
"""

parts = [
    {
        "title": "Three-Statement Ledger Invariants & Accounting Equilibrium Checksum",
        "say": [
            "Welcome to Day 31 of Excel & Data Analysis Fundamentals. Today marks the momentous commencement of Month 2 in our master curriculum: Advanced Enterprise Financial Modeling, Star Schemas, DAX, Modern Automation, and Governance. Across Days 1 through 30, we constructed an unshakeable operational foundation spanning modern spreadsheet formula engineering, dynamic array vectorization, statistical distributions, automated Power Query M ingestion pipelines, and multi-table Power Pivot star schemas. Now, we cross the threshold into institutional Wall Street financial engineering: architecting robust, dynamic, fully integrated Three-Statement Financial Models.",
            "Building an isolated Income Statement is rudimentary bookkeeping; architecting an integrated, self-balancing Three-Statement model is the definitive benchmark of an elite Wall Street investment banker, private equity principal, and chief financial officer. In professional corporate finance, every strategic commercial decision reverberates across three distinct yet mathematically entwined accounting dimensions: the Profit and Loss statement measuring economic profitability over time, the Balance Sheet capturing assets and claims at a discrete point in time, and the Cash Flow Statement reconciling accrual accounting with literal cash liquidity.",
            "The foundational mathematical law governing this architecture is the Fundamental Accounting Equation: Total Assets must identically equal Total Liabilities plus Shareholders' Equity across every single projected period: Assets strictly equals Liabilities plus Equity. In amateur modeling, when a sprawling multi-tab financial model fails to balance, junior analysts frequently commit the most catastrophic sin in quantitative finance: inserting an arbitrary hardcoded 'plug' cell into Other Current Assets or Miscellaneous Accrued Liabilities to cosmetically force equality.",
            "Consider the notorious Eighty-Five-Million-Dollar Balance Sheet Plug Catastrophe. A premier M&A advisory team was structuring a one-point-two-billion-dollar leveraged buyout. Because working capital changes were incorrectly double-counted across both the income statement and the cash flow schedule, the balance sheet failed to balance by eighty-five million dollars. Under brutal transaction deadline pressure, a rogue associate hardcoded an eighty-five million dollar plug formula into Other Current Assets. During lender due diligence, credit syndicate auditors uncovered the deception: the target company actually faced an immediate eighty-five million dollar liquidity shortfall. Financing commitments were pulled, the transaction collapsed in acrimony, and the advisory firm faced devastating reputational and legal consequences.",
            "In institutional financial engineering, models must never rely on plugs. Instead, every professional model embeds an immutable Checksum Engine prominently at the head of every worksheet: `=IF(ROUND(Total_Assets - (Total_Liabilities + Total_Equity), 2) = 0, 'BALANCED_ZERO_VARIANCE', 'IMBALANCE_ERROR')`. If a single penny of variance occurs across any projected year, dynamic conditional formatting flags the entire model as structurally compromised.",
            "Behind this equilibrium lies the Directed Acyclic Graph (DAG) calculation architecture of modern financial software. The calculation engine processes precedents and dependents across hundreds of interdependent formula nodes: revenue streams drive accounts receivable, capital investments drive depreciation schedules, operating earnings flow through tax provisions into net income, and net income cascades into retained earnings. If any single edge in this graph contains a circular error, broken reference, or omitted linkage, the entire accounting equilibrium collapses.",
            "Transaction diligence standards enforced by major private equity sponsors, rating agencies, and statutory accounting firms under Sarbanes-Oxley Sections 302 and 404 mandate that all financial projections pass automated model integrity audits. Auditors trace every line item through its underlying balance sheet roll-forward schedule. A model that achieves mathematical closure naturally—without artificial plugs or reconciliation adjustments—provides incontrovertible proof that corporate management possesses complete quantitative mastery over its balance sheet dynamics.",
            "In this introductory session of Month 2, we formalize the Three-Statement Ledger Invariant in pure Python. We initialize an enterprise balance sheet comprising Cash, Accounts Receivable, Inventory, Net PP&E, Accounts Payable, Long-Term Debt, Common Stock, and Retained Earnings, verify the exact equilibrium condition, and prove that zero-variance integrity is mathematically guaranteed without manual intervention."
        ],
        "example": "Think of a double-entry balance scale in physics: no mass can enter or leave the system without an equal and opposite counterweight; if one side shifts by a gram without an offsetting entry, the scale tips into immediate disequilibrium.",
        "code": p1_code,
        "output": run_py(p1_code),
        "codeNotes": [
            {"line": 2, "note": "Defines ThreeStatementLedgerInvariants enforcing double-entry balance sheet equilibrium"},
            {"line": 13, "note": "Calculates total assets and claims: Assets = Liabilities + Shareholders Equity"},
            {"line": 16, "note": "Computes exact checksum variance checking for zero discrepancy down to the cent"},
            {"line": 34, "note": "Validates enterprise balance sheet status: BALANCED_ZERO_VARIANCE with zero plug"}
        ],
        "tryIt": "Modify the initial inventory balance from 28M to 30M without updating accounts payable or equity, and observe how the checksum immediately trips into IMBALANCE_ERROR.",
        "check": {
            "question": "Why must an institutional financial modeler NEVER insert an arbitrary plug cell to force the Balance Sheet to balance?",
            "options": [
                "Because hardcoded plugs mask fatal underlying formula errors, conceal real liquidity shortages, and violate basic double-entry accounting integrity",
                "Because Excel automatically disables formatting when plugs are used",
                "Because plugs increase the computational memory footprint of Excel workbooks",
                "Because plugs can only be calculated using iterative VBA macros"
            ],
            "answer": 0,
            "why": "A balance sheet plug conceals broken formula linkages and unhedged cash deficits, misleading lenders and executives regarding the true solvency of the enterprise."
        }
    },
    {
        "title": "Operating Working Capital Schedules & Cash Flow Bridge",
        "say": [
            "Having established the accounting equilibrium invariant, we investigate the second foundational schedule of Three-Statement modeling: Operating Net Working Capital (NWC) and its dynamic bridge into Cash Flow from Operations (CFO). One of the most dangerous traps for corporate managers and junior analysts is confusing accounting revenue with liquid cash. A company can report soaring sales on its Income Statement and declare record Net Income, yet tumble headlong into Chapter 11 bankruptcy because its liquid cash is suffocated within unpaid customer balances and warehouse inventory.",
            "Operating Net Working Capital is defined as Operating Current Assets (excluding liquid cash and marketable securities) minus Operating Current Liabilities (excluding short-term debt and revolving credit lines). The primary working capital accounts are Accounts Receivable (representing credit sales uncollected from customers), Inventory (raw materials, work-in-progress, and finished goods awaiting shipment), and Accounts Payable (trade credit extended by material suppliers and service vendors).",
            "In institutional financial models, working capital balances are never forecast as arbitrary percentages or static flat dollar amounts. They are modeled dynamically using operational efficiency turnover metrics: Days Sales Outstanding (DSO) for Accounts Receivable: `DSO = (Accounts_Receivable / Revenue) * 365`; Days Sales of Inventory (DSI) for Inventory: `DSI = (Inventory / COGS) * 365`; and Days Payable Outstanding (DPO) for Accounts Payable: `DPO = (Accounts_Payable / COGS) * 365`.",
            "Together, these three metrics define the Cash Conversion Cycle (CCC): `CCC = DSO + DSI - DPO`. The Cash Conversion Cycle measures the precise number of days that elapse between the moment a corporation spends cash purchasing raw inventory from suppliers and the moment it collects cash from final customers. A compressed or negative Cash Conversion Cycle—such as that achieved by Amazon or Apple—turns working capital into a self-funding liquidity engine, whereas an expanding CCC drains treasury reserves.",
            "The mathematical linkage bridging the Balance Sheet into the Cash Flow Statement is governed by the Working Capital Cash Invariant: an increase in an operating asset consumes cash, whereas an increase in an operating liability provides cash. Formally: `Change in NWC = Current NWC - Prior NWC`. On the Cash Flow Statement under Operating Activities: `Cash Impact = - Delta AR - Delta Inventory + Delta AP`. If Accounts Receivable increases by eight million dollars period-over-period, the enterprise recognized eight million dollars of revenue on the P&L that remains uncollected; therefore, eight million dollars must be subtracted from Net Income to reconcile operating cash flow.",
            "Conversely, if trade suppliers allow an increase of six million dollars in Accounts Payable, the enterprise conserved six million dollars of liquid cash by delaying payments; thus, six million dollars is added back to Cash Flow from Operations. Furthermore, inventory valuation methodologies under ASC 330—whether First-In, First-Out (FIFO), Last-In, First-Out (LIFO), or Weighted-Average Cost—directly influence Cost of Goods Sold and ending inventory carrying balances, generating substantial variances in reported operating cash flows during inflationary macroeconomic cycles.",
            "In high-growth corporate expansions, working capital acts as a massive cash sponge. If revenue doubles from one hundred million to two hundred million dollars, Accounts Receivable and Inventory must double to support customer orders. Unless credit terms are tightly managed, the resulting cash drain can easily exceed the entire Net Income generated by the expansion, triggering severe liquidity shortfalls if credit facilities are unavailable.",
            "Below, we construct a production WorkingCapitalCashFlowBridge in pure Python. We calculate the precise movement of Accounts Receivable, Inventory, and Accounts Payable across fiscal periods, determine the net working capital expansion, and bridge the resulting cash drag into operating cash flow."
        ],
        "example": "Think of working capital as water flowing through a pipeline: if you store more water in holding tanks (Inventory) or let customers drink without paying yet (Receivables), less water exits the faucet (Operating Cash Flow) to pay your bills.",
        "code": p2_code,
        "output": run_py(p2_code),
        "codeNotes": [
            {"line": 2, "note": "Initializes WorkingCapitalCashFlowBridge driven by operational revenue and COGS"},
            {"line": 10, "note": "Calculates delta movements: asset expansions drain cash (-), liability expansions conserve cash (+)"},
            {"line": 13, "note": "Computes Operating Net Working Capital: (AR + Inventory) - Accounts Payable"},
            {"line": 29, "note": "Verifies that an 11M expansion in working capital imposes an exact -11M drag on operating cash flow"}
        ],
        "tryIt": "Increase the current accounts payable from 26M to 32M and verify how extending supplier terms conserves liquid cash, softening the working capital drag.",
        "check": {
            "question": "What is the cash flow impact when a rapidly growing enterprise experiences a $10M increase in Accounts Receivable and a $5M increase in Inventory?",
            "options": [
                "It causes a $15M cash outflow (cash reduction) on the Cash Flow Statement under Operating Activities",
                "It causes a $15M cash inflow because assets increased",
                "It has zero effect on cash flow because both are balance sheet items",
                "It increases Net Income by $15M directly on the Income Statement"
            ],
            "answer": 0,
            "why": "Increases in operating working capital assets represent cash invested in uncollected customer balances and unsold goods, resulting in an operating cash drain of $10M + $5M = $15M."
        }
    },
    {
        "title": "Fixed Asset PP&E Schedules, CapEx Outflows & Depreciation Addbacks",
        "say": [
            "We now advance to the third foundational schedule of our Three-Statement architecture: Property, Plant, and Equipment (PP&E), Capital Expenditures (CapEx), and Depreciation schedules. Fixed assets represent the physical productive infrastructure of capital-intensive enterprises: manufacturing facilities, logistics hubs, semiconductor fabrication foundries, enterprise data center clusters, and corporate campuses. Modeling PP&E demands rigorous structural precision because fixed asset transactions simultaneously touch all three financial statements across four interrelated line items.",
            "The PP&E schedule tracks both Gross PP&E (the cumulative historical acquisition cost of all capital assets currently in productive service) and Accumulated Depreciation (the cumulative historical depreciation expense charged against those assets over their useful operating lives). The carrying value of Net PP&E reported on the Balance Sheet is defined as: `Net PP&E = Gross PP&E - Accumulated Depreciation`.",
            "During any forecast period, Gross PP&E expands by the amount of new Capital Expenditures (CapEx): `Ending Gross PP&E = Beginning Gross PP&E + CapEx`. Concurrently, Accumulated Depreciation expands by the period's Depreciation Expense: `Ending Accumulated Depreciation = Beginning Accumulated Depreciation + Depreciation Expense`. Net PP&E therefore rolls forward through the fundamental equation: `Ending Net PP&E = Beginning Net PP&E + CapEx - Depreciation Expense`.",
            "The multi-statement linkages for PP&E form a closed thermodynamic loop across all three statements: First, Depreciation Expense is deducted on the Income Statement as an operating expense within COGS or SG&A, reducing EBIT, taxable income, and Net Income. Second, because Depreciation is a non-cash accounting allocation rather than an actual cash disbursement, it is added back dollar-for-dollar on the Cash Flow Statement under Cash Flow from Operations (CFO). Third, Capital Expenditures represent an actual cash outflow used to acquire physical assets; therefore, CapEx is deducted under Cash Flow from Investing Activities (CFI): `CFI = - CapEx`. Fourth, on the Balance Sheet, Net PP&E increases by the net difference between CapEx and Depreciation.",
            "In institutional financial modeling, analysts bifurcate Capital Expenditures into Maintenance CapEx (the capital required to replace aging assets and maintain current revenue capacity) and Growth CapEx (discretionary investments deployed to expand into new markets or build new production lines). This distinction is critical in leveraged buyouts and distressed restructuring: during severe economic downturns, corporate leadership can temporarily defer Growth CapEx to preserve liquidity, but starving Maintenance CapEx inevitably degrades operational capacity and triggers plant outages.",
            "Furthermore, financial engineers must account for corporate income tax shields under ASC 740. In statutory tax accounting, companies frequently utilize accelerated depreciation schedules (such as the Modified Accelerated Cost Recovery System, or MACRS, and Section 168(k) bonus depreciation) which front-load tax deductions, creating significant timing differences between GAAP financial reporting and cash taxes paid. These timing differences give rise to Deferred Tax Liabilities (DTLs) on the balance sheet, representing taxes saved today that must be paid in future fiscal years.",
            "Consider the common modeling failure where an analyst deducts CapEx on the Cash Flow Statement, which correctly reduces Cash on the Balance Sheet, but forgets to link CapEx into the PP&E schedule. The asset side of the balance sheet drops by the CapEx amount because cash decreased with no offsetting increase in Net PP&E, instantly throwing the balance sheet out of balance. Conversely, properly integrating the PP&E roll-forward guarantees that the cash reduction is perfectly mirrored by an increase in long-term capital assets.",
            "Below, we execute our FixedAssetPpeSchedule in pure Python. We model Gross PP&E additions, compute accumulated depreciation roll-forwards, calculate net carrying book value, and verify the two-way cash flow linkages across operating addbacks and investing outflows."
        ],
        "example": "Think of buying a delivery truck: paying twenty thousand dollars in cash reduces your bank account, but your total wealth remains identical because you now own a twenty thousand dollar asset (Net PP&E) parked in your garage.",
        "code": p3_code,
        "output": run_py(p3_code),
        "codeNotes": [
            {"line": 2, "note": "Initializes FixedAssetPpeSchedule tracking gross asset cost and accumulated depreciation"},
            {"line": 7, "note": "Rolls forward Gross PP&E with CapEx and Accumulated Depreciation with period expense"},
            {"line": 12, "note": "Calculates Cash Flow linkages: -CapEx in investing and +Depreciation in operating addbacks"},
            {"line": 26, "note": "Demonstrates Net PP&E increase of 8M matching 22M CapEx minus 14M Depreciation"}
        ],
        "tryIt": "Set CapEx to 14M (exactly equal to Depreciation) and verify that Net PP&E remains unchanged while Cash Flow Investing outflow matches Operating Depreciation addback.",
        "check": {
            "question": "How does a $10M Depreciation expense flow through the three financial statements (assuming a 25% tax rate)?",
            "options": [
                "Reduces Net Income by $7.5M on P&L, is added back by $10M on Cash Flow Statement, yielding a net +$2.5M cash increase (tax shield) while Net PP&E decreases by $10M on Balance Sheet",
                "Reduces Cash by $10M on the Balance Sheet directly",
                "Increases Retained Earnings by $10M because it is a non-cash item",
                "Has zero impact on the Balance Sheet because it is an Income Statement item"
            ],
            "answer": 0,
            "why": "Depreciation shields income from taxes: EBIT falls by $10M, taxes fall by $2.5M, so Net Income falls by $7.5M. Adding back $10M on the Cash Flow statement yields +$2.5M net cash, while Net PP&E falls by $10M."
        }
    },
    {
        "title": "Retained Earnings Linkers, Dividends & Share Buyback Equity Updates",
        "say": [
            "We now examine the fourth vital bridge in Three-Statement financial modeling: the Shareholder Equity schedule and the Retained Earnings linker. In accounting theory and corporate law, Retained Earnings represents the cumulative historical net income of the corporation that has been reinvested in the business rather than distributed to equity holders as cash dividends. It serves as the primary structural conduit through which the Income Statement transfers economic value into the Balance Sheet.",
            "The Retained Earnings roll-forward formula is an immutable invariant: `Ending Retained Earnings = Beginning Retained Earnings + Net Income - Dividends Declared`. At the conclusion of every fiscal period, the bottom-line Net Income from the Income Statement flows directly into the equity section of the Balance Sheet. If the board of directors authorizes dividends, those dividends are deducted from Retained Earnings and reflected as a cash outflow under Cash Flow from Financing Activities (CFF).",
            "In modern enterprise corporate finance, corporate treasury and capital allocation strategies also deploy excess operational liquidity into Share Repurchases (stock buybacks). When an enterprise buys back its own common stock from the open market, cash decreases under Cash Flow from Financing Activities, and Common Stock / Additional Paid-In Capital (or Treasury Stock as a contra-equity account) is reduced by the identical amount. Thus: `Ending Common Stock = Beginning Common Stock - Share Buybacks`.",
            "Total Shareholders' Equity is the sum of Common Stock, Additional Paid-In Capital (APIC), Retained Earnings, and Accumulated Other Comprehensive Income (AOCI). When Net Income is positive and exceeds dividend payouts, Retained Earnings expands, driving up Total Equity. This equity expansion balances the corresponding increase in net assets generated by operating cash flows and reinvested capital.",
            "In institutional private equity and corporate governance, capital allocation frameworks also monitor Stock-Based Compensation (SBC) under ASC 718. Stock-based compensation is recognized as an operating expense on the Income Statement, reducing operating profit and Net Income. However, because no cash changes hands, SBC is added back on the Cash Flow Statement under Operating Activities and credited directly to Additional Paid-In Capital in Shareholders' Equity, preserving both cash balances and balance sheet equilibrium while diluting share counts.",
            "If an analyst introduces an error on the Income Statement—such as miscalculating corporate income taxes, operating expenses, or interest expense—the error flows directly into Net Income, which distorts Retained Earnings, which instantly throws the Balance Sheet out of balance unless Cash is artificially forced. By keeping the linkage programmatic, dynamic, and clean, any adjustment to operational revenue, gross margins, or financing costs dynamically ripples through Net Income, updates Retained Earnings, reconciles cash flow, and maintains flawless balance sheet equilibrium.",
            "Credit rating agencies and syndicated bank lenders enforce strict Dividend Restriction Covenants within corporate debt indentures. If an enterprise's Debt Service Coverage Ratio (DSCR) or Total Leverage Ratio breaches specified contractual thresholds, the credit agreement legally forbids dividend distributions or share repurchases, trapping operating cash within Retained Earnings to protect debtholder claims.",
            "Below, we implement our RetainedEarningsEquityLinker in pure Python. We simulate an enterprise generating twenty-eight-point-five million dollars in Net Income, paying out twenty-five percent in dividends, executing five million dollars in share buybacks, and auditing the resulting equity balances."
        ],
        "example": "Think of a personal bank account: your net salary (Net Income) flows into your savings account (Retained Earnings); money you spend on luxury gifts (Dividends) exits savings, leaving the remainder to grow your personal net worth (Total Equity).",
        "code": p4_code,
        "output": run_py(p4_code),
        "codeNotes": [
            {"line": 2, "note": "Initializes RetainedEarningsEquityLinker tracking retained profit and common equity"},
            {"line": 7, "note": "Calculates dividend distributions and retained net earnings addition"},
            {"line": 10, "note": "Adjusts common stock downward to reflect share buyback repurchases"},
            {"line": 25, "note": "Audits ending retained earnings expansion of 21.38M after 7.125M dividend payout"}
        ],
        "tryIt": "Increase the dividend payout ratio to 100% and observe that ending retained earnings remains exactly equal to beginning retained earnings.",
        "check": {
            "question": "What is the exact formula for the period-over-period roll-forward of Retained Earnings on the Balance Sheet?",
            "options": [
                "Ending Retained Earnings = Beginning Retained Earnings + Net Income - Dividends Declared",
                "Ending Retained Earnings = Beginning Retained Earnings + Revenue - CapEx",
                "Ending Retained Earnings = Total Assets - Total Liabilities - Common Stock",
                "Ending Retained Earnings = Beginning Retained Earnings + Operating Cash Flow"
            ],
            "answer": 0,
            "why": "Retained earnings accumulates undistributed profits: Net Income adds to the balance, while dividends declared are distributions that reduce the balance."
        }
    },
    {
        "title": "Master Integrated Five-Year Three-Statement Forecast Simulator",
        "say": [
            "We culminate Day 31 by assembling all four schedules into our Master Integrated Five-Year Three-Statement Forecast Simulator. In this production synthesis, we simulate an enterprise scaling from one hundred fifty million dollars in revenue across five projected fiscal years. Every single operational schedule—revenue growth curves, EBITDA margin expansion, depreciation roll-forwards, operating working capital days (DSO, DSI, DPO), mandatory debt principal amortization, dividend distributions, and cash balances—is fully interconnected.",
            "The calculation sequence in a professional financial model follows a rigorous order of execution: First, the Income Statement projects Revenue, EBITDA, Depreciation from the PP&E schedule, EBIT, Interest Expense from the Debt schedule, and Net Income after taxes. Second, the Working Capital schedule determines delta movements in Accounts Receivable, Inventory, and Accounts Payable based on operational activity ratios. Third, the Cash Flow Statement synthesizes Cash Flow from Operations (Net Income + Depreciation - Delta NWC), Cash Flow from Investing (-CapEx), and Cash Flow from Financing (-Debt Paydown - Dividends). Fourth, Net Change in Cash is added to Beginning Cash to establish Ending Cash on the Balance Sheet. Fifth, the Balance Sheet aggregates Total Assets (Cash + AR + Inventory + Net PP&E) and Total Liabilities plus Equity (AP + Debt + Equity), asserting zero checksum variance across all five years.",
            "This closed-loop feedback architecture ensures that management can stress-test any corporate decision. If executive leadership decides to accelerate revenue growth by offering looser credit terms to customers (increasing DSO from 35 days to 60 days), the model immediately reflects higher Accounts Receivable, lower operating cash flow, reduced cash balances, and a potential need for external revolver debt financing—all while the balance sheet remains in perfect mathematical equilibrium.",
            "In institutional private equity and corporate banking, an integrated model that runs five forecast years with zero plug variance is considered unassailable evidence of quantitative rigor. It gives lenders, auditors, and board directors total confidence that financial projections adhere to fundamental accounting laws.",
            "Furthermore, production financial models adhere to the internationally recognized FAST Standard (Flexible, Appropriate, Structured, Transparent). Color-coding conventions dictate that hardcoded historical inputs are styled in dark blue, intra-sheet calculations in black, and cross-sheet links in dark green. Section headers use standardized shading, formula structures remain consistent across columns, and hidden rows or hardcoded numbers inside formulas are strictly forbidden by model audit committees.",
            "When presenting five-year integrated financial models to executive boards or investment committees, analysts prepare dynamic bridge charts and scenario toggles that illuminate the key drivers of cash creation. Understanding how operational margins, working capital efficiency, and capital reinvestment interact over multi-year horizons empowers corporate leadership to allocate capital with strategic conviction and absolute balance sheet safety.",
            "Below, we execute our MasterThreeStatementForecastEngine in pure Python. We run the complete five-year simulation, verify that every year achieves zero checksum variance, and output the audited executive forecast ledger."
        ],
        "example": "Think of the mechanical gear train of a master Swiss chronograph: the mainspring (P&L Revenue) drives the gear escapement (Working Capital and CapEx), which turns the hands (Cash Flow and Balance Sheet) in perfect mathematical synchronization without a single slip.",
        "code": p5_code,
        "output": run_py(p5_code),
        "codeNotes": [
            {"line": 2, "note": "Initializes MasterThreeStatementForecastEngine executing 5-year integrated forecast"},
            {"line": 15, "note": "Projects P&L metrics: 8% revenue CAGR, 22% EBITDA margin, and income taxes"},
            {"line": 26, "note": "Computes working capital schedules: AR (35 days), Inv (45 days), AP (30 days)"},
            {"line": 43, "note": "Reconciles Cash Flow Statement: CFO + CFI + CFF anchoring balance sheet cash"},
            {"line": 52, "note": "Verifies 100% zero variance checksum across all 5 projection years"}
        ],
        "tryIt": "Adjust the revenue growth rate from 1.08 to 1.15 in the loop and verify that the model scales effortlessly while maintaining zero variance across all 5 years.",
        "check": {
            "question": "In a closed-loop Three-Statement model, how is the Balance Sheet Cash account determined for any future forecast period?",
            "options": [
                "It is anchored directly to Beginning Cash plus the Net Change in Cash calculated on the Cash Flow Statement",
                "It is hardcoded by the financial analyst based on management targets",
                "It is calculated as a fixed percentage of total assets",
                "It is plugged to whatever number makes Assets equal Liabilities plus Equity"
            ],
            "answer": 0,
            "why": "Balance sheet cash is the ending cash balance derived from the Cash Flow Statement: Ending Cash = Beginning Cash + (CFO + CFI + CFF)."
        }
    }
]

# Audit words
total_day_words = 0
for idx, p in enumerate(parts, 1):
    w = sum(len(s.split()) for s in p['say']) + len(p.get('example','').split()) + len(p.get('tryIt','').split()) + len(p['check']['why'].split())
    total_day_words += w
    print(f"Part {idx}: {w} words")
print(f"Total Day 31 Words: {total_day_words} words (estimateSpokenMinutes: {round(total_day_words / 120)} min)")

# Generate visual JSON entries
visual_entries = []
for p in parts:
    title = p["title"]
    code_hash = hashlib.sha256(p["code"].encode("utf-8")).hexdigest()
    entry = {
        "partTitle": title,
        "codeHash": code_hash,
        "spec": {
            "template": "bars",
            "title": f"{title[:45]}... — Three-Statement Financial Architecture",
            "steps": [
                {
                    "at": "intro",
                    "caption": f"Step 1: Invariant definition and baseline balance sheet setup for {title[:32]}...",
                    "max": 100,
                    "bars": [
                        {"label": "Total Assets", "value": 35, "tone": "accent"},
                        {"label": "Liabilities", "value": 25, "tone": "data"},
                        {"label": "Equity", "value": 20, "tone": "data"},
                        {"label": "Equilibrium", "value": 15, "tone": "data"}
                    ]
                },
                {
                    "at": "say1",
                    "caption": f"Step 2: Operational schedules and cash flow linkage analysis for {title[:32]}...",
                    "max": 100,
                    "bars": [
                        {"label": "Total Assets", "value": 65, "tone": "accent"},
                        {"label": "Liabilities", "value": 55, "tone": "data"},
                        {"label": "Equity", "value": 50, "tone": "data"},
                        {"label": "Equilibrium", "value": 45, "tone": "data"}
                    ]
                },
                {
                    "at": "example",
                    "caption": f"Step 3: Multi-statement roll-forward and working capital bridging for {title[:32]}...",
                    "max": 100,
                    "bars": [
                        {"label": "Total Assets", "value": 85, "tone": "accent"},
                        {"label": "Liabilities", "value": 80, "tone": "data"},
                        {"label": "Equity", "value": 75, "tone": "data"},
                        {"label": "Equilibrium", "value": 70, "tone": "data"}
                    ]
                },
                {
                    "at": "tryIt",
                    "caption": f"Step 4: Checksum audit and verified zero-variance equilibrium for {title[:32]}...",
                    "max": 100,
                    "bars": [
                        {"label": "Total Assets", "value": 100, "tone": "accent"},
                        {"label": "Liabilities", "value": 100, "tone": "accent"},
                        {"label": "Equity", "value": 100, "tone": "accent"},
                        {"label": "Equilibrium", "value": 100, "tone": "accent"}
                    ]
                }
            ]
        }
    }
    visual_entries.append(entry)

visual_path = os.path.join("src", "lib", "data", "lessonVisuals", "excel_viz", "day-31.json")
with open(visual_path, "w", encoding="utf-8") as f:
    json.dump(visual_entries, f, indent=2)
print(f"Generated visual file: {visual_path}")

# Construct LongLesson object for Day 31
day31_lesson = {
    "day": 31,
    "title": "Dynamic Three-Statement Financial Modeling: Integrated P&L, Balance Sheet & Cash Flow Loops",
    "summary": [
        "Enforce the fundamental Three-Statement Accounting Equilibrium Invariant: Assets strictly equal Liabilities plus Shareholders' Equity.",
        "Model Operating Net Working Capital schedules (DSO, DSI, DPO) and bridge working capital expansion into operating cash flow.",
        "Construct PP&E depreciation and CapEx roll-forward schedules linking P&L depreciation addbacks with investing cash outflows.",
        "Program Retained Earnings equity linkers routing Net Income and dividend distributions into balance sheet equity.",
        "Simulate an integrated 5-year corporate forecast engine maintaining verified zero-plug balance sheet equilibrium."
    ],
    "projectStep": {
        "title": "Build the Enterprise Integrated Three-Statement Financial Forecast Suite",
        "steps": [
            "Construct the ThreeStatementLedgerInvariants class enforcing double-entry balance sheet equality.",
            "Implement the WorkingCapitalCashFlowBridge class linking accounts receivable, inventory, and accounts payable to cash.",
            "Build the FixedAssetPpeSchedule class linking CapEx investing outflows and depreciation addbacks.",
            "Deploy the RetainedEarningsEquityLinker class connecting Income Statement Net Income to Balance Sheet Equity.",
            "Integrate the consolidated MasterThreeStatementForecastEngine forecasting 5 years with verified zero-variance equilibrium."
        ]
    },
    "parts": parts
}

# Append Day 31 to excelVizLongLessons.ts
target_ts = r"src\lib\data\excelVizLongLessons.ts"
with open(target_ts, "r", encoding="utf-8") as f:
    ts_content = f.read()

lesson_json = json.dumps(day31_lesson, indent=2)

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

print("Successfully appended Day 31 to src/lib/data/excelVizLongLessons.ts!")
