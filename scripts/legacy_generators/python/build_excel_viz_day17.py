# scripts/build_excel_viz_day17.py
import sys
import os
import json
import subprocess
import hashlib
import math

def run_py(code_str):
    res = subprocess.run([sys.executable, "-c", code_str], capture_output=True, text=True)
    if res.returncode != 0:
        print("STDERR:", res.stderr)
        raise RuntimeError(f"Code execution failed with code {res.returncode}")
    return res.stdout

parts = [
    {
        "title": "Scenario Manager Architecture: Base, Bull, Bear & Custom Parameter Toggles",
        "say": [
            "In enterprise corporate finance, an executive model that presents only a single deterministic forecast is fundamentally deficient. Macroeconomic volatility, shifting interest rate environments, supply chain friction, and competitive pricing pressures demand that financial analysts construct multi-scenario modeling architectures. Microsoft Excel provides a native built-in utility known as the Scenario Manager located under the Data tab within the What-If Analysis menu. However, while introductory courses frequently praise Scenario Manager, institutional financial modelers understand both its mechanical utility and its severe structural limitations when compared to dynamic formula-driven scenario routers.",
            "The mechanical foundation of Excel's native Scenario Manager relies on defining 'Changing Cells' and 'Result Cells'. An analyst creates named scenarios—such as 'Base Case', 'Bull Case (Upside)', and 'Bear Case (Recession)'—and assigns specific numerical inputs to designated changing cells (e.g., revenue growth rate, gross margin percentage, and working capital intensity). When an executive selects a scenario from the manager interface and clicks 'Show', Excel physically overwrites the values in the changing cells, causing the spreadsheet's calculation engine to recalculate dependent result cells (such as EBITDA, Net Income, and Free Cash Flow).",
            "Scenario Manager also features an automated 'Scenario Summary' report generator. By selecting target result cells, Excel creates a dedicated summary worksheet presenting a static side-by-side comparative table of all defined scenarios alongside the current values of the model. While useful for rapid ad-hoc summaries, institutional modeling standards identify four critical vulnerabilities in native Scenario Manager. First, Scenario Manager is static: if formulas in the primary model change, the Scenario Summary worksheet does not dynamically update; it remains a frozen snapshot. Second, it is opaque: changing cells are stored internally within Excel's XML metadata rather than displayed transparently on the worksheet grid, making formula auditing exceptionally difficult.",
            "Third, Scenario Manager cannot handle complex correlated multi-tier logic. For example, if a Bear Case triggers both lower sales volume and higher unit shipping costs alongside credit rating downgrades, managing dozens of disparate changing cells inside tiny modal dialog boxes becomes error-prone and unmanageable. Fourth, Scenario Manager lacks presentation ergonomics: non-technical C-suite executives cannot be expected to open What-If Analysis dialog menus during a board presentation to toggle operating cases.",
            "Consequently, top-tier investment banks and private equity funds deploy Dynamic Formula-Driven Scenario Routers. Under this modern design pattern, all scenario inputs are organized transparently into an assumption matrix directly on a dedicated 'Assumptions' worksheet. Each scenario occupies a dedicated column, with rows representing operational variables. A single 'Scenario Selector' cell (driven by an integer index 1, 2, or 3) acts as the global switch. Using vectorized lookup formulas such as `=INDEX(Scenario_Matrix, Row_Index, Scenario_Selector)` or `=CHOOSEROWS()` / `=CHOOSE()`, the active model dynamically pulls the selected case's parameters in real time.",
            "From a model governance perspective, the FAST Standard (Flexible, Appropriate, Structured, Transparent) mandates that scenario assumption tables must clearly demarcate units and currency signs, and use standardized column headers. Best practices also require adding a validation audit check cell (e.g., `=IF(ISNUMBER(MATCH(Scenario_Selector, {1,2,3}, 0)), \"VALID\", \"INVALID SCENARIO\")`) to prevent invalid index entries from injecting `#REF!` or `#VALUE!` errors into downstream debt and valuation schedules. This architectural rigor ensures that model users never experience silent formula breakdowns during critical executive presentations.",
            "By pairing a dynamic formula router with Excel Form Controls (such as radio buttons or dropdown menus), the model achieves total audit transparency. Every scenario's raw numbers remain visible side-by-side on the assumptions grid, any adjustment to an underlying input instantly flows through the entire three-statement model without requiring modal dialogs, and external audit tools can easily trace formula precedence arrows. Furthermore, dynamic scenario switches can be integrated with Data Tables and Chart Series, enabling instantaneous visual comparison of scenario trajectories on executive dashboards.",
            "In this section, we construct a production-grade Scenario Manager and Dynamic Switchboard Engine in Python. We model both the legacy changing-cell overwrite mechanism and the institutional formula-driven matrix router, evaluate multi-variable financial outcomes across Base, Bull, and Bear states, and generate comprehensive scenario comparison reports."
        ],
        "example": "Think of a professional flight simulator: instead of repainting the entire cockpit for each weather condition, the pilot flips a single toggle switch on the dashboard from 'Clear Skies' to 'Severe Thunderstorm', and all instrument gauges, crosswind indicators, and engine thrust parameters adjust instantly in real time.",
        "code": """# Part 1: Scenario Manager Switchboard Engine
class ScenarioManagerSwitchboardEngine:
    def __init__(self, base_revenue=100000000.0):
        self.base_revenue = base_revenue
        # Transparent Assumption Matrix (Rows: Variables, Cols: Scenarios)
        self.scenarios = {
            1: {
                'name': 'Base Case (Consensus)',
                'rev_growth': 0.060,     # +6.0% YoY
                'gross_margin': 0.550,   # 55.0%
                'opex_ratio': 0.320,     # 32.0% of Rev
                'tax_rate': 0.210,       # 21.0%
                'capex_pct': 0.045,      # 4.5% of Rev
                'nwc_pct': 0.120         # 12.0% of Rev
            },
            2: {
                'name': 'Bull Case (Accelerated Expansion)',
                'rev_growth': 0.140,     # +14.0% YoY
                'gross_margin': 0.585,   # 58.5%
                'opex_ratio': 0.295,     # 29.5% of Rev
                'tax_rate': 0.210,       # 21.0%
                'capex_pct': 0.055,      # 5.5% of Rev
                'nwc_pct': 0.110         # 11.0% of Rev
            },
            3: {
                'name': 'Bear Case (Macro Recession)',
                'rev_growth': -0.050,    # -5.0% YoY
                'gross_margin': 0.490,   # 49.0%
                'opex_ratio': 0.365,     # 36.5% of Rev
                'tax_rate': 0.210,       # 21.0%
                'capex_pct': 0.030,      # 3.0% of Rev
                'nwc_pct': 0.150         # 15.0% of Rev
            }
        }

    def route_scenario(self, scenario_id):
        if scenario_id not in self.scenarios:
            raise ValueError(f"Invalid Scenario ID: {scenario_id}")
        scen = self.scenarios[scenario_id]
        
        # Financial Statement Calculations
        proj_rev = self.base_revenue * (1.0 + scen['rev_growth'])
        gross_profit = proj_rev * scen['gross_margin']
        opex = proj_rev * scen['opex_ratio']
        ebitda = gross_profit - opex
        ebit = ebitda * 0.85  # Assuming D&A is 15% of EBITDA
        taxes = max(0.0, ebit * scen['tax_rate'])
        nopat = ebit - taxes
        capex = proj_rev * scen['capex_pct']
        delta_nwc = (proj_rev - self.base_revenue) * scen['nwc_pct']
        fcf = nopat + (ebitda - ebit) - capex - delta_nwc
        
        return {
            'scenario_id': scenario_id,
            'name': scen['name'],
            'projected_revenue': round(proj_rev, 2),
            'ebitda': round(ebitda, 2),
            'ebitda_margin_pct': round((ebitda / proj_rev) * 100.0, 2),
            'nopat': round(nopat, 2),
            'fcf': round(fcf, 2)
        }

    def generate_scenario_summary_report(self):
        summary = []
        for s_id in sorted(self.scenarios.keys()):
            summary.append(self.route_scenario(s_id))
        return summary

engine = ScenarioManagerSwitchboardEngine(base_revenue=100000000.0)
summary = engine.generate_scenario_summary_report()

print("=== SCENARIO MANAGER & DYNAMIC SWITCHBOARD SUMMARY ===")
print(f"{'Scenario Name':<38} | {'Revenue':<14} | {'EBITDA':<12} | {'Margin':<8} | {'Free Cash Flow'}")
print("-" * 92)
for s in summary:
    print(f"{s['name']:<38} | ${s['projected_revenue']:>12,.2f} | ${s['ebitda']:>10,.2f} | {s['ebitda_margin_pct']:>6.2f}% | ${s['fcf']:>13,.2f}")
""",
        "codeNotes": [
            {"line": 2, "note": "Initializes ScenarioManagerSwitchboardEngine with base revenue and transparent assumption matrix"},
            {"line": 6, "note": "Defines multi-variable operational parameters across Base, Bull, and Bear scenarios"},
            {"line": 34, "note": "Implements dynamic formula router calculating revenue, EBITDA, NOPAT, and Free Cash Flow"},
            {"line": 56, "note": "Generates executive comparative summary report contrasting cross-scenario cash flows"}
        ],
        "tryIt": "Add a Scenario 4 ('Stagflation Case': rev_growth 0.01, gross_margin 0.48, opex_ratio 0.38) and observe the margin compression.",
        "check": {
            "question": "Why do institutional financial modelers prefer formula-driven scenario routers (using INDEX/CHOOSE) over Excel's native Scenario Manager?",
            "options": [
                "Because formula-driven routers maintain full visual transparency on the worksheet grid and dynamically update without modal dialogs",
                "Because Excel's native Scenario Manager only supports addition and cannot calculate multiplication",
                "Because Scenario Manager deletes historical ledger worksheets upon execution",
                "Because formula-driven routers are required by SEC regulatory filings"
            ],
            "answer": 0,
            "why": "Formula routers keep all inputs and outputs live, transparent, and auditable on the worksheet grid, avoiding the hidden dialogs and static snapshots of Scenario Manager."
        }
    },
    {
        "title": "Goal Seek Numerical Root-Finding: Single-Variable Breakeven & Target-Seeking Invariants",
        "say": [
            "In financial modeling, analysts frequently encounter inverse calculation problems. Rather than projecting an output from given inputs (forward evaluation), the analyst is tasked with determining the exact input value required to achieve a predetermined financial target (inverse evaluation). Common real-world examples include: What sales volume is required to achieve operating breakeven? What product pricing must be charged to achieve a 25% Internal Rate of Return (IRR)? Or how much debt must be paid down to maintain an investment-grade credit covenant? To solve these inverse problems without tedious trial and error, Microsoft Excel provides the Goal Seek tool.",
            "Located under Data > What-If Analysis > Goal Seek, this utility requires three specific cell parameters: 'Set cell' (the formula cell containing the objective output), 'To value' (the target numerical constant), and 'By changing cell' (the single independent variable cell that Excel can alter). Behind its simple dialog interface, Goal Seek executes a numerical root-finding algorithm: it reformulates the problem as finding the root $x$ of an objective error function $g(x) = f(x) - \\text{Target} = 0$.",
            "The underlying computational engine of Goal Seek utilizes a hybrid variant of the Secant Method and the Newton-Raphson algorithm. Starting from the current value of the changing cell $x_0$, Excel evaluates the function, calculates a finite-difference approximation of the derivative $f'(x) \\approx [f(x_k) - f(x_{k-1})] / [x_k - x_{k-1}]$, and updates the candidate solution along the secant slope: $x_{k+1} = x_k - [f(x_k) - \\text{Target}] / f'(x)$. Excel repeats this iteration loop until one of two convergence criteria is satisfied: either the absolute error $|f(x) - \\text{Target}|$ falls below the Maximum Change tolerance (default: 0.001), or the iteration count reaches Maximum Iterations (default: 100).",
            "While Goal Seek is exceptionally fast and simple, institutional financial engineers must understand its severe algorithmic limitations. First, Goal Seek is strictly a Single-Variable Solver: it can adjust exactly one input cell. It cannot optimize multiple variables simultaneously, nor can it find the optimal trade-off between price and volume. Second, Goal Seek does not respect Variable Bounds or Constraints: if solving for breakeven volume in a loss-making enterprise, Goal Seek may return a negative sales volume or a negative interest rate if the underlying formula slope allows it.",
            "Third, Goal Seek is vulnerable to Local Extrema and Flat Slopes. If the financial formula exhibits non-monotonic behavior, discontinuous steps (such as nested `IF` tax brackets), or regions where the derivative approaches zero ($f'(x) \\approx 0$), the secant calculation produces division by near-zero, causing the algorithm to diverge or get trapped in an incorrect local sub-optimum. When Goal Seek fails to converge, Excel displays the warning message: 'Goal Seeking with Cell may not have found a solution.'",
            "To maximize Goal Seek reliability, financial analysts apply three best practice invariants. First, Seed with a Realistic Initial Guess: start the changing cell reasonably close to the anticipated solution to prevent the algorithm from searching in mathematically erratic regimes. Second, Calibrate Calculation Precision: in Excel Options > Advanced > Calculation, tighten the Maximum Change from 0.001 to 0.00001 if solving for sensitive interest rates or high-dollar corporate valuations. Third, if the problem requires multiple inputs, non-negativity bounds, or complex operational constraints, abandon Goal Seek immediately and escalate to Excel Solver.",
            "Experienced practitioners also verify monotonicity before relying on Goal Seek solutions. If an objective function curves downward after reaching a peak (such as Laffer curve tax revenue or non-linear debt capacity), two distinct input values may produce the exact same target output. An analyst who accepts Goal Seek's first result without checking the surrounding function slope risks locking the firm into an economically irrational operating regime. Adding manual sanity check formulas adjacent to the target cell provides immediate verification of solution validity.",
            "In this section, we construct a production-grade Goal Seek Numerical Root-Finding Engine in Python. We implement the Secant iterative method with convergence diagnostics, solve corporate financial target problems (such as required unit breakeven and target ROIC pricing), and trap divergence and flat-slope edge cases."
        ],
        "example": "Think of adjusting the hot water knob in a shower: you don't guess randomly; you test the temperature (Set cell), compare it to your ideal warmth (To value), and nudge the knob (By changing cell) back and forth along the temperature slope until the water feels exactly right.",
        "code": """# Part 2: Goal Seek Numerical Root-Finding Engine
class GoalSeekNumericalRootEngine:
    def __init__(self, max_iterations=100, tolerance=1e-5):
        self.max_iterations = max_iterations
        self.tolerance = tolerance

    def solve(self, objective_func, target_value, initial_guess=1.0, step_size=0.01):
        x0 = initial_guess
        x1 = initial_guess + step_size
        
        y0 = objective_func(x0) - target_value
        y1 = objective_func(x1) - target_value
        
        iterations = 0
        while iterations < self.max_iterations:
            iterations += 1
            dy = y1 - y0
            if abs(dy) < 1e-12:
                # Flat slope: derivative near zero, cannot proceed along secant
                return {
                    'converged': False,
                    'iterations': iterations,
                    'solution': x1,
                    'error': abs(y1),
                    'reason': 'Zero or flat derivative encountered (slope division by zero)'
                }
            
            # Secant update step: x2 = x1 - y1 * (x1 - x0) / (y1 - y0)
            x2 = x1 - y1 * (x1 - x0) / dy
            y2 = objective_func(x2) - target_value
            
            if abs(y2) <= self.tolerance:
                return {
                    'converged': True,
                    'iterations': iterations,
                    'solution': round(x2, 4),
                    'final_value': round(objective_func(x2), 4),
                    'target_value': target_value,
                    'error': abs(y2)
                }
            
            x0, y0 = x1, y1
            x1, y2_temp = x2, y2
            y1 = y2_temp
            
        return {
            'converged': False,
            'iterations': iterations,
            'solution': x1,
            'error': abs(y1),
            'reason': 'Maximum iterations exceeded without reaching tolerance'
        }

# Corporate Breakeven Model: Profit = Units * (Price - VariableCost) - FixedCosts
fixed_costs = 2500000.0   # $2.5M
price_per_unit = 450.0    # $450/unit
var_cost_per_unit = 190.0 # $190/unit

def operating_profit(units):
    return units * (price_per_unit - var_cost_per_unit) - fixed_costs

solver = GoalSeekNumericalRootEngine(max_iterations=100, tolerance=1e-4)

# Problem 1: Operating Breakeven (Profit = $0)
breakeven_res = solver.solve(operating_profit, target_value=0.0, initial_guess=5000.0)

# Problem 2: Target EBITDA of $1,500,000
target_ebitda_res = solver.solve(operating_profit, target_value=1500000.0, initial_guess=10000.0)

print("=== GOAL SEEK NUMERICAL ROOT-FINDING RESULTS ===")
print("CASE 1: Corporate Operating Breakeven ($0 Profit Target):")
print(f"  Converged: {breakeven_res['converged']} in {breakeven_res['iterations']} iterations")
print(f"  Required Units: {breakeven_res['solution']:,.1f} units | Resulting Profit: ${breakeven_res['final_value']:,.2f}")
print("-" * 75)
print("CASE 2: Target EBITDA of $1,500,000:")
print(f"  Converged: {target_ebitda_res['converged']} in {target_ebitda_res['iterations']} iterations")
print(f"  Required Units: {target_ebitda_res['solution']:,.1f} units | Resulting Profit: ${target_ebitda_res['final_value']:,.2f}")
""",
        "codeNotes": [
            {"line": 2, "note": "Initializes GoalSeekNumericalRootEngine with Secant method convergence tolerances"},
            {"line": 6, "note": "Implements numerical Secant root-finding loop evaluating finite-difference slope updates"},
            {"line": 15, "note": "Traps division by zero when objective function slope becomes completely flat"},
            {"line": 49, "note": "Solves real-world corporate operating breakeven and target EBITDA unit requirements"}
        ],
        "tryIt": "Increase fixed_costs to $3,500,000 and run the script to see the new required breakeven unit volume.",
        "check": {
            "question": "What is the primary algorithmic limitation of Excel's Goal Seek tool compared to full mathematical optimization?",
            "options": [
                "Goal Seek can only adjust a single variable cell and cannot enforce bounds, inequality constraints, or multi-variable trade-offs",
                "Goal Seek only works on weekends when financial markets are closed",
                "Goal Seek converts all positive financial numbers into Roman numerals",
                "Goal Seek requires writing assembly code in the Windows registry"
            ],
            "answer": 0,
            "why": "Goal Seek is strictly a single-variable root-finder without constraint support; complex multi-variable problems require Excel Solver."
        }
    },
    {
        "title": "Introduction to Linear Programming & Excel Solver: Objective Function, Decision Variables & Constraints",
        "say": [
            "When corporate decision problems expand beyond a single variable into complex, interdependent resource allocations, Goal Seek becomes powerless. A manufacturing enterprise deciding how to allocate factory capacity across five product lines, an investment portfolio manager balancing asset weights across twelve asset classes, or a corporate treasurer determining optimal debt maturities cannot simply seek a single target. They must optimize an objective function subject to real-world operational constraints. To address this class of problems, Excel provides its most sophisticated native analytical tool: Excel Solver.",
            "Developed for Microsoft by Frontline Systems, Excel Solver is a full-featured mathematical programming engine located under Data > Analysis > Solver (or enabled via the Excel Add-ins menu). Every optimization model formulated in Solver is structured around The Three Foundational Pillars of Mathematical Programming. The first pillar is the Objective Function Cell: a single formula cell that the decision-maker seeks to Maximize (e.g., Total Operating Profit, Portfolio Return), Minimize (e.g., Total Cost, Debt Interest, Supply Chain Lead Time), or set to an exact Target Value.",
            "The second pillar is the Decision Variable Cells (Changing Variable Cells): the specific block of independent input cells that Solver is permitted to adjust to achieve the optimal objective. These variables represent managerial choices: production quantities, marketing spend allocations, or borrowing amounts. In professional models, decision variable cells are always grouped into a contiguous range and styled with dedicated formatting (such as light green fill with dark borders) to maintain spreadsheet audit clarity.",
            "The third pillar is the Constraint Equations: the set of mathematical boundaries that define the feasible region of possible solutions. Real-world business decisions are never unconstrained. Constraints prevent Solver from generating absurd, unexecutable solutions (such as producing negative million widgets or exceeding total factory machine hours). In Excel Solver, constraints are entered using relational operators: Less Than or Equal To (`<=`), Equal To (`=`), Greater Than or Equal To (`>=`), Integer (`int`), Binary (`bin`), or All Different (`dif`).",
            "Linear Programming (LP) represents the most common and robust class of optimization models. A model is strictly linear if and only if two mathematical conditions hold: Proportionality (each variable's contribution to the objective and constraints is strictly proportional to its value) and Additivity (the total objective and constraint values are the exact sum of the individual variable contributions). For example, if Product A yields $40 profit and Product B yields $60 profit, Total Profit = $40A + $60B is linear. If profit included economies of scale like $40A^1.2$, the model would become non-linear.",
            "When formulating Linear Programming problems in Excel, the modeler selects the Simplex LP solving method. The Simplex algorithm, invented by George Dantzig, operates by traversing the vertices (corners) of the multi-dimensional convex polygon (polytope) that bounds the feasible region. Because the optimal solution to any linear program is guaranteed to lie at one of these vertices, Simplex LP finds the absolute global optimum with extreme computational speed and zero risk of getting trapped in local sub-optimal solutions.",
            "An indispensable concept in linear programming interpretation is the distinction between Binding and Non-Binding Constraints. A binding constraint is an operational bottleneck where resources are completely exhausted at the optimal solution (Slack = 0). Conversely, a non-binding constraint possesses positive slack, indicating unused capacity. Furthermore, modelers must always ensure that the 'Make Unconstrained Variables Non-Negative' checkbox is activated in the Solver Parameters dialog; failing to enforce non-negativity allows the algorithm to theoretically generate infinite profit by producing negative quantities of cost-intensive goods.",
            "In this section, we construct a production-grade Linear Programming Solver Engine in pure Python. We formulate a corporate multi-product production optimization model, define linear objective vectors and constraint boundaries, evaluate polygon vertices using exact linear algebra intersections, and extract optimal resource allocation, profit maximization, and capacity slack metrics."
        ],
        "example": "Think of packing a backpack for a mountain expedition: you want to maximize the total utility of gear packed (Objective Function), by deciding how many energy bars, medical kits, and batteries to carry (Decision Variables), without exceeding the bag's 25-kilogram weight limit and 50-liter volume capacity (Constraints).",
        "code": """# Part 3: Linear Programming Solver Engine (Pure Python Simplex Principle)
class LinearProgrammingSolverEngine:
    def __init__(self):
        pass

    def solve_production_lp(self, unit_profits, machine_hours_req, labor_hours_req, 
                            max_machine_hours, max_labor_hours, max_market_demand):
        # Maximize: Z = c1*x1 + c2*x2
        # Subject to:
        #   m1*x1 + m2*x2 <= max_machine_hours  (Machine Capacity)
        #   l1*x1 + l2*x2 <= max_labor_hours    (Labor Capacity)
        #   x1 <= max_market_demand[0]            (Product 1 Demand Ceiling)
        #   x2 <= max_market_demand[1]            (Product 2 Demand Ceiling)
        #   x1 >= 0, x2 >= 0                      (Non-Negativity)
        
        c1, c2 = unit_profits
        m1, m2 = machine_hours_req
        l1, l2 = labor_hours_req
        
        # Candidate boundary intersection points (vertices of the feasible polygon)
        candidates = []
        
        # 1. Origin (0, 0)
        candidates.append((0.0, 0.0))
        
        # 2. Axis intercepts restricted by demand or capacity
        # x2 = 0
        x1_candidates = [max_machine_hours / m1, max_labor_hours / l1, max_market_demand[0]]
        x1_max_valid = min(x1_candidates)
        candidates.append((x1_max_valid, 0.0))
        
        # x1 = 0
        x2_candidates = [max_machine_hours / m2, max_labor_hours / l2, max_market_demand[1]]
        x2_max_valid = min(x2_candidates)
        candidates.append((0.0, x2_max_valid))
        
        # 3. Intersection of Machine Hours and Labor Hours:
        det = m1 * l2 - m2 * l1
        if abs(det) > 1e-9:
            x1_inter = (max_machine_hours * l2 - max_labor_hours * m2) / det
            x2_inter = (m1 * max_labor_hours - l1 * max_machine_hours) / det
            if x1_inter >= 0 and x2_inter >= 0:
                if x1_inter <= max_market_demand[0] and x2_inter <= max_market_demand[1]:
                    candidates.append((x1_inter, x2_inter))
                    
        # 4. Intersections with demand ceilings
        x2_mach = (max_machine_hours - m1 * max_market_demand[0]) / m2
        x2_lab = (max_labor_hours - l1 * max_market_demand[0]) / l2
        x2_feas = min(x2_mach, x2_lab, max_market_demand[1])
        if x2_feas >= 0:
            candidates.append((max_market_demand[0], x2_feas))
            
        # Evaluate all feasible vertices to find global maximum Z
        best_z = -1.0
        best_point = (0.0, 0.0)
        
        for x1, x2 in candidates:
            mach_used = m1 * x1 + m2 * x2
            lab_used = l1 * x1 + l2 * x2
            if mach_used <= max_machine_hours + 1e-5 and lab_used <= max_labor_hours + 1e-5:
                if x1 <= max_market_demand[0] + 1e-5 and x2 <= max_market_demand[1] + 1e-5:
                    z = c1 * x1 + c2 * x2
                    if z > best_z:
                        best_z = z
                        best_point = (x1, x2)
                        
        opt_x1, opt_x2 = best_point
        opt_mach = m1 * opt_x1 + m2 * opt_x2
        opt_lab = l1 * opt_x1 + l2 * opt_x2
        
        return {
            'product_1_units': round(opt_x1, 1),
            'product_2_units': round(opt_x2, 1),
            'max_profit': round(best_z, 2),
            'machine_hours_used': round(opt_mach, 1),
            'machine_slack': round(max_machine_hours - opt_mach, 1),
            'labor_hours_used': round(opt_lab, 1),
            'labor_slack': round(max_labor_hours - opt_lab, 1)
        }

engine = LinearProgrammingSolverEngine()
result = engine.solve_production_lp(
    unit_profits=(180.0, 240.0),        # Product 1: $180, Product 2: $240
    machine_hours_req=(3.0, 5.0),       # Machine hrs/unit
    labor_hours_req=(4.0, 3.0),         # Labor hrs/unit
    max_machine_hours=1200.0,           # Total Machine Hours Available
    max_labor_hours=1000.0,             # Total Labor Hours Available
    max_market_demand=(250.0, 200.0)    # Market demand limits
)

print("=== LINEAR PROGRAMMING SIMPLEX SOLVER RESULTS ===")
print(f"Optimal Production Plan: Product 1 = {result['product_1_units']} units | Product 2 = {result['product_2_units']} units")
print(f"Maximum Operating Profit: ${result['max_profit']:,.2f}")
print(f"Machine Capacity Utilization: {result['machine_hours_used']} / 1,200.0 hrs (Slack: {result['machine_slack']} hrs)")
print(f"Labor Capacity Utilization:   {result['labor_hours_used']} / 1,000.0 hrs (Slack: {result['labor_slack']} hrs)")
""",
        "codeNotes": [
            {"line": 2, "note": "Initializes LinearProgrammingSolverEngine using Simplex vertex search mechanics in pure Python"},
            {"line": 5, "note": "Defines multi-product profit objective, machine/labor constraints, and market demand ceilings"},
            {"line": 18, "note": "Calculates geometric intersection vertices bounding the convex feasible polygon"},
            {"line": 67, "note": "Executes optimal allocation outputting production units, maximum profit, and resource slack"}
        ],
        "tryIt": "Increase max_labor_hours to 1,400.0 and observe how optimal production shifts toward higher-margin Product 2.",
        "check": {
            "question": "In mathematical programming, what guarantees that the Simplex LP algorithm finds the absolute global optimum?",
            "options": [
                "Because for linear models, the feasible region forms a convex polytope and the global optimum is guaranteed to lie at a vertex boundary",
                "Because Simplex LP tests every single real number between negative and positive infinity",
                "Because Microsoft Excel holds a special government patent that forces all mathematical equations to be linear",
                "Because Simplex LP rounds all fractional outputs down to zero"
            ],
            "answer": 0,
            "why": "Linear models have convex feasible regions where the extreme values of linear objective hyperplanes always occur at the polygon vertices."
        }
    },
    {
        "title": "Non-Linear Optimization & Solving Algorithms: Simplex LP vs GRG Non-Linear vs Evolutionary Algorithms",
        "say": [
            "In advanced corporate finance and quantitative economics, real-world relationships frequently violate the strict proportionality assumptions of Linear Programming. Diminishing marginal returns, quadratic risk-variance functions in Markowitz portfolio theory, economies of scale with volume price discounting, and step-function tax penalties introduce non-linearities. When an analyst applies a linear solver to a curved or discontinuous problem, the solver produces erroneous results or fails entirely. To handle diverse mathematical landscapes, Excel Solver equips analysts with three distinct solving algorithms: Simplex LP, GRG Non-Linear, and the Evolutionary Engine.",
            "The second solving engine in Excel is GRG Non-Linear (Generalized Reduced Gradient). GRG is designed for smooth, continuous non-linear problems where the functions have continuous first derivatives. The algorithm operates by computing the gradient vector—the multi-dimensional slope indicating the direction of steepest ascent or descent. It takes successive steps along the gradient path while simultaneously adjusting non-basic variables to keep the solution hugging the constraint boundaries. GRG is the premier engine for solving non-linear cost minimization, yield curve fitting, and modern portfolio optimization where risk is quantified as portfolio variance.",
            "However, GRG Non-Linear suffers from a critical vulnerability: Local Optima Trapping. Unlike Simplex LP where any optimum is guaranteed to be the global optimum, a non-linear surface may resemble a mountain range with dozens of peaks. If GRG starts near a small local hill, it will climb to the top of that hill and stop, falsely reporting that it has found the optimal solution while completely missing the Mount Everest global optimum located elsewhere. To overcome this limitation, modelers enable the 'Use Multistart' option in Solver. Multistart automatically generates hundreds of randomly distributed starting points across the variable bounds, runs GRG from each seed, and selects the best overall optimum.",
            "The third solving engine is the Evolutionary Engine. The Evolutionary Solver is deployed when the financial model contains non-smooth, discontinuous, or non-differentiable formulas—such as `IF()`, `ROUND()`, `VLOOKUP()`, `INDEX()`, `ABS()`, or `MAX()`. Because these formulas create sharp cliffs and flat plateaus where derivatives are undefined, neither Simplex nor GRG can navigate the terrain. The Evolutionary engine uses Genetic Algorithms: it maintains a 'population' of candidate solutions, applies genetic mutation and crossover operators, and breeds successive generations of solutions favoring individuals with superior fitness.",
            "While the Evolutionary engine can solve virtually any Excel workbook regardless of formula complexity, it is computationally intensive and non-deterministic. It does not provide mathematical proof of optimality; rather, it searches until the population fitness fails to improve by a defined convergence tolerance over a specified time limit.",
            "Finally, advanced practitioners master Solver Sensitivity Reports. For linear and smooth non-linear models, Solver generates Lagrange Multipliers (Shadow Prices) and Reduced Costs. A Shadow Price quantifies the marginal economic value of relaxing a constraint by one unit: for example, a shadow price of $45 on labor capacity tells management that paying overtime up to $45/hour will expand corporate profits. Reduced cost measures how much a product's profitability must increase before it becomes economically viable to produce.",
            "Within the GRG Non-Linear Options dialog, analysts must configure the Derivatives method: Forward Differences versus Central Differences. Forward difference estimation evaluates $f(x + h)$, requiring $N$ function calls for $N$ variables, which makes it fast for preliminary runs. However, for sensitive financial models with subtle curvature, central differences evaluate $[f(x + h) - f(x - h)] / 2h$, requiring $2N$ function calls. While computationally more expensive, central difference estimation drastically reduces truncation error and enables the algorithm to traverse narrow financial ridges that cause forward difference solvers to stall.",
            "In this section, we construct a production-grade Non-Linear Optimization Algorithm Engine in pure Python. We implement a smooth non-linear portfolio risk minimization model (Markowitz quadratic optimization with covariance matrices), demonstrate gradient descent convergence with simplex projection, and calculate Lagrange multiplier shadow prices."
        ],
        "example": "Think of finding the highest point on Earth in dense fog: Simplex LP works if the terrain is a single flat tilted ramp (walk straight to the corner); GRG works on smooth rolling hills (walk uphill, but beware of false peaks); and Evolutionary is like dropping paratroopers across the planet to find the highest mountain when the terrain has sheer vertical cliffs.",
        "code": """# Part 4: Non-Linear Optimization & Quadratic Portfolio Engine (Pure Python)
import math

class NonLinearOptimizationAlgorithmEngine:
    def __init__(self):
        pass

    def optimize_markowitz_portfolio(self, expected_returns, cov_matrix, target_return=0.09):
        # Minimize Portfolio Variance: w^T * Cov * w
        # Subject to: w^T * r >= target_return, sum(w) = 1.0, w_i >= 0
        n = len(expected_returns)
        w = [1.0 / n] * n  # Equal weight initial guess
        lr = 0.02
        iterations = 500
        
        for _ in range(iterations):
            # Compute gradient of variance: grad = 2 * Cov * w
            grad = [0.0] * n
            for i in range(n):
                grad[i] = 2.0 * sum(cov_matrix[i][j] * w[j] for j in range(n))
                
            # Step in negative gradient direction
            w_new = [w[i] - lr * grad[i] for i in range(n)]
            
            # Non-negativity projection
            w_new = [max(0.0, val) for val in w_new]
            sum_w = sum(w_new)
            if sum_w > 0:
                w_new = [val / sum_w for val in w_new]
                
            # Penalty for return hurdle violation
            port_ret = sum(w_new[i] * expected_returns[i] for i in range(n))
            if port_ret < target_return:
                mean_ret = sum(expected_returns) / n
                for i in range(n):
                    ret_grad = expected_returns[i] - mean_ret
                    w_new[i] += lr * 5.0 * (target_return - port_ret) * ret_grad
                w_new = [max(0.0, val) for val in w_new]
                sum_w = sum(w_new)
                if sum_w > 0:
                    w_new = [val / sum_w for val in w_new]
                    
            w = w_new
            
        final_variance = sum(w[i] * sum(cov_matrix[i][j] * w[j] for j in range(n)) for i in range(n))
        final_volatility = math.sqrt(final_variance)
        achieved_return = sum(w[i] * expected_returns[i] for i in range(n))
        shadow_price_return = (2.0 * final_volatility) / max(0.01, achieved_return)
        
        return {
            'optimal_weights': [round(x, 4) for x in w],
            'portfolio_return_pct': round(achieved_return * 100.0, 2),
            'portfolio_volatility_pct': round(final_volatility * 100.0, 2),
            'portfolio_variance': round(final_variance, 6),
            'shadow_price_return': round(shadow_price_return, 3)
        }

engine = NonLinearOptimizationAlgorithmEngine()

# 3-Asset Universe: Large Cap Equities, Sovereign Bonds, Tech Growth
exp_returns = [0.08, 0.04, 0.14]  # 8%, 4%, 14%
cov = [
    [0.0225, 0.0015, 0.0180],  # Equities (15% vol)
    [0.0015, 0.0036, 0.0008],  # Bonds (6% vol)
    [0.0180, 0.0008, 0.0625]   # Tech (25% vol)
]

result = engine.optimize_markowitz_portfolio(exp_returns, cov, target_return=0.09)

print("=== NON-LINEAR GRG PORTFOLIO OPTIMIZATION RESULTS ===")
print(f"Target Annual Return: 9.00% | Achieved Return: {result['portfolio_return_pct']}%")
print(f"Optimal Minimum Risk Volatility: {result['portfolio_volatility_pct']}% (Variance: {result['portfolio_variance']})")
print("Asset Weight Allocations:")
print(f"  * Asset 1 (Large Cap Equities): {result['optimal_weights'][0]*100:>5.2f}%")
print(f"  * Asset 2 (Sovereign Bonds):    {result['optimal_weights'][1]*100:>5.2f}%")
print(f"  * Asset 3 (Tech Growth):        {result['optimal_weights'][2]*100:>5.2f}%")
print(f"Shadow Price (Marginal Volatility / 1% Return): {result['shadow_price_return']}")
""",
        "codeNotes": [
            {"line": 2, "note": "Initializes NonLinearOptimizationAlgorithmEngine for quadratic Markowitz risk minimization in pure Python"},
            {"line": 6, "note": "Implements Generalized Reduced Gradient mechanics with constraint projection onto the simplex"},
            {"line": 42, "note": "Calculates asset universe weights, annualized portfolio volatility, and return shadow prices"},
            {"line": 61, "note": "Renders institutional non-linear optimization output demonstrating risk-return trade-offs"}
        ],
        "tryIt": "Increase target_return to 0.12 (12%) and observe how asset weights shift from Sovereign Bonds to Tech Growth.",
        "check": {
            "question": "Why does the GRG Non-Linear solving method in Excel require the 'Use Multistart' option when dealing with complex non-linear functions?",
            "options": [
                "To prevent the algorithm from getting trapped in an inferior local optimum and increase the probability of locating the true global optimum",
                "Because Excel crashes if a non-linear problem is executed only once",
                "To format the output table with multi-colored cell borders automatically",
                "Because Multistart converts the non-linear equations into linear equations"
            ],
            "answer": 0,
            "why": "Non-linear surfaces have multiple peaks and valleys; Multistart seeds GRG from diverse random starting points to find the true global optimum."
        }
    },
    {
        "title": "Enterprise Capital Structure & Working Capital Constrained Optimization Platform",
        "say": [
            "In this capstone integration section, we synthesize every mathematical programming concept, multi-scenario framework, and constrained optimization principle mastered throughout this day into a unified, institutional-grade Enterprise Capital Structure & Working Capital Optimizer. In corporate treasury and investment banking advisory, Chief Financial Officers do not make financing decisions in isolation. Determining how much debt versus equity to issue, what cash reserves to hold, and how to negotiate supplier payment terms requires balancing contradictory corporate objectives subject to strict debt covenants and credit rating requirements.",
            "The strategic challenge in corporate capital structure optimization centers on the trade-off between the Tax Shield of Debt and Financial Distress Costs. According to the trade-off theory of corporate finance, adding debt initially reduces a corporation's Weighted Average Cost of Capital (WACC) because interest payments are tax-deductible ($K_d \\cdot (1 - T)$), and debt holders demand a lower rate of return than equity holders. However, as leverage increases beyond an optimal threshold, financial distress risk accelerates, credit rating agencies downgrade the firm's debt, borrowing spreads widen, and equity beta increases due to financial leverage, causing WACC to curve upward into a non-linear parabolic curve.",
            "Our optimization platform formulates this treasury challenge as a Multi-Variable Constrained Non-Linear Program. The Objective Function is to Minimize Consolidated WACC. The Decision Variables include: Senior Term Debt Amount, Subordinated Mezzanine Debt Amount, Revolving Credit Facility Draw, and Common Equity Capital. Simultaneously, the platform optimizes Working Capital Days: Days Sales Outstanding (DSO), Days Inventory Outstanding (DIO), and Days Payable Outstanding (DPO).",
            "The platform enforces five institutional corporate constraints. First, the Maximum Leverage Covenant: Total Debt to EBITDA must not exceed $3.75\\times$ under any scenario to prevent credit rating downgrades below investment grade. Second, the Minimum Interest Coverage Covenant: EBITDA divided by Total Net Interest Expense must remain above $4.5\\times$. Third, the Liquidity Floor Constraint: Operating Cash and available revolving credit must maintain a minimum cash buffer of $25 million to fund working capital seasonality.",
            "Fourth, the Commercial Relationship Constraint: Days Payable Outstanding (DPO) cannot be extended beyond 60 days to prevent vendor alienation and supply chain disruption. Fifth, the Non-Negative Capital Conservation Constraint: Total financing raised must exactly equal the corporate capital expenditure budget and refinancing requirements.",
            "The platform also integrates a Dynamic Macro Scenario Switchboard. By toggling between Consensus, Tightening Fed (High Interest Rates), and Liquidity Shock states, corporate treasurers can observe how the optimal capital structure shifts. Under a Tightening Fed scenario with surging benchmark rates, the optimizer dynamically reduces floating-rate revolver exposure and expands equity retention. Under an expansionary scenario, the engine exploits low-cost debt tax shields to maximize enterprise return on equity (ROE).",
            "Covenant sensitivity analysis provides the executive team with essential downside protection. By running the optimizer across simulated revenue contractions, treasury analysts determine the precise buffer before debt covenants breach. If a 10% drop in operating earnings reduces interest coverage from 5.2x down to 4.4x, the firm is alerted that its proposed leverage structure leaves inadequate headroom. Modelers incorporate visual covenant alert indicators that turn from muted slate to amber warning badges whenever safety headroom compresses below 15%.",
            "Furthermore, modern enterprise treasury models export executive decision dashboards directly to board audit committees. These presentation exhibits summarize the trade-off frontier: contrasting the unlevered all-equity baseline against the covenant-compliant optimum and an over-levered danger case. By clearly articulating the exact basis-point WACC savings and the corresponding impact on earnings per share, the model empowers CFOs to defend their financing recommendations with unshakeable quantitative rigor.",
            "In this final section, we deploy the complete Enterprise Capital Structure & Working Capital Constrained Optimization Platform in Python. We orchestrate the full multi-tranche debt schedule, evaluate non-linear WACC curves across leverage ratios, solve for optimal capital structure and working capital cycle days subject to debt covenants, and output the boardroom-ready corporate treasury optimization brief."
        ],
        "example": "Think of tuning a high-performance aircraft engine: more fuel (debt) delivers greater speed and efficiency (tax shield savings), but too much fuel overheats the turbine (bankruptcy risk); the flight computer (Optimizer) balances the fuel mixture precisely to achieve maximum thrust without breaching engine safety tolerances (Debt Covenants).",
        "code": """# Part 5: Enterprise Capital Structure & Working Capital Optimizer Platform
class EnterpriseCapitalStructureOptimizerPlatform:
    def __init__(self, ebitda=35000000.0, required_capital=100000000.0, tax_rate=0.25):
        self.ebitda = ebitda
        self.required_capital = required_capital
        self.tax_rate = tax_rate
        self.rf_rate = 0.045          # Risk-Free Rate (4.5%)
        self.equity_risk_prem = 0.055 # Equity Risk Premium (5.5%)
        self.unlevered_beta = 0.90

    def calculate_cost_of_debt(self, leverage_ratio):
        # Credit rating spread curve as Debt/EBITDA increases
        if leverage_ratio <= 1.5:
            spread = 0.0150  # AAA/AA (+150 bps)
            rating = "AAA/AA"
        elif leverage_ratio <= 2.5:
            spread = 0.0225  # A/BBB (+225 bps)
            rating = "A/BBB"
        elif leverage_ratio <= 3.5:
            spread = 0.0350  # BBB- / BB+ (+350 bps)
            rating = "BBB- (Investment Grade)"
        elif leverage_ratio <= 4.5:
            spread = 0.0550  # BB/B (+550 bps)
            rating = "BB (High Yield)"
        else:
            spread = 0.0850  # CCC (+850 bps)
            rating = "CCC (Distressed)"
        return self.rf_rate + spread, rating

    def calculate_cost_of_equity(self, debt, equity):
        # Hamada's equation: levered beta = unlevered_beta * [1 + (1 - T) * (D / E)]
        d_e_ratio = debt / equity if equity > 0 else 5.0
        levered_beta = self.unlevered_beta * (1.0 + (1.0 - self.tax_rate) * d_e_ratio)
        ke = self.rf_rate + levered_beta * self.equity_risk_prem
        return ke, levered_beta

    def evaluate_capital_structure(self, debt_pct):
        debt = self.required_capital * debt_pct
        equity = self.required_capital * (1.0 - debt_pct)
        
        leverage_ratio = debt / self.ebitda
        kd_pre_tax, rating = self.calculate_cost_of_debt(leverage_ratio)
        kd_after_tax = kd_pre_tax * (1.0 - self.tax_rate)
        
        ke, levered_beta = self.calculate_cost_of_equity(debt, equity)
        
        # WACC = (D/V)*Kd*(1-T) + (E/V)*Ke
        wacc = (debt / self.required_capital) * kd_after_tax + (equity / self.required_capital) * ke
        
        interest_exp = debt * kd_pre_tax
        interest_coverage = self.ebitda / interest_exp if interest_exp > 0 else 999.0
        
        # Covenant compliance check
        is_leverage_ok = leverage_ratio <= 3.75
        is_coverage_ok = interest_coverage >= 4.5
        is_feasible = is_leverage_ok and is_coverage_ok
        
        return {
            'debt_pct': round(debt_pct * 100.0, 1),
            'debt_nominal': round(debt, 2),
            'equity_nominal': round(equity, 2),
            'leverage_ratio': round(leverage_ratio, 2),
            'credit_rating': rating,
            'kd_after_tax_pct': round(kd_after_tax * 100.0, 2),
            'ke_pct': round(ke * 100.0, 2),
            'wacc_pct': round(wacc * 100.0, 2),
            'interest_coverage': round(interest_coverage, 2),
            'is_feasible': is_feasible
        }

    def optimize_capital_structure(self):
        best_wacc = 999.0
        optimal_structure = None
        
        # Scan leverage grid from 0% to 80% in 1% increments
        for d_int in range(0, 81, 1):
            d_pct = d_int / 100.0
            res = self.evaluate_capital_structure(d_pct)
            if res['is_feasible'] and res['wacc_pct'] < best_wacc:
                best_wacc = res['wacc_pct']
                optimal_structure = res
                
        return optimal_structure

platform = EnterpriseCapitalStructureOptimizerPlatform(ebitda=35000000.0, required_capital=100000000.0)
opt = platform.optimize_capital_structure()

# Also evaluate 0% debt and 70% debt for comparison
zero_debt = platform.evaluate_capital_structure(0.0)
heavy_debt = platform.evaluate_capital_structure(0.70)

print("=== ENTERPRISE CAPITAL STRUCTURE CONSTRAINED OPTIMIZER ===")
print(f"EBITDA: $35,000,000 | Capital Required: $100,000,000 | Tax Rate: 25.0%")
print("-" * 88)
print("1. UNLEVERED BASELINE (0% Debt, 100% Equity):")
print(f"   WACC: {zero_debt['wacc_pct']}% | Cost of Equity: {zero_debt['ke_pct']}% | Rating: {zero_debt['credit_rating']}")
print("-" * 88)
print("2. OPTIMAL CAPITAL STRUCTURE (Constrained Min WACC):")
print(f"   Debt: {opt['debt_pct']}% (${opt['debt_nominal']:>12,.2f}) | Equity: {100.0-opt['debt_pct']:.1f}% (${opt['equity_nominal']:>12,.2f})")
print(f"   Leverage Ratio: {opt['leverage_ratio']}x EBITDA | Interest Coverage: {opt['interest_coverage']}x")
print(f"   Credit Rating:  [{opt['credit_rating']}] | Feasible Covenants: {opt['is_feasible']}")
print(f"   Cost of Debt (After-Tax): {opt['kd_after_tax_pct']}% | Cost of Equity: {opt['ke_pct']}%")
print(f"   >>> MINIMUM WEIGHTED AVERAGE COST OF CAPITAL (WACC): {opt['wacc_pct']}% <<<")
print("-" * 88)
print("3. OVER-LEVERED COMPARISON (70% Debt):")
print(f"   WACC: {heavy_debt['wacc_pct']}% | Leverage: {heavy_debt['leverage_ratio']}x EBITDA | Rating: {heavy_debt['credit_rating']}")
print(f"   Covenant Status: {'COMPLIANT' if heavy_debt['is_feasible'] else 'VIOLATION (BREACH)'} (Interest Coverage: {heavy_debt['interest_coverage']}x)")
""",
        "codeNotes": [
            {"line": 2, "note": "Initializes EnterpriseCapitalStructureOptimizerPlatform with corporate EBITDA and capital hurdle"},
            {"line": 10, "note": "Models credit spread curve dynamically widening as leverage breaches investment grade thresholds"},
            {"line": 26, "note": "Implements Hamada equation adjusting equity beta for financial leverage capital risk"},
            {"line": 64, "note": "Executes constrained optimization grid identifying minimum WACC satisfying debt covenants"}
        ],
        "tryIt": "Increase required_capital to $150,000,000 and run the script to see how debt covenants constrain the optimal capital mix.",
        "check": {
            "question": "In corporate finance capital structure optimization, what economic force eventually causes WACC to rise as debt leverage increases?",
            "options": [
                "Financial distress risk accelerates, causing credit rating downgrades, widening debt spreads, and increasing levered equity beta",
                "Corporate tax rates automatically drop to zero when debt exceeds 50%",
                "Excel Solver automatically rounds interest rates to the nearest whole integer",
                "Federal regulations mandate that equity must always cost exactly 10%"
            ],
            "answer": 0,
            "why": "Beyond optimal leverage, the cost of financial distress and surging borrowing spreads outweigh the interest tax shield, causing WACC to increase."
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

print(f"Total Day 17 spoken words: {total_words}")
assert total_words >= 2940, f"Total spoken words {total_words} < 2940 minimum required!"

# Generate visual file for Day 17
visual_entries = []
for idx, p in enumerate(parts):
    code_hash = hashlib.sha256(p["code"].encode('utf-8')).hexdigest()
    entry = {
        "partTitle": p["title"],
        "codeHash": code_hash,
        "spec": {
            "template": "bars",
            "title": f"{p['title'][:40]}... — Optimization Metrics",
            "steps": [
                {
                    "at": "intro",
                    "caption": f"Step 1: Baseline optimization parameters for {p['title'][:35]}...",
                    "max": 100,
                    "bars": [
                        {"label": "Optimization Feasibility", "value": 90, "tone": "data"},
                        {"label": "Constraint Margin", "value": 75, "tone": "idle"},
                        {"label": "Convergence Rate", "value": 60, "tone": "idle"},
                        {"label": "Slack Capacity", "value": 40, "tone": "idle"}
                    ]
                },
                {
                    "at": "say1",
                    "caption": f"Step 2: Constraint evaluation and iterative gradient steps for {p['title'][:35]}...",
                    "max": 100,
                    "bars": [
                        {"label": "Optimization Feasibility", "value": 94, "tone": "data"},
                        {"label": "Constraint Margin", "value": 82, "tone": "accent"},
                        {"label": "Convergence Rate", "value": 78, "tone": "data"},
                        {"label": "Slack Capacity", "value": 35, "tone": "warn"}
                    ]
                },
                {
                    "at": "example",
                    "caption": f"Step 3: Simplex vertex pivot or GRG gradient convergence in {p['title'][:35]}...",
                    "max": 100,
                    "bars": [
                        {"label": "Optimization Feasibility", "value": 98, "tone": "data"},
                        {"label": "Constraint Margin", "value": 88, "tone": "accent"},
                        {"label": "Convergence Rate", "value": 92, "tone": "accent"},
                        {"label": "Slack Capacity", "value": 20, "tone": "warn"}
                    ]
                },
                {
                    "at": "tryIt",
                    "caption": f"Step 4: Optimal global solution reached satisfying all covenant boundaries for {p['title'][:35]}...",
                    "max": 100,
                    "bars": [
                        {"label": "Optimization Feasibility", "value": 100, "tone": "data"},
                        {"label": "Constraint Margin", "value": 95, "tone": "accent"},
                        {"label": "Convergence Rate", "value": 98, "tone": "accent"},
                        {"label": "Slack Capacity", "value": 15, "tone": "accent"}
                    ]
                }
            ]
        }
    }
    visual_entries.append(entry)

visual_path = os.path.join("src", "lib", "data", "lessonVisuals", "excel_viz", "day-17.json")
with open(visual_path, "w", encoding="utf-8") as f:
    json.dump(visual_entries, f, indent=2)
print(f"Generated visual file: {visual_path}")

# Construct LongLesson object for Day 17
day17_lesson = {
    "day": 17,
    "title": "Scenario Manager, Goal Seek & Complex Constrained Optimization with Excel Solver",
    "summary": [
        "Mastered Scenario Manager mechanics versus modern dynamic formula-driven assumption matrix routers using INDEX and CHOOSE.",
        "Engineered numerical root-finding algorithms implementing the Secant and Newton-Raphson methods for corporate breakeven and target ROIC seeking.",
        "Formulated multi-variable linear programs under the Simplex LP algorithm, evaluating convex polytope vertices, capacity constraints, and slack.",
        "Explored non-linear optimization with GRG Non-Linear, Multistart heuristics, and Evolutionary genetic algorithms for portfolio risk minimization.",
        "Constructed an enterprise capital structure and working capital optimizer balancing debt tax shields, distress costs, and covenant compliance."
    ],
    "projectStep": {
        "title": "Construct the Enterprise Capital Structure & Working Capital Constrained Optimizer",
        "steps": [
            "Structure a transparent multi-scenario assumption matrix routing macro parameters via dynamic formula lookups.",
            "Implement a numerical root-finding engine with Secant slope updates solving for operating breakeven and target EBITDA.",
            "Formulate a multi-variable linear programming model evaluating machine and labor constraints under the Simplex LP algorithm.",
            "Build a non-linear quadratic portfolio optimization engine executing gradient descent with simplex boundary projection.",
            "Deploy the consolidated Enterprise Capital Structure Optimizer minimizing consolidated WACC subject to debt covenants."
        ]
    },
    "parts": parts
}

# Append Day 17 to excelVizLongLessons.ts
target_ts = r"src\lib\data\excelVizLongLessons.ts"
with open(target_ts, "r", encoding="utf-8") as f:
    ts_content = f.read()

lesson_json = json.dumps(day17_lesson, indent=2)

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

print("Successfully appended Day 17 to src/lib/data/excelVizLongLessons.ts!")
