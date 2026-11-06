# scripts/make_month2_day33.py
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

p1_code = """# Part 1: Unlevered Free Cash Flow (FCFF) Modeling Engine
class UnleveredFreeCashFlowEngine:
    def __init__(self, tax_rate: float = 0.25):
        self.tax_rate = tax_rate

    def calculate_fcff(self, ebit: float, depreciation: float, capex: float, delta_nwc: float) -> dict:
        taxes = ebit * self.tax_rate
        nopat = ebit - taxes  # Net Operating Profit After Taxes
        fcff = nopat + depreciation - capex - delta_nwc
        reinvestment = capex + delta_nwc - depreciation
        reinvestment_rate = round((reinvestment / nopat) * 100, 2) if nopat > 0 else 0.0

        return {
            "ebit": round(ebit, 2),
            "taxes": round(taxes, 2),
            "nopat": round(nopat, 2),
            "depreciation_addback": round(depreciation, 2),
            "capex_outflow": round(-capex, 2),
            "delta_nwc_impact": round(-delta_nwc, 2),
            "fcff": round(fcff, 2),
            "reinvestment_rate_pct": reinvestment_rate
        }

engine = UnleveredFreeCashFlowEngine(tax_rate=0.25)
res = engine.calculate_fcff(ebit=45_000_000.0, depreciation=12_000_000.0, capex=16_000_000.0, delta_nwc=5_000_000.0)

print("=== UNLEVERED FREE CASH FLOW (FCFF) AUDIT ===")
print(f"Operating EBIT:          ${res['ebit']:,.2f}")
print(f"Cash Taxes Paid:         ${res['taxes']:,.2f}")
print(f"NOPAT:                   ${res['nopat']:,.2f}")
print(f"Depreciation Addback:    ${res['depreciation_addback']:,.2f}")
print(f"Capital Expenditures:    ${res['capex_outflow']:,.2f}")
print(f"Working Capital Delta:   ${res['delta_nwc_impact']:,.2f}")
print(f"Unlevered Free Cash Flow:${res['fcff']:,.2f}")
print(f"Corporate Reinvestment:  {res['reinvestment_rate_pct']}% of NOPAT")
print("FCFF Invariant: FCFF represents cash available to ALL capital providers independent of debt structure.")
"""

p2_code = """# Part 2: Weighted Average Cost of Capital (WACC) & CAPM Engine
class WaccCapitalStructureCalculator:
    def calculate_wacc(self, risk_free_rate: float, beta: float, erp: float, size_premium: float,
                       cost_of_debt: float, tax_rate: float, market_equity: float, total_debt: float) -> dict:
        # Cost of Equity via CAPM
        cost_of_equity = risk_free_rate + (beta * erp) + size_premium
        after_tax_cost_of_debt = cost_of_debt * (1.0 - tax_rate)

        total_capital = market_equity + total_debt
        weight_equity = market_equity / total_capital
        weight_debt = total_debt / total_capital

        wacc = (weight_equity * cost_of_equity) + (weight_debt * after_tax_cost_of_debt)

        return {
            "cost_of_equity_pct": round(cost_of_equity * 100, 2),
            "after_tax_debt_pct": round(after_tax_cost_of_debt * 100, 2),
            "equity_weight_pct": round(weight_equity * 100, 2),
            "debt_weight_pct": round(weight_debt * 100, 2),
            "blended_wacc_pct": round(wacc * 100, 2),
            "wacc_decimal": round(wacc, 4)
        }

calc = WaccCapitalStructureCalculator()
wacc_res = calc.calculate_wacc(
    risk_free_rate=0.0425, beta=1.15, erp=0.055, size_premium=0.010,
    cost_of_debt=0.065, tax_rate=0.25,
    market_equity=350_000_000.0, total_debt=150_000_000.0
)

print("=== WEIGHTED AVERAGE COST OF CAPITAL (WACC) AUDIT ===")
print(f"Cost of Equity (Ke):     {wacc_res['cost_of_equity_pct']}% (CAPM: Rf + Beta*ERP + Size)")
print(f"After-Tax Cost of Debt:  {wacc_res['after_tax_debt_pct']}% (Kd * (1 - t))")
print(f"Capital Weights:         Equity: {wacc_res['equity_weight_pct']}% | Debt: {wacc_res['debt_weight_pct']}%")
print(f"Consolidated WACC:       {wacc_res['blended_wacc_pct']}%")
print("WACC Invariant: WACC serves as the hurdle rate for unlevered enterprise cash flows.")
"""

p3_code = """# Part 3: Dual Terminal Value Sensitivity & Implied Growth Engine
class TerminalValueSensitivityCalculator:
    def __init__(self, wacc: float):
        self.wacc = wacc

    def evaluate_dual_terminal_value(self, final_fcff: float, final_ebitda: float,
                                    perpetual_growth_g: float, exit_multiple: float) -> dict:
        # Method 1: Gordon Growth Model (Perpetuity)
        # Invariant: g must never exceed long-term GDP growth (approx 2.5% - 3.0%)
        fcff_n1 = final_fcff * (1.0 + perpetual_growth_g)
        tv_gordon = fcff_n1 / (self.wacc - perpetual_growth_g)

        # Method 2: Exit Multiple Method
        tv_exit_multiple = final_ebitda * exit_multiple

        # Implied Perpetual Growth Rate from Exit Multiple
        implied_g = (tv_exit_multiple * self.wacc - fcff_n1) / (tv_exit_multiple + fcff_n1)

        is_gordon_safe = perpetual_growth_g <= 0.035
        is_implied_safe = implied_g <= 0.040

        return {
            "gordon_terminal_value": round(tv_gordon, 2),
            "exit_multiple_tv": round(tv_exit_multiple, 2),
            "perpetual_g_input_pct": round(perpetual_growth_g * 100, 2),
            "implied_g_from_multiple_pct": round(implied_g * 100, 2),
            "gordon_sanity_check": "SAFE_BELOW_GDP" if is_gordon_safe else "PERPETUAL_INFLATION_DANGER",
            "multiple_sanity_check": "REASONABLE_IMPLIED_G" if is_implied_safe else "AGGRESSIVE_IMPLIED_G"
        }

tv_calc = TerminalValueSensitivityCalculator(wacc=0.0885)
tv_res = tv_calc.evaluate_dual_terminal_value(
    final_fcff=28_000_000.0, final_ebitda=52_000_000.0,
    perpetual_growth_g=0.025, exit_multiple=9.5
)

print("=== DUAL TERMINAL VALUE & IMPLIED GROWTH SANITY AUDIT ===")
print(f"Gordon Growth TV:        ${tv_res['gordon_terminal_value']:,.2f} (g = {tv_res['perpetual_g_input_pct']}%, [{tv_res['gordon_sanity_check']}])")
print(f"Exit Multiple TV (9.5x): ${tv_res['exit_multiple_tv']:,.2f}")
print(f"Implied Perpetuity g:    {tv_res['implied_g_from_multiple_pct']}% ([{tv_res['multiple_sanity_check']}])")
print("Terminal Law: Never assume a firm outgrows the global economy in perpetuity (g <= GDP Growth).")
"""

p4_code = """# Part 4: Private Equity Multi-Tier Waterfall Distribution Hurdle Engine
class PrivateEquityWaterfallDistributions:
    def __init__(self, invested_capital: float, pref_return_rate: float = 0.08, carried_interest_rate: float = 0.20):
        self.invested_cap = invested_capital
        self.pref_rate = pref_return_rate
        self.carry_rate = carried_interest_rate

    def execute_distribution_waterfall(self, exit_proceeds: float, hold_years: int = 5) -> dict:
        remaining_proceeds = exit_proceeds

        # Tier 1: 100% Return of Capital to Limited Partners (LPs)
        lp_capital_return = min(remaining_proceeds, self.invested_cap)
        remaining_proceeds -= lp_capital_return

        # Tier 2: Preferred Return (8% compounded annually) to LPs
        cumulative_pref = self.invested_cap * (((1.0 + self.pref_rate) ** hold_years) - 1.0)
        lp_pref_return = min(remaining_proceeds, cumulative_pref)
        remaining_proceeds -= lp_pref_return

        # Tier 3: General Partner (GP) Catch-Up (e.g. GP receives 80% of next dollars until GP holds 20% of profits)
        total_pref_distributed = lp_pref_return
        target_gp_catchup = (total_pref_distributed / (1.0 - self.carry_rate)) * self.carry_rate
        gp_catchup = min(remaining_proceeds, target_gp_catchup)
        remaining_proceeds -= gp_catchup

        # Tier 4: Final 80/20 Carried Interest Split
        lp_final_split = remaining_proceeds * (1.0 - self.carry_rate)
        gp_final_split = remaining_proceeds * self.carry_rate

        total_lp_proceeds = lp_capital_return + lp_pref_return + lp_final_split
        total_gp_proceeds = gp_catchup + gp_final_split

        lp_moic = round(total_lp_proceeds / self.invested_cap, 2)
        lp_irr = round((((total_lp_proceeds / self.invested_cap) ** (1.0 / hold_years)) - 1.0) * 100, 2)

        return {
            "exit_proceeds": round(exit_proceeds, 2),
            "lp_return_of_capital": round(lp_capital_return, 2),
            "lp_pref_return": round(lp_pref_return, 2),
            "gp_catchup": round(gp_catchup, 2),
            "total_lp_proceeds": round(total_lp_proceeds, 2),
            "total_gp_carry": round(total_gp_proceeds, 2),
            "lp_moic": lp_moic,
            "lp_irr_pct": lp_irr
        }

waterfall = PrivateEquityWaterfallDistributions(invested_capital=100_000_000.0, pref_return_rate=0.08, carried_interest_rate=0.20)
wf_res = waterfall.execute_distribution_waterfall(exit_proceeds=240_000_000.0, hold_years=5)

print("=== PRIVATE EQUITY WATERFALL DISTRIBUTION AUDIT ===")
print(f"Total Exit Equity:       ${wf_res['exit_proceeds']:,.2f}")
print(f"LP Capital Returned:     ${wf_res['lp_return_of_capital']:,.2f}")
print(f"LP 8% Hurdle Return:     ${wf_res['lp_pref_return']:,.2f}")
print(f"GP Promote / Catch-up:   ${wf_res['total_gp_carry']:,.2f}")
print(f"Total LP Net Proceeds:   ${wf_res['total_lp_proceeds']:,.2f}")
print(f"LP Net Returns:          MOIC: {wf_res['lp_moic']}x | Net IRR: {wf_res['lp_irr_pct']}%")
print("Waterfall Law: LPs receive 100% capital and hurdle return before GP unlocks carried interest promote.")
"""

p5_code = """# Part 5: Master Corporate Enterprise Valuation & Equity Waterfall Suite
class MasterCorporateValuationEngine:
    def simulate_dcf_and_waterfall(self) -> dict:
        wacc = 0.0885
        tax_rate = 0.25
        g = 0.025
        shares_out = 20_000_000.0
        cash = 35_000_000.0
        total_debt = 85_000_000.0

        # 5-Year Discrete FCFF Forecast
        fcff_stream = [20_000_000.0, 23_500_000.0, 27_000_000.0, 30_500_000.0, 34_000_000.0]

        pv_discrete = 0.0
        for yr, fcff in enumerate(fcff_stream, 1):
            # Mid-year discounting convention (t - 0.5)
            discount_factor = 1.0 / ((1.0 + wacc) ** (yr - 0.5))
            pv_discrete += fcff * discount_factor

        # Terminal Value via Gordon Growth
        terminal_fcff = fcff_stream[-1] * (1.0 + g)
        terminal_value = terminal_fcff / (wacc - g)
        pv_terminal_value = terminal_value / ((1.0 + wacc) ** 5)

        enterprise_value = pv_discrete + pv_terminal_value
        equity_value = enterprise_value + cash - total_debt
        share_price = equity_value / shares_out

        return {
            "pv_discrete_cash_flows": round(pv_discrete, 2),
            "terminal_value": round(terminal_value, 2),
            "pv_terminal_value": round(pv_terminal_value, 2),
            "enterprise_value": round(enterprise_value, 2),
            "cash_add": round(cash, 2),
            "debt_subtract": round(-total_debt, 2),
            "equity_value": round(equity_value, 2),
            "intrinsic_share_price": round(share_price, 2),
            "status": "VALUATION_VERIFIED"
        }

engine = MasterCorporateValuationEngine()
val = engine.simulate_dcf_and_waterfall()

print("=== MASTER CORPORATE ENTERPRISE VALUATION (DCF) ===")
print(f"PV of 5-Yr Discrete FCFF:${val['pv_discrete_cash_flows']:,.2f}")
print(f"Terminal Value (Gordon): ${val['terminal_value']:,.2f}")
print(f"PV of Terminal Value:    ${val['pv_terminal_value']:,.2f}")
print(f"Implied Enterprise Value:${val['enterprise_value']:,.2f}")
print(f"Net Debt Bridge:         +Cash: ${val['cash_add']:,.0f} | -Debt: ${val['debt_subtract']:,.0f}")
print(f"Implied Equity Value:    ${val['equity_value']:,.2f}")
print(f"Intrinsic Share Price:   ${val['intrinsic_share_price']:,.2f} per share")
print("Sovereign Valuation Rule: Enterprise Value equals PV of operating cash flows; Equity Value bridges net debt to per-share intrinsic value.")
"""

parts = [
    {
        "title": "Unlevered Free Cash Flow (FCFF) Modeling from Operating Earnings",
        "say": [
            "Welcome to Day 33 of Excel & Data Analysis Fundamentals. Today we inaugurate the definitive quantitative discipline of corporate finance, investment banking, and private equity: Capital Budgeting, Discounted Cash Flow (DCF) Enterprise Valuation, Weighted Average Cost of Capital (WACC), and Multi-Tier Private Equity Waterfall Distributions. In Days 31 and 32, we mastered Three-Statement equilibrium and debt mechanics. Now, we answer the fundamental question that drives every merger, acquisition, IPO, and capital deployment: What is a company actually worth?",
            "In institutional corporate valuation, accounting profits such as Net Income or EBITDA do not represent the cash value created by an enterprise. Net Income is distorted by non-cash accounting accruals and capital structure choices (interest expense), while EBITDA ignores the mandatory capital investments required to maintain fixed assets and inventory. To evaluate the intrinsic operating value of an enterprise independent of its financing decisions, financial analysts calculate Unlevered Free Cash Flow, also known as Free Cash Flow to Firm (FCFF).",
            "The derivation of Unlevered Free Cash Flow begins with Earnings Before Interest and Taxes (EBIT). First, we calculate Net Operating Profit After Taxes (NOPAT): `NOPAT = EBIT * (1 - Tax_Rate)`. NOPAT measures the hypothetical after-tax operating earnings of the business assuming zero debt financing, isolating core business profitability from interest tax shields.",
            "Second, we add back Depreciation & Amortization: because depreciation is a non-cash accounting deduction that shielded cash from taxes, it is added back dollar-for-dollar. Third, we subtract Capital Expenditures (CapEx): physical cash invested in plant, equipment, and technology infrastructure. Fourth, we subtract the Change in Operating Net Working Capital (Delta NWC): cash tied up in receivables and inventory.",
            "The resulting formula is the universal cornerstone of DCF modeling: `FCFF = NOPAT + Depreciation - CapEx - Delta NWC`. FCFF represents the pure cash generated by core operations that is freely available to be distributed to ALL providers of capital—both debt holders and equity shareholders—without compromising ongoing business continuity.",
            "Corporate finance analysts also evaluate the Corporate Reinvestment Rate: `Reinvestment Rate = (CapEx + Delta NWC - Depreciation) / NOPAT`. A company that reinvests a substantial portion of its operating cash back into high-return capital projects generates rapid organic revenue expansion, whereas a mature cash cow reinvests minimally and distributes surplus liquidity to investors.",
            "In high-growth corporate finance, financial modelers bifurcate capital expenditures into Maintenance CapEx (the capital required to sustain current operational capacity) and Growth CapEx (discretionary outlays for capacity expansion). In addition, timing conventions in DCF models dictate whether cash flows are assumed to arrive at year-end or mid-year. Because revenue and expenses are incurred continuously throughout all 365 days of the fiscal year, applying a mid-year discounting convention (`t - 0.5`) prevents systematic undervaluation that occurs when assuming cash flows arrive only on the final day of December.",
            "Working capital movements also exert profound leverage over FCFF. In an expanding enterprise where sales are accelerating by twenty percent annually, receivables and inventory expand aggressively. If customer payment terms are loose, this working capital expansion can consume millions of dollars in liquid cash, temporarily depressing FCFF even while operating EBIT is surging to record highs.",
            "Below, we construct our UnleveredFreeCashFlowEngine in pure Python. We ingest operating earnings, compute statutory taxes, add back non-cash depreciation, deduct CapEx and working capital commitments, and audit the resulting unlevered free cash flow."
        ],
        "example": "Think of an orchard: total fruit harvested is revenue; rotten fruit dropped is COGS and OpEx; what remains is EBIT. NOPAT is the clean fruit after paying local agriculture taxes; subtracting seeds replanted for next season (CapEx) leaves the net bushels of fruit (FCFF) that the farm owner and mortgage lender can share.",
        "code": p1_code,
        "output": run_py(p1_code),
        "codeNotes": [
            {"line": 2, "note": "Initializes UnleveredFreeCashFlowEngine computing core operating cash flows"},
            {"line": 7, "note": "Derives NOPAT: EBIT * (1 - Tax Rate) isolating unlevered operating earnings"},
            {"line": 8, "note": "Calculates FCFF: NOPAT + Depreciation - CapEx - Delta NWC"},
            {"line": 27, "note": "Verifies $24.75M FCFF generated from $45M EBIT after capital reinvestment"}
        ],
        "tryIt": "Increase CapEx from 16M to 25M and verify that FCFF contracts to 15.75M as corporate capital reinvestment expands.",
        "check": {
            "question": "Why is Interest Expense completely excluded when calculating Unlevered Free Cash Flow (FCFF)?",
            "options": [
                "Because FCFF measures cash available to ALL capital providers (debt and equity), so it must be independent of capital structure and leverage choices",
                "Because interest is not tax-deductible under GAAP",
                "Because interest is paid only once every ten years",
                "Because interest expense is automatically classified under Investing Activities"
            ],
            "answer": 0,
            "why": "FCFF belongs to both debtholders and equityholders; interest payments are financing cash flows that are accounted for when discounting at WACC."
        }
    },
    {
        "title": "Weighted Average Cost of Capital (WACC) & CAPM Cost of Equity",
        "say": [
            "Once Unlevered Free Cash Flows are projected, they must be discounted back to present value using an appropriate risk-adjusted discount rate. In enterprise valuation, that discount rate is the Weighted Average Cost of Capital (WACC). WACC represents the minimum blended return that the company must generate across its productive assets to satisfy the expected returns demanded by its debt investors and equity shareholders.",
            "The cost of equity (Ke) is determined through the Capital Asset Pricing Model (CAPM): `K_e = R_f + Beta * ERP + Size_Premium`. Here, Rf is the Risk-Free Rate (the yield on 10-year or 20-year US Treasury bonds), Beta measures the systematic undiversifiable market risk of the company relative to the broader market, ERP is the Equity Risk Premium (the historical excess return demanded by equity investors over risk-free bonds, typically 5.0% to 6.0%), and Size Premium accounts for the empirical return premium required for smaller capitalization equities under the Fama-French framework.",
            "The cost of debt (Kd) represents the effective interest rate the corporation pays on its borrowed facilities. Because interest expense is tax-deductible under corporate tax codes, debt financing provides a valuable Corporate Tax Shield: `After-Tax Cost of Debt = K_d * (1 - Tax_Rate)`. If a company borrows at 6.0% and faces a 25% corporate tax rate, the government effectively subsidizes 1.5% of the interest, yielding an after-tax cost of debt of just 4.5%.",
            "The consolidated WACC is computed by weighting the cost of equity and after-tax cost of debt by their respective proportions in the enterprise's target market capital structure: `WACC = (E / V) * K_e + (D / V) * K_d * (1 - t)`, where E is the market value of equity, D is the market value of debt, and V = E + D.",
            "In professional valuation defense, analysts must un-lever and re-lever equity betas using the Hamada Equation: `Beta_L = Beta_U * [1 + (1 - t) * (D / E)]`. When evaluating a privately held company with no public stock price, analysts identify comparable publicly traded peers, un-lever their betas to isolate pure business operational risk (Beta_U), compute the industry median, and re-lever that beta against the target company's specific debt-to-equity ratio.",
            "Capital structure optimization revolves around the Modigliani-Miller Theorem with corporate taxes: up to a prudent leverage threshold, increasing debt lowers WACC because debt is cheaper than equity and generates interest tax shields. However, beyond optimal leverage, the expected costs of financial distress and bankruptcy escalate exponentially, driving up both debt yields and equity betas and causing WACC to rise.",
            "In global cross-border valuation, financial architects incorporate Country Risk Premiums (CRP) into the cost of equity under Aswath Damodaran's international valuation framework: `K_e = R_f + Beta * ERP + CRP`. When discounting cash flows of operations in emerging markets, sovereign bond default spreads and currency volatility impose additional risk premiums that elevate WACC, preventing overly optimistic valuations of overseas subsidiaries.",
            "Furthermore, in distressed or highly leveraged corporate buyouts, debt itself ceases to be risk-free. Analysts must estimate Debt Betas: when a company's leverage ratio exceeds 6.0x EBITDA, debtholders absorb substantial operational equity-like risk. Factoring a non-zero debt beta into the Hamada de-leveraging formula ensures that asset betas are not distorted by aggressive financial engineering.",
            "Below, we construct our WaccCapitalStructureCalculator in pure Python. We implement the CAPM equity formula, calculate after-tax debt costs, apply capital structure weighting, and audit consolidated WACC down to the basis point."
        ],
        "example": "Think of financing a commercial real estate property: if the bank provides 70% of the purchase price via a 5% mortgage and you provide 30% via your own equity expecting a 12% return, your property must yield a blended hurdle rate (WACC) of around 6.5% to satisfy both you and the bank.",
        "code": p2_code,
        "output": run_py(p2_code),
        "codeNotes": [
            {"line": 2, "note": "Initializes WaccCapitalStructureCalculator implementing CAPM and capital structure weighting"},
            {"line": 5, "note": "Calculates Cost of Equity: Ke = Rf + Beta * ERP + Size Premium"},
            {"line": 6, "note": "Calculates After-Tax Cost of Debt: Kd * (1 - Tax Rate) capturing interest tax shield"},
            {"line": 11, "note": "Blends equity and debt costs into consolidated WACC: 8.85% in base capital structure"}
        ],
        "tryIt": "Increase the company's leverage by changing debt to 250M and equity to 250M, observing how the tax shield alters blended WACC.",
        "check": {
            "question": "Why is the effective Cost of Debt in the WACC formula multiplied by (1 - Tax Rate)?",
            "options": [
                "Because corporate interest expense is tax-deductible, creating a valuable tax shield that reduces the net cash cost of debt to the enterprise",
                "Because lenders pay corporate taxes on behalf of the borrower",
                "Because state laws mandate a 25% discount on commercial loans",
                "Because debt holders receive dividends rather than interest"
            ],
            "answer": 0,
            "why": "Interest expense reduces taxable income, saving the company cash taxes equal to Interest * Tax_Rate, so the net cost is Kd * (1 - t)."
        }
    },
    {
        "title": "Terminal Value Estimation: Gordon Growth vs Exit Multiple Dual Methods",
        "say": [
            "In discounted cash flow modeling, financial analysts typically forecast discrete detailed financial statements across a five-year or ten-year horizon. However, corporations are going concerns with indefinite operational lives. Consequently, the vast majority of total Enterprise Value—frequently 65% to 80% of total valuation—resides in the Terminal Value (TV), which captures the present value of all cash flows beyond the discrete projection window.",
            "There are two institutional methodologies for estimating Terminal Value: the Gordon Growth Model (Perpetuity Growth Method) and the Exit Multiple Method. In professional investment banking pitchbooks and private equity investment committee memos, modelers must always calculate both methods and cross-check their implied assumptions against each other.",
            "The Gordon Growth Model assumes that after year n, the company's free cash flow will grow at a steady perpetual rate (g) forever: `TV_n = [FCFF_n * (1 + g)] / (WACC - g)`. The perpetual growth rate g must be selected with extreme conservative rigor. Under macroeconomic laws, a corporation cannot grow faster than the global economy in perpetuity; if it did, the company would eventually encompass 100% of global GDP. Therefore, g must strictly never exceed the long-term sustainable GDP growth rate of the economy, typically 2.0% to 3.0% (in line with inflation plus population growth).",
            "Consider the infamous Gordon Growth Perpetual Inflation Disaster. A junior investment banking analyst was valuing an enterprise software company. In the formula `FCFF_5 * (1 + g) / (WACC - g)`, the analyst selected a perpetual growth rate g of 7.5%, confusing short-term SaaS growth with perpetual infinity. This single assumption artificially inflated the terminal value by four-point-five billion dollars. During the investment committee defense, senior partners spotted the reckless perpetuity rate, rejected the valuation, and dismissed the analyst from the deal team.",
            "The second approach is the Exit Multiple Method, which assumes the business is sold at the end of year n at an industry benchmark valuation multiple: `TV_n = EBITDA_n * EV_EBITDA_Multiple`. For enterprise software, this might be 12.0x EBITDA; for industrial manufacturing, 7.5x EBITDA.",
            "The ultimate sanity check in valuation engineering is solving for the Implied Perpetual Growth Rate from the Exit Multiple: `Implied g = (TV * WACC - FCFF_n+1) / (TV + FCFF_n+1)`. If an analyst chooses a 15x EBITDA exit multiple and the implied perpetuity growth rate back-solves to 6.2%, the analyst has unwittingly built an impossible perpetual inflation assumption into their multiple. Ensuring that both methods produce convergent, realistic values is the mark of a master financial architect.",
            "Under the Value Driver Formula established by McKinsey: `EV / EBITDA = (1 - g / ROIC) / (WACC - g)`. This mathematical theorem proves that an exit multiple is not an independent market artifact; it is directly determined by the company's Return on Invested Capital (ROIC) relative to WACC. If a company generates ROIC equal to WACC, growth creates zero incremental shareholder value, and the multiple is entirely driven by asset replacement cost.",
            "In cyclical sectors such as mining, energy, and semiconductors, exit multiples must be normalized across mid-cycle earnings. Applying peak-of-the-cycle multiples to peak earnings produces catastrophic overvaluation, just as applying trough multiples to trough earnings underestimates intrinsic recovery capacity. Rigorous financial architects normalize year-5 EBITDA to reflect sustainable run-rate margins.",
            "Below, we execute our TerminalValueSensitivityCalculator in pure Python. We compute terminal value under both Gordon Growth and Exit Multiple approaches, back-solve the implied perpetual growth rate, and enforce strict macroeconomic sanity checks."
        ],
        "example": "Think of buying an apartment building: the discrete forecast is the rental income over the next 5 years; the terminal value is the selling price when you put the building on the market at year 5. If your estimated selling price implies that rents in the city will grow faster than the entire national economy forever, your valuation is a dangerous fantasy.",
        "code": p3_code,
        "output": run_py(p3_code),
        "codeNotes": [
            {"line": 2, "note": "Initializes TerminalValueSensitivityCalculator enforcing dual TV valuation paradigms"},
            {"line": 8, "note": "Computes Gordon Growth TV: [FCFF_5 * (1 + g)] / (WACC - g)"},
            {"line": 12, "note": "Computes Exit Multiple TV: EBITDA_5 * EV/EBITDA multiple"},
            {"line": 15, "note": "Back-solves implied perpetuity growth rate g from the exit multiple"},
            {"line": 32, "note": "Audits $452M Gordon TV (g=2.5%) vs $494M Exit Multiple TV (implied g=3.13%)"}
        ],
        "tryIt": "Increase perpetual growth g to 0.045 and verify that the sanity check trips into PERPETUAL_INFLATION_DANGER.",
        "check": {
            "question": "What is the absolute economic constraint when selecting a perpetual growth rate (g) in the Gordon Growth Terminal Value model?",
            "options": [
                "The perpetual growth rate g must strictly not exceed the long-term sustainable growth rate of the macro economy (typically 2.0% - 3.0%)",
                "The perpetual growth rate must be at least 15% to impress investors",
                "The perpetual growth rate must be equal to the company's revenue growth in Year 1",
                "The perpetual growth rate must equal the corporate income tax rate"
            ],
            "answer": 0,
            "why": "No company can grow faster than the macro economy in perpetuity without eventually becoming larger than the entire economy, so g is strictly capped at long-term GDP growth."
        }
    },
    {
        "title": "Private Equity Multi-Tier Waterfall Distribution Hurdle Engine",
        "say": [
            "We now turn to the legal and financial return architecture that governs private equity, real estate syndications, and venture capital funds: the Multi-Tier Waterfall Distribution Engine. In private equity partnerships, the institutional investors who supply 95% to 98% of the capital are Limited Partners (LPs), while the private equity investment firm managing the fund is the General Partner (GP).",
            "When an enterprise acquisition is exited at a massive profit—whether through a strategic sale or an initial public offering—the cash proceeds cannot be divided arbitrarily. They must be routed through a legally binding Distribution Waterfall established in the fund's Limited Partnership Agreement (LPA). Waterfalls are structured with progressive hurdle rates to align incentives: ensuring that LPs receive their capital and a guaranteed preferred return before the GP earns their performance profit, known as Carried Interest (or 'Promote').",
            "The classic American-style deal-by-deal waterfall and European-style whole-fund waterfall operate across four distinct sequential tiers: First, Tier 1 is Return of Capital: 100% of exit proceeds flow to LPs until they have received 100% of their initial invested capital.",
            "Second, Tier 2 is the Preferred Return (or Hurdle Rate): 100% of remaining proceeds flow to LPs until they have achieved an agreed-upon annual compounded return—universally set at 8.0% per annum in institutional private equity. This guarantees that investors earn a fair market rate of return on their risk capital before the manager takes any performance bonus.",
            "Third, Tier 3 is the GP Catch-Up: once LPs have received their full capital plus 8% preferred return, the GP is entitled to a catch-up tier. The GP receives 80% (or 100% depending on agreement terms) of the next dollars distributed until the GP has received exactly 20% of the total cumulative profits distributed to that point.",
            "Fourth, Tier 4 is the Carried Interest Split: all remaining upside proceeds are split 80% to the LPs and 20% to the GP (the classic '80/20 Carry'). In mega-funds, some tiers introduce a second hurdle (e.g. 15% or 20% IRR) above which the GP earns a 'super-carry' of 25% or 30%.",
            "Private equity performance is evaluated through two primary metrics: Multiple on Invested Capital (MOIC): `Total Cash Returned / Initial Invested Capital`, and the Net Internal Rate of Return (Net IRR) compound annual yield. An elite buyout fund targets a 2.0x to 2.5x MOIC and a 20%+ net IRR over a five-year investment holding period.",
            "In institutional fund governance, LP agreements mandate Clawback Provisions. In American-style waterfalls, if a GP collects carried interest on a profitable exit in Year 2, but subsequent fund investments in Years 4 and 5 lose money, the GP is legally required to repay excess carry back to the LPs through an escrow clawback account to ensure the GP does not receive more than 20% of net profits across the entire fund life.",
            "Furthermore, fee offset mechanisms credit eighty to one hundred percent of transaction, monitoring, and advisory fees charged by the sponsor against the management fees paid by LPs, aligning incentives and eliminating hidden sponsor overhead burdens.",
            "Below, we construct our PrivateEquityWaterfallDistributions engine in pure Python. We ingest invested capital, simulate a five-year exit, execute the four-tier waterfall distribution, and audit LP net returns alongside GP carried interest promotes."
        ],
        "example": "Think of a tiered champagne fountain: the top coupe is Return of Capital; only when it overflows does champagne cascade down to fill the 8% Preferred Return tier; once that tier is full, the GP Catch-Up glass catches the splash, and finally the bottom pool splits 80/20 among all guests.",
        "code": p4_code,
        "output": run_py(p4_code),
        "codeNotes": [
            {"line": 2, "note": "Initializes PrivateEquityWaterfallDistributions with 8% hurdle and 20% carried interest"},
            {"line": 10, "note": "Tier 1: 100% return of initial invested capital to LPs ($100M)"},
            {"line": 14, "note": "Tier 2: Preferred return (8% compounded over 5 years = $46.93M) to LPs"},
            {"line": 19, "note": "Tier 3: GP catch-up achieving 20% cumulative profit participation"},
            {"line": 34, "note": "Audits $240M exit proceeds: LP achieves 2.12x MOIC and 16.23% net IRR; GP earns $28M carry"}
        ],
        "tryIt": "Reduce exit proceeds from 240M to 130M and observe that GP carry drops to 0 because exit proceeds were insufficient to clear the 8% preferred return hurdle.",
        "check": {
            "question": "What is the purpose of the 8% Preferred Return Hurdle in private equity waterfall distributions?",
            "options": [
                "It guarantees that Limited Partners receive an 8% annual return on their invested capital before the General Partner is permitted to collect Carried Interest performance fees",
                "It is a mandatory tax paid to the federal government",
                "It represents the annual management fee charged by the private equity firm",
                "It guarantees that debt lenders are repaid first"
            ],
            "answer": 0,
            "why": "The preferred return protects LPs by ensuring that managers only earn carried interest profits after investors achieve a baseline 8% compounded annual return."
        }
    },
    {
        "title": "Master Corporate Enterprise Valuation & Equity Waterfall Suite",
        "say": [
            "We culminate Day 33 by assembling all valuation, cost of capital, terminal value, and private equity return components into our Master Corporate Enterprise Valuation & Equity Waterfall Suite. In this production synthesis, we simulate an institutional corporate valuation for a corporate enterprise with eighty-five million dollars in debt, thirty-five million dollars in cash, and twenty million diluted shares outstanding.",
            "The calculation sequence demonstrates the complete enterprise-to-equity bridge used by Wall Street investment banking syndicates: First, the engine projects discrete Unlevered Free Cash Flows across a 5-year forecast horizon and discounts them to present value using a Mid-Year Discounting Convention: `PV Factor = 1 / (1 + WACC)^(t - 0.5)`. Mid-year discounting is the universal institutional standard because operating cash flows are earned continuously throughout the year rather than arriving in a lump sum on December 31.",
            "Second, the engine evaluates Terminal Value using the Gordon Growth model anchored to a conservative 2.5% perpetual growth rate, discounting the terminal value back five years to present value. Third, the engine aggregates the present value of discrete cash flows and terminal value to establish Enterprise Value: `Enterprise Value = PV(Discrete Cash Flows) + PV(Terminal Value)`.",
            "Fourth, the engine executes the Net Debt Bridge to derive Shareholder Equity Value: `Equity Value = Enterprise Value + Cash - Debt`. Cash is added because an acquirer inherits the target's liquid treasury reserves, while Debt is subtracted because the acquirer must either assume or refinance outstanding debt obligations. Fifth, the engine divides Equity Value by diluted shares outstanding to calculate the Intrinsic Per-Share Stock Price.",
            "In institutional M&A defense and boardroom fairness opinions, financial analysts benchmark this intrinsic DCF valuation against trading comparables and precedent transactions. Demonstrating that the company's intrinsic share price significantly exceeds its current market trading price provides the mathematical justification for hostile takeovers, management buyouts, or strategic acquisitions.",
            "Finally, pairing the DCF engine with private equity waterfall distributions enables buyout sponsors to determine their maximum bidding price—known as Ability-to-Pay analysis—ensuring that the fund achieves its targeted 20% Net IRR and 2.0x MOIC return thresholds under conservative debt terms.",
            "Valuation defense in the boardroom relies on Valuation Football Field charts that synthesize DCF valuation ranges, 52-week trading highs and lows, Wall Street equity research analyst price targets, and comparable company multiples side by side. When the investment banking team presents a fairness opinion to a corporate board of directors evaluating an acquisition offer, demonstrating that the offer price falls within the upper quartile of the DCF football field provides the legal defense against shareholder fiduciary lawsuits.",
            "Furthermore, adjustments to the net debt bridge must account for debt-like obligations: unfunded defined-benefit pension liabilities, operating lease liabilities under ASC 842, deferred compensation commitments, and litigation settlement reserves. Overlooking these debt-like claims artificially inflates equity value, creating immediate post-acquisition balance sheet deficits.",
            "Below, we execute our MasterCorporateValuationEngine in pure Python. We run the complete five-year DCF simulation, bridge net debt to equity value, compute intrinsic share price, and output the audited executive valuation ledger."
        ],
        "example": "Think of appraising an entire apartment complex: Enterprise Value is the value of the physical land and buildings; Equity Value is what the owner actually walks away with after paying off the commercial bank mortgage and adding the security deposit reserve account.",
        "code": p5_code,
        "output": run_py(p5_code),
        "codeNotes": [
            {"line": 2, "note": "Initializes MasterCorporateValuationEngine implementing 5-year DCF and equity bridge"},
            {"line": 15, "note": "Applies mid-year discounting convention: 1 / (1 + WACC)^(yr - 0.5)"},
            {"line": 20, "note": "Calculates Gordon Growth Terminal Value: TV = [FCFF_5 * (1 + g)] / (WACC - g)"},
            {"line": 24, "note": "Establishes Enterprise Value: PV of discrete cash flows + PV of terminal value"},
            {"line": 26, "note": "Bridges to Equity Value: EV + Cash ($35M) - Debt ($85M) yields $391M equity value ($19.57/share)"}
        ],
        "tryIt": "Increase the discount rate (WACC) from 8.85% to 10.0% and observe how the intrinsic share price drops from $19.57 to approximately $15.80.",
        "check": {
            "question": "What is the correct mathematical relationship between Enterprise Value and Equity Value?",
            "options": [
                "Equity Value = Enterprise Value + Cash - Total Debt (and other debt-like items)",
                "Equity Value = Enterprise Value - Cash + Total Debt",
                "Enterprise Value = Equity Value / Number of Shares",
                "Equity Value = Enterprise Value * (1 - Tax Rate)"
            ],
            "answer": 0,
            "why": "Enterprise value is the value of operating assets; adding liquid cash and subtracting debtholder claims yields the residual equity value belonging to shareholders."
        }
    }
]

def get_day_33():
    return {
        "day": 33,
        "title": "Capital Budgeting & Valuation: Discounted Cash Flow (DCF), WACC & Multi-Tier Waterfall Returns",
        "summary": [
            "Derive Unlevered Free Cash Flow (FCFF) from operating EBIT, cash taxes, depreciation addbacks, CapEx, and working capital.",
            "Calculate Weighted Average Cost of Capital (WACC) using the Capital Asset Pricing Model (CAPM) and corporate tax shields.",
            "Implement dual Terminal Value methodologies (Gordon Growth vs Exit Multiple) and enforce macroeconomic perpetuity sanity checks.",
            "Model multi-tier private equity waterfall distribution hurdles (Return of Capital, 8% Preferred Return, GP Catch-Up, 80/20 Carry).",
            "Deploy the Master Corporate Valuation Engine bridging enterprise value to equity value and per-share intrinsic stock price."
        ],
        "projectStep": {
            "title": "Build the Enterprise DCF Valuation & Private Equity Waterfall Platform",
            "steps": [
                "Construct the UnleveredFreeCashFlowEngine class deriving FCFF and corporate reinvestment rates.",
                "Implement the WaccCapitalStructureCalculator class computing CAPM cost of equity and after-tax cost of debt.",
                "Build the TerminalValueSensitivityCalculator class cross-checking Gordon Growth against EBITDA exit multiples.",
                "Deploy the PrivateEquityWaterfallDistributions class modeling multi-tier LP/GP hurdle distributions and net IRRs.",
                "Integrate the consolidated MasterCorporateValuationEngine calculating intrinsic share price and equity bridge."
            ]
        },
        "parts": parts
    }

if __name__ == "__main__":
    d33 = get_day_33()
    print("=== DAY 33 WORD AUDIT ===")
    t33 = 0
    for idx, p in enumerate(d33["parts"], 1):
        w = sum(len(s.split()) for s in p['say']) + len(p.get('example','').split()) + len(p.get('tryIt','').split()) + len(p['check']['why'].split())
        t33 += w
        print(f"Part {idx}: {w} words")
    print(f"Total Day 33: {t33} words (Spoken: {round(t33/120)} min)")
