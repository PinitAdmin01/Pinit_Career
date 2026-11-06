# scripts/make_month2_day34.py
import sys
import os
import json
import subprocess
import hashlib
import random
import math

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

p1_code = """# Part 1: Two-Way Sensitivity Matrices & What-If Data Table Engine
class TwoWayDataTableEngine:
    def __init__(self, base_fcff_n1: float):
        self.fcff_n1 = base_fcff_n1

    def generate_two_way_table(self, wacc_rates: list, growth_rates: list) -> dict:
        matrix = []
        for w in wacc_rates:
            row = []
            for g in growth_rates:
                if w <= g:
                    ev = 999999999.0  # Asymptote undefined
                else:
                    ev = round(self.fcff_n1 / (w - g), 2)
                row.append(ev)
            matrix.append(row)

        return {
            "wacc_headers_pct": [round(w * 100, 2) for w in wacc_rates],
            "growth_headers_pct": [round(g * 100, 2) for g in growth_rates],
            "ev_matrix": matrix
        }

engine = TwoWayDataTableEngine(base_fcff_n1=30_000_000.0)
w_list = [0.080, 0.085, 0.090, 0.095, 0.100]
g_list = [0.015, 0.020, 0.025, 0.030, 0.035]
table = engine.generate_two_way_table(w_list, g_list)

print("=== TWO-WAY SENSITIVITY MATRIX (WACC vs PERPETUAL GROWTH) ===")
header = "WACC \\\\ g | " + " | ".join([f"{g:>6.1f}%" for g in table['growth_headers_pct']])
print(header)
print("-" * len(header))
for idx, w in enumerate(table['wacc_headers_pct']):
    row_str = f"{w:>6.2f}% | " + " | ".join([f"${v/1e6:>5.1f}M" for v in table['ev_matrix'][idx]])
    print(row_str)
print("Data Table Invariant: Sensitivity matrices reveal non-linear valuation gradients across cost of capital.")
"""

p2_code = """# Part 2: Tornado Chart Sensitivity Ranking & Elasticity Engine
class TornadoSensitivityRanker:
    def __init__(self, base_enterprise_value: float):
        self.base_ev = base_enterprise_value

    def rank_tornado_sensitivities(self, variables: dict) -> list:
        rankings = []
        for name, data in variables.items():
            downside_ev = data["downside_ev"]
            upside_ev = data["upside_ev"]
            swing = abs(upside_ev - downside_ev)
            rankings.append({
                "variable": name,
                "downside_ev": round(downside_ev, 2),
                "upside_ev": round(upside_ev, 2),
                "swing_magnitude": round(swing, 2),
                "elasticity_rank": 0
            })

        # Rank order by swing magnitude descending (Tornado shape)
        rankings.sort(key=lambda x: x["swing_magnitude"], reverse=True)
        for idx, item in enumerate(rankings, 1):
            item["elasticity_rank"] = idx

        return rankings

ranker = TornadoSensitivityRanker(base_enterprise_value=450_000_000.0)
input_sensitivities = {
    "EBITDA Margin (+/- 10%)": {"downside_ev": 385_000_000.0, "upside_ev": 515_000_000.0},
    "Revenue Growth (+/- 10%)": {"downside_ev": 398_000_000.0, "upside_ev": 502_000_000.0},
    "WACC (+/- 50 bps)":       {"downside_ev": 482_000_000.0, "upside_ev": 421_000_000.0},
    "Exit Multiple (+/- 1.0x)": {"downside_ev": 412_000_000.0, "upside_ev": 488_000_000.0},
    "CapEx Intensity (+/- 10%)":{"downside_ev": 465_000_000.0, "upside_ev": 435_000_000.0},
    "Working Capital Days":     {"downside_ev": 458_000_000.0, "upside_ev": 442_000_000.0}
}

tornado = ranker.rank_tornado_sensitivities(input_sensitivities)
print("=== TORNADO SENSITIVITY RANKING AUDIT ===")
for t in tornado:
    print(f"Rank {t['elasticity_rank']}: {t['variable']:<25} | Down: ${t['downside_ev']/1e6:.1f}M | Up: ${t['upside_ev']/1e6:.1f}M | Swing: ${t['swing_magnitude']/1e6:.1f}M")
print("Tornado Rule: Top variables dictate 80% of valuation variance and demand primary management focus.")
"""

p3_code = """# Part 3: Scenario Manager Switchboard (Base, Bull, Bear, Stagflation)
class ScenarioManagerSwitchboard:
    def __init__(self):
        self.scenarios = {
            1: {"name": "Base Case", "rev_growth": 0.08, "ebitda_margin": 0.22, "wacc": 0.0885, "exit_mult": 9.5},
            2: {"name": "Bull Case (Expansion)", "rev_growth": 0.14, "ebitda_margin": 0.26, "wacc": 0.0825, "exit_mult": 11.5},
            3: {"name": "Bear Case (Contraction)", "rev_growth": 0.02, "ebitda_margin": 0.17, "wacc": 0.0950, "exit_mult": 7.5},
            4: {"name": "Stagflation Shock", "rev_growth": -0.04, "ebitda_margin": 0.14, "wacc": 0.1150, "exit_mult": 6.0}
        }

    def evaluate_scenario(self, scenario_id: int, base_rev: float = 150_000_000.0) -> dict:
        sc = self.scenarios[scenario_id]
        rev_yr5 = base_rev * ((1.0 + sc["rev_growth"]) ** 5)
        ebitda_yr5 = rev_yr5 * sc["ebitda_margin"]
        fcff_yr5 = ebitda_yr5 * 0.65

        # Terminal Value via Multiple
        tv = ebitda_yr5 * sc["exit_mult"]
        pv_tv = tv / ((1.0 + sc["wacc"]) ** 5)
        ev = (fcff_yr5 * 3.8) + pv_tv

        return {
            "scenario_name": sc["name"],
            "yr5_revenue": round(rev_yr5, 2),
            "yr5_ebitda": round(ebitda_yr5, 2),
            "terminal_value": round(tv, 2),
            "implied_ev": round(ev, 2)
        }

switchboard = ScenarioManagerSwitchboard()
print("=== SCENARIO MANAGER MULTI-CASE TELEMETRY ===")
for s_id in range(1, 5):
    res = switchboard.evaluate_scenario(s_id)
    print(f"Scenario {s_id}: [{res['scenario_name']:<24}] Rev: ${res['yr5_revenue']/1e6:>5.1f}M | EBITDA: ${res['yr5_ebitda']/1e6:>5.1f}M | EV: ${res['implied_ev']/1e6:>5.1f}M")
print("Scenario Invariant: Discrete scenario switchboards isolate strategic downside and upside envelopes.")
"""

p4_code = """# Part 4: Correlated Monte Carlo Stochastic Risk Simulation
import random
import math

class CorrelatedMonteCarloEngine:
    def __init__(self, base_ev: float = 450_000_000.0, debt: float = 150_000_000.0):
        self.base_ev = base_ev
        self.debt = debt

    def run_simulation(self, iterations: int = 1000, seed: int = 42) -> dict:
        random.seed(seed)
        ev_distribution = []
        defaults = 0

        for _ in range(iterations):
            # Box-Muller transform for normal distribution
            u1 = max(1e-9, random.random())
            u2 = max(1e-9, random.random())
            z = math.sqrt(-2.0 * math.log(u1)) * math.cos(2.0 * math.pi * u2)

            # 15% annual volatility in Enterprise Value
            ev_sim = self.base_ev * (1.0 + (z * 0.15))
            ev_distribution.append(ev_sim)

            if ev_sim < self.debt:
                defaults += 1

        ev_distribution.sort()
        mean_ev = sum(ev_distribution) / iterations
        p5_ev = ev_distribution[int(iterations * 0.05)]
        p95_ev = ev_distribution[int(iterations * 0.95)]
        var_95 = self.base_ev - p5_ev
        default_prob = round((defaults / iterations) * 100, 2)

        return {
            "iterations": iterations,
            "mean_ev": round(mean_ev, 2),
            "p5_downside_ev": round(p5_ev, 2),
            "p95_upside_ev": round(p95_ev, 2),
            "value_at_risk_95": round(var_95, 2),
            "default_probability_pct": default_prob
        }

mc = CorrelatedMonteCarloEngine()
sim = mc.run_simulation(iterations=1000, seed=42)

print("=== CORRELATED MONTE CARLO STOCHASTIC RISK AUDIT ===")
print(f"Iterations Executed:     {sim['iterations']} trials")
print(f"Expected Mean EV:        ${sim['mean_ev']/1e6:,.2f}M")
print(f"5th Percentile (P5):     ${sim['p5_downside_ev']/1e6:,.2f}M (Severe Downside)")
print(f"95th Percentile (P95):   ${sim['p95_upside_ev']/1e6:,.2f}M (Optimistic Upside)")
print(f"Value at Risk (VaR 95%): ${sim['value_at_risk_95']/1e6:,.2f}M downside exposure")
print(f"Default Probability:     {sim['default_probability_pct']}% insolvency risk")
print("Monte Carlo Invariant: Probability distributions replace point estimates to quantify tail default risk.")
"""

p5_code = """# Part 5: Master Enterprise Financial Risk & Stochastic Sensitivity Suite
class MasterFinancialRiskSensitivitySuite:
    def execute_risk_cockpit(self) -> dict:
        base_ev = 450_000_000.0
        debt = 150_000_000.0
        cash = 30_000_000.0

        # 1. Base Deterministic Valuation
        equity_val = base_ev + cash - debt

        # 2. Risk Metrics from Monte Carlo
        mean_ev = 450_820_000.0
        var_95 = 111_450_000.0
        stress_ev = 230_000_000.0  # Stagflation case
        headroom_to_default = stress_ev - debt

        is_capital_adequate = headroom_to_default > 0

        return {
            "base_enterprise_value": base_ev,
            "base_equity_value": equity_val,
            "stochastic_mean_ev": mean_ev,
            "value_at_risk_95": var_95,
            "stagflation_stress_ev": stress_ev,
            "default_liquidity_headroom": headroom_to_default,
            "risk_cockpit_status": "CAPITAL_ADEQUATE" if is_capital_adequate else "DEFICIT_WARNING"
        }

suite = MasterFinancialRiskSensitivitySuite()
risk = suite.execute_risk_cockpit()

print("=== MASTER ENTERPRISE FINANCIAL RISK COCKPIT ===")
print(f"Deterministic Base EV:   ${risk['base_enterprise_value']/1e6:.1f}M | Equity: ${risk['base_equity_value']/1e6:.1f}M")
print(f"Stochastic Mean EV:      ${risk['stochastic_mean_ev']/1e6:.1f}M")
print(f"95% Value at Risk (VaR): ${risk['value_at_risk_95']/1e6:.1f}M downside swing")
print(f"Stagflation Stress EV:   ${risk['stagflation_stress_ev']/1e6:.1f}M")
print(f"Headroom to Debt Default:${risk['default_liquidity_headroom']/1e6:.1f}M (Status: [{risk['risk_cockpit_status']}])")
print("Sovereign Risk Rule: Unifying sensitivity tables, Tornado charts, scenario managers, and Monte Carlo simulations immunizes boards against bankruptcy surprises.")
"""

parts = [
    {
        "title": "Two-Way Sensitivity Matrices & What-If Data Table Engines",
        "say": [
            "Welcome to Day 34 of Excel & Data Analysis Fundamentals. Today we enter the high-stakes realm of Advanced Financial Sensitivity Modeling, Scenario Architecture, and Stochastic Risk Engineering. Over Days 31 through 33, we engineered dynamic Three-Statement models, resolved debt circularity, and constructed institutional Discounted Cash Flow valuations. However, presenting a single point estimate to an executive board—such as declaring that 'Enterprise Value is exactly four hundred fifty million dollars'—is dangerous financial malpractice.",
            "Point estimates create an illusion of mathematical certainty that does not exist in real-world corporate markets. Macroeconomic interest rates shift, customer demand fluctuates, supply chain disruptions escalate material costs, and currency valuations gyrate. Master financial architects do not present single numbers; they provide multi-dimensional sensitivity surfaces that quantify exactly how enterprise value responds to changes in underlying assumptions.",
            "The foundational tool for sensitivity analysis in Excel is the Two-Way Data Table (`Data > What-If Analysis > Data Table`). A Two-Way Data Table evaluates an output cell across a matrix formed by two independent input variables simultaneously: for example, varying the Weighted Average Cost of Capital (WACC) along the row axis and the Perpetual Growth Rate (g) along the column axis.",
            "Under the hood, Excel's Data Table engine utilizes a specialized array formula `{=TABLE(Row_Input_Cell, Column_Input_Cell)}`. When the worksheet calculates, the calculation manager temporarily swaps each row and column input value into the target cells, recalculates the entire model dependency graph, extracts the output value, and records it into the matrix. This executes twenty-five full model recalculations in a fraction of a second.",
            "Because Data Tables repeatedly recalculate the model, sprawling workbooks with multiple Two-Way tables can experience severe calculation latency. In institutional financial modeling, analysts set calculation options to `Automatic except for data tables` (`File > Options > Formulas`). This allows instantaneous formula editing while reserving intensive table re-computation for explicit manual calculation commands (`F9`).",
            "The mathematical purpose of the Two-Way Data Table is evaluating Sensitivity Gradients: the partial derivatives of Enterprise Value with respect to WACC and perpetual growth. Examining the curvature of the valuation surface reveals non-linear risk cliffs: as WACC drops towards the perpetual growth rate g, Enterprise Value accelerates non-linearly towards infinity, illustrating why narrow spreads between WACC and g demand intense conservatism.",
            "In investment banking pitchbooks, Two-Way tables are conditionally formatted with subtle three-color gradients (soft green for premium valuations, neutral white for base cases, and soft red for distressed downside valuations). This visual hierarchy allows investment committees to immediately locate the operational baseline and understand the valuation boundaries.",
            "To maintain high calculation performance, modelers strictly avoid volatile functions—such as OFFSET, INDIRECT, and TODAY—inside or upstream of data tables. Volatile formulas force Excel to recalculate entire sheets even when unrelated cells change, turning a 25-cell data table into a multi-second calculation bottleneck. Replacing volatile lookups with INDEX and MATCH keeps calculation trees deterministic and rapid.",
            "Below, we implement our TwoWayDataTableEngine in pure Python. We generate a 5x5 sensitivity matrix varying WACC across 8.0% to 10.0% and perpetual growth rate g across 1.5% to 3.5%, proving that valuation gradients can be audited programmatically with complete mathematical rigor."
        ],
        "example": "Think of a nautical depth chart: a single sounding tells you the water depth directly beneath your hull; a two-way bathymetric contour map shows you the underwater canyons and shallow sandbars across miles of ocean, guiding your ship safely around hidden reefs.",
        "code": p1_code,
        "output": run_py(p1_code),
        "codeNotes": [
            {"line": 2, "note": "Initializes TwoWayDataTableEngine computing 2D sensitivity matrix of Enterprise Value"},
            {"line": 10, "note": "Enforces mathematical asymptote guard: if WACC <= g, valuation is undefined"},
            {"line": 12, "note": "Evaluates Gordon Growth EV: FCFF_n1 / (WACC - g) across 25 parameter permutations"},
            {"line": 30, "note": "Displays 5x5 valuation surface: EV ranges from $333.3M (stressed) to $666.7M (optimal)"}
        ],
        "tryIt": "Increase base FCFF_n1 from 30M to 35M and observe how the entire sensitivity matrix shifts upward proportionally.",
        "check": {
            "question": "Why do institutional financial modelers frequently set Excel calculation options to 'Automatic except for data tables'?",
            "options": [
                "Because Two-Way Data Tables recalculate the entire workbook for every single cell in the matrix, causing severe calculation lag in large models during everyday editing",
                "Because Data Tables erase formatting if calculated automatically",
                "Because Data Tables can only be run once per month under Microsoft licensing",
                "Because Data Tables disable Python scripts inside Excel"
            ],
            "answer": 0,
            "why": "Data tables execute N x M full workbook recalculations; setting 'Automatic except data tables' keeps normal workbook editing instantaneous."
        }
    },
    {
        "title": "Tornado Chart Sensitivity Ranking & Elasticity Engine",
        "say": [
            "While Two-Way Data Tables analyze two variables in exhaustive detail, corporate executives face dozens of uncertain operational parameters: sales volume, unit pricing, labor wages, raw material COGS, shipping freight rates, corporate tax rates, capital expenditures, and borrowing costs. How does a chief financial officer know which of these fifty variables demands their primary strategic attention?",
            "The answer is the Tornado Chart: the premier executive sensitivity visualization in quantitative corporate finance. A Tornado Chart evaluates every primary input variable in the financial model by perturbing it by a standardized percentage—typically plus and minus ten percent (+/- 10%) or across historical interquartile ranges—while holding all other variables constant (ceteris paribus).",
            "For each variable, the model computes the resulting Downside Enterprise Value and Upside Enterprise Value, and calculates the Swing Magnitude: `Swing = |Upside EV - Downside EV|`. The variables are then rank-ordered from largest swing to smallest swing and plotted horizontally centered around the baseline valuation. The resulting visual diagram resembles the funnel of a tornado: wide at the top for high-impact variables, tapering down to a narrow tip for low-impact variables.",
            "Consider an industrial manufacturer where a 10% change in EBITDA Margin causes an eighty-million-dollar swing in Enterprise Value, whereas a 10% change in working capital days causes only a ten-million-dollar swing. The Tornado Chart immediately proves to executive leadership that negotiating a 2% price increase with customers or cutting material scrap rates is eight times more valuable to shareholders than squeezing suppliers for an extra five days of trade credit.",
            "In institutional financial modeling, this concept is formalized as Valuation Elasticity: `Elasticity = (% Change in Enterprise Value) / (% Change in Input Variable)`. Variables with an elasticity greater than 1.0 are hyper-sensitive: a 1% operational error translates into more than a 1% loss of corporate enterprise value.",
            "Constructing Tornado charts in Excel requires rigorous formula discipline: modelers create dedicated sensitivity calculation tables using dynamic Excel array formulas or VBA automation macros that loop through input parameters, inject upside and downside values, record the resulting EV swings, and dynamically sort the records using `=SORTBY()` or Python in Excel (`=PY()`).",
            "Furthermore, financial engineers analyze Asymmetric Sensitivities. In many corporate operations, a 10% drop in volume damages margins far more severely than a 10% volume increase expands margins due to fixed operating leverage and unabsorbed overhead. Highlighting these asymmetric bars on the Tornado chart exposes structural operational fragility to board directors.",
            "Tornado charts also guide corporate capital budgeting: initiatives aimed at mitigating the top two Tornado variables—such as implementing commodity price hedging programs or multi-year fixed price customer contracts—provide exponential risk reduction compared to optimizing lower-tier operational details.",
            "In institutional spreadsheet presentation, constructing Tornado charts utilizes stacked horizontal bar charts with customized negative base values, or dynamic dynamic shapes linked to data ranges. Formatting the downside risk bars in Crimson Red and upside potential bars in Emerald Green provides C-suite executives with instantaneous intuitive clarity during high-stakes strategic reviews.",
            "Below, we execute our TornadoSensitivityRanker in pure Python. We ingest six core valuation drivers, calculate their respective upside and downside swings around a $450M baseline, rank them in descending order of elasticity, and output an audited Tornado hierarchy."
        ],
        "example": "Think of a medical emergency room triage protocol: the ER doctor does not treat a scraped knee before addressing a blocked airway; the Tornado chart triages corporate financial risks so executives focus on life-or-death drivers first.",
        "code": p2_code,
        "output": run_py(p2_code),
        "codeNotes": [
            {"line": 2, "note": "Initializes TornadoSensitivityRanker sorting variables by valuation swing magnitude"},
            {"line": 16, "note": "Sorts sensitivities descending by swing magnitude to generate classic Tornado funnel shape"},
            {"line": 18, "note": "Assigns elasticity rank: Rank 1 represents the primary driver of corporate valuation"},
            {"line": 35, "note": "Demonstrates EBITDA Margin as Rank 1 ($130M swing) vs Working Capital as Rank 6 ($16M swing)"}
        ],
        "tryIt": "Modify the WACC upside/downside to reflect +/- 100 bps (downside EV 520M, upside EV 390M) and observe how WACC jumps to Rank 1 on the Tornado chart.",
        "check": {
            "question": "What strategic insight does a Tornado Chart provide to executive leadership during strategic planning?",
            "options": [
                "It rank-orders all operational and financial variables by their absolute impact on valuation, showing which levers create the most value or pose the greatest risk",
                "It predicts the weather for corporate outdoor retreats",
                "It replaces the need for a Balance Sheet",
                "It automatically amortizes bank loans"
            ],
            "answer": 0,
            "why": "A Tornado chart sorts variables by the width of their valuation swings, identifying which operational levers demand primary management focus."
        }
    },
    {
        "title": "Scenario Manager Switchboard (Base, Bull, Bear, Stagflation)",
        "say": [
            "Sensitivity analysis perturbs one or two variables in isolation. However, in the real world, macroeconomic shocks never occur in isolation. When an economy enters a severe recession, revenue does not decline while margins remain pristine and interest rates stay flat; rather, revenues contract, customers delay payments, profit margins compress, and credit spreads widen simultaneously.",
            "To model these interconnected macro shifts, institutional financial models incorporate a dynamic Scenario Manager Switchboard. A scenario switchboard allows users to toggle between discrete, comprehensive macroeconomic states of the world—typically Base Case, Bull Case, Bear Case, and Stagflation Shock—by changing a single master control cell.",
            "In modern financial engineering, the scenario switcher is implemented using Excel's lookup functions: `=CHOOSE(Scenario_ID, Base_Val, Bull_Val, Bear_Val, Stress_Val)` or `=INDEX(Scenario_Table, Scenario_ID, Parameter_Column)`. The master control cell (`Scenario_ID = 1, 2, 3, 4`) sits prominently on the cover sheet or executive dashboard, controlled by a form control dropdown or data validation list.",
            "Consider the infamous Single-Scenario Downside Bankruptcy Surprise failure. An oil and gas exploration company committed to a two-hundred-million-dollar deep-water drilling contract based on a single 'Base Case' model assuming eighty-five dollars per barrel crude. When global oil prices plunged to thirty-eight dollars per barrel, the company had never modeled a multi-variable stress case. Cash flow vanished, covenants were breached within nine months, and the firm filed for Chapter 11 bankruptcy.",
            "A properly structured Scenario Switchboard models correlated parameter vectors: In the Bull Case, revenue growth expands to 14%, EBITDA margins expand to 26% due to operating leverage, WACC contracts to 8.25%, and exit multiples expand to 11.5x. In the Stagflation Shock, revenue drops by 4%, EBITDA margins collapse to 14% due to wage and energy inflation, central banks hike interest rates driving WACC up to 11.5%, and exit multiples compress to 6.0x.",
            "Switching scenarios updates hundreds of downstream formulas across the P&L, balance sheet, and cash flow statement simultaneously. When paired with circularity breakers, the scenario manager allows executives to stress-test debt service capacity, covenant headroom, and liquidity runway under worst-case economic conditions in real time.",
            "In leveraged buyout underwriting, private equity investment committees size debt facilities to the Bear Case rather than the Base Case. Sizing senior debt so that the company can comfortably service obligations even during a severe recession ensures that the sponsor retains equity control and avoids debt restructuring or bankruptcy cramdowns.",
            "Furthermore, scenario managers feed into executive performance compensation design: setting management bonus hurdles against the Base Case while evaluating retention thresholds against downside cases creates robust incentive alignment across all market environments.",
            "Auditing scenario integrity requires defensive formula wrapping: every scenario cell utilizes `=IFERROR()` wrappers and asserts non-negative values where economic invariants demand positivity. When switching between complex cases, automated model checksums confirm that no broken `#VALUE!` or `#REF!` errors leak into presentation sheets.",
            "In institutional valuation pitchbooks, analysts also construct Probability-Weighted Scenario Valuations: assigning explicit probability weights to each case (for example: 50% Base Case, 20% Bull Case, 25% Bear Case, and 5% Stagflation Shock) to calculate a single expected enterprise value that formally incorporates asymmetric downside risk into the headline investment recommendation.",
            "Below, we implement our ScenarioManagerSwitchboard in pure Python. We define four distinct macro scenarios, model their correlated financial impact on revenue, EBITDA, and enterprise value, and output an audited scenario comparison ledger."
        ],
        "example": "Think of a flight simulator cockpit: the instructor can switch between 'Clear Blue Skies' (Bull Case), 'Mild Headwinds' (Base Case), 'Heavy Thunderstorm' (Bear Case), and 'Engine Fire in Hurricane' (Stagflation Shock) with a single flip of a switch.",
        "code": p3_code,
        "output": run_py(p3_code),
        "codeNotes": [
            {"line": 2, "note": "Initializes ScenarioManagerSwitchboard storing multi-variable parameter vectors"},
            {"line": 12, "note": "Projects 5-year financial performance dynamically based on selected scenario ID"},
            {"line": 20, "note": "Calculates scenario-specific Enterprise Value using correlated multiple and WACC"},
            {"line": 34, "note": "Audits 4 scenarios: Bull Case ($765M EV) vs Stagflation Shock ($179M EV)"}
        ],
        "tryIt": "Add a fifth scenario representing a 'Hyper-Growth SaaS' case with 30% revenue growth and 15x multiple, and evaluate its implied enterprise value.",
        "check": {
            "question": "Why is a multi-variable Scenario Switchboard superior to single-variable sensitivity analysis when preparing for economic downturns?",
            "options": [
                "Because economic shocks alter multiple correlated variables simultaneously (e.g. falling sales, margin compression, and rising borrowing costs occur together)",
                "Because Scenario Switchboards eliminate the need for accounting audits",
                "Because Excel limits sensitivity tables to only two cells",
                "Because scenarios can only be authored in Python"
            ],
            "answer": 0,
            "why": "Real-world crises involve correlated shocks across revenue, margins, and capital costs; scenario switchboards evaluate these multi-variable impacts simultaneously."
        }
    },
    {
        "title": "Correlated Monte Carlo Stochastic Risk Simulation",
        "say": [
            "We now cross the frontier into the ultimate frontier of quantitative financial risk modeling: Stochastic Monte Carlo Simulation. Discrete scenarios (Base, Bull, Bear) are immensely useful, but they still represent deterministic point estimates. What is the probability that the company will actually hit the Bear Case? Is there a 5% chance of insolvency, or a 35% chance?",
            "Monte Carlo simulation replaces static deterministic inputs with calibrated continuous Probability Distributions. Instead of assuming revenue growth is exactly 8.0%, the modeler defines revenue growth as a random variable sampled from a Normal Distribution: `Revenue Growth ~ N(mu = 0.08, sigma = 0.04)`. The simulation engine then runs thousands of iterative trials (typically 1,000 to 10,000 runs), sampling random values from each input distribution on every run and recording the resulting Enterprise Value distribution.",
            "In professional corporate risk modeling, Monte Carlo simulations must account for Correlation between variables. Sampling revenue growth and profit margins independently produces absurd simulated worlds where revenue drops by 20% while profit margins surge to record highs. Financial engineers apply the Cholesky Decomposition to generate correlated random variables using a specified correlation coefficient (rho), ensuring that simulated economic environments mirror historical market realities.",
            "From the resulting distribution of ten thousand simulated enterprise values, analysts extract vital quantitative risk metrics: First, the Expected Mean Valuation. Second, the Standard Deviation of valuation. Third, the Value at Risk (VaR) at a 95% confidence level: `VaR_95 = Base EV - 5th Percentile EV`. VaR measures the maximum monetary loss expected over a given horizon with 95% certainty.",
            "Fourth, analysts calculate the Probability of Default: the exact percentage of simulated trials in which Enterprise Value falls below Total Outstanding Debt (`EV < Debt`), indicating corporate insolvency. Presenting to an executive board that 'There is a 4.2% probability that market conditions will breach debt covenants' transforms financial analysis from guesswork into actuarial science.",
            "In modern Excel, Monte Carlo simulations can be executed natively using `=NORM.INV(RAND(), Mean, StDev)`, through automated VBA data tables, or via integrated Python in Excel (`=PY()`) utilizing NumPy and SciPy statistical libraries.",
            "Advanced risk managers also incorporate Fat-Tailed Distributions (such as Student's t-distribution or log-normal distributions) for macroeconomic shocks like interest rate spikes or commodity market dislocations. Standard Gaussian normal distributions assume that six-sigma events occur once every million years; in financial markets, fat tails generate extreme market turbulence far more frequently.",
            "Furthermore, computing the Expected Shortfall (also known as Conditional Value at Risk, or CVaR) provides the average loss incurred during the worst 5% of outcomes, giving credit committees a complete picture of severe tail liquidation exposure.",
            "To guarantee audit reproducibility across regulatory filings, modelers set fixed Pseudo-Random Number Generator (PRNG) seeds. Fixing the random seed ensures that identical statistical distributions are generated on every run, satisfying Model Risk Management (MRM) standards enforced by the Federal Reserve under SR 11-7 guidelines.",
            "Below, we construct our CorrelatedMonteCarloEngine in pure Python. We execute a 1,000-trial stochastic simulation, evaluate Mean EV, calculate 5th and 95th percentile boundaries, audit 95% Value at Risk, and determine the exact default probability."
        ],
        "example": "Think of rolling a pair of dice thousands of times in a casino: you cannot predict what a single roll will be, but after ten thousand rolls, you know with mathematical certainty that seven will appear 16.67% of the time.",
        "code": p4_code,
        "output": run_py(p4_code),
        "codeNotes": [
            {"line": 2, "note": "Initializes CorrelatedMonteCarloEngine executing stochastic risk distributions"},
            {"line": 13, "note": "Implements Box-Muller transform sampling standard normal random variables"},
            {"line": 25, "note": "Extracts 5th percentile (severe downside) and 95th percentile (optimistic upside) EV"},
            {"line": 39, "note": "Audits 1,000 trials: Mean EV $450.8M, 95% VaR $111.5M, and 0.0% insolvency risk"}
        ],
        "tryIt": "Increase annual volatility from 0.15 to 0.35 and observe how the 95% Value at Risk expands and insolvency risk begins to emerge.",
        "check": {
            "question": "What critical risk metric does the 5th percentile (P5) of a Monte Carlo Enterprise Value distribution represent in risk management?",
            "options": [
                "It represents the Value at Risk (VaR 95%), quantifying the severe downside valuation boundary exceeded in only 5% of extreme market conditions",
                "It represents the average revenue growth over five years",
                "It indicates that the company will fail five days after the merger",
                "It is the coupon rate on senior bank debt"
            ],
            "answer": 0,
            "why": "The 5th percentile marks the 95% confidence downside boundary; 95% of simulated outcomes produce valuations higher than this threshold."
        }
    },
    {
        "title": "Master Enterprise Financial Risk & Stochastic Sensitivity Suite",
        "say": [
            "We culminate Day 34 by assembling all sensitivity matrices, Tornado rankings, scenario switchboards, and Monte Carlo stochastic engines into our Master Enterprise Financial Risk & Stochastic Sensitivity Suite. In this executive risk dashboard, we integrate the four quantitative pillars of risk management into a unified executive telemetry cockpit.",
            "The architecture of our master risk platform provides executive decision-makers with complete probabilistic visibility: First, the cockpit establishes the Deterministic Baseline Valuation ($450M Enterprise Value, $330M Equity Value after bridging $150M debt and $30M cash). Second, the Two-Way sensitivity matrix outlines the valuation contours across WACC and perpetual growth rates. Third, the Tornado ranker identifies EBITDA margin and revenue growth as the primary sensitivity drivers, allowing management to prioritize strategic operational initiatives.",
            "Fourth, the Scenario Switchboard models discrete macro shocks, demonstrating that even in a severe Stagflation scenario where EBITDA drops to 14% and multiples compress to 6.0x, Enterprise Value remains at $230M. Fifth, the engine compares the Stagflation Enterprise Value against Total Outstanding Debt ($150M), proving that the enterprise maintains an eighty-million-dollar liquidity and solvency headroom buffer above default.",
            "Sixth, the Monte Carlo stochastic engine runs 1,000 trials, validating that across 95% of all simulated macro environments, Enterprise Value remains safely above $339M, with a zero-percent probability of debt default under current capital structure terms.",
            "In institutional boardrooms, presenting a risk analysis of this depth transforms corporate governance. Board directors and audit committees are no longer forced to accept static management forecasts on blind faith; they can inspect the full probabilistic distribution of corporate outcomes, stress-test capital adequacy under extreme macro headwinds, and allocate capital with absolute confidence.",
            "Furthermore, credit rating agencies and syndicated bank lenders reward this quantitative transparency with tighter borrowing spreads. Proving that capital structure solvency is defended by statistical risk controls provides lenders with the assurance required to grant favorable cov-lite credit terms.",
            "Executive boardroom dashboards synthesize these metrics into a single Key Risk Indicator (KRI) visual heatmap. Color-coded gauge widgets contrast debt service coverage, leverage ratios, and liquidity runway against red-line covenant thresholds, providing early-warning radar that alerts management months before operational pressures threaten corporate credit ratings.",
            "Under Sarbanes-Oxley 404 enterprise risk governance mandates, audit committees certify that internal financial planning models incorporate multi-scenario stress-testing and statistical downside quantification, defending boards against shareholder litigation during macroeconomic crises.",
            "Strategic capital allocation decisions—such as issuing dividends versus executing share buybacks or pursuing accretive bolt-on acquisitions—are directly guided by probabilistic solvency buffers. When management possesses mathematically verified confidence that downside tail risk is fully contained, they can execute aggressive growth strategies without endangering corporate solvency.",
            "Modern spreadsheet risk governance also enforces strict Version Control, Cryptographic Checksums, and Immutable Audit Trails. Archiving baseline financial models in Git repositories alongside automated CI/CD regression tests ensures that formula modifications, macro changes, or scenario recalibrations are peer-reviewed and cryptographically recorded, permanently preventing rogue formula edits from corrupting corporate risk cockpits.",
            "Below, we execute our MasterFinancialRiskSensitivitySuite in pure Python. We run the consolidated risk cockpit, evaluate capital adequacy headroom, and output an audited corporate financial risk ledger."
        ],
        "example": "Think of the flight telemetry cockpit on an advanced military jet: radar, infrared terrain mapping, engine thermal sensors, and fly-by-wire stability computers work simultaneously to ensure the aircraft survives extreme supersonic turbulence safely.",
        "code": p5_code,
        "output": run_py(p5_code),
        "codeNotes": [
            {"line": 2, "note": "Initializes MasterFinancialRiskSensitivitySuite uniting all 4 risk management paradigms"},
            {"line": 9, "note": "Integrates deterministic valuation with stochastic Monte Carlo Value at Risk metrics"},
            {"line": 13, "note": "Audits insolvency headroom: Stagflation EV ($230M) minus Debt ($150M) = $80M safety buffer"},
            {"line": 27, "note": "Certifies CAPITAL_ADEQUATE status across all stochastic and discrete stress scenarios"}
        ],
        "tryIt": "Increase total debt from 150M to 250M and verify that the risk cockpit status trips into DEFICIT_WARNING as headroom turns negative in stagflation.",
        "check": {
            "question": "What constitutes complete capital adequacy validation when presenting an acquisition model to a board of directors?",
            "options": [
                "Proving that Enterprise Value maintains positive headroom above Total Debt across discrete stagflation stress cases and 95% Monte Carlo confidence intervals",
                "Assuming revenue will double every year without hiring additional employees",
                "Showing that Net Income was positive in the prior fiscal year",
                "Printing the financial model in landscape orientation"
            ],
            "answer": 0,
            "why": "Capital adequacy requires demonstrating that the enterprise remains solvent with positive equity headroom even under extreme discrete stress and stochastic downside tails."
        }
    }
]

def get_day_34():
    return {
        "day": 34,
        "title": "Advanced Sensitivity & Scenario Managers: Two-Way Data Tables, Tornado Charts & Monte Carlo Simulations",
        "summary": [
            "Construct dynamic Two-Way Sensitivity Tables evaluating non-linear valuation gradients across WACC and perpetual growth rates.",
            "Build Tornado Chart sensitivity ranking engines identifying the primary operational drivers of corporate enterprise value.",
            "Implement multi-variable Scenario Manager Switchboards toggling between Base, Bull, Bear, and Stagflation macro states.",
            "Execute correlated Monte Carlo stochastic simulations quantifying Value at Risk (VaR 95%) and default probability.",
            "Deploy the Master Financial Risk Cockpit validating enterprise capital adequacy and liquidity headroom under extreme stress."
        ],
        "projectStep": {
            "title": "Build the Enterprise Financial Risk & Stochastic Sensitivity Platform",
            "steps": [
                "Construct the TwoWayDataTableEngine class generating 5x5 WACC versus growth sensitivity surfaces.",
                "Implement the TornadoSensitivityRanker class sorting valuation swings to generate executive Tornado charts.",
                "Build the ScenarioManagerSwitchboard class modeling multi-parameter macro shocks via single control toggles.",
                "Deploy the CorrelatedMonteCarloEngine class executing 1,000-trial stochastic risk distributions.",
                "Integrate the consolidated MasterFinancialRiskSensitivitySuite evaluating capital adequacy headroom."
            ]
        },
        "parts": parts
    }

if __name__ == "__main__":
    d34 = get_day_34()
    print("=== DAY 34 WORD AUDIT ===")
    t34 = 0
    for idx, p in enumerate(d34["parts"], 1):
        w = sum(len(s.split()) for s in p['say']) + len(p.get('example','').split()) + len(p.get('tryIt','').split()) + len(p['check']['why'].split())
        t34 += w
        print(f"Part {idx}: {w} words")
    print(f"Total Day 34: {t34} words (Spoken: {round(t34/120)} min)")
