import subprocess
import json
import sys
import hashlib

def run_python_snippet(code_str):
    with open("temp_snippet.py", "w", encoding="utf-8") as f:
        f.write(code_str)
    res = subprocess.run(["python", "temp_snippet.py"], capture_output=True, text=True)
    if res.returncode != 0:
        print("Python snippet error:", res.stderr)
        sys.exit(1)
    return res.stdout.strip()

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

print("Running snippets to capture exact output...")
outputs = [
    run_python_snippet(p1_code),
    run_python_snippet(p2_code),
    run_python_snippet(p3_code),
    run_python_snippet(p4_code),
    run_python_snippet(p5_code),
]

for idx, out in enumerate(outputs, 1):
    print(f"Part {idx} output verified cleanly.")

with open("scripts/outputs_day31.json", "w", encoding="utf-8") as f:
    json.dump(outputs, f, indent=2)

print("Day 31 outputs captured cleanly.")
